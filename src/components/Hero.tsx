import { Phone, Mail, MapPin, Star } from 'lucide-react';

interface HeroProps {
  setCurrentView: (view: string) => void;
}

export default function Hero({ setCurrentView }: HeroProps) {
  return (
    <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Trusted Handyman Services in
              <span className="text-yellow-400"> Clay &amp; Duval County, FL</span>
            </h1>
            <p className="text-xl mb-4 text-gray-300">
              15 years of construction experience supporting homeowners from Orange Park and Fleming Island to Jacksonville,
              Riverside, Mandarin, and the Beaches.
            </p>
            <p className="text-lg mb-8 text-gray-400">
              Devon McCleese delivers fast, professional repairs, remodels, and maintenance tailored to North Florida homes so
              you can protect your biggest investment.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                onClick={() => setCurrentView('services')}
                className="bg-yellow-500 hover:bg-yellow-400 text-gray-800 px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                View Services
              </button>
              <button
                onClick={() => setCurrentView('quote')}
                className="bg-transparent border-2 border-yellow-400 hover:bg-yellow-400 hover:text-gray-800 text-yellow-400 px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Get Free Quote
              </button>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-current text-yellow-400" />
                <span>15+ Years Experience</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>Serving Clay &amp; Duval County</span>
              </div>
              <div className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                <span>Call (904) 501-7147 Today</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <h3 className="text-2xl font-semibold mb-4">Quick Contact</h3>
              <div className="space-y-4">
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
                <p className="text-sm text-gray-400 leading-relaxed">
                  Proudly repairing homes across Orange Park, Green Cove Springs, Middleburg, Fleming Island, Keystone Heights,
                  Jacksonville, Mandarin, San Marco, Arlington, and the Beaches.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}