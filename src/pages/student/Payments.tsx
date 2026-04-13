import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const Payments = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("payments")
      .select("*, enrollments(programs(name))")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => { setPayments(data || []); setLoading(false); });
  }, [user]);

  if (loading) return <div className="flex items-center justify-center p-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" /></div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Payments</h2>
      {payments.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground">No payment records found.</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {payments.map((p) => (
            <Card key={p.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <div className="font-semibold">{(p.enrollments as any)?.programs?.name || "Program"}</div>
                  <div className="text-sm text-muted-foreground">{p.payment_date ? new Date(p.payment_date).toLocaleDateString() : "Pending"}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-accent">₦{Number(p.amount).toLocaleString()}</div>
                  <Badge variant="outline" className="capitalize">{p.status}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Payments;
