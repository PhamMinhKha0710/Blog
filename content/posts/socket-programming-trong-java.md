+++
title = "Socket Programming trong Java: Xây dựng ứng dụng Client-Server"
date = "2025-09-25"
description = "Hiểu Socket Programming qua ví dụ thực tế: Xây dựng ứng dụng chat, file transfer. Từ cơ bản đến nâng cao với multithreading và NIO"
categories = ["Java"]
tags = ["Java", "Networking", "Socket"]
author = "Phạm Minh Kha"
+++

## Socket là gì? Hãy tưởng tượng đơn giản!

Bạn có bao giờ nghĩ **hai máy tính nói chuyện với nhau** giống như hai người gọi điện thoại không? Socket chính là "chiếc điện thoại" đó!

**Hình dung đơn giản:**
- **Socket** = Ổ cắm điện thoại 🔌
- **IP Address** = Số nhà của bạn 🏠
- **Port** = Số phòng trong nhà (cổng 80 = phòng web, cổng 8080 = phòng server của bạn)
- **Kết nối** = Dây điện thoại nối hai bên lại

Khi bạn vào Facebook:
1. Máy bạn (Client) "gọi điện" đến máy chủ Facebook (Server) 
2. Server "nhấc máy" và hai bên bắt đầu trò chuyện
3. Bạn gửi request "cho tôi xem newsfeed", server trả về dữ liệu

**Trong Java**, bạn chỉ cần 2 lớp:
- `ServerSocket` - Server dùng để "ngồi đợi điện thoại reo"
- `Socket` - Client dùng để "gọi điện" + Server dùng để "nói chuyện" với từng client

---

## TCP vs UDP: Chọn giao thức nào?

### TCP - Như gửi thư bảo đảm 📬

**Đặc điểm:** Chậm nhưng chắc chắn!

Hãy tưởng tượng bạn gửi 10 tờ giấy có đánh số từ 1-10:
- TCP đảm bảo **người nhận sẽ nhận đủ 10 tờ, đúng thứ tự 1→10**
- Nếu tờ số 5 bị mất → TCP tự động **gửi lại**
- Nếu tờ 7 đến trước tờ 6 → TCP tự động **sắp xếp lại**

**Khi nào dùng TCP?**
- ✅ Chat app (tin nhắn không được mất)
- ✅ Download file (file phải đầy đủ 100%)
- ✅ Banking app (giao dịch phải chính xác tuyệt đối)

### UDP - Như la hét qua đường 📢

**Đặc điểm:** Nhanh nhưng có thể mất data!

Tưởng tượng bạn la hét 10 câu:
- UDP **không quan tâm** người kia có nghe hết không
- **Không gửi lại** nếu câu nào đó bị gió thổi bay mất
- **Không đảm bảo thứ tự** - có thể câu 8 đến trước câu 3

**Khi nào dùng UDP?**
- ✅ Video call, livestream (mất vài frame không sao, quan trọng là mượt)
- ✅ Game online (lag 1 frame chấp nhận được)
- ✅ DNS lookup (query nhỏ, gửi lại rẻ hơn setup TCP)

**Trong series này, chúng ta focus vào TCP** vì nó phổ biến và dễ học hơn!

---

## Xây dựng ứng dụng Client-Server đầu tiên

### Bước 1: Server - Người ngồi đợi điện thoại reo 📞

**Quy trình hoạt động:**

1. Tạo ServerSocket(8080) → "Tôi ngồi đợi ở cổng 8080"
2. accept() → "Ngồi đợi... ai đó gọi điện đến chưa?"
   - ⏸️ **CHẶN TẠI ĐÂY** - chờ mãi đến khi có client
3. Có client kết nối! → accept() trả về Socket mới
4. Dùng Socket này để đọc/ghi data với client
5. Đóng kết nối → "Cúp máy"

**Code Server:**

```java
import java.io.*;
import java.net.*;

public class SimpleServer {
    public static void main(String[] args) {
        int port = 8080;
        
        try (ServerSocket serverSocket = new ServerSocket(port)) {
            System.out.println("🚀 Server đang chờ kết nối tại cổng " + port);
            
            while (true) {
                // Chờ client gọi đến (BLOCKING tại đây)
                Socket clientSocket = serverSocket.accept();
                System.out.println("✅ Client vừa kết nối: " + 
                    clientSocket.getInetAddress().getHostAddress());
                
                // Đọc tin nhắn từ client
                BufferedReader in = new BufferedReader(
                    new InputStreamReader(clientSocket.getInputStream()));
                String message = in.readLine();
                System.out.println("📩 Nhận được: " + message);
                
                // Trả lời client
                PrintWriter out = new PrintWriter(
                    clientSocket.getOutputStream(), true);
                out.println("Server đã nhận: " + message);
                
                // Đóng kết nối
                clientSocket.close();
                System.out.println("👋 Client đã ngắt kết nối\n");
            }
        } catch (IOException e) {
            System.err.println("❌ Lỗi server: " + e.getMessage());
        }
    }
}
```

**Giải thích từng dòng:**

```java
ServerSocket serverSocket = new ServerSocket(8080);
// "Tôi mở cửa hàng tại địa chỉ cổng 8080"

Socket clientSocket = serverSocket.accept();
// "Tôi ngồi đợi khách vào... (chặn tại đây)"
// Khi có khách → trả về "cái điện thoại" để nói chuyện

BufferedReader in = new BufferedReader(...);
// "Tai nghe" - dùng để NGHE client nói gì

PrintWriter out = new PrintWriter(..., true);
// "Micro" - dùng để NÓI với client
// Tham số 'true' = auto-flush (nói xong đẩy ngay, không giữ lại)
```

---

### Bước 2: Client - Người gọi điện thoại 📱

**Quy trình hoạt động:**

1. new Socket("localhost", 8080) → "Gọi đến server ở localhost:8080"
   - ⏸️ **CHẶN** cho đến khi kết nối thành công
2. Kết nối OK! → Có Socket để đọc/ghi
3. Gửi message → "Xin chào server!"
4. Đọc phản hồi từ server
5. Đóng kết nối

**Code Client:**

```java
import java.io.*;
import java.net.*;

public class SimpleClient {
    public static void main(String[] args) {
        String serverAddress = "localhost";
        int port = 8080;
        
        try (Socket socket = new Socket(serverAddress, port)) {
            System.out.println("✅ Đã kết nối đến server!");
            
            // Gửi tin nhắn
            PrintWriter out = new PrintWriter(
                socket.getOutputStream(), true);
            String message = "Xin chào từ Client!";
            out.println(message);
            System.out.println("📤 Đã gửi: " + message);
            
            // Nhận phản hồi
            BufferedReader in = new BufferedReader(
                new InputStreamReader(socket.getInputStream()));
            String response = in.readLine();
            System.out.println("📥 Server trả lời: " + response);
            
        } catch (IOException e) {
            System.err.println("❌ Không kết nối được: " + e.getMessage());
        }
    }
}
```

**Chạy thử:**

```bash
# Terminal 1 - Chạy Server trước
java SimpleServer
🚀 Server đang chờ kết nối tại cổng 8080

# Terminal 2 - Chạy Client
java SimpleClient
✅ Đã kết nối đến server!
📤 Đã gửi: Xin chào từ Client!
📥 Server trả lời: Server đã nhận: Xin chào từ Client!
```

---

## Vấn đề: Server chỉ phục vụ được 1 client! 😱

**Thử nghiệm:**
- Chạy Client thứ 2 trong khi Client 1 đang kết nối
- Client 2 phải **chờ** đến khi Client 1 xong mới được phục vụ!

**Nguyên nhân:**
Server chỉ có **1 luồng duy nhất**:
```
accept() → xử lý client 1 → đóng → accept() → xử lý client 2...
```

Giống như quán cà phê chỉ có 1 nhân viên:
- Khách A vào → nhân viên pha cà phê cho A (5 phút)
- Khách B, C, D phải đứng chờ ngoài cửa 😤

**Giải pháp: Multithreading!** (Thuê thêm nhân viên)

---

## Server đa luồng - Phục vụ nhiều client cùng lúc

**Ý tưởng:** 
- **Luồng chính** (Main Thread): Chỉ làm 1 việc duy nhất là `accept()` - ngồi đón khách
- **Worker Threads**: Mỗi client được giao cho 1 worker thread riêng để phục vụ

**Sơ đồ:**
```
Main Thread:        Worker Threads:
┌─────────┐        ┌──────────────┐
│ accept()│───────→│ Thread 1     │ ← Client A
│    ⬇️    │        │ (đọc/ghi)    │
│ accept()│───────→│ Thread 2     │ ← Client B
│    ⬇️    │        │ (đọc/ghi)    │
│ accept()│───────→│ Thread 3     │ ← Client C
└─────────┘        └──────────────┘
```

**Code Server đa luồng:**

```java
import java.io.*;
import java.net.*;

public class MultithreadedServer {
    public static void main(String[] args) {
        int port = 8080;
        
        try (ServerSocket serverSocket = new ServerSocket(port)) {
            System.out.println("🚀 Server đa luồng đang chạy...");
            
            while (true) {
                Socket clientSocket = serverSocket.accept();
                System.out.println("✅ Client mới kết nối!");
                
                // Tạo thread mới để xử lý client này
                ClientHandler handler = new ClientHandler(clientSocket);
                new Thread(handler).start();
                // Main thread lập tức quay lại accept() → đón client tiếp theo!
            }
        } catch (IOException e) {
            System.err.println("❌ Lỗi: " + e.getMessage());
        }
    }
    
    // Worker thread - mỗi thread phục vụ 1 client
    private static class ClientHandler implements Runnable {
        private Socket clientSocket;
        
        public ClientHandler(Socket socket) {
            this.clientSocket = socket;
        }
        
        @Override
        public void run() {
            try (
                BufferedReader in = new BufferedReader(
                    new InputStreamReader(clientSocket.getInputStream()));
                PrintWriter out = new PrintWriter(
                    clientSocket.getOutputStream(), true);
            ) {
                String message;
                // Đọc liên tục cho đến khi client ngắt kết nối
                while ((message = in.readLine()) != null) {
                    System.out.println("📩 [" + 
                        clientSocket.getInetAddress() + "]: " + message);
                    out.println("Echo: " + message);
                }
            } catch (IOException e) {
                System.err.println("Lỗi xử lý client: " + e.getMessage());
            } finally {
                try {
                    clientSocket.close();
                    System.out.println("👋 Client ngắt kết nối");
                } catch (IOException e) {}
            }
        }
    }
}
```

**Giải thích:**

1. **Main thread** chỉ chạy vòng lặp `accept()` - nhẹ nhàng, nhanh chóng
2. Mỗi khi có client → **tạo ClientHandler** (Runnable)
3. **new Thread(handler).start()** → Ném handler cho thread mới xử lý
4. Main thread **không chờ** thread kia xong → lập tức quay lại `accept()`

**Kết quả:** Server giờ có thể phục vụ 10, 100, 1000 clients cùng lúc! 🎉

---

## Ứng dụng thực tế: Xây dựng Chat Server

Giờ chúng ta làm thứ thú vị hơn - **Chat room** nơi nhiều người có thể nói chuyện với nhau!

**Tính năng:**
- Nhiều client kết nối cùng lúc
- Khi 1 người gửi tin → **tất cả mọi người** đều nhận được (broadcast)
- Mỗi người có tên riêng

### Chat Server - Phát tin cho tất cả mọi người

**Ý tưởng chính:**

Lưu danh sách tất cả client đang online, khi có tin nhắn mới thì gửi cho tất cả:

```java
// Lưu danh sách tất cả client đang online
Set<PrintWriter> allClients = new HashSet<>();

// Khi có tin nhắn mới
void broadcast(String message) {
    for (PrintWriter client : allClients) {
        client.println(message);  // Gửi cho từng người
    }
}
```

**Code hoàn chỉnh:**

```java
import java.io.*;
import java.net.*;
import java.util.*;

public class ChatServer {
    // Danh sách tất cả client đang online
    private static Set<PrintWriter> clientWriters = 
        Collections.synchronizedSet(new HashSet<>());
    
    public static void main(String[] args) {
        int port = 8080;
        
        try (ServerSocket serverSocket = new ServerSocket(port)) {
            System.out.println("💬 Chat Server đang chạy...");
            
            while (true) {
                new ClientHandler(serverSocket.accept()).start();
            }
        } catch (IOException e) {
            System.err.println("❌ Lỗi: " + e.getMessage());
        }
    }
    
    private static class ClientHandler extends Thread {
        private Socket socket;
        private PrintWriter out;
        private String clientName;
        
        public ClientHandler(Socket socket) {
            this.socket = socket;
        }
        
        @Override
        public void run() {
            try {
                BufferedReader in = new BufferedReader(
                    new InputStreamReader(socket.getInputStream()));
                out = new PrintWriter(socket.getOutputStream(), true);
                
                // Yêu cầu client nhập tên
                out.println("SUBMITNAME");
                clientName = in.readLine();
                
                if (clientName == null || clientName.trim().isEmpty()) {
                    return;  // Client không nhập tên → đuổi ra
                }
                
                System.out.println("✅ " + clientName + " đã tham gia");
                broadcast(clientName + " đã tham gia chat! 👋");
                
                // Thêm client vào danh sách
                clientWriters.add(out);
                
                // Lắng nghe tin nhắn
                String message;
                while ((message = in.readLine()) != null) {
                    if (!message.trim().isEmpty()) {
                        System.out.println("[" + clientName + "]: " + message);
                        broadcast(clientName + ": " + message);
                    }
                }
            } catch (IOException e) {
                System.err.println("Lỗi: " + e.getMessage());
            } finally {
                // Client rời đi
                if (clientName != null) {
                    System.out.println("👋 " + clientName + " đã rời khỏi chat");
                    broadcast(clientName + " đã rời khỏi chat");
                }
                if (out != null) {
                    clientWriters.remove(out);
                }
                try { socket.close(); } catch (IOException e) {}
            }
        }
        
        // Gửi tin nhắn cho TẤT CẢ client
        private void broadcast(String message) {
            for (PrintWriter writer : clientWriters) {
                writer.println(message);
            }
        }
    }
}
```

### Chat Client - Giao diện đơn giản

```java
import java.io.*;
import java.net.*;
import java.util.Scanner;

public class ChatClient {
    public static void main(String[] args) {
        String serverAddress = "localhost";
        int port = 8080;
        
        try {
            Socket socket = new Socket(serverAddress, port);
            System.out.println("✅ Đã kết nối vào Chat Server");
            
            // Thread đọc tin nhắn từ server
            new Thread(new MessageReader(socket)).start();
            
            // Thread chính: Đọc input từ bàn phím và gửi đi
            PrintWriter out = new PrintWriter(socket.getOutputStream(), true);
            Scanner scanner = new Scanner(System.in);
            
            while (scanner.hasNextLine()) {
                String input = scanner.nextLine();
                out.println(input);
            }
            
        } catch (IOException e) {
            System.err.println("❌ Không kết nối được: " + e.getMessage());
        }
    }
    
    // Thread riêng để đọc tin nhắn từ server
    private static class MessageReader implements Runnable {
        private BufferedReader in;
        private Socket socket;
        
        public MessageReader(Socket socket) {
            this.socket = socket;
            try {
                this.in = new BufferedReader(
                    new InputStreamReader(socket.getInputStream()));
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        
        @Override
        public void run() {
            try {
                String message;
                while ((message = in.readLine()) != null) {
                    if (message.equals("SUBMITNAME")) {
                        // Server yêu cầu nhập tên
                        Scanner scanner = new Scanner(System.in);
                        System.out.print("Nhập tên của bạn: ");
                        String name = scanner.nextLine();
                        
                        PrintWriter out = new PrintWriter(
                            socket.getOutputStream(), true);
                        out.println(name);
                    } else {
                        // Hiển thị tin nhắn
                        System.out.println(message);
                    }
                }
            } catch (IOException e) {
                System.err.println("❌ Mất kết nối!");
            }
        }
    }
}
```

**Chạy thử:**

```bash
# Terminal 1: Server
java ChatServer
💬 Chat Server đang chạy...

# Terminal 2: Client A
java ChatClient
✅ Đã kết nối vào Chat Server
Nhập tên của bạn: Alice
Alice đã tham gia chat! 👋

# Terminal 3: Client B  
java ChatClient
Nhập tên của bạn: Bob
Bob đã tham gia chat! 👋

# Alice gõ:
Hello everyone!
→ Hiển thị ở tất cả terminals: "Alice: Hello everyone!"
```

---

## Kiến thức quan trọng: Blocking I/O

**"Blocking" nghĩa là gì?**

Hãy tưởng tượng bạn gọi điện cho Pizza Hut:

1. Bạn: "Cho tôi 1 pizza"
2. 🔇 **CHẶN** - Bạn cầm điện thoại chờ...
3. 🔇 **CHẶN** - Không làm gì được, chỉ ngồi chờ...
4. Pizza Hut: "OK, đơn của bạn đã nhận!"
5. → Giờ bạn mới có thể cúp máy và làm việc khác

**Trong Socket Programming:**

```java
String message = in.readLine();  // CHẶN TẠI ĐÂY!
```

- Dòng này sẽ **đứng im** cho đến khi có data từ client
- Thread không thể làm gì khác!
- Nếu client không gửi gì → thread bị "đóng băng" mãi mãi

**Vấn đề của Blocking I/O:**

- Server có 100 threads
- → Có thể phục vụ tối đa 100 clients
- → Client 101 phải chờ!
- Mỗi thread tốn ~1MB RAM → **10,000 clients = 10GB RAM!** 😱

**Giải pháp: Non-Blocking I/O (NIO)** - nhưng phức tạp hơn nhiều!

---

## Thread Pool - Quản lý thread thông minh

**Vấn đề của "thread per client":**

```java
while (true) {
    Socket client = serverSocket.accept();
    new Thread(new Handler(client)).start();  // TẠO THREAD MỚI
}
```

Nếu có 10,000 clients kết nối cùng lúc:
- Tạo 10,000 threads → **Tốn RAM khủng khiếp**
- CPU phải switch qua lại giữa 10,000 threads → **Chậm**

**Giải pháp: Thread Pool**

Thay vì tạo thread mới mỗi lần, ta **chuẩn bị sẵn một nhóm threads** (ví dụ: 50 threads):

**Sơ đồ Thread Pool:**
```
Pool có 50 threads sẵn sàng
┌─────────────────┐
│ T1  T2  T3 ... │  ← Đợi việc
│ T4  T5  T6 ... │
└─────────────────┘
   ↑
   │ Client mới đến
   └─ Lấy 1 thread rỗi để xử lý
   
Khi xử lý xong → Thread trả về Pool → Dùng lại cho client khác
```

**Code với Thread Pool:**

```java
import java.io.*;
import java.net.*;
import java.util.concurrent.*;

public class ThreadPoolServer {
    public static void main(String[] args) {
        int port = 8080;
        int threadPoolSize = 50;  // Tối đa 50 threads
        
        // Tạo Thread Pool
        ExecutorService threadPool = 
            Executors.newFixedThreadPool(threadPoolSize);
        
        try (ServerSocket serverSocket = new ServerSocket(port)) {
            System.out.println("🚀 Server với Thread Pool đang chạy...");
            
            while (true) {
                Socket clientSocket = serverSocket.accept();
                System.out.println("✅ Client mới kết nối");
                
                // Không tạo thread mới! Dùng thread từ pool
                threadPool.execute(new ClientHandler(clientSocket));
            }
        } catch (IOException e) {
            System.err.println("❌ Lỗi: " + e.getMessage());
        } finally {
            threadPool.shutdown();  // Tắt pool khi server dừng
        }
    }
    
    private static class ClientHandler implements Runnable {
        private Socket clientSocket;
        
        public ClientHandler(Socket socket) {
            this.clientSocket = socket;
        }
        
        @Override
        public void run() {
            try (
                BufferedReader in = new BufferedReader(
                    new InputStreamReader(clientSocket.getInputStream()));
                PrintWriter out = new PrintWriter(
                    clientSocket.getOutputStream(), true);
            ) {
                String message;
                while ((message = in.readLine()) != null) {
                    out.println("Echo: " + message);
                }
            } catch (IOException e) {
                System.err.println("Lỗi: " + e.getMessage());
            }
        }
    }
}
```

**Lợi ích:**
- ✅ Kiểm soát được số lượng threads → Không tốn RAM quá mức
- ✅ Tái sử dụng threads → Nhanh hơn (không phải tạo/hủy liên tục)
- ✅ Giới hạn tải → Nếu có 1000 clients nhưng chỉ có 50 threads, chỉ xử lý 50 cùng lúc

---

## Java NIO - Non-Blocking I/O (Nâng cao)

**Vấn đề của Blocking I/O:**

Mô hình truyền thống: **1 Thread = 1 Client**

```
10,000 clients → Cần 10,000 threads → 💀 Server chết
```

**Giải pháp NIO: 1 Thread xử lý NHIỀU clients!**

### Ý tưởng: Selector (Người giám sát)

Tưởng tượng bạn là shipper có 100 đơn hàng cần giao:

**Cách cũ (Blocking I/O):**
```
Thuê 100 người ship, mỗi người 1 đơn
→ Tốn lương khủng khiếp!
```

**Cách mới (NIO):**
```
1 shipper duy nhất, có app smart:
→ App thông báo: "Đơn số 5 đã sẵn sàng lấy"
→ Shipper lấy đơn 5, giao xong
→ App: "Đơn 12 và 37 đã sẵn sàng"
→ Shipper lấy 12 và 37...
```

**Trong Java NIO:**

```java
Selector selector = Selector.open();  // "Người giám sát"

// Đăng ký 1000 channels (clients) với selector
for (SocketChannel client : clients) {
    client.register(selector, SelectionKey.OP_READ);
}

while (true) {
    // Hỏi: "Client nào có data để đọc?"
    selector.select();  // CHẶN cho đến khi có ít nhất 1 client sẵn sàng
    
    // Lấy danh sách clients đã sẵn sàng
    Set<SelectionKey> readyKeys = selector.selectedKeys();
    
    for (SelectionKey key : readyKeys) {
        // Xử lý từng client đã sẵn sàng
        if (key.isReadable()) {
            SocketChannel client = (SocketChannel) key.channel();
            // Đọc data từ client này
        }
    }
}
```

**So sánh:**

| Đặc điểm | Blocking I/O | Non-Blocking I/O (NIO) |
|----------|--------------|------------------------|
| **Threads cần** | 1 thread = 1 client | 1 thread = N clients |
| **Độ phức tạp** | ⭐ Đơn giản | ⭐⭐⭐⭐ Phức tạp |
| **Khả năng mở rộng** | ❌ Giới hạn (vài nghìn clients) | ✅ Tốt (hàng chục nghìn clients) |
| **Khi nào dùng** | Hầu hết ứng dụng | Khi cần xử lý >5000 clients |

**Lời khuyên:**
- Với <1000 clients: Dùng **Blocking I/O + Thread Pool** (đơn giản, đủ dùng)
- Với >5000 clients: Dùng **NIO** hoặc framework như **Netty** (chuyên nghiệp hơn)

---

## Những lỗi thường gặp và cách xử lý

### 1. ConnectException - "Không gọi được"

```java
java.net.ConnectException: Connection refused
```

**Nguyên nhân:**
- Server chưa chạy
- Sai IP hoặc Port
- Firewall chặn kết nối

**Cách xử lý:**

```java
try {
    Socket socket = new Socket("localhost", 8080);
} catch (ConnectException e) {
    System.err.println("❌ Server chưa mở! Hãy chạy server trước.");
} catch (IOException e) {
    System.err.println("❌ Lỗi kết nối: " + e.getMessage());
}
```

### 2. SocketException - "Đứt dây giữa chừng"

```java
java.net.SocketException: Connection reset
```

**Nguyên nhân:**
- Client đột ngột ngắt kết nối (đóng app, mất mạng)
- Ghi vào socket đã đóng

**Cách xử lý:**

```java
try {
    String message = in.readLine();
    if (message == null) {
        // Client đã ngắt kết nối
        System.out.println("Client đã thoát");
        break;
    }
} catch (SocketException e) {
    System.out.println("Mất kết nối với client");
    break;
}
```

### 3. Auto-flush là gì? Tại sao quan trọng?

**Vấn đề:**

```java
PrintWriter out = new PrintWriter(socket.getOutputStream());  // THIẾU TRUE!
out.println("Hello");
// "Hello" BỊ KẸT trong buffer, KHÔNG được gửi đi!
```

Giống như bạn viết thư nhưng **không bỏ vào hòm thư**:

```
Bạn viết xong thư → Để trên bàn
Bưu điện không biết → Thư không đi!
```

**Giải pháp:**

```java
PrintWriter out = new PrintWriter(socket.getOutputStream(), true);
//                                                          ^^^^^^ AUTO-FLUSH
out.println("Hello");  
// "Hello" tự động được ĐẨY ra socket ngay lập tức!
```

Hoặc gọi `flush()` thủ công:

```java
PrintWriter out = new PrintWriter(socket.getOutputStream());
out.println("Hello");
out.flush();  // Đẩy data ra ngoài
```

### 4. Try-with-resources - Tự động đóng tài nguyên

**Cách cũ (dễ quên đóng socket):**

```java
Socket socket = null;
try {
    socket = new Socket("localhost", 8080);
    // ... làm việc với socket
} finally {
    if (socket != null) {
        socket.close();  // Dễ quên!
    }
}
```

**Cách mới (Java 7+):**

```java
try (Socket socket = new Socket("localhost", 8080)) {
    // ... làm việc với socket
}  // Tự động đóng socket khi ra khỏi block!
```

**Lợi ích:**
- ✅ Không quên đóng socket
- ✅ Code ngắn gọn hơn
- ✅ An toàn hơn (đóng ngay cả khi có exception)

---

## Tóm tắt và Best Practices

### ✅ Checklist cho Socket Programming

**1. Quản lý tài nguyên:**
- ✅ Luôn dùng `try-with-resources`
- ✅ Đóng Socket, Stream khi không dùng nữa
- ✅ Đặt timeout để tránh bị treo mãi: `socket.setSoTimeout(30000);` (30 giây)

**2. Xử lý lỗi:**
- ✅ Bắt `ConnectException` ở Client
- ✅ Bắt `SocketException` khi đọc/ghi
- ✅ Kiểm tra `readLine() == null` (client đã ngắt kết nối)

**3. Hiệu suất:**
- ✅ Dùng `BufferedReader` thay vì đọc từng byte
- ✅ Bật auto-flush cho `PrintWriter`
- ✅ Với nhiều clients: Dùng **Thread Pool**

**4. Kiến trúc Server:**

| Số clients | Kiến trúc nên dùng |
|------------|-------------------|
| 1-10 | Single-threaded (đơn giản nhất) |
| 10-1000 | Thread Pool (Executors.newFixedThreadPool) |
| >5000 | Java NIO hoặc Netty Framework |

---

## Kết luận

Socket Programming trong Java có thể tóm gọn thành:

**1. Khái niệm cốt lõi:**
- Socket = "Ống nước" nối 2 máy tính
- TCP = Đảm bảo data đến nơi, đúng thứ tự
- UDP = Nhanh nhưng có thể mất data

**2. Code cơ bản:**
```java
// Server
ServerSocket server = new ServerSocket(8080);
Socket client = server.accept();  // Chờ client

// Client  
Socket socket = new Socket("localhost", 8080);  // Kết nối

// Đọc/Ghi
BufferedReader in = new BufferedReader(...);   // Đọc
PrintWriter out = new PrintWriter(..., true);  // Ghi
```

**3. Nâng cao:**
- Dùng Thread Pool để xử lý nhiều clients
- Dùng NIO khi cần xử lý >5000 connections

**4. Điều quan trọng nhất:**
- ✅ Luôn đóng resources (try-with-resources)
- ✅ Xử lý exceptions đúng cách
- ✅ Bật auto-flush cho PrintWriter

Giờ bạn đã hiểu Socket Programming! Hãy thử xây dựng chat app, file transfer hoặc game multiplayer của riêng bạn! 🚀

---

## Tài liệu tham khảo

- [Oracle Java Networking Tutorial](https://docs.oracle.com/javase/tutorial/networking/index.html)
- [Java Socket Programming Examples - Baeldung](https://www.baeldung.com/a-guide-to-java-sockets)
- [Java NIO Tutorial - Jenkov.com](http://tutorials.jenkov.com/java-nio/index.html)
- [Netty Framework](https://netty.io/) - Production-ready NIO framework
