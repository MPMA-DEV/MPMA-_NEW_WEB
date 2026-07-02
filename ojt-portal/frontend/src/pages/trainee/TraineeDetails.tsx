
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

  // Compute training status from start_date
  const trainingStatus = getTrainingStatus(personal?.start_date, personal?.end_date);

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
      name: "BOC Bank Statement / Passbook",
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
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center gap-4">
          {/* Profile Photo */}
          <div className="relative shrink-0">
            {documentsData?.profilePhoto ? (
              <img
                src={documentsData.profilePhoto}
                alt="Profile"
                className="w-14 h-14 rounded-full object-cover ring-2 ring-blue-100 shadow-sm"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center ring-2 ring-blue-100 shadow-sm">
                <span className="text-white font-bold text-lg">
                  {(personal?.Name || loaderData?.name || loaderData?.TraineeUser?.nickname || 'T')
                    .split(' ')
                    .map((n: string) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase()}
                </span>
              </div>
            )}
            <span className="absolute -bottom-0.5 -right-0.5 block h-3.5 w-3.5 rounded-full bg-emerald-400 ring-2 ring-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {personal?.Name || loaderData?.name || loaderData?.TraineeUser?.nickname || ''}
            </h1>
            <p className="text-base text-gray-500 font-medium">
              {personal?.instituteName || loaderData?.institute || ''}
            </p>
            {(loaderData?.ATT_NO || loaderData?.REG_NO) && (
              <div className="mt-2 flex flex-wrap gap-2">
                {loaderData?.ATT_NO && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                    ATT_NO: {loaderData.ATT_NO}
                  </span>
                )}
                {loaderData?.REG_NO && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
                    REG_NO: {loaderData.REG_NO}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        <Button
          onClick={handleEditRequest}
          variant={getButtonVariant()}
          icon={Edit}
          size="sm"
          className={getButtonClassName()}
        >
          {getButtonText()}
        </Button>
      </div>

      {/* Status Card */}
      <div className={`${trainingStatus === 'Active' ? 'bg-emerald-50 border-emerald-100' : trainingStatus === 'Inactive' ? 'bg-red-50 border-red-100' : 'bg-amber-50 border-amber-100'} border rounded-lg p-3 shadow-sm flex items-center`}>
        <span className="flex h-2.5 w-2.5 relative mr-2.5">
          {trainingStatus !== 'Inactive' && (
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${trainingStatus === 'Active' ? 'bg-emerald-400' : 'bg-amber-400'} opacity-75`}></span>
          )}
          <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${trainingStatus === 'Active' ? 'bg-emerald-500' : trainingStatus === 'Inactive' ? 'bg-red-500' : 'bg-amber-500'}`}></span>
        </span>
        <span className={`text-sm ${trainingStatus === 'Active' ? 'text-emerald-800' : trainingStatus === 'Inactive' ? 'text-red-800' : 'text-amber-800'} font-semibold tracking-wide`}>
          Training Status: {trainingStatus}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card color="blue">
          <CardHeader className="border-b border-blue-100/50 pb-3">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-blue-100 text-blue-600 rounded-md">
                <User className="h-4 w-4" />
              </div>
              <CardTitle size="sm">Personal Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-1">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                    Full Name
                  </label>
                  <p className="text-sm font-medium text-gray-900 break-words">
                    {personal?.fullName || loaderData?.name || loaderData?.TraineeUser?.nickname || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                    NIC Number
                  </label>
                  <p className="text-sm font-medium text-gray-900">
                    {personal?.NIC || loaderData?.nic || 'N/A'}
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                  Address
                </label>
                <p className="text-sm font-medium text-gray-900 flex items-start">
                  <MapPin className="h-3.5 w-3.5 mr-1.5 text-gray-400 mt-0.5 shrink-0" />
                  {personal?.address || 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card color="purple">
          <CardHeader className="border-b border-purple-100/50 pb-3">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-purple-100 text-purple-600 rounded-md">
                <Phone className="h-4 w-4" />
              </div>
              <CardTitle size="sm">Contact Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-1">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                    Mobile Number
                  </label>
                  <p className="text-sm font-medium text-gray-900 flex items-center">
                    <Phone className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                    {personal?.Mobile_No || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                    Residence Number
                  </label>
                  <p className="text-sm font-medium text-gray-900 flex items-center">
                    <Phone className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                    {personal?.Resident_No || 'N/A'}
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                  Email Address
                </label>
                <p className="text-sm font-medium text-gray-900 flex items-center">
                  <Mail className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                  {personal?.email || loaderData?.TraineeUser?.email || loaderData?.email || 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card color="orange">
          <CardHeader className="border-b border-orange-100/50 pb-3">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-orange-100 text-orange-600 rounded-md">
                <AlertCircle className="h-4 w-4" />
              </div>
              <CardTitle size="sm">Emergency Contact</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                  Name
                </label>
                <p className="text-sm font-medium text-gray-900">
                  {emergency?.name || 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                  Phone
                </label>
                <p className="text-sm font-medium text-gray-900">
                  {emergency?.telephone || 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                  Relationship
                </label>
                <p className="text-sm font-medium text-gray-900">
                  {emergency?.relationship || 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Training Information */}
        <Card color="green">
          <CardHeader className="border-b border-green-100/50 pb-3">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-green-100 text-green-600 rounded-md">
                <FileText className="h-4 w-4" />
              </div>
              <CardTitle size="sm">Training Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                  Training Type
                </label>
                <p className="text-sm font-medium text-gray-900">
                  {personal?.training_type || 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                  Institute
                </label>
                <p className="text-sm font-medium text-gray-900">
                  {personal?.instituteName || 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                  Course
                </label>
                <p className="text-sm font-medium text-gray-900">
                  {personal?.course || 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                  Start Date
                </label>
                <p className="text-sm font-medium text-gray-900 flex items-center">
                  <Calendar className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                  {personal?.start_date ? new Date(personal.start_date).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* BOC Bank Details */}
        {(personal?.bank_accno || personal?.bank_branch) && (
          <Card color="yellow">
            <CardHeader className="border-b border-yellow-100/50 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-yellow-100/80 text-yellow-700 rounded-md">
                  <Landmark className="h-4 w-4" />
                </div>
                <CardTitle size="sm" className="text-yellow-900">BOC Bank Details</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                    Account Holder Name
                  </label>
                  <p className="text-sm font-medium text-gray-900 break-words">
                    {personal?.bank_accname || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                    Account Number
                  </label>
                  <p className="text-sm font-medium text-gray-900">
                    {personal?.bank_accno || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                    Branch Name
                  </label>
                  <p className="text-sm font-medium text-gray-900 break-words">
                    {personal?.bank_branch || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                    Branch Code
                  </label>
                  <p className="text-sm font-medium text-gray-900">
                    {personal?.bank_bno ? String(personal.bank_bno) : "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Documents Section - Collapsible with Animation */}
      <Card className="overflow-hidden border-2 border-indigo-100 shadow-md rounded-xl bg-gradient-to-br from-indigo-50 via-blue-50 to-indigo-50">
        <button
          onClick={() => setIsDocumentsExpanded(!isDocumentsExpanded)}
          className="w-full text-left"
        >
          <CardHeader className="py-4 bg-gradient-to-r from-indigo-50 to-blue-50 cursor-pointer hover:from-indigo-100 hover:to-blue-100 transition-all duration-300 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl shadow-sm">
                  <FolderOpen className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle size="sm" className="text-indigo-900">Documents</CardTitle>
                  <p className="text-xs text-indigo-500 mt-0.5">
                    {isDocumentsExpanded ? "Click to collapse" : "Click to view uploaded documents"}
                  </p>
                </div>
              </div>
              <ChevronDown
                className={`h-5 w-5 text-indigo-400 transition-transform duration-300 ${isDocumentsExpanded ? "rotate-180" : ""
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
            <CardContent className="p-4 m-3 bg-white/60 rounded-xl">
              {isLoadingDocuments ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-indigo-400" />
                  <span className="ml-2 text-sm text-indigo-500">Loading documents...</span>
                </div>
              ) : documents.length > 0 ? (
                <DocumentViewer documents={documents} />
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-indigo-300">
                  <FolderOpen className="h-10 w-10 mb-2" />
                  <p className="text-sm">No documents available</p>
                </div>
              )}
            </CardContent>
          </div>
        </div>
      </Card>
    </div>
  );
}
