import { Skeleton } from "@/components/ui/skeleton.tsx";
import { AspectRatio } from "@/components/ui/aspect-ratio.tsx";

export function LoadingSkeletons() {
  return (
    <div className={"flex flex-col gap-y-8 max-w-[40rem]"}>
      <div className={"flex flex-col gap-y-3"}>
        <Skeleton className={"w-12 h-8"} />
        <Skeleton className={"w-full h-10"} />
      </div>
      <div className={"flex flex-col gap-y-3 max-w-96"}>
        <Skeleton className={"w-[4.25rem] h-8"} />
        <AspectRatio ratio={3 / 2}>
          <Skeleton className={"w-full h-full"} />
        </AspectRatio>
      </div>
      <div className={"flex gap-x-8 flex-wrap gap-y-5"}>
        <Skeleton className={"w-[10.6rem] h-20"} />
        <Skeleton className={"w-[8.5rem] h-20"} />
      </div>
      <div className={"flex flex-col gap-y-3"}>
        <Skeleton className={"w-[7.7rem] h-8"} />
        <Skeleton className={"w-full h-10"} />
      </div>
    </div>
  );
}
