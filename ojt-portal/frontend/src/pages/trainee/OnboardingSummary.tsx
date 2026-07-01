import { useEffect } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { User, Phone, FolderOpen, Calendar, LogIn, CheckCircle, MapPin, Mail, Smartphone, Landmark } from "lucide-react";
import { DocumentViewer } from "../../components/ui/DocumentViewer";
import Header from "../../components/layout/Header";
import type { LoaderData } from "../../loaders";
import { useAuth } from "../../contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import api, { refreshAccessToken } from "../../api";

export default function OnboardingSummary() {
  const loaderData = useLoaderData() as LoaderData<any>;
  const personal = loaderData?.PersonalInfo || loaderData?.personal_info || {};
  const emergency = loaderData?.EmergencyContact || loaderData?.Emegency_contact || {};
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Redirect to onboarding edit page if rejected (Pending status)
  useEffect(() => {
    if (user?.status === "Pending") {
      navigate("/onboarding", { replace: true });
    }
  }, [user?.status, navigate]);

  // Poll trainee status every 10 seconds
  useEffect(() => {
    if (!user?.id || user.status !== "Processing") return;

    let isMounted = true;
    const pollStatus = async () => {
      try {
        const response = await api.get(`api/trainee/trainee_details/${user.id}`);
        if (!isMounted) return;

        const dbStatus = response.data?.TraineeUser?.status;
        if (dbStatus && dbStatus !== user.status) {
          console.log(`Status change detected: ${user.status} -> ${dbStatus}. Refreshing token...`);
          // Refresh access token to update local state (including AuthContext)
          await refreshAccessToken();
        }
      } catch (err) {
        console.error("Failed to poll trainee status:", err);
      }
    };

    pollStatus();
    const interval = setInterval(pollStatus, 10000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [user?.id, user?.status]);


  const handleBackToLogin = () => {
    navigate("/login", { replace: true }); // immediate redirect
    void logout().catch((err) => {
      console.error("Logout failed:", err);
    });
  };

  // Documents for the viewer
  const documents = [
    {
      id: "1",
      name: "NIC Scan",
      type: (loaderData?.Documents?._types?.nicScan || "").includes("pdf") ? ("pdf" as const) : ("image" as const),
      url: loaderData?.Documents?.nicScan || "",
      uploadDate: new Date().toISOString(),
      size: "",
    },
    {
      id: "2",
      name: "University ID",
      type: (loaderData?.Documents?._types?.universityId || "").includes("pdf") ? ("pdf" as const) : ("image" as const),
      url: loaderData?.Documents?.universityId || "",
      uploadDate: new Date().toISOString(),
      size: "",
    },
    {
      id: "3",
      name: "Institute Letter",
      type: (loaderData?.Documents?._types?.instituteLetter || "").includes("pdf") ? ("pdf" as const) : ("image" as const),
      url: loaderData?.Documents?.instituteLetter || "",
      uploadDate: new Date().toISOString(),
      size: "",
    },
    {
      id: "4",
      name: "Police Report",
      type: (loaderData?.Documents?._types?.policeReport || "").includes("pdf") ? ("pdf" as const) : ("image" as const),
      url: loaderData?.Documents?.policeReport || "",
      uploadDate: new Date().toISOString(),
      size: "",
    },
    {
      id: "5",
      name: "Consent Letter",
      type: (loaderData?.Documents?._types?.consentLetter || "").includes("pdf") ? ("pdf" as const) : ("image" as const),
      url: loaderData?.Documents?.consentLetter || "",
      uploadDate: new Date().toISOString(),
      size: "",
    },
    {
      id: "6",
      name: "Profile Photo",
      type: "image" as const,
      url: loaderData?.Documents?.profilePhoto || "",
      uploadDate: new Date().toISOString(),
      size: "",
    },
    {
      id: "7",
      name: "BOC Bank Statement / Passbook",
      type: (loaderData?.Documents?._types?.bankPassbook || "").includes("pdf") ? ("pdf" as const) : ("image" as const),
      url: loaderData?.Documents?.bankPassbook || "",
      uploadDate: new Date().toISOString(),
      size: "",
    },
  ].filter((doc) => doc.url);

  const DetailItem = ({ label, value, icon: Icon }: { label: string; value: string; icon?: any }) => (
    <div className="flex flex-col space-y-1">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
        {Icon && <Icon className="w-3 h-3" />}
        {label}
      </span>
      <span className="text-sm font-medium text-gray-900 break-words bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
        {value || "—"}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <Header
        user={user ? { ...user, status: user.status || "Processing" } : null}
        profilePhoto={null}
        pageTitle="Submission Summary"
        onToggleSidebar={() => {}}
        sidebarOpen={false}
      />
      <div className="flex-grow py-12 px-4 sm:px-6 lg:px-8 bg-[#f8fafc]">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">

        {/* Success Header */}
        <div className="text-center space-y-4 mb-10">
          <div className="mx-auto w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center shadow-sm ring-8 ring-green-50">
            <CheckCircle className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Submission Received</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Your information has been successfully submitted for review.
              <br className="hidden sm:block" />
              Please verify your details below. This view is read-only.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Personal Information */}
          <Card className="border-t-4 border-t-blue-500 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <User className="h-5 w-5" />
                </div>
                <CardTitle size="md">Personal Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-5">
                <DetailItem label="Full Name" value={personal?.fullName} icon={User} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <DetailItem label="Name with Initials" value={personal?.Name || personal?.name || personal?.fullName} />
                  <DetailItem label="NIC Number" value={personal?.NIC} />
                </div>
                <DetailItem label="Address" value={personal?.address} icon={MapPin} />
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="border-t-4 border-t-purple-500 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                  <Phone className="h-5 w-5" />
                </div>
                <CardTitle size="md">Contact Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <DetailItem label="Mobile Number" value={personal?.Mobile_No} icon={Smartphone} />
                  <DetailItem label="Residence Number" value={personal?.Resident_No} icon={Phone} />
                </div>
                <DetailItem label="Email Address" value={personal?.email || loaderData?.TraineeUser?.email || user?.email} icon={Mail} />

                <div className="mt-6 pt-4 border-t border-gray-100">
                  <h4 className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-4">Emergency Contact</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <DetailItem label="Name" value={emergency?.name} />
                    <DetailItem label="Relationship" value={emergency?.relationship} />
                    <div className="sm:col-span-2">
                      <DetailItem label="Telephone" value={emergency?.telephone} icon={Phone} />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Training Information */}
          <Card className="border-t-4 border-t-green-500 shadow-md hover:shadow-lg transition-shadow lg:col-span-2">
            <CardHeader className="pb-4 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                  <Calendar className="h-5 w-5" />
                </div>
                <CardTitle size="md">Training Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <DetailItem label="Training Type" value={personal?.training_type} />
                <DetailItem label="Institute Name" value={personal?.instituteName} />
                <DetailItem label="Course" value={personal?.course} />
                <DetailItem
                  label="Start Date"
                  value={personal?.start_date ? new Date(personal.start_date).toLocaleDateString() : ""}
                  icon={Calendar}
                />
                <DetailItem label="Training Period" value={personal?.training_period} />
                <DetailItem label="Institute Address" value={personal?.address} icon={MapPin} />
              </div>
            </CardContent>
          </Card>

          {/* BOC Bank Details */}
          {(personal?.bank_accno || personal?.bank_branch) && (
            <Card className="border-t-4 border-t-amber-500 shadow-md hover:shadow-lg transition-shadow lg:col-span-2 animate-fade-in">
              <CardHeader className="pb-4 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                    <Landmark className="h-5 w-5" />
                  </div>
                  <CardTitle size="md">BOC Bank Details</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <DetailItem label="Account Holder Name" value={personal?.bank_accname} />
                  <DetailItem label="Account Number" value={personal?.bank_accno} />
                  <DetailItem label="Branch Name" value={personal?.bank_branch} />
                  <DetailItem label="Branch Code" value={personal?.bank_bno ? String(personal.bank_bno) : ""} />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Documents */}
          <Card className="border-t-4 border-t-orange-500 shadow-md hover:shadow-lg transition-shadow lg:col-span-2">
            <CardHeader className="pb-4 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                  <FolderOpen className="h-5 w-5" />
                </div>
                <CardTitle size="md">Uploaded Documents</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <DocumentViewer documents={documents} />
            </CardContent>
          </Card>

        </div>

        {/* Action Button */}
        <div className="flex justify-center pt-8 pb-12">
          <Button
            onClick={handleBackToLogin}
            variant="secondary"
            size="lg"
            className="shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            icon={LogIn}
          >
            Back to Login
          </Button>
        </div>
        </div>
      </div>
    </div>
  );
}
