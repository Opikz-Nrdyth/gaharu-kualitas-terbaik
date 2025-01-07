import Swal from "sweetalert2";

const SwalFireContent = (statusText, message, title, AnvanceSettings) => {
  const advancedSettings = AnvanceSettings.avcance_settings || AnvanceSettings;

  Swal.fire({
    title: title,
    text: message,
    icon: statusText,
    confirmButtonColor: advancedSettings.aksenButton.background || "#d97706",
    cancelButtonColor: advancedSettings.deniedButton.background || "#d93406",
    background: advancedSettings.backgroundContent || "#fffbeb",
    color: advancedSettings.text?.primary || "#78350f",
  });
};

export default SwalFireContent;
