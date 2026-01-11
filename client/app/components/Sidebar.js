"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { AppContext } from '../context/AppContext';
import { showToast } from "../components/CustomToaster";
import { useContext } from 'react'

import axios from 'axios';
import { useRouter } from 'next/navigation';

const Sidebar = ({ show, setShow }) => {
  const { userData, setUserData, backendUrl } = useContext(AppContext);
  const router = useRouter();

  const handleLogout = async () => {
    setShow(false)
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
    <div
      className={`fixed z-40 inset-0 bg-black/40 
      transition-opacity duration-300  
      ${show ? "opacity-100" : "opacity-0 pointer-events-none"}`}>

      <div
        className={`fixed left-0 top-0 
        flex flex-col gap-4 w-3/4 sm:w-1/4 h-full py-6 px-3
       bg-neutral transform transition-transform duration-300
        ${show ? "translate-x-0" : "-translate-x-full"}`}
      >
        <i
          className="ri-arrow-left-s-line absolute top-7 right-4
          text-yellow text-4xl cursor-pointer"
          onClick={() => setShow(false)}
        ></i>



        {userData ? (
          <div className="flex gap-4 px-2 items-center">
            <div className='w-14 h-14 flex justify-center items-center rounded-full 
              bg-gray text-white relative group'>
              {userData.name[0].toUpperCase()}
            </div>

            <div className="font-bold text-xl" >{userData.name}</div>
          </div>

        ) : (
          <>
            <Link
              href={'/login'}
              onClick={() => setShow(false)}
              className="flex items-center gap-2 p-3 w-3/4
            hover:bg-gray text-lg rounded-sm cursor-pointer
             transition-all duration-300 hover:-translate-y-1"
            >
              <span className="flex items-center justify-center bg-red px-2 py-1 rounded-xs">
                <i className="ri-logout-circle-r-line"></i>
              </span>
              Login
            </Link>

          </>
        )}


        <span className="bg-gray h-0.5 my-2 mb-10"></span>

        <div className="flex flex-col gap-3 mt-2">

          <Link onClick={() => setShow(false)}
            href={"/store-locator"}
            className="flex items-center gap-2 p-3 w-full
            hover:bg-gray text-lg rounded-sm cursor-pointer
             transition-all duration-300 hover:-translate-y-1"
          >
            <span className="flex items-center justify-center bg-red px-2 py-1 rounded-xs">
              <i className="ri-map-pin-2-line"></i>
            </span>
            Store Location
          </Link>

          <Link onClick={() => setShow(false)}
            href={"/#deals"}
            className="flex items-center gap-2 p-3 w-full
            hover:bg-gray text-lg rounded-sm cursor-pointer
             transition-all duration-300 hover:-translate-y-1"
          >
            <span className="flex items-center justify-center bg-red px-2 py-1 rounded-xs">
              <i className="ri-restaurant-2-line"></i>
            </span>
            Explore Menu
          </Link>

          {userData &&
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 p-3 w-full
          hover:bg-gray text-lg rounded-sm cursor-pointer
          transition-all duration-300 hover:-translate-y-1"
            >
              <span className="flex items-center justify-center bg-red px-2 py-1 rounded-xs">
                <i className="ri-logout-circle-r-line"></i>
              </span>
              Logout
            </button>
          }


        </div>
      </div>
    </div>
  );
};

export default Sidebar;