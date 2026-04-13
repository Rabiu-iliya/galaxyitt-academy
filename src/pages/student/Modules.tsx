import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, PlayCircle, CheckCircle } from "lucide-react";

const modules = [
  { title: "Module 1: Foundations & Setup", status: "completed", lessons: 6 },
  { title: "Module 2: Core Concepts", status: "in_progress", lessons: 8 },
  { title: "Module 3: Intermediate Techniques", status: "locked", lessons: 7 },
  { title: "Module 4: Advanced Topics", status: "locked", lessons: 9 },
  { title: "Module 5: Real-World Projects", status: "locked", lessons: 5 },
  { title: "Module 6: Capstone & Certification", status: "locked", lessons: 4 },
];

const statusIcon = (s: string) => {
  if (s === "completed") return <CheckCircle className="h-5 w-5 text-green-500" />;
  if (s === "in_progress") return <PlayCircle className="h-5 w-5 text-accent" />;
  return <Lock className="h-5 w-5 text-muted-foreground" />;
};

const Modules = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold">Modules</h2>
    <div className="space-y-3">
      {modules.map((m, i) => (
        <Card key={i} className={m.status === "locked" ? "opacity-60" : ""}>
          <CardContent className="flex items-center gap-4 p-4">
            {statusIcon(m.status)}
            <div className="flex-1">
              <div className="font-semibold">{m.title}</div>
              <div className="text-sm text-muted-foreground">{m.lessons} lessons</div>
            </div>
            <Badge variant="outline" className="capitalize">{m.status.replace("_", " ")}</Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default Modules;
