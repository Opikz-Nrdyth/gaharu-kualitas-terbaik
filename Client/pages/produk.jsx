import { useEffect, useState } from "react";
import { deleteData, fetchData } from "../src/assets/api";
import currencyFormatter from "../src/assets/currency_formater";
import Swal from "sweetalert2";
import SwalFireContent from "../src/assets/SwalFire";
import Loader from "../components/loading";

const DataProduk = ({ navigate, advanceSettings }) => {
  const [produk, setDataProduk] = useState([]);
  const [loadData, setLoadData] = useState(true);

  const GetData = async () => {
    const produkResult = await fetchData("api/products");
    if (produkResult) {
      setLoadData(false);
    }
    setDataProduk(produkResult.data);
  };
  useEffect(() => {
    GetData();
  }, []);

  const handleDelete = (produkName, productId) => {
    Swal.fire({
      title: `Apakah anda ingin menghapus produk ${produkName}`,
      text: "Produk akan dihapus secara permanen",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: advanceSettings.deniedButton.background,
      cancelButtonColor: advanceSettings.aksenButton.background,
    }).then((res) => {
      if (res.isConfirmed) {
        deleteData("api/products", productId);
        GetData();
      }
    });
  };
  return (
    <div>
      {loadData ? <Loader /> : null}
      <h1
        className="text-3xl md:text-4xl font-bold mb-6"
        style={{ color: advanceSettings.backgroundContent.text }}
      >
        Daftar Produk
      </h1>
      <div className="flex justify-end">
        <button
          className="px-2 md:px-4 rounded-lg text-bold h-[35px] mb-2"
          onClick={() => {
            navigate("/admin/inputproduk");
          }}
          style={{
            backgroundColor: advanceSettings.primaryButton.background,
            color: advanceSettings.primaryButton.text,
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor =
              advanceSettings.primaryButton.hover.background;
            e.currentTarget.style.color =
              advanceSettings.primaryButton.hover.text;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor =
              advanceSettings.primaryButton.background;
            e.currentTarget.style.color = advanceSettings.primaryButton.text;
          }}
        >
          Tambah Produk
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
              <th
                className="p-3"
                style={{ color: advanceSettings.secondaryColor.text }}
              >
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {produk.map((item, index) => (
              <tr className="border-b" key={index}>
                <td className="p-3">{item.nama_produk}</td>
                <td className="p-3">{item.jenis}</td>
                <td className="p-3">{currencyFormatter(item.harga)}</td>
                <td className="p-3">{item.created_at}</td>
                <td>
                  <button
                    className={`px-3 py-0.5 text-[${advanceSettings.deniedButton.text}] rounded-md`}
                    style={{
                      backgroundColor: advanceSettings.deniedButton.background,
                    }}
                    onClick={() => {
                      handleDelete(item.nama_produk, item.id_produk);
                    }}
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataProduk;
