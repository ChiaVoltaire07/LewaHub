import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { requestLogger } from './middleware/requestLogger';
import { baseRateLimiter } from './middleware/rateLimiter';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import institutionsRouter from './routes/institutions.routes';

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN?.split(',') ?? '*',
    credentials: true,
  }),
);
app.use(express.json());
app.use(requestLogger);
app.use(baseRateLimiter);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/institutions', institutionsRouter);

// Part 2 and 3 mount their own routers here, e.g.:
// app.use('/api/auth', authRouter);
// app.use('/api/evaluations', evaluationsRouter);
// app.use('/api/search', searchRouter);

app.use(notFoundHandler);
app.use(errorHandler); // must stay last
