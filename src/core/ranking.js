import { EmbedBuilder } from 'discord.js';

function compareRanking(oldRank = [], newRank = []) {
    const mapOld = new Map();
    oldRank.forEach((u, i) => mapOld.set(u.nick, { ...u, pos: i }));

    return newRank.map((user, index) => {
        const old = mapOld.get(user.nick);

        if (!old) {
            return { ...user, status: "🆕" };
        }

        const diff = old.pos - index;

        if (diff > 0) return { ...user, status: `🔼 +${diff}` };
        if (diff < 0) return { ...user, status: `🔽 ${diff}` };

        return { ...user, status: "➖" };
    });
}

function buildEmbed(nome, ranking) {
    const embed = new EmbedBuilder()
        .setTitle(`📊 ${nome}`)
        .setColor(0x5865F2)
        .setTimestamp();

    let lines = ["#  | Nick         | Pontos | Status"];

    ranking.slice(0, 50).forEach((user, i) => {
        const pos = String(i + 1).padStart(2, " ");
        const nick = user.nick.slice(0, 12).padEnd(12, " ");
        const pontos = String(user.pontos).padStart(6, " ");
        const status = user.status || "➖";

        lines.push(`${pos} | ${nick} | ${pontos} | ${status}`);
    });

    embed.setDescription("```" + lines.join("\n") + "```");

    return embed;
}

export { compareRanking, buildEmbed };