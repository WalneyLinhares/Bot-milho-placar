import express from 'express';
import { getData, saveData } from './core/repository.js';
import { connectDB } from './core/mongo.js';
import { compareRanking, buildEmbed } from './core/ranking.js';
import { sendEmbeds } from './bot/sender.js';
import { startBot } from './bot/client.js';
import { canRun } from './core/scheduler.js';
import { authMiddleware } from './middlewares/auth.js'
import { validateBody } from './middlewares/validateBody.js'
import { limiter } from './middlewares/limiter.js'
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.set('trust proxy', 1);
app.use(express.json({ limit: "300kb" }));

app.post("/dados", authMiddleware, validateBody, limiter, async (req, res) => {

    console.log(`[${new Date().toISOString()}] Request de ${req.ip}`);

    try {

        const { placares } = req.body;

        const db = await getData();

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
            await saveData(db);

            await sendEmbeds(embeds);
            return res.send("Primeiro snapshot enviado!");
        }

        if (!canRun(db.lastUpdate, 3, true)) {
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
        await saveData(db);

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

await connectDB();
await startBot();