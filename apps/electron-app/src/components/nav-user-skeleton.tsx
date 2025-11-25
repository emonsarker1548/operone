import { Skeleton } from "@/components/ui/skeleton"

export function NavUserSkeleton() {
    return (
        <div className="flex items-center gap-2 px-1 py-1.5">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="grid flex-1 gap-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
            </div>
        </div>
    )
}
