export default function Loader({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-brand-500"></div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{text || "Загрузка..."}</p>
      </div>
    </div>
  );
}
