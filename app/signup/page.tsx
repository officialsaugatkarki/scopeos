'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signUp, validateEmail, validatePassword } from '@/lib/auth';
import { initializeUserAccountData } from '@/lib/mock-data';
import { AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  const handlePasswordChange = (value: string) => {
    setFormData({ ...formData, password: value });
    const validation = validatePassword(value);
    setPasswordErrors(validation.errors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!validateEmail(formData.email)) newErrors.email = 'Please enter a valid email';
    const pv = validatePassword(formData.password);
    if (!pv.valid) newErrors.password = 'Password does not meet requirements';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    setIsLoading(true); setErrors({});
    const { user, error } = await signUp(formData.email, formData.password, formData.name);
    if (error || !user) { setErrors({ submit: error || 'Failed to create account.' }); setIsLoading(false); return; }
    localStorage.setItem('hasAccount', 'true');
    localStorage.setItem('scopeos_last_user', JSON.stringify({ id: user.id, name: user.name, email: user.email }));
    router.push('/onboarding');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative" style={{ background: 'linear-gradient(180deg, #0B1224 0%, #0F1A33 30%, #0A1128 60%, #060E20 100%)' }}>
      
      {/* Subtle Glow behind the card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-blue-500/[0.04] blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10 my-8">
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
            <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">Create Account</h1>
            <p className="text-white/50 text-sm">Start protecting your margins from scope creep</p>
          </div>

          {errors.submit && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center justify-center text-center">
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[13px] font-semibold tracking-wide text-white/70 mb-2 uppercase">Full Name</label>
              <Input type="text" placeholder="John Doe" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={`dark-input rounded-xl h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-blue-500/50 ${errors.name ? 'border-red-500/50' : ''}`} />
              {errors.name && <p className="text-red-400 text-xs mt-1.5">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-[13px] font-semibold tracking-wide text-white/70 mb-2 uppercase">Email</label>
              <Input type="email" placeholder="you@agency.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={`dark-input rounded-xl h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-blue-500/50 ${errors.email ? 'border-red-500/50' : ''}`} />
              {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-[13px] font-semibold tracking-wide text-white/70 mb-2 uppercase">Password</label>
              <div className="relative">
                <Input type={showPassword ? 'text' : 'password'} placeholder="Create a strong password" value={formData.password} onChange={(e) => handlePasswordChange(e.target.value)} className={`dark-input rounded-xl h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-blue-500/50 pr-10 ${errors.password ? 'border-red-500/50' : ''}`} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passwordErrors.length > 0 && (
                <div className="mt-3 space-y-1.5">
                  {passwordErrors.map((error, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-red-400"><AlertCircle size={12} />{error}</div>
                  ))}
                </div>
              )}
              {formData.password && passwordErrors.length === 0 && (
                <div className="flex items-center gap-2 text-xs text-emerald-400 mt-3"><CheckCircle2 size={12} />Password is strong</div>
              )}
            </div>

            <div>
              <label className="block text-[13px] font-semibold tracking-wide text-white/70 mb-2 uppercase">Confirm Password</label>
              <Input type="password" placeholder="Confirm password" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} className={`dark-input rounded-xl h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-blue-500/50 ${errors.confirmPassword ? 'border-red-500/50' : ''}`} />
              {errors.confirmPassword && <p className="text-red-400 text-xs mt-1.5">{errors.confirmPassword}</p>}
            </div>

            <Button type="submit" disabled={isLoading} className="w-full bg-white text-black hover:bg-gray-100 font-semibold h-12 rounded-xl border-0 mt-4 transition-all shadow-lg">
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-sm text-white/50">
              Already have an account?{' '}
              <Link href="/login" className="text-white hover:text-blue-300 font-medium transition-colors">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
