import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  serviceId: string;
  clientId: string;
  clientName: string;   
  clientAvatar: string; 
  rating: number;
  comment?: string;
  createdAt: Date;
}

const ReviewSchema = new Schema({
  serviceId: { type: String, required: true, index: true }, 
  clientId: { type: String, required: true },
  clientName: { type: String, required: true },
  clientAvatar: { type: String, default: '' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, default: '', trim: true },
}, {
  timestamps: true, 
  versionKey: false
});

ReviewSchema.index({ serviceId: 1, clientId: 1 }, { unique: true });

export const ReviewModel = mongoose.model<IReview>('Review', ReviewSchema);