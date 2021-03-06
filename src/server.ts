import fs from 'fs';
import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import 'colors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import xss from 'xss-clean';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import cors from 'cors';
import { get } from 'lodash';
import { checkConn } from './utils';
import { router as apiRoutes } from './routes';
import { errorHandler } from './middleware';

dotenv.config({ path: 'config/config.env' });

// Init express
const app = express();

// Check connection to db
checkConn();

// Express json parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 200,
    message: { success: false, error: 'Request limit exceeded, please try again later.' },
});

app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors());

// Mount routers
app.use('/api', apiRoutes);

// Mount error handler
app.use(errorHandler);

// Set static folder
app.use(express.static(path.resolve(__dirname, '..', 'client', 'build')));
app.use(express.static(path.resolve(__dirname, '..', 'public')));

// Serve frontend homepage
app.get('*', (req, res) => {
    const homePath = path.resolve(__dirname, '..', 'client', 'build', 'index.html');
    const apiDocsPath = path.resolve(__dirname, '..', 'public', 'api-docs', 'index.html');
    const pathToServe = fs.existsSync(homePath) ? homePath : apiDocsPath;
    res.sendFile(pathToServe);
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Unhandled Error: ${get(err, 'message')}`.bgRed);
    // Close server & exit process
    server.close(() => process.exit(1));
});
