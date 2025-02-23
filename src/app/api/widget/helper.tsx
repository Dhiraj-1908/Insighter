import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import WeatherWidget from "./page";

const WeatherWidgetSwitcher = () => {
  const [showFirstWidget, setShowFirstWidget] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowFirstWidget((prev) => !prev);
    }, 1 * 60 * 1000); // Switch every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full">
      <AnimatePresence mode="wait">
        {showFirstWidget ? (
          <motion.div
            key="aqi-widget"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full"
          >
            <WeatherWidget widgetType="aqiMini" />
          </motion.div>
        ) : (
          <motion.div
            key="upcoming-widget"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full"
          >
            <WeatherWidget widgetType="upcoming" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WeatherWidgetSwitcher;