import React, { useState } from 'react';
import { Send, CheckCircle, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { services } from '../data/services';

interface QuoteFormProps {
  setCurrentView: (view: string) => void;
}

export default function QuoteForm({ setCurrentView }: QuoteFormProps) {
  const { state, dispatch } = useCart();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    preferredDate: '',
    preferredTime: '',
    additionalNotes: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddService = () => {
    if (selectedServiceId) {
      const service = services.find(s => s.id === selectedServiceId);
      if (service) {
        dispatch({ type: 'ADD_ITEM', payload: service });
        setSelectedServiceId('');
        setShowServiceDropdown(false);
      }
    }
  };

  const handleRemoveService = (serviceId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: serviceId });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Create email content
    const servicesText = state.items.map(item =>
      `- ${item.service.name} (${item.service.category}) x${item.quantity}\n  ${item.service.description}`
    ).join('\n\n');

    // Create formatted quote content
    const quoteContent = `
Quote Request Details:

Customer Information:
- Name: ${formData.name}
- Email: ${formData.email}
- Phone: ${formData.phone}
- Address: ${formData.address}

Preferred Scheduling:
- Date: ${formData.preferredDate}
- Time: ${formData.preferredTime}

Requested Services:
${servicesText}

Additional Notes:
${formData.additionalNotes || 'None'}
    `.trim();

    try {
      // Send emails via Mailgun API
      const response = await fetch('/api/send-quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerEmail: formData.email,
          customerName: formData.name,
          quote: quoteContent,
          meta: {
            phone: formData.phone,
            address: formData.address,
            preferredDate: formData.preferredDate,
            preferredTime: formData.preferredTime,
            services: state.items
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send quote');
      }

      // Show success message
      setIsSubmitted(true);

      // Clear cart after submission
      dispatch({ type: 'CLEAR_CART' });

    } catch (error) {
      console.error('Error sending quote:', error);
      alert('There was an error sending your quote. Please try again or contact us directly at devonmgm@gmail.com');
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Quote Request Submitted!</h1>
            <p className="text-xl text-gray-600 mb-8">
              Your quote request has been successfully sent!
              <br /><br />
              • Devon has received your quote request at devonmgm@gmail.com
              <br />
              • You should receive a confirmation copy at your email address
              <br /><br />
              Devon will review your request and get back to you within 24 hours.
            </p>
            <button
              onClick={() => setCurrentView('home')}
              className="bg-gray-800 hover:bg-gray-700 text-yellow-400 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Request Your Quote</h1>

          {state.items.length > 0 && (
            <div className="mb-8 p-6 bg-gray-100 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Selected Services:</h2>
              <ul className="space-y-2">
                {state.items.map((item) => (
                  <li key={item.service.id} className="flex justify-between items-center">
                    <div className="flex-1">
                      <span className="text-gray-700 font-medium">{item.service.name}</span>
                      <p className="text-sm text-gray-500">{item.service.description}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500">x{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveService(item.service.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Add Service Section */}
          <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {state.items.length === 0 ? 'Add Services to Your Quote' : 'Add More Services'}
            </h2>

            {!showServiceDropdown ? (
              <button
                type="button"
                onClick={() => setShowServiceDropdown(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                Add Service
              </button>
            ) : (
              <div className="space-y-4">
                <div>
                  <label htmlFor="serviceSelect" className="block text-sm font-medium text-gray-700 mb-2">
                    Select a service to add:
                  </label>
                  <select
                    id="serviceSelect"
                    value={selectedServiceId}
                    onChange={(e) => setSelectedServiceId(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Choose a service...</option>
                    {services
                      .filter(service => !state.items.some(item => item.service.id === service.id))
                      .map(service => (
                        <option key={service.id} value={service.id}>
                          {service.name} - {service.category}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleAddService}
                    disabled={!selectedServiceId}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                  >
                    Add Selected Service
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowServiceDropdown(false);
                      setSelectedServiceId('');
                    }}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Date *
                </label>
                <select
                  id="preferredDate"
                  name="preferredDate"
                  required
                  value={formData.preferredDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="">Select preferred date</option>
                  <option value="this-week">This Week</option>
                  <option value="next-week">Next Week</option>
                  <option value="2-weeks">In 2 Weeks</option>
                  <option value="3-weeks">In 3 Weeks</option>
                  <option value="next-month">Next Month</option>
                  <option value="flexible">I'm flexible</option>
                </select>
              </div>

              <div>
                <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Time *
                </label>
                <select
                  id="preferredTime"
                  name="preferredTime"
                  required
                  value={formData.preferredTime}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="">Select preferred time</option>
                  <option value="8am-10am">8:00 AM - 10:00 AM</option>
                  <option value="10am-12pm">10:00 AM - 12:00 PM</option>
                  <option value="12pm-2pm">12:00 PM - 2:00 PM</option>
                  <option value="2pm-4pm">2:00 PM - 4:00 PM</option>
                  <option value="4pm-6pm">4:00 PM - 6:00 PM</option>
                  <option value="6pm-8pm">6:00 PM - 8:00 PM</option>
                  <option value="weekend-morning">Weekend Morning</option>
                  <option value="weekend-afternoon">Weekend Afternoon</option>
                  <option value="flexible">I'm flexible</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Project Address *
              </label>
              <input
                type="text"
                id="address"
                name="address"
                required
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Street address, City, State, ZIP"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                id="additionalNotes"
                name="additionalNotes"
                rows={4}
                value={formData.additionalNotes}
                onChange={handleInputChange}
                placeholder="Any specific details, timeline requirements, or questions..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              ></textarea>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="button"
                onClick={() => setCurrentView('cart')}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Back to Cart
              </button>
              <button
                type="submit"
                className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-gray-800 px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Send className="h-5 w-5" />
                Send Quote Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}