import { Request, Response } from 'express';
import { register as registerModule, login as loginModule } from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { errorHandler } from '../helpers/ErrorHandler';

export const register = async (req: Request, res: Response) => {
    try {
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync((req.body.password).toString(), salt);

        await registerModule({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            password: hashedPassword
        });

        res.status(200).json({message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json(errorHandler(error));
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const user = await loginModule(req.body.email);
        
        if(user && bcrypt.compareSync((req.body.password).toString(), user.password)) {
            const token = jwt.sign({id: user.id, password: user.password, email: user.email}, 'shhhhh');
            res.status(200).json(token);
        } else {
            res.status(400).json('Invalid credentials');
        }
    } catch (error) {
        res.status(400).json(errorHandler(error));
    }
}