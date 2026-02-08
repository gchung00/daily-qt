import { parseSermon } from './lib/parser';

const userContent = `롯이 아브람을 떠난 후에  창13:10-18 \n2026. 2. 8 주일 낮\n\n롯은 아브람의 조카입니다.`;

const parsed = parseSermon(userContent);
console.log("Parsed result:", JSON.stringify(parsed, null, 2));

// Check if date extracted is valid
if (parsed.date === "2026-02-08") {
    console.log("Date parsing SUCCESS");
} else {
    console.log("Date parsing FAILURE");
}
