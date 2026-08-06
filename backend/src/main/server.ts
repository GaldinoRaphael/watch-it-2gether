import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import groupRoutes from "../infrastructure/http/routes/group.routes";
import groupMemberRoutes from "../infrastructure/http/routes/group-member.routes";
import movieRoutes from "../infrastructure/http/routes/movie.routes";
import voteRoutes from "../infrastructure/http/routes/vote.routes";
import groupWatchedMovieRoutes from "../infrastructure/http/routes/group-watched-movie.routes";
import { prismaService } from "../infrastructure/database/prisma/client/prisma.service";
import swaggerUi from "swagger-ui-express";
import openapiSpecification from "../docs/swagger";
import userRoutes from "../infrastructure/http/routes/user.routes";
import groupInviteRoutes from "../infrastructure/http/routes/group-invite.routes";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN ?? "http://localhost:5173" }));
app.use(express.json({ limit: "10kb" }));
app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use(groupRoutes);
app.use(groupMemberRoutes);
app.use(groupInviteRoutes);
app.use(movieRoutes);
app.use(voteRoutes);
app.use(groupWatchedMovieRoutes);
app.use(userRoutes);
if (process.env.NODE_ENV !== "production") {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpecification));
}

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
    prismaService
      .disconnect()
      .catch((disconnectErr: unknown) => {
        console.error("Error during disconnect:", disconnectErr);
      })
      .finally(() => {
        process.exit(0);
      });
  });
}

process.on("SIGINT", () => {
  shutdown("SIGINT");
});
process.on("SIGTERM", () => {
  shutdown("SIGTERM");
});
