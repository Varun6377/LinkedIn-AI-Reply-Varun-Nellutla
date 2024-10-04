import { defineContentScript } from "wxt/sandbox";
import ReactDOM from "react-dom/client";
import Modal from "../components/Modal";
import "../../assets/style.css";

export default defineContentScript({
  matches: ["*://*.linkedin.com/*"],
  async main() {
    const processedInputs = new Set<HTMLElement>();

    const findMessageInputs = () => {
      const messageInputs = document.querySelectorAll(
        ".msg-form__contenteditable"
      ) as NodeListOf<HTMLElement>;

      messageInputs.forEach((messageInput) => {
        if (!processedInputs.has(messageInput)) {
          setupInputFieldListeners(messageInput);
          processedInputs.add(messageInput);
        }
      });
    };

    const setupInputFieldListeners = (inputField: HTMLElement) => {
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

    const displayIcon = (inputField: HTMLElement) => {
      if (inputField.querySelector("#focus-icon")) return;

      const iconElement = document.createElement("img");
      iconElement.id = "focus-icon";
      iconElement.src = chrome.runtime.getURL("icon/ai-icon.svg");

      iconElement.style.position = "absolute";
      iconElement.style.bottom = "5px";
      iconElement.style.right = "5px";
      iconElement.style.pointerEvents = "auto";
      iconElement.style.zIndex = "9999";
      iconElement.style.cursor = "pointer";

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

    const hideIcon = (inputField: HTMLElement) => {
      const iconElement = inputField.querySelector("#focus-icon");
      if (iconElement) {
        iconElement.remove();
      }
    };

    const showModal = (inputField: HTMLElement) => {
      const messageInputContainer = inputField.closest(
        ".msg-form__msg-content-container"
      ) as HTMLElement;

      if (!messageInputContainer) return;

      const modalWidth = messageInputContainer.clientWidth - 30;
      const rect = inputField.getBoundingClientRect();

      const modalContainer = document.createElement("div");

      const modalTop = rect.top - 180;
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
          top={modalTop}
          left={modalLeft}
          inputField={inputField}
          displayIcon={displayIcon}
        />
      );
    };

    const observer = new MutationObserver(() => {
      findMessageInputs();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    findMessageInputs();
  },
});
