import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import AddProductForm from "../../components/ecommerce/AddProductForm";

export default function AddProduct() {
  return (
    <>
      <PageMeta
        title="React.js E-commerce Add Product Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js E-commerce Add Product Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Add Product" />
      <AddProductForm />
    </>
  );
}
