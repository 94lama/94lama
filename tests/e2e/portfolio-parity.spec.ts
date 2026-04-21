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
  await expect(page.getByText("Certificates")).toBeVisible();
  await expect(page.getByRole("button", { name: /view all certificates/i })).toBeVisible();
  await expect(page.getByText("Languages")).toBeVisible();
  await expect(page.getByText("Relocation", { exact: true }).first()).toBeVisible();
});

test("certificates modal opens from the button and shows the full certificate list", async ({
  page,
}) => {
  await page.goto("/");

  const openButton = page.getByRole("button", { name: /view all certificates/i });

  await openButton.click();

  const dialog = page.getByRole("dialog", {
    name: /certifications and specialist programs/i,
  });

  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("Cybersecurity & IT Support");
  await expect(dialog).toContainText("AWS Cloud Specialist");
  await expect(dialog).toContainText("DevSecOps Expert");
  await expect(dialog).toContainText("Linux");
  await expect(dialog).toContainText("Cybersecurity");
  await expect(dialog).toContainText("Networking");
  await expect(dialog).toContainText("Meta Front-End Developer");
  await expect(dialog).toContainText("Full-Stack Junior");

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
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
});
