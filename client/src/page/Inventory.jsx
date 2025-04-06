import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Modal, Table, Button } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function Inventory() {
    const { currentUser } = useSelector((state) => state.user);
    const [userPosts, setUserPosts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [postIdToDelete, setPostIdToDelete] = useState('');
    const [showMore, setShowMore] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
                const data = await res.json();
                if (res.ok) {
                    setUserPosts(data.posts)
                    if (data.posts.length < 9) {
                        setShowMore(false);
                    }
                }
            } catch (error) {
                console.log(error);
            }
        };

        if (currentUser.isAdmin) {
            fetchPosts();
        }

    }, [currentUser._id]);

    const handleShowMore = async () => {
        const startIndex = userPosts.length;
        try {
            const res = await fetch(`/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`);
            const data = await res.json();
            if (res.ok) {
                setUserPosts((prev) => [...prev, ...data.posts]);
                if (data.posts.length < 9) {
                    setShowMore(false);
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleDeletePost = async () => {
        setShowModal(false);
        try {
            const res = await fetch(`/api/post/deleteposts/${postIdToDelete}/${currentUser._id}`,
                {
                    method: 'DELETE',
                }
            );
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
            } else {
                setUserPosts((prev) => prev.filter((post) => post._id !== postIdToDelete));
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300
        dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
            <h1 className="text-2xl font-bold mb-4">Dashboard Menu</h1>
            <Link to='/tambah-menu'>
            <Button gradientDuoTone='purpleToBlue' className='mb-5' outline>
                Tambah Menu Baru
            </Button>
            </Link>
            {currentUser.isAdmin && userPosts.length > 0 ? (
                <>
                    <Table hoverable className='shadow-md'>
                        <Table.Head>
                            <Table.HeadCell>Date Updated</Table.HeadCell>
                            <Table.HeadCell>Gambar</Table.HeadCell>
                            <Table.HeadCell>Nama</Table.HeadCell>
                            <Table.HeadCell>Kategori</Table.HeadCell>
                            <Table.HeadCell>Harga</Table.HeadCell>
                            <Table.HeadCell>Stock</Table.HeadCell>
                            <Table.HeadCell>Promo</Table.HeadCell>
                            <Table.HeadCell>Delete</Table.HeadCell>
                            <Table.HeadCell>
                                <span>Edit</span>
                            </Table.HeadCell>
                        </Table.Head>
                        {userPosts.map((post, index) => (
                            <Table.Body key={index} className='divide-y'>
                                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>

                                    <Table.Cell>{new Date(post.updatedAt).toLocaleDateString()}</Table.Cell>

                                    <Table.Cell>
                                        <img src={post.image} alt={post.judul} className='w-20 h-10 object-cover bg-gray-500' />
                                    </Table.Cell>

                                    <Table.Cell>
                                        {post.judul}
                                    </Table.Cell>

                                    <Table.Cell>{post.category}</Table.Cell>

                                    <Table.Cell>{post.harga}</Table.Cell>

                                    <Table.Cell>{post.stock}</Table.Cell>

                                    <Table.Cell>{post.promo}</Table.Cell>

                                    <Table.Cell>
                                        <span onClick={() => {
                                            setShowModal(true);
                                            setPostIdToDelete(post._id);
                                        }} className='font-medium text-red-500 hover:underline cursor-pointer'>
                                            Delete
                                        </span>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Link className='text-teal-500 hover:underline' to={`/update-post/${post._id}`}>
                                            <span>Edit</span>
                                        </Link>
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        ))}
                    </Table>
                    {showMore && (
                        <button className='w-full text-teal-500 self-center text-sm py-7' onClick={handleShowMore}>Show more</button>
                    )}
                </>
            ) : (
                <p>Kamu belum memposting apapun</p>
            )}
            <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                            Yakin mau menghapus Menu ini ?
                        </h3>
                        <div className="flex justify-center gap-5">
                            <Button color='failure' onClick={handleDeletePost}>
                                Ya, Saya yakin.
                            </Button>
                            <Button color='gray' onClick={() => setShowModal(false)}>
                                Tidak jadi.
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}
