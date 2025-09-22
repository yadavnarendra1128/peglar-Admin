"use client";
import { useCallback, useState } from "react";
import { VectorMap } from "@react-jvectormap/core";
import { worldMill } from "@react-jvectormap/world";
import { countries } from "country-data";

const MapOne: React.FC = () => {
  // Sample data for country visitor counts
  const [countryData] = useState<Record<string, number>>({
    US: 1200,
    IN: 980,
    CN: 700,
    RU: 450,
    BR: 680,
    CA: 890,
  });

  const countryCodes = Object.fromEntries(
    countries.all.map(({ name, alpha2 }) => [name, alpha2])
  );

  const onRegionTipShow = useCallback(
    (event: any, label: any, code: string) => {
      const visitorCount = countryData[code] || 0; // Get visitor count or default to 0
      label.html(`
      <div style="
          background-color: black; 
          border-radius: 6px; 
          min-height: 50px; 
          width: 150px; 
          color: white; 
          padding: 10px; 
          position: absolute; 
          z-index: 9999; /* Ensure the tooltip appears on top */
          transform: translateY(-120%); /* Move tooltip above the cursor */
        ">
        <p><b>${label.html()}</b></p>
        <p>Visitors: ${visitorCount}</p>
      </div>
      `);
    },
    [countryData]
  );

  return (
    <div className="z-[1] col-span-12 rounded-[10px] bg-[#fff] p-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card xl:col-span-7">
      <h4 className="mb-7 text-body-2xlg font-bold text-dark dark:text-white">
        Visitor
      </h4>
      <div className="h-[422px] relative">
        <VectorMap
          map={worldMill}
          style={{ height: "400px", width: "100%" }}
          backgroundColor="#fff"
          series={{
            regions: [
              {
                values: countryData, // Color customization based on data can be added here
                attribute: "fill",
                scale: ["#5750F1", "#0ABEF9"], // Gradient between two colors
              },
            ],
          }}
          regionStyle={{
            initial: {
              fill: "#E5E5E5", // Default country color
              fillOpacity: 1,
              stroke: "#000", // Border color (black)
              strokeWidth: 1.5, // Border width
              strokeOpacity: 1, // Border opacity
            },
          }}
          onRegionTipShow={onRegionTipShow}
        />
      </div>
    </div>
  );
};

export default MapOne;
