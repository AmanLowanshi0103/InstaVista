
import { createContext, useContext, useEffect, useState } from "react";

const ImplemetContext = createContext();

export const useImplemetContext = () => {
    return useContext(ImplemetContext);
};

export const ImplemetContextProvider = ({ children }) => {
    const [LoginUserProfileData, setLoginUserProfileData] = useState({});

    const LoadData = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.log("Token not found, redirect to login.");
            return;  // Optionally, handle redirection here
        }

        try {
            const response = await fetch("http://localhost:4000/api/instavista/getuser", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    token: token,
                },
            });
            
            if (!response.ok) {
                throw new Error("Failed to fetch user data");
            }

            const res = await response.json();
            setLoginUserProfileData(res);
        } catch (error) {
            console.error("Error fetching user profile data:", error);
        }
    };

    useEffect(() => {
        LoadData();
    }, []);

    return (
        <ImplemetContext.Provider value={{ LoginUserProfileData, setLoginUserProfileData }}>
            {children}
        </ImplemetContext.Provider>
    );
};
