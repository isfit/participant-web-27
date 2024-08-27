import mongoose, { Schema, Document } from 'mongoose';

interface IApplication extends Document {
  fullName: string;
  dateOfBirth: Date;
  gender: string;
  nationality: string;
  continent: string;
  residenceCountry: string;
  isStudent: boolean;
  studyField: string;
  university: string;
  universityWebsite?: string;
  studentCertificate?: Buffer;
  isEnglishSpeaker: boolean;
  applyingAs: string;
  themePowerThoughts: string;
  countryPowerIssue: string;
  motivation: string;
  financialSupportReason: string;
  fullOrPartialFunding: string;
  dependents: number;
  familyIncome: string;
  countryTravelingFrom: string;
  otherFundingInfo: string;
  canParticipate: string;
  consentVisa: boolean;
  consentFlight: boolean;
  consentNorwegianLaw: boolean;
  consentReturn: boolean;
  consentPersonalDetails: boolean;
  consentAttendance: boolean;
  consentMedia: boolean;
}

const ApplicationSchema: Schema = new Schema({
  fullName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, required: true },
  nationality: { type: String, required: true },
  continent: { type: String, required: true },
  residenceCountry: { type: String, required: true },
  isStudent: { type: Boolean, required: true },
  studyField: { type: String, required: true },
  university: { type: String, required: true },
  universityWebsite: { type: String },
  studentCertificate: { type: Buffer, required: true },
  isEnglishSpeaker: { type: Boolean, required: true },
  applyingAs: { type: String, required: true },
  themePowerThoughts: { type: String, required: true },
  countryPowerIssue: { type: String, required: true },
  motivation: { type: String, required: true },
  financialSupportReason: { type: String },
  fullOrPartialFunding: { type: String },
  dependents: { type: Number },
  familyIncome: { type: String },
  canParticipate: { type: String },
  countryTravelingFrom: { type: String },
  otherFundingInfo: { type: String },
  consentVisa: { type: Boolean, required: true },
  consentFlight: { type: Boolean, required: true },
  consentNorwegianLaw: { type: Boolean, required: true },
  consentReturn: { type: Boolean, required: true },
  consentPersonalDetails: { type: Boolean, required: true },
  consentAttendance: { type: Boolean, required: true },
  consentMedia: { type: Boolean },
  createdAt: { type: Date, default: Date.now },
});

const Application = mongoose.model<IApplication>('Application', ApplicationSchema);

export default Application;
