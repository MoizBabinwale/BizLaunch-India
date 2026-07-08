import React from "react";
import { Link } from "react-router-dom";
import { Briefcase, Twitter, Linkedin, Github } from "lucide-react";

const Footer = () => {
  const socialLinks = [
    { icon: Twitter, href: "#" },
    { icon: Linkedin, href: "#" },
    { icon: Github, href: "#" },
  ];

  const footerLinks = [
    { title: "Product", links: ["Pricing", "Explore", "Features"] },
    { title: "Company", links: ["About", "Contact", "Careers"] },
    { title: "Legal", links: ["Privacy", "Terms", "Licenses"] },
  ];

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <Briefcase className="h-8 w-8 text-primary" />
              <span className="font-display text-2xl font-bold">BizLaunch</span>
            </Link>
            <p className="text-sm text-muted">Launch your business online in minutes.</p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a key={index} href={social.href} className="text-muted hover:text-text-primary">
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            {footerLinks.map((section) => (
              <div key={section.title}>
                <h3 className="text-sm font-semibold leading-6 text-text-primary">{section.title}</h3>
                <ul className="mt-4 space-y-2">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm text-muted hover:text-text-primary">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 border-t border-border pt-8">
          <p className="text-center text-xs text-muted">&copy; {new Date().getFullYear()} BizLaunch India. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
