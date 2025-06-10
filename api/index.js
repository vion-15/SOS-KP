import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import postRoute from './routes/post.route.js';
import cartRoute from './routes/cart.route.js';
import reportRoute from './routes/report.route.js';
import paymentRoutes from './routes/payment.route.js';
import dayReportRoute from './routes/dayReport.route.js';
import storeStatusRoute from './routes/storeStatus.route.js';
import path from 'path';


dotenv.config();

mongoose.connect(process.env.MONGO)
.then(() =>{
    console.log('DB terhubung');
})
.catch((err) => {
    console.log(err);
});

const __dirname = path.resolve();

const app = express();

app.listen(3000, () => {
    console.log('Server berjalan di port 3000'); 
});

app.use(express.json());
app.use(cookieParser());

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoute);
app.use('/api/cart', cartRoute);
app.use('/api/report', reportRoute);
app.use('/api/payment', paymentRoutes);
app.use('/api/dayReport', dayReportRoute);
app.use('/api/store', storeStatusRoute);

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error";
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});