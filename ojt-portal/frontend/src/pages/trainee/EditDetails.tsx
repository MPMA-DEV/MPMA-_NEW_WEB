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
            name: pending?.name || pending?.Name || personal?.name || personal?.Name || "",
            fullName: pending?.fullName || pending?.fullname || personal?.fullName || personal?.fullname || "",
            nic: pending?.NIC || personal?.NIC || loaderData?.NIC || user?.NIC || "",
            address: pending?.address || personal?.address || "",
        },
        contactInfo: {
            mobileNo: pending?.Mobile_No || personal?.Mobile_No || "",
            residenceNo: pending?.Resident_No || personal?.Resident_No || "",
            email: pending?.email || personal?.email || loaderData?.email || user?.email || "",
            emergencyContactName: pending?.emergency_name || personal?.ec_name || emergency?.name || "",
            relationship: pending?.emergency_relationship || personal?.ec_relationship || emergency?.relationship || "",
            emergencyContactTelephone: pending?.emergency_telephone || personal?.ec_telephone || emergency?.telephone || "",
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

        // Check for duplicates in newly selected files
        const duplicateKey = Object.keys(newFiles).find((key) => {
            const existingFile = newFiles[key as keyof typeof newFiles];
            if (existingFile instanceof File) {
                return existingFile.name === file.name && existingFile.size === file.size;
            }
            return false;
        });

        if (duplicateKey) {
            if (duplicateKey === documentType) {
                error("This file is already selected for this document.");
            } else {
                error("This file has already been selected for another document.");
            }
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

            success("Details updated successfully!");
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
                        <h1 className="text-2xl font-bold text-gray-900">View Details</h1>
                        <p className="text-sm text-gray-500">Your profile information</p>
                    </div>
                </div>
            </div>

            {/* Notification */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start">
                <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                    <h3 className="text-sm font-medium text-blue-800">Read-only View</h3>
                    <p className="text-sm text-blue-600 mt-1">
                        All details are read-only. Please contact your administrator to make any changes.
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
                            <Input
                                label="Name with Initials (Read-only)"
                                value={formData.personalDetails.name}
                                onChange={() => { }}
                                disabled
                                className="bg-gray-50"
                            />
                        <Input
                            label="NIC Number (Read-only)"
                            value={formData.personalDetails.nic}
                            onChange={() => { }}
                            disabled
                            className="bg-gray-50"
                        />
                        <Input
                            label="Full Name (Read-only)"
                            value={formData.personalDetails.fullName}
                            onChange={() => { }}
                            disabled
                            className="bg-gray-50"
                        />

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address (Read-only)</label>
                            <textarea
                                value={formData.personalDetails.address}
                                onChange={() => {}}
                                disabled
                                rows={3}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 cursor-not-allowed focus:outline-none"
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
                            label="Mobile Number (Read-only)"
                            value={formData.contactInfo.mobileNo}
                            onChange={() => {}}
                            disabled
                            className="bg-gray-50"
                            type="tel"
                        />
                        <Input
                            label="Residence Number (Read-only)"
                            value={formData.contactInfo.residenceNo}
                            onChange={() => {}}
                            disabled
                            className="bg-gray-50"
                            type="tel"
                        />
                        <div className="md:col-span-2">
                            <Input
                                label="Email (Read-only)"
                                value={formData.contactInfo.email}
                                onChange={() => { }}
                                type="email"
                                disabled
                                className="bg-gray-50"
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
                                label="Contact Name (Read-only)"
                                value={formData.contactInfo.emergencyContactName}
                                onChange={() => {}}
                                disabled
                                className="bg-gray-50"
                            />
                            <Input
                                label="Telephone (Read-only)"
                                value={formData.contactInfo.emergencyContactTelephone}
                                onChange={() => {}}
                                disabled
                                className="bg-gray-50"
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
                            label="Account Holder Name (Read-only)"
                            value={formData.bankDetails.accountHolderName}
                            onChange={() => { }}
                            disabled
                            className="bg-gray-50"
                        />
                        <Input
                            label="Account Number (Read-only)"
                            value={formData.bankDetails.accountNo}
                            onChange={() => { }}
                            disabled
                            className="bg-gray-50"
                        />
                        <Input
                            label="Branch Name (Read-only)"
                            value={formData.bankDetails.branchName}
                            onChange={() => { }}
                            disabled
                            className="bg-gray-50"
                        />
                        <Input
                            label="Branch Code (Read-only)"
                            value={formData.bankDetails.branchCode}
                            onChange={() => { }}
                            disabled
                            className="bg-gray-50"
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
