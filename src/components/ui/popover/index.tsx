import ComponentCard from "../../common/ComponentCard";
import DefaultPopover from "./DefaultPopover";
import PopoverWithLink from "./PopoverWithLink";
import PopoverButton from "./PopoverButton";

export default function PopoverExample() {
  return (
    <div className="space-y-5 sm:space-y-6">
      <ComponentCard title="Default Popover">
        <DefaultPopover />
      </ComponentCard>{" "}
      <ComponentCard title="Popover With Button">
        <PopoverButton />
      </ComponentCard>{" "}
      <ComponentCard title="Popover With Link">
        <PopoverWithLink />
      </ComponentCard>
    </div>
  );
}
