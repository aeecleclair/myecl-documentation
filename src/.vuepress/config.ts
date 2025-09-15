import { defineUserConfig } from "vuepress";

import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  lang: "fr-FR",
  title: "MyECL - ÉCLAIR",
  description: "La doc de MyECL...",

  head: [
    [
      "script",
      {
        defer: true,
        "data-domain": "docs.myecl.fr",
        src: "https://plausible.eclair.ec-lyon.fr/js/script.outbound-links.js",
      },
    ],
    ["link", { rel: "preconnect", href: "https://fonts.googleapis.com" }],
    ["link", { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" }],
    [
      "link",
      {
        href: "https://fonts.googleapis.com/css2?family=Cascadia+Code:ital,wght@0,200..700;1,200..700&display=swap",
        rel: "stylesheet",
      },
    ],
  ],

  theme,

  // Enable it with pwa
  // shouldPrefetch: false,
});
