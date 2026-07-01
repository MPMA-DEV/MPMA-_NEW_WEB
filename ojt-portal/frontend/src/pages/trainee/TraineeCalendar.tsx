
import { useState } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
} from "lucide-react";
import { useLoaderData } from "react-router-dom";
import type { LoaderData } from "../../loaders";
import { Card } from "../../components/ui/Card";

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: "training" | "payment" | "holiday" | "meeting";
  time?: string;
  description?: string;
  endDate?: string;
}

interface CalenderData {
  id: number;
  start_date: string;
  end_date: string;
  description: string;
}

export default function TraineeCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { data: calendarData } = useLoaderData() as LoaderData<CalenderData[]>;

  const events: CalendarEvent[] = calendarData.map((holiday) => ({
    id: holiday.id.toString(),
    title: holiday.description || "Holiday",
    date: holiday.start_date,
    type: "holiday",
    description: holiday.description,
    ...(holiday.end_date && { endDate: holiday.end_date }),
  }));

  const getMonthDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    return days;
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getEventsForDate = (date: Date) => {
    const localDateString =
      date.getFullYear() +
      "-" +
      String(date.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(date.getDate()).padStart(2, "0");

    return events.filter((event) => event.date.split("T")[0] === localDateString);
  };

  const getEventTypeColor = (type: string) => {
    const colors = {
      training: "bg-blue-50 text-blue-700 border border-blue-100",
      payment: "bg-orange-50 text-orange-700 border border-orange-100",
      holiday: "bg-green-50 text-green-700 border border-green-100",
      meeting: "bg-purple-50 text-purple-700 border border-purple-100",
    };
    return colors[type as keyof typeof colors] || "bg-gray-50 text-gray-700 border border-gray-100";
  };

  // Helper for mobile dot color
  const getEventDotClass = (type: string) => {
    switch (type) {
      case 'training': return 'bg-blue-500';
      case 'payment': return 'bg-orange-500';
      case 'holiday': return 'bg-green-500';
      case 'meeting': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const monthDays = getMonthDays(currentDate);
  const monthName = currentDate.toLocaleDateString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <div className="p-3 md:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-100 gap-4">
          <div>
            <h1 className="text-lg md:text-xl font-bold text-gray-900">Training Calendar</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your schedule and view upcoming events</p>
          </div>
          <div className="flex items-center space-x-2 bg-gray-50 p-1 rounded-xl border border-gray-200 w-full sm:w-auto justify-between sm:justify-start">
            <button onClick={() => navigateMonth("prev")} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-600">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="w-32 text-center font-semibold text-gray-900">{monthName}</div>
            <button onClick={() => navigateMonth("next")} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-600">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="p-2 md:p-4">
          <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2 md:mb-3">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center text-[10px] md:text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <span className="hidden md:inline">{day}</span>
                <span className="md:hidden">{day.charAt(0)}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 lg:gap-2">
            {monthDays.map((day, index) => (
              <div
                key={index}
                onClick={() => day && setSelectedDate(day)}
                className={`min-h-[60px] md:min-h-[80px] rounded-lg md:rounded-xl border p-1 md:p-1.5 transition-all duration-200 flex flex-col
                  ${!day ? "border-transparent bg-transparent" : "bg-white border-gray-100 hover:border-blue-300 hover:shadow-md cursor-pointer"}
                  ${day?.toDateString() === new Date().toDateString() ? "ring-1 md:ring-2 ring-blue-500 border-blue-500 bg-blue-50/20" : ""}
                `}
              >
                {day && (
                  <>
                    <span className={`text-xs md:text-sm font-semibold mb-1 w-5 h-5 md:w-7 md:h-7 flex items-center justify-center rounded-full
                       ${day.toDateString() === new Date().toDateString() ? "bg-blue-600 text-white" : "text-gray-700"}
                    `}>
                      {day.getDate()}
                    </span>

                    {/* Desktop Event View */}
                    <div className="hidden sm:block flex-1 space-y-1 overflow-y-auto custom-scrollbar">
                      {getEventsForDate(day).map((event) => (
                        <div key={event.id} className={`text-[10px] px-1.5 py-1 rounded-md truncate font-medium ${getEventTypeColor(event.type)}`}>
                          {event.title}
                        </div>
                      ))}
                    </div>

                    {/* Mobile Event View (Dots) */}
                    <div className="sm:hidden flex flex-wrap gap-1 justify-center mt-1">
                      {getEventsForDate(day).slice(0, 3).map((event) => (
                        <div key={`dot-${event.id}`} className={`w-1.5 h-1.5 rounded-full ${getEventDotClass(event.type)}`}></div>
                      ))}
                      {getEventsForDate(day).length > 3 && (
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Selected Date Modal */}
      {selectedDate && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                {selectedDate.toLocaleDateString("default", { weekday: 'long', day: 'numeric', month: 'long' })}
              </h3>
              <button onClick={() => setSelectedDate(null)} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            <div className="space-y-3">
              {getEventsForDate(selectedDate).length === 0 ? (
                <div className="text-center py-6">
                  <CalendarIcon className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No events planned.</p>
                </div>
              ) : (
                getEventsForDate(selectedDate).map(event => (
                  <div key={event.id} className={`p-3 rounded-xl border ${getEventTypeColor(event.type)}`}>
                    <div className="font-semibold text-sm">{event.title}</div>
                    {event.description && <div className="text-xs opacity-80 mt-1">{event.description}</div>}
                    {event.time && <div className="text-xs font-medium mt-2 flex items-center"><Clock className="w-3 h-3 mr-1" /> {event.time}</div>}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
