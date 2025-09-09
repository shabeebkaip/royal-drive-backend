import mongoose, { Document, Schema } from 'mongoose';

// Example interface for demonstration purposes
interface IExample extends Document {
  name: string;
  description?: string;
  isActive: boolean;
}

const ExampleSchema = new Schema<IExample>(
  {
    name: { type: String, required: true },
    description: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false }
);

export const Example = mongoose.model<IExample>('Example', ExampleSchema);
export type { IExample };
