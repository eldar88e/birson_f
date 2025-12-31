// import UserMetrics from "../../components/users/UserMetrics";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import UserList from "../../components/users/UserList";

export default function TicketList() {
  return (
    <div>
      <PageMeta
        title="Пользователи | CRM"
        description="Пользователи CRM"
      />
      <PageBreadcrumb pageTitle="Пользователи" />
      {/*<UserMetrics />*/}
      <UserList />
    </div>
  );
}
