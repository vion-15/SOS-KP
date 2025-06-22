import axios from 'axios';

export const createTransaction = async (req, res) => {
    try {
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

        const response = await axios.post(
            'https://app.sandbox.midtrans.com/snap/v1/transactions',
            parameter,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + Buffer.from(process.env.MIDTRANS_SERVER_KEY + ':').toString('base64'),
                },
            }
        );

        const { token } = response.data;

        res.status(200).json({ token, order_id: orderId });

    } catch (error) {
        console.error("Gagal membuat transaksi:", error);
        res.status(500).json({
            success: false,
            message: "Gagal membuat transaksi",
            error: error.message,
        });
    }
};
