import VideoGeneratorContent from "../../components/ai/VideoGeneratorContent";
import PageMeta from "../../components/common/PageMeta";
import GeneratorLayout from "./GeneratorLayout";

export default function VideoGeneratorPage() {
  return (
    <div>
      <PageMeta
        title="React.js AI Video Generator  | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Video Generator  page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <GeneratorLayout>
        <VideoGeneratorContent />
      </GeneratorLayout>
    </div>
  );
}
