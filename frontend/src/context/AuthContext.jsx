import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(() => {
    const storedUser = localStorage.getItem("user");

    return storedUser ? JSON.parse(storedUser) : null;
  });

  const setUser = (nextUser) => {
    setUserState(nextUser);

    if (nextUser) {
      localStorage.setItem("user", JSON.stringify(nextUser));
    } else {
      localStorage.removeItem("user");
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};