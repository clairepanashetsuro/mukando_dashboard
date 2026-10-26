import "./Brand.css";

export function Brand({ large }: { large?: boolean }) {
  return <div className={large ? "brand big" : "brand"}>Mukando</div>;
}
