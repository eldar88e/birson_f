import DefaultLinkExample from "./DefaultLinkExample";
import ColoredLinkWithUnderline from "./ColoredLinkWithUnderline";
import LinkOpacityExample from "./LinkOpacityExample";
import LinkOpacityHover from "./LinkOpacityHover";

export default function LinksExample() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-2">
      <DefaultLinkExample />
      <ColoredLinkWithUnderline />
      <LinkOpacityExample />
      <LinkOpacityHover />
    </div>
  );
}
