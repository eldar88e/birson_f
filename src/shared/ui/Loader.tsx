export default function Loader({ text, height = 64 }: { text: string, height?: number }) {
  return (
    <div className={`flex items-center justify-center h-${height}`}>
      <span className="h-64 hidden"></span>
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-brand-500"></div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{text || "Загрузка..."}</p>
      </div>
    </div>
  );
}
