import { ColorRing } from "react-loader-spinner";

export const GlobalLoader = ({ height = 48, width = 48 }) => {
  return (
    <div className="flex flex-col justify-center items-center fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 gap-3">
      <ColorRing
        visible={true}
        height={height}
        width={width}
        colors={["#818cf8", "#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd"]}
      />
      <span className="text-sm text-slate-400 font-medium">Loading...</span>
    </div>
  );
};

export const Spinner = ({ height = 24, width = 24 }) => {
  return (
    <ColorRing
      visible={true}
      height={height}
      width={width}
      colors={["#818cf8", "#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd"]}
    />
  );
};
