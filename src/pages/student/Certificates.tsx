import { Card, CardContent } from "@/components/ui/card";
import { Award } from "lucide-react";

const Certificates = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold">Certificates</h2>
    <Card>
      <CardContent className="p-8 text-center">
        <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold">No Certificates Yet</h3>
        <p className="text-muted-foreground mt-2">Complete your program to earn your certificate.</p>
      </CardContent>
    </Card>
  </div>
);

export default Certificates;
