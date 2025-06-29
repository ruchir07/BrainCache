import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import user from '../model/user';

interface jwtPayload {
    id: string; 
}

export const protect = async (req: Request, res: Response, next: NextFunction):Promise<void> => {

    const authHeader = req.headers.authorization;
    const cookieToken = req.cookies?.token;

    let token = '';

    // Priority: Header token
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    } else if (cookieToken) {
        token = cookieToken;
    }

    if(!token){
        res.status(401).json({ message: 'Not authorized, no token' });
        return;
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwtPayload;
        const ele = await user.findById(decoded.id).select('-password');
        if(!ele){
            res.status(401).json({ message: 'user not found' });
            return;
        }
        (req as any).user = ele;
        next();
    }catch(error){
        res.status(401).json({ message: 'Not authorized, token failed' });
        return;
    }

}
