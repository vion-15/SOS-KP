import { Modal, Button } from "flowbite-react";
import { useEffect, useState } from "react";

export default function CartModal({ openModal, setOpenModal }) {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        if (openModal) {
            fetchCartItems();
        }
    }, [openModal]);

    const fetchCartItems = async () => {
        try {
            const res = await fetch("/api/cart/getItems");
            const data = await res.json();
            setCartItems(data);
        } catch (err) {
            console.error("Gagal fetch keranjang:", err);
        }
    };

    const handleIncrease = async (id) => {
        await fetch(`/api/cart/increase/${id}`, { method: "PUT" });
        fetchCartItems();
    };

    const handleDecrease = async (id) => {
        await fetch(`/api/cart/decrease/${id}`, { method: "PUT" });
        fetchCartItems();
    };

    return (
        <Modal show={openModal} onClose={() => setOpenModal(false)}>
            <Modal.Header>Keranjang Belanja</Modal.Header>
            <Modal.Body>
                {cartItems.length === 0 ? (
                    <p className="text-gray-500">Keranjang kosong</p>
                ) : (
                    <div className="space-y-4">
                        {cartItems.map((item) => (
                            <div
                                key={item._id}
                                className="flex justify-between items-center border-b pb-2"
                            >
                                <div>
                                    <p className="font-semibold">{item.judul}</p>
                                    <p className="text-sm text-gray-600">
                                        Rp {item.harga.toLocaleString()} x {item.quantity}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Button
                                            size="xs"
                                            onClick={() => handleDecrease(item._id)}
                                            color="gray"
                                        >
                                            -
                                        </Button>
                                        <span>{item.quantity}</span>
                                        <Button
                                            size="xs"
                                            onClick={() => handleIncrease(item._id)}
                                            color="gray"
                                        >
                                            +
                                        </Button>
                                    </div>
                                </div>
                                <p className="font-bold text-right">
                                    Rp {(item.harga * item.quantity).toLocaleString()}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={() => setOpenModal(false)}>Tutup</Button>
            </Modal.Footer>
        </Modal>
    );
}
