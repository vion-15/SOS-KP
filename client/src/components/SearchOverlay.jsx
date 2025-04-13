import { Button, Modal } from "flowbite-react";
import { AiOutlineSearch } from 'react-icons/ai';
import { useState, useEffect } from "react";
import ProductGrid from "./CardProduk";

export default function SearchOverlay() {
    const [searchQuery, setSearchQuery] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [isFiltered, setIsFiltered] = useState(false);

    useEffect(() => {
        const fetchFilteredProducts = async () => {
            if (searchQuery.trim() === "") {
                setIsFiltered(false); // Tidak ada hasil pencarian
                setFilteredProducts([]); // Kosongkan produk
                return;
            }

            try {
                const res = await fetch(`/api/post/getposts?searchTerm=${searchQuery}`);
                const data = await res.json();
                setFilteredProducts(data.posts);
                setIsFiltered(true);
            } catch (err) {
                console.error("Gagal fetch hasil pencarian:", err);
            }
        };

        fetchFilteredProducts();
    }, [searchQuery]);

    return (
        <>
            <Modal show={showSearch} onClose={() => setShowSearch(false)} size="xl">
                <Modal.Header>Pencarian Menu</Modal.Header>
                <Modal.Body>
                    <input
                        type="text"
                        autoFocus
                        placeholder="Cari menu..."
                        className="w-full p-2 border border-gray-300 rounded-md mb-4"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />

                    <ProductGrid
                        products={filteredProducts}
                        isFiltered={isFiltered}
                    />
                </Modal.Body>
            </Modal>

            <Button
                color="gray"
                size="sm"
                className="text-gray-500 shadow-lg w-full"
                onClick={() => setShowSearch(true)}
            >
                <AiOutlineSearch className="w-5 h-5 mr-2" />
                Search...
            </Button>
        </>
    );
}
