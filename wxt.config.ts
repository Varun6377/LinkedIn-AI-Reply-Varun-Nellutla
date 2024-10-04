import { defineConfig } from "wxt";

export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  manifest: {
    permissions: ["activeTab"],
    action: {
      default_title: "Linkedin AI Reply",
      default_icon: "icon/ai-icon.svg",
    },
    web_accessible_resources: [
      {
        matches: ["*://*.linkedin.com/*"],
        resources: ["icon/*.svg"],
      },
    ],
  },
});
