const { pool } = require("../config/database");
const { encrypt, decrypt } = require("../config/security");
const crypto = require("crypto");
const Popularity = require("./Popularity");

class Product {
  static async create(product) {
    const id = crypto.randomInt(100000, 999999);

    const encryptedProduct = {
      ...product,
      nama_produk: encrypt(product.nama_produk),
      deskripsi: encrypt(product.deskripsi),
      foto_produk: JSON.stringify(product.foto_produk), // Store full URLs as JSON string
      id_produk: id,
    };

    const [result] = await pool.query(
      "INSERT INTO produk SET ?",
      encryptedProduct
    );

    return encryptedProduct.id_produk;
  }

  static async findById(id) {
    const [rows] = await pool.query(
      "SELECT * FROM produk WHERE id_produk = ?",
      [id]
    );
    if (rows.length === 0) return null;

    const product = rows[0];
    await Popularity.updateClickCount(id, product.nama_produk);
    return {
      ...product,
      nama_produk: decrypt(product.nama_produk),
      deskripsi: decrypt(product.deskripsi),
      foto_produk: JSON.parse(product.foto_produk), // Parse JSON string to array of URLs
    };
  }

  static async findByQuery(query) {
    // Ambil semua data dari database
    const [rows] = await pool.query("SELECT * FROM produk");

    // Decrypt dan parse data
    const data = rows.map((product) => ({
      ...product,
      nama_produk: decrypt(product.nama_produk),
      deskripsi: decrypt(product.deskripsi),
      foto_produk: JSON.parse(product.foto_produk),
    }));

    // Pisahkan query menjadi kata-kata individual
    const searchTerms = query.toLowerCase().split(" ");

    // Filter data berdasarkan setiap kata pencarian
    return data.filter((product) => {
      return searchTerms.some(
        (term) =>
          product.nama_produk.toLowerCase().includes(term) ||
          product.jenis.toLowerCase().includes(term) ||
          product.negara_asal.toLowerCase().includes(term)
      );
    });
  }

  static async update(id, product) {
    const encryptedProduct = {
      ...product,
      nama_produk: encrypt(product.nama_produk),
      deskripsi: encrypt(product.deskripsi),
      foto_produk: JSON.stringify(product.foto_produk), // Store full URLs as JSON string
    };

    await pool.query("UPDATE produk SET ? WHERE id_produk = ?", [
      encryptedProduct,
      id,
    ]);
  }

  static async delete(id) {
    const deletePopularity = await pool.query(
      "DELETE FROM `popularity` WHERE id_produk=?",
      [id]
    );
    if (deletePopularity) {
      await pool.query("DELETE FROM produk WHERE id_produk = ?", [id]);
    }
  }

  static async findAll() {
    const [rows] = await pool.query("SELECT * FROM produk");
    return rows.map((product) => ({
      ...product,
      nama_produk: decrypt(product.nama_produk),
      deskripsi: decrypt(product.deskripsi),
      foto_produk: JSON.parse(product.foto_produk), // Parse JSON string to array of URLs
    }));
  }
}

module.exports = Product;
