+++
title = "DOM Manipulation và Events trong JavaScript: Tạo trang web động"
date = "2025-09-20"
description = "Tìm hiểu về Document Object Model (DOM), cách thao tác với DOM và xử lý sự kiện trong JavaScript để tạo các trang web động và tương tác"
categories = ["JavaScript"]
tags = ["JavaScript", "Web"]
author = "Phạm Minh Kha"
+++

## Document Object Model (DOM) là gì?

Document Object Model (DOM) là một API cho HTML và XML, cung cấp cấu trúc dạng cây của tài liệu, cho phép ngôn ngữ như JavaScript truy cập và thay đổi cấu trúc, nội dung và kiểu của tài liệu web.

Khi một trang web được tải, trình duyệt tạo ra một mô hình DOM của trang đó. DOM đại diện cho HTML như một cấu trúc cây với các nút (nodes), trong đó mỗi thẻ HTML là một nút phần tử (element node), và văn bản bên trong thẻ là nút văn bản (text node).

### Cấu trúc cây DOM

```
document
└── html
    ├── head
    │   ├── title
    │   │   └── "My Web Page"
    │   └── meta
    └── body
        ├── h1
        │   └── "Welcome"
        ├── p
        │   └── "This is a paragraph"
        └── div
            └── "Content here"
```

Mỗi nút trong cây DOM có các thuộc tính và phương thức cho phép JavaScript tương tác với nó. DOM là cầu nối giúp JavaScript thay đổi nội dung, cấu trúc và kiểu của trang web một cách động.

## Truy cập các phần tử DOM

JavaScript cung cấp nhiều phương thức để truy cập các phần tử DOM:

### 1. getElementById

Truy cập phần tử bằng ID duy nhất:

```javascript
// HTML: <div id="main">Content</div>
const mainDiv = document.getElementById('main');
console.log(mainDiv.textContent); // Output: Content
```

### 2. getElementsByClassName

Truy cập nhiều phần tử bằng tên lớp:

```javascript
// HTML: 
// <p class="highlight">First paragraph</p>
// <p class="highlight">Second paragraph</p>
const highlightedElements = document.getElementsByClassName('highlight');
console.log(highlightedElements.length); // Output: 2
console.log(highlightedElements[0].textContent); // Output: First paragraph
```

### 3. getElementsByTagName

Truy cập các phần tử bằng tên thẻ:

```javascript
const paragraphs = document.getElementsByTagName('p');
for(let i = 0; i < paragraphs.length; i++) {
    console.log(paragraphs[i].textContent);
}
```

### 4. querySelector

Truy cập phần tử đầu tiên khớp với bộ chọn CSS:

```javascript
const firstHighlight = document.querySelector('.highlight');
const mainHeader = document.querySelector('h1.main-header');
const specificInput = document.querySelector('input[type="text"]');
```

### 5. querySelectorAll

Truy cập tất cả các phần tử khớp với bộ chọn CSS:

```javascript
const allHighlights = document.querySelectorAll('.highlight');
const allLinks = document.querySelectorAll('a[href^="https"]'); // Tất cả link bắt đầu bằng https

allHighlights.forEach(element => {
    console.log(element.textContent);
});
```

## Thao tác với nội dung DOM

### Thay đổi nội dung văn bản

```javascript
// Sử dụng textContent - lấy/đặt tất cả văn bản
const heading = document.querySelector('h1');
console.log(heading.textContent); // Lấy nội dung văn bản
heading.textContent = 'New Heading'; // Đặt nội dung văn bản mới

// Sử dụng innerText - tương tự nhưng quan tâm đến kiểu hiển thị CSS
const paragraph = document.querySelector('p');
console.log(paragraph.innerText);
paragraph.innerText = 'Updated paragraph text';
```

### Thay đổi HTML

```javascript
const container = document.querySelector('.container');

// Lấy HTML bên trong
console.log(container.innerHTML);

// Thay đổi HTML bên trong
container.innerHTML = '<h2>New Content</h2><p>This is dynamic HTML</p>';

// Thêm HTML vào cuối
container.innerHTML += '<div class="new-element">Appended element</div>';
```

### Thuộc tính

```javascript
const link = document.querySelector('a');

// Lấy giá trị thuộc tính
console.log(link.getAttribute('href'));
console.log(link.href); // Cũng hoạt động với các thuộc tính chuẩn

// Đặt giá trị thuộc tính
link.setAttribute('href', 'https://example.com');
link.href = 'https://example.com'; // Cách khác

// Kiểm tra sự tồn tại của thuộc tính
console.log(link.hasAttribute('target'));

// Xóa thuộc tính
link.removeAttribute('target');

// Thuộc tính data-*
console.log(link.dataset.info); // Truy cập data-info
link.dataset.testValue = 'abc123'; // Tạo thuộc tính data-test-value
```

## Tạo và xóa phần tử DOM

### Tạo phần tử mới

```javascript
// Tạo phần tử
const newDiv = document.createElement('div');

// Thêm nội dung
newDiv.textContent = 'This is a newly created div';

// Thêm thuộc tính
newDiv.id = 'newElement';
newDiv.className = 'highlight bordered';
newDiv.setAttribute('data-created', 'dynamically');

// Thêm phần tử vào DOM
const container = document.querySelector('.container');
container.appendChild(newDiv);
```

### Xóa phần tử

```javascript
// Xóa phần tử
const elementToRemove = document.getElementById('oldElement');
if (elementToRemove) {
    elementToRemove.parentNode.removeChild(elementToRemove);
}

// Cách hiện đại (không hỗ trợ IE)
elementToRemove.remove();
```

### Thao tác với nhiều phần tử

```javascript
// Tạo phần tử fragment để tối ưu hiệu suất khi thêm nhiều phần tử
const fragment = document.createDocumentFragment();

for (let i = 0; i < 100; i++) {
    const newItem = document.createElement('li');
    newItem.textContent = `Item ${i}`;
    fragment.appendChild(newItem);
}

// Chỉ thực hiện một lần reflow
const list = document.getElementById('myList');
list.appendChild(fragment);
```

## Thay đổi kiểu CSS với JavaScript

### Thay đổi style trực tiếp

```javascript
const element = document.getElementById('myElement');

// Thay đổi một thuộc tính CSS
element.style.color = 'blue';
element.style.backgroundColor = '#f0f0f0'; // Chú ý camelCase thay vì background-color
element.style.padding = '10px';
element.style.border = '1px solid black';

// Đọc giá trị computed style
const computedStyle = window.getComputedStyle(element);
console.log(computedStyle.fontSize);
```

### Thao tác với các lớp CSS

```javascript
const element = document.getElementById('myElement');

// Kiểm tra lớp
console.log(element.classList.contains('active')); // true hoặc false

// Thêm lớp
element.classList.add('highlight');

// Xóa lớp
element.classList.remove('old-class');

// Chuyển đổi lớp (thêm nếu không có, xóa nếu đã có)
element.classList.toggle('visible');

// Thay thế lớp
element.classList.replace('old-class', 'new-class');
```

## Xử lý sự kiện trong JavaScript

Sự kiện (Events) cho phép JavaScript phát hiện và phản ứng với các hành động của người dùng và thay đổi trên trang.

### Đăng ký Event Listener

```javascript
const button = document.querySelector('button');

// Cách 1: Sử dụng addEventListener
button.addEventListener('click', function() {
    console.log('Button clicked!');
    alert('Hello!');
});

// Cách 2: Sử dụng thuộc tính on-event
button.onclick = function() {
    console.log('Button clicked via onclick property!');
};
```

### Tham số Event Object

```javascript
const input = document.querySelector('input');

input.addEventListener('keyup', function(event) {
    console.log('Key pressed:', event.key);
    console.log('Key code:', event.keyCode);
    console.log('Current value:', event.target.value);
    
    // Kiểm tra phím Enter
    if (event.key === 'Enter') {
        alert('You pressed Enter!');
    }
});
```

### Ngăn hành vi mặc định

```javascript
const link = document.querySelector('a');

link.addEventListener('click', function(event) {
    event.preventDefault(); // Ngăn không cho chuyển đến link
    console.log('Link was clicked, but default action was prevented');
});

const form = document.querySelector('form');

form.addEventListener('submit', function(event) {
    event.preventDefault(); // Ngăn không cho gửi form
    console.log('Form submission prevented');
    // Xử lý form với JavaScript
});
```

### Ngừng lan truyền sự kiện

```javascript
// HTML: <div id="outer"><div id="inner"><button>Click me</button></div></div>

const button = document.querySelector('button');
const innerDiv = document.getElementById('inner');
const outerDiv = document.getElementById('outer');

button.addEventListener('click', function(event) {
    console.log('Button clicked');
    event.stopPropagation(); // Ngăn sự kiện lan truyền lên phần tử cha
});

innerDiv.addEventListener('click', function() {
    console.log('Inner div clicked'); // Sẽ không chạy khi nhấn vào button
});

outerDiv.addEventListener('click', function() {
    console.log('Outer div clicked'); // Sẽ không chạy khi nhấn vào button
});
```

### Ủy thác sự kiện (Event Delegation)

Kỹ thuật đăng ký một sự kiện cho phần tử cha thay vì cho từng phần tử con, tận dụng sự lan truyền sự kiện.

```javascript
// HTML:
// <ul id="todoList">
//   <li>Task 1</li>
//   <li>Task 2</li>
//   <li>Task 3</li>
// </ul>

const todoList = document.getElementById('todoList');

// Thay vì đăng ký sự kiện cho từng li
todoList.addEventListener('click', function(event) {
    // Kiểm tra xem phần tử được click có phải là li không
    if (event.target.tagName === 'LI') {
        event.target.classList.toggle('completed');
        console.log('Task toggled:', event.target.textContent);
    }
});

// Thêm task mới sẽ tự động có sự kiện click mà không cần đăng ký thêm
const newTask = document.createElement('li');
newTask.textContent = 'Task 4';
todoList.appendChild(newTask);
```

## Các sự kiện phổ biến

### Sự kiện chuột

```javascript
element.addEventListener('click', handleClick); // Khi nhấp chuột
element.addEventListener('dblclick', handleDoubleClick); // Khi nhấp đúp chuột
element.addEventListener('mousedown', handleMouseDown); // Khi nhấn nút chuột xuống
element.addEventListener('mouseup', handleMouseUp); // Khi thả nút chuột
element.addEventListener('mousemove', handleMouseMove); // Khi di chuyển chuột
element.addEventListener('mouseover', handleMouseOver); // Khi chuột di chuyển vào phần tử
element.addEventListener('mouseout', handleMouseOut); // Khi chuột di chuyển ra khỏi phần tử
element.addEventListener('contextmenu', handleRightClick); // Khi nhấp chuột phải
```

### Sự kiện bàn phím

```javascript
document.addEventListener('keydown', handleKeyDown); // Khi nhấn phím xuống
document.addEventListener('keyup', handleKeyUp); // Khi thả phím
document.addEventListener('keypress', handleKeyPress); // Khi nhấn và thả phím
```

### Sự kiện form

```javascript
form.addEventListener('submit', handleSubmit); // Khi form được gửi
input.addEventListener('focus', handleFocus); // Khi phần tử nhận focus
input.addEventListener('blur', handleBlur); // Khi phần tử mất focus
input.addEventListener('change', handleChange); // Khi giá trị thay đổi và mất focus
input.addEventListener('input', handleInput); // Khi giá trị thay đổi ngay lập tức
```

### Sự kiện document/window

```javascript
window.addEventListener('load', handleLoad); // Khi trang và tài nguyên đã tải xong
document.addEventListener('DOMContentLoaded', handleDOMLoaded); // Khi DOM đã tải xong (không đợi hình ảnh)
window.addEventListener('resize', handleResize); // Khi cửa sổ thay đổi kích thước
window.addEventListener('scroll', handleScroll); // Khi cuộn trang
window.addEventListener('beforeunload', handleBeforeUnload); // Trước khi trang được đóng
```

## Ví dụ thực tế: Xây dựng ứng dụng Todo List

Hãy xây dựng một ứng dụng Todo List đơn giản để minh họa các khái niệm DOM và sự kiện:

### HTML

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Todo App</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        h1 {
            text-align: center;
            color: #333;
        }
        
        .todo-form {
            display: flex;
            margin-bottom: 20px;
        }
        
        #todo-input {
            flex-grow: 1;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px 0 0 4px;
            font-size: 16px;
        }
        
        .add-button {
            background: #4CAF50;
            color: white;
            border: none;
            padding: 10px 15px;
            cursor: pointer;
            border-radius: 0 4px 4px 0;
            font-size: 16px;
        }
        
        .todo-list {
            list-style-type: none;
            padding: 0;
        }
        
        .todo-item {
            padding: 10px 15px;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .todo-item:hover {
            background-color: #f9f9f9;
        }
        
        .completed {
            text-decoration: line-through;
            color: #888;
        }
        
        .delete-btn {
            background: #ff4d4d;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 5px 10px;
            cursor: pointer;
        }
        
        .empty-message {
            text-align: center;
            color: #888;
            font-style: italic;
        }
        
        .filters {
            display: flex;
            justify-content: center;
            margin: 20px 0 10px;
        }
        
        .filter-btn {
            background: #f1f1f1;
            border: 1px solid #ddd;
            padding: 5px 10px;
            margin: 0 5px;
            cursor: pointer;
        }
        
        .filter-btn.active {
            background: #4CAF50;
            color: white;
            border-color: #4CAF50;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Todo App</h1>
        
        <form class="todo-form" id="todo-form">
            <input type="text" id="todo-input" placeholder="Thêm việc cần làm...">
            <button type="submit" class="add-button">Thêm</button>
        </form>
        
        <div class="filters">
            <button class="filter-btn active" data-filter="all">Tất cả</button>
            <button class="filter-btn" data-filter="active">Đang làm</button>
            <button class="filter-btn" data-filter="completed">Đã xong</button>
        </div>
        
        <ul class="todo-list" id="todo-list">
            <li class="empty-message">Không có việc cần làm. Thêm việc mới!</li>
        </ul>
    </div>
    
    <script src="app.js"></script>
</body>
</html>
```

### JavaScript (app.js)

```javascript
// DOM Elements
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const emptyMessage = document.querySelector('.empty-message');
const filterButtons = document.querySelectorAll('.filter-btn');

// App state
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    renderTodos();
    
    // Form submission event
    todoForm.addEventListener('submit', addTodo);
    
    // Todo list event delegation
    todoList.addEventListener('click', handleTodoClick);
    
    // Filter buttons
    document.querySelector('.filters').addEventListener('click', handleFilterClick);
});

// Functions
function addTodo(e) {
    e.preventDefault();
    
    const todoText = todoInput.value.trim();
    
    if (todoText === '') {
        // Highlight the input with error
        todoInput.classList.add('error');
        setTimeout(() => todoInput.classList.remove('error'), 1000);
        return;
    }
    
    // Create new todo object
    const newTodo = {
        id: Date.now(),
        text: todoText,
        completed: false
    };
    
    // Add to todo array
    todos.push(newTodo);
    
    // Save to localStorage
    saveToLocalStorage();
    
    // Clear input
    todoInput.value = '';
    
    // Render todos
    renderTodos();
}

function handleTodoClick(e) {
    const item = e.target;
    
    // Check if the delete button was clicked
    if (item.classList.contains('delete-btn')) {
        const todoId = Number(item.parentElement.dataset.id);
        removeTodo(todoId);
    }
    // Check if the todo text was clicked
    else if (item.classList.contains('todo-item') || item.parentElement.classList.contains('todo-item')) {
        const todoElement = item.classList.contains('todo-item') ? item : item.parentElement;
        const todoId = Number(todoElement.dataset.id);
        toggleComplete(todoId);
    }
}

function handleFilterClick(e) {
    if (e.target.classList.contains('filter-btn')) {
        // Update active filter button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        
        // Set current filter
        currentFilter = e.target.dataset.filter;
        
        // Re-render todos
        renderTodos();
    }
}

function toggleComplete(id) {
    todos = todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, completed: !todo.completed };
        }
        return todo;
    });
    
    saveToLocalStorage();
    renderTodos();
}

function removeTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveToLocalStorage();
    renderTodos();
}

function saveToLocalStorage() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function renderTodos() {
    // Filter todos based on current filter
    let filteredTodos = todos;
    
    if (currentFilter === 'active') {
        filteredTodos = todos.filter(todo => !todo.completed);
    } else if (currentFilter === 'completed') {
        filteredTodos = todos.filter(todo => todo.completed);
    }
    
    // Clear list
    while (todoList.firstChild) {
        todoList.removeChild(todoList.firstChild);
    }
    
    // Show empty message if no todos
    if (filteredTodos.length === 0) {
        const message = document.createElement('li');
        message.className = 'empty-message';
        message.textContent = currentFilter === 'all' 
            ? 'Không có việc cần làm. Thêm việc mới!' 
            : (currentFilter === 'active' 
                ? 'Không có việc đang làm.' 
                : 'Không có việc đã hoàn thành.');
        todoList.appendChild(message);
    } else {
        // Render todo items
        filteredTodos.forEach(todo => {
            const todoItem = document.createElement('li');
            todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            todoItem.setAttribute('data-id', todo.id);
            
            todoItem.innerHTML = `
                <span class="todo-text">${todo.text}</span>
                <button class="delete-btn">Xóa</button>
            `;
            
            todoList.appendChild(todoItem);
        });
    }
}
```

## Các kỹ thuật DOM hiệu quả

### 1. Tối ưu hóa thao tác DOM

```javascript
// Tránh reflow liên tục
function addManyItems(numItems) {
    // Không hiệu quả - gây nhiều reflow
    const list = document.getElementById('myList');
    for (let i = 0; i < numItems; i++) {
        list.innerHTML += `<li>Item ${i}</li>`;  // Gây reflow mỗi lần lặp
    }
    
    // Hiệu quả hơn - một reflow duy nhất
    const list = document.getElementById('myList');
    let html = '';
    for (let i = 0; i < numItems; i++) {
        html += `<li>Item ${i}</li>`;
    }
    list.innerHTML = html;
    
    // Hiệu quả nhất - sử dụng DocumentFragment
    const list = document.getElementById('myList');
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < numItems; i++) {
        const li = document.createElement('li');
        li.textContent = `Item ${i}`;
        fragment.appendChild(li);
    }
    list.appendChild(fragment); // Một reflow duy nhất
}
```

### 2. Tránh DOM traversal

```javascript
// Không hiệu quả - duyệt DOM nhiều lần
function inefficientDOMTraversal() {
    const header = document.querySelector('header');
    const nav = document.querySelector('header nav');
    const logo = document.querySelector('header nav .logo');
    const menuItems = document.querySelectorAll('header nav .menu li');
}

// Hiệu quả hơn - tái sử dụng các phần tử đã tìm thấy
function efficientDOMTraversal() {
    const header = document.querySelector('header');
    const nav = header.querySelector('nav');
    const logo = nav.querySelector('.logo');
    const menuItems = nav.querySelectorAll('.menu li');
}
```

## Kết luận

DOM Manipulation và Event Handling là các kỹ năng cốt lõi trong phát triển web phía client với JavaScript. Hiểu và áp dụng đúng các kỹ thuật này giúp xây dựng các trang web động, tương tác và thân thiện với người dùng.

Trong bài viết này, chúng ta đã tìm hiểu:
- Cơ bản về Document Object Model (DOM)
- Cách truy cập các phần tử DOM
- Thao tác với nội dung, thuộc tính và kiểu CSS
- Tạo và xóa phần tử DOM
- Xử lý sự kiện trong JavaScript
- Xây dựng ứng dụng Todo List thực tế
- Các kỹ thuật tối ưu DOM

Hiểu biết này là nền tảng cho việc phát triển ứng dụng web hiện đại, kể cả khi sử dụng các thư viện và framework như React, Vue hoặc Angular.

## Tài liệu tham khảo

1. [MDN Web Docs: Document Object Model (DOM)](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)
2. [MDN Web Docs: Introduction to events](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events)
3. [JavaScript.info: DOM Manipulation](https://javascript.info/document)
4. "Eloquent JavaScript" - Marijn Haverbeke (Chapter on DOM)
5. "JavaScript: The Definitive Guide" - David Flanagan





