import { NextResponse } from 'next/server';
import { SermonStorage, DraftStorage } from '@/lib/storage';
import { revalidatePath } from 'next/cache';
import { updateSermonIndex } from '@/lib/index-manager';

// Environment variable check
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN?.trim();
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

export const dynamic = 'force-dynamic';

async function sendTelegramMessage(chatId: number, text: string) {
    if (!BOT_TOKEN) return;
    try {
        console.log(`Sending Telegram message to ${chatId}: ${text.slice(0, 20)}...`);
        const response = await fetch(`${TELEGRAM_API}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text }),
        });
        const data = await response.json();
        if (!data.ok) {
            console.error('Telegram API Error:', data);
        }
    } catch (error) {
        console.error('Failed to send Telegram message:', error);
    }
}

function parseDate(text: string): string | null {
    // Try to find date in the first few lines (header)
    const lines = text.split('\n').slice(0, 5);

    // 1. Korean Format: "X월 Y일" or "X.Y" or "X/Y"
    const korRegex = /(\d{1,2})\s*[월./]\s*(\d{1,2})\s*[일]?/;

    // 2. ISO Format: YYYY-MM-DD
    const isoRegex = /(\d{4})-(\d{2})-(\d{2})/;

    // 3. English Format: DD-MMM-YYYY or DD MMM YYYY (e.g. 12-Feb-2026 or 12 Feb 2026)
    const engRegex = /(\d{1,2})[\s-]([a-zA-Z]{3})[\s-](\d{4})/;

    // 4. English Short Format: DD MMM (e.g. 12 Feb) -> Current Year
    const engShortRegex = /(\d{1,2})[\s-]([a-zA-Z]{3})/;

    for (const line of lines) {
        // Check ISO first (most precise)
        const isoMatch = line.match(isoRegex);
        if (isoMatch) return isoMatch[0];

        // Check English Full
        const engMatch = line.match(engRegex);
        if (engMatch) {
            const parsed = new Date(engMatch[0]);
            if (!isNaN(parsed.getTime())) {
                return parsed.toISOString().split('T')[0];
            }
        }

        // Check Korean
        const korMatch = line.match(korRegex);
        if (korMatch) {
            const month = korMatch[1].padStart(2, '0');
            const day = korMatch[2].padStart(2, '0');
            const year = new Date().getFullYear();
            return `${year}-${month}-${day}`;
        }

        // Check English Short
        const engShortMatch = line.match(engShortRegex);
        if (engShortMatch) {
            const currentYear = new Date().getFullYear();
            const dateStr = `${engShortMatch[1]} ${engShortMatch[2]} ${currentYear}`;
            const parsed = new Date(dateStr);
            if (!isNaN(parsed.getTime())) {
                return parsed.toISOString().split('T')[0];
            }
        }
    }

    return null;
}

export async function POST(request: Request) {
    if (!BOT_TOKEN) {
        console.error('TELEGRAM_BOT_TOKEN is not set');
        return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    let chatId: number | undefined;

    try {
        const update = await request.json();

        // Basic validation
        if (!update.message || !update.message.text) {
            return NextResponse.json({ status: 'ok' });
        }

        chatId = update.message.chat.id;
        const text = update.message.text;

        console.log(`Received Telegram message from Chat ID: ${chatId}`);

        // Handle Commands
        if (text.trim() === '/cancel' || text.trim().toLowerCase() === 'cancel') {
            if (chatId) {
                await DraftStorage.deleteDraft(chatId);
                await sendTelegramMessage(chatId, `🗑️ 드래프트가 삭제되었습니다 (Draft Discarded).\n다시 시작하려면 설교 본문을 보내주세요.`);
            }
            return NextResponse.json({ status: 'ok' });
        }

        if (text.trim() === '/start' || text.trim() === '/help') {
            if (chatId) {
                await sendTelegramMessage(chatId,
                    `👋 환영합니다! (Welcome)

📖 **설교 업로드 방법 (How to Upload):**
1. 설교 본문을 보내주세요. (Send sermon text)
   (첫 줄에 날짜가 있으면 즉시 저장됩니다.)
   
2. 날짜가 없으면 **드래프트(임시저장)** 됩니다.
   (Draft saved if no date)
   
3. 드래프트 상태에서 **날짜만 보내면** 저장됩니다.
   (Reply with date to finish)

🚫 **취소하려면 (To Cancel):**
- \`/cancel\` 입력 시 드래프트 삭제`);
            }
            return NextResponse.json({ status: 'ok' });
        }

        // Try to parse Date
        const date = parseDate(text);

        if (date) {
            // DATE FOUND
            console.log(`Date found: ${date}`);

            // Check if there is a pending draft
            let contentToSave = text;
            let isUsingDraft = false;

            // If message is SHORT (< 100), assume it's a date for the DRAFT
            if (text.length < 100 && chatId) {
                const draft = await DraftStorage.getDraft(chatId);
                if (draft) {
                    console.log('Found pending draft. Merging with date.');
                    contentToSave = draft;
                    isUsingDraft = true;
                }
            }

            // Save Sermon
            const success = await SermonStorage.saveSermon(date, contentToSave, false);

            if (success) {
                await updateSermonIndex(date, contentToSave).catch(e => console.error(e));
                revalidatePath('/', 'layout');

                if (chatId) {
                    if (isUsingDraft) {
                        await DraftStorage.deleteDraft(chatId);
                        await sendTelegramMessage(chatId, `✅ 드래프트가 저장되었습니다! (Draft Saved)\n📅 날짜: ${date}`);
                    } else {
                        await sendTelegramMessage(chatId, `✅ 설교가 저장되었습니다! (Saved)\n📅 날짜: ${date}`);
                    }
                }
            } else {
                if (chatId) await sendTelegramMessage(chatId, `❌ 저장 실패: ${date}에 이미 설교가 존재합니다.`);
            }

        } else {
            // DATE NOT FOUND -> Save as Draft
            console.log('No date found. Saving as draft.');

            if (chatId) {
                await DraftStorage.saveDraft(chatId, text);

                await sendTelegramMessage(chatId,
                    `⚠️ 날짜를 찾을 수 없습니다 (No date found).
📝 본문을 **임시 저장**했습니다 (Text saved as draft).

👇 **다음 단계 (Next Steps):**
1. **날짜를 답장**으로 보내주세요 (e.g. 12 Feb, 2월 12일).
   (Reply with date to save)
   
2. 또는 **/cancel** 을 입력하여 취소하세요.
   (Type /cancel to discard)`);
            }
        }

        return NextResponse.json({ status: 'ok' });

    } catch (error: any) {
        console.error('Telegram Webhook Error:', error);

        if (chatId) {
            await sendTelegramMessage(chatId, `⚠️ 오류가 발생했습니다: ${error.message}`);
        }
        return NextResponse.json({ status: 'error', message: error.message });
    }
}
