import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import DefaultBreadCrumbExample from "../../components/ui/breadcrumb/DefaultBreadCrumbExample";
import BreadCrumbWithIcon from "../../components/ui/breadcrumb/BreadCrumbWithIcon";
import AngleDividerBreadCrumb from "../../components/ui/breadcrumb/AngleDividerBreadCrumb";
import DottedDividerBreadcrumb from "../../components/ui/breadcrumb/DottedDividerBreadcrumb";
import PageMeta from "../../components/common/PageMeta";

export default function BreadCrumb() {
  return (
    <div>
      <PageMeta
        title="React.js Breadcrumb Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Breadcrumb Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Breadcrumb" />
      <div className="space-y-5 sm:space-y-6">
        <DefaultBreadCrumbExample />
        <BreadCrumbWithIcon />
        <AngleDividerBreadCrumb />
        <DottedDividerBreadcrumb />
      </div>
    </div>
  );
}
