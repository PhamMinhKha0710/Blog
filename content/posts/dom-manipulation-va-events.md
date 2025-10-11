+++
title = "DOM Manipulation và Events trong JavaScript: Từ Zero đến Hero"
date = "2025-09-20"
description = "Hiểu DOM qua ví dụ thực tế: Cửa hàng sách, điều khiển từ xa, công tắc đèn. Từ cơ bản đến Event Delegation và Performance Optimization"
categories = ["JavaScript"]
tags = ["JavaScript", "Web"]
author = "Phạm Minh Kha"
+++

## DOM là gì? Hãy tưởng tượng HTML như một ngôi nhà!

Khi bạn viết HTML, trình duyệt không hiểu HTML dưới dạng text. Nó chuyển HTML thành một **cây đối tượng** gọi là **DOM (Document Object Model)** - như bản thiết kế ngôi nhà!

**Hình dung:**
```html
<html>
  <body>
    <h1>Welcome</h1>
    <p>This is a paragraph</p>
  </body>
</html>
```

**Trình duyệt thấy như thế này (cây DOM):**
```
document (Ngôi nhà)
│
└── html (Tầng 1)
    └── body (Phòng khách)
        ├── h1 (Bảng hiệu: "Welcome")
        └── p (Ghế sofa: "This is a paragraph")
```

### Sơ đồ DOM đầy đủ hơn

**HTML phức tạp hơn:**
```html
<!DOCTYPE html>
<html>
  <head>
    <title>My Website</title>
    <link rel="stylesheet" href="style.css">
  </head>
  <body>
    <header>
      <h1>Welcome to My Site</h1>
      <nav>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
        </ul>
      </nav>
    </header>
    <main>
      <article>
        <h2>Article Title</h2>
        <p>Article content here...</p>
      </article>
    </main>
    <footer>
      <p>&copy; 2025 My Website</p>
    </footer>
  </body>
</html>
```

**Cây DOM tương ứng:**
```
document
│
├── doctype: html
│
└── html
    ├── head
    │   ├── title
    │   │   └── #text: "My Website"
    │   └── link [rel="stylesheet", href="style.css"]
    │
    └── body
        ├── header
        │   ├── h1
        │   │   └── #text: "Welcome to My Site"
        │   └── nav
        │       └── ul
        │           ├── li
        │           │   └── a [href="/"]
        │           │       └── #text: "Home"
        │           └── li
        │               └── a [href="/about"]
        │                   └── #text: "About"
        │
        ├── main
        │   └── article
        │       ├── h2
        │       │   └── #text: "Article Title"
        │       └── p
        │           └── #text: "Article content here..."
        │
        └── footer
            └── p
                └── #text: "© 2025 My Website"
```

**Giải thích:**
- 🔵 **Element Node** (màu xanh): `<html>`, `<body>`, `<h1>`, `<p>`, v.v.
- 📝 **Text Node**: Nội dung văn bản (ví dụ: "Welcome to My Site")
- 🔗 **Attribute Node**: Thuộc tính như `href="/about"`

---

**JavaScript = Người thợ sửa nhà:**
- Có thể **đọc** bảng hiệu (lấy text)
- Có thể **thay đổi** bảng hiệu thành "Goodbye"
- Có thể **thêm** bàn, ghế mới
- Có thể **xóa** đồ đạc cũ
- Có thể **sơn lại** (đổi màu, style)

---

## Mối quan hệ trong cây DOM - Như gia đình!

**Ví dụ HTML:**
```html
<div id="family">
  <div id="parent">
    <span id="child1">Con 1</span>
    <span id="child2">Con 2</span>
  </div>
</div>
```

**Sơ đồ cây gia đình:**
```
                    div#family (Ông/Bà) 👴
                         │
                    parentElement
                         │
                         ↓
                    div#parent (Cha/Mẹ) 👨
                    │          │
            ┌───────┴───┬──────┴────────┐
            │           │               │
         children    children      (có thể có)
            │           │          thêm con nữa
            ↓           ↓
      span#child1   span#child2
      (Con đầu)     (Con thứ 2)
          👦            👧
            │           │
            └─ sibling ─┘
         (Anh em ruột)
```

**Quan hệ gia đình:**

1. **Parent (Cha) - Child (Con):**
   - `<div id="parent">` là **cha** của `<span id="child1">`
   - `<span id="child1">` là **con** của `<div id="parent">`

2. **Sibling (Anh em):**
   - `child1` và `child2` là **anh em** (cùng cha)
   - Dùng `nextSibling` để lấy em kế tiếp
   - Dùng `previousSibling` để lấy anh/chị trước đó

3. **Ancestor (Tổ tiên) - Descendant (Con cháu):**
   - `<div id="family">` là **tổ tiên** của `child1` (ông/bà)
   - `child1` là **con cháu** của `family`

**Trong JavaScript:**
```javascript
const parent = document.getElementById('parent');
const child1 = document.getElementById('child1');
const child2 = document.getElementById('child2');

// Quan hệ Parent-Child
console.log(parent.children);          // [child1, child2]
console.log(parent.firstChild);        // child1
console.log(parent.lastChild);         // child2
console.log(child1.parentElement);     // div#parent

// Quan hệ Sibling
console.log(child1.nextElementSibling);      // child2
console.log(child2.previousElementSibling);  // child1

// Quan hệ Ancestor-Descendant
console.log(parent.parentElement);     // div#family (ông/bà)
console.log(child1.closest('#family')); // Tìm tổ tiên gần nhất
```

**Ví dụ thực tế: Duyệt cây DOM**
```javascript
const family = document.getElementById('family');

// Duyệt tất cả con cháu
function traverseDOM(node, level = 0) {
    const indent = '  '.repeat(level);
    console.log(indent + node.tagName + (node.id ? '#' + node.id : ''));
    
    // Duyệt đệ quy các con
    for (let child of node.children) {
        traverseDOM(child, level + 1);
    }
}

traverseDOM(family);
// Output:
// DIV#family
//   DIV#parent
//     SPAN#child1
//     SPAN#child2
```

---

## Tìm phần tử DOM - Như tìm đồ trong nhà

### 1. getElementById - Tìm theo số nhà

**Ví dụ thực tế:** Tìm căn hộ theo số nhà 101

```javascript
// HTML: <div id="house-101">Nhà số 101</div>
const house = document.getElementById('house-101');
console.log(house.textContent);  // Output: Nhà số 101
```

**Đặc điểm:**
- ✅ **Nhanh nhất** (trình duyệt có "sổ địa chỉ" cho ID)
- ✅ Chỉ trả về **1 phần tử duy nhất**
- ⚠️ ID phải **không trùng** (như số nhà)

---

### 2. getElementsByClassName - Tìm theo nhóm

**Ví dụ thực tế:** Tìm tất cả nhà có màu đỏ

```javascript
// HTML:
// <div class="red-house">Nhà đỏ 1</div>
// <div class="red-house">Nhà đỏ 2</div>
// <div class="blue-house">Nhà xanh</div>

const redHouses = document.getElementsByClassName('red-house');
console.log(redHouses.length);  // Output: 2

// Duyệt qua từng nhà
for (let i = 0; i < redHouses.length; i++) {
    console.log(redHouses[i].textContent);
}
```

**Đặc điểm:**
- ✅ Trả về **nhiều phần tử** (HTMLCollection)
- ⚠️ Kết quả là **"live"** - tự động cập nhật khi DOM thay đổi!

**Cẩn thận với "live collection":**
```javascript
const items = document.getElementsByClassName('item');
console.log(items.length);  // 5

// Thêm item mới vào DOM
document.body.innerHTML += '<div class="item">New</div>';

console.log(items.length);  // 6 (tự động cập nhật!)
```

---

### 3. querySelector - Tìm kiếm mạnh mẽ (như Google!)

**Ví dụ thực tế:** Tìm với điều kiện phức tạp

```javascript
// Tìm nhà đỏ ĐẦU TIÊN
const firstRedHouse = document.querySelector('.red-house');

// Tìm input có type="email"
const emailInput = document.querySelector('input[type="email"]');

// Tìm button trong form
const submitBtn = document.querySelector('form button.submit');

// Tìm đoạn văn thứ 2 trong div
const secondP = document.querySelector('div p:nth-child(2)');
```

**Đặc điểm:**
- ✅ **Linh hoạt nhất** - dùng CSS selector
- ✅ Chỉ trả về **phần tử đầu tiên** tìm thấy
- ✅ Kết quả **không live** (tĩnh)

---

### 4. querySelectorAll - Tìm TẤT CẢ

```javascript
// Tìm TẤT CẢ nhà đỏ
const allRedHouses = document.querySelectorAll('.red-house');

// Tìm tất cả link bắt đầu bằng "https"
const secureLinks = document.querySelectorAll('a[href^="https"]');

// Duyệt qua từng phần tử
allRedHouses.forEach(house => {
    console.log(house.textContent);
});
```

**Đặc điểm:**
- ✅ Trả về **NodeList** (giống mảng)
- ✅ Kết quả **tĩnh** (không tự động cập nhật)
- ✅ Có thể dùng `.forEach()`

---

## So sánh các phương thức tìm kiếm

| Phương thức | Tìm bằng | Kết quả | Live? | Khi nào dùng |
|-------------|----------|---------|-------|--------------|
| `getElementById()` | ID | 1 phần tử | Không | Tìm phần tử quan trọng (header, form) |
| `querySelector()` | CSS selector | 1 phần tử đầu | Không | **Khuyến nghị dùng** (linh hoạt nhất) |
| `querySelectorAll()` | CSS selector | Tất cả | Không | Tìm nhiều phần tử |
| `getElementsByClassName()` | Class | Tất cả | **Có** | Cần cập nhật tự động (hiếm dùng) |

**Lời khuyên:** 
- 🎯 **Dùng `querySelector()`** cho hầu hết trường hợp
- 🎯 **Dùng `querySelectorAll()`** khi cần nhiều phần tử

---

## Thao tác nội dung - Như viết bảng hiệu

### 1. textContent - Chỉ văn bản

**Ví dụ:** Thay đổi tên cửa hàng

```javascript
const storeName = document.querySelector('.store-name');

// Đọc tên hiện tại
console.log(storeName.textContent);  // "ABC Store"

// Đổi tên mới
storeName.textContent = "XYZ Super Store";
```

**Đặc điểm:**
- ✅ **An toàn** - không chạy HTML
- ✅ Lấy **tất cả text** (kể cả ẩn)

---

### 2. innerHTML - Có cả HTML

**Ví dụ:** Thêm menu vào cửa hàng

```javascript
const menu = document.querySelector('.menu');

// Đọc HTML hiện tại
console.log(menu.innerHTML);

// Thay đổi toàn bộ HTML
menu.innerHTML = `
    <h2>Menu Hôm Nay</h2>
    <ul>
        <li>Phở - 30k</li>
        <li>Cơm - 25k</li>
    </ul>
`;

// Thêm vào cuối (append)
menu.innerHTML += '<li>Bún - 20k</li>';
```

**Đặc điểm:**
- ✅ Mạnh mẽ - có thể thêm HTML phức tạp
- ⚠️ **Nguy hiểm** - có thể bị tấn công XSS nếu dùng data từ user

**Cảnh báo XSS:**
```javascript
// ❌ NGUY HIỂM: Nếu userInput = '<img src=x onerror="alert(1)">'
element.innerHTML = userInput;  // Code độc sẽ chạy!

// ✅ AN TOÀN: Dùng textContent
element.textContent = userInput;  // Chỉ hiển thị text
```

---

## Thao tác thuộc tính - Như thay biển số xe

**Ví dụ:** Thay đổi link, ảnh, input

```javascript
const link = document.querySelector('a');

// Đọc thuộc tính
console.log(link.getAttribute('href'));  // "https://google.com"
console.log(link.href);                  // Cách khác (dễ hơn)

// Đổi link
link.setAttribute('href', 'https://facebook.com');
link.href = 'https://facebook.com';  // Cách khác

// Kiểm tra có thuộc tính không
console.log(link.hasAttribute('target'));  // false

// Xóa thuộc tính
link.removeAttribute('target');
```

**Data attributes (data-*):**
```javascript
// HTML: <div data-user-id="123" data-role="admin">User</div>
const userDiv = document.querySelector('div');

console.log(userDiv.dataset.userId);  // "123"
console.log(userDiv.dataset.role);    // "admin"

// Thêm data attribute
userDiv.dataset.status = 'active';
// → Tạo thuộc tính data-status="active"
```

---

## Tạo và xóa phần tử - Như xây nhà mới

### Tạo phần tử mới

**Ví dụ:** Thêm sách mới vào giá

```javascript
// 1. Tạo phần tử
const newBook = document.createElement('div');

// 2. Thêm nội dung
newBook.textContent = 'Harry Potter';

// 3. Thêm class
newBook.className = 'book fantasy';
// Hoặc: newBook.classList.add('book', 'fantasy');

// 4. Thêm ID
newBook.id = 'book-101';

// 5. Thêm thuộc tính
newBook.setAttribute('data-price', '150000');

// 6. Thêm vào DOM
const bookshelf = document.querySelector('.bookshelf');
bookshelf.appendChild(newBook);
```

**Các cách thêm vào DOM:**

```javascript
const parent = document.querySelector('.parent');
const newElement = document.createElement('div');

// Thêm vào cuối
parent.appendChild(newElement);      // Cách cũ
parent.append(newElement);           // Cách mới (khuyến nghị)

// Thêm vào đầu
parent.prepend(newElement);

// Thêm trước phần tử khác
const sibling = document.querySelector('.sibling');
sibling.before(newElement);

// Thêm sau phần tử khác
sibling.after(newElement);
```

---

### Xóa phần tử

```javascript
const oldBook = document.getElementById('book-old');

// Cách mới (dễ nhất)
oldBook.remove();

// Cách cũ (vẫn hoạt động)
oldBook.parentNode.removeChild(oldBook);
```

---

## Hiệu suất: Thêm nhiều phần tử cùng lúc

**Vấn đề:** Thêm 1000 quyển sách - CHẬM!

**❌ Cách SAI (chậm):**
```javascript
const bookshelf = document.querySelector('.bookshelf');

for (let i = 0; i < 1000; i++) {
    const book = document.createElement('div');
    book.textContent = `Book ${i}`;
    bookshelf.appendChild(book);  // 1000 lần Reflow! 💀
}
```

Mỗi lần `appendChild()`, trình duyệt phải **tính toán lại layout** (Reflow) → **Chậm như rùa!** 🐢

---

**✅ Cách ĐÚNG (nhanh): Dùng DocumentFragment**

```javascript
const bookshelf = document.querySelector('.bookshelf');
const fragment = document.createDocumentFragment();

// Thêm vào fragment (không vào DOM thật)
for (let i = 0; i < 1000; i++) {
    const book = document.createElement('div');
    book.textContent = `Book ${i}`;
    fragment.appendChild(book);  // Không Reflow!
}

// Chỉ Reflow 1 lần duy nhất
bookshelf.appendChild(fragment);  // 🚀 Nhanh!
```

**Ví dụ thực tế:**
```
Không dùng Fragment: 1000 lần Reflow = 500ms
Dùng Fragment:       1 lần Reflow    = 5ms

→ Nhanh gấp 100 lần! 🚀
```

---

## Thay đổi CSS - Như sơn lại nhà

### 1. Thay đổi style trực tiếp

```javascript
const box = document.querySelector('.box');

// Đổi 1 thuộc tính
box.style.color = 'red';
box.style.backgroundColor = 'yellow';  // Chú ý: camelCase!
box.style.padding = '20px';
box.style.border = '2px solid black';

// Đọc style (chỉ đọc được inline style)
console.log(box.style.color);  // "red"

// Đọc style đã tính toán (computed style)
const computed = window.getComputedStyle(box);
console.log(computed.fontSize);      // "16px"
console.log(computed.display);       // "block"
```

**Chú ý:**
- `element.style.backgroundColor` (camelCase)
- `background-color` trong CSS → `backgroundColor` trong JS

---

### 2. Thao tác với class CSS (Khuyến nghị!)

Thay vì đổi từng style, **dùng class** để quản lý!

```javascript
const button = document.querySelector('.button');

// Kiểm tra có class không
console.log(button.classList.contains('active'));  // false

// Thêm class
button.classList.add('active');
button.classList.add('primary', 'large');  // Thêm nhiều cùng lúc

// Xóa class
button.classList.remove('active');

// Toggle class (có thì xóa, không có thì thêm)
button.classList.toggle('active');

// Thay class
button.classList.replace('old-class', 'new-class');
```

**Ví dụ thực tế: Toggle dark mode**
```javascript
const toggleBtn = document.querySelector('.theme-toggle');

toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    // Lưu lựa chọn vào localStorage
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});
```

---

## Events - Như chuông cửa nhà!

**Hình dung:** Bạn lắp chuông cửa và đợi khách bấm

```javascript
const button = document.querySelector('button');

// Lắp chuông (đăng ký event listener)
button.addEventListener('click', function() {
    console.log('🔔 Có người bấm nút!');
    alert('Hello!');
});
```

**Ba bước:**
1. **Tìm phần tử** (`querySelector`)
2. **Lắp chuông** (`addEventListener`)
3. **Định nghĩa hành động** (function)

---

### Event Object - Thông tin về sự kiện

```javascript
const input = document.querySelector('input');

input.addEventListener('keyup', function(event) {
    console.log('Phím vừa nhấn:', event.key);
    console.log('Mã phím:', event.keyCode);
    console.log('Giá trị hiện tại:', event.target.value);
    
    // Kiểm tra phím Enter
    if (event.key === 'Enter') {
        console.log('Bạn vừa nhấn Enter!');
    }
});
```

**event.target** = Phần tử được click/nhấn
**event.currentTarget** = Phần tử có event listener

---

### preventDefault - Ngăn hành động mặc định

**Ví dụ 1: Ngăn link chuyển trang**

```javascript
const link = document.querySelector('a');

link.addEventListener('click', function(event) {
    event.preventDefault();  // Không chuyển trang
    console.log('Link bị chặn! Không đi đâu cả!');
});
```

**Ví dụ 2: Ngăn form gửi đi (để validate)**

```javascript
const form = document.querySelector('form');

form.addEventListener('submit', function(event) {
    event.preventDefault();  // Không gửi form
    
    const email = document.querySelector('#email').value;
    
    if (!email.includes('@')) {
        alert('Email không hợp lệ!');
    } else {
        console.log('Email OK, gửi form đi...');
        // Gửi bằng JavaScript (AJAX)
    }
});
```

---

## Event Propagation - Sự kiện lan truyền

**Hình dung:** Bạn bấm nút trong phòng → Cả nhà đều biết!

```html
<div id="house">
    <div id="room">
        <button id="button">Bấm tôi</button>
    </div>
</div>
```

Khi bấm `<button>`, sự kiện **lan truyền** qua 3 giai đoạn:

**Sơ đồ Event Propagation:**
```
                        window
                          │
                          ↓ (1) CAPTURING PHASE 🔻
                      document                    ↑ (3) BUBBLING PHASE 🔺
                          │                       │
                          ↓                       ↑
                     div#house                    │
                          │                       │
                          ↓                       ↑
                      div#room                    │
                          │                       │
                          ↓                       ↑
                     ═══════════                  │
                     ║ button  ║ ← (2) TARGET PHASE 🎯
                     ═══════════
                     
GIAI ĐOẠN 1: CAPTURING (Đi xuống)
window → document → div#house → div#room → button

GIAI ĐOẠN 2: TARGET (Đích)
Sự kiện đến phần tử được click (button)

GIAI ĐOẠN 3: BUBBLING (Nổi lên)
button → div#room → div#house → document → window
```

### Giai đoạn 1: Capturing (Đi xuống) 🔻

Sự kiện bắt đầu từ `window` → `document` → `house` → `room` → `button`

**Lắng nghe ở giai đoạn Capturing:**
```javascript
// Tham số thứ 3 = true → Lắng nghe ở Capturing phase
house.addEventListener('click', () => {
    console.log('House - Capturing');
}, true);  // ← true = Capturing!

button.addEventListener('click', () => {
    console.log('Button clicked');
});

// Khi click button, output:
// House - Capturing (chạy trước!)
// Button clicked
```

### Giai đoạn 2: Target (Đích) 🎯

Sự kiện đến đúng phần tử được bấm (`button`)

### Giai đoạn 3: Bubbling (Nổi lên - Mặc định) 🔺

Sự kiện "nổi lên" ngược lại: `button` → `room` → `house` → `document` → `window`

**Ví dụ thực tế:**

```javascript
const house = document.getElementById('house');
const room = document.getElementById('room');
const button = document.getElementById('button');

button.addEventListener('click', () => {
    console.log('3️⃣ Button clicked!');
});

room.addEventListener('click', () => {
    console.log('2️⃣ Room clicked!');
});

house.addEventListener('click', () => {
    console.log('1️⃣ House clicked!');
});

// Khi bấm button, output:
// 3️⃣ Button clicked!
// 2️⃣ Room clicked!  ← Bubbling!
// 1️⃣ House clicked!  ← Tiếp tục bubbling!
```

---

### stopPropagation - Ngăn lan truyền

```javascript
button.addEventListener('click', (event) => {
    console.log('Button clicked!');
    event.stopPropagation();  // Dừng ngay tại đây!
});

room.addEventListener('click', () => {
    console.log('Room clicked!');  // Không chạy!
});
```

**Output:**
```
Button clicked!
(Dừng lại, không lan ra ngoài)
```

---

## Event Delegation - Kỹ thuật quan trọng nhất! 🔥

**Vấn đề:** Bạn có 100 nút trong danh sách

**Sơ đồ so sánh:**

**❌ Cách SAI - Gắn listener cho từng phần tử:**
```
ul#todo-list
├── li [🎧 listener 1] ← Tốn RAM
├── li [🎧 listener 2] ← Tốn RAM
├── li [🎧 listener 3] ← Tốn RAM
├── ... (97 listeners nữa)
└── li [🎧 listener 100] ← Tốn RAM

Thêm li mới → ❌ Không có listener!
```

**✅ Cách ĐÚNG - Event Delegation:**
```
ul#todo-list [🎧 1 LISTENER DUY NHẤT]
│    ↑
│    │ Bubbling
│    │
├── li (click) ────┘
├── li (click) ────┘
├── li (click) ────┘
├── ...
└── li (click) ────┘

Thêm li mới → ✅ Tự động có listener!
```

---

**❌ Cách SAI (chậm, tốn RAM):**

```javascript
const buttons = document.querySelectorAll('.item-button');

// Gắn 100 event listeners!
buttons.forEach(button => {
    button.addEventListener('click', () => {
        console.log('Button clicked!');
    });
});

// Nếu thêm nút mới → Phải gắn listener thủ công!
```

**Vấn đề:**
- 💾 Tốn RAM (100 listeners)
- ❌ Nút mới thêm vào → **Không có listener**
- 🐌 Chậm khi thêm/xóa phần tử

---

**✅ Cách ĐÚNG: Event Delegation (Ủy quyền)**

**Ý tưởng:** Gắn **1 listener duy nhất** vào thằng cha, tận dụng Event Bubbling!

```javascript
const todoList = document.getElementById('todo-list');

// Chỉ gắn 1 listener vào <ul>
todoList.addEventListener('click', function(event) {
    // Kiểm tra xem có phải button không
    if (event.target.classList.contains('delete-btn')) {
        const item = event.target.closest('li');
        item.remove();
        console.log('Đã xóa item!');
    }
});
```

**HTML:**
```html
<ul id="todo-list">
    <li>Task 1 <button class="delete-btn">Xóa</button></li>
    <li>Task 2 <button class="delete-btn">Xóa</button></li>
    <li>Task 3 <button class="delete-btn">Xóa</button></li>
</ul>
```

**Lợi ích:**
- ✅ **1 listener** thay vì 100 listeners
- ✅ Nút mới thêm vào → **Tự động có listener**!
- ✅ Tiết kiệm RAM
- ✅ Dễ maintain

**Ví dụ thực tế:**

```javascript
// HTML:
// <ul id="product-list">
//   <li data-id="1">Product 1 <button class="buy">Mua</button></li>
//   <li data-id="2">Product 2 <button class="buy">Mua</button></li>
// </ul>

const productList = document.getElementById('product-list');

productList.addEventListener('click', (event) => {
    // Kiểm tra nút "Mua"
    if (event.target.classList.contains('buy')) {
        const productId = event.target.closest('li').dataset.id;
        console.log(`Mua sản phẩm #${productId}`);
        addToCart(productId);
    }
});

// Thêm sản phẩm mới → Tự động hoạt động!
productList.innerHTML += '<li data-id="3">Product 3 <button class="buy">Mua</button></li>';
```

---

## Các sự kiện phổ biến

### 🖱️ Sự kiện chuột

```javascript
element.addEventListener('click', () => {});        // Nhấp chuột
element.addEventListener('dblclick', () => {});     // Nhấp đúp
element.addEventListener('mousedown', () => {});    // Nhấn xuống
element.addEventListener('mouseup', () => {});      // Thả ra
element.addEventListener('mousemove', () => {});    // Di chuyển chuột
element.addEventListener('mouseenter', () => {});   // Chuột vào
element.addEventListener('mouseleave', () => {});   // Chuột ra
element.addEventListener('contextmenu', () => {});  // Click chuột phải
```

**Ví dụ: Theo dõi vị trí chuột**

```javascript
document.addEventListener('mousemove', (event) => {
    console.log(`X: ${event.clientX}, Y: ${event.clientY}`);
});
```

---

### ⌨️ Sự kiện bàn phím

```javascript
document.addEventListener('keydown', () => {});   // Nhấn phím
document.addEventListener('keyup', () => {});     // Thả phím
document.addEventListener('keypress', () => {});  // Nhấn và thả
```

**Ví dụ: Phát hiện Ctrl+S**

```javascript
document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key === 's') {
        event.preventDefault();  // Không lưu trang
        console.log('Ctrl+S pressed!');
        saveDocument();
    }
});
```

---

### 📝 Sự kiện form

```javascript
form.addEventListener('submit', () => {});   // Gửi form
input.addEventListener('focus', () => {});   // Nhận focus
input.addEventListener('blur', () => {});    // Mất focus
input.addEventListener('change', () => {});  // Thay đổi (blur sau đó)
input.addEventListener('input', () => {});   // Thay đổi ngay lập tức
```

**Ví dụ: Validate real-time**

```javascript
const emailInput = document.querySelector('#email');

emailInput.addEventListener('input', (event) => {
    const email = event.target.value;
    
    if (email.includes('@')) {
        emailInput.style.borderColor = 'green';
    } else {
        emailInput.style.borderColor = 'red';
    }
});
```

---

### 🌐 Sự kiện window/document

```javascript
window.addEventListener('load', () => {});              // Trang đã tải xong
document.addEventListener('DOMContentLoaded', () => {}); // DOM đã sẵn sàng
window.addEventListener('resize', () => {});            // Thay đổi kích thước
window.addEventListener('scroll', () => {});            // Cuộn trang
window.addEventListener('beforeunload', () => {});      // Sắp đóng trang
```

**Ví dụ: Back to top button**

```javascript
const backToTopBtn = document.querySelector('.back-to-top');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopBtn.style.display = 'block';
    } else {
        backToTopBtn.style.display = 'none';
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
```

---

## Ứng dụng thực tế: Todo List App

Hãy xây dựng một ứng dụng Todo List hoàn chỉnh để áp dụng tất cả kiến thức!

### HTML

```html
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Todo App</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 40px 20px;
        }
        
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 2rem;
            margin-bottom: 10px;
        }
        
        .todo-form {
            display: flex;
            padding: 20px;
            gap: 10px;
            border-bottom: 1px solid #eee;
        }
        
        #todo-input {
            flex: 1;
            padding: 12px;
            border: 2px solid #ddd;
            border-radius: 8px;
            font-size: 16px;
            transition: border-color 0.3s;
        }
        
        #todo-input:focus {
            outline: none;
            border-color: #667eea;
        }
        
        .add-button {
            background: #667eea;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 600;
            transition: background 0.3s;
        }
        
        .add-button:hover {
            background: #5568d3;
        }
        
        .filters {
            display: flex;
            justify-content: center;
            gap: 10px;
            padding: 20px;
            border-bottom: 1px solid #eee;
        }
        
        .filter-btn {
            background: #f5f5f5;
            border: none;
            padding: 8px 16px;
            border-radius: 20px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.3s;
        }
        
        .filter-btn:hover {
            background: #e0e0e0;
        }
        
        .filter-btn.active {
            background: #667eea;
            color: white;
        }
        
        .todo-list {
            list-style: none;
            padding: 20px;
            min-height: 200px;
        }
        
        .todo-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 15px;
            background: #f9f9f9;
            border-radius: 8px;
            margin-bottom: 10px;
            transition: all 0.3s;
            cursor: pointer;
        }
        
        .todo-item:hover {
            background: #f0f0f0;
            transform: translateX(5px);
        }
        
        .todo-item.completed {
            opacity: 0.6;
        }
        
        .todo-item.completed .todo-text {
            text-decoration: line-through;
            color: #888;
        }
        
        .checkbox {
            width: 20px;
            height: 20px;
            cursor: pointer;
        }
        
        .todo-text {
            flex: 1;
            font-size: 16px;
        }
        
        .delete-btn {
            background: #ff4d4d;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            transition: background 0.3s;
        }
        
        .delete-btn:hover {
            background: #cc0000;
        }
        
        .empty-message {
            text-align: center;
            color: #888;
            font-style: italic;
            padding: 40px;
        }
        
        .stats {
            padding: 20px;
            text-align: center;
            border-top: 1px solid #eee;
            color: #666;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📝 My Todo App</h1>
            <p>Quản lý công việc hàng ngày</p>
        </div>
        
        <form class="todo-form" id="todo-form">
            <input 
                type="text" 
                id="todo-input" 
                placeholder="Thêm việc cần làm..."
                autocomplete="off"
            >
            <button type="submit" class="add-button">➕ Thêm</button>
        </form>
        
        <div class="filters">
            <button class="filter-btn active" data-filter="all">Tất cả</button>
            <button class="filter-btn" data-filter="active">Đang làm</button>
            <button class="filter-btn" data-filter="completed">Đã xong</button>
        </div>
        
        <ul class="todo-list" id="todo-list"></ul>
        
        <div class="stats" id="stats">
            <span id="total-count">0</span> việc | 
            <span id="completed-count">0</span> đã xong
        </div>
    </div>
    
    <script src="app.js"></script>
</body>
</html>
```

### JavaScript (app.js)

```javascript
// ============================================
// DOM ELEMENTS
// ============================================
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const filterButtons = document.querySelectorAll('.filter-btn');
const totalCount = document.getElementById('total-count');
const completedCount = document.getElementById('completed-count');

// ============================================
// STATE
// ============================================
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    renderTodos();
    updateStats();
});

// ============================================
// EVENT LISTENERS
// ============================================

// 1. Form submission (Thêm todo mới)
todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const text = todoInput.value.trim();
    
    if (text === '') {
        // Highlight input nếu rỗng
        todoInput.style.borderColor = 'red';
        setTimeout(() => {
            todoInput.style.borderColor = '#ddd';
        }, 1000);
        return;
    }
    
    // Tạo todo mới
    const newTodo = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    todos.push(newTodo);
    saveToLocalStorage();
    
    // Clear input và re-render
    todoInput.value = '';
    renderTodos();
    updateStats();
});

// 2. Event Delegation cho todo list
todoList.addEventListener('click', (e) => {
    const target = e.target;
    const todoItem = target.closest('.todo-item');
    
    if (!todoItem) return;
    
    const todoId = Number(todoItem.dataset.id);
    
    // Xóa todo
    if (target.classList.contains('delete-btn')) {
        deleteTodo(todoId);
    }
    // Toggle checkbox
    else if (target.classList.contains('checkbox')) {
        toggleTodo(todoId);
    }
    // Click vào text (toggle)
    else if (target.classList.contains('todo-text')) {
        toggleTodo(todoId);
        // Update checkbox
        const checkbox = todoItem.querySelector('.checkbox');
        const todo = todos.find(t => t.id === todoId);
        checkbox.checked = todo.completed;
    }
});

// 3. Filter buttons
document.querySelector('.filters').addEventListener('click', (e) => {
    if (!e.target.classList.contains('filter-btn')) return;
    
    // Update active state
        filterButtons.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        
        // Set current filter
        currentFilter = e.target.dataset.filter;
        
    // Re-render
        renderTodos();
});

// ============================================
// FUNCTIONS
// ============================================

function renderTodos() {
    // Filter todos
    let filteredTodos = todos;
    
    if (currentFilter === 'active') {
        filteredTodos = todos.filter(todo => !todo.completed);
    } else if (currentFilter === 'completed') {
        filteredTodos = todos.filter(todo => todo.completed);
    }
    
    // Clear list
    todoList.innerHTML = '';
    
    // Empty state
    if (filteredTodos.length === 0) {
        todoList.innerHTML = `
            <li class="empty-message">
                ${getEmptyMessage()}
            </li>
        `;
        return;
    }
    
    // Render todos
    filteredTodos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.dataset.id = todo.id;
        
        li.innerHTML = `
            <input type="checkbox" class="checkbox" ${todo.completed ? 'checked' : ''}>
            <span class="todo-text">${escapeHtml(todo.text)}</span>
            <button class="delete-btn">🗑️ Xóa</button>
        `;
        
        todoList.appendChild(li);
    });
}

function toggleTodo(id) {
    todos = todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, completed: !todo.completed };
        }
        return todo;
    });
    
    saveToLocalStorage();
    renderTodos();
    updateStats();
}

function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveToLocalStorage();
    renderTodos();
    updateStats();
}

function saveToLocalStorage() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function updateStats() {
    totalCount.textContent = todos.length;
    completedCount.textContent = todos.filter(t => t.completed).length;
}

function getEmptyMessage() {
    if (currentFilter === 'all') {
        return 'Chưa có việc nào. Thêm việc mới! 🎉';
    } else if (currentFilter === 'active') {
        return 'Không có việc đang làm! 👍';
    } else {
        return 'Chưa hoàn thành việc nào! 💪';
    }
}

// XSS Protection
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
```

---

## Best Practices - Quy tắc vàng

### 1. ✅ Dùng querySelector thay vì getElementById

```javascript
// ❌ Cũ
const element = document.getElementById('myElement');

// ✅ Mới (đồng nhất, dễ đọc)
const element = document.querySelector('#myElement');
```

---

### 2. ✅ Cache DOM queries

```javascript
// ❌ Chậm - Query nhiều lần
function updateUI() {
    document.querySelector('.title').textContent = 'New Title';
    document.querySelector('.title').style.color = 'red';
    document.querySelector('.title').classList.add('active');
}

// ✅ Nhanh - Query 1 lần
function updateUI() {
    const title = document.querySelector('.title');
    title.textContent = 'New Title';
    title.style.color = 'red';
    title.classList.add('active');
}
```

---

### 3. ✅ Dùng Event Delegation

```javascript
// ❌ Gắn listener cho từng phần tử
buttons.forEach(btn => {
    btn.addEventListener('click', handleClick);
});

// ✅ Gắn 1 listener cho parent
parent.addEventListener('click', (e) => {
    if (e.target.matches('.button')) {
        handleClick(e);
    }
});
```

---

### 4. ✅ Batch DOM updates

```javascript
// ❌ Nhiều Reflow
for (let i = 0; i < 100; i++) {
    list.appendChild(createItem(i));  // 100 Reflows
}

// ✅ 1 Reflow duy nhất
    const fragment = document.createDocumentFragment();
for (let i = 0; i < 100; i++) {
    fragment.appendChild(createItem(i));
}
list.appendChild(fragment);  // 1 Reflow
```

---

### 5. ✅ Dùng classList thay vì className

```javascript
// ❌ Khó maintain
element.className = 'active highlight';

// ✅ Dễ maintain
element.classList.add('active', 'highlight');
element.classList.remove('active');
element.classList.toggle('active');
```

---

### 6. ✅ Tránh innerHTML với user data

```javascript
// ❌ NGUY HIỂM - XSS attack
element.innerHTML = userInput;

// ✅ AN TOÀN
element.textContent = userInput;
```

---

## Tóm tắt

**DOM Manipulation:**
1. **Tìm phần tử:** Dùng `querySelector()` và `querySelectorAll()`
2. **Đổi nội dung:** `textContent` (text) hoặc `innerHTML` (HTML)
3. **Đổi style:** Dùng `classList` thay vì `style` trực tiếp
4. **Tạo/xóa:** `createElement()`, `append()`, `remove()`
5. **Hiệu suất:** Dùng `DocumentFragment` cho nhiều phần tử

**Events:**
1. **Đăng ký:** `addEventListener()`
2. **Event Object:** `event.target`, `event.key`, etc.
3. **Kiểm soát:** `preventDefault()`, `stopPropagation()`
4. **Kỹ thuật quan trọng:** **Event Delegation**

**Công thức thành công:**
```javascript
// 1. Tìm
const element = document.querySelector('.something');

// 2. Lắng nghe
element.addEventListener('click', (event) => {
    // 3. Xử lý
    console.log('Clicked!');
});
```

Giờ bạn đã hiểu DOM và Events! Hãy thử xây dựng calculator, image slider, hoặc game tic-tac-toe của riêng bạn! 🚀

---

## Tài liệu tham khảo

- [MDN: Document Object Model](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)
- [MDN: Introduction to Events](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events)
- [JavaScript.info: DOM Manipulation](https://javascript.info/document)
- [Web.dev: JavaScript Events Deep Dive](https://web.dev/eventing-deepdive/)
