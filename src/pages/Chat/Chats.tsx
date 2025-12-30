import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ChatSidebar from "../../components/chats/ChatSidebar";
import ChatBox from "../../components/chats/ChatBox";
import PageMeta from "../../components/common/PageMeta";

export default function Chats() {
  return (
    <>
      <PageMeta
        title="React.js Chat Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Chat Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Chats" />
      <div className="h-[calc(100vh-150px)] overflow-hidden sm:h-[calc(100vh-174px)]">
        <div className="flex flex-col h-full gap-6 xl:flex-row xl:gap-5">
          {/* <!-- Chat Sidebar Start --> */}
          <ChatSidebar />
          {/* <!-- Chat Sidebar End --> */}

          {/* <!-- Chat Box Start --> */}
          <ChatBox />
          {/* <!-- Chat Box End --> */}
        </div>
      </div>
    </>
  );
}
