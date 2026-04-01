import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type Program, formatPrice } from "@/lib/programs";
import { Brain, Code2, Shield, BarChart3, Cloud, Globe, Smartphone, Settings, Link as LinkIcon, Gamepad2, Palette, Network, Database, Cpu, Clock } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Brain, Code2, Shield, BarChart3, Cloud, Globe, Smartphone, Settings,
  Link: LinkIcon, Gamepad2, Palette, Network, Database, Cpu,
};

export function ProgramCard({ program }: { program: Program }) {
  const Icon = iconMap[program.icon] || Code2;

  return (
    <Card className="flex flex-col transition-all hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
            <Icon className="h-5 w-5 text-accent" />
          </div>
          <Badge variant="secondary" className="text-xs">
            <Clock className="mr-1 h-3 w-3" />
            {program.duration}
          </Badge>
        </div>
        <CardTitle className="text-lg">{program.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="mb-4 text-sm text-muted-foreground line-clamp-2">{program.description}</p>
        <div className="flex flex-wrap gap-1">
          {program.highlights.slice(0, 3).map((h) => (
            <Badge key={h} variant="outline" className="text-xs font-normal">
              {h}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t pt-4">
        <span className="text-lg font-bold text-accent">{formatPrice(program.price)}</span>
        <Link to={`/programs/${program.slug}`}>
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
            Learn More
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
