import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please Provide an Username!"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Please Provide an Email!"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please Provide a Password!"],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  ForgotPasswordToken: String,
  ForgotPasswordTokenExpiry: Date,
  VerificationToken: String,
  VerificationTokenExpiry: Date,
});

//To check if the user model is already there in DB? otherwise create one...
const User = mongoose.models.users || mongoose.model("users", UserSchema);

export default User;