import puppeteer from "puppeteer";
import { PuppeteerScreenRecorder } from "puppeteer-screen-recorder";

(async () => {
  // تشغيل المتصفح بمقاس كبير وواضح
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ["--start-maximized"],
  });
  const page = await browser.newPage();
  const recorder = new PuppeteerScreenRecorder(page);

  // إعدادات الفيديو والصور
  const credentials = { user: "Ashraf_Dev", pass: "Password123" };
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  try {
    await recorder.start("./Full_Demo.mp4");
    console.log("🎥 بدأت التسجيل...");

    // 1. فتح الريجستر وتصوير الصفحة وهي فاضية
    await page.goto("http://localhost:3000/register");
    await wait(1000);
    await page.screenshot({ path: "01_register_empty.png" });
    console.log("📸 تم تصوير صفحة التسجيل وهي فاضية");

    // 2. إدخال بيانات ثابتة
    await page.type('input[name="username"]', credentials.user, { delay: 50 });
    await page.type('input[name="password"]', credentials.pass, { delay: 50 });

    // 3. تجربة زر Show Password (مرتين) وتصويرها
    const showPassBtn = "#showPassword"; // تأكد إن الـ ID ده صح في ملف الـ EJS عندك
    await page.click(showPassBtn);
    await wait(800);
    await page.click(showPassBtn);
    await wait(800);
    await page.screenshot({ path: "02_register_logic_check.png" });
    console.log("📸 تم تجربة زر إظهار الباسورد");

    // 4. Submit
    await Promise.all([page.click('button[type="submit"]'), page.waitForNavigation()]);

    // 5. اللوج إن وتصوير الصفحة
    console.log("➡️ جاري تسجيل الدخول...");
    await page.type('input[name="username"]', credentials.user, { delay: 50 });
    await page.type('input[name="password"]', credentials.pass, { delay: 50 });
    await page.screenshot({ path: "03_login_page.png" });
    await Promise.all([page.click('button[type="submit"]'), page.waitForNavigation()]);

    // 6. الهوم بيج وعمل Hover
    await page.goto("http://localhost:3000/");
    await page.waitForSelector(".post-card-link");
    await page.hover(".post-card-link");
    await wait(1500); // عشان يبان تأثير الـ Hover في الفيديو
    console.log("📸 تم عمل Hover على البوست");

    // 7. اختيار بوست لرؤية التفاصيل
    await Promise.all([page.click(".post-card-link"), page.waitForNavigation()]);
    console.log("📸 تم الدخول لصفحة البوست الواحد");

    // 8. الرجوع للخلف ثم إضافة بوست جديد
    await page.goBack();
    await wait(1000);
    await page.goto("http://localhost:3000/add-post");
    await page.type('input[name="title"]', "Automated Masterpiece Post", { delay: 50 });
    await page.type(
      'textarea[name="content"]',
      "This post verifies that our Mutex Queue and File System logic is working perfectly under automation.",
      { delay: 30 },
    );
    await Promise.all([page.click('button[type="submit"]'), page.waitForNavigation()]);

    // 9. عمل Hover على البوست الجديد وتصويره
    await page.hover(".post-card-link");
    await page.screenshot({ path: "04_new_post_hover.png" });
    console.log("📸 تم تصوير الـ Hover على البوست الجديد");

    // 10. الضغط على البوست الجديد للتأكد من اللوجيك
    await Promise.all([page.click(".post-card-link"), page.waitForNavigation()]);
    console.log("✅ اللوجيك شغال والبوست الجديد بيفتح");

    // 11. تسجيل الخروج
    await page.goto("http://localhost:3000/logout");
    await wait(1000);
    await page.screenshot({ path: "05_final_logout.png" });
    console.log("👋 تم تسجيل الخروج بنجاح");

    await recorder.stop();
    console.log("🎉 مبروك يا أشرف! الفيديو والصور جاهزين.");
  } catch (err) {
    console.error("❌ حصلت مشكلة أثناء الأوتوميشن:", err);
  } finally {
    await browser.close();
  }
})();
