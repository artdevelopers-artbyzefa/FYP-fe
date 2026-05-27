import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Shield, Layers, Mail, Phone, MapPin } from 'lucide-react';

const Hero = ({ title, subtitle, badge, ctaText, ctaLink, secondaryCta, features }) => {
  const getIcon = (iconName) => {
    switch(iconName) {
      case 'clock': return <Clock className="w-5 h-5 text-blue-600" />;
      case 'shield': return <Shield className="w-5 h-5 text-blue-600" />;
      case 'layers': return <Layers className="w-5 h-5 text-blue-600" />;
      case 'mail': return <Mail className="w-5 h-5 text-blue-600" />;
      case 'phone': return <Phone className="w-5 h-5 text-blue-600" />;
      case 'map': return <MapPin className="w-5 h-5 text-blue-600" />;
      default: return <Layers className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient- /30 py-16 lg:py-24">
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/30 rounded-full blur-3xl -z-0" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/20 rounded-full blur-3xl -z-0" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left">
            {badge && (
              <div className="badge mb-6 mx-auto lg:mx-0 animate-fade-up">
                <span className="w-1.5 h-1.5 bg-blue-bright rounded-full animate-pulse" />
                {badge}
              </div>
            )}
            <h1 className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl text-navy leading-tight tracking-tight mb-5">
              {title}
            </h1>
            <p className="text-black text-base md:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {subtitle}
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-8">
              <Link to={ctaLink} className="btn-primary">
                {ctaText}
                <ArrowRight className="w-4 h-4" />
              </Link>
              {secondaryCta && (
                <Link to={secondaryCta.link} className="btn-outline">
                  {secondaryCta.text}
                </Link>
              )}
            </div>
          </div>

          {/* Right Feature Card */}
          {features && (
            <div className="flex-1 max-w-md w-full bg-white rounded-2xl p-6 lg:p-8 shadow-xl border border-black animate-fade-up">
              {features.map((feature, idx) => (
                <div key={idx} className={`flex gap-4 ${idx !== 0 ? 'mt-6 pt-6 border-t border-gray-100' : ''}`}>
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center flex-shrink-0">
                    {getIcon(feature.icon)}
                  </div>
                  <div>
                    <h3 className="font-bold text-black mb-1">{feature.title}</h3>
                    <p className="text-sm text-black leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;