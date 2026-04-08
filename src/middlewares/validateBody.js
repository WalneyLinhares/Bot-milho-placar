const PLACARES_PERMITIDOS = [
    "PARTIDAS GANHAS DE CIVIL",
    "PARTIDAS GANHAS DE MAFIA",
    "PARTIDAS GANHAS DE BOBO"
];

function validateBody(req, res, next) {
    const { placares } = req.body;

    // 1. estrutura básica
    if (!Array.isArray(placares)) {
        return res.status(400).send("placares deve ser um array");
    }

    for (const placar of placares) {
        // 2. nome válido
        if (typeof placar.nome !== "string") {
            return res.status(400).send("nome do placar inválido");
        }

        if (!PLACARES_PERMITIDOS.includes(placar.nome)) {
            return res.status(400).send(`placar não permitido: ${placar.nome}`);
        }

        // 3. dados
        if (!Array.isArray(placar.dados)) {
            return res.status(400).send("dados deve ser um array");
        }

        for (const user of placar.dados) {
            // 4. valida usuário
            if (typeof user.nick !== "string") {
                return res.status(400).send("nick inválido");
            }

            if (typeof user.pontos !== "number") {
                return res.status(400).send("pontos inválido");
            }

            // 5. sanity check
            if (user.pontos < 0) {
                return res.status(400).send("pontos não pode ser negativo");
            }
        }
    }

    next();
}

export { validateBody };