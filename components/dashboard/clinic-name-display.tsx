"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function ClinicNameDisplay() {
  const [clinicName, setClinicName] = useState<string | null>(null);

  useEffect(() => {
    const getClinicName = async () => {
      const supabase = createClient();

      // Get user data
      const { data: userData } = await supabase.auth.getUser();

      // Get clinic data through profile
      if (userData?.user?.id) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select(`
            *,
            clinic:clinics(name)
          `)
          .eq("user_id", userData.user.id)
          .single();

        if (profileData?.clinic && 'name' in profileData.clinic) {
          setClinicName(profileData.clinic.name);
        }
      }
    };
    getClinicName();
  }, []);

  return (
    <div className="hidden md:flex items-center gap-2">
      <div className="h-2 w-2 bg-teal-400 rounded-full animate-pulse"></div>
      <span className="text-sm font-semibold text-teal-600">
        {clinicName || "A carregar..."}
      </span>
    </div>
  );
}