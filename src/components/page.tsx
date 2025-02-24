"use client";

import React, { useEffect, type ComponentProps } from 'react';
import Image from 'next/image';

declare global {
  interface Window {
    __TOMORROW__: {
      renderWidget: () => void;
    };
  }
}

type WeatherWidgetType = "aqiMini" | "upcoming";

type Props = {
  widgetType: WeatherWidgetType;
} & Partial<ComponentProps<'div'>>;

export default function WeatherWidget({ widgetType, ...props }: Props) {
  const config = {
    apiKey: "ANT6VfFGx0QsHTWpnNemSAB9YrLLzGaw",
    language: "EN",
    unitSystem: "METRIC",
    skin: "dark",
    widgetType,
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
      {...props}
      className={`tomorrow ${config.className} ${props.className || ''}`}
      data-language={config.language}
      data-unit-system={config.unitSystem}
      data-skin={config.skin}
      data-widget-type={config.widgetType}
      data-api-key={config.apiKey}
      style={{ paddingBottom: '10px', position: 'relative', ...props.style }}
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
        <Image
          alt="Powered by the Tomorrow.io Weather API"
          src="https://weather-website-client.tomorrow.io/img/powered-by.svg"
          width={10}
          height={18}
          priority
        />
      </a>
    </div>
  );
}