
import { useLoaderData } from "react-router-dom";
import { Download, CalendarDays, Building2, Clock, MapPin, CheckCircle2, Circle, LayoutList } from "lucide-react";
import { Card } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import api from "../../api";
import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";

type ScheduleSummary = {
  traineeId: number;
  nic: string;
  course: string | null;
  overall: { startDate: string; endDate: string } | null;
  departmentDurations: Array<{
    scheduleId: number;
    departmentId: number;
    departmentName: string | null;
    startDate: string;
    endDate: string;
  }>;
} | null;

interface SchedulePeriod {
  id: string;
  period: string;
  startDate: string;
  endDate: string;
  department: string;
  status: "upcoming" | "current" | "completed";
}

export default function TraineeSchedule() {
  const { user } = useAuth();
  const data = useLoaderData() as ScheduleSummary | [];
  const [downloading, setDownloading] = useState(false);

  const isEmpty = Array.isArray(data);
  const summary = (!isEmpty ? (data as ScheduleSummary) : null) as ScheduleSummary;
  const scheduleItems = summary?.departmentDurations ?? [];
  const overall = summary?.overall ?? null;

  const today = new Date();
  const getStatus = (start: string, end: string): "upcoming" | "current" | "completed" => {
    const s = new Date(start);
    const e = new Date(end);
    if (today < s) return "upcoming";
    if (today > e) return "completed";
    return "current";
  };

  const scheduleData: SchedulePeriod[] = scheduleItems.map((s, idx) => ({
    id: String(s.scheduleId),
    period: `Rotation ${idx + 1}`,
    startDate: s.startDate,
    endDate: s.endDate,
    department: s.departmentName || `Department ${s.departmentId}`,
    status: getStatus(s.startDate, s.endDate),
  }));

  const isOverallCompleted = overall && today > new Date(overall.endDate);

  const trainingInfo = {
    program: summary?.course || "N/A",
    duration: overall ? `${new Date(overall.startDate).toLocaleDateString()} - ${new Date(overall.endDate).toLocaleDateString()}` : "Not Set",
    totalDepartments: scheduleItems.length,
    currentDepartment: isOverallCompleted ? "Completed" : (scheduleData.find((p) => p.status === "current")?.department || "Not Started"),
  };

  const handleDownload = async () => {
    if (!user?.NIC) return;
    setDownloading(true);
    try {
      const response = await api.get(`/api/export/schedule/${encodeURIComponent(user.NIC)}`, {
        responseType: 'blob'
      });
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `schedule_${user.NIC}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6 px-2">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Schedule</h1>
          <p className="text-sm text-gray-500 mt-1">
            View your rotation plan and timeline
          </p>
        </div>

        {/* Actions */}
        {!isEmpty && scheduleItems.length > 0 && (
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full md:w-auto">
            <Button
              icon={Download}
              variant="outline"
              size="sm"
              className="w-full md:w-auto justify-center"
              onClick={handleDownload}
              loading={downloading}
            >
              {downloading ? 'Downloading...' : 'Download Plan'}
            </Button>
          </div>
        )}
      </div>

      {(isEmpty || scheduleItems.length === 0) ? (
        <Card className="overflow-hidden">
          <div className="p-8 md:p-12 text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CalendarDays className="h-8 w-8 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Schedule Available</h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              Your training schedule hasn't been created yet. Once your training begins, your department rotation timeline will appear here.
            </p>
          </div>
        </Card>
      ) : (
        <>
          {/* Stats Overview Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Program */}
            <Card className="border-l-4 border-l-blue-500 overflow-hidden relative min-w-0">
              <div className="p-5">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Training Program</p>
                <h3 className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight min-h-[3rem] items-center flex" title={trainingInfo.program}>
                  {trainingInfo.program}
                </h3>
              </div>
              <div className="absolute right-0 top-0 p-4 opacity-10">
                <Building2 className="w-16 h-16" />
              </div>
            </Card>

            {/* Duration */}
            <Card className="border-l-4 border-l-purple-500 overflow-hidden relative min-w-0">
              <div className="p-5">
                <p className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">Duration</p>
                <h3 className="text-lg font-bold text-gray-900" title={trainingInfo.duration}>
                  {trainingInfo.duration}
                </h3>
              </div>
              <div className="absolute right-0 top-0 p-4 opacity-10">
                <Clock className="w-16 h-16" />
              </div>
            </Card>

            {/* Departments */}
            <Card className="border-l-4 border-l-green-500 overflow-hidden relative min-w-0">
              <div className="p-5">
                <p className="text-xs font-bold text-green-600 uppercase tracking-wider mb-1">Rotations</p>
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {trainingInfo.totalDepartments}
                </h3>
                <p className="text-xs text-gray-500 mt-2">Total departments</p>
              </div>
              <div className="absolute right-0 top-0 p-4 opacity-10">
                <LayoutList className="w-16 h-16" />
              </div>
            </Card>

            {/* Current */}
            <Card className="border-l-4 border-l-orange-500 overflow-hidden relative min-w-0">
              <div className="p-5">
                <p className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">Current</p>
                <h3 className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight min-h-[3rem] items-center flex" title={trainingInfo.currentDepartment}>
                  {trainingInfo.currentDepartment}
                </h3>
              </div>
              <div className="absolute right-0 top-0 p-4 opacity-10">
                <MapPin className="w-16 h-16" />
              </div>
            </Card>
          </div>

          {/* Timeline */}
          <Card className="border-t-4 border-t-gray-900 min-w-0">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-900">Department Rotation Timeline</h2>
            </div>

            <div className="p-6">
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-3.5 md:left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                <div className="space-y-6">
                  {scheduleData.map((period) => (
                    <div key={period.id} className="relative flex items-start group">
                      {/* Icon Marker */}
                      <div className={`absolute left-3.5 md:left-6 -translate-x-1/2 w-6 h-6 rounded-full border-4 flex items-center justify-center z-10 transition-colors duration-300 bg-white
                        ${period.status === 'completed' ? 'border-green-500 text-green-600' :
                          period.status === 'current' ? 'border-blue-500 text-blue-600' :
                            'border-gray-300 text-gray-400'}`}>
                        {period.status === 'completed' ? <CheckCircle2 className="w-3 h-3" /> :
                          period.status === 'current' ? <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" /> :
                            <Circle className="w-3 h-3" />}
                      </div>

                      {/* Content */}
                      <div className="ml-10 md:ml-16 w-full">
                        <div className={`p-4 rounded-xl border transition-all duration-300 
                          ${period.status === 'current'
                            ? 'bg-blue-50 border-blue-200 shadow-sm ring-1 ring-blue-100'
                            : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'}`}>

                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded
                                ${period.status === 'current' ? 'bg-blue-200 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>
                                {period.period}
                              </span>
                              <h3 className={`text-base font-bold ${period.status === 'current' ? 'text-blue-900' : 'text-gray-900'}`}>
                                {period.department}
                              </h3>
                            </div>
                            <div className="shrink-0">
                              {period.status === 'current' && <Badge variant="info" pulse size="sm">Active Now</Badge>}
                              {period.status === 'completed' && <Badge variant="success" size="sm">Completed</Badge>}
                              {period.status === 'upcoming' && <Badge variant="default" size="sm">Upcoming</Badge>}
                            </div>
                          </div>

                          <div className="flex items-center text-gray-500 text-xs font-medium">
                            <CalendarDays className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                            {new Date(period.startDate).toLocaleDateString()} — {new Date(period.endDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
