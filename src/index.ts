import Express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
const app = Express();

import { mainRouter } from './routes/v1';
import { port } from './config';
import './lib/db';
import { escapeBody } from './middleware/escapeBody';
import helmet from 'helmet';


// Middleware
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(escapeBody);

// Routes
app.use('/', mainRouter);

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});