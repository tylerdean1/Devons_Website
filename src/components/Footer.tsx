import { Phone, Mail, MapPin, Hammer } from 'lucide-react';
import { site } from '../data/site';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Hammer className="h-8 w-8 text-yellow-400" aria-hidden="true" />
              <div>
              <h3 className="text-xl font-bold">{site.name}</h3>
                <p className="text-gray-400">{site.regionLabel} Handyman</p>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Professional handyman services for {site.serviceAreaLabel}. 15 years of construction experience you can trust
              for the repairs and improvements that keep your home working well.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                <a className="hover:text-yellow-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400" href={site.phoneHref}>{site.phone}</a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                <a className="hover:text-yellow-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400" href={site.emailHref}>{site.email}</a>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                <span>{site.regionLabel}, Florida</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Service Areas</h4>
            <ul className="space-y-2 text-gray-400">
              <li>{site.primaryArea} and nearby St. Johns County communities</li>
              <li>Residential repairs, maintenance, and home improvements</li>
              <li>Additional nearby service areas upon request</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} Devon McCleese Handyman Services. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
