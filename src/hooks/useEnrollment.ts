import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface EnrollmentData {
  id: string;
  status: string;
  is_paid: boolean;
  program_id: string;
  cohort_id: string;
  program: { name: string; price: number; duration: string };
  cohort: { name: string; start_date: string };
}

export function useEnrollment() {
  const { user } = useAuth();
  const [enrollment, setEnrollment] = useState<EnrollmentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase
        .from("enrollments")
        .select("id, status, is_paid, program_id, cohort_id, programs(name, price, duration), cohorts(name, start_date)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
      if (data) {
        setEnrollment({
          id: data.id,
          status: data.status,
          is_paid: data.is_paid as boolean,
          program_id: data.program_id,
          cohort_id: data.cohort_id,
          program: data.programs as any,
          cohort: data.cohorts as any,
        });
      }
      setLoading(false);
    };
    fetch();
  }, [user]);

  return { enrollment, loading };
}
