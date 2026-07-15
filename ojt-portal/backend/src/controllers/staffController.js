import { TraineeUser, TraineeDetails } from "../models/index.js";
import { sequalize } from "../database/sequlize.js";
import { Op } from "sequelize";

export const getAllTrainees = async (req, res) => {
  try {
    const trainees = await TraineeUser.findAll({
      attributes: ['id', 'NIC', 'username', 'email', 'status', 'createdAt'],
      order: [['createdAt', 'DESC']],
    });

    const traineeData = [];
    for (const user of trainees) {
      const traineeInfo = await TraineeDetails.findOne({ where: { user_id: user.id } });
      traineeData.push({
        id: user.id,
        NIC: user.NIC,
        username: user.username,
        email: user.email,
        status: user.status,
        createdAt: user.createdAt,
        name: traineeInfo ? traineeInfo.name : user.username || 'N/A',
        institute: traineeInfo ? traineeInfo.instituteName : 'N/A',
      });
    }

    res.status(200).json(traineeData);
  } catch (error) {
    console.error("Error fetching trainees:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}; // Ensure this function only closes ONCE here before createTrainee starts

export const createTrainee = async (req, res) => {
  try {
    const { username, password, email, NIC } = req.body;

    if (!username || !password || !NIC) {
      return res.status(400).json({ error: "Username, Password, and NIC are required." });
    }

    const existingNIC = await TraineeUser.findOne({ where: { NIC } });
    if (existingNIC) {
      return res.status(400).json({ error: "A trainee with this NIC already exists." });
    }

    const existingUsername = await TraineeUser.findOne({ where: { username } });
    if (existingUsername) {
      return res.status(400).json({ error: "This username is already taken." });
    }

    const newTrainee = await TraineeUser.create({
      username,
      password,
      NIC,
      email: email || null,
      status: "Pending",
    });

    res.status(201).json({
      message: "TraineeDetails created successfully",
      trainee: {
        id: newTrainee.id,
        username: newTrainee.username,
        NIC: newTrainee.NIC,
        email: newTrainee.email,
        status: newTrainee.status,
      }
    });
  } catch (error) {
    console.error("Error creating trainee:", error);
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        error: "Validation error",
        details: error.errors.map(e => e.message)
      });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const verifyTrainee = async (req, res) => {
  const transaction = await sequalize.transaction();
  try {
    const { id } = req.params;
    const { status, comment } = req.body;

    if (!['Active', 'Rejected'].includes(status)) {
      await transaction.rollback();
      return res.status(400).json({ error: "Invalid status value. Must be 'Active' or 'Rejected'." });
    }

    if (status === 'Rejected' && (!comment || !comment.trim())) {
      await transaction.rollback();
      return res.status(400).json({ error: "A feedback comment is required when rejecting a trainee." });
    }

    const traineeUser = await TraineeUser.findByPk(id, { transaction });
    if (!traineeUser) {
      await transaction.rollback();
      return res.status(404).json({ error: "TraineeDetails not found." });
    }

    const newStatus = status === 'Active' ? 'Active' : 'Pending';
    const rejectionReason = status === 'Rejected' ? comment : null;
    await traineeUser.update({ status: newStatus, rejection_reason: rejectionReason }, { transaction });

    await transaction.commit();

    return res.status(200).json({
      message: `TraineeDetails status updated to ${newStatus} successfully.`,
      status: newStatus
    });
  } catch (error) {
    if (transaction) {
      try {
        await transaction.rollback();
      } catch (rollbackError) {
        console.error("Rollback failed:", rollbackError);
      }
    }
    console.error("Error in verifyTrainee:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateTrainee = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, NIC, status } = req.body;

    const trainee = await TraineeUser.findByPk(id);
    if (!trainee) {
      return res.status(404).json({ error: "Trainee not found" });
    }

    if (NIC && NIC !== trainee.NIC) {
      const existingNIC = await TraineeUser.findOne({ where: { NIC } });
      if (existingNIC) {
        return res.status(400).json({ error: "A trainee with this NIC already exists." });
      }
      trainee.NIC = NIC;
    }

    if (email !== undefined) trainee.email = email || null;
    if (status) trainee.status = status;

    await trainee.save();

    res.status(200).json({
      message: "Trainee updated successfully",
      trainee: {
        id: trainee.id,
        username: trainee.username,
        NIC: trainee.NIC,
        email: trainee.email,
        status: trainee.status,
      }
    });
  } catch (error) {
    console.error("Error updating trainee:", error);
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        error: "Validation error",
        details: error.errors.map(e => e.message)
      });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteTrainee = async (req, res) => {
  try {
    const { id } = req.params;

    const trainee = await TraineeUser.findByPk(id);
    if (!trainee) {
      return res.status(404).json({ error: "Trainee not found" });
    }

    // This will delete the user, and relying on foreign key constraints or manual cleanup 
    // to remove TraineeDetails if necessary. For now, removing the user is sufficient.
    await trainee.destroy();

    res.status(200).json({ message: "Trainee deleted successfully" });
  } catch (error) {
    console.error("Error deleting trainee:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
