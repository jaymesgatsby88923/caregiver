import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ApiError } from "@/services/api";
import { authService } from "@/services/authService";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";

function parseRecoveryFromUrl() {
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const query = new URLSearchParams(window.location.search);
  const error =
    query.get("error_description") ||
    hash.get("error_description") ||
    query.get("error") ||
    hash.get("error");

  return {
    access_token: hash.get("access_token") || query.get("access_token"),
    refresh_token: hash.get("refresh_token") || query.get("refresh_token"),
    type: hash.get("type") || query.get("type"),
    code: query.get("code"),
    error,
  };
}

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const recovery = useMemo(parseRecoveryFromUrl, []);
  const hasRecovery =
    Boolean(recovery.code) ||
    Boolean(recovery.access_token && recovery.refresh_token);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState(recovery.error?.replace(/\+/g, " ") ?? "");
  const [notice, setNotice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (hasRecovery && window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, [hasRecovery]);

  async function requestReset(event: FormEvent) {
    event.preventDefault();
    setError("");
    setNotice("");
    setIsSubmitting(true);
    try {
      await authService.forgotPassword(email.trim());
      setNotice(
        "If that email is on file, we sent a reset link. Open it on this device to choose a new password.",
      );
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Unable to send a reset email.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function savePassword(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setIsSubmitting(true);
    try {
      await authService.resetPassword({
        password,
        access_token: recovery.access_token,
        refresh_token: recovery.refresh_token,
        code: recovery.code,
      });
      navigate("/login", { replace: true });
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "This reset link is invalid or expired.",
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
          Reset your password.
        </h1>
        <p className="mt-4 max-w-md text-lg text-white/80">
          Use the account created by your administrator. After you save a new
          password, sign in again on web or in the app.
        </p>
      </div>

      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>

          <h2 className="serif m-0 text-3xl font-bold text-[var(--navy)]">
            {hasRecovery ? "Choose a new password" : "Forgot password"}
          </h2>
          <p className="mt-2 text-[var(--text-muted)]">
            {hasRecovery
              ? "Enter a new password for your Caring Angels account."
              : "We’ll email a reset link if this address has an account."}
          </p>

          {hasRecovery ? (
            <form onSubmit={savePassword} className="mt-8 space-y-5">
              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
                  New password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm outline-none focus:border-[var(--navy)]"
                  placeholder="At least 8 characters"
                />
              </div>
              <div>
                <label htmlFor="confirm" className="mb-1.5 block text-sm font-medium">
                  Confirm password
                </label>
                <input
                  id="confirm"
                  type="password"
                  required
                  minLength={8}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm outline-none focus:border-[var(--navy)]"
                  placeholder="Repeat new password"
                />
              </div>
              {error && (
                <p className="rounded-lg bg-[var(--soft-red)] px-4 py-3 text-sm text-[var(--red)]">
                  {error}
                </p>
              )}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save password"}
              </Button>
            </form>
          ) : (
            <form onSubmit={requestReset} className="mt-8 space-y-5">
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
              {error && (
                <p className="rounded-lg bg-[var(--soft-red)] px-4 py-3 text-sm text-[var(--red)]">
                  {error}
                </p>
              )}
              {notice && (
                <p className="rounded-lg bg-[var(--soft-blue)] px-4 py-3 text-sm text-[var(--navy)]">
                  {notice}
                </p>
              )}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send reset link"}
              </Button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
            <Link to="/login" className="font-medium text-[var(--navy)] hover:underline">
              ← Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
