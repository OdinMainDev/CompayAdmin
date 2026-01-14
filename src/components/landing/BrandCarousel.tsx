import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

// Import brand logos
import brand01 from '@/assets/images/landing/brand/brand_01.svg';
import brand02 from '@/assets/images/landing/brand/brand_02.svg';
import brand03 from '@/assets/images/landing/brand/brand_03.svg';
import brand04 from '@/assets/images/landing/brand/brand_04.svg';
import brand05 from '@/assets/images/landing/brand/brand_05.svg';
import brand06 from '@/assets/images/landing/brand/brand_06.svg';

const BrandCarousel: React.FC = () => {
  const brands = [
    brand01,
    brand02,
    brand03,
    brand04,
    brand05,
    brand06,
    brand04,
  ];

  return (
    <div className="brand__area">
      <div className="container">
        <div className="brand__item-wrap">
          <Swiper
            modules={[Autoplay]}
            slidesPerView={2}
            spaceBetween={24}
            loop={true}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              576: {
                slidesPerView: 3,
              },
              768: {
                slidesPerView: 3,
              },
              992: {
                slidesPerView: 4,
              },
              1200: {
                slidesPerView: 5,
              },
              1500: {
                slidesPerView: 6,
              },
            }}
            className="brand-active"
          >
            {brands.map((brand, index) => (
              <SwiperSlide key={index}>
                <div className="brand__item">
                  <img src={brand} alt="logo" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default BrandCarousel;
