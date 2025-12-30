import PageMeta from "../../components/common/PageMeta";
import EmailWrapper from "../../components/email/EmailDetails/EmailWrapper";
import EmailSidebar from "../../components/email/EmailSidebar/EmailSidebar";

export default function EmailDetails() {
  return (
    <>
      <PageMeta
        title="React.js Inbox Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Inbox Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="sm:h-[calc(100vh-174px)] xl:h-[calc(100vh-186px)]">
        <div className="flex flex-col gap-5 xl:grid xl:grid-cols-12 sm:gap-5">
          <div className="xl:col-span-3 col-span-full">
            <EmailSidebar />
          </div>
          <div className="w-full xl:col-span-9">
            <EmailWrapper />
          </div>
        </div>
      </div>
    </>
  );
}
