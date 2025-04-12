import { Navbar } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { FaPowerOff } from "react-icons/fa";
import SearchOverlay from './SearchOverlay';
import { useSelector } from 'react-redux';

export default function Header() {
    const currentUser = useSelector((state) => state.user.currentUser);
    const isAdminLogin = currentUser?.isAdmin === true;
    return (
        <header className='sticky top-0 z-50'>
            <Navbar className='border-b-2 flex 
            justify-between bg-gray-100'>

                <div className='flex flex-col w-full gap-3'>
                    <div className='flex flex-row justify-between 
                    w-full items-center'>
                        <Link to="/">
                        <div className="flex justify-center 
                        items-center text-lg font-bold gap-3
                        bg-white p-2 rounded-lg ">
                            <img src="/public/The kopi logo.jpeg" 
                            alt="logo"
                            className='w-11 h-11' />
                            THe Kopi
                        </div>
                        </Link>

                        <Link to={isAdminLogin ? '/menuAdmin' : '/AdminLogin'}>
                        <div className={`flex flex-row items-center
                        gap-2 bg-white px-5 py-2 rounded-full
                        ${isAdminLogin ? 'text-green-500' :  'text-red-500'}`}>
                            <h2>{isAdminLogin ? 'Open' : 'Closed'}</h2>
                            <FaPowerOff 
                            color={isAdminLogin? 'green' : 'red'}/>
                        </div>
                        </Link>
                    </div>
                    <div>
                        <SearchOverlay />
                    </div>
                </div>
            </Navbar>
        </header>
    )
}
