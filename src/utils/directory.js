import {
  BedDouble,
  BookOpen,
  Building2,
  Calendar,
  Car,
  Coffee,
  Cpu,
  Gem,
  GraduationCap,
  Hammer,
  Heart,
  HeartPulse,
  Hotel,
  House,
  IndianRupee,
  Landmark,
  LayoutGrid,
  Package,
  Palette,
  PawPrint,
  Plane,
  Scissors,
  ShieldCheck,
  Shirt,
  Smile,
  Sparkles,
  Star,
  Store,
  Stethoscope,
  Truck,
  UtensilsCrossed,
  WandSparkles,
  Wrench,
  Zap,
  Dumbbell,
} from "lucide-react";

import { CATEGORIES } from "../config/directory";

/**
 * Category names are stored as plain strings on Business.category, so the
 * browse UI needs a name -> icon lookup. Anything unknown falls back to
 * LayoutGrid so a new category never breaks a page render.
 */
const ICONS = {
  BedDouble,
  BookOpen,
  Building2,
  Calendar,
  Car,
  Coffee,
  Cpu,
  Gem,
  GraduationCap,
  Hammer,
  Heart,
  HeartPulse,
  Hotel,
  House,
  IndianRupee,
  Landmark,
  LayoutGrid,
  Package,
  Palette,
  PawPrint,
  Plane,
  Scissors,
  ShieldCheck,
  Shirt,
  Smile,
  Sparkles,
  Star,
  Store,
  Stethoscope,
  Truck,
  UtensilsCrossed,
  WandSparkles,
  Wrench,
  Zap,
  Dumbbell,
};

export const categoryIcon = (name) => ICONS[name] || LayoutGrid;

export const categoryByName = (name) =>
  CATEGORIES.find((category) => category.name === name);

/** Indian numbering: 1250000 -> "12,50,000" and 56000000 -> "5.6 Crore". */
export const formatIndian = (value) =>
  new Intl.NumberFormat("en-IN").format(Number(value || 0));

export const formatCompact = (value) => {
  const number = Number(value || 0);

  if (number >= 10000000) return `${(number / 10000000).toFixed(1)} Crore`;
  if (number >= 100000) return `${(number / 100000).toFixed(1)} Lakh`;
  if (number >= 1000) return `${(number / 1000).toFixed(1)}K`;

  return formatIndian(number);
};

export const formatPrice = (value) => {
  const price = Number(value || 0);

  if (!price) return "Price on request";

  return `₹${formatIndian(price)}`;
};

const toMinutes = (time) => {
  const [hours, minutes] = String(time || "00:00").split(":").map(Number);

  return (hours || 0) * 60 + (minutes || 0);
};

export const DAYS_OF_WEEK = [
  { key: "mon", label: "Monday" },
  { key: "tue", label: "Tuesday" },
  { key: "wed", label: "Wednesday" },
  { key: "thu", label: "Thursday" },
  { key: "fri", label: "Friday" },
  { key: "sat", label: "Saturday" },
  { key: "sun", label: "Sunday" },
];

const dayKey = (date) => DAYS_OF_WEEK[(date.getDay() + 6) % 7].key;

/**
 * Works out whether a business is open right now from its weekly hours.
 * Handles past-midnight closing times (a bar closing at 01:00 on a Saturday
 * is still open at 00:30 on Saturday).
 */
export const getOpenStatus = (hours, now = new Date()) => {
  if (!hours || typeof hours !== "object") {
    return { open: false, label: "Hours not available", today: null };
  }

  const key = dayKey(now);
  const today = hours[key];
  const previousKey = DAYS_OF_WEEK[(DAYS_OF_WEEK.findIndex((day) => day.key === key) + 6) % 7].key;
  const previous = hours[previousKey];
  const current = now.getHours() * 60 + now.getMinutes();

  if (previous && previous.closed === false) {
    const closesAt = toMinutes(previous.close);

    if (closesAt <= toMinutes(previous.open) && current < closesAt) {
      return { open: true, label: "Open now", today };
    }
  }

  if (!today) {
    return { open: false, label: "Hours not available", today: null };
  }

  if (today.closed) {
    return { open: false, label: "Closed today", today };
  }

  const opensAt = toMinutes(today.open);
  const closesAt = toMinutes(today.close);
  const isOpen = current >= opensAt && current < closesAt;

  return {
    open: isOpen,
    label: isOpen ? "Open now" : `Closed · Opens ${formatTime(today.open)}`,
    today,
  };
};

export const formatTime = (time) => {
  const [hours, minutes] = String(time || "").split(":").map(Number);

  if (Number.isNaN(hours)) return "";

  const suffix = hours >= 12 ? "pm" : "am";
  const display = hours % 12 === 0 ? 12 : hours % 12;

  return `${display}:${String(minutes || 0).padStart(2, "0")} ${suffix}`;
};

export const hoursSummary = (hours) => {
  if (!hours || typeof hours !== "object") return "Hours not available";

  const first = DAYS_OF_WEEK.find((day) => hours[day.key] && !hours[day.key].closed);
  const openDays = DAYS_OF_WEEK.filter((day) => hours[day.key] && !hours[day.key].closed);

  if (!first) return "Closed all week";

  if (openDays.length === 7 && hours.mon.open === hours.sun.open) {
    return `Open ${formatTime(hours.mon.open)} - ${formatTime(hours.mon.close)}`;
  }

  return `${first.label} - ${formatTime(hours[first.key].open)} - ${formatTime(
    hours[first.key].close
  )}`;
};

export const locationLabel = (business) =>
  [business.area, business.city, business.state].filter(Boolean).join(", ") ||
  "India";
