import { TraineeUser } from "./TraineeUser.js";
import { Staff } from "./Staff.js";
import { TraineeDetails } from "./TraineeDetails.js";

TraineeUser.hasOne(TraineeDetails, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});
TraineeDetails.belongsTo(TraineeUser, { foreignKey: "user_id" });

export {
  TraineeUser,
  Staff,
  TraineeDetails,
};
