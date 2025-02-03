import { PrismaClient } from "@prisma/client";

// Define the singleton function
const prismaClientSingleton = () => {
  return new PrismaClient();
};

// Declare the global `prisma` variable
declare global {
  // eslint-disable-next-line no-var
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

// Use the existing `globalThis.prisma` instance if it exists, otherwise create a new one
const db = globalThis.prisma ?? prismaClientSingleton();

// Export the `db` instance
export default db;

// In development, assign the `db` instance to `globalThis.prisma` to avoid multiple instances during hot-reloading
if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}
