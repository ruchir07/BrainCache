import { createServer } from 'http';
import app from './app';

import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT);