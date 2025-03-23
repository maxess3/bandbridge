import { Skeleton } from "@/components/ui/skeleton";

export function ProfileSkeleton({ isPublic = false }: { isPublic?: boolean }) {
  return (
    <div className="py-8 flex flex-col w-full">
      <div className="w-full flex gap-x-4">
        <div className="w-9/12">
          <div className="flex gap-x-8 w-full">
            <div className="flex items-center">
              <Skeleton className="w-52 h-52 flex rounded-full"></Skeleton>
            </div>
            <div className="flex flex-col w-full">
              <div className="flex justify-between">
                <div className="flex flex-col space-y-2">
                  <Skeleton className="w-32 h-9 rounded-md"></Skeleton>
                  <Skeleton className="w-24 h-6 rounded-sm"></Skeleton>
                </div>
                {isPublic ? (
                  ""
                ) : (
                  <div>
                    <Skeleton className="w-52 h-10 rounded-md"></Skeleton>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="w-3/12 rounded-xl">
          <div className="space-y-2">
            <Skeleton className="w-full h-24 rounded-xl" />
            <Skeleton className="w-full h-56 rounded-xl" />
            <Skeleton className="w-full h-32 rounded-xl" />
            <Skeleton className="w-full h-56 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
