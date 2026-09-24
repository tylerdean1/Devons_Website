import { useEffect, useState } from 'react';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import ServicesPage from './components/ServicesPage';
import Cart from './components/Cart';
import QuoteForm from './components/QuoteForm';
import Footer from './components/Footer';
import HomeSections from './components/HomeSections';
import ServiceDetail from './components/ServiceDetail';
import AreaDetail from './components/AreaDetail';
import CountyDetail from './components/CountyDetail';
import InvoiceAdmin from './components/InvoiceAdmin';
import { isServiceView, pathForView, viewForPath, type View } from './data/routes';
import { pageSeo } from './data/seo';

function App({ initialView }: { initialView?: View }) {
  const [currentView, setCurrentView] = useState<View>(initialView ?? (typeof window === 'undefined' ? 'home' : viewForPath(window.location.pathname)));

  useEffect(() => {
    const handlePopState = () => setCurrentView(viewForPath(window.location.pathname));
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const meta = pageSeo[currentView];
    document.title = meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', meta.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', meta.description);
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', `https://devonmccleese.com${pathForView(currentView)}`);
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', `https://devonmccleese.com${pathForView(currentView)}`);
    const shouldNoindex = currentView === 'quote' || currentView === 'cart' || currentView === 'invoices';
    let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (shouldNoindex && !robots) {
      robots = document.createElement('meta');
      robots.name = 'robots';
      document.head.appendChild(robots);
    }
    if (shouldNoindex) robots?.setAttribute('content', 'noindex,follow');
    else robots?.remove();
  }, [currentView]);

  const navigate = (view: string) => {
    const nextView = view as View;
    const path = pathForView(nextView);
    if (window.location.pathname !== path) window.history.pushState({}, '', path);
    setCurrentView(nextView);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const renderCurrentView = () => {
    if (isServiceView(currentView)) {
      return <ServiceDetail view={currentView} setCurrentView={navigate} />;
    }

    switch (currentView) {
      case 'home':
        return (
          <>
            <Hero setCurrentView={navigate} />
            <HomeSections setCurrentView={navigate} />
            <About />
          </>
        );
      case 'services':
        return <ServicesPage setCurrentView={navigate} />;
      case 'stAugustineBeach':
        return <AreaDetail setCurrentView={navigate} />;
      case 'stJohnsCounty':
        return <CountyDetail setCurrentView={navigate} />;
      case 'cart':
        return <Cart setCurrentView={navigate} />;
      case 'quote':
        return <QuoteForm setCurrentView={navigate} />;
      case 'invoices':
        return <InvoiceAdmin />;
      default:
        return (
          <>
            <Hero setCurrentView={navigate} />
            <HomeSections setCurrentView={navigate} />
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
        <Header currentView={currentView} setCurrentView={navigate} />
        <main id="main-content">{renderCurrentView()}</main>
        <Footer />
      </div>
    </CartProvider>
  );
}

export default App;
