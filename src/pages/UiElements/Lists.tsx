import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import ListExample from "../../components/list";

export default function Lists() {
  return (
    <>
      <PageMeta
        title="React.js List Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js List page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Lists" />
      <ListExample />
    </>
  );
}
