import React, { useState, useEffect, useRef } from "react";
import "../src/assets/stylesheet/notification.css";

const PopupNotification = ({ messages, advanceSettings, setMessage }) => {
  const [currentMessage, setCurrentMessage] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [queueCount, setQueueCount] = useState(0);
  const audioRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (messages.length > 0 && !currentMessage) {
      showNextMessage();
    }
    setQueueCount(Math.max(0, messages.length - (currentMessage ? 1 : 0)));
  }, [messages, currentMessage]);

  const showNextMessage = () => {
    if (messages.length > 0) {
      const nextMessage = messages[0];
      setCurrentMessage(nextMessage);
      setIsVisible(true);

      // Play audio when the message is shown
      if (audioRef.current) {
        audioRef.current
          .play()
          .catch((e) => console.error("Error playing audio:", e));
      }

      timeoutRef.current = setTimeout(() => {
        hideNotification();
      }, 3000); // Auto-hide after 3 seconds
    }
  };

  const hideNotification = () => {
    setIsVisible(false);

    // Stop the audio when the message is closed
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0; // Reset to the beginning
    }

    setTimeout(() => {
      setCurrentMessage(null);
      setMessage((prevMessages) => prevMessages.slice(1));
    }, 300); // Delay for animation
  };

  if (!currentMessage) return null;

  console.log(queueCount);

  return (
    <div
      className={`popup border-2 border-black ${isVisible ? "show" : ""}`}
      style={{
        backgroundColor: advanceSettings?.popupColor.background,
        color: advanceSettings?.popupColor.text,
      }}
    >
      <audio ref={audioRef} src="/Sound/notif.wav" />
      <button
        className="close-btn"
        onClick={hideNotification}
        style={{
          color: advanceSettings?.deniedButton.background,
        }}
      >
        &times;
      </button>
      <div className="popup-header">{currentMessage.header}</div>
      <div
        className="popup-content"
        dangerouslySetInnerHTML={{ __html: currentMessage.message }}
      ></div>
    </div>
  );
};

export default PopupNotification;
