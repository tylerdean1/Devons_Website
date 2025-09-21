import { Phone, Mail, MapPin, Hammer } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Hammer className="h-8 w-8 text-yellow-400" />
              <div>
                <h3 className="text-xl font-bold">Devon McCleese</h3>
                <p className="text-gray-400">Clay &amp; Duval County Handyman</p>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Professional handyman services for Clay County and Duval County in Northeast Florida.
              15 years of construction experience you can trust for homes throughout the Jacksonville metro area.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-yellow-400" />
                <span>(904) 501-7147</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-yellow-400" />
                <span>devonmgm@gmail.com</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-yellow-400" />
                <span>Clay &amp; Duval Counties, Florida</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Service Areas</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Clay County: Orange Park, Green Cove Springs, Middleburg, Fleming Island, Keystone Heights</li>
              <li>Duval County: Jacksonville, Mandarin, Riverside, San Marco, Arlington, Jacksonville Beach</li>
              <li>Additional First Coast communities upon request</li>
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