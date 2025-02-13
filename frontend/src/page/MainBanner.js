import React, { useState, useEffect, useCallback } from 'react';

const MainBanner = () => {
  const apiUrl = process.env.REACT_APP_BASE_URL;
  const [slides, setSlides] = useState([]); // Store images from API
  const [active, setActive] = useState(0);

  // Fetch images from API
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(`${apiUrl}/main-banner-api/display-admin-main-banner`, {
          headers: {
            'x-api-key': process.env.REACT_APP_API_KEY,
          },
        });
        const data = await response.json();

        if (Array.isArray(data)) {
          const imageUrls = data.flatMap((item) => item.MainBanner_img || []);
          setSlides(imageUrls);
        }
      } catch (error) {
        console.error('Error fetching main banner images:', error);
      }
    };

    fetchImages();
  }, [apiUrl]);

  // Auto-slide logic
  const nextSlide = useCallback(() => {
    setActive((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = () => {
    setActive((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    if (slides.length > 0) {
      const autoSlide = setInterval(nextSlide, 15000);
      return () => clearInterval(autoSlide);
    }
  }, [slides, nextSlide]);

  return (
    <div className="slider">
      {slides.length > 0 ? (
        <>
          <div
            className="slide-list"
            style={{
              transform: `translateX(-${active * 100}%)`, // Move the slide list
            }}
          >
            {slides.map((src, index) => (
              <div key={index} className="slide-item">
                <img src={src} alt={`slide ${index + 1}`} />
              </div>
            ))}
          </div>
          <div className="slider-buttons">
            <button onClick={prevSlide}>&lt;</button>
            <button onClick={nextSlide}>&gt;</button>
          </div>
        </>
      ) : (
        <p>Loading images...</p>
      )}
    </div>
  );
};

export default MainBanner;
