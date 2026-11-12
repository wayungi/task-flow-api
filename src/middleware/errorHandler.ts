import type { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (err: unknown, _req, res, next): void => {

    if (res.headersSent) {
        next(err);
        return;
    }

    // Malformed JSON from express.json()
    if (
        err instanceof SyntaxError &&
        "status" in err &&
        err.status === 400 &&
        "type" in err &&
        err.type === "entity.parse.failed"
    ) {
        res.status(400).json({
            message: "Malformed JSON request"
        });
        return;
    }

    console.error(err);

    res.status(500).json({
        message: "Internal server error"
    });
};