import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCity, setRegCity] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(loginEmail, loginPassword);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (regPassword !== regConfirm) { setError('Passwords do not match'); return; }
    setLoading(true);
    try {
      await register({ email: regEmail, name: regName, phone: regPhone, city: regCity, password: regPassword });
      navigate('/estimate', { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.email?.[0] || err.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-container to-primary relative overflow-hidden flex-col justify-center items-center p-16">
        <div className="relative z-10 text-center">
          <h2 className="font-headline text-2xl font-black text-white mb-8">Home Interior</h2>
          <h3 className="font-headline text-4xl font-extrabold text-white leading-tight">Design Your Dream Space</h3>
          <p className="text-white/70 text-base mt-4 max-w-md">
            Join thousands of homeowners who plan their interiors with precision and confidence.
          </p>
          <div className="flex gap-8 mt-12 justify-center">
            {[['2,500+', 'Projects'], ['25+', 'Cities'], ['98%', 'Satisfaction']].map(([num, label]) => (
              <div key={label} className="text-white text-center">
                <p className="text-2xl font-extrabold font-headline">{num}</p>
                <p className="text-xs opacity-70 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <span className="material-symbols-outlined absolute -right-20 -bottom-20 text-[300px] opacity-5 text-white pointer-events-none">home</span>
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-surface">
        <div className="w-full max-w-md">
          <h2 className="lg:hidden font-headline text-xl font-black text-on-surface text-center mb-10">Home Interior</h2>

          {/* Tab toggle */}
          <div className="flex bg-surface-container-low rounded-xl p-1 mb-10">
            {(['login', 'register'] as const).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(''); }}
                className={`flex-1 py-3 text-center text-sm font-bold rounded-lg cursor-pointer transition-all ${
                  tab === t ? 'bg-surface-container-lowest text-on-surface shadow-sm' : 'text-secondary'
                }`}
              >
                {t === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-xl bg-error-container/30 text-error text-sm font-medium">{error}</div>
          )}

          {tab === 'login' ? (
            <>
              <h3 className="font-headline text-2xl font-extrabold text-on-surface">Welcome Back</h3>
              <p className="text-sm text-secondary mt-2">Sign in to access your estimates and projects</p>
              <form onSubmit={handleLogin} className="space-y-5 mt-8">
                <div>
                  <label className="text-sm font-semibold text-on-surface mb-2 block">Email Address</label>
                  <input type="email" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-5 py-3.5 bg-surface-container-low rounded-xl text-sm border-none outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-on-surface mb-2 block">Password</label>
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full px-5 py-3.5 bg-surface-container-low rounded-xl text-sm border-none outline-none focus:ring-2 focus:ring-primary/20 pr-12" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary">
                      <span className="material-symbols-outlined text-xl">{showPassword ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full bg-primary-container text-on-primary py-3.5 rounded-xl font-bold text-sm hover:bg-primary shadow-lg shadow-blue-500/10 transition-all disabled:opacity-50">
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>
              <p className="text-center mt-8 text-sm text-secondary">
                Don&apos;t have an account?{' '}
                <button onClick={() => setTab('register')} className="text-primary font-semibold">Create one</button>
              </p>
            </>
          ) : (
            <>
              <h3 className="font-headline text-2xl font-extrabold text-on-surface">Create Your Account</h3>
              <p className="text-sm text-secondary mt-2">Start estimating your dream interior in minutes</p>
              <form onSubmit={handleRegister} className="space-y-5 mt-8">
                <div>
                  <label className="text-sm font-semibold text-on-surface mb-2 block">Full Name</label>
                  <input type="text" required value={regName} onChange={(e) => setRegName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full px-5 py-3.5 bg-surface-container-low rounded-xl text-sm border-none outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-on-surface mb-2 block">Email</label>
                  <input type="email" required value={regEmail} onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-5 py-3.5 bg-surface-container-low rounded-xl text-sm border-none outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-on-surface mb-2 block">Phone</label>
                    <input type="tel" value={regPhone} onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="10-digit number"
                      className="w-full px-5 py-3.5 bg-surface-container-low rounded-xl text-sm border-none outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-on-surface mb-2 block">City</label>
                    <input type="text" value={regCity} onChange={(e) => setRegCity(e.target.value)}
                      placeholder="Your city"
                      className="w-full px-5 py-3.5 bg-surface-container-low rounded-xl text-sm border-none outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-on-surface mb-2 block">Password</label>
                  <input type="password" required minLength={8} value={regPassword} onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min 8 characters"
                    className="w-full px-5 py-3.5 bg-surface-container-low rounded-xl text-sm border-none outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-on-surface mb-2 block">Confirm Password</label>
                  <input type="password" required value={regConfirm} onChange={(e) => setRegConfirm(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full px-5 py-3.5 bg-surface-container-low rounded-xl text-sm border-none outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full bg-primary-container text-on-primary py-3.5 rounded-xl font-bold text-sm hover:bg-primary shadow-lg shadow-blue-500/10 transition-all disabled:opacity-50">
                  {loading ? 'Creating account...' : 'Create Account'}
                </button>
              </form>
              <p className="text-center mt-8 text-sm text-secondary">
                Already have an account?{' '}
                <button onClick={() => setTab('login')} className="text-primary font-semibold">Sign in</button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
