import multer from "multer";

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    const filename = `${file.originalname}-${Date.now()}`;
    cb(null, filename);
  },
  // destination: () => {}
});

const upload = multer({ storage });

export default upload;
