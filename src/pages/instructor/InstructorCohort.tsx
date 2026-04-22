import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function InstructorCohorts() {
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    const { data } = await supabase.from("programs").select("*");
    setPrograms(data || []);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">My Cohorts</h1>

      {programs.map((p: any) => (
        <div key={p.id} className="p-3 border mb-2">
          {p.name}
        </div>
      ))}
    </div>
  );
}