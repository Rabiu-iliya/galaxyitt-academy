import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const AdminPayments = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("payments")
      .select("*, enrollments(programs(name))")
      .order("created_at", { ascending: false })
      .then(({ data }) => { setPayments(data || []); setLoading(false); });
  }, []);

  if (loading) return <div className="flex items-center justify-center p-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" /></div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">All Payments</h2>
      {payments.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground">No payments recorded.</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {payments.map((p) => (
            <Card key={p.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <div className="font-semibold">{(p.enrollments as any)?.programs?.name || "Program"}</div>
                  <div className="text-sm text-muted-foreground">{p.method || "mock"} · {p.payment_date ? new Date(p.payment_date).toLocaleDateString() : "Pending"}</div>
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

export default AdminPayments;
