import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Sparkles, Target, Zap, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../lib/api';
import { toast } from 'sonner';

export default function GapAnalysis() {
  const [selectedCareer, setSelectedCareer] = useState<any>(null);
  const [careerPaths, setCareerPaths] = useState<any[]>([]);
  const [latestAssessment, setLatestAssessment] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pathsRes, historyRes] = await Promise.all([
        apiFetch('/api/career-paths'),
        apiFetch('/api/assessments/history')
      ]);

      if (!pathsRes || !historyRes) return;

      if (!pathsRes.ok || !historyRes.ok) {
        throw new Error('Failed to fetch gap analysis data');
      }

      const paths = await pathsRes.json();
      const history = await historyRes.json();

      setCareerPaths(Array.isArray(paths) ? paths : []);
      if (Array.isArray(paths) && paths.length > 0) setSelectedCareer(paths[0]);
      if (Array.isArray(history) && history.length > 0) setLatestAssessment(history[0]);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load data');
      console.error('Gap analysis fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="flex items-center justify-center h-64">Loading...</div>;

  if (!latestAssessment) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <AlertCircle className="w-12 h-12 text-slate-300" />
        <h2 className="text-xl font-bold text-slate-900">No Assessment Found</h2>
        <p className="text-slate-500">Please complete an assessment first to see your skill gaps.</p>
        <Button onClick={() => navigate('/assessments')} className="bg-blue-600 text-white rounded-xl px-8">
          Start Assessment
        </Button>
      </div>
    );
  }

  const getSkillGaps = () => {
    if (!selectedCareer || !latestAssessment) return [];
    
    return selectedCareer.requiredSkills.map((req: any) => {
      const have = latestAssessment.scores[req.name] || 0;
      const gap = req.level - have;
      const levels = ['None', 'Beg.', 'Inter.', 'Adv.', 'Expert'];
      
      return {
        name: req.name,
        need: levels[req.level],
        have: levels[have],
        gap: gap <= 0 ? 'Met' : `+${gap} Level${gap > 1 ? 's' : ''}`,
        progress: (have / req.level) * 100,
        color: gap <= 0 ? 'bg-green-500' : gap === 1 ? 'bg-orange-500' : 'bg-red-500'
      };
    });
  };

  const skillGaps = getSkillGaps();
  const metCount = skillGaps.filter(g => g.gap === 'Met').length;
  const readiness = Math.round((metCount / skillGaps.length) * 100) || 0;

  return (
    <div className="space-y-8 pb-20 md:pb-0">
      <div className="flex items-center justify-between">
        <Button variant="ghost" className="gap-2 text-slate-500" onClick={() => navigate('/')}>
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">Skill Gap Identification</h1>
        <p className="text-slate-500 text-base sm:text-lg">Compare your skills against your target career requirements</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
          SELECT TARGET CAREER
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {careerPaths.map((career) => (
            <Button
              key={career._id}
              onClick={() => setSelectedCareer(career)}
              className={`h-12 px-8 rounded-xl font-bold whitespace-nowrap transition-all ${
                selectedCareer?._id === career._id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {career.title}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Career Readiness', value: `${readiness}%`, color: 'text-green-500' },
          { label: 'Skills to Improve', value: skillGaps.length - metCount, color: 'text-orange-500' },
          { label: 'Skills on Track', value: metCount, color: 'text-green-500' },
          { label: 'Total Gap Levels', value: skillGaps.reduce((acc, curr) => acc + (curr.gap === 'Met' ? 0 : parseInt(curr.gap)), 0), color: 'text-red-500' },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm rounded-2xl">
            <CardContent className="p-6 flex flex-col items-center justify-center gap-1">
              <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">{stat.label}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[32px] overflow-hidden">
        <CardContent className="p-6 md:p-8 space-y-8 md:space-y-10">
          <div className="flex items-center gap-3">
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 leading-tight">Skill Gap: <span className="text-blue-600">{selectedCareer?.title}</span></h3>
          </div>

          <div className="space-y-8">
            {skillGaps.map((skill, i) => (
              <div key={i} className="space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{skill.name}</span>
                  <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest">
                    <div className="flex flex-col">
                      <span className="text-slate-400">Need:</span>
                      <span className="text-slate-900">{skill.need}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-slate-400">Have:</span>
                      <span className="text-blue-600">{skill.have}</span>
                    </div>
                    <Badge variant="secondary" className={`${skill.gap === 'Met' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'} border-none px-3`}>
                      {skill.gap}
                    </Badge>
                  </div>
                </div>
                <div className="relative">
                  <Progress value={skill.progress} className="h-2 bg-slate-100" indicatorClassName={skill.color} />
                  <div className="flex justify-between mt-1 text-[8px] font-bold text-slate-300 uppercase tracking-widest">
                    <span>None</span>
                    <span>Expert</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <Button 
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-bold gap-2 shadow-lg shadow-blue-200"
              onClick={() => navigate('/resources')}
            >
              Get Learning Resources
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button variant="outline" className="w-full h-14 rounded-2xl border-slate-100 text-slate-600 font-bold">
              View All Recommendations
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
