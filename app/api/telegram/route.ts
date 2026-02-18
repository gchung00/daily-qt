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
            body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
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
    const lines = text.split('\n').slice(0, 5);

    // 1. Korean Format with Year: YYYY. M. D or YYYY. MM. DD
    const korYearRegex = /(\d{4})[\.\s]+(\d{1,2})[\.\s]+(\d{1,2})/;
    // 2. Korean Format: "X월 Y일"
    const korRegex = /(\d{1,2})\s*[월./]\s*(\d{1,2})\s*[일]?/;
    // 3. ISO Format: YYYY-MM-DD
    const isoRegex = /(\d{4})-(\d{2})-(\d{2})/;
    // 4. English Format: DD-MMM-YYYY or DD MMM YYYY
    const engRegex = /(\d{1,2})[\s-]([a-zA-Z]{3})[\s-](\d{4})/;
    // 5. English Short Format: DD MMM -> Current Year
    const engShortRegex = /(\d{1,2})[\s-]([a-zA-Z]{3})/;

    for (const line of lines) {
        const isoMatch = line.match(isoRegex);
        if (isoMatch) return isoMatch[0];

        const korYearMatch = line.match(korYearRegex);
        if (korYearMatch) {
            const year = korYearMatch[1];
            const month = korYearMatch[2].padStart(2, '0');
            const day = korYearMatch[3].padStart(2, '0');
            return `${year}-${month}-${day}`;
        }

        const engMatch = line.match(engRegex);
        if (engMatch) {
            const parsed = new Date(engMatch[0]);
            if (!isNaN(parsed.getTime())) return parsed.toISOString().split('T')[0];
        }

        const korMatch = line.match(korRegex);
        if (korMatch) {
            const month = korMatch[1].padStart(2, '0');
            const day = korMatch[2].padStart(2, '0');
            const year = new Date().getFullYear();
            return `${year}-${month}-${day}`;
        }

        const engShortMatch = line.match(engShortRegex);
        if (engShortMatch) {
            const currentYear = new Date().getFullYear();
            const dateStr = `${engShortMatch[1]} ${engShortMatch[2]} ${currentYear}`;
            const parsed = new Date(dateStr);
            if (!isNaN(parsed.getTime())) return parsed.toISOString().split('T')[0];
        }
    }
    return null;
}

export async function POST(request: Request) {
    if (!BOT_TOKEN) return NextResponse.json({ error: 'Config error' }, { status: 500 });

    let chatId: number | undefined;

    try {
        const update = await request.json();

        if (!update.message || !update.message.text) return NextResponse.json({ status: 'ok' });

        chatId = update.message.chat.id;
        const text = update.message.text;
        const messageId = update.message.message_id;

        // Deduplication
        const today = new Date().toISOString().split('T')[0];
        const dedupKey = `dedup/${today}/${chatId}-${messageId}.txt`;

        try {
            const { blobs } = await list({ prefix: dedupKey, limit: 1 });
            if (blobs.length > 0) return NextResponse.json({ status: 'ok' });
            await put(dedupKey, 'processed', { access: 'public', addRandomSuffix: false });
        } catch (e) {
            console.warn('Dedup/Auth check failed:', e);
        }

        // --- Commands ---

        if (text.trim() === '/cancel' || text.trim().toLowerCase() === 'cancel') {
            if (chatId) {
                await DraftStorage.deleteDraft(chatId);
                await sendTelegramMessage(chatId, `🗑️ **드래프트가 삭제되었습니다.**\n다시 본문을 보내주시면 새로 시작할 수 있습니다.`);
            }
            return NextResponse.json({ status: 'ok' });
        }

        if (text.trim() === '/start' || text.trim() === '/help') {
            if (chatId) {
                await sendTelegramMessage(chatId,
                    `🙏 **반갑습니다! 설교 업로드 봇입니다.**

📖 **업로드 방법:**
1️⃣ **기본:** 설교 본문을 보내주세요. (첫 줄에 날짜 포함 시 즉시 저장)
2️⃣ **긴 설교:** 본문을 나눠서 보내시고, 맨 마지막에 **날짜**만 따로 보내주세요.

💡 **팁:** 이미 저장된 날짜에 날짜만 다시 보내면 내용이 자동으로 이어붙여집니다.

🚫 **취소하려면:** \`/cancel\``);
            }
            return NextResponse.json({ status: 'ok' });
        }

        // --- Date Parsing & logic ---

        const date = parseDate(text);

        if (date) {
            // DATE FOUND
            let contentToSave = text;
            let isUsingDraft = false;

            if (text.length < 200 && chatId) {
                const draft = await DraftStorage.getDraft(chatId);
                if (draft) {
                    contentToSave = draft;
                    isUsingDraft = true;
                }
            }

            // Save
            const success = await SermonStorage.saveSermon(date, contentToSave, false);

            if (success) {
                await updateSermonIndex(date, contentToSave).catch(e => console.error(e));
                revalidatePath('/', 'layout');

                if (chatId) {
                    if (isUsingDraft) await DraftStorage.deleteDraft(chatId);
                    await sendTelegramMessage(chatId, `✅ **설교가 안전하게 저장되었습니다!**\n📅 날짜: \`${date}\``);
                }
            } else {
                // Conflict -> Try Append
                if (chatId) {
                    if (isUsingDraft) {
                        const existingContent = await SermonStorage.getSermon(date);
                        if (existingContent) {
                            const combinedContent = existingContent + "\n\n" + contentToSave;
                            await SermonStorage.saveSermon(date, combinedContent, true);
                            await updateSermonIndex(date, combinedContent).catch(e => console.error(e));
                            revalidatePath('/', 'layout');

                            await DraftStorage.deleteDraft(chatId);
                            await sendTelegramMessage(chatId, `➕ **기존 설교에 내용이 추가되었습니다!**\n📅 날짜: \`${date}\``);
                            return NextResponse.json({ status: 'ok' });
                        }
                    }
                    await sendTelegramMessage(chatId, `❌ **저장 실패:** 해당 날짜(\`${date}\`)에 이미 등록된 설교가 있습니다.`);
                }
            }

        } else {
            // DATE NOT FOUND -> Draft / Append
            if (chatId) {
                const existingDraft = await DraftStorage.getDraft(chatId);
                await DraftStorage.saveDraft(chatId, text);

                if (existingDraft) {
                    await sendTelegramMessage(chatId, `📝 **내용이 드래프트에 추가되었습니다.**\n계속 보내시거나, **날짜**를 입력해 주세요.`);
                } else {
                    await sendTelegramMessage(chatId,
                        `📝 **본문을 임시 저장했습니다.**

👇 **다음 단계:**
1. 내용이 더 있다면 계속 보내주세요.
2. 다 보내셨다면 **날짜**를 입력해서 완료해주세요.`);
                }
            }
        }

        return NextResponse.json({ status: 'ok' });

    } catch (error: any) {
        console.error('Telegram Webhook Error:', error);
        if (chatId) await sendTelegramMessage(chatId, `⚠️ **죄송합니다. 처리 중 오류가 발생했습니다.**\n${error.message}`);
        return NextResponse.json({ status: 'error', message: error.message });
    }
}
