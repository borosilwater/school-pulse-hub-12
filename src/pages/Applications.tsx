import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Applications = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Applications</h1>
      <Card>
        <CardHeader>
          <CardTitle>Application Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Manage student applications and admissions here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Applications;