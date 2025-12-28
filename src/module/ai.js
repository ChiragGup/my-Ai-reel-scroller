import mongoose from "mongoose";

const AiSchema = new mongoose.Schema(
  {
    userPrompt: {
      type: String,
      required: true,
    },

    // 👇 THIS is what you want
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Prompt =
  mongoose.models.Prompt || mongoose.model("Prompt", AiSchema);

export default Prompt;
