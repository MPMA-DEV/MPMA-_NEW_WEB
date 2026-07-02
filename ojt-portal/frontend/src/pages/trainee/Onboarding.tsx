import { useEffect, useState, useRef, type DragEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Header from "../../components/layout/Header";
import {
  ChevronLeft,
  ChevronRight,
  Upload,
  FileText,
  User,
  Phone,
  Camera,
  X,
  FileImage,
  CheckCircle2,
  Loader2,
  Landmark,
} from "lucide-react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { Card, CardContent } from "../../components/ui/Card";
import { useToastHelpers } from "../../hooks/useToast";
import { OnboardingSchema } from "../../lib/validations";
import type { OnboardingFormData } from "../../lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SubmitHandler } from "react-hook-form";
import { useForm, Controller } from "react-hook-form";
import api, { refreshAccessToken } from "../../api";
import { traineeInterviewLoader } from "../../loaders/traineeLoaders";

export default function Onboarding() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    getValues,
    setValue,
    watch,
    trigger,
  } = useForm<OnboardingFormData>({
    mode: "onChange",
    defaultValues: {
      personalDetails: {
        name: "",
        fullname: "",
        nicNo: "",
        username: "",
        address: "",
        trainingType: "Undergraduate",
        instituteName: "",
        course: "",
        period: "",
        start_date: undefined,
        profilePhoto: null,
      },
      contactInfo: {
        mobileNo: "",
        residenceNo: "",
        email: "",
        emergencyContactName: "",
        relationship: "",
        emergencyContactTelephone: "",
      },
      bankDetails: {
        accountHolderName: "",
        accountNo: "",
        branchName: "",
        branchCode: "",
      },
      documents: {
        nicScan: null,
        policeReport: null,
        universityId: null,
        instituteLetter: null,
        consentLetter: null,
        bankPassbook: null,
      },
    },
    resolver: zodResolver(OnboardingSchema),
    mode: "onChange",
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [showCustomPeriod, setShowCustomPeriod] = useState(false);
  const [showCustomCourse, setShowCustomCourse] = useState(false);
  // Compact input style for this page
  const compactInputClass = "py-2 text-sm";
  // Sticky header show/hide on scroll
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { success, error } = useToastHelpers();
  const [dragActiveSection, setDragActiveSection] = useState<string | null>(
    null
  );

  // Flags to mark which fields are prefilled from interview and should be read-only
  const [prefilled, setPrefilled] = useState({
    name: false,
    nicNo: false,
    instituteName: false,
    period: false,
    start_date: false,
  });

  // Rejection notification state
  const [rejectionNotification, setRejectionNotification] = useState<string | null>(null);

  const checkIsRejected = (docKey: string) => {
    if (!rejectionNotification) return false;
    const lowerMsg = rejectionNotification.toLowerCase();

    if (docKey === "nicScan" && (lowerMsg.includes("nic scan") || lowerMsg.includes("nicscan"))) return true;
    if (docKey === "universityId" && (lowerMsg.includes("university id") || lowerMsg.includes("universityid"))) return true;
    if (docKey === "policeReport" && (lowerMsg.includes("police report") || lowerMsg.includes("policereport"))) return true;
    if (docKey === "instituteLetter" && (lowerMsg.includes("institute letter") || lowerMsg.includes("instituteletter"))) return true;
    if (docKey === "consentLetter" && (lowerMsg.includes("consent letter") || lowerMsg.includes("consentletter"))) return true;
    if (docKey === "profilePhoto" && (lowerMsg.includes("photo") || lowerMsg.includes("profile photo"))) return true;
    if (docKey === "bankPassbook" && (lowerMsg.includes("bank statement") || lowerMsg.includes("passbook") || lowerMsg.includes("bankpassbook"))) return true;

    return false;
  };

  const getRejectionReason = (docKey: string) => {
    if (!rejectionNotification) return "";
    const lines = rejectionNotification.split("\n");
    const issues = lines.slice(1);

    const docNames: Record<string, string> = {
      nicScan: "NIC Scan",
      universityId: "University ID",
      policeReport: "Police Report",
      instituteLetter: "Institute Letter",
      consentLetter: "Consent Letter",
      profilePhoto: "Profile Photo",
      bankPassbook: "Bank Statement / Passbook"
    };

    const targetName = docNames[docKey];
    if (!targetName) return "";

    const matchLine = issues.find(line => line.toLowerCase().includes(targetName.toLowerCase()));
    if (matchLine) {
      const parts = matchLine.split(":");
      if (parts.length > 1) {
        return parts.slice(1).join(":").trim();
      }
      return matchLine.replace(/^-\s*/, "").trim();
    }
    return "";
  };

  useEffect(() => {
    if (user?.status === "Pending") {
      api.get("/api/notifications")
        .then(res => {
          const list = res.data || [];
          const alert = list.find((n: any) => n.type === "alert" && !n.read);
          if (alert) {
            setRejectionNotification(alert.message);

            const lowerMsg = alert.message.toLowerCase();
            const photoRejected = lowerMsg.includes("photo");

            if (!photoRejected) {
              const bankRejected = lowerMsg.includes("bank") || lowerMsg.includes("passbook") || lowerMsg.includes("statement");
              if (bankRejected) {
                setCurrentStep(2);
              } else {
                setCurrentStep(3);
              }
            }
          }
        })
        .catch(err => {
          console.error("Failed to fetch onboarding notifications:", err);
        });
    }
  }, [user]);

  const [isLoadingPrevData, setIsLoadingPrevData] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    const loadExistingData = async () => {
      try {
        setIsLoadingPrevData(true);
        // 1. Fetch trainee details
        const res = await api.get(`api/trainee/trainee_details/${user.id}`);
        const data = res.data;
        if (data) {
          const personal = data.PersonalInfo;
          const emergency = data.EmergencyContact;

          if (personal) {
            if (personal.Name) setValue("personalDetails.name", personal.Name, { shouldValidate: true });
            if (personal.fullName) setValue("personalDetails.fullname", personal.fullName, { shouldValidate: true });
            if (personal.NIC) setValue("personalDetails.nicNo", personal.NIC, { shouldValidate: true });
            if (personal.address) setValue("personalDetails.address", personal.address, { shouldValidate: true });
            if (personal.training_type) setValue("personalDetails.trainingType", personal.training_type, { shouldValidate: true });
            if (personal.instituteName) setValue("personalDetails.instituteName", personal.instituteName, { shouldValidate: true });
            if (personal.course) { setValue("personalDetails.course", personal.course, { shouldValidate: true });
            const standardCourses = ["Marine Engineering", "Nautical Science", "Logistics and Supply Chain Management"];
            if (personal.course && !standardCourses.includes(personal.course)) {
              setShowCustomCourse(true);
            }
}
            if (personal.training_period) {
              setValue("personalDetails.period", personal.training_period, { shouldValidate: true });
              const standardPeriods = ["3 Months", "6 Months", "8 Months", "1 Year", "2 Years"];
              if (!standardPeriods.includes(personal.training_period)) {
                setShowCustomPeriod(true);
              }
            }
            if (personal.start_date) setValue("personalDetails.start_date", new Date(personal.start_date), { shouldValidate: true });

            // Set BOC Bank details
            if (personal.bank_accname) setValue("bankDetails.accountHolderName", personal.bank_accname, { shouldValidate: true });
            if (personal.bank_accno) setValue("bankDetails.accountNo", personal.bank_accno, { shouldValidate: true });
            if (personal.bank_branch) setValue("bankDetails.branchName", personal.bank_branch, { shouldValidate: true });
            if (personal.bank_bno) setValue("bankDetails.branchCode", String(personal.bank_bno), { shouldValidate: true });
          }

          if (emergency) {
            if (emergency.name) setValue("contactInfo.emergencyContactName", emergency.name, { shouldValidate: true });
            if (emergency.relationship) setValue("contactInfo.relationship", emergency.relationship, { shouldValidate: true });
            if (emergency.telephone) setValue("contactInfo.emergencyContactTelephone", emergency.telephone, { shouldValidate: true });
          }

          const dbEmail = personal?.email || data.TraineeUser?.email || user?.email;
          if (dbEmail) setValue("contactInfo.email", dbEmail, { shouldValidate: true });
          if (personal?.Mobile_No) setValue("contactInfo.mobileNo", personal.Mobile_No, { shouldValidate: true });
          if (personal?.Resident_No) setValue("contactInfo.residenceNo", personal.Resident_No, { shouldValidate: true });
        }

        // Auto-fill username and NIC from user session
        if (user?.username) {
          setValue("personalDetails.username", user.username, { shouldValidate: true });
        }
        if (user?.NIC) {
          setValue("personalDetails.nicNo", user.NIC, { shouldValidate: true });
        }

        // 2. Fetch existing documents as Files (blobs converted to File objects)
        const docKeys = ["nicScan", "policeReport", "universityId", "instituteLetter", "consentLetter", "bankPassbook"] as const;
        for (const docKey of docKeys) {
          try {
            const docUrl = `api/trainee/stream/${user.id}/${docKey}`;
            const fileRes = await api.get(docUrl, { responseType: "blob" });
            if (fileRes.status === 200 && fileRes.data) {
              const contentType = fileRes.data.type || fileRes.headers?.["content-type"] || "application/pdf";
              const ext = contentType === "application/pdf" ? "pdf" : "jpg";
              const file = new File([fileRes.data], `${docKey}.${ext}`, { type: contentType });
              setValue(`documents.${docKey}`, file, { shouldValidate: true });
            }
          } catch (e) {
            console.warn(`No existing file found for ${docKey}:`, e);
          }
        }

        // 3. Fetch profile photo
        try {
          const photoUrl = `api/trainee/stream-photo/${user.id}`;
          const photoRes = await api.get(photoUrl, { responseType: "blob" });
          if (photoRes.status === 200 && photoRes.data) {
            const contentType = photoRes.data.type || "image/jpeg";
            const file = new File([photoRes.data], `profilePhoto.jpg`, { type: contentType });
            setValue("personalDetails.profilePhoto", file, { shouldValidate: true });
          }
        } catch (e) {
          console.warn("No existing profile photo found:", e);
        }

      } catch (err) {
        console.error("Failed to load existing onboarding details:", err);
      } finally {
        setIsLoadingPrevData(false);
      }
    };

    loadExistingData();
  }, [user?.id, setValue]);

  // Initialize step from query
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const stepParam = params.get("step");
    if (stepParam) {
      const s = parseInt(stepParam, 10);
      if (!isNaN(s) && s >= 1 && s <= 3) {
        setCurrentStep(s);
        return;
      }
    }
  }, [location.search, user?.status]);

  // Hide stepper on scroll down, show on scroll up
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      const threshold = 80; // start hiding after some scroll
      if (y > lastScrollY.current && y > threshold) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Prefill from latest interview details (if available) and mark fields as read-only
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const interviews = await traineeInterviewLoader();
        if (!mounted || !interviews) return;
        const latest = interviews;
        // Extract values
        const nicNo = latest?.NIC ?? "";
        const instituteName = latest?.instituteName ?? "";
        const period = latest?.duration ?? "";
        const startDateStr = latest?.date ?? null;
        const startDate = startDateStr ? new Date(startDateStr) : undefined;

        // Set form values if present
        if (nicNo) setValue("personalDetails.nicNo", nicNo, { shouldValidate: true });
        if (instituteName) setValue("personalDetails.instituteName", instituteName, { shouldValidate: true });
        if (period) {
          setValue("personalDetails.period", period, { shouldValidate: true });
          const standardPeriods = ["3 Months", "6 Months", "8 Months", "1 Year", "2 Years"];
          if (!standardPeriods.includes(period)) {
            setShowCustomPeriod(true);
          }
        }
        if (startDate) setValue("personalDetails.start_date", startDate as any, { shouldValidate: true });

        setPrefilled({
          name: false,
          nicNo: !!nicNo,
          instituteName: !!instituteName,
          period: !!period,
          start_date: !!startDate,
        });
      } catch (e) {
        // non-blocking
        console.warn("Failed to prefill from interview:", e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [setValue]);

  const profilePhoto = watch("personalDetails.profilePhoto");
  const trainingType = watch("personalDetails.trainingType");
  const nicScan = watch("documents.nicScan");
  const policeReport = watch("documents.policeReport");
  const universityId = watch("documents.universityId");
  const instituteLetter = watch("documents.instituteLetter");
  const consentLetter = watch("documents.consentLetter");
  const bankPassbook = watch("documents.bankPassbook");

  const isGovInstitute = trainingType === "SMTI" || trainingType === "NAITA Craft";

  const [instituteSuggestions, setInstituteSuggestions] = useState<string[]>([]);
  const allUniversitiesRef = useRef<string[]>([]);
  const watchInstituteName = watch("personalDetails.instituteName");

  // Fetch the global university list on mount
  useEffect(() => {
    let mounted = true;
    const fetchGlobalUniversities = async () => {
      try {
        const res = await fetch(
          "https://cdn.jsdelivr.net/gh/Hipo/university-domains-list@master/world_universities_and_domains.json"
        );
        if (res.ok && mounted) {
          const data = await res.json();
          const names = data.map((u: any) => u.name) as string[];
          allUniversitiesRef.current = Array.from(new Set(names));
        }
      } catch (err) {
        console.warn("Failed to load global universities database:", err);
      }
    };
    fetchGlobalUniversities();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const fixedMap: Record<string, string> = { CINEC: "CINEC", "NAITA Craft": "NAITA", SMTI: "SMTI" };
    if (trainingType in fixedMap) {
      setInstituteSuggestions([]);
      return;
    }

    const SRI_LANKAN_INSTITUTES = [
      "University of Moratuwa",
      "University of Colombo",
      "University of Sri Jayewardenepura",
      "University of Kelaniya",
      "University of Peradeniya",
      "University of Ruhuna",
      "Wayamba University of Sri Lanka",
      "Rajarata University of Sri Lanka",
      "Sabaragamuwa University of Sri Lanka",
      "Eastern University, Sri Lanka",
      "University of Jaffna",
      "South Eastern University of Sri Lanka",
      "Uva Wellassa University",
      "Open University of Sri Lanka",
      "General Sir John Kotelawala Defence University (KDU)",
      "Ocean University of Sri Lanka",
      "Sri Lanka Institute of Information Technology (SLIIT)",
      "Informatics Institute of Technology (IIT)",
      "NSBM Green University",
      "National Institute of Business Management (NIBM)",
      "Sri Lanka Technological Campus (SLTC)",
      "Horizon Campus",
      "CINEC Campus",
      "APIIT Sri Lanka",
      "ICBT Campus",
      "ANC Education",
      "Saegis Campus",
      "Royal Institute of Colombo (RIC)",
      "ESOFT Metro Campus",
      "ACBT",
      "BMS (Business Management School)",
      "KIU",
      "Sri Lanka Institute of Advanced Technological Education (SLIATE)",
      "National Apprentice and Industrial Training Authority (NAITA)",
      "SMTI",
      "University of Vocational Technology (UNIVOTEC)"
    ];

    if (!watchInstituteName) {
      setInstituteSuggestions(SRI_LANKAN_INSTITUTES.slice(0, 10));
      return;
    }

    const query = watchInstituteName.trim().toLowerCase();

    // 1. Get matches from our comprehensive local database (includes both public and private Sri Lankan institutes)
    const localMatches = SRI_LANKAN_INSTITUTES.filter((inst) =>
      inst.toLowerCase().includes(query)
    );

    if (allUniversitiesRef.current.length > 0) {
      // 2. Get matches from global list
      const globalMatches = allUniversitiesRef.current.filter((name) =>
        name.toLowerCase().includes(query)
      );
      // Merge local matches (with private universities) and global matches, keeping them unique
      const combined = [...localMatches, ...globalMatches];
      setInstituteSuggestions(Array.from(new Set(combined)).slice(0, 20));
    } else {
      setInstituteSuggestions(localMatches);
    }
  }, [watchInstituteName, trainingType]);

  /*
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
*/
  const handleDocumentUpload = (file: File, documentType: string) => {
    if (
      file &&
      (file.type.startsWith("image/") || file.type === "application/pdf")
    ) {
      setValue(`documents.${documentType}` as any, file);
      success(
        `${documentType
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase())} uploaded successfully`
      );
    } else {
      error("Please select a valid image or PDF file");
    }
  };

  const handlePhotoUpload = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      setValue("personalDetails.profilePhoto", file);
      success("Profile photo uploaded successfully");
    } else {
      error("Please select a valid image file");
    }
  };

  const removeDocument = (documentType: string) => {
    setValue(`documents.${documentType}` as any, null);
    success(
      `${documentType
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase())} removed`
    );
  };

  const removePhoto = () => {
    setValue("personalDetails.profilePhoto", null);
    success("Profile photo removed");
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>, section: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveSection(section);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveSection(null);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, documentType: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveSection(null);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleDocumentUpload(file, documentType);
    }
  };

  // validation function

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      // Log out the user and go back to login page
      logout();
      navigate("/login");
    }
  };

  const nextStep = async () => {
    try {
      if (currentStep === 1) {
        const validPersonal = await trigger([
          "personalDetails.name",
          "personalDetails.fullname",
          "personalDetails.nicNo",
          "personalDetails.username",
          "personalDetails.address",
          "personalDetails.trainingType",
          "personalDetails.instituteName",
          "personalDetails.course",
          "personalDetails.period",
          "personalDetails.start_date",
          "personalDetails.profilePhoto"
        ]);
        const validContact = await trigger([
          "contactInfo.mobileNo",
          "contactInfo.residenceNo",
          "contactInfo.email",
          "contactInfo.emergencyContactName",
          "contactInfo.relationship",
          "contactInfo.emergencyContactTelephone"
        ]);
        if (profilePhoto === null) {
          error("Profile photo is required");
          return;
        }
        if (validPersonal && validContact) {
          setCurrentStep(2);
        } else {
          const parsed = OnboardingSchema.safeParse(getValues());
          if (!parsed.success) {
             const issue = parsed.error.issues.find(i => i.path[0] === 'personalDetails' || i.path[0] === 'contactInfo');
             if (issue) {
                 error(issue.message);
                 return;
             }
          }
          error("Please fix errors before proceeding");
        }
      } else if (currentStep === 2) {
        const validBank = await trigger([
          "bankDetails.accountHolderName",
          "bankDetails.accountNo",
          "bankDetails.branchName",
          "bankDetails.branchCode",
        ]);

        if (isGovInstitute) {
          if (!validBank) {
            const parsed = OnboardingSchema.safeParse(getValues());
            if (!parsed.success) {
               const issue = parsed.error.issues.find(i => i.path[0] === 'bankDetails');
               if (issue) {
                   error(issue.message);
                   return;
               }
            }
            error("Please fill in all BOC Bank Details");
            return;
          }
          setCurrentStep(3);
        } else {
          const bd = getValues("bankDetails");
          const hasAnyField =
            (bd?.accountHolderName && bd.accountHolderName.trim().length > 0) ||
            (bd?.accountNo && bd.accountNo.trim().length > 0) ||
            (bd?.branchName && bd.branchName.trim().length > 0) ||
            (bd?.branchCode && bd.branchCode.trim().length > 0);

          if (hasAnyField) {
            if (!validBank) {
              const parsed = OnboardingSchema.safeParse(getValues());
              if (!parsed.success) {
                 const issue = parsed.error.issues.find(i => i.path[0] === 'bankDetails');
                 if (issue) {
                     error(issue.message);
                     return;
                 }
              }
              error("Please fix errors in BOC Bank Details or clear them to skip");
              return;
            }
          }
          setCurrentStep(3);
        }
      } else if (currentStep === 3) {
        const isValidDocs = await trigger("documents");
        const docs = getValues("documents");
        const requiredDocs = [
          "nicScan",
          "policeReport",
          "universityId",
          "instituteLetter",
          "consentLetter",
        ];
        if (isGovInstitute) {
          requiredDocs.push("bankPassbook");
        }
        const missingDocs = requiredDocs.filter(
          (doc) => !docs[doc as keyof typeof docs]
        );
        if (missingDocs.length > 0) {
          error(
            `Please upload all required documents: ${missingDocs
              .map((doc) =>
                doc === "bankPassbook"
                  ? "BOC Bank Statement or Passbook"
                  : doc
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())
              )
              .join(", ")}`
          );
          return;
        }

        if (isValidDocs) {
          const formData = getValues();
          const ok = await onSubmitTraineeData(formData);
          if (ok) {
            try {
              await refreshAccessToken();
            } catch (err) {
              console.error("Token refresh failed after submission:", err);
            }
            navigate("/onboarding/summary");
          }
        } else {
          error("Validation failed. Please check your documents.");
        }
      }
    } catch (err) {
      error("Validation failed. Please check your inputs.");
    }
  };

  const onSubmitTraineeData: SubmitHandler<OnboardingFormData> = async (
    data
  ) => {
    try {
      const formData = new FormData();

      // Personal details
      formData.append("personalDetails[name]", data.personalDetails.name);
      formData.append(
        "personalDetails[fullname]",
        data.personalDetails.fullname
      );
      formData.append("personalDetails[nicNo]", data.personalDetails.nicNo);
      formData.append("personalDetails[address]", data.personalDetails.address);
      formData.append("personalDetails[trainingType]", data.personalDetails.trainingType);
      formData.append("personalDetails[instituteName]", data.personalDetails.instituteName);
      formData.append("personalDetails[course]", data.personalDetails.course);
      formData.append("personalDetails[period]", data.personalDetails.period);
      formData.append(
        "personalDetails[start_date]",
        data.personalDetails.start_date
          ? new Date(data.personalDetails.start_date).toISOString()
          : ""
      );

      if (data.personalDetails.profilePhoto) {
        formData.append(
          "personalDetails[profilePhoto]",
          data.personalDetails.profilePhoto
        );
      }

      // Contact info
      formData.append("contactInfo[mobileNo]", data.contactInfo.mobileNo);
      formData.append("contactInfo[residenceNo]", data.contactInfo.residenceNo);
      formData.append("contactInfo[email]", data.contactInfo.email);
      formData.append(
        "contactInfo[emergencyContactName]",
        data.contactInfo.emergencyContactName
      );
      formData.append(
        "contactInfo[relationship]",
        data.contactInfo.relationship
      );
      formData.append(
        "contactInfo[emergencyContactTelephone]",
        data.contactInfo.emergencyContactTelephone
      );

      // Documents
      if (data.documents.nicScan)
        formData.append("documents[nicScan]", data.documents.nicScan);
      if (data.documents.policeReport)
        formData.append("documents[policeReport]", data.documents.policeReport);
      if (data.documents.universityId)
        formData.append(
          "documents[universityId]",
          data.documents.universityId
        );
      if (data.documents.instituteLetter)
        formData.append(
          "documents[instituteLetter]",
          data.documents.instituteLetter
        );
      if (data.documents.consentLetter)
        formData.append(
          "documents[consentLetter]",
          data.documents.consentLetter
        );

      // Bank Details
      const bankDetails = data.bankDetails;
      if (bankDetails) {
        if (bankDetails.accountHolderName) {
          formData.append("bankDetails[accountHolderName]", bankDetails.accountHolderName);
        }
        if (bankDetails.accountNo) {
          formData.append("bankDetails[accountNo]", bankDetails.accountNo);
        }
        if (bankDetails.branchName) {
          formData.append("bankDetails[branchName]", bankDetails.branchName);
        }
        if (bankDetails.branchCode) {
          formData.append("bankDetails[branchCode]", bankDetails.branchCode);
        }
      }

      // Bank Passbook File
      if (data.documents.bankPassbook) {
        formData.append("documents[bankPassbook]", data.documents.bankPassbook);
      }

      formData.append("user_id", user?.id?.toString() || "");

      // Debug FormData contents
      console.log("FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      await api.post("api/trainee/information", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      success("Trainee data submitted successfully!");
      return true;
    } catch (err: any) {
      console.error("Error submitting trainee data:", err);
      let msg = "Failed to submit trainee data.";
      if (err.response?.data?.message) {
        msg = err.response.data.message;
        if (err.response.data.errors && Array.isArray(err.response.data.errors)) {
          const details = err.response.data.errors
            .map((e: any) => `${e.field || ''}: ${e.message}`)
            .join(", ");
          msg += ` - ${details}`;
        }
      }
      error(msg);
      return false;
    }
  };

  const renderRejectionAlert = () => {
    if (!rejectionNotification) return null;

    // Split comments by newlines to render as a list
    const lines = rejectionNotification.split("\n");
    const title = lines[0];
    const issues = lines.slice(1);

    return (
      <div className="mb-8 p-6 bg-rose-50/60 border border-rose-200/80 text-rose-800 rounded-2xl flex items-start gap-4 shadow-sm animate-fade-in">
        <div className="shrink-0 p-2.5 bg-rose-100 rounded-xl text-rose-600">
          <X className="w-5 h-5" />
        </div>
        <div className="space-y-2 flex-1">
          <h3 className="font-bold text-rose-900 text-base">Onboarding Review: Action Required</h3>
          <p className="text-sm font-medium leading-relaxed text-rose-800">{title}</p>
          {issues.length > 0 && (
            <div className="mt-3 bg-white/80 p-4 rounded-xl border border-rose-100/50 shadow-sm max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600/80 block mb-2">Required Corrections:</span>
              <ul className="space-y-1.5 text-sm text-rose-800 list-disc list-inside">
                {issues.map((line, idx) => (
                  <li key={idx} className="leading-relaxed pl-1">
                    <span className="font-semibold text-rose-900">{line.replace(/^-\s*/, "").split(":")[0]}:</span>
                    <span className="text-rose-800 ml-1">{line.replace(/^-\s*/, "").split(":").slice(1).join(":")}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <Header
        user={user ? { ...user, status: rejectionNotification ? "Rejected / Action Required" : user.status } : null}
        profilePhoto={null}
        pageTitle="Onboarding Portal"
        onToggleSidebar={() => { }}
        sidebarOpen={false}
      />
      <div className="flex-grow py-8 px-4 sm:px-6 lg:px-8 bg-[#f8fafc]">
        <div className="max-w-5xl mx-auto">
          {renderRejectionAlert()}

          {/* Stepper */}
          <div className={`sticky top-0 z-30 bg-white pb-4 pt-4 mb-6 border border-gray-200 rounded-xl transition-transform duration-300 ${showHeader ? "translate-y-0" : "-translate-y-full"}`}>
            <div className="relative max-w-3xl mx-auto px-4">
              {/* Icons with connector between them */}
              <div className="flex items-center justify-between">
                {/* Step 1 Circle */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors ${currentStep >= 1 ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-blue-300 text-blue-600"
                      }`}
                  >
                    <User className="w-6 h-6" />
                  </div>
                </div>

                {/* Connector segment 1-2 */}
                <div className="relative flex-1 mx-4">
                  <div className="h-0.5 w-full bg-blue-200" />
                  <div
                    className="absolute left-0 top-0 h-0.5 bg-blue-600 transition-all duration-300"
                    style={{ width: currentStep > 1 ? "100%" : "0%" }}
                  />
                </div>

                {/* Step 2 Circle */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors ${currentStep >= 2 ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-blue-300 text-blue-600"
                      }`}
                  >
                    <Landmark className="w-6 h-6" />
                  </div>
                </div>

                {/* Connector segment 2-3 */}
                <div className="relative flex-1 mx-4">
                  <div className="h-0.5 w-full bg-blue-200" />
                  <div
                    className="absolute left-0 top-0 h-0.5 bg-blue-600 transition-all duration-300"
                    style={{ width: currentStep > 2 ? "100%" : "0%" }}
                  />
                </div>

                {/* Step 3 Circle */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors ${currentStep === 3 ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-blue-300 text-blue-600"
                      }`}
                  >
                    <FileImage className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Labels row */}
              <div className="mt-2 grid grid-cols-3 text-sm font-medium">
                <div className={`text-left ${currentStep >= 1 ? "text-blue-600" : "text-gray-400"}`}>
                  Personal Info
                </div>
                <div className={`text-center ${currentStep >= 2 ? "text-blue-600" : "text-gray-400"}`}>
                  BOC Bank Details
                </div>
                <div className={`text-right ${currentStep === 3 ? "text-blue-600" : "text-gray-400"}`}>
                  Documents
                </div>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <Card className="w-full max-w-5xl mx-auto bg-white shadow-xl border border-gray-200">
            <CardContent className="p-8">
              {isLoadingPrevData ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
                  <h3 className="text-gray-955 font-bold text-lg">Loading your details...</h3>
                  <p className="text-gray-500 text-sm mt-1">Retrieving your previously submitted information.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmitTraineeData)}>
                  {/* Step 2: Personal Details + Contact Info */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          Personal Details
                        </h3>
                        <p className="text-gray-600">
                          Tell us about yourself, upload your photo, and provide contact information
                        </p>
                      </div>

                      {/* Profile Photo Upload */}
                      {/* Profile Photo Upload */}
                      {(() => {
                        const isRejected = rejectionNotification ? checkIsRejected("profilePhoto") : false;
                        const reason = isRejected ? getRejectionReason("profilePhoto") : "";
                        const hasNotification = !!rejectionNotification;
                        const isValidAndApproved = hasNotification && !isRejected;

                        return (
                          <div className={`text-center mb-8 p-4 rounded-xl border max-w-sm mx-auto transition-all ${isRejected ? "bg-rose-50/40 border-rose-200 shadow-sm" :
                            isValidAndApproved ? "bg-emerald-50/30 border-emerald-100 animate-fade-in" :
                              "bg-white border-transparent"
                            }`}>
                            <div className="flex justify-between items-center mb-3">
                              <div className="text-left">
                                <label className="block text-sm font-semibold text-gray-800">
                                  Profile Photo *
                                </label>
                                <span className="text-[10px] text-gray-500 font-medium block">
                                  Max 1MB (PNG, JPEG, JPG)
                                </span>
                              </div>
                              {hasNotification && (
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${isRejected ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  }`}>
                                  {isRejected ? "Correction Required" : "Approved / Valid"}
                                </span>
                              )}
                            </div>

                            {isRejected && reason && (
                              <div className="mb-3 px-3 py-1.5 bg-rose-100/50 border border-rose-200/50 rounded-lg text-rose-800 text-xs font-medium flex items-center justify-center gap-2">
                                <span className="shrink-0 w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                                <span>Issue: {reason}</span>
                              </div>
                            )}

                            {isValidAndApproved ? (
                              <div className="flex flex-col items-center py-2 bg-emerald-50/50 border border-emerald-100 rounded-lg">
                                <CheckCircle2 className="h-8 w-8 text-emerald-600 mb-1" />
                                <p className="text-xs font-semibold text-emerald-800">Photo verified by admin</p>
                              </div>
                            ) : (
                              <div className="flex justify-center">
                                <div className="relative">
                                  {profilePhoto instanceof File ? (
                                    <div className="relative">
                                      <img
                                        src={URL.createObjectURL(profilePhoto)}
                                        alt="Profile"
                                        className="w-24 h-24 rounded-lg object-cover border-4 border-blue-500 shadow-sm"
                                      />
                                      <button
                                        onClick={removePhoto}
                                        type="button"
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-md"
                                      >
                                        <X className="h-4 w-4" />
                                      </button>
                                    </div>
                                  ) : (
                                    <label className="cursor-pointer">
                                      <div className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-blue-500 transition-colors bg-gray-50/50">
                                        <Camera className="h-8 w-8 text-gray-400" />
                                      </div>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) =>
                                          e.target.files?.[0] &&
                                          handlePhotoUpload(e.target.files[0])
                                        }
                                      />
                                    </label>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })()}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Controller
                          name="personalDetails.name"
                          control={control}
                          render={({ field, fieldState }) => (
                            <div className="space-y-1">
                              <Input
                                label="Name with Initials *"
                                {...field}
                                error={fieldState.error?.message}
                                placeholder="e.g. S.H. Perera"
                                className={compactInputClass}
                                required
                              />
                              {!fieldState.error?.message && (
                                <p className="text-xs text-gray-500 pl-1">
                                  Example: S.H. Perera
                                </p>
                              )}
                            </div>
                          )}
                        />
                        <Controller
                          name="personalDetails.fullname"
                          control={control}
                          render={({ field, fieldState }) => (
                            <Input
                              label="Full Name *"
                              {...field}
                              error={fieldState.error?.message}
                              placeholder="Enter your full name"
                              className={compactInputClass}
                              required
                            />
                          )}
                        />
                        <Controller
                          name="personalDetails.username"
                          control={control}
                          render={({ field, fieldState }) => (
                            <Input
                              label="Username"
                              {...field}
                              error={fieldState.error?.message}
                              className={compactInputClass}
                              readOnly
                            />
                          )}
                        />
                        <Controller
                          name="personalDetails.nicNo"
                          control={control}
                          render={({ field, fieldState }) => (
                            <Input
                              label="NIC No *"
                              {...field}
                              error={fieldState.error?.message}
                              placeholder="Enter your NIC number"
                              className={compactInputClass}
                              required
                              readOnly
                            />
                          )}
                        />
                        {/* Training Type - Radios */}
                        <div className="md:col-span-2">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Training Type *</label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {[
                              "Undergraduate",
                              "Certificate",
                              "Diploma",
                              "CINEC",
                              "NAITA Craft",
                              "SMTI",
                            ].map((type) => (
                              <label key={type} className="flex items-center space-x-2 p-2 border rounded-md cursor-pointer hover:border-blue-400">
                                <input
                                  type="radio"
                                  className="h-4 w-4 text-blue-600"
                                  value={type}
                                  checked={trainingType === type}
                                  onChange={() => {
                                    setValue("personalDetails.trainingType", type as any, { shouldValidate: true });
                                    const fixedMap: Record<string, string> = { CINEC: "CINEC", "NAITA Craft": "NAITA", SMTI: "SMTI" };
                                    if (type in fixedMap) {
                                      setValue("personalDetails.instituteName", fixedMap[type], { shouldValidate: true });
                                    } else {
                                      setValue("personalDetails.instituteName", "", { shouldValidate: true });
                                    }
                                  }}
                                />
                                <span className="text-sm text-gray-700">{type}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Institute Name */}
                        <Controller
                          name="personalDetails.instituteName"
                          control={control}
                          render={({ field, fieldState }) => {
                            const fixedMap: Record<string, string> = { CINEC: "CINEC", "NAITA Craft": "NAITA", SMTI: "SMTI" };
                            const isFixed = trainingType in fixedMap;
                            return (
                              <div>
                                <Input
                                  label="Institute Name *"
                                  {...field}
                                  error={fieldState.error?.message}
                                  placeholder="Enter institute name"
                                  className={compactInputClass}
                                  required
                                  readOnly={isFixed || prefilled.instituteName}
                                  list="institute-suggestions"
                                  value={
                                    isFixed
                                      ? fixedMap[trainingType as keyof typeof fixedMap]
                                      : field.value
                                  }
                                />
                                <datalist id="institute-suggestions">
                                  {instituteSuggestions.map((suggestion) => (
                                    <option key={suggestion} value={suggestion} />
                                  ))}
                                </datalist>
                              </div>
                            );
                          }}
                        />
                        
                        <Controller
                          name="personalDetails.course"
                          control={control}
                          render={({ field, fieldState }) => {
                            const standardCourses = ["Marine Engineering", "Nautical Science", "Logistics and Supply Chain Management"];
                            
                            const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
                              const val = e.target.value;
                              if (val === "Other") {
                                setShowCustomCourse(true);
                                field.onChange("");
                              } else {
                                setShowCustomCourse(false);
                                field.onChange(val);
                              }
                            };

                            return (
                              <div className="flex flex-col gap-1 w-full">
                                <label className="text-sm font-medium text-gray-700">
                                  Course <span className="text-red-500">*</span>
                                </label>
                                <>
                                  <select
                                    value={showCustomCourse ? "Other" : (field.value || "")}
                                    onChange={handleCourseChange}
                                    className={`${compactInputClass} border rounded bg-white px-3 py-2 text-sm h-10 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow ${
                                      (!showCustomCourse && fieldState.error) ? "border-red-500" : "border-gray-300"
                                    }`}
                                    required={!showCustomCourse}
                                  >
                                    <option value="" disabled>Select course name</option>
                                    <option value="Marine Engineering">Marine Engineering</option>
                                    <option value="Nautical Science">Nautical Science</option>
                                    <option value="Logistics and Supply Chain Management">Logistics and Supply Chain Management</option>
                                    <option value="Other">Other (Specify)</option>
                                  </select>
                                  {showCustomCourse && (
                                    <Input
                                      placeholder="Enter custom course name"
                                      value={field.value}
                                      onChange={(e) => field.onChange(e.target.value)}
                                      error={fieldState.error?.message}
                                      className={`mt-2 ${compactInputClass}`}
                                      required
                                    />
                                  )}
                                  {!showCustomCourse && fieldState.error?.message && (
                                    <span className="text-xs text-red-500 mt-1">{fieldState.error.message}</span>
                                  )}
                                </>
                              </div>
                            );
                          }}
                        />

                         <Controller
                          name="personalDetails.period"
                          control={control}
                          render={({ field, fieldState }) => {
                            const standardPeriods = ["3 Months", "6 Months", "8 Months", "1 Year", "2 Years"];
                            
                            const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
                              const val = e.target.value;
                              if (val === "Other") {
                                setShowCustomPeriod(true);
                                field.onChange("");
                              } else {
                                setShowCustomPeriod(false);
                                field.onChange(val);
                              }
                            };

                            return (
                              <div className="flex flex-col gap-1 w-full">
                                <label className="text-sm font-medium text-gray-700">Training Period *</label>
                                {prefilled.period ? (
                                  <Input
                                    {...field}
                                    error={fieldState.error?.message}
                                    className={compactInputClass}
                                    required
                                    readOnly
                                  />
                                ) : (
                                  <>
                                    <select
                                      value={showCustomPeriod ? "Other" : (field.value || "")}
                                      onChange={handleSelectChange}
                                      className={`${compactInputClass} border rounded bg-white px-3 py-2 text-sm h-10 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                      required
                                    >
                                      <option value="" disabled>Select Training Period</option>
                                      {standardPeriods.map((p) => (
                                        <option key={p} value={p}>{p}</option>
                                      ))}
                                      <option value="Other">Other (Specify)</option>
                                    </select>
                                    {showCustomPeriod && (
                                      <Input
                                        value={field.value}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        placeholder="Specify training period (e.g. 9 Months)"
                                        className={`${compactInputClass} mt-2`}
                                        error={fieldState.error?.message}
                                        required
                                      />
                                    )}
                                    {!showCustomPeriod && fieldState.error?.message && (
                                      <span className="text-red-500 text-xs mt-1">{fieldState.error.message}</span>
                                    )}
                                  </>
                                )}
                              </div>
                            );
                          }}
                        />
                        <Controller
                          name="personalDetails.start_date"
                          control={control}
                          // If using a validation schema (like Zod/Yup), handle the future date logic there.
                          // Otherwise, you can add inline validation rules here:
                          rules={{
                            required: "Start date is required",
                            validate: (value) => {
                              if (!value) return true;
                              const today = new Date();
                              today.setHours(0, 0, 0, 0); // Reset time to compare just the calendar date
                              return new Date(value) >= today || "Start date must be today or a future date";
                            }
                          }}
                          render={({ field, fieldState }) => (
                            <Input
                              label="Start Date *"
                              type="date"
                              // Disables past dates in the browser's date picker UI
                              min={new Date().toISOString().slice(0, 10)}
                              value={field.value ? new Date(field.value).toISOString().slice(0, 10) : ""}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value ? new Date(e.target.value) : undefined
                                )
                              }
                              error={fieldState.error?.message}
                              className={compactInputClass}
                              required
                              readOnly={prefilled.start_date}
                            />
                          )}
                        />
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Address *
                          </label>
                          <textarea
                            {...register("personalDetails.address")}
                            rows={3}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                            placeholder="Enter your full address"
                            required
                          />
                          {errors.personalDetails?.address && (
                            <div className="text-sm text-red-600 font-medium">
                              {errors.personalDetails?.address.message}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Contact Info (merged into Step 1) */}
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">
                            Contact Information
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Controller
                              name="contactInfo.mobileNo"
                              control={control}
                              render={({ field, fieldState }) => (
                                <Input
                                  label="Mobile No *"
                                  {...field}
                                  error={fieldState.error?.message}
                                  placeholder="077 123 4567"
                                  type="tel"
                                  className={compactInputClass}
                                  required
                                />
                              )}
                            />
                            <Controller
                              name="contactInfo.residenceNo"
                              control={control}
                              render={({ field, fieldState }) => (
                                <Input
                                  label="Residence No *"
                                  {...field}
                                  error={fieldState.error?.message}
                                  placeholder="011 234 5678"
                                  type="tel"
                                  className={compactInputClass}
                                  required
                                />
                              )}
                            />
                          </div>
                          <div className="mt-4">
                            <Controller
                              name="contactInfo.email"
                              control={control}
                              render={({ field, fieldState }) => (
                                <Input
                                  label="Email *"
                                  {...field}
                                  error={fieldState.error?.message}
                                  placeholder="example@gmail.com"
                                  type="email"
                                  className={compactInputClass}
                                  required
                                />
                              )}
                            />
                          </div>
                          <div className="mt-4">
                            <Controller
                              name="contactInfo.relationship"
                              control={control}
                              render={({ field, fieldState }) => (
                                <div className="flex flex-col gap-1 w-full">
                                  <label className="text-sm font-medium text-gray-700">Relationship *</label>
                                  <select
                                    {...field}
                                    className={`${compactInputClass} border rounded bg-white px-2 py-1.5`}
                                    required
                                  >
                                    <option value="" disabled>Select Relationship</option>
                                    <option value="single">Single</option>
                                    <option value="married">Married</option>
                                    <option value="divorced">Divorced</option>
                                    <option value="widowed">Widowed</option>
                                  </select>
                                  {fieldState.error?.message && (
                                    <span className="text-red-500 text-xs mt-1">{fieldState.error.message}</span>
                                  )}
                                </div>
                              )}
                            />
                          </div>
                        </div>

                        <div className="border-t border-gray-200 pt-6">
                          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <Phone className="h-5 w-5 mr-2 text-teal-600" />
                            Emergency Contact
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Controller
                              name="contactInfo.emergencyContactName"
                              control={control}
                              render={({ field, fieldState }) => (
                                <Input
                                  label="Name *"
                                  {...field}
                                  error={fieldState.error?.message}
                                  placeholder="Emergency contact name"
                                  className={compactInputClass}
                                  required
                                />
                              )}
                            />

                            <Controller
                              name="contactInfo.emergencyContactTelephone"
                              control={control}
                              render={({ field, fieldState }) => (
                                <Input
                                  label="Telephone *"
                                  {...field}
                                  error={fieldState.error?.message}
                                  placeholder="077 987 6543"
                                  type="tel"
                                  className={compactInputClass}
                                  required
                                />
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: BOC Bank Details */}
                  {currentStep === 2 && (
                    <div className="space-y-6 animate-fade-in">
                      <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          BOC Bank Account Details
                        </h3>
                        <p className="text-gray-600">
                          {isGovInstitute 
                            ? "Please provide your Bank of Ceylon (BOC) account details. This is mandatory for government institute trainees."
                            : "Provide your Bank of Ceylon (BOC) account details (optional)."}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Controller
                          name="bankDetails.accountHolderName"
                          control={control}
                          render={({ field, fieldState }) => (
                            <Input
                              label={isGovInstitute ? "Account Holder Name *" : "Account Holder Name"}
                              {...field}
                              value={field.value ?? ""}
                              error={fieldState.error?.message}
                              placeholder="Enter account holder name"
                              className={compactInputClass}
                              required={isGovInstitute}
                            />
                          )}
                        />
                        <Controller
                          name="bankDetails.accountNo"
                          control={control}
                          render={({ field, fieldState }) => (
                            <Input
                              label={isGovInstitute ? "Account Number *" : "Account Number"}
                              {...field}
                              value={field.value ?? ""}
                              error={fieldState.error?.message}
                              placeholder="Enter BOC account number"
                              className={compactInputClass}
                              required={isGovInstitute}
                            />
                          )}
                        />
                        <Controller
                          name="bankDetails.branchName"
                          control={control}
                          render={({ field, fieldState }) => (
                            <Input
                              label={isGovInstitute ? "Branch Name *" : "Branch Name"}
                              {...field}
                              value={field.value ?? ""}
                              error={fieldState.error?.message}
                              placeholder="Enter branch name"
                              className={compactInputClass}
                              required={isGovInstitute}
                            />
                          )}
                        />
                        <Controller
                          name="bankDetails.branchCode"
                          control={control}
                          render={({ field, fieldState }) => (
                            <Input
                              label={isGovInstitute ? "Branch Code *" : "Branch Code"}
                              {...field}
                              value={field.value ?? ""}
                              error={fieldState.error?.message}
                              placeholder="Enter branch code"
                              className={compactInputClass}
                              required={isGovInstitute}
                            />
                          )}
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 3: Documents */}
                  {currentStep === 3 && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="text-center mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          Required Documents
                        </h3>
                        <p className="text-gray-600">
                          Please upload the following documents
                        </p>
                      </div>

                      <div className="bg-blue-50 p-3 rounded-lg mb-4">
                        <h4 className="font-medium text-blue-900 mb-2">
                          Required Documents:
                        </h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• NIC Scan Both Sides</li>
                          <li>• University ID Scan Both Sides</li>
                          <li>• Police Report</li>
                          <li>• Institute Letter</li>
                          <li>• Consent Letter</li>
                          <li>• BOC Bank Statement or Passbook {isGovInstitute ? "" : "(Optional)"}</li>
                        </ul>
                      </div>

                      {/* Compact Document Uploads with Drag & Drop */}
                      <div className="space-y-4">

                        {/* Documents - Compact Single Column with Drag & Drop */}
                        {[{
                          key: "nicScan",
                          label: "NIC Scan",
                          file: nicScan,
                          uploadText: "NIC Scan",
                        },
                        {
                          key: "universityId",
                          label: "University ID",
                          file: universityId,
                          uploadText: "University ID",
                        },
                        {
                          key: "policeReport",
                          label: "Police Report",
                          file: policeReport,
                          uploadText: "Police Report",
                        },
                        {
                          key: "instituteLetter",
                          label: "Institute Letter",
                          file: instituteLetter,
                          uploadText: "Institute Letter",
                        },
                        {
                          key: "consentLetter",
                          label: "Consent Letter",
                          file: consentLetter,
                          uploadText: "Consent Letter",
                        },
                        {
                          key: "bankPassbook",
                          label: "BOC Bank Statement or Passbook",
                          file: bankPassbook,
                          uploadText: "Statement/Passbook",
                        },
                        ].map(({ key, label, file, uploadText }) => {
                          const isRejected = rejectionNotification ? checkIsRejected(key) : false;
                          const reason = isRejected ? getRejectionReason(key) : "";
                          const hasNotification = !!rejectionNotification;
                          const isValidAndApproved = hasNotification && !isRejected && file !== null;

                          return (
                            <div key={key} className={`p-4 rounded-xl border transition-all ${isRejected ? "bg-rose-50/40 border-rose-200 shadow-sm animate-fade-in" :
                              isValidAndApproved ? "bg-emerald-50/30 border-emerald-100" :
                                "bg-white border-gray-200"
                              }`}>
                              <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-semibold text-gray-800">
                                  {label} {key === "bankPassbook" ? (isGovInstitute ? "*" : "(Optional)") : "*"}
                                </label>
                                {hasNotification && (file !== null || isRejected) && (
                                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${isRejected ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    }`}>
                                    {isRejected ? "Correction Required" : "Approved / Valid"}
                                  </span>
                                )}
                              </div>

                              {isRejected && reason && (
                                <div className="mb-3 px-3 py-2 bg-rose-100/50 border border-rose-200/50 rounded-lg text-rose-800 text-xs font-medium flex items-center gap-2">
                                  <span className="shrink-0 w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                                  <span>Issue: {reason}</span>
                                </div>
                              )}

                              {isValidAndApproved ? (
                                <div className="bg-emerald-50/50 rounded-lg p-3 border border-emerald-100 flex items-center justify-between">
                                  <div className="flex items-center">
                                    <CheckCircle2 className="h-5 w-5 text-emerald-600 mr-2 shrink-0" />
                                    <div>
                                      <p className="text-xs font-semibold text-emerald-800">
                                        Document verified by admin
                                      </p>
                                      <p className="text-[10px] text-emerald-600/85 mt-0.5">
                                        No changes needed.
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ) : file instanceof File ? (
                                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 flex items-center justify-between animate-fade-in">
                                  <div className="flex items-center">
                                    {file.type === "application/pdf" ? (
                                      <FileText className="h-5 w-5 text-red-500 mr-2" />
                                    ) : (
                                      <FileImage className="h-5 w-5 text-blue-500 mr-2" />
                                    )}
                                    <div>
                                      <p className="text-xs font-medium text-gray-900 truncate max-w-[200px]">
                                        {file.name}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {(file.size / 1024 / 1024).toFixed(1)} MB
                                      </p>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => removeDocument(key)}
                                    type="button"
                                    className="text-red-600 hover:text-red-500 p-1 hover:bg-red-50 rounded-md transition-colors"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              ) : (
                                <div
                                  className={`border-2 border-dashed rounded-lg p-3 text-center transition-colors ${dragActiveSection === key
                                    ? "border-blue-500 bg-blue-50 animate-pulse"
                                    : "border-gray-300 hover:border-blue-400"
                                    }`}
                                  onDragOver={(e) => handleDragOver(e, key)}
                                  onDragLeave={handleDragLeave}
                                  onDrop={(e) => handleDrop(e, key)}
                                >
                                  <div className="flex items-center justify-center">
                                    <Upload className="h-5 w-5 text-gray-400 mr-2" />
                                    <label
                                      htmlFor={`${key}-upload`}
                                      className="cursor-pointer"
                                    >
                                      <span className="text-blue-600 hover:text-blue-500 text-xs font-medium">
                                        Click or drag {uploadText}
                                      </span>
                                      <input
                                        id={`${key}-upload`}
                                        type="file"
                                        className="sr-only"
                                        accept=".pdf,.png,.jpg,.jpeg"
                                        onChange={(e) =>
                                          e.target.files?.[0] &&
                                          handleDocumentUpload(e.target.files[0], key)
                                        }
                                      />
                                    </label>
                                    <span className="text-[11px] text-gray-500 ml-2 font-medium">
                                      Max 1MB (PDF, PNG, JPG)
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                    <Button
                      variant="outline"
                      onClick={prevStep}
                      icon={ChevronLeft}
                      iconPosition="left"
                      type="button"
                    >
                      {currentStep === 1 ? "Back to Login" : "Previous"}
                    </Button>

                    {currentStep < 3 ? (
                      <Button
                        onClick={nextStep}
                        icon={ChevronRight}
                        iconPosition="right"
                        type="button"
                      >
                        {currentStep === 2 && !isGovInstitute ? "Next Step (or Skip)" : "Next Step"}
                      </Button>
                    ) : (
                      <Button
                        onClick={nextStep}
                        loading={isSubmitting}
                        variant="primary"
                        className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700"
                        type="button"
                      >
                        Submit Details
                      </Button>
                    )}
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
