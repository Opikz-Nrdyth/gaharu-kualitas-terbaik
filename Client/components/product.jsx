import { useEffect, useState } from "react";
import { fetchData } from "../src/assets/api";
import "../src/assets/stylesheet/product.css";
import SwalFireContent from "../src/assets/SwalFire";
import currencyFormatter from "../src/assets/currency_formater";
const Product = ({
  navigate,
  AdvanceSettings,
  setDataNegara,
  negaraSelected,
}) => {
  const [data, setData] = useState([]);
  const [readyDataNegara, setReadyDataNegara] = useState(true);

  const GetData = async () => {
    console.log("fetch data product...");
    let url = "api/products";
    if (negaraSelected && negaraSelected != "") {
      url = `api/products/q/${negaraSelected}`;
    }
    const response = await fetchData(url);
    if (response.status == "error" || response.error) {
      SwalFireContent(
        response.status,
        response.message,
        "Error Fetch Product",
        AdvanceSettings
      );
    } else {
      setData(response.data);
    }
  };

  useEffect(() => {
    GetData();
  }, [negaraSelected]);

  useEffect(() => {
    const categori = [
      ...new Set(data.map((item) => item.negara_asal.toLowerCase())),
    ];

    if (data.length > 0 && readyDataNegara) {
      setDataNegara(categori);
      setReadyDataNegara(false);
    }
  }, [data]);

  return (
    <div className="mt-5 mb-5">
      <div className="flex flex-wrap justify-center gap-4 mt-5  lg:px-0">
        {data.map((item, index) => (
          <div
            className={`cursor-pointer border border-[${AdvanceSettings.primaryColor.background}] pb-3 rounded-lg  w-[162px] md:w-[190px]  shadow-md transition-transform duration-300 hover:scale-105 hover:z-10`}
            style={{
              backgroundColor: AdvanceSettings.cardProduct.background,
              color: AdvanceSettings.cardProduct.text,
            }}
            key={index}
            onClick={() => {
              window.scroll({
                top: 0,
                behavior: "smooth", // Untuk efek scroll yang halus
              });
              navigate(`/product/${item?.id_produk}`);
            }}
          >
            <div
              className="w-full h-[162px] md:h-[190px] rounded-t-lg"
              style={{
                backgroundColor: AdvanceSettings.primaryColor.background,
              }}
            >
              <img
                crossOrigin="anonymous"
                src={
                  item && item?.foto_produk.length > 0
                    ? item?.foto_produk?.[0]
                    : "/Images/images-placeholder.jpg"
                }
                alt={item?.nama_produk}
                className="w-[162px] md:w-[190px] h-[162px] md:h-[190px] object-cover object-center rounded-t-lg"
              />
            </div>
            <div className="px-3 flex flex-col justify-between h-[calc(100%-155px)] md:h-[calc(100%-185px)]">
              <p className="text-md md:text-md font-bold leading-tight">
                {item?.nama_produk}
              </p>

              {/* Ini Harga Produk Tolong Pastikan ini Di paling bawah element. */}
              <div className="flex justify-between items-end">
                <div>
                  {item?.discount ? (
                    <s className="discount text-xs">
                      {currencyFormatter(item?.discount || 0)}
                    </s>
                  ) : null}
                  <p className="price font-medium">
                    {currencyFormatter(item?.harga)}
                  </p>
                </div>
                <p>
                  <i className="fa-solid fa-cart-plus"></i>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Product;
