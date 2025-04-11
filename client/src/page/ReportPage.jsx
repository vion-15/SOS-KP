import { useEffect, useState } from "react";
import { Button, Modal } from 'flowbite-react';

export default function ReportPage() {
    const [reportData, setReportData] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [isError, setIsError] = useState(false);

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

    if (!reportData) return <p>Loading...</p>;

    const handlePost = async (e) => {
        e.preventDefault();

        const dataToSend = {
            totalPenjualan: reportData.totalPenjualan,
            totalProfit: reportData.totalProfit,
            jumlahPelanggan: reportData.totalCustomer,
            menuFavorit: reportData.menuFavorit,
        };

        console.log(dataToSend);

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

    return (
        <div className="p-4 space-y-6">
            <h1 className="text-2xl font-bold">Laporan Harian</h1>
            <Button color="failure" onClick={handlePost}>Download Report</Button>

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
                                <td className="border px-2 py-1">{trx.isDone ? 'Done' : 'Proses'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
