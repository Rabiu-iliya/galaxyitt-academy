import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Video, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

const classes = [
  { title: "Introduction to Neural Networks", date: "April 14, 2026 — 10:00 AM WAT", status: "upcoming" },
  { title: "Data Preprocessing Workshop", date: "April 16, 2026 — 2:00 PM WAT", status: "upcoming" },
  { title: "Python Basics Review", date: "April 10, 2026 — 10:00 AM WAT", status: "completed" },
];

const LiveClasses = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold">Live Classes</h2>
    <div className="space-y-3">
      {classes.map((c, i) => (
        <Card key={i}>
          <CardContent className="flex items-center gap-4 p-4">
            <Video className="h-8 w-8 text-accent" />
            <div className="flex-1">
              <div className="font-semibold">{c.title}</div>
              <div className="text-sm text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" /> {c.date}</div>
            </div>
            {c.status === "upcoming" ? (
              <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">Join</Button>
            ) : (
              <Badge variant="outline">Completed</Badge>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default LiveClasses;
