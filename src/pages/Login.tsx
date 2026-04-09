import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mail, Lock, ArrowRight, Github, Chrome, User } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';

import { API_BASE_URL } from '../config';

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const endpoint = `${API_BASE_URL}${isLogin ? '/api/auth/login' : '/api/auth/register'}`;
      const body = isLogin ? { email, password } : { name, email, password };
      
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => ({ message: 'Server error' }));

      if (!res.ok) throw new Error(data.message || 'Something went wrong');

      if (isLogin) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.dispatchEvent(new Event('auth-change'));
        toast.success('Welcome back to Skillify!');
        onLogin();
        navigate('/');
      } else {
        toast.success('Account created! Please login.');
        setIsLogin(true);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
      <div className="mb-8 flex flex-col items-center gap-2">
        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
          <span className="text-white font-bold text-2xl">S</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Skillify</h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="border-none shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden">
          <CardHeader className="pt-8 pb-4 text-center">
            <CardTitle className="text-2xl font-bold text-slate-900">
              {isLogin ? 'Welcome Back' : 'Join Skillify'}
            </CardTitle>
            <CardDescription className="text-slate-500">
              {isLogin ? 'Continue your professional journey' : 'Start your skill assessment today'}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <Input
                      placeholder="John Doe"
                      className="pl-10 bg-slate-50 border-slate-100 h-11 rounded-xl focus:ring-blue-500"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input
                    type="email"
                    placeholder="name@university.edu"
                    className="pl-10 bg-slate-50 border-slate-100 h-11 rounded-xl focus:ring-blue-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                  {isLogin && (
                    <button type="button" className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:underline">
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 bg-slate-50 border-slate-100 h-11 rounded-xl focus:ring-blue-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit"
                className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-semibold shadow-lg shadow-blue-200 transition-all active:scale-[0.98] active:opacity-90"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : (
                  <span className="flex items-center gap-2">
                    {isLogin ? 'Login to Skillify' : 'Create Account'}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-8">
              <div className="relative flex items-center justify-center mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-100"></div>
                </div>
                <span className="relative px-4 bg-white text-[10px] font-bold text-slate-400 uppercase tracking-widest">Social Access</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-11 rounded-xl border-slate-100 bg-slate-50 hover:bg-slate-100 gap-2 text-slate-600">
                  <Chrome className="w-4 h-4" />
                  <span className="text-sm font-semibold">Google</span>
                </Button>
                <Button variant="outline" className="h-11 rounded-xl border-slate-100 bg-slate-50 hover:bg-slate-100 gap-2 text-slate-600">
                  <Github className="w-4 h-4" />
                  <span className="text-sm font-semibold">GitHub</span>
                </Button>
              </div>
            </div>

            <p className="mt-8 text-center text-sm text-slate-500">
              {isLogin ? 'New to the platform?' : 'Already have an account?'}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-1 font-bold text-blue-600 hover:underline"
              >
                {isLogin ? 'Sign Up' : 'Login'}
              </button>
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <div className="mt-12 flex flex-col items-center gap-4">
        <div className="flex gap-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <button className="hover:text-slate-600">Privacy Policy</button>
          <button className="hover:text-slate-600">Terms of Service</button>
          <button className="hover:text-slate-600">Infrastructure Status</button>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <div className="w-4 h-4 bg-slate-200 rounded-full flex items-center justify-center text-[8px] text-slate-500">✓</div>
          SECURE JWT V2.4 ENABLED
        </div>
      </div>
    </div>
  );
}
