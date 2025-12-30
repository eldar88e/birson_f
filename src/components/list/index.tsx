import UnOrderedList from "./UnorderedList";
import OrderedList from "./OrderedList";
import ListWithButton from "./ListWithButton";
import ListWithIcon from "./ListWithIcon";
import HorizontalList from "./HorizontalList";
import ListWithRadio from "./ListWithRadio";
import ListWithCheckbox from "./ListWithCheckbox";
import ComponentCard from "../common/ComponentCard";

export default function ListExample() {
  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2 xl:gap-6">
      <ComponentCard title="Unordered List">
        <UnOrderedList />
      </ComponentCard>
      <ComponentCard title="Ordered List">
        <OrderedList />
      </ComponentCard>
      <ComponentCard title="List With button">
        <ListWithButton />
      </ComponentCard>
      <ComponentCard title="List With Icon">
        <ListWithIcon />
      </ComponentCard>
      <div className="col-span-2">
        <ComponentCard title="Horizontal List">
          <HorizontalList />
        </ComponentCard>
      </div>
      <ComponentCard title="List with checkbox">
        <ListWithCheckbox />
      </ComponentCard>{" "}
      <ComponentCard title="List with radio">
        <ListWithRadio />
      </ComponentCard>
    </div>
  );
}
