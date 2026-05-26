import React from 'react';

const FeatureCard = ({ icon: Icon, title, description, badge }) => {
  return (
    <div className="card p-6 hover:border-black transition-all">
      <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-blue" />
      </div>
      <h3 className="font-bold text-lg text-black mb-2">{title}</h3>
      <p className="text-black text-sm mb-4 leading-relaxed">{description}</p>
      {badge && (
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-bright bg-white px-3 py-1.5 rounded-full">
          {badge}
        </span>
      )}
    </div>
  );
};

export default FeatureCard;