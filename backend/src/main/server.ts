import 'dotenv/config';
import express from "express"
import movieRoutes from "../infrastructure/http/routes/movie.routes";
import voteRoutes from "../infrastructure/http/routes/vote.routes";
import { prismaService } from '../infrastructure/database/prisma/client/prisma.service';

const app = express();
app.use(express.json());
app.use(movieRoutes);
app.use(voteRoutes);
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

async function shutdown(signal: string) {
  console.log(`\nReceived ${signal}. Shutting down...`);

  server.close(async () => {
    try {
      await prismaService.disconnect();
    } catch (err) {
      console.error("Error during disconnect:", err);
    } finally {
      process.exit(0);
    }
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

