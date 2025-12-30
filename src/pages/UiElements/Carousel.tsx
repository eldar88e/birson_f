import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import SlideOnly from "../../components/ui/carousel/SlideOnly";
import WithControl from "../../components/ui/carousel/WithControl";
import WithIndicators from "../../components/ui/carousel/WithIndicators";
import WithControlAndIndicators from "../../components/ui/carousel/WithControlAndIndicators";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";

export default function Carousel() {
  return (
    <>
      <PageMeta
        title="React.js Carousel Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Carousel Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Carousel" />
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2 xl:gap-6">
        <ComponentCard title="Slides Only">
          <SlideOnly />
        </ComponentCard>
        <ComponentCard title="With controls">
          <WithControl />
        </ComponentCard>
        <ComponentCard title="With indicators">
          <WithIndicators />
        </ComponentCard>
        <ComponentCard title="With controls and indicators">
          <WithControlAndIndicators />
        </ComponentCard>
      </div>
    </>
  );
}
