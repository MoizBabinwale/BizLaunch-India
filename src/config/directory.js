/**
 * Discovery taxonomy mirrored from server/config/categories.js.
 * Businesses store the sector in `category` and the selected leaf in
 * `subcategory`, preserving compatibility with existing directory filters.
 */
export const CATEGORIES = [
  {
    name: "Vehicle",
    slug: "vehicle",
    icon: "Car",
    description: "Fuel, charging, repair and roadside assistance",
    subcategories: [
      { name: "Petrol pump", slug: "petrol-pump", icon: "Zap", serviceType: "station" },
      { name: "CNG", slug: "cng", icon: "Zap", serviceType: "station" },
      { name: "EV charging", slug: "ev-charging", icon: "Zap", serviceType: "station" },
      { name: "Mechanic", slug: "mechanic", icon: "Wrench", serviceType: "service" },
      { name: "Puncture", slug: "puncture", icon: "Wrench", serviceType: "service" },
      { name: "Towing", slug: "towing", icon: "Truck", serviceType: "dispatch" },
      { name: "Car wash", slug: "car-wash", icon: "Car", serviceType: "service" },
    ],
  },
  {
    name: "Home",
    slug: "home",
    icon: "House",
    description: "Trusted repair and maintenance professionals",
    subcategories: [
      { name: "Plumber", slug: "plumber", icon: "Wrench", serviceType: "service" },
      { name: "Electrician", slug: "electrician", icon: "Zap", serviceType: "service" },
      { name: "Carpenter", slug: "carpenter", icon: "Hammer", serviceType: "service" },
      { name: "AC repair", slug: "ac-repair", icon: "Zap", serviceType: "service" },
      { name: "RO repair", slug: "ro-repair", icon: "Wrench", serviceType: "service" },
      { name: "Pest control", slug: "pest-control", icon: "ShieldCheck", serviceType: "service" },
    ],
  },
  {
    name: "Waste/Scrap",
    slug: "waste-scrap",
    icon: "Recycle",
    description: "Scrap collection, e-waste and reuse",
    subcategories: [
      { name: "Kabadiwala", slug: "kabadiwala", icon: "Recycle", serviceType: "dispatch" },
      { name: "E-waste", slug: "e-waste", icon: "Cpu", serviceType: "dispatch" },
      { name: "Scrap pickup", slug: "scrap-pickup", icon: "Truck", serviceType: "dispatch" },
      { name: "Used furniture", slug: "used-furniture", icon: "Store", serviceType: "retail" },
    ],
  },
  {
    name: "Transport",
    slug: "transport",
    icon: "Truck",
    description: "Book local goods vehicles and agricultural transport",
    subcategories: [
      { name: "Tempo", slug: "tempo", icon: "Truck", serviceType: "dispatch" },
      { name: "Pickup truck", slug: "pickup-truck", icon: "Truck", serviceType: "dispatch" },
      { name: "Mini-truck", slug: "mini-truck", icon: "Truck", serviceType: "dispatch" },
      { name: "Tractor", slug: "tractor", icon: "Truck", serviceType: "dispatch" },
    ],
  },
  {
    name: "Personal Care",
    slug: "personal-care",
    icon: "Scissors",
    description: "Salon, barber and personal grooming services",
    subcategories: [
      { name: "Salon & Barber", slug: "salon-barber", icon: "Scissors", serviceType: "service" },
    ],
  },
  {
    name: "Retail/Services",
    slug: "retail-services",
    icon: "Store",
    description: "Everyday retail, food, medicine and hardware",
    subcategories: [
      { name: "Restaurants", slug: "restaurants", icon: "UtensilsCrossed", serviceType: "retail" },
      { name: "Pharmacies", slug: "pharmacies", icon: "HeartPulse", serviceType: "retail" },
      { name: "Hardware", slug: "hardware", icon: "Hammer", serviceType: "retail" },
      { name: "Kirana", slug: "kirana", icon: "Store", serviceType: "retail" },
    ],
  },
];

export const CATEGORY_NAMES = CATEGORIES.map((category) => category.name);
export const SUBCATEGORIES = CATEGORIES.flatMap((category) =>
  category.subcategories.map((subcategory) => ({
    ...subcategory,
    sector: category.name,
    sectorSlug: category.slug,
  }))
);

export const SORT_OPTIONS = [
  { value: "relevance", label: "Most relevant" },
  { value: "rating", label: "Highest rated" },
  { value: "nearest", label: "Nearest" },
  { value: "price", label: "Lowest price" },
  { value: "popular", label: "Most viewed" },
  { value: "newest", label: "Recently added" },
];

export const RATING_FILTERS = [
  { value: 4, label: "4.0 & above" },
  { value: 3, label: "3.0 & above" },
  { value: 2, label: "2.0 & above" },
];

export const CONTACT_SUBJECTS = [
  "General enquiry",
  "Business listing support",
  "Report a wrong listing",
  "Advertising enquiry",
  "Feedback or complaint",
  "Partnership",
];

export const COMPANY = {
  name: "BizLaunch India",
  domain: "bizlaunchindia.com",
  helpline: process.env.REACT_APP_HELPLINE || "",
  supportEmail: process.env.REACT_APP_SUPPORT_EMAIL || "",
  businessEmail: process.env.REACT_APP_BUSINESS_EMAIL || "",
  adsEmail: process.env.REACT_APP_ADS_EMAIL || "",
  address: process.env.REACT_APP_ADDRESS || "",
  supportHours: process.env.REACT_APP_SUPPORT_HOURS || "",
};

export const hasContactDetails = () =>
  Boolean(
    COMPANY.helpline ||
      COMPANY.supportEmail ||
      COMPANY.businessEmail ||
      COMPANY.adsEmail ||
      COMPANY.address
  );
