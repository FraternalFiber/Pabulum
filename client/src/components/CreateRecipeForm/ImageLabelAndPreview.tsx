import { Label } from "@/components/ui/label.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { AspectRatio } from "@/components/ui/aspect-ratio.tsx";
import { ImagePreview } from "@/components/CreateRecipeForm/ImagePreview.tsx";

type ImageInputProps = {
  imageFile: File | undefined
  onlineImageUrl: string | null
  deleteImage: () => void
  handleImageError: () => void
}

export function ImageLabelAndPreview({imageFile, deleteImage, handleImageError, onlineImageUrl}: ImageInputProps) {

  if (!imageFile && !onlineImageUrl) {
    return (
      <Label htmlFor={'imageUploadInput'} className={'block w-full sm:max-w-96 cursor-pointer'}>
        <Card>
          <CardContent className={'w-full h-full flex justify-center items-center text-lg hover:underline underline-offset-2 decoration-2 p-5'}>
            Upload image
          </CardContent>
        </Card>
      </Label>
    )
  }

  return (
    <div className={'w-full max-w-96 mb-2'}>
      <AspectRatio ratio={3 / 2}>
        <ImagePreview file={imageFile} deleteImage={deleteImage} handleImageError={handleImageError}
                      onlineImageUrl={onlineImageUrl} />
      </AspectRatio>
    </div>
  )
}