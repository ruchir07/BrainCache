import multer from 'multer';
import path from 'path';

export const upload = multer({ dest: "temp/" });