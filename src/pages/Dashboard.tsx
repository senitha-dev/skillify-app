import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  ArrowRight, 
  Sparkles, 
  LayoutGrid, 
  Star, 
  Settings, 
  Play, 
  GitBranch, 
  BarChart,
  CheckCircle2,
  Circle,
  Database
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const quickActions = [
  { icon: LayoutGrid, label: 'Take Assessment', desc: 'Evaluate your skills', path: '/assessments', color: 'text-slate-600', bg: 'bg-slate-50' },
  { icon: Star, label: 'Get Recommended', desc: 'Find your best career', path: '/careers', color: 'text-amber-500', bg: 'bg-amber-50' },
  { icon: Settings, label: 'View Skill Gaps', desc: 'See what to improve', path: '/gap-analysis', color: 'text-blue-600', bg: 'bg-blue-50' },
  { icon: Play, label: 'Start Learning', desc: 'Access courses', path: '/resources', color: 'text-blue-600', bg: 'bg-blue-50' },
  { icon: GitBranch, label: 'Career Paths', desc: 'Explore IT roles', path: '/careers', color: 'text-slate-600', bg: 'bg-slate-50' },
  { icon: BarChart, label: 'View Progress', desc: 'Track your growth', path: '/progress', color: 'text-blue-600', bg: 'bg-blue-50' },
];

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [needsInit, setNeedsInit] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [dbStatus, setDbStatus] = useState<'connected' | 'disconnected' | 'connecting' | 'unknown'>('unknown');

  useEffect(() => {
    console.log('Dashboard mounted. API_BASE_URL:', API_BASE_URL);
    const checkUser = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser && storedUser !== 'undefined') {
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.error('Failed to parse user');
      }
    };
    checkUser();
    checkInitialization();
    checkDbStatus();
  }, []);

  const checkDbStatus = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/health`);
      if (res.ok) {
        const data = await res.json();
        setDbStatus(data.database);
      } else {
        setDbStatus('disconnected');
      }
    } catch (error) {
      setDbStatus('disconnected');
    }
  };

  const checkInitialization = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/questions`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (!res.ok) {
        if (res.status === 403 || res.status === 401) {
          // Token might be invalid
          return;
        }
        throw new Error('Failed to fetch questions');
      }

      const data = await res.json();
      if (Array.isArray(data) && data.length === 0) {
        setNeedsInit(true);
      }
    } catch (error) {
      console.error('Failed to check initialization', error);
    }
  };

  const handleInitialize = async () => {
    setIsInitializing(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/seed`, { method: 'POST' });
      if (res.ok) {
        toast.success('System initialized successfully!');
        setNeedsInit(false);
        setTimeout(() => window.location.reload(), 1000);
      } else {
        throw new Error('Seeding failed');
      }
    } catch (error) {
      toast.error('Failed to initialize system');
    } finally {
      setIsInitializing(false);
    }
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).toUpperCase();

  return (
    <div className="space-y-8 pb-20 md:pb-0">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{today}</p>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              dbStatus === 'connected' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 
              dbStatus === 'connecting' ? 'bg-amber-500 animate-pulse' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]'
            }`} />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              DB: {dbStatus}
            </span>
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
          Welcome back, {user?.name?.split(' ')[0] || 'Alex'} 👋
        </h1>
        <p className="text-slate-500 text-base sm:text-lg">Start your skill assessment to get personalized career guidance.</p>
      </div>

      {needsInit && (
        <Card className="bg-amber-50 border-amber-100 shadow-none rounded-3xl overflow-hidden">
          <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-amber-900">System Not Initialized</h4>
                <p className="text-sm text-amber-700">The database is empty. Click to seed initial questions and career paths.</p>
              </div>
            </div>
            <Button 
              onClick={handleInitialize} 
              disabled={isInitializing}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl px-6"
            >
              {isInitializing ? 'Initializing...' : 'Initialize System'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Main CTA */}
      <Card className="bg-blue-50 border-none shadow-none rounded-3xl overflow-hidden relative">
        <CardContent className="p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">Complete Your Skill Assessment</h3>
              <p className="text-sm sm:text-slate-600 max-w-md">Answer a quick questionnaire to unlock career recommendations and gap analysis.</p>
            </div>
          </div>
          <Link to="/assessments" className="w-full md:w-auto">
            <Button className="w-full md:w-auto h-12 px-8 rounded-xl bg-blue-800 hover:bg-blue-900 text-white font-bold gap-2 shadow-lg shadow-blue-200">
              Start Now
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
          <Sparkles className="w-3 h-3" />
          QUICK ACTIONS
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {quickActions.map((action, i) => (
            <Link key={i} to={action.path}>
              <Card className="border-none shadow-sm hover:shadow-md transition-all cursor-pointer group rounded-2xl active:scale-[0.98]">
                <CardContent className="p-4 md:p-6 flex items-center justify-between">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className={`w-10 h-10 md:w-12 md:h-12 ${action.bg} ${action.color} rounded-xl flex items-center justify-center`}>
                      <action.icon className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm md:text-base">{action.label}</h4>
                      <p className="text-[10px] md:text-xs text-slate-500">{action.desc}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-900 transition-colors" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
          <BarChart className="w-3 h-3" />
          RECENT ACTIVITY
        </div>
        <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
          <CardContent className="p-0">
            <div className="p-6 flex items-center justify-between border-b border-slate-50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Account Created</h4>
                  <p className="text-xs text-slate-500">Just now</p>
                </div>
              </div>
            </div>
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center">
                  <Circle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Skill Assessment — <span className="text-slate-400 font-medium">Pending</span></h4>
                  <p className="text-xs text-slate-500">Not started</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
