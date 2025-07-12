import { createContext, useContext } from 'react';
import { useSocket } from '../socket/socket';

const SocketContext = createContext(null);
export const useSocketContext = () => useContext(SocketContext);

export default function SocketProvider({ children }) {
  const socketStore = useSocket();   // your custom hook

  return (
    <SocketContext.Provider value={socketStore}>
      {children}
    </SocketContext.Provider>
  );
}