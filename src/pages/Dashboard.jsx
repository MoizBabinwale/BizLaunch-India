import {
  ArrowUpRight,
  Briefcase,
  Eye,
  ClipboardList,
  Package,
  Wrench,
  Crown,
  TrendingUp,
  Plus,
  Building2,
  Calendar,
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import { Link } from "react-router-dom";

const stats = [
  {
    title: "Website Views",
    value: "1,284",
    change: "+18%",
    icon: Eye,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Enquiries",
    value: "86",
    change: "+12%",
    icon: ClipboardList,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Products",
    value: "42",
    change: "+6",
    icon: Package,
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "Services",
    value: "9",
    change: "+1",
    icon: Wrench,
    color: "bg-orange-100 text-orange-600",
  },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">

      {/* Header */}

      <div className="border-b border-border bg-card">

        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-6 py-8 lg:flex-row lg:items-center">

          <div>

            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Dashboard
            </p>

            <h1 className="mt-2 font-display text-4xl font-bold text-text-primary">
              Welcome back 👋
            </h1>

            <p className="mt-3 max-w-2xl text-text-secondary">
              Manage your business website, products, enquiries and monitor
              your online growth from one place.
            </p>

          </div>

          <Link
            to="/dashboard/operations"
            className="
              flex
              items-center
              gap-2
              rounded-2xl
              bg-primary
              px-6
              py-4
              font-semibold
              text-white
              shadow-lg
              transition
              hover:bg-primary-dark
            "
          >
            <Plus size={20} />

            Open shop operations
          </Link>

        </div>

      </div>

      <div className="mx-auto max-w-7xl space-y-8 px-6 py-8">

        {/* Business Status */}

        <div
          className="
            flex
            flex-col
            justify-between
            gap-6
            rounded-3xl
            bg-gradient-to-r
            from-primary
            to-primary-dark
            p-8
            text-white
            lg:flex-row
            lg:items-center
          "
        >

          <div>

            <div className="flex items-center gap-3">

              <Building2 size={28} />

              <h2 className="text-2xl font-bold">
                Harvest Basket
              </h2>

            </div>

            <p className="mt-3 text-blue-100">
              Your business website is live and receiving visitors.
            </p>

          </div>

          <div className="flex gap-8">

            <div>

              <p className="text-blue-100">
                Current Plan
              </p>

              <div className="mt-2 flex items-center gap-2">

                <Crown size={18} />

                <span className="font-semibold">
                  Free Plan
                </span>

              </div>

            </div>

            <div>

              <p className="text-blue-100">
                Created
              </p>

              <div className="mt-2 flex items-center gap-2">

                <Calendar size={18} />

                <span>
                  06 Jul 2026
                </span>

              </div>

            </div>

          </div>

        </div>

        {/* Statistics */}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          {stats.map((item) => {

            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="
                  rounded-3xl
                  border
                  border-border
                  bg-card
                  p-6
                  shadow-sm
                  transition
                  hover:-translate-y-1
                  hover:shadow-lg
                "
              >

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-sm text-muted">
                      {item.title}
                    </p>

                    <h2 className="mt-3 text-4xl font-bold text-text-primary">
                      {item.value}
                    </h2>

                    <div className="mt-4 flex items-center gap-2 text-sm font-medium text-green-600">

                      <ArrowUpRight size={16} />

                      {item.change}

                    </div>

                  </div>

                  <div className={`rounded-2xl p-4 ${item.color}`}>

                    <Icon size={30} />

                  </div>

                </div>

              </div>
            );

          })}

        </div>
                {/* Quick Actions + Business Overview */}

        <div className="grid gap-8 lg:grid-cols-3">

          {/* Quick Actions */}

          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">

            <h2 className="text-xl font-bold text-text-primary">
              Quick Actions
            </h2>

            <p className="mt-2 text-sm text-text-secondary">
              Manage your business quickly from one place.
            </p>

            <div className="mt-6 space-y-4">

              <Link
                to="/dashboard/operations"
                className="
                  flex
                  w-full
                  items-center
                  justify-between
                  rounded-2xl
                  bg-primary
                  px-5
                  py-4
                  font-semibold
                  text-white
                  transition
                  hover:bg-primary-dark
                "
              >
                Add Product

                <Plus size={18} />
              </Link>

              <Link
                to="/dashboard/operations"
                className="
                  flex
                  w-full
                  items-center
                  justify-between
                  rounded-2xl
                  border
                  border-border
                  px-5
                  py-4
                  transition
                  hover:bg-primary-sky
                "
              >
                Add Service

                <Plus size={18} />
              </Link>

              <Link
                to="/dashboard/operations"
                className="
                  flex
                  w-full
                  items-center
                  justify-between
                  rounded-2xl
                  border
                  border-border
                  px-5
                  py-4
                  transition
                  hover:bg-primary-sky
                "
              >
                Edit Website

                <ArrowUpRight size={18} />
              </Link>

              <button
                className="
                  flex
                  w-full
                  items-center
                  justify-between
                  rounded-2xl
                  border
                  border-border
                  px-5
                  py-4
                  transition
                  hover:bg-primary-sky
                "
              >
                View Public Website

                <ArrowUpRight size={18} />
              </button>

            </div>

          </div>

          {/* Business Overview */}

          <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-8 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-2xl font-bold text-text-primary">
                  Business Overview
                </h2>

                <p className="mt-2 text-text-secondary">
                  Current performance of your business website.
                </p>

              </div>

              <TrendingUp
                size={32}
                className="text-primary"
              />

            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2">

              <div className="rounded-2xl bg-primary-sky p-6">

                <div className="flex items-center gap-3">

                  <Eye
                    size={28}
                    className="text-primary"
                  />

                  <div>

                    <h4 className="font-semibold text-text-primary">
                      Website Visitors
                    </h4>

                    <p className="text-sm text-text-secondary">
                      Last 30 Days
                    </p>

                  </div>

                </div>

                <h2 className="mt-5 text-4xl font-bold text-primary">
                  1,284
                </h2>

                <p className="mt-2 text-sm text-green-600">
                  ↑ 18% compared to last month
                </p>

              </div>

              <div className="rounded-2xl bg-green-50 p-6">

                <div className="flex items-center gap-3">

                  <ClipboardList
                    size={28}
                    className="text-green-600"
                  />

                  <div>

                    <h4 className="font-semibold text-text-primary">
                      Total Enquiries
                    </h4>

                    <p className="text-sm text-text-secondary">
                      Customer Requests
                    </p>

                  </div>

                </div>

                <h2 className="mt-5 text-4xl font-bold text-green-600">
                  86
                </h2>

                <p className="mt-2 text-sm text-green-600">
                  ↑ 12% this month
                </p>

              </div>

              <div className="rounded-2xl bg-purple-50 p-6">

                <div className="flex items-center gap-3">

                  <Package
                    size={28}
                    className="text-purple-600"
                  />

                  <div>

                    <h4 className="font-semibold text-text-primary">
                      Active Products
                    </h4>

                    <p className="text-sm text-text-secondary">
                      Visible on Website
                    </p>

                  </div>

                </div>

                <h2 className="mt-5 text-4xl font-bold text-purple-600">
                  42
                </h2>

              </div>

              <div className="rounded-2xl bg-orange-50 p-6">

                <div className="flex items-center gap-3">

                  <Briefcase
                    size={28}
                    className="text-orange-500"
                  />

                  <div>

                    <h4 className="font-semibold text-text-primary">
                      Services
                    </h4>

                    <p className="text-sm text-text-secondary">
                      Available Online
                    </p>

                  </div>

                </div>

                <h2 className="mt-5 text-4xl font-bold text-orange-500">
                  9
                </h2>

              </div>

            </div>

          </div>

        </div>
                {/* Recent Activity & Quick Actions */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* Recent Activity */}
          <div className="xl:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="font-display text-xl font-bold text-text-primary">
                  Recent Activity
                </h2>
                <p className="text-sm text-muted">
                  Latest updates from your business.
                </p>
              </div>

              <button className="text-sm font-medium text-primary hover:text-primary-dark">
                View All
              </button>
            </div>

            <div className="space-y-4">
              {[
                {
                  title: "New Enquiry Received",
                  desc: "Customer requested product pricing.",
                  time: "2 mins ago",
                },
                {
                  title: "Business Profile Updated",
                  desc: "Logo and contact details updated.",
                  time: "1 hour ago",
                },
                {
                  title: "New Product Added",
                  desc: "Organic Fertilizer listed successfully.",
                  time: "Yesterday",
                },
                {
                  title: "Website Published",
                  desc: "Your business page is now live.",
                  time: "2 days ago",
                },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 rounded-xl border border-border p-4 transition hover:bg-primary-sky"
                >
                  <div className="mt-1 h-3 w-3 rounded-full bg-primary" />

                  <div className="flex-1">
                    <h4 className="font-semibold text-text-primary">
                      {activity.title}
                    </h4>

                    <p className="text-sm text-muted">
                      {activity.desc}
                    </p>
                  </div>

                  <span className="text-xs text-muted">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-5 font-display text-xl font-bold text-text-primary">
              Quick Actions
            </h2>

            <div className="space-y-3">
              <Link
                to="/create-business"
                className="flex items-center justify-between rounded-xl border border-border p-4 transition hover:border-primary hover:bg-primary-sky"
              >
                <span>Create Business</span>
                <span>→</span>
              </Link>

              <Link
                to="/products"
                className="flex items-center justify-between rounded-xl border border-border p-4 transition hover:border-primary hover:bg-primary-sky"
              >
                <span>Add Product</span>
                <span>→</span>
              </Link>

              <Link
                to="/services"
                className="flex items-center justify-between rounded-xl border border-border p-4 transition hover:border-primary hover:bg-primary-sky"
              >
                <span>Add Service</span>
                <span>→</span>
              </Link>

              <Link
                to="/profile"
                className="flex items-center justify-between rounded-xl border border-border p-4 transition hover:border-primary hover:bg-primary-sky"
              >
                <span>Edit Profile</span>
                <span>→</span>
              </Link>
            </div>

            <div className="mt-6 rounded-xl bg-primary p-5 text-white">
              <h3 className="mb-2 font-semibold">
                Upgrade Plan
              </h3>

              <p className="text-sm text-white/80">
                Unlock custom domains, premium themes,
                analytics and more.
              </p>

              <button
                className="
                  mt-4
                  rounded-lg
                  bg-white
                  px-4
                  py-2
                  text-sm
                  font-semibold
                  text-primary
                  transition
                  hover:bg-slate-100
                "
              >
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
                {/* Analytics */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Website Performance */}
          <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="font-display text-xl font-bold text-text-primary">
                  Website Performance
                </h2>

                <p className="text-sm text-muted">
                  Visitors and enquiries over the last 7 days.
                </p>
              </div>

              <select className="rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Last 90 Days</option>
              </select>
            </div>

            {/* Fake Chart */}
            <div className="flex h-72 items-end justify-between gap-3 rounded-xl bg-background p-6">
              {[45, 70, 35, 90, 65, 110, 80].map((height, index) => (
                <div
                  key={index}
                  className="flex flex-1 flex-col items-center"
                >
                  <div
                    style={{ height: `${height * 2}px` }}
                    className="w-full rounded-t-lg bg-primary transition-all duration-500 hover:bg-primary-dark"
                  />

                  <span className="mt-3 text-xs text-muted">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}
                  </span>
                </div>
              ))}
            </div>
         

          {/* Analytics Cards */}
          <div className="space-y-5">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h4 className="text-sm font-semibold text-muted">
                Website Visitors
              </h4>

              <h2 className="mt-2 text-4xl font-bold text-text-primary">
                5,846
              </h2>

              <p className="mt-2 text-sm text-success">
                ▲ 18% from last week
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h4 className="text-sm font-semibold text-muted">
                Conversion Rate
              </h4>

              <h2 className="mt-2 text-4xl font-bold text-text-primary">
                7.2%
              </h2>

              <p className="mt-2 text-sm text-success">
                ▲ 1.4% increase
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h4 className="text-sm font-semibold text-muted">
                Average Response
              </h4>

              <h2 className="mt-2 text-4xl font-bold text-text-primary">
                12m
              </h2>

              <p className="mt-2 text-sm text-warning">
                Respond faster to improve ranking
              </p>
            </div>
          </div>
        </div>
        </div>

        {/* Products & Services */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {/* Products */}
          <div className="rounded-2xl border border-border bg-card shadow-sm">
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <div>
                <h2 className="font-display text-xl font-bold text-text-primary">
                  Top Products
                </h2>

                <p className="text-sm text-muted">
                  Most viewed products.
                </p>
              </div>

              <Link
                to="/products"
                className="text-sm font-medium text-primary"
              >
                View All
              </Link>
            </div>

            <div className="divide-y divide-border">
              {[
                {
                  name: "Organic Fertilizer",
                  price: "₹799",
                  stock: 54,
                },
                {
                  name: "Premium Seeds",
                  price: "₹299",
                  stock: 120,
                },
                {
                  name: "Drip Kit",
                  price: "₹1499",
                  stock: 18,
                },
                {
                  name: "Bio Compost",
                  price: "₹499",
                  stock: 42,
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-6 py-4 hover:bg-background"
                >
                  <div>
                    <h4 className="font-semibold text-text-primary">
                      {item.name}
                    </h4>

                    <p className="text-sm text-muted">
                      Stock : {item.stock}
                    </p>
                  </div>

                  <span className="font-bold text-primary">
                    {item.price}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="rounded-2xl border border-border bg-card shadow-sm">
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <div>
                <h2 className="font-display text-xl font-bold text-text-primary">
                  Popular Services
                </h2>

                <p className="text-sm text-muted">
                  Frequently requested services.
                </p>
              </div>

              <Link
                to="/services"
                className="text-sm font-medium text-primary"
              >
                View All
              </Link>
            </div>

            <div className="divide-y divide-border">
              {[
                {
                  name: "Farm Consultation",
                  price: "₹499",
                },
                {
                  name: "Soil Testing",
                  price: "₹999",
                },
                {
                  name: "Crop Planning",
                  price: "₹699",
                },
                {
                  name: "Field Visit",
                  price: "₹1499",
                },
              ].map((service, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-6 py-4 hover:bg-background"
                >
                  <div>
                    <h4 className="font-semibold text-text-primary">
                      {service.name}
                    </h4>

                    <p className="text-sm text-muted">
                      Professional Service
                    </p>
                  </div>

                  <span className="font-bold text-primary">
                    {service.price}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
                {/* Latest Enquiries */}
        <section className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b border-border px-6 py-5">
            <div>
              <h2 className="font-display text-xl font-bold text-text-primary">
                Latest Enquiries
              </h2>

              <p className="text-sm text-muted">
                Customers who recently contacted your business.
              </p>
            </div>

            <Link
              to="/dashboard/enquiries"
              className="text-sm font-semibold text-primary hover:text-primary-dark"
            >
              View All
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-background">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                    Customer
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                    Contact
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                    Service
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-muted">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {[
                  {
                    name: "Rahul Sharma",
                    phone: "+91 9876543210",
                    service: "Website Development",
                    status: "New",
                  },
                  {
                    name: "Ayesha Khan",
                    phone: "+91 9898989898",
                    service: "SEO Package",
                    status: "Pending",
                  },
                  {
                    name: "Harsh Patel",
                    phone: "+91 9123456789",
                    service: "Online Store",
                    status: "Completed",
                  },
                  {
                    name: "Sneha Joshi",
                    phone: "+91 9988776655",
                    service: "Business Website",
                    status: "New",
                  },
                ].map((item, index) => (
                  <tr
                    key={index}
                    className="transition hover:bg-primary-sky"
                  >
                    <td className="px-6 py-5">
                      <div className="font-semibold text-text-primary">
                        {item.name}
                      </div>
                    </td>

                    <td className="px-6 py-5 text-sm text-muted">
                      {item.phone}
                    </td>

                    <td className="px-6 py-5 text-sm text-muted">
                      {item.service}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold
                        ${
                          item.status === "Completed"
                            ? "bg-green-100 text-green-700"
                            : item.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-right">
                      <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-dark">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Upgrade Banner */}

        <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-primary-dark p-10 text-white shadow-xl">
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div>
              <span className="rounded-full bg-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-wider">
                Premium Features
              </span>

              <h2 className="mt-5 font-display text-4xl font-bold">
                Take your business to the next level
              </h2>

              <p className="mt-4 max-w-2xl text-white/90">
                Connect your own domain, receive online orders,
                collect payments, improve SEO, view analytics,
                manage customers, and grow your business with
                powerful premium tools.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {[
                  "Custom Domain",
                  "Google Analytics",
                  "WhatsApp Automation",
                  "Online Payments",
                  "Premium Themes",
                  "Advanced SEO",
                ].map((feature) => (
                  <span
                    key={feature}
                    className="rounded-full bg-white/15 px-4 py-2 text-sm backdrop-blur"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <Link
                to="/pricing"
                className="inline-flex items-center rounded-xl bg-white px-8 py-4 text-lg font-bold text-primary shadow-lg transition hover:scale-105"
              >
                Upgrade Now →
              </Link>
            </div>
          </div>
        </section>
      </div>
    <DashboardLayout />
    </div>
  );
};

export default Dashboard;