import {Request, Response} from 'express';
import { searchFriends, sendFriendRequest as sendFriendRequestModule, acceptFriendRequest as acceptFriendRequestModule, removeFriend } from '../models/Friend';
import { errorHandler } from '../helpers/ErrorHandler';

export const searchFriend = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const searchQuery = req.query.search as string | '';

        const users = await searchFriends(page, limit, searchQuery, (req as any).user.id);
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json(errorHandler(error));
    }
};

export const sendFriendRequest = async (req: Request, res: Response) => {
    try {
        await sendFriendRequestModule(
            req.params.id,
            (req as any).user.id
        );
        res.status(201).json({message: 'Friend request sent successfully' });
    } catch (error) {
        res.status(400).json(errorHandler(error));
    }
};

export const acceptFriendRequest = async (req: Request, res: Response) => {
    try {
        await acceptFriendRequestModule(
            req.params.id,
            (req as any).user.id
        );
        res.status(201).json({message: 'Friend request sent successfully' });
    } catch (error) {
        res.status(400).json(errorHandler(error));
    }
};

export const declineOrRemoveFriend = async (req: Request, res: Response) => {
    try {
        await removeFriend(
            req.params.id,
            (req as any).user.id
        );
        res.status(201).json({message: 'Removed friend successfully' });
    } catch (error) {
        res.status(400).json(errorHandler(error));
    }
};