import { useState } from 'react'
import RegisterForm from './RegisterForm'
import LoginForm from './LoginForm'
import type { User } from '../../../domain/user/user.type'

interface AccountPageProps {
  user: User | null
  onRegister: (user: User) => void
  onLogout: () => void
  onBackToCatalog: () => void
}

export default function AccountPage({ user, onRegister, onLogout, onBackToCatalog }: AccountPageProps) {
  const [showRegisterForm, setShowRegisterForm] = useState(!user)
  const [showLoginForm, setShowLoginForm] = useState(false)

  const handleRegister = (newUser: User) => {
    onRegister(newUser)
    setShowRegisterForm(false)
    setShowLoginForm(false)
  }

  const handleLogin = (user: User) => {
    onRegister(user)
    setShowLoginForm(false)
    setShowRegisterForm(false)
  }

  const switchToLogin = () => {
    setShowRegisterForm(false)
    setShowLoginForm(true)
  }

  const switchToRegister = () => {
    setShowLoginForm(false)
    setShowRegisterForm(true)
  }

  if (!user || showRegisterForm || showLoginForm) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 gap-6">
        {showLoginForm ? (
          <LoginForm
            onLogin={handleLogin}
            onCancel={onBackToCatalog}
            onCreateAccount={switchToRegister}
          />
        ) : (
          <RegisterForm
            onRegister={handleRegister}
            onCancel={onBackToCatalog}
          />
        )}
        
        {showRegisterForm && !showLoginForm && (
          <button
            onClick={switchToLogin}
            className="text-sm text-green-600 hover:text-green-700 underline"
          >
            ¿Ya tienes cuenta? Inicia sesión
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Mi Cuenta</h1>
        <button
          onClick={onBackToCatalog}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          ← Volver al catálogo
        </button>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <div className={`flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold text-white ${
            user.role === 'admin' 
              ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
              : 'bg-gradient-to-br from-green-500 to-emerald-600'
          }`}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
            <p className="text-sm text-gray-600">{user.email}</p>
            {user.role === 'admin' && (
              <span className="inline-block mt-1 px-2 py-1 text-xs font-semibold text-white bg-blue-600 rounded-full">
                Administrador
              </span>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Información de la cuenta</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Nombre:</span>
              <span className="font-medium">{user.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium">{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tipo de cuenta:</span>
              <span className={`font-medium ${user.role === 'admin' ? 'text-blue-600' : 'text-green-600'}`}>
                {user.role === 'admin' ? 'Administrador' : 'Usuario'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Estado:</span>
              <span className="font-medium text-green-600">Activo</span>
            </div>
          </div>
        </div>

        {user.role === 'admin' && (
          <div className="mt-6 border-t border-gray-200 pt-6">
            <button
              onClick={onBackToCatalog}
              className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mb-3"
            >
              Ir al Panel de Administrador
            </button>
          </div>
        )}

        <div className={`mt-6 ${user.role === 'admin' ? '' : 'border-t border-gray-200 pt-6'}`}>
          <button
            onClick={onLogout}
            className="w-full rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  )
}