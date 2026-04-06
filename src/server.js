import express from 'express';
import { loadDB, saveDB } from './core/database.js';
import { compareRanking, buildEmbed } from './core/ranking.js';
import { sendEmbeds } from './bot/sender.js';
import { startBot } from './bot/client.js';
import { canRun } from './core/scheduler.js';
import rateLimit from "express-rate-limit";
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.set('trust proxy', 1);
app.use(express.json({ limit: "300kb" }));


function authMiddleware(req, res, next) {
    const apiKey = req.headers["x-api-key"];

    if (!apiKey || apiKey !== process.env.API_KEY) {
        return res.status(403).send("Access denied");
    }

    next();
}

const limiter = rateLimit({ windowMs: 60000, max: 5 });

app.post("/dados", authMiddleware, limiter, async (req, res) => {

    await startBot();
    console.log(`[${new Date().toISOString()}] Request de ${req.ip}`);

    try {
        const { placares } = req.body;

        if (!Array.isArray(placares)) {
            return res.status(400).send("Format invalid");
        }

        const db = loadDB();

        const embeds = [];

        if (Object.keys(db.placares).length === 0) {
            for (const placar of placares) {
                const ordenado = placar.dados
                    .sort((a, b) => b.pontos - a.pontos)
                    .map(u => ({ ...u, status: "➖" }));

                db.placares[placar.nome] = ordenado;
                embeds.push(buildEmbed(placar.nome, ordenado));
            }

            db.lastUpdate = Date.now();
            saveDB(db);

            await sendEmbeds(embeds);
            return res.send("Primeiro snapshot enviado!");
        }

        if (!canRun(db.lastUpdate, 4, true)) {
            return res.send("The deadline for execution has not yet been reached.");
        }

        for (const placar of placares) {
            const novo = placar.dados.sort((a, b) => b.pontos - a.pontos);
            const antigo = db.placares[placar.nome] || [];

            const comparado = compareRanking(antigo, novo);

            db.placares[placar.nome] = novo;
            embeds.push(buildEmbed(placar.nome, comparado));
        }

        db.lastUpdate = Date.now();
        saveDB(db);

        await sendEmbeds(embeds);

        res.send("Comparado e enviado!");
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal error");
    }
});

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});