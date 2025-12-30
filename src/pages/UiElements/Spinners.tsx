import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import SpinnerExample from "../../components/ui/spinner";
import PageMeta from "../../components/common/PageMeta";

export default function Spinners() {
  return (
    <div>
      <PageMeta
        title="React.js Spinners | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Spinners page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Spinners" />
      <SpinnerExample />
    </div>
  );
}
