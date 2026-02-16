import { NextResponse } from 'next/server';
import { SermonStorage, DraftStorage } from '@/lib/storage';
import { revalidatePath } from 'next/cache';
import { updateSermonIndex } from '@/lib/index-manager';
import { list, put } from '@vercel/blob';

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

    // 1. Korean Format with Year: YYYY. M. D or YYYY. MM. DD
    // e.g. "2026. 2. 15"
    const korYearRegex = /(\d{4})[\.\s]+(\d{1,2})[\.\s]+(\d{1,2})/;

    // 2. Korean Format: "X월 Y일" or "X.Y" or "X/Y"
    const korRegex = /(\d{1,2})\s*[월./]\s*(\d{1,2})\s*[일]?/;

    // 3. ISO Format: YYYY-MM-DD
    const isoRegex = /(\d{4})-(\d{2})-(\d{2})/;

    // 4. English Format: DD-MMM-YYYY or DD MMM YYYY (e.g. 12-Feb-2026 or 12 Feb 2026)
    const engRegex = /(\d{1,2})[\s-]([a-zA-Z]{3})[\s-](\d{4})/;

    // 5. English Short Format: DD MMM (e.g. 12 Feb) -> Current Year
    const engShortRegex = /(\d{1,2})[\s-]([a-zA-Z]{3})/;

    for (const line of lines) {
        // Check ISO first
        const isoMatch = line.match(isoRegex);
        if (isoMatch) return isoMatch[0];

        // Check Korean Year format (YYYY. M. D)
        const korYearMatch = line.match(korYearRegex);
        if (korYearMatch) {
            const year = korYearMatch[1];
            const month = korYearMatch[2].padStart(2, '0');
            const day = korYearMatch[3].padStart(2, '0');
            return `${year}-${month}-${day}`;
        }

        // Check English Full
        const engMatch = line.match(engRegex);
        if (engMatch) {
            const parsed = new Date(engMatch[0]);
            if (!isNaN(parsed.getTime())) {
                return parsed.toISOString().split('T')[0];
            }
        }

        // Check Korean (No Year)
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
        const messageId = update.message.message_id;

        console.log(`Received Telegram message from Chat ID: ${chatId}, Message ID: ${messageId}`);

        // Deduplication
        const today = new Date().toISOString().split('T')[0];
        const dedupKey = `dedup/${today}/${chatId}-${messageId}.txt`;

        try {
            const { blobs } = await list({ prefix: dedupKey, limit: 1 });
            if (blobs.length > 0) {
                console.log(`Duplicate message ${messageId} detected, ignoring.`);
                return NextResponse.json({ status: 'ok' });
            }
        } catch (e) {
            console.warn('Dedup check failed, proceeding anyway:', e);
        }

        // Mark processed
        try {
            await put(dedupKey, 'processed', { access: 'public', addRandomSuffix: false });
        } catch (e) {
            console.warn('Failed to mark processed:', e);
        }

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
   - 첫 부분에 날짜(예: 2026. 2. 16)가 있으면 즉시 저장됩니다.
   
2. **긴 설교 (Long Sermons):**
   - 두 번 이상 나누어 보낼 때:
     1) 본문을 나누어 보내세요. (Draft 저장됨)
     2) 마지막에 **날짜를 다시 보내세요**.
     (이미 저장된 날짜라면 자동으로 **이어붙입니다**.)

🚫 **취소하려면:** /cancel`);
            }
            return NextResponse.json({ status: 'ok' });
        }

        // Try to parse Date
        const date = parseDate(text);

        if (date) {
            // DATE FOUND
            console.log(`Date found: ${date}`);

            let contentToSave = text;
            let isUsingDraft = false;

            // Priority: Check Draft first.
            // If the message is SHORT (just providing date), use Draft.
            // If the message is LONG, it might be the sermon itself (with header).

            if (text.length < 200 && chatId) {
                const draft = await DraftStorage.getDraft(chatId);
                if (draft) {
                    console.log('Found pending draft. Merging with date.');
                    contentToSave = draft; // Use draft content
                    isUsingDraft = true;
                }
            }

            // Attempt Save
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
                // FAILURE: File Exists
                // If we were using a Draft, OR if the user is explicitly trying to append?

                if (chatId) {
                    // Try APPEND logic
                    // If user is trying to save a Draft to an existing date, likely they want to append (Part 2).
                    // Or if they sent text that got parsed as date?

                    if (isUsingDraft) {
                        // User sent Part 1 (saved). User sent Part 2 (draft). User sent Date.
                        // Append Draft to Existing File.
                        const existingContent = await SermonStorage.getSermon(date);
                        if (existingContent) {
                            const combinedContent = existingContent + "\n\n" + contentToSave;
                            await SermonStorage.saveSermon(date, combinedContent, true); // Force Correct
                            await updateSermonIndex(date, combinedContent).catch(e => console.error(e));
                            revalidatePath('/', 'layout');

                            await DraftStorage.deleteDraft(chatId);
                            await sendTelegramMessage(chatId, `✚ 기존 설교에 이어붙였습니다! (Appended to Existing)\n📅 날짜: ${date}`);
                            return NextResponse.json({ status: 'ok' });
                        }
                    }

                    await sendTelegramMessage(chatId, `❌ 저장 실패: ${date}에 이미 설교가 존재합니다.`);
                }
            }

        } else {
            // DATE NOT FOUND -> Append to Draft
            console.log('No date found. Appending to draft.');

            if (chatId) {
                // Check if draft exists BEFORE saving (to customize message)
                const existingDraft = await DraftStorage.getDraft(chatId);

                await DraftStorage.saveDraft(chatId, text);

                if (existingDraft) {
                    await sendTelegramMessage(chatId,
                        `📝 **드래프트에 추가되었습니다** (Added to Draft).
(총 길이: ${(existingDraft.length + text.length + 1).toLocaleString()} 자)
- 계속 추가하거나, **날짜를 보내서** 저장하세요.`);
                } else {
                    await sendTelegramMessage(chatId,
                        `⚠️ 날짜를 찾을 수 없습니다 (No date found).
📝 본문을 **임시 저장**했습니다 (Text saved as draft).

👇 **다음 단계 (Next Steps):**
1. 긴 내용이면 **계속 보내세요** (Appends to draft).
2. 다 보냈으면 **날짜를 보내세요** (Reply with date).`);
                }
            }
        }

        return NextResponse.json({ status: 'ok' });

    } catch (error: any) {
        console.error('Telegram Webhook Error:', error);
        if (chatId) await sendTelegramMessage(chatId, `⚠️ 오류: ${error.message}`);
        return NextResponse.json({ status: 'error', message: error.message });
    }
}
