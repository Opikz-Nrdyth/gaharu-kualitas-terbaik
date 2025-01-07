const Invoice = require("../models/Invoice");
const Product = require("../models/Product");
const io = require("../utils/socket");
const fs = require("fs").promises;
const path = require("path");
const { decrypt } = require("../config/security");

// Tidak mengubah fungsi createInvoice
exports.createInvoice = async (req, res) => {
  try {
    const { productId, quantity, userId } = req.body;
    const invoiceId = await Invoice.createInvoice(productId, quantity, userId);

    io.emit("newInvoice", {
      invoiceId,
      productId,
      quantity,
      userId,
    });

    res.status(201).json({
      status: "success",
      message: "Invoice created successfully",
      invoiceId,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Tidak mengubah fungsi updateInvoice
exports.updateInvoice = async (req, res) => {
  try {
    const { productId, invoice_id, userId } = req.body;
    const GetData = await Invoice.getInvoiceById(invoice_id);
    const invoiceId = await Invoice.updateInvoice(productId, invoice_id);

    const { nama_produk } = GetData;

    io.emit("invoiceUpdated", {
      invoice_id,
      userId,
      nama_produk,
      productId,
      status: "success",
    });

    res.status(201).json({
      status: "success",
      message: "Invoice confirm successfully",
      invoiceId,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Tidak mengubah fungsi deleteInvoice
exports.deleteInvoice = async (req, res) => {
  try {
    const deleteInvoice = await Invoice.deleteInvoice(req.params.id);
    res.status(201).json({
      status: "success",
      message: "Invoice confirm successfully",
      deleteInvoice,
    });

    io.emit("deleteInvoices", { deleteInvoice });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Tidak mengubah fungsi deleteInvoiceAll
exports.deleteInvoiceAll = async (req, res) => {
  try {
    const deleteInvoice = await Invoice.deleteAll();
    res.status(201).json({
      status: "success",
      message: "Delete All Invoice successfully",
      deleteInvoice,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Tidak mengubah fungsi getInvoice
exports.getInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.getInvoiceById(req.params.id);
    if (!invoice) {
      return res
        .status(404)
        .json({ status: "error", message: "Invoice not found" });
    }
    res.json(invoice);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching invoice", error: error.message });
  }
};

// Tidak mengubah fungsi getNextInterval
function getNextInterval() {
  const currentHour = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    hour12: false,
  });

  let nextInterval;

  if (
    (currentHour >= 7 && currentHour < 11) ||
    (currentHour >= 16 && currentHour < 20)
  ) {
    nextInterval = Math.floor(Math.random() * (180000 - 30000 + 1)) + 30000;
  } else if (
    (currentHour >= 11 && currentHour < 16) ||
    (currentHour >= 20 && currentHour < 24)
  ) {
    nextInterval = Math.floor(Math.random() * (180000 - 30000 + 1)) + 30000;
  } else {
    nextInterval = Math.floor(Math.random() * (180000 - 30000 + 1)) + 30000;
  }
  return nextInterval;
}

let globalSchedule = null;
let isProcessRunning = false;
let nextScheduledTime = null; // Tambah variable untuk tracking waktu

exports.getFakeInvoice = async (req, res) => {
  const SETTINGS_FILE = path.join(__dirname, "..", "settings.opz");

  const sendFakeInvoice = async () => {
    try {
      const encryptedData = await fs.readFile(SETTINGS_FILE, "utf8");
      const decryptedData = decrypt(encryptedData);
      const { fake_invoice } = JSON.parse(decryptedData);

      if (!fake_invoice) {
        console.log("Fake invoice generation stopped (fake_invoice is false)");
        isProcessRunning = false;
        globalSchedule = null;
        nextScheduledTime = null;
        return;
      }

      const GetDataProduk = await Product.findAll();

      if (GetDataProduk.length === 0) {
        console.log("No products available");
        return;
      }

      const uniqueId = Math.floor(Math.random() * 90000000) + 10000000;
      const randomIndex = Math.floor(Math.random() * GetDataProduk.length);
      const DataProduk = GetDataProduk[randomIndex];

      io.emit("invoiceFake", {
        invoice_id: uniqueId,
        userId: "user_" + Math.random().toString(36).substr(2, 9),
        nama_produk: DataProduk?.nama_produk || "Gaharu Arab",
        productId: DataProduk?.id_produk || 263716,
        status: "success",
      });

      const nextInterval = getNextInterval();
      nextScheduledTime = Date.now() + nextInterval; // Simpan waktu jadwal berikutnya
      console.log(
        `Next scheduled time: ${new Date(nextScheduledTime).toLocaleString(
          "id-ID",
          { timeZone: "Asia/Jakarta" }
        )}`
      );
      globalSchedule = setTimeout(sendFakeInvoice, nextInterval);
    } catch (error) {
      console.error("Error in sendFakeInvoice:", error);
      isProcessRunning = false;
      globalSchedule = null;
      nextScheduledTime = null;
    }
  };

  try {
    if (isProcessRunning && nextScheduledTime) {
      const remainingMs = nextScheduledTime - Date.now();
      const remainingMinutes = Math.max(0, Math.ceil(remainingMs / 60000));
      console.log(
        `Process already running. Remaining time: ${remainingMinutes} minutes`
      );
      return res.status(200).json({
        message: "Using existing schedule",
        remainingMinutes: remainingMinutes,
        nextSchedule: new Date(nextScheduledTime).toLocaleString("id-ID", {
          timeZone: "Asia/Jakarta",
        }),
      });
    }

    const encryptedData = await fs.readFile(SETTINGS_FILE, "utf8");
    const decryptedData = decrypt(encryptedData);
    const { fake_invoice } = JSON.parse(decryptedData);

    if (fake_invoice) {
      console.log("Starting new schedule");
      isProcessRunning = true;
      sendFakeInvoice();
      res.status(200).json({ message: "New fake invoice schedule started" });
    } else {
      console.log("Fake invoice generation not enabled");
      res.status(200).json({ message: "Fake invoice generation not enabled" });
    }
  } catch (error) {
    isProcessRunning = false;
    globalSchedule = null;
    nextScheduledTime = null;
    res.status(500).json({
      message: "Error setting up fake invoice generation",
      error: error.message,
    });
  }
};

// Tidak mengubah fungsi getAllInvoices
exports.getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.getAllInvoices();
    res.json(invoices);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching invoices", error: error.message });
  }
};

// Tidak mengubah fungsi getStatusInvoices
exports.getStatusInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.getStatusInvoice(req.params.status);
    res.json(invoices);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching invoices", error: error.message });
  }
};
