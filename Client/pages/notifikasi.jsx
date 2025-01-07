import { useEffect, useState } from "react";
import { deleteData, editData, fetchData } from "../src/assets/api";
import SwalFireContent from "../src/assets/SwalFire";
import formatIndonesianDate from "../src/assets/formatIndonesianDate";
import Loader from "../components/loading";

const NotificationPage = ({ advanceSettings, socket }) => {
  const [notifications, setNotifications] = useState([]);
  const [loadData, setLoadData] = useState(true);

  const GetData = async () => {
    const response = await fetchData("api/invoice/status/pending");
    if (response) {
      setLoadData(false);
    }
    setNotifications(response.data);
  };
  useEffect(() => {
    GetData();
    socket.on("newInvoice", (data) => {
      GetData();
    });
    socket.on("deleteInvoices", (data) => {
      GetData();
    });
    socket.on("invoiceUpdated", (data) => {
      GetData();
    });
  }, []);

  const handleResponse = (id, produk, response, userId) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
    if (response) {
      ConfirmYes(id, produk, userId);
    } else {
      ConfirmNo(id);
    }
  };

  const ConfirmYes = async (id, produk, userId) => {
    const formData = {
      productId: produk,
      invoice_id: id,
      userId: userId,
    };
    const result = await editData("api/invoice", formData);
    SwalFireContent(
      result.status,
      result.message,
      result.status,
      advanceSettings
    );
  };

  const ConfirmNo = async (id) => {
    const result = await deleteData(`api/invoice/id`, id);
    SwalFireContent(
      result.status,
      result.message,
      result.status,
      advanceSettings
    );
  };

  return (
    <div className="fade-in">
      {loadData ? <Loader /> : null}
      <h1
        className="text-3xl md:text-4xl font-bold mb-6"
        style={{ color: advanceSettings.backgroundContent.text }}
      >
        Notifikasi
      </h1>
      {notifications.length === 0 ? (
        <p
          className="text-lg"
          style={{ color: advanceSettings.backgroundContent.text }}
        >
          Tidak ada notifikasi baru.
        </p>
      ) : (
        notifications.map((notif) => (
          <div
            key={notif.product_id}
            className="p-4 rounded-lg shadow-md mb-4"
            style={{ backgroundColor: advanceSettings.cardProduct.background }}
          >
            <div
              className="text-sm"
              style={{ color: advanceSettings.cardProduct.text }}
            >
              {formatIndonesianDate(notif.created_at)}
            </div>
            <h2
              className="text-xl font-semibold mb-2"
              style={{ color: advanceSettings.cardProduct.text }}
            >
              {`${notif.user_id} | ${notif.nama_produk}`}
            </h2>
            <p
              className="mb-4"
              style={{ color: advanceSettings.cardProduct.text }}
            >
              Apakah produk ini sudah terjual?
            </p>
            <div className="flex space-x-4">
              <button
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    advanceSettings.aksenButton.hover.background)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    advanceSettings.aksenButton.background)
                }
                onClick={() =>
                  handleResponse(
                    notif.id,
                    notif.product_id,
                    true,
                    notif.user_id
                  )
                }
                className="text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200"
                style={{
                  backgroundColor: advanceSettings.aksenButton.background,
                  color: advanceSettings.aksenButton.text,
                }}
              >
                <i className="fa-solid fa-check"></i> Ya
              </button>
              <button
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    advanceSettings.deniedButton.hover.background)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    advanceSettings.deniedButton.background)
                }
                onClick={() =>
                  handleResponse(notif.id, notif.product_id, false)
                }
                className="text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200"
                style={{
                  backgroundColor: advanceSettings.deniedButton.background,
                  color: advanceSettings.deniedButton.text,
                }}
              >
                <i className="fa-solid fa-xmark"></i> Tidak
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default NotificationPage;
