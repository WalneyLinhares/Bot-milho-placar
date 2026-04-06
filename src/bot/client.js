import { Client, GatewayIntentBits, Events } from 'discord.js';
import { loadEnvFile } from 'node:process';

loadEnvFile();

export const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

export function startBot() {
    return new Promise((resolve, reject) => {

        if (client.isReady()) {
            return resolve(client);
        }

        client.once(Events.ClientReady, (c) => {
            console.log(`BOT ON! ${c.user.tag}`);
            resolve(client);
        });

        client.login(process.env.DISCORD_TOKEN).catch(reject);
    });
}