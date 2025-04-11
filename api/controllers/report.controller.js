import Report from "../models/report.model.js";
import { errorHandler } from "../utils/error.js";

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

