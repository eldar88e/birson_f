import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

const carouselData = [
  {
    thumbnail: "/images/carousel/carousel-01.png",
  },
  {
    thumbnail: "/images/carousel/carousel-02.png",
  },
  {
    thumbnail: "/images/carousel/carousel-03.png",
  },
  {
    thumbnail: "/images/carousel/carousel-04.png",
  },
];

export default function SlideOnly() {
  const swiperOptions = {
    modules: [Autoplay],
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
  };
  return (
    <div className="border border-gray-200 rounded-lg carouselOne dark:border-gray-800">
      <Swiper {...swiperOptions}>
        {carouselData.map((item, i) => (
          <SwiperSlide key={i + 1}>
            <div className="overflow-hidden rounded-lg">
              <img src={item.thumbnail} className="rounded-lg" alt="carousel" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
