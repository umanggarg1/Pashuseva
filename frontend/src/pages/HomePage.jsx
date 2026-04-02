import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectDark } from '../store/themeSlice';
import { getProducts } from '../utils/api';
import ProductCard from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/Loaders';
import {
  ShieldIcon, TruckIcon, AwardIcon, NatureIcon,
  ChevronRightIcon, LeafIcon, CheckIcon
} from '../components/Icons';

const FEATURES = [
  { icon: ShieldIcon, title: '100% Authentic', desc: 'All products are lab-tested and certified for purity and nutritional value by NABL-accredited labs.', color: 'leaf' },
  { icon: NatureIcon, title: 'Natural & Organic', desc: 'Sourced from certified organic farms. No artificial additives, preservatives, or chemicals ever.', color: 'green' },
  { icon: TruckIcon, title: 'Fast Delivery', desc: 'Fresh fodder and supplements delivered to your doorstep within 24-48 hours across India.', color: 'gold' },
  { icon: AwardIcon, title: 'Expert Curated', desc: 'Each product is handpicked and recommended by our certified veterinary nutritionists.', color: 'amber' },
];

const TESTIMONIALS = [
  { name: 'Ramesh Yadav', place: 'Varanasi, UP', text: 'My cow\'s milk production increased by 20% after switching to PashuSeva concentrate. Truly amazing quality!', rating: 5, img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80' },
  { name: 'Sunita Devi', place: 'Mathura, UP', text: 'The mineral lick blocks are excellent. My cows are healthier and our vet bills have reduced drastically.', rating: 5, img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80' },
  { name: 'Mohan Patel', place: 'Jaipur, Rajasthan', text: 'Fast delivery and fresh fodder every time. PashuSeva is my one-stop shop for all cattle feed needs.', rating: 5, img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80' },
];

const STATS = [
  { value: '12,000+', label: 'Happy Farmers' },
  { value: '500+', label: 'Products' },
  { value: '100%', label: 'Natural' },
  { value: '48hr', label: 'Delivery' },
];

function HeroSection() {
  const dark = useSelector(selectDark);
  return (
    <section className={`relative overflow-hidden ${dark ? '' : 'bg-gradient-to-br from-leaf-50 via-white to-gold-50'}`} style={dark ? { backgroundColor: 'var(--bg-page)' } : {}}>
      {/* Background decoration */}
      <div className="absolute inset-0 bg-mesh pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-leaf-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold-400/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 bg-leaf-100 dark:bg-leaf-900/30 text-leaf-700 dark:text-leaf-400 text-xs font-bold px-4 py-2 rounded-full mb-6 border border-leaf-200 dark:border-leaf-800">
              <LeafIcon className="w-3.5 h-3.5" />
              <span>गाय माता की सेवा — Our Sacred Mission</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-earth-900 dark:text-white">
              Pure Nutrition<br />
              <span className="text-gradient">for Gau Mata</span>
            </h1>

            <p className="text-lg text-earth-600 dark:text-earth-300 mb-8 leading-relaxed max-w-lg">
              PashuSeva brings you India's finest quality cattle feed, supplements, and fresh fodder — handpicked with love and verified by veterinary experts.
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <Link to="/products" className="btn-primary text-base px-8 py-3.5 flex items-center gap-2">
                Shop Now <ChevronRightIcon />
              </Link>
              <Link to="/about" className="btn-outline text-base px-8 py-3.5">
                Our Story
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-3">
              {['NABL Certified', 'Vet Approved', 'Farm Fresh', 'Organic'].map(b => (
                <span key={b} className="flex items-center gap-1.5 text-xs font-semibold text-earth-600 dark:text-earth-400">
                  <CheckIcon className="w-3.5 h-3.5 text-leaf-600" />{b}
                </span>
              ))}
            </div>
          </div>

          {/* Right - Hero image */}
          <div className="relative hidden md:block animate-fade-in">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-leaf-900/20 aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1527153818091-1a9638521e2a?w=700&q=80"
                alt="Healthy cow"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-earth-900/30 to-transparent" />
            </div>

            {/* Floating cards */}
            <div className="absolute -bottom-5 -left-5 bg-white dark:bg-earth-800 rounded-2xl shadow-xl p-4 flex items-center gap-3 border border-earth-100 dark:border-earth-700">
              <div className="w-10 h-10 bg-gold-100 dark:bg-gold-900/30 rounded-xl flex items-center justify-center">
                <AwardIcon className="w-5 h-5 text-gold-600" />
              </div>
              <div>
                <div className="font-bold text-sm text-earth-900 dark:text-white">Vet Certified</div>
                <div className="text-xs text-earth-500">All products approved</div>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 bg-white dark:bg-earth-800 rounded-2xl shadow-xl px-4 py-3 border border-earth-100 dark:border-earth-700">
              <div className="text-2xl font-display font-bold text-leaf-600">12K+</div>
              <div className="text-xs text-earth-500">Happy Farmers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className={`border-t ${dark ? '' : 'border-earth-100 bg-white/60'} backdrop-blur-sm`} style={dark ? { borderColor: 'var(--border-default)', backgroundColor: 'var(--bg-section)' } : {}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="font-display text-2xl md:text-3xl font-bold text-gold-600 dark:text-gold-400">{value}</div>
                <div className="text-xs text-earth-500 dark:text-earth-400 mt-1 font-medium">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const dark = useSelector(selectDark);
  return (
    <section className={`py-20 px-4 sm:px-6 section-bg`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-leaf-600 font-semibold text-sm uppercase tracking-widest mb-3">Why Choose Us</p>
          <h2 className="section-title mb-4">The PashuSeva Promise</h2>
          <p className="text-earth-500 dark:text-earth-400 max-w-xl mx-auto">
            We believe every cow deserves the best nutrition. Pure, authentic, and delivered with care.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className={`card p-6 text-center hover:-translate-y-1 cursor-default group`}>
              <div className={`w-14 h-14 mx-auto mb-5 rounded-2xl flex items-center justify-center bg-leaf-50 dark:bg-leaf-900/20 text-leaf-600 dark:text-leaf-400 group-hover:scale-110 transition-transform`}>
                <Icon className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-earth-900 dark:text-white mb-2">{title}</h3>
              <p className="text-sm text-earth-500 dark:text-earth-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AuthenticitySection() {
  const dark = useSelector(selectDark);
  const steps = [
    { num: '01', title: 'Farm Sourcing', desc: 'Directly from certified organic farms with full traceability.' },
    { num: '02', title: 'Lab Testing', desc: 'NABL-accredited lab tests for purity and nutritional content.' },
    { num: '03', title: 'QR Verification', desc: 'Each pack has a unique QR code to verify authenticity.' },
    { num: '04', title: 'Doorstep Delivery', desc: 'Packed hygienically and delivered fresh to your farm.' },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 bg-gradient-to-br from-leaf-700 to-leaf-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-40 h-40 border-2 border-white rounded-full" />
        <div className="absolute bottom-10 right-10 w-64 h-64 border border-white rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-14">
          <p className="text-leaf-300 font-semibold text-sm uppercase tracking-widest mb-3">Our Process</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">Product Authenticity Guarantee</h2>
          <p className="text-leaf-200 max-w-2xl mx-auto">
            From farm to feed, every step is monitored and certified. We are committed to delivering only what's best for your beloved gau mata.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map(({ num, title, desc }) => (
            <div key={num} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all">
              <div className="font-display text-4xl font-bold text-gold-400 mb-3">{num}</div>
              <h3 className="font-bold text-white mb-2">{title}</h3>
              <p className="text-sm text-leaf-200">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-4 bg-white/10 border border-white/20 rounded-2xl px-8 py-4">
            <div className="text-center">
              <div className="font-display text-3xl font-bold text-gold-400">100%</div>
              <div className="text-xs text-leaf-300">Verified & Certified</div>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div className="text-sm text-leaf-100 max-w-xs text-left">
              Scan the QR code on every package to verify its authenticity and nutritional report.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturedProducts() {
  const dark = useSelector(selectDark);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts({ featured: true, limit: 4 })
      .then(res => setProducts(res.data.products))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className={`py-20 px-4 sm:px-6 page-bg`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-leaf-600 font-semibold text-sm uppercase tracking-widest mb-2">Hand-picked</p>
            <h2 className="section-title">Featured Products</h2>
            <p className="text-earth-500 dark:text-earth-400 mt-2 text-sm">Bestsellers loved by thousands of farmers</p>
          </div>
          <Link to="/products" className="btn-outline flex items-center gap-2 self-start sm:self-auto whitespace-nowrap">
            View All <ChevronRightIcon />
          </Link>
        </div>

        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const dark = useSelector(selectDark);
  return (
    <section className={`py-20 px-4 sm:px-6 section-bg`}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-leaf-600 font-semibold text-sm uppercase tracking-widest mb-3">Testimonials</p>
          <h2 className="section-title mb-4">Farmers Trust Us</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {TESTIMONIALS.map(({ name, place, text, rating, img }) => (
            <div key={name} className={`card p-6 hover:-translate-y-1`}>
              <div className="flex text-gold-400 mb-4">
                {Array.from({ length: rating }).map((_, i) => (
                  <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                ))}
              </div>
              <p className="text-sm text-earth-600 dark:text-earth-300 italic mb-5 leading-relaxed">"{text}"</p>
              <div className="flex items-center gap-3">
                <img src={img} alt={name} className="w-10 h-10 rounded-full object-cover border-2 border-leaf-200"
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80'; }} />
                <div>
                  <div className="font-bold text-sm text-earth-900 dark:text-white">{name}</div>
                  <div className="text-xs text-leaf-600">{place}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  const dark = useSelector(selectDark);
  return (
    <section className={`py-20 px-4 sm:px-6 ${dark ? '' : 'bg-gradient-to-br from-gold-50 to-leaf-50'}`} style={dark ? { backgroundColor: 'var(--bg-page)' } : {}}>
      <div className="max-w-3xl mx-auto text-center">
        <div className="text-5xl mb-6">🐄</div>
        <h2 className="section-title mb-4">Ready to nourish your gau mata?</h2>
        <p className="text-earth-500 dark:text-earth-400 mb-8 text-lg">
          Explore 500+ authentic cattle feed products. Delivered fresh to your farm.
        </p>
        <Link to="/products" className="btn-secondary text-lg px-10 py-4 inline-flex items-center gap-2">
          Browse All Products <ChevronRightIcon />
        </Link>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <AuthenticitySection />
      <FeaturedProducts />
      <TestimonialsSection />
      <CtaSection />
    </main>
  );
}
