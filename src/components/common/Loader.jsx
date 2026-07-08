import React from "react";
import Spinner from "./Spinner";

const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
      <Spinner size="lg" />
      {text && <p className="mt-4 text-lg font-semibold text-text-primary">{text}</p>}
    </div>
  );
};

export default Loader;
