import z from "zod";
import { sequalize } from "../database/sequlize.js";
import { TraineeUser, TraineeDetails } from "../models/index.js";

export const changeProfile = async (req, res) => {
  const paramsSchema = z.object({
    userId: z.string().or(z.number()).transform(String),
  });

  const bodySchema = z
    .object({
      username: z.string().min(2).optional(),
      email: z.string().email().optional(),
      phone: z.string().optional(),
      bank_accname: z.string().optional(),
      bank_accno: z.string().optional(),
      bank_bno: z.string().or(z.number()).transform(String).optional(),
      bank_branch: z.string().optional(),
    })
    .refine(
      (data) => Object.values(data).some((v) => typeof v !== "undefined"),
      { message: "At least one field must be provided" }
    );

  try {
    const { userId } = paramsSchema.parse(req.params);
    const parsedBody = bodySchema.parse(req.body);

    const user = await TraineeUser.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const trainee = await TraineeDetails.findOne({ where: { user_id: userId } });
    if (!trainee) {
      return res.status(404).json({ message: "TraineeDetails profile not found" });
    }

    const t = await sequalize.transaction();
    try {
      if (parsedBody.username) {
        await user.update({ username: parsedBody.username }, { transaction: t });
      }

      if (parsedBody.email) {
        await user.update({ email: parsedBody.email }, { transaction: t });
      }

      const traineeUpdates = {};
      if (parsedBody.phone) traineeUpdates.Mobile_No = parsedBody.phone;
      if (parsedBody.bank_accname) traineeUpdates.bank_accname = parsedBody.bank_accname;
      if (parsedBody.bank_accno) traineeUpdates.bank_accno = parsedBody.bank_accno;
      if (parsedBody.bank_bno) traineeUpdates.bank_bno = parsedBody.bank_bno;
      if (parsedBody.bank_branch) traineeUpdates.bank_branch = parsedBody.bank_branch;

      if (Object.keys(traineeUpdates).length > 0) {
        await trainee.update(traineeUpdates, { transaction: t });
      }

      await t.commit();
      return res.status(200).json({ message: "Profile updated successfully" });
    } catch (err) {
      await t.rollback();
      throw err;
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid input", errors: error.errors });
    }
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const changePassword = async (req, res) => {
  const paramsSchema = z.object({
    userId: z.string().or(z.number()).transform(String),
  });

  const bodySchema = z.object({
    currentPassword: z.string().min(6, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters")
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/,
        "Password must include at least one letter, one number, and one special character"
      ),
  }).refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

  try {
    const { userId } = paramsSchema.parse(req.params);
    const { currentPassword, newPassword } = bodySchema.parse(req.body);

    const user = await TraineeUser.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isValid = await user.validatePassword(currentPassword);
    if (!isValid) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid input", errors: error.errors });
    }
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const uploadProfilePhoto = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const trainee = await TraineeDetails.findOne({ where: { user_id: userId } });
    if (!trainee) {
      return res.status(404).json({ message: "TraineeDetails profile not found" });
    }

    trainee.profilePhoto = req.file.buffer;
    await trainee.save();

    res.setHeader("Content-Type", req.file.mimetype || "image/jpeg");
    res.setHeader("Cache-Control", "no-store");
    return res.send(req.file.buffer);
  } catch (error) {
    console.error("Profile photo upload error:", error);
    return res.status(500).json({ message: "Internal server error during upload" });
  }
};

export const requestEdit = async (req, res) => {
  // Mock function since edit requests are removed
  return res.status(200).json({
    message: "Edit request submitted successfully. Please wait for admin approval.",
    edit: "REQEST",
  });
};

export const updateDetails = async (req, res) => {
  const paramsSchema = z.object({
    userId: z.string().or(z.number()).transform(String),
  });

  const bodySchema = z.object({
    personalDetails: z.object({
      name: z.string().min(1, "Name is required").max(100).optional(),
      fullName: z.string().min(1, "Full name is required").max(200).optional(),
      address: z.string().min(1, "Address is required").max(200).optional(),
    }).optional(),
    contactInfo: z.object({
      mobileNo: z.string().min(1, "Mobile number is required").optional(),
      residenceNo: z.string().min(1, "Residence number is required").optional(),
      emergencyContactName: z.string().min(1, "Emergency contact name is required").optional(),
      relationship: z.string().min(1, "Relationship is required").optional(),
      emergencyContactTelephone: z.string().min(1, "Emergency contact telephone is required").optional(),
    }).optional(),
  });

  try {
    const { userId } = paramsSchema.parse(req.params);
    const parsedBody = bodySchema.parse(req.parsedBody || req.body);

    const trainee = await TraineeDetails.findOne({ where: { user_id: userId } });
    if (!trainee) {
      return res.status(404).json({ message: "TraineeDetails profile not found" });
    }

    const updates = {};
    if (parsedBody.personalDetails) {
      if (parsedBody.personalDetails.name) updates.name = parsedBody.personalDetails.name;
      if (parsedBody.personalDetails.fullName) updates.fullName = parsedBody.personalDetails.fullName;
      if (parsedBody.personalDetails.address) updates.address = parsedBody.personalDetails.address;
    }

    if (parsedBody.contactInfo) {
      if (parsedBody.contactInfo.mobileNo) updates.Mobile_No = parsedBody.contactInfo.mobileNo;
      if (parsedBody.contactInfo.residenceNo) updates.Resident_No = parsedBody.contactInfo.residenceNo;
      if (parsedBody.contactInfo.emergencyContactName) updates.ec_name = parsedBody.contactInfo.emergencyContactName;
      if (parsedBody.contactInfo.relationship) updates.ec_relationship = parsedBody.contactInfo.relationship;
      if (parsedBody.contactInfo.emergencyContactTelephone) updates.ec_telephone = parsedBody.contactInfo.emergencyContactTelephone;
    }

    if (req.files) {
      const processFile = (fieldName, snapshotField) => {
        if (req.files[fieldName] && req.files[fieldName][0]) {
          updates[snapshotField] = req.files[fieldName][0].buffer;
        }
      };
      processFile("nicScan", "nic_scan");
      processFile("policeReport", "police_report");
      processFile("universityId", "university_id");
      processFile("instituteLetter", "institute_letter");
      processFile("consentLetter", "consent_letter");
      processFile("bankPassbook", "bank_passbook");
    }

    if (Object.keys(updates).length > 0) {
      await trainee.update(updates);
    }

    return res.status(200).json({ message: "Details updated successfully." });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid input", errors: error.errors });
    }
    console.error("Update details error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
