import { Skeleton } from "@/components/ui/skeleton";

export function ProfileSkeleton() {
  return (
    <div className="py-8 flex flex-col w-full">
      <div className="w-full flex gap-x-6">
        <div className="w-9/12 space-y-8">
          <div className="flex gap-x-6 w-full">
            <div className="flex items-center">
              <Skeleton className="w-64 h-64 flex rounded-full"></Skeleton>
            </div>
            <div className="flex flex-col space-y-6 w-full">
              <div className="flex flex-col space-y-2">
                <Skeleton className="w-56 h-9 rounded-md"></Skeleton>
                <Skeleton className="w-28 h-6 rounded-md"></Skeleton>
              </div>
              <div className="flex gap-x-2">
                <Skeleton className="w-28 h-6 rounded-md"></Skeleton>
                <Skeleton className="w-28 h-6 rounded-md"></Skeleton>
              </div>
              <div className="space-y-2">
                <div className="flex gap-x-2">
                  <Skeleton className="w-1/2 h-6 rounded-md"></Skeleton>
                  <Skeleton className="w-1/2 h-6 rounded-md"></Skeleton>
                </div>
                <Skeleton className="w-full h-20 rounded-xl"></Skeleton>
              </div>
            </div>
          </div>
        </div>
        <div className="w-3/12 rounded-xl">
          <div className="space-y-2">
            <Skeleton className="w-full h-32 rounded-xl" />
            <Skeleton className="w-full h-40 rounded-xl" />
            <Skeleton className="w-full h-72 rounded-xl" />
            <Skeleton className="w-full h-72 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
