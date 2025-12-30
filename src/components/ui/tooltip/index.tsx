import ComponentCard from "../../common/ComponentCard";
import DefaultTooltip from "./DefaultTooltip";
import WhiteAndDarkTooltip from "./WhiteAndDarkTooltip";
import TooltipPlacement from "./TooltipPlacement";

export default function TooltipExample() {
  return (
    <div className="space-y-5 sm:space-y-6">
      <ComponentCard title="Default Tooltip">
        <DefaultTooltip />
      </ComponentCard>
      <ComponentCard title="White and Dark Tooltip">
        <WhiteAndDarkTooltip />
      </ComponentCard>
      <ComponentCard title="Tooltip Placement">
        <TooltipPlacement />
      </ComponentCard>
    </div>
  );
}
