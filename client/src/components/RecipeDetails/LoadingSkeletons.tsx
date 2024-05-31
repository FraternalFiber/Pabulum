import {Skeleton} from "@/components/ui/skeleton.tsx";
import {AspectRatio} from "@/components/ui/aspect-ratio.tsx";
import {TDataSource} from "@/types/TDataSource.ts";

type LoadingSkeletonsProps = {
  dataSource: TDataSource
}

export function LoadingSkeletons({dataSource}: LoadingSkeletonsProps) {
  return (
      <div className={'flex flex-col gap-y-8'}>
        {dataSource === "user" && (
            // Recipe menu bar skeleton
            <Skeleton className={'w-32 h-12'}/>
        )}
        <div className={'w-full max-w-[28rem]'}>
          <AspectRatio ratio={3 / 2}>
            <Skeleton className={'w-full h-full'}/>
          </AspectRatio>
        </div>
        <Skeleton className={'w-full max-w-96 h-8'}/>
        <Skeleton className={'w-full max-w-56 h-8'}/>
        <Skeleton className={'w-full max-w-[28rem] h-8 mt-5'}/>
        <div className={'grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-[28rem]'}>
          <Skeleton className={'w-full max-w-[28rem] h-8'}/>
          <Skeleton className={'w-full max-w-[28rem] h-8'}/>
          <Skeleton className={'w-full max-w-[28rem] h-8'}/>
          <Skeleton className={'w-full max-w-[28rem] h-8'}/>
          <Skeleton className={'w-full max-w-[28rem] h-8'}/>
          <Skeleton className={'w-full max-w-[28rem] h-8'}/>
        </div>
      </div>
  )
}