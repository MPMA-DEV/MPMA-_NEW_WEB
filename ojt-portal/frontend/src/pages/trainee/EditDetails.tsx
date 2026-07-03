import { useState } from "react";
import { useNavigate, useLoaderData } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
    ChevronLeft,
    Upload,
    FileText,
    User,
    Phone,

    X,
    Save,
    Info,
    Landmark,
} from "lucide-react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { useToastHelpers } from "../../hooks/useToast";
import api from "../../api";
import type { LoaderData } from "../../loaders";
import { MAX_FILE_SIZE_MB } from "../../lib/validations";

interface EditDetailsData {
    personalDetails: {
        name: string;
        fullName: string;
        nic: string;
        address: string;
    };
    contactInfo: {
        mobileNo: string;
        residenceNo: string;
        email: string;
        emergencyContactName: string;
        relationship: string;
        emergencyContactTelephone: string;
    };
    bankDetails: {
        accountHolderName: string;
        accountNo: string;
        branchName: string;
        branchCode: string;
    };
    documents: {
        nicScan: File | string | null;
        policeReport: File | string | null;
        universityId: File | string | null;
        instituteLetter: File | string | null;
        consentLetter: File | string | null;
        bankPassbook: File | string | null;
    };
}

export default function EditDetails() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { success, error } = useToastHelpers();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Use loader data from route instead of calling loader directly
    const loaderData = useLoaderData() as LoaderData<any>;

    const personal = loaderData?.PersonalInfo || loaderData?.personal_info || {};
    const emergency = loaderData?.EmergencyContact || loaderData?.Emegency_contact || {};
    const docs = loaderData?.Documents || {};
    const pending = loaderData?.PendingDetails;

    const [formData, setFormData] = useState<EditDetailsData>({
        personalDetails: {
            name: pending?.Name || personal?.Name || "",
            fullName: pending?.fullName || personal?.fullName || "",
            nic: pending?.NIC || personal?.NIC || "",
            address: pending?.address || personal?.address || "",
        },
        contactInfo: {
            mobileNo: pending?.Mobile_No || personal?.Mobile_No || "",
            residenceNo: pending?.Resident_No || personal?.Resident_No || "",
            email: pending?.email || personal?.email || loaderData?.TraineeUser?.email || user?.email || "",
            emergencyContactName: pending?.emergency_name || emergency?.name || "",
            relationship: pending?.emergency_relationship || emergency?.relationship || "",
            emergencyContactTelephone: pending?.emergency_telephone || emergency?.telephone || "",
        },
        bankDetails: {
            accountHolderName: pending?.bank_accname || personal?.bank_accname || "",
            accountNo: pending?.bank_accno || personal?.bank_accno || "",
            branchName: pending?.bank_branch || personal?.bank_branch || "",
            branchCode: pending?.bank_bno ? String(pending.bank_bno) : (personal?.bank_bno ? String(personal.bank_bno) : ""),
        },
        documents: {
            nicScan: pending?.nic_scan || docs?.nicScan || null,
            policeReport: pending?.police_report || docs?.policeReport || null,
            universityId: pending?.university_id || docs?.universityId || null,
            instituteLetter: pending?.institute_letter || docs?.instituteLetter || null,
            consentLetter: pending?.consent_letter || docs?.consentLetter || null,
            bankPassbook: pending?.bank_passbook || docs?.bankPassbook || null,
        },
    });

    const [newFiles, setNewFiles] = useState<{
        nicScan?: File;
        policeReport?: File;
        universityId?: File;
        instituteLetter?: File;
        consentLetter?: File;
        bankPassbook?: File;
    }>({});

    const handleInputChange = (section: "personalDetails" | "contactInfo" | "bankDetails", field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value,
            },
        }));
    };

    const handleFileUpload = (documentType: keyof typeof newFiles, file: File) => {
        if (!file) return;
        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
            error(`File size should be less than ${MAX_FILE_SIZE_MB}MB`);
            return;
        }
        if (file.type.startsWith("image/") || file.type === "application/pdf") {
            setNewFiles((prev) => ({ ...prev, [documentType]: file }));
            success(`${documentType.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())} selected`);
        } else {
            error("Please select a valid image or PDF file");
        }
    };

    const removeNewFile = (documentType: keyof typeof newFiles) => {
        setNewFiles((prev) => {
            const updated = { ...prev };
            delete updated[documentType];
            return updated;
        });
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const submitData = new FormData();

            // Personal details
            submitData.append("personalDetails[name]", formData.personalDetails.name);
            submitData.append("personalDetails[fullName]", formData.personalDetails.fullName);
            submitData.append("personalDetails[address]", formData.personalDetails.address);


            // Contact info
            submitData.append("contactInfo[mobileNo]", formData.contactInfo.mobileNo);
            submitData.append("contactInfo[residenceNo]", formData.contactInfo.residenceNo);
            submitData.append("contactInfo[email]", formData.contactInfo.email);
            submitData.append("contactInfo[emergencyContactName]", formData.contactInfo.emergencyContactName);
            submitData.append("contactInfo[relationship]", formData.contactInfo.relationship);
            submitData.append("contactInfo[emergencyContactTelephone]", formData.contactInfo.emergencyContactTelephone);

            // Bank Details
            submitData.append("bankDetails[accountHolderName]", formData.bankDetails.accountHolderName);
            submitData.append("bankDetails[accountNo]", formData.bankDetails.accountNo);
            submitData.append("bankDetails[branchName]", formData.bankDetails.branchName);
            submitData.append("bankDetails[branchCode]", formData.bankDetails.branchCode);

            // Only append files that were changed
            if (newFiles.nicScan) submitData.append("nicScan", newFiles.nicScan);
            if (newFiles.policeReport) submitData.append("policeReport", newFiles.policeReport);
            if (newFiles.universityId) submitData.append("universityId", newFiles.universityId);
            if (newFiles.instituteLetter) submitData.append("instituteLetter", newFiles.instituteLetter);
            if (newFiles.consentLetter) submitData.append("consentLetter", newFiles.consentLetter);
            if (newFiles.bankPassbook) submitData.append("bankPassbook", newFiles.bankPassbook);

            await api.put(`api/profile/update-details/${user?.id}`, submitData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            success("Edit request submitted! Waiting for admin approval.");
            navigate("/trainee/details");
        } catch (err) {
            console.error("Failed to update details:", err);
            error("Failed to update details. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };



    return (
        <div className="space-y-6 pb-8">
            {/* Header */}
            <div className="flex items-center justify-between bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate("/trainee/details")}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Edit Details</h1>
                        <p className="text-sm text-gray-500">Update your profile information</p>
                    </div>
                </div>
                <Button
                    onClick={handleSubmit}
                    variant="primary"
                    icon={Save}
                    disabled={isSubmitting}
                    className="bg-emerald-600 hover:bg-emerald-700"
                >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
            </div>

            {/* Notification */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start">
                <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                    <h3 className="text-sm font-medium text-blue-800">Approval Required</h3>
                    <p className="text-sm text-blue-600 mt-1">
                        Any changes made from here send to the admin for approval.
                    </p>
                </div>
            </div>

            {/* Personal Details Section */}
            <Card>
                <CardHeader className="border-b border-gray-100 pb-4">
                    <div className="flex items-center space-x-2">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                            <User className="h-5 w-5" />
                        </div>
                        <CardTitle>Personal Details</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Read-only fields */}
                        <div className="space-y-1">
                            <Input
                                label="Name with Initials"
                                value={formData.personalDetails.name}
                                onChange={(e) => handleInputChange("personalDetails", "name", e.target.value)}
                                placeholder="e.g. S.H Perera"
                            />
                            <p className="text-xs text-gray-500 pl-1">
                                Example: S.H Perera
                            </p>
                        </div>
                        <Input
                            label="NIC Number (Read-only)"
                            value={formData.personalDetails.nic}
                            readOnly
                            className="bg-gray-50 cursor-not-allowed"
                        />

                        {/* Editable fields */}
                        <Input
                            label="Full Name"
                            value={formData.personalDetails.fullName}
                            onChange={(e) => handleInputChange("personalDetails", "fullName", e.target.value)}
                        />

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <textarea
                                value={formData.personalDetails.address}
                                onChange={(e) => handleInputChange("personalDetails", "address", e.target.value)}
                                rows={3}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Contact Information Section */}
            <Card>
                <CardHeader className="border-b border-gray-100 pb-4">
                    <div className="flex items-center space-x-2">
                        <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                            <Phone className="h-5 w-5" />
                        </div>
                        <CardTitle>Contact Information</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Mobile Number"
                            value={formData.contactInfo.mobileNo}
                            onChange={(e) => handleInputChange("contactInfo", "mobileNo", e.target.value)}
                            type="tel"
                        />
                        <Input
                            label="Residence Number"
                            value={formData.contactInfo.residenceNo}
                            onChange={(e) => handleInputChange("contactInfo", "residenceNo", e.target.value)}
                            type="tel"
                        />
                        <div className="md:col-span-2">
                            <Input
                                label="Email"
                                value={formData.contactInfo.email}
                                onChange={(e) => handleInputChange("contactInfo", "email", e.target.value)}
                                type="email"
                                placeholder="example@gmail.com"
                            />
                        </div>
                    </div>

                    {/* Emergency Contact */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <Phone className="h-5 w-5 mr-2 text-teal-600" />
                            Emergency Contact
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Input
                                label="Contact Name"
                                value={formData.contactInfo.emergencyContactName}
                                onChange={(e) => handleInputChange("contactInfo", "emergencyContactName", e.target.value)}
                            />
                            <Input
                                label="Relationship"
                                value={formData.contactInfo.relationship}
                                onChange={(e) => handleInputChange("contactInfo", "relationship", e.target.value)}
                            />
                            <Input
                                label="Telephone"
                                value={formData.contactInfo.emergencyContactTelephone}
                                onChange={(e) => handleInputChange("contactInfo", "emergencyContactTelephone", e.target.value)}
                                type="tel"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* BOC Bank Details Section */}
            <Card>
                <CardHeader className="border-b border-gray-100 pb-4">
                    <div className="flex items-center space-x-2">
                        <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg">
                            <Landmark className="h-5 w-5" />
                        </div>
                        <CardTitle>BOC Bank Details</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Account Holder Name"
                            value={formData.bankDetails.accountHolderName}
                            onChange={(e) => handleInputChange("bankDetails", "accountHolderName", e.target.value)}
                        />
                        <Input
                            label="Account Number"
                            value={formData.bankDetails.accountNo}
                            onChange={(e) => handleInputChange("bankDetails", "accountNo", e.target.value)}
                        />
                        <Input
                            label="Branch Name"
                            value={formData.bankDetails.branchName}
                            onChange={(e) => handleInputChange("bankDetails", "branchName", e.target.value)}
                        />
                        <Input
                            label="Branch Code"
                            value={formData.bankDetails.branchCode}
                            onChange={(e) => handleInputChange("bankDetails", "branchCode", e.target.value)}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Documents Section */}
            <Card>
                <CardHeader className="border-b border-gray-100 pb-4">
                    <div className="flex items-center space-x-2">
                        <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                            <FileText className="h-5 w-5" />
                        </div>
                        <CardTitle>Documents</CardTitle>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Upload new documents to replace existing ones</p>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Profile Photo */}


                        {/* NIC Scan */}
                        <DocumentUploadBox
                            label="NIC Scan"
                            documentType="nicScan"
                            existingDoc={formData.documents.nicScan}
                            newFile={newFiles.nicScan}
                            onUpload={(file) => handleFileUpload("nicScan", file)}
                            onRemove={() => removeNewFile("nicScan")}
                        />

                        {/* Police Report */}
                        <DocumentUploadBox
                            label="Police Report"
                            documentType="policeReport"
                            existingDoc={formData.documents.policeReport}
                            newFile={newFiles.policeReport}
                            onUpload={(file) => handleFileUpload("policeReport", file)}
                            onRemove={() => removeNewFile("policeReport")}
                        />

                        {/* University ID */}
                        <DocumentUploadBox
                            label="University ID"
                            documentType="universityId"
                            existingDoc={formData.documents.universityId}
                            newFile={newFiles.universityId}
                            onUpload={(file) => handleFileUpload("universityId", file)}
                            onRemove={() => removeNewFile("universityId")}
                        />

                        {/* Institute Letter */}
                        <DocumentUploadBox
                            label="Institute Letter"
                            documentType="instituteLetter"
                            existingDoc={formData.documents.instituteLetter}
                            newFile={newFiles.instituteLetter}
                            onUpload={(file) => handleFileUpload("instituteLetter", file)}
                            onRemove={() => removeNewFile("instituteLetter")}
                        />

                        {/* Consent Letter */}
                        <DocumentUploadBox
                            label="Consent Letter"
                            documentType="consentLetter"
                            existingDoc={formData.documents.consentLetter}
                            newFile={newFiles.consentLetter}
                            onUpload={(file) => handleFileUpload("consentLetter", file)}
                            onRemove={() => removeNewFile("consentLetter")}
                        />

                        {/* BOC Bank Statement / Passbook */}
                        <DocumentUploadBox
                            label="BOC Bank Statement / Passbook"
                            documentType="bankPassbook"
                            existingDoc={formData.documents.bankPassbook}
                            newFile={newFiles.bankPassbook}
                            onUpload={(file) => handleFileUpload("bankPassbook", file)}
                            onRemove={() => removeNewFile("bankPassbook")}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// Document upload component
interface DocumentUploadBoxProps {
    label: string;
    documentType: string;
    existingDoc: File | string | null;
    newFile?: File;
    onUpload: (file: File) => void;
    onRemove: () => void;
}

function DocumentUploadBox({ label, existingDoc, newFile, onUpload, onRemove }: DocumentUploadBoxProps) {
    const hasExisting = existingDoc && typeof existingDoc === "string";
    const hasNew = newFile instanceof File;

    return (
        <div className="border border-gray-200 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>

            {hasNew ? (
                <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center">
                        <FileText className="h-5 w-5 text-green-600 mr-2" />
                        <span className="text-sm text-green-700 truncate max-w-[150px]">{newFile.name}</span>
                    </div>
                    <button
                        type="button"
                        onClick={onRemove}
                        className="p-1 hover:bg-green-100 rounded-full"
                    >
                        <X className="h-4 w-4 text-green-600" />
                    </button>
                </div>
            ) : hasExisting ? (
                <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center">
                        <FileText className="h-5 w-5 text-blue-600 mr-2" />
                        <span className="text-sm text-blue-700">Current document</span>
                    </div>
                    <label className="cursor-pointer px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm rounded-lg transition-colors">
                        Replace
                        <input
                            type="file"
                            accept="image/*,application/pdf"
                            className="hidden"
                            onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
                        />
                    </label>
                </div>
            ) : (
                <label className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition-colors">
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-xs text-gray-500">Click to upload</span>
                    <span className="text-[10px] text-gray-400 mt-1 font-medium">Max 1MB (PDF, PNG, JPG)</span>
                    <input
                        type="file"
                        accept="image/*,application/pdf"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
                    />
                </label>
            )}
        </div>
    );
}
