import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Edit, Trash2, TrendingUp, Calendar, User, GraduationCap, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const examResultSchema = z.object({
  student_id: z.string().min(1, 'Student is required'),
  exam_name: z.string().min(1, 'Exam name is required'),
  subject: z.string().min(1, 'Subject is required'),
  exam_date: z.string().min(1, 'Exam date is required'),
  marks_obtained: z.number().min(0, 'Marks must be positive'),
  total_marks: z.number().min(1, 'Total marks must be greater than 0'),
  grade: z.string().optional(),
  status: z.enum(['draft', 'pending', 'published']).default('draft')
});

type ExamResultFormData = z.infer<typeof examResultSchema>;

interface ExamResult {
  id: string;
  student_id: string;
  exam_name: string;
  subject: string;
  exam_date: string;
  marks_obtained: number;
  total_marks: number;
  grade: string | null;
  status: 'draft' | 'pending' | 'published';
  created_at: string;
  updated_at: string;
}

interface Student {
  id: string;
  user_id: string;
  full_name: string;
  student_id: string | null;
  class_name: string | null;
}

export const ExamResultManager = () => {
  const { toast } = useToast();
  const [examResults, setExamResults] = useState<ExamResult[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingResult, setEditingResult] = useState<ExamResult | null>(null);

  const form = useForm<ExamResultFormData>({
    resolver: zodResolver(examResultSchema),
    defaultValues: {
      student_id: '',
      exam_name: '',
      subject: '',
      exam_date: '',
      marks_obtained: 0,
      total_marks: 100,
      grade: '',
      status: 'draft'
    }
  });

  useEffect(() => {
    fetchExamResults();
    fetchStudents();
  }, []);

  const fetchExamResults = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('exam_results')
        .select('*')
        .eq('teacher_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setExamResults(data || []);
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

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, user_id, full_name, student_id, class_name')
        .eq('role', 'student')
        .order('full_name');

      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const calculateGrade = (obtained: number, total: number): string => {
    const percentage = (obtained / total) * 100;
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C+';
    if (percentage >= 40) return 'C';
    if (percentage >= 30) return 'D';
    return 'F';
  };

  const onSubmit = async (data: ExamResultFormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const grade = data.grade || calculateGrade(data.marks_obtained, data.total_marks);

      const resultData = {
        student_id: data.student_id,
        exam_name: data.exam_name,
        subject: data.subject,
        exam_date: data.exam_date,
        marks_obtained: data.marks_obtained,
        total_marks: data.total_marks,
        grade,
        status: data.status,
        published_at: data.status === 'published' ? new Date().toISOString() : null
      };

      if (editingResult) {
        const { error } = await supabase
          .from('exam_results')
          .update(resultData)
          .eq('id', editingResult.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Exam result updated successfully"
        });
      } else {
        const { error } = await supabase
          .from('exam_results')
          .insert({
            ...resultData,
            teacher_id: user.id
          });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Exam result created successfully"
        });
      }

      setIsDialogOpen(false);
      setEditingResult(null);
      form.reset();
      fetchExamResults();
    } catch (error) {
      console.error('Error saving exam result:', error);
      toast({
        title: "Error",
        description: "Failed to save exam result",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (result: ExamResult) => {
    setEditingResult(result);
    form.reset({
      student_id: result.student_id,
      exam_name: result.exam_name,
      subject: result.subject,
      exam_date: result.exam_date,
      marks_obtained: result.marks_obtained,
      total_marks: result.total_marks,
      grade: result.grade || '',
      status: result.status
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this exam result?')) return;

    try {
      const { error } = await supabase
        .from('exam_results')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Exam result deleted successfully"
      });
      fetchExamResults();
    } catch (error) {
      console.error('Error deleting exam result:', error);
      toast({
        title: "Error",
        description: "Failed to delete exam result",
        variant: "destructive"
      });
    }
  };

  const handleNewResult = () => {
    setEditingResult(null);
    form.reset();
    setIsDialogOpen(true);
  };

  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.user_id === studentId);
    return student ? student.full_name : 'Unknown Student';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-100 text-green-700">Published</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>;
      default:
        return <Badge variant="secondary">Draft</Badge>;
    }
  };

  const getGradeBadge = (grade: string | null, obtained: number, total: number) => {
    const percentage = (obtained / total) * 100;
    const displayGrade = grade || calculateGrade(obtained, total);
    
    let variant: "default" | "secondary" | "destructive" = "default";
    if (percentage >= 80) variant = "default";
    else if (percentage >= 60) variant = "secondary";
    else variant = "destructive";

    return <Badge variant={variant}>{displayGrade}</Badge>;
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Exam Results</h3>
          <p className="text-sm text-gray-600">Create and manage student exam results</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNewResult} className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Add Result
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingResult ? 'Edit Exam Result' : 'Create Exam Result'}</DialogTitle>
              <DialogDescription>
                {editingResult ? 'Update the exam result details' : 'Create a new exam result for a student'}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="student_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Student</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select student" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {students.map((student) => (
                            <SelectItem key={student.user_id} value={student.user_id}>
                              <div className="flex items-center">
                                <GraduationCap className="mr-2 h-4 w-4" />
                                {student.full_name}
                                {student.class_name && (
                                  <span className="ml-2 text-gray-500">({student.class_name})</span>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="exam_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Exam Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Mid-term Exam" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Mathematics" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="exam_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exam Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="marks_obtained"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Marks Obtained</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="total_marks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Marks</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 100)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="grade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Grade (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Auto-calculated" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="pending">Pending Review</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingResult ? 'Update' : 'Create'} Result
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {examResults.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-gray-400 mb-4">
                <TrendingUp className="h-12 w-12" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No exam results yet</h3>
              <p className="text-gray-600 text-center mb-4">
                Create your first exam result to track student performance.
              </p>
              <Button onClick={handleNewResult}>
                <Plus className="mr-2 h-4 w-4" />
                Create Exam Result
              </Button>
            </CardContent>
          </Card>
        ) : (
          examResults.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <FileText className="mr-2 h-5 w-5 text-blue-600" />
                      <CardTitle className="text-lg">{item.exam_name}</CardTitle>
                      <Badge variant="outline" className="ml-2">{item.subject}</Badge>
                    </div>
                    <CardDescription className="flex items-center flex-wrap gap-4">
                      <div className="flex items-center">
                        <GraduationCap className="mr-1 h-4 w-4" />
                        {getStudentName(item.student_id)}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-4 w-4" />
                        {format(new Date(item.exam_date), 'MMM dd, yyyy')}
                      </div>
                      <div className="flex items-center">
                        <User className="mr-1 h-4 w-4" />
                        You
                      </div>
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(item.status)}
                    {getGradeBadge(item.grade, item.marks_obtained, item.total_marks)}
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-lg font-semibold">
                    Score: {item.marks_obtained}/{item.total_marks}
                  </div>
                  <div className="text-lg font-semibold text-blue-600">
                    {((item.marks_obtained / item.total_marks) * 100).toFixed(1)}%
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};