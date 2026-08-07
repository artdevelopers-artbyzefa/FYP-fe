import React, { useState, useEffect, useCallback } from 'react';

const HeroCarousel = () => {
    const [slides, setSlides] = useState([]);
    const [current, setCurrent] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/hero/public')
            .then(r => r.json())
            .then(res => {
                if (res.success) setSlides(res.data);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const next = useCallback(() => {
        setCurrent(prev => (prev + 1) % Math.max(slides.length, 1));
    }, [slides.length]);

    useEffect(() => {
        if (slides.length < 2) return;
        const timer = setInterval(next, 2000);
        return () => clearInterval(timer);
    }, [slides.length, next]);

    if (loading || slides.length === 0) return null;

    return (
        <div className="relative w-full aspect-[4/3] overflow-hidden shadow-2xl">
            {slides.map((slide, i) => (
                <div
                    key={slide._id}
                    className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                        i === current ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                    }`}
                >
                    <img
                        src={slide.imageUrl}
                        alt={slide.caption || ''}
                        className="w-full h-full object-cover"
                    />
                    {slide.caption && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                            <p className="text-white text-sm font-medium">{slide.caption}</p>
                        </div>
                    )}
                </div>
            ))}

            {slides.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrent(i)}
                            className={`w-2 h-2 rounded-full transition-all ${
                                i === current ? 'bg-white w-5' : 'bg-white/50'
                            }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default HeroCarousel;
