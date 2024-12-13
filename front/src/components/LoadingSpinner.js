import { useEffect } from "react";
import "ldrs/ring";

function LoadingSpinner() {
  useEffect(() => {
    // Register the custom element if it hasn't been registered yet
    if (!customElements.get("l-ring")) {
      import("ldrs/ring");
    }
  }, []);

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center">
      <l-ring
        size="40"
        stroke="5"
        bg-opacity="0"
        speed="2"
        color="rgb(99, 102, 241)" // Using your accent color
      ></l-ring>
    </div>
  );
}

export default LoadingSpinner;
