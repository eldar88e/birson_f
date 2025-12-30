export default function ProgressBarInMultipleSizes() {
  return (
    <div className="space-y-4 sm:max-w-[320px] w-full">
      <div className="relative w-full h-2 bg-gray-200 rounded-full dark:bg-gray-800">
        <div className="absolute left-0 w-[55%] h-full bg-brand-500 rounded-full"></div>
      </div>

      <div className="relative w-full h-3 bg-gray-200 rounded-full dark:bg-gray-800">
        <div className="absolute left-0 w-[55%] h-full bg-brand-500 rounded-full"></div>
      </div>

      <div className="relative w-full h-4 bg-gray-200 rounded-full dark:bg-gray-800">
        <div className="absolute left-0 w-[55%] h-full bg-brand-500 rounded-full"></div>
      </div>

      <div className="relative w-full h-5 bg-gray-200 rounded-full dark:bg-gray-800">
        <div className="absolute left-0 w-[55%] h-full bg-brand-500 rounded-full"></div>
      </div>
    </div>
  );
}
