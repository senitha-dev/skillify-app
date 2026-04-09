import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Briefcase, Shield, Code, Database, Cpu, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../lib/api';
import { toast } from 'sonner';

const icons: Record<string, any> = {
  'Software Engineer': Code,
  'Cybersecurity Analyst': Shield,
  'Data Analyst': Database,
  'ML / AI Engineer': Cpu,
  'DevOps Engineer': Globe,
  'Full Stack Developer': LayoutGrid,
};

function LayoutGrid(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
    </svg>
  );
}

export default function Careers() {
  const [paths, setPaths] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPaths();
  }, []);

  const fetchPaths = async () => {
    try {
      const res = await apiFetch('/api/career-paths');
      if (!res) return;
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Server error: ${res.status}`);
      }

      const data = await res.json();
      setPaths(Array.isArray(data) ? data : []);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load career paths');
      console.error('Careers fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="flex items-center justify-center h-64">Loading...</div>;

  return (
    <div className="space-y-8 pb-20 md:pb-0">
      <div className="flex items-center justify-between">
        <Button variant="ghost" className="gap-2 text-slate-500" onClick={() => navigate('/')}>
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">IT Career Paths</h1>
        <p className="text-slate-500 text-base sm:text-lg">Explore career paths and their skill requirements</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {paths.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
            <p className="text-slate-500 font-medium">No career paths available.</p>
            <Button onClick={() => navigate('/')} variant="outline" className="rounded-xl">
              Go to Dashboard to Initialize
            </Button>
          </div>
        ) : paths.map((path, i) => {
          const Icon = icons[path.title] || Briefcase;
          return (
            <Card key={i} className="border-none shadow-sm hover:shadow-md transition-all rounded-3xl overflow-hidden group">
              <CardContent className="p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 flex-1 w-full">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                    <Icon className="w-7 h-7 sm:w-8 sm:h-8" />
                  </div>
                  <div className="space-y-2 flex-1 w-full">
                    <div className="flex items-center justify-between sm:justify-start gap-3">
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-900">{path.title}</h3>
                      <Badge variant="secondary" className="bg-green-50 text-green-600 border-none font-bold text-[9px] sm:text-[10px] uppercase tracking-widest">
                        Very High
                      </Badge>
                    </div>
                    <p className="text-sm sm:text-base text-slate-500 max-w-xl line-clamp-2 sm:line-clamp-none">{path.description}</p>
                    <div className="flex items-center gap-6 pt-2">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Salary Range</p>
                        <p className="text-sm font-bold text-green-600">{path.salaryRange}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Growth</p>
                        <p className="text-sm font-bold text-blue-600">{path.growthRate}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-64 space-y-3">
                  <div className="flex justify-between items-end text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-slate-400">Your match: 58%</span>
                  </div>
                  <Progress value={58} className="h-2 bg-slate-100" />
                  <Button 
                    className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2 shadow-lg shadow-blue-200"
                    onClick={() => navigate('/gap-analysis')}
                  >
                    View Details
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
