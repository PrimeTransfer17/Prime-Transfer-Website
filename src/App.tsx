import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  MapPin, Calendar, Clock, Users, Search, Plane, 
  Building, Star, ShieldCheck, Clock3, CreditCard, 
  Phone, Mail, ChevronRight, CheckCircle2, Menu, X,
  ArrowRight, Globe
} from 'lucide-react';
import { content, Language } from './content';

const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number, key?: React.Key }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.5, delay, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lang, setLang] = useState<Language>('bg');
  const t = content[lang];

  return (
    <div className="min-h-screen bg-bg text-text-primary selection:bg-accent/30 selection:text-white flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-bg/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded flex items-center justify-center">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading font-bold text-xl tracking-tight">Prime Transfers</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-text-secondary">
            <a href="#services" className="hover:text-text-primary transition-colors">{t.nav.services}</a>
            <a href="#fleet" className="hover:text-text-primary transition-colors">{t.nav.fleet}</a>
            <a href="#about" className="hover:text-text-primary transition-colors">{t.nav.about}</a>
            <a href="#contact" className="hover:text-text-primary transition-colors">{t.nav.contact}</a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={() => setLang(lang === 'bg' ? 'en' : 'bg')}
              className="flex items-center gap-1 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              <Globe className="w-4 h-4" />
              {lang.toUpperCase()}
            </button>
            <button className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
              {t.nav.login}
            </button>
            <button className="bg-accent hover:bg-accent-hover text-white px-5 py-2.5 rounded-md text-sm font-semibold transition-all duration-200 hover:-translate-y-[2px] shadow-[0_4px_14px_0_rgba(255,90,0,0.2)]">
              {t.nav.signup}
            </button>
          </div>

          <button 
            className="md:hidden text-text-secondary hover:text-text-primary"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-bg pt-24 px-6 md:hidden">
          <div className="flex flex-col gap-6 text-lg font-medium">
            <a href="#services" onClick={() => setIsMenuOpen(false)}>{t.nav.services}</a>
            <a href="#fleet" onClick={() => setIsMenuOpen(false)}>{t.nav.fleet}</a>
            <a href="#about" onClick={() => setIsMenuOpen(false)}>{t.nav.about}</a>
            <a href="#contact" onClick={() => setIsMenuOpen(false)}>{t.nav.contact}</a>
            <button 
              onClick={() => { setLang(lang === 'bg' ? 'en' : 'bg'); setIsMenuOpen(false); }}
              className="flex items-center gap-2 text-left"
            >
              <Globe className="w-5 h-5" />
              {lang === 'bg' ? 'English' : 'Български'}
            </button>
            <hr className="border-border my-4" />
            <button className="bg-accent text-white py-3 rounded-md font-semibold">{t.nav.signup}</button>
          </div>
        </div>
      )}

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1617531653332-bd46c24f2068?q=80&w=2115&auto=format&fit=crop" 
              alt="Luxury dark car" 
              className="w-full h-full object-cover opacity-20"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-bg/40 via-bg/80 to-bg"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border-subtle text-xs font-medium text-text-secondary mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
              {t.hero.badge}
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold font-heading tracking-tight max-w-4xl leading-[1.1]"
            >
              {t.hero.title.split(' ').slice(0, lang === 'bg' ? 2 : 3).join(' ')} <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-text-secondary">
                {t.hero.title.split(' ').slice(lang === 'bg' ? 2 : 3).join(' ')}
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg md:text-xl text-text-secondary max-w-2xl"
            >
              {t.hero.subtitle}
            </motion.p>

            {/* Booking Form */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="w-full max-w-5xl mt-12 bg-surface p-2 rounded-xl border-subtle shadow-2xl"
            >
              <div className="flex flex-col lg:flex-row gap-2">
                <div className="flex-1 flex flex-col md:flex-row gap-2">
                  <div className="flex-1 relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                      <MapPin className="w-5 h-5 text-text-secondary group-focus-within:text-accent transition-colors" />
                    </div>
                    <input 
                      type="text" 
                      placeholder={t.booking.pickup} 
                      className="w-full h-14 pl-12 pr-4 bg-bg border-subtle rounded-lg text-sm focus:outline-none input-glow transition-all"
                    />
                  </div>
                  <div className="flex-1 relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                      <MapPin className="w-5 h-5 text-text-secondary group-focus-within:text-accent transition-colors" />
                    </div>
                    <input 
                      type="text" 
                      placeholder={t.booking.dropoff} 
                      className="w-full h-14 pl-12 pr-4 bg-bg border-subtle rounded-lg text-sm focus:outline-none input-glow transition-all"
                    />
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-2 lg:w-[400px]">
                  <div className="flex-1 relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                      <Calendar className="w-5 h-5 text-text-secondary group-focus-within:text-accent transition-colors" />
                    </div>
                    <input 
                      type="date" 
                      className="w-full h-14 pl-12 pr-4 bg-bg border-subtle rounded-lg text-sm focus:outline-none input-glow transition-all text-text-primary [color-scheme:dark]"
                    />
                  </div>
                  <div className="flex-1 relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                      <Clock className="w-5 h-5 text-text-secondary group-focus-within:text-accent transition-colors" />
                    </div>
                    <input 
                      type="time" 
                      className="w-full h-14 pl-12 pr-4 bg-bg border-subtle rounded-lg text-sm focus:outline-none input-glow transition-all text-text-primary [color-scheme:dark]"
                    />
                  </div>
                </div>

                <button className="h-14 px-8 bg-accent hover:bg-accent-hover text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-[2px] shadow-[0_4px_14px_0_rgba(255,90,0,0.2)] lg:w-auto w-full">
                  <Search className="w-5 h-5" />
                  <span>{t.booking.search}</span>
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="py-10 border-y border-border bg-bg">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-text-secondary text-sm font-medium">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" />
                <span>{t.advantages.items[2]}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock3 className="w-5 h-5" />
                <span>{t.advantages.items[4]}</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                <span>{t.advantages.items[0]}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-24 px-6 bg-bg">
          <div className="max-w-7xl mx-auto">
            <FadeIn>
              <div className="mb-16">
                <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">{t.services.title}</h2>
                <p className="text-text-secondary text-lg max-w-2xl">{t.hero.intro}</p>
              </div>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Plane, ...t.services.items[0] },
                { icon: Building, ...t.services.items[1] },
                { icon: MapPin, ...t.services.items[2] },
                { icon: Star, ...t.services.items[3] },
                { icon: Users, ...t.services.items[4] },
                { icon: Clock, ...t.services.items[5] }
              ].map((service, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                  <div className="group p-8 rounded-2xl bg-surface border-subtle hover:border-border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50 h-full flex flex-col">
                    <div className="w-12 h-12 rounded-lg bg-bg border-subtle flex items-center justify-center mb-6 group-hover:bg-accent/10 group-hover:border-accent/20 group-hover:text-accent transition-colors">
                      <service.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold font-heading mb-3">{service.title}</h3>
                    <p className="text-text-secondary leading-relaxed flex-1">{service.desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Fleet Showcase */}
        <section id="fleet" className="py-24 px-6 bg-surface border-y border-border overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <FadeIn>
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">{t.fleet.title}</h2>
                  <p className="text-text-secondary text-lg max-w-2xl">{t.fleet.desc}</p>
                </div>
              </div>
            </FadeIn>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {[
                {
                  ...t.fleet.items[0],
                  passengers: 3,
                  luggage: 2,
                  img: "https://drive.google.com/thumbnail?id=1PBQujGh4PkdQaj7JKaAmRqyxlpP7ery2&sz=w1000"
                },
                {
                  ...t.fleet.items[2],
                  passengers: 3,
                  luggage: 2,
                  img: "https://drive.google.com/thumbnail?id=1m9xm596BVDoVwNZiZckG_2dZ21kq50ef&sz=w1000"
                },
                {
                  ...t.fleet.items[1],
                  passengers: 7,
                  luggage: 7,
                  img: "https://drive.google.com/thumbnail?id=1Bhr6mCMwu1WRN2COW9T6-wp4i8ComRiu&sz=w1000"
                }
              ].map((vehicle, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                  <div className="rounded-2xl bg-bg border-subtle overflow-hidden group">
                    <div className="h-48 overflow-hidden relative">
                      <div className="absolute inset-0 bg-bg/20 group-hover:bg-transparent transition-colors z-10"></div>
                      <img 
                        src={vehicle.img} 
                        alt={vehicle.class} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold font-heading mb-1">{vehicle.class}</h3>
                      <p className="text-sm text-text-secondary mb-6 h-10">{vehicle.desc}</p>
                      
                      <div className="flex items-center gap-6 text-sm text-text-secondary pt-6 border-t border-border">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>Max {vehicle.passengers}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="4" y="8" width="16" height="12" rx="2" ry="2"></rect>
                            <path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                          <span>Max {vehicle.luggage}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section id="about" className="py-24 px-6 bg-bg">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <FadeIn>
                <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6">{t.about.whoWeAreTitle}</h2>
                <p className="text-text-secondary text-lg mb-8 leading-relaxed">
                  {t.about.whoWeAre}
                </p>
                
                <div className="space-y-6">
                  {t.booking.includes.slice(0, 3).map((feature, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="mt-1">
                        <CheckCircle2 className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg mb-1">{feature}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </FadeIn>
              
              <FadeIn delay={0.2}>
                <div className="relative rounded-2xl overflow-hidden border-subtle">
                  <img 
                    src="https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=2070&auto=format&fit=crop" 
                    alt="Chauffeur opening door" 
                    className="w-full h-auto object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent"></div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6 bg-surface border-y border-border relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <FadeIn>
              <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6">{t.booking.title}</h2>
              <p className="text-xl text-text-secondary mb-10">{t.booking.desc}</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button className="bg-accent hover:bg-accent-hover text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:-translate-y-[2px] shadow-[0_4px_14px_0_rgba(255,90,0,0.2)]">
                  {t.booking.search}
                </button>
              </div>
            </FadeIn>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="contact" className="bg-bg pt-20 pb-10 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-accent rounded flex items-center justify-center">
                  <Plane className="w-5 h-5 text-white" />
                </div>
                <span className="font-heading font-bold text-xl tracking-tight">Prime Transfers</span>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed mb-6">
                {t.about.mission}
              </p>
              <div className="flex gap-4">
                {/* Social placeholders */}
                <div className="w-10 h-10 rounded-full bg-surface border-subtle flex items-center justify-center hover:border-accent hover:text-accent transition-colors cursor-pointer">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </div>
                <div className="w-10 h-10 rounded-full bg-surface border-subtle flex items-center justify-center hover:border-accent hover:text-accent transition-colors cursor-pointer">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-6">{t.contact.company}</h4>
              <ul className="space-y-3 text-sm text-text-secondary">
                <li><a href="#" className="hover:text-accent transition-colors">{t.nav.about}</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">{t.nav.fleet}</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">{t.nav.services}</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">{t.nav.reviews}</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">{t.nav.faq}</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-6">{t.contact.title}</h4>
              <ul className="space-y-4 text-sm text-text-secondary">
                <li className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-text-primary shrink-0" />
                  <span>+44 20 7123 4567<br/><span className="text-xs opacity-70">{t.contact.workingHoursValue} {t.contact.workingHours}</span></span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-text-primary shrink-0" />
                  <span>bookings@primetransfers.com</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-text-secondary">
            <p>&copy; {new Date().getFullYear()} Prime Transfers. {t.contact.rights}</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-text-primary transition-colors">{t.contact.terms}</a>
              <a href="#" className="hover:text-text-primary transition-colors">{t.contact.privacy}</a>
              <a href="#" className="hover:text-text-primary transition-colors">{t.contact.imprint}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
