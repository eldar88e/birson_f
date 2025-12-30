import PageBreadcrumb from "../components/common/PageBreadCrumb";
import ComponentCard from "../components/common/ComponentCard";
import FaqsOne from "../components/UiExample/FaqsExample/FaqsOne";
import FaqsTwo from "../components/UiExample/FaqsExample/FaqsTwo";
import FaqsThree from "../components/UiExample/FaqsExample/FaqsThree";
import PageMeta from "../components/common/PageMeta";

export default function Faqs() {
  return (
    <>
      <PageMeta
        title="React.js FAQ Page | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js FAQ Page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Faqs" />
      <div className="space-y-5 sm:space-y-6">
        <ComponentCard title="Faq’s 1">
          <FaqsOne />
        </ComponentCard>
        <ComponentCard title="Faq’s 2">
          <FaqsTwo />
        </ComponentCard>
        <ComponentCard title="Faq’s 3">
          <FaqsThree />
        </ComponentCard>
      </div>
    </>
  );
}
