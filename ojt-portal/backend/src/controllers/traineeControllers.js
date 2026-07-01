import { z } from "zod";
import { sequalize } from "../database/sequlize.js";
import { TraineeUser, TraineeDetails } from "../models/index.js";
import fs from "fs/promises";
import path from "path";

export const accountStatusUpdate = async (req, res) => {
  const schema = z.object({
    id: z.number(),
    status: z.string(),
  });

  try {
    const parsedData = schema.parse(req.body);

    const updatedRows = await TraineeUser.update(
      { status: parsedData.status },
      { where: { id: parsedData.id } }
    );

    if (updatedRows > 0) {
      const updatedUser = await TraineeUser.findByPk(parsedData.id);
      return res.status(200).json({
        message: "Account status updated successfully",
        user: {
          id: updatedUser.id,
          NIC: updatedUser.NIC,
          username: updatedUser.username,
          status: updatedUser.status,
        },
      });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid input", errors: error.errors });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getDetails = async (req, res) => {
  try {
    const user = await TraineeUser.findByPk(req.user.id, {
      include: [{ model: TraineeDetails }],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getDetailsById = async (req, res) => {
  const schema = z.object({ id: z.string() });

  try {
    const parsedData = schema.parse(req.params);
    const user = await TraineeUser.findByPk(parsedData.id, {
      include: [{ model: TraineeDetails }],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const addInformation = async (req, res) => {
  const schema = z.object({
    user_id: z.string(),
    personalDetails: z.object({
      name: z.string().trim().min(2),
      fullname: z.string().trim().min(2),
      nicNo: z.string().trim(),
      address: z.string().trim().min(10),
      trainingType: z.string().trim().min(2),
      instituteName: z.string().trim().min(2),
      course: z.string().trim().min(2),
      period: z.string().trim().min(2),
      start_date: z.string().trim().min(2),
    }),
    contactInfo: z.object({
      mobileNo: z.string().trim(),
      residenceNo: z.string().trim(),
      email: z.string().trim().email(),
      emergencyContactName: z.string().trim().min(2),
      relationship: z.string().trim().min(2),
      emergencyContactTelephone: z.string().trim(),
    }),
    bankDetails: z.object({
      accountHolderName: z.string().trim().optional().nullable(),
      accountNo: z.string().trim().optional().nullable(),
      branchCode: z.string().trim().optional().nullable(),
      branchName: z.string().trim().optional().nullable(),
    }).optional(),
  });

  const transaction = await sequalize.transaction();

  try {
    const parsedData = schema.parse(req.parsedBody || req.body);
    const user = await TraineeUser.findByPk(parsedData.user_id, { transaction });

    if (!user) {
      await transaction.rollback();
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const getFileBuffer = (fileField) => {
      if (req.files && req.files[fileField] && req.files[fileField][0]) {
        return req.files[fileField][0].buffer;
      }
      return null;
    };

    const existingTrainee = await TraineeDetails.findOne({ where: { user_id: user.id }, transaction });

    const traineeData = {
      name: parsedData.personalDetails.name,
      fullName: parsedData.personalDetails.fullname,
      address: parsedData.personalDetails.address,
      training_type: parsedData.personalDetails.trainingType,
      instituteName: parsedData.personalDetails.instituteName,
      course: parsedData.personalDetails.course,
      training_period: parsedData.personalDetails.period,
      start_date: parsedData.personalDetails.start_date.split("T")[0],
      Mobile_No: parsedData.contactInfo.mobileNo,
      Resident_No: parsedData.contactInfo.residenceNo,
      ec_name: parsedData.contactInfo.emergencyContactName,
      ec_relationship: parsedData.contactInfo.relationship,
      ec_telephone: parsedData.contactInfo.emergencyContactTelephone,
      bank_accname: parsedData.bankDetails?.accountHolderName || null,
      bank_accno: parsedData.bankDetails?.accountNo || null,
      bank_bno: parsedData.bankDetails?.branchCode ? parseInt(parsedData.bankDetails.branchCode, 10) : null,
      bank_branch: parsedData.bankDetails?.branchName || null,
    };

    // Keep existing buffers if not uploaded
    const fieldsToUpdate = [
      { key: 'profilePhoto', form: 'personalDetails[profilePhoto]' },
      { key: 'nic_scan', form: 'documents[nicScan]' },
      { key: 'police_report', form: 'documents[policeReport]' },
      { key: 'university_id', form: 'documents[universityId]' },
      { key: 'institute_letter', form: 'documents[instituteLetter]' },
      { key: 'consent_letter', form: 'documents[consentLetter]' },
      { key: 'bank_passbook', form: 'documents[bankPassbook]' }
    ];

    for (let f of fieldsToUpdate) {
      const buffer = getFileBuffer(f.form);
      if (buffer) {
        traineeData[f.key] = buffer;
      }
    }

    if (existingTrainee) {
      await existingTrainee.update(traineeData, { transaction });
    } else {
      await TraineeDetails.create({ ...traineeData, user_id: user.id }, { transaction });
    }

    await user.update({ status: "Processing" }, { transaction });

    await transaction.commit();

    return res.status(201).json({ success: true, message: "Information added successfully" });
  } catch (error) {
    try { await transaction.rollback(); } catch(e) {}
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const streamDocument = async (req, res) => {
  try {
    const { userId, docType } = req.params;
    const trainee = await TraineeDetails.findOne({ where: { user_id: userId } });

    if (!trainee || !trainee[docType]) {
      return res.status(404).json({ message: "Document not found" });
    }

    const documentBuffer = trainee[docType];
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${docType}.pdf"`);
    res.send(documentBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const streamProfilePhoto = async (req, res) => {
  try {
    const { userId } = req.params;
    const trainee = await TraineeDetails.findOne({ where: { user_id: userId } });

    if (!trainee || !trainee.profilePhoto) {
      return res.status(404).json({ message: "Photo not found" });
    }

    res.setHeader("Content-Type", "image/jpeg");
    res.send(trainee.profilePhoto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getTraineeByNIC = async (req, res) => {
  try {
    const { nic } = req.params;
    const user = await TraineeUser.findOne({ where: { NIC: nic }, include: [{ model: TraineeDetails }] });

    if (!user) {
      return res.status(404).json({ message: "TraineeDetails not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};