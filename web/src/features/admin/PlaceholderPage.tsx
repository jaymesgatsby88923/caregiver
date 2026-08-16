import PageHeader from "@/components/ui/PageHeader";

type PlaceholderPageProps = {
  title: string;
  subtitle: string;
};

export default function PlaceholderPage({ title, subtitle }: PlaceholderPageProps) {
  return (
    <div>
      <PageHeader title={title} subtitle={subtitle} />
      <div className="rounded-xl border border-dashed border-[var(--border)] bg-white px-8 py-16 text-center">
        <p className="text-[var(--text-muted)]">
          This section is planned next. The admin shell, auth, and CRUD pages are ready.
        </p>
      </div>
    </div>
  );
}
