import Order from "@/models/Order";

/*
  Generates a short, human-readable order code like "LKU-2026-0042".

  WHY NOT JUST USE THE MONGODB _id?
  Mongo's default _id (e.g. 64f1a2b3c9d4e5f6a7b8c9d0) is unique and free,
  but useless for a customer to read aloud over the phone or remember.
  "LKU-2026-0042" is something a customer can text your dad or write on a
  receipt by hand.

  HOW UNIQUENESS IS GUARANTEED:
  We count how many orders already exist *this year* and use the next
  number. This is simple but has a subtle race condition: if two orders
  are created at the exact same millisecond, both could read the same
  count before either saves, producing a duplicate code. For a small
  family business taking maybe a few orders a day, this risk is
  effectively negligible — but it's worth knowing the limitation exists.
  The Order schema's `unique: true` on orderCode means MongoDB itself will
  reject a true duplicate at the database level, so the absolute worst
  case is a failed save with a clear error, not silently corrupted data.
  If this app ever needs to handle high concurrent order volume, the
  fix is an atomic counter (e.g. a separate Counter collection updated via
  findOneAndUpdate with $inc), but that's unnecessary complexity for now.
*/
export async function generateOrderCode() {
  const currentYear = new Date().getFullYear();

  const countThisYear = await Order.countDocuments({
    orderCode: { $regex: `^LKU-${currentYear}-` },
  });

  const nextNumber = countThisYear + 1;
  const paddedNumber = String(nextNumber).padStart(4, "0");

  return `LKU-${currentYear}-${paddedNumber}`;
}
