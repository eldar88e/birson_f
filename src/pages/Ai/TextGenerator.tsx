import PageMeta from "../../components/common/PageMeta";
import TextGeneratorContent from "../../components/ai/TextGeneratorContent";
import GeneratorLayout from "./GeneratorLayout";

export default function TextGeneratorPage() {
  return (
    <>
      <PageMeta
        title="React.js AI Text Generator  | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Text Generator  page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <GeneratorLayout>
        <TextGeneratorContent />
      </GeneratorLayout>
    </>
  );
}
