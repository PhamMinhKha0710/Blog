+++
title = "Async/Await and Promise in JavaScript: Modern Asynchronous Programming"
date = "2025-09-18"
description = "Deep dive into Promise, Async/Await and how to use them to handle asynchronous tasks in JavaScript effectively"
categories = ["JavaScript"]
tags = ["JavaScript", "Web"]
author = "Pham Minh Kha"
translationKey = "async-await-promise"
+++

## Why Do We Need Asynchronous Programming?

JavaScript is inherently a single-threaded language, meaning it can only execute one command at a time. However, many web operations can be time-consuming, such as:

- Making API calls to a server
- Accessing databases
- Reading/writing files (in Node.js)
- Loading resources (images, videos, scripts...)
- Setting timers

If JavaScript executes these tasks synchronously, the browser would "freeze" until the task completes. Asynchronous programming solves this problem by allowing code to continue running while waiting for long tasks to complete.

## Callbacks: The Traditional Approach

Before Promises and Async/Await existed, JavaScript used callbacks to handle asynchronous code:

```javascript
console.log("Start");

setTimeout(function() {
    console.log("2 seconds have passed");
}, 2000);

console.log("End");

// Output:
// Start
// End
// 2 seconds have passed
```

However, callbacks have many issues when code gets more complex, especially "callback hell":

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

Code like this is very hard to read, difficult to maintain, and error-prone. This is why Promises and later Async/Await were created.

## Promise: A More Modern Approach

A Promise is an object representing the completion or failure of an asynchronous operation. A Promise can be in one of three states:

1. **Pending**: Initial state, neither completed nor rejected
2. **Fulfilled**: Operation completed successfully
3. **Rejected**: Operation failed

### Creating a Promise

```javascript
const myPromise = new Promise((resolve, reject) => {
    // Perform asynchronous operation
    const success = true; // Assume operation succeeds
    
    if (success) {
        resolve("Operation successful!"); // Success
    } else {
        reject("An error occurred!"); // Failure
    }
});
```

### Using a Promise

```javascript
myPromise
    .then((result) => {
        console.log(result); // "Operation successful!"
    })
    .catch((error) => {
        console.error(error); // Only runs if there's an error
    })
    .finally(() => {
        console.log("Promise completed"); // Always runs whether success or failure
    });
```

### Promise Chaining

One of the great advantages of Promises is the ability to chain them:

```javascript
getUser(userId)
    .then(user => getProfile(user.id))
    .then(profile => getPosts(profile.id))
    .then(posts => {
        console.log("Posts:", posts);
        return posts;
    })
    .catch(error => {
        console.error("Error occurred:", error);
    });
```

### Static Promise Methods

#### Promise.all()

Execute multiple Promises concurrently and wait for all to complete:

```javascript
const promise1 = fetch('/api/users');
const promise2 = fetch('/api/posts');
const promise3 = fetch('/api/comments');

Promise.all([promise1, promise2, promise3])
    .then(responses => {
        // responses array contains results in the order of promises
        return Promise.all(responses.map(res => res.json()));
    })
    .then(data => {
        const [users, posts, comments] = data;
        console.log('Users:', users);
        console.log('Posts:', posts);
        console.log('Comments:', comments);
    })
    .catch(error => {
        // If any promise rejects, catch will be called
        console.error('At least one request failed:', error);
    });
```

#### Promise.race()

Returns the result of the first Promise to complete (whether success or failure):

```javascript
const promise1 = new Promise(resolve => setTimeout(() => resolve('First'), 500));
const promise2 = new Promise(resolve => setTimeout(() => resolve('Second'), 100));

Promise.race([promise1, promise2])
    .then(result => console.log(result)); // "Second"
```

#### Promise.allSettled()

Waits for all Promises to complete (whether success or failure) and returns the status of each Promise:

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

Returns the result of the first Promise to succeed:

```javascript
const promise1 = new Promise((resolve, reject) => setTimeout(() => reject('Error 1'), 100));
const promise2 = new Promise((resolve) => setTimeout(() => resolve('Success'), 200));
const promise3 = new Promise((resolve, reject) => setTimeout(() => reject('Error 3'), 300));

Promise.any([promise1, promise2, promise3])
    .then(result => console.log(result)) // "Success"
    .catch(error => console.error(error)); // Doesn't run because promise2 succeeds
```

## Async/Await: The Most Modern Syntax

Async/Await is syntactic sugar for Promises, making asynchronous code read like synchronous code, making it easier to understand.

### Declaring an async Function

```javascript
async function fetchData() {
    // Code inside async function
    return "Data"; // Automatically wrapped in Promise.resolve()
}

// Async functions always return a Promise
fetchData().then(data => console.log(data)); // "Data"
```

### The await Keyword

```javascript
async function fetchUserData() {
    try {
        // await pauses the function until the Promise is resolved
        const response = await fetch('https://api.example.com/users');
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const userData = await response.json();
        return userData;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error; // Re-throw to allow catching at the call site
    }
}
```

### Comparison with Promise Chains

Consider an example of fetching user information, posts, and comments:

```javascript
// Using Promise chains
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

// Using async/await
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

Clearly, the async/await version is much shorter and easier to read.

## Error Handling in Async/Await

### Using try/catch

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
        throw error; // Re-throw so caller can handle it
    }
}

// Usage
async function handleData() {
    try {
        const data = await fetchData();
        displayData(data);
    } catch (error) {
        showErrorToUser('Unable to load data. Please try again later.');
    }
}
```

### Catching at the Call Site

```javascript
async function fetchData() {
    const response = await fetch('https://api.example.com/data');
    
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return response.json();
}

// Catch error at call site
fetchData()
    .then(data => displayData(data))
    .catch(error => showErrorToUser('Unable to load data'));
```

## Parallel and Sequential Execution

### Sequential Execution

```javascript
async function sequentialFetch() {
    console.time('sequential');
    
    // Requests are executed one after another
    const users = await fetchUsers();
    const posts = await fetchPosts();
    const comments = await fetchComments();
    
    console.timeEnd('sequential');
    return { users, posts, comments };
}
```

### Parallel Execution

```javascript
async function parallelFetch() {
    console.time('parallel');
    
    // Start requests simultaneously
    const usersPromise = fetchUsers();
    const postsPromise = fetchPosts();
    const commentsPromise = fetchComments();
    
    // Wait for all to complete
    const users = await usersPromise;
    const posts = await postsPromise;
    const comments = await commentsPromise;
    
    console.timeEnd('parallel');
    return { users, posts, comments };
}

// Or use Promise.all
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

## Handling Complex Scenarios

### Timeout for Promises

```javascript
// Promise with timeout
function promiseWithTimeout(promise, timeoutMs) {
    // Create promise that will reject after timeoutMs
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
            reject(new Error(`Operation timed out after ${timeoutMs} ms`));
        }, timeoutMs);
    });
    
    // Return the first promise to complete (or timeout)
    return Promise.race([promise, timeoutPromise]);
}

// Usage
async function fetchWithTimeout() {
    try {
        const result = await promiseWithTimeout(
            fetch('https://api.example.com/data'),
            5000 // 5 second timeout
        );
        
        return await result.json();
    } catch (error) {
        console.error('Error or timeout:', error);
        throw error;
    }
}
```

### Retry on Failure

```javascript
async function fetchWithRetry(url, options = {}, retries = 3, delay = 1000) {
    try {
        return await fetch(url, options);
    } catch (error) {
        if (retries <= 1) {
            throw error;
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Retry with one less attempt
        return fetchWithRetry(url, options, retries - 1, delay * 2);
    }
}

// Usage
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

## Handling Asynchronous Loops

### Sequential Iteration

```javascript
async function processItemsSequentially(items) {
    const results = [];
    
    for (const item of items) {
        // Process each item one by one, waiting for the previous one to complete
        const result = await processItem(item);
        results.push(result);
    }
    
    return results;
}
```

### Parallel Iteration

```javascript
async function processItemsInParallel(items) {
    // Create array of promises
    const promises = items.map(item => processItem(item));
    
    // Wait for all to complete
    return Promise.all(promises);
}
```

### Iteration with Concurrency Limit

```javascript
async function processItemsWithConcurrencyLimit(items, limit = 3) {
    const results = [];
    const inProgress = new Set();
    
    for (const item of items) {
        // Create promise to process item
        const promise = processItem(item)
            .then(result => {
                inProgress.delete(promise);
                return result;
            });
        
        // Add to in-progress list
        inProgress.add(promise);
        results.push(promise);
        
        // If limit reached, wait for at least one promise to complete
        if (inProgress.size >= limit) {
            await Promise.race(inProgress);
        }
    }
    
    // Wait for all to complete
    return Promise.all(results);
}
```

## Real-World Example: Building an Image Gallery with Lazy Loading

Below is a practical example using Async/Await and Promises to create an image gallery with lazy loading:

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
        <h1>Async Image Gallery</h1>
        <div class="gallery" id="gallery"></div>
        <button class="load-more" id="load-more">Load More</button>
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
const ACCESS_KEY = 'YOUR_UNSPLASH_ACCESS_KEY'; // Replace with your API key
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
        showError('Unable to load images. Please try again later.');
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
        showError('Unable to load images. Please try again later.');
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
    loadMoreButton.textContent = 'Loading...';
    loadMoreButton.disabled = true;
}

function hideLoadingState() {
    loadMoreButton.textContent = 'Load More';
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

## Best Practices When Using Promises and Async/Await

#### 1. Always Handle Errors

```javascript
// Not good - doesn't handle errors
async function fetchData() {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
}

// Good - using try/catch
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
        throw error; // Re-throw so caller can handle it
    }
}
```

#### 2. Avoid Unnecessary await

```javascript
// Inefficient - unnecessary sequential waiting
async function getResources() {
    const users = await fetchUsers();
    const posts = await fetchPosts(); // Waits for users to finish before starting
    return { users, posts };
}

// Efficient - start in parallel
async function getResources() {
    const usersPromise = fetchUsers();
    const postsPromise = fetchPosts(); // Starts immediately without waiting for users
    
    const users = await usersPromise;
    const posts = await postsPromise;
    
    return { users, posts };
}

// Or use Promise.all
async function getResources() {
    const [users, posts] = await Promise.all([
        fetchUsers(),
        fetchPosts()
    ]);
    
    return { users, posts };
}
```

#### 3. Avoid Using async Functions Unnecessarily

```javascript
// Unnecessary - only returns Promise.resolve
async function getData() {
    return "data";
}

// Simpler, same result
function getData() {
    return Promise.resolve("data");
}

// Unnecessary - only returns another Promise
async function fetchUsers() {
    return await fetch('/api/users').then(r => r.json());
}

// Simpler
function fetchUsers() {
    return fetch('/api/users').then(r => r.json());
}
```

#### 4. Use Promise.allSettled for Multiple Independent Requests

```javascript
// If one request fails, others continue
async function fetchMultipleResources() {
    const results = await Promise.allSettled([
        fetchUsers(),
        fetchPosts(),
        fetchComments()
    ]);
    
    // Process each result
    const processedResults = results.map(result => {
        if (result.status === 'fulfilled') {
            return result.value;
        } else {
            console.error('Failed request:', result.reason);
            return null; // or some default value
        }
    });
    
    const [users, posts, comments] = processedResults;
    return { users, posts, comments };
}
```

#### 5. Convert Callback Functions to Promises

```javascript
// Convert callback function to Promise
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

// Usage
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

#### 6. Handle Promise.all Combined with map

```javascript
async function fetchUserProfiles(userIds) {
    try {
        // Map userIds to array of promises
        const promises = userIds.map(id => fetchUserProfile(id));
        
        // Wait for all promises to complete
        const profiles = await Promise.all(promises);
        
        return profiles;
    } catch (error) {
        console.error('Error fetching user profiles:', error);
        throw error;
    }
}
```

## Conclusion

Promises and Async/Await are powerful features in JavaScript that help handle asynchronous tasks effectively and readably. Promises provide a structured approach to handling results and errors from asynchronous tasks, while Async/Await makes asynchronous code read like synchronous code, making it easier to understand.

In this article, we explored:
- Basic concepts of Promises and Async/Await
- How to create and use Promises
- Modern Async/Await syntax
- Static Promise methods like all, race, allSettled, any
- Error handling in Promises and Async/Await
- Sequential and parallel execution
- Handling complex scenarios like timeout, retry, asynchronous loops
- Real-world example with Image Gallery
- Best practices when working with Promises and Async/Await

Mastering this knowledge will help you build modern web applications with good performance and smooth user experience.

## References

1. [MDN Web Docs: Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
2. [MDN Web Docs: async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
3. [MDN Web Docs: await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await)
4. [JavaScript.info: Promises, async/await](https://javascript.info/async)
5. "JavaScript: The Definitive Guide" - David Flanagan

















