import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'Token de autenticação ausente' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key') as { userId: string, email: string };

        req.user = {  id: decoded.userId, email: decoded.email };

        return next();
    } catch (error) {
        return res.status(401).json({ error: 'Token de autenticação inválido' });
    }
}