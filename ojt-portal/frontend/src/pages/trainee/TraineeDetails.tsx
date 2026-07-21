
import { useState, useEffect } from "react";
import {
  Edit,
  FileText,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  AlertCircle,
  FolderOpen,
  ChevronDown,
  Loader2,
  Landmark,
  Smartphone,
} from "lucide-react";
import { useToastHelpers } from "../../hooks/useToast";
import { DocumentViewer } from "../../components/ui/DocumentViewer";
import { useLoaderData, useNavigate } from "react-router-dom";
import type { LoaderData } from "../../loaders";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { useAuth } from "../../contexts/AuthContext";
import { getTraineeDocuments } from "../../loaders/traineeLoaders";

// Helper function to compute training status from start_date
const getTrainingStatus = (startDate: string | Date | null | undefined, endDate?: string | Date | null | undefined): "Pending" | "Active" | "Inactive" => {

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to start of day

  if (endDate) {
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);
    if (today > end) return "Inactive";
  }

  if (!startDate) return "Pending";

  if (startDate) {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    if (today < start) return "Pending";
  }

  return "Active";
};

const DetailItem = ({ label, value }: any) => (
  <div>
    <span className="block text-sm font-medium text-gray-500 mb-1">
      {label}
    </span>
    <div className="text-sm font-medium text-gray-900">
      {value || "—"}
    </div>
  </div>
);

export default function TraineeDetails() {
  const { success } = useToastHelpers();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Mock data - in real app this would come from API
  const loaderData = useLoaderData() as LoaderData<any>;
  
  const defaultPersonal = {
    fullName: "John Doe",
    Name: "John Doe",
    NIC: "200012345678",
    address: "123 Galle Road, Colombo 03",
    Mobile_No: "077 123 4567",
    Resident_No: "011 234 5678",
    email: "johndoe@example.com",
    training_type: "Industrial Training",
    instituteName: "University of Colombo",
    course: "Software Engineering",
    start_date: "2024-01-01T00:00:00.000Z",
    end_date: "2024-06-30T00:00:00.000Z",
    bank_accname: "J DOE",
    bank_accno: "1234567890",
    bank_branch: "Colombo Main",
    bank_bno: "001",
    edit: "NOEDIT"
  };

  const defaultEmergency = {
    name: "Jane Doe",
    telephone: "071 987 6543",
    relationship: "Mother"
  };

  const personalData = loaderData?.PersonalInfo || loaderData?.personal_info;
  const personal = (personalData && Object.keys(personalData).length > 0) ? personalData : defaultPersonal;

  const emergencyData = loaderData?.EmergencyContact || loaderData?.Emegency_contact;
  const emergency = (emergencyData && Object.keys(emergencyData).length > 0) ? emergencyData : defaultEmergency;

  // Compute training status - requested to just be "Active"
  const trainingStatus = "Active";

  // Track edit status from loader data - can be "NOEDIT", "REQEST", or "EDIT"
  const [editStatus, setEditStatus] = useState<string>(personal?.edit || "NOEDIT");

  // Documents section state
  const [isDocumentsExpanded, setIsDocumentsExpanded] = useState(false);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
  const [documentsData, setDocumentsData] = useState<any>(null);
  const [documentsLoaded, setDocumentsLoaded] = useState(false);

  useEffect(() => {
    setEditStatus(personal?.edit || "NOEDIT");
  }, [personal?.edit]);

  // Load documents on mount so profile photo is available in the header
  useEffect(() => {
    const loadDocuments = async () => {
      if (!documentsLoaded && !isLoadingDocuments) {
        setIsLoadingDocuments(true);
        try {
          const userId = loaderData?.userId || user?.id;
          if (userId) {
            const docs = await getTraineeDocuments(userId);
            setDocumentsData(docs);
            setDocumentsLoaded(true);
          }
        } catch (err) {
          console.error("Failed to load documents:", err);
        } finally {
          setIsLoadingDocuments(false);
        }
      }
    };
    loadDocuments();
  }, [documentsLoaded, isLoadingDocuments, loaderData?.userId, user?.id]);

  // Build documents array from loaded data
  const documents = documentsData ? [
    {
      id: "1",
      name: "NIC Scan",
      type: (documentsData?._types?.nicScan || "").includes("pdf") ? ("pdf" as const) : ("image" as const),
      url: documentsData?.nicScan || "",
      uploadDate: new Date().toISOString(),
      size: "",
    },
    {
      id: "2",
      name: "University ID",
      type: (documentsData?._types?.universityId || "").includes("pdf") ? ("pdf" as const) : ("image" as const),
      url: documentsData?.universityId || "",
      uploadDate: new Date().toISOString(),
      size: "",
    },
    {
      id: "3",
      name: "Institute Letter",
      type: (documentsData?._types?.instituteLetter || "").includes("pdf") ? ("pdf" as const) : ("image" as const),
      url: documentsData?.instituteLetter || "",
      uploadDate: new Date().toISOString(),
      size: "",
    },
    {
      id: "4",
      name: "Police Report",
      type: (documentsData?._types?.policeReport || "").includes("pdf") ? ("pdf" as const) : ("image" as const),
      url: documentsData?.policeReport || "",
      uploadDate: new Date().toISOString(),
      size: "",
    },
    {
      id: "5",
      name: "Consent Letter",
      type: (documentsData?._types?.consentLetter || "").includes("pdf") ? ("pdf" as const) : ("image" as const),
      url: documentsData?.consentLetter || "",
      uploadDate: new Date().toISOString(),
      size: "",
    },
    {
      id: "6",
      name: "Profile Photo",
      type: "image" as const,
      url: documentsData?.profilePhoto || "",
      uploadDate: new Date().toISOString(),
      size: "",
    },
    {
      id: "7",
      name: "BOC Bank Statement or passbook (Only Students of Government Universities/Technical Institute)",
      type: (documentsData?._types?.bankPassbook || "").includes("pdf") ? ("pdf" as const) : ("image" as const),
      url: documentsData?.bankPassbook || "",
      uploadDate: new Date().toISOString(),
      size: "",
    },
  ].filter((doc) => doc.url) : [];

  const handleEditRequest = () => {
    if (editStatus === "REQEST") {
      // Already requested, just show info
      success("Your edit request is pending admin approval.");
      return;
    }

    // For NOEDIT (and legacy EDIT), navigate to edit page directly
    navigate("/trainee/edit-details");
  };

  // Determine button styling based on edit status
  const getButtonVariant = () => {
    if (editStatus === "REQEST") return "outline";
    return "primary";
  };

  const getButtonClassName = () => {
    if (editStatus === "REQEST") return "shrink-0 bg-amber-100 hover:bg-amber-200 border-amber-400 text-amber-700";
    return "shrink-0 bg-blue-600 hover:bg-blue-700 border-blue-600";
  };

  const getButtonText = () => {
    if (editStatus === "REQEST") return "Requested";
    return "Edit Details";
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-blue-700 rounded-xl shadow-sm p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="flex items-center gap-5 z-10">
          {/* Profile Photo */}
          <div className="relative shrink-0">
            {documentsData?.profilePhoto ? (
              <img
                src={documentsData.profilePhoto}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover ring-4 ring-blue-600/50 shadow-md"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-blue-800 flex items-center justify-center ring-4 ring-blue-600/50 shadow-md">
                <span className="text-white font-bold text-2xl">
                  {(personal?.fullName || personal?.name || loaderData?.name || loaderData?.TraineeUser?.nickname || 'T')
                    .split(' ')
                    .map((n: string) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase()}
                </span>
              </div>
            )}
            <span className="absolute bottom-0 right-0 block h-4 w-4 rounded-full bg-emerald-400 ring-2 ring-blue-700" />
          </div>
          <div>
            <div className="flex items-center flex-wrap gap-3">
              <h1 className="text-2xl font-bold text-white">
                {personal?.fullName || personal?.name || loaderData?.name || loaderData?.TraineeUser?.nickname || ''}
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                {trainingStatus}
              </span>
            </div>
            <p className="text-sm text-blue-100 font-medium mt-1">
              {personal?.instituteName || loaderData?.institute || ''}
            </p>
          </div>
        </div>
        <button
          onClick={handleEditRequest}
          className="z-10 flex items-center text-sm font-medium text-white hover:text-blue-200 transition-colors"
        >
          <Edit className="w-4 h-4 mr-2" />
          Modify Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card className="shadow-sm border border-gray-200">
          <CardHeader className="pb-4 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-gray-500" />
              <CardTitle size="md">Personal Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-5">
              <DetailItem label="Full Name" value={personal?.fullName || loaderData?.name || loaderData?.TraineeUser?.nickname} icon={User} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <DetailItem label="Name with Initials" value={personal?.Name || personal?.name || personal?.fullName || loaderData?.name || loaderData?.TraineeUser?.nickname} />
                <DetailItem label="NIC Number" value={loaderData?.TraineeUser?.NIC} />
              </div>
              <DetailItem label="Address" value={personal?.address} icon={MapPin} />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="shadow-sm border border-gray-200">
          <CardHeader className="pb-4 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-gray-500" />
              <CardTitle size="md">Contact Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <DetailItem label="Mobile Number" value={personal?.Mobile_No} icon={Smartphone} />
                <DetailItem label="Residence Number" value={personal?.Resident_No} icon={Phone} />
              </div>
              <DetailItem label="Email Address" value={loaderData?.TraineeUser?.email || loaderData?.email || user?.email} icon={Mail} />

              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-sm font-semibold text-gray-900 mb-4">
                  Emergency Contact
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                  <DetailItem label="Name" value={emergency?.ec_name} />
                  <DetailItem label="Relationship" value={emergency?.ec_relationship} />
                </div>
                <DetailItem label="Telephone" value={emergency?.ec_telephone} icon={Phone} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Training Information */}
<Card className="shadow-sm border border-border/80 lg:col-span-2">
  <CardHeader className="pb-4 border-b border-border/50">
    <div className="flex items-center gap-3">
      <Calendar className="h-5 w-5 text-muted-foreground shrink-0" aria-hidden="true" />
      <CardTitle size="md">Training Information</CardTitle>
    </div>
  </CardHeader>
  <CardContent className="pt-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[
        { label: "Institute Name", value: personal?.instituteName },
        { label: "Course", value: personal?.course },
        { label: "Training Period", value: personal?.period ?? personal?.training_period },
      ].map(({ label, value }) => (
        <DetailItem key={label} label={label} value={value || "N/A"} />
      ))}
    </div>
  </CardContent>
</Card>

       {/* BOC Bank Details */}
{(personal?.bank_accno || personal?.bank_branch) && (
  <Card className="overflow-hidden border border-border/60 shadow-xs transition-all hover:shadow-md lg:col-span-2 animate-fade-in">
    <CardHeader className="bg-muted/30 px-6 py-4 border-b border-border/40">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
            <Landmark className="h-4 w-4" aria-hidden="true" />
          </div>
          <CardTitle size="md" className="font-semibold text-foreground tracking-tight">
            BOC Bank Details
          </CardTitle>
        </div>
        
      </div>
    </CardHeader>

    <CardContent className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Account Holder Name", value: personal?.bank_accname },
          { label: "Account Number", value: personal?.bank_accno },
          { label: "Branch Name", value: personal?.bank_branch },
          { label: "Branch Code", value: personal?.bank_bno != null ? String(personal.bank_bno) : null },
        ].map(({ label, value }) => (
          <DetailItem key={label} label={label} value={value || "N/A"} />
        ))}
      </div>
    </CardContent>
  </Card>
)}
        {/* Documents Section */}
        <Card className="shadow-sm border border-gray-200 rounded-xl bg-white lg:col-span-2 flex flex-col h-full">
          <button
            onClick={() => setIsDocumentsExpanded(!isDocumentsExpanded)}
            className="w-full text-left"
          >
            <CardHeader className="py-4 cursor-pointer hover:bg-gray-50 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FolderOpen className="h-5 w-5 text-gray-500" />
                  <div>
                    <CardTitle size="sm" className="text-gray-900">Documents</CardTitle>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {isDocumentsExpanded ? "Click to collapse" : "Click to view uploaded documents"}
                    </p>
                  </div>
                </div>
                <ChevronDown
                  className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${isDocumentsExpanded ? "rotate-180" : ""
                    }`}
                />
              </div>
            </CardHeader>
          </button>
          <div
            className={`grid transition-all duration-300 ease-in-out ${isDocumentsExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
          >
            <div className="overflow-hidden">
              <CardContent className="p-4 m-3">
                {isLoadingDocuments ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                    <span className="ml-2 text-sm text-gray-500">Loading documents...</span>
                  </div>
                ) : documents.length > 0 ? (
                  <DocumentViewer documents={documents} />
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                    <FolderOpen className="h-10 w-10 mb-2" />
                    <p className="text-sm">No documents available</p>
                  </div>
                )}
              </CardContent>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
