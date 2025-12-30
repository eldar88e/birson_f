import DefaultModal from "./DefaultModal";
import VerticallyCenteredModal from "./VerticallyCenteredModal";
import FormInModal from "./FormInModal";
import FullScreenModal from "./FullScreenModal";
import ModalBasedAlerts from "./ModalBasedAlerts";

export default function ModalExamples() {
  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2 xl:gap-6">
      <DefaultModal />
      <VerticallyCenteredModal />
      <FormInModal />
      <FullScreenModal />
      <ModalBasedAlerts />
    </div>
  );
}
