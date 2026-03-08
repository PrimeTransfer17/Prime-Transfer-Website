import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin, Calendar, Clock, Users, Search, Plane,
  Building, Star, ShieldCheck, Clock3, CreditCard,
  Phone, Mail, ChevronRight, CheckCircle2, Menu, X,
  ArrowRight, Globe, Instagram, MessageCircle
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { content, Language } from './content';
import { estimateDistance, estimateDistanceFromCoords, computeVehicleResults, DistanceResult, VehicleResult } from './lib/distance';
import { LocationAutocomplete, LocationSuggestion } from './components/ui/location-autocomplete';
import { GlowingEffect } from './components/ui/glowing-effect';
import { LocationMap } from './components/ui/expand-map';
import { GlassCalendar } from './components/ui/glass-calendar';
import { GlassTimePicker } from './components/ui/glass-time-picker';
import { format, parseISO } from 'date-fns';

// Safe Supabase Configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Only initialize if keys are present to prevent app crash
const supabase = (supabaseUrl && supabaseAnonKey && supabaseUrl !== 'YOUR_SUPABASE_URL')
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (!supabase) {
  console.warn('Supabase is not configured. Form submissions will operate in demo mode.');
}

const FadeIn = ({ children, delay = 0, className }: { children: React.ReactNode, delay?: number, key?: React.Key, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.5, delay, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

// --- Top-level view components (must be outside App to avoid remount on every render) ---

// --- Top-level view components (must be outside App to avoid remount on every render) ---



type SearchResultsProps = {
  lang: Language;
  onBack: () => void;
  onBook: (vehicle: VehicleResult) => void;
  distanceResult: DistanceResult | null;
  isCalculating: boolean;
  results: VehicleResult[];
  isReturn: boolean;
  returnDate: string;
};

const SearchResults = React.memo(({ lang, onBack, onBook, distanceResult, isCalculating, results, isReturn, returnDate }: SearchResultsProps) => (
  <div className="max-w-7xl mx-auto px-6 pt-[104px] pb-20">
    {/* Header */}
    <div className="flex items-center gap-4 mb-6">
      <button onClick={onBack} aria-label={lang === 'bg' ? 'Назад' : 'Go back'} className="p-2 hover:bg-surface rounded-full transition-colors">
        <X className="w-6 h-6" aria-hidden="true" />
      </button>
      <div>
        <h2 className="text-3xl font-bold font-heading">
          {lang === 'bg' ? 'Налични трансфери' : 'Available Transfers'}
        </h2>
      </div>
    </div>

    {/* Route Summary Banner */}
    {isCalculating ? (
      <div className="mb-8 p-4 rounded-xl bg-surface border-subtle flex items-center gap-3 animate-pulse">
        <div className="w-5 h-5 rounded-full bg-accent/30"></div>
        <div className="h-4 bg-accent/20 rounded w-64"></div>
      </div>
    ) : distanceResult ? (
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 p-4 rounded-xl bg-surface border-subtle flex flex-wrap items-center gap-3 text-sm"
      >
        <MapPin className="w-4 h-4 text-accent shrink-0" />
        <span className="font-medium text-text-primary truncate max-w-[200px]">{distanceResult.pickupDisplay}</span>
        <ArrowRight className="w-4 h-4 text-text-secondary shrink-0" />
        <span className="font-medium text-text-primary truncate max-w-[200px]">{distanceResult.dropoffDisplay}</span>
        {isReturn && (
          <>
            <ArrowRight className="w-4 h-4 text-text-secondary shrink-0" />
            <span className="font-medium text-text-primary truncate max-w-[200px]">{distanceResult.pickupDisplay}</span>
          </>
        )}
        <span className="ml-auto text-text-secondary whitespace-nowrap">
          ~{isReturn ? distanceResult.distanceKm * 2 : distanceResult.distanceKm} km
          &nbsp;·&nbsp;
          <span className="text-accent font-semibold">{lang === 'bg' ? 'приблизително разстояние' : 'estimated distance'}</span>
        </span>
      </motion.div>
    ) : (
      <div className="mb-8 p-4 rounded-xl bg-surface border-subtle flex items-center gap-3 text-sm text-text-secondary">
        <MapPin className="w-4 h-4 text-accent shrink-0" />
        <span>{lang === 'bg' ? 'Не успяхме да изчислим разстоянието. Моля, свържете се с нас за точна цена.' : 'Could not estimate distance. Please contact us directly for an exact quote.'}</span>
      </div>
    )}

    {/* Vehicle Cards */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {results.map((result, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.35, delay: i * 0.08, ease: 'easeOut' }}
          className="rounded-2xl bg-surface border-subtle overflow-hidden relative group hover:border-accent transition-colors duration-200 flex flex-col cursor-pointer"
          onClick={() => onBook(result)}
        >
          <div className="h-48 overflow-hidden relative">
            <div className="absolute inset-0 bg-bg/20 group-hover:bg-transparent transition-colors z-10 pointer-events-none"></div>
            <img
              src={result.img}
              alt={result.type}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="p-6 flex flex-col flex-1">
            <h3 className="text-xl font-bold font-heading mb-4">{result.type}</h3>

            <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary mb-6">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" aria-hidden="true" />
                <span>Max {result.passengers}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="4" y="8" width="16" height="12" rx="2" ry="2"></rect>
                  <path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
                <span>Max {result.luggage}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 10h18M3 10V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3M3 10l2 9h14l2-9" />
                </svg>
                <span>{result.trunk}L</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-text-secondary mb-4">
              <span className="px-2 py-0.5 rounded-full bg-bg border border-border">
                €{result.ratePerKm.toFixed(2)}/km
              </span>
              {distanceResult && (
                <span>
                  &times; {isReturn ? result.distanceKm * 2 : result.distanceKm} km
                  {isReturn ? ` (${result.distanceKm} km \u00d72)` : ''}
                </span>
              )}
            </div>

            <div className="flex justify-between items-center mt-auto pt-6 border-t border-border mb-6">
              <div className="flex items-center gap-2 text-text-secondary text-sm">
                <span className="text-xs">{lang === 'bg' ? 'Фикс. цена' : 'Fixed price'}</span>
              </div>
              {isCalculating ? (
                <div className="h-8 w-20 bg-accent/20 rounded animate-pulse"></div>
              ) : (
                <div className="text-right">
                  {result.originalPrice && (
                    <div className="text-xs text-text-secondary line-through">{result.originalPrice}</div>
                  )}
                  <span className="text-2xl font-bold text-accent">{result.price}</span>
                </div>
              )}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onBook(result);
              }}
              className="w-full py-3 bg-bg border border-border rounded-lg font-semibold group-hover:bg-accent group-hover:text-white group-hover:border-accent transition-all duration-200"
            >
              {lang === 'bg' ? 'Резервирай' : 'Book Now'}
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
));

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lang, setLang] = useState<Language>('bg');
  const [isReturn, setIsReturn] = useState(false);
  const [passengers, setPassengers] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [view, setView] = useState<'home' | 'search-results'>('home');

  // Booking details flow
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleResult | null>(null);
  const [isBookingDetailsOpen, setIsBookingDetailsOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bookingEmail, setBookingEmail] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);

  // Form Field States
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [returnTime, setReturnTime] = useState('');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [isReturnCalendarOpen, setIsReturnCalendarOpen] = useState(false);
  const [isReturnTimePickerOpen, setIsReturnTimePickerOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const timePickerRef = useRef<HTMLDivElement>(null);
  const returnCalendarRef = useRef<HTMLDivElement>(null);
  const returnTimePickerRef = useRef<HTMLDivElement>(null);

  // Validated location coords from autocomplete
  const [pickupCoords, setPickupCoords] = useState<LocationSuggestion | null>(null);
  const [dropoffCoords, setDropoffCoords] = useState<LocationSuggestion | null>(null);

  // Distance & pricing state
  const [distanceResult, setDistanceResult] = useState<DistanceResult | null>(null);
  const [isCalculatingDistance, setIsCalculatingDistance] = useState(false);
  const [vehicleResults, setVehicleResults] = useState<VehicleResult[]>(() => computeVehicleResults(50)); // default 50km placeholder

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
      if (timePickerRef.current && !timePickerRef.current.contains(event.target as Node)) {
        setIsTimePickerOpen(false);
      }
      if (returnCalendarRef.current && !returnCalendarRef.current.contains(event.target as Node)) {
        setIsReturnCalendarOpen(false);
      }
      if (returnTimePickerRef.current && !returnTimePickerRef.current.contains(event.target as Node)) {
        setIsReturnTimePickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const t = content[lang];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    // Block submit if addresses haven't been validated via autocomplete
    if (!pickupCoords || !dropoffCoords) return;

    setIsSearching(true);
    setIsCalculatingDistance(true);
    setDistanceResult(null);

    // Navigate to results immediately
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsSearching(false);
    setView('search-results');
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Fast path: we already have coords from the autocomplete selection
    try {
      const result = estimateDistanceFromCoords(
        pickupCoords.lat, pickupCoords.lon, pickupCoords.displayName,
        dropoffCoords.lat, dropoffCoords.lon, dropoffCoords.displayName
      );
      setDistanceResult(result);
      setVehicleResults(computeVehicleResults(result.distanceKm, isReturn));
    } catch {
      // Fallback: try geocoding by text
      try {
        const result = await estimateDistance(pickup, dropoff);
        if (result) {
          setDistanceResult(result);
          setVehicleResults(computeVehicleResults(result.distanceKm, isReturn));
        } else {
          setVehicleResults(computeVehicleResults(50));
        }
      } catch {
        setVehicleResults(computeVehicleResults(50));
      }
    } finally {
      setIsCalculatingDistance(false);
    }
  };

  const handleGoHome = useCallback(() => setView('home'), []);
  const handleOpenBooking = useCallback((vehicle: VehicleResult) => {
    setSelectedVehicle(vehicle);
    setIsBookingDetailsOpen(true);
  }, []);

  const scrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setView('home');
    setIsMenuOpen(false);
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  };


  return (
    <div className="min-h-screen bg-bg text-text-primary selection:bg-accent/30 selection:text-white flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-bg/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative">
          <div
            className="flex items-center gap-2 cursor-pointer"
            role="banner"
            aria-label="Prime Transfers Logo"
            onClick={(e) => scrollToSection(e, 'top')}
          >
            <img
              src="/logo.png"
              alt="Prime Transfers"
              className="h-16 w-auto object-contain -ml-[1.5rem] md:-ml-2 scale-[2.5] origin-left"
            />
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-text-secondary absolute left-1/2 -translate-x-1/2">
            <a href="#services" onClick={(e) => scrollToSection(e, 'services')} className="hover:text-text-primary transition-colors">{t.nav.services}</a>
            <a href="#fleet" onClick={(e) => scrollToSection(e, 'fleet')} className="hover:text-text-primary transition-colors">{t.nav.fleet}</a>
            <a href="#about" onClick={(e) => scrollToSection(e, 'about')} className="hover:text-text-primary transition-colors">{t.nav.about}</a>
            <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className="hover:text-text-primary transition-colors">{t.nav.contact}</a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => setLang(lang === 'bg' ? 'en' : 'bg')}
              className="flex items-center gap-1 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
              aria-label={lang === 'bg' ? "Switch to English" : "Превключи на Български"}
            >
              <Globe className="w-4 h-4" aria-hidden="true" />
              {lang.toUpperCase()}
            </button>
          </div>

          <button
            className="md:hidden text-text-secondary hover:text-text-primary"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-bg pt-24 px-6 md:hidden">
          <div className="flex flex-col gap-6 text-lg font-medium">
            <a href="#services" onClick={(e) => scrollToSection(e, 'services')}>{t.nav.services}</a>
            <a href="#fleet" onClick={(e) => scrollToSection(e, 'fleet')}>{t.nav.fleet}</a>
            <a href="#about" onClick={(e) => scrollToSection(e, 'about')}>{t.nav.about}</a>
            <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')}>{t.nav.contact}</a>
            <button
              onClick={() => { setLang(lang === 'bg' ? 'en' : 'bg'); setIsMenuOpen(false); }}
              className="flex items-center gap-2 text-left"
            >
              <Globe className="w-5 h-5" />
              {lang === 'bg' ? 'English' : 'Български'}
            </button>
          </div>
        </div>
      )}

      <main className="flex-1">
        {view === 'home' && (
          <>
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-visible">
              <div className="absolute inset-0 z-0">
                <img
                  src="/hero-car.jpg"
                  alt="Luxury dark car"
                  className="w-full h-full object-cover opacity-20"
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
                  animate={{ opacity: 1, y: 0, maxWidth: isReturn ? '80rem' : '64rem' }}
                  transition={{ opacity: { duration: 0.6, delay: 0.3 }, y: { duration: 0.6, delay: 0.3 }, maxWidth: { duration: 0.35, ease: 'easeInOut' } }}
                  className="w-full mt-12 bg-surface p-2 rounded-xl border-subtle shadow-2xl"
                >
                  <form onSubmit={handleSearch} className="flex flex-col gap-4 p-2">
                    {/* Trip Type Toggle */}
                    <div className="flex gap-2 p-1 bg-bg/50 rounded-lg w-fit self-start mb-2">
                      <button
                        type="button"
                        onClick={() => setIsReturn(false)}
                        className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${!isReturn ? 'bg-accent text-white shadow-lg' : 'text-text-secondary hover:text-text-primary'}`}
                      >
                        {lang === 'bg' ? 'Еднопосочен' : 'One Way'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsReturn(true)}
                        className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${isReturn ? 'bg-accent text-white shadow-lg' : 'text-text-secondary hover:text-text-primary'}`}
                      >
                        {lang === 'bg' ? 'Двупосочен' : 'Return Trip'}
                      </button>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-2">
                      <div className="flex-[2] flex flex-col md:flex-row gap-2">
                        <LocationAutocomplete
                          id="pickup-input"
                          placeholder={t.booking.pickup}
                          value={pickup}
                          onChange={(val) => { setPickup(val); if (!val) setPickupCoords(null); }}
                          onSelect={(s) => {
                            if (s.lat === 0 && s.lon === 0) { setPickupCoords(null); }
                            else { setPickupCoords(s); setPickup(s.shortName); }
                          }}
                          isSelected={!!pickupCoords}
                        />
                        <LocationAutocomplete
                          id="dropoff-input"
                          placeholder={t.booking.dropoff}
                          value={dropoff}
                          onChange={(val) => { setDropoff(val); if (!val) setDropoffCoords(null); }}
                          onSelect={(s) => {
                            if (s.lat === 0 && s.lon === 0) { setDropoffCoords(null); }
                            else { setDropoffCoords(s); setDropoff(s.shortName); }
                          }}
                          isSelected={!!dropoffCoords}
                        />
                      </div>

                      <div className="flex flex-col md:flex-row gap-2 lg:flex-1">
                        <div className="flex-1 relative group" ref={calendarRef}>
                          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
                            <Calendar className="w-5 h-5 text-text-secondary group-focus-within:text-accent transition-colors" aria-hidden="true" />
                          </div>
                          <button
                            type="button"
                            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                            className={`w-full h-14 pl-12 pr-4 bg-bg border-subtle border rounded-lg text-sm focus:outline-none transition-all text-left flex items-center ${date ? 'text-text-primary' : 'text-text-secondary/80'} ${isCalendarOpen ? 'border-accent shadow-[0_0_15px_rgba(255,90,0,0.15)] ring-1 ring-accent' : ''}`}
                          >
                            <span className="truncate">{date ? format(parseISO(date), 'MMM d, yyyy') : (lang === 'bg' ? 'Избери дата' : 'Select Date')}</span>
                          </button>

                          <AnimatePresence>
                            {isCalendarOpen && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.2 }}
                                className="absolute bottom-full mb-2 z-50 left-0"
                              >
                                <GlassCalendar
                                  selectedDate={date ? parseISO(date) : undefined}
                                  onDateSelect={(d: Date) => {
                                    setDate(format(d, 'yyyy-MM-dd'));
                                    setIsCalendarOpen(false);
                                  }}
                                />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        <div className="w-full md:w-32 relative group shrink-0" ref={timePickerRef}>
                          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
                            <Clock className="w-5 h-5 text-text-secondary group-focus-within:text-accent transition-colors" aria-hidden="true" />
                          </div>
                          <button
                            type="button"
                            onClick={() => setIsTimePickerOpen(!isTimePickerOpen)}
                            className={`w-full h-14 pl-12 pr-4 bg-bg border-subtle border rounded-lg text-sm focus:outline-none transition-all text-left flex items-center ${time ? 'text-text-primary' : 'text-text-secondary/80'} ${isTimePickerOpen ? 'border-accent shadow-[0_0_15px_rgba(255,90,0,0.15)] ring-1 ring-accent' : ''}`}
                          >
                            <span>{time || (lang === 'bg' ? 'Час' : 'Time')}</span>
                          </button>

                          <AnimatePresence>
                            {isTimePickerOpen && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.2 }}
                                className="absolute bottom-full mb-2 z-50 left-0 md:left-auto md:right-0" // Align right on desktop to avoid cutting off screen
                              >
                                <GlassTimePicker
                                  selectedTime={time}
                                  onTimeSelect={(t) => {
                                    setTime(t);
                                    setIsTimePickerOpen(false);
                                  }}
                                />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Return date — inline, slides in next to Select Date */}
                        <AnimatePresence>
                          {isReturn && (
                            <motion.div
                              key="return-date-inline"
                              initial={{ opacity: 0, width: 0, minWidth: 0 }}
                              animate={{ opacity: 1, width: 'auto', minWidth: 160 }}
                              exit={{ opacity: 0, width: 0, minWidth: 0 }}
                              transition={{ duration: 0.25, ease: 'easeInOut' }}
                              className="flex flex-col md:flex-row gap-2 flex-[2]"
                              style={{ overflow: 'visible' }}
                            >
                              <div className="flex-1 relative group" ref={returnCalendarRef}>
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
                                  <Calendar className="w-5 h-5 text-accent transition-colors" aria-hidden="true" />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setIsReturnCalendarOpen(!isReturnCalendarOpen)}
                                  className={`w-full h-14 pl-12 pr-3 bg-bg border rounded-lg text-sm focus:outline-none transition-all text-left flex items-center leading-tight ${returnDate ? 'text-text-primary border-green-500/50' : 'text-text-secondary/80 border-accent/40'} ${isReturnCalendarOpen ? 'border-accent shadow-[0_0_15px_rgba(255,90,0,0.15)] ring-1 ring-accent' : ''}`}
                                >
                                  <span className="line-clamp-2">
                                    {returnDate ? format(parseISO(returnDate), 'MMM d, yyyy') : (lang === 'bg' ? 'Избери дата на връщане' : 'Select return date')}
                                  </span>
                                </button>
                                <AnimatePresence>
                                  {isReturnCalendarOpen && (
                                    <motion.div
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: 10 }}
                                      transition={{ duration: 0.2 }}
                                      className="absolute bottom-full mb-2 z-50 left-0"
                                    >
                                      <GlassCalendar
                                        selectedDate={returnDate ? parseISO(returnDate) : undefined}
                                        onDateSelect={(d: Date) => {
                                          setReturnDate(format(d, 'yyyy-MM-dd'));
                                          setIsReturnCalendarOpen(false);
                                        }}
                                      />
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>

                              <div className="w-full md:w-32 relative group shrink-0" ref={returnTimePickerRef}>
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
                                  <Clock className="w-5 h-5 text-accent transition-colors" aria-hidden="true" />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setIsReturnTimePickerOpen(!isReturnTimePickerOpen)}
                                  className={`w-full h-14 pl-12 pr-4 bg-bg border border-accent/40 rounded-lg text-sm focus:outline-none transition-all text-left flex items-center ${returnTime ? 'text-text-primary' : 'text-text-secondary/80'} ${isReturnTimePickerOpen ? 'border-accent shadow-[0_0_15px_rgba(255,90,0,0.15)] ring-1 ring-accent' : ''}`}
                                >
                                  <span>{returnTime || (lang === 'bg' ? 'Час' : 'Time')}</span>
                                </button>

                                <AnimatePresence>
                                  {isReturnTimePickerOpen && (
                                    <motion.div
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: 10 }}
                                      transition={{ duration: 0.2 }}
                                      className="absolute bottom-full mb-2 z-50 left-0 md:left-auto md:right-0" // Align right on desktop to avoid cutting off screen
                                    >
                                      <GlassTimePicker
                                        selectedTime={returnTime}
                                        onTimeSelect={(t) => {
                                          setReturnTime(t);
                                          setIsReturnTimePickerOpen(false);
                                        }}
                                      />
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className="flex-1 relative group min-w-[130px] shrink-0">
                          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Users className="w-5 h-5 text-text-secondary group-focus-within:text-accent transition-colors" aria-hidden="true" />
                          </div>
                          <select
                            name="passengers"
                            value={passengers}
                            onChange={(e) => setPassengers(Number(e.target.value))}
                            className="w-full h-14 pl-12 pr-10 bg-bg border-subtle rounded-lg text-[16px] focus:outline-none input-glow transition-all appearance-none text-text-primary cursor-pointer truncate"
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                              <option key={n} value={n}>{n} {n === 1 ? (lang === 'bg' ? 'пътник' : 'Passenger') : (lang === 'bg' ? 'пътници' : 'Passengers')}</option>
                            ))}
                          </select>
                          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                            <ChevronRight className="w-4 h-4 text-text-secondary rotate-90" aria-hidden="true" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col">                      <button
                      type="submit"
                      disabled={isSearching || !pickupCoords || !dropoffCoords}
                      title={!pickupCoords || !dropoffCoords ? (lang === 'bg' ? 'Моля изберете адреси от падащото меню' : 'Please select locations from the dropdown') : undefined}
                      className="h-14 px-8 bg-accent hover:bg-accent-hover disabled:bg-accent/40 disabled:cursor-not-allowed disabled:opacity-60 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-200 hover:not-disabled:-translate-y-[2px] shadow-[0_4px_14px_0_rgba(255,90,0,0.2)] lg:w-auto w-full group overflow-hidden relative"
                    >
                      <motion.div
                        animate={isSearching ? { y: -40 } : { y: 0 }}
                        className="flex items-center justify-center gap-2"
                      >
                        <Search className="w-5 h-5 group-hover:scale-110 transition-transform" aria-hidden="true" />
                        <span>{t.booking.search}</span>
                      </motion.div>
                      {isSearching && (
                        <motion.div
                          initial={{ y: 40 }}
                          animate={{ y: 0 }}
                          className="absolute inset-0 flex items-center justify-center bg-accent"
                        >
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        </motion.div>
                      )}
                    </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            </section>

            {/* Trust Indicators */}
            <section className="py-10 border-y border-border bg-bg" aria-label="Trust advantages">
              <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-text-secondary text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5" aria-hidden="true" />
                    <span>{t.advantages.items[2]}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock3 className="w-5 h-5" aria-hidden="true" />
                    <span>{t.advantages.items[4]}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" aria-hidden="true" />
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
                    { icon: MapPin, ...t.services.items[2] }
                  ].map((service, i) => (
                    <FadeIn key={i} delay={i * 0.1}>
                      <div className="relative h-full rounded-3xl border border-border p-1.5 md:p-2 group hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50 transition-all duration-300">
                        <GlowingEffect
                          spread={50}
                          glow={true}
                          disabled={false}
                          proximity={64}
                          inactiveZone={0.01}
                          borderWidth={2}
                        />
                        <div className="relative flex flex-col h-full bg-surface border border-subtle rounded-2xl p-6 md:p-8 z-10 overflow-hidden">
                          <div className="w-12 h-12 rounded-lg bg-bg border-subtle flex items-center justify-center mb-6 group-hover:bg-accent/10 group-hover:border-accent/20 group-hover:text-accent transition-colors">
                            <service.icon className="w-6 h-6" aria-hidden="true" />
                          </div>
                          <h3 className="text-xl font-bold font-heading mb-3">{service.title}</h3>
                          <p className="text-text-secondary leading-relaxed flex-1">{service.desc}</p>
                        </div>
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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                  {[
                    {
                      ...t.fleet.items[0],
                      passengers: 3,
                      luggage: 2,
                      trunk: 350,
                      img: "/mercedes-c-class.jpg"
                    },
                    {
                      ...t.fleet.items[2],
                      passengers: 8,
                      luggage: 7,
                      trunk: 5000,
                      img: "/mercedes-vito.jpg"
                    },
                    {
                      ...t.fleet.items[1],
                      passengers: 8,
                      luggage: 8,
                      trunk: 6000,
                      img: "/opel-vivaro.jpg"
                    }
                  ].map((vehicle, i) => (
                    <FadeIn key={i} delay={i * 0.1} className="h-full">
                      <div className="rounded-2xl bg-bg border-subtle overflow-hidden group h-full flex flex-col">
                        <div className="h-48 overflow-hidden relative flex-shrink-0">
                          <div className="absolute inset-0 bg-bg/20 group-hover:bg-transparent transition-colors z-10"></div>
                          <img
                            src={vehicle.img}
                            alt={vehicle.class}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        </div>
                        <div className="p-6 flex flex-col flex-1">
                          <h3 className="text-xl font-bold font-heading mb-1 min-h-[3.5rem] flex items-start">{vehicle.class}</h3>
                          <p className="text-sm text-text-secondary mb-6 min-h-[2.5rem]">{vehicle.desc}</p>

                          <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary pt-6 border-t border-border mt-auto">
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4" aria-hidden="true" />
                              <span>Max {vehicle.passengers}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <rect x="4" y="8" width="16" height="12" rx="2" ry="2"></rect>
                                <path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                              </svg>
                              <span>Max {vehicle.luggage}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M3 10h18M3 10V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3M3 10l2 9h14l2-9" />
                              </svg>
                              <span>{vehicle.trunk}L</span>
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
                            <CheckCircle2 className="w-6 h-6 text-accent" aria-hidden="true" />
                          </div>
                          <div>
                            <h4 className="font-bold text-lg mb-1">{feature}</h4>
                          </div>
                        </div>
                      ))}
                    </div>
                  </FadeIn>

                  <FadeIn delay={0.2} className="h-full flex flex-col justify-center">
                    <div className="grid grid-cols-2 gap-6 relative z-20">
                      <div className="bg-surface rounded-2xl overflow-hidden border-subtle shadow-xl group border border-border pb-4">
                        <img src="/boyan.jpg" alt="Driver" className="w-full h-48 sm:h-64 object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                        <div className="pt-5 text-center px-2">
                          <h4 className="font-bold text-lg mb-1">{lang === 'bg' ? 'Боян Цинзев' : 'Boyan Tsinzev'}</h4>
                          <span className="text-xs text-text-secondary">{lang === 'bg' ? 'Професионален Шофьор' : 'Professional Driver'}</span>
                        </div>
                      </div>
                      <div className="bg-surface rounded-2xl overflow-hidden border-subtle shadow-xl group border border-border pb-4">
                        <img src="/antonio.jpg" alt="Driver" className="w-full h-48 sm:h-64 object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                        <div className="pt-5 text-center px-2">
                          <h4 className="font-bold text-lg mb-1">{lang === 'bg' ? 'Антонио Захов' : 'Antonio Zahov'}</h4>
                          <span className="text-xs text-text-secondary">{lang === 'bg' ? 'Професионален Шофьор' : 'Professional Driver'}</span>
                        </div>
                      </div>
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
                    <button
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="bg-accent hover:bg-accent-hover text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:-translate-y-[2px] shadow-[0_4px_14px_0_rgba(255,90,0,0.2)]"
                    >
                      {t.booking.search}
                    </button>
                  </div>
                </FadeIn>
              </div>
            </section>

            {/* Reviews Section */}
            <section id="reviews" className="py-24 px-6 bg-bg overflow-hidden">
              <div className="max-w-7xl mx-auto">
                <FadeIn>
                  <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">{t.reviews.title}</h2>
                  </div>
                </FadeIn>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {t.reviews.items.map((review, i) => (
                    <FadeIn key={i} delay={i * 0.1}>
                      <div className="p-8 rounded-2xl bg-surface border-subtle relative h-full flex flex-col">
                        <div className="absolute top-6 left-6 text-accent/20">
                          <svg width="40" height="40" viewBox="0 0 40 40" fill="currentColor">
                            <path d="M12.5 13.5H7.5C6.39543 13.5 5.5 14.3954 5.5 15.5V20.5C5.5 21.6046 6.39543 22.5 7.5 22.5H12.5C12.5 24.5 11.5 26.5 9 27.5C8 28 8 29.5 9.5 29.5C14.5 29.5 17.5 25.5 17.5 20.5V15.5C17.5 14.3954 16.6046 13.5 15.5 13.5H12.5ZM29.5 13.5H24.5C23.3954 13.5 22.5 14.3954 22.5 15.5V20.5C22.5 21.6046 23.3954 22.5 24.5 22.5H29.5C29.5 24.5 28.5 26.5 26 27.5C25 28 25 29.5 26.5 29.5C31.5 29.5 34.5 25.5 34.5 20.5V15.5C34.5 14.3954 33.6046 13.5 32.5 13.5H29.5Z" />
                          </svg>
                        </div>
                        <div className="pt-8 flex-1">
                          <p className="text-text-secondary leading-relaxed italic mb-8">
                            {review.text}
                          </p>
                        </div>
                        <div>
                          <div className="flex items-center gap-1 text-accent mb-2">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star key={s} className="w-4 h-4 fill-current" aria-hidden="true" />
                            ))}
                          </div>
                          <span className="font-bold text-sm block">{review.author}</span>
                          <span className="text-xs text-text-secondary">Verified Customer</span>
                        </div>
                      </div>
                    </FadeIn>
                  ))}
                </div>
              </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="py-24 px-6 bg-surface border-y border-border">
              <div className="max-w-3xl mx-auto">
                <FadeIn>
                  <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">{t.faq.title}</h2>
                  </div>
                </FadeIn>

                <div className="space-y-4">
                  {t.faq.items.map((item, i) => (
                    <FadeIn key={i} delay={i * 0.1}>
                      <div className="p-6 rounded-xl bg-bg border-subtle group">
                        <h3 className="font-bold text-lg mb-3 flex items-start gap-3">
                          <span className="text-accent text-xl font-heading leading-none">Q.</span>
                          {item.q}
                        </h3>
                        <p className="text-text-secondary pl-8 leading-relaxed">
                          {item.a}
                        </p>
                      </div>
                    </FadeIn>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}


        {view === 'search-results' && (
          <SearchResults
            lang={lang}
            onBack={handleGoHome}
            onBook={handleOpenBooking}
            distanceResult={distanceResult}
            isCalculating={isCalculatingDistance}
            results={vehicleResults}
            isReturn={isReturn}
            returnDate={returnDate}
          />
        )}
      </main>

      {/* Footer */}
      <footer id="contact" className="bg-bg pt-20 pb-10 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
            <div>
              <div className="flex items-center mb-4">
                <img
                  src="/logo.png"
                  alt="Prime Transfers"
                  className="h-[120px] w-auto object-contain -ml-[5.4rem] lg:-ml-[5.9rem] scale-[3] origin-left pointer-events-none"
                />
              </div>
              <p className="text-text-secondary text-sm leading-relaxed mb-6">
                {t.about.mission}
              </p>
              <div className="flex gap-4">
                {/* Social links */}
                <a
                  href="https://www.instagram.com/primetrans17/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-surface border-subtle flex items-center justify-center hover:border-accent hover:text-accent transition-colors cursor-pointer"
                  aria-label="Follow us on Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://wa.me/359882545355"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-surface border-subtle flex items-center justify-center hover:border-accent hover:text-accent transition-colors cursor-pointer"
                  aria-label="Contact us on WhatsApp"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-6">{t.contact.company}</h4>
              <ul className="space-y-3 text-sm text-text-secondary">
                <li><a href="#about" onClick={(e) => scrollToSection(e, 'about')} className="hover:text-accent transition-colors">{t.nav.about}</a></li>
                <li><a href="#fleet" onClick={(e) => scrollToSection(e, 'fleet')} className="hover:text-accent transition-colors">{t.nav.fleet}</a></li>
                <li><a href="#services" onClick={(e) => scrollToSection(e, 'services')} className="hover:text-accent transition-colors">{t.nav.services}</a></li>
                <li><a href="#reviews" onClick={(e) => scrollToSection(e, 'reviews')} className="hover:text-accent transition-colors">{t.nav.reviews}</a></li>
                <li><a href="#faq" onClick={(e) => scrollToSection(e, 'faq')} className="hover:text-accent transition-colors">{t.nav.faq}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6">{t.contact.title}</h4>
              <ul className="space-y-4 text-sm text-text-secondary mb-10">
                <li className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-text-primary shrink-0" aria-hidden="true" />
                  <a href={`tel:${t.contact.phone.replace(/\s+/g, '')}`} className="hover:text-accent transition-colors">
                    {t.contact.phone}<br /><span className="text-xs opacity-80">{t.contact.workingHoursValue} {t.contact.workingHours}</span>
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-text-primary shrink-0" aria-hidden="true" />
                  <a href={`mailto:${t.contact.email}`} className="hover:text-accent transition-colors">
                    {t.contact.email}
                  </a>
                </li>
              </ul>

              <h4 className="font-bold mb-4">{t.contact.paymentTitle}</h4>
              <ul className="space-y-2 text-sm text-text-secondary list-disc pl-5 marker:text-accent">
                {t.contact.paymentMethods.split(', ').map((method, i) => (
                  <li key={i}>{method}</li>
                ))}
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

      {/* Booking Details Modal */}
      {isBookingDetailsOpen && selectedVehicle && distanceResult && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-lg bg-surface p-6 md:p-8 rounded-2xl border-border shadow-2xl relative mt-auto mb-auto bg-surface overflow-hidden"
          >
            <button
              onClick={() => setIsBookingDetailsOpen(false)}
              aria-label={lang === 'bg' ? 'Затвори' : 'Close'}
              className="absolute top-4 right-4 p-2 text-text-secondary hover:text-text-primary hover:bg-bg rounded-full transition-colors z-10"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
            <h3 className="text-2xl font-bold font-heading mb-6 relative">
              {lang === 'bg' ? 'Детайли за резервация' : 'Booking Details'}
            </h3>

            {/* Selected Route Info */}
            <div className="mb-6 bg-bg p-4 rounded-xl border border-border">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-semibold text-lg text-accent">{selectedVehicle.type}</p>
                  <p className="text-sm text-text-secondary">{lang === 'bg' ? 'Избрано превозно средство' : 'Selected vehicle'}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-xl text-accent">{selectedVehicle.price}</p>
                  {selectedVehicle.originalPrice && <p className="text-xs text-text-secondary line-through">{selectedVehicle.originalPrice}</p>}
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-text-secondary mb-2">
                <MapPin className="w-4 h-4 text-accent shrink-0" />
                <span className="truncate">{distanceResult.pickupDisplay}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <MapPin className="w-4 h-4 text-accent shrink-0" />
                <span className="truncate">{distanceResult.dropoffDisplay}</span>
              </div>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              if (!supabase) {
                console.error("Supabase not initialized");
                setIsBookingDetailsOpen(false);
                setIsBooked(true);
                return;
              }

              setIsSubmittingBooking(true);
              try {
                const totalDistance = distanceResult ? (isReturn ? distanceResult.distanceKm * 2 : distanceResult.distanceKm) : 0;
                const { error } = await supabase.from('bookings').insert({
                  pickup_location: distanceResult.pickupDisplay,
                  dropoff_location: distanceResult.dropoffDisplay,
                  pickup_date: date,
                  pickup_time: time || 'Not specified',
                  passengers: passengers,
                  luggage: 0,
                  is_return: isReturn,
                  return_date: returnDate || null,
                  return_time: returnTime || null,
                  price: parseFloat(selectedVehicle.price.replace(/[^0-9.]/g, '')),
                  vehicle_type: selectedVehicle.type,
                  distance: totalDistance,
                  first_name: firstName,
                  last_name: lastName,
                  email: bookingEmail,
                  phone: bookingPhone,
                  special_requests: specialRequests || null
                });

                if (error) {
                  console.error('Error inserting booking:', error);
                  alert((lang === 'bg' ? 'Възникна грешка при изпращането: ' : 'An error occurred: ') + (error.message || error.details || 'Unknown error'));
                } else {
                  setIsBookingDetailsOpen(false);
                  setIsBooked(true);
                }
              } catch (err) {
                console.error('Unexpected error:', err);
              } finally {
                setIsSubmittingBooking(false);
              }
            }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">{lang === 'bg' ? 'Име *' : 'First Name *'}</label>
                  <input type="text" required value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full h-12 px-4 bg-bg border-subtle rounded-lg text-[16px] focus:outline-none input-glow" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{lang === 'bg' ? 'Фамилия' : 'Last Name'}</label>
                  <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full h-12 px-4 bg-bg border-subtle rounded-lg text-[16px] focus:outline-none input-glow" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{lang === 'bg' ? 'Телефон *' : 'Phone Number *'}</label>
                <input type="tel" required value={bookingPhone} onChange={e => setBookingPhone(e.target.value)} className="w-full h-12 px-4 bg-bg border-subtle rounded-lg text-[16px] focus:outline-none input-glow" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{lang === 'bg' ? 'Имейл *' : 'Email *'}</label>
                <input type="email" required value={bookingEmail} onChange={e => setBookingEmail(e.target.value)} className="w-full h-12 px-4 bg-bg border-subtle rounded-lg text-[16px] focus:outline-none input-glow" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">{lang === 'bg' ? 'Бележки и специални изисквания' : 'Special Requests & Details'}</label>
                <textarea
                  value={specialRequests}
                  onChange={e => setSpecialRequests(e.target.value)}
                  placeholder={lang === 'bg' ? 'Напр. количество и тип багаж, детско столче и др.' : 'e.g. luggage quantity & type, child seat needed...'}
                  className="w-full p-4 bg-bg border-subtle rounded-lg text-[16px] focus:outline-none input-glow min-h-[100px] resize-y"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingBooking}
                className="w-full h-14 mt-4 bg-accent hover:bg-accent-hover disabled:bg-accent/50 text-white rounded-lg font-semibold transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
              >
                {isSubmittingBooking && (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                )}
                {isSubmittingBooking
                  ? (lang === 'bg' ? 'Изпращане...' : 'Sending...')
                  : (lang === 'bg' ? 'Потвърди резервацията' : 'Confirm Booking')}
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Booking Success Modal */}
      {isBooked && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-md bg-surface p-8 rounded-2xl border-border shadow-2xl text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-accent"></div>
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-2xl font-bold font-heading mb-4">
              {lang === 'bg' ? 'Заявката е изпратена!' : 'Request Sent Successfully!'}
            </h3>
            <p className="text-text-secondary mb-8 leading-relaxed">
              {lang === 'bg'
                ? 'Проверете имейла си! Изпратихме ви линк за потвърждение. Моля, кликнете върху него, за да финализирате вашата резервация.'
                : 'Check your email! we have sent you a confirmation link. Please click it to finalize your booking.'}
            </p>
            <button
              onClick={() => setIsBooked(false)}
              className="w-full bg-accent hover:bg-accent-hover text-white py-3 rounded-xl font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {lang === 'bg' ? 'Добре' : 'Got it'}
            </button>
          </motion.div>
        </div>
      )}

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/359882545355"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform z-50 animate-[bounce_2s_infinite] group"
        aria-label="Contact us on WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
        <span className="absolute -top-10 -right-2 bg-surface text-text-primary px-3 py-1 rounded-full text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg border border-border pointer-events-none">
          {lang === 'bg' ? 'Свържете се с нас' : 'Chat with us'}
        </span>
      </a>
    </div>
  );
}
