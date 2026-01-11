'use client';
import { useState, useContext, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { showToast } from "../components/CustomToaster";

export default function ResetPassword() {

  const { fetchAuth } = useContext(AppContext);

  
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
  const [submitting, setSubmitting] = useState(false);

  const inputRefs = useRef([]);


  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const otp = inputRefs.current.map((input) => input.value).join('');

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/verify-account`,
        { otp },
        { withCredentials: true }
      );

      if (data.success) {
        showToast("success", data.message);
        await fetchAuth(); 
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


  /* ---------------- TIMER ---------------- */

  return (
    <div className="flex items-center justify-center h-screen bg-gray overflow-hidden " >

      <div className={`flex flex-col md:flex-row w-full md:w-2/3 h-3/4 md:h-2/3 bg-neutral  rounded-3xl overflow-hidden`}>


        <div className="flex flex-col items-center justify-center gap-4 w-full md:w-1/2 h-2/5 md:h-full bg-yellow rounded-b-[120px] md:rounded-l-none md:rounded-r-[120px] text-center">

          <i className="ri-lock-unlock-fill text-8xl"></i>
          <h1 className='text-xl font-bold'>Verify your email</h1>
          <p className='w-2/3'>We have sent a 6-digit verification code to your email. Enter the verification code to continue.</p>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 order-2 md:order-1 w-full md:w-1/2 h-3/5 md:h-full px-4 md:p-12">

          <form className='flex flex-col gap-3 rounded-2xl  p-8  w-sm text-center'
            onSubmit={onSubmitHandler}
          >
            <h1 className='text-lg font-bold'>
              Email Verify OTP
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
              className="cursor-pointer w-full px-4 py-3 bg-red rounded-md font-bold uppercase flex items-center justify-center gap-2" >
              {submitting && <div className="w-6 h-6 border-t-2 border-t-blue-400 rounded-full animate-spin"></div>}
              {submitting ? "Verifying..." : "Verify Email"}
            </button>
          </form>




        </div>


      </div>
    </div>
  );
}
