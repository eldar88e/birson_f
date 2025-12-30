import CodeGeneratorContent from "../../components/ai/CodeGeneratorContent";
import PageMeta from "../../components/common/PageMeta";
import GeneratorLayout from "./GeneratorLayout";

export default function CodeGeneratorPage() {
  return (
    <div>
      <PageMeta
        title="React.js AI Code Generator  | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Code Generator  page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <GeneratorLayout>
        <CodeGeneratorContent />
      </GeneratorLayout>
    </div>
  );
}
