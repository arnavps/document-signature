import multer from 'multer';
import { config } from '../config/env';

const storage = multer.memoryStorage();

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
    if (config.upload.allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed'), false);
    }
};

export const upload = multer({
    storage,
    limits: {
        fileSize: config.upload.maxFileSize,
    },
    fileFilter,
});
