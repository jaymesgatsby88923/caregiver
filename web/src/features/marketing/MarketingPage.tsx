import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";

const audienceCards = [
  {
    title: "For Clients & Families",
    text: "Know what care is scheduled, who is providing it, and what happened during a visit—all in one place.",
    tone: "bg-[var(--soft-blue)]",
  },
  {
    title: "For Caregivers",
    text: "Spend less time on paperwork and more time focused on what matters most.",
    tone: "bg-[var(--soft-red)]",
  },
  {
    title: "For Our Care Team",
    text: "The right information, at the right time, helps our team coordinate care and support better outcomes.",
    tone: "bg-[var(--cream)]",
  },
];

export default function MarketingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Logo />
          <div className="flex items-center gap-3">
            {user ? (
              <Link to={user.role === "admin" ? "/admin" : `/${user.role}`}>
                <Button variant="pill" className="!px-5 !py-2.5">
                  Go to Portal
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button variant="pill" className="!px-5 !py-2.5">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-xs font-bold tracking-widest text-[var(--gold)] uppercase">
            Home Care, With Heart
          </p>
          <h1 className="serif mt-4 text-4xl leading-tight font-bold text-[var(--navy)] lg:text-5xl">
            Care that feels personal.
          </h1>
          <h2 className="serif mt-2 text-4xl leading-tight font-bold text-[var(--red)] italic lg:text-5xl">
            Technology that works quietly behind it.
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-[var(--text-muted)]">
            Home care built around people—not paperwork. We combine compassionate
            caregivers with thoughtful technology to keep care organized, connected,
            and transparent.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/login">
              <Button>Get Started</Button>
            </Link>
            <Button variant="secondary">Learn About Our Care</Button>
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl shadow-lg">
          <img
            src="https://images.unsplash.com/photo-1765896387387-0538bc9f997e?w=800&h=700&fit=crop&auto=format"
            alt="Caregiver with client in a warm home environment"
            className="h-full w-full object-cover"
          />
        </div>
      </section>

      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="serif text-3xl font-bold text-[var(--navy)]">
            A better experience for everyone.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[var(--text-muted)]">
            Great care takes a team. Our approach makes it simpler, clearer, and
            more connected.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {audienceCards.map((card) => (
              <article
                key={card.title}
                className="rounded-xl border border-[var(--border)] bg-white p-8 text-left shadow-sm"
              >
                <div
                  className={`mb-5 flex h-14 w-14 items-center justify-center rounded-full ${card.tone}`}
                >
                  <span className="text-2xl">❤️</span>
                </div>
                <h3 className="serif m-0 text-xl font-bold text-[var(--navy)]">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
                  {card.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--cream)] px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="serif text-3xl font-bold text-[var(--navy)]">
            Let's talk about how we can help.
          </h2>
          <p className="mt-4 text-[var(--text-muted)]">
            We're here to answer your questions and build a care plan that's right
            for you or your loved one.
          </p>
          <div className="mt-8">
            <Button>Talk With Us</Button>
          </div>
        </div>
      </section>

      <footer className="bg-[var(--navy)] px-6 py-12 text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 md:flex-row">
          <Logo dark />
          <div className="text-sm text-white/70">
            <p className="m-0">© 2025 Caring Angels Homecare. All rights reserved.</p>
            <p className="mt-2 m-0">Privacy Policy · Terms of Service · HIPAA Notice</p>
          </div>
        </div>
        <div className="mt-8 h-1 bg-[var(--red)]" />
      </footer>
    </div>
  );
}
