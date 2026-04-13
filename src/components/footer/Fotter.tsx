import Link from "next/link";
import Image from "next/image";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-100 dark:border-gray-800/40 bg-white dark:bg-[#060a14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/icons/logo.svg"
                width={34}
                height={34}
                alt="Universal Perk"
              />
              <span className="font-extrabold text-[11px] leading-tight tracking-widest dark:text-white text-gray-900 uppercase">
                Universal
                <br />
                Perk
              </span>
            </Link>
            <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed max-w-[220px]">
              One trusted partner for web, mobile, cloud, DevOps, and AI.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-[13px] font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Services
            </h4>
            <ul className="space-y-3">
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
                    className="text-[13px] text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[13px] font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Case Studies", href: "/case-studies" },
                { label: "Blog", href: "/blog" },
                { label: "Contact", href: "/#contact" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-[13px] text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[13px] font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Contact
            </h4>
            <ul className="space-y-3 text-[13px] text-gray-500 dark:text-gray-400">
              <li>12785 Research Blvd, Suite 125</li>
              <li>Austin, TX 78750</li>
              <li className="pt-1">422 Longview St STE A</li>
              <li>San Jose, CA 95113</li>
              <li className="pt-1">+1 (650) 256-7514</li>
              <li>
                <a
                  href="mailto:contact@universalperk.com"
                  className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                >
                  contact@universalperk.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-gray-100 dark:border-gray-800/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-gray-400">
          <p>© {year} Universal Perk. All rights reserved.</p>
          <p>Built for US businesses. Delivered with global expertise.</p>
        </div>
      </div>
    </footer>
  );
}
