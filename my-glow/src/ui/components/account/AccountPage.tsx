import { useState } from 'react'
import RegisterForm from './RegisterForm'

interface User {
  name: string
  email: string
}

interface AccountPageProps {
  user: User | null
  onRegister: (user: User) => void
  onLogout: () => void
  onBackToCatalog: () => void
}

export default function AccountPage({ user, onRegister, onLogout, onBackToCatalog }: AccountPageProps) {
  const [showRegisterForm, setShowRegisterForm] = useState(!user)

  const handleRegister = (newUser: User) => {
    onRegister(newUser)
    setShowRegisterForm(false)
  }

  if (!user || showRegisterForm) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <RegisterForm
          onRegister={handleRegister}
          onCancel={onBackToCatalog}
        />
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
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-2xl font-bold text-white">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
            <p className="text-sm text-gray-600">{user.email}</p>
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
              <span className="text-gray-600">Estado:</span>
              <span className="font-medium text-green-600">Activo</span>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-gray-200 pt-6">
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