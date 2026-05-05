import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const Accordion = ({ items }) => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleItem = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div
          key={index}
          className={`bg-white border rounded-xl overflow-hidden transition-all duration-300 ${
            openIndex === index ? 'border-blue-300 shadow-md' : 'border-gray-100'
          }`}
        >
          <button
            onClick={() => toggleItem(index)}
            className="w-full flex items-center justify-between p-5 lg:p-6 text-left hover:bg-gray-50 transition-colors"
          >
            <h3 className={`font-bold text-base lg:text-lg pr-4 ${openIndex === index ? 'text-blue-bright' : 'text-navy'}`}>
              {item.question}
            </h3>
            <ChevronDown
              className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
                openIndex === index ? 'rotate-180 text-blue-bright' : 'text-gray-400'
              }`}
            />
          </button>
          <div
            className={`transition-all duration-300 overflow-hidden ${
              openIndex === index ? 'max-h-96' : 'max-h-0'
            }`}
          >
            <div className="p-5 lg:p-6 pt-0 border-t border-gray-100">
              <p className="text-gray-600 leading-relaxed">{item.answer}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Accordion;