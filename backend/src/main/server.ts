import 'dotenv/config';
import express from "express"
import groupRoutes from "../infrastructure/http/routes/group.routes";
import movieRoutes from "../infrastructure/http/routes/movie.routes";
import voteRoutes from "../infrastructure/http/routes/vote.routes";
import { prismaService } from '../infrastructure/database/prisma/client/prisma.service';
import swaggerUi from "swagger-ui-express";
import openapiSpecification from '../docs/swagger';
import userRoutes from '../infrastructure/http/routes/user.routes';

const app = express();
app.use(express.json());
app.use(groupRoutes);
app.use(movieRoutes);
app.use(voteRoutes);
app.use(userRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));


const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.warn(`Server is running on port ${PORT}`);
});

function shutdown(signal: string): void {
  console.warn(`\nReceived ${signal}. Shutting down...`);

  server.close((err) => {
    if (err) {
      console.error("Error closing server:", err);
    }
    prismaService.disconnect().catch((disconnectErr: unknown) => {
      console.error("Error during disconnect:", disconnectErr);
    }).finally(() => {
      process.exit(0);
    });
  });
}

process.on("SIGINT", () => { shutdown("SIGINT"); });
process.on("SIGTERM", () => { shutdown("SIGTERM"); });

