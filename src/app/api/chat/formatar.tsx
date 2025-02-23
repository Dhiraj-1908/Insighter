import React from 'react';

interface Section {
  title: string;
  content: string;
}

interface Subsection {
  heading: string;
  content: string;
}

interface AIResponseFormatterProps {
  content: string;
}

const AIResponseFormatter: React.FC<AIResponseFormatterProps> = ({ content }) => {
  const parseSections = (text: string): Section[] => {
    return text.split('## ').slice(1).map(section => {
      const [title, ...content] = section.split('\n');
      return {
        title: title.trim(),
        content: content.join('\n').trim()
      };
    });
  };

  const parseSubsections = (content: string): Subsection[] => {
    const subsectionRegex = /(\*\*.*?\*\*:)/g;
    const parts = content.split(subsectionRegex).filter(p => p.trim() !== '');
    const subsections: Subsection[] = [];
    let currentHeading = '';
    let currentContent = '';

    parts.forEach((part) => {
      if (part.startsWith('**') && part.endsWith(':')) {
        if (currentHeading) {
          subsections.push({
            heading: currentHeading,
            content: currentContent.trim()
          });
          currentContent = '';
        }
        currentHeading = part.replace(/\*\*/g, '').slice(0, -1).trim();
      } else {
        currentContent += part;
      }
    });

    if (currentHeading) {
      subsections.push({
        heading: currentHeading,
        content: currentContent.trim()
      });
    }

    return subsections;
  };

  const formatContent = (content: string): JSX.Element[] => {
    return content.split(/\n-/).map((item, index) => {
      const trimmedItem = item.trim().replace(/^-/, '').trim();
      return trimmedItem ? (
        <div key={index} className="ml-2 mb-1">
          {formatLine(trimmedItem)}
        </div>
      ) : null;
    }).filter(Boolean) as JSX.Element[];
  };

  const formatLine = (line: string): JSX.Element[] => {
    const parts = line.split(/(\*\*.*?\*\*|⟨.*?⟩|\[Source \d+\])/g);
    
    return parts.filter(Boolean).map((part, i) => {
      if (part.startsWith('**')) {
        return (
          <strong key={i} className="font-semibold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('[Source')) {
        return (
          <span key={i} className="ml-2 text-[10px] text-gray-500">
            {part}
          </span>
        );
      }
      if (part.startsWith('⟨')) {
        return (
          <span key={i} className="text-blue-600">
            {part.slice(1, -1)}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  const sections = parseSections(content);

  return (
    <div className="bg-white text-xs">
      {sections.map((section, sectionIndex) => (
        <section key={sectionIndex} className="mb-4">
          <h2 className="text-[13px] mb-2 text-gray-800 border-b pb-1">
            {section.title}
          </h2>
          <div className="pl-2">
            {parseSubsections(section.content).map((subsection, subIndex) => (
              <div key={subIndex} className="mb-3">
                {subsection.heading && (
                  <div className="text-gray-900 mb-1">
                    {subsection.heading}
                  </div>
                )}
                <div className="text-gray-900">
                  {formatContent(subsection.content)}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default AIResponseFormatter;