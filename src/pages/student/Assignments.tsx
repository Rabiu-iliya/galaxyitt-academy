import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

const assignments = [
  { title: "Linear Regression Project", due: "April 17, 2026", status: "pending", grade: null },
  { title: "Data Preprocessing Quiz", due: "April 19, 2026", status: "pending", grade: null },
  { title: "Python Fundamentals Exercise", due: "April 8, 2026", status: "submitted", grade: "85%" },
];

const Assignments = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold">Assignments</h2>
    <div className="space-y-3">
      {assignments.map((a, i) => (
        <Card key={i}>
          <CardContent className="flex items-center gap-4 p-4">
            <FileText className="h-6 w-6 text-accent" />
            <div className="flex-1">
              <div className="font-semibold">{a.title}</div>
              <div className="text-sm text-muted-foreground">Due: {a.due}</div>
            </div>
            {a.grade && <span className="text-sm font-semibold text-green-600">{a.grade}</span>}
            {a.status === "pending" ? (
              <Button size="sm" variant="outline"><Upload className="h-4 w-4 mr-1" /> Submit</Button>
            ) : (
              <Badge className="bg-green-100 text-green-700">Submitted</Badge>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default Assignments;
