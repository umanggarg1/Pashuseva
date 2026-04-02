import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectDark } from '../store/themeSlice';
import { submitContact } from '../utils/api';
import { toast } from '../components/Toast';
import { PhoneIcon, MailIcon, MapPinIcon, CheckIcon } from '../components/Icons';

const CONTACT_INFO = [
  { icon: PhoneIcon, label: 'Phone', value: '+91 98765 43210', sub: 'Mon-Sat, 8am - 8pm' },
  { icon: MailIcon, label: 'Email', value: 'care@pashuseva.in', sub: 'We reply within 24 hours' },
  { icon: MapPinIcon, label: 'Address', value: 'Govardhan Nagar, Mathura', sub: 'Uttar Pradesh 281001' },
];

const FAQS = [
  { q: 'How do I verify product authenticity?', a: 'Scan the QR code on every product package to view the lab test report and farm sourcing details.' },
  { q: 'What is the delivery time?', a: 'We deliver within 24-48 hours for most locations. Remote areas may take up to 72 hours.' },
  { q: 'Can I return products?', a: 'Yes, we accept returns within 3 days of delivery if the product is damaged or incorrect.' },
  { q: 'Do you offer bulk discounts?', a: 'Yes! Contact us for bulk pricing. We offer special rates for orders above ₹10,000.' },
];

export default function ContactPage() {
  const dark = useSelector(selectDark);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.message.trim()) {
      toast.error('Please fill your name and message.'); return;
    }
    setLoading(true);
    try {
      await submitContact(form);
      setSent(true);
      setForm({ name: '', email: '', phone: '', message: '' });
      toast.success('Message sent! We\'ll get back to you soon. 🙏');
    } catch {
      toast.error('Failed to send. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <main className={`min-h-screen page-bg`}>
      {/* Header */}
      <section className="py-16 px-4 sm:px-6 section-bg border-b" style={{ borderColor: 'var(--border-default)' }}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-leaf-600 font-semibold text-sm uppercase tracking-widest mb-3">Get In Touch</p>
          <h1 className="section-title mb-4">We'd Love to Hear From You</h1>
          <p className="text-earth-500 dark:text-earth-400">
            Questions about products, orders, or just want to say namaste? We're here for you! 🙏
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          {/* Left: info + FAQs */}
          <div>
            <h2 className="font-display font-bold text-xl text-earth-900 dark:text-white mb-6">Contact Information</h2>
            <div className="flex flex-col gap-4 mb-10">
              {CONTACT_INFO.map(({ icon: Icon, label, value, sub }) => (
                <div key={label} className={`card flex items-center gap-4 p-4`}>
                  <div className="w-11 h-11 bg-leaf-100 dark:bg-leaf-900/30 rounded-xl flex items-center justify-center text-leaf-600 flex-shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-earth-400 dark:text-earth-500 uppercase tracking-wide">{label}</div>
                    <div className="font-semibold text-sm text-earth-900 dark:text-white">{value}</div>
                    <div className="text-xs text-earth-400">{sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* FAQ */}
            <h2 className="font-display font-bold text-xl text-earth-900 dark:text-white mb-5">Frequently Asked</h2>
            <div className="flex flex-col gap-3">
              {FAQS.map(({ q, a }, i) => (
                <div key={i} className={`card overflow-hidden`}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-4 text-left gap-3">
                    <span className="font-semibold text-sm text-earth-900 dark:text-white">{q}</span>
                    <span className={`text-leaf-600 transition-transform flex-shrink-0 ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
                  </button>
                  {openFaq === i && (
                    <div className={`px-4 pb-4 text-sm text-earth-500 dark:text-earth-400 border-t ${dark ? 'border-earth-700' : 'border-earth-100'} pt-3`}>
                      {a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right: form */}
          <div>
            {sent ? (
              <div className={`card p-10 text-center h-full flex flex-col items-center justify-center`}>
                <div className="w-16 h-16 bg-leaf-100 dark:bg-leaf-900/30 rounded-full flex items-center justify-center mx-auto mb-5 text-leaf-600">
                  <CheckIcon className="w-8 h-8" />
                </div>
                <h3 className="font-display text-2xl font-bold text-earth-900 dark:text-white mb-2">Message Sent! 🙏</h3>
                <p className="text-earth-500 dark:text-earth-400 mb-6 text-sm">We'll get back to you within 24 hours.</p>
                <button onClick={() => setSent(false)} className="btn-outline">Send Another Message</button>
              </div>
            ) : (
              <div className="card p-6 md:p-8">
                <h2 className="font-display font-bold text-xl text-earth-900 dark:text-white mb-6">Send Us a Message</h2>
                <div className="flex flex-col gap-4">
                  {[
                    { key: 'name', label: 'Your Name *', type: 'text', placeholder: 'Ramesh Yadav' },
                    { key: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com' },
                    { key: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+91 98765 43210' },
                  ].map(({ key, label, type, placeholder }) => (
                    <div key={key}>
                      <label className="text-xs font-bold text-earth-500 dark:text-earth-400 mb-1.5 block">{label}</label>
                      <input type={type} placeholder={placeholder} value={form[key]} onChange={e => set(key, e.target.value)}
                        className="input-field" />
                    </div>
                  ))}
                  <div>
                    <label className="text-xs font-bold text-earth-500 dark:text-earth-400 mb-1.5 block">Message *</label>
                    <textarea rows={5} placeholder="How can we help you today?" value={form.message} onChange={e => set('message', e.target.value)}
                      className="input-field resize-none" />
                  </div>
                  <button onClick={handleSubmit} disabled={loading}
                    className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                    {loading ? (
                      <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending...</>
                    ) : 'Send Message 🙏'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
