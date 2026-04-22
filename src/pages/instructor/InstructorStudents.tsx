import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function InstructorStudents() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const { data } = await supabase
      .from("user_roles")
      .select("user_id, profiles(full_name)")
      .eq("role", "student");

    setStudents(data || []);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">My Students</h1>

      {students.length === 0 ? (
        <p>No students found</p>
      ) : (
        students.map((s: any) => (
          <div key={s.user_id} className="p-3 border mb-2">
            {s.profiles?.full_name}
          </div>
        ))
      )}
    </div>
  );
}