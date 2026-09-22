import { useState } from 'react';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import ServicesPage from './components/ServicesPage';
import Cart from './components/Cart';
import QuoteForm from './components/QuoteForm';
import Footer from './components/Footer';

function App() {
  const [currentView, setCurrentView] = useState('home');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return (
          <>
            <Hero setCurrentView={setCurrentView} />
            <About />
          </>
        );
      case 'services':
        return <ServicesPage />;
      case 'cart':
        return <Cart setCurrentView={setCurrentView} />;
      case 'quote':
        return <QuoteForm setCurrentView={setCurrentView} />;
      default:
        return (
          <>
            <Hero setCurrentView={setCurrentView} />
            <About />
          </>
        );
    }
  };

  return (
    <CartProvider>
      <div className="min-h-screen">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-yellow-400 focus:px-4 focus:py-2 focus:font-semibold focus:text-gray-900"
        >
          Skip to main content
        </a>
        <Header currentView={currentView} setCurrentView={setCurrentView} />
        <main id="main-content">{renderCurrentView()}</main>
        <Footer />
      </div>
    </CartProvider>
  );
}

export default App;
