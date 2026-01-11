"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import CustomToaster, { showToast } from "@/app/components/CustomToaster";

export default function CodeVerification({ show, setShow }) {
    
    const [otp, setOtp] = useState(new Array(4).fill(""));
    const inputRefs = useRef([]);
    const [timer, setTimer] = useState(60);
    const router = useRouter();

    

    useEffect(() => {
        if (timer > 0) {
            const countdown = setTimeout(() => setTimer(timer - 1), 1000);
            return () => clearTimeout(countdown);
        }
    }, [timer]);

    const handleChange = (value, index) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < otp.length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleVerify = () => {
        const entered = otp.join("");
        if (entered === "1234") {
            showToast("success", "Email verified successfully!");
            setTimeout(() => {
                router.push("/");
                setShow(false);
            }, 1500);
        } else {
            showToast("error", "Invalid code. Please try again!");
        }
    };

    const handleResend = () => {
        setOtp(new Array(4).fill(""));
        setTimer(60);
        showToast("success", "Code resent!");
    };

    return (
        <>
            <div
                className={`fixed inset-0 flex items-center justify-center 
              bg-neutral/40 backdrop-blur-sm z-40 
                transition-opacity duration-300 ease-out
                ${show ? "opacity-100" : "opacity-0 pointer-events-none"}`} >

                <div
                    className={`relative flex flex-col gap-3
                        bg-neutral border border-gray 
                        rounded-2xl  p-8  w-sm text-center  
                        transform transition-all duration-300 ease-out
                        ${show ? "scale-100 translate-y-0 opacity-100" : "scale-95 translate-y-4 opacity-0"}`}>

                    {/* Close Button */}
                    <button
                        onClick={() => setShow(false)}
                        className="absolute  flex items-center justify-center top-4 right-4 
                        w-8 h-8 bg-transparent hover:bg-red 
                        rounded-full border-2 border-red transition-colors">

                        <i className="ri-close-line text-2xl font-medium"></i>
                    </button>

                    <h1 className="text-lg font-bold">Email Verify OTP</h1>


                    <p className="text-sm">
                        Please enter the OTP sent to your email:
                        <span className="text-yellow font-semibold ">usmanjamil@gmail.com</span>
                    </p>


                    {/* Code Input */}
                    <div className="flex justify-center gap-4">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(e.target.value, index)}
                                className="w-14 h-14 bg-transparent border-2 border-gray 
                                outline-none focus:border-yellow  rounded-md text-2xl 
                                text-center font-semibold transition-all"/>
                        ))}
                    </div>

                    <div className="font-medium">
                        0:{timer < 10 ? `0${timer}` : timer}
                    </div>

                    <div className="text-sm">
                        Didnt receive OTP?
                        <button
                            onClick={handleResend}
                            className="text-red font-medium hover:underline">
                            Resend
                        </button>
                    </div>

                    <button
                        onClick={handleVerify}
                        className="w-full px-1 py-2 bg-red-500
                        font-bold text-lg uppercase rounded cursor-pointer">
                        verify
                    </button>

                </div>
            </div>
        </>
    );
}
