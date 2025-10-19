+++
title = "Multithreading and Thread Pool in Java: From Zero to Hero"
date = "2025-09-24"
description = "Understanding Multithreading through real-world examples: Restaurant, ATM, Factory. From basic Thread to Thread Pool, Synchronization, and Fork/Join Framework"
categories = ["Java"]
tags = ["Java", "Multithreading", "Concurrency"]
author = "Pham Minh Kha"
translationKey = "multithreading"
+++

## What is a Thread? Imagine You Own a Restaurant!

You open a food stall:

**Method 1: No threads (Single-threaded)**
- Customer A arrives → Cook rice → Serve → Customer A leaves
- Customer B arrives → Cook rice → Serve → Customer B leaves
- Customer C arrives → **(must wait 30 minutes!)** 😤

**Method 2: Multiple threads (Multi-threaded)**
- Customer A arrives → Chef 1 cooks
- Customer B arrives → Chef 2 cooks  } **At the same time!**
- Customer C arrives → Chef 3 cooks
- → **Everyone is served quickly!** 🎉

**In Java:**
- **Thread** = A chef
- **Main Thread** = Restaurant owner (main thread)
- **Multi-threading** = Hiring multiple chefs to serve multiple customers simultaneously

---

## Why Do We Need Multithreading?

### Problem: Modern CPUs have idle cores!

Your computer has 8 cores:

**Without threads:**
```
Core 1: [████████████] Working
Core 2: [............] Idle
Core 3: [............] Idle
...
Core 8: [............] Idle
```
→ **Wasting 7/8 of CPU power!** 😱

**With multithreading:**
```
Core 1: [████] Thread 1
Core 2: [████] Thread 2
Core 3: [████] Thread 3
...
Core 8: [████] Thread 8
```
→ **Utilizing 100% of CPU!** 🚀

**Real benefits:**
- ✅ **Speed**: Process video 8 times faster (8 cores)
- ✅ **Smooth UI**: App doesn't freeze when loading data
- ✅ **Efficient server**: Serve 1000 users simultaneously

---

## Creating Threads in Java - 2 Ways

### Method 1: Extends Thread (Inheritance)

**Real example:** Create 2 chefs to cook

```java
public class Chef extends Thread {
    @Override
    public void run() {
        // Chef's work
        System.out.println("👨‍🍳 " + getName() + " starts cooking");
        
        for (int i = 1; i <= 5; i++) {
            System.out.println(getName() + " - Dish #" + i);
            try {
                Thread.sleep(1000);  // Cooking takes 1 second
            } catch (InterruptedException e) {
                System.out.println("Interrupted!");
            }
        }
        
        System.out.println("✅ " + getName() + " finished!");
    }
    
    public static void main(String[] args) {
        // Hire 2 chefs
        Chef chef1 = new Chef();
        chef1.setName("Chef-1");
        chef1.start();  // Start working
        
        Chef chef2 = new Chef();
        chef2.setName("Chef-2");
        chef2.start();
        
        System.out.println("🏪 Restaurant owner continues other work");
    }
}
```

**Output:**
```
🏪 Restaurant owner continues other work
👨‍🍳 Chef-1 starts cooking
👨‍🍳 Chef-2 starts cooking
Chef-1 - Dish #1
Chef-2 - Dish #1
Chef-1 - Dish #2
Chef-2 - Dish #2
...
✅ Chef-1 finished!
✅ Chef-2 finished!
```

**Explanation:**
- `extends Thread` → "Chef is a Thread"
- `run()` → Work to be done
- `start()` → **START** thread (NOT `run()`!)
- `Thread.sleep(1000)` → Rest for 1 second

⚠️ **IMPORTANT:** Must call `start()`, not `run()`!
```java
chef.run();    // ❌ WRONG: Runs as normal function
chef.start();  // ✅ CORRECT: Creates new thread
```

---

### Method 2: Implements Runnable (Recommended!)

**Why is it better?**
- Java doesn't allow multiple inheritance
- Runnable separates "work" and "worker"
- Easier to reuse logic

```java
public class CookingTask implements Runnable {
    @Override
    public void run() {
        System.out.println("👨‍🍳 " + Thread.currentThread().getName() + " is cooking");
        
        for (int i = 1; i <= 5; i++) {
            System.out.println(Thread.currentThread().getName() + " - Dish " + i);
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                System.out.println("Interrupted!");
            }
        }
    }
    
    public static void main(String[] args) {
        // Create work (task)
        Runnable cookingTask = new CookingTask();
        
        // Hire people to do that work
        Thread chef1 = new Thread(cookingTask, "Chef-A");
        Thread chef2 = new Thread(cookingTask, "Chef-B");
        
        // Start working
        chef1.start();
        chef2.start();
        
        System.out.println("🏪 Restaurant owner does other work");
    }
}
```

**Runnable advantages:**
```java
// Same task, multiple threads can work on it
Runnable task = new CookingTask();
new Thread(task, "Chef-1").start();
new Thread(task, "Chef-2").start();
new Thread(task, "Chef-3").start();
```

---

## Thread Lifecycle - 6 States

Imagine employees in a company:

### Thread States:

**1. NEW** (Newly hired)
- Code: `Thread thread = new Thread();`
- Meaning: "New employee, hasn't started working yet"

**2. RUNNABLE** (Ready to work)
- Code: `thread.start();`
- Meaning: "Joined company, waiting for boss to assign work"

**3. RUNNING** (Working)
- CPU is executing code in `run()`
- Meaning: "Coding, working on task"

**4. BLOCKED** (Waiting for resource)
- Code: `synchronized(lock) { ... }`
- Meaning: "Waiting for someone else to finish using printer"

**5. WAITING** (Waiting for notification)
- Code: `wait()` / `join()`
- Meaning: "Waiting for colleague to finish their task"

**6. TIMED_WAITING** (Waiting with timeout)
- Code: `sleep(1000)` / `wait(1000)`
- Meaning: "Lunch break for 1 hour"

**7. TERMINATED** (Quit)
- `run()` finished
- Meaning: "Task complete, going home"

**Demo code:**

```java
public class ThreadLifecycleDemo {
    public static void main(String[] args) throws InterruptedException {
        Thread worker = new Thread(() -> {
            try {
                System.out.println("💼 Start working");
                
                Thread.sleep(2000);  // TIMED_WAITING
                System.out.println("☕ Break for 2 seconds");
                
                synchronized (ThreadLifecycleDemo.class) {
                    ThreadLifecycleDemo.class.wait(1000);  // WAITING
                }
                
                System.out.println("✅ Finished work");
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        });
        
        // 1. NEW
        System.out.println("Initial state: " + worker.getState());  
        // Output: NEW
        
        worker.start();
        
        // 2. RUNNABLE
        System.out.println("After start: " + worker.getState());  
        // Output: RUNNABLE
        
        Thread.sleep(1000);
        
        // 3. TIMED_WAITING
        System.out.println("During sleep: " + worker.getState());  
        // Output: TIMED_WAITING
        
        worker.join();  // Wait for worker to complete
        
        // 4. TERMINATED
        System.out.println("After completion: " + worker.getState());  
        // Output: TERMINATED
    }
}
```

---

## Thread Pool - Intelligent Staff Management

### Problem: Creating threads is expensive!

**Old way (create new thread each time):**
```java
for (int i = 0; i < 1000; i++) {
    new Thread(() -> {
        // Do something
    }).start();
}
// → Creates 1000 threads! 💀
// → Massive RAM consumption
// → CPU must switch between 1000 threads constantly
```

**Real-world example:**
Like **hiring 1000 full-time employees** just to serve 1000 customers in one day!
- Must pay monthly salary to 1000 people
- Office must have 1000 desks
- After 1 day → Fire 1000 people (expensive!)

### Solution: Thread Pool

**Idea:** Prepare 50 threads in advance, reuse them!

```
┌─────────────────────────────────────────┐
│         THREAD POOL (50 threads)        │
│  T1  T2  T3 ... T48  T49  T50           │
└─────────────────────────────────────────┘
   ↑    ↑    ↑
   │    │    └─ Task 3
   │    └────── Task 2
   └─────────── Task 1

When Task 1 done → T1 returned to Pool → Works on Task 4
```

**Real-world example:**
Like a company with **50 permanent employees**:
- 100 tasks arrive → 50 people work first, 50 tasks wait
- Task done → Employee takes next task
- No need to constantly hire/fire

---

## ExecutorService - Thread Pool in Java

### 1. Fixed Thread Pool (Fixed size)

**Use case:** Know load in advance (e.g., server with 100 concurrent connections)

```java
import java.util.concurrent.*;

public class FixedThreadPoolExample {
    public static void main(String[] args) {
        // Create pool with 5 threads
        ExecutorService pool = Executors.newFixedThreadPool(5);
        
        System.out.println("🏢 Company has 5 permanent employees");
        
        // Submit 10 tasks
        for (int i = 1; i <= 10; i++) {
            final int taskId = i;
            
            pool.execute(() -> {
                System.out.println("📋 Task #" + taskId + 
                    " being done by " + Thread.currentThread().getName());
                
                try {
                    Thread.sleep(2000);  // Work takes 2 seconds
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                
                System.out.println("✅ Task #" + taskId + " completed");
            });
        }
        
        // Shut down pool (don't accept new tasks)
        pool.shutdown();
        
        System.out.println("🏪 Sent 10 tasks, waiting for completion...");
    }
}
```

**Output:**
```
🏢 Company has 5 permanent employees
🏪 Sent 10 tasks, waiting for completion...
📋 Task #1 being done by pool-1-thread-1
📋 Task #2 being done by pool-1-thread-2
📋 Task #3 being done by pool-1-thread-3
📋 Task #4 being done by pool-1-thread-4
📋 Task #5 being done by pool-1-thread-5
[Wait 2 seconds...]
✅ Task #1 completed
📋 Task #6 being done by pool-1-thread-1  ← Thread 1 reused!
...
```

**Explanation:**
- Have 10 tasks but only **5 threads**
- First 5 tasks run immediately, remaining 5 tasks **wait**
- When task done → thread **reused** for next task

---

### 2. Cached Thread Pool (Flexible)

**Use case:** Don't know number of tasks in advance (e.g., web crawler)

```java
public class CachedThreadPoolExample {
    public static void main(String[] args) {
        // Pool automatically creates/destroys threads as needed
        ExecutorService pool = Executors.newCachedThreadPool();
        
        System.out.println("🏢 Company hires employees flexibly");
        
        for (int i = 1; i <= 20; i++) {
            final int taskId = i;
            
            pool.execute(() -> {
                System.out.println("Task #" + taskId + " - " + 
                    Thread.currentThread().getName());
                
                try {
                    Thread.sleep(500);
                } catch (InterruptedException e) {}
            });
        }
        
        pool.shutdown();
    }
}
```

**Features:**
- If need 20 threads → Create 20 threads
- If thread idle >60s → Automatically **destroy** to save RAM
- Suitable for **short tasks**

⚠️ **Warning:** If too many tasks → Can create thousands of threads → **Crash!**

---

### 3. Single Thread Executor (Just 1 thread)

**Use case:** Ensure tasks run **sequentially**, no contention

```java
public class SingleThreadExample {
    public static void main(String[] args) {
        // Only 1 employee
        ExecutorService executor = Executors.newSingleThreadExecutor();
        
        System.out.println("👤 Company has only 1 employee");
        
        for (int i = 1; i <= 5; i++) {
            final int taskId = i;
            executor.execute(() -> {
                System.out.println("Task #" + taskId + " started");
                try { Thread.sleep(1000); } catch (InterruptedException e) {}
                System.out.println("Task #" + taskId + " completed");
            });
        }
        
        executor.shutdown();
    }
}
```

**When to use?**
- ✅ Writing log files (must write sequentially, can't overwrite)
- ✅ Processing queue (FIFO - First In First Out)
- ✅ Updating database (avoid conflicts)

---

### 4. Scheduled Thread Pool (Scheduled)

**Use case:** Run tasks periodically (e.g., backup database nightly)

```java
import java.util.concurrent.*;

public class ScheduledThreadPoolExample {
    public static void main(String[] args) {
        ScheduledExecutorService scheduler = 
            Executors.newScheduledThreadPool(2);
        
        System.out.println("⏰ Scheduling system running...\n");
        
        // 1. Run once after 3 seconds
        scheduler.schedule(() -> {
            System.out.println("✉️ [" + getCurrentTime() + "] " +
                "Send daily report email");
        }, 3, TimeUnit.SECONDS);
        
        // 2. Run periodically: Start after 2s, repeat every 1s
        scheduler.scheduleAtFixedRate(() -> {
            System.out.println("🔄 [" + getCurrentTime() + "] " +
                "Check system");
        }, 2, 1, TimeUnit.SECONDS);
        
        // 3. Run with fixed delay: Wait 1s after previous task done
        scheduler.scheduleWithFixedDelay(() -> {
            System.out.println("💾 [" + getCurrentTime() + "] " +
                "Backup data");
            try { Thread.sleep(500); } catch (InterruptedException e) {}
        }, 1, 1, TimeUnit.SECONDS);
        
        // Run for 10 seconds then stop
        try {
            Thread.sleep(10000);
        } catch (InterruptedException e) {}
        
        scheduler.shutdown();
        System.out.println("\n⏹️ System stopped");
    }
    
    static String getCurrentTime() {
        return String.format("%tT", System.currentTimeMillis());
    }
}
```

**Output:**
```
⏰ Scheduling system running...

[21:30:01] 💾 Backup data
[21:30:02] 🔄 Check system
[21:30:02] 💾 Backup data
[21:30:03] 🔄 Check system
[21:30:03] ✉️ Send daily report email
...
```

---

## Comparing Thread Pool Types

| Type | Features | When to use | Risk |
|------|----------|--------------|------|
| **Fixed** | Fixed number of threads | Stable load, known in advance | Queue overflow if too many tasks |
| **Cached** | Create/destroy flexibly | Short tasks, infrequent | Too many threads → OOM |
| **Single** | Only 1 thread | Ensure sequential order | Slow (no parallelism) |
| **Scheduled** | Scheduled, periodic | Backup, cron jobs | N/A |

**Formula to choose Thread Pool:**

```java
// CPU-bound (heavy computation): threads = cores
int cpuCores = Runtime.getRuntime().availableProcessors();
ExecutorService pool = Executors.newFixedThreadPool(cpuCores);

// I/O-bound (lots of waiting): threads > cores
ExecutorService pool = Executors.newFixedThreadPool(cpuCores * 2);
```

---

## Synchronization

### Problem: Race Condition

**Real example:** 2 people withdraw money from ATM simultaneously

Account has: **$1000**

| Thread 1 | Thread 2 |
|----------|----------|
| Read: balance = 1000 | Read: balance = 1000 |
| Withdraw: 1000 - 500 = 500 | Withdraw: 1000 - 300 = 700 |
| Save: balance = 500 | Save: balance = 700 |

**Result:** balance = 700 **(WRONG!)**  
**Should be:** 1000 - 500 - 300 = 200

**Demo code for race condition:**

```java
public class RaceConditionDemo {
    private static int balance = 1000;
    
    public static void main(String[] args) throws InterruptedException {
        // 2 people withdraw simultaneously
        Thread person1 = new Thread(() -> {
            for (int i = 0; i < 1000; i++) {
                balance--;  // Not thread-safe!
            }
        });
        
        Thread person2 = new Thread(() -> {
            for (int i = 0; i < 1000; i++) {
                balance--;  // Not thread-safe!
            }
        });
        
        person1.start();
        person2.start();
        
        person1.join();  // Wait for person1 to finish
        person2.join();  // Wait for person2 to finish
        
        System.out.println("Balance: " + balance);
        // Expected: 1000 - 2000 = -1000
        // Actual: Could be -950, -980... (WRONG!)
    }
}
```

---

### Solution 1: synchronized (Locking)

**Example:** Public toilet with 1 door

1. Person A enters → Lock door 🔒
2. Person B arrives → Wait outside ⏳
3. Person A leaves → Unlock 🔓
4. Person B enters → Lock door 🔒

**Code with synchronized:**

```java
public class SynchronizedCounter {
    private int balance = 1000;
    
    // Add synchronized → Only 1 thread can enter at a time
    public synchronized void withdraw(int amount) {
        balance -= amount;
    }
    
    public synchronized int getBalance() {
        return balance;
    }
    
    public static void main(String[] args) throws InterruptedException {
        SynchronizedCounter account = new SynchronizedCounter();
        
        // 10 people withdraw simultaneously
        Thread[] people = new Thread[10];
        for (int i = 0; i < people.length; i++) {
            people[i] = new Thread(() -> {
                for (int j = 0; j < 100; j++) {
                    account.withdraw(1);  // Thread-safe now!
                }
            });
            people[i].start();
        }
        
        // Wait for all to finish
        for (Thread person : people) {
            person.join();
        }
        
        System.out.println("Final balance: " + account.getBalance());
        // Result: 0 (100% accurate!)
    }
}
```

**Explanation:**
```java
public synchronized void withdraw(int amount) {
    // Only 1 thread can enter at a time
    // Other threads must WAIT outside
    balance -= amount;
}
```

---

### Solution 2: Lock (Advanced locking)

**Advantages over synchronized:**
- Can `tryLock()` - try to lock, if can't then skip
- Can lock with timeout
- More flexible

```java
import java.util.concurrent.locks.*;

public class LockExample {
    private int balance = 1000;
    private Lock lock = new ReentrantLock();
    
    public void withdraw(int amount) {
        lock.lock();  // Lock
        try {
            balance -= amount;
        } finally {
            lock.unlock();  // MUST unlock in finally!
        }
    }
    
    // Try to lock, if can't then skip
    public boolean tryWithdraw(int amount) {
        if (lock.tryLock()) {  // Try to lock
            try {
                balance -= amount;
                return true;
            } finally {
                lock.unlock();
            }
        } else {
            System.out.println("❌ Someone else is using, skip");
            return false;
        }
    }
    
    public int getBalance() {
        lock.lock();
        try {
            return balance;
        } finally {
            lock.unlock();
        }
    }
}
```

**Compare synchronized vs Lock:**

| Feature | synchronized | Lock |
|---------|--------------|------|
| **Easy to use** | ✅ Simple | ⚠️ More complex |
| **tryLock** | ❌ No | ✅ Yes |
| **Timeout** | ❌ No | ✅ Yes |
| **Fairness** | ❌ Not guaranteed | ✅ Can guarantee FIFO |
| **Auto unlock** | ✅ Automatic | ❌ Must call unlock() |

---

## Deadlock - Deadly Stalemate! 💀

**Real example:** 2 people eating spaghetti need 2 forks

Table has 2 forks: **Fork A** and **Fork B**

| Alice | Bob |
|-------|-----|
| 1. Hold Fork A 🍴 | 1. Hold Fork B 🍴 |
| 2. Wait for Fork B... | 2. Wait for Fork A... |

→ **Both wait for each other forever!** 😱

**Deadlock demo code:**

```java
public class DeadlockDemo {
    public static void main(String[] args) {
        final String forkA = "Fork A";
        final String forkB = "Fork B";
        
        // Alice: Hold A first, then hold B
        Thread alice = new Thread(() -> {
            synchronized (forkA) {
                System.out.println("👩 Alice: Holding Fork A");
                
                try { Thread.sleep(100); } catch (InterruptedException e) {}
                
                System.out.println("👩 Alice: Waiting for Fork B...");
                synchronized (forkB) {
                    System.out.println("👩 Alice: Got both forks!");
                }
            }
        });
        
        // Bob: Hold B first, then hold A
        Thread bob = new Thread(() -> {
            synchronized (forkB) {
                System.out.println("👨 Bob: Holding Fork B");
                
                try { Thread.sleep(100); } catch (InterruptedException e) {}
                
                System.out.println("👨 Bob: Waiting for Fork A...");
                synchronized (forkA) {
                    System.out.println("👨 Bob: Got both forks!");
                }
            }
        });
        
        alice.start();
        bob.start();
    }
}
```

**Output:**
```
👩 Alice: Holding Fork A
👨 Bob: Holding Fork B
👩 Alice: Waiting for Fork B...
👨 Bob: Waiting for Fork A...
[FROZEN FOREVER - DEADLOCK!]
```

---

### How to Avoid Deadlock

**Golden rule: Always lock in the SAME ORDER!**

```java
// ✅ CORRECT: Both hold A first, then B
Thread alice = new Thread(() -> {
    synchronized (forkA) {      // A first
        synchronized (forkB) {  // B after
            System.out.println("Alice finished eating!");
        }
    }
});

Thread bob = new Thread(() -> {
    synchronized (forkA) {      // A first (same as Alice)
        synchronized (forkB) {  // B after
            System.out.println("Bob finished eating!");
        }
    }
});
```

**Result:**
```
Alice holds A → holds B → eats → releases A, B
Bob waits → holds A → holds B → eats
→ No deadlock! ✅
```

---

## Producer-Consumer Pattern (Factory)

**Real example:**
- **Producer** (Factory): Produces bread, puts in warehouse
- **Consumer** (Store): Takes bread from warehouse, sells
- **Buffer** (Warehouse): Holds max 10 breads

**Rules:**
- If warehouse **full** → Producer must **wait**
- If warehouse **empty** → Consumer must **wait**

```java
import java.util.*;

public class ProducerConsumerExample {
    private static final int MAX_SIZE = 10;
    private static Queue<Integer> buffer = new LinkedList<>();
    
    public static void main(String[] args) {
        // Factory produces
        Thread producer = new Thread(() -> {
            int productId = 1;
            while (true) {
                synchronized (buffer) {
                    // Wait if warehouse full
                    while (buffer.size() == MAX_SIZE) {
                        try {
                            System.out.println("🏭 Warehouse full! Producer waiting...");
                            buffer.wait();
                        } catch (InterruptedException e) {}
                    }
                    
                    // Produce product
                    System.out.println("🏭 Producer produces: #" + productId);
                    buffer.add(productId++);
                    
                    // Notify Consumer
                    buffer.notify();
                }
                
                try { Thread.sleep(500); } catch (InterruptedException e) {}
            }
        });
        
        // Store consumes
        Thread consumer = new Thread(() -> {
            while (true) {
                synchronized (buffer) {
                    // Wait if warehouse empty
                    while (buffer.isEmpty()) {
                        try {
                            System.out.println("🏪 Warehouse empty! Consumer waiting...");
                            buffer.wait();
                        } catch (InterruptedException e) {}
                    }
                    
                    // Take product
                    int product = buffer.poll();
                    System.out.println("🏪 Consumer consumes: #" + product + 
                        " (Remaining " + buffer.size() + " in warehouse)");
                    
                    // Notify Producer
                    buffer.notify();
                }
                
                try { Thread.sleep(1000); } catch (InterruptedException e) {}
            }
        });
        
        producer.start();
        consumer.start();
    }
}
```

**Output:**
```
🏭 Producer produces: #1
🏪 Consumer consumes: #1 (Remaining 0 in warehouse)
🏭 Producer produces: #2
🏭 Producer produces: #3
🏪 Consumer consumes: #2 (Remaining 1 in warehouse)
🏭 Producer produces: #4
...
[Warehouse full - 10 products]
🏭 Warehouse full! Producer waiting...
🏪 Consumer consumes: #8 (Remaining 9 in warehouse)
🏭 Producer produces: #11
```

**Explanation:**
```java
while (buffer.size() == MAX_SIZE) {
    buffer.wait();  // Sleep and RELEASE LOCK
}
// When Consumer calls notify() → Wake up → Continue
```

---

## Fork/Join Framework - Divide and Conquer

**Real example:** Calculate sum of 1 million numbers

**Traditional way:**
```
Thread 1: Calculate sum of 1,000,000 numbers
→ Slow!
```

**Fork/Join:**
```
                [1 → 1,000,000]
                     ↓ FORK (split in half)
        ┌────────────┴─────────────┐
   [1 → 500,000]             [500,001 → 1,000,000]
        ↓ FORK                      ↓ FORK
   ┌────┴────┐               ┌──────┴──────┐
[1→250K] [250K→500K]    [500K→750K] [750K→1M]
   ↓       ↓                  ↓          ↓
  Calc    Calc               Calc       Calc
   ↓       ↓                  ↓          ↓
   └───┬───┘                  └────┬─────┘
       ↓ JOIN (combine result)      ↓
    RESULT 1              +    RESULT 2
       └───────────┬────────────────┘
                   ↓ JOIN
              FINAL SUM
```

**Code:**

```java
import java.util.concurrent.*;

public class ForkJoinExample {
    // Task to calculate array sum
    static class SumTask extends RecursiveTask<Long> {
        private int[] array;
        private int start;
        private int end;
        private static final int THRESHOLD = 1000;
        
        public SumTask(int[] array, int start, int end) {
            this.array = array;
            this.start = start;
            this.end = end;
        }
        
        @Override
        protected Long compute() {
            int length = end - start;
            
            // If array small enough → calculate directly
            if (length <= THRESHOLD) {
                long sum = 0;
                for (int i = start; i < end; i++) {
                    sum += array[i];
                }
                return sum;
            }
            
            // If array large → split in half
            int middle = start + length / 2;
            
            SumTask leftTask = new SumTask(array, start, middle);
            SumTask rightTask = new SumTask(array, middle, end);
            
            // Fork: Split task
            leftTask.fork();      // Run asynchronously
            long rightResult = rightTask.compute();  // Run directly
            long leftResult = leftTask.join();       // Wait for result
            
            // Join: Combine results
            return leftResult + rightResult;
        }
    }
    
    public static void main(String[] args) {
        // Create array of 10 million numbers
        int size = 10_000_000;
        int[] array = new int[size];
        for (int i = 0; i < size; i++) {
            array[i] = i + 1;
        }
        
        // Fork/Join Pool
        ForkJoinPool pool = ForkJoinPool.commonPool();
        
        // Calculate sum with Fork/Join
        long start = System.currentTimeMillis();
        SumTask task = new SumTask(array, 0, size);
        long forkJoinResult = pool.invoke(task);
        long forkJoinTime = System.currentTimeMillis() - start;
        
        System.out.println("🚀 Fork/Join:");
        System.out.println("   Result: " + forkJoinResult);
        System.out.println("   Time: " + forkJoinTime + "ms");
        
        // Compare with traditional way
        start = System.currentTimeMillis();
        long normalSum = 0;
        for (int value : array) {
            normalSum += value;
        }
        long normalTime = System.currentTimeMillis() - start;
        
        System.out.println("\n🐌 Traditional way:");
        System.out.println("   Result: " + normalSum);
        System.out.println("   Time: " + normalTime + "ms");
        
        System.out.println("\n📊 Fork/Join is " + 
            String.format("%.2f", (double)normalTime / forkJoinTime) + "x faster!");
    }
}
```

**Output:**
```
🚀 Fork/Join:
   Result: 50000005000000
   Time: 45ms

🐌 Traditional way:
   Result: 50000005000000
   Time: 180ms

📊 Fork/Join is 4.00x faster!
```

---

## Summary and Best Practices

### ✅ Multithreading Checklist

**1. When to use Multithreading?**
- ✅ Tasks are **independent** (don't depend on each other)
- ✅ Tasks are **time-consuming** (I/O, network, complex computation)
- ✅ Have multiple **CPU cores** to utilize
- ❌ Simple, fast tasks (thread overhead > benefit)

**2. Choose which Thread Pool?**

```java
// CPU-intensive (computation): threads = cores
ExecutorService pool = Executors.newFixedThreadPool(
    Runtime.getRuntime().availableProcessors()
);

// I/O-intensive (waiting): threads = cores * 2
ExecutorService pool = Executors.newFixedThreadPool(
    Runtime.getRuntime().availableProcessors() * 2
);

// Short tasks, infrequent: CachedThreadPool
ExecutorService pool = Executors.newCachedThreadPool();

// Need sequential: SingleThreadExecutor
ExecutorService pool = Executors.newSingleThreadExecutor();

// Cron jobs: ScheduledThreadPool
ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(2);
```

**3. Synchronization:**
```java
// Simple: synchronized
public synchronized void method() { ... }

// Flexible: Lock
Lock lock = new ReentrantLock();
lock.lock();
try {
    // Critical section
} finally {
    lock.unlock();  // MUST unlock in finally!
}

// No synchronization needed: AtomicInteger
AtomicInteger counter = new AtomicInteger(0);
counter.incrementAndGet();  // Thread-safe!
```

**4. Avoid Deadlock:**
- ✅ Always lock in **same order**
- ✅ Reduce scope of synchronized
- ✅ Use **timeout** for Lock

**5. Close ExecutorService:**
```java
executor.shutdown();           // Don't accept new tasks
executor.awaitTermination(60, TimeUnit.SECONDS);  // Wait max 60s
if (!executor.isTerminated()) {
    executor.shutdownNow();    // Force stop
}
```

---

## Quick Cheat Sheet

| Problem | Solution |
|---------|----------|
| Need to process many requests | `Executors.newFixedThreadPool(N)` |
| Short tasks, infrequent | `Executors.newCachedThreadPool()` |
| Ensure sequential | `Executors.newSingleThreadExecutor()` |
| Scheduled, periodic | `Executors.newScheduledThreadPool(N)` |
| Race Condition | `synchronized` or `Lock` |
| Simple counter | `AtomicInteger` |
| Producer-Consumer | `BlockingQueue` |
| Divide large task | `ForkJoinPool` |
| Deadlock | Lock in same order |

---

## Conclusion

Multithreading in Java can be summarized as:

**1. Core concepts:**
- Thread = Worker (employee)
- Thread Pool = Company with ready employees
- Synchronization = Locking toilet door
- Deadlock = 2 people waiting for each other forever

**2. Basic code:**
```java
// Create thread
Thread t = new Thread(() -> { /* code */ });
t.start();

// Thread Pool
ExecutorService pool = Executors.newFixedThreadPool(5);
pool.execute(() -> { /* task */ });
pool.shutdown();

// Synchronization
public synchronized void method() { /* safe */ }
```

**3. Best Practices:**
- ✅ Use Thread Pool (don't create threads directly)
- ✅ Synchronize when accessing shared data
- ✅ Avoid deadlock: Lock in same order
- ✅ Close ExecutorService after use

**4. Most important:**
Multithreading makes apps **faster** but also **more complex**. Only use when really needed!

Now you understand Multithreading! Try building a web server, image processor, or multiplayer game of your own! 🚀

---

## References

- [Oracle Java Concurrency Tutorial](https://docs.oracle.com/javase/tutorial/essential/concurrency/)
- [Java Concurrency in Practice - Brian Goetz](https://jcip.net/)
- [ExecutorService Documentation](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ExecutorService.html)
- [Fork/Join Framework Guide](https://docs.oracle.com/javase/tutorial/essential/concurrency/forkjoin.html)
- [Baeldung - Thread Pools in Java](https://www.baeldung.com/thread-pool-java-and-guava)













