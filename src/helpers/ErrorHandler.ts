import * as yup from 'yup';

export const errorHandler = (error: any) => {
    if (error instanceof yup.ValidationError) {
        return { message: 'Validation error', details: error.errors };
    }
    if (error && (error as Error).message) {
        return { message: (error as Error).message };
    } 
    return { message: 'Internal server error' };
}