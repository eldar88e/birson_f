import ComponentCard from "../../common/ComponentCard";
import DefaultProgressbarExample from "./DefaultProgressbarExample";
import ProgressBarInMultipleSizes from "./ProgressBarInMultipleSizes";
import ProgressBarWithOutsideLabel from "./ProgressBarWithOutsideLabel";
import ProgressBarWithInsideLabel from "./ProgressBarWithInsideLabel";

export default function ProgressBarExample() {
  return (
    <div className="space-y-5 sm:space-y-6">
      <ComponentCard title="Default Progress Bar">
        <DefaultProgressbarExample />
      </ComponentCard>
      <ComponentCard title="Progress Bar In Multiple Sizes">
        <ProgressBarInMultipleSizes />
      </ComponentCard>
      <ComponentCard title="Progress Bar with Outside Label">
        <ProgressBarWithOutsideLabel />
      </ComponentCard>
      <ComponentCard title="Progress Bar with Inside Label">
        <ProgressBarWithInsideLabel />
      </ComponentCard>
    </div>
  );
}
