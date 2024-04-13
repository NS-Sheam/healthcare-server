import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  client_url: process.env.CLIENT_URL,
  jwt: {
    jwt_secret: process.env.JWT_SECRET,
    expires_in: process.env.EXPIRES_IN,
    refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
    refresh_token_expires_in: process.env.REFRESH_TOKEN_EXPIRES_IN,
    reset_password_secret: process.env.RESET_PASSWORD_SECRET,
    reset_password_expires_in: process.env.RESET_PASSWORD_EXPIRES_IN,
  },
  emailSender: {
    email: process.env.EMAIL,
    app_password: process.env.APP_PASSWORD,
  },
  fileUploader: {
    cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
    cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
  },
  payment: {
    sslc_store_id: process.env.SSLC_STORE_ID,
    sslc_store_password: process.env.SSLC_STORE_PASSWORD,
    sslc_success_url: process.env.SSLC_SUCCESS_URL,
    sslc_fail_url: process.env.SSLC_FAILURE_URL,
    sslc_cancel_url: process.env.SSLC_CANCEL_URL,
    sslc_payment_api: process.env.SSLC_PAYMENT_API,
    sslc_validation_api: process.env.SSLC_VALIDATION_API,
  },
};
