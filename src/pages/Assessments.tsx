import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Upload, CheckCircle2 } from 'lucide-react';
import { apiFetch } from '../lib/api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export default function Assessments() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [gpa, setGpa] = useState('');
  const [certifications, setCertifications] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const res = await apiFetch('/api/questions');
      if (!res) return;
      
      if (!res.ok) {
        throw new Error('Failed to load questions');
      }

      const data = await res.json();
      setQuestions(data);
    } catch (error) {
      console.error('Failed to load questions', error);
      toast.error('Failed to load questions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (category: string, score: number) => {
    setAnswers(prev => ({ ...prev, [category]: score }));
  };

  const handleSubmit = async () => {
    try {
      const res = await apiFetch('/api/assessments/submit', {
        method: 'POST',
        body: JSON.stringify({ 
          scores: answers,
          gpa,
          certifications
        })
      });
      if (!res) return;
      
      if (res.ok) {
        toast.success('Assessment submitted successfully!');
        navigate('/progress');
      }
    } catch (error) {
      toast.error('Failed to submit assessment');
    }
  };

  if (isLoading) return <div className="flex items-center justify-center h-64">Loading...</div>;

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <h2 className="text-xl font-bold text-slate-900">No Questions Available</h2>
        <p className="text-slate-500 text-center max-w-md">
          The assessment system hasn't been initialized yet. Please go back to the dashboard and initialize the system.
        </p>
        <Button onClick={() => navigate('/')} className="bg-blue-600 text-white rounded-xl px-8">
          Go to Dashboard
        </Button>
      </div>
    );
  }

  const progress = ((currentStep + 1) / (questions.length + 1)) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20 md:pb-0">
      <div className="flex items-center justify-between">
        <Button variant="ghost" className="gap-2 text-slate-500" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">Skill Assessment</h1>
        <p className="text-slate-500 text-base sm:text-lg">Rate your proficiency and provide academic details</p>
      </div>

      <Button variant="outline" className="w-full h-14 rounded-2xl border-blue-100 text-blue-600 font-bold gap-3 hover:bg-blue-50">
        <Upload className="w-5 h-5" />
        Upload CV to Auto-fill
      </Button>

      <div className="space-y-4">
        <div className="flex justify-between items-end text-[10px] font-bold uppercase tracking-widest">
          <span className="text-slate-400">STEP {currentStep + 1} OF {questions.length + 1}</span>
          <span className="text-blue-600">{Math.round(progress)}% COMPLETE</span>
        </div>
        <Progress value={progress} className="h-2 bg-slate-100" />
      </div>

      <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[24px] md:rounded-[32px] overflow-hidden">
        {currentStep < questions.length ? (
          <>
            <CardHeader className="p-6 md:p-8 pb-3 md:pb-4">
              <CardTitle className="text-xl md:text-3xl font-bold text-slate-900">{questions[currentStep]?.category}</CardTitle>
              <CardDescription className="text-xs md:text-lg text-slate-500">Rate your proficiency level for each skill.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 md:p-8 pt-3 md:pt-4 space-y-6 md:space-y-10">
              <div className="space-y-4 md:space-y-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <h4 className="font-bold text-slate-900 text-base md:text-lg leading-tight">{questions[currentStep]?.text}</h4>
                  <span className="text-blue-600 font-bold text-xs md:text-sm bg-blue-50 px-3 py-1 rounded-full w-fit">
                    {answers[questions[currentStep]?.category] !== undefined ? 
                      ['None', 'Beg.', 'Inter.', 'Adv.', 'Expert'][answers[questions[currentStep]?.category]] : 
                      'None'}
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-1 p-1 bg-slate-50 rounded-xl md:rounded-2xl border border-slate-100">
                  {['None', 'Beg.', 'Inter.', 'Adv.', 'Expert'].map((label, i) => (
                    <button
                      key={i}
                      onClick={() => handleAnswer(questions[currentStep]?.category, i)}
                      className={`py-3 md:py-4 rounded-lg md:rounded-xl text-[9px] sm:text-[10px] md:text-xs font-bold transition-all ${
                        answers[questions[currentStep]?.category] === i 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                        : 'text-slate-500 hover:bg-white hover:text-slate-900'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 md:gap-4">
                <Button 
                  variant="outline" 
                  className="flex-1 h-12 md:h-14 rounded-xl md:rounded-2xl border-slate-100 text-slate-600 font-bold gap-2"
                  disabled={currentStep === 0}
                  onClick={() => setCurrentStep(prev => prev - 1)}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
                <Button 
                  className="flex-1 h-12 md:h-14 rounded-xl md:rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2 shadow-lg shadow-blue-200"
                  onClick={() => setCurrentStep(prev => prev + 1)}
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader className="p-6 md:p-8 pb-3 md:pb-4">
              <CardTitle className="text-xl md:text-3xl font-bold text-slate-900">Academic Information</CardTitle>
              <CardDescription className="text-xs md:text-lg text-slate-500">Help us generate a more accurate career profile.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 md:p-8 pt-3 md:pt-4 space-y-6">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Current GPA / CGPA</label>
                  <input
                    type="text"
                    placeholder="e.g. 3.20"
                    className="w-full px-4 h-12 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={gpa}
                    onChange={(e) => setGpa(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Certifications & Extra Qualifications</label>
                  <textarea
                    placeholder="e.g. AWS Cloud Practitioner, Google Data Analytics Certificate, Cisco CCNA"
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                    value={certifications}
                    onChange={(e) => setCertifications(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-3 md:gap-4">
                <Button 
                  variant="outline" 
                  className="flex-1 h-12 md:h-14 rounded-xl md:rounded-2xl border-slate-100 text-slate-600 font-bold gap-2"
                  onClick={() => setCurrentStep(prev => prev - 1)}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
                <Button 
                  className="flex-1 h-12 md:h-14 rounded-xl md:rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2 shadow-lg shadow-blue-200"
                  onClick={handleSubmit}
                >
                  Submit
                  <CheckCircle2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
