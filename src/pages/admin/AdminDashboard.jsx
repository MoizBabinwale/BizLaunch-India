import {
  Users,
  Building2,
  ShoppingBag,
  ClipboardList,
  TrendingUp,
  Activity,
  ShieldCheck,
  Clock,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

const stats = [
  {
    title: "Total Users",
    value: "1,254",
    icon: Users,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Businesses",
    value: "326",
    icon: Building2,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Products",
    value: "4,821",
    icon: ShoppingBag,
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "Enquiries",
    value: "923",
    icon: ClipboardList,
    color: "bg-orange-100 text-orange-600",
  },
];

const pendingApprovals = [
  {
    id: 1,
    name: "Fresh Organic Farm",
    owner: "Mohit Sharma",
    city: "Nagpur",
  },
  {
    id: 2,
    name: "RK Electronics",
    owner: "Rakesh Kumar",
    city: "Delhi",
  },
  {
    id: 3,
    name: "Sai Traders",
    owner: "Amit Patil",
    city: "Pune",
  },
];

const recentActivities = [
  "New business created",
  "Premium plan purchased",
  "Admin updated pricing",
  "Product added",
  "New enquiry received",
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-background">

      {/* Header */}

      <div className="border-b border-border bg-white">

        <div className="mx-auto max-w-7xl px-6 py-8">

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

            <div>

              <h1 className="font-display text-4xl font-bold text-text-primary">
                Admin Dashboard
              </h1>

              <p className="mt-2 text-text-secondary">
                Monitor platform performance and manage BizLaunch India.
              </p>

            </div>

            <div className="rounded-2xl bg-primary px-6 py-4 text-white shadow-lg">

              <div className="flex items-center gap-3">

                <ShieldCheck size={30} />

                <div>

                  <p className="text-sm opacity-80">
                    System Status
                  </p>

                  <h3 className="font-semibold">
                    Running Smoothly
                  </h3>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      <div className="mx-auto max-w-7xl space-y-8 px-6 py-8">

        {/* Stats */}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          {stats.map((item) => {

            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-3xl border border-border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-sm text-muted">
                      {item.title}
                    </p>

                    <h2 className="mt-2 text-4xl font-bold text-text-primary">
                      {item.value}
                    </h2>

                  </div>

                  <div className={`rounded-2xl p-4 ${item.color}`}>
                    <Icon size={28} />
                  </div>

                </div>

              </div>
            );
          })}
        </div>

        {/* Middle */}

        <div className="grid gap-8 lg:grid-cols-3">

          {/* Quick Actions */}

          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">

            <h2 className="text-xl font-bold text-text-primary">
              Quick Actions
            </h2>

            <div className="mt-6 space-y-4">

              <button className="flex w-full items-center justify-between rounded-xl bg-primary px-5 py-4 text-white transition hover:bg-primary-dark">

                Manage Businesses

                <ArrowRight size={18} />

              </button>

              <button className="flex w-full items-center justify-between rounded-xl border border-border px-5 py-4 hover:bg-primary-sky">

                Manage Users

                <ArrowRight size={18} />

              </button>

              <button className="flex w-full items-center justify-between rounded-xl border border-border px-5 py-4 hover:bg-primary-sky">

                View Reports

                <ArrowRight size={18} />

              </button>

            </div>

          </div>

          {/* Pending */}

          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">

            <div className="mb-5 flex items-center justify-between">

              <h2 className="text-xl font-bold">
                Pending Approval
              </h2>

              <Clock className="text-primary" />
            </div>

            <div className="space-y-4">

              {pendingApprovals.map((item) => (

                <div
                  key={item.id}
                  className="rounded-xl border border-border p-4"
                >

                  <h3 className="font-semibold">
                    {item.name}
                  </h3>

                  <p className="text-sm text-muted">
                    {item.owner}
                  </p>

                  <p className="text-sm text-muted">
                    {item.city}
                  </p>

                </div>

              ))}

            </div>

          </div>

          {/* Activity */}

          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">

            <div className="mb-5 flex items-center justify-between">

              <h2 className="text-xl font-bold">
                Recent Activity
              </h2>

              <Activity className="text-primary" />

            </div>

            <div className="space-y-4">

              {recentActivities.map((item) => (

                <div
                  key={item}
                  className="flex items-center gap-3"
                >

                  <CheckCircle2
                    size={18}
                    className="text-green-500"
                  />

                  <span className="text-text-secondary">
                    {item}
                  </span>

                </div>

              ))}

            </div>

          </div>

        </div>

        {/* Analytics */}

        <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">

          <div className="flex items-center gap-3">

            <TrendingUp
              className="text-primary"
              size={30}
            />

            <div>

              <h2 className="text-2xl font-bold text-text-primary">
                Platform Growth
              </h2>

              <p className="text-text-secondary">
                Analytics charts will be connected here using Chart.js or Recharts.
              </p>

            </div>

          </div>

          <div className="mt-8 flex h-72 items-center justify-center rounded-2xl border-2 border-dashed border-border">

            <span className="text-lg text-muted">
              📊 Analytics Chart Coming Soon
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}