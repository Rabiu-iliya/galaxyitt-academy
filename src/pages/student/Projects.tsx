import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FolderKanban } from "lucide-react";

const projects = [
  { title: "Capstone Project", description: "Build a real-world application using learned skills", status: "not_started" },
  { title: "Group Project", description: "Collaborative project with cohort members", status: "not_started" },
];

const Projects = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold">Projects</h2>
    <div className="space-y-3">
      {projects.map((p, i) => (
        <Card key={i}>
          <CardContent className="flex items-center gap-4 p-4">
            <FolderKanban className="h-6 w-6 text-accent" />
            <div className="flex-1">
              <div className="font-semibold">{p.title}</div>
              <div className="text-sm text-muted-foreground">{p.description}</div>
            </div>
            <Badge variant="outline" className="capitalize">{p.status.replace(/_/g, " ")}</Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default Projects;
