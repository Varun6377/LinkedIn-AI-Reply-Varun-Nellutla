import { useState, useCallback, useEffect, useRef } from "react";

interface ModalProps {
  onClose: () => void;
  width: number;
  bottom: number;
  left: number;
  inputField: HTMLElement;
  displayIcon: (inputField: HTMLElement) => void;
}

const Modal: React.FC<ModalProps> = ({
  onClose,
  width,
  bottom,
  left,
  inputField,
  displayIcon,
}) => {
  const [command, setCommand] = useState("");
  const [response, setResponse] = useState("");
  const [isGenerated, setIsGenerated] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const modalContentRef = useRef<HTMLDivElement>(null);

  // Handles the generation of the response
  const handleGenerate = useCallback(() => {
    if (!command.trim()) {
      alert("Please enter a prompt before generating.");
      return;
    }
    setResponse(
      "Thank you for the opportunity! If you have any more questions or if there's anything else I can help you with, feel free to ask."
    );
    setIsGenerated(true);
  }, [command]);

  // Handles inserting the generated response into the input field
  const handleInsert = useCallback(() => {
    const messageInput = inputField.querySelector("p") as HTMLParagraphElement;
    if (messageInput) {
      messageInput.textContent += `${response}`;
      const event = new Event("input", { bubbles: true });
      messageInput.dispatchEvent(event);
      messageInput.focus();
      displayIcon(inputField);
      handleCloseModal();
    }
  }, [inputField, response, displayIcon]);

  // Smoothly closes the modal
  const handleCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 300);
  };

  // Handles clicks on the modal backdrop/outside the modal
  const handleBackdropClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) {
        handleCloseModal();
      }
    },
    []
  );

  // Triggers modal visibility after mounting
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-25 z-50 ${
        isVisible ? "opacity-100" : "opacity-0"
      } transition-opacity duration-300 ease-out`}
      onClick={handleBackdropClick}
    >
      <div
        className={`shadow-md shadow-gray-400 bg-white p-6 rounded-2xl overflow-hidden transform ${
          isVisible && !isClosing
            ? "scale-100 opacity-100"
            : "scale-95 opacity-0"
        } transition-all duration-300 ${isClosing ? "ease-in" : "ease-out"}`}
        style={{
          width: `${width}px`,
          position: "absolute",
          bottom: `${bottom}px`,
          left: `${left}px`,
        }}
      >
        <div
          ref={modalContentRef}
          style={{
            maxHeight: isGenerated ? "100px" : "0px",
            overflow: "hidden",
            transition: "max-height 0.3s ease",
          }}
        >
          {isGenerated && (
            <div className="mt-4 mb-4">
              <p className="text-2xl text-gray-500">{response}</p>
            </div>
          )}
        </div>
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="Your prompt"
          style={{
            outline: "none",
            boxShadow: "none",
            border: "2px solid #d1d5db",
            fontSize: "14px",
          }}
        />
        <div className="flex justify-end mt-2 space-x-8">
          {isGenerated && (
            <button
              onClick={handleInsert}
              className="flex items-center border text-2xl text-gray-600 font-semibold border-gray-600 border-solid px-5 rounded-lg"
            >
              <img
                src={chrome.runtime.getURL("icon/insert.svg")}
                alt="insert"
                className="w-5 h-5 mr-2"
              />
              Insert
            </button>
          )}
          <button
            onClick={handleGenerate}
            className="flex items-center bg-blue-500 text-2xl text-white py-2 px-5 rounded-lg"
          >
            <img
              src={chrome.runtime.getURL(
                isGenerated ? "icon/regenerate.svg" : "icon/generate.svg"
              )}
              alt="generate"
              className="bg-blue-500 w-6 h-6 mr-2"
            />
            {isGenerated ? "Regenerate" : "Generate"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
