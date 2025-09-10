import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { User, Phone, Mail, Calendar, BookOpen, Award, Building, Search, Filter, UserPlus } from 'lucide-react';

interface Faculty {
  id: string;
  user_id?: string;
  employee_id: string;
  designation: string;
  department: string;
  qualification?: string;
  experience_years?: number;
  subjects_taught?: string[];
  joining_date?: string;
  phone?: string;
  emergency_contact?: string;
  address?: string;
  bio?: string;
  profile_image_url?: string;
  is_active: boolean;
  created_at: string;
}

interface Department {
  id: string;
  name: string;
  description?: string;
  subjects?: string[];
}

const Faculty = () => {
  const { user, profile } = useAuth();
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [facultyData, setFacultyData] = useState({
    employee_id: '',
    designation: '',
    department: '',
    qualification: '',
    experience_years: '',
    subjects_taught: '',
    joining_date: '',
    phone: '',
    emergency_contact: '',
    address: '',
    bio: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch faculty
      const { data: facultyData, error: facultyError } = await supabase
        .from('faculty')
        .select('*')
        .eq('is_active', true)
        .order('joining_date', { ascending: false });

      if (facultyError) throw facultyError;

      // Fetch departments
      const { data: departmentsData, error: departmentsError } = await supabase
        .from('departments')
        .select('*')
        .order('name');

      if (departmentsError) throw departmentsError;

      setFaculty(facultyData || []);
      setDepartments(departmentsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch faculty information');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFaculty = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const subjectsArray = facultyData.subjects_taught
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const { error } = await supabase
        .from('faculty')
        .insert([
          {
            employee_id: facultyData.employee_id,
            designation: facultyData.designation,
            department: facultyData.department,
            qualification: facultyData.qualification,
            experience_years: facultyData.experience_years ? parseInt(facultyData.experience_years) : null,
            subjects_taught: subjectsArray,
            joining_date: facultyData.joining_date || null,
            phone: facultyData.phone,
            emergency_contact: facultyData.emergency_contact,
            address: facultyData.address,
            bio: facultyData.bio,
            is_active: true
          }
        ]);

      if (error) throw error;

      toast.success('Faculty member added successfully!');
      setFacultyData({
        employee_id: '',
        designation: '',
        department: '',
        qualification: '',
        experience_years: '',
        subjects_taught: '',
        joining_date: '',
        phone: '',
        emergency_contact: '',
        address: '',
        bio: ''
      });
      setShowAddForm(false);
      fetchData();
    } catch (error) {
      console.error('Error adding faculty:', error);
      toast.error('Failed to add faculty member');
    }
  };

  const filteredFaculty = faculty.filter(member => {
    const matchesSearch = 
      member.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.qualification?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || member.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  const canManage = profile?.role === 'admin';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-gray-200 h-64 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Faculty Directory</h1>
            <p className="text-gray-600 mt-2">Meet our dedicated teaching staff</p>
          </div>
          {canManage && (
            <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Add Faculty
            </Button>
          )}
        </div>

        {/* Statistics */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Faculty</p>
                  <p className="text-2xl font-bold text-blue-600">{faculty.length}</p>
                </div>
                <User className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Departments</p>
                  <p className="text-2xl font-bold text-green-600">{departments.length}</p>
                </div>
                <Building className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Experience</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {Math.round(faculty.reduce((acc, f) => acc + (f.experience_years || 0), 0) / faculty.length || 0)} yrs
                  </p>
                </div>
                <Award className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">PhD Holders</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {faculty.filter(f => f.qualification?.toLowerCase().includes('phd')).length}
                  </p>
                </div>
                <BookOpen className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search faculty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map(dept => (
                <SelectItem key={dept.id} value={dept.name}>{dept.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Add Faculty Form */}
        {showAddForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Add New Faculty Member</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddFaculty} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <Label htmlFor="employee_id">Employee ID *</Label>
                    <Input
                      id="employee_id"
                      required
                      value={facultyData.employee_id}
                      onChange={(e) => setFacultyData({ ...facultyData, employee_id: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="designation">Designation *</Label>
                    <Input
                      id="designation"
                      required
                      value={facultyData.designation}
                      onChange={(e) => setFacultyData({ ...facultyData, designation: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="department">Department *</Label>
                    <Select
                      value={facultyData.department}
                      onValueChange={(value) => setFacultyData({ ...facultyData, department: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map(dept => (
                          <SelectItem key={dept.id} value={dept.name}>{dept.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="qualification">Qualification</Label>
                    <Input
                      id="qualification"
                      value={facultyData.qualification}
                      onChange={(e) => setFacultyData({ ...facultyData, qualification: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="experience_years">Experience (Years)</Label>
                    <Input
                      id="experience_years"
                      type="number"
                      value={facultyData.experience_years}
                      onChange={(e) => setFacultyData({ ...facultyData, experience_years: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="joining_date">Joining Date</Label>
                    <Input
                      id="joining_date"
                      type="date"
                      value={facultyData.joining_date}
                      onChange={(e) => setFacultyData({ ...facultyData, joining_date: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={facultyData.phone}
                      onChange={(e) => setFacultyData({ ...facultyData, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergency_contact">Emergency Contact</Label>
                    <Input
                      id="emergency_contact"
                      value={facultyData.emergency_contact}
                      onChange={(e) => setFacultyData({ ...facultyData, emergency_contact: e.target.value })}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="subjects_taught">Subjects Taught (comma-separated)</Label>
                  <Input
                    id="subjects_taught"
                    value={facultyData.subjects_taught}
                    onChange={(e) => setFacultyData({ ...facultyData, subjects_taught: e.target.value })}
                    placeholder="Mathematics, Physics, Chemistry"
                  />
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={facultyData.address}
                    onChange={(e) => setFacultyData({ ...facultyData, address: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={facultyData.bio}
                    onChange={(e) => setFacultyData({ ...facultyData, bio: e.target.value })}
                    placeholder="Brief professional biography"
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="submit">Add Faculty</Button>
                  <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Faculty Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredFaculty.map((member) => (
            <Card key={member.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900">{member.designation}</h3>
                    <p className="text-sm text-gray-600">ID: {member.employee_id}</p>
                    <Badge variant="outline" className="mt-2">
                      {member.department}
                    </Badge>
                  </div>
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-gray-600" />
                  </div>
                </div>

                {member.qualification && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-600">
                      <Award className="h-4 w-4 inline mr-1" />
                      {member.qualification}
                    </p>
                  </div>
                )}

                {member.experience_years && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-600">
                      <Calendar className="h-4 w-4 inline mr-1" />
                      {member.experience_years} years experience
                    </p>
                  </div>
                )}

                {member.subjects_taught && member.subjects_taught.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-2">
                      <BookOpen className="h-4 w-4 inline mr-1" />
                      Subjects:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {member.subjects_taught.map((subject, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {member.phone && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-600">
                      <Phone className="h-4 w-4 inline mr-1" />
                      {member.phone}
                    </p>
                  </div>
                )}

                {member.joining_date && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-600">
                      <Calendar className="h-4 w-4 inline mr-1" />
                      Joined: {new Date(member.joining_date).toLocaleDateString()}
                    </p>
                  </div>
                )}

                {member.bio && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700 line-clamp-3">{member.bio}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredFaculty.length === 0 && (
          <div className="text-center py-12">
            <User className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Faculty Found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || departmentFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'No faculty members have been added yet.'
              }
            </p>
            {canManage && (
              <Button onClick={() => setShowAddForm(true)}>
                Add First Faculty Member
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Faculty;