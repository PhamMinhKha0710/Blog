# 📄 CV Storage Directory

## Hướng Dẫn Đặt CV File

### 📥 Đặt file CV của bạn vào thư mục này:

1. **Rename file CV** của bạn thành: `Pham_Minh_Kha_CV.pdf`
2. **Copy file** vào thư mục này: `blog/static/cv/`
3. **Build lại Hugo**: `hugo --gc`

### 📋 Formats Được Hỗ Trợ:

- ✅ **PDF** (Recommended) - `Pham_Minh_Kha_CV.pdf`
- ✅ **DOCX** - `Pham_Minh_Kha_CV.docx`
- ✅ **DOC** - `Pham_Minh_Kha_CV.doc`

### 🔗 URL Sẽ Là:

```
https://your-domain.com/cv/Pham_Minh_Kha_CV.pdf
```

### ⚙️ Để Thay Đổi Tên File:

Edit trong `blog/content/about/index.md` và `index.en.md`:

```toml
resumeLink = "/cv/Your_Custom_Name.pdf"
```

### 📌 Lưu Ý:

- File CV sẽ được public khi deploy
- Nên dùng file PDF cho compatibility tốt nhất
- File size nên < 5MB
- Tên file không nên có dấu hoặc khoảng trắng





