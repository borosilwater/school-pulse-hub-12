import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { CreditCard, DollarSign, Calendar, CheckCircle, Clock, XCircle, Download, Receipt } from 'lucide-react';

interface FeeStructure {
  id: string;
  class_name: string;
  fee_type: string;
  amount: number;
  due_date?: string;
  academic_year: string;
  is_active: boolean;
}

interface FeePayment {
  id: string;
  student_id: string;
  fee_structure_id: string;
  amount_paid: number;
  payment_method: string;
  transaction_id?: string;
  payment_status: string;
  payment_date?: string;
  fee_structure?: FeeStructure;
}

const FeeManagement = () => {
  const { user, profile } = useAuth();
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
  const [payments, setPayments] = useState<FeePayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedFee, setSelectedFee] = useState<FeeStructure | null>(null);
  const [paymentData, setPaymentData] = useState({
    payment_method: '',
    transaction_id: ''
  });

  useEffect(() => {
    fetchFeeData();
  }, [user]);

  const fetchFeeData = async () => {
    try {
      setLoading(true);
      
      // Fetch fee structures
      const { data: structures, error: structuresError } = await supabase
        .from('fee_structures')
        .select('*')
        .eq('is_active', true)
        .order('class_name');

      if (structuresError) throw structuresError;

      // Fetch payments for current user
      const { data: userPayments, error: paymentsError } = await supabase
        .from('fee_payments')
        .select(`
          *,
          fee_structure:fee_structures(*)
        `)
        .eq('student_id', user?.id)
        .order('created_at', { ascending: false });

      if (paymentsError) throw paymentsError;

      setFeeStructures(structures || []);
      setPayments(userPayments || []);
    } catch (error) {
      console.error('Error fetching fee data:', error);
      toast.error('Failed to fetch fee information');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFee || !user) return;

    try {
      const { error } = await supabase
        .from('fee_payments')
        .insert([
          {
            student_id: user.id,
            fee_structure_id: selectedFee.id,
            amount_paid: selectedFee.amount,
            payment_method: paymentData.payment_method,
            transaction_id: paymentData.transaction_id,
            payment_status: 'pending',
            payment_date: new Date().toISOString()
          }
        ]);

      if (error) throw error;

      toast.success('Payment submitted successfully! It will be verified shortly.');
      setShowPaymentForm(false);
      setSelectedFee(null);
      setPaymentData({ payment_method: '', transaction_id: '' });
      fetchFeeData();
    } catch (error) {
      console.error('Error submitting payment:', error);
      toast.error('Failed to submit payment');
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Receipt className="h-4 w-4 text-gray-600" />;
    }
  };

  const calculateTotalDue = () => {
    const paidFees = payments
      .filter(p => p.payment_status === 'paid')
      .map(p => p.fee_structure_id);
    
    return feeStructures
      .filter(fs => !paidFees.includes(fs.id))
      .reduce((total, fs) => total + fs.amount, 0);
  };

  const calculateTotalPaid = () => {
    return payments
      .filter(p => p.payment_status === 'paid')
      .reduce((total, p) => total + p.amount_paid, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid gap-6 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Fee Management</h1>
          <p className="text-gray-600 mt-2">Manage your fee payments and view payment history</p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Due</p>
                  <p className="text-2xl font-bold text-red-600">₹{calculateTotalDue().toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Paid</p>
                  <p className="text-2xl font-bold text-green-600">₹{calculateTotalPaid().toLocaleString()}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Payments</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {payments.filter(p => p.payment_status === 'pending').length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fee Structures */}
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Fee Structure 2024-25</h2>
            <div className="space-y-4">
              {feeStructures.map((fee) => {
                const isPaid = payments.some(
                  p => p.fee_structure_id === fee.id && p.payment_status === 'paid'
                );
                const isPending = payments.some(
                  p => p.fee_structure_id === fee.id && p.payment_status === 'pending'
                );

                return (
                  <Card key={fee.id} className={`${isPaid ? 'bg-green-50 border-green-200' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{fee.fee_type}</h3>
                          <p className="text-sm text-gray-600">{fee.class_name}</p>
                          {fee.due_date && (
                            <p className="text-sm text-gray-500 flex items-center mt-1">
                              <Calendar className="h-3 w-3 mr-1" />
                              Due: {new Date(fee.due_date).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">₹{fee.amount.toLocaleString()}</p>
                          {isPaid ? (
                            <Badge className="bg-green-100 text-green-800 border-green-200">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Paid
                            </Badge>
                          ) : isPending ? (
                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                              <Clock className="h-3 w-3 mr-1" />
                              Pending
                            </Badge>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedFee(fee);
                                setShowPaymentForm(true);
                              }}
                              className="mt-1"
                            >
                              <CreditCard className="h-3 w-3 mr-1" />
                              Pay Now
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Payment History */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment History</h2>
            <div className="space-y-4">
              {payments.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Receipt className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Payments Yet</h3>
                    <p className="text-gray-600">Your payment history will appear here.</p>
                  </CardContent>
                </Card>
              ) : (
                payments.map((payment) => (
                  <Card key={payment.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {payment.fee_structure?.fee_type || 'Fee Payment'}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {payment.payment_date && new Date(payment.payment_date).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge className={getPaymentStatusColor(payment.payment_status)}>
                          <div className="flex items-center gap-1">
                            {getPaymentStatusIcon(payment.payment_status)}
                            {payment.payment_status}
                          </div>
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Amount:</span>
                          <span className="font-medium">₹{payment.amount_paid.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Method:</span>
                          <span className="font-medium">{payment.payment_method}</span>
                        </div>
                        {payment.transaction_id && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Transaction ID:</span>
                            <span className="font-medium font-mono text-xs">{payment.transaction_id}</span>
                          </div>
                        )}
                      </div>

                      {payment.payment_status === 'paid' && (
                        <Button size="sm" variant="outline" className="w-full mt-3">
                          <Download className="h-4 w-4 mr-2" />
                          Download Receipt
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Payment Form Modal */}
        {showPaymentForm && selectedFee && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Payment for {selectedFee.fee_type}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePayment} className="space-y-4">
                  <div>
                    <Label>Amount</Label>
                    <Input value={`₹${selectedFee.amount.toLocaleString()}`} disabled />
                  </div>
                  
                  <div>
                    <Label htmlFor="payment_method">Payment Method *</Label>
                    <Select
                      value={paymentData.payment_method}
                      onValueChange={(value) => setPaymentData({ ...paymentData, payment_method: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="upi">UPI</SelectItem>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="cheque">Cheque</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="transaction_id">Transaction ID / Reference Number</Label>
                    <Input
                      id="transaction_id"
                      value={paymentData.transaction_id}
                      onChange={(e) => setPaymentData({ ...paymentData, transaction_id: e.target.value })}
                      placeholder="Enter transaction reference"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button type="submit" className="flex-1">
                      Submit Payment
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowPaymentForm(false);
                        setSelectedFee(null);
                        setPaymentData({ payment_method: '', transaction_id: '' });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeeManagement;