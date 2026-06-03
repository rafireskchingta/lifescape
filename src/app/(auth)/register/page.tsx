import { signup as register } from '@/app/actions/auth'
import Link from 'next/link'
import Image from 'next/image'
import PasswordInput from '@/components/ui/PasswordInput'

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string, success?: string }>
}) {
  const { error, success } = await searchParams;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-br from-green-50 to-emerald-100/50">
      
      {/* Logo & Welcome */}
      <div className="flex flex-col items-center justify-center space-y-3 px-4 py-8 text-center mt-8">
        <Link href="/" className="flex flex-col items-center gap-3">
          <Image src="/assets/logo.png" alt="LifeScape Logo" width={48} height={48} className="w-12 h-12 rounded-xl shadow-sm" />
          <span className="font-extrabold text-2xl text-green-700 tracking-tight">LifeScape</span>
        </Link>
        <p className="text-sm text-gray-500 font-medium mt-1">
          Mulai perjalanan produktivitasmu hari ini
        </p>
      </div>

      <div className="z-10 w-full max-w-md overflow-hidden rounded-3xl border border-white/50 bg-white/80 backdrop-blur-xl shadow-2xl">
        <form className="flex flex-col space-y-5 px-6 py-10 sm:px-12" action={register}>
          {error && (
            <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100 font-medium flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {error}
            </div>
          )}
          
          {success && (
            <div className="rounded-xl bg-green-50 p-4 text-sm text-green-700 border border-green-200 font-medium flex flex-col gap-1 text-center">
              <span className="font-bold mb-1">Pendaftaran Berhasil!</span>
              <span>{success}</span>
            </div>
          )}
          
          <div className="space-y-1">
            <label
              htmlFor="username"
              className="block text-xs font-bold text-gray-600 uppercase tracking-wider pl-1"
            >
              Nama Pengguna
            </label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Cth. SiPalingFokus"
              required
              className="mt-1 block w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3 placeholder-gray-400 shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all font-medium text-gray-900"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="email"
              className="block text-xs font-bold text-gray-600 uppercase tracking-wider pl-1"
            >
              Alamat Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="user@contoh.com"
              autoComplete="email"
              required
              className="mt-1 block w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3 placeholder-gray-400 shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all font-medium text-gray-900"
            />
          </div>
          
          <div className="space-y-1">
            <label
              htmlFor="password"
              className="block text-xs font-bold text-gray-600 uppercase tracking-wider pl-1"
            >
              Kata Sandi
            </label>
            {/* Custom wrapper for PasswordInput to match style */}
            <div className="relative mt-1">
              <PasswordInput name="password" id="password" required />
            </div>
          </div>
          
          <button
            type="submit"
            className="mt-4 flex w-full items-center justify-center rounded-xl bg-[#047857] px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-green-700/20 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all"
          >
            Daftar
          </button>
          
          <p className="text-center text-sm text-gray-500 mt-6 font-medium">
            Sudah punya akun?{' '}
            <Link href="/login" className="font-bold text-[#047857] hover:text-green-800 transition-colors">
              Masuk
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
