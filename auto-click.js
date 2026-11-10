(async () => {
  const LIMIT = 100;
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  const settings = () =>
    document.querySelector('button.lp-icon[aria-label="Settings"]');

  const menuItem = label =>
    [...document.querySelectorAll('button.lp-menu-item')]
      .find(el =>
        el.textContent.trim() === label &&
        el.getClientRects().length > 0
      );

  async function openMenu() {
    const button = settings();
    if (!button) throw new Error("Không tìm thấy Settings");

    if (button.getAttribute("aria-expanded") !== "true") {
      button.click();
      await sleep(350);
    }
  }

  async function waitForUrlChange(oldUrl) {
    for (let i = 0; i < 30; i++) {
      if (location.href !== oldUrl) return true;
      await sleep(300);
    }
    return false;
  }

  let marked = 0;

  for (let i = 0; i < LIMIT; i++) {
    await openMenu();

    const complete = menuItem("Mark as complete");
    const incomplete = menuItem("Mark as incomplete");

    if (complete) {
      complete.click();
      await sleep(600);
      await openMenu();

      if (!menuItem("Mark as incomplete")) {
        console.warn("Chưa xác nhận được trạng thái Completed.");
        break;
      }

      marked++;
      console.log(`✅ Đã hoàn thành bài ${i + 1}`);
    } else if (incomplete) {
      console.log(`⏭️ Bài ${i + 1} đã hoàn thành, bỏ qua`);
    } else {
      console.warn("Không xác định được trạng thái bài. Dừng.");
      break;
    }

    await openMenu();

    const next = menuItem("Next lesson");
    if (!next || next.disabled) {
      console.log("Không còn bài tiếp theo.");
      break;
    }

    const oldUrl = location.href;
    next.click();

    const changed = await waitForUrlChange(oldUrl);
    if (!changed) {
      console.warn("Không xác nhận được chuyển bài. Dừng.");
      break;
    }

    await sleep(1200);
  }

  console.log(`Kết thúc. Đã đánh dấu thêm ${marked} bài.`);
})();
