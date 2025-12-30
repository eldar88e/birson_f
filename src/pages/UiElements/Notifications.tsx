import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import UpdateNotification from "../../components/ui/notification/UpdateNotification";
import Notification from "../../components/ui/notification/Notfication";
import CookieConsent from "../../components/ui/notification/CookieConsent";
import PageMeta from "../../components/common/PageMeta";

export default function Notifications() {
  const handleLater = () => {
    alert("Later button clicked");
  };

  const handleUpdate = () => {
    alert("Update Now button clicked");
  };

  const handleCookieSettings = () => {
    alert("Cookie Settings clicked");
  };

  const handleDenyAll = () => {
    alert("Deny All clicked");
  };

  const handleAcceptAll = () => {
    alert("Accept All clicked");
  };

  return (
    <>
      <PageMeta
        title="React.js  Notifications | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Notifications  page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Notifications" />
      <div className="space-y-5 sm:space-y-6">
        {/* Announcement Banner */}
        <ComponentCard title="Announcement Bar">
          <UpdateNotification
            title="New update! Available"
            message="Enjoy improved functionality and enhancements."
            onLaterClick={handleLater}
            onUpdateClick={handleUpdate}
          />
        </ComponentCard>
        {/* Toast Banner */}
        <ComponentCard title="Toast Notification">
          <CookieConsent
            message="By Clicking on 'Accept', you agree to the storing of cookies on your device to enhance site navigation, analyze site usage, and assist in our marketing efforts."
            onCookieSettings={handleCookieSettings}
            onDenyAll={handleDenyAll}
            onAcceptAll={handleAcceptAll}
          />
        </ComponentCard>
        {/* Success */}
        <ComponentCard title="Success Notification">
          <Notification variant="success" title="Success! Action Completed!" />
        </ComponentCard>
        {/* Info */}
        <ComponentCard title="Info Notification">
          <Notification variant="info" title="Heads Up! New Information" />
        </ComponentCard>
        {/* Warning */}
        <ComponentCard title="Warning Notification">
          <Notification
            variant="warning"
            title="Alert: Double Check Required"
          />
        </ComponentCard>
        {/* Error */}
        <ComponentCard title="Error Notification">
          <Notification variant="error" title="Something Went Wrong" />
        </ComponentCard>
      </div>
    </>
  );
}
