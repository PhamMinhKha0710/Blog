+++
title = "JavaScript Event Loop: Cốt lõi của JavaScript bất đồng bộ"
date = "2025-09-17"
description = "Tìm hiểu sâu về Event Loop trong JavaScript, cách thức hoạt động và vai trò của nó trong việc xử lý các tác vụ bất đồng bộ"
categories = ["JavaScript"]
tags = ["JavaScript", "Web"]
author = "Phạm Minh Kha"
+++

## JavaScript: Ngôn ngữ đơn luồng với nhiều khả năng bất đồng bộ

JavaScript là một ngôn ngữ lập trình đơn luồng (single-threaded), nghĩa là tại một thời điểm, nó chỉ có thể thực thi một tác vụ trong một luồng duy nhất. Tuy nhiên, JavaScript vẫn có khả năng thực hiện các tác vụ bất đồng bộ như gọi API, đọc file, hoặc xử lý sự kiện người dùng mà không làm chương trình bị "đóng băng".

Điều gì giúp JavaScript đạt được khả năng này? Câu trả lời nằm ở **Event Loop** - cơ chế cốt lõi cho phép JavaScript thực hiện các tác vụ bất đồng bộ mặc dù chỉ có một luồng thực thi.

## Kiến trúc JavaScript Runtime

Để hiểu về Event Loop, chúng ta cần hiểu về kiến trúc của JavaScript Runtime (môi trường chạy JavaScript). Các thành phần chính bao gồm:

1. **Call Stack**: Nơi các hàm được thực thi theo cơ chế LIFO (Last In, First Out)
2. **Heap**: Nơi cấp phát bộ nhớ cho các đối tượng
3. **Web APIs** (trong trình duyệt) / **C++ APIs** (trong Node.js): Cung cấp các chức năng như DOM, AJAX, setTimeout, fs, etc.
4. **Callback Queue** (Task Queue): Nơi chứa các callback sẽ được thực thi
5. **Microtask Queue**: Hàng đợi ưu tiên cao hơn Task Queue
6. **Event Loop**: Cơ chế kiểm tra liên tục Call Stack và Queues

## Call Stack: Nơi code JavaScript được thực thi

Call Stack là một cấu trúc dữ liệu ngăn xếp LIFO (Last In, First Out) được sử dụng để theo dõi vị trí hiện tại của chương trình trong quá trình thực thi. Khi một hàm được gọi, nó được đẩy vào ngăn xếp. Khi hàm thực thi xong, nó được đưa ra khỏi ngăn xếp.

```javascript
function multiply(a, b) {
    return a * b;
}

function square(n) {
    return multiply(n, n);
}

function printSquare(n) {
    const result = square(n);
    console.log(result);
}

printSquare(5);
```

Khi đoạn mã trên chạy, Call Stack sẽ thay đổi như sau:

```
1. Thêm main() (global execution context)
2. Thêm printSquare(5)
3. Thêm square(5)
4. Thêm multiply(5, 5)
5. Xóa multiply(5, 5) - trả về 25
6. Xóa square(5) - trả về 25
7. Thêm console.log(25)
8. Xóa console.log(25)
9. Xóa printSquare(5)
10. Xóa main()
```

### Stack Overflow

Call Stack có kích thước giới hạn. Nếu bạn thêm quá nhiều hàm vào Stack (ví dụ như đệ quy không có điều kiện dừng), bạn sẽ gặp lỗi "Maximum call stack size exceeded" - hay còn gọi là Stack Overflow.

```javascript
function recursiveFunction() {
    recursiveFunction(); // Gọi lại chính nó mà không có điều kiện dừng
}

recursiveFunction(); // Stack Overflow!
```

## Tác vụ bất đồng bộ và Web APIs

Câu hỏi đặt ra là: Làm thế nào JavaScript có thể thực hiện các tác vụ bất đồng bộ nếu nó chỉ có một luồng thực thi? Câu trả lời nằm ở Web APIs (trong trình duyệt) hoặc C++ APIs (trong Node.js).

```javascript
console.log('Start');

setTimeout(() => {
    console.log('Timeout callback');
}, 2000);

console.log('End');
```

Kết quả:
```
Start
End
Timeout callback (sau 2 giây)
```

Điều gì xảy ra trong ví dụ trên:

1. `console.log('Start')` được đẩy vào Call Stack và thực thi
2. `setTimeout()` được đẩy vào Call Stack
3. Trình duyệt khởi chạy bộ đếm thời gian
4. `setTimeout()` được lấy ra khỏi Call Stack
5. `console.log('End')` được đẩy vào Call Stack và thực thi
6. Sau 2 giây, callback được đẩy vào Callback Queue
7. Event Loop kiểm tra xem Call Stack có trống không
8. Nếu Call Stack trống, Event Loop đẩy callback từ Queue vào Call Stack
9. `console.log('Timeout callback')` được thực thi

## Task Queue và Microtask Queue

JavaScript có hai loại hàng đợi chính:

1. **Task Queue (Macrotask Queue)**: Chứa các task từ `setTimeout`, `setInterval`, `setImmediate` (Node.js), I/O operations, UI rendering, etc.
2. **Microtask Queue**: Chứa các microtask từ Promise callbacks (`then`, `catch`, `finally`) và `queueMicrotask()`, `MutationObserver`.

Điều quan trọng là: **Microtask Queue có độ ưu tiên cao hơn Task Queue**. Sau khi thực thi một task, Event Loop sẽ xử lý tất cả các microtask trước khi chuyển sang task tiếp theo.

```javascript
console.log('1 - Script start');

setTimeout(() => {
    console.log('2 - setTimeout callback');
}, 0);

Promise.resolve()
    .then(() => {
        console.log('3 - Promise callback 1');
    })
    .then(() => {
        console.log('4 - Promise callback 2');
    });

console.log('5 - Script end');
```

Kết quả:
```
1 - Script start
5 - Script end
3 - Promise callback 1
4 - Promise callback 2
2 - setTimeout callback
```

### Giải thích:

1. `console.log('1 - Script start')` được thực thi
2. `setTimeout` được thêm vào Web APIs, sau đó callback được đưa vào Task Queue
3. Promise callbacks được thêm vào Microtask Queue
4. `console.log('5 - Script end')` được thực thi
5. Script kết thúc, Call Stack trống
6. Event Loop xử lý tất cả microtask: `console.log('3 - Promise callback 1')` và `console.log('4 - Promise callback 2')`
7. Event Loop chuyển sang Task Queue: `console.log('2 - setTimeout callback')`

## Luồng chạy của Event Loop

Dưới đây là thuật toán đơn giản về cách Event Loop hoạt động:

```javascript
while (true) {
    // Thực thi tất cả các task trong Call Stack
    while (callStack.length > 0) {
        executeCurrentTask();
    }
    
    // Xử lý tất cả các microtask
    while (microtaskQueue.length > 0) {
        executeOldestMicrotask();
    }
    
    // Nếu có task trong Task Queue, đưa task vào Call Stack
    if (taskQueue.length > 0) {
        executeOldestTask();
    }
    
    // Render UI nếu cần
    if (shouldRender()) {
        renderUI();
    }
}
```

## Hiểu sâu hơn về các loại Task

### 1. Macrotasks (Tasks)

- `setTimeout`, `setInterval`
- `setImmediate` (Node.js)
- I/O operations
- UI rendering events
- `MessageChannel`
- `requestAnimationFrame`

### 2. Microtasks

- Promise callbacks (`.then()`, `.catch()`, `.finally()`)
- `queueMicrotask()`
- `MutationObserver` callbacks
- `process.nextTick()` (Node.js, ưu tiên cao nhất)

## Các bẫy phổ biến với Event Loop

### 1. setTimeout(fn, 0) không có nghĩa là "thực thi ngay lập tức"

```javascript
console.log('Before setTimeout');

setTimeout(() => {
    console.log('Inside setTimeout callback');
}, 0);

console.log('After setTimeout');
```

Kết quả:
```
Before setTimeout
After setTimeout
Inside setTimeout callback
```

Mặc dù thời gian chờ là 0ms, callback vẫn phải đợi cho đến khi Call Stack trống.

### 2. Blocking Event Loop

JavaScript là đơn luồng, nếu bạn thực hiện một tác vụ tốn nhiều thời gian, nó sẽ chặn toàn bộ Event Loop, khiến trang web không phản hồi.

```javascript
function blockingOperation() {
    const start = Date.now();
    
    // Giả lập tác vụ nặng trong 3 giây
    while (Date.now() - start < 3000) {
        // Just blocking the thread
    }
}

console.log('Before blocking operation');
blockingOperation();
console.log('After blocking operation'); // Phải đợi 3 giây

// Các sự kiện người dùng như click sẽ bị delay trong 3 giây
```

### 3. Quên rằng Promise callbacks là microtasks

```javascript
console.log('Script start');

setTimeout(() => {
    console.log('setTimeout');
}, 0);

new Promise((resolve, reject) => {
    console.log('Promise executor');
    resolve();
})
.then(() => {
    console.log('Promise then 1');
})
.then(() => {
    console.log('Promise then 2');
});

console.log('Script end');
```

Kết quả:
```
Script start
Promise executor
Script end
Promise then 1
Promise then 2
setTimeout
```

Nhiều người mới học JavaScript có thể nghĩ rằng `setTimeout` sẽ chạy trước Promise callbacks vì cả hai đều là bất đồng bộ và `setTimeout` có delay là 0ms. Tuy nhiên, do Promise callbacks là microtasks nên chúng được xử lý trước các macrotasks như `setTimeout`.

## Event Loop trong Node.js

Event Loop trong Node.js hoạt động tương tự nhưng có một số khác biệt:

1. Node.js sử dụng libuv để implement Event Loop
2. Có thêm các giai đoạn xử lý:
   - **Timers**: Xử lý callbacks từ `setTimeout` và `setInterval`
   - **Pending callbacks**: Xử lý callbacks từ I/O operations
   - **Idle, prepare**: Chỉ sử dụng nội bộ
   - **Poll**: Lấy sự kiện I/O mới, thực thi I/O callbacks
   - **Check**: Xử lý callbacks từ `setImmediate`
   - **Close callbacks**: Xử lý callbacks như `socket.on('close', ...)`

3. `process.nextTick()` có độ ưu tiên cao hơn cả Promises

```javascript
console.log('Script start');

setTimeout(() => {
    console.log('setTimeout');
}, 0);

setImmediate(() => {
    console.log('setImmediate');
});

Promise.resolve().then(() => {
    console.log('Promise then');
});

process.nextTick(() => {
    console.log('process.nextTick');
});

console.log('Script end');
```

Kết quả (trong Node.js):
```
Script start
Script end
process.nextTick
Promise then
setTimeout
setImmediate
```

## Các ví dụ phức tạp để hiểu sâu về Event Loop

### Ví dụ 1: Sự tương tác giữa Call Stack, Microtask Queue và Task Queue

```javascript
console.log('1');

setTimeout(() => {
    console.log('2');
    Promise.resolve().then(() => {
        console.log('3');
    });
}, 0);

new Promise((resolve, reject) => {
    console.log('4');
    resolve('5');
}).then((data) => {
    console.log(data);
    
    Promise.resolve().then(() => {
        console.log('6');
    }).then(() => {
        console.log('7');
        
        setTimeout(() => {
            console.log('8');
        }, 0);
    });
});

setTimeout(() => {
    console.log('9');
    
    Promise.resolve().then(() => {
        console.log('10');
    });
}, 0);

console.log('11');
```

Kết quả:
```
1
4
11
5
6
7
2
3
9
10
8
```

### Giải thích từng bước:

1. `console.log('1')` được thực thi
2. `setTimeout` đầu tiên được đưa vào Web API và sau đó callback vào Task Queue
3. Promise executor với `console.log('4')` được thực thi ngay lập tức
4. `console.log('11')` được thực thi
5. Call Stack trống, Event Loop kiểm tra Microtask Queue:
   - `console.log('5')` được thực thi
   - Promise mới được tạo và `.then()` của nó được đưa vào Microtask Queue
   - `console.log('6')` được thực thi
   - Promise mới và `.then()` của nó được thêm vào Microtask Queue
   - `console.log('7')` được thực thi
   - `setTimeout` mới được đưa vào Web API và callback của nó (với `console.log('8')`) được thêm vào Task Queue
6. Microtask Queue rỗng, Event Loop kiểm tra Task Queue:
   - `console.log('2')` được thực thi từ `setTimeout` đầu tiên
   - Promise mới được thêm vào Microtask Queue
   - `console.log('3')` được thực thi từ Microtask Queue
7. Task Queue tiếp tục:
   - `console.log('9')` được thực thi từ `setTimeout` thứ hai
   - Promise mới được thêm vào Microtask Queue
   - `console.log('10')` được thực thi từ Microtask Queue
8. Task Queue tiếp tục:
   - `console.log('8')` được thực thi từ `setTimeout` trong Promise chain

### Ví dụ 2: Xử lý bất đồng bộ phức tạp với setTimeout và Promise

```javascript
const p1 = Promise.resolve();

const p2 = new Promise((resolve) => {
    setTimeout(() => {
        console.log('Timeout finished');
        resolve('p2 resolved');
    }, 0);
});

(async function() {
    console.log('Script start');
    
    setTimeout(() => {
        console.log('Timeout 1');
    }, 0);
    
    await p1;
    console.log('After await p1');
    
    setTimeout(() => {
        console.log('Timeout 2');
    }, 0);
    
    await p2;
    console.log('After await p2');
    
    Promise.resolve().then(() => {
        console.log('Promise in async');
    });
    
    console.log('End of async function');
})();

console.log('Script end');
```

Kết quả:
```
Script start
Script end
After await p1
Timeout finished
After await p2
End of async function
Promise in async
Timeout 1
Timeout 2
```

## Tối ưu hóa hiệu suất với hiểu biết về Event Loop

Hiểu về Event Loop giúp chúng ta tối ưu hóa hiệu suất của ứng dụng JavaScript:

### 1. Tránh chặn Event Loop

Phân chia các tác vụ nặng thành các phần nhỏ để không chặn Event Loop:

```javascript
// Không tốt - chặn Event Loop
function processLargeArray(array) {
    for (let i = 0; i < array.length; i++) {
        // Xử lý phức tạp cho mỗi phần tử
        heavyProcessing(array[i]);
    }
}

// Tốt hơn - không chặn Event Loop
function processLargeArray(array, index = 0) {
    // Xử lý từng đợt
    const BATCH_SIZE = 100;
    const end = Math.min(index + BATCH_SIZE, array.length);
    
    // Xử lý một đợt
    for (let i = index; i < end; i++) {
        heavyProcessing(array[i]);
    }
    
    // Nếu còn phần tử, lên lịch đợt tiếp theo
    if (end < array.length) {
        setTimeout(() => {
            processLargeArray(array, end);
        }, 0);
    }
}
```

### 2. Sử dụng requestAnimationFrame cho hiệu ứng

```javascript
// Không tốt - có thể gây giật lag
function animateElement() {
    let progress = 0;
    const interval = setInterval(() => {
        progress += 1;
        element.style.transform = `translateX(${progress}px)`;
        
        if (progress >= 1000) {
            clearInterval(interval);
        }
    }, 10);
}

// Tốt hơn - đồng bộ với render frame của trình duyệt
function animateElement() {
    let progress = 0;
    
    function step() {
        progress += 5;
        element.style.transform = `translateX(${progress}px)`;
        
        if (progress < 1000) {
            requestAnimationFrame(step);
        }
    }
    
    requestAnimationFrame(step);
}
```

### 3. Sử dụng Web Workers cho tác vụ tính toán nặng

Web Workers cho phép bạn chạy JavaScript trong một luồng riêng biệt:

```javascript
// main.js
const worker = new Worker('worker.js');

worker.onmessage = function(event) {
    console.log('Kết quả từ worker:', event.data);
};

worker.postMessage({
    numbers: Array.from({ length: 10000000 }, (_, i) => i)
});

// Giao diện người dùng vẫn phản hồi trong khi worker tính toán

// worker.js
self.onmessage = function(event) {
    const { numbers } = event.data;
    
    // Tính toán nặng
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    
    // Gửi kết quả trở lại thread chính
    self.postMessage(sum);
};
```

## Ứng dụng thực tế: Xây dựng công cụ đo hiệu suất

Dưới đây là ví dụ thực tế về một công cụ đo hiệu suất để theo dõi các tác vụ chặn Event Loop:

```javascript
class PerformanceMonitor {
    constructor() {
        this.lastCheckTime = performance.now();
        this.longTaskThreshold = 50; // ms
        this.isRunning = false;
        this.stats = {
            totalChecks: 0,
            blockedChecks: 0,
            maxBlockingTime: 0,
            totalBlockingTime: 0
        };
    }
    
    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.lastCheckTime = performance.now();
        this.scheduleNextCheck();
        
        console.log('Performance monitoring started');
    }
    
    stop() {
        this.isRunning = false;
        console.log('Performance monitoring stopped');
        this.printStats();
    }
    
    scheduleNextCheck() {
        if (!this.isRunning) return;
        
        setTimeout(() => {
            this.checkEventLoopLag();
            this.scheduleNextCheck();
        }, 100); // Kiểm tra mỗi 100ms
    }
    
    checkEventLoopLag() {
        const now = performance.now();
        const elapsedTime = now - this.lastCheckTime;
        
        this.stats.totalChecks++;
        
        // Thời gian chờ trên 100ms + một ngưỡng nhất định => Event Loop bị chặn
        if (elapsedTime > 100 + this.longTaskThreshold) {
            const blockingTime = elapsedTime - 100;
            this.stats.blockedChecks++;
            this.stats.totalBlockingTime += blockingTime;
            this.stats.maxBlockingTime = Math.max(this.stats.maxBlockingTime, blockingTime);
            
            console.warn(`Event Loop bị chặn trong ${blockingTime.toFixed(2)}ms`);
        }
        
        this.lastCheckTime = now;
    }
    
    printStats() {
        const blockedPercentage = (this.stats.blockedChecks / this.stats.totalChecks * 100) || 0;
        
        console.log('--- Performance Stats ---');
        console.log(`Total checks: ${this.stats.totalChecks}`);
        console.log(`Blocked checks: ${this.stats.blockedChecks} (${blockedPercentage.toFixed(2)}%)`);
        console.log(`Max blocking time: ${this.stats.maxBlockingTime.toFixed(2)}ms`);
        console.log(`Total blocking time: ${this.stats.totalBlockingTime.toFixed(2)}ms`);
        console.log('------------------------');
    }
}

// Sử dụng
const monitor = new PerformanceMonitor();
monitor.start();

// Giả lập một tác vụ nặng
setTimeout(() => {
    console.log('Bắt đầu tác vụ nặng');
    const start = performance.now();
    while (performance.now() - start < 500) {
        // Chặn thread trong 500ms
    }
    console.log('Kết thúc tác vụ nặng');
}, 2000);

// Dừng monitoring sau 5 giây
setTimeout(() => {
    monitor.stop();
}, 5000);
```

## Sự khác biệt giữa Event Loop trong các môi trường

### Browser vs Node.js

| Tính năng | Browser | Node.js |
|-----------|---------|---------|
| Engine | V8 (Chrome), SpiderMonkey (Firefox) | V8 |
| Event Loop | Được quản lý bởi browser | Được quản lý bởi libuv |
| Web APIs | DOM, XHR, Fetch, etc. | Không có |
| Node APIs | Không có | fs, http, crypto, etc. |
| nextTick | Không có | process.nextTick() |
| Immediate | Không có | setImmediate() |
| Animation | requestAnimationFrame | Không có |
| Phases | Đơn giản hơn | Nhiều giai đoạn phức tạp |
| Task Types | Macro/Microtasks | Macro/Microtasks + các loại khác |

## Debugging Event Loop

### 1. Sử dụng Chrome DevTools

Chrome DevTools cung cấp Performance tab để phân tích Event Loop:

- Mở DevTools (F12) > Performance
- Nhấp Record và sử dụng trang web
- Dừng recording và phân tích Timeline:
  - Main section hiển thị tác vụ trên main thread
  - Long tasks (màu đỏ) chỉ ra chặn Event Loop
  - Có thể zoom để xem từng frame, tác vụ

### 2. Sử dụng Node.js --inspect

```bash
node --inspect app.js
# Mở chrome://inspect trong Chrome
```

### 3. Sử dụng công cụ mô phỏng Event Loop

[Loupe](http://latentflip.com/loupe) là một công cụ tuyệt vời để trực quan hóa Event Loop và Call Stack.

## Các pattern tối ưu với Event Loop

### 1. Debouncing và Throttling

```javascript
// Debouncing - chỉ kích hoạt function sau một khoảng thời gian không có sự kiện
function debounce(func, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

// Throttling - giới hạn số lần kích hoạt function trong một khoảng thời gian
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Sử dụng
const expensiveCalculation = () => { /* Tính toán phức tạp */ };

// Chỉ tính toán sau khi người dùng ngừng gõ trong 300ms
const debouncedCalculation = debounce(expensiveCalculation, 300);

// Giới hạn tính toán tối đa 1 lần mỗi 100ms
const throttledCalculation = throttle(expensiveCalculation, 100);
```

### 2. Batch DOM updates

```javascript
// Không hiệu quả - nhiều reflow
function updateListItems(items) {
    const list = document.getElementById('list');
    
    items.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        list.appendChild(li); // Gây reflow mỗi lần
    });
}

// Hiệu quả hơn - một reflow duy nhất
function updateListItemsBatch(items) {
    const fragment = document.createDocumentFragment();
    
    items.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        fragment.appendChild(li);
    });
    
    const list = document.getElementById('list');
    list.appendChild(fragment); // Một reflow duy nhất
}
```

### 3. Sử dụng requestIdleCallback cho tác vụ không quan trọng

```javascript
// Chạy code khi browser rảnh rỗi
function nonEssentialTask() {
    // Phân tích dữ liệu, ghi log, v.v.
}

if ('requestIdleCallback' in window) {
    requestIdleCallback(nonEssentialTask, { timeout: 2000 });
} else {
    // Fallback
    setTimeout(nonEssentialTask, 1);
}
```

## Kết luận

Event Loop là trái tim của JavaScript, cho phép ngôn ngữ đơn luồng này thực hiện các tác vụ bất đồng bộ một cách hiệu quả. Hiểu sâu về Event Loop không chỉ giúp bạn giải thích cách code chạy, mà còn cho phép bạn tối ưu hóa ứng dụng để có hiệu suất tốt hơn.

Các khái niệm quan trọng cần nhớ:

1. JavaScript là đơn luồng nhưng có khả năng bất đồng bộ nhờ Event Loop
2. Event Loop liên tục kiểm tra Call Stack và các Queue để thực thi code
3. Microtasks luôn được ưu tiên cao hơn Macrotasks
4. Các tác vụ nặng nên được chia nhỏ để không chặn Event Loop
5. Web Workers có thể được sử dụng cho các tác vụ tính toán phức tạp

Trong bài viết này, chúng ta đã khám phá:
- Kiến trúc JavaScript Runtime và các thành phần chính
- Cách Event Loop hoạt động
- Sự khác biệt giữa Task Queue và Microtask Queue
- Các ví dụ phức tạp để hiểu sâu về Event Loop
- Tối ưu hóa hiệu suất với hiểu biết về Event Loop
- Công cụ đo hiệu suất Event Loop
- Sự khác biệt giữa Event Loop trong browser và Node.js
- Debugging và pattern tối ưu

Hiểu về Event Loop là một kỹ năng thiết yếu đối với bất kỳ lập trình viên JavaScript nghiêm túc nào, đặc biệt khi xây dựng các ứng dụng phức tạp và yêu cầu hiệu suất cao.

## Tài liệu tham khảo

1. [MDN Web Docs: Concurrency model and Event Loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop)
2. [Jake Archibald: Tasks, microtasks, queues and schedules](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)
3. [Node.js Documentation: Event Loop, Timers, and process.nextTick()](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/)
4. [Philip Roberts: What the heck is the event loop anyway?](https://www.youtube.com/watch?v=8aGhZQkoFbQ)
5. [JavaScript Visualized: Event Loop](https://dev.to/lydiahallie/javascript-visualized-event-loop-3dif)





