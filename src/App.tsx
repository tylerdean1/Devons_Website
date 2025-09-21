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
        <Header currentView={currentView} setCurrentView={setCurrentView} />
        {renderCurrentView()}
        <Footer />
      </div>
    </CartProvider>
  );
}

export default App;