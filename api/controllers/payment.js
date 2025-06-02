import midtransClient from 'midtrans-client';

export const createTransaction = async (req, res) => {
    try {
        const snap = new midtransClient.Snap({
            isProduction: false,
            serverKey: process.env.MIDTRANS_SERVER_KEY,
        });
        
        const { username, meja, totalHarga, items } = req.body;

        const orderId = `ORDER-${Math.floor(Math.random() * 1000000)}`;

        const parameter = {
            transaction_details: {
                order_id: orderId,
                gross_amount: totalHarga,
            },
            customer_details: {
                first_name: username,
                table_number: meja,
            },
            item_details: items.map((item) => ({
                id: item.id,
                price: item.harga,
                quantity: item.quantity,
                name: item.judul,
            })),
        };

        const transaction = await snap.createTransaction(parameter);
        const snapToken = transaction.token;
        res.status(200).json({ token: snapToken, order_id: orderId });

    } catch (error) {
        console.error("Gagal membuat transaksi:", error); 
        res.status(500).json({
            success: false,
            message: "Gagal membuat transaksi",
            error: error.message, 
        });
    }
};
