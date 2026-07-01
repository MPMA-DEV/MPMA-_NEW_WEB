
import { useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import { Calendar, Filter, Download, User } from 'lucide-react';
import { fetchAttendanceData } from '../../loaders/traineeLoaders';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import ContainerLoader from '../../components/ui/ContainerLoader';
import api from '../../api';
import { useAuth } from '../../contexts/AuthContext';

interface AttendanceData {
  totalWorkingDays: number;
  presentDays: number;
  attendanceRate: number;
  records: Array<{
    date: string;
    on_time: string | null;
    off_time: string | null;
    status: number;
  }>;
  availableYears: Array<{
    year: number;
    months: number[];
  }>;
  traineeInfo: {
    NIC: string;
    REG_NO: string;
    ATT_NO: number;
    name: string;
  };
  currentYear: number;
  currentMonth: number;
}

export default function TraineeAttendance() {
  const { user } = useAuth();
  const initialData = useLoaderData() as AttendanceData;

  // State for current data and filters
  const [attendanceData, setAttendanceData] = useState(initialData);
  const [selectedYear, setSelectedYear] = useState(initialData.currentYear);
  const [selectedMonth, setSelectedMonth] = useState(initialData.currentMonth);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  const { totalWorkingDays, presentDays, attendanceRate, records, availableYears, traineeInfo } = attendanceData;

  // Check if there's any data at all
  const hasNoData = availableYears.length === 0 && records.length === 0 && totalWorkingDays === 0;

  // Handle filter changes
  const handleFilterChange = async (year: number, month: number) => {
    if (year === selectedYear && month === selectedMonth) return;

    setLoading(true);
    try {
      const newData = await fetchAttendanceData(year, month);

      // Update the attendance data with new records
      setAttendanceData(prev => ({
        ...prev,
        records: newData.records,
        traineeInfo: newData.traineeInfo
      }));

      setSelectedYear(year);
      setSelectedMonth(month);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get available years and months for dropdowns
  const availableYearsList = availableYears.map(item => item.year).sort((a, b) => b - a);
  const availableMonthsForYear = availableYears.find(item => item.year === selectedYear)?.months || [];

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 1:
        return <Badge variant="success" size="sm">Present</Badge>;
      case 0.5:
        return <Badge variant="warning" size="sm">Half Day</Badge>;
      case 0:
        return <Badge variant="error" size="sm">Absent</Badge>;
      default:
        return <Badge variant="default" size="sm">{status}</Badge>;
    }
  };

  const handleExport = async () => {
    if (!user?.NIC) return;
    setExporting(true);
    try {
      const response = await api.get(`/api/export/attendance/${encodeURIComponent(user.NIC)}?year=${selectedYear}&month=${selectedMonth}`, {
        responseType: 'blob'
      });
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `attendance_${user.NIC}_${selectedYear}_${selectedMonth}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(false);
    }
  };

  // Empty state when no data exists at all
  if (hasNoData) {
    return (
      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Attendance</h1>
            <p className="text-sm text-gray-500 mt-0.5">Track your daily attendance records.</p>
          </div>
        </div>

        {/* Empty State Card */}
        <Card className="overflow-hidden">
          <div className="p-8 md:p-12 text-center">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Attendance Records Yet</h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              Your attendance records will appear here once your training begins. Check back after your start date to view your daily attendance data.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-2">
      {/* Header & Trainee Profile Summary */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-200 pb-5 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Attendance</h1>
          <div className="flex items-center gap-3 mt-1.5 text-sm text-gray-500 flex-wrap">
            {traineeInfo.name && (
              <>
                <span className="font-medium text-gray-900">Name: {traineeInfo.name}</span>
                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
              </>
            )}
            <span>Reg: {traineeInfo.REG_NO || 'N/A'}</span>
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            <span>Att No: {traineeInfo.ATT_NO || 'N/A'}</span>
          </div>
        </div>

        {/* Date Filter & Actions */}
        <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-1 shadow-sm w-full md:w-auto">
            <select
              value={selectedYear}
              onChange={(e) => {
                const newYear = parseInt(e.target.value);
                const availableMonths = availableYears.find(item => item.year === newYear)?.months || [];
                const newMonth = availableMonths.includes(selectedMonth) ? selectedMonth : availableMonths[0] || 1;
                handleFilterChange(newYear, newMonth);
              }}
              disabled={loading}
              className="flex-1 bg-transparent text-sm font-medium text-gray-700 py-2 pl-3 pr-8 focus:outline-none cursor-pointer border-r border-gray-100 hover:bg-gray-50 rounded-l-md w-full md:w-auto"
            >
              {availableYearsList.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <select
              value={selectedMonth}
              onChange={(e) => handleFilterChange(selectedYear, parseInt(e.target.value))}
              disabled={loading}
              className="flex-1 bg-transparent text-sm font-medium text-gray-700 py-2 pl-3 pr-8 focus:outline-none cursor-pointer hover:bg-gray-50 rounded-r-md w-full md:w-auto"
            >
              {availableMonthsForYear.map((month) => (
                <option key={month} value={month}>
                  {new Date(0, month - 1).toLocaleString('default', { month: 'short' })}
                </option>
              ))}
            </select>
          </div>

          <Button
            variant="outline"
            icon={Download}
            size="sm"
            onClick={handleExport}
            loading={exporting}
            className="w-full md:w-auto justify-center"
          >
            Export
          </Button>
        </div>
      </div>

      {/* Stats Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Monthly Stats */}
        <Card className="border-l-4 border-l-blue-500 overflow-hidden relative min-w-0">
          <div className="p-5">
            <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
              {new Date(0, selectedMonth - 1).toLocaleString('default', { month: 'long' })} Rate
            </p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">
                {(records.length > 0 ? (records.reduce((sum, r) => sum + r.status, 0) / records.length) * 100 : 0).toFixed(1)}
                <span className="text-lg text-gray-400 font-medium ml-0.5">%</span>
              </h3>
            </div>
            <p className="text-xs text-gray-500 mt-2">Attendance for selected month</p>
          </div>
          <div className="absolute right-0 top-0 p-4 opacity-10">
            <Filter className="w-16 h-16" />
          </div>
        </Card>

        <Card className="border-l-4 border-l-indigo-500 overflow-hidden relative min-w-0">
          <div className="p-5">
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
              Days Present
            </p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">
                {records.reduce((sum, r) => sum + r.status, 0)}
              </h3>
              <span className="text-sm text-gray-500 font-medium">/ {records.length} days</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">In {new Date(0, selectedMonth - 1).toLocaleString('default', { month: 'long' })}</p>
          </div>
          <div className="absolute right-0 top-0 p-4 opacity-10">
            <User className="w-16 h-16" />
          </div>
        </Card>

        {/* Overall Stats */}
        <Card className="border-l-4 border-l-purple-500 overflow-hidden relative min-w-0">
          <div className="p-5 relative z-10">
            <p className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">Overall Rate</p>
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">
              {attendanceRate.toFixed(1)}
              <span className="text-lg text-gray-400 font-medium ml-0.5">%</span>
            </h3>
            <p className="text-xs text-gray-500 mt-2">Lifetime attendance score</p>
          </div>
          <div className="absolute right-0 top-0 p-4 opacity-10">
            <Filter className="w-16 h-16" />
          </div>
        </Card>

        <Card className="min-w-0 border-l-4 border-l-amber-500">
          <div className="p-5 flex flex-col justify-between h-full">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Total History</p>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{presentDays}</p>
                  <p className="text-[10px] text-gray-500 uppercase">Present</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900 pl-1">{totalWorkingDays}</p>
                  <p className="text-[10px] text-gray-500 uppercase">Total</p>
                </div>
              </div>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5 mt-3">
              <div
                className="bg-green-500 h-1.5 rounded-full"
                style={{ width: `${(presentDays / (totalWorkingDays || 1)) * 100}%` }}
              ></div>
            </div>
          </div>
        </Card>
      </div>

      {/* Records Table */}
      <Card className="border-t-4 border-t-gray-900 min-w-0">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Attendance Log</h2>
          <Badge variant="default" size="sm" className="font-normal text-gray-500">
            {records.length} Records
          </Badge>
        </div>

        {loading && <ContainerLoader message="Updating records..." />}

        <div className="overflow-x-auto">
          {records.length > 0 ? (
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="py-3 px-6 text-left font-semibold text-gray-600 whitespace-nowrap">Date</th>
                  <th className="py-3 px-6 text-center font-semibold text-gray-600 whitespace-nowrap">Day</th>
                  <th className="py-3 px-6 text-center font-semibold text-gray-600 whitespace-nowrap">Time In</th>
                  <th className="py-3 px-6 text-center font-semibold text-gray-600 whitespace-nowrap">Time Out</th>
                  <th className="py-3 px-6 text-center font-semibold text-gray-600 whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {records.map((record, index) => {
                  const dateObj = new Date(record.date);
                  const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;

                  return (
                    <tr key={`${record.date}-${index}`} className={`hover:bg-gray-50 transition-colors ${isWeekend ? 'bg-slate-50/50' : ''}`}>
                      <td className="py-3.5 px-6 font-medium text-gray-900 whitespace-nowrap">
                        {dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="py-3.5 px-6 text-center text-gray-500 whitespace-nowrap">
                        {dateObj.toLocaleDateString(undefined, { weekday: 'short' })}
                      </td>
                      <td className="py-3.5 px-6 text-center font-mono text-gray-600 text-xs whitespace-nowrap">
                        {record.on_time || '—'}
                      </td>
                      <td className="py-3.5 px-6 text-center font-mono text-gray-600 text-xs whitespace-nowrap">
                        {record.off_time || '—'}
                      </td>
                      <td className="py-3.5 px-6 text-center whitespace-nowrap">
                        <span className="inline-flex justify-center min-w-[80px]">
                          {getStatusBadge(record.status)}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                <Calendar className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-gray-500">No attendance data found for this period.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
