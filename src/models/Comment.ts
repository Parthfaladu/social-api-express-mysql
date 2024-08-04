import query from '../services/db'
import { currentDateTime } from '../helpers/date';

interface Comment {
    comment: string;
    post_id: string;
    user_id: number;
}

export const createComment = async (comment: Comment) => {
    try {
        await query(
            `INSERT INTO comments (comment, post_id, user_id, created_at, updated_at)
            VALUES 
            ('${comment.comment}', '${comment.post_id}', '${comment.user_id}', '${currentDateTime()}', '${currentDateTime()}')`
          );
    } catch (error) {
        throw new Error('Failed to comment on post');
    }
}