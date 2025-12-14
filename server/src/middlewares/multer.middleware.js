import multer from "multer";

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    const filename = `${file.originalname}-${Date.now()}`;
    cb(null, filename);
  },
  // destination: () => {}
  // Not Providing the Folder path, it will store the files in System Memory temporarily
});

const upload = multer({ storage });

export default upload;
