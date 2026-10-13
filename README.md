# Olga Yang 作品集網站

由 Weebly 封存檔轉成的純靜態網站（HTML + CSS + 少量 JavaScript），可直接放在 GitHub Pages，不需要任何建置工具。

## 資料夾內容

```
index.html          平面設計（首頁）
social/             社群
web/                網頁與 UI
landscape/          景觀設計
about/              關於與聯絡
work/<作品代號>/     每件作品的頁面
assets/img/         所有圖片（已壓縮為 WebP）
assets/style.css    版面樣式（顏色、字體都在檔案最上方）
assets/site.js      圖片放大檢視與瀑布流排列
404.html            找不到頁面
.nojekyll           讓 GitHub Pages 原樣發佈（請保留）
```

## 上架到 GitHub Pages（用個人帳號）

### 方法 A：GitHub Desktop（推薦，一次上傳全部檔案）
1. 登入你的**個人** GitHub 帳號，右上角「+」→ **New repository**。
   - 名稱填 `你的帳號.github.io`（網址會是 `https://你的帳號.github.io/`），或任意名稱如 `portfolio`（網址會是 `https://你的帳號.github.io/portfolio/`）。
   - 選 **Public**，其他不用勾，按 **Create repository**。
2. 安裝並開啟 GitHub Desktop，用個人帳號登入 → **File → Clone repository**，選剛建立的 repo，存到電腦。
3. 把這個 zip 解壓縮後，**資料夾裡面的所有檔案**（包含隱藏檔 `.nojekyll`）複製到 clone 下來的資料夾。
4. 回到 GitHub Desktop，左下角 Summary 填「上架作品集」→ **Commit to main** → **Push origin**。
5. 到 GitHub 網頁的 repo → **Settings → Pages** → Source 選 **Deploy from a branch**，Branch 選 **main**、資料夾 **/(root)** → **Save**。
6. 等 1–3 分鐘，頁面上方會出現網址，就上線了。

### 方法 B：網頁拖曳上傳
在 repo 頁面點 **Add file → Upload files**，把解壓後的檔案與資料夾拖進去。網頁一次最多 100 個檔案，圖片資料夾 `assets/img` 需要分幾批上傳；`.nojekyll` 若被系統隱藏，可在 GitHub 上 **Add file → Create new file** 建一個名為 `.nojekyll` 的空白檔案。之後同方法 A 第 5 步開啟 Pages。

## 之後想修改
- 文字：直接用文字編輯器（如 VS Code）打開對應的 `index.html` 修改。
- 顏色與字體：`assets/style.css` 最上方的 `:root` 區塊。
- 新增作品：複製 `work/` 底下一個資料夾改內容，再到分類頁加一張卡片；或請 Claude 幫你加。
