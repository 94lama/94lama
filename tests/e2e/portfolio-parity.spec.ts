import { expect, test } from "@playwright/test";

test("initial render keeps recruiter-facing sections and primary CTA visible", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { level: 1, name: /Riccardo La Malfa/i }),
  ).toBeVisible();
  await expect(page.locator('a[href^="mailto:"]').first()).toBeVisible();
  await expect(page.getByText("Education")).toBeVisible();
  await expect(page.getByText("Languages")).toBeVisible();
  await expect(page.getByText("Relocation", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Contact", { exact: true }).first()).toBeVisible();
});

test("map-driven selection still highlights matching experience without hiding the timeline", async ({
  page,
}) => {
  await page.goto("/");

  const app = page.locator("main");
  const backendFieldButton = app.locator('button[aria-pressed]').filter({
    hasText: "Backend",
  });

  await expect(async () => {
    await backendFieldButton.click();
    await expect(app).toContainText("Focused field: Backend");
    await expect(app).toContainText(
      "Showing experience entries connected to Backend while keeping the full timeline visible.",
    );
  }).toPass();

  await expect(app.getByRole("button", { name: /reset to overview/i })).toBeVisible();

  await expect(async () => {
    await app.getByRole("button", { name: /reset to overview/i }).click();
    await expect(app).toContainText(
      "Showing the full experience timeline. Select a skill or category to move related entries higher.",
    );
    await expect(app.getByText(/full timeline visible/i)).toBeVisible();
  }).toPass();
});
