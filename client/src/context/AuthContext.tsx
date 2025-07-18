import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  updateProfile: (name: string, email: string) => Promise<boolean>;
}

interface StoredUser {
  id: string;
  email: string;
  name: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = 'users';
const CURRENT_USER_KEY = 'currentUser';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const getStoredUsers = () => {
    const usersJson = localStorage.getItem(USERS_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  };

  const saveUsers = (users: StoredUser[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const users = getStoredUsers();
    const foundUser = users.find((u: StoredUser) => u.email === email && u.password === password);

    if (foundUser) {
      const loggedInUser: User = { id: foundUser.id, email: foundUser.email, name: foundUser.name };
      setUser(loggedInUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(loggedInUser));
      setLoading(false);
      return true;
    }

    setLoading(false);
    return false;
  };

 const register = async (name: string, email: string, password: string): Promise<boolean> => {
  setLoading(true);
  await new Promise(resolve => setTimeout(resolve, 500));

  const users = getStoredUsers();
  const existingUser = users.find((u: StoredUser) => u.email === email);
  if (existingUser) {
    setLoading(false);
    return false;
  }

  const newUser = { id: Date.now().toString(), name, email, password };
  const updatedUsers = [...users, newUser];
  saveUsers(updatedUsers);

  
  setLoading(false);
  return true;
};


  const updateProfile = async (name: string, email: string): Promise<boolean> => {
    if (!user) return false;
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    let users = getStoredUsers();

    // Check if email already used by another user
   const emailTaken = users.find((u: StoredUser) => u.email === email && u.id !== user.id);
    if (emailTaken) {
      setLoading(false);
      return false;
    }

    users = users.map((u: StoredUser) =>
      u.id === user.id ? { ...u, name, email } : u
    );

    saveUsers(users);

    const updatedUser = { ...user, name, email };
    setUser(updatedUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
    setLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
