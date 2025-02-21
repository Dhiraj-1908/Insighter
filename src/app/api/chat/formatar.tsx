import React from 'react';

interface Section {
  title: string;
  content: string;
}

interface AIResponseFormatterProps {
  content: string;
}

const AIResponseFormatter: React.FC<AIResponseFormatterProps> = ({ content }) => {
  // Parse sections with improved delimiter handling
  const parseSections = (text: string): Section[] => {
    return text.split('## ').slice(1).map(section => {
      const [title, ...content] = section.split('\n');
      return {
        title: title.trim(),
        content: content.join('\n').trim()
      };
    });
  };

  // Process text content with selective formatting
  const formatContent = (text: string): JSX.Element[] => {
    // Split content into logical blocks
    const blocks = text.split(/(-\s*\*\*|\n\s*\*\*)/g).filter(Boolean);
    let currentBlock = '';
    const formattedBlocks: JSX.Element[] = [];

    blocks.forEach((block, index) => {
      if (block.match(/^(-|\*\*)/)) {
        if (currentBlock) {
          formattedBlocks.push(renderBlock(currentBlock, index));
          currentBlock = '';
        }
        currentBlock = block.replace(/^(-|\*\*)/, '').trim();
      } else {
        currentBlock += block;
      }
    });

    if (currentBlock) {
      formattedBlocks.push(renderBlock(currentBlock, blocks.length));
    }

    return formattedBlocks;
  };

  const renderBlock = (block: string, key: number): JSX.Element => {
    const [heading, ...content] = block.split(':');
    const formattedContent = content.join(':').trim();

    return (
      <div key={key} className="mb-4">
        <strong className="font-semibold text-gray-900 block mb-1">
          {heading.replace(/\*\*/g, '').trim()}
        </strong>
        <div className="text-gray-700">
          {formatLine(formattedContent)}
        </div>
      </div>
    );
  };

  // Format individual line content
  const formatLine = (line: string): JSX.Element[] => {
    const parts = line.split(/(\*\*.*?\*\*|⟨.*?⟩|\[Source \d+\])/g);
    
    return parts.filter(Boolean).map((part, i) => {
      if (part.startsWith('**')) {
        return (
          <strong key={i} className="font-semibold text-gray-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('[Source')) {
        return (
          <span key={i} className="ml-2 text-sm text-gray-500">
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
    <div className="bg-white">
      {sections.map((section, index) => (
        <section key={index} className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
            {section.title}
          </h2>
          <div className="pl-4">
            {formatContent(section.content)}
          </div>
        </section>
      ))}
    </div>
  );
};

export default AIResponseFormatter;