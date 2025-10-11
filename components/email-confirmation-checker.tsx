"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { EmailConfirmationDialog } from "./email-confirmation-dialog";

export function EmailConfirmationChecker() {
  const [showDialog, setShowDialog] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const checkEmailConfirmation = async () => {
      const supabase = createClient();

      const { data: { user } } = await supabase.auth.getUser();

      if (user && !user.email_confirmed_at) {
        // User is logged in but email is not confirmed
        setUserEmail(user.email || "");
        setShowDialog(true);
      }
    };

    checkEmailConfirmation();

    // Listen for auth state changes (in case user confirms email in another tab)
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" || event === "USER_UPDATED") {
          if (session?.user && !session.user.email_confirmed_at) {
            setUserEmail(session.user.email || "");
            setShowDialog(true);
          } else {
            // Email was confirmed, hide dialog
            setShowDialog(false);
          }
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <EmailConfirmationDialog
      open={showDialog}
      onClose={() => setShowDialog(false)}
      userEmail={userEmail}
    />
  );
}
