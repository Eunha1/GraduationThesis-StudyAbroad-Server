import { diskStorage } from "multer";

export const storageConfig = (folder: string, fileName: string) =>diskStorage({
    destination: `uploads/${folder}`,
    filename: (req, file, callback)=>{
        callback(null,fileName + '-' + file.originalname)
    }
})

