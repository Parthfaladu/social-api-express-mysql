import 'dotenv/config'

interface DBConfig {
    host: string;
    user: string;
    password: string;
    database: string;
}

const config = {
    db: {
      /* don't expose password or any sensitive info, done only for demo */
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      connectTimeout: 60000
    } as DBConfig
};
  
export default config;