'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { showToast } from "../components/CustomToaster";
import { useEffect } from 'react';

import Cart from "./Cart";
import Sidebar from "./Sidebar";

const Navbar = () => {
  const { userData, setUserData, setIsLoggedIn, backendUrl, fetchAuth } = useContext(AppContext);
  const router = useRouter();

  const [counter, setCounter] = useState(0);

  const [showCart, setShowCart] = useState(false);
  const [showSidebar, setSidebar] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const items = JSON.parse(localStorage.getItem("cart")) || [];
      setCounter(items.length);
    }, 500);

    return () => clearInterval(interval);
  }, []);


  const handleLogout = async () => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/logout`, {}, { withCredentials: true });
      if (data.success) {
        showToast("success", data.message);
        setUserData(null);
        setIsLoggedIn(false);
        router.push('/login');
      } else {
        showToast("error", data.message);
      }
    } catch (err) {
      showToast("error", err.response?.data?.message || err.message || "Something went wrong");
    }
  };

  return (
    <>
      <nav className="fixed  top-0 z-30 flex items-center justify-between 
      w-full h-20 text-xl sm:text-2xl bg-neutral px-2.5 sm:px-5">

        <div className="flex items-center gap-2 sm:gap-6">
          <i
            onClick={() => setSidebar(true)}
            className="ri-menu-line font-bold cursor-pointer"
          ></i>

          <Link href={'/'}>
            <Image
              width={100}
              height={100}
              alt="logo"
              src="/logo.png"
            />
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-6">

          {userData ? (
            <>

              <div className='w-10 h-10 flex justify-center items-center rounded-full bg-gray text-white relative group'>
                {userData.name[0].toUpperCase()}
              </div>

              <button className=" flex items-center gap-2 bg-gray rounded-sm 
            py-1 sm:py-2.5 px-2 sm:px-5 cursor-pointer"
                onClick={handleLogout}
              >
                <i className="ri-logout-circle-r-line"></i>
              </button>
            </>


          ) : (

            <Link href="/login">
              <button className=" flex items-center gap-2 bg-gray rounded-sm 
            py-1 sm:py-2.5 px-2 sm:px-5 cursor-pointer">
                <i className="ri-account-circle-line"></i>
              </button>
            </Link>
          )}

          <button
            onClick={() => setShowCart(true)}
            className="relative bg-gray rounded-sm py-1 sm:py-2.5 px-2 sm:px-5 cursor-pointer">
            <i className="ri-shopping-bag-line"></i>
            {
              counter > 0 &&
            <span className="absolute flex items-center justify-center 
            -top-1 sm:top-1 -right-1 sm:right-1 bg-red 
            text-sm w-4 sm:w-5 h-4 sm:h-5 rounded-full">
              {counter}
            </span>
            }
          </button>
        </div>
      </nav>

      <Sidebar show={showSidebar} setShow={setSidebar} />
      <Cart show={showCart} setShow={setShowCart} />
    </>
  );
};

export default Navbar;
