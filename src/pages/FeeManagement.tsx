import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FeeManagement = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Fee Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>Fee Management System</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Manage student fees and payments here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeeManagement;