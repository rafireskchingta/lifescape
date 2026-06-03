import { login } from '@/app/actions/auth'
import Link from 'next/link'
import PasswordInput from '@/components/ui/PasswordInput'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-br from-green-50 to-emerald-100/50">
      
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-green-700 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-green-700/20">LS</div>
        <span className="font-extrabold text-2xl text-green-900 tracking-tight">LifeScape</span>
      </Link>

      <div className="z-10 w-full max-w-md overflow-hidden rounded-3xl border border-white/50 bg-white/80 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col items-center justify-center space-y-2 px-4 py-8 pt-10 text-center sm:px-12">
          <h3 className="text-2xl font-bold text-gray-900">Welcome Back</h3>
          <p className="text-sm text-gray-500 font-medium">
            Log in to continue your journey
          </p>
        </div>
        
        <form className="flex flex-col space-y-5 px-4 pb-10 sm:px-12" action={login}>
          {error && (
            <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100 font-medium flex items-center gap-2">
              <span className="text-lg">⚠️</span> {error}
            </div>
          )}
          
          <div className="space-y-1">
            <label
              htmlFor="email"
              className="block text-xs font-bold text-gray-600 uppercase tracking-wider pl-1"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="user@example.com"
              autoComplete="email"
              required
              className="mt-1 block w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3 placeholder-gray-400 shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all font-medium text-gray-900"
            />
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between items-center pl-1">
              <label
                htmlFor="password"
                className="block text-xs font-bold text-gray-600 uppercase tracking-wider"
              >
                Password
              </label>
              <Link href="#" className="text-xs font-bold text-green-600 hover:text-green-700">Forgot?</Link>
            </div>
            {/* Custom wrapper for PasswordInput to match style */}
            <div className="relative mt-1">
              <PasswordInput name="password" id="password" required />
            </div>
          </div>
          
          <button
            type="submit"
            className="mt-4 flex w-full items-center justify-center rounded-xl bg-green-700 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-green-700/20 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all"
          >
            Log In
          </button>
          
          <p className="text-center text-sm text-gray-500 mt-6 font-medium">
            Don't have an account?{' '}
            <Link href="/register" className="font-bold text-green-700 hover:text-green-800 transition-colors">
              Sign up for free
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
