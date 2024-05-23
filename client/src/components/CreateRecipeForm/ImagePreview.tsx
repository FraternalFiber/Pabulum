import {useEffect, useState} from "react";
import {cn} from "@/lib/utils.ts";
import {Trash2} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";

type ImagePreviewProps = {
  file: File
  deleteImage: () => void
  handleImageError: () => void
}

// Preview of an image to upload
export function ImagePreview({file, deleteImage, handleImageError}: ImagePreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [showImage, setShowImage] = useState<boolean>(false)

  useEffect(() => {
    // Return nothing when there is no file
    if(!file) {
      return
    }

    // Create a URL object to be used as src of image preview
    setPreviewUrl(URL.createObjectURL(file))

    // Revoke object URL on unmount or file change to prevent memory leaks
    return () => {
      if(previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [file])

  const handleImageLoad = () => {
    setShowImage(true)
    console.log('image loaded')
  }

  return (
      <div className={'relative w-full h-full'}>
        {/* Show image when previewUrl is set */}
        {previewUrl && (
            <>
              <img src={previewUrl}
                   alt={'Uploaded image preview'}
                   onLoad={handleImageLoad}
                   onError={handleImageError}
                   className={cn('rounded-sm w-full h-full object-contain object-center bg-secondary', showImage ? 'block' : 'hidden')}/>
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
