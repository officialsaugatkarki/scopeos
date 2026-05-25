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
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 bg-[#050A18]" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-blue-500/[0.06] blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="glass-card-strong rounded-2xl border border-white/[0.06] p-8">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Image src="/logo.png" alt="ScopeGuard" width={40} height={40} className="rounded-lg" />
              <span className="font-bold text-xl text-white">ScopeGuard</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-white/40">Sign in to your agency account</p>
          </div>

          {errors.submit && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Email</label>
              <Input
                type="email"
                placeholder="you@agency.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`dark-input rounded-xl h-11 ${errors.email ? 'border-red-500/50' : ''}`}
              />
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-white/70">Password</label>
                <button type="button" onClick={() => alert('Please contact your administrator to reset your password.')} className="text-sm text-blue-400 hover:text-blue-300">Forgot?</button>
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`dark-input rounded-xl h-11 pr-10 ${errors.password ? 'border-red-500/50' : ''}`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
            </div>

            <Button type="submit" disabled={isLoading} className="w-full btn-gradient text-white font-semibold h-11 rounded-xl border-0">
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/[0.06]">
            <p className="text-sm text-white/40 text-center">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-blue-400 hover:text-blue-300 font-semibold">Create one</Link>
            </p>
            <div className="mt-4 p-3 glass-card rounded-lg text-sm">
              <p className="font-semibold text-white/70 mb-1">First Time?</p>
              <p className="text-white/40">Create an account via Sign Up, then log in here.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
