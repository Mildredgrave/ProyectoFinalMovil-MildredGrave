import type { User } from '../../../domain/user/user.type'

interface HeaderProps {
  cartCount: number
  onCartClick: () => void
  user: User | null
  onAccountClick: () => void
  onSkinQuizClick: () => void
  onAdminClick?: () => void
}

export default function Header({ cartCount, onCartClick, user, onAccountClick, onSkinQuizClick, onAdminClick }: HeaderProps) {
  return (
    <>
      <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-3 text-white">
        <button className="text-xl"></button>
        <div className="flex-1 text-center text-sm font-semibold">Skincare Coreano My Glow</div>
        <button className="text-xl"></button>
      </div>

      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center justify-center gap-4">
            <div>
              <h1 className="flex items-center gap-2 text-2xl font-bold text-black">
                <img src="/logo.png" alt="My Glow Logo" className="h-10 w-10" />
                My Glow
              </h1>
            </div>
          </div>

          
          <div className="flex items-center gap-4">
            <button
              onClick={onAccountClick}
              className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-green-600"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>{user ? user.name : 'Cuenta'}</span>
            </button>
            <button
              onClick={onSkinQuizClick}
              className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-green-600"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zM6.2 20a6 6 0 0111.6 0" />
              </svg>
              <span>Skin Quiz</span>
            </button>
            {user && user.role === 'admin' && onAdminClick && (
              <button
                onClick={onAdminClick}
                className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Admin
              </button>
            )}
            <button
              onClick={onCartClick}
              className="relative flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 font-semibold text-green-700 hover:bg-green-200"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
    </>
  )
}
