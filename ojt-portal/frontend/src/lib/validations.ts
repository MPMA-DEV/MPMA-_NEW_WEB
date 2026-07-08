import { z } from "zod";
import { INSTITUTES_DATA } from "../data/institutes";

// Centralized file upload size limit (used across all pages)
export const MAX_FILE_SIZE_MB = 1.0;

// Common validation schemas
export const emailSchema = z
  .string()
  .email("Please enter a valid email address");
export const phoneSchema = z
  .string()
  .regex(
    /^0\d{2}(?:\s?\d{2}\s?\d{2}\s?\d{3}|\s?\d{3}\s?\d{4}|\d{7})$/,
    "Please enter a valid phone number (012 345 6789)"
  );
export const nicSchema = z
  .string()
  .regex(/^(\d{9}[vVxX]|\d{12})$/, "Please enter a valid NIC number");

// Login validation schema
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(50, "Password is too long"),
});

// Onboarding validation schemas
export const personalDetailsSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be less than 50 characters")
      .regex(/^([a-zA-Z]\.)*[a-zA-Z]\s[a-zA-Z]{2,}( [a-zA-Z]+)*$/, "Please use format: S.H Perera"),
    fullname: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Full name must be less than 100 characters"),
    nicNo: nicSchema,
    username: z.string().optional(),
    address: z
      .string()
      .min(10, "Address must be at least 10 characters")
      .max(200, "Address must be less than 200 characters"),
    trainingType: z.enum([
      "Undergraduate",
      "Certificate",
      "Diploma",
      "CINEC",
      "NAITA Craft",
      "SMTI",
    ] as const).optional(),
    instituteName: z.string().min(2, "Institute name is required"),
    course: z.string().min(2, "Course is required"),
    period: z.string().min(2, "Training Period is required"),
    start_date: z.date().optional(),
    profilePhoto: z
      .instanceof(File, { message: "Profile photo is required" })
      .nullable()
      .refine((file) => file === null || file.size <= MAX_FILE_SIZE_MB * 1024 * 1024, {
        message: `File must be less than ${MAX_FILE_SIZE_MB}MB`,
      }),
  })
  .superRefine((data, ctx) => {
    const fixedMap: Record<string, string> = {
      CINEC: "CINEC",
      "NAITA Craft": "NAITA",
      SMTI: "SMTI",
    };
    if (data.trainingType && data.trainingType in fixedMap) {
      const expected = fixedMap[data.trainingType as keyof typeof fixedMap];
      if (data.instituteName !== expected) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Institute name must be ${expected} for ${data.trainingType}`,
          path: ["instituteName"],
        });
      }
    }
  });

export const contactInfoSchema = z.object({
  mobileNo: phoneSchema,
  residenceNo: phoneSchema,
  email: emailSchema,
  emergencyContactName: z.string().min(2, "Emergency contact name is required"),
  relationship: z.string().min(2, "Relationship is required"),
  emergencyContactTelephone: phoneSchema,
});

const documentsSchema = z.object({
  nicScan: z.any().refine((file) => file !== null, "NIC Scan is required").refine((file) => file === null || (file instanceof File && file.size <= MAX_FILE_SIZE_MB * 1024 * 1024), `File must be less than ${MAX_FILE_SIZE_MB}MB`),
  policeReport: z
    .any()
    .refine((file) => file !== null, "Police Report is required")
    .refine((file) => file === null || (file instanceof File && file.size <= MAX_FILE_SIZE_MB * 1024 * 1024), `File must be less than ${MAX_FILE_SIZE_MB}MB`),
  universityId: z
    .any()
    .refine((file) => file !== null, "University ID is required")
    .refine((file) => file === null || (file instanceof File && file.size <= MAX_FILE_SIZE_MB * 1024 * 1024), `File must be less than ${MAX_FILE_SIZE_MB}MB`),
  instituteLetter: z
    .any()
    .refine((file) => file !== null, "Institute Letter is required")
    .refine((file) => file === null || (file instanceof File && file.size <= MAX_FILE_SIZE_MB * 1024 * 1024), `File must be less than ${MAX_FILE_SIZE_MB}MB`),
  consentLetter: z
    .any()
    .refine((file) => file !== null, "Consent Letter is required")
    .refine((file) => file === null || (file instanceof File && file.size <= MAX_FILE_SIZE_MB * 1024 * 1024), `File must be less than ${MAX_FILE_SIZE_MB}MB`),
  bankPassbook: z.any().nullable().optional()
    .refine((file) => !file || (file instanceof File && file.size <= MAX_FILE_SIZE_MB * 1024 * 1024), `File must be less than ${MAX_FILE_SIZE_MB}MB`),
});


export const paymentSchema = z.object({
  cardNumber: z
    .string()
    .regex(
      /^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/,
      "Please enter a valid card number"
    ),
  expiryDate: z
    .string()
    .regex(
      /^(0[1-9]|1[0-2])\/\d{2}$/,
      "Please enter a valid expiry date (MM/YY)"
    ),
  cvv: z.string().regex(/^\d{3,4}$/, "Please enter a valid CVV"),
  cardName: z.string().min(2, "Cardholder name is required"),
});

export const OnboardingSchema = z.object({
  personalDetails: personalDetailsSchema,
  contactInfo: contactInfoSchema,
  bankDetails: z.object({
    accountHolderName: z.string()
      .min(2, "Account holder name must be at least 2 characters")
      .or(z.literal(""))
      .nullable()
      .optional(),
    accountNo: z.string()
      .length(10, "BOC Account number must be exactly 10 digits")
      .regex(/^\d+$/, "Account number must contain only numbers")
      .or(z.literal(""))
      .nullable()
      .optional(),
    branchName: z.string()
      .min(2, "Branch name must be at least 2 characters")
      .or(z.literal(""))
      .nullable()
      .optional(),
    branchCode: z.string()
      .length(3, "BOC Branch code must be exactly 3 digits")
      .regex(/^\d+$/, "Branch code must contain only numbers")
      .or(z.literal(""))
      .nullable()
      .optional(),
  }).optional(),
  documents: documentsSchema,
}).superRefine((data, ctx) => {
  const isGovInst = INSTITUTES_DATA.find(i => i.name === data.personalDetails?.instituteName)?.is_government === 1;

  if (isGovInst) {
    const bd = data.bankDetails;
    if (!bd?.accountHolderName || bd.accountHolderName.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Account holder name is required",
        path: ["bankDetails", "accountHolderName"],
      });
    }
    if (!bd?.accountNo || bd.accountNo.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Account number is required",
        path: ["bankDetails", "accountNo"],
      });
    }
    if (!bd?.branchName || bd.branchName.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Branch name is required",
        path: ["bankDetails", "branchName"],
      });
    }
    if (!bd?.branchCode || bd.branchCode.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Branch code is required",
        path: ["bankDetails", "branchCode"],
      });
    }
    if (!data.documents?.bankPassbook) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "BOC Bank Statement or passbook (Only Students of Government Universities/Technical Institute) is required",
        path: ["documents", "bankPassbook"],
      });
    }
  }
});

// Profile validation schemas
export const profileUpdateSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  email: emailSchema,
  phone: phoneSchema,
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
});

export const bankDetailsSchema = z.object({
  accountNo: z
    .string()
    .min(8, "Account number must be at least 8 digits")
    .max(20, "Account number must be less than 20 digits")
    .regex(/^\d+$/, "Account number must contain only numbers"),
  branchCode: z
    .string()
    .min(3, "Branch code must be at least 3 characters")
    .max(10, "Branch code must be less than 10 characters"),
  accountHolderName: z.string().min(2, "Account holder name is required"),
  bankName: z.string().min(1, "Please select a bank"),
});

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters")
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/,
        "Password must include at least one letter, one number, and one special character"
      ),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const traineeCreateSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  email: emailSchema,
  phone: phoneSchema,
  program: z.string().min(1, "Program is required"),
  batch: z.string().min(1, "Batch is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
});

// Message validation schema
export const messageSchema = z.object({
  recipient: z.string().min(1, "Please select a recipient"),
  subject: z
    .string()
    .min(1, "Subject is required")
    .max(100, "Subject must be less than 100 characters"),
  content: z
    .string()
    .min(1, "Message content is required")
    .max(1000, "Message must be less than 1000 characters"),
});

// Settings validation schemas
export const systemSettingsSchema = z.object({
  instituteName: z.string().min(2, "Institute name is required"),
  instituteEmail: emailSchema,
  institutePhone: phoneSchema,
  instituteAddress: z
    .string()
    .min(10, "Address must be at least 10 characters"),
  trainingHoursPerDay: z
    .number()
    .min(1, "Training hours must be at least 1")
    .max(12, "Training hours cannot exceed 12"),
  workingDaysPerWeek: z
    .number()
    .min(1, "Working days must be at least 1")
    .max(7, "Working days cannot exceed 7"),
  lateThresholdMinutes: z
    .number()
    .min(1, "Late threshold must be at least 1 minute"),
  monthlyFee: z.number().min(0, "Monthly fee cannot be negative"),
  lateFeePercentage: z
    .number()
    .min(0, "Late fee percentage cannot be negative")
    .max(100, "Late fee percentage cannot exceed 100%"),
});

export const emailSettingsSchema = z.object({
  smtpServer: z.string().min(1, "SMTP server is required"),
  smtpPort: z
    .number()
    .min(1, "SMTP port is required")
    .max(65535, "Invalid port number"),
  smtpUsername: emailSchema,
  smtpPassword: z.string().min(1, "SMTP password is required"),
});

// Event validation schema
export const eventSchema = z.object({
  title: z
    .string()
    .min(1, "Event title is required")
    .max(100, "Title must be less than 100 characters"),
  type: z.enum(["training", "payment", "holiday", "meeting", "assessment"]),
  date: z.string().min(1, "Event date is required"),
  time: z.string().optional(),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  attendees: z.number().min(0, "Attendees cannot be negative").optional(),
  location: z
    .string()
    .max(100, "Location must be less than 100 characters")
    .optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type PersonalDetailsFormData = z.infer<typeof personalDetailsSchema>;
export type ContactInfoFormData = z.infer<typeof contactInfoSchema>;
export type DocumentsFormData = z.infer<typeof documentsSchema>;
export type PaymentFormData = z.infer<typeof paymentSchema>;
export type OnboardingFormData = z.infer<typeof OnboardingSchema>;
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
export type BankDetailsFormData = z.infer<typeof bankDetailsSchema>;
export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;
export type TraineeCreateFormData = z.infer<typeof traineeCreateSchema>;
export type MessageFormData = z.infer<typeof messageSchema>;
export type SystemSettingsFormData = z.infer<typeof systemSettingsSchema>;
export type EmailSettingsFormData = z.infer<typeof emailSettingsSchema>;
export type EventFormData = z.infer<typeof eventSchema>;
