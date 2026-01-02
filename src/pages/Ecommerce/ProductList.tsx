import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ProductListTable from "../../components/ecommerce/ProductListTable";

export default function ProductList() {
  return (
    <>
      <PageMeta
        title="Услуги | CRM"
        description="Услуги CRM"
      />
      <PageBreadcrumb pageTitle="Услуги" />
      <ProductListTable />
    </>
  );
}
