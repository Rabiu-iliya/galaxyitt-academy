import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Video, Calendar, Lock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useEnrollment } from "@/hooks/useEnrollment";

interface LiveClass {
  id: string;
  title: string;
  scheduled_at: string;
  meeting_link: string | null;
  status: string;
}

const LiveClasses = () => {
  const { enrollment, loading: enrollLoading } = useEnrollment();
  const [classes, setClasses] = useState<LiveClass[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!enrollment) { setLoading(false); return; }
    const fetch = async () => {
      const { data } = await supabase
        .from("live_classes")
        .select("id, title, scheduled_at, meeting_link, status")
        .eq("program_id", enrollment.program_id)
        .order("scheduled_at", { ascending: true });
      setClasses(data || []);
      setLoading(false);
    };
    fetch();
  }, [enrollment]);

  if (enrollLoading || loading) {
    return <div className="flex items-center justify-center p-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" /></div>;
  }

  if (!enrollment) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Live Classes</h2>
        <Card><CardContent className="p-8 text-center"><p className="text-muted-foreground">Enroll in a program to access live classes.</p></CardContent></Card>
      </div>
    );
  }

  if (!enrollment.is_paid) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Live Classes</h2>
        <Card><CardContent className="p-8 text-center">
          <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold">Payment Required</h3>
          <p className="text-muted-foreground mt-2">Complete your payment to access live classes.</p>
        </CardContent></Card>
      </div>
    );
  }

  const now = new Date();
  const upcoming = classes.filter(c => new Date(c.scheduled_at) >= now);
  const past = classes.filter(c => new Date(c.scheduled_at) < now);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Live Classes</h2>

      {classes.length === 0 ? (
        <Card><CardContent className="p-8 text-center"><p className="text-muted-foreground">No live classes scheduled yet.</p></CardContent></Card>
      ) : (
        <>
          {upcoming.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Upcoming</h3>
              {upcoming.map(c => (
                <Card key={c.id}>
                  <CardContent className="flex items-center gap-4 p-4">
                    <Video className="h-8 w-8 text-accent" />
                    <div className="flex-1">
                      <div className="font-semibold">{c.title}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(c.scheduled_at).toLocaleString()}
                      </div>
                    </div>
                    {c.meeting_link ? (
                      <a href={c.meeting_link} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                          <ExternalLink className="h-4 w-4 mr-1" /> Join
                        </Button>
                      </a>
                    ) : (
                      <Badge variant="outline">Link pending</Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          {past.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Past Classes</h3>
              {past.map(c => (
                <Card key={c.id} className="opacity-70">
                  <CardContent className="flex items-center gap-4 p-4">
                    <Video className="h-8 w-8 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="font-semibold">{c.title}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(c.scheduled_at).toLocaleString()}
                      </div>
                    </div>
                    <Badge variant="outline">Completed</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LiveClasses;
