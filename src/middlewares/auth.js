function authMiddleware(req, res, next) {
    const apiKey = req.headers["x-api-key"];

    if (!apiKey || apiKey !== process.env.API_KEY) {
        return res.status(403).send("Access denied");
    }

    next();
}

export { authMiddleware };