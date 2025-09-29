+++
title = "Multithreading và Thread Pool trong Java: Tối ưu hiệu suất ứng dụng"
date = "2025-09-24"
description = "Tìm hiểu về lập trình đa luồng trong Java, cách sử dụng Thread Pool để tối ưu hiệu suất và các kỹ thuật đồng bộ hóa"
categories = ["Java"]
tags = ["Java", "Multithreading", "Concurrency"]
author = "Phạm Minh Kha"
+++

## Lập trình đa luồng trong Java là gì?

Lập trình đa luồng (Multithreading) là kỹ thuật cho phép chương trình thực hiện nhiều công việc đồng thời bằng cách sử dụng các luồng (thread) khác nhau. Trong Java, lập trình đa luồng là một tính năng quan trọng cho phép tận dụng tối đa sức mạnh của các hệ thống đa nhân hiện đại.

Multithreading giúp:
- Tối ưu hóa việc sử dụng tài nguyên CPU
- Tăng tốc độ thực thi chương trình
- Cải thiện trải nghiệm người dùng với UI phản hồi nhanh
- Xử lý nhiều tác vụ cùng lúc mà không bị chặn

Tuy nhiên, lập trình đa luồng cũng đi kèm với các thách thức như race condition, deadlock, và phức tạp trong thiết kế.

## Các cách tạo Thread trong Java

Java cung cấp hai cách cơ bản để tạo thread:

### 1. Kế thừa từ lớp Thread

```java
public class MyThread extends Thread {
    @Override
    public void run() {
        System.out.println("Thread đang chạy: " + Thread.currentThread().getName());
        
        // Mã lệnh cần thực thi trong thread
        for (int i = 0; i < 5; i++) {
            System.out.println(Thread.currentThread().getName() + ": " + i);
            try {
                Thread.sleep(1000); // Tạm dừng 1 giây
            } catch (InterruptedException e) {
                System.out.println("Thread bị gián đoạn");
                return;
            }
        }
    }
    
    public static void main(String[] args) {
        // Tạo và khởi chạy thread
        MyThread thread1 = new MyThread();
        thread1.setName("MyThread-1");
        thread1.start();
        
        MyThread thread2 = new MyThread();
        thread2.setName("MyThread-2");
        thread2.start();
        
        System.out.println("Main thread tiếp tục thực thi");
    }
}
```

### 2. Triển khai interface Runnable

```java
public class MyRunnable implements Runnable {
    @Override
    public void run() {
        System.out.println("Thread đang chạy: " + Thread.currentThread().getName());
        
        // Mã lệnh cần thực thi trong thread
        for (int i = 0; i < 5; i++) {
            System.out.println(Thread.currentThread().getName() + ": " + i);
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                System.out.println("Thread bị gián đoạn");
                return;
            }
        }
    }
    
    public static void main(String[] args) {
        // Tạo instance của Runnable
        Runnable task = new MyRunnable();
        
        // Tạo thread với Runnable
        Thread thread1 = new Thread(task, "Thread-1");
        Thread thread2 = new Thread(task, "Thread-2");
        
        // Khởi chạy thread
        thread1.start();
        thread2.start();
        
        System.out.println("Main thread tiếp tục thực thi");
    }
}
```

Trong hầu hết các trường hợp, cách tiếp cận với Runnable được ưa chuộng hơn vì:
- Cho phép tách biệt nhiệm vụ cần thực hiện với cơ chế thực thi
- Có thể tái sử dụng logic của task trong nhiều thread
- Java không hỗ trợ đa kế thừa, nên việc implements Runnable linh hoạt hơn

## Vòng đời của Thread

Một thread trong Java có các trạng thái sau:

1. **New**: Thread đã được tạo nhưng chưa bắt đầu
2. **Runnable**: Thread đã sẵn sàng để chạy và đang chờ CPU
3. **Blocked**: Thread đang chờ để có được lock
4. **Waiting**: Thread đang chờ một thread khác thực hiện hành động
5. **Timed Waiting**: Thread đang chờ trong một khoảng thời gian xác định
6. **Terminated**: Thread đã hoàn thành việc thực thi

```java
public class ThreadLifecycleDemo {
    public static void main(String[] args) throws InterruptedException {
        Thread thread = new Thread(() -> {
            try {
                // Thread chuyển sang trạng thái TIMED_WAITING
                Thread.sleep(2000);
                
                synchronized (ThreadLifecycleDemo.class) {
                    // Thread có thể chuyển sang BLOCKED khi chờ lock
                    ThreadLifecycleDemo.class.wait(1000);
                }
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        });
        
        // Trạng thái NEW
        System.out.println("Trạng thái sau khi tạo: " + thread.getState());
        
        thread.start();
        // Trạng thái RUNNABLE
        System.out.println("Trạng thái sau khi start: " + thread.getState());
        
        Thread.sleep(1000);
        // Trạng thái TIMED_WAITING do thread.sleep(2000)
        System.out.println("Trạng thái sau 1 giây: " + thread.getState());
        
        thread.join();
        // Trạng thái TERMINATED
        System.out.println("Trạng thái sau khi kết thúc: " + thread.getState());
    }
}
```

## Thread Pool - Giải pháp tối ưu cho đa luồng

Việc tạo và hủy thread tốn kém tài nguyên hệ thống. Thread Pool giải quyết vấn đề này bằng cách tạo sẵn một số thread và tái sử dụng chúng để thực thi nhiều tác vụ. Java cung cấp framework `java.util.concurrent.ExecutorService` để triển khai Thread Pool.

### Executor Service và các loại Thread Pool

Java cung cấp các loại Thread Pool thông qua lớp `Executors`:

#### 1. Fixed Thread Pool

```java
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class FixedThreadPoolExample {
    public static void main(String[] args) {
        // Tạo pool với 5 thread cố định
        ExecutorService executor = Executors.newFixedThreadPool(5);
        
        // Gửi 10 task để thực thi
        for (int i = 0; i < 10; i++) {
            final int taskId = i;
            executor.execute(() -> {
                System.out.println("Task #" + taskId + " đang thực thi bởi thread: " + 
                                  Thread.currentThread().getName());
                try {
                    // Giả lập công việc mất thời gian
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                System.out.println("Task #" + taskId + " hoàn thành");
            });
        }
        
        // Kết thúc ExecutorService
        executor.shutdown();
    }
}
```

#### 2. Cached Thread Pool

```java
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class CachedThreadPoolExample {
    public static void main(String[] args) {
        // Tạo cached thread pool
        ExecutorService executor = Executors.newCachedThreadPool();
        
        // Gửi 20 task để thực thi
        for (int i = 0; i < 20; i++) {
            final int taskId = i;
            executor.execute(() -> {
                System.out.println("Task #" + taskId + " đang thực thi bởi thread: " + 
                                  Thread.currentThread().getName());
                try {
                    Thread.sleep(500);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            });
        }
        
        executor.shutdown();
    }
}
```

#### 3. Scheduled Thread Pool

```java
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

public class ScheduledThreadPoolExample {
    public static void main(String[] args) {
        // Tạo scheduled thread pool với 2 thread
        ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(2);
        
        // Lên lịch chạy task sau 3 giây
        scheduler.schedule(() -> {
            System.out.println("Task trì hoãn thực thi sau 3 giây");
        }, 3, TimeUnit.SECONDS);
        
        // Lên lịch chạy task định kỳ, bắt đầu sau 2 giây và lặp lại mỗi 1 giây
        scheduler.scheduleAtFixedRate(() -> {
            System.out.println("Task định kỳ: " + System.currentTimeMillis()/1000);
        }, 2, 1, TimeUnit.SECONDS);
        
        // Để chương trình chạy trong 10 giây
        try {
            Thread.sleep(10000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        
        scheduler.shutdown();
    }
}
```

## Đồng bộ hóa trong lập trình đa luồng

Khi nhiều thread truy cập vào tài nguyên dùng chung, cần có cơ chế đồng bộ hóa để tránh các vấn đề như race condition.

### Sử dụng synchronized

```java
public class SynchronizedCounter {
    private int count = 0;
    
    // Phương thức đồng bộ
    public synchronized void increment() {
        count++;
    }
    
    // Phương thức đồng bộ
    public synchronized int getCount() {
        return count;
    }
    
    public static void main(String[] args) throws InterruptedException {
        SynchronizedCounter counter = new SynchronizedCounter();
        
        // Tạo 10 thread, mỗi thread tăng counter 1000 lần
        Thread[] threads = new Thread[10];
        for (int i = 0; i < threads.length; i++) {
            threads[i] = new Thread(() -> {
                for (int j = 0; j < 1000; j++) {
                    counter.increment();
                }
            });
            threads[i].start();
        }
        
        // Đợi tất cả thread hoàn thành
        for (Thread thread : threads) {
            thread.join();
        }
        
        // In ra kết quả cuối cùng
        System.out.println("Giá trị cuối cùng: " + counter.getCount());
        // Kết quả mong đợi là 10000
    }
}
```

### Sử dụng Lock

```java
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class LockExample {
    private int count = 0;
    private Lock lock = new ReentrantLock();
    
    public void increment() {
        lock.lock();
        try {
            count++;
        } finally {
            lock.unlock(); // Luôn unlock trong khối finally
        }
    }
    
    public int getCount() {
        lock.lock();
        try {
            return count;
        } finally {
            lock.unlock();
        }
    }
    
    public static void main(String[] args) throws InterruptedException {
        LockExample counter = new LockExample();
        
        Thread[] threads = new Thread[10];
        for (int i = 0; i < threads.length; i++) {
            threads[i] = new Thread(() -> {
                for (int j = 0; j < 1000; j++) {
                    counter.increment();
                }
            });
            threads[i].start();
        }
        
        for (Thread thread : threads) {
            thread.join();
        }
        
        System.out.println("Giá trị cuối cùng: " + counter.getCount());
    }
}
```

## Các vấn đề phổ biến trong lập trình đa luồng

### 1. Race Condition

Race condition xảy ra khi kết quả phụ thuộc vào thứ tự thực thi của các thread.

```java
public class RaceConditionDemo {
    private static int counter = 0;
    
    public static void main(String[] args) throws InterruptedException {
        Thread t1 = new Thread(() -> {
            for (int i = 0; i < 10000; i++) {
                counter++; // Không an toàn với đa luồng
            }
        });
        
        Thread t2 = new Thread(() -> {
            for (int i = 0; i < 10000; i++) {
                counter++; // Không an toàn với đa luồng
            }
        });
        
        t1.start();
        t2.start();
        t1.join();
        t2.join();
        
        // Giá trị có thể nhỏ hơn 20000 do race condition
        System.out.println("Counter: " + counter);
    }
}
```

### 2. Deadlock

Deadlock xảy ra khi hai hoặc nhiều thread chờ nhau mãi mãi.

```java
public class DeadlockDemo {
    public static void main(String[] args) {
        final String resource1 = "Resource 1";
        final String resource2 = "Resource 2";
        
        // Thread 1: Lock resource1, sau đó lock resource2
        Thread t1 = new Thread(() -> {
            synchronized (resource1) {
                System.out.println("Thread 1: Đã lock resource 1");
                
                try { Thread.sleep(100); } catch (InterruptedException e) {}
                
                synchronized (resource2) {
                    System.out.println("Thread 1: Đã lock resource 2");
                }
            }
        });
        
        // Thread 2: Lock resource2, sau đó lock resource1
        Thread t2 = new Thread(() -> {
            synchronized (resource2) {
                System.out.println("Thread 2: Đã lock resource 2");
                
                try { Thread.sleep(100); } catch (InterruptedException e) {}
                
                synchronized (resource1) {
                    System.out.println("Thread 2: Đã lock resource 1");
                }
            }
        });
        
        t1.start();
        t2.start();
    }
}
```

### 3. Producer-Consumer Pattern

Mẫu Producer-Consumer là một trong những ứng dụng phổ biến của đa luồng.

```java
import java.util.LinkedList;
import java.util.Queue;

public class ProducerConsumerExample {
    private static final int BUFFER_SIZE = 10;
    private static final Queue<Integer> buffer = new LinkedList<>();
    
    public static void main(String[] args) {
        Thread producer = new Thread(() -> {
            int value = 0;
            while (true) {
                synchronized (buffer) {
                    while (buffer.size() == BUFFER_SIZE) {
                        try {
                            buffer.wait(); // Đợi nếu buffer đầy
                        } catch (InterruptedException e) {
                            e.printStackTrace();
                        }
                    }
                    
                    System.out.println("Producer sản xuất: " + value);
                    buffer.add(value++);
                    buffer.notify(); // Thông báo cho consumer
                }
                
                try {
                    Thread.sleep(100); // Giả lập thời gian sản xuất
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        });
        
        Thread consumer = new Thread(() -> {
            while (true) {
                synchronized (buffer) {
                    while (buffer.isEmpty()) {
                        try {
                            buffer.wait(); // Đợi nếu buffer rỗng
                        } catch (InterruptedException e) {
                            e.printStackTrace();
                        }
                    }
                    
                    int value = buffer.poll();
                    System.out.println("Consumer tiêu thụ: " + value);
                    buffer.notify(); // Thông báo cho producer
                }
                
                try {
                    Thread.sleep(200); // Giả lập thời gian tiêu thụ
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        });
        
        producer.start();
        consumer.start();
    }
}
```

## Tối ưu hóa hiệu suất với Fork/Join Framework

Fork/Join Framework là một cải tiến của ExecutorService để thực hiện các tác vụ có thể chia nhỏ theo phương pháp divide-and-conquer.

```java
import java.util.concurrent.ForkJoinPool;
import java.util.concurrent.RecursiveTask;

public class ForkJoinExample {
    // Task tính tổng một mảng số nguyên
    static class SumTask extends RecursiveTask<Long> {
        private final int[] array;
        private final int start;
        private final int end;
        private static final int THRESHOLD = 1000; // Ngưỡng để chia nhỏ task
        
        public SumTask(int[] array, int start, int end) {
            this.array = array;
            this.start = start;
            this.end = end;
        }
        
        @Override
        protected Long compute() {
            if (end - start <= THRESHOLD) {
                // Nếu kích thước đủ nhỏ, tính trực tiếp
                long sum = 0;
                for (int i = start; i < end; i++) {
                    sum += array[i];
                }
                return sum;
            } else {
                // Chia task thành 2 phần
                int middle = start + (end - start) / 2;
                
                SumTask leftTask = new SumTask(array, start, middle);
                SumTask rightTask = new SumTask(array, middle, end);
                
                // Fork các subtask
                leftTask.fork();
                
                // Tính toán nhánh phải trực tiếp
                long rightResult = rightTask.compute();
                
                // Join kết quả từ nhánh trái
                long leftResult = leftTask.join();
                
                // Kết hợp kết quả
                return leftResult + rightResult;
            }
        }
    }
    
    public static void main(String[] args) {
        // Tạo mảng với 100 triệu phần tử
        int[] array = new int[100_000_000];
        for (int i = 0; i < array.length; i++) {
            array[i] = i + 1;
        }
        
        // Tạo ForkJoinPool với số lượng processor hiện có
        ForkJoinPool pool = ForkJoinPool.commonPool();
        
        // Tạo task và thực thi
        SumTask task = new SumTask(array, 0, array.length);
        long startTime = System.currentTimeMillis();
        long result = pool.invoke(task);
        long endTime = System.currentTimeMillis();
        
        System.out.println("Kết quả: " + result);
        System.out.println("Thời gian: " + (endTime - startTime) + "ms");
        
        // So sánh với phương pháp tuần tự
        startTime = System.currentTimeMillis();
        long sum = 0;
        for (int value : array) {
            sum += value;
        }
        endTime = System.currentTimeMillis();
        
        System.out.println("Kết quả tuần tự: " + sum);
        System.out.println("Thời gian tuần tự: " + (endTime - startTime) + "ms");
    }
}
```

## Kết luận

Lập trình đa luồng và Thread Pool trong Java là những công cụ mạnh mẽ để tối ưu hiệu suất ứng dụng, đặc biệt là trên các hệ thống đa nhân hiện đại. Tuy nhiên, cần hiểu rõ và cẩn thận khi làm việc với các vấn đề đồng bộ hóa và chia sẻ tài nguyên.

Trong bài viết này, chúng ta đã tìm hiểu:
- Cách tạo và quản lý thread trong Java
- Vòng đời của thread
- Sử dụng Thread Pool để tối ưu việc quản lý thread
- Các kỹ thuật đồng bộ hóa
- Các vấn đề phổ biến như race condition và deadlock
- Mẫu Producer-Consumer
- Fork/Join Framework

Việc áp dụng đúng các kỹ thuật đa luồng không chỉ giúp cải thiện hiệu suất mà còn làm cho ứng dụng của bạn phản hồi nhanh hơn và tận dụng tốt hơn tài nguyên phần cứng.

## Tài liệu tham khảo

1. Oracle Java Documentation - [Concurrency](https://docs.oracle.com/javase/tutorial/essential/concurrency/index.html)
2. "Java Concurrency in Practice" - Brian Goetz
3. "Effective Java" - Joshua Bloch
4. [Oracle: Executor Framework](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/Executor.html)
5. [Oracle: Fork/Join](https://docs.oracle.com/javase/tutorial/essential/concurrency/forkjoin.html)





