import query from '../services/db'
import { currentDateTime } from '../helpers/date';

interface User {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
}

type UserDTO = User & {
    id: number;
}

export const register = async (user: User) => {
    try {
        await query(
            `INSERT INTO users (first_name, last_name, email, password, created_at, updated_at)
            VALUES 
            ('${user.first_name}', '${user.last_name}', '${user.email}', '${user.password}', '${currentDateTime()}', '${currentDateTime()}')`
          );
    } catch (error) {
        throw new Error('Failed to register user');
    }
}

export const login = async (email: string) => {
    try {
        const users = await query(
            `SELECT * FROM users where email = ?`, [email]
        ) as UserDTO[];

        if (users && users.length > 0) {
            return users[0];
        } 
        throw new Error('Invalid email or password');
    } catch (error) {
        throw new Error('Invalid email or password');
    }
}