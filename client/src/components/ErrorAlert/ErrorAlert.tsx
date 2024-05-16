import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import {AlertCircle} from 'lucide-react'
import {cn} from "@/lib/utils.ts";

type ErrorAlertProps = {
  message: string
  className?: string
}

export function ErrorAlert({message, className}: ErrorAlertProps) {
  return (
      <div className={cn('flex justify-center', className)}>
        <Alert variant={'destructive'} className={'w-fit pr-8'}>
          <AlertCircle size={20}/>
          <AlertTitle className={'ml-1.5'}>Error</AlertTitle>
          <AlertDescription className={'ml-1.5'}>{message}</AlertDescription>
        </Alert>
      </div>
  )
}