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
import { FileText, Upload, Download, Eye, Search, Filter } from 'lucide-react';

interface Document {
  id: string;
  title: string;
  description?: string;
  file_name: string;
  file_path: string;
  file_size?: number;
  file_type: string;
  category: string;
  uploaded_by: string;
  is_public: boolean;
  download_count: number;
  created_at: string;
  updated_at: string;
}

const Documents = () => {
  const { user, profile } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    category: '',
    is_public: false
  });

  const categories = [
    'Academic Calendar',
    'Syllabus',
    'Application Forms',
    'Brochures',
    'Policies',
    'Results',
    'Circulars',
    'Guidelines',
    'Other'
  ];

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to upload documents');
      return;
    }

    // For demo purposes, we'll simulate file upload
    // In a real implementation, you'd handle file upload to storage
    try {
      const fileName = `document_${Date.now()}.pdf`;
      const filePath = `/documents/${fileName}`;
      
      const { error } = await supabase
        .from('documents')
        .insert([
          {
            title: uploadData.title,
            description: uploadData.description,
            file_name: fileName,
            file_path: filePath,
            file_type: 'application/pdf',
            category: uploadData.category,
            uploaded_by: user.id,
            is_public: uploadData.is_public,
            file_size: 1024 * 50 // 50KB demo size
          }
        ]);

      if (error) throw error;

      toast.success('Document uploaded successfully!');
      setUploadData({
        title: '',
        description: '',
        category: '',
        is_public: false
      });
      setShowUploadForm(false);
      fetchDocuments();
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Failed to upload document');
    }
  };

  const handleDownload = async (document: Document) => {
    try {
      // Increment download count
      const { error } = await supabase
        .from('documents')
        .update({ download_count: document.download_count + 1 })
        .eq('id', document.id);

      if (error) throw error;

      // In a real implementation, you'd download the actual file
      toast.success(`Downloading ${document.file_name}`);
      fetchDocuments();
    } catch (error) {
      console.error('Error downloading document:', error);
      toast.error('Failed to download document');
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const canUpload = profile?.role === 'admin' || profile?.role === 'teacher';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-gray-200 h-48 rounded-lg"></div>
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
            <h1 className="text-3xl font-bold text-gray-900">Document Library</h1>
            <p className="text-gray-600 mt-2">Access school documents, forms, and resources</p>
          </div>
          {canUpload && (
            <Button onClick={() => setShowUploadForm(true)} className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload Document
            </Button>
          )}
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Upload Form */}
        {showUploadForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Upload New Document</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFileUpload} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <Label htmlFor="title">Document Title *</Label>
                    <Input
                      id="title"
                      required
                      value={uploadData.title}
                      onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={uploadData.category}
                      onValueChange={(value) => setUploadData({ ...uploadData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={uploadData.description}
                    onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                    placeholder="Brief description of the document"
                  />
                </div>

                <div>
                  <Label htmlFor="file">Select File *</Label>
                  <Input id="file" type="file" required accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_public"
                    checked={uploadData.is_public}
                    onChange={(e) => setUploadData({ ...uploadData, is_public: e.target.checked })}
                  />
                  <Label htmlFor="is_public">Make this document publicly accessible</Label>
                </div>

                <div className="flex gap-4">
                  <Button type="submit">Upload Document</Button>
                  <Button type="button" variant="outline" onClick={() => setShowUploadForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Documents Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredDocuments.map((document) => (
            <Card key={document.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{document.title}</CardTitle>
                    <Badge variant="outline" className="mt-2">
                      {document.category}
                    </Badge>
                  </div>
                  <FileText className="h-8 w-8 text-blue-600 flex-shrink-0 ml-2" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {document.description && (
                  <p className="text-sm text-gray-600 line-clamp-3">{document.description}</p>
                )}
                
                <div className="space-y-2 text-xs text-gray-500">
                  <div className="flex justify-between">
                    <span>File:</span>
                    <span className="font-medium">{document.file_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Size:</span>
                    <span className="font-medium">{formatFileSize(document.file_size)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Downloads:</span>
                    <span className="font-medium">{document.download_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Added:</span>
                    <span className="font-medium">
                      {new Date(document.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-3">
                  <Button
                    size="sm"
                    onClick={() => handleDownload(document)}
                    className="flex-1"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>

                {document.is_public && (
                  <Badge className="w-full justify-center bg-green-100 text-green-800 border-green-200">
                    Public Access
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Documents Found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || categoryFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'No documents have been uploaded yet.'
              }
            </p>
            {canUpload && (
              <Button onClick={() => setShowUploadForm(true)}>
                Upload First Document
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Documents;