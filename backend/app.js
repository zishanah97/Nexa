import express from 'express'
import cors from 'cors'
import connect from './Db/connect.js'
import dotenv from 'dotenv'


//routes
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import recommendationRoutes from './routes/recommendRoutes.js';
import imageRoutes from './routes/imageRoutes.js';

//start express 
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cors())

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/recommendations", recommendationRoutes)
app.use("/api/v1/images", imageRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const start = async () => {
  try {
    const conn = process.env.CONNECTION_STRING;
    if (conn) {
      await connect(conn);
      console.log('Database connected');
    } else {
      console.warn('No CONNECTION_STRING provided. Starting server without DB.');
    }
  } catch (error) {
    console.warn('DB connection failed, starting server anyway:', error.message);
  }
  app.listen(PORT, () =>
    console.log(`Server is listening on http://localhost:${PORT}`)
  );
};

start();