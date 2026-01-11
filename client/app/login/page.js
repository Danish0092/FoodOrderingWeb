'use client';
import { useState, useContext, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { showToast } from '../components/CustomToaster';

export default function AuthPage() {
  const router = useRouter();
  const { backendUrl, isLoggedIn, fetchAuth } = useContext(AppContext);

  const [state, setState] = useState('Login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const nameRef = useRef(null);
  const passwordRef = useRef(null);
  const emailRef = useRef(null);

  useEffect(() => {
    if (isLoggedIn) {
      router.push('/');
    }
  }, [isLoggedIn, router]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let response;
      let data;

      if (state === 'Sign Up') {
        response = await axios.post(
          `${backendUrl}/api/auth/register`,
          { name, email, password },
          { withCredentials: true }
        );
        data = response.data;

        showToast(data.success ? "success" : "error", data.message);

        if (data.success) {
          const otpRes = await axios.post(
            `${backendUrl}/api/auth/send-verify-otp`,
            { email },
            { withCredentials: true }
          );
          showToast(otpRes.data.success ? "success" : "error", otpRes.data.message);

          router.push('/email-verify');
        }

      } else {
        response = await axios.post(
          `${backendUrl}/api/auth/login`,
          { email, password },
          { withCredentials: true }
        );
        data = response.data;

        showToast(data.success ? "success" : "error", data.message);

        if (data.success) {
          await fetchAuth();
          router.push('/');
        }
      }

    } catch (err) {
      showToast("error", err.response?.data?.message || err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div className="relative flex items-center justify-center h-screen bg-gray overflow-hidden " >

      <div className={`absolute flex flex-col md:flex-row w-full md:w-2/3 h-3/4 md:h-2/3 bg-neutral  rounded-3xl overflow-hidden`}>

        <div className="flex flex-col items-center justify-center gap-4 w-full md:w-1/2 h-2/5 md:h-full bg-yellow rounded-b-[120px] md:rounded-l-none md:rounded-r-[120px] text-center">

          {state === 'Sign Up' ? (
            <>
              <h2 className="text-3xl font-bold">Welcome Back!</h2>
              <p>Already have an account?</p>
              <button onClick={() => setState('Login')}
                className="px-4 py-2 bg-red rounded-md font-bold uppercase flex items-center justify-center gap-2 cursor-pointer" >Login</button>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold">Hello Welcome!</h2>
              <p>Dont have an account?</p>
              <button onClick={() => setState('Sign Up')}
                className="px-4 py-2 bg-red rounded-md font-bold uppercase flex items-center justify-center gap-2 cursor-pointer" >Sign Up</button>
            </>
          )}
        </div>

        <div className="flex flex-col items-center justify-center gap-4 order-2 md:order-1 w-full md:w-1/2 h-3/5 md:h-full px-4 md:p-12">
          <p className="text-4xl font-semibold">{state === 'Sign Up' ? 'Create Account' : 'Login'}</p>

          <form className='w-full flex flex-col gap-4' onSubmit={onSubmitHandler}>
            {state === 'Sign Up' && (
              <div className="relative p-2 bg-gray rounded-t-md">
                <input
                  ref={nameRef}
                  type="text"
                  className="pt-6 w-full bg-transparent outline-none peer"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={submitting}
                />
                <label
                  onClick={() => nameRef.current.focus()}
                  className={`absolute left-2 text-yellow text-lg uppercase cursor-text transition-all duration-300
                    ${name ? "top-1 text-sm" : "top-5 peer-focus:top-1 peer-focus:text-sm"}`}>
                  name*
                </label>
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-red-500 peer-focus:w-full transition-all duration-300" />
              </div>
            )}

            <div className="relative p-2 bg-gray rounded-t-md">
              <input
                ref={emailRef}
                type="email"
                className="pt-6 w-full bg-transparent outline-none peer"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={submitting}
              />
              <label
                onClick={() => emailRef.current.focus()}
                className={`absolute left-2 text-yellow text-lg uppercase cursor-text transition-all duration-300
                    ${email ? "top-1 text-sm" : "top-5 peer-focus:top-1 peer-focus:text-sm"}`}>
                email*
              </label>
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-red peer-focus:w-full transition-all duration-300" />
            </div>

            <div className="relative p-2 bg-gray rounded-t-md">
              <input
                ref={passwordRef}
                type="password"
                className="pt-6 w-full bg-transparent outline-none peer"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={submitting}
              />
              <label
                onClick={() => passwordRef.current.focus()}
                className={`absolute left-2 text-yellow text-lg uppercase cursor-text transition-all duration-300
                    ${password ? "top-1 text-sm" : "top-5 peer-focus:top-1 peer-focus:text-sm"}`}>
                password*
              </label>
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-red peer-focus:w-full transition-all duration-300" />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full px-4 py-3 bg-red rounded-md font-bold uppercase flex items-center justify-center gap-2"
            >
              {submitting && <div className="w-6 h-6 border-t-2 border-t-blue-400 rounded-full animate-spin"></div>}
              {submitting ? (state === 'Sign Up' ? 'Signing up...' : 'Logging in...') : state}
            </button>

            {state === 'Login' && (
              <p className='text-center underline text-red-300'>
                <Link href="/reset-password">Forgot Password?</Link>
              </p>
            )}

          </form>
        </div>

      </div>
    </div>
  );
}
