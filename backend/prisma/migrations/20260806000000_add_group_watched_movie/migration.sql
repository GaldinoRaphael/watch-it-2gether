-- CreateTable
CREATE TABLE "GroupWatchedMovie" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "movieId" TEXT NOT NULL,
    "includedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GroupWatchedMovie_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GroupWatchedMovie_groupId_movieId_key" ON "GroupWatchedMovie"("groupId", "movieId");

-- AddForeignKey
ALTER TABLE "GroupWatchedMovie" ADD CONSTRAINT "GroupWatchedMovie_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupWatchedMovie" ADD CONSTRAINT "GroupWatchedMovie_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
