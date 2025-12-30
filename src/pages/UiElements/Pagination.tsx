import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PaginationExample from "../../components/ui/pagination";
import PageMeta from "../../components/common/PageMeta";

export default function Pagination() {
  return (
    <div>
      <PageMeta
        title="React.js  Pagination | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Pagination  page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Pagination" />
      <PaginationExample />
    </div>
  );
}
