import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiFetch } from '../lib/api';
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
  const [isUriSet, setIsUriSet] = useState<boolean | null>(null);
  const [isApiUrlSet, setIsApiUrlSet] = useState<boolean | null>(null);
  const [availableKeys, setAvailableKeys] = useState<string[]>([]);
  const [dbError, setDbError] = useState<string | null>(null);
  const [isMobileWithoutApi, setIsMobileWithoutApi] = useState(false);

  useEffect(() => {
    // Check if we are on mobile (not http/https) and API_BASE_URL is empty
    if (typeof window !== 'undefined' && !window.location.protocol.startsWith('http') && !API_BASE_URL) {
      setIsMobileWithoutApi(true);
    }
    
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
      const healthUrl = `${API_BASE_URL}/api/health`;
      const res = await fetch(healthUrl);
      if (res.ok) {
        const data = await res.json();
        setDbStatus(data.database || 'unknown');
        setIsUriSet(data.mongodb_uri_set);
        setIsApiUrlSet(data.vite_api_url_set);
        setAvailableKeys(data.available_keys || []);
        setDbError(data.db_error);
      } else {
        setDbStatus('disconnected');
        setDbError(`API returned status ${res.status}: ${res.statusText}`);
      }
    } catch (error: any) {
      setDbStatus('disconnected');
      const message = error.message === 'Failed to fetch' 
        ? 'Failed to fetch (likely a CORS error or server is down). Make sure your Railway backend allows requests from this origin.'
        : error.message;
      setDbError(`Failed to connect to API at ${API_BASE_URL}: ${message}`);
    }
  };

  const checkInitialization = async () => {
    const token = localStorage.getItem('token');
    if (!token) return; // Don't check if not logged in

    try {
      const res = await apiFetch('/api/questions');
      if (!res) return;
      
      if (!res.ok) {
        if (res.status === 403 || res.status === 401) {
          return;
        }
        return; // Silently fail to avoid toast spam
      }

      const data = await res.json();
      if (Array.isArray(data) && data.length === 0) {
        setNeedsInit(true);
      }
    } catch (error) {
      // Silently fail
    }
  };

  const handleInitialize = async () => {
    setIsInitializing(true);
    try {
      const res = await apiFetch('/api/seed', { method: 'POST' });
      if (!res) return;
      
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

      {dbStatus !== 'connected' && (
        <Card className="bg-slate-900 border-slate-800 shadow-2xl rounded-3xl overflow-hidden">
          <CardContent className="p-0">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">System Diagnostics</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">{new Date().toISOString()}</span>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">Connection Status</p>
                    <p className="text-xl font-mono font-bold text-red-400 uppercase">{dbStatus}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">Environment</p>
                    <p className="text-sm font-mono text-slate-300">{window.location.protocol.startsWith('http') ? 'Web Preview' : 'Mobile App'}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">Active API Endpoint</p>
                    <p className="text-sm font-mono text-blue-400 truncate">{API_BASE_URL || '(relative path)'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">Secret Configured</p>
                    <p className={`text-sm font-mono ${isUriSet ? 'text-green-400' : 'text-red-400'}`}>
                      MONGODB_URI: {isUriSet ? 'YES' : 'MISSING'}
                    </p>
                    {!isUriSet && (
                      <p className="text-[9px] text-slate-500 italic mt-1 leading-tight">
                        Go to Settings &rarr; Secrets and add MONGODB_URI
                      </p>
                    )}
                  </div>
                  <div className="space-y-1 mt-2">
                    <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">Detected Env Keys</p>
                    <p className="text-[9px] font-mono text-slate-400">
                      {availableKeys.length > 0 ? availableKeys.join(', ') : 'None detected'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <p className="text-[10px] font-mono font-bold text-red-500 uppercase tracking-widest">Last Error Output</p>
                <div className="font-mono text-xs text-slate-400 leading-relaxed break-all">
                  {dbError || 'No error message received from server. Check if the server is running.'}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row gap-3">
                <Button 
                  className="bg-white hover:bg-slate-200 text-slate-900 font-bold rounded-xl px-6"
                  onClick={() => window.location.reload()}
                >
                  Retry Connection
                </Button>
                <Button 
                  variant="outline"
                  className="border-slate-700 text-slate-300 hover:bg-slate-800 font-bold rounded-xl px-6"
                  onClick={() => window.open('https://cloud.mongodb.com', '_blank')}
                >
                  Check Atlas Status
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {isMobileWithoutApi && dbStatus === 'connected' && (
        <Card className="bg-orange-50 border-orange-100 shadow-none rounded-3xl overflow-hidden">
          <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-orange-900">Mobile API URL Required</h4>
                <p className="text-sm text-orange-700">For the mobile app to work, you must set the VITE_API_URL secret in AI Studio to your project's App URL.</p>
                <p className="text-[10px] mt-1 text-orange-600 font-mono">Current API: {API_BASE_URL || '(relative path - will fail on mobile)'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {needsInit && dbStatus === 'connected' && (
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
