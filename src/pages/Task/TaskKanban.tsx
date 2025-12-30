import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import TaskHeader from "../../components/task/TaskHeader";
import KanbanBoard from "../../components/task/kanban/KanbanBoard";
import PageMeta from "../../components/common/PageMeta";

export default function TaskKanban() {
  return (
    <div>
      <PageMeta
        title="React.js Task Kanban Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Task Kanban Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Kanban" />
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <TaskHeader />
        <KanbanBoard />
      </div>
    </div>
  );
}
