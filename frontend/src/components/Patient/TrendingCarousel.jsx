import React from 'react';
import { ChevronLeft, ChevronRight, Flame, Star } from 'lucide-react';
import HospitalCard from './HospitalCard';
import '../../styles/TrendingCarousel.css';

const TrendingCarousel = ({ hospitals, onNotify, onRate, onJoinQueue }) => {
    const scrollContainerRef = React.useRef(null);

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const { current } = scrollContainerRef;
            const scrollAmount = 320; 
            if (direction === 'left') {
                current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    if (!hospitals || hospitals.length === 0) return null;

    return (
        <div className="trending-section">
            <div className="trending-header">
                <div className="trending-title">
                    <Flame className="trending-icon" size={24} />
                    <h2>Trending Hospitals</h2>
                </div>
                <div className="carousel-controls">
                    <button className="control-btn" onClick={() => scroll('left')}>
                        <ChevronLeft size={20} />
                    </button>
                    <button className="control-btn" onClick={() => scroll('right')}>
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div className="carousel-container" ref={scrollContainerRef}>
                {hospitals.map(hospital => (
                    <div key={hospital.id} className="carousel-item">
                        <HospitalCard
                            hospital={hospital}
                            onNotify={onNotify}
                            onRate={onRate}
                            onJoinQueue={onJoinQueue}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TrendingCarousel;
