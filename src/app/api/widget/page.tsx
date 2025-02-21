"use client";
import React, { useEffect } from 'react';

declare global {
  interface Window {
    __TOMORROW__: {
      renderWidget: () => void;
    };
  }
}

interface WeatherWidgetProps {}

const WeatherWidget: React.FC<WeatherWidgetProps> = () => {
  const config = {
    apiKey: "ANT6VfFGx0QsHTWpnNemSAB9YrLLzGaw",
    language: "EN",
    unitSystem: "METRIC" as const,
    skin: "dark" as const,
    widgetType: "aqiMini",
    className: ""
  };
    useEffect(() => {
    const initializeWidget = () => {
      const id = 'tomorrow-sdk';
      if (document.getElementById(id)) {
        if (window.__TOMORROW__) {
          window.__TOMORROW__.renderWidget();
        }
        return;
      }

      const script = document.createElement('script');
      script.id = id;
      script.src = 'https://www.tomorrow.io/v1/widget/sdk/sdk.bundle.min.js';
      
      const firstScript = document.getElementsByTagName('script')[0];
      firstScript.parentNode?.insertBefore(script, firstScript);
    };

    initializeWidget();
  }, []);

  return (
    <div 
    className={`tomorrow ${config.className}`}
    data-language={config.language}
    data-unit-system={config.unitSystem}
      data-skin={config.skin}
      data-widget-type={config.widgetType}
      data-api-key={config.apiKey}
      style={{ paddingBottom: '10px', position: 'relative' }}
    >
      <a
        href="https://www.tomorrow.io/weather-api/"
        rel="nofollow noopener noreferrer"
        target="_blank"
        style={{ 
          position: 'absolute', 
          bottom: 0, 
          transform: 'translateX(-50%)', 
          left: '10%' 
        }}
      >
        <img
          alt="Powered by the Tomorrow.io Weather API"
          src="https://weather-website-client.tomorrow.io/img/powered-by.svg"
          width="10"
          height="18"
        />
      </a>
    </div>
  );
};

export default WeatherWidget;