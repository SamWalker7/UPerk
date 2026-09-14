import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";

const LOCATIONS = [
  { city: "Austin, TX", address: "12785 Research Blvd, Suite 125", zip: "78750" },
  { city: "San Jose, CA", address: "422 Longview St STE A", zip: "95113" },
  { city: "Baltimore, MD", address: "1 Olympic Pl, Suite 900", zip: "21204" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 dark:border-white/10 bg-white dark:bg-[#060a14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_0.8fr_1.4fr] gap-8 lg:gap-10">
          {/* Brand */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/icons/logo.svg"
                width={34}
                height={34}
                alt="Universal Perk"
              />
              <span className="font-bold text-lg tracking-normal dark:text-white text-gray-900">
                Universal Perk
              </span>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-xs">
              Your ideas, brought to life. One team for the websites, apps, and tools that move your business forward.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-[14.5px] font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Services
            </h4>
            <ul className="space-y-1">
              {[
                { label: "Web Development", href: "/#services" },
                { label: "Mobile Development", href: "/#services" },
                { label: "Software Engineering", href: "/#services" },
                { label: "Cloud & DevOps", href: "/#services" },
                { label: "AI Services", href: "/ai-services" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-10 items-center text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[14.5px] font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-1">
              {[
                { label: "Case Studies", href: "/#case-studies" },
                // Blog hidden from nav/footer until it has real content — see Navebar.tsx.
                { label: "Careers", href: "/careers" },
                { label: "Contact", href: "/#contact" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-10 items-center text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[14.5px] font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Contact
            </h4>
            <p className="mb-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">Tell us what you have in mind.</p>
            <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
              <li>
                <a
                  href="mailto:contact@universalperk.com"
                  className="inline-flex min-h-11 items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500"
                >
                  <Mail aria-hidden className="h-4 w-4 shrink-0" />
                  <span className="break-all">contact@universalperk.com</span>
                </a>
              </li>
              <li>
                <a href="tel:+14087699094" className="inline-flex min-h-11 items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500">
                  <Phone aria-hidden className="h-4 w-4 shrink-0" /> +1 (408) 769-9094
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Equal-weight location links keep all offices easy to find. */}
        <div className="mt-10 border-t border-gray-200 pt-8 dark:border-white/10">
          <h3 className="mb-6 text-sm font-semibold text-gray-900 dark:text-white">Our locations</h3>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {LOCATIONS.map((location) => (
              <li key={location.city}>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${location.address}, ${location.city} ${location.zip}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${location.city} office on Google Maps (opens in a new tab)`}
                  className="group flex items-start gap-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500"
                >
                  <MapPin aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="flex items-center gap-2 text-base font-bold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                      {location.city}<ArrowUpRight aria-hidden className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    </p>
                    <address className="mt-1 text-sm not-italic leading-relaxed text-gray-600 dark:text-gray-400">
                      {location.address}<br />{location.zip}
                    </address>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/10 text-xs text-gray-500 dark:text-gray-400">
          <p>© {year} Universal Perk. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
