import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="w-full py-6 flex items-center justify-between border-b border-border/50 lg:border-none">
          <div className="flex items-center">
            <Link to="/">
              <span className="sr-only">Expiry Date Manager</span>
              <img
                className="h-10 w-auto rounded"
                src="/logo.png"
                alt="Expiry Date Manager Logo"
              />
            </Link>
            <div className="ml-4 font-bold text-xl tracking-tight text-foreground hidden sm:block">
              Expiry Date Manager
            </div>
          </div>
          <div className="ml-10 space-x-4">
            <Link
              to="/login"
              className="inline-block bg-input/50 py-2 px-4 border border-transparent rounded-md text-base font-medium text-foreground hover:bg-input transition-colors backdrop-blur-sm"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="inline-block bg-primary py-2 px-4 border border-transparent rounded-md text-base font-medium text-white hover:bg-primary-hover transition-colors"
            >
              Sign up
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
