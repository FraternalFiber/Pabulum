import multer from "multer";

const MAX_RECIPE_IMAGE_SIZE = 5242881 // 5 MB + 1 (multer doesn't accept files with exact max size)
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png']

export function uploadFile() {
    const upload = multer({
        dest: '/data/uploads/',
        limits: {
            fileSize: MAX_RECIPE_IMAGE_SIZE
        },
        fileFilter: (req, file, cb) => {
            // filter image file extension
            if(ACCEPTED_IMAGE_TYPES.includes(file.mimetype)) {
                console.log('uploadFile/upload/fileFilter: file accepted')
                cb(null, true)
            }
            else {
                console.log('uploadFile/upload/fileFilter: file rejected')
                cb({message: 'Unsupported file type'}, false)
            }
        }
    }).single('image')

    console.log('uploadFile: start middleware')

    return (req, res, next) => {
        console.log('uploadFile: in return function')

        try {
            upload(req, res, function(error) {
                if(error) {
                    console.log('uploadFile: file validation error')
                    res.status(400).json({success: false, message: error.message})
                }
                else {
                    console.log('uploadFile: file accepted')
                    console.log('file', req.file)
                    console.log('body', req.body)

                    // If user didn't attach an image, multer will leave image property undefined,
                    // so it has to be deleted.
                    if(req.body.image) {
                        delete req.body.image
                    }

                    // Parse every property (except image) back to JSON format
                    for(const key in req.body) {
                        req.body[key] = JSON.parse(req.body[key])
                    }

                    next()
                }
            })
        }
        catch (error) {
            console.log('uploadFile: try_catch error')
            res.status(400).json({success: false, message: 'Invalid file'})
        }
    }
}

