import { useEffect, useState } from "react";
import { Button, Modal } from 'flowbite-react';
import { Link } from "react-router-dom";

export default function ReportPage() {
    const [reportData, setReportData] = useState(null);
    const [dayData, setDayData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [todayReport, setTodayReport] = useState(null);
    const [yesterdayReport, setYesterdayReport] = useState(null);
    const [showAllTransactions, setShowAllTransactions] = useState(false);

    useEffect(() => {
        const fetchReportData = async () => {
            try {
                const res = await fetch("/api/report/getallreport");
                const data = await res.json();
                setReportData(data);
            } catch (error) {
                console.error("Gagal fetch report:", error.message);
            }
        };

        fetchReportData();
    }, []);

    useEffect(() => {
        const fetchCompareData = async () => {
            try {
                const resToday = await fetch("/api/report/today");
                const resYesterday = await fetch("/api/dayReport/yesterday");

                const today = await resToday.json();
                const yesterday = await resYesterday.json();

                setTodayReport(today);
                setYesterdayReport(yesterday);
            } catch (err) {
                console.error("Gagal ambil data perbandingan:", err);
            }
        };

        fetchCompareData();
    }, []);

    useEffect(() => {
        const dayReport = async () => {
            try {
                const res = await fetch("/api/dayReport/getdayreport");
                const data = await res.json();
                setDayData(data);
            } catch (error) {
                console.error("Gagal fetch report:", error.message);
            }
        };
        dayReport();
    }, []);

    const getDifference = (todayVal, yesterdayVal) => {
        if (todayVal == null || yesterdayVal == null) return "-";
        const diff = todayVal - yesterdayVal;
        const isUp = diff >= 0;
        const color = isUp ? "text-green-600" : "text-red-600";
        return <span className={`text-sm ${color}`}>{isUp ? "↑" : "↓"} {Math.abs(diff)}</span>;
    };

    if (!reportData) return <p>Loading...</p>;

    const handlePost = async () => {

        const dataToSend = {
            totalPenjualan: reportData.totalPenjualan,
            totalProfit: reportData.totalProfit,
            jumlahPelanggan: reportData.totalCustomer,
            menuFavorit: reportData.menuFavorit,
            jumlahQuantity: reportData.totalFavoritQuantity,
        };

        try {
            const res = await fetch('/api/dayReport/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });
            const data = await res.json();
            if (!res.ok) {
                setModalMessage(data.message || "Terjadi kesalahan");
                setIsError(true);
                setShowModal(true);
                return;
            }

            setModalMessage("Laporan berhasil disimpan!");
            setIsError(false);
            setShowModal(true);
        } catch (error) {
            setModalMessage("Ada yang tidak benar");
            setIsError(true);
            setShowModal(true);
            console.log(error);
        }
    };

    const handleDelete = async () => {
        try {
            const res = await fetch('/api/report/deleteorder', {
                method: 'DELETE',
            });

            const data = await res.json();

            if (res.ok) {
                console.log(data.message); // atau tampilkan notifikasi sukses
            } else {
                console.error(data.message);
            }
        } catch (err) {
            console.error('Failed to delete reports:', err);
        }
    };


    return (
        <div className="p-6 space-y-6">
            <div className='flex flex-row justify-between'>
                <h2 className="text-2xl font-bold">Laporan/day</h2>
                <Link to='/menuAdmin'>
                    <p className='text-lg'>Back</p>
                </Link>
            </div>
            <Button color="failure" onClick={async () => {
                await handlePost();
                await handleDelete();
            }}>
                Download Report
            </Button>

            {/* Modal */}
            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <Modal.Header>{isError ? "Gagal" : "Berhasil"}</Modal.Header>
                <Modal.Body>
                    <div className={`text-center text-${isError ? "red" : "green"}-600`}>
                        {modalMessage}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setShowModal(false)}>Tutup</Button>
                </Modal.Footer>
            </Modal>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Card data */}
                <div className="p-4 bg-white shadow rounded-xl">
                    <p className="text-gray-500 text-sm">Total Penjualan</p>
                    <p className="text-xl font-bold">Rp {reportData.totalPenjualan}</p>
                    {todayReport && yesterdayReport && (
                        <p className="text-sm text-gray-500">
                            {getDifference(todayReport.totalPenjualan, yesterdayReport.totalPenjualan)}{" "}
                            (
                            {yesterdayReport.totalPenjualan === 0
                                ? "100%" :
                                `${Math.abs(
                                    (
                                        ((todayReport.totalPenjualan - yesterdayReport.totalPenjualan) / yesterdayReport.totalPenjualan) * 100
                                    ).toFixed(2)
                                )}%`
                            }
                            )
                        </p>
                    )}
                </div>

                <div className="p-4 bg-white shadow rounded-xl">
                    <p className="text-gray-500 text-sm">Total Profit</p>
                    <p className="text-xl font-bold">Rp {reportData.totalProfit}</p>
                    {todayReport && yesterdayReport && (
                        <p className="text-sm text-gray-500">
                            {getDifference(todayReport.totalProfit, yesterdayReport.totalProfit)}{" "}
                            (
                            {yesterdayReport.totalProfit === 0
                                ? "100%" :
                                `${Math.abs(
                                    (
                                        ((todayReport.totalProfit - yesterdayReport.totalProfit) / yesterdayReport.totalProfit) * 100
                                    ).toFixed(2)
                                )}%`
                            }
                            )
                        </p>
                    )}
                </div>

                <div className="p-4 bg-white shadow rounded-xl">
                    <p className="text-gray-500 text-sm">Jumlah Customer</p>
                    <p className="text-xl font-bold">{reportData.totalCustomer}</p>
                    {todayReport && yesterdayReport && (
                        <p className="text-sm text-gray-500">
                            {getDifference(todayReport.jumlahPelanggan, yesterdayReport.jumlahPelanggan)}{" "}
                            (
                            {yesterdayReport.jumlahPelanggan === 0
                                ? "100%" :
                                `${Math.abs(
                                    (
                                        ((todayReport.jumlahPelanggan - yesterdayReport.jumlahPelanggan) / yesterdayReport.jumlahPelanggan) * 100
                                    ).toFixed(2)
                                )}%`
                            }
                            )
                        </p>
                    )}
                </div>

                <div className="p-4 bg-white shadow rounded-xl">
                    <p className="text-gray-500 text-sm">Menu Favorit</p>
                    <p className="text-xl font-bold">{reportData.menuFavorit}</p>
                    <p><span className="font-semibold">{reportData.totalFavoritQuantity}</span> pcs</p>
                </div>
            </div>

            <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">Semua Transaksi Hari Ini</h2>
                <table className="w-full text-sm border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-2 py-1">Order ID</th>
                            <th className="border px-2 py-1">Nama</th>
                            <th className="border px-2 py-1">Meja</th>
                            <th className="border px-2 py-1">Total</th>
                            <th className="border px-2 py-1">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(showAllTransactions ? reportData.transaksi : reportData.transaksi.slice(0, 5)).map((trx) => (
                            <tr key={trx._id}>
                                <td className="border px-2 py-1">{trx.order_id}</td>
                                <td className="border px-2 py-1">{trx.username}</td>
                                <td className="border px-2 py-1">{trx.meja}</td>
                                <td className="border px-2 py-1">Rp {trx.totalHarga}</td>
                                <td className="border px-2 py-1">{trx.isDone ? 'Done' : 'Proses'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {reportData.transaksi.length > 5 && (
                    <div className="text-center mt-2">
                        <Button size="xs" onClick={() => setShowAllTransactions(!showAllTransactions)}>
                            {showAllTransactions ? "Show Less" : "Show More"}
                        </Button>
                    </div>
                )}
            </div>

            <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">Semua Laporan</h2>
                <table className="w-full text-sm border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-2 py-1">Tanggal</th>
                            <th className="border px-2 py-1">Total Penjualan</th>
                            <th className="border px-2 py-1">Total Profit</th>
                            <th className="border px-2 py-1">Jumlah Customer</th>
                            <th className="border px-2 py-1">Menu Favorit</th>
                            <th className="border px-2 py-1">Jumlah Terjual</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(showAllTransactions ? dayData : dayData.slice(0, 5)).map((trx) => (
                            <tr key={trx._id}>
                                <td className="border px-2 py-1">{new Date(trx.createdAt).toLocaleDateString("id-ID")}</td>
                                <td className="border px-2 py-1">{trx.totalPenjualan}</td>
                                <td className="border px-2 py-1">{trx.totalProfit}</td>
                                <td className="border px-2 py-1">{trx.jumlahPelanggan}</td>
                                <td className="border px-2 py-1">{trx.menuFavorit}</td>
                                <td className="border px-2 py-1">{trx.jumlahQuantity}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {dayData.length > 5 && (
                    <div className="mt-2 flex justify-center">
                        <Button size="xs" onClick={() => setShowAllTransactions(!showAllTransactions)}>
                            {showAllTransactions ? "Show Less" : "Show More"}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
