import { loadEnvFile } from 'node:process';
import { client } from './client.js';

loadEnvFile();

export async function sendEmbeds(embeds) {
    const channel = await client.channels.fetch(process.env.CHANNEL_ID);
    if (!channel) return;

    await channel.send("------------------- PLACAR -------------------");

    for (const embed of embeds) {
        await channel.send({ embeds: [embed] });
    }
}