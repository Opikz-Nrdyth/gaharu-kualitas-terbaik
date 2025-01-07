import { useEffect, useState } from "react";
import { deleteData, fetchData } from "../src/assets/api";
import currencyFormatter from "../src/assets/currency_formater";
import formatIndonesianDate from "../src/assets/formatIndonesianDate";
import Swal from "sweetalert2";
import SwalFireContent from "../src/assets/SwalFire";
import Loader from "../components/loading";

const Invoice = ({ advanceSettings }) => {
  const [invoice, setDataInvoice] = useState([]);
  const [loadData, setLoadData] = useState(true);
  const GetData = async () => {
    const invoiceResult = await fetchData("api/invoice/");
    if (invoiceResult) {
      setLoadData(false);
    }
    setDataInvoice(invoiceResult.data);
  };

  const deleteProduk = async (id) => {
    Swal.fire({
      title: `Apakah Anda Yakin?`,
      text: `Anda akan menghapus data invoice dengan id ${id}, Data akan dihapus secara permanen!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: advanceSettings.deniedButton.background,
      cancelButtonColor: advanceSettings.aksenButton.background,
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Tidak Jadi",
    }).then(async (res) => {
      if (res.isConfirmed) {
        setLoadData(true);
        const result = await deleteData("api/invoice/id", id);

        SwalFireContent(
          result.status,
          result.message,
          result.status,
          advanceSettings
        );

        if (result) {
          setLoadData(false);
        }
        GetData();
      }
    });
  };

  useEffect(() => {
    GetData();
  }, []);

  const DeleteAll = () => {
    Swal.fire({
      title: `Apakah Anda Yakin?`,
      text: `Anda akan menghapus semua data invoice, Data akan dihapus secara permanen!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: advanceSettings.deniedButton.background,
      cancelButtonColor: advanceSettings.aksenButton.background,
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Tidak Jadi",
    }).then(async (res) => {
      if (res.isConfirmed) {
        setLoadData(true);
        const result = await deleteData("api/invoice/All");

        SwalFireContent(
          result.status,
          result.message,
          result.status,
          advanceSettings
        );

        if (result) {
          setLoadData(false);
        }
        GetData();
      }
    });
  };
  return (
    <div className="fade-in">
      {loadData ? <Loader /> : null}
      <div className="flex justify-between align-middle">
        <h1
          className="text-3xl md:text-4xl font-bold mb-6"
          style={{ color: advanceSettings.backgroundContent.text }}
        >
          Invoice
        </h1>
        <button
          className={`bg-[${advanceSettings.deniedButton.background}] text-[${advanceSettings.deniedButton.text}] h-fit py-1 px-3 rounded-md hover:bg-[${advanceSettings.deniedButton.hover.background}]`}
          onClick={DeleteAll}
        >
          <i className="fa-solid fa-trash-can"></i> Hapus Semua Data
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
                ID Invoice
              </th>
              <th
                className="p-3"
                style={{ color: advanceSettings.secondaryColor.text }}
              >
                Foto
              </th>
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
                Quantity
              </th>
              <th
                className="p-3"
                style={{ color: advanceSettings.secondaryColor.text }}
              >
                Total Harga
              </th>
              <th
                className="p-3"
                style={{ color: advanceSettings.secondaryColor.text }}
              >
                Status
              </th>
              <th
                className="p-3"
                style={{ color: advanceSettings.secondaryColor.text }}
              >
                Tanggal Terjual
              </th>
              <th
                className="p-3"
                style={{ color: advanceSettings.secondaryColor.text }}
              >
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {invoice.length > 0 ? (
              invoice?.map((item, index) => (
                <tr
                  className={`border-b ${
                    item.nama_produk.trim() == "Produk Telah dihapus"
                      ? "bg-red-400 hover:bg-red-500"
                      : "hover:bg-[#ededed]"
                  }`}
                  key={index}
                >
                  <td className="p-3">{item.id}</td>
                  <td className="p-3">
                    <img
                      src={
                        item && item.foto_produk
                          ? JSON.parse(item.foto_produk)[0]
                          : "/Images/images-placeholder.jpg"
                      }
                      width="30px"
                      alt={item.nama_produk}
                    />
                  </td>
                  <td className="p-3">{item.nama_produk}</td>
                  <td className="p-3">{item.jenis}</td>
                  <td className="p-3">{currencyFormatter(item.harga)}</td>
                  <td className="p-3">{item.quantity}</td>
                  <td className="p-3">{currencyFormatter(item.total)}</td>
                  <td className="p-3">
                    {item.status == "success" ? (
                      <span className="bg-green-300 px-2 py-1 rounded-md">
                        success
                      </span>
                    ) : (
                      <span className="bg-yellow-300 px-2 py-1 rounded-md">
                        {item.status}
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    {formatIndonesianDate(item.created_at)}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => {
                        deleteProduk(item.id);
                      }}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center">
                  Belum Ada Pesanan!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Invoice;
