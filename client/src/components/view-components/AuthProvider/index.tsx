import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  registerUser: (
    name: string,
    email: string,
    password: string
  ) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

interface StoredUser {
  id: string;
  email: string;
  name: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("loginUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const getStoredUsers = () => {
    const usersJson = localStorage.getItem("users");
    return usersJson ? JSON.parse(usersJson) : [];
  };

  const saveUsers = (users: StoredUser[]) => {
    localStorage.setItem("users", JSON.stringify(users));
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const users = getStoredUsers();
    const foundUser = users.find(
      (u: StoredUser) => u.email === email && u.password === password
    );

    if (foundUser) {
      const loggedInUser: User = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
      };
      setUser(loggedInUser);
      localStorage.setItem("loginUser", JSON.stringify(loggedInUser));
      setLoading(false);
      return true;
    }

    setLoading(false);
    return false;
  };

  const registerUser = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

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

  const logout = () => {
    setUser(null);
    localStorage.removeItem("loginUser");
  };

  return (
    <AuthContext.Provider
      value={{ user, login, registerUser, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
