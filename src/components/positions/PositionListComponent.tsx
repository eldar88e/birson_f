import { useEffect, useState } from "react";
import { positionService } from "../../api/position";
import Pages from "../../shared/ui/Pages";
import type { Position } from "../../entities/position/model";
import type { PaginationMeta } from "../../shared/types/api/pagination";
import PositionModal from "./PositionModal";
import { DeleteAction } from "../../shared/ui/DeleteAction";
import Loader from "../../shared/ui/Loader";
import SvgIcon from "../../shared/ui/SvgIcon";

interface Positions {
  data: Position[];
  meta: PaginationMeta;
}

export default function PositionListComponent() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [pages, setPages] = useState<Positions["meta"]>({
    page: 1,
    count: 0,
    limit: 0,
    from: 0,
    in: 0,
    last: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(pages.page);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPosition, setEditingPosition] = useState<Position | null>(null);

  useEffect(() => {
    const fetchPositions = async () => {
      setIsLoading(true);
      try {
        const data = await positionService.getPositions(`?page=${page}`);
        setPositions(data.data);
        setPages(data.meta);
      }
      catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load positions";
        setError(errorMessage);
      }
      finally {
        setIsLoading(false);
      }
    }
    fetchPositions();
  }, [page]);

  const handleOpenModal = () => {
    setEditingPosition(null);
    setIsModalOpen(true);
  };

  const handleEditPosition = (position: Position) => {
    setEditingPosition(position);
    setIsModalOpen(true);
  };

  const handleSuccess = (updatedPosition: Position) => {
    if (editingPosition?.id) {
      setPositions((prev) =>
        prev.map((p) => (p.id === updatedPosition.id ? updatedPosition : p))
      );
    } else {
      setPositions((prev) => [updatedPosition, ...prev]);
    }
    setIsModalOpen(false);
    setEditingPosition(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPosition(null);
  };

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Должности
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Список должностей
            </p>
          </div>
          <button 
            className="bg-brand-500 shadow-sm hover inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white transition hover:bg-brand-600" 
            onClick={handleOpenModal}
          >
            <SvgIcon name="plus" />
            Добавить
          </button>
        </div>

        {isLoading && <Loader text="Загрузка должностей..." />}

        {error && (
          <div className="p-4 text-red-600 bg-red-50 rounded-lg dark:bg-red-900/20 dark:text-red-400 m-5">
            Ошибка: {error}
          </div>
        )}

        {positions.length === 0 && !isLoading && !error && (
          <div className="text-center text-gray-500 py-8 dark:text-gray-400">
            Должности не найдены
          </div>
        )}

        {positions.length > 0 && !isLoading && !error && (
          <>
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full table-auto">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800">
                    <th className="px-4 py-3 text-left text-xs font-medium whitespace-nowrap text-gray-700 dark:text-gray-400">
                      ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium whitespace-nowrap text-gray-700 dark:text-gray-400">
                      Название
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium whitespace-nowrap text-gray-700 dark:text-gray-400">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {positions.map((position) => (
                    <tr key={position.id} className="transition hover:bg-gray-50 dark:hover:bg-gray-900">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <p className="text-theme-xs font-medium text-gray-700 dark:text-gray-400">
                          {position.id}
                        </p>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                          {position.title}
                        </p>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEditPosition(position)}
                            className="text-xs flex rounded-lg px-3 py-2 font-medium text-brand-600 hover:bg-brand-50 hover:text-brand-700 dark:text-brand-400 dark:hover:bg-brand-900/20"
                          >
                            Редактировать
                          </button>
                          <DeleteAction
                            id={position.id}
                            itemName={`Должность "${position.title}"`}
                            onDelete={(id) => positionService.deletePosition(id)}
                            onSuccess={() =>
                              setPositions((prev) => prev.filter((c) => c.id !== position.id))
                            }
                          >
                            {(open) => (
                              <button
                                onClick={open}
                                className="text-xs flex rounded-lg px-3 py-2 font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-900"
                              >
                                Удалить
                              </button>
                            )}
                          </DeleteAction>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center flex-col sm:flex-row justify-between border-t border-gray-200 px-5 py-4 dark:border-gray-800">
              <Pages
                pages={pages}
                onChange={setPage}
              />
            </div>
          </>
        )}
      </div>

      <PositionModal
        isModalOpen={isModalOpen}
        onClose={handleCloseModal}
        position={editingPosition}
        onSuccess={handleSuccess}
      />
    </>
  );
}
