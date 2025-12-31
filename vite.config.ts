import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        // This will transform your SVG to a React component
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          charts: ["apexcharts", "react-apexcharts"],
          swiper: ["swiper"],
          calendar: [
            "@fullcalendar/core",
            "@fullcalendar/react",
            "@fullcalendar/daygrid",
            "@fullcalendar/timegrid",
            "@fullcalendar/list",
            "@fullcalendar/interaction",
          ],
          vendor: [
            "react",
            "react-dom",
            "react-router",
            "react-helmet-async",
          ],
          ui: [
            "simplebar-react",
            "flatpickr",
            "prismjs",
            "clsx",
          ],
          dnd: [
            "react-dnd",
            "react-dnd-html5-backend",
          ],
        },
      },
    },
    chunkSizeWarningLimit: 1300,
  },
});
