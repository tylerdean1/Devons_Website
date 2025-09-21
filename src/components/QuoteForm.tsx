import React, { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { QuoteRequest } from '../types';

interface QuoteFormProps {
  setCurrentView: (view: string) => void;
}

export default function QuoteForm({ setCurrentView }: QuoteFormProps) {
  const { state, dispatch } = useCart();
  const [isSubmitted, setIsSubmitted] = useState(false);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const quoteRequest: QuoteRequest = {
      ...formData,
      services: state.items
    };

    // Create email content
    const servicesText = state.items.map(item =>
      `- ${item.service.name} (${item.service.category}) x${item.quantity}\n  ${item.service.description}`
    ).join('\n\n');

    // Create email content for Devon
    const emailSubject = `Quote Request from ${formData.name}`;
    const emailBodyForDevon = `
New Quote Request Details:

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

---
This quote request was submitted through Devon's Website.
    `.trim();

    // Create customer copy email content
    const customerSubject = `Copy of Your Quote Request - ${formData.name}`;
    const customerEmailBody = `
Thank you for your quote request! Here's a copy for your records:

Your Information:
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

---
Devon will review your request and contact you within 24 hours.
You can reach Devon directly at devonmgm@gmail.com or (904) 501-7147.

This quote request was submitted through Devon's Website.
    `.trim();

    // Open email client with pre-filled quote information to Devon with customer CC'd
    const mailtoLink = `mailto:devonmgm@gmail.com?cc=${encodeURIComponent(formData.email)}&subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBodyForDevon)}`;
    window.open(mailtoLink);

    // Also create a separate email for the customer's records
    setTimeout(() => {
      const customerMailtoLink = `mailto:${encodeURIComponent(formData.email)}?subject=${encodeURIComponent(customerSubject)}&body=${encodeURIComponent(customerEmailBody)}`;
      window.open(customerMailtoLink);
    }, 1000); // Delay to ensure the first email opens first

    // Log for debugging
    console.log('Quote Request:', quoteRequest);

    // Show success message
    setIsSubmitted(true);

    // Clear cart after submission
    dispatch({ type: 'CLEAR_CART' });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Quote Request Submitted!</h1>
            <p className="text-xl text-gray-600 mb-8">
              Your email client should have opened with two pre-filled emails:
              <br />
              • A quote request to devonmgm@gmail.com with you CC'd
              <br />
              • A copy for your records
              <br /><br />
              If the emails didn't open automatically, please send the quote details manually to devonmgm@gmail.com.
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
                    <span className="text-gray-700">{item.service.name}</span>
                    <span className="text-gray-500">x{item.quantity}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

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