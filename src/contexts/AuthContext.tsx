import {
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
    const stored = localStorage.getItem('auth');
    if (!stored) {
      setLoading(false);
      return;
    }

    // Appelle l'API pour récupérer les infos utilisateur
    api.get<User>('/users/me', {
      headers: {
        Authorization: stored,
      },
    })
      .then(({ data }) => setUser(data))
      .catch(() => {
        localStorage.removeItem('auth');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (username: string, password: string): Promise<User> => {
    const token = 'Basic ' + btoa(`${username}:${password}`);
    localStorage.setItem('auth', token);

    try {
      const res = await api.get<User>('/users/me', {
        headers: {
          Authorization: token,
        },
      });
      setUser(res.data);
      return res.data;
    } catch {
      localStorage.removeItem('auth');
      throw new Error('Identifiants incorrects');
    }
  };

  const logout = () => {
    localStorage.removeItem('auth');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
