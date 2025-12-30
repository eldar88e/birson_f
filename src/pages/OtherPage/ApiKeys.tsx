import ApiKeyTable from "../../components/api-keys/ApiKeyTable";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

export default function ApiKeys() {
  return (
    <div>
      <PageMeta
        title="React.js API Keys Page | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js  API Keys page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="API Keys" />
      <ApiKeyTable />
    </div>
  );
}
