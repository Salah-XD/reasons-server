/*
  Warnings:

  - You are about to drop the column `address` on the `Shipping` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `Shipping` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `Shipping` table. All the data in the column will be lost.
  - You are about to drop the column `postalCode` on the `Shipping` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `Shipping` table. All the data in the column will be lost.
  - Added the required column `addressId` to the `Shipping` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Shipping` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Shipping` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Shipping" DROP COLUMN "address",
DROP COLUMN "city",
DROP COLUMN "country",
DROP COLUMN "postalCode",
DROP COLUMN "state",
ADD COLUMN     "addressId" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "shippingNotes" TEXT,
ADD COLUMN     "trackingNumber" TEXT;

-- AddForeignKey
ALTER TABLE "Shipping" ADD CONSTRAINT "Shipping_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
