import { useState } from "react";

const Modal = ({
  onClose,
  width,
  top,
  left,
  inputField,
  displayIcon,
}: {
  onClose: () => void;
  width: number;
  top: number;
  left: number;
  inputField: HTMLElement;
  displayIcon: (inputField: HTMLElement) => void;
}) => {
  const [command, setCommand] = useState("");
  const [response, setResponse] = useState("");
  const [isGenerated, setIsGenerated] = useState(false);

  const handleGenerate = () => {
    setResponse(
      "Thank you for the opportunity! If you have any more questions or if there's anything else I can help you with, feel free to ask."
    );
    setIsGenerated(true);
  };

  const handleInsert = () => {
    const messageInput = inputField.querySelector("p") as HTMLParagraphElement;
    if (messageInput) {
      messageInput.textContent += `${response}`;

      const event = new Event("input", { bubbles: true });
      messageInput.dispatchEvent(event);
      messageInput.focus();
      displayIcon(inputField);
      onClose();
    }
  };

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const adjustedTop = isGenerated ? top - 60 : top;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-25 z-50"
      onClick={handleBackdropClick}
    >
      <div
        className="shadow-md shadow-gray-400 bg-white p-6 rounded-2xl overflow-hidden"
        style={{
          width: `${width}px`,
          position: "absolute",
          top: `${adjustedTop}px`,
          left: `${left}px`,
        }}
      >
        {isGenerated && (
          <div className="mt-4 mb-4">
            <p className="text-2xl text-gray-500">{response}</p>
          </div>
        )}
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
              className="flex items-center border text-2xl text-gray-600 font-semibold	border-gray-600 border-solid px-5 rounded-lg"
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
