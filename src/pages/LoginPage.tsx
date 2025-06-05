import React, { FormEvent, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { Button } from "@/components/components/ui/button";
import { Input } from "@/components/components/ui/input";
import { Checkbox } from "@/components/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/components/ui/card";
import { Label } from "@/components/components/ui/label";
import { Alert, AlertDescription } from "@/components/components/ui/alert";
import { AlertCircle, Lock, ArrowRight, User } from 'lucide-react';
import { motion } from "framer-motion";

// Supposons que le logo est importé comme ceci
import logoSrc from '../assets/images/SOREMED logo.png';

const LoginPage: React.FC = () => {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error('AuthContext non initialisé');
  const { login } = auth;
  const navigate = useNavigate();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [remember, setRemember] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const user = await login(username, password);
      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (user.role === 'SERVICE_ACHAT') {
        navigate('/achat/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch {
      setError('Identifiants incorrects');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <Card className="overflow-hidden shadow-xl border-0">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Branding */}
            <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600 p-8 text-white">
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
                <img src={logoSrc} alt="SOREMED Logo" className="h-32 w-auto mb-6" />
              </motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }} className="text-center">
                <h3 className="text-2xl font-bold mb-2">SOREMED</h3>
                <p className="text-emerald-100">Votre partenaire de confiance pour tous vos besoins médicaux</p>
              </motion.div>
            </div>

            {/* Formulaire */}
            <div className="p-8">
              {/* Mobile logo */}
              <div className="md:hidden text-center mb-6">
                <img src={logoSrc} alt="SOREMED Logo" className="h-20 w-auto mx-auto" />
              </div>

              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-2xl font-bold text-gray-800 text-center">
                  Bienvenue sur SOREMED
                </CardTitle>
                <CardDescription className="text-center text-gray-600">
                  Connectez-vous à votre espace client
                </CardDescription>
              </CardHeader>

              <CardContent className="p-0">
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Username */}
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-sm font-medium">
                      Nom d’utilisateur
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                      <Input
                        id="username"
                        type="text"
                        autoComplete="username"
                        required
                        placeholder="Votre nom d’utilisateur"
                        value={username}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-sm font-medium">
                        Mot de passe
                      </Label>
                      <Button type="button" variant="link" className="p-0 h-auto text-emerald-600 hover:text-emerald-700 text-xs">
                        Mot de passe oublié ?
                      </Button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                      <Input
                        id="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Remember me */}
                  <div className="flex items-center space-x-2">
                    <Checkbox checked={remember} onCheckedChange={(ch: boolean) => setRemember(ch)} />
                    <Label htmlFor="remember" className="text-sm text-gray-600">
                      Se souvenir de moi
                    </Label>
                  </div>

                  {/* Submit */}
                  <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
                    {isLoading
                      ? <div className="flex items-center">
                          <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-opacity-50 border-t-transparent rounded-full" />
                          Connexion en cours...
                        </div>
                      : 'Se connecter'
                    }
                  </Button>
                </form>
              </CardContent>

              <CardFooter className="flex flex-col p-0 mt-6">
                <div className="relative w-full mb-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-white text-gray-500">Pas encore client ?</span>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50" asChild>
                  <Link to="/register" className="flex items-center justify-center">
                    Devenir client
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;