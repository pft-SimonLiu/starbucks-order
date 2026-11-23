# 星巴克團購登記

大家各選一杯星巴克飲品和一份點心，結果寫進 Google Sheet。品項和圖片取自星巴克台灣官網（2026/11/23 查詢）。

網頁放在 GitHub Pages，存資料靠 Google Apps Script 接到試算表。登記的人不需要登入。

## 設定（只做一次，約 5 分鐘）

### 1. 部署 Apps Script

1. 打開要記錄結果的 Google Sheet。第 2 列要有「飲料」「點心」欄，A 欄從第 3 列開始放名字。
2. 選單「擴充功能 → Apps Script」。
3. 把 `apps-script/Code.gs` 的內容整份貼上，取代原本的程式碼，按儲存。
4. 右上「部署 → 新增部署作業」，類型選「網頁應用程式」。
   - 執行身分：我
   - 誰可以存取：所有人
5. 第一次會要求授權，照畫面允許。
6. 複製部署後的「網頁應用程式網址」（`https://script.google.com/macros/s/.../exec`）。

### 2. 把網址填進網頁

打開 `index.html`，找到這一行，把網址貼進引號裡：

```js
const API_URL="";
```

### 3. 開啟 GitHub Pages

repo 的 Settings → Pages，Source 選「Deploy from a branch」，Branch 選 `claude/eager-meitner-qki48h`，資料夾選 `/ (root)`，儲存。幾分鐘後網址會顯示在同一頁。

## 運作方式

- 名字相同（不分大小寫）會覆蓋同一列，所以重新送出就是修改。
- 名字不在表上會新增一列。
- 飲料欄會寫成「美式咖啡（冰／大杯）」，點心欄寫點心名稱，備註和更新時間在 D、E 欄。
- 任何知道網頁網址的人都能登記，也可能被亂填。需要時在 Sheet 裡直接改或刪除即可。

## 注意

- `img/` 裡是星巴克官網的商品圖，僅供社團內部登記使用。
