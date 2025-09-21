import { Award, Users, Clock, Shield } from 'lucide-react';

export default function About() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">About Devon McCleese</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            With 15 years of construction experience in North Florida, I provide reliable,
            quality handyman services to homeowners throughout Clay County.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <img
              src="/image.png"
              alt="Devon McCleese"
              className="rounded-2xl shadow-xl w-full h-96 object-cover"
            />
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              Experienced. Reliable. Professional.
            </h3>
            <p className="text-gray-600 mb-6 text-lg leading-relaxed">
              I've been working in construction for over 15 years, developing expertise in a wide
              range of home improvement projects. From simple repairs to complete renovations,
              I take pride in delivering quality workmanship that stands the test of time.
            </p>
            <p className="text-gray-600 mb-6 text-lg leading-relaxed">
              Based in Clay County, I understand the unique needs of North Florida homes and
              work with homeowners to find solutions that fit their budget and timeline.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              I handle all projects that don't require a contractor's license, ensuring you
              get professional results without the overhead of larger construction companies.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center bg-white p-8 rounded-xl shadow-lg">
            <Award className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-gray-900 mb-2">15+ Years</h4>
            <p className="text-gray-600">Construction Experience</p>
          </div>
          <div className="text-center bg-white p-8 rounded-xl shadow-lg">
            <Users className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-gray-900 mb-2">500+</h4>
            <p className="text-gray-600">Satisfied Customers</p>
          </div>
          <div className="text-center bg-white p-8 rounded-xl shadow-lg">
            <Clock className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-gray-900 mb-2">Same Day</h4>
            <p className="text-gray-600">Response Time</p>
          </div>
          <div className="text-center bg-white p-8 rounded-xl shadow-lg">
            <Shield className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-gray-900 mb-2">Licensed</h4>
            <p className="text-gray-600">& Insured</p>
          </div>
        </div>
      </div>
    </section>
  );
}