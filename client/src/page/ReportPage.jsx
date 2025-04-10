import { useEffect, useState } from "react";

export default function ReportPage() {
    const [reportData, setReportData] = useState(null);

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

    console.log(reportData);

    if (!reportData) return <p>Loading...</p>;

    return (
        <div className="p-4 space-y-6">
            <h1 className="text-2xl font-bold">Laporan Harian</h1>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-white shadow rounded-xl">
                    <p className="text-gray-500 text-sm">Total Penjualan</p>
                    <p className="text-xl font-bold">Rp {reportData.totalPenjualan}</p>
                </div>

                <div className="p-4 bg-white shadow rounded-xl">
                    <p className="text-gray-500 text-sm">Total Profit</p>
                    <p className="text-xl font-bold">Rp {reportData.totalProfit}</p>
                </div>

                <div className="p-4 bg-white shadow rounded-xl">
                    <p className="text-gray-500 text-sm">Jumlah Customer</p>
                    <p className="text-xl font-bold">{reportData.totalCustomer}</p>
                </div>

                <div className="p-4 bg-white shadow rounded-xl">
                    <p className="text-gray-500 text-sm">Menu Favorit</p>
                    <p className="text-xl font-bold">{reportData.menuFavorit}</p>
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
                        {reportData.transaksi.map((trx) => (
                            <tr key={trx._id}>
                                <td className="border px-2 py-1">{trx.order_id}</td>
                                <td className="border px-2 py-1">{trx.username}</td>
                                <td className="border px-2 py-1">{trx.meja}</td>
                                <td className="border px-2 py-1">Rp {trx.totalHarga}</td>
                                <td className="border px-2 py-1">{trx.isDone === true ? 'Done' : 'Proses'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
