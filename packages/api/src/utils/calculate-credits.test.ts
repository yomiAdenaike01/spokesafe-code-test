import { add } from "date-fns";
import { calculateCredits } from "./calculate-credits";
it("should return 50 credits for a duration of 50 hours", () => {
  const credits = calculateCredits(new Date(), add(new Date(), { hours: 50 }));
  expect(credits).toBeDefined();
  expect(credits).toBe(75);
});
