import { useEffect, useState } from "react";
// Editor
import "froala-editor/js/froala_editor.pkgd.min.js";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/js/plugins/colors.min.js";
import "froala-editor/js/plugins/draggable.min.js";
import "froala-editor/js/plugins/font_family.min.js";
import "froala-editor/js/plugins/font_size.min.js";
import "froala-editor/js/plugins/word_paste.min.js";
import "froala-editor/js/plugins/lists.min.js";
import "froala-editor/js/plugins/special_characters.min.js";
import "froala-editor/js/plugins/emoticons.min.js";
import "froala-editor/js/plugins/entities.min.js";
import "froala-editor/js/plugins/quote.min.js";
import "froala-editor/js/plugins/align.min.js";

import FroalaEditorComponent from "react-froala-wysiwyg";
import { fetchData, postData } from "../src/assets/api";
import SwalFireContent from "../src/assets/SwalFire";
import { useSearchParams } from "react-router-dom";

const InputProduct = ({ advanceSettings }) => {
  const [images, setImages] = useState([]);
  const [formInput, setFormInput] = useState({
    nama_produk: "",
    harga: "",
    deskripsi: "",
    jenis: "",
    negara_asal: "",
    stok: "",
    link_catalog: "",
  });

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
      file: file,
    }));
    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevInput) => ({
      ...prevInput,
      [name]: value,
    }));
  };

  const handleDeskripsiChange = (content) => {
    setFormInput((prevInput) => ({
      ...prevInput,
      deskripsi: content,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // Append form fields to formData
    Object.keys(formInput).forEach((key) => {
      formData.append(key, formInput[key]);
    });

    // Append images to formData
    images.forEach((image, index) => {
      formData.append(`foto_produk`, image.file);
    });

    const result = await postData("api/products", formData);
    SwalFireContent(
      result.status,
      result.message,
      result.status,
      advanceSettings
    );
  };

  useEffect(() => {
    const lisences = document.querySelector(
      '[style="z-index:9999;width:100%;position:relative"]'
    );

    const powered = document.querySelector(
      '[href="https://froala.com/wysiwyg-editor"]'
    );

    const powered2 = document.querySelector(
      '[title="Froala WYSIWYG HTML Editor"]'
    );

    if (lisences) {
      lisences.remove();
    }

    if (powered) {
      powered.remove();
    }

    if (powered2) {
      powered2.remove();
    }
  });

  return (
    <div className="fade-in">
      <h1
        className="text-3xl md:text-4xl font-bold mb-6"
        style={{ color: advanceSettings.backgroundContent.text }}
      >
        Input Produk Baru
      </h1>
      <form
        className="bg-white p-6 rounded-lg shadow-md"
        onSubmit={handleSubmit}
      >
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-[100%] md:w-[60%] h-64 border-2 border-amber-300 border-dashed rounded-lg cursor-pointer bg-amber-50 hover:bg-amber-100"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-4 text-amber-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className="mb-2 text-sm text-amber-500 ">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-amber-500 ">
                SVG, PNG, JPG or GIF (MAX. 800x400px)
              </p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              multiple
              accept="images/*"
              className="hidden"
              onChange={handleFileChange}
            />

            <div className="flex flex-warp gap-3">
              {images.map((item, index) => (
                <img
                  src={item.url}
                  key={index}
                  alt="produk-1"
                  width="40px"
                  height="40px"
                />
              ))}
            </div>
          </label>
        </div>

        <div className="mb-4">
          <label
            className="block font-bold mb-2"
            htmlFor="nama_produk"
            style={{ color: advanceSettings.backgroundContent.text }}
          >
            Nama Produk
          </label>
          <input
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            id="nama_produk"
            type="text"
            placeholder="Masukkan nama produk"
            name="nama_produk"
            defaultValue={formInput.nama}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-4">
          <label
            className="block font-bold mb-2"
            htmlFor="jenis_kayu"
            style={{ color: advanceSettings.backgroundContent.text }}
          >
            Jenis Kayu
          </label>
          <input
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            id="jenis_kayu"
            type="text"
            placeholder="Masukkan Jenis Kayu"
            name="jenis"
            defaultValue={formInput.jenis}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-4">
          <label
            className="block font-bold mb-2"
            htmlFor="negara"
            style={{ color: advanceSettings.backgroundContent.text }}
          >
            Negara
          </label>
          <input
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            id="negara"
            type="text"
            placeholder="Masukkan Asal Kayu"
            name="negara_asal"
            defaultValue={formInput.negara}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-4">
          <label
            className="block font-bold mb-2"
            htmlFor="harga"
            style={{ color: advanceSettings.backgroundContent.text }}
          >
            Harga (Rp)
          </label>
          <input
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            id="harga"
            type="number"
            placeholder="Masukkan harga"
            name="harga"
            defaultValue={formInput.harga}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-4">
          <label
            className="block font-bold mb-2"
            htmlFor="stok"
            style={{ color: advanceSettings.backgroundContent.text }}
          >
            Stok
          </label>
          <input
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            id="stok"
            type="number"
            placeholder="Masukkan jumlah stok"
            name="stok"
            defaultValue={formInput.stok}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-4">
          <label
            className="block font-bold mb-2"
            htmlFor="deskripsi"
            style={{ color: advanceSettings.backgroundContent.text }}
          >
            Deskripsi
          </label>
          <FroalaEditorComponent
            config={{
              placeholderText: "Tuliskan Deskripsi disini",
              charCounterCount: true,
              toolbarVisibleWithoutSelection: true,
            }}
            tag="textarea"
            model={formInput.deskripsi}
            onModelChange={handleDeskripsiChange}
          />
        </div>

        <div className="mb-4">
          <label
            className="block font-bold mb-2"
            htmlFor="link_catalog"
            style={{ color: advanceSettings.backgroundContent.text }}
          >
            Link Katalog
          </label>
          <input
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            id="link_catalog"
            type="text"
            placeholder="Masukkan Link Katalog Whatsapp Businnes"
            name="link_catalog"
            defaultValue={formInput.link_catalog}
            onChange={handleInputChange}
          />
        </div>
        <button
          style={{
            backgroundColor: advanceSettings.aksenButton.background,
            color: advanceSettings.aksenButton.text,
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor =
              advanceSettings.aksenButton.hover.background)
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor =
              advanceSettings.aksenButton.background)
          }
          className="font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200"
          type="submit"
        >
          Simpan Produk
        </button>
      </form>
    </div>
  );
};

export default InputProduct;
