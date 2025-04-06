import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import postRoute from './routes/post.route.js';

dotenv.config();

mongoose.connect(process.env.MONGO)
.then(() =>{
    console.log('DB terhubung');
})
.catch((err) => {
    console.log(err);
});

const app = express();

app.listen(3000, () => {
    console.log('Server berjalan di port 3000'); 
});

app.use(express.json());
app.use(cookieParser());

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoute);


app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error";
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});