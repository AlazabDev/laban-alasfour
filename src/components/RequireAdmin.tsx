import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

type RequireAdminProps = {
  children: ReactNode;
};

export function RequireAdmin({ children }: RequireAdminProps) {
  const [status, setStatus] = useState<"loading" | "allowed" | "denied">("loading");

  useEffect(() => {
    let active = true;

    async function checkAccess() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user?.id) {
          if (active) {
            setStatus("denied");
          }
          return;
        }

        const { data, error } = await supabase
          .from("users")
          .select("role, is_active")
          .eq("id", session.user.id)
          .single();

        if (error || !data || data.role !== "owner" || data.is_active !== true) {
          if (active) {
            setStatus("denied");
          }
          return;
        }

        if (active) {
          setStatus("allowed");
        }
      } catch {
        if (active) {
          setStatus("denied");
        }
      }
    }

    checkAccess();

    return () => {
      active = false;
    };
  }, []);

  if (status === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 text-center">
        <p className="text-sm text-muted-foreground">جارٍ التحقق من صلاحية الوصول...</p>
      </div>
    );
  }

  if (status === "denied") {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4" dir="rtl">
        <div className="max-w-md rounded-3xl border border-border/60 bg-card p-8 text-center shadow-soft">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
            <ShieldAlert className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">الوصول إلى الإدارة محمي</h1>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            هذه الصفحة متاحة فقط لحساب إداري موثق ومصرح له بدور المالك.
          </p>
          <Link to="/" className="mt-6 inline-block">
            <Button variant="outline">العودة إلى المتجر</Button>
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
