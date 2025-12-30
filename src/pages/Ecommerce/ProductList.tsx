import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ProductListTable from "../../components/ecommerce/ProductListTable";

export default function ProductList() {
  return (
    <>
      <PageMeta
        title="React.js E-commerce Products | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js E-commerce Products  page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Product List" />
      <ProductListTable />
    </>
  );
}
