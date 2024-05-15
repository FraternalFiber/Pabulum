import {Skeleton} from "@/components/ui/skeleton.tsx";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";

export function LoadingSkeletons() {
  const SKELETONS_NUMBER = 9

  // return a specific number of loading skeletons
  const getLoadingSkeletons = () => {
    const content = []

    for(let i = 0; i < SKELETONS_NUMBER; i++) {
      content.push(
          <Skeleton key={i}>
            <Card className={'w-full h-96 border-secondary'}>
              <CardHeader>
                <CardTitle>
                  <Skeleton className={'w-full h-6'}/>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Skeleton className={'w-full h-52'}/>
              </CardContent>
              <CardFooter>
                <Skeleton className={'w-16 h-10'}/>
              </CardFooter>
            </Card>
          </Skeleton>
      )
    }

    return content
  }

  return (
      <div className={'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'}>
        {getLoadingSkeletons()}
      </div>
  )
}