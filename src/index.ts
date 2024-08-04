import express, {json} from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';

//routes
import routes from './routes/router';

// init app
const app = express();

dotenv.config();

//middleware
app.use(json());
app.use(helmet());
app.use(morgan('common'));

app.use('/api', routes);

app.listen(process.env.SERVER_PORT, () => {
    console.log(`app listening on port ${process.env.SERVER_PORT}`);
});