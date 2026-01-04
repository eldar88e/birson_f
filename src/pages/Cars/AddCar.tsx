import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

export default function AddCar() {
  return (
    <>
      <PageMeta
        title="Добавить пользователя | CRM"
        description="Добавление нового автомобиля"
      />
      <PageBreadcrumb pageTitle="Добавить автомобиль" />
      <div>
        <h1>Add Car</h1>
      </div>
    </>
  );
}
