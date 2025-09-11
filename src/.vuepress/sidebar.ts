import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/": [
    "",
    {
      text: "Hyperion",
      icon: "laptop-code",
      prefix: "hyperion/",
      link: "hyperion/",
      children: "structure",
    },
  ],
});
