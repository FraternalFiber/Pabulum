import multer from "multer";

const MAX_RECIPE_IMAGE_SIZE = 5242880 // 5 MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png']

export function uploadFile() {
    const upload = multer({
        dest: '/data/uploads/',
        limits: {
            fileSize: MAX_RECIPE_IMAGE_SIZE
        },
        fileFilter: (req, file, cb) => {
            if(ACCEPTED_IMAGE_TYPES.includes(file.mimetype)) {
                cb(null, true)
            }
            else {
                req.fileValidationError = 'Unsupported file type'
                cb(new Error('Unsupported file type. Only .jpg, .jpeg and .png are allowed.'), false)
            }
        }
    }).single('image')

    return (req, res, next) => {
        try {
            upload(req, res, function(error) {
                if(req.fileValidationError) {
                    return res.status(400).json({error: req.fileValidationError})
                }
                console.log(req.file)
                next()
            })
        }
        catch (error) {
            res.status(400).json({error: 'Invalid file'})
        }
    }
}

