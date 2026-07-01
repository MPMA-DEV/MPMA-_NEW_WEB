import api, { getAccessToken, isTokenExpired, refreshAccessToken } from "../api";
import { createLoader } from "./index";
import { redirect } from "react-router-dom";

// Helper function to get current user from access token with refresh capability
const getCurrentUser = async () => {
  // First, try to get existing access token
  let token = getAccessToken();

  // If no token or token is expired, try to refresh it first
  if (!token || isTokenExpired(token)) {
    try {
      console.log("Loader: Token missing or expired, using shared refresh...");
      // Use the SHARED refreshAccessToken to avoid race conditions with AuthContext
      token = await refreshAccessToken();
    } catch (refreshError) {
      console.error("Loader: Token refresh failed:", refreshError);
      throw new Error("No valid access token");
    }
  }

  if (!token) {
    throw new Error("No access token found");
  }

  try {
    // Decode JWT token to get user data
    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error("Invalid token format");
    }

    const payload = JSON.parse(atob(parts[1]));

    // Validate required fields
    if (!payload.userId) {
      throw new Error("Token missing required user data");
    }

    return {
      id: payload.userId,
      username: payload.username,
      email: payload.email,
      NIC: payload.NIC,
      staffId: payload.staffId,
      role: payload.role,
      status: payload.status,
    };
  } catch (error) {
    console.error("Error decoding token in loader:", error);
    throw new Error("Invalid access token");
  }
};

interface PaymentDetail {
  year: number;
  month: number;
  attCount: number;
  paymentParDay: number;
  payment: number;
  paymentDate: string | null;
  maxPayAmount: number | null;
}

interface PaymentSummaryResponse {
  TotalEarned: number;
  TotalPending: number;
}

interface PaymentData {
  totalEarned: number;
  pendingAmount: number;
  totalDays: number;
  totalWorkingDays: number;
  dailyPayment: number;
  payments: PaymentDetail[];
  availableYears: number[];
  currentYear: number;
  holidays: CalenderData[];
}

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

interface CalenderData {
  id: number;
  start_date: string;
  end_date: string;
  description: string;
}


export const getWorkingDaysInMonth = (year: number, month: number, holidays: CalenderData[] = []): number => {
  let count = 0;
  const daysInMonth = new Date(year, month, 0).getDate();
  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth = new Date(year, month, 0, 23, 59, 59);

  // Filter holidays for this specific month
  const monthHolidays = holidays.filter(h => {
    const holidayStart = new Date(h.start_date);
    const holidayEnd = new Date(h.end_date);

    // Check if holiday overlaps with the month
    return (
      (holidayStart >= startOfMonth && holidayStart <= endOfMonth) ||
      (holidayEnd >= startOfMonth && holidayEnd <= endOfMonth) ||
      (holidayStart <= startOfMonth && holidayEnd >= endOfMonth)
    );
  });

  // Create a set of holiday dates for faster lookup
  const holidayDates = new Set<string>();

  monthHolidays.forEach(h => {
    const start = new Date(h.start_date);
    const end = new Date(h.end_date);

    // Iterate through holiday range
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      if (d.getMonth() === month - 1 && d.getFullYear() === year) {
        holidayDates.add(d.toISOString().split('T')[0]);
      }
    }
  });

  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(year, month - 1, d);
    const day = dateObj.getDay();
    const dateString = dateObj.toISOString().split('T')[0];

    // 0 = Sun, 6 = Sat
    if (day !== 0 && day !== 6 && !holidayDates.has(dateString)) {
      count++;
    }
  }
  return count;
};

const loadTraineePayments = async (): Promise<PaymentData> => {
  try {
    // Get user from token to extract NIC
    const user = await getCurrentUser();
    const nic = user.NIC;

    if (!nic) {
      throw new Error("NIC not found in user token");
    }

    // Get available payment years and payment summary for initial load
    const [yearsResponse, summaryResponse] = await Promise.all([
      api.get(`/api/trainee/payment_years/${nic}`),
      api.get(`/api/trainee/payment_summary/${nic}`)
    ]);

    const availableYears = yearsResponse.data.years || [];
    const { TotalEarned, TotalPending } = summaryResponse.data;

    // Get the latest year for default data
    const currentYear = availableYears.length > 0
      ? Math.max(...availableYears)
      : new Date().getFullYear();

    // Get payment details for the latest year only (initial load)
    const detailsResponse = await api.get(`/api/trainee/payment_details/${nic}`, {
      params: { year: currentYear }
    });
    const payments = detailsResponse.data || [];

    // Calculate metrics from latest year data
    // Get holidays used for working days calculation
    const holidaysResponse = await api.get("api/trainee/holidays");
    const holidays = holidaysResponse.status === 200 ? holidaysResponse.data : [];

    // Calculate metrics from latest year data
    const dailyPayment = payments.length > 0 ? payments[payments.length - 1].paymentParDay : 750;
    const totalDays = payments.reduce((sum: number, payment: PaymentDetail) => sum + payment.attCount, 0);
    const totalWorkingDays = payments.reduce((sum: number, payment: PaymentDetail) => {
      const actualWorkingDays = getWorkingDaysInMonth(payment.year, payment.month, holidays);

      // Calculate max payment days based on maxPayAmount
      let maxPaymentDays = Infinity;
      if (payment.maxPayAmount && payment.paymentParDay > 0) {
        maxPaymentDays = payment.maxPayAmount / payment.paymentParDay;
      }

      // Take the minimum of actual working days and max allowed payment days
      // If maxPaymentDays is Infinity/Invalid, just use actualWorkingDays
      const workingDaysForMonth = isFinite(maxPaymentDays)
        ? Math.min(actualWorkingDays, maxPaymentDays)
        : actualWorkingDays;

      return sum + workingDaysForMonth;
    }, 0);

    return {
      totalEarned: TotalEarned || 0,
      pendingAmount: TotalPending || 0,
      totalDays,
      totalWorkingDays,
      dailyPayment,
      payments, // Latest year payments only
      availableYears,
      currentYear,
      holidays,
    };
  } catch (error) {
    console.error("Error loading initial payment data:", error);

    // Return minimal data structure on error
    return {
      totalEarned: 0,
      pendingAmount: 0,
      totalDays: 0,
      totalWorkingDays: 0,
      dailyPayment: 750,
      payments: [],
      availableYears: [new Date().getFullYear()],
      currentYear: new Date().getFullYear(),
      holidays: [],
    };
  }
};

const loadTraineeAttendance = async (): Promise<AttendanceData> => {
  try {
    // Get user from token to extract NIC
    const user = await getCurrentUser();
    const nic = user.NIC;

    if (!nic) {
      throw new Error("NIC not found in user token");
    }

    // Get date summary (total working days, present days, and available years/months)
    const dateSummaryResponse = await api.get(`/api/attendance/attendancedate_summary/${nic}`);
    const [totalWorkingDays, totalPresent, ...yearMonthData] = dateSummaryResponse.data;

    // Find the latest year and month from available data
    let defaultYear = new Date().getFullYear();
    let defaultMonth = new Date().getMonth() + 1;

    if (yearMonthData.length > 0) {
      // Sort years in descending order and get the latest
      const sortedYears = yearMonthData.sort((a: any, b: any) => b.year - a.year);
      const latestYearData = sortedYears[0];
      defaultYear = latestYearData.year;

      // Get the latest month from the latest year
      const sortedMonths = latestYearData.months.sort((a: number, b: number) => b - a);
      defaultMonth = sortedMonths[0];
    }

    // Get detailed attendance records for the default (latest) period
    const attendanceResponse = await api.get(`/api/attendance/attendance_summary/${nic}`, {
      params: {
        year: defaultYear,
        month: defaultMonth
      }
    });

    const attendanceData = attendanceResponse.data[0]; // API returns array with single object
    const records = attendanceData?.attendences || [];

    console.log("attendanceData", attendanceResponse);

    // Calculate attendance rate
    const attendanceRate = totalWorkingDays > 0 ? (totalPresent / totalWorkingDays) * 100 : 0;

    return {
      totalWorkingDays,
      presentDays: totalPresent,
      attendanceRate,
      records,
      availableYears: yearMonthData,
      traineeInfo: {
        NIC: attendanceData?.NIC || nic,
        REG_NO: attendanceData?.REG_NO || '',
        ATT_NO: attendanceData?.ATT_NO || 0,
        name: attendanceData?.name || ''
      },
      currentYear: defaultYear,
      currentMonth: defaultMonth
    };
  } catch (error) {
    console.error("Error loading attendance data:", error);

    // Return empty data structure on error
    return {
      totalWorkingDays: 0,
      presentDays: 0,
      attendanceRate: 0,
      records: [],
      availableYears: [],
      traineeInfo: {
        NIC: '',
        REG_NO: '',
        ATT_NO: 0,
        name: ''
      },
      currentYear: new Date().getFullYear(),
      currentMonth: new Date().getMonth() + 1
    };
  }
};

const traineeEventLoader = async (): Promise<CalenderData[]> => {
  try {
    const response = await api.get("api/trainee/holidays");

    if (response.status === 200) {
      return response.data;
    }

    return []; // Return empty array if no data
  } catch (error) {
    console.error("Error fetching calendar data:", error);
    return []; // Return empty array on error
  }
};

const fetchTraineeDetails = async (user: any) => {

  // Fetch 1: Primary source by NIC
  let primaryByNIC: any = {};
  if (user?.NIC) {
    try {
      const nic = encodeURIComponent(user.NIC);
      const res1 = await api.get(`api/trainee/active_trainee_by_nic/${nic}`);
      if (res1.status === 200 && res1.data) {
        primaryByNIC = res1.data || {};
      }
      console.log("Primary (by NIC) fetch: ", primaryByNIC);
    } catch (err) {
      console.warn("Primary (by NIC) fetch failed: ", err);
    }
  }

  // Fetch 2: Secondary source by user id
  let secondaryByUserId: any = {};
  try {
    const res2 = await api.get(`api/trainee/trainee_details/${user.id}`);
    if (res2.status === 200 && res2.data) {
      secondaryByUserId = res2.data || {};
    }
    console.log("Secondary (by user id) fetch: ", secondaryByUserId);
  } catch (err) {
    console.warn("Secondary (by user id) fetch failed: ", err);
  }

  const finalResult: any = {
    ...primaryByNIC, // flat NIC-based fields at top-level
    TraineeUser: secondaryByUserId?.TraineeUser ?? null,
    PersonalInfo: secondaryByUserId?.PersonalInfo ?? null,
    EmergencyContact: secondaryByUserId?.EmergencyContact ?? null,
  };

  // Map status from NIC API: true->Active, false->Inactive, null/undefined->Pending
  if (primaryByNIC && Object.prototype.hasOwnProperty.call(primaryByNIC, "status")) {
    const s = primaryByNIC.status;
    if (s === true) {
      finalResult.status = "Active";
    } else if (s === false) {
      finalResult.status = "Inactive";
    } else {
      finalResult.status = "Pending";
    }
  }

  // Override status if end_date has passed
  if (finalResult.PersonalInfo?.end_date) {
    const endDate = new Date(finalResult.PersonalInfo.end_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    if (today > endDate) {
      finalResult.status = "Inactive";
    }
  }

  return finalResult;
};


// Helper: fetch a media file as a blob and return an object URL + content type
const fetchMediaAsBlob = async (url: string): Promise<{ blobUrl: string; contentType: string } | null> => {
  try {
    const response = await api.get(url, { responseType: 'blob' });
    if (response.status === 200 && response.data) {
      const contentType = response.data.type || response.headers?.['content-type'] || '';
      return {
        blobUrl: URL.createObjectURL(response.data),
        contentType,
      };
    }
    return null;
  } catch {
    return null;
  }
};

export const getTraineeProfilePhoto = async (id: number | string, bustCache = false) => {
  try {
    const url = bustCache
      ? `api/trainee/stream-photo/${id}?t=${Date.now()}`
      : `api/trainee/stream-photo/${id}`;
    const result = await fetchMediaAsBlob(url);
    return { profilePhoto: result?.blobUrl || null };
  } catch (error) {
    console.error("Error fetching trainee profile photo:", error);
    return { profilePhoto: null };
  }
};

export const getTraineeDocuments = async (id: number | string) => {
  try {
    const docTypes = ['nicScan', 'policeReport', 'universityId', 'instituteLetter', 'consentLetter', 'bankPassbook'] as const;

    // Fetch each document individually as a blob (parallel, resilient)
    const results = await Promise.allSettled(
      docTypes.map(async (docType) => {
        const result = await fetchMediaAsBlob(`api/trainee/stream/${id}/${docType}`);
        return { docType, result };
      })
    );

    // Also fetch profile photo
    const photoResult = await fetchMediaAsBlob(`api/trainee/stream-photo/${id}`);

    // Build result object with same shape as before
    const docs: Record<string, string | null> = {
      nicScan: null,
      policeReport: null,
      universityId: null,
      instituteLetter: null,
      consentLetter: null,
      bankPassbook: null,
      profilePhoto: photoResult?.blobUrl || null,
    };

    // Also build a types map so frontend can determine pdf vs image
    const types: Record<string, string> = {};

    for (const result of results) {
      if (result.status === 'fulfilled' && result.value.result) {
        const { docType, result: mediaResult } = result.value;
        docs[docType] = mediaResult.blobUrl;
        types[docType] = mediaResult.contentType;
      }
    }

    return { ...docs, _types: types };
  } catch (error) {
    console.error("Error fetching trainee documents:", error);
    return {};
  }
};

const getTraineeInterview = async (nic: string) => {
  try {
    const response = await api.get(`api/trainee/interview_details/${nic}`);

    console.log("trainee interview", response.data);

    if (response.status === 200) {
      return response.data;
    }

    return {};
  } catch (error) {
    console.error("Error fetching trainee interview:", error);
    return {};
  }
};

// Export the loader
export const traineeDetailsLoader = async () => {
  try {
    // Get user from token (with refresh capability)
    const user = await getCurrentUser();
    const traineeData = await fetchTraineeDetails(user);

    return { ...traineeData, userId: user.id };
  } catch (e) {
    // If auth fails in loader, redirect to login
    return redirect("/login");
  }
};

export const onboardingSummaryLoader = async () => {
  try {
    const user = await getCurrentUser();
    const traineeData = await fetchTraineeDetails(user);
    // Fetch documents for OnboardingSummary and EditDetails page
    const documents = await getTraineeDocuments(user.id);
    return { ...traineeData, Documents: documents, userId: user.id };
  } catch (e) {
    return redirect("/login");
  }
};

export async function traineeScheduleLoader() {
  try {
    // Get access token from the api module
    let token = getAccessToken();

    if (!token) return null;

    // Decode JWT token to get user data
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    const payload = JSON.parse(atob(parts[1]));
    const NIC = payload.NIC;

    if (!NIC) return null;

    const res = await api.get(`/api/trainee/schedule_summary/${NIC}`);
    return res.data;
  } catch (error) {
    console.error("Error in traineeScheduleLoader:", error);
    return null;
  }
}

// Function to fetch attendance data for specific year/month (to be called from component)
export const fetchAttendanceData = async (year: number, month: number) => {
  try {
    // Get user from token to extract NIC
    const user = await getCurrentUser();
    const nic = user.NIC;

    if (!nic) {
      throw new Error("NIC not found in user token");
    }

    // Get detailed attendance records for the specified period
    const attendanceResponse = await api.get(`/api/attendance/attendance_summary/${nic}`, {
      params: { year, month }
    });

    const attendanceData = attendanceResponse.data[0]; // API returns array with single object
    const records = attendanceData?.attendences || [];

    return {
      records,
      traineeInfo: {
        NIC: attendanceData?.NIC || nic,
        REG_NO: attendanceData?.REG_NO || '',
        ATT_NO: attendanceData?.ATT_NO || 0,
        name: attendanceData?.name || ''
      }
    };
  } catch (error) {
    console.error("Error fetching attendance data:", error);
    throw error;
  }
};

// Function to fetch payment data for specific year (to be called from component)
export const fetchPaymentData = async (year: number): Promise<PaymentDetail[]> => {
  try {
    // Get user from token to extract NIC
    const user = await getCurrentUser();
    const nic = user.NIC;

    if (!nic) {
      throw new Error("NIC not found in user token");
    }

    // Get payment details for the specified year
    const detailsResponse = await api.get(`/api/trainee/payment_details/${nic}`, {
      params: { year }
    });

    return detailsResponse.data || [];
  } catch (error) {
    console.error("Error fetching payment data:", error);
    throw error;
  }
};

// Function to fetch available payment years (to be called from component)
export const fetchPaymentYears = async (): Promise<number[]> => {
  try {
    // Get user from token to extract NIC
    const user = await getCurrentUser();
    const nic = user.NIC;

    if (!nic) {
      throw new Error("NIC not found in user token");
    }

    // Get available payment years
    const yearsResponse = await api.get(`/api/trainee/payment_years/${nic}`);
    return yearsResponse.data.years || [];
  } catch (error) {
    console.error("Error fetching payment years:", error);
    throw error;
  }
};

// Function to fetch payment summary (to be called from component)
export const fetchPaymentSummary = async (): Promise<PaymentSummaryResponse> => {
  try {
    // Get user from token to extract NIC
    const user = await getCurrentUser();
    const nic = user.NIC;

    if (!nic) {
      throw new Error("NIC not found in user token");
    }

    // Get payment summary
    const summaryResponse = await api.get(`/api/trainee/payment_summary/${nic}`);
    return summaryResponse.data;
  } catch (error) {
    console.error("Error fetching payment summary:", error);
    throw error;
  }
};

// Create attendance loader that gets default (latest) data
export const traineeAttendanceLoader = async () => {
  return await loadTraineeAttendance();
};

export const traineeInterviewLoader = async () => {
  try {
    const user = await getCurrentUser();
    const nic = user.NIC;
    if (!nic) {
      throw new Error("NIC not found in user token");
    }
    return await getTraineeInterview(nic);
  } catch (error) {
    console.error("Error fetching trainee interview:", error);
    return null;
  }
};

export const traineeCalendarLoader = createLoader(traineeEventLoader, 600);
export const traineePaymentsLoader = createLoader(loadTraineePayments, 600);

// Layout loader - fetches all data needed by TraineeLayout before component mounts
// This runs during route loading, so data is ready when component renders
export const traineeLayoutLoader = createLoader(async () => {
  try {
    const user = await getCurrentUser();

    // Fetch all layout data in parallel
    const [paymentsResult, docsResult, bankResult] = await Promise.allSettled([
      fetchPaymentYears(),
      user?.id ? getTraineeProfilePhoto(user.id) : Promise.resolve(null),
      user?.NIC ? fetchBankPermission(user.NIC) : Promise.resolve({ canViewBank: false }),
    ]);

    // Process results
    const hasPayments = paymentsResult.status === "fulfilled"
      ? (paymentsResult.value?.length ?? 0) > 0
      : false;

    const profilePhoto = docsResult.status === "fulfilled" && docsResult.value?.profilePhoto
      ? docsResult.value.profilePhoto
      : null;

    const canViewBankDetails = bankResult.status === "fulfilled"
      ? bankResult.value.canViewBank
      : false;

    return {
      hasPayments,
      profilePhoto,
      canViewBankDetails,
    };
  } catch (e) {
    throw e;
  }
});

// Simple auth loader that just ensures the token is valid
// Use this for routes that don't have their own data loaders
export const authLoader = async () => {
  try {
    await getCurrentUser();
    return null; // Return null - we just want to ensure auth is valid
  } catch (e) {
    return redirect("/login");
  }
};

export const fetchBankPermission = async (nic: string): Promise<{ canViewBank: boolean; traineeData: any }> => {
  try {
    const encodedNic = encodeURIComponent(nic);
    const res = await api.get(`api/trainee/active_trainee_by_nic/${encodedNic}`);
    const data = res?.data || {};
    const isActive = data?.status === true || data?.status === "Active";
    const att = String(data?.ATT_NO ?? "");
    console.log("att", att);
    // Allow bank details if ATT_NO is not set yet OR if it starts with "9"
    const canViewBank = isActive && (att === "" || att.startsWith("9"));
    return {
      canViewBank,
      traineeData: data,
    };
  } catch (error) {
    console.error("Error fetching bank permission:", error);
    return { canViewBank: true, traineeData: {} };
  }
};

