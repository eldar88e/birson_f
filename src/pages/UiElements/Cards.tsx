import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import CardWithImage from "../../components/cards/card-with-image/CardWithImage";
import HorizontalCardWithImage from "../../components/cards/horizontal-card/HorizontalCardWithImage";
import CardWithLinkExample from "../../components/cards/card-with-link/CardWithLinkExample";
import CardWithIconExample from "../../components/cards/card-with-icon/CardWithIconExample";
import PageMeta from "../../components/common/PageMeta";

export default function Cards() {
  return (
    <>
      <PageMeta
        title="React.js Cards Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Cards Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Cards" />
      <div className="space-y-6 sm:space-y-5">
        <CardWithImage />
        <HorizontalCardWithImage />
        <CardWithLinkExample />
        <CardWithIconExample />
      </div>
    </>
  );
}
