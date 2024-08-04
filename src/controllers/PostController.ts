import { Request, Response } from 'express';
import { createPost as createPostModule, getAllPosts } from '../models/Post';
import { createLike, createUnlike } from '../models/Like';
import { errorHandler } from '../helpers/ErrorHandler';
import { createComment } from '../models/Comment';

export const createPost = async (req: Request, res: Response) => {
    try {
        await createPostModule({
            description: req.body.description,
            user_id: (req as any).user?.id,
        });
        res.status(201).json({message: 'Post created successfully' });
    } catch (error) {
        res.status(400).json(errorHandler(error));
    }
};

export const posts = async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 10 } = req.body;
        const posts = await getAllPosts(page, limit, (req as any).user?.id);

        res.status(200).json(posts);
    } catch (error) {
        res.status(400).json(errorHandler(error));
    }
};

export const likePost = async (req: Request, res: Response) => {
    try {
        await createLike(
            req.params.id,
            (req as any).user.id,
        );

        res.status(200).json({message: 'Liked post!'});
    } catch (error) {
        res.status(400).json(errorHandler(error));
    }
};

export const unlikePost = async (req: Request, res: Response) => {
    try {
        await createUnlike(req.params.id, (req as any).user.id);
        res.status(200).json({message: 'Unliked post!'});
    } catch (error) {
        res.status(400).json(errorHandler(error));
    }
};

export const commentOnPost = async (req: Request, res: Response) => {
    try {
        await createComment({
            comment: req.body.comment,
            post_id: req.params.id,
            user_id: (req as any).user?.id,
        });
        res.status(200).json({message: 'commented successfully on post' });
    } catch (error) {
        res.status(400).json(errorHandler(error));
    }
};