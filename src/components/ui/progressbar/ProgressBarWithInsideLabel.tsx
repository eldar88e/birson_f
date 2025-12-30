export default function ProgressBarWithInsideLabel() {
  return (
    <div className="space-y-5 sm:max-w-[320px] w-full">
      <div className="relative w-full h-4 bg-gray-200 rounded-full dark:bg-gray-800">
        <div className="absolute left-0 w-[40%] h-full bg-brand-500 rounded-full flex items-center justify-center text-white font-medium text-[10px] leading-tight">
          40%
        </div>
      </div>

      <div className="relative w-full h-4 bg-gray-200 rounded-full dark:bg-gray-800">
        <div className="absolute left-0 w-[70%] h-full bg-brand-500 rounded-full flex items-center justify-center text-white font-medium text-[10px] leading-tight">
          70%
        </div>
      </div>

      <div className="relative w-full h-4 bg-gray-200 rounded-full dark:bg-gray-800">
        <div className="absolute left-0 w-[30%] h-full bg-brand-500 rounded-full flex items-center justify-center text-white font-medium text-[10px] leading-tight">
          30%
        </div>
      </div>
    </div>
  );
}
