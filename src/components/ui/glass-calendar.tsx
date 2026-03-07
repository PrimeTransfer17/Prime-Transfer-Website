import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addMonths, subMonths, isSameDay, isToday, getDate, getDaysInMonth, startOfMonth } from "date-fns";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

interface Day {
    date: Date;
    isToday: boolean;
    isSelected: boolean;
}

interface GlassCalendarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
    selectedDate?: Date;
    onDateSelect?: (date: Date) => void;
    className?: string;
}

const ScrollbarHide = () => (
    <style>{`
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
    .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `}</style>
);

export const GlassCalendar = React.forwardRef<HTMLDivElement, GlassCalendarProps>(
    ({ className, selectedDate: propSelectedDate, onDateSelect, ...props }, ref) => {
        const [currentMonth, setCurrentMonth] = React.useState(propSelectedDate || new Date());
        const [selectedDate, setSelectedDate] = React.useState(propSelectedDate || new Date());

        React.useEffect(() => {
            if (propSelectedDate) {
                setSelectedDate(propSelectedDate);
                setCurrentMonth(propSelectedDate);
            }
        }, [propSelectedDate]);

        const monthDays = React.useMemo(() => {
            const start = startOfMonth(currentMonth);
            const totalDays = getDaysInMonth(currentMonth);
            const startDayIndex = (start.getDay() + 6) % 7; // Monday = 0, Sunday = 6
            const days: (Day | null)[] = Array(startDayIndex).fill(null);

            for (let i = 0; i < totalDays; i++) {
                const date = new Date(start.getFullYear(), start.getMonth(), i + 1);
                days.push({
                    date,
                    isToday: isToday(date),
                    isSelected: isSameDay(date, selectedDate),
                });
            }

            // Pad the end with nulls to always fill exactly 6 rows (42 days)
            const paddingLength = 42 - days.length;
            if (paddingLength > 0) {
                for (let i = 0; i < paddingLength; i++) {
                    days.push(null);
                }
            }

            return days;
        }, [currentMonth, selectedDate]);

        const handleDateClick = (date: Date) => {
            setSelectedDate(date);
            onDateSelect?.(date);
        };

        const handlePrevMonth = (e: React.MouseEvent) => {
            e.preventDefault();
            setCurrentMonth(subMonths(currentMonth, 1));
        };

        const handleNextMonth = (e: React.MouseEvent) => {
            e.preventDefault();
            setCurrentMonth(addMonths(currentMonth, 1));
        };

        return (
            <div
                ref={ref}
                className={cn(
                    "w-[320px] sm:w-[340px] rounded-3xl p-5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] overflow-hidden",
                    "bg-surface border border-subtle",
                    "font-sans",
                    className
                )}
                {...props}
            >
                <ScrollbarHide />

                {/* Date Display and Navigation */}
                <div className="mb-6 flex items-center justify-between">
                    <motion.p
                        key={format(currentMonth, "MMMM")}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-2xl font-bold tracking-tight text-text-primary capitalize"
                    >
                        {format(currentMonth, "MMMM yyyy")}
                    </motion.p>
                    <div className="flex items-center space-x-2">
                        <button type="button" onClick={handlePrevMonth} className="p-1 rounded-full text-text-secondary transition-colors hover:bg-white/10">
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button type="button" onClick={handleNextMonth} className="p-1 rounded-full text-text-secondary transition-colors hover:bg-white/10">
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Full Monthly Calendar Grid */}
                <div className="mt-4">
                    {/* Weekdays Header */}
                    <div className="grid grid-cols-7 mb-4">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                            <div key={`weekday-${i}`} className="flex justify-center">
                                <span className="text-xs font-bold text-text-secondary/50 uppercase">
                                    {day}
                                </span>
                            </div>
                        ))}
                    </div>
                    {/* Days Grid */}
                    <div className="grid grid-cols-7 gap-y-2">
                        {monthDays.map((day, i) => (
                            <div key={day ? format(day.date, "yyyy-MM-dd") : `empty-${i}`} className="flex justify-center items-center">
                                {day ? (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleDateClick(day.date);
                                        }}
                                        className={cn(
                                            "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-all duration-200 relative",
                                            {
                                                "bg-accent text-white shadow-[0_4px_14px_0_rgba(255,90,0,0.39)]": day.isSelected,
                                                "hover:bg-white/10 text-text-primary": !day.isSelected,
                                            }
                                        )}
                                    >
                                        {day.isToday && !day.isSelected && (
                                            <span className="absolute bottom-1 h-1 w-1 rounded-full bg-accent"></span>
                                        )}
                                        {getDate(day.date)}
                                    </button>
                                ) : (
                                    <div className="h-8 w-8" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
);

GlassCalendar.displayName = "GlassCalendar";
