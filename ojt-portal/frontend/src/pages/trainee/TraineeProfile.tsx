import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useOutletContext, useLocation } from "react-router-dom";
import api from "../../api";
import { useAuth } from "../../contexts/AuthContext";
import {
  Camera,
  Save,
  Eye,
  EyeOff,
  User,
  Lock,
  Bell,
  CreditCard,
  Building,
  Hash,
  Mail,
  Phone,
  Shield,
  ChevronRight,
  CheckCircle2,
  X,
} from "lucide-react";
import {
  ValidatedInput,
  ValidatedSelect,
} from "../../components/ui/FormField";
import { useFormValidation } from "../../hooks/useFormValidation";
import { useToastHelpers } from "../../hooks/useToast";
import { ConfirmationModal } from "../../components/ui/ConfirmationModal";
import {
  profileUpdateSchema,
  bankDetailsSchema,
  passwordChangeSchema,
  MAX_FILE_SIZE_MB,
  type ProfileUpdateFormData,
  type BankDetailsFormData,
  type PasswordChangeFormData,
} from "../../lib/validations";
import Button from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

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

export default function TraineeProfile() {
  const { user, updateUser } = useAuth();
  const { profilePhoto, refreshProfilePhoto, canViewBankDetails } = useOutletContext<{ profilePhoto: string | null, refreshProfilePhoto?: (localBlobUrl?: string) => void, canViewBankDetails?: boolean }>();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("profile");
  const [isUploading, setIsUploading] = useState(false);
  const [isPhotoViewOpen, setIsPhotoViewOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [displayStatus, setDisplayStatus] = useState<"Pending" | "Active" | "Inactive" | "Unknown">("Unknown");

  // Lock body scroll when photo viewer is open
  useEffect(() => {
    if (isPhotoViewOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isPhotoViewOpen]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    // Validate type and size
    if (!file.type.startsWith('image/')) {
      error("Please upload an image file");
      return;
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      error(`Image size should be less than ${MAX_FILE_SIZE_MB}MB`);
      return;
    }

    const formData = new FormData();
    formData.append("personalDetails[profilePhoto]", file);

    try {
      setIsUploading(true);
      const response = await api.post(`/api/profile/${user.id}/photo`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob'
      });
      success("Profile photo updated successfully!");

      // Create blob URL from the streamed response for immediate preview
      const blobUrl = URL.createObjectURL(response.data);
      refreshProfilePhoto?.(blobUrl);

      setIsUploading(false);
    } catch (e) {
      console.error(e);
      error("Failed to upload profile photo");
      setIsUploading(false);
    }
  };

  // Handle deep linking from header dropdown
  useEffect(() => {
    if (location.state && (location.state as any).activeTab) {
      setActiveTab((location.state as any).activeTab);
    }
  }, [location.state]);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { success, error } = useToastHelpers();

  const [profileData, setProfileData] = useState<ProfileUpdateFormData>({
    name: user?.username || "",
    email: user?.email || "",
    phone: "",
  });

  // Fetch phone number, bank details, and compute training status from API on mount
  useEffect(() => {
    const fetchPersonalInfo = async () => {
      if (!user?.id) return;
      try {
        const res = await api.get(`api/trainee/trainee_details/${user.id}`);
        const responseData = res?.data || {};
        // The API returns the TraineeUser object with the associated TraineeDetails
        const personalInfo = responseData.trainee_detail || responseData.TraineeDetail || responseData.trainee_details || responseData.TraineeDetails || {};
        const pendingDetails = responseData.PendingDetails;

        // Set edit status
        if (personalInfo?.edit) {
          setEditStatus(personalInfo.edit);
        }

        if (personalInfo?.Mobile_No) {
          setProfileData(prev => ({ ...prev, phone: personalInfo.Mobile_No }));
        }

        const traineeUser = responseData;
        const dbEmail = personalInfo?.email || traineeUser?.email || user?.email;
        if (dbEmail) {
          setProfileData(prev => ({ ...prev, email: dbEmail }));
        }
        // Compute training status from start_date (override with Active if user account is Active)
        if (user?.status === "Active") {
          setDisplayStatus("Active");
        } else {
          setDisplayStatus(getTrainingStatus(personalInfo?.start_date, personalInfo?.end_date));
        }

        // Load bank details - prioritize pending details if available
        // If editStatus is REQUEST, pendingDetails should be present
        const sourceData = pendingDetails || personalInfo;

        if (sourceData?.bank_accname || sourceData?.bank_accno || sourceData?.bank_bno) {
          setBankDetails(prev => ({
            ...prev,
            accountHolderName: sourceData.bank_accname || "",
            accountNo: sourceData.bank_accno || "",
            branchCode: sourceData.bank_bno ? String(sourceData.bank_bno) : "",
          }));
        }
      } catch (e) {
        console.error("Failed to fetch personal info:", e);
      }
    };
    fetchPersonalInfo();
  }, [user?.id]);

  // Keep profile data in sync when user object updates (e.g., after refresh)
  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        name: user.username || prev.name,
        email: user.email || prev.email,
      }));
    }
  }, [user?.username, user?.email]);

  const [bankDetails, setBankDetails] = useState<BankDetailsFormData>({
    accountNo: "",
    branchCode: "",
    accountHolderName: "",
    bankName: "Bank of Ceylon (BOC)",
  });

  const [editStatus, setEditStatus] = useState<string>("NOEDIT");

  const [passwordData, setPasswordData] = useState<PasswordChangeFormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notifications, setNotifications] = useState({
    notifyChat: user?.notifyChat ?? true,
    notifyPayment: user?.notifyPayment ?? true,
    notifyHoliday: user?.notifyHoliday ?? true,
  });

  // Keep state in sync if user object updates from context/auth refresh
  useEffect(() => {
    if (user) {
      setNotifications({
        notifyChat: user.notifyChat ?? true,
        notifyPayment: user.notifyPayment ?? true,
        notifyHoliday: user.notifyHoliday ?? true,
      });
    }
  }, [user]);

  // Permission: Only show Bank Details if trainee is Active and ATT_NO starts with '9'
  // Now using context value from TraineeLayout - no API call needed
  const allowBank = canViewBankDetails !== false;

  // Validation hooks
  const profileValidation = useFormValidation({
    schema: profileUpdateSchema,
    mode: "onChange",
    onSubmit: async (data: ProfileUpdateFormData) => {
      const confirmed = await ConfirmationModal.show({
        title: "Update Profile",
        message: "Are you sure you want to update your profile information?",
        confirmText: "Update Profile",
        cancelText: "Cancel",
      });

      if (!confirmed || !user?.id) return;

      try {
        const payload = {
          username: data.name,
          email: data.email,
          phone: data.phone,
        };
        await api.post(`/api/profile/${user.id}`, payload);
        updateUser({ username: data.name, nickname: data.name, email: data.email });
        success("Profile updated successfully!");
      } catch (e) {
        error("Failed to update profile. Please try again.");
      }
    },
  });

  const bankValidation = useFormValidation({
    schema: bankDetailsSchema,
    mode: "onChange",
    onSubmit: async (data: BankDetailsFormData) => {
      const confirmed = await ConfirmationModal.show({
        title: "Save Bank Details",
        message:
          "Are you sure you want to save these bank details? This information will be used for payment processing.",
        confirmText: "Save Details",
        cancelText: "Cancel",
      });

      if (confirmed) {
        try {
          const payload = {
            bank_accname: data.accountHolderName,
            bank_accno: data.accountNo,
            bank_bno: data.branchCode,
          };
          console.log("Saving bank details:", payload, "for user:", user?.id);
          const res = await api.post(`/api/profile/${user?.id}`, payload);

          if (res.data?.edit === "REQEST") {
            setEditStatus("REQEST"); // Update local state immediately
            success("Edit request submitted! Details pending admin approval.");
          } else {
            success("Bank details saved successfully!");
          }

        } catch (e: any) {
          console.error("Bank details save error:", e?.response?.data || e);
          error(e?.response?.data?.message || "Failed to save bank details. Please try again.");
        }
      }
    },
  });

  const passwordValidation = useFormValidation({
    schema: passwordChangeSchema,
    mode: "onChange",
    onSubmit: async (data: PasswordChangeFormData) => {
      const confirmed = await ConfirmationModal.showWarning({
        title: "Change Password",
        message:
          "Are you sure you want to change your password? You will need to use the new password for future logins.",
        confirmText: "Change Password",
        cancelText: "Cancel",
      });

      if (!confirmed || !user?.id) return;

      try {
        await api.post(`/api/profile/change_password/${user.id}`, {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        });

        success("Password changed successfully!");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } catch (err: any) {
        const msg: string | undefined = err?.response?.data?.message;
        error(msg || "Failed to change password. Please check your inputs.");
      }
    },
  });

  const handleNotificationSave = async () => {
    const confirmed = await ConfirmationModal.show({
      title: "Save Preferences",
      message: "Are you sure you want to save these notification preferences?",
      confirmText: "Save",
      cancelText: "Cancel",
    });

    if (confirmed && user?.id) {
      try {
        const res = await api.post(`/api/profile/${user.id}`, notifications);
        // Use the actual saved DB values from the response
        const saved = {
          notifyChat: res.data.notifyChat ?? notifications.notifyChat,
          notifyPayment: res.data.notifyPayment ?? notifications.notifyPayment,
          notifyHoliday: res.data.notifyHoliday ?? notifications.notifyHoliday,
        };
        setNotifications(saved);
        updateUser(saved);
        success("Notification preferences saved successfully!");
      } catch (e) {
        // Revert toggles to what the user context actually has (last known good state)
        setNotifications({
          notifyChat: user.notifyChat ?? true,
          notifyPayment: user.notifyPayment ?? true,
          notifyHoliday: user.notifyHoliday ?? true,
        });
        error("Failed to save notification preferences");
      }
    }
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: value }));
  };

  const tabs = [
    { id: "profile", name: "Profile Settings", icon: User, desc: "Manage your personal info" },
    ...(allowBank
      ? [{ id: "banking", name: "Bank Details", icon: CreditCard, desc: "Update payment methods" }]
      : []),
    { id: "notifications", name: "Notifications", icon: Bell, desc: "Configure alert preferences" },
  ];

  useEffect(() => {
    if (allowBank === false && activeTab === "banking") {
      setActiveTab("profile");
    }
  }, [allowBank, activeTab]);

  const handleProfileFieldChange = (
    field: keyof ProfileUpdateFormData,
    value: string
  ) => {
    const newData = { ...profileData, [field]: value };
    setProfileData(newData);
    profileValidation.handleFieldChange(field as string, value, newData);
  };

  const handleBankFieldChange = (
    field: keyof BankDetailsFormData,
    value: string
  ) => {
    const newData = { ...bankDetails, [field]: value };
    setBankDetails(newData);
    bankValidation.handleFieldChange(field as string, value, newData);
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Enhanced Profile Header */}
      <div className="relative rounded-3xl overflow-hidden bg-white border border-gray-200 shadow-sm">
        {/* Decorative Background */}
        <div className="h-16 md:h-24 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] opacity-30"></div>
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-purple-500 opacity-20 rounded-full blur-3xl"></div>
        </div>

        <div className="px-4 md:px-10 pb-4 md:pb-6">
          <div className="flex flex-col md:flex-row items-center md:items-end -mt-4 mb-2 relative z-10">
            {/* Avatar Section */}
            {/* Avatar Section */}
            <div className="relative group shrink-0">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              <div
                onClick={() => profilePhoto && setIsPhotoViewOpen(true)}
                className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white p-1 md:p-1.5 shadow-xl ring-1 ring-black/5 ${profilePhoto ? 'cursor-zoom-in hover:brightness-95 transition-all' : ''}`}
              >
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-4xl font-bold text-gray-500 border border-gray-100 overflow-hidden">
                  {profilePhoto ? (
                    <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    user?.username?.charAt(0).toUpperCase() || <User className="w-12 h-12 opacity-40" />
                  )}
                </div>
              </div>
              <button
                onClick={() => !isUploading && fileInputRef.current?.click()}
                disabled={isUploading}
                className={`absolute bottom-2 right-[-6px] p-2 bg-white text-gray-600 rounded-full shadow-md border border-gray-100 transition-all ${isUploading ? 'cursor-wait opacity-70' : 'hover:text-blue-600 hover:bg-blue-50 cursor-pointer group-hover:scale-110'}`}
              >
                <Camera className={`w-4 h-4 ${isUploading ? 'animate-pulse text-blue-500' : ''}`} />
              </button>
            </div>

            {/* Photo Viewer Modal */}
            {isPhotoViewOpen && profilePhoto && createPortal(
              <div
                className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
                onClick={() => setIsPhotoViewOpen(false)}
              >
                <button
                  onClick={() => setIsPhotoViewOpen(false)}
                  className="absolute top-4 right-4 p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
                <img
                  src={profilePhoto}
                  alt="Profile Full View"
                  className="max-w-full max-h-[90vh] rounded-lg shadow-2xl object-contain animate-in zoom-in-95 duration-200"
                  onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
                />
              </div>,
              document.body
            )}

            {/* Info Section */}
            <div className="mt-2 md:mt-0 md:pt-4 md:ml-6 flex-1 w-full text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4">
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">{user?.username}</h1>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-6 text-sm text-gray-500 mt-0.5 font-medium">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-1.5 text-gray-400" />
                      {user?.email}
                    </div>
                    <div className="hidden md:block w-1 h-1 bg-gray-300 rounded-full"></div>
                    <div className="flex items-center">
                      <Building className="w-4 h-4 mr-1.5 text-gray-400" />
                      Trainee
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <span className={`px-3 py-1.5 rounded-full text-sm font-semibold border flex items-center shadow-sm ${displayStatus === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    displayStatus === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      displayStatus === 'Inactive' ? 'bg-red-50 text-red-700 border-red-200' :
                        'bg-gray-50 text-gray-700 border-gray-200'
                    }`}>
                    <span className={`w-2 h-2 rounded-full mr-2 ${displayStatus === 'Active' ? 'bg-emerald-500' :
                      displayStatus === 'Pending' ? 'bg-amber-500' :
                        displayStatus === 'Inactive' ? 'bg-red-500' :
                          'bg-gray-400'
                      }`}></span>
                    {displayStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-3 lg:sticky lg:top-24 lg:self-start space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-2">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all duration-200 group text-left ${isActive
                      ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg transition-colors ${isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200 group-hover:text-gray-700'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{tab.name}</p>
                      </div>
                    </div>
                    {isActive && <ChevronRight className="w-4 h-4 text-blue-500" />}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9">
          <Card className="border border-gray-200 shadow-sm overflow-hidden">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  profileValidation.handleSubmit(profileData);
                }}
                className="p-4 md:p-5 space-y-6"
              >
                <div className="border-b border-gray-100 pb-6">
                  <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
                  <p className="text-gray-500 text-sm mt-1">Manage your public profile and contact details.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <ValidatedInput
                    label="Username"
                    type="text"
                    required
                    icon={User}
                    value={profileData.name}
                    onChange={(e) => handleProfileFieldChange("name", e.target.value)}
                    onBlur={(e) => profileValidation.handleFieldBlur("name", e.target.value, profileData)}
                    error={profileValidation.getFieldError("name")}
                    placeholder="Enter your username"
                    readOnly
                  />

                  <ValidatedInput
                    label="Phone Number"
                    type="tel"
                    required
                    icon={Phone}
                    value={profileData.phone}
                    onChange={(e) => handleProfileFieldChange("phone", e.target.value)}
                    onBlur={(e) => profileValidation.handleFieldBlur("phone", e.target.value, profileData)}
                    error={profileValidation.getFieldError("phone")}
                    placeholder="Enter your phone number"
                  />

                  <div className="md:col-span-2">
                    <ValidatedInput
                      label="Email Address"
                      type="email"
                      required
                      icon={Mail}
                      value={profileData.email}
                      onChange={(e) => handleProfileFieldChange("email", e.target.value)}
                      onBlur={(e) => profileValidation.handleFieldBlur("email", e.target.value, profileData)}
                      error={profileValidation.getFieldError("email")}
                      placeholder="Enter your email address"
                      readOnly
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end pt-6 border-t border-gray-100">
                  <Button
                    type="submit"
                    loading={profileValidation.isSubmitting}
                    icon={Save}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-sm shadow-md shadow-blue-500/20"
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            )}

            {/* Bank Details Tab */}
            {activeTab === "banking" && allowBank && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  bankValidation.handleSubmit(bankDetails);
                }}
                className="p-4 md:p-5 space-y-6"
              >
                <div className="border-b border-gray-100 pb-6">
                  <h2 className="text-xl font-bold text-gray-900">Bank Account Details</h2>
                  <p className="text-gray-500 text-sm mt-1">Manage your bank account for payment transfers.</p>
                </div>

                <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-5 flex gap-4">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg shrink-0 h-fit">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-blue-900">Payment Information</h4>
                    <p className="text-sm text-blue-700/90 mt-1 leading-relaxed">
                      Your bank details are used for monthly payment transfers.
                      Please ensure the bank account holder name match your registered name.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="md:col-span-2">
                    <ValidatedSelect
                      label="Bank Name"
                      required
                      value={bankDetails.bankName}
                      disabled
                      options={[{ value: "Bank of Ceylon", label: "Bank of Ceylon (BOC)" }]}
                      className="bg-gray-50"
                    />
                  </div>

                  <ValidatedInput
                    label="Account Holder Name"
                    icon={User}
                    value={bankDetails.accountHolderName}
                    onChange={(e) => handleBankFieldChange("accountHolderName", e.target.value)}
                    onBlur={(e) => bankValidation.handleFieldBlur("accountHolderName", e.target.value, bankDetails)}
                    error={bankValidation.getFieldError("accountHolderName")}
                    required
                    readOnly={editStatus === "REQEST"}
                    className="bg-gray-50/50 focus:bg-white"
                    placeholder="Account holder name"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <ValidatedInput
                      label="Account Number"
                      icon={CreditCard}
                      value={bankDetails.accountNo}
                      onChange={(e) => handleBankFieldChange("accountNo", e.target.value)}
                      onBlur={(e) => bankValidation.handleFieldBlur("accountNo", e.target.value, bankDetails)}
                      error={bankValidation.getFieldError("accountNo")}
                      required
                      readOnly={editStatus === "REQEST"}
                      className="bg-gray-50/50 focus:bg-white font-mono"
                      placeholder="Account no"
                    />
                    <ValidatedInput
                      label="Branch Code"
                      icon={Hash}
                      value={bankDetails.branchCode}
                      onChange={(e) => handleBankFieldChange("branchCode", e.target.value)}
                      onBlur={(e) => bankValidation.handleFieldBlur("branchCode", e.target.value, bankDetails)}
                      error={bankValidation.getFieldError("branchCode")}
                      required
                      readOnly={editStatus === "REQEST"}
                      className="bg-gray-50/50 focus:bg-white font-mono"
                      placeholder="Branch code"
                    />
                  </div>
                </div>

                {editStatus === "REQEST" && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm flex items-start gap-2">
                    <div className="p-1 bg-yellow-100 rounded shrink-0">
                      <Shield className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-semibold">Details submitted for admin approve</p>
                      <p className="opacity-90 mt-1">Your recent changes are pending review. The form above shows your pending updates.</p>
                    </div>
                  </div>
                )}

                <div className="flex justify-end pt-6 border-t border-gray-100">
                  <Button
                    type="submit"
                    loading={bankValidation.isSubmitting}
                    variant="success"
                    icon={Save}
                    disabled={editStatus === "REQEST"} // Optional: Disable saving if pending? User requirement unclear "if edit status = REQEST those input boxes auto fild", doesn't explicitly forbid re-submitting. But usually pending means wait.
                    className={`bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 text-sm shadow-md shadow-emerald-500/20 ${editStatus === "REQEST" ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {editStatus === "REQEST" ? "Request Pending" : "Save Bank Details"}
                  </Button>
                </div>
              </form>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  passwordValidation.handleSubmit(passwordData);
                }}
                className="p-4 md:p-5 space-y-6"
              >
                <div className="border-b border-gray-100 pb-6">
                  <h2 className="text-xl font-bold text-gray-900">Security Settings</h2>
                  <p className="text-gray-500 text-sm mt-1">Update your password to keep your account secure.</p>
                </div>

                <div className="max-w-lg space-y-6">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-gray-700">Current Password</label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                        className={`block w-full pl-4 pr-10 py-1.5 rounded-lg border transition-all bg-gray-50/50 focus:bg-white outline-none ${passwordValidation.getFieldError("currentPassword")
                          ? "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                          : "border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          }`}
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {passwordValidation.getFieldError("currentPassword") && (
                      <p className="text-xs text-red-600 font-medium">{passwordValidation.getFieldError("currentPassword")}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-gray-700">New Password</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                        className={`block w-full pl-4 pr-10 py-1.5 rounded-lg border transition-all bg-gray-50/50 focus:bg-white outline-none ${passwordValidation.getFieldError("newPassword")
                          ? "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                          : "border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          }`}
                        placeholder="Enter new password"
                      />
                      <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600" onClick={() => setShowNewPassword(!showNewPassword)}>
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {passwordValidation.getFieldError("newPassword") && (
                      <p className="text-xs text-red-600 font-medium">{passwordValidation.getFieldError("newPassword")}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-gray-700">Confirm New Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className={`block w-full pl-4 pr-10 py-1.5 rounded-lg border transition-all bg-gray-50/50 focus:bg-white outline-none ${passwordValidation.getFieldError("confirmPassword")
                          ? "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                          : "border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          }`}
                        placeholder="Confirm new password"
                      />
                      <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {passwordValidation.getFieldError("confirmPassword") && (
                      <p className="text-xs text-red-600 font-medium">{passwordValidation.getFieldError("confirmPassword")}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-start pt-6 border-t border-gray-100">
                  <Button
                    type="submit"
                    loading={passwordValidation.isSubmitting}
                    icon={Lock}
                    className="bg-gray-900 hover:bg-black text-white px-4 py-2 text-sm"
                  >
                    Update Password
                  </Button>
                </div>
              </form>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="p-4 md:p-5 space-y-6">
                <div className="border-b border-gray-100 pb-6">
                  <h2 className="text-xl font-bold text-gray-900">Notification Preferences</h2>
                  <p className="text-gray-500 text-sm mt-1">Choose how and when you want to be notified.</p>
                </div>

                <div className="space-y-3">
                  {/* Chat Notifications */}
                  <label className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${notifications.notifyChat ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                        <Bell className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">Chat Notifications</h4>
                        <p className="text-xs text-gray-500 mt-0.5">Receive alerts for new messages</p>
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={notifications.notifyChat}
                        onChange={() => handleNotificationChange("notifyChat", !notifications.notifyChat)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </div>
                  </label>

                  {/* Payment Notifications - Conditional */}
                  {allowBank && (
                    <label className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer group">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${notifications.notifyPayment ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                          <CreditCard className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">Payment Notifications</h4>
                          <p className="text-xs text-gray-500 mt-0.5">Get notified when payments are processed</p>
                        </div>
                      </div>
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={notifications.notifyPayment}
                          onChange={() => handleNotificationChange("notifyPayment", !notifications.notifyPayment)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </div>
                    </label>
                  )}

                  {/* Holiday Notifications */}
                  <label className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${notifications.notifyHoliday ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                        <Building className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">Holiday Notifications</h4>
                        <p className="text-xs text-gray-500 mt-0.5">Receive updates about upcoming holidays</p>
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={notifications.notifyHoliday}
                        onChange={() => handleNotificationChange("notifyHoliday", !notifications.notifyHoliday)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </div>
                  </label>
                </div>

                <div className="flex justify-end pt-6 border-t border-gray-100">
                  <Button onClick={handleNotificationSave} icon={CheckCircle2} className="px-8">
                    Save Preferences
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}