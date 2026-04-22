import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function InstructorLessons() {
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    const { data } = await supabase.from("lessons").select("*");
    setLessons(data || []);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Lessons</h1>

      {lessons.length === 0 ? (
        <p>No lessons yet</p>
      ) : (
        lessons.map((l: any) => (
          <div key={l.id} className="p-3 border mb-2">
            {l.title}
          </div>
        ))
      )}
    </div>
  );
}