
import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import {
  CreditCard,
  DollarSign,
  Calendar,
  TrendingUp,
  Download,
} from "lucide-react";
import { Card } from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import type { LoaderData } from "../../loaders";
import { fetchPaymentData, getWorkingDaysInMonth } from "../../loaders/traineeLoaders";
import ContainerLoader from "../../components/ui/ContainerLoader";
import api from "../../api";
import { useAuth } from "../../contexts/AuthContext";

interface PaymentDetail {
  year: number;
  month: number;
  attCount: number;
  paymentParDay: number;
  payment: number;
  paymentDate: string | null;
  maxPayAmount: number | null;
}

interface PaymentData {
  totalEarned: number;
  pendingAmount: number;
  dailyPayment: number;
  payments: PaymentDetail[];
  availableYears: number[];
  currentYear: number;
  holidays: any[];
}

export default function TraineePayments() {
  const { user } = useAuth();
  const { data: initialData } = useLoaderData() as LoaderData<PaymentData>;

  // State for current data and filters
  const [paymentData, setPaymentData] = useState(initialData);
  const [selectedYear, setSelectedYear] = useState(initialData.currentYear);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  const { totalEarned, pendingAmount, dailyPayment, payments, availableYears, holidays } = paymentData;

  // Calculate dynamic metrics based on currently displayed payments
  const currentYearTotalDays = payments.reduce((sum, payment) => sum + payment.attCount, 0);
  const currentYearWorkingDays = payments.reduce((sum, payment) => {
    const actualWorkingDays = getWorkingDaysInMonth(payment.year, payment.month, holidays);
    let maxPaymentDays = Infinity;
    if (payment.maxPayAmount && payment.paymentParDay > 0) {
      maxPaymentDays = payment.maxPayAmount / payment.paymentParDay;
    }
    const workingDaysForMonth = isFinite(maxPaymentDays)
      ? Math.min(actualWorkingDays, maxPaymentDays)
      : actualWorkingDays;
    return sum + workingDaysForMonth;
  }, 0);

  // Handle filter changes
  const handleYearChange = async (year: number) => {
    if (year === selectedYear) return;

    setLoading(true);
    try {
      const newPayments = await fetchPaymentData(year);
      setPaymentData(prev => ({
        ...prev,
        payments: newPayments
      }));
      setSelectedYear(year);
    } catch (error) {
      console.error('Error fetching payment data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Determine payment status based on payment date
  const getPaymentStatus = (paymentDate: string | null): "paid" | "pending" => {
    if (!paymentDate) return "pending";
    const currentDate = new Date();
    const payDate = new Date(paymentDate);
    return payDate <= currentDate ? "paid" : "pending";
  };

  const getStatusBadge = (paymentDate: string | null) => {
    const status = getPaymentStatus(paymentDate);
    switch (status) {
      case "paid":
        return <Badge variant="success" size="sm">Paid</Badge>;
      case "pending":
        return <Badge variant="warning" size="sm">Pending</Badge>;
      default:
        return <Badge variant="default" size="sm">{status}</Badge>;
    }
  };

  // Get month name from month number
  const getMonthName = (month: number): string => {
    const date = new Date();
    date.setMonth(month - 1);
    return date.toLocaleString('default', { month: 'long' });
  };

  const handleExport = async () => {
    if (!user?.NIC) return;
    setExporting(true);
    try {
      const response = await api.get(`/api/export/payment/${encodeURIComponent(user.NIC)}?year=${selectedYear}`, {
        responseType: 'blob'
      });
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `payments_${user.NIC}_${selectedYear}.xlsx`);
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

  return (
    <div className="space-y-6 px-2">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Payments</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track your earnings and payment history
          </p>
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-1 shadow-sm w-full md:w-auto">
            {availableYears.length > 0 ? (
              <select
                value={selectedYear}
                onChange={(e) => handleYearChange(parseInt(e.target.value))}
                disabled={loading}
                className="bg-transparent text-sm font-medium text-gray-700 py-2 pl-3 pr-8 focus:outline-none cursor-pointer hover:bg-gray-50 rounded-md w-full md:w-auto"
              >
                {availableYears
                  .sort((a, b) => b - a)
                  .map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
              </select>
            ) : (
              <span className="text-sm text-gray-500 px-3 py-2">No Data</span>
            )}
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
        {/* Total Earned */}
        <Card className="border-l-4 border-l-green-500 overflow-hidden relative min-w-0">
          <div className="p-5">
            <p className="text-xs font-bold text-green-600 uppercase tracking-wider mb-1">Total Earned</p>
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Rs. {(totalEarned / 1000).toFixed(1)}k
            </h3>
            <p className="text-xs text-gray-500 mt-2">Rs. {totalEarned.toLocaleString()} Total</p>
          </div>
          <div className="absolute right-0 top-0 p-4 opacity-10">
            <DollarSign className="w-16 h-16" />
          </div>
        </Card>

        {/* Pending */}
        <Card className="border-l-4 border-l-orange-500 overflow-hidden relative min-w-0">
          <div className="p-5">
            <p className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">Pending Amount</p>
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Rs. {pendingAmount.toLocaleString()}
            </h3>
            <p className="text-xs text-gray-500 mt-2">To be processed</p>
          </div>
          <div className="absolute right-0 top-0 p-4 opacity-10">
            <CreditCard className="w-16 h-16" />
          </div>
        </Card>

        {/* Daily Rate */}
        <Card className="border-l-4 border-l-blue-500 overflow-hidden relative min-w-0">
          <div className="p-5">
            <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Daily Rate</p>
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Rs. {dailyPayment}
            </h3>
            <p className="text-xs text-gray-500 mt-2">Per working day</p>
          </div>
          <div className="absolute right-0 top-0 p-4 opacity-10">
            <TrendingUp className="w-16 h-16" />
          </div>
        </Card>

        {/* Attendance Days */}
        <Card className="border-l-4 border-l-purple-500 overflow-hidden relative min-w-0">
          <div className="p-5">
            <p className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">Attended Days</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">
                {currentYearTotalDays}
              </h3>
              <span className="text-sm text-gray-500 font-medium">/ {currentYearWorkingDays}</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">In {selectedYear}</p>
          </div>
          <div className="absolute right-0 top-0 p-4 opacity-10">
            <Calendar className="w-16 h-16" />
          </div>
        </Card>
      </div>

      {/* Payments Table */}
      <Card className="border-t-4 border-t-gray-900 min-w-0">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Payment Log</h2>
          <Badge variant="default" size="sm" className="font-normal text-gray-500">
            {payments.length} Records
          </Badge>
        </div>

        {loading && <ContainerLoader message="Updating records..." />}

        <div className="overflow-x-auto">
          {payments.length > 0 ? (
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="py-3 px-6 text-left font-semibold text-gray-600 whitespace-nowrap">Month</th>
                  <th className="py-3 px-6 text-center font-semibold text-gray-600 whitespace-nowrap">Attendance</th>
                  <th className="py-3 px-6 text-center font-semibold text-gray-600 whitespace-nowrap">Rate</th>
                  <th className="py-3 px-6 text-center font-semibold text-gray-600 whitespace-nowrap">Total</th>
                  <th className="py-3 px-6 text-center font-semibold text-gray-600 whitespace-nowrap">Date</th>
                  <th className="py-3 px-6 text-center font-semibold text-gray-600 whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {payments.map((payment) => (
                  <tr key={`${payment.year}-${payment.month}`} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3.5 px-6 font-medium text-gray-900 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-lg bg-blue-50/50 flex items-center justify-center mr-3 text-blue-600">
                          <Calendar className="h-4 w-4" />
                        </div>
                        {getMonthName(payment.month)}
                      </div>
                    </td>
                    <td className="py-3.5 px-6 text-center text-gray-500 whitespace-nowrap">
                      {payment.attCount} days
                    </td>
                    <td className="py-3.5 px-6 text-center font-mono text-gray-600 text-xs whitespace-nowrap">
                      Rs. {payment.paymentParDay.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-6 text-center font-bold text-gray-900 whitespace-nowrap">
                      Rs. {payment.payment.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-6 text-center text-xs text-gray-500 whitespace-nowrap">
                      {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : "—"}
                    </td>
                    <td className="py-3.5 px-6 text-center whitespace-nowrap">
                      <span className="inline-flex justify-center min-w-[80px]">
                        {getStatusBadge(payment.paymentDate)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                <DollarSign className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-gray-500">No payment data found for {selectedYear}.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
