import React, { useState } from 'react';
import { UserRole } from '../types';

interface AuthScreenProps {
  onLoginSuccess: (role: UserRole) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole>('Student');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('harish.narayanan@university.edu');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const msg = isLogin ? 'Signing you in...' : 'Account created successfully!';
      setToastMessage(msg);
      setIsLoading(false);

      setTimeout(() => {
        setToastMessage(null);
        onLoginSuccess(selectedRole);
      }, 1200);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#f9f9ff] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Glow Orbs */}
      <div className="fixed inset-0 -z-10 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-[#e2dfff] rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-[#6ffbbe] rounded-full blur-[100px]"></div>
      </div>

      <main className="w-full max-w-[440px] space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center items-center gap-2 mb-3">
            <div className="w-10 h-10 bg-[#4f46e5] rounded-xl flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-[#dad7ff] text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                hub
              </span>
            </div>
            <h1 className="font-['Inter'] font-black text-2xl text-[#3525cd] tracking-tight">CollabSphere</h1>
          </div>
          <h2 className="font-['Inter'] font-semibold text-xl text-[#141b2b]">
            {isLogin ? 'Welcome back' : 'Create Account'}
          </h2>
          <p className="font-['Inter'] text-sm text-[#464555]">
            {isLogin
              ? 'Access your academic workspace and team projects.'
              : 'Join CollabSphere to start working with your team.'}
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-[#ffffff] border border-[#c7c4d8] rounded-xl p-8 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Selector */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#464555]">Select Role</label>
              <div className="relative flex w-full bg-[#e9edff] p-1 rounded-lg border border-[#c7c4d8]">
                <div
                  className={`absolute left-1 top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-md shadow-xs transition-transform duration-300 ease-out ${
                    selectedRole === 'Faculty' ? 'translate-x-full' : 'translate-x-0'
                  }`}
                ></div>
                <button
                  type="button"
                  onClick={() => setSelectedRole('Student')}
                  className={`relative z-10 flex-1 py-1.5 font-semibold text-sm transition-colors ${
                    selectedRole === 'Student' ? 'text-[#3525cd]' : 'text-[#464555]'
                  }`}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('Faculty')}
                  className={`relative z-10 flex-1 py-1.5 font-semibold text-sm transition-colors ${
                    selectedRole === 'Faculty' ? 'text-[#3525cd]' : 'text-[#464555]'
                  }`}
                >
                  Faculty
                </button>
              </div>
            </div>

            {/* Registration Name Field */}
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-[#141b2b]">Full Name</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#464555] text-lg">
                    person
                  </span>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#777587] rounded-lg text-sm text-[#141b2b] focus:outline-hidden focus:ring-2 focus:ring-[#3525cd] focus:border-transparent placeholder-[#777587]"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-[#141b2b]">Email Address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#464555] text-lg">
                  mail
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@university.edu"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#777587] rounded-lg text-sm text-[#141b2b] focus:outline-hidden focus:ring-2 focus:ring-[#3525cd] focus:border-transparent placeholder-[#777587]"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-semibold text-[#141b2b]">Password</label>
                {isLogin && (
                  <a href="#forgot" onClick={(e) => e.preventDefault()} className="text-xs font-semibold text-[#3525cd] hover:underline">
                    Forgot password?
                  </a>
                )}
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#464555] text-lg">
                  lock
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-2.5 bg-white border border-[#777587] rounded-lg text-sm text-[#141b2b] focus:outline-hidden focus:ring-2 focus:ring-[#3525cd] focus:border-transparent placeholder-[#777587]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#464555] hover:text-[#3525cd] transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#3525cd] hover:opacity-90 active:scale-[0.98] text-white font-semibold text-sm rounded-lg shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                  Processing...
                </>
              ) : isLogin ? (
                <>
                  Sign In
                  <span className="material-symbols-outlined text-lg">login</span>
                </>
              ) : (
                <>
                  Create Account
                  <span className="material-symbols-outlined text-lg">person_add</span>
                </>
              )}
            </button>
          </form>

          {/* OR Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#c7c4d8]"></div>
            </div>
            <span className="relative px-4 bg-white text-xs font-semibold text-[#c7c4d8] uppercase">
              OR
            </span>
          </div>

          {/* Social / Institutional Login */}
          <button
            onClick={() => onLoginSuccess(selectedRole)}
            className="w-full py-2.5 bg-white border border-[#777587] text-[#141b2b] font-semibold text-sm rounded-lg hover:bg-[#f1f3ff] transition-colors flex items-center justify-center gap-3 cursor-pointer"
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
              </svg>
            </div>
            Continue with Institutional Email
          </button>
        </div>

        {/* Auth Toggle Link */}
        <p className="text-center text-sm text-[#464555]">
          <span>{isLogin ? "Don't have an account?" : 'Already have an account?'}</span>
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="ml-1 text-[#3525cd] font-semibold hover:underline cursor-pointer"
          >
            {isLogin ? 'Create an account' : 'Sign in here'}
          </button>
        </p>
      </main>

      {/* Success Feedback Toast */}
      {toastMessage && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#293040] text-[#edf0ff] px-6 py-3 rounded-full shadow-lg flex items-center gap-3 z-50 animate-bounce">
          <span className="material-symbols-outlined text-[#006c49]">check_circle</span>
          <span className="font-semibold text-sm">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
