import { Link } from 'react-router-dom';
import { LeafIcon, PhoneIcon, MailIcon, MapPinIcon } from './Icons';

const CATEGORIES = ['Dry Feed', 'Green Fodder', 'Concentrate', 'Supplements', 'Silage'];

export default function Footer() {
  return (
    <footer className="text-earth-300" style={{ backgroundColor: '#1a1810' }}>
      {/* Top section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-leaf-500 to-gold-500 rounded-xl flex items-center justify-center text-white">
                <LeafIcon className="w-5 h-5" />
              </div>
              <span className="font-display font-bold text-xl text-white">PashuSeva</span>
            </div>
            <p className="text-sm text-earth-400 leading-relaxed mb-5">
              Dedicated to the nourishment and wellbeing of gau mata. Pure, authentic, and lovingly curated cattle feed products for farmers across India.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span className="badge bg-leaf-900/50 text-leaf-400 border border-leaf-800">🌿 Organic</span>
              <span className="badge bg-gold-900/50 text-gold-400 border border-gold-800">✓ Certified</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4 uppercase tracking-wider">Navigation</h4>
            <div className="flex flex-col gap-2">
              {[['Home', '/'], ['Products', '/products'], ['About Us', '/about'], ['Contact', '/contact'], ['Admin Panel', '/admin']].map(([l, p]) => (
                <Link key={p} to={p} className="text-sm text-earth-400 hover:text-leaf-400 transition-colors hover:translate-x-1 inline-block">{l}</Link>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4 uppercase tracking-wider">Categories</h4>
            <div className="flex flex-col gap-2">
              {CATEGORIES.map(c => (
                <Link key={c} to={`/products?category=${c}`} className="text-sm text-earth-400 hover:text-leaf-400 transition-colors hover:translate-x-1 inline-block">{c}</Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4 uppercase tracking-wider">Contact Us</h4>
            <div className="flex flex-col gap-3">
              {[
                { icon: <PhoneIcon className="w-4 h-4" />, text: '+91 98765 43210' },
                { icon: <MailIcon className="w-4 h-4" />, text: 'care@pashuseva.in' },
                { icon: <MapPinIcon className="w-4 h-4" />, text: 'Mathura, Uttar Pradesh 281001' },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-start gap-2.5 text-sm text-earth-400">
                  <span className="text-leaf-500 mt-0.5 flex-shrink-0">{icon}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-earth-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-earth-500 text-center sm:text-left">
            © 2024 PashuSeva. Made with ❤️ for Gau Mata Seva
          </p>
          <p className="text-xs text-earth-600 font-display italic">
            सर्वे भवन्तु सुखिनः — May all beings be happy
          </p>
        </div>
      </div>
    </footer>
  );
}
