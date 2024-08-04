import query from '../services/db'
import { currentDateTime } from '../helpers/date';

interface Post {
    description: string;
    user_id: number;
}

export const createLike = async (post_id: string, user_id: number) => {
    try {
        await query(
            `INSERT INTO likes (post_id, user_id, created_at, updated_at)
            VALUES 
            ('${post_id}', '${user_id}', '${currentDateTime()}', '${currentDateTime()}')`
          );
    } catch (error) {
        throw new Error('Failed to like post');
    }
}

export const createUnlike = async (post_id: string, user_id: number) => {
    try {
        await query(`DELETE FROM likes WHERE post_id = '${post_id}' AND user_id = '${user_id}'`);
    } catch (error) {
        throw new Error('Failed to unlike post');
    }
}