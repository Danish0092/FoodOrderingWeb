'use client';
import { createContext, useEffect, useState, useCallback } from "react";
import axios from "axios";


export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const backendUrl = 'http://localhost:5000';

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null); 
  const [loading, setLoading] = useState(true);

  // Setup axios with cookies
  useEffect(() => {
    axios.defaults.withCredentials = true;
  }, []);

  const fetchAuth = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/users/me`);

      if (data.success && data.userData.isAccountVerified) {
        setIsLoggedIn(true);
        setUserData(data.userData);
      } else {
        setIsLoggedIn(false);
        setUserData(null);
      }
    } catch (err) {
      setIsLoggedIn(false);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAuth();
  }, [fetchAuth]);

  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    loading,
    fetchAuth,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
