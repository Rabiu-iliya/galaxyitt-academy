import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Users, Layers, ClipboardCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const InstructorHome = () => {
  const { profile } = useAuth();

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Welcome, {profile?.full_name || "Instructor"}!</h2>
        <p className="text-muted-foreground">Manage your cohorts and students.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Assigned Cohorts</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">—</div><p className="text-xs text-muted-foreground">Assignment feature coming soon</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">—</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Pending Submissions</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">—</div></CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InstructorHome;
