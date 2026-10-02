import { LoginOtpForm } from "@/features/auth/components/login-otp-form";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
export default async function LoginPage() {
  const currentUser = await getCurrentUser();

  if (currentUser) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen w-full items-center justify-center px-4">
      <section className="w-full max-w-md rounded-2xl border p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">ورود به آیوهوش</h1>

          <p className="mt-2 text-sm opacity-70">
            برای ورود شماره موبایل خود را وارد کنید.
          </p>
        </div>

        <LoginOtpForm />
      </section>
    </main>
  );
}
