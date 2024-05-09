import {useEffect, useState} from "react";
import {cn} from "@/lib/utils.ts";
import {Trash2} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";

type ImagePreviewProps = {
  file: File
  deleteImage: () => void
}

// Preview of an image to upload
export function ImagePreview({file, deleteImage}: ImagePreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [showImage, setShowImage] = useState<boolean>(false)

  useEffect(() => {
    // return nothing when there is no file
    if(!file) {
      return
    }

    // create a URL object to be used as src of image preview
    setPreviewUrl(URL.createObjectURL(file))

    // revoke object URL on unmount or file change to prevent memory leaks
    return () => {
      if(previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [file])

  const handleImageLoad = () => {
    setShowImage(true)
  }

  const handleImageError = () => {
    setShowImage(false)
  }

  return (
      <div className={cn('w-full max-w-96 mb-2 relative', showImage ? 'block' : 'hidden')}>
        {/* Show image when previewUrl is set */}
        {previewUrl && (
            <>
              <img src={previewUrl}
                   alt={'Uploaded image preview'}
                   onLoad={handleImageLoad}
                   onError={handleImageError}
                   className={'rounded-sm'}/>
              <Button
                  type={'button'}
                  className={'absolute -top-3 -right-3 pr-2 pl-2 rounded-full bg-secondary hover:bg-destructive'}
                  onClick={deleteImage}>
                <Trash2/>
              </Button>
            </>
        )}
      </div>
  )
}