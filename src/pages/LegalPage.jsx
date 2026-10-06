import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ChevronRight, FileText, LockKeyhole, ShieldCheck } from "lucide-react";

const effectiveDate = "27 September 2026";

const termsSections = [
  {
    title: "1. Agreement to these Terms",
    content: (
      <p>
        These Terms of Service ("Terms") govern your use of BizLaunch India, including our website, business-management dashboard and public business pages (collectively, the "Platform"). By creating an account, publishing a business profile, or otherwise using the Platform, you agree to these Terms and our <Link to="/privacy">Privacy Policy</Link>. If you use the Platform for a business, you confirm that you are authorised to accept these Terms for that business.
      </p>
    ),
  },
  {
    title: "2. What BizLaunch India provides",
    content: (
      <p>
        BizLaunch India provides tools that help businesses establish and manage an online presence. Depending on the features available to you, these tools may include a public business page, product and service listings, contact details, WhatsApp and call links, map links, search-engine settings, customer enquiries, dashboard tools and business statistics. The Platform is a technology service; it is not the seller, supplier, agent, marketplace operator, payment intermediary, or delivery provider for any listed business.
      </p>
    ),
  },
  {
    title: "3. Accounts and security",
    content: (
      <ul>
        <li>Provide accurate, current account and business information and keep it updated.</li>
        <li>Keep your password, verification codes and account access confidential. You are responsible for activity carried out through your account.</li>
        <li>Use only lawful sign-in methods and do not share, sell, transfer, scrape, probe or attempt to gain unauthorised access to accounts or Platform systems.</li>
        <li>Tell us promptly through the support contact available on the Platform if you believe your account has been accessed without permission.</li>
      </ul>
    ),
  },
  {
    title: "4. Business content and listings",
    content: (
      <>
        <p>Business owners remain responsible for all information they add to the Platform, including business names, descriptions, images, logos, product and service details, prices, stock, contact details, addresses, map links, social links and promotional claims.</p>
        <ul>
          <li>You must have the rights, permissions and consents needed to use and publish your content.</li>
          <li>Your information must be accurate, non-misleading and compliant with applicable laws, licences, tax requirements, consumer-protection rules and industry standards.</li>
          <li>Do not publish unlawful, fraudulent, infringing, harmful, discriminatory, obscene, deceptive or privacy-violating content, or content that contains another person&apos;s data without permission.</li>
          <li>You grant BizLaunch India a non-exclusive, worldwide, royalty-free licence to host, reproduce, adapt for technical delivery, display and distribute your content as necessary to operate, promote and improve the Platform and your public business page.</li>
        </ul>
      </>
    ),
  },
  {
    title: "5. Public pages, enquiries and third-party links",
    content: (
      <p>
        Published business pages and the details placed on them may be visible to the public and indexed by search engines. Calls, WhatsApp conversations, map visits, social-media visits and purchases take place between visitors and the relevant business or third-party service. BizLaunch India does not control those interactions and is not responsible for the quality, safety, availability, legality, fulfilment, refunds, warranties or disputes relating to a business&apos;s offerings. Visitors should make their own decisions before contacting or transacting with a listed business.
      </p>
    ),
  },
  {
    title: "6. Plans, fees and future paid features",
    content: (
      <p>
        The Platform may offer free and paid plans or optional features. Where a paid plan is made available, its current price, billing period, included features, taxes, renewal and cancellation terms will be shown before payment is due. Unless a specific offer says otherwise, fees are non-refundable to the extent permitted by law. We may change future pricing or features with reasonable notice; a change will not affect a period already paid for unless required for legal, security or service reasons.
      </p>
    ),
  },
  {
    title: "7. Acceptable use and enforcement",
    content: (
      <p>
        You may not use the Platform to break the law, impersonate others, send spam, distribute malware, interfere with the Platform, harvest personal data, bypass security measures, infringe intellectual-property rights, or misrepresent your affiliation or offerings. We may investigate suspected misuse and may remove content, unpublish a business page, limit features, suspend or close an account where reasonably necessary to protect users, the Platform or legal compliance. Where practical, we will provide notice of the action and a way to seek review.
      </p>
    ),
  },
  {
    title: "8. Intellectual property",
    content: (
      <p>
        BizLaunch India and its Platform design, software, branding and other materials are protected by applicable intellectual-property laws. Except for the limited right to use the Platform under these Terms, no rights are granted to you. You retain ownership of the content you submit, subject to the licence in Section 4. You may not use our name or branding in a way that suggests endorsement without prior written permission.
      </p>
    ),
  },
  {
    title: "9. Availability, disclaimers and liability",
    content: (
      <p>
        We work to keep the Platform secure and available, but it is provided on an "as is" and "as available" basis. We do not guarantee uninterrupted operation, specific search ranking, traffic, leads, sales, data recovery, compatibility or outcomes for any business. To the fullest extent permitted by law, BizLaunch India is not liable for indirect, incidental, special, consequential or punitive losses, or for losses arising from third-party businesses, links or services. Nothing in these Terms excludes liability that cannot lawfully be excluded.
      </p>
    ),
  },
  {
    title: "10. Changes, termination and governing law",
    content: (
      <p>
        You may stop using the Platform at any time. We may discontinue or change features, or terminate access as described in these Terms. We may update these Terms from time to time; the revised version will be posted here with a new effective date. Continued use after the effective date means you accept the revised Terms. These Terms are governed by the laws of India, subject to any mandatory rights available to you under applicable law.
      </p>
    ),
  },
];

const privacySections = [
  {
    title: "1. Scope of this Policy",
    content: <p>This Privacy Policy explains how BizLaunch India collects, uses, shares and protects personal data when you use the Platform. It covers account holders, business owners, visitors to public business pages and people who submit an enquiry through a business page.</p>,
  },
  {
    title: "2. Information we collect",
    content: <ul><li><strong>Account information:</strong> name, email address, phone number, avatar, password (stored as a secure hash), chosen sign-in method and account status.</li><li><strong>Business information:</strong> business name, description, category, logo, images, products, services, prices, stock, contact details, address, map and social links, and search settings you choose to publish.</li><li><strong>Enquiry information:</strong> the name, email address, phone number, message and source supplied by a visitor when they contact a business through a Platform form.</li><li><strong>Usage and technical information:</strong> page views and interaction counts associated with a business page, and limited session information required to keep you signed in securely.</li><li><strong>Information from sign-in providers:</strong> when you choose Google sign-in, we receive the identity details Google provides for your account, such as your name, email address, profile image and Google account identifier.</li></ul>,
  },
  {
    title: "3. How we use information",
    content: <ul><li>To create, authenticate, secure and administer accounts.</li><li>To host, display and operate business pages, catalogues, contact options and dashboards.</li><li>To deliver enquiries to the relevant business and show business statistics.</li><li>To send account verification, password-reset and service messages.</li><li>To prevent fraud, abuse and security incidents; troubleshoot and improve the Platform; and comply with legal obligations.</li><li>To communicate about material changes to the Platform, these Terms or this Policy.</li></ul>,
  },
  {
    title: "4. Public information and your choices",
    content: <p>When a business owner publishes a business page, the information chosen for that page—such as the business name, catalogue, phone number, WhatsApp number, email address, address and links—can be seen by anyone who visits it and may be indexed by search engines. Business owners should not publish personal information unless they are authorised to do so. They can review and update their business information from their account dashboard, subject to Platform availability.</p>,
  },
  {
    title: "5. Cookies and similar technologies",
    content: <p>BizLaunch India uses essential cookies to maintain authenticated sessions and help protect account security. These cookies are not used to build advertising profiles. If you disable essential cookies, sign-in and other account features may not work. Third-party services that you visit through a link, such as Google, WhatsApp, maps or social networks, may set or use their own cookies under their own policies.</p>,
  },
  {
    title: "6. When we share information",
    content: <><ul><li><strong>With the business you contact:</strong> enquiry details are made available to the business whose page you used.</li><li><strong>With the public:</strong> content a business owner chooses to publish is displayed on that business&apos;s public page.</li><li><strong>With service providers:</strong> providers that help us run the Platform, such as hosting, database, email, authentication and communications providers, may process data only to provide services to us.</li><li><strong>For legal and safety reasons:</strong> where required by law or where reasonably necessary to protect rights, safety, security or the integrity of the Platform.</li><li><strong>In a business transfer:</strong> if BizLaunch India is involved in a merger, acquisition, financing or transfer of assets, subject to applicable law.</li></ul><p>We do not sell personal data for third-party advertising.</p></>,
  },
  {
    title: "7. Data retention and security",
    content: <p>We retain information for as long as needed to provide the Platform, maintain business records, resolve disputes, meet legal obligations and enforce agreements. The period depends on the information and why it was collected. We use reasonable technical and organisational measures designed to protect data, including password hashing, authenticated sessions and server-side access controls. No online system can be guaranteed completely secure.</p>,
  },
  {
    title: "8. Your rights and requests",
    content: <p>Subject to applicable law, you may request access to, correction of, deletion of or a copy of personal data we hold about you, or object to or withdraw consent for certain processing. You may also update account and business data in the dashboard. To make a privacy request, use the support contact made available on the Platform and include the email address or phone number associated with your account. We may need to verify your identity before responding. Deleting or unpublishing information does not necessarily remove copies already retained for legal, security or backup purposes, or information independently indexed by search engines.</p>,
  },
  {
    title: "9. Children and international access",
    content: <p>The Platform is not intended for children who are not permitted to consent under applicable law. Do not create an account or provide personal data if you cannot lawfully do so. The Platform is designed for businesses in India, but it may be accessible from elsewhere. Your information may be processed where our service providers operate, with appropriate safeguards where required.</p>,
  },
  {
    title: "10. Changes and contact",
    content: <p>We may revise this Policy as the Platform or legal requirements evolve. We will post the revised Policy here and update its effective date. For privacy questions or requests, please use the support contact made available within the Platform. If you are contacting us about a business&apos;s goods, services or an enquiry, contact that business directly; BizLaunch India does not control its independent practices.</p>,
  },
];

export default function LegalPage({ type }) {
  const isPrivacy = type === "privacy";
  const title = isPrivacy ? "Privacy Policy" : "Terms of Service";
  const description = isPrivacy
    ? "Learn how BizLaunch India handles account, business and enquiry information."
    : "Read the terms for using BizLaunch India and publishing a business online.";
  const sections = isPrivacy ? privacySections : termsSections;
  const Icon = isPrivacy ? LockKeyhole : FileText;

  return (
    <>
      <Helmet>
        <title>{title} | BizLaunch India</title>
        <meta name="description" content={description} />
      </Helmet>

      <main className="min-h-screen bg-background">
        <section className="relative overflow-hidden border-b border-primary/10 bg-gradient-to-br from-primary-sky via-white to-blue-100">
          <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-blue-400/10 blur-3xl" />
          <div className="relative mx-auto max-w-5xl px-6 py-16 sm:py-20">
            <nav className="flex items-center gap-2 text-sm text-muted" aria-label="Breadcrumb">
              <Link to="/" className="transition hover:text-primary">Home</Link>
              <ChevronRight size={16} />
              <span>{title}</span>
            </nav>
            <div className="mt-8 flex items-start gap-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/25"><Icon size={27} /></div>
              <div>
                <p className="font-semibold uppercase tracking-[0.2em] text-primary text-xs">BizLaunch India</p>
                <h1 className="mt-3 font-display text-4xl font-extrabold text-text-primary sm:text-5xl">{title}</h1>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-text-secondary">{isPrivacy ? "A clear explanation of the information we handle while helping businesses build their online presence." : "The rules that help keep BizLaunch India useful, reliable and safe for businesses and their customers."}</p>
                <p className="mt-5 text-sm font-medium text-muted">Effective date: {effectiveDate}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
          <div className="mb-10 rounded-2xl border border-primary/15 bg-primary-sky/50 p-5 text-sm leading-6 text-text-secondary sm:flex sm:items-center sm:gap-4">
            <ShieldCheck className="mb-3 shrink-0 text-primary sm:mb-0" size={24} />
            <p>{isPrivacy ? "Your business and account data matter. Please read this Policy before using the Platform or publishing a business page." : "Please read these Terms carefully. They apply to every account, business profile and public business page on the Platform."}</p>
          </div>
          <div className="space-y-10">
            {sections.map((section) => (
              <article key={section.title} className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
                <h2 className="font-display text-2xl font-bold text-text-primary">{section.title}</h2>
                <div className="legal-copy mt-4 text-[15px] leading-7 text-text-secondary">{section.content}</div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
