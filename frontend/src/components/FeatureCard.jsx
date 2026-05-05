import React from 'react';

const FeatureCard = ({ icon: Icon, title, description, badge }) => {
  return (
    <div className="card p-6 hover:border-blue-200 transition-all">
      <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-blue" />
      </div>
      <h3 className="font-bold text-lg text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm mb-4 leading-relaxed">{description}</p>
      {badge && (
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-bright bg-blue-50 px-3 py-1.5 rounded-full">
          {badge}
        </span>
      )}
    </div>
  );
};

export default FeatureCard;