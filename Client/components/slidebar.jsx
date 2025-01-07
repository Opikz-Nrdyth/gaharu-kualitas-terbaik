import { Carousel } from "flowbite-react";
import { fetchData } from "../src/assets/api";
import { useEffect, useState } from "react";

const SlideBar = ({ navigate, ScreenWidth }) => {
  const [data, setData] = useState([]);
  const GetData = async () => {
    const result = await fetchData("api/slides");
    setData(result.data);
  };

  useEffect(() => {
    GetData();
  }, []);
  return (
    <div className="flex justify-center">
      <div className="h-56 sm:h-64 xl:h-80 2xl:h-96 w-[100%] md:w-[90%]">
        <Carousel slideInterval={2000}>
          {data.map((item, index) => [
            <img src={item.url} alt={item.filename} key={index} />,
          ])}
        </Carousel>
      </div>
    </div>
  );
};
export default SlideBar;
