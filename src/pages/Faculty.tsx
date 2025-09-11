import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Faculty = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Faculty</h1>
      <Card>
        <CardHeader>
          <CardTitle>Faculty Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Manage faculty members and their information here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Faculty;