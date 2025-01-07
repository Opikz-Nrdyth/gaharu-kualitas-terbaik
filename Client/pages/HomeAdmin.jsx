import { useEffect, useState } from "react";
import { editData, fetchData } from "../src/assets/api";
import currencyFormatter from "../src/assets/currency_formater";
import SwalFireContent from "../src/assets/SwalFire";
import formatIndonesianDate from "../src/assets/formatIndonesianDate";
import DataProduk from "./produk";
import Loader from "../components/loading";
import { useNavigate } from "react-router-dom";

const HomeAdmin = ({ advanceSettings }) => {
  const navigate = useNavigate();
  const [invoice, setDataInvoice] = useState([]);
  const [slides, setSlides] = useState([]);
  const [files, setFiles] = useState([]);
  const [countProduk, setCountProduk] = useState(0);
  const [loadData, setLoadData] = useState(true);
  const GetData = async () => {
    const invoiceResult = await fetchData("api/invoice/status/success");
    const produkResult = await fetchData("api/products");
    const slideShowResult = await fetchData("api/slides");

    setCountProduk(produkResult.data.length);

    setDataInvoice(invoiceResult.data);

    setSlides(slideShowResult.data);

    if (produkResult && invoiceResult && slideShowResult) {
      setLoadData(false);
    }
  };
  useEffect(() => {
    GetData();
  }, []);

  const cekPeghasilan = () => {
    let Penghasilan = 0;
    invoice?.map((item) => {
      Penghasilan = Penghasilan + parseInt(item.total);
    });

    return Penghasilan;
  };

  const handleFileChange = (event) => {
    setFiles(Array.from(event.target.files));
  };

  const handleUpload = async () => {
    const formData = new FormData();
    files.forEach((file) => formData.append("slides", file));
    const result = await editData("api/slides", formData);
    SwalFireContent(
      result.status,
      result.message,
      result.status,
      advanceSettings
    );
    if (result.status == "success") {
      GetData();
    }
  };

  return (
    <div>
      {loadData ? <Loader /> : null}
      <div className="fade-in">
        <h1
          className="text-3xl md:text-4xl font-bold mb-6"
          style={{ color: advanceSettings.backgroundContent.text }}
        >
          Dashboard Admin
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2
              className="text-xl font-semibold mb-2"
              style={{ color: advanceSettings.backgroundContent.text }}
            >
              Total Produk
            </h2>
            <p className="text-3xl font-bold text-amber-600">{countProduk}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2
              className="text-xl font-semibold mb-2"
              style={{ color: advanceSettings.backgroundContent.text }}
            >
              Produk Terjual
            </h2>
            <p className="text-3xl font-bold text-amber-600">
              {invoice?.length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2
              className="text-xl font-semibold mb-2"
              style={{ color: advanceSettings.backgroundContent.text }}
            >
              Pendapatan
            </h2>
            <p className="text-3xl font-bold text-amber-600">
              {currencyFormatter(cekPeghasilan())}
            </p>
          </div>
        </div>

        <div className="p-4">
          <h2
            className="text-2xl font-bold mb-4"
            style={{ color: advanceSettings.backgroundContent.text }}
          >
            Slide Show
          </h2>

          <div className="mb-4">
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="mb-2"
            />
            <button
              onClick={handleUpload}
              className={`px-4 py-2 rounded bg-[${advanceSettings.aksenButton.background}] text-[${advanceSettings.aksenButton.text}]`}
            >
              Upload
            </button>
          </div>

          <div className="flex gap-1 flex-wrap">
            {slides.map((slide, index) => (
              <img
                key={index}
                src={slide.url}
                alt={`Slide ${index + 1}`}
                className={`w-[200px] h-[80px] object-cover rounded border-2 border-[${advanceSettings.primaryColor.background}]`}
              />
            ))}
          </div>
        </div>
        <div className="flex justify-between align-end">
          <h2
            className="text-2xl font-bold mb-4"
            style={{ color: advanceSettings.backgroundContent.text }}
          >
            Produk Terjual Terbaru
          </h2>
          <button
            onClick={() => {
              navigate("invoice");
            }}
            className={`bg-[${advanceSettings.primaryButton.background}] text-[${advanceSettings.primaryButton.text}] hover:bg-[${advanceSettings.primaryButton.hover.background}] px-4 h-fit py-1 rounded-md`}
          >
            Lihat Lainnya
          </button>
        </div>
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full text-left">
            <thead
              style={{
                backgroundColor: advanceSettings.secondaryColor.background,
              }}
            >
              <tr>
                <th
                  className="p-3"
                  style={{ color: advanceSettings.secondaryColor.text }}
                >
                  Produk
                </th>
                <th
                  className="p-3"
                  style={{ color: advanceSettings.secondaryColor.text }}
                >
                  Jenis Kayu
                </th>
                <th
                  className="p-3"
                  style={{ color: advanceSettings.secondaryColor.text }}
                >
                  Harga
                </th>
                <th
                  className="p-3"
                  style={{ color: advanceSettings.secondaryColor.text }}
                >
                  Tanggal Terjual
                </th>
              </tr>
            </thead>
            <tbody>
              {invoice.length > 0 ? (
                invoice?.slice(0, 3).map((item, index) => (
                  <tr
                    className={`border-b ${
                      item.nama_produk.trim() == "Produk Telah dihapus"
                        ? "bg-red-400 hover:bg-red-500"
                        : "hover:bg-[#ededed]"
                    }`}
                    key={index}
                  >
                    <td className="p-3">{item.nama_produk}</td>
                    <td className="p-3">{item.jenis}</td>
                    <td className="p-3">{currencyFormatter(item.harga)}</td>
                    <td className="p-3">
                      {formatIndonesianDate(item.created_at)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="text-center">
                    Belum Ada Pesanan Berhasil
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default HomeAdmin;
