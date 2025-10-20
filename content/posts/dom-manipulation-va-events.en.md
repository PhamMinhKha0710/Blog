+++
title = "DOM Manipulation and Events in JavaScript: From Zero to Hero"
date = "2025-09-20"
description = "Understanding DOM through practical examples: Bookstore, Remote control, Light switch. From basics to Event Delegation and Performance Optimization"
categories = ["JavaScript"]
tags = ["JavaScript", "Web"]
author = "Pham Minh Kha"
translationKey = "dom-events"
+++

## What is DOM? Imagine HTML as a House!

When you write HTML, the browser doesn't understand HTML as text. It converts HTML into an **object tree** called the **DOM (Document Object Model)** - like a house blueprint!

**Visualization:**
```html
<html>
  <body>
    <h1>Welcome</h1>
    <p>This is a paragraph</p>
  </body>
</html>
```

**Browser sees it like this (DOM tree):**
```
document (The House)
│
└── html (Floor 1)
    └── body (Living Room)
        ├── h1 (Sign: "Welcome")
        └── p (Sofa: "This is a paragraph")
```

### More Complete DOM Diagram

**More complex HTML:**
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

**Corresponding DOM tree:**
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

**Explanation:**
- 🔵 **Element Node** (blue): `<html>`, `<body>`, `<h1>`, `<p>`, etc.
- 📝 **Text Node**: Text content (e.g., "Welcome to My Site")
- 🔗 **Attribute Node**: Attributes like `href="/about"`

---

**JavaScript = The House Repairman:**
- Can **read** the sign (get text)
- Can **change** the sign to "Goodbye"
- Can **add** new tables, chairs
- Can **remove** old furniture
- Can **repaint** (change color, style)

---

## Relationships in DOM Tree - Like a Family!

**HTML Example:**
```html
<div id="family">
  <div id="parent">
    <span id="child1">Child 1</span>
    <span id="child2">Child 2</span>
  </div>
</div>
```

**Family tree diagram:**
```
                    div#family (Grandparent) 👴
                         │
                    parentElement
                         │
                         ↓
                    div#parent (Parent) 👨
                    │          │
            ┌───────┴───┬──────┴────────┐
            │           │               │
         children    children      (may have)
            │           │          more children
            ↓           ↓
      span#child1   span#child2
      (First Child) (Second Child)
          👦            👧
            │           │
            └─ sibling ─┘
         (Siblings)
```

**Family relationships:**

1. **Parent - Child:**
   - `<div id="parent">` is the **parent** of `<span id="child1">`
   - `<span id="child1">` is the **child** of `<div id="parent">`

2. **Sibling:**
   - `child1` and `child2` are **siblings** (same parent)
   - Use `nextSibling` to get next sibling
   - Use `previousSibling` to get previous sibling

3. **Ancestor - Descendant:**
   - `<div id="family">` is the **ancestor** of `child1` (grandparent)
   - `child1` is a **descendant** of `family`

**In JavaScript:**
```javascript
const parent = document.getElementById('parent');
const child1 = document.getElementById('child1');
const child2 = document.getElementById('child2');

// Parent-Child relationship
console.log(parent.children);          // [child1, child2]
console.log(parent.firstChild);        // child1
console.log(parent.lastChild);         // child2
console.log(child1.parentElement);     // div#parent

// Sibling relationship
console.log(child1.nextElementSibling);      // child2
console.log(child2.previousElementSibling);  // child1

// Ancestor-Descendant relationship
console.log(parent.parentElement);     // div#family (grandparent)
console.log(child1.closest('#family')); // Find nearest ancestor
```

**Practical example: Traversing DOM tree**
```javascript
const family = document.getElementById('family');

// Traverse all descendants
function traverseDOM(node, level = 0) {
    const indent = '  '.repeat(level);
    console.log(indent + node.tagName + (node.id ? '#' + node.id : ''));
    
    // Recursively traverse children
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

## Finding DOM Elements - Like Finding Items in a House

### 1. getElementById - Find by House Number

**Practical example:** Find apartment by house number 101

```javascript
// HTML: <div id="house-101">House 101</div>
const house = document.getElementById('house-101');
console.log(house.textContent);  // Output: House 101
```

**Characteristics:**
- ✅ **Fastest** (browser has an "address book" for IDs)
- ✅ Returns only **1 element**
- ⚠️ ID must be **unique** (like house numbers)

---

### 2. getElementsByClassName - Find by Group

**Practical example:** Find all red houses

```javascript
// HTML:
// <div class="red-house">Red House 1</div>
// <div class="red-house">Red House 2</div>
// <div class="blue-house">Blue House</div>

const redHouses = document.getElementsByClassName('red-house');
console.log(redHouses.length);  // Output: 2

// Loop through each house
for (let i = 0; i < redHouses.length; i++) {
    console.log(redHouses[i].textContent);
}
```

**Characteristics:**
- ✅ Returns **multiple elements** (HTMLCollection)
- ⚠️ Result is **"live"** - automatically updates when DOM changes!

**Beware of "live collection":**
```javascript
const items = document.getElementsByClassName('item');
console.log(items.length);  // 5

// Add new item to DOM
document.body.innerHTML += '<div class="item">New</div>';

console.log(items.length);  // 6 (automatically updated!)
```

---

### 3. querySelector - Powerful Search (like Google!)

**Practical example:** Search with complex conditions

```javascript
// Find FIRST red house
const firstRedHouse = document.querySelector('.red-house');

// Find input with type="email"
const emailInput = document.querySelector('input[type="email"]');

// Find button in form
const submitBtn = document.querySelector('form button.submit');

// Find second paragraph in div
const secondP = document.querySelector('div p:nth-child(2)');
```

**Characteristics:**
- ✅ **Most flexible** - uses CSS selector
- ✅ Returns only the **first element** found
- ✅ Result is **not live** (static)

---

### 4. querySelectorAll - Find ALL

```javascript
// Find ALL red houses
const allRedHouses = document.querySelectorAll('.red-house');

// Find all links starting with "https"
const secureLinks = document.querySelectorAll('a[href^="https"]');

// Loop through each element
allRedHouses.forEach(house => {
    console.log(house.textContent);
});
```

**Characteristics:**
- ✅ Returns **NodeList** (array-like)
- ✅ Result is **static** (not automatically updated)
- ✅ Can use `.forEach()`

---

## Comparison of Search Methods

| Method | Search by | Result | Live? | When to use |
|--------|-----------|--------|-------|-------------|
| `getElementById()` | ID | 1 element | No | Find important element (header, form) |
| `querySelector()` | CSS selector | First element | No | **Recommended** (most flexible) |
| `querySelectorAll()` | CSS selector | All | No | Find multiple elements |
| `getElementsByClassName()` | Class | All | **Yes** | Need automatic update (rarely used) |

**Advice:** 
- 🎯 **Use `querySelector()`** for most cases
- 🎯 **Use `querySelectorAll()`** when needing multiple elements

---

## Content Manipulation - Like Writing a Sign

### 1. textContent - Text Only

**Example:** Change store name

```javascript
const storeName = document.querySelector('.store-name');

// Read current name
console.log(storeName.textContent);  // "ABC Store"

// Change to new name
storeName.textContent = "XYZ Super Store";
```

**Characteristics:**
- ✅ **Safe** - doesn't run HTML
- ✅ Gets **all text** (even hidden)

---

### 2. innerHTML - Includes HTML

**Example:** Add menu to store

```javascript
const menu = document.querySelector('.menu');

// Read current HTML
console.log(menu.innerHTML);

// Change entire HTML
menu.innerHTML = `
    <h2>Today's Menu</h2>
    <ul>
        <li>Pho - $3</li>
        <li>Rice - $2.5</li>
    </ul>
`;

// Append to end
menu.innerHTML += '<li>Noodles - $2</li>';
```

**Characteristics:**
- ✅ Powerful - can add complex HTML
- ⚠️ **Dangerous** - vulnerable to XSS attacks if using user data

**XSS Warning:**
```javascript
// ❌ DANGEROUS: If userInput = '<img src=x onerror="alert(1)">'
element.innerHTML = userInput;  // Malicious code will run!

// ✅ SAFE: Use textContent
element.textContent = userInput;  // Only displays text
```

---

## Attribute Manipulation - Like Changing License Plates

**Example:** Change links, images, inputs

```javascript
const link = document.querySelector('a');

// Read attribute
console.log(link.getAttribute('href'));  // "https://google.com"
console.log(link.href);                  // Alternative way (easier)

// Change link
link.setAttribute('href', 'https://facebook.com');
link.href = 'https://facebook.com';  // Alternative way

// Check if attribute exists
console.log(link.hasAttribute('target'));  // false

// Remove attribute
link.removeAttribute('target');
```

**Data attributes (data-*):**
```javascript
// HTML: <div data-user-id="123" data-role="admin">User</div>
const userDiv = document.querySelector('div');

console.log(userDiv.dataset.userId);  // "123"
console.log(userDiv.dataset.role);    // "admin"

// Add data attribute
userDiv.dataset.status = 'active';
// → Creates attribute data-status="active"
```

---

## Creating and Removing Elements - Like Building a New House

### Creating New Elements

**Example:** Add new book to shelf

```javascript
// 1. Create element
const newBook = document.createElement('div');

// 2. Add content
newBook.textContent = 'Harry Potter';

// 3. Add class
newBook.className = 'book fantasy';
// Or: newBook.classList.add('book', 'fantasy');

// 4. Add ID
newBook.id = 'book-101';

// 5. Add attribute
newBook.setAttribute('data-price', '150000');

// 6. Add to DOM
const bookshelf = document.querySelector('.bookshelf');
bookshelf.appendChild(newBook);
```

**Ways to add to DOM:**

```javascript
const parent = document.querySelector('.parent');
const newElement = document.createElement('div');

// Add to end
parent.appendChild(newElement);      // Old way
parent.append(newElement);           // New way (recommended)

// Add to beginning
parent.prepend(newElement);

// Add before another element
const sibling = document.querySelector('.sibling');
sibling.before(newElement);

// Add after another element
sibling.after(newElement);
```

---

### Removing Elements

```javascript
const oldBook = document.getElementById('book-old');

// New way (easiest)
oldBook.remove();

// Old way (still works)
oldBook.parentNode.removeChild(oldBook);
```

---

## Performance: Adding Multiple Elements at Once

**Problem:** Adding 1000 books - SLOW!

**❌ WRONG way (slow):**
```javascript
const bookshelf = document.querySelector('.bookshelf');

for (let i = 0; i < 1000; i++) {
    const book = document.createElement('div');
    book.textContent = `Book ${i}`;
    bookshelf.appendChild(book);  // 1000 Reflows! 💀
}
```

Each `appendChild()`, browser must **recalculate layout** (Reflow) → **Slow as a turtle!** 🐢

---

**✅ CORRECT way (fast): Use DocumentFragment**

```javascript
const bookshelf = document.querySelector('.bookshelf');
const fragment = document.createDocumentFragment();

// Add to fragment (not to real DOM)
for (let i = 0; i < 1000; i++) {
    const book = document.createElement('div');
    book.textContent = `Book ${i}`;
    fragment.appendChild(book);  // No Reflow!
}

// Only 1 Reflow
bookshelf.appendChild(fragment);  // 🚀 Fast!
```

**Practical example:**
```
Without Fragment: 1000 Reflows = 500ms
With Fragment:    1 Reflow      = 5ms

→ 100 times faster! 🚀
```

---

## Changing CSS - Like Repainting a House

### 1. Changing Style Directly

```javascript
const box = document.querySelector('.box');

// Change one property
box.style.color = 'red';
box.style.backgroundColor = 'yellow';  // Note: camelCase!
box.style.padding = '20px';
box.style.border = '2px solid black';

// Read style (only reads inline style)
console.log(box.style.color);  // "red"

// Read computed style
const computed = window.getComputedStyle(box);
console.log(computed.fontSize);      // "16px"
console.log(computed.display);       // "block"
```

**Note:**
- `element.style.backgroundColor` (camelCase)
- `background-color` in CSS → `backgroundColor` in JS

---

### 2. Manipulating CSS Classes (Recommended!)

Instead of changing individual styles, **use classes** to manage!

```javascript
const button = document.querySelector('.button');

// Check if class exists
console.log(button.classList.contains('active'));  // false

// Add class
button.classList.add('active');
button.classList.add('primary', 'large');  // Add multiple at once

// Remove class
button.classList.remove('active');

// Toggle class (remove if exists, add if doesn't)
button.classList.toggle('active');

// Replace class
button.classList.replace('old-class', 'new-class');
```

**Practical example: Toggle dark mode**
```javascript
const toggleBtn = document.querySelector('.theme-toggle');

toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    // Save choice to localStorage
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});
```

---

## Events - Like a Doorbell!

**Imagine:** You install a doorbell and wait for guests to press it

```javascript
const button = document.querySelector('button');

// Install doorbell (register event listener)
button.addEventListener('click', function() {
    console.log('🔔 Someone pressed the button!');
    alert('Hello!');
});
```

**Three steps:**
1. **Find element** (`querySelector`)
2. **Install doorbell** (`addEventListener`)
3. **Define action** (function)

---

### Event Object - Information About the Event

```javascript
const input = document.querySelector('input');

input.addEventListener('keyup', function(event) {
    console.log('Key pressed:', event.key);
    console.log('Key code:', event.keyCode);
    console.log('Current value:', event.target.value);
    
    // Check for Enter key
    if (event.key === 'Enter') {
        console.log('You pressed Enter!');
    }
});
```

**event.target** = Element that was clicked/pressed
**event.currentTarget** = Element that has the event listener

---

### preventDefault - Prevent Default Action

**Example 1: Prevent link navigation**

```javascript
const link = document.querySelector('a');

link.addEventListener('click', function(event) {
    event.preventDefault();  // Don't navigate
    console.log('Link blocked! Going nowhere!');
});
```

**Example 2: Prevent form submission (for validation)**

```javascript
const form = document.querySelector('form');

form.addEventListener('submit', function(event) {
    event.preventDefault();  // Don't submit form
    
    const email = document.querySelector('#email').value;
    
    if (!email.includes('@')) {
        alert('Invalid email!');
    } else {
        console.log('Email OK, submitting form...');
        // Submit using JavaScript (AJAX)
    }
});
```

---

## Event Propagation - Event Bubbling

**Imagine:** You press a button in a room → The whole house knows!

```html
<div id="house">
    <div id="room">
        <button id="button">Click Me</button>
    </div>
</div>
```

When clicking `<button>`, the event **propagates** through 3 phases:

**Event Propagation Diagram:**
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
                     
PHASE 1: CAPTURING (Going Down)
window → document → div#house → div#room → button

PHASE 2: TARGET (Target)
Event reaches the clicked element (button)

PHASE 3: BUBBLING (Bubbling Up)
button → div#room → div#house → document → window
```

### Phase 1: Capturing (Going Down) 🔻

Event starts from `window` → `document` → `house` → `room` → `button`

**Listening in Capturing phase:**
```javascript
// 3rd parameter = true → Listen in Capturing phase
house.addEventListener('click', () => {
    console.log('House - Capturing');
}, true);  // ← true = Capturing!

button.addEventListener('click', () => {
    console.log('Button clicked');
});

// When clicking button, output:
// House - Capturing (runs first!)
// Button clicked
```

### Phase 2: Target (Target) 🎯

Event reaches the exact element clicked (`button`)

### Phase 3: Bubbling (Bubbling Up - Default) 🔺

Event "bubbles up" in reverse: `button` → `room` → `house` → `document` → `window`

**Practical example:**

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

// When clicking button, output:
// 3️⃣ Button clicked!
// 2️⃣ Room clicked!  ← Bubbling!
// 1️⃣ House clicked!  ← Continues bubbling!
```

---

### stopPropagation - Stop Propagation

```javascript
button.addEventListener('click', (event) => {
    console.log('Button clicked!');
    event.stopPropagation();  // Stop right here!
});

room.addEventListener('click', () => {
    console.log('Room clicked!');  // Won't run!
});
```

**Output:**
```
Button clicked!
(Stops, doesn't propagate outward)
```

---

## Event Delegation - The Most Important Technique! 🔥

**Problem:** You have 100 buttons in a list

**Comparison diagram:**

**❌ WRONG - Attach listener to each element:**
```
ul#todo-list
├── li [🎧 listener 1] ← Wastes RAM
├── li [🎧 listener 2] ← Wastes RAM
├── li [🎧 listener 3] ← Wastes RAM
├── ... (97 more listeners)
└── li [🎧 listener 100] ← Wastes RAM

Add new li → ❌ No listener!
```

**✅ CORRECT - Event Delegation:**
```
ul#todo-list [🎧 1 SINGLE LISTENER]
│    ↑
│    │ Bubbling
│    │
├── li (click) ────┘
├── li (click) ────┘
├── li (click) ────┘
├── ...
└── li (click) ────┘

Add new li → ✅ Automatically has listener!
```

---

**❌ WRONG way (slow, wastes RAM):**

```javascript
const buttons = document.querySelectorAll('.item-button');

// Attach 100 event listeners!
buttons.forEach(button => {
    button.addEventListener('click', () => {
        console.log('Button clicked!');
    });
});

// If adding new button → Must attach listener manually!
```

**Problems:**
- 💾 Wastes RAM (100 listeners)
- ❌ Newly added buttons → **No listener**
- 🐌 Slow when adding/removing elements

---

**✅ CORRECT way: Event Delegation**

**Idea:** Attach **1 single listener** to parent, utilizing Event Bubbling!

```javascript
const todoList = document.getElementById('todo-list');

// Only attach 1 listener to <ul>
todoList.addEventListener('click', function(event) {
    // Check if it's a button
    if (event.target.classList.contains('delete-btn')) {
        const item = event.target.closest('li');
        item.remove();
        console.log('Item deleted!');
    }
});
```

**HTML:**
```html
<ul id="todo-list">
    <li>Task 1 <button class="delete-btn">Delete</button></li>
    <li>Task 2 <button class="delete-btn">Delete</button></li>
    <li>Task 3 <button class="delete-btn">Delete</button></li>
</ul>
```

**Benefits:**
- ✅ **1 listener** instead of 100 listeners
- ✅ Newly added buttons → **Automatically have listener**!
- ✅ Saves RAM
- ✅ Easy to maintain

**Practical example:**

```javascript
// HTML:
// <ul id="product-list">
//   <li data-id="1">Product 1 <button class="buy">Buy</button></li>
//   <li data-id="2">Product 2 <button class="buy">Buy</button></li>
// </ul>

const productList = document.getElementById('product-list');

productList.addEventListener('click', (event) => {
    // Check for "Buy" button
    if (event.target.classList.contains('buy')) {
        const productId = event.target.closest('li').dataset.id;
        console.log(`Buy product #${productId}`);
        addToCart(productId);
    }
});

// Add new product → Automatically works!
productList.innerHTML += '<li data-id="3">Product 3 <button class="buy">Buy</button></li>';
```

---

## Common Events

### 🖱️ Mouse Events

```javascript
element.addEventListener('click', () => {});        // Click
element.addEventListener('dblclick', () => {});     // Double click
element.addEventListener('mousedown', () => {});    // Mouse down
element.addEventListener('mouseup', () => {});      // Mouse up
element.addEventListener('mousemove', () => {});    // Mouse move
element.addEventListener('mouseenter', () => {});   // Mouse enter
element.addEventListener('mouseleave', () => {});   // Mouse leave
element.addEventListener('contextmenu', () => {});  // Right click
```

**Example: Track mouse position**

```javascript
document.addEventListener('mousemove', (event) => {
    console.log(`X: ${event.clientX}, Y: ${event.clientY}`);
});
```

---

### ⌨️ Keyboard Events

```javascript
document.addEventListener('keydown', () => {});   // Key down
document.addEventListener('keyup', () => {});     // Key up
document.addEventListener('keypress', () => {});  // Key press and release
```

**Example: Detect Ctrl+S**

```javascript
document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key === 's') {
        event.preventDefault();  // Don't save page
        console.log('Ctrl+S pressed!');
        saveDocument();
    }
});
```

---

### 📝 Form Events

```javascript
form.addEventListener('submit', () => {});   // Form submit
input.addEventListener('focus', () => {});   // Focus
input.addEventListener('blur', () => {});    // Blur
input.addEventListener('change', () => {});  // Change (after blur)
input.addEventListener('input', () => {});   // Change immediately
```

**Example: Real-time validation**

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

### 🌐 Window/Document Events

```javascript
window.addEventListener('load', () => {});              // Page loaded
document.addEventListener('DOMContentLoaded', () => {}); // DOM ready
window.addEventListener('resize', () => {});            // Window resize
window.addEventListener('scroll', () => {});            // Page scroll
window.addEventListener('beforeunload', () => {});      // About to close page
```

**Example: Back to top button**

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

## Practical Application: Todo List App

Let's build a complete Todo List application to apply all the knowledge!

### HTML

```html
<!DOCTYPE html>
<html lang="en">
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
            <p>Daily Task Management</p>
        </div>
        
        <form class="todo-form" id="todo-form">
            <input 
                type="text" 
                id="todo-input" 
                placeholder="Add a todo..."
                autocomplete="off"
            >
            <button type="submit" class="add-button">➕ Add</button>
        </form>
        
        <div class="filters">
            <button class="filter-btn active" data-filter="all">All</button>
            <button class="filter-btn" data-filter="active">Active</button>
            <button class="filter-btn" data-filter="completed">Completed</button>
        </div>
        
        <ul class="todo-list" id="todo-list"></ul>
        
        <div class="stats" id="stats">
            <span id="total-count">0</span> tasks | 
            <span id="completed-count">0</span> completed
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

// 1. Form submission (Add new todo)
todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const text = todoInput.value.trim();
    
    if (text === '') {
        // Highlight input if empty
        todoInput.style.borderColor = 'red';
        setTimeout(() => {
            todoInput.style.borderColor = '#ddd';
        }, 1000);
        return;
    }
    
    // Create new todo
    const newTodo = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    todos.push(newTodo);
    saveToLocalStorage();
    
    // Clear input and re-render
    todoInput.value = '';
    renderTodos();
    updateStats();
});

// 2. Event Delegation for todo list
todoList.addEventListener('click', (e) => {
    const target = e.target;
    const todoItem = target.closest('.todo-item');
    
    if (!todoItem) return;
    
    const todoId = Number(todoItem.dataset.id);
    
    // Delete todo
    if (target.classList.contains('delete-btn')) {
        deleteTodo(todoId);
    }
    // Toggle checkbox
    else if (target.classList.contains('checkbox')) {
        toggleTodo(todoId);
    }
    // Click on text (toggle)
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
            <button class="delete-btn">🗑️ Delete</button>
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
        return 'No todos yet. Add one! 🎉';
    } else if (currentFilter === 'active') {
        return 'No active todos! 👍';
    } else {
        return 'No completed todos! 💪';
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

## Best Practices - Golden Rules

### 1. ✅ Use querySelector instead of getElementById

```javascript
// ❌ Old
const element = document.getElementById('myElement');

// ✅ New (consistent, easier to read)
const element = document.querySelector('#myElement');
```

---

### 2. ✅ Cache DOM queries

```javascript
// ❌ Slow - Query multiple times
function updateUI() {
    document.querySelector('.title').textContent = 'New Title';
    document.querySelector('.title').style.color = 'red';
    document.querySelector('.title').classList.add('active');
}

// ✅ Fast - Query once
function updateUI() {
    const title = document.querySelector('.title');
    title.textContent = 'New Title';
    title.style.color = 'red';
    title.classList.add('active');
}
```

---

### 3. ✅ Use Event Delegation

```javascript
// ❌ Attach listener to each element
buttons.forEach(btn => {
    btn.addEventListener('click', handleClick);
});

// ✅ Attach 1 listener to parent
parent.addEventListener('click', (e) => {
    if (e.target.matches('.button')) {
        handleClick(e);
    }
});
```

---

### 4. ✅ Batch DOM updates

```javascript
// ❌ Multiple Reflows
for (let i = 0; i < 100; i++) {
    list.appendChild(createItem(i));  // 100 Reflows
}

// ✅ 1 single Reflow
const fragment = document.createDocumentFragment();
for (let i = 0; i < 100; i++) {
    fragment.appendChild(createItem(i));
}
list.appendChild(fragment);  // 1 Reflow
```

---

### 5. ✅ Use classList instead of className

```javascript
// ❌ Hard to maintain
element.className = 'active highlight';

// ✅ Easy to maintain
element.classList.add('active', 'highlight');
element.classList.remove('active');
element.classList.toggle('active');
```

---

### 6. ✅ Avoid innerHTML with user data

```javascript
// ❌ DANGEROUS - XSS attack
element.innerHTML = userInput;

// ✅ SAFE
element.textContent = userInput;
```

---

## Summary

**DOM Manipulation:**
1. **Find elements:** Use `querySelector()` and `querySelectorAll()`
2. **Change content:** `textContent` (text) or `innerHTML` (HTML)
3. **Change style:** Use `classList` instead of direct `style`
4. **Create/remove:** `createElement()`, `append()`, `remove()`
5. **Performance:** Use `DocumentFragment` for multiple elements

**Events:**
1. **Register:** `addEventListener()`
2. **Event Object:** `event.target`, `event.key`, etc.
3. **Control:** `preventDefault()`, `stopPropagation()`
4. **Important technique:** **Event Delegation**

**Success formula:**
```javascript
// 1. Find
const element = document.querySelector('.something');

// 2. Listen
element.addEventListener('click', (event) => {
    // 3. Handle
    console.log('Clicked!');
});
```

Now you understand DOM and Events! Try building your own calculator, image slider, or tic-tac-toe game! 🚀

---

## References

- [MDN: Document Object Model](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)
- [MDN: Introduction to Events](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events)
- [JavaScript.info: DOM Manipulation](https://javascript.info/document)
- [Web.dev: JavaScript Events Deep Dive](https://web.dev/eventing-deepdive/)

















