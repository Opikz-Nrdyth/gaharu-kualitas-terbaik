import { useEffect, useState } from "react";
import Product from "../components/product";
import Navbar from "../components/navbar";
import ViewMore from "../components/viewMore";
import { useNavigate, useParams } from "react-router-dom";
import { fetchData, postData } from "../src/assets/api";
import SwalFireContent from "../src/assets/SwalFire";
import Footer from "../components/footer";
import currencyFormatter from "../src/assets/currency_formater";
import TranslateAll from "../src/assets/translator.json";
import Loader from "../components/loading";

import PopupNotification from "../src/notifications";

const DetailProduct = ({
  navigate,
  advanceSettings,
  setDataNegara,
  negaraSelected,
  socket,
}) => {
  const [message, setMessage] = useState([]);
  const params = useParams();
  const id_produk = params["*"];

  const [dataProduk, setDataProduk] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [fotoTampil, setFotoTampil] = useState("");
  const [loadData, setLoadData] = useState(true);
  const [langCode, setLangCode] = useState("id");
  const GetDataProdukById = async () => {
    const response = await fetchData(`api/products/${id_produk}`);

    console.log("fetching produk item...");

    if (response.status != "success") {
      setLoadData(false);
      SwalFireContent(
        response.status,
        response.message,
        `Error`,
        advanceSettings
      );
    } else {
      setLoadData(false);
      setDataProduk(response.data);
    }
  };

  useEffect(() => {
    GetDataProdukById();
  }, [id_produk]);

  const createInvoice = async () => {
    const formData = {
      productId: id_produk,
      quantity: quantity,
      userId: localStorage.mySocketId,
    };
    const response = await postData("api/invoice", formData);

    SwalFireContent(
      response.status,
      `${response.message}! Your user ID: ${localStorage.mySocketId}`,
      response.status,
      advanceSettings
    );

    window.open(dataProduk.link_catalog, "_blank");
  };

  useEffect(() => {
    setFotoTampil(dataProduk.foto_produk?.[0]);
    if (localStorage.length > 0 && localStorage.lang) {
      const lang = JSON.parse(localStorage.lang);
      setLangCode(lang.langCode);
    }
  }, [dataProduk]);

  useEffect(() => {
    const element = document.querySelector(
      '[style="text-align: center; font-size: 14px;margin-top: 30px; opacity: 0.65;"]'
    );

    if (element) {
      element.remove();
    }
    const element2 = document.querySelector('p[data-f-id="pbf"]');

    if (element2) {
      element2.remove();
    }

    const element3 = document.querySelector('[data-f-id="pbf"]');

    if (element3) {
      element3.remove();
    }

    const element4 = document.querySelector('[data-f-id="pbf"] a');

    if (element4) {
      element4.remove();
    }
  });

  useEffect(() => {
    const GetFake = fetchData("api/invoice/fake/invoice");

    if (localStorage.length > 0 && localStorage.lang) {
      const lang = JSON.parse(localStorage.lang);
      setLangCode(lang.langCode);
    }

    const handleNewMessage = (data) => {
      setMessage((prevMessages) => [
        ...prevMessages,
        {
          header: "Pesanan di konfirmasi",
          message: `Pesanan ${data.nama_produk} milik <span class="text-[${advanceSettings.avcance_settings.popupColor.userText}]" id="test">${data.userId}</span> telah di konfirmasi`,
        },
      ]);
    };

    socket.on("invoiceUpdated", handleNewMessage);
    socket.on("invoiceFake", handleNewMessage);

    return () => {
      socket.off("invoiceUpdated", handleNewMessage);
      socket.off("invoiceFake", handleNewMessage);
    };
  }, []);

  return (
    <div>
      <PopupNotification
        messages={message}
        advanceSettings={advanceSettings.avcance_settings}
        setMessage={setMessage}
      />
      <Navbar advanceSettings={advanceSettings} />
      {loadData ? <Loader /> : null}
      <div className="content">
        <div className="flex flex-wrap justify-center md:mt-[50px]">
          <div className="md:py-[30px] mt-[-10px]">
            <div
              className=" rounded-s-lg w-full shadow-neutral-500 shadow-md relative"
              style={{
                backgroundColor:
                  advanceSettings?.avcance_settings?.primaryColor?.background,
                color: advanceSettings?.avcance_settings?.text?.primary,
              }}
            >
              <img
                src={loadData ? "/Images/images-placeholder.jpg" : fotoTampil}
                className="w-[360px] md:w-[350px] h-[360px] md:h-[350px] object-cover object-center md:rounded-s-lg"
                alt={dataProduk.nama_produk}
                crossOrigin="anonymous"
              />
              <div className="absolute bottom-2 flex flex-wrap justify-center w-[100%] gap-3">
                {dataProduk?.foto_produk?.map((item, index) => [
                  <img
                    key={index}
                    src={loadData ? "/Images/images-placeholder.jpg" : item}
                    onClick={() => {
                      setFotoTampil(item);
                    }}
                    className="rounded-lg border-2 transition-all"
                    style={{
                      borderColor:
                        advanceSettings?.avcance_settings?.secondaryColor
                          ?.background,
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.scale = "1.2";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.scale = "1";
                    }}
                    alt=""
                    width="40px"
                  />,
                ])}
              </div>
            </div>
          </div>
          <div
            className="w-[100%] md:w-[60%] min-h-[calc(100vh-520px)] md:min-h-[400px] p-5 shadow-neutral-500 shadow-md flex flex-col"
            style={{
              backgroundColor:
                advanceSettings?.avcance_settings?.secondaryColor?.background,
              color: advanceSettings?.avcance_settings?.text?.primary,
            }}
          >
            <div className="flex-grow">
              <p className="text-3xl font-bold leading-7">
                {dataProduk.nama_produk}
              </p>
              <p className="text-xl font-bold">{dataProduk.negara_asal}</p>

              <p className="mt-[20px] text-justify">
                {ViewMore(
                  dataProduk?.deskripsi || "Tidak Ada Deskripsi",
                  160,
                  500
                )}
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold">
                {`${TranslateAll[langCode].harga}: `}
                <span>
                  {currencyFormatter(
                    dataProduk.harga * quantity || dataProduk.harga
                  )}
                </span>
              </p>
              <label htmlFor="quantity" className="font-semibold"></label>
              {`${TranslateAll[langCode].quantity}: `}
              <input
                id="quantity"
                className="w-[50px] px-1 py-1 rounded-sm"
                style={{
                  backgroundColor:
                    advanceSettings?.avcance_settings?.inputColor?.background,
                  color: advanceSettings?.avcance_settings?.inputColor?.text,
                  outline: "none",
                }}
                defaultValue={quantity}
                onChange={(e) => {
                  setQuantity(parseInt(e.target.value));
                }}
                onBlur={(e) => {
                  if (e.target.value == "" || e.target.value < 1) {
                    e.target.value = 1;
                    setQuantity(1);
                  }

                  if (e.target.value > dataProduk.stok) {
                    e.target.value = dataProduk.stok;
                    setQuantity(parseInt(dataProduk.stok));
                  }
                }}
                type="number"
              />{" "}
              <button
                className="bg-amber-700 mt-3 text-white w-full py-2 rounded-md hover:bg-amber-800"
                onClick={createInvoice}
              >
                <i className="fa-brands fa-whatsapp"></i>{" "}
                {TranslateAll[langCode].buy_now}
              </button>
            </div>
          </div>
        </div>

        <div>
          <p className="text-3xl font-bold text-amber-700 ml-5 mt-5">
            {TranslateAll[langCode].other_products}
          </p>
          <Product
            navigate={navigate}
            AdvanceSettings={advanceSettings?.avcance_settings}
            setDataNegara={setDataNegara}
            negaraSelected={negaraSelected}
          />
        </div>
      </div>
      <Footer advanceSettings={advanceSettings} />
    </div>
  );
};
export default DetailProduct;
