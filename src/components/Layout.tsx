import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, ClipboardList, Briefcase, BookOpen, BarChart3, User, LogOut, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const navItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: ClipboardList, label: 'Assessments', path: '/assessments' },
  { icon: Briefcase, label: 'Careers', path: '/careers' },
  { icon: BarChart3, label: 'Gap Analysis', path: '/gap-analysis' },
  { icon: BookOpen, label: 'Resources', path: '/resources' },
  { icon: User, label: 'Profile', path: '/progress' },
];

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('auth-change'));
    navigate('/login', { replace: true });
  };

  const getUser = () => {
    try {
      const stored = localStorage.getItem('user');
      if (!stored || stored === 'undefined') return { name: 'User' };
      return JSON.parse(stored);
    } catch (e) {
      return { name: 'User' };
    }
  };

  const user = getUser();

  const bottomNavItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: ClipboardList, label: 'Assessments', path: '/assessments' },
    { icon: Briefcase, label: 'Careers', path: '/careers' },
    { icon: BookOpen, label: 'Resources', path: '/resources' },
    { icon: User, label: 'Profile', path: '/progress' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col overflow-x-hidden">
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[100] md:hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-[280px] bg-white shadow-2xl p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xl">S</span>
                  </div>
                  <h1 className="text-xl font-bold text-slate-900 tracking-tight">Skillify</h1>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                  <Menu className="w-6 h-6 rotate-90" />
                </Button>
              </div>

              <nav className="flex-1 space-y-2">
                {navItems.map((item) => (
                  <Link 
                    key={item.path} 
                    to={item.path} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 p-4 rounded-2xl font-bold transition-all ${
                      location.pathname === item.path 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="pt-6 border-t border-slate-100 space-y-4">
                <div className="flex items-center gap-3 px-2">
                  <Avatar className="w-10 h-10 border-2 border-white shadow-sm">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
                    <AvatarFallback>UN</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{user.name || 'User'}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Undergraduate</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-2xl h-12 font-bold"
                  onClick={handleLogout}
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 safe-top">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Skillify</h1>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <nav className="flex items-center gap-1">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant="ghost"
                    className={`gap-2 ${location.pathname === item.path ? 'bg-blue-50 text-blue-600 hover:bg-blue-50 hover:text-blue-600' : 'text-slate-600'}`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                </Link>
              ))}
            </nav>
            <div className="h-6 w-px bg-slate-200 mx-2" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-slate-900">{user.name || 'User'}</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Undergraduate</p>
              </div>
              <Avatar className="w-9 h-9 border-2 border-white shadow-sm">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
                <AvatarFallback>UN</AvatarFallback>
              </Avatar>
              <Button variant="ghost" size="icon" onClick={handleLogout} className="text-slate-400 hover:text-red-500">
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <Menu className="w-6 h-6" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 pb-24 md:pb-6">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          <Outlet />
        </motion.div>
      </main>

      {/* Mobile Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-slate-200 px-4 pt-2 pb-safe flex justify-around items-center z-50">
        {bottomNavItems.map((item) => (
          <Link key={item.path} to={item.path} className="flex flex-col items-center gap-1 flex-1 py-1">
            <div className={`p-2 rounded-2xl transition-all ${location.pathname === item.path ? 'bg-blue-600 text-white shadow-lg shadow-blue-100 scale-110' : 'text-slate-400'}`}>
              <item.icon className="w-5 h-5" />
            </div>
            <span className={`text-[9px] font-bold uppercase tracking-tighter ${location.pathname === item.path ? 'text-blue-600' : 'text-slate-400'}`}>
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
