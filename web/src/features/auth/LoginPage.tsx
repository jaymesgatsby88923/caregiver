import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ApiError } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";

function roleRedirect(role: string) {
  switch (role) {
    case "admin":
      return "/admin";
    case "caregiver":
      return "/caregiver";
    case "client":
      return "/client";
    default:
      return "/login";
  }
}

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const user = await login(email, password);
      navigate(roleRedirect(user.role));
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Unable to sign in. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 flex-col justify-center bg-[var(--navy)] px-16 text-white lg:flex">
        <Logo dark />
        <h1 className="serif mt-10 text-4xl font-bold leading-tight">
          Care that feels personal.
        </h1>
        <p className="mt-4 max-w-md text-lg text-white/80">
          Sign in to manage clients, caregivers, schedules, and care activities.
        </p>
      </div>

      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>

          <h2 className="serif m-0 text-3xl font-bold text-[var(--navy)]">Sign in</h2>
          <p className="mt-2 text-[var(--text-muted)]">
            Use the account created by your administrator.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm outline-none focus:border-[var(--navy)]"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm outline-none focus:border-[var(--navy)]"
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <p className="rounded-lg bg-[var(--soft-red)] px-4 py-3 text-sm text-[var(--red)]">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
            <Link to="/" className="font-medium text-[var(--navy)] hover:underline">
              ← Back to homepage
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
