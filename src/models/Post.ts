import query, { PaginatedGet } from '../services/db'
import { currentDateTime } from '../helpers/date';

interface Post {
    description: string;
    user_id: number;
}

export const createPost = async (post: Post) => {
    try {
        await query(
            `INSERT INTO posts (description, user_id, created_at, updated_at)
            VALUES 
            ('${post.description}', '${post.user_id}', '${currentDateTime()}', '${currentDateTime()}')`
          );
    } catch (error) {
        throw new Error('Failed to create post');
    }
}

export const getAllPosts = async (page: number, limit: number, user_id: number) => {
    try {
        const posts = await PaginatedGet(`
            SELECT 
                posts.id,
                posts.description,
                posts.user_id,
                posts.created_at,
                posts.updated_at,
                JSON_OBJECT(
                    'id', users.id,
                    'first_name', users.first_name,
                    'last_name', users.last_name
                ) AS user,
                COALESCE(
                    JSON_ARRAYAGG(
                        IF(comments.id IS NOT NULL,
                            JSON_OBJECT(
                                'id', comments.id,
                                'post_id', comments.post_id,
                                'content', comments.comment,
                                'created_at', comments.created_at,
                                'updated_at', comments.updated_at,
                                'user', JSON_OBJECT(
                                    'id', comment_users.id,
                                    'first_name', comment_users.first_name,
                                    'last_name', comment_users.last_name
                                )
                            ), 
                            NULL
                        )
                    ), 
                    JSON_ARRAY()
                ) AS comments,
                COALESCE(
                    (SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'post_id', likes.post_id,
                            'user_id', likes.user_id
                        )
                    ) FROM likes WHERE likes.post_id = posts.id), JSON_ARRAY()
                ) AS likes
            FROM posts
            LEFT JOIN comments ON posts.id = comments.post_id
            LEFT JOIN users ON posts.user_id = users.id
            LEFT JOIN users AS comment_users ON comments.user_id = comment_users.id
        `, 'posts', page, limit ? limit : 10, `
            posts.user_id = ${user_id} 
            OR posts.user_id IN (SELECT friend_id FROM friends where friends.user_id = ${user_id}) 
            OR posts.user_id IN (SELECT user_id FROM friends where friends.friend_id = ${user_id})
          `, `GROUP BY posts.id, users.id ORDER BY posts.id DESC`);
        return posts;
    } catch (error) {
        throw new Error('Failed to get posts');
    }
}