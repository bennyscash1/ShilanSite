import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdminConfigured } from "@/config/admin";
import { getSession } from "@/lib/admin/session";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "כניסה" };

export default async function AdminLoginPage() {
  if (await getSession()) redirect("/admin");

  return (
    <main id="main" className="container-content flex justify-center py-16">
      <div className="w-full max-w-md rounded-card border border-green-900/10 bg-white p-8 shadow-card">
        <h1 className="text-h3 font-bold">כניסה לניהול האתר</h1>
        {isAdminConfigured() ? (
          <LoginForm />
        ) : (
          <p role="alert" className="mt-6 rounded-control bg-red-50 p-4 text-body text-red-800">
            פרטי הכניסה לא הוגדרו. יש להגדיר ADMIN_EMAIL ו-ADMIN_PASSWORD במשתני הסביבה.
          </p>
        )}
      </div>
    </main>
  );
}
