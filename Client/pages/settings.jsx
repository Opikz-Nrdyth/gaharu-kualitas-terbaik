import React, { useEffect, useState } from "react";
import { editData, fetchData, postData } from "../src/assets/api";
import SwalFireContent from "../src/assets/SwalFire";
import Loader from "../components/loading";

const Settings = ({ advanceSettings, updateSettings }) => {
  const [showAdvance, setShowAdvance] = useState(false);
  const [loadData, setLoadData] = useState(true);
  const [formInput, setFormInput] = useState({
    foto_company: [],
    nama_company: "",
    nama_pemilik: "",
    alamat: "",
    intregrate_pembayaran: [],
    intregrate_pengiriman: [],
    nomer_whatsapp_bisnis: "",
    link_grup: "",
    akun_sosmed_lainnya: {
      instagram: "",
      facebook: "",
      twitter: "",
    },
    fake_invoice: false,
    username_admin: "",
    password_admin: "",
    slide_shows: [],
    avcance_settings: {
      header: {
        background: "#ffffff",
        text: "#000000",
        backgroundImages: "",
        opacity: "",
      },
      backgroundContent: {
        background: "#ffffff",
        text: "#000000",
      },
      primaryButton: {
        background: "#000000",
        text: "#ffffff",
        hover: {
          background: "#333333",
          text: "#ffffff",
        },
      },
      secondaryButton: {
        background: "#cccccc",
        text: "#000000",
        hover: {
          background: "#dddddd",
          text: "#000000",
        },
      },
      cardProduct: {
        background: "#ffffff",
        text: "#000000",
      },
      aksenButton: {
        background: "#000000",
        text: "#ffffff",
        hover: {
          background: "#333333",
          text: "#ffffff",
        },
      },
      deniedButton: {
        background: "#ff0000",
        text: "#ffffff",
        hover: {
          background: "#cc0000",
          text: "#ffffff",
        },
      },
      primaryColor: {
        background: "#000000",
        text: "#ffffff",
      },
      secondaryColor: {
        background: "#cccccc",
        text: "#000000",
      },
      inputColor: {
        background: "#ffffff",
        text: "#000000",
      },
      text: {
        primary: "#78350f",
        secondary: "#78350f",
      },
    },
  });

  const [tempInput, setTempInput] = useState({
    intregrate_pembayaran: { logo: "", nama: "" },
    intregrate_pengiriman: { logo: "", nama: "" },
  });

  const handleFileChange = (e, field) => {
    const files = e.target.files; // Ambil FileList dari input

    // Konversi FileList menjadi array
    const filesArray = Array.from(files);

    filesArray.map((file) => {
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormInput((prev) => ({
            ...prev,
            [field]: [...prev[field], { url: reader.result, file }], // Simpan url dan file
          }));
        };
        reader.readAsDataURL(file); // Baca file sebagai Data URL
      }
    });
  };

  // Untuk input statis
  const handleStaticInputChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Untuk input dinamis (integrasi pembayaran dan pengiriman)
  const handleDynamicInputChange = (e, field) => {
    const { name, value } = e.target;
    setTempInput((prev) => ({
      ...prev,
      [field]: { ...prev[field], [name]: value },
    }));
  };

  const handleInputArrayChange = (e, field) => {
    const { name, value } = e.target;
    setFormInput((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [name]: value,
      },
    }));
  };

  const handleInputAdvance = (e, section, key, subKey = null) => {
    const { name, value } = e.target;
    setFormInput((prev) => ({
      ...prev,
      avcance_settings: {
        ...prev.avcance_settings,
        [section]: {
          ...prev.avcance_settings[section],
          [key]: subKey
            ? {
                ...prev.avcance_settings[section][key],
                [subKey]: {
                  ...prev.avcance_settings[section][key][subKey],
                  [name]: value,
                },
              }
            : value,
        },
      },
    }));
  };

  const handleBackgroundImageChange = (e, section) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormInput((prev) => ({
          ...prev,
          avcance_settings: {
            ...prev.avcance_settings,
            [section]: {
              ...prev.avcance_settings[section],
              backgroundImages: reader.result,
            },
          },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddItem = (field) => {
    setFormInput((prev) => ({
      ...prev,
      [field]: [...prev[field], tempInput[field]],
    }));
    setTempInput((prev) => ({
      ...prev,
      [field]: { logo: "", nama: "" },
    }));
  };

  const handleRemoveItem = (field, index) => {
    setFormInput((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const appendNestedObject = (formData, data, parentKey = "") => {
    if (data && typeof data === "object" && !(data instanceof File)) {
      Object.keys(data).forEach((key) => {
        const fullKey = parentKey ? `${parentKey}[${key}]` : key;
        if (data[key] instanceof File) {
          formData.append(fullKey, data[key]);
        } else if (typeof data[key] === "object" && data[key] !== null) {
          appendNestedObject(formData, data[key], fullKey);
        } else {
          formData.append(fullKey, data[key]);
        }
      });
    } else {
      formData.append(parentKey, data);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoadData(true);

    const formData = new FormData();

    // Handle foto_company
    formInput.foto_company.forEach((image, index) => {
      if (image.file) {
        formData.append(`foto_company`, image.file);
      } else if (image.url) {
        formData.append(`foto_company`, image.url);
      } else {
        formData.append(`foto_company`, image);
      }
    });

    // Handle nama_company and alamat
    formData.append("nama_company", formInput.nama_company);
    formData.append("nama_pemilik", formInput.nama_pemilik);
    formData.append("alamat", formInput.alamat);

    // Handle intregrate_pembayaran and intregrate_pengiriman
    ["intregrate_pembayaran", "intregrate_pengiriman"].forEach((key) => {
      formInput[key].forEach((item, index) => {
        formData.append(`${key}[${index}][logo]`, item.logo);
        formData.append(`${key}[${index}][nama]`, item.nama);
      });
    });

    // Handle nomer_whatsapp_bisnis
    formData.append("nomer_whatsapp_bisnis", formInput.nomer_whatsapp_bisnis);
    formData.append("link_grup", formInput.link_grup);

    // Handle akun_sosmed_lainnya
    Object.entries(formInput.akun_sosmed_lainnya).forEach(
      ([platform, value]) => {
        formData.append(`akun_sosmed_lainnya[${platform}]`, value);
      }
    );

    formData.append("fake_invoice", formInput.fake_invoice);

    // Handle username_admin and password_admin
    formData.append("username_admin", formInput.username_admin);
    formData.append("password_admin", formInput.password_admin);

    // Handle avcance_settings
    appendNestedObject(
      formData,
      formInput.avcance_settings,
      "avcance_settings"
    );

    const result = await editData("api/settings", formData);
    if (result) {
      setLoadData(false);
    }
    SwalFireContent(
      result.status,
      result.message,
      result.status,
      advanceSettings.avcance_settings
    );

    const random = Math.floor(Math.random() * (0 - 100 + 1)) + 100;
    updateSettings(random);

    const GetFake = fetchData("api/invoice/fake/invoice");
  };

  const settingDefault = async (action) => {
    const result = await postData(`api/settings/${action}`);
    SwalFireContent(
      result.status,
      result.message,
      result.status,
      advanceSettings
    );
  };

  useEffect(() => {
    setFormInput(advanceSettings);
    if (advanceSettings) {
      setLoadData(false);
    }
  }, [advanceSettings]);

  const removeHeaderBackgroundImage = (formInput) => {
    return {
      ...formInput,
      avcance_settings: {
        ...formInput.avcance_settings,
        header: {
          ...formInput.avcance_settings.header,
          backgroundImages: "",
        },
      },
    };
  };

  return (
    <div className="fade-in md:p-6">
      {loadData ? <Loader /> : null}
      <h1
        className="text-3xl md:text-4xl font-bold mb-6"
        style={{
          color: advanceSettings.avcance_settings.backgroundContent.text,
        }}
      >
        Pengaturan
      </h1>
      <form
        className="bg-white p-6 rounded-lg shadow-md"
        onSubmit={handleSubmit}
      >
        <h2
          className="text-2xl font-semibold mb-4"
          style={{
            color: advanceSettings.avcance_settings.backgroundContent.text,
          }}
        >
          Pengaturan Umum
        </h2>

        {/* Company Logo */}
        <div className="mb-4">
          <label
            className="block font-bold mb-2 "
            style={{
              color: advanceSettings.avcance_settings.backgroundContent.text,
            }}
          >
            Logo Perusahaan
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "foto_company")}
            className="mb-2"
          />
          <div className="flex flex-wrap gap-2 mt-2 ">
            {formInput.foto_company.map((img, index) => (
              <div
                key={index}
                className="relative w-fit p-1"
                style={{
                  backgroundColor:
                    advanceSettings?.avcance_settings?.secondaryColor
                      ?.background,
                }}
              >
                <img
                  src={img.url || img}
                  alt={`Company Logo ${index + 1}`}
                  className="w-20 h-20 object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveItem("foto_company", index)}
                  className="absolute top-0 right-0  rounded-full w-5 h-5 flex items-center justify-center"
                  style={{
                    color: advanceSettings.avcance_settings.deniedButton.text,
                    backgroundColor:
                      advanceSettings.avcance_settings.deniedButton.background,
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Company Name */}
        <div className="mb-4">
          <label
            className="block font-bold mb-2"
            style={{
              color: advanceSettings.avcance_settings.backgroundContent.text,
            }}
            htmlFor="nama_company"
          >
            Nama Perusahaan
          </label>
          <input
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            id="nama_company"
            name="nama_company"
            type="text"
            value={formInput.nama_company}
            onChange={handleStaticInputChange}
          />
        </div>

        {/* Nama Pemilik */}
        <div className="mb-4">
          <label
            className="block font-bold mb-2"
            style={{
              color: advanceSettings.avcance_settings.backgroundContent.text,
            }}
            htmlFor="nama_pemilik"
          >
            Nama Pemilik
          </label>
          <input
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            id="nama_pemilik"
            name="nama_pemilik"
            type="text"
            value={formInput.nama_pemilik}
            onChange={handleStaticInputChange}
          />
        </div>

        {/* Address */}
        <div className="mb-4">
          <label
            className="block  font-bold mb-2"
            style={{
              color: advanceSettings.avcance_settings.backgroundContent.text,
            }}
            htmlFor="alamat"
          >
            Alamat
          </label>
          <textarea
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            id="alamat"
            name="alamat"
            rows="3"
            value={formInput.alamat}
            onChange={handleStaticInputChange}
          ></textarea>
        </div>

        {/* Integration Payment */}
        <div className="mb-4">
          <h3
            className="text-lg font-semibold mb-2 "
            style={{
              color: advanceSettings.avcance_settings.backgroundContent.text,
            }}
          >
            Integrasi Pembayaran
          </h3>
          <div className="flex flex-wrap gap-2 mb-2">
            {formInput?.intregrate_pembayaran.length > 0
              ? formInput?.intregrate_pembayaran?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center p-2 rounded"
                    style={{
                      color:
                        advanceSettings.avcance_settings.secondaryColor.text,
                      backgroundColor:
                        advanceSettings.avcance_settings.secondaryColor
                          .background,
                    }}
                  >
                    <img
                      src={item.logo}
                      alt={item.nama}
                      className="w-8 h-8 mr-2"
                    />
                    <span>{item.nama}</span>
                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveItem("intregrate_pembayaran", index)
                      }
                      className="ml-2"
                      style={{
                        color:
                          advanceSettings.avcance_settings.deniedButton
                            .background,
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))
              : null}
          </div>
          <div className="flex gap-2 mb-2 flex-wrap">
            <input
              type="text"
              placeholder="URL Logo"
              name="logo"
              className="flex-1 px-3 py-2 border rounded-md"
              onChange={(e) =>
                handleDynamicInputChange(e, "intregrate_pembayaran")
              }
            />
            <input
              type="text"
              placeholder="Nama"
              className="flex-1 px-3 py-2 border rounded-md"
              name="nama"
              onChange={(e) =>
                handleDynamicInputChange(e, "intregrate_pembayaran")
              }
            />
            <button
              type="button"
              onClick={() => handleAddItem("intregrate_pembayaran")}
              className="px-4 py-2 rounded"
              style={{
                color: advanceSettings.avcance_settings.primaryButton.text,
                backgroundColor:
                  advanceSettings.avcance_settings.primaryButton.background,
              }}
            >
              Tambah
            </button>
          </div>
        </div>

        {/* Integration Shipping */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2 text-amber-800">
            Integrasi Pengiriman
          </h3>
          <div className="flex flex-wrap gap-2 mb-2">
            {formInput.intregrate_pengiriman.map((item, index) => (
              <div
                key={index}
                className="flex items-center p-2 rounded"
                style={{
                  color: advanceSettings.avcance_settings.secondaryColor.text,
                  backgroundColor:
                    advanceSettings.avcance_settings.secondaryColor.background,
                }}
              >
                <img src={item.logo} alt={item.nama} className="w-8 h-8 mr-2" />
                <span>{item.nama}</span>
                <button
                  type="button"
                  onClick={() =>
                    handleRemoveItem("intregrate_pengiriman", index)
                  }
                  className="ml-2 "
                  style={{
                    color:
                      advanceSettings.avcance_settings.deniedButton.background,
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mb-2 flex-wrap">
            <input
              type="text"
              placeholder="URL Logo"
              className="flex-1 px-3 py-2 border rounded-md"
              name="logo"
              onChange={(e) =>
                handleDynamicInputChange(e, "intregrate_pengiriman")
              }
            />
            <input
              type="text"
              placeholder="Nama"
              className="flex-1 px-3 py-2 border rounded-md"
              name="nama"
              onChange={(e) =>
                handleDynamicInputChange(e, "intregrate_pengiriman")
              }
            />
            <button
              type="button"
              onClick={() => handleAddItem("intregrate_pengiriman")}
              className="px-4 py-2 rounded"
              style={{
                color: advanceSettings.avcance_settings.primaryButton.text,
                backgroundColor:
                  advanceSettings.avcance_settings.primaryButton.background,
              }}
            >
              Tambah
            </button>
          </div>
        </div>

        {/* WhatsApp Business Number */}
        <div className="mb-4">
          <label
            className="block font-bold mb-2"
            htmlFor="nomer_whatsapp_bisnis"
            style={{
              color: advanceSettings.avcance_settings.backgroundContent.text,
            }}
          >
            Nomor WhatsApp Bisnis
          </label>
          <input
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            id="nomer_whatsapp_bisnis"
            name="nomer_whatsapp_bisnis"
            type="tel"
            value={formInput.nomer_whatsapp_bisnis}
            onChange={handleStaticInputChange}
          />
        </div>

        {/* Link Grup Bisnis */}
        <div className="mb-4">
          <label
            className="block font-bold mb-2"
            htmlFor="link_grup"
            style={{
              color: advanceSettings.avcance_settings.backgroundContent.text,
            }}
          >
            Link Grup Bisnis
          </label>
          <input
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            id="link_grup"
            name="link_grup"
            type="tel"
            value={formInput.link_grup}
            onChange={handleStaticInputChange}
          />
        </div>

        {/* Social Media Accounts */}
        <div className="mb-4">
          <h3
            className="text-lg font-semibold mb-2 "
            style={{
              color: advanceSettings.avcance_settings.backgroundContent.text,
            }}
          >
            Akun Media Sosial
          </h3>
          {Object.entries(formInput.akun_sosmed_lainnya).map(
            ([platform, value]) => (
              <div key={platform} className="mb-2">
                <label
                  className="block  font-bold mb-1"
                  style={{
                    color:
                      advanceSettings.avcance_settings.backgroundContent.text,
                  }}
                  htmlFor={platform}
                >
                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </label>
                <input
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  id={platform}
                  name={platform}
                  type="text"
                  value={value}
                  onChange={(e) =>
                    handleInputArrayChange(e, "akun_sosmed_lainnya")
                  }
                />
              </div>
            )
          )}
        </div>

        {/* Pesanan Palsu */}
        <div>
          <input
            id="fake_invoice"
            name="fake_invoice"
            type="checkbox"
            checked={formInput.fake_invoice}
            value={formInput.fake_invoice}
            onChange={() => {
              setFormInput((prevState) => ({
                ...prevState,
                fake_invoice: !prevState.fake_invoice,
              }));
            }}
            className=" text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
          />
          <label
            className=" ms-2 font-bold mb-1"
            style={{
              color: advanceSettings.avcance_settings.backgroundContent.text,
            }}
            htmlFor="fake_invoice"
          >
            Pesanan Palsu
          </label>
        </div>

        {/* Admin Credentials */}
        <div className="mb-4">
          <h3
            className="text-lg font-semibold mb-2 "
            style={{
              color: advanceSettings.avcance_settings.backgroundContent.text,
            }}
          >
            Kredensial Admin
          </h3>
          <div className="mb-2">
            <label
              className="block  font-bold mb-1"
              style={{
                color: advanceSettings.avcance_settings.backgroundContent.text,
              }}
              htmlFor="username_admin"
            >
              Username Admin
            </label>
            <input
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              id="username_admin"
              name="username_admin"
              type="text"
              value={formInput.username_admin}
              onChange={handleStaticInputChange}
            />
          </div>
          <div>
            <label
              className="block font-bold mb-1"
              style={{
                color: advanceSettings.avcance_settings.backgroundContent.text,
              }}
              htmlFor="password_admin"
            >
              Password Admin
            </label>
            <input
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              id="password_admin"
              name="password_admin"
              type="password"
              value={formInput.password_admin}
              onChange={handleStaticInputChange}
            />
          </div>
        </div>

        {/* Advanced Settings */}
        <div className="mb-4">
          <h3
            className="text-xl font-semibold mb-2 flex align-middle gap-3 w-fit cursor-pointer"
            style={{
              color: advanceSettings.avcance_settings.backgroundContent.text,
            }}
            onClick={() => {
              setShowAdvance(!showAdvance);
            }}
          >
            <div>Pengaturan Lanjutan</div>{" "}
            <i className="fa-solid fa-sort-down"></i>
          </h3>
          {showAdvance ? (
            <div>
              {Object.entries(formInput.avcance_settings).map(
                ([section, values]) => (
                  <div key={section} className="mb-4">
                    <h4
                      className="text-lg font-semibold mb-2 "
                      style={{
                        color:
                          advanceSettings.avcance_settings.backgroundContent
                            .text,
                      }}
                    >
                      {section.replace(/_/g, " ").charAt(0).toUpperCase() +
                        section.replace(/_/g, " ").slice(1)}
                    </h4>
                    {Object.entries(values).map(([key, value]) => {
                      if (typeof value === "object") {
                        return (
                          <div key={key} className="ml-4 mb-2">
                            <h5
                              className="text-md font-semibold mb-1 "
                              style={{
                                color:
                                  advanceSettings.avcance_settings
                                    .backgroundContent.text,
                              }}
                            >
                              {key.charAt(0).toUpperCase() + key.slice(1)}
                            </h5>
                            {Object.entries(value).map(([subKey, subValue]) => (
                              <div
                                key={subKey}
                                className="flex items-center mb-1"
                              >
                                <label
                                  className="w-1/3 "
                                  style={{
                                    color:
                                      advanceSettings.avcance_settings
                                        .backgroundContent.text,
                                  }}
                                >
                                  {subKey.charAt(0).toUpperCase() +
                                    subKey.slice(1)}
                                  :
                                </label>
                                <input
                                  type="color"
                                  name={subKey}
                                  value={subValue}
                                  onChange={(e) =>
                                    handleInputAdvance(e, section, key, subKey)
                                  }
                                  className="w-16 h-8"
                                />
                              </div>
                            ))}
                          </div>
                        );
                      } else if (key === "backgroundImages") {
                        return (
                          <div key={key} className="ml-4 mb-2">
                            <label
                              className="block  font-bold mb-1"
                              style={{
                                color:
                                  advanceSettings.avcance_settings
                                    .backgroundContent.text,
                              }}
                            >
                              Background Image:
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handleBackgroundImageChange(e, section)
                              }
                              className="mb-2"
                            />
                            {formInput.avcance_settings[section]
                              .backgroundImages && (
                              <div className="relative w-fit">
                                <img
                                  src={
                                    formInput.avcance_settings[section]
                                      .backgroundImages
                                  }
                                  alt="Background Preview"
                                  className="w-full max-w-xs h-auto mb-2"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    setFormInput(
                                      removeHeaderBackgroundImage(formInput)
                                    )
                                  }
                                  className="ml-2 absolute top-0 right-0 px-2 rounded-full"
                                  style={{
                                    color:
                                      advanceSettings.avcance_settings
                                        .deniedButton.text,
                                    backgroundColor:
                                      advanceSettings.avcance_settings
                                        .deniedButton.background,
                                  }}
                                >
                                  ×
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      } else if (key === "opacity") {
                        return (
                          <div
                            className="relative mb-7
                          "
                          >
                            <label
                              for="default-range"
                              classname={`block mb-2 text-sm font-medium text-[${advanceSettings.avcance_settings.backgroundContent.text}]`}
                            >
                              Opacity Background Color
                            </label>
                            <input
                              id="default-range"
                              type="range"
                              defaultValue="1"
                              step="0.1"
                              min="0"
                              max="1"
                              classname="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none"
                              onBlur={(e) => {
                                document.getElementById(
                                  "valueRange"
                                ).innerText = `Opacity: ${e.target.value}`;

                                let hex =
                                  formInput.avcance_settings.header.background;
                                hex = hex.replace(/^#/, "");

                                const bigint = parseInt(hex, 16);
                                const r = (bigint >> 16) & 255;
                                const g = (bigint >> 8) & 255;
                                const b = bigint & 255;

                                const newValue = `rgba(${r}, ${g}, ${b}, ${e.target.value})`;

                                const rgbaToHex8 = (rgba) => {
                                  const match = rgba.match(
                                    /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/
                                  );
                                  if (!match) return rgba;

                                  const r = parseInt(match[1]);
                                  const g = parseInt(match[2]);
                                  const b = parseInt(match[3]);
                                  const a = match[4]
                                    ? Math.round(parseFloat(match[4]) * 255)
                                    : 255;

                                  return (
                                    "#" +
                                    [r, g, b, a]
                                      .map((x) =>
                                        x.toString(16).padStart(2, "0")
                                      )
                                      .join("")
                                  );
                                };
                                setFormInput({
                                  ...formInput,
                                  avcance_settings: {
                                    ...formInput.avcance_settings,
                                    header: {
                                      ...formInput.avcance_settings.header,
                                      background: rgbaToHex8(newValue),
                                      opacity: e.target.value,
                                    },
                                  },
                                });
                              }}
                            />
                            <span
                              classname="text-sm text-gray-500 dark:text-gray-400 absolute start-0 -bottom-6"
                              id="valueRange"
                            >
                              Opacity:{" "}
                              {advanceSettings.avcance_settings.header.opacity}
                            </span>
                          </div>
                        );
                      } else {
                        return (
                          <div
                            key={key}
                            className="ml-4 mb-2 flex items-center"
                          >
                            <label className="w-1/3 text-amber-800">
                              {key.charAt(0).toUpperCase() + key.slice(1)}:
                            </label>
                            <input
                              type="color"
                              name={key}
                              value={value.substring(0, 7)}
                              onChange={(e) =>
                                handleInputAdvance(e, section, key)
                              }
                              className="w-16 h-8"
                            />
                          </div>
                        );
                      }
                    })}
                  </div>
                )
              )}
              <div className="flex gap-3">
                <button
                  className="py-1 px-2 rounded-md"
                  type="button"
                  style={{
                    backgroundColor:
                      advanceSettings.avcance_settings.deniedButton.background,
                    color: advanceSettings.avcance_settings.deniedButton.text,
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor =
                      advanceSettings.avcance_settings.deniedButton.hover.background;
                    e.currentTarget.style.color =
                      advanceSettings.avcance_settings.deniedButton.hover.text;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      advanceSettings.avcance_settings.deniedButton.background;
                    e.currentTarget.style.color =
                      advanceSettings.avcance_settings.deniedButton.text;
                  }}
                  onClick={() => {
                    settingDefault("reset");
                  }}
                >
                  Reset Settings
                </button>
                <button
                  className="py-1 px-2 rounded-md"
                  type="button"
                  style={{
                    backgroundColor:
                      advanceSettings.avcance_settings.aksenButton.background,
                    color: advanceSettings.avcance_settings.aksenButton.text,
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor =
                      advanceSettings.avcance_settings.aksenButton.hover.background;
                    e.currentTarget.style.color =
                      advanceSettings.avcance_settings.aksenButton.hover.text;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      advanceSettings.avcance_settings.aksenButton.background;
                    e.currentTarget.style.color =
                      advanceSettings.avcance_settings.aksenButton.text;
                  }}
                  onClick={() => {
                    settingDefault("setDefault");
                  }}
                >
                  Set Default Settings
                </button>
                <button
                  className="py-1 px-2 rounded-md"
                  type="button"
                  style={{
                    backgroundColor:
                      advanceSettings.avcance_settings.aksenButton.background,
                    color: advanceSettings.avcance_settings.aksenButton.text,
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor =
                      advanceSettings.avcance_settings.aksenButton.hover.background;
                    e.currentTarget.style.color =
                      advanceSettings.avcance_settings.aksenButton.hover.text;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      advanceSettings.avcance_settings.aksenButton.background;
                    e.currentTarget.style.color =
                      advanceSettings.avcance_settings.aksenButton.text;
                  }}
                  onClick={() => {
                    window.open("/documentasi.pdf", "_blank");
                  }}
                >
                  Download Dokumentasi
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <button
          className=" font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200"
          style={{
            color: advanceSettings.avcance_settings.primaryButton.text,
            backgroundColor:
              advanceSettings.avcance_settings.primaryButton.background,
          }}
          type="submit"
        >
          Simpan Pengaturan
        </button>
      </form>
    </div>
  );
};

export default Settings;
