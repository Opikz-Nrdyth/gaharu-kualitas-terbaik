import { useEffect, useState } from "react";
import { fetchData } from "../src/assets/api";

const NewSlidebar = ({ advanceSettings }) => {
  const styleData = advanceSettings.avcance_settings;
  const [data, setData] = useState([]);
  const GetData = async () => {
    const result = await fetchData("api/slides");
    setData(result.data);
  };

  useEffect(() => {
    GetData();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      new Swiper(".progress-slide-carousel", {
        loop: true,
        centeredSlides: true,
        spaceBetween: 30,
        slideToClickedSlide: true,
        paginationClickable: true,
        fraction: true,
        autoplay: {
          delay: 1200,
          disableOnInteraction: false,
        },
        pagination: {
          el: ".progress-slide-carousel .swiper-pagination",
          type: "progressbar",
        },
        breakpoints: {
          1920: {
            slidesPerView: 4,
            spaceBetween: 30,
          },
          1028: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
          990: {
            slidesPerView: 1,
            spaceBetween: 0,
          },
        },
      });
    }
  }, [data]);
  return (
    <div>
      <div className="w-full relative">
        <div className="swiper progress-slide-carousel swiper-container relative">
          <div className="swiper-wrapper">
            {data.map((item, index) => [
              <div className="swiper-slide">
                <div className="bg-slate-400 rounded-2xl h-96 flex justify-center items-center">
                  <img
                    className="w-auto h-full object-cover"
                    src={item.url}
                    alt={item.filename}
                    key={index}
                  />
                </div>
              </div>,
            ])}
          </div>
          <div className="hidden swiper-pagination !top-auto !w-80 right-0 mx-auto bg-gray-100"></div>
        </div>
      </div>
    </div>
  );
};
export default NewSlidebar;
