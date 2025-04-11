import DayReport from '../models/dayReport.model.js';

// SIMPAN DATA LAPORAN HARI INI
export const saveDayReport = async (req, res) => {
    try {
        const { totalPenjualan, totalProfit, jumlahPelanggan, menuFavorit, jumlahQuantity } = req.body;

        const newReport = new DayReport({
            totalPenjualan,
            totalProfit,
            jumlahPelanggan,
            menuFavorit,
            jumlahQuantity,
        });

        await newReport.save();
        res.status(201).json({ message: "Laporan harian berhasil disimpan" });
    } catch (error) {
        res.status(500).json({ message: "Gagal menyimpan laporan", error: error.message });
    }
};

// AMBIL LAPORAN HARI INI
export const getTodayReport = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const report = await DayReport.findOne({
            createdAt: {
                $gte: today,
                $lt: tomorrow
            }
        });

        if (!report) return res.status(200).json({
            totalPenjualan: 0,
            totalProfit: 0,
            jumlahPelanggan: 0,
            menuFavorit: "-"
        });

        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil laporan hari ini", error: error.message });
    }
};

// AMBIL LAPORAN KEMARIN
export const getYesterdayReport = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        const report = await DayReport.findOne({
            createdAt: {
                $gte: yesterday,
                $lt: today
            }
        });

        if (!report) return res.status(200).json({
            totalPenjualan: 0,
            totalProfit: 0,
            jumlahPelanggan: 0,
            menuFavorit: "-"
        });

        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil laporan kemarin", error: error.message });
    }
};

// AMBIL LAPORAN BERDASARKAN TANGGAL
export const getReportByDate = async (req, res) => {
    try {
        const { date } = req.params; // Format: YYYY-MM-DD
        const selectedDate = new Date(date);
        selectedDate.setHours(0, 0, 0, 0);

        const nextDay = new Date(selectedDate);
        nextDay.setDate(selectedDate.getDate() + 1);

        const report = await DayReport.findOne({
            createdAt: {
                $gte: selectedDate,
                $lt: nextDay
            }
        });

        if (!report) {
            return res.status(200).json({
                totalPenjualan: 0,
                totalProfit: 0,
                jumlahPelanggan: 0,
                menuFavorit: "-"
            });
        }

        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil laporan", error: error.message });
    }
};

export const getAllReports = async (req, res, next) => {
    try {
        const reports = await DayReport.find().sort({ createdAt: -1 }); // sort biar yang terbaru di atas
        res.status(200).json(reports);
    } catch (error) {
        next(errorHandler(500, 'Gagal mengambil laporan'));
    }
};

