import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const StepCard = ({ step, index }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-lg transition-all duration-300 group animate-fade-up" style={{ animationDelay: `${index * 0.1}s` }}>
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue transition-colors">
          <span className="font-bold text-blue group-hover:text-white">{step.num}</span>
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg text-gray-900 mb-2">{step.title}</h3>
          <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
          {step.active && (
            <div className="mt-3 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span className="text-xs text-green-600 font-medium">Active Phase</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepCard;