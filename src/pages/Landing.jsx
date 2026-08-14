import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Clock, Bell } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      <Header />
      
      {/* Background blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <main className="flex-grow flex items-center pt-24 pb-12 sm:pt-32 sm:pb-16 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-foreground sm:text-5xl md:text-6xl">
              <span className="block mb-2">Never Waste Food Again.</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Track Expiry Dates Effortlessly
              </span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Scan your products, manage inventory, and get timely alerts before items expire. 
              Save money and reduce waste with our premium expiry date manager.
            </p>
            
            <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-hover md:py-4 md:text-lg transition-all shadow-lg hover:shadow-primary/25"
              >
                Get Started
                <ArrowRight className="ml-2 -mr-1 w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="mt-3 sm:mt-0 w-full sm:w-auto flex items-center justify-center px-8 py-3 border border-border text-base font-medium rounded-md text-foreground bg-card hover:bg-input md:py-4 md:text-lg transition-all"
              >
                Log In
              </Link>
            </div>
          </div>
          
          <div className="mt-24 grid grid-cols-1 gap-8 sm:grid-cols-3 text-center">
             <div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border">
               <div className="w-12 h-12 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-4">
                 <ShieldCheck className="w-6 h-6 text-primary" />
               </div>
               <h3 className="text-lg font-medium text-foreground">Secure & Reliable</h3>
               <p className="mt-2 text-sm text-gray-400">Your inventory data is safely stored and synced across all your devices.</p>
             </div>
             
             <div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border">
               <div className="w-12 h-12 mx-auto bg-secondary/20 rounded-full flex items-center justify-center mb-4">
                 <Clock className="w-6 h-6 text-secondary" />
               </div>
               <h3 className="text-lg font-medium text-foreground">Real-time Tracking</h3>
               <p className="mt-2 text-sm text-gray-400">Instantly see what's about to expire and plan your usage accordingly.</p>
             </div>

             <div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border">
               <div className="w-12 h-12 mx-auto bg-purple-500/20 rounded-full flex items-center justify-center mb-4">
                 <Bell className="w-6 h-6 text-purple-400" />
               </div>
               <h3 className="text-lg font-medium text-foreground">Smart Alerts</h3>
               <p className="mt-2 text-sm text-gray-400">Receive timely notifications before your products go bad.</p>
             </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
