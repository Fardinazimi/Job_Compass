import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: true,
      validate: [{
        validator: function (value) {
          // Only validate password if it's being modified
          if (this.isModified('password')) {
            return value.length > 4; // Must be more than 4 characters
          }
          return true;
        },
        message: "Password must be more than 4 characters long",
      }],
    },
    theme: { type: String, enum: ["light", "dark"], default: "light" },
    weeklyReminder: { type: Boolean, default: false },
    monthlyReminder: { type: Boolean, default: false },
    emailNotification: { type: Boolean, default: false },
    profilePicture: { type: String, default: "" },
  },
  { timestamps: true }
);

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
