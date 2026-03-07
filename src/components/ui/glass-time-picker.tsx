import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";

interface GlassTimePickerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
    selectedTime?: string; // "HH:mm"
    onTimeSelect?: (time: string) => void;
    className?: string;
}

export const GlassTimePicker = React.forwardRef<HTMLDivElement, GlassTimePickerProps>(
    ({ className, selectedTime, onTimeSelect, ...props }, ref) => {
        // Default to current time or selectedTime if provided
        const initialHour = selectedTime?.split(':')[0] || new Date().getHours().toString().padStart(2, '0');
        const initialMinute = selectedTime?.split(':')[1] || "00";

        const [hour, setHour] = React.useState(initialHour);
        const [minute, setMinute] = React.useState(initialMinute);
        const [view, setView] = React.useState<'hours' | 'minutes'>('hours');

        const handleHourSelect = (h: string) => {
            setHour(h);
            setView('minutes'); // automatically switch to minutes
        };

        const handleMinuteSelect = (m: string) => {
            setMinute(m);
            if (onTimeSelect) onTimeSelect(`${hour}:${m}`);
        };

        const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
        const minutes = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"];

        return (
            <div
                ref={ref}
                className={cn(
                    "w-[300px] sm:w-[320px] rounded-3xl p-5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] overflow-hidden",
                    "bg-surface border border-subtle",
                    "font-sans",
                    className
                )}
                {...props}
            >
                {/* Header Displays Selected Time */}
                <div className="flex justify-center items-center mb-6 space-x-2 text-4xl font-bold tracking-tight text-text-primary">
                    <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); setView('hours'); }}
                        className={cn("px-3 py-1 rounded-xl transition-all duration-200", view === 'hours' ? "bg-white/10 text-accent shadow-inner" : "text-text-secondary hover:text-text-primary hover:bg-white/5")}
                    >
                        {hour}
                    </button>
                    <span className="text-text-secondary pb-1">:</span>
                    <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); setView('minutes'); }}
                        className={cn("px-3 py-1 rounded-xl transition-all duration-200", view === 'minutes' ? "bg-white/10 text-accent shadow-inner" : "text-text-secondary hover:text-text-primary hover:bg-white/5")}
                    >
                        {minute}
                    </button>
                </div>

                <div className="relative overflow-hidden h-[200px]">
                    <AnimatePresence initial={false} custom={view}>
                        {view === 'hours' && (
                            <motion.div
                                key="hours"
                                initial={{ x: -300, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -300, opacity: 0 }}
                                transition={{ ease: "easeInOut", duration: 0.3 }}
                                className="absolute inset-0"
                            >
                                <div className="grid grid-cols-6 gap-1 sm:gap-2 h-full">
                                    {hours.map((h) => (
                                        <button
                                            key={h}
                                            type="button"
                                            onClick={(e) => { e.preventDefault(); handleHourSelect(h); }}
                                            className={cn(
                                                "flex h-9 sm:h-10 items-center justify-center rounded-xl text-base sm:text-lg font-medium transition-all duration-200",
                                                h === hour ? "bg-accent text-white shadow-[0_4px_14px_0_rgba(255,90,0,0.39)]" : "hover:bg-white/10 text-text-primary"
                                            )}
                                        >
                                            {h}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {view === 'minutes' && (
                            <motion.div
                                key="minutes"
                                initial={{ x: 300, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: 300, opacity: 0 }}
                                transition={{ ease: "easeInOut", duration: 0.3 }}
                                className="absolute inset-0"
                            >
                                <div className="grid grid-cols-4 gap-2 sm:gap-3 h-full">
                                    {minutes.map((m) => (
                                        <button
                                            key={m}
                                            type="button"
                                            onClick={(e) => { e.preventDefault(); handleMinuteSelect(m); }}
                                            className={cn(
                                                "flex h-12 items-center justify-center rounded-xl text-xl font-medium transition-all duration-200",
                                                m === minute ? "bg-accent text-white shadow-[0_4px_14px_0_rgba(255,90,0,0.39)]" : "hover:bg-white/10 text-text-primary"
                                            )}
                                        >
                                            {m}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        );
    }
);
GlassTimePicker.displayName = "GlassTimePicker";
