export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="font-serif text-2xl text-walnut-deep mb-2">
        Dashboard
      </h1>
      <p className="text-charcoal/60 text-sm mb-8">
        You&apos;re signed in. Order management and product controls will
        appear here next.
      </p>

      <div className="bg-white border border-walnut/15 rounded-sm p-6 max-w-[480px]">
        <p className="text-sm text-charcoal/70">
          This page is protected — it only renders for a logged-in admin.
          The next step is building the actual order list and product
          management screens here.
        </p>
      </div>
    </div>
  );
}
