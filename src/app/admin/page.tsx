import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminPage() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Total Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">12</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total Modules</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">48</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total Lectures</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">320</p>
        </CardContent>
      </Card>
    </div>
  );
}
