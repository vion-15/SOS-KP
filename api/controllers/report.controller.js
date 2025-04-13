import Report from "../models/report.model.js";
import { errorHandler } from "../utils/error.js";
import nodemailer from 'nodemailer';

export const sendEmailConfirmation = async (username, meja, email, items, totalHarga, order_id, tipe, jenis) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,  // Ganti dengan email kamu
            pass: process.env.EMAIL_PASS,   // Ganti dengan password email kamu
        },
    });

    // Membuat email konten
    const mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: `Pesanan #${order_id} Konfirmasi`,
        html: `
            <h1>Terima kasih, ${username}!</h1>
            <p>Pesanan Anda dengan ID #${order_id} telah berhasil diproses.</p>
            <h3>Detail Pesanan:</h3>
            <ul>
                ${items
                .map((item) => {
                    const tipe = item.tipe || "-";
                    const jenis = item.jenis || "-";
                    return `<li>${item.judul} - Qty: ${item.quantity} - Rp ${item.totalHargaItem} - Tipe: ${tipe} - Jenis: ${jenis}</li>`;
                })
                .join('')
    }
            </ul >
            <p><strong>Total Harga: Rp ${totalHarga}</strong></p>
            <p>Nomor Meja: ${meja}</p>
`,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        throw new Error('Gagal mengirim email konfirmasi');
    }
};


export const laporan = async (req, res, next) => {
    try {
        const { items, totalHarga, username, meja, email, order_id, status } = req.body;

        const status_payment = status === 'settlement' || status === 'capture' ? true : false;

        if (!username || !meja || !email) {
            return res.status(400).json({ message: 'Harus isi username, meja, dan email' });
        }

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'Items tidak boleh kosong' });
        }

        if (!totalHarga) {
            return res.status(400).json({ message: 'Total harga diperlukan' });
        }

        // Gunakan order_id untuk pencarian (jika unik)
        let laporan = await Report.findOne({ order_id });

        if (laporan) {
            const existingItemJudul = laporan.items.map(item => item.judul);
            const newItems = items.filter(item => !existingItemJudul.includes(item.judul));

            if (newItems.length > 0) {
                laporan.items.push(...newItems);
                laporan.totalHarga += totalHarga;
                laporan = await laporan.save();
            }
        } else {
            laporan = new Report({ username, meja, email, items, totalHarga, order_id, status_payment });
            await laporan.save();
        }

        await sendEmailConfirmation(username, meja, email, items, totalHarga, order_id);

        res.status(201).json(laporan);
    } catch (error) {
        next(error);
    }
};

export const getAllReports = async (req, res, next) => {
    try {
        const reports = await Report.find().sort({ createdAt: -1 }); // sort biar yang terbaru di atas
        res.status(200).json(reports);
    } catch (error) {
        next(errorHandler(500, 'Gagal mengambil laporan'));
    }
};

export const markReportAsDone = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updated = await Report.findByIdAndUpdate(
            id,
            { isDone: true },
            { new: true }
        );
        res.status(200).json(updated);
    } catch (err) {
        next(err);
    }
};

export const allReport = async (req, res, next) => {
    try {
        const reports = await Report.find({}).sort({ createdAt: -1 });

        const totalPenjualan = reports.reduce((acc, curr) => acc + curr.totalHarga, 0);
        const totalProfit = reports.reduce((acc, curr) => acc + (curr.totalHarga * 0.3), 0); // contoh 30% profit
        const totalCustomer = reports.length;

        // Hitung menu favorit
        const menuCount = {};
        reports.forEach(report => {
            report.items?.forEach(item => {
                if (item.judul) {
                    menuCount[item.judul] = (menuCount[item.judul] || 0) + item.quantity;
                }
            });
        });

        const menuFavorit = Object.entries(menuCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Belum ada';

        const totalFavoritQuantity = menuCount[menuFavorit] || 0;

        res.status(200).json({
            totalPenjualan,
            totalProfit,
            totalCustomer,
            menuFavorit,
            totalFavoritQuantity,
            transaksi: reports,
        });
    } catch (error) {
        next(errorHandler(500, 'Gagal mengambil ringkasan laporan'));
    }
};

export const deleteOrder = async (req, res, next) => {
    try {
        await Report.deleteMany({});
        res.status(200).json({ message: 'Semua data report berhasil dihapus.' });
    } catch (error) {
        console.error('Error saat menghapus data report:', error);
        res.status(500).json({ message: 'Gagal menghapus data report.' });
    }
};

export const getTodayReport = async (req, res, next) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const reports = await Report.find({
            createdAt: { $gte: today, $lt: tomorrow }
        });

        const totalPenjualan = reports.reduce((acc, curr) => acc + curr.totalHarga, 0);
        const totalProfit = reports.reduce((acc, curr) => acc + (curr.totalHarga * 0.3), 0); // misal profit 30%
        const totalCustomer = reports.length;

        const menuCount = {};
        reports.forEach(report => {
            report.items?.forEach(item => {
                if (item.judul) {
                    menuCount[item.judul] = (menuCount[item.judul] || 0) + item.quantity;
                }
            });
        });

        const menuFavorit = Object.entries(menuCount).sort((a, b) => b[1] - a[1])[0]?.[0] || '-';

        res.status(200).json({
            totalPenjualan,
            totalProfit,
            jumlahPelanggan: totalCustomer,
            menuFavorit
        });

    } catch (error) {
        next(errorHandler(500, "Gagal mengambil laporan hari ini"));
    }
};


