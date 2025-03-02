import mongoose, { Schema, Document } from "mongoose";

export interface ITicket extends Document {
  title: string;
  description: string;
  status: "Open" | "In Progress" | "Closed";
  user: mongoose.Types.ObjectId;
}

const TicketSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Closed"],
      default: "Open",
    },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ITicket>("Ticket", TicketSchema);
