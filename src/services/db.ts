import mysql from 'mysql2/promise';
import config from '../config/database';

type SQLParams = (string | number | boolean | null)[];

const query = async (sql: string, params: SQLParams = [])=> {
    const connection = await mysql.createConnection(config.db);
    const [results] = await connection.execute(sql, params);
    await connection.end();
    return results;
}

export const PaginatedGet = async (queryBuilder: any, table: string, page: number, limit: number, whereCondition: string, groupAndSorting: string) => {
    const records = await query(`
        ${queryBuilder} 
        WHERE ${whereCondition} 
        ${groupAndSorting}
        limit ${limit} offset ${(page * limit) - limit}
    `);

    let totalRecords = await query(`SELECT count(*) FROM ${table} WHERE ${whereCondition}`) as any;;

    if(totalRecords && Object.values(totalRecords).length > 0) {
        totalRecords = Object.values(totalRecords[0])[0];
    }

    return paginatedResponse(records, totalRecords, limit, page);
}

const paginatedResponse = (records: any, totalRecords: any, limit: number, page: number) => {
    return {
        "data": records,
        "meta": {
            "current_page": page,
            "last_page": Math.ceil(totalRecords / limit),
            "per_page": limit,
            "total": totalRecords
        }
    }
}
  
export default query;