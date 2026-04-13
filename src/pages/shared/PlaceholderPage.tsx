import { Card, CardContent } from "@/components/ui/card";
import { Construction } from "lucide-react";

const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold">{title}</h2>
    <Card>
      <CardContent className="p-8 text-center">
        <Construction className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold">Coming Soon</h3>
        <p className="text-muted-foreground mt-2">This feature is under development.</p>
      </CardContent>
    </Card>
  </div>
);

export default PlaceholderPage;
