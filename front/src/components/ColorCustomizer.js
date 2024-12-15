import { useState, useEffect } from "react";
import { HexColorPicker } from "react-colorful";
import { sellerService } from "../services/sellerService";

function ColorCustomizer({ sellerId, onSave }) {
  const [colors, setColors] = useState({
    primary_color: "",
    secondary_color: "",
    accent_color: "",
  });
  const [activeColor, setActiveColor] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchColors = async () => {
      try {
        const profile = await sellerService.getProfileCustomization(sellerId);
        console.log(profile);
        if (profile) {
          setColors({
            primary_color: profile.primary_color,
            secondary_color: profile.secondary_color,
            accent_color: profile.accent_color,
          });
        }
      } catch (error) {
        console.error("Error fetching colors:", error);
      }
    };

    fetchColors();
  }, [sellerId]);

  const handleColorChange = (color) => {
    if (activeColor) {
      setColors((prev) => ({
        ...prev,
        [activeColor]: color,
      }));
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await sellerService.updateProfileCustomization(sellerId, colors);
      onSave();
      setActiveColor(null); // Close color picker
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-secondary/30 rounded-lg p-6">
      <h2 className="text-lg font-semibold text-textPrimary mb-4">
        Customize Profile Colors
      </h2>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {Object.entries(colors).map(([key, value]) => (
          <button
            key={key}
            onClick={() => setActiveColor(key)}
            className={`p-4 rounded-lg border-2 transition-all ${
              activeColor === key
                ? "border-accent"
                : "border-transparent hover:border-accent/50"
            }`}
          >
            <div
              className="w-full h-12 rounded-md mb-2"
              style={{ backgroundColor: value }}
            />
            <p className="text-sm text-textSecondary capitalize">
              {key.replace("_", " ")}
            </p>
          </button>
        ))}
      </div>

      {activeColor && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-textSecondary capitalize">
              {activeColor.replace("_", " ")}
            </p>
            <button
              onClick={() => setActiveColor(null)}
              className="text-sm text-textSecondary hover:text-textPrimary"
            >
              Close
            </button>
          </div>
          <HexColorPicker
            color={colors[activeColor]}
            onChange={handleColorChange}
          />
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={isLoading}
        className="w-full px-4 py-2 bg-accent text-white rounded-lg text-sm hover:bg-accent/90 transition-colors disabled:opacity-50"
      >
        {isLoading ? "Saving..." : "Save Colors"}
      </button>
    </div>
  );
}

export default ColorCustomizer;
