import React, { createContext, useState, useEffect } from 'react';
import socket from 'socket';
const SocketContext = createContext();

const SocketContextProvider = ({ children }) => {
  const [socketState, setSocketState] = useState();

  useEffect(() => {
    socket.connect();
    console.log(`Successfully connected to socket`);
    setSocketState(socket);

    // disconnect from the channel when the component unmounts
    return () => {
      socket.disconnect();
      console.log(`Successfully disconnected from socket`);
    };
  }, []);
  // only connect to the socket once on component mount

  if (!socketState) return null;

  return (
    <SocketContext.Provider value={{ socket: socketState }}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketContext, SocketContextProvider };
