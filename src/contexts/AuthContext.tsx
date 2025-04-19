// src/contexts/AuthContext.tsx
import React, {
    createContext,
    ReactNode,
    useState,
    useEffect,
    FC,
  } from 'react';
  import api from '../api/axios';
  import { User } from '../types/User';  // <-- ton type frontend
  
  interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => Promise<User>;
    logout: () => void;
  }
  
  export const AuthContext = createContext<AuthContextType | undefined>(
    undefined
  );
  
  interface AuthProviderProps {
    children: ReactNode;
  }
  
  export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
  
    useEffect(() => {
      const auth = localStorage.getItem('auth');
      if (auth) {
        api
          .get<User>('/users/me')  // ou '/login' si tu n'as pas de /me
          .then(({ data }) => setUser(data))
          .catch(() => {
            localStorage.removeItem('auth');
            setUser(null);
          });
      }
    }, []);
  
    const login = async (
      username: string,
      password: string
    ): Promise<User> => {
      const basic = 'Basic ' + btoa(`${username}:${password}`);
      localStorage.setItem('auth', basic);
      const res = await api.post<User>('/login', { username, password });
      setUser(res.data);
      return res.data;
    };
  
    const logout = (): void => {
      localStorage.removeItem('auth');
      setUser(null);
    };
  
    return (
      <AuthContext.Provider value={{ user, login, logout }}>
        {children}
      </AuthContext.Provider>
    );
  };
  