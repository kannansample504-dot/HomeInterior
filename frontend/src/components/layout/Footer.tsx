import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full py-12 px-8 bg-slate-50">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl mx-auto">
        <div>
          <p className="font-headline font-bold text-slate-900 text-lg mb-4">Home Interior</p>
          <p className="font-body text-xs text-slate-500 leading-relaxed max-w-xs">
            Elevating residential spaces through precision engineering and architectural foresight.
            The Digital Atelier for modern designers.
          </p>
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-900 mb-4 uppercase tracking-wider">Solutions</h4>
          <ul className="space-y-2">
            <li><Link to="/estimate" className="font-body text-xs text-slate-500 hover:text-primary transition-colors">Estimator Pro</Link></li>
            <li><Link to="/how-it-works" className="font-body text-xs text-slate-500 hover:text-primary transition-colors">How It Works</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-900 mb-4 uppercase tracking-wider">Company</h4>
          <ul className="space-y-2">
            <li><Link to="/about" className="font-body text-xs text-slate-500 hover:text-primary transition-colors">About Us</Link></li>
            <li><Link to="/how-it-works" className="font-body text-xs text-slate-500 hover:text-primary transition-colors">How It Works</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-900 mb-4 uppercase tracking-wider">Legal</h4>
          <ul className="space-y-2">
            <li><span className="font-body text-xs text-slate-500">Privacy Policy</span></li>
            <li><span className="font-body text-xs text-slate-500">Terms of Service</span></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-200">
        <p className="font-body text-xs text-slate-500 text-center">
          &copy; {new Date().getFullYear()} Home Interior Digital Atelier. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
