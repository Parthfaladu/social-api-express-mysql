import query, { PaginatedGet } from "../services/db";
import { currentDateTime } from '../helpers/date';

export const searchFriends = async (page: number, limit: number, searchQuery: string = '', user_id?: string) => {
    try {
        console.log('searchQuery', searchQuery);
        const friends = await PaginatedGet(`
            SELECT 
                users.first_name,
                users.last_name,
                users.email,
                users.id as people_id,
                friends.* 
            FROM users
            LEFT JOIN friends ON (friends.user_id = ${user_id} AND friends.friend_id = users.id OR 
                friends.user_id = users.id AND friends.friend_id = ${user_id})
        `, 'users', page, limit ? limit : 10, `users.id != ${user_id} 
                AND (users.first_name LIKE '%${searchQuery}%'
                    OR users.last_name LIKE '%${searchQuery}%'
                    OR users.email LIKE '%${searchQuery}%'
                )`, `ORDER BY users.id DESC`);
        return friends;
    } catch (error) {
        throw new Error('Failed to comment on post');
    }
}

export const sendFriendRequest = async (friend_id: string, user_id: string) => {
    try {
        await query(
            `INSERT INTO friends (friend_id, user_id, created_at, updated_at)
            VALUES 
            ('${friend_id}', '${user_id}', '${currentDateTime()}', '${currentDateTime()}')`
          );
    } catch (error) {
        throw new Error('Failed to send friend request');
    }
}

export const acceptFriendRequest = async (friend_id: string, user_id: string) => {
    try {
        await query(`UPDATE friends SET status = 1 WHERE friend_id = '${friend_id}' AND user_id = '${user_id}'`);
    } catch (error) {
        throw new Error('Failed to accept friend request');
    }
}

export const removeFriend = async (friend_id: string, user_id: string) => {
    try {
        await query(`DELETE FROM friends WHERE (friend_id = '${friend_id}' AND user_id = '${user_id}')`);
    } catch (error) {
        throw new Error('Failed to remove friend');
    }
}