import { Card, CardContent } from "@/components/ui/card";
import { Award } from "lucide-react";
import { useEnrollment } from "@/hooks/useEnrollment";
import { useAuth } from "@/contexts/AuthContext";

const Certificates = () => {
  const { profile } = useAuth();
  const { enrollment, loading } = useEnrollment();

  if (loading) {
    return <div className="flex items-center justify-center p-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" /></div>;
  }

  const isCompleted = enrollment?.status === "completed";

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Certificates</h2>
      {isCompleted ? (
        <Card className="border-accent">
          <CardContent className="p-8 text-center space-y-4">
            <Award className="h-16 w-16 text-accent mx-auto" />
            <div className="border-2 border-accent/20 rounded-xl p-8 max-w-lg mx-auto space-y-3">
              <p className="text-sm text-muted-foreground uppercase tracking-wider">Certificate of Completion</p>
              <h3 className="text-2xl font-bold">GalaxyITT Technology Academy</h3>
              <p className="text-lg">This certifies that</p>
              <p className="text-xl font-bold text-accent">{profile?.full_name || "Student"}</p>
              <p className="text-lg">has successfully completed</p>
              <p className="text-xl font-semibold">{enrollment.program.name}</p>
              <p className="text-sm text-muted-foreground mt-4">
                Completed on {new Date().toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold">No Certificates Yet</h3>
            <p className="text-muted-foreground mt-2">Complete your program to earn your certificate.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Certificates;
