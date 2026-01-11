'use client';
import { useState, useContext, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { showToast } from "../components/CustomToaster";

export default function AuthPage() {
  const router = useRouter();
  const { backendUrl, isLoggedIn, fetchAuth, loading } = useContext(AppContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && isLoggedIn) {
      router.push('/');
    }
  }, [isLoggedIn, loading, router]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await axios.post(
        `${backendUrl}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      const data = response.data;

      showToast(data.success ? "success" : "error", data.message);

      if (data.success) {
        await fetchAuth();
        router.push('/');
      }

    } catch (err) {
      showToast("error", err.response?.data?.message || err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return null; // optional spinner

  return (
    <div className="relative flex items-center justify-center h-screen bg-gray overflow-hidden">
      <div className="absolute flex flex-col items-center justify-center w-full md:w-1/2 h-2/3 bg-black rounded-3xl p-8">
        <p className="text-4xl font-semibold text-center mb-6">Login</p>

        <form className="w-full flex flex-col gap-4" onSubmit={onSubmitHandler}>
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
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full px-4 py-3 bg-red rounded-md font-bold uppercase flex items-center justify-center gap-2"
          >
            {submitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
