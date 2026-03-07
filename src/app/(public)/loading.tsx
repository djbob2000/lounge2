import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex-1 w-full min-h-[50vh] flex flex-col items-center justify-center pointer-events-none">
      <Loader2 className="w-8 h-8 text-primary animate-spin opacity-50" />
      <span className="sr-only">Loading content...</span>
    </div>
  );
}
