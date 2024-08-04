import { Request, Response, NextFunction } from 'express';
import * as yup from 'yup';
import { errorHandler } from '../helpers/ErrorHandler';

const postCreateSchema = yup.object().shape({
    description: yup.string().required()
});

const paginationSchema = yup.object().shape({
    page: yup.number().integer().min(1),
    limit: yup.number().integer().min(1).max(100)
});

const commentOnPostSchema = yup.object().shape({
    comment: yup.string().required()
});

export const postCreateValidate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await postCreateSchema.validate(req.body);
        next();
    } catch (error) {
        res.status(400).json(errorHandler(error));
    }
}

export const paginationValidate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await paginationSchema.validate(req.query);
        next();
    } catch (error) {
        res.status(400).json(errorHandler(error));
    }
}

export const commentOnPostValidate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await commentOnPostSchema.validate(req.body);
        next();
    } catch (error) {
        res.status(400).json(errorHandler(error));
    }
}
