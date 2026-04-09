import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Filter, Star, Clock, ExternalLink, Play, BookOpen, Award } from 'lucide-react';
import { toast } from 'sonner';

export default function Resources() {
  const [resources, setResources] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const res = await fetch('/api/resources', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      setResources(data);
    } catch (error) {
      toast.error('Failed to load resources');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredResources = filter === 'All' ? resources : resources.filter(r => r.type === filter.toLowerCase());

  if (isLoading) return <div className="flex items-center justify-center h-64">Loading...</div>;

  return (
    <div className="space-y-8 pb-20 md:pb-0">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Learning Resources</h1>
        <p className="text-slate-500 text-lg">Curated courses and materials to bridge your skill gaps</p>
      </div>

      <Card className="bg-blue-50 border-none shadow-none rounded-3xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
              <Star className="w-4 h-4 fill-current" />
            </div>
            <h3 className="text-sm font-bold text-blue-900 uppercase tracking-widest">Priority Learning Areas Based on Your Gaps</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {['Machine Learning / AI', 'Cloud Platforms (AWS/Azure/GCP)', 'Docker & Kubernetes', 'CI/CD Pipelines', 'Linux / System Admin', 'Data Visualization'].map((tag, i) => (
              <Badge key={i} variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none px-4 py-1.5 rounded-full font-semibold">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto">
          {['All', 'Course', 'Certificate', 'Video'].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all ${filter === t ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <Input placeholder="Search resources..." className="pl-10 h-11 bg-white border-slate-200 rounded-xl" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredResources.map((resource, i) => (
          <Card key={i} className="border-none shadow-sm hover:shadow-md transition-all rounded-3xl overflow-hidden group">
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 font-bold">
                    {resource.provider[0]}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{resource.provider}</p>
                    <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{resource.title}</h4>
                  </div>
                </div>
                <Badge variant="secondary" className={`${resource.isPaid ? 'bg-purple-50 text-purple-600' : 'bg-green-50 text-green-600'} border-none font-bold text-[10px] uppercase tracking-widest`}>
                  {resource.isPaid ? 'Paid' : 'Free'}
                </Badge>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {resource.duration}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  {resource.rating}
                </div>
                <div className="flex items-center gap-1">
                  {resource.type === 'course' ? <BookOpen className="w-3 h-3" /> : resource.type === 'video' ? <Play className="w-3 h-3" /> : <Award className="w-3 h-3" />}
                  <span className="uppercase tracking-widest">{resource.type}</span>
                </div>
              </div>

              <Button className="w-full h-11 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold gap-2">
                View Course
                <ExternalLink className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
