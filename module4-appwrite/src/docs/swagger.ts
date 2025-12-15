import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Module 4 – Appwrite Wrapper APIs",
      version: "1.0.0",
      description:
        "Wrapper APIs built over Appwrite services using Node.js and TypeScript"
    },
    servers: [
      {
        url: "http://localhost:4000",
        description: "Local server"
      }
    ]
  },
  apis: ["./src/routes/*.ts"]
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
