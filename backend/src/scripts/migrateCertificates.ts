import mongoose from 'mongoose';
import Application from "../models/Application";
import { BlobServiceClient } from "@azure/storage-blob";
import dotenv from "dotenv";

dotenv.config();

const migrateApplications = async () => {
  const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
  const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
  const AZURE_STORAGE_DOWNLOAD_STRING = process.env.AZURE_STORAGE_DOWNLOAD_STRING;

  if (!AZURE_STORAGE_CONNECTION_STRING) {
    throw Error('Azure Storage Connection string not found');
  }

  if (!MONGODB_URI) {
    throw Error('MongoDB connection string not found');
  }
  // Connect to MongoDB
  await mongoose.connect(MONGODB_URI);

  // Create the BlobServiceClient object with connection string
  const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
  const containerClient = blobServiceClient.getContainerClient("studentcertificates");

  const applications = await Application.find();
  for (const application of applications) {
    if (application.studentCertificate) {
      const blobName = `certificate_${application.email}.pdf`;
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      const exists = await blockBlobClient.exists();
      if (exists) {
        await blockBlobClient.delete();
      }
      await blockBlobClient.upload(application.studentCertificate, application.studentCertificate.length);

      // Get the URL of the uploaded blob
        const blobUrl = blockBlobClient.url;
        console.log(blobUrl)
        // Update the application with the URL of the uploaded certificate
        application.studentCertificateUrl = `${blobUrl}?${AZURE_STORAGE_DOWNLOAD_STRING}`;
        await application.save();
    }

  }

  // Close the MongoDB connection
  await mongoose.connection.close();
};

migrateApplications()
  .then(() => {
    console.log('Migration completed successfully.');
  })
  .catch((error) => {
    console.error('Migration failed:', error);
  });