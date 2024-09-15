// NPM package for Loder
import { ColorRing } from "react-loader-spinner";

export const GlobalLoader = ({ height = 80, width = 80 }) => {
  return (
    <div className="flex justify-center items-center fixed inset-0 bg-opacity-50 bg-gray-800 z-50">
      <ColorRing
        visible={true}
        height={height}
        width={width}
        colors={["#68bbe3", "#68bbe3", "#68bbe3", "#68bbe3", "#68bbe3"]}
      />
    </div>
  );
};

export const Spinner = ({ height = 40, width = 40 }) => {
  return (
    <ColorRing
      visible={true}
      height={height}
      width={width}
      colors={["#68bbe3", "#68bbe3", "#68bbe3", "#68bbe3", "#68bbe3"]}
    />
  );
};
