'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signIn, validateEmail } from '@/lib/auth';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!validateEmail(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!formData.password) newErrors.password = 'Password is required';
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    setIsLoading(true);
    setErrors({});
    const { user, error } = await signIn(formData.email, formData.password);
    if (error || !user) { setErrors({ submit: error || 'Invalid email or password' }); setIsLoading(false); return; }
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative" style={{ background: 'linear-gradient(180deg, #0B1224 0%, #0F1A33 30%, #0A1128 60%, #060E20 100%)' }}>
      
      {/* Subtle Glow behind the card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-blue-500/[0.04] blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div 
          className="rounded-[24px] p-8 sm:p-10"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.2)',
          }}
        >
          <div className="mb-8 flex flex-col items-center text-center">
            <Link href="/" className="flex items-center gap-2 mb-8">
              <Image src="/assets/logo.png" alt="ScopeOS" width={36} height={36} className="rounded-xl shadow-sm" />
              <span className="font-bold text-xl text-white tracking-tight">ScopeOS</span>
            </Link>
            <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">Welcome Back</h1>
            <p className="text-white/50 text-sm">Sign in to your agency account</p>
          </div>

          {errors.submit && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center justify-center text-center">
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[13px] font-semibold tracking-wide text-white/70 mb-2 uppercase">Email</label>
              <Input
                type="email"
                placeholder="you@agency.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`dark-input rounded-xl h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-blue-500/50 ${errors.email ? 'border-red-500/50' : ''}`}
              />
              {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[13px] font-semibold tracking-wide text-white/70 uppercase">Password</label>
                <button type="button" onClick={() => alert('Please contact your administrator to reset your password.')} className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors">Forgot?</button>
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`dark-input rounded-xl h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-blue-500/50 pr-10 ${errors.password ? 'border-red-500/50' : ''}`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1.5">{errors.password}</p>}
            </div>

            <Button type="submit" disabled={isLoading} className="w-full bg-white text-black hover:bg-gray-100 font-semibold h-12 rounded-xl border-0 mt-2 transition-all shadow-lg">
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-sm text-white/50">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-white hover:text-blue-300 font-medium transition-colors">Create one</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
