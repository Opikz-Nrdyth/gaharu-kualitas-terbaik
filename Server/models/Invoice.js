const { pool } = require("../config/database");
const Popularity = require("./Popularity");
const { encrypt, decrypt } = require("../config/security");

class Invoice {
  static async createInvoice(productId, quantity, userId) {
    const [rows] = await pool.query(
      "SELECT id_produk, nama_produk, harga FROM produk WHERE id_produk = ?",
      [productId]
    );

    if (rows.length === 0) {
      throw new Error("Product not found");
    }
    const { id_produk, nama_produk, harga } = rows[0];
    const total = harga * quantity;
    const uniqueId = Math.floor(Math.random() * 90000000) + 10000000;
    const query =
      "INSERT INTO invoices (id, product_id, user_id, quantity, total, status) VALUES (?, ?, ?, ?, ?, ?)";
    const [result] = await pool.query(query, [
      uniqueId,
      id_produk,
      userId,
      quantity,
      total,
      "pending",
    ]);

    // Update popularity

    await Popularity.updateBuyCount(id_produk, nama_produk, quantity);

    return uniqueId;
  }

  static async updateInvoice(productId, id_invoice) {
    const [rows] = await pool.query(
      "SELECT id_produk, nama_produk, harga FROM produk WHERE id_produk = ?",
      [productId]
    );

    if (rows.length === 0) {
      throw new Error("Product not found " + productId);
    }

    const query = "UPDATE `invoices` SET `status`=? WHERE id=?";
    const [result] = await pool.query(query, ["success", id_invoice]);

    return result;
  }

  static async deleteInvoice(invoice_id) {
    const query = "DELETE FROM `invoices` WHERE id=?";
    const [result] = await pool.query(query, [invoice_id]);
    return result;
  }

  static async deleteAll() {
    const query = "TRUNCATE `invoices`";
    const [result] = await pool.query(query);
    return result;
  }

  static async getInvoiceById(id) {
    const query =
      "SELECT * FROM `invoices` LEFT JOIN produk ON invoices.product_id = produk.id_produk WHERE id = ?";
    const [rows] = await pool.query(query, [id]);
    if (rows.length === 0) {
      return null;
    }
    const decryptRows = rows.map((item) => ({
      ...item,
      nama_produk: item.nama_produk
        ? decrypt(item.nama_produk)
        : "Produk Telah dihapus",
      deskripsi: item.nama_produk
        ? decrypt(item.deskripsi)
        : "Produk Telah Dihapus",
    }));

    return decryptRows[0];
  }

  static async getAllInvoices() {
    const query =
      "SELECT * FROM `invoices` LEFT JOIN produk ON invoices.product_id = produk.id_produk ORDER BY invoices.created_at DESC";
    const [rows] = await pool.query(query);

    return rows.map((item) => ({
      ...item,
      nama_produk: item.nama_produk
        ? decrypt(item.nama_produk)
        : "Produk Telah dihapus",
      deskripsi: item.nama_produk
        ? decrypt(item.deskripsi)
        : "Produk Telah Dihapus",
    }));
  }

  static async getStatusInvoice(status) {
    const query = `SELECT invoices.*, produk.nama_produk, produk.jenis, produk.harga, produk.negara_asal, produk.deskripsi FROM invoices LEFT JOIN produk ON invoices.product_id = produk.id_produk WHERE status='${status}' ORDER BY invoices.created_at DESC`;

    const [rows] = await pool.query(query);

    return rows.map((item) => ({
      ...item,
      nama_produk: item.nama_produk
        ? decrypt(item.nama_produk)
        : "Produk Telah Dihapus",
      deskripsi: item.deskripsi
        ? decrypt(item.deskripsi)
        : "Produk Telah Dihapus",
    }));
  }
}

module.exports = Invoice;
