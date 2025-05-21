"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "@/components/components/ui/button"
import { Input } from "@/components/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/components/ui/card"
import { Label } from "@/components/components/ui/label"
import { Toaster } from "@/components/components/ui/toaster"
import { useToast } from "@/components/hooks/use-toast"
import { UserPlus, Building, MapPin, Phone, Lock, ArrowLeft, Loader2, User } from "lucide-react"
import { motion } from "framer-motion"

// Supposons que le logo est importé comme ceci
import logoSrc from "../assets/images/SOREMED logo.png"

const RegistrationPage: React.FC = () => {
  const navigate = useNavigate()
  const { toast } = useToast()

  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    iceNumber: "",
    address: "",
    phone: "",
    username: "",    // <— c’est bien un "username"
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      })
      if (!response.ok) throw new Error("Registration failed")

      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès.",
        variant: "default",
      })
      setTimeout(() => navigate("/"), 1500)
      setFormData({ iceNumber: "", address: "", phone: "", username: "", password: "" })
    } catch {
      toast({
        title: "Échec de l'inscription",
        description: "Une erreur s'est produite lors de l'inscription.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 py-12 px-4">
      <Toaster />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <div className="text-center mb-6">
          <img src={logoSrc} alt="SOREMED Logo" className="h-16 w-auto mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-emerald-800">SOREMED</h1>
          <p className="text-emerald-600">Créez votre compte client</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-2">
            <div className="flex items-center">
              <UserPlus className="h-5 w-5 text-emerald-600 mr-2" />
              <CardTitle className="text-2xl">Inscription</CardTitle>
            </div>
            <CardDescription>Remplissez le formulaire ci-dessous pour créer votre compte</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* ICE */}
              <div className="space-y-2">
                <Label htmlFor="iceNumber" className="text-sm font-medium">
                  Numéro ICE
                </Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                  <Input
                    type="text"
                    id="iceNumber"
                    name="iceNumber"
                    value={formData.iceNumber}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-medium">
                  Adresse
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                  <Input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                  Numéro de téléphone
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                  <Input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  Nom d’utilisateur
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                  <Input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Votre nom d’utilisateur"
                    value={formData.username}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Mot de passe
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                  <Input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Le mot de passe doit contenir au moins 8 caractères
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Inscription en cours...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <UserPlus className="mr-2 h-5 w-5" />
                    S'inscrire
                  </div>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center border-t pt-4">
            <Button variant="link" asChild className="text-emerald-600">
              <Link to="/" className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à la connexion
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

export default RegistrationPage;
