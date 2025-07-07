import { Schema, models, model } from 'mongoose';

export interface IVendor {
  vendorName: string;
  bankAccountNo: number;
  bankName: string;
  addressLine1: string;
  addressLine2?: string;
  city?: string;
  country?: string;
  zipCode?: number;
}

const VendorSchema = new Schema<IVendor>({
  vendorName: { type: String, required: true },
  bankAccountNo: { type: Number, required: true },
  bankName: { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String },
  country: { type: String },
  zipCode: { type: Number },
});

export default models.Vendor || model<IVendor>('Vendor', VendorSchema); 