import { createFileRoute } from "@tanstack/react-router";
import { readFileSync } from "fs";
import { join } from "path";

export const Route = createFileRoute("/api-docs")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const html = `
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css">
  <title>Full Solution API Docs</title>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function() {
      SwaggerUIBundle({
        url: '/api-swagger.json',
        dom_id: '#swagger-ui',
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
      });
    };
  </script>
</body>
</html>
          `;
          return new Response(html, {
            headers: { "Content-Type": "text/html" },
          });
        } catch (error) {
          return new Response("Error loading API docs", { status: 500 });
        }
      },
    },
  },
});
