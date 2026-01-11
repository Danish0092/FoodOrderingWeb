'use client';
import { useState, useContext, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { showToast } from "../components/CustomToaster";

export default function ResetPassword() {
  // Handle OTP input focus
  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text');
    const pasteArray = paste.split('');
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) inputRefs.current[index].value = char;
    });
    if (inputRefs.current[5]) inputRefs.current[5].focus();
  };


  const router = useRouter();
  const { backendUrl } = useContext(AppContext);

  // shared states
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // flow states
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

  // timer
  const [timer, setTimer] = useState(120);

  // refs
  const emailRef = useRef(null);
  const newPasswordRef = useRef(null);
  const inputRefs = useRef([]);

  /* ---------------- TIMER ---------------- */
  useEffect(() => {
    if (!isOtpSent) return;

    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOtpSent]);


  /* ---------------- SEND OTP ---------------- */
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-reset-otp`,
        { email },
        { withCredentials: true }
      );

      if (data.success) {
        showToast("success", data.message);
        setIsOtpSent(true);
        setTimer(120);
      } else {
        showToast("error", data.message);
      }
    } catch (err) {
      showToast("error", err.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------------- VERIFY OTP ---------------- */
  const handleSubmitOtp = (e) => {
    e.preventDefault();
    const otpValue = inputRefs.current.map(i => i?.value || '').join('');

    if (otpValue.length !== 6) {
      showToast("error", "Please enter complete OTP");
      return;
    }

    setOtp(otpValue);
    setIsOtpSubmitted(true);
  };



  /* ---------------- RESET PASSWORD ---------------- */
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/reset-password`,
        { email, otp, newPassword },
        { withCredentials: true }
      );

      if (data.success) {
        showToast("success", data.message);
        router.push('/');
      } else {
        showToast("error", data.message);
      }
    } catch (err) {
      showToast("error", err.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };



  return (
    <div className="flex items-center justify-center h-screen bg-gray overflow-hidden " >

      <div className={`flex flex-col md:flex-row w-full md:w-2/3 h-3/4 md:h-2/3 bg-neutral  rounded-3xl overflow-hidden`}>
        {/* !isOtpSent */}
        {!isOtpSent && (
          <>
            <div className="flex flex-col items-center justify-center gap-4 w-full md:w-1/2 h-2/5 md:h-full bg-yellow rounded-b-[120px] md:rounded-l-none md:rounded-r-[120px] text-center">

              <i className="ri-lock-unlock-fill text-8xl"></i>
              <h1 className='text-xl font-bold'>Forgot your password?</h1>
              <p className='w-1/2'>Enter your registered email to receive a verification code.</p>

            </div>


            <div className="flex flex-col items-center justify-center gap-4 order-2 md:order-1 w-full md:w-1/2 h-3/5 md:h-full px-4 md:p-12">


              {/* Step 1: Enter email */}
              <form className='flex flex-col gap-3
                        
                        rounded-2xl  p-8  w-sm text-center'
                onSubmit={handleSendOtp}
              >
                <h1 className='text-lg font-bold' >
                  Reset Password
                </h1>


                <div className="relative p-2 bg-gray rounded-t-md">
                  <input
                    ref={emailRef}
                    type="email"
                    className="pt-6 w-full bg-transparent outline-none peer"
                    value={email}
                    disabled={submitting}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <label
                    onClick={() => emailRef.current.focus()}
                    className={`absolute left-2 text-yellow text-lg uppercase cursor-text transition-all duration-300
                    ${email ? "top-1 text-sm" : "top-5 peer-focus:top-1 peer-focus:text-sm"}`}>
                    email*
                  </label>
                  <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-red peer-focus:w-full transition-all duration-300" />
                </div>

                <button disabled={submitting}
                  className='w-full px-4 py-3 bg-red rounded-md font-bold uppercase flex items-center justify-center gap-2' >
                  {submitting && <div className="w-6 h-6 border-t-2 border-t-blue-400 rounded-full animate-spin"></div>}
                  {submitting ? "Sending..." : "Send OTP"}
                </button>
              </form>
            </div>
          </>
        )}


        {isOtpSent && !isOtpSubmitted && (
          <>
            <div className="flex flex-col items-center justify-center gap-4 w-full md:w-1/2 h-2/5 md:h-full bg-yellow rounded-b-[120px] md:rounded-l-none md:rounded-r-[120px] text-center">

              <i className="ri-lock-unlock-fill text-8xl"></i>
              <h1 className='text-xl font-bold'>Verify your email</h1>
              <p className='w-2/3'>We have sent a 6-digit verification code to your email. Enter the verification code to continue.</p>
            </div>

            <div className="flex flex-col items-center justify-center gap-4 order-2 md:order-1 w-full md:w-1/2 h-3/5 md:h-full px-4 md:p-12">

              <form className='flex flex-col gap-3 rounded-2xl  p-8  w-sm text-center'
                onSubmit={handleSubmitOtp}
              >
                <h1 className='text-lg font-bold'>
                  Password Reset OTP
                </h1>


                <div className="flex justify-center gap-4" onPaste={handlePaste}>
                  {Array(6)
                    .fill(0)
                    .map((_, index) => (
                      <input
                        key={index}
                        type="text"
                        maxLength={1}
                        required
                        ref={(el) => (inputRefs.current[index] = el)}
                        onInput={(e) => handleInput(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        className="w-11 h-11 bg-transparent border-2 border-gray 
                      outline-none focus:border-yellow  rounded-md text-2xl 
                      text-center font-semibold transition-all"
                      />
                    ))}
                </div>

                <button disabled={submitting}
                  className="w-full px-1 py-2 bg-red-500
                        font-bold text-lg uppercase rounded cursor-pointer" >
                  Submit OTP
                </button>

                {timer > 0 ? (
                  <div className="font-medium">
                    Resend in {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
                  </div>
                ) : (
                  <button
                    onClick={handleSendOtp}
                    disabled={submitting}
                    className="text-center underline text-red-300 font-medium"
                  >
                    {submitting ? "Resending..." : "Resend OTP"}
                  </button>
                )}
              </form>


            </div>
          </>
        )}

        {isOtpSent && isOtpSubmitted && (
          <>
            <div className="flex flex-col items-center justify-center gap-4 w-full md:w-1/2 h-2/5 md:h-full bg-yellow rounded-b-[120px] md:rounded-l-none md:rounded-r-[120px] text-center">

              <i className="ri-lock-unlock-fill text-8xl"></i>
              <h1 className='text-xl font-bold'>Create new password</h1>
              <p className='w-2/3'>Use at least 6 characters to create a strong password.</p>
            </div>

            <div className="flex flex-col items-center justify-center gap-4 order-2 md:order-1 w-full md:w-1/2 h-3/5 md:h-full px-4 md:p-12">

              <form className='flex flex-col gap-3 rounded-2xl  p-8  w-sm text-center'
                onSubmit={handleResetPassword}
              >
                <h1 className='text-lg font-bold'>
                  New Password
                </h1>


                <div className="relative p-2 bg-gray rounded-t-md">
                  <input
                    ref={newPasswordRef}
                    type="password"
                    className="pt-6 w-full bg-transparent outline-none peer"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    disabled={submitting}
                  />
                  <label
                    onClick={() => newPasswordRef.current.focus()}
                    className={`absolute left-2 text-yellow text-lg uppercase cursor-text transition-all duration-300
                    ${newPassword ? "top-1 text-sm" : "top-5 peer-focus:top-1 peer-focus:text-sm"}`}>
                    new Password*
                  </label>
                  <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-red peer-focus:w-full transition-all duration-300" />
                </div>

                <button disabled={submitting}
                  className="cursor-pointer w-full px-4 py-3 bg-red rounded-md font-bold uppercase flex items-center justify-center gap-2" >
                  {submitting && <div className="w-6 h-6 border-t-2 border-t-blue-400 rounded-full animate-spin"></div>}
                  {submitting ? "Resetting..." : "Reset Password"}
                </button>
              </form>




            </div>
          </>
        )}


      </div>
    </div>
  );
}
