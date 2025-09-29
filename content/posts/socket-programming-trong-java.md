+++
title = "Socket Programming trong Java: Xây dựng ứng dụng Client-Server"
date = "2025-09-25"
description = "Tìm hiểu về lập trình Socket trong Java và cách xây dựng ứng dụng client-server đơn giản với các ví dụ thực tế"
categories = ["Java"]
tags = ["Java", "Networking", "Socket"]
author = "Phạm Minh Kha"
+++

## Socket Programming trong Java là gì?

Socket Programming là kỹ thuật lập trình cho phép giao tiếp giữa các máy tính khác nhau thông qua mạng. Trong Java, việc xây dựng ứng dụng client-server trở nên dễ dàng hơn nhờ vào package `java.net` cung cấp các lớp như `Socket` và `ServerSocket` để thực hiện giao tiếp mạng.

Socket programming đóng vai trò quan trọng trong việc phát triển các ứng dụng phân tán, hệ thống chat, trò chơi trực tuyến hay bất kỳ ứng dụng nào yêu cầu giao tiếp qua mạng.

### Cơ bản về Socket

Trong lập trình mạng, Socket là một điểm kết nối cho phép giao tiếp hai chiều giữa hai chương trình chạy trên mạng. Socket được định nghĩa bởi địa chỉ IP và số cổng (port number). Có hai loại socket chính:

1. **TCP Socket**: Cung cấp kết nối tin cậy, theo luồng dữ liệu
2. **UDP Socket**: Cung cấp kết nối không tin cậy, dựa trên gói tin

Trong bài viết này, chúng ta sẽ tập trung vào TCP Socket trong Java với các lớp `Socket` và `ServerSocket`.

## Xây dựng ứng dụng Client-Server đơn giản

### Mô hình hoạt động

Mô hình client-server hoạt động như sau:

1. Server tạo một ServerSocket và lắng nghe kết nối đến từ client
2. Client tạo Socket và kết nối đến Server
3. Server chấp nhận kết nối từ client
4. Thiết lập luồng dữ liệu vào/ra (InputStream và OutputStream)
5. Trao đổi dữ liệu giữa client và server
6. Đóng kết nối

### Code ví dụ cho Server

```java
import java.io.*;
import java.net.*;

public class SimpleServer {
    public static void main(String[] args) {
        // Port mặc định
        int port = 8080;
        
        try (ServerSocket serverSocket = new ServerSocket(port)) {
            System.out.println("Server đang lắng nghe trên cổng " + port);
            
            // Server chạy liên tục để chấp nhận nhiều kết nối
            while (true) {
                // Chấp nhận kết nối từ client
                Socket clientSocket = serverSocket.accept();
                System.out.println("Client đã kết nối: " + clientSocket.getInetAddress().getHostAddress());
                
                // Tạo luồng đầu vào và đầu ra
                BufferedReader in = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));
                PrintWriter out = new PrintWriter(clientSocket.getOutputStream(), true);
                
                // Đọc dữ liệu từ client
                String message = in.readLine();
                System.out.println("Nhận từ client: " + message);
                
                // Gửi phản hồi cho client
                out.println("Server đã nhận: " + message);
                
                // Đóng kết nối với client hiện tại
                clientSocket.close();
                System.out.println("Kết nối với client đã đóng");
            }
        } catch (IOException e) {
            System.out.println("Lỗi server: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
```

### Code ví dụ cho Client

```java
import java.io.*;
import java.net.*;

public class SimpleClient {
    public static void main(String[] args) {
        // Địa chỉ và port của server
        String serverAddress = "localhost";
        int port = 8080;
        
        try (Socket socket = new Socket(serverAddress, port)) {
            System.out.println("Đã kết nối đến server: " + serverAddress + ":" + port);
            
            // Tạo luồng đầu vào và đầu ra
            BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
            PrintWriter out = new PrintWriter(socket.getOutputStream(), true);
            
            // Gửi tin nhắn đến server
            String message = "Xin chào từ client!";
            out.println(message);
            System.out.println("Đã gửi đến server: " + message);
            
            // Nhận phản hồi từ server
            String response = in.readLine();
            System.out.println("Phản hồi từ server: " + response);
            
        } catch (IOException e) {
            System.out.println("Lỗi client: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
```

## Xử lý nhiều kết nối cùng lúc với Multithreading

Trong ứng dụng thực tế, server cần xử lý nhiều kết nối client cùng lúc. Để làm được điều này, chúng ta sử dụng Multithreading để mỗi kết nối client được xử lý trong một thread riêng.

### Ví dụ Server đa luồng

```java
import java.io.*;
import java.net.*;

public class MultithreadedServer {
    public static void main(String[] args) {
        int port = 8080;
        
        try (ServerSocket serverSocket = new ServerSocket(port)) {
            System.out.println("Multithreaded Server đang lắng nghe trên cổng " + port);
            
            while (true) {
                Socket clientSocket = serverSocket.accept();
                System.out.println("Client mới kết nối: " + clientSocket.getInetAddress().getHostAddress());
                
                // Tạo thread mới để xử lý kết nối
                ClientHandler clientHandler = new ClientHandler(clientSocket);
                new Thread(clientHandler).start();
            }
        } catch (IOException e) {
            System.out.println("Lỗi server: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    // Lớp xử lý kết nối client
    private static class ClientHandler implements Runnable {
        private Socket clientSocket;
        
        public ClientHandler(Socket socket) {
            this.clientSocket = socket;
        }
        
        @Override
        public void run() {
            try (
                BufferedReader in = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));
                PrintWriter out = new PrintWriter(clientSocket.getOutputStream(), true);
            ) {
                String message;
                // Đọc tin nhắn từ client cho đến khi client ngắt kết nối
                while ((message = in.readLine()) != null) {
                    System.out.println("Nhận từ " + clientSocket.getInetAddress().getHostAddress() + ": " + message);
                    
                    // Phản hồi lại client
                    out.println("Server đã nhận: " + message);
                }
            } catch (IOException e) {
                System.out.println("Lỗi xử lý client: " + e.getMessage());
            } finally {
                try {
                    clientSocket.close();
                    System.out.println("Kết nối với " + clientSocket.getInetAddress().getHostAddress() + " đã đóng");
                } catch (IOException e) {
                    System.out.println("Lỗi đóng socket: " + e.getMessage());
                }
            }
        }
    }
}
```

## Sử dụng Socket trong ứng dụng Chat đơn giản

Để minh họa một ứng dụng thực tế hơn, hãy tạo một ứng dụng chat đơn giản giữa nhiều client.

### Chat Server

```java
import java.io.*;
import java.net.*;
import java.util.*;

public class ChatServer {
    private static Set<PrintWriter> clientWriters = Collections.synchronizedSet(new HashSet<>());
    
    public static void main(String[] args) {
        int port = 8080;
        
        try (ServerSocket serverSocket = new ServerSocket(port)) {
            System.out.println("Chat Server đang lắng nghe trên cổng " + port);
            
            while (true) {
                new ClientHandler(serverSocket.accept()).start();
            }
        } catch (IOException e) {
            System.out.println("Lỗi server: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    private static class ClientHandler extends Thread {
        private Socket socket;
        private PrintWriter out;
        private BufferedReader in;
        private String name;
        
        public ClientHandler(Socket socket) {
            this.socket = socket;
        }
        
        @Override
        public void run() {
            try {
                in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
                out = new PrintWriter(socket.getOutputStream(), true);
                
                // Yêu cầu client nhập tên
                out.println("SUBMITNAME");
                name = in.readLine();
                
                System.out.println(name + " đã tham gia chat");
                broadcast(name + " đã tham gia chat");
                
                // Thêm writer của client vào danh sách
                clientWriters.add(out);
                
                String message;
                while ((message = in.readLine()) != null) {
                    // Không gửi tin nhắn trống
                    if (!message.isEmpty()) {
                        broadcast(name + ": " + message);
                    }
                }
            } catch (IOException e) {
                System.out.println("Lỗi xử lý client: " + e.getMessage());
            } finally {
                // Xóa client khỏi danh sách và đóng kết nối
                if (name != null) {
                    System.out.println(name + " đã rời chat");
                    broadcast(name + " đã rời chat");
                }
                
                if (out != null) {
                    clientWriters.remove(out);
                }
                
                try {
                    socket.close();
                } catch (IOException e) {
                    System.out.println("Lỗi đóng socket: " + e.getMessage());
                }
            }
        }
        
        // Phương thức gửi tin nhắn đến tất cả client
        private void broadcast(String message) {
            for (PrintWriter writer : clientWriters) {
                writer.println(message);
            }
        }
    }
}
```

### Chat Client

```java
import java.io.*;
import java.net.*;
import java.util.Scanner;

public class ChatClient {
    public static void main(String[] args) {
        String serverAddress = "localhost";
        int port = 8080;
        Scanner scanner = new Scanner(System.in);
        
        try {
            Socket socket = new Socket(serverAddress, port);
            System.out.println("Đã kết nối đến chat server");
            
            // Tạo thread để đọc tin nhắn từ server
            new Thread(new MessageReader(socket)).start();
            
            // Stream để gửi tin nhắn đến server
            PrintWriter out = new PrintWriter(socket.getOutputStream(), true);
            
            // Đọc input từ người dùng và gửi đến server
            String userInput;
            while (scanner.hasNextLine()) {
                userInput = scanner.nextLine();
                out.println(userInput);
            }
            
        } catch (IOException e) {
            System.out.println("Lỗi kết nối: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    // Thread đọc tin nhắn từ server
    private static class MessageReader implements Runnable {
        private Socket socket;
        private BufferedReader in;
        
        public MessageReader(Socket socket) {
            this.socket = socket;
            try {
                this.in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        
        @Override
        public void run() {
            String message;
            try {
                while ((message = in.readLine()) != null) {
                    // Xử lý yêu cầu đặt tên từ server
                    if (message.equals("SUBMITNAME")) {
                        Scanner scanner = new Scanner(System.in);
                        System.out.print("Nhập tên của bạn: ");
                        String name = scanner.nextLine();
                        
                        PrintWriter out = new PrintWriter(socket.getOutputStream(), true);
                        out.println(name);
                    } else {
                        System.out.println(message);
                    }
                }
            } catch (IOException e) {
                System.out.println("Mất kết nối đến server: " + e.getMessage());
            }
        }
    }
}
```

## Các vấn đề cần lưu ý khi lập trình Socket

### 1. Đóng tài nguyên

Luôn đóng tất cả các socket, input stream, output stream khi không sử dụng nữa để tránh rò rỉ tài nguyên. Sử dụng try-with-resources trong Java 7+ là cách tốt để tự động đóng tài nguyên.

### 2. Xử lý ngoại lệ

Socket programming liên quan đến mạng và có thể gặp nhiều vấn đề như mất kết nối, timeout... Luôn xử lý các ngoại lệ một cách cẩn thận.

### 3. Đồng bộ hóa

Khi làm việc với nhiều thread, cần đảm bảo đồng bộ hóa đúng cách khi truy cập các tài nguyên dùng chung.

### 4. Bảo mật

Với ứng dụng thực tế, nên sử dụng SSL/TLS để mã hóa dữ liệu truyền qua mạng. Java cung cấp `SSLSocket` và `SSLServerSocket` trong package `javax.net.ssl`.

## Kết luận

Socket Programming trong Java là một kỹ thuật mạnh mẽ để xây dựng các ứng dụng mạng. Với các lớp `Socket` và `ServerSocket`, Java cung cấp API đơn giản và hiệu quả để thực hiện giao tiếp client-server.

Trong bài viết này, chúng ta đã tìm hiểu:
- Cơ bản về Socket trong Java
- Xây dựng ứng dụng client-server đơn giản
- Xử lý nhiều kết nối cùng lúc với multithreading
- Ứng dụng thực tế với ví dụ chat server

Hy vọng bài viết này giúp bạn hiểu rõ hơn về Socket Programming trong Java và có thể áp dụng vào các dự án thực tế.

## Tài liệu tham khảo

1. Oracle Java Documentation - [Java Networking](https://docs.oracle.com/javase/tutorial/networking/index.html)
2. "Java Network Programming" - Elliotte Rusty Harold
3. "TCP/IP Sockets in Java: Practical Guide for Programmers" - Kenneth L. Calvert, Michael J. Donahoo
4. [Oracle: All About Sockets](https://docs.oracle.com/javase/tutorial/networking/sockets/index.html)





