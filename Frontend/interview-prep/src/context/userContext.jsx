import { useState, useEffect, createContext } from "react";
import axiosInstance from "../utils/axiosinstance";
import { API_PATHS } from "../utils/apiPaths";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) return;

    const accessToken = localStorage.getItem("token");
    if(!accessToken){
        setLoading(false);
        return;
    }

    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
        setUser(response.data);
      } catch (error) {
        console.error("User not authenticated", error);
        clearUser();
      } finally {
        setLoading(false);
      }
    };

   
      fetchUser();
  }, []);

  const updateUser = (userData) =>{
    setUser(userData);
    localStorage.setItem("token",userData.token);//Save Token
    setLoading(false);
  };

  const clearUser = () =>{
    setUser(null);
    localStorage.removeItem("token")
  };
  return (
    <UserContext.Provider value={{ user, loading, updateUser,clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
