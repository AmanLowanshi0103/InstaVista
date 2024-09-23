import { createContext, useContext, useState } from "react";

// Correctly create the context using `createContext`
const MessageContext = createContext();

// Custom hook to use the MessageContext
export const useMessageContext = () => {
  return useContext(MessageContext);
};

// Context provider component
export const MessageContextProvider = ({ children }) => {
  const [message, setMessage] = useState([]);
  
  return (
    <MessageContext.Provider value={{ message, setMessage }}>
      {children}
    </MessageContext.Provider>
  );
};

