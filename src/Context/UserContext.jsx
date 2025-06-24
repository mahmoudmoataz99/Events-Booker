import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const loginUser = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logoutUser = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);

            setUser(parsedUser);
            setIsAuthenticated(true);
        }
      } catch (error) {
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  return (
    <UserContext.Provider value={{ 
      user, 
      isAuthenticated, 
      loading,
      loginUser, 
      logoutUser 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};