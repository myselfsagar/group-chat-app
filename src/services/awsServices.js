const dotenv = require("dotenv").config();
const AWS = require("aws-sdk");

exports.uploadToS3 = async (data, fileName) => {
  try {
    const bucketName = process.env.BUCKET_NAME;
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

    const s3 = new AWS.S3({
      accessKeyId,
      secretAccessKey,
    });

    const uploadParams = {
      Bucket: bucketName,
      Key: fileName,
      Body: data,
      ACL: "public-read",
    };

    const uploadResponse = await s3.upload(uploadParams).promise();
    return uploadResponse.Location;
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw error;
  }
};
