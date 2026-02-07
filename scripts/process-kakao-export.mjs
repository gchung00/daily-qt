
import fs from 'fs';
import path from 'path';

const INPUT_FILE = 'KakaoTalkChats.txt';
const OUTPUT_DIR = 'sermons';

// Regex to identify the start of a message
// Example: 2021년 9월 17일 오전 7:00, 아빠 : 
const MESSAGE_START_REGEX = /^(\d{4})년 (\d{1,2})월 (\d{1,2})일 (오전|오후) \d{1,2}:\d{2}, (.*?) : /;

async function main() {
    try {
        const rawContent = fs.readFileSync(INPUT_FILE, 'utf-8');
        const lines = rawContent.split('\n');

        const messages = [];
        let currentMessage = null;

        // 1. Parsing lines into messages
        for (let line of lines) {
            // Trim \r if present
            line = line.replace('\r', '');

            const match = line.match(MESSAGE_START_REGEX);
            if (match) {
                // Determine previous message is done
                if (currentMessage) {
                    messages.push(currentMessage);
                }

                // Start new message
                const year = match[1];
                const month = match[2].padStart(2, '0');
                const day = match[3].padStart(2, '0');
                const sender = match[5];

                const contentStart = match[0].length;
                const content = line.substring(contentStart);

                currentMessage = {
                    date: `${year}-${month}-${day}`, // YYYY-MM-DD
                    sender: sender,
                    content: content + '\n', // Start content
                    fullDateString: match[0]
                };
            } else {
                // Append to current message if it exists
                if (currentMessage) {
                    currentMessage.content += line + '\n';
                }
            }
        }
        // Push last message
        if (currentMessage) {
            messages.push(currentMessage);
        }

        console.log(`Parsed ${messages.length} total messages.`);

        // 2. Identify Sermons
        const sermonMessages = messages.filter(msg => {
            const content = msg.content;

            // Criteria 1: Check Sender (Must be '아빠' or similar if name changed, assuming '아빠')
            if (!msg.sender.includes('아빠')) return false;

            // Criteria 2: Length Check (Short messages are likely chat)
            if (content.length < 200) return false; // Lowered threshold slightly just in case

            // Criteria 3: Keywords (Must have at least one strong indicator)
            const hasWorship = content.includes('예배');
            const hasConfession = content.includes('신앙고백');
            const hasHymn = content.includes('찬송가');
            const hasScripture = content.includes('하나님 말씀') || content.includes('성경');

            // Sermon usually has "Date+예배" header OR (Confession AND Hymn)
            if (content.match(/^\d{1,2}월\s*\d{1,2}일\s*예배/)) return true;
            if (hasConfession && hasHymn) return true;
            if (hasHymn && hasScripture) return true;

            return false;
        });

        console.log(`Identified ${sermonMessages.length} potential sermons.`);

        // 3. Save to files
        if (!fs.existsSync(OUTPUT_DIR)) {
            fs.mkdirSync(OUTPUT_DIR);
        }

        let savedCount = 0;
        for (const sermon of sermonMessages) {
            // Clean content: remove trailing/leading whitespace but keep structure
            const cleanContent = sermon.content.trim();

            const filePath = path.join(OUTPUT_DIR, `${sermon.date}.txt`);

            // Check formatted date inside content to confirm?
            // Usually the filename date (from Kakao timestamp) is accurate enough.
            // But sometimes he sends it later.
            // Let's use the Kakao timestamp date for the filename as it's the "sent" date.

            // Write file
            // If file exists, we might overwrite or skip. Let's overwrite for now or checking content?
            // User wants extraction.

            fs.writeFileSync(filePath, cleanContent, 'utf-8');
            savedCount++;
        }

        console.log(`Successfully saved ${savedCount} sermon files to ${OUTPUT_DIR}/`);

    } catch (e) {
        console.error("Error processing:", e);
    }
}

main();
