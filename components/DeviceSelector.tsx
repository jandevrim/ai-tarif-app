"use client";

import React from "react";
import { useTranslation } from "react-i18next";

interface DeviceSelectorProps {
  selectedDevice: "thermomix" | "thermogusto";
  onSelectDevice: (device: "thermomix" | "thermogusto") => void;
}

const DeviceSelector: React.FC<DeviceSelectorProps> = ({ selectedDevice, onSelectDevice }) => {
  const { t } = useTranslation();

  return (
    <div className="flex justify-center gap-4 mb-4">
      <button
        onClick={() => onSelectDevice("thermomix")}
        className={`px-4 py-2 rounded-full shadow ${
          selectedDevice === "thermomix" ? "bg-green-600 text-white" : "bg-gray-200"
        }`}
      >
        Thermomix
      </button>
      <button
        onClick={() => onSelectDevice("thermogusto")}
        className={`px-4 py-2 rounded-full shadow ${
          selectedDevice === "thermogusto" ? "bg-green-600 text-white" : "bg-gray-200"
        }`}
      >
        ThermoGusto
      </button>
    </div>
  );
};

export default DeviceSelector;