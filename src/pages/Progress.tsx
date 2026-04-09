import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress as ProgressBar } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { Award, Target, Zap, Book, Search, CheckCircle2, Circle, Star } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function Progress() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [latestAssessment, setLatestAssessment] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, historyRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/stats`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch(`${API_BASE_URL}/api/assessments/history`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
      ]);

      const statsData = await statsRes.json();
      const historyData = await historyRes.json();

      setStats(statsData);
      if (historyData.length > 0) setLatestAssessment(historyData[0]);
    } catch (error) {
      console.error('Failed to load stats');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="flex items-center justify-center h-64">Loading...</div>;

  const chartData = stats?.history?.length > 0 ? stats.history : [
    { name: 'Start', progress: 0 },
    { name: 'Current', progress: 0 }
  ];

  const skillScores = latestAssessment ? Object.entries(latestAssessment.scores as Record<string, number>).map(([name, score]) => {
    const levels = ['None', 'Beg.', 'Inter.', 'Adv.', 'Expert'];
    return {
      name,
      level: levels[score],
      progress: (score / 4) * 100,
      color: score >= 3 ? 'bg-green-500' : score >= 2 ? 'bg-blue-500' : 'bg-orange-500'
    };
  }) : [];

  const achievementsList = [
    { icon: Award, title: 'First Assessment', desc: 'Completed skill assessment', completed: !!latestAssessment },
    { icon: Search, title: 'Explorer', desc: 'Viewed career paths', completed: true },
    { icon: Target, title: 'Gap Hunter', desc: 'Identified skill gaps', completed: !!latestAssessment },
    { icon: Book, title: 'Learner', desc: 'Explored resources', completed: true },
    { icon: Zap, title: 'Analyst', desc: 'Used progress tracker', completed: true },
    { icon: Star, title: 'Expert', desc: 'Any skill at Expert level', completed: skillScores.some(s => s.level === 'Expert') },
  ];

  return (
    <div className="space-y-8 pb-20 md:pb-0">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Progress & Analytics</h1>
        <p className="text-slate-500 text-lg">Track your skill development over time</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Overall', value: `${stats?.overall || 0}%`, color: 'bg-blue-50 text-blue-600' },
          { label: 'Programming', value: `${stats?.programming || 0}%`, color: 'bg-white text-slate-900 border border-slate-100' },
          { label: 'Data & Analytics', value: `${stats?.data || 0}%`, color: 'bg-white text-slate-900 border border-slate-100' },
          { label: 'Infra', value: `${stats?.infra || 0}%`, color: 'bg-white text-slate-900 border border-slate-100' },
        ].map((stat, i) => (
          <Card key={i} className={`${stat.color} border-none shadow-sm rounded-2xl`}>
            <CardContent className="p-6 flex flex-col items-center justify-center gap-1">
              <span className="text-2xl font-bold">{stat.value}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">{stat.label}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Chart */}
      <Card className="border-none shadow-sm rounded-[32px] overflow-hidden">
        <CardHeader className="p-8 pb-0 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-slate-900">Overall Progress</CardTitle>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Assessment Trend</p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-bold text-blue-600">{stats?.overall || 0}%</span>
          </div>
        </CardHeader>
        <CardContent className="p-8 pt-4 h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontWeight: 600, fill: '#94a3b8' }} 
                dy={10}
              />
              <YAxis hide domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                labelStyle={{ fontWeight: 700, color: '#1e293b' }}
              />
              <Area 
                type="monotone" 
                dataKey="progress" 
                stroke="#2563eb" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorProgress)" 
                dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Skill Scores */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
          INDIVIDUAL SKILL SCORES
        </div>
        <Card className="border-none shadow-sm rounded-[32px] overflow-hidden">
          <CardContent className="p-8 space-y-6">
            {skillScores.length > 0 ? skillScores.map((skill, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{skill.name}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${skill.level === 'Expert' || skill.level === 'Adv.' ? 'text-green-500' : 'text-blue-500'}`}>
                    {skill.level}
                  </span>
                </div>
                <ProgressBar value={skill.progress} className={`h-1.5 bg-slate-100`} indicatorClassName={skill.color} />
              </div>
            )) : (
              <p className="text-center text-slate-400 py-4">No skills assessed yet.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
          ACHIEVEMENTS
        </div>
        <div className="grid grid-cols-1 gap-3">
          {achievementsList.map((achievement, i) => (
            <Card key={i} className={`border-none shadow-sm rounded-2xl overflow-hidden ${!achievement.completed ? 'opacity-50 grayscale' : ''}`}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 ${achievement.completed ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'} rounded-xl flex items-center justify-center`}>
                    <achievement.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{achievement.title}</h4>
                    <p className="text-[10px] text-slate-500 font-medium">{achievement.desc}</p>
                  </div>
                </div>
                {achievement.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-300" />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
