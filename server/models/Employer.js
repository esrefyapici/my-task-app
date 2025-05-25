import mongoose from "mongoose";

const employerSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    companyCode: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const Employer = mongoose.model("Employer", employerSchema);
export default Employer;
