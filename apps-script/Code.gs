/**
 * 星巴克團購登記：把網頁送來的登記寫進這份試算表的第一個工作表。
 * 格式：A 欄名字、B 飲料、C 點心、D 備註、E 更新時間。
 * 名字已存在（不分大小寫）就覆蓋那一列，不存在就新增一列。
 * 這支程式要貼在試算表自己的 Apps Script（擴充功能 → Apps Script）。
 */
const TZ = "Asia/Taipei";

function doGet() {
  return json_({ ok: true });
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const d = JSON.parse(e.postData.contents);
    const name = clean_(d.name, 20);
    const drink = clean_(d.drink, 40);
    const cake = clean_(d.cake, 40);
    const temp = clean_(d.temp, 4);
    const size = clean_(d.size, 4);
    const note = clean_(d.note, 60);
    if (!name || !drink || !cake) return json_({ ok: false, error: "missing" });

    const sh = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    sh.getRange("D2:E2").setValues([["備註", "更新時間"]]);

    const last = sh.getLastRow();
    const names = last >= 3 ? sh.getRange(3, 1, last - 2, 1).getValues() : [];
    let row = -1;
    for (let i = 0; i < names.length; i++) {
      if (String(names[i][0]).trim().toLowerCase() === name.toLowerCase()) { row = i + 3; break; }
    }
    if (row < 0) {
      row = Math.max(last + 1, 3);
      sh.getRange(row, 1).setNumberFormat("@").setValue(name);
    }

    const drinkText = drink === "不喝飲品" ? drink : drink + "（" + temp + "／" + size + "）";
    const now = Utilities.formatDate(new Date(), TZ, "MM/dd HH:mm");
    // 設成純文字，避免有人輸入 =xxx 被當成公式
    sh.getRange(row, 2, 1, 4).setNumberFormat("@").setValues([[drinkText, cake, note, now]]);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: "server" });
  } finally {
    lock.releaseLock();
  }
}

function clean_(v, max) {
  return String(v == null ? "" : v).replace(/[\u0000-\u001f]/g, " ").trim().slice(0, max);
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
