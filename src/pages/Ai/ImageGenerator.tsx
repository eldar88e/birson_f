import ImageGeneratorContent from "../../components/ai/ImageGeneratorContent";
import PageMeta from "../../components/common/PageMeta";
import GeneratorLayout from "./GeneratorLayout";

export default function ImageGeneratorPage() {
  return (
    <div>
      <PageMeta
        title="React.js AI Image Generator  | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Image Generator  page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <GeneratorLayout>
        <ImageGeneratorContent />
      </GeneratorLayout>
    </div>
  );
}
