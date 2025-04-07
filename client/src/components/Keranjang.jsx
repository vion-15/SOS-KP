import { Button, Modal } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiShoppingBag } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import { removeItemFromCart, selectCartCount, setCartItems } from "../redux/keranjang/keranjangSlice";
import { useNavigate } from "react-router-dom";

export default function Keranjang() {
    const [showModal, setShowModal] = useState(false);
    const cartItems = useSelector((state) => state.cart.cartItems);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    console.log(cartItems);
    const cartCount = useSelector(selectCartCount);
    
    const handleList = () => {
        setShowModal(true);
    };

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const res = await fetch('/api/cart/getItems');
                const data = await res.json();
                if(res.ok){
                    dispatch(setCartItems(data));
                    console.log(data);
                }
            } catch (error) {
                console.error("Gagal memuat keranjang", error);
            }
        };

        fetchCartItems();
    }, [dispatch]);

    const handleDecrease = (id) => {
        const updatedItems = cartItems.map((item) => {
            if (item._id === id) {
                if (item.quantity > 0) {
                    return {
                        ...item,
                        quantity: item.quantity - 1,
                        stock: item.stock + 1, // Mengembalikan stok
                    };
                } else {
                    alert("Quantity tidak bisa kurang dari 0");
                }
            }
            return item;
        });
        dispatch(setCartItems(updatedItems)); // Perbarui cartItems di Redux
    };

    const handleIncrease = (id) => {
        const updatedItems = cartItems.map((item) => {
            if (item._id === id) {
                if (item.stock > 0) {
                    return {
                        ...item,
                        quantity: item.quantity + 1,
                        stock: item.stock - 1, // Mengurangi stok
                    };
                } else {
                    alert("Stok tidak mencukupi");
                }
            }
            return item;
        });
        dispatch(setCartItems(updatedItems)); // Perbarui cartItems di Redux
    };

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`/api/cart/deletelist/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) {
                throw new Error("Gagal menghapus item dari keranjang");
            }
            dispatch(removeItemFromCart(id));
        } catch (error) {
            console.error(error);
        }
    };

    const getTotalKeranjang = () => {
        return cartItems.reduce((total, post) => {
            return total + getTotalHarga(post.harga, post.quantity);
        }, 0);
    };

    const getTotalHarga = (harga, quantity) => {
        return harga * quantity;
    };

    const handleUpdate = async (itemId, stock, quantity) => {
        console.log(itemId);
        console.log(stock);
        console.log(quantity);
        try {
            const res = await fetch(`/api/post/update/${itemId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    stock: stock,
                    quantity: quantity,
                }),
            });

            if (res.ok) {
                console.log("Data berhasil diperbarui");
            } else {
                console.error("Gagal memperbarui data");
            }
        } catch (error) {
            console.error("Error dalam proses update:", error);
        }
    };

    const handlePost = async (quantity) => {
        // Mengambil semua item dari keranjang
        const itemsToPost = cartItems.map((item) => ({
            id: item._id,
            judul: item.judul,
            quantity: item.quantity,
            stock: item.stock,
            harga: item.harga,
            totalHargaItem: getTotalHarga(item.harga, item.quantity), // Total harga untuk item ini
        }));

        console.log(itemsToPost);

        console.log(cartItems);

        // Menghitung total harga keseluruhan
        const totalHarga = getTotalKeranjang();

        try {
            const res = await fetch(`/api/report/laporan`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items: itemsToPost, // Semua item dalam satu array
                    totalHarga: totalHarga,
                    quantity: quantity, // Total harga keseluruhan
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
            }
            if (res.ok) {
                console.log("Sukses mengirim data:", data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <Button
                onClick={handleList}
                className={`fixed bottom-5 left-5 z-10 p-3 rounded-full
                shadow-lg transition-opacity duration-300`}>
                <HiShoppingBag />
                {cartCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full">
                        {cartCount}
                    </span>
                )}
            </Button>
            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <Modal.Header>Keranjang Belanja</Modal.Header>
                <Modal.Body>
                    {cartItems.length > 0 ? (
                        <>
                            {cartItems.map((post, index) => (
                                <div key={index} className="flex items-center gap-4 p-3 border-b">
                                    <img
                                        src={post.image}
                                        alt="gambar"
                                        className="w-16 h-16 rounded-md object-cover"
                                    />
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-gray-800">{post.judul}</p>
                                        <p className="text-sm text-gray-500">Stok : {post.stock}</p>
                                        <p className="text-sm text-gray-500">Rp {post.harga}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Button
                                                onClick={() => handleDecrease(post._id)}
                                                className="p-1 bg-gray-200 text-gray-600 rounded-full"
                                            >
                                                -
                                            </Button>
                                            <p className="text-sm">{post.quantity}</p>
                                            <Button
                                                onClick={() => handleIncrease(post._id)}
                                                className="px-2 p-1 bg-gray-200 text-gray-600 rounded-full"
                                            >
                                                +
                                            </Button>
                                            <span
                                                className="ml-5 text-red-600 cursor-pointer"
                                                onClick={() => handleDelete(post._id)}
                                            >
                                                Delete
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <p className="text-sm font-semibold">
                                            Total: Rp {getTotalHarga(post.harga, post.quantity)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            <div className="flex justify-between items-center py-4">
                                <p className="font-semibold text-lg">Total: Rp {getTotalKeranjang()}</p>
                                <Button
                                    onClick={async () => {
                                        try {
                                            for (const item of cartItems) {
                                                // Update item
                                                await handleUpdate(item._id, item.stock, item.quantity);

                                                // Kirim data ke server
                                                await handlePost(item.quantity);

                                                // Hapus item setelah proses selesai
                                                await handleDelete(item._id);
                                            }

                                            // Pindahkan navigasi dan alert di luar loop
                                            navigate('/');
                                            alert("Pesanan Diterima");
                                        } catch (error) {
                                            console.error("Terjadi kesalahan:", error);
                                        }
                                    }}
                                >
                                    Bayar
                                </Button>

                            </div>
                        </>
                    ) : (
                        <p>Keranjang kosong</p>
                    )}
                </Modal.Body>
            </Modal>
        </>
    )
}
