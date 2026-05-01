import { createFileRoute } from "@tanstack/react-router";
import swaggerHtml from "swagger-ui-dist/swagger-ui-bundle.html?url";
import swaggerCss from "swagger-ui-dist/swagger-ui.css?url";

export const Route = createFileRoute("/api-docs")({
  component: ApiDocsPage,
});

function ApiDocsPage() {
  return (
    <div className="min-h-screen">
      <iframe
        srcDoc={`
          <!DOCTYPE html>
          <html>
            <head>
              <link rel="stylesheet" type="text/css" href="${swaggerCss}" />
              <title>Full Solution API Docs</title>
            </head>
            <body>
              <div id="swagger-ui"></div>
              <script src="${swaggerHtml}"></script>
              <script>
                window.onload = function() {
                  SwaggerUIBundle({
                    url: '/api-swagger.json',
                    dom_id: '#swagger-ui',
                  });
                };
              </script>
            </body>
          </html>
        `}
        className="w-full h-screen border-0"
        title="API Documentation"
      />
    </div>
  );
}
