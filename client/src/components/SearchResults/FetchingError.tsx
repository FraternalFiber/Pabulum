import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import {AlertCircle} from 'lucide-react'

export function FetchingError() {
  return (
      <div className={'flex justify-center mt-16'}>
        <Alert variant={'destructive'} className={'w-fit pr-8'}>
          <AlertCircle size={20}/>
          <AlertTitle className={'ml-1.5'}>Error</AlertTitle>
          <AlertDescription className={'ml-1.5'}>Sorry, we couldn't load your recipes.</AlertDescription>
        </Alert>
      </div>
  )
}