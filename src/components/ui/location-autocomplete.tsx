import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, Loader2, AlertCircle } from 'lucide-react';

export interface LocationSuggestion {
    displayName: string;
    shortName: string;
    lat: number;
    lon: number;
}

interface Props {
    placeholder: string;
    value: string;
    onChange: (raw: string) => void;
    onSelect: (suggestion: LocationSuggestion) => void;
    isSelected: boolean; // whether a valid suggestion has been chosen
    id?: string;
}

async function fetchSuggestions(query: string): Promise<LocationSuggestion[]> {
    if (query.trim().length < 2) return [];

    let customSuggestions: LocationSuggestion[] = [];
    const lowerQuery = query.toLowerCase();

    // Check if query contains "airport" or "sofia airport" or "летище"
    if (lowerQuery.includes('airport') || lowerQuery.includes('летище') || lowerQuery.includes('sofia airport')) {
        customSuggestions = [
            {
                displayName: "Sofia Airport Terminal 1, Sofia, Bulgaria",
                shortName: "Sofia Airport Terminal 1",
                lat: 42.6885,
                lon: 23.4150
            },
            {
                displayName: "Sofia Airport Terminal 2, Sofia, Bulgaria",
                shortName: "Sofia Airport Terminal 2",
                lat: 42.6930,
                lon: 23.4110
            }
        ];
    }

    try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=6&addressdetails=1`;
        const res = await fetch(url, {
            headers: {
                'Accept-Language': 'en',
                'User-Agent': 'PrimeTransfersBooking/1.0',
            },
        });
        if (!res.ok) return customSuggestions;
        const data = await res.json();
        const apiSuggestions = data.map((item: any) => {
            const addr = item.address || {};
            // Build a concise short name: city / town + country
            const city =
                addr.city || addr.town || addr.village || addr.county || addr.state || '';
            const country = addr.country || '';
            const shortName = city && country ? `${city}, ${country}` : item.display_name.split(',').slice(0, 2).join(',').trim();
            return {
                displayName: item.display_name,
                shortName,
                lat: parseFloat(item.lat),
                lon: parseFloat(item.lon),
            };
        });

        return [...customSuggestions, ...apiSuggestions];
    } catch {
        return customSuggestions;
    }
}

function useDebounce<T>(value: T, delay: number): T {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);
    return debounced;
}

export const LocationAutocomplete: React.FC<Props> = ({
    placeholder,
    value,
    onChange,
    onSelect,
    isSelected,
    id,
}) => {
    const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const debouncedValue = useDebounce(value, 350);

    // Fetch suggestions when debounced value changes
    useEffect(() => {
        if (isSelected || debouncedValue.trim().length < 2) {
            setSuggestions([]);
            setIsOpen(false);
            return;
        }
        let cancelled = false;
        setIsLoading(true);
        fetchSuggestions(debouncedValue).then((results) => {
            if (!cancelled) {
                setSuggestions(results);
                setIsOpen(results.length > 0);
                setIsLoading(false);
                setActiveIndex(-1);
            }
        });
        return () => { cancelled = true; };
    }, [debouncedValue, isSelected]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleOutsideClick(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

    const handleSelect = useCallback((suggestion: LocationSuggestion) => {
        onSelect(suggestion);
        onChange(suggestion.shortName);
        setSuggestions([]);
        setIsOpen(false);
        setActiveIndex(-1);
    }, [onSelect, onChange]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!isOpen) return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex((i) => Math.max(i - 1, -1));
        } else if (e.key === 'Enter' && activeIndex >= 0) {
            e.preventDefault();
            handleSelect(suggestions[activeIndex]);
        } else if (e.key === 'Escape') {
            setIsOpen(false);
        }
    };

    // Determine border state
    const hasError = !isSelected && value.trim().length > 0 && !isLoading;
    const borderClass = isSelected
        ? 'border-green-500/60 shadow-[0_0_12px_rgba(34,197,94,0.12)]'
        : hasError
            ? 'border-red-500/50'
            : '';

    return (
        <div ref={containerRef} className="relative flex-1 group">
            {/* Icon */}
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
                {isLoading ? (
                    <Loader2 className="w-5 h-5 text-accent animate-spin" />
                ) : isSelected ? (
                    <MapPin className="w-5 h-5 text-green-500" />
                ) : (
                    <MapPin className="w-5 h-5 text-text-secondary group-focus-within:text-accent transition-colors" />
                )}
            </div>

            <input
                ref={inputRef}
                id={id}
                type="text"
                value={value}
                placeholder={placeholder}
                required
                autoComplete="off"
                onChange={(e) => {
                    onChange(e.target.value);
                    // If user edits the field after selecting, invalidate selection
                    if (isSelected) onSelect({ displayName: '', shortName: '', lat: 0, lon: 0 });
                }}
                onKeyDown={handleKeyDown}
                onFocus={() => { if (suggestions.length > 0 && !isSelected) setIsOpen(true); }}
                className={`w-full h-14 pl-12 pr-4 bg-bg border rounded-lg text-[16px] focus:outline-none transition-all placeholder:text-text-secondary/80 border-subtle input-glow ${borderClass}`}
                aria-autocomplete="list"
                aria-controls={isOpen ? `${id}-listbox` : undefined}
                aria-activedescendant={activeIndex >= 0 ? `${id}-option-${activeIndex}` : undefined}
            />

            {/* Error hint */}
            {hasError && value.trim().length >= 2 && !isLoading && (
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                </div>
            )}

            {/* Dropdown */}
            {isOpen && suggestions.length > 0 && (
                <ul
                    id={`${id}-listbox`}
                    role="listbox"
                    className="absolute top-full left-0 right-0 mt-1.5 z-[200] bg-surface border border-border rounded-xl shadow-2xl overflow-hidden"
                >
                    {suggestions.map((s, i) => (
                        <li
                            key={i}
                            id={`${id}-option-${i}`}
                            role="option"
                            aria-selected={i === activeIndex}
                            onMouseDown={(e) => { e.preventDefault(); handleSelect(s); }}
                            onMouseEnter={() => setActiveIndex(i)}
                            className={`flex items-start gap-3 px-4 py-3 cursor-pointer text-[16px] transition-colors ${i === activeIndex ? 'bg-accent/10 text-text-primary' : 'hover:bg-white/5 text-text-secondary'
                                }`}
                        >
                            <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-accent" />
                            <div className="min-w-0">
                                <div className="font-medium text-text-primary truncate">{s.shortName}</div>
                                <div className="text-xs text-text-secondary truncate mt-0.5 opacity-70">{s.displayName}</div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
