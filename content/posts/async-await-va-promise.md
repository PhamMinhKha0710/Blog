+++
title = "Async/Await và Promise trong JavaScript: Lập trình bất đồng bộ hiện đại"
date = "2025-09-18"
description = "Tìm hiểu sâu về Promise, Async/Await và cách sử dụng để xử lý các tác vụ bất đồng bộ trong JavaScript một cách hiệu quả"
categories = ["JavaScript"]
tags = ["JavaScript", "Web"]
author = "Phạm Minh Kha"
+++

## Tại sao cần Lập trình bất đồng bộ?

JavaScript vốn là một ngôn ngữ đơn luồng (single-threaded), nghĩa là tại một thời điểm chỉ có thể thực thi một lệnh. Tuy nhiên, nhiều hoạt động trong web có thể mất thời gian như:

- Gọi API từ server
- Truy cập cơ sở dữ liệu
- Đọc/ghi file (trong Node.js)
- Tải tài nguyên (hình ảnh, video, script...)
- Thiết lập hẹn giờ

Nếu JavaScript thực hiện các tác vụ này một cách đồng bộ (synchronous), trình duyệt sẽ bị "đóng băng" cho đến khi tác vụ hoàn thành. Lập trình bất đồng bộ (asynchronous) giải quyết vấn đề này bằng cách cho phép code tiếp tục chạy trong khi đợi các tác vụ dài hoàn thành.

## Callback: Phương pháp truyền thống

Trước khi có Promise và Async/Await, JavaScript sử dụng callbacks để xử lý code bất đồng bộ:

```javascript
console.log("Bắt đầu");

setTimeout(function() {
    console.log("Đã trôi qua 2 giây");
}, 2000);

console.log("Kết thúc");

// Output:
// Bắt đầu
// Kết thúc
// Đã trôi qua 2 giây
```

Tuy nhiên, callbacks có nhiều vấn đề khi code phức tạp hơn, đặc biệt là "callback hell":

```javascript
getUser(function(user) {
    getProfile(user.id, function(profile) {
        getPosts(profile.id, function(posts) {
            getFriends(profile.id, function(friends) {
                displayUserInfo(user, profile, posts, friends);
            }, handleError);
        }, handleError);
    }, handleError);
}, handleError);
```

Code như trên rất khó đọc, khó bảo trì và dễ gây lỗi. Đây là lý do Promise và sau đó là Async/Await ra đời.

## Promise: Cách tiếp cận hiện đại hơn

Promise là một đối tượng đại diện cho sự hoàn thành hoặc thất bại của một hoạt động bất đồng bộ. Một Promise có thể ở một trong ba trạng thái:

1. **Pending**: Trạng thái ban đầu, chưa hoàn thành hoặc bị từ chối
2. **Fulfilled**: Hoạt động hoàn thành thành công
3. **Rejected**: Hoạt động thất bại

### Tạo Promise

```javascript
const myPromise = new Promise((resolve, reject) => {
    // Thực hiện hoạt động bất đồng bộ
    const success = true; // Giả sử hoạt động thành công
    
    if (success) {
        resolve("Hoạt động thành công!"); // Thành công
    } else {
        reject("Có lỗi xảy ra!"); // Thất bại
    }
});
```

### Sử dụng Promise

```javascript
myPromise
    .then((result) => {
        console.log(result); // "Hoạt động thành công!"
    })
    .catch((error) => {
        console.error(error); // Chỉ chạy khi có lỗi
    })
    .finally(() => {
        console.log("Hoàn thành Promise"); // Luôn chạy dù thành công hay thất bại
    });
```

### Chuỗi Promise

Một trong những ưu điểm lớn của Promise là khả năng tạo chuỗi:

```javascript
getUser(userId)
    .then(user => getProfile(user.id))
    .then(profile => getPosts(profile.id))
    .then(posts => {
        console.log("Posts:", posts);
        return posts;
    })
    .catch(error => {
        console.error("Có lỗi:", error);
    });
```

### Các phương thức tĩnh của Promise

#### Promise.all()

Thực thi nhiều Promise đồng thời và đợi tất cả hoàn thành:

```javascript
const promise1 = fetch('/api/users');
const promise2 = fetch('/api/posts');
const promise3 = fetch('/api/comments');

Promise.all([promise1, promise2, promise3])
    .then(responses => {
        // Mảng responses chứa kết quả theo thứ tự của các promise
        return Promise.all(responses.map(res => res.json()));
    })
    .then(data => {
        const [users, posts, comments] = data;
        console.log('Users:', users);
        console.log('Posts:', posts);
        console.log('Comments:', comments);
    })
    .catch(error => {
        // Nếu bất kỳ promise nào bị reject, catch sẽ được gọi
        console.error('Có ít nhất một request thất bại:', error);
    });
```

#### Promise.race()

Trả về kết quả của Promise đầu tiên hoàn thành (dù thành công hay thất bại):

```javascript
const promise1 = new Promise(resolve => setTimeout(() => resolve('First'), 500));
const promise2 = new Promise(resolve => setTimeout(() => resolve('Second'), 100));

Promise.race([promise1, promise2])
    .then(result => console.log(result)); // "Second"
```

#### Promise.allSettled()

Đợi tất cả Promise hoàn thành (dù thành công hay thất bại) và trả về trạng thái của từng Promise:

```javascript
const promise1 = Promise.resolve('Success');
const promise2 = Promise.reject('Failure');

Promise.allSettled([promise1, promise2])
    .then(results => {
        console.log(results);
        // [
        //   { status: 'fulfilled', value: 'Success' },
        //   { status: 'rejected', reason: 'Failure' }
        // ]
    });
```

#### Promise.any()

Trả về kết quả của Promise đầu tiên thành công:

```javascript
const promise1 = new Promise((resolve, reject) => setTimeout(() => reject('Error 1'), 100));
const promise2 = new Promise((resolve) => setTimeout(() => resolve('Success'), 200));
const promise3 = new Promise((resolve, reject) => setTimeout(() => reject('Error 3'), 300));

Promise.any([promise1, promise2, promise3])
    .then(result => console.log(result)) // "Success"
    .catch(error => console.error(error)); // Không chạy vì promise2 thành công
```

## Async/Await: Cú pháp hiện đại nhất

Async/Await là cú pháp "syntactic sugar" cho Promise, giúp code bất đồng bộ đọc như code đồng bộ, dễ hiểu hơn.

### Khai báo hàm async

```javascript
async function fetchData() {
    // Code bên trong hàm async
    return "Dữ liệu"; // Tự động được bọc trong Promise.resolve()
}

// Hàm async luôn trả về Promise
fetchData().then(data => console.log(data)); // "Dữ liệu"
```

### Từ khóa await

```javascript
async function fetchUserData() {
    try {
        // await tạm dừng hàm cho đến khi Promise được giải quyết
        const response = await fetch('https://api.example.com/users');
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const userData = await response.json();
        return userData;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error; // Re-throw để có thể bắt lỗi ở nơi gọi hàm
    }
}
```

### So sánh với Promise chains

Xét ví dụ lấy thông tin người dùng, bài viết và bình luận:

```javascript
// Sử dụng Promise chains
function getUserInfo(userId) {
    return getUser(userId)
        .then(user => {
            return getProfile(user.id)
                .then(profile => {
                    return getPosts(profile.id)
                        .then(posts => {
                            return {
                                user,
                                profile,
                                posts
                            };
                        });
                });
        });
}

// Sử dụng async/await
async function getUserInfo(userId) {
    const user = await getUser(userId);
    const profile = await getProfile(user.id);
    const posts = await getPosts(profile.id);
    
    return {
        user,
        profile,
        posts
    };
}
```

Rõ ràng, phiên bản async/await ngắn gọn và dễ đọc hơn nhiều.

## Xử lý lỗi trong Async/Await

### Sử dụng try/catch

```javascript
async function fetchData() {
    try {
        const response = await fetch('https://api.example.com/data');
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error; // Re-throw để caller có thể xử lý
    }
}

// Sử dụng
async function handleData() {
    try {
        const data = await fetchData();
        displayData(data);
    } catch (error) {
        showErrorToUser('Không thể tải dữ liệu. Vui lòng thử lại sau.');
    }
}
```

### Catch ở hàm gọi

```javascript
async function fetchData() {
    const response = await fetch('https://api.example.com/data');
    
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return response.json();
}

// Bắt lỗi ở nơi gọi hàm
fetchData()
    .then(data => displayData(data))
    .catch(error => showErrorToUser('Không thể tải dữ liệu'));
```

## Parallel và Sequential Execution

### Thực thi tuần tự (Sequential)

```javascript
async function sequentialFetch() {
    console.time('sequential');
    
    // Các request được thực hiện lần lượt
    const users = await fetchUsers();
    const posts = await fetchPosts();
    const comments = await fetchComments();
    
    console.timeEnd('sequential');
    return { users, posts, comments };
}
```

### Thực thi song song (Parallel)

```javascript
async function parallelFetch() {
    console.time('parallel');
    
    // Bắt đầu các request cùng lúc
    const usersPromise = fetchUsers();
    const postsPromise = fetchPosts();
    const commentsPromise = fetchComments();
    
    // Đợi tất cả hoàn thành
    const users = await usersPromise;
    const posts = await postsPromise;
    const comments = await commentsPromise;
    
    console.timeEnd('parallel');
    return { users, posts, comments };
}

// Hoặc sử dụng Promise.all
async function parallelFetchWithPromiseAll() {
    console.time('parallelAll');
    
    const [users, posts, comments] = await Promise.all([
        fetchUsers(),
        fetchPosts(),
        fetchComments()
    ]);
    
    console.timeEnd('parallelAll');
    return { users, posts, comments };
}
```

## Xử lý các trường hợp phức tạp

### Timeout cho Promise

```javascript
// Promise với timeout
function promiseWithTimeout(promise, timeoutMs) {
    // Tạo promise sẽ reject sau timeoutMs
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
            reject(new Error(`Operation timed out after ${timeoutMs} ms`));
        }, timeoutMs);
    });
    
    // Trả về promise đầu tiên hoàn thành (hoặc timeout)
    return Promise.race([promise, timeoutPromise]);
}

// Sử dụng
async function fetchWithTimeout() {
    try {
        const result = await promiseWithTimeout(
            fetch('https://api.example.com/data'),
            5000 // 5 giây timeout
        );
        
        return await result.json();
    } catch (error) {
        console.error('Error or timeout:', error);
        throw error;
    }
}
```

### Thử lại (Retry) khi thất bại

```javascript
async function fetchWithRetry(url, options = {}, retries = 3, delay = 1000) {
    try {
        return await fetch(url, options);
    } catch (error) {
        if (retries <= 1) {
            throw error;
        }
        
        // Đợi trước khi thử lại
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Thử lại với số lần giảm đi 1
        return fetchWithRetry(url, options, retries - 1, delay * 2);
    }
}

// Sử dụng
async function getData() {
    try {
        const response = await fetchWithRetry('https://api.example.com/data');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Failed after retries:', error);
        throw error;
    }
}
```

## Xử lý vòng lặp bất đồng bộ

### Lặp tuần tự

```javascript
async function processItemsSequentially(items) {
    const results = [];
    
    for (const item of items) {
        // Xử lý từng item một, đợi cái trước hoàn thành mới đến cái sau
        const result = await processItem(item);
        results.push(result);
    }
    
    return results;
}
```

### Lặp song song

```javascript
async function processItemsInParallel(items) {
    // Tạo mảng các promises
    const promises = items.map(item => processItem(item));
    
    // Đợi tất cả hoàn thành
    return Promise.all(promises);
}
```

### Lặp với số lượng đồng thời giới hạn

```javascript
async function processItemsWithConcurrencyLimit(items, limit = 3) {
    const results = [];
    const inProgress = new Set();
    
    for (const item of items) {
        // Tạo promise xử lý item
        const promise = processItem(item)
            .then(result => {
                inProgress.delete(promise);
                return result;
            });
        
        // Thêm vào danh sách đang xử lý
        inProgress.add(promise);
        results.push(promise);
        
        // Nếu đạt giới hạn, đợi ít nhất một promise hoàn thành
        if (inProgress.size >= limit) {
            await Promise.race(inProgress);
        }
    }
    
    // Đợi tất cả hoàn thành
    return Promise.all(results);
}
```

## Ví dụ thực tế: Xây dựng Image Gallery với Lazy Loading

Dưới đây là ví dụ về ứng dụng thực tế sử dụng Async/Await và Promise để tạo một thư viện ảnh với tính năng tải lười (lazy loading):

### HTML

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Async Image Gallery</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f7f7f7;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        h1 {
            text-align: center;
            color: #333;
            margin-bottom: 30px;
        }
        
        .gallery {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            grid-gap: 20px;
        }
        
        .image-card {
            background-color: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
        }
        
        .image-card:hover {
            transform: translateY(-5px);
        }
        
        .image-container {
            height: 200px;
            overflow: hidden;
            position: relative;
        }
        
        .placeholder {
            width: 100%;
            height: 100%;
            background-color: #e0e0e0;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .spinner {
            width: 30px;
            height: 30px;
            border: 3px solid rgba(0,0,0,0.1);
            border-radius: 50%;
            border-top-color: #3498db;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        .gallery-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: opacity 0.5s ease;
            opacity: 0;
        }
        
        .loaded {
            opacity: 1;
        }
        
        .image-info {
            padding: 15px;
        }
        
        .image-title {
            margin: 0 0 10px 0;
            font-weight: 500;
        }
        
        .image-author {
            margin: 0;
            color: #666;
            font-size: 0.9em;
        }
        
        .load-more {
            display: block;
            width: 200px;
            margin: 30px auto;
            padding: 12px 0;
            background-color: #3498db;
            color: white;
            text-align: center;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.3s;
        }
        
        .load-more:hover {
            background-color: #2980b9;
        }
        
        .error-message {
            color: #e74c3c;
            text-align: center;
            padding: 20px;
        }
        
        .hidden {
            display: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Thư viện ảnh bất đồng bộ</h1>
        <div class="gallery" id="gallery"></div>
        <button class="load-more" id="load-more">Tải thêm</button>
        <div class="error-message hidden" id="error-message"></div>
    </div>
    
    <script src="gallery.js"></script>
</body>
</html>
```

### JavaScript (gallery.js)

```javascript
// Constants
const UNSPLASH_API = 'https://api.unsplash.com';
const ACCESS_KEY = 'YOUR_UNSPLASH_ACCESS_KEY'; // Thay bằng API key của bạn
const IMAGES_PER_PAGE = 12;

// DOM Elements
const gallery = document.getElementById('gallery');
const loadMoreButton = document.getElementById('load-more');
const errorMessage = document.getElementById('error-message');

// State
let page = 1;
let isLoading = false;

// Event Listeners
document.addEventListener('DOMContentLoaded', init);
loadMoreButton.addEventListener('click', loadMoreImages);

// Initialize the gallery
async function init() {
    try {
        await loadImages();
        setupIntersectionObserver();
    } catch (error) {
        showError('Không thể tải ảnh. Vui lòng thử lại sau.');
    }
}

// Fetch images from Unsplash
async function fetchImages(page = 1, perPage = IMAGES_PER_PAGE) {
    const url = `${UNSPLASH_API}/photos/random?count=${perPage}&client_id=${ACCESS_KEY}`;
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching images:', error);
        throw error;
    }
}

// Load images into gallery
async function loadImages() {
    if (isLoading) return;
    
    isLoading = true;
    showLoadingState();
    
    try {
        const images = await fetchImages(page);
        
        // Create image cards and add to gallery
        images.forEach(image => {
            const card = createImageCard(image);
            gallery.appendChild(card);
        });
        
        page++;
        hideError();
    } catch (error) {
        showError('Không thể tải ảnh. Vui lòng thử lại sau.');
    } finally {
        isLoading = false;
        hideLoadingState();
    }
}

// Load more images when button is clicked
function loadMoreImages() {
    loadImages();
}

// Create image card element
function createImageCard(image) {
    const card = document.createElement('div');
    card.className = 'image-card';
    
    card.innerHTML = `
        <div class="image-container">
            <div class="placeholder">
                <div class="spinner"></div>
            </div>
            <img 
                class="gallery-image" 
                data-src="${image.urls.regular}" 
                alt="${image.alt_description || 'Unsplash Image'}"
            >
        </div>
        <div class="image-info">
            <h3 class="image-title">${truncateText(image.description || 'Untitled', 30)}</h3>
            <p class="image-author">By ${image.user.name}</p>
        </div>
    `;
    
    return card;
}

// Helper function to truncate text
function truncateText(text, maxLength) {
    if (!text) return '';
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
}

// Setup Intersection Observer for lazy loading
function setupIntersectionObserver() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.dataset.src;
                    
                    if (src) {
                        loadImage(img, src)
                            .then(() => {
                                img.classList.add('loaded');
                                observer.unobserve(img);
                            })
                            .catch(error => console.error('Error loading image:', error));
                    }
                }
            });
        }, {
            rootMargin: '100px',
            threshold: 0.1
        });
        
        // Observe all images
        document.querySelectorAll('.gallery-image').forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers that don't support Intersection Observer
        loadAllImages();
    }
}

// Promise-based image loading
function loadImage(imgElement, src) {
    return new Promise((resolve, reject) => {
        imgElement.onload = () => {
            // Remove placeholder after image is loaded
            const placeholder = imgElement.previousElementSibling;
            if (placeholder && placeholder.classList.contains('placeholder')) {
                placeholder.style.display = 'none';
            }
            resolve();
        };
        
        imgElement.onerror = reject;
        imgElement.src = src;
    });
}

// Fallback: Load all images at once
function loadAllImages() {
    document.querySelectorAll('.gallery-image').forEach(img => {
        const src = img.dataset.src;
        if (src) {
            loadImage(img, src)
                .then(() => img.classList.add('loaded'))
                .catch(error => console.error('Error loading image:', error));
        }
    });
}

// Show/hide loading state
function showLoadingState() {
    loadMoreButton.textContent = 'Đang tải...';
    loadMoreButton.disabled = true;
}

function hideLoadingState() {
    loadMoreButton.textContent = 'Tải thêm';
    loadMoreButton.disabled = false;
}

// Error handling
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
}

function hideError() {
    errorMessage.classList.add('hidden');
}
```

## Các Best Practices khi sử dụng Promise và Async/Await

### 1. Luôn xử lý lỗi

```javascript
// Không tốt - không xử lý lỗi
async function fetchData() {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
}

// Tốt - sử dụng try/catch
async function fetchData() {
    try {
        const response = await fetch('/api/data');
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Re-throw để caller có thể xử lý
    }
}
```

### 2. Tránh await không cần thiết

```javascript
// Không hiệu quả - đợi tuần tự không cần thiết
async function getResources() {
    const users = await fetchUsers();
    const posts = await fetchPosts(); // Chờ users xong mới bắt đầu
    return { users, posts };
}

// Hiệu quả - bắt đầu song song
async function getResources() {
    const usersPromise = fetchUsers();
    const postsPromise = fetchPosts(); // Bắt đầu ngay không đợi users
    
    const users = await usersPromise;
    const posts = await postsPromise;
    
    return { users, posts };
}

// Hoặc dùng Promise.all
async function getResources() {
    const [users, posts] = await Promise.all([
        fetchUsers(),
        fetchPosts()
    ]);
    
    return { users, posts };
}
```

### 3. Tránh dùng hàm async không cần thiết

```javascript
// Không cần thiết - chỉ return Promise.resolve
async function getData() {
    return "data";
}

// Đơn giản hơn, kết quả giống nhau
function getData() {
    return Promise.resolve("data");
}

// Không cần thiết - chỉ return một Promise khác
async function fetchUsers() {
    return await fetch('/api/users').then(r => r.json());
}

// Đơn giản hơn
function fetchUsers() {
    return fetch('/api/users').then(r => r.json());
}
```

### 4. Sử dụng Promise.allSettled cho nhiều request độc lập

```javascript
// Nếu một request fail, các request khác vẫn tiếp tục
async function fetchMultipleResources() {
    const results = await Promise.allSettled([
        fetchUsers(),
        fetchPosts(),
        fetchComments()
    ]);
    
    // Xử lý từng kết quả
    const processedResults = results.map(result => {
        if (result.status === 'fulfilled') {
            return result.value;
        } else {
            console.error('Failed request:', result.reason);
            return null; // hoặc giá trị mặc định nào đó
        }
    });
    
    const [users, posts, comments] = processedResults;
    return { users, posts, comments };
}
```

### 5. Biến hàm callback thành Promise

```javascript
// Chuyển hàm callback thành Promise
function readFileAsync(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(data);
        });
    });
}

// Sử dụng
async function readConfig() {
    try {
        const data = await readFileAsync('config.json');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading config:', error);
        return defaultConfig;
    }
}
```

### 6. Xử lý Promise.all kết hợp với map

```javascript
async function fetchUserProfiles(userIds) {
    try {
        // Map userIds thành mảng các promises
        const promises = userIds.map(id => fetchUserProfile(id));
        
        // Đợi tất cả promises hoàn thành
        const profiles = await Promise.all(promises);
        
        return profiles;
    } catch (error) {
        console.error('Error fetching user profiles:', error);
        throw error;
    }
}
```

## Kết luận

Promise và Async/Await là những tính năng mạnh mẽ trong JavaScript giúp xử lý các tác vụ bất đồng bộ một cách hiệu quả và dễ đọc. Promise cung cấp một cách tiếp cận có cấu trúc để xử lý kết quả và lỗi của các tác vụ bất đồng bộ, trong khi Async/Await làm cho code bất đồng bộ đọc giống như code đồng bộ, dễ hiểu hơn.

Trong bài viết này, chúng ta đã tìm hiểu:
- Các khái niệm cơ bản về Promise và Async/Await
- Cách tạo và sử dụng Promise
- Cú pháp Async/Await hiện đại
- Các phương thức tĩnh của Promise như all, race, allSettled, any
- Xử lý lỗi trong Promise và Async/Await
- Thực thi tuần tự và song song
- Xử lý các trường hợp phức tạp như timeout, retry, vòng lặp bất đồng bộ
- Ví dụ thực tế với Image Gallery
- Các best practices khi làm việc với Promise và Async/Await

Nắm vững những kiến thức này sẽ giúp bạn xây dựng các ứng dụng web hiện đại với hiệu suất tốt và trải nghiệm người dùng mượt mà.

## Tài liệu tham khảo

1. [MDN Web Docs: Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
2. [MDN Web Docs: async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
3. [MDN Web Docs: await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await)
4. [JavaScript.info: Promises, async/await](https://javascript.info/async)
5. "JavaScript: The Definitive Guide" - David Flanagan





