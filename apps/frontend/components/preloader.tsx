import { LoaderCircle } from "lucide-react";

export const PreLoader = () => {
  return (
    <div className="text-primary flex min-h-screen items-center justify-center p-8">
      <LoaderCircle className="animate-spin" size={28} />
    </div>
  );
};
