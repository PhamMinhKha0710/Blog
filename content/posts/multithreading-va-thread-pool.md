+++
title = "Multithreading và Thread Pool trong Java: Từ Zero đến Hero"
date = "2025-09-24"
description = "Hiểu Multithreading qua ví dụ thực tế: Nhà hàng, ATM, xưởng sản xuất. Từ Thread cơ bản đến Thread Pool, Synchronization, và Fork/Join Framework"
categories = ["Java"]
tags = ["Java", "Multithreading", "Concurrency"]
author = "Phạm Minh Kha"
+++

## Thread là gì? Tưởng tượng bạn là chủ nhà hàng!

Bạn mở một quán cơm:

**Cách 1: Không có thread (Single-threaded)**
- Khách A đến → Nấu cơm → Phục vụ → Khách A về
- Khách B đến → Nấu cơm → Phục vụ → Khách B về
- Khách C đến → **(phải đợi 30 phút!)** 😤

**Cách 2: Có nhiều thread (Multi-threaded)**
- Khách A đến → Đầu bếp 1 nấu
- Khách B đến → Đầu bếp 2 nấu  } **Cùng lúc!**
- Khách C đến → Đầu bếp 3 nấu
- → **Tất cả được phục vụ nhanh!** 🎉

**Trong Java:**
- **Thread** = Một đầu bếp
- **Main Thread** = Chủ nhà hàng (luồng chính)
- **Multi-threading** = Thuê nhiều đầu bếp để phục vụ nhiều khách cùng lúc

---

## Tại sao cần Multithreading?

### Vấn đề: CPU hiện đại có nhiều lõi nhàn rỗi!

Máy tính của bạn có 8 cores (lõi):

**Không dùng thread:**
```
Core 1: [████████████] Làm việc
Core 2: [............] Ngồi chơi
Core 3: [............] Ngồi chơi
...
Core 8: [............] Ngồi chơi
```
→ **Lãng phí 7/8 sức mạnh CPU!** 😱

**Dùng multithreading:**
```
Core 1: [████] Thread 1
Core 2: [████] Thread 2
Core 3: [████] Thread 3
...
Core 8: [████] Thread 8
```
→ **Tận dụng 100% CPU!** 🚀

**Lợi ích thực tế:**
- ✅ **Tốc độ**: Xử lý video nhanh hơn 8 lần (8 cores)
- ✅ **UI mượt**: App không bị "đơ" khi tải dữ liệu
- ✅ **Server hiệu quả**: Phục vụ 1000 users cùng lúc

---

## Tạo Thread trong Java - 2 cách

### Cách 1: Extends Thread (Kế thừa)

**Ví dụ thực tế:** Tạo 2 đầu bếp nấu cơm

```java
public class Chef extends Thread {
    @Override
    public void run() {
        // Công việc của đầu bếp
        System.out.println("👨‍🍳 " + getName() + " bắt đầu nấu");
        
        for (int i = 1; i <= 5; i++) {
            System.out.println(getName() + " - Món thứ " + i);
            try {
                Thread.sleep(1000);  // Nấu mất 1 giây
            } catch (InterruptedException e) {
                System.out.println("Bị gián đoạn!");
            }
        }
        
        System.out.println("✅ " + getName() + " hoàn thành!");
    }
    
    public static void main(String[] args) {
        // Thuê 2 đầu bếp
        Chef chef1 = new Chef();
        chef1.setName("Chef-1");
        chef1.start();  // Bắt đầu làm việc
        
        Chef chef2 = new Chef();
        chef2.setName("Chef-2");
        chef2.start();
        
        System.out.println("🏪 Chủ quán tiếp tục làm việc khác");
    }
}
```

**Output:**
```
🏪 Chủ quán tiếp tục làm việc khác
👨‍🍳 Chef-1 bắt đầu nấu
👨‍🍳 Chef-2 bắt đầu nấu
Chef-1 - Món thứ 1
Chef-2 - Món thứ 1
Chef-1 - Món thứ 2
Chef-2 - Món thứ 2
...
✅ Chef-1 hoàn thành!
✅ Chef-2 hoàn thành!
```

**Giải thích:**
- `extends Thread` → "Chef là một Thread"
- `run()` → Công việc cần làm
- `start()` → **BẮT ĐẦU** thread (KHÔNG phải `run()`!)
- `Thread.sleep(1000)` → Nghỉ 1 giây

⚠️ **CHÚ Ý:** Phải gọi `start()`, không phải `run()`!
```java
chef.run();    // ❌ SAI: Chạy như function thông thường
chef.start();  // ✅ ĐÚNG: Tạo thread mới
```

---

### Cách 2: Implements Runnable (Khuyến nghị!)

**Tại sao tốt hơn?**
- Java không cho kế thừa nhiều class
- Runnable tách biệt "công việc" và "worker"
- Dễ tái sử dụng logic

```java
public class CookingTask implements Runnable {
    @Override
    public void run() {
        System.out.println("👨‍🍳 " + Thread.currentThread().getName() + " đang nấu");
        
        for (int i = 1; i <= 5; i++) {
            System.out.println(Thread.currentThread().getName() + " - Món " + i);
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                System.out.println("Bị gián đoạn!");
            }
        }
    }
    
    public static void main(String[] args) {
        // Tạo công việc (task)
        Runnable cookingTask = new CookingTask();
        
        // Thuê người làm công việc đó
        Thread chef1 = new Thread(cookingTask, "Chef-A");
        Thread chef2 = new Thread(cookingTask, "Chef-B");
        
        // Bắt đầu làm việc
        chef1.start();
        chef2.start();
        
        System.out.println("🏪 Chủ quán làm việc khác");
    }
}
```

**Ưu điểm Runnable:**
```java
// Cùng 1 task, nhiều thread có thể làm
Runnable task = new CookingTask();
new Thread(task, "Chef-1").start();
new Thread(task, "Chef-2").start();
new Thread(task, "Chef-3").start();
```

---

## Vòng đời của Thread - 6 trạng thái

Hãy tưởng tượng nhân viên trong công ty:

### Các trạng thái của Thread:

**1. NEW** (Mới được tuyển)
- Code: `Thread thread = new Thread();`
- Ý nghĩa: "Nhân viên mới, chưa làm việc"

**2. RUNNABLE** (Sẵn sàng làm việc)
- Code: `thread.start();`
- Ý nghĩa: "Đã vào công ty, chờ boss giao việc"

**3. RUNNING** (Đang làm việc)
- CPU đang thực thi code trong `run()`
- Ý nghĩa: "Đang gõ code, làm task"

**4. BLOCKED** (Chờ tài nguyên)
- Code: `synchronized(lock) { ... }`
- Ý nghĩa: "Chờ người khác dùng máy in xong"

**5. WAITING** (Chờ thông báo)
- Code: `wait()` / `join()`
- Ý nghĩa: "Chờ đồng nghiệp hoàn thành task của họ"

**6. TIMED_WAITING** (Chờ có thời hạn)
- Code: `sleep(1000)` / `wait(1000)`
- Ý nghĩa: "Nghỉ trưa 1 tiếng"

**7. TERMINATED** (Nghỉ việc)
- `run()` kết thúc
- Ý nghĩa: "Đã hoàn thành task, về nhà"

**Code minh họa:**

```java
public class ThreadLifecycleDemo {
    public static void main(String[] args) throws InterruptedException {
        Thread worker = new Thread(() -> {
            try {
                System.out.println("💼 Bắt đầu làm việc");
                
                Thread.sleep(2000);  // TIMED_WAITING
                System.out.println("☕ Nghỉ giải lao 2 giây");
                
                synchronized (ThreadLifecycleDemo.class) {
                    ThreadLifecycleDemo.class.wait(1000);  // WAITING
                }
                
                System.out.println("✅ Hoàn thành công việc");
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        });
        
        // 1. NEW
        System.out.println("Trạng thái ban đầu: " + worker.getState());  
        // Output: NEW
        
        worker.start();
        
        // 2. RUNNABLE
        System.out.println("Sau khi start: " + worker.getState());  
        // Output: RUNNABLE
        
        Thread.sleep(1000);
        
        // 3. TIMED_WAITING
        System.out.println("Đang sleep: " + worker.getState());  
        // Output: TIMED_WAITING
        
        worker.join();  // Chờ worker hoàn thành
        
        // 4. TERMINATED
        System.out.println("Sau khi kết thúc: " + worker.getState());  
        // Output: TERMINATED
    }
}
```

---

## Thread Pool - Quản lý nhân sự thông minh

### Vấn đề: Tạo thread tốn kém!

**Cách cũ (tạo thread mới mỗi lần):**
```java
for (int i = 0; i < 1000; i++) {
    new Thread(() -> {
        // Làm việc gì đó
    }).start();
}
// → Tạo 1000 threads! 💀
// → Tốn RAM khủng khiếp
// → CPU phải switch liên tục giữa 1000 threads
```

**Ví dụ thực tế:**
Giống như **thuê 1000 nhân viên toàn thời gian** chỉ để phục vụ 1000 khách trong 1 ngày!
- Phải trả lương tháng cho 1000 người
- Văn phòng phải có 1000 bàn
- Sau 1 ngày → Sa thải 1000 người (tốn kém!)

### Giải pháp: Thread Pool (Hồ bơi luồng)

**Ý tưởng:** Chuẩn bị sẵn 50 threads, tái sử dụng!

```
┌─────────────────────────────────────────┐
│         THREAD POOL (50 threads)        │
│  T1  T2  T3 ... T48  T49  T50           │
└─────────────────────────────────────────┘
   ↑    ↑    ↑
   │    │    └─ Task 3
   │    └────── Task 2
   └─────────── Task 1

Khi Task 1 xong → T1 được trả về Pool → Làm Task 4
```

**Ví dụ thực tế:**
Giống như công ty có **50 nhân viên cố định**:
- 100 tasks đến → 50 người làm trước, 50 tasks chờ
- Task xong → Nhân viên nhận task tiếp theo
- Không phải thuê/sa thải liên tục

---

## ExecutorService - Thread Pool trong Java

### 1. Fixed Thread Pool (Cố định số lượng)

**Use case:** Biết trước tải (ví dụ: server có 100 connection đồng thời)

```java
import java.util.concurrent.*;

public class FixedThreadPoolExample {
    public static void main(String[] args) {
        // Tạo pool với 5 threads
        ExecutorService pool = Executors.newFixedThreadPool(5);
        
        System.out.println("🏢 Công ty có 5 nhân viên cố định");
        
        // Gửi 10 tasks
        for (int i = 1; i <= 10; i++) {
            final int taskId = i;
            
            pool.execute(() -> {
                System.out.println("📋 Task #" + taskId + 
                    " được làm bởi " + Thread.currentThread().getName());
                
                try {
                    Thread.sleep(2000);  // Làm việc mất 2 giây
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                
                System.out.println("✅ Task #" + taskId + " hoàn thành");
            });
        }
        
        // Đóng pool (không nhận task mới)
        pool.shutdown();
        
        System.out.println("🏪 Đã gửi 10 tasks, chờ hoàn thành...");
    }
}
```

**Output:**
```
🏢 Công ty có 5 nhân viên cố định
🏪 Đã gửi 10 tasks, chờ hoàn thành...
📋 Task #1 được làm bởi pool-1-thread-1
📋 Task #2 được làm bởi pool-1-thread-2
📋 Task #3 được làm bởi pool-1-thread-3
📋 Task #4 được làm bởi pool-1-thread-4
📋 Task #5 được làm bởi pool-1-thread-5
[Chờ 2 giây...]
✅ Task #1 hoàn thành
📋 Task #6 được làm bởi pool-1-thread-1  ← Thread 1 tái sử dụng!
...
```

**Giải thích:**
- Có 10 tasks nhưng chỉ có **5 threads**
- 5 tasks đầu chạy ngay, 5 tasks còn lại **chờ**
- Khi task xong → thread **tái sử dụng** cho task tiếp theo

---

### 2. Cached Thread Pool (Linh động)

**Use case:** Không biết trước số lượng tasks (ví dụ: web crawler)

```java
public class CachedThreadPoolExample {
    public static void main(String[] args) {
        // Pool tự động tạo/hủy threads theo nhu cầu
        ExecutorService pool = Executors.newCachedThreadPool();
        
        System.out.println("🏢 Công ty thuê nhân viên linh động");
        
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

**Đặc điểm:**
- Nếu cần 20 threads → Tạo 20 threads
- Nếu thread rỗi >60s → Tự động **hủy** để tiết kiệm RAM
- Phù hợp cho **tasks ngắn**

⚠️ **Cảnh báo:** Nếu tasks quá nhiều → Có thể tạo hàng nghìn threads → **Crash!**

---

### 3. Single Thread Executor (Chỉ 1 thread)

**Use case:** Đảm bảo tasks chạy **tuần tự**, không tranh chấp

```java
public class SingleThreadExample {
    public static void main(String[] args) {
        // Chỉ có 1 nhân viên
        ExecutorService executor = Executors.newSingleThreadExecutor();
        
        System.out.println("👤 Công ty chỉ có 1 nhân viên");
        
        for (int i = 1; i <= 5; i++) {
            final int taskId = i;
            executor.execute(() -> {
                System.out.println("Task #" + taskId + " bắt đầu");
                try { Thread.sleep(1000); } catch (InterruptedException e) {}
                System.out.println("Task #" + taskId + " hoàn thành");
            });
        }
        
        executor.shutdown();
    }
}
```

**Khi nào dùng?**
- ✅ Ghi file log (phải ghi tuần tự, không được đè)
- ✅ Xử lý queue (FIFO - First In First Out)
- ✅ Cập nhật database (tránh conflict)

---

### 4. Scheduled Thread Pool (Hẹn giờ)

**Use case:** Chạy task định kỳ (ví dụ: backup database mỗi đêm)

```java
import java.util.concurrent.*;

public class ScheduledThreadPoolExample {
    public static void main(String[] args) {
        ScheduledExecutorService scheduler = 
            Executors.newScheduledThreadPool(2);
        
        System.out.println("⏰ Hệ thống hẹn giờ đang chạy...\n");
        
        // 1. Chạy 1 lần sau 3 giây
        scheduler.schedule(() -> {
            System.out.println("✉️ [" + getCurrentTime() + "] " +
                "Gửi email báo cáo hàng ngày");
        }, 3, TimeUnit.SECONDS);
        
        // 2. Chạy định kỳ: Bắt đầu sau 2s, lặp lại mỗi 1s
        scheduler.scheduleAtFixedRate(() -> {
            System.out.println("🔄 [" + getCurrentTime() + "] " +
                "Kiểm tra hệ thống");
        }, 2, 1, TimeUnit.SECONDS);
        
        // 3. Chạy với delay cố định: Chờ 1s sau khi task trước xong
        scheduler.scheduleWithFixedDelay(() -> {
            System.out.println("💾 [" + getCurrentTime() + "] " +
                "Backup dữ liệu");
            try { Thread.sleep(500); } catch (InterruptedException e) {}
        }, 1, 1, TimeUnit.SECONDS);
        
        // Chạy trong 10 giây rồi tắt
        try {
            Thread.sleep(10000);
        } catch (InterruptedException e) {}
        
        scheduler.shutdown();
        System.out.println("\n⏹️ Hệ thống đã dừng");
    }
    
    static String getCurrentTime() {
        return String.format("%tT", System.currentTimeMillis());
    }
}
```

**Output:**
```
⏰ Hệ thống hẹn giờ đang chạy...

[21:30:01] 💾 Backup dữ liệu
[21:30:02] 🔄 Kiểm tra hệ thống
[21:30:02] 💾 Backup dữ liệu
[21:30:03] 🔄 Kiểm tra hệ thống
[21:30:03] ✉️ Gửi email báo cáo hàng ngày
...
```

---

## So sánh các loại Thread Pool

| Loại | Đặc điểm | Khi nào dùng | Nguy cơ |
|------|----------|--------------|---------|
| **Fixed** | Số threads cố định | Tải ổn định, biết trước | Queue tràn nếu tasks quá nhiều |
| **Cached** | Tạo/hủy linh động | Tasks ngắn, không thường xuyên | Tạo quá nhiều threads → OOM |
| **Single** | Chỉ 1 thread | Đảm bảo tuần tự | Chậm (không song song) |
| **Scheduled** | Hẹn giờ, định kỳ | Backup, cron jobs | N/A |

**Công thức chọn Thread Pool:**

```java
// CPU-bound (tính toán nhiều): số threads = số cores
int cpuCores = Runtime.getRuntime().availableProcessors();
ExecutorService pool = Executors.newFixedThreadPool(cpuCores);

// I/O-bound (chờ đợi nhiều): số threads > số cores
ExecutorService pool = Executors.newFixedThreadPool(cpuCores * 2);
```

---

## Synchronization - Đồng bộ hóa

### Vấn đề: Race Condition (Tranh chấp)

**Ví dụ thực tế:** 2 người rút tiền ATM cùng lúc

Tài khoản có: **1000đ**

| Thread 1 | Thread 2 |
|----------|----------|
| Đọc: balance = 1000 | Đọc: balance = 1000 |
| Rút: 1000 - 500 = 500 | Rút: 1000 - 300 = 700 |
| Lưu: balance = 500 | Lưu: balance = 700 |

**Kết quả:** balance = 700 **(SAI!)**  
**Đáng ra:** 1000 - 500 - 300 = 200

**Code minh họa race condition:**

```java
public class RaceConditionDemo {
    private static int balance = 1000;
    
    public static void main(String[] args) throws InterruptedException {
        // 2 người rút tiền cùng lúc
        Thread person1 = new Thread(() -> {
            for (int i = 0; i < 1000; i++) {
                balance--;  // Không an toàn!
            }
        });
        
        Thread person2 = new Thread(() -> {
            for (int i = 0; i < 1000; i++) {
                balance--;  // Không an toàn!
            }
        });
        
        person1.start();
        person2.start();
        
        person1.join();  // Chờ person1 xong
        person2.join();  // Chờ person2 xong
        
        System.out.println("Balance: " + balance);
        // Đáng ra: 1000 - 2000 = -1000
        // Thực tế: Có thể là -950, -980... (SAI!)
    }
}
```

---

### Giải pháp 1: synchronized (Khóa cửa)

**Ví dụ:** Toilet công cộng có 1 cửa

1. Person A vào → Khóa cửa 🔒
2. Person B đến → Chờ bên ngoài ⏳
3. Person A ra → Mở khóa 🔓
4. Person B vào → Khóa cửa 🔒

**Code với synchronized:**

```java
public class SynchronizedCounter {
    private int balance = 1000;
    
    // Thêm synchronized → Chỉ 1 thread được vào tại 1 thời điểm
    public synchronized void withdraw(int amount) {
        balance -= amount;
    }
    
    public synchronized int getBalance() {
        return balance;
    }
    
    public static void main(String[] args) throws InterruptedException {
        SynchronizedCounter account = new SynchronizedCounter();
        
        // 10 người rút tiền cùng lúc
        Thread[] people = new Thread[10];
        for (int i = 0; i < people.length; i++) {
            people[i] = new Thread(() -> {
                for (int j = 0; j < 100; j++) {
                    account.withdraw(1);  // An toàn rồi!
                }
            });
            people[i].start();
        }
        
        // Chờ tất cả hoàn thành
        for (Thread person : people) {
            person.join();
        }
        
        System.out.println("Balance cuối cùng: " + account.getBalance());
        // Kết quả: 0 (chính xác 100%!)
    }
}
```

**Giải thích:**
```java
public synchronized void withdraw(int amount) {
    // Chỉ 1 thread được vào tại 1 thời điểm
    // Các thread khác phải CHỜ bên ngoài
    balance -= amount;
}
```

---

### Giải pháp 2: Lock (Khóa nâng cao)

**Ưu điểm hơn synchronized:**
- Có thể `tryLock()` - thử khóa, không khóa được thì bỏ qua
- Có thể khóa có thời hạn
- Linh hoạt hơn

```java
import java.util.concurrent.locks.*;

public class LockExample {
    private int balance = 1000;
    private Lock lock = new ReentrantLock();
    
    public void withdraw(int amount) {
        lock.lock();  // Khóa cửa
        try {
            balance -= amount;
        } finally {
            lock.unlock();  // PHẢI mở khóa trong finally!
        }
    }
    
    // Thử khóa, không được thì bỏ qua
    public boolean tryWithdraw(int amount) {
        if (lock.tryLock()) {  // Thử khóa
            try {
                balance -= amount;
                return true;
            } finally {
                lock.unlock();
            }
        } else {
            System.out.println("❌ Người khác đang dùng, bỏ qua");
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

**So sánh synchronized vs Lock:**

| Đặc điểm | synchronized | Lock |
|----------|--------------|------|
| **Dễ dùng** | ✅ Đơn giản | ⚠️ Phức tạp hơn |
| **tryLock** | ❌ Không có | ✅ Có |
| **Timeout** | ❌ Không có | ✅ Có |
| **Fairness** | ❌ Không đảm bảo | ✅ Có thể đảm bảo FIFO |
| **Tự động unlock** | ✅ Tự động | ❌ Phải gọi unlock() |

---

## Deadlock - Bế tắc chết người! 💀

**Ví dụ thực tế:** 2 người ăn spaghetti cần 2 cái nĩa

Bàn có 2 cái nĩa: **Fork A** và **Fork B**

| Alice | Bob |
|-------|-----|
| 1. Cầm Fork A 🍴 | 1. Cầm Fork B 🍴 |
| 2. Chờ Fork B... | 2. Chờ Fork A... |

→ **Cả 2 chờ nhau mãi mãi!** 😱

**Code minh họa Deadlock:**

```java
public class DeadlockDemo {
    public static void main(String[] args) {
        final String forkA = "Fork A";
        final String forkB = "Fork B";
        
        // Alice: Cầm A trước, sau đó cầm B
        Thread alice = new Thread(() -> {
            synchronized (forkA) {
                System.out.println("👩 Alice: Đã cầm Fork A");
                
                try { Thread.sleep(100); } catch (InterruptedException e) {}
                
                System.out.println("👩 Alice: Chờ Fork B...");
                synchronized (forkB) {
                    System.out.println("👩 Alice: Đã có cả 2 nĩa!");
                }
            }
        });
        
        // Bob: Cầm B trước, sau đó cầm A
        Thread bob = new Thread(() -> {
            synchronized (forkB) {
                System.out.println("👨 Bob: Đã cầm Fork B");
                
                try { Thread.sleep(100); } catch (InterruptedException e) {}
                
                System.out.println("👨 Bob: Chờ Fork A...");
                synchronized (forkA) {
                    System.out.println("👨 Bob: Đã có cả 2 nĩa!");
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
👩 Alice: Đã cầm Fork A
👨 Bob: Đã cầm Fork B
👩 Alice: Chờ Fork B...
👨 Bob: Chờ Fork A...
[ĐỨNG IM MÃI MÃI - DEADLOCK!]
```

---

### Cách tránh Deadlock

**Nguyên tắc vàng: Luôn khóa theo CÙNG THỨ TỰ!**

```java
// ✅ ĐÚNG: Cả 2 đều cầm A trước, sau đó B
Thread alice = new Thread(() -> {
    synchronized (forkA) {      // A trước
        synchronized (forkB) {  // B sau
            System.out.println("Alice ăn xong!");
        }
    }
});

Thread bob = new Thread(() -> {
    synchronized (forkA) {      // A trước (giống Alice)
        synchronized (forkB) {  // B sau
            System.out.println("Bob ăn xong!");
        }
    }
});
```

**Kết quả:**
```
Alice cầm A → cầm B → ăn xong → thả A, B
Bob chờ → cầm A → cầm B → ăn xong
→ Không bị deadlock! ✅
```

---

## Producer-Consumer Pattern (Xưởng sản xuất)

**Ví dụ thực tế:**
- **Producer** (Nhà máy): Sản xuất bánh, bỏ vào kho
- **Consumer** (Cửa hàng): Lấy bánh từ kho, bán
- **Buffer** (Kho): Chứa tối đa 10 bánh

**Quy tắc:**
- Nếu kho **đầy** → Producer phải **chờ**
- Nếu kho **rỗng** → Consumer phải **chờ**

```java
import java.util.*;

public class ProducerConsumerExample {
    private static final int MAX_SIZE = 10;
    private static Queue<Integer> buffer = new LinkedList<>();
    
    public static void main(String[] args) {
        // Nhà máy sản xuất
        Thread producer = new Thread(() -> {
            int productId = 1;
            while (true) {
                synchronized (buffer) {
                    // Chờ nếu kho đầy
                    while (buffer.size() == MAX_SIZE) {
                        try {
                            System.out.println("🏭 Kho đầy! Producer chờ...");
                            buffer.wait();
                        } catch (InterruptedException e) {}
                    }
                    
                    // Sản xuất sản phẩm
                    System.out.println("🏭 Producer sản xuất: #" + productId);
                    buffer.add(productId++);
                    
                    // Thông báo cho Consumer
                    buffer.notify();
                }
                
                try { Thread.sleep(500); } catch (InterruptedException e) {}
            }
        });
        
        // Cửa hàng tiêu thụ
        Thread consumer = new Thread(() -> {
            while (true) {
                synchronized (buffer) {
                    // Chờ nếu kho rỗng
                    while (buffer.isEmpty()) {
                        try {
                            System.out.println("🏪 Kho rỗng! Consumer chờ...");
                            buffer.wait();
                        } catch (InterruptedException e) {}
                    }
                    
                    // Lấy sản phẩm
                    int product = buffer.poll();
                    System.out.println("🏪 Consumer tiêu thụ: #" + product + 
                        " (Còn " + buffer.size() + " trong kho)");
                    
                    // Thông báo cho Producer
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
🏭 Producer sản xuất: #1
🏪 Consumer tiêu thụ: #1 (Còn 0 trong kho)
🏭 Producer sản xuất: #2
🏭 Producer sản xuất: #3
🏪 Consumer tiêu thụ: #2 (Còn 1 trong kho)
🏭 Producer sản xuất: #4
...
[Kho đầy - 10 sản phẩm]
🏭 Kho đầy! Producer chờ...
🏪 Consumer tiêu thụ: #8 (Còn 9 trong kho)
🏭 Producer sản xuất: #11
```

**Giải thích:**
```java
while (buffer.size() == MAX_SIZE) {
    buffer.wait();  // Ngủ và THẢ LOCK
}
// Khi Consumer gọi notify() → Thức dậy → Tiếp tục
```

---

## Fork/Join Framework - Chia để trị

**Ví dụ thực tế:** Tính tổng 1 triệu số

**Cách thường:**
```
Thread 1: Tính tổng 1,000,000 số
→ Lâu!
```

**Fork/Join:**
```
                [1 → 1,000,000]
                     ↓ FORK (chia đôi)
        ┌────────────┴─────────────┐
   [1 → 500,000]             [500,001 → 1,000,000]
        ↓ FORK                      ↓ FORK
   ┌────┴────┐               ┌──────┴──────┐
[1→250K] [250K→500K]    [500K→750K] [750K→1M]
   ↓       ↓                  ↓          ↓
  Tính    Tính               Tính       Tính
   ↓       ↓                  ↓          ↓
   └───┬───┘                  └────┬─────┘
       ↓ JOIN (gộp kết quả)        ↓
    KẾT QUẢ 1              +    KẾT QUẢ 2
       └───────────┬────────────────┘
                   ↓ JOIN
              TỔNG CUỐI CÙNG
```

**Code:**

```java
import java.util.concurrent.*;

public class ForkJoinExample {
    // Task tính tổng mảng
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
            
            // Nếu mảng đủ nhỏ → tính trực tiếp
            if (length <= THRESHOLD) {
                long sum = 0;
                for (int i = start; i < end; i++) {
                    sum += array[i];
                }
                return sum;
            }
            
            // Nếu mảng lớn → chia đôi
            int middle = start + length / 2;
            
            SumTask leftTask = new SumTask(array, start, middle);
            SumTask rightTask = new SumTask(array, middle, end);
            
            // Fork: Chia nhỏ task
            leftTask.fork();      // Chạy bất đồng bộ
            long rightResult = rightTask.compute();  // Chạy trực tiếp
            long leftResult = leftTask.join();       // Chờ kết quả
            
            // Join: Gộp kết quả
            return leftResult + rightResult;
        }
    }
    
    public static void main(String[] args) {
        // Tạo mảng 10 triệu số
        int size = 10_000_000;
        int[] array = new int[size];
        for (int i = 0; i < size; i++) {
            array[i] = i + 1;
        }
        
        // Fork/Join Pool
        ForkJoinPool pool = ForkJoinPool.commonPool();
        
        // Tính tổng với Fork/Join
        long start = System.currentTimeMillis();
        SumTask task = new SumTask(array, 0, size);
        long forkJoinResult = pool.invoke(task);
        long forkJoinTime = System.currentTimeMillis() - start;
        
        System.out.println("🚀 Fork/Join:");
        System.out.println("   Kết quả: " + forkJoinResult);
        System.out.println("   Thời gian: " + forkJoinTime + "ms");
        
        // So sánh với cách thông thường
        start = System.currentTimeMillis();
        long normalSum = 0;
        for (int value : array) {
            normalSum += value;
        }
        long normalTime = System.currentTimeMillis() - start;
        
        System.out.println("\n🐌 Cách thông thường:");
        System.out.println("   Kết quả: " + normalSum);
        System.out.println("   Thời gian: " + normalTime + "ms");
        
        System.out.println("\n📊 Fork/Join nhanh gấp " + 
            String.format("%.2f", (double)normalTime / forkJoinTime) + " lần!");
    }
}
```

**Output:**
```
🚀 Fork/Join:
   Kết quả: 50000005000000
   Thời gian: 45ms

🐌 Cách thông thường:
   Kết quả: 50000005000000
   Thời gian: 180ms

📊 Fork/Join nhanh gấp 4.00 lần!
```

---

## Tóm tắt và Best Practices

### ✅ Checklist Multithreading

**1. Khi nào dùng Multithreading?**
- ✅ Tasks **độc lập** (không phụ thuộc lẫn nhau)
- ✅ Tasks **tốn thời gian** (I/O, network, tính toán phức tạp)
- ✅ Có nhiều **CPU cores** để tận dụng
- ❌ Tasks đơn giản, nhanh (overhead tạo thread > lợi ích)

**2. Chọn Thread Pool nào?**

```java
// CPU-intensive (tính toán): threads = số cores
ExecutorService pool = Executors.newFixedThreadPool(
    Runtime.getRuntime().availableProcessors()
);

// I/O-intensive (chờ đợi): threads = cores * 2
ExecutorService pool = Executors.newFixedThreadPool(
    Runtime.getRuntime().availableProcessors() * 2
);

// Tasks ngắn, không thường xuyên: CachedThreadPool
ExecutorService pool = Executors.newCachedThreadPool();

// Cần tuần tự: SingleThreadExecutor
ExecutorService pool = Executors.newSingleThreadExecutor();

// Cron jobs: ScheduledThreadPool
ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(2);
```

**3. Đồng bộ hóa:**
```java
// Đơn giản: synchronized
public synchronized void method() { ... }

// Linh hoạt: Lock
Lock lock = new ReentrantLock();
lock.lock();
try {
    // Critical section
} finally {
    lock.unlock();  // PHẢI unlock trong finally!
}

// Không cần đồng bộ: AtomicInteger
AtomicInteger counter = new AtomicInteger(0);
counter.incrementAndGet();  // Thread-safe!
```

**4. Tránh Deadlock:**
- ✅ Luôn khóa theo **cùng thứ tự**
- ✅ Giảm scope của synchronized
- ✅ Sử dụng **timeout** cho Lock

**5. Đóng ExecutorService:**
```java
executor.shutdown();           // Không nhận task mới
executor.awaitTermination(60, TimeUnit.SECONDS);  // Chờ tối đa 60s
if (!executor.isTerminated()) {
    executor.shutdownNow();    // Bắt buộc dừng
}
```

---

## Bảng cheat sheet nhanh

| Vấn đề | Giải pháp |
|--------|-----------|
| Cần xử lý nhiều requests | `Executors.newFixedThreadPool(N)` |
| Tasks ngắn, không thường xuyên | `Executors.newCachedThreadPool()` |
| Đảm bảo tuần tự | `Executors.newSingleThreadExecutor()` |
| Hẹn giờ, định kỳ | `Executors.newScheduledThreadPool(N)` |
| Race Condition | `synchronized` hoặc `Lock` |
| Counter đơn giản | `AtomicInteger` |
| Producer-Consumer | `BlockingQueue` |
| Chia nhỏ task lớn | `ForkJoinPool` |
| Deadlock | Khóa cùng thứ tự |

---

## Kết luận

Multithreading trong Java có thể tóm gọn thành:

**1. Khái niệm cốt lõi:**
- Thread = Worker (nhân viên)
- Thread Pool = Công ty có sẵn nhân viên
- Synchronization = Khóa cửa toilet
- Deadlock = 2 người chờ nhau mãi mãi

**2. Code cơ bản:**
```java
// Tạo thread
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
- ✅ Dùng Thread Pool (không tạo thread trực tiếp)
- ✅ Đồng bộ hóa khi truy cập shared data
- ✅ Tránh deadlock: Khóa cùng thứ tự
- ✅ Đóng ExecutorService sau khi dùng

**4. Điều quan trọng nhất:**
Multithreading làm app **nhanh hơn** nhưng cũng **phức tạp hơn**. Chỉ dùng khi thực sự cần!

Giờ bạn đã hiểu Multithreading! Hãy thử xây dựng web server, image processor, hoặc game multiplayer của riêng bạn! 🚀

---

## Tài liệu tham khảo

- [Oracle Java Concurrency Tutorial](https://docs.oracle.com/javase/tutorial/essential/concurrency/)
- [Java Concurrency in Practice - Brian Goetz](https://jcip.net/)
- [ExecutorService Documentation](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ExecutorService.html)
- [Fork/Join Framework Guide](https://docs.oracle.com/javase/tutorial/essential/concurrency/forkjoin.html)
- [Baeldung - Thread Pools in Java](https://www.baeldung.com/thread-pool-java-and-guava)
