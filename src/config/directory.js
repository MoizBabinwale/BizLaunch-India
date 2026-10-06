/**
 * Single source of truth for the directory browse experience.
 *
 * The server keeps a mirrored copy in server/config/categories.js. Both lists
 * use the same `name` value because that is what gets stored on
 * Business.category and what the search endpoint filters on.
 */
export const CATEGORIES = [
  { name: "Restaurants", icon: "UtensilsCrossed" },
  { name: "Hotels & Homestays", icon: "Hotel" },
  { name: "Cafes & Coffee Shops", icon: "Coffee" },
  { name: "Beauty & Salons", icon: "WandSparkles" },
  { name: "Doctors", icon: "Stethoscope" },
  { name: "Hospitals", icon: "HeartPulse" },
  { name: "Dentists", icon: "Smile" },
  { name: "Education & Coaching", icon: "GraduationCap" },
  { name: "Home Decor", icon: "House" },
  { name: "Interior Designers", icon: "Palette" },
  { name: "Real Estate Agents", icon: "Landmark" },
  { name: "Rent & Hire", icon: "Building2" },
  { name: "Car & Auto Services", icon: "Car" },
  { name: "Electricians", icon: "Zap" },
  { name: "Plumbers", icon: "Wrench" },
  { name: "Contractors & Builders", icon: "Hammer" },
  { name: "Wedding Planners", icon: "Heart" },
  { name: "Event Organisers", icon: "Calendar" },
  { name: "PG & Hostels", icon: "BedDouble" },
  { name: "Gyms & Fitness", icon: "Dumbbell" },
  { name: "Travel Agents", icon: "Plane" },
  { name: "Packers & Movers", icon: "Truck" },
  { name: "Electronics Stores", icon: "Cpu" },
  { name: "Fashion Stores", icon: "Shirt" },
  { name: "Jewellers", icon: "Gem" },
  { name: "Insurance", icon: "ShieldCheck" },
  { name: "Loans & Finance", icon: "IndianRupee" },
  { name: "Pet Shops", icon: "PawPrint" },
  { name: "Cobblers & Tailors", icon: "Scissors" },
  { name: "Hardware Stores", icon: "Store" },
  { name: "Book Stores", icon: "BookOpen" },
  { name: "Others", icon: "LayoutGrid" },
];

export const CATEGORY_NAMES = CATEGORIES.map((category) => category.name);

/**
 * Cities are deliberately NOT hardcoded. Every city list in the UI (search bar
 * datalist, explore filters, footer links) is populated from
 * GET /businesses/public/cities, so only cities that actually have published
 * listings are ever offered.
 */

export const SORT_OPTIONS = [
  { value: "relevance", label: "Best match" },
  { value: "rating", label: "Highest rated" },
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

/**
 * Company contact details, driven by environment variables so the site only
 * ever shows details you have actually configured. Anything left empty is
 * hidden from the UI rather than shown as a placeholder.
 */
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

/** True when at least one real contact channel has been configured. */
export const hasContactDetails = () =>
  Boolean(
    COMPANY.helpline ||
      COMPANY.supportEmail ||
      COMPANY.businessEmail ||
      COMPANY.adsEmail ||
      COMPANY.address
  );

