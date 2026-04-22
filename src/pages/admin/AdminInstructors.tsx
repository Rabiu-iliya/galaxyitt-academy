import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function AdminInstructors() {
  const [instructors, setInstructors] = useState([]);

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    const { data, error } = await supabase
      .from("user_roles")
      .select("user_id, profiles(full_name, phone)")
      .eq("role", "instructor");

    if (!error) setInstructors(data || []);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Manage Instructors</h1>

      {instructors.length === 0 ? (
        <p>No instructors found</p>
      ) : (
        <ul className="space-y-2">
          {instructors.map((inst: any) => (
            <li key={inst.user_id} className="p-3 border rounded">
              {inst.profiles?.full_name || "No Name"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}