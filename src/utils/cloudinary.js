import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";

    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUINARY_CLOUD_NAME, 
        api_key: process.env.CLOUINARY_API_KEY, 
        api_secret: process.env.CLOUINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    });


    const uploadOnCloudinary = async (localFilePath) => {
        try {
            if(!localFilePath) return null;
            //upload the file on cloudinary
            const response = await cloudinary.uploader.upload(localFilePath, {
                resource_type : "auto"
            });
            // file has been uploade successfull
            console.log("file is uploade on cloudinary", response.url);
            return response.url
        } catch (error) {
            fs.unlinkSync(localFilePath) //remove the locally saved temporary file is upload operation got failed
            return null;
            
        }
    }
    