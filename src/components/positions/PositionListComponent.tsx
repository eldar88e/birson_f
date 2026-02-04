import { useEffect, useState } from "react";
import { positionService } from "../../api/position";
import Pages from "../../shared/ui/Pages";
import type { Position } from "../../entities/position/model";
import type { PaginationMeta } from "../../shared/types/api/pagination";
import PositionModal from "./PositionModal";
import { DeleteAction } from "../../shared/ui/DeleteAction";
import Loader from "../../shared/ui/Loader";

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

  if (isLoading) {
    return (
      <Loader text="Загрузка должностей..." />
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-50 rounded-lg dark:bg-red-900/20 dark:text-red-400">
        Ошибка: {error}
      </div>
    );
  }

  if (positions.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8 dark:text-gray-400">
        Должности не найдены
      </div>
    );
  }

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
      // Обновляем существующую должность в списке
      setPositions((prev) =>
        prev.map((p) => (p.id === updatedPosition.id ? updatedPosition : p))
      );
    } else {
      // Добавляем новую должность в список
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
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Должности</h2>
          <button 
            className="bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700" 
            onClick={handleOpenModal}
          >
            Добавить должность
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                  Название
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-800">
              {positions.map((position) => (
                <tr key={position.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {position.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
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
