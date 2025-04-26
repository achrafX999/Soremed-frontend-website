import React, {
  createContext,
  ReactNode,
  useState,
  useEffect,
  FC,
} from 'react';
import api from '../api/axios';
import { User } from '../types/User';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<User>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const auth = localStorage.getItem('auth');
    if (!auth) {
      setLoading(false);
      return;
    }

    api
      .get<User>('/users/me')
      .then(({ data }) => setUser(data))
      .catch(() => {
        localStorage.removeItem('auth');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (
    username: string,
    password: string
  ): Promise<User> => {
    const res = await api.post<User>('/login', { username, password });
    const basic = 'Basic ' + btoa(`${username}:${password}`);
    localStorage.setItem('auth', basic);
    setUser(res.data);
    return res.data;
  };

  const logout = async (): Promise<void> => {
    await api.post('/logout');
    localStorage.removeItem('auth');
    setUser(null);
  };
  

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
