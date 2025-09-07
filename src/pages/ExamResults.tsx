import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Calendar, User, Plus, BookOpen, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { ExamResultManager } from '@/components/teacher/ExamResultManager';

interface ExamResult {
  id: string;
  exam_name: string;
  subject: string;
  marks_obtained: number;
  total_marks: number;
  grade: string;
  exam_date: string;
  created_at: string;
}

const ExamResults = () => {
  const [results, setResults] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [showManager, setShowManager] = useState(false);
  const { profile, user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      let query = supabase
        .from('exam_results')
        .select(`
          id,
          exam_name,
          subject,
          marks_obtained,
          total_marks,
          grade,
          exam_date,
          created_at
        `);

      // Filter based on user role
      if (profile?.role === 'student') {
        query = query.eq('student_id', user?.id);
      } else if (profile?.role === 'teacher') {
        query = query.eq('teacher_id', user?.id);
      }

      const { data, error } = await query.order('exam_date', { ascending: false });

      if (error) throw error;
      setResults(data || []);
    } catch (error) {
      console.error('Error fetching exam results:', error);
      toast({
        title: "Error",
        description: "Failed to load exam results",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade.toUpperCase()) {
      case 'A':
      case 'A+':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'B':
      case 'B+':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'C':
      case 'C+':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'D':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'F':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const calculatePercentage = (obtained: number, total: number) => {
    return Math.round((obtained / total) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Exam Results</h1>
          <p className="text-gray-600 mt-2">
            {profile?.role === 'student' ? 'Your exam results and grades' : 'Student exam results and performance'}
          </p>
        </div>
        {(profile?.role === 'teacher' || profile?.role === 'admin') && (
          <Button onClick={() => setShowManager(!showManager)}>
            <Plus className="mr-2 h-4 w-4" />
            {showManager ? 'View Results' : 'Manage Results'}
          </Button>
        )}
      </div>

      {showManager && (profile?.role === 'teacher' || profile?.role === 'admin') ? (
        <ExamResultManager />
      ) : (
        <div className="grid gap-6">
          {results.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Trophy className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No exam results</h3>
                <p className="text-gray-600 text-center">
                  {profile?.role === 'student' 
                    ? 'You don\'t have any exam results yet.' 
                    : 'No exam results have been recorded yet.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            results.map((result) => (
              <Card key={result.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2 flex items-center">
                        <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                        {result.exam_name}
                      </CardTitle>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          {result.subject}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(result.exam_date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <Badge className={getGradeColor(result.grade)}>
                        Grade: {result.grade}
                      </Badge>
                      <Badge variant="secondary">
                        <Trophy className="h-3 w-3 mr-1" />
                        {calculatePercentage(result.marks_obtained, result.total_marks)}%
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{result.marks_obtained}</div>
                        <div className="text-sm text-gray-600">Score</div>
                      </div>
                      <div className="text-gray-400">/</div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{result.total_marks}</div>
                        <div className="text-sm text-gray-600">Total</div>
                      </div>
                    </div>
                    <div className="flex-1 mx-6">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${calculatePercentage(result.marks_obtained, result.total_marks)}%` }}
                        ></div>
                      </div>
                      <div className="text-center mt-2 text-sm text-gray-600">
                        {calculatePercentage(result.marks_obtained, result.total_marks)}% Performance
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ExamResults;