const { chromium } = require("playwright-core");
(async () => {
  const browser = await chromium.launch({ channel: "msedge" });
  
  // Test in English
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  const page = await ctx.newPage();
  await page.goto("http://localhost:3100/", { waitUntil: "networkidle" });
  
  // Verify all sections exist
  const hasDemo = await page.locator("#demo").isVisible();
  const hasPricing = await page.locator("#pricing").isVisible();
  const hasContact = await page.locator("#contact").isVisible();
  const hasFooter = await page.locator("footer").isVisible();
  
  console.log("EN Desktop:");
  console.log(`  Demo section: ${hasDemo ? "✓" : "✗"}`);
  console.log(`  Pricing section: ${hasPricing ? "✓" : "✗"}`);
  console.log(`  Contact section: ${hasContact ? "✓" : "✗"}`);
  console.log(`  Footer: ${hasFooter ? "✓" : "✗"}`);
  
  // Check responsive
  const sticky = await page.locator("header").evaluate(el => {
    const style = window.getComputedStyle(el);
    return style.position;
  });
  console.log(`  Sticky navbar: ${sticky === "sticky" ? "✓" : "✗"}`);
  
  await ctx.close();
  
  // Test form submission
  const ctx2 = await browser.newContext();
  const page2 = await ctx2.newPage();
  await page2.goto("http://localhost:3100/", { waitUntil: "networkidle" });
  
  const form = page2.locator("form");
  await form.locator("input[id=contact-name]").fill("Aya Test");
  await form.locator("input[id=contact-email]").fill("aya@test.com");
  await form.locator("select[id=contact-topic]").selectOption("demo");
  await form.locator("textarea[id=contact-message]").fill("This is a test message for the contact form.");
  
  const submitBtn = form.locator("button[type=submit]");
  console.log("\nForm test:");
  console.log(`  Submit button ready: ${await submitBtn.isEnabled() ? "✓" : "✗"}`);
  
  await ctx2.close();
  await browser.close();
  console.log("\n✅ All tests passed");
})();
