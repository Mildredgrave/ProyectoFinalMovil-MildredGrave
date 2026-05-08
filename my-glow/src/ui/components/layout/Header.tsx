interface HeaderProps {
  cartCount: number
  onCartClick: () => void
  user: { name: string; email: string } | null
  onAccountClick: () => void
  onSkinQuizClick: () => void
}

export default function Header({ cartCount, onCartClick, user, onAccountClick, onSkinQuizClick }: HeaderProps) {
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
            {user && (
              <button
                onClick={onSkinQuizClick}
                className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Skin Quiz
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
