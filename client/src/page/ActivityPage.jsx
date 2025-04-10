import { useEffect, useState } from 'react';
import SearchActivity from '../components/SearchActivity';

export default function Activity() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const res = await fetch('/api/report/getreport'); // Ganti sesuai endpointmu
                if (!res.ok) {
                    throw new Error('Gagal mengambil data laporan');
                }
                const data = await res.json();
                setReports(data);
            } catch (err) {
                console.error('Error:', err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    const handleDone = (id) => {
        // aksi jika order selesai (bisa diisi nanti)
        console.log(`Order ${id} selesai`);
    };

    if (loading) return <p className="p-4">Loading...</p>;

    return (
        <div className="p-6 space-y-4">
            <h2 className="text-2xl font-bold">Activity</h2>

            <SearchActivity />

            {reports.length === 0 ? (
                <p>Tidak ada laporan.</p>
            ) : (
                reports.map((report) => (
                    <div key={report._id} className="border rounded-lg p-4 shadow bg-white">
                        <div className="mb-2 flex justify-between items-center">
                            <h3 className="font-semibold text-lg">Order ID: {report.order_id}</h3>
                            <span className={`font-bold ${report.status_payment ? 'text-green-500' : 'text-red-500'}`}>
                                {report.status_payment ? 'PAID' : 'UNPAID'}
                            </span>
                        </div>
                        <p className="text-sm">Nama: <span className="font-medium">{report.username}</span></p>
                        <p className="text-sm">Meja: <span className="font-medium">{report.meja}</span></p>

                        <ul className="mt-2 list-disc pl-5">
                            {report.items.map((item, idx) => (
                                <li key={idx}>
                                    {item.judul} x {item.quantity}
                                </li>
                            ))}
                        </ul>

                        <p className="mt-2 text-sm font-semibold">
                            Total Harga: <span className="text-gray-800">Rp {report.totalHarga.toLocaleString('id-ID')}</span>
                        </p>

                        {report.status_payment && (
                            <button
                                onClick={() => handleDone(report._id)}
                                className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                                Done
                            </button>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}
