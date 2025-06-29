import jwt from 'jsonwebtoken';
import user from '../model/user';

export const generateToken = (userId: string) => {
    return jwt.sign({ id: userId},process.env.JWT_SECRET!,{
        expiresIn: '2d',
    });
};