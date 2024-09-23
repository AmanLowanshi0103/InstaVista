import { Children, createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [profileData, setProfileData] = useState(null);

  const fetchUserData = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:4000/api/instavista/getuser", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
    });
    const data = await response.json();
    setProfileData(data);
  };

  useEffect(() => {
    const getUserData = async () => {
      await fetchUserData();
    };

    getUserData();
  }, []);

  useEffect(() => {
    if (profileData && localStorage.getItem("token")) {
      const socket = io("http://localhost:4000", {
        query: {
          userId: profileData[0]._id,
        },
      });
      setSocket(socket);
      console.log(socket)

      socket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      return () => socket.close();
    }
  }, [profileData]); // Add profileData as a dependency to run this effect when it's updated

  return <SocketContext.Provider value={{ socket, onlineUsers }}>{children}</SocketContext.Provider>;
};
