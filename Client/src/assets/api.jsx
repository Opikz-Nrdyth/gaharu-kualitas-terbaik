const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw {
      message: data.message || "An error occurred",
      status: response.status,
    };
  }
  return {
    status: data.status || "success",
    message: data.message || "Operation successful",
    data,
  };
};

export const fetchData = async (path, id = "") => {
  let langHeader = {
    langCode: "id",
    currencyCode: "IDR",
  };
  const langLocalStorage = localStorage.lang;
  if (langLocalStorage) {
    langHeader = JSON.parse(langLocalStorage);
  }

  const url = `${import.meta.env.VITE_BASEURL}${path}${id ? `/${id}` : ""}`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        lang: langHeader?.langCode,
        currencyCode: langHeader?.currencyCode,
      },
    });
    return await handleResponse(response);
  } catch (error) {
    return { error: true, message: error.message || "Failed to fetch data" };
  }
};

export const postData = async (path, formData) => {
  try {
    let headers = {};
    let body = formData;

    if (!(formData instanceof FormData)) {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(formData);
    }

    const response = await fetch(`${import.meta.env.VITE_BASEURL}${path}`, {
      method: "POST",
      headers,
      body,
    });

    return await handleResponse(response);
  } catch (error) {
    return { status: "error", message: error.message || "Failed to post data" };
  }
};

export const editData = async (path, formData, id_data) => {
  try {
    let headers = {};
    let body = formData;

    if (!(formData instanceof FormData)) {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(formData);
    }

    let url = `${import.meta.env.VITE_BASEURL}${path}`;
    if (id_data && id_data != "") {
      url = `${import.meta.env.VITE_BASEURL}${path}/${id_data}`;
    }

    const response = await fetch(url, {
      method: "PUT",
      headers,
      body,
    });

    return await handleResponse(response);
  } catch (error) {
    return { error: true, message: error.message || `Failed to edit ${path}` };
  }
};

export const deleteData = async (path, id) => {
  try {
    let url = `${import.meta.env.VITE_BASEURL}${path}`;
    if (id && id != "") {
      url = `${import.meta.env.VITE_BASEURL}${path}/${id}`;
    }
    const response = await fetch(url, {
      method: "DELETE",
    });

    return await handleResponse(response);
  } catch (error) {
    return {
      error: true,
      message: error.message || `Failed to delete ${path}`,
    };
  }
};
