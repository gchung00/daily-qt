import dotenv from 'dotenv';
import readline from 'readline';

// Load env vars
dotenv.config({ path: '.env.local' });

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (!BOT_TOKEN) {
    console.error('Error: TELEGRAM_BOT_TOKEN not found in .env.local');
    process.exit(1);
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('--- Telegram Webhook Setup ---');
console.log('Bot Token:', BOT_TOKEN.slice(0, 10) + '...');

rl.question('Enter your deployed website URL (e.g. https://myapp.vercel.app): ', async (domain) => {
    // Clean domain
    domain = domain.trim().replace(/\/$/, '');

    if (!domain.startsWith('http')) {
        domain = 'https://' + domain;
    }

    const webhookUrl = `${domain}/api/telegram`;
    console.log(`\nSetting webhook to: ${webhookUrl}`);

    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook?url=${webhookUrl}`);
        const data = await response.json();

        console.log('\nResponse:', data);

        if (data.ok) {
            console.log('\n✅ Webhook set successfully!');
            console.log('You can now send sermons to your bot.');
        } else {
            console.error('\n❌ Failed to set webhook:', data.description);
        }
    } catch (error) {
        console.error('\n❌ Error:', error.message);
    }

    rl.close();
});
