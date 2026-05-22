import { useState } from 'react'
import type { User } from '../../../domain/user/user.type'
import { findUserByEmail } from '../../../infraestructure/user/user.local'
import { findUserByEmailFirestore } from '../../../infraestructure/user/user.firestore'

interface LoginFormProps {
  onLogin: (user: User) => void
  onCancel: () => void
  onCreateAccount: () => void
}

export default function LoginForm({ onLogin, onCancel, onCreateAccount }: LoginFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.email.trim() || !formData.password.trim()) {
      setError('Por favor completa todos los campos')
      return
    }

    setIsLoading(true)
    try {
      const ADMIN_CREDENTIALS = {
        email: 'admin@myglow.com',
        password: '33582525'
      }

      // Verificar si es admin
      if (formData.email.toLowerCase() === ADMIN_CREDENTIALS.email && formData.password === ADMIN_CREDENTIALS.password) {
        const adminUser: User = {
          id: 'admin-001',
          name: 'Administrador',
          email: ADMIN_CREDENTIALS.email,
          role: 'admin'
        }
        onLogin(adminUser)
        setFormData({ email: '', password: '' })
        return
      }

      // Buscar usuario en localStorage primero
      let user = findUserByEmail(formData.email)
      
      // Si no está en localStorage, buscar en Firestore
      if (!user) {
        user = await findUserByEmailFirestore(formData.email)
      }

      if (!user) {
        setError('El email no está registrado')
        return
      }

      // Verificar contraseña (almacenada en localStorage)
      const storedPassword = localStorage.getItem(`user-password-${user.id}`)
      if (storedPassword !== formData.password) {
        setError('Contraseña incorrecta')
        return
      }

      onLogin(user)
      setFormData({ email: '', password: '' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (error) setError('')
  }

  return (
    <div className="mx-auto max-w-md rounded-lg border border-gray-200 bg-white p-8 shadow-lg">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Iniciar sesión</h2>
        <p className="mt-2 text-sm text-gray-600">
          Ingresa tu email y contraseña
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 ${
              error ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="tu@email.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 ${
              error ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Tu contraseña"
          />
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Accediendo...' : 'Acceder'}
          </button>
        </div>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onCreateAccount}
            className="text-sm text-green-600 hover:text-green-700 underline"
          >
            ¿No tienes cuenta? Registrarse
          </button>
        </div>
      </form>
    </div>
  )
}
