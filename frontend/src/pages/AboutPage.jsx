import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectDark } from '../store/themeSlice';
import { CheckIcon, ChevronRightIcon } from '../components/Icons';

const TEAM = [
  { name: 'Dr. Arvind Sharma', role: 'Founder & Veterinary Nutritionist', bio: '20+ years in animal nutrition. Passionate about making quality feed accessible to every farmer.', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80' },
  { name: 'Priya Gupta', role: 'Head of Operations', bio: 'Ensures every order reaches farmers fresh and on time. Logistics and quality champion.', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80' },
  { name: 'Ramkishan Patel', role: 'Farm Sourcing Expert', bio: 'Builds relationships with certified organic farms across UP, Rajasthan, and MP.', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80' },
];

const VALUES = [
  { emoji: '🐄', title: 'Gau Prem', desc: 'Deep reverence and love for cows drives every decision we make at PashuSeva.' },
  { emoji: '🌿', title: 'Purity', desc: 'Absolutely zero compromise on quality. Natural ingredients, no adulterants, ever.' },
  { emoji: '🤝', title: 'Farmer First', desc: 'Fair prices and genuine products to support India\'s hardworking farming community.' },
  { emoji: '🔬', title: 'Science-Backed', desc: 'Every product is formulated based on latest veterinary nutrition research.' },
];

const MILESTONES = [
  { year: '2018', event: 'Founded in Mathura, UP with a vision to serve gau mata.' },
  { year: '2019', event: 'Partnered with 50+ organic farms across 3 states.' },
  { year: '2021', event: 'Crossed 5,000 happy farmer families. NABL lab partnership established.' },
  { year: '2023', event: 'Launched nationwide delivery. 500+ products catalog.' },
  { year: '2024', event: 'Serving 12,000+ farmers. Expanding to 15 states.' },
];

export default function AboutPage() {
  const dark = useSelector(selectDark);
  return (
    <main className={`min-h-screen`} style={{ backgroundColor: 'var(--bg-root)' }}>
      {/* Hero */}
      <section className={`relative py-20 px-4 sm:px-6 overflow-hidden ${dark ? '' : 'bg-gradient-to-br from-leaf-50 to-white'}`} style={dark ? { backgroundColor: 'var(--bg-section)' } : {}}>
        <div className="absolute inset-0 bg-mesh pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative">
          <p className="text-leaf-600 font-semibold text-sm uppercase tracking-widest mb-4">Our Story</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-earth-900 dark:text-white mb-6">
            सेवा और समर्पण
          </h1>
          <p className="text-lg text-earth-600 dark:text-earth-300 leading-relaxed max-w-2xl mx-auto">
            Founded in 2018, PashuSeva was born from a simple belief: every cow deserves the best care. We are farmers, vets, and animal lovers dedicated to making quality cattle nutrition accessible to all.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className={`py-20 px-4 sm:px-6 page-bg`}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-leaf-600 font-semibold text-sm uppercase tracking-widest mb-3">Our Mission</p>
            <h2 className="section-title mb-6">What We Do</h2>
            <div className="flex flex-col gap-4">
              {[
                'Source cattle feed directly from certified organic farms, ensuring maximum freshness and nutrition.',
                'Rigorously test every product at NABL-accredited laboratories before it reaches your farm.',
                'Curate each product with guidance from our team of veterinary nutritionists.',
                'Educate and support thousands of farmers with expert nutrition guidance.',
                'Deliver fresh feed within 24-48 hours across India with our cold-chain network.',
              ].map((t, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-leaf-100 dark:bg-leaf-900/30 rounded-full flex items-center justify-center text-leaf-600 flex-shrink-0 mt-0.5">
                    <CheckIcon className="w-3 h-3" />
                  </div>
                  <p className="text-sm text-earth-600 dark:text-earth-300 leading-relaxed">{t}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
            <img src="https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=700&q=80" alt="Farm" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className={`py-20 px-4 sm:px-6 section-bg`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-leaf-600 font-semibold text-sm uppercase tracking-widest mb-3">What Drives Us</p>
            <h2 className="section-title">Our Core Values</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map(({ emoji, title, desc }) => (
              <div key={title} className="card p-6 text-center hover:-translate-y-1">
                <div className="text-4xl mb-4">{emoji}</div>
                <h3 className="font-bold text-earth-900 dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-earth-500 dark:text-earth-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey / Timeline */}
      <section className={`py-20 px-4 sm:px-6 page-bg`}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-leaf-600 font-semibold text-sm uppercase tracking-widest mb-3">Timeline</p>
            <h2 className="section-title">Our Journey</h2>
          </div>
          <div className="relative">
            <div className="absolute left-16 top-0 bottom-0 w-px bg-leaf-200 dark:bg-leaf-900" />
            <div className="flex flex-col gap-8">
              {MILESTONES.map(({ year, event }) => (
                <div key={year} className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-14 text-right">
                    <span className="font-display font-bold text-leaf-600 dark:text-leaf-400 text-sm">{year}</span>
                  </div>
                  <div className="relative flex-shrink-0">
                    <div className="w-4 h-4 rounded-full bg-leaf-600 border-4 border-white dark:border-earth-950 shadow" />
                  </div>
                  <p className="text-earth-600 dark:text-earth-300 text-sm leading-relaxed pt-0.5">{event}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className={`py-20 px-4 sm:px-6 section-bg`}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-leaf-600 font-semibold text-sm uppercase tracking-widest mb-3">The People</p>
            <h2 className="section-title">Meet Our Team</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {TEAM.map(({ name, role, bio, img }) => (
              <div key={name} className="card p-6 text-center hover:-translate-y-1">
                <img src={img} alt={name} className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border-4 border-leaf-100 dark:border-leaf-900/50 shadow-lg"
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80'; }} />
                <h3 className="font-bold text-earth-900 dark:text-white mb-1">{name}</h3>
                <div className="text-xs text-leaf-600 font-semibold mb-3">{role}</div>
                <p className="text-xs text-earth-500 dark:text-earth-400 leading-relaxed">{bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-br from-leaf-700 to-leaf-900 text-center">
        <h2 className="font-display text-3xl font-bold text-white mb-4">Join the PashuSeva Family</h2>
        <p className="text-leaf-200 mb-8 max-w-xl mx-auto">Be part of thousands of farmers giving their cattle the best nutrition.</p>
        <Link to="/products" className="bg-gold-500 hover:bg-gold-600 text-white font-bold px-10 py-4 rounded-xl inline-flex items-center gap-2 text-base transition-all hover:shadow-xl">
          Shop Now <ChevronRightIcon />
        </Link>
      </section>
    </main>
  );
}
