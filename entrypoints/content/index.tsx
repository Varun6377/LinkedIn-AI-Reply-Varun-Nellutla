import { defineContentScript } from "wxt/sandbox";
import ReactDOM from "react-dom/client";
import Modal from "../components/Modal";
import "../../assets/style.css";

export default defineContentScript({
  matches: ["*://*.linkedin.com/*"],
  async main() {
    const processedInputs = new Set<HTMLElement>();

    // Finds and setups message input fields
    const findMessageInputs = () => {
      const messageInputs = document.querySelectorAll(
        ".msg-form__contenteditable"
      ) as NodeListOf<HTMLElement>;

      messageInputs.forEach((messageInput) => {
        if (!processedInputs.has(messageInput)) {
          initializeInputListeners(messageInput);
          processedInputs.add(messageInput);
        }
      });
    };

    // Initializes listeners for input fields
    const initializeInputListeners = (inputField: HTMLElement) => {
      if (!inputField) return;

      inputField.addEventListener("focus", () => {
        displayIcon(inputField);
      });

      inputField.addEventListener("blur", () => {
        setTimeout(() => {
          const iconElement = inputField.querySelector("#focus-icon");
          if (iconElement && !iconElement.matches(":hover")) {
            hideIcon(inputField);
          }
        }, 200);
      });
    };

    // Displays the icon in the input field
    const displayIcon = (inputField: HTMLElement) => {
      if (inputField.querySelector("#focus-icon")) return;

      const iconElement = document.createElement("img");
      iconElement.id = "focus-icon";
      iconElement.src = chrome.runtime.getURL("icon/ai-icon.svg");

      // Icon styles
      Object.assign(iconElement.style, {
        position: "absolute",
        bottom: "5px",
        right: "5px",
        pointerEvents: "auto",
        zIndex: "9999",
        cursor: "pointer",
      });

      // Sets up event listeners for icon interactions
      iconElement.addEventListener("mouseover", () => {
        iconElement.style.transform = "scale(1.1)";
        iconElement.style.opacity = "5";
      });

      iconElement.addEventListener("mouseout", () => {
        iconElement.style.transform = "scale(1)";
        iconElement.style.opacity = "1";
      });

      iconElement.addEventListener("click", () => {
        showModal(inputField);
      });

      inputField.appendChild(iconElement);
      inputField.style.position = "relative";
    };

    // Hides the icon
    const hideIcon = (inputField: HTMLElement) => {
      const iconElement = inputField.querySelector("#focus-icon");
      if (iconElement) {
        iconElement.remove();
      }
    };

    // Shows the modal on icon click
    const showModal = (inputField: HTMLElement) => {
      const messageInputContainer = inputField.closest(
        ".msg-form__msg-content-container"
      ) as HTMLElement;

      if (!messageInputContainer) return;

      const modalWidth = messageInputContainer.clientWidth - 30;
      const rect = inputField.getBoundingClientRect();

      const modalContainer = document.createElement("div");
      const modalBottom = window.innerHeight - rect.top + 75;
      const modalLeft = rect.left - 5;

      document.body.appendChild(modalContainer);

      const root = ReactDOM.createRoot(modalContainer);

      const handleClose = () => {
        root.render(null);
        modalContainer.remove();
      };

      root.render(
        <Modal
          onClose={handleClose}
          width={modalWidth}
          bottom={modalBottom}
          left={modalLeft}
          inputField={inputField}
          displayIcon={displayIcon}
        />
      );
    };

    // Monitors DOM changes to find new message inputs
    const observer = new MutationObserver(findMessageInputs);
    observer.observe(document.body, { childList: true, subtree: true });

    findMessageInputs();
  },
});
