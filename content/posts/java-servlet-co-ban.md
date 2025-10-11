+++
title = "Java Servlet cơ bản: Xây dựng ứng dụng web động"
date = "2025-09-22"
description = "Tìm hiểu về Java Servlet, kiến trúc, vòng đời và cách xây dựng ứng dụng web động đơn giản với Java Servlet"
categories = ["Java"]
tags = ["Java", "Web", "Servlet"]
author = "Phạm Minh Kha"
+++

## Java Servlet là gì?

Java Servlet là một công nghệ cho phép mở rộng khả năng của máy chủ web để phục vụ các yêu cầu HTTP động. Servlet là các chương trình Java chạy trên máy chủ web (như Apache Tomcat, Jetty, WildFly), xử lý các request và tạo ra response gửi về cho client.

Servlet hoạt động như một lớp trung gian giữa yêu cầu từ browser và cơ sở dữ liệu hoặc ứng dụng trên máy chủ web. Chúng đóng vai trò quan trọng trong việc phát triển các ứng dụng web động.

### Ưu điểm của Java Servlet

- **Hiệu suất cao**: Servlet được load một lần và duy trì trong bộ nhớ, xử lý nhiều request đồng thời
- **Nền tảng độc lập**: Hoạt động trên bất kỳ máy chủ web nào hỗ trợ servlet
- **Mạnh mẽ**: Tận dụng toàn bộ sức mạnh của ngôn ngữ Java
- **Bảo mật**: Thừa hưởng mô hình bảo mật của Java
- **Mở rộng**: Dễ dàng mở rộng với nhiều thư viện Java hiện có

### Kiến trúc của Servlet

Servlet hoạt động trong kiến trúc client-server:

1. Client gửi HTTP request đến máy chủ web
2. Máy chủ web chuyển request đến Servlet Container
3. Servlet Container tìm Servlet phù hợp, tạo đối tượng ServletRequest và ServletResponse
4. Servlet xử lý request và ghi kết quả vào đối tượng response
5. Servlet Container gửi response trở lại client

## Servlet API và Servlet Container

Servlet API là một tập hợp các lớp và giao diện mà chúng ta sử dụng để tạo servlet. API này được định nghĩa trong package `javax.servlet` và `javax.servlet.http`.

Servlet Container (còn gọi là Web Container) là một phần của máy chủ web quản lý vòng đời của servlet, ánh xạ URL đến servlet và đảm bảo rằng yêu cầu và phản hồi được xử lý đúng cách.

Các Servlet Container phổ biến:
- Apache Tomcat
- Jetty
- WildFly (JBoss)
- GlassFish
- WebLogic

## Cài đặt môi trường phát triển Servlet

#### Bước 1: Cài đặt JDK

Trước tiên, cần đảm bảo JDK đã được cài đặt trên máy tính. Tải và cài đặt JDK từ trang chủ Oracle.

#### Bước 2: Cài đặt Apache Tomcat

1. Tải Apache Tomcat từ trang chủ: https://tomcat.apache.org/
2. Giải nén vào thư mục mong muốn (ví dụ: `C:\apache-tomcat`)
3. Thiết lập biến môi trường `CATALINA_HOME` trỏ đến thư mục Tomcat

#### Bước 3: Cài đặt IDE (Eclipse hoặc IntelliJ IDEA)

Cài đặt Eclipse hoặc IntelliJ IDEA và cấu hình để làm việc với Tomcat.

#### Bước 4: Tạo dự án Web

Trong Eclipse:
1. File > New > Dynamic Web Project
2. Đặt tên dự án và chọn Tomcat làm target runtime
3. Kết thúc wizard để tạo dự án

## Vòng đời của Servlet

Servlet có ba phương thức vòng đời chính:

1. **init()**: Được gọi một lần khi servlet được khởi tạo
2. **service()**: Được gọi mỗi khi có request đến servlet
3. **destroy()**: Được gọi khi servlet bị hủy, thường là khi server shutdown

```java
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

public class LifecycleServlet extends HttpServlet {
    private int hitCount;
    
    @Override
    public void init() throws ServletException {
        // Được gọi khi servlet được khởi tạo
        hitCount = 0;
        System.out.println("Servlet đã được khởi tạo");
    }
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        // Xử lý HTTP GET request
        hitCount++;
        
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        out.println("<html>");
        out.println("<head><title>Lifecycle Servlet</title></head>");
        out.println("<body>");
        out.println("<h1>Lifecycle Servlet</h1>");
        out.println("<p>Số lần truy cập: " + hitCount + "</p>");
        out.println("</body>");
        out.println("</html>");
    }
    
    @Override
    public void destroy() {
        // Được gọi khi servlet bị hủy
        System.out.println("Servlet đã bị hủy. Tổng số lần truy cập: " + hitCount);
    }
}
```

## Servlet HelloWorld

Hãy tạo một servlet đơn giản hiển thị "Hello World":

```java
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

// Sử dụng annotation để định nghĩa URL pattern (Servlet 3.0+)
@WebServlet("/hello")
public class HelloServlet extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();
        
        try {
            out.println("<!DOCTYPE html>");
            out.println("<html>");
            out.println("<head>");
            out.println("<title>Hello World Servlet</title>");
            out.println("</head>");
            out.println("<body>");
            out.println("<h1>Hello World!</h1>");
            out.println("<p>Đây là servlet đầu tiên của tôi.</p>");
            out.println("</body>");
            out.println("</html>");
        } finally {
            out.close();
        }
    }
}
```

## Cấu hình Servlet trong web.xml

Nếu không sử dụng annotation, chúng ta có thể cấu hình servlet trong file `web.xml`:

```xml
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee 
                             http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0">
    
    <servlet>
        <servlet-name>HelloServlet</servlet-name>
        <servlet-class>com.example.HelloServlet</servlet-class>
    </servlet>
    
    <servlet-mapping>
        <servlet-name>HelloServlet</servlet-name>
        <url-pattern>/hello</url-pattern>
    </servlet-mapping>
    
</web-app>
```

## Xử lý Request và Response

### HTTP Request

Servlet API cung cấp `HttpServletRequest` để truy cập thông tin từ request:

```java
@WebServlet("/requestDemo")
public class RequestDemoServlet extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        // Lấy thông tin từ URL query string
        String name = request.getParameter("name");
        String age = request.getParameter("age");
        
        // Lấy thông tin về request
        String method = request.getMethod();
        String uri = request.getRequestURI();
        String protocol = request.getProtocol();
        String remoteAddr = request.getRemoteAddr();
        
        // Lấy thông tin header
        String userAgent = request.getHeader("User-Agent");
        
        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();
        
        out.println("<!DOCTYPE html>");
        out.println("<html>");
        out.println("<head><title>Request Demo</title></head>");
        out.println("<body>");
        out.println("<h1>Request Information</h1>");
        out.println("<p>Name: " + (name != null ? name : "Not provided") + "</p>");
        out.println("<p>Age: " + (age != null ? age : "Not provided") + "</p>");
        out.println("<p>Method: " + method + "</p>");
        out.println("<p>URI: " + uri + "</p>");
        out.println("<p>Protocol: " + protocol + "</p>");
        out.println("<p>Remote Address: " + remoteAddr + "</p>");
        out.println("<p>User-Agent: " + userAgent + "</p>");
        out.println("</body>");
        out.println("</html>");
    }
}
```

### HTTP Response

`HttpServletResponse` cho phép chúng ta tùy chỉnh phản hồi:

```java
@WebServlet("/responseDemo")
public class ResponseDemoServlet extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        // Thiết lập các header
        response.setContentType("text/html;charset=UTF-8");
        response.setHeader("Cache-Control", "no-cache");
        
        // Thiết lập cookie
        Cookie cookie = new Cookie("sessionId", "abc123");
        cookie.setMaxAge(3600);  // 1 giờ
        response.addCookie(cookie);
        
        // Ghi response
        PrintWriter out = response.getWriter();
        out.println("<!DOCTYPE html>");
        out.println("<html>");
        out.println("<head><title>Response Demo</title></head>");
        out.println("<body>");
        out.println("<h1>HTTP Response Demo</h1>");
        out.println("<p>Cookie đã được thiết lập!</p>");
        out.println("</body>");
        out.println("</html>");
    }
}
```

## Xử lý Form trong Servlet

### HTML Form

```html
<!DOCTYPE html>
<html>
<head>
    <title>User Registration</title>
    <meta charset="UTF-8">
</head>
<body>
    <h1>User Registration</h1>
    <form action="register" method="post">
        <div>
            <label for="name">Họ tên:</label>
            <input type="text" id="name" name="name" required>
        </div>
        <div>
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required>
        </div>
        <div>
            <label for="password">Mật khẩu:</label>
            <input type="password" id="password" name="password" required>
        </div>
        <div>
            <label>Giới tính:</label>
            <input type="radio" id="male" name="gender" value="male">
            <label for="male">Nam</label>
            <input type="radio" id="female" name="gender" value="female">
            <label for="female">Nữ</label>
        </div>
        <div>
            <label for="country">Quốc gia:</label>
            <select id="country" name="country">
                <option value="vietnam">Việt Nam</option>
                <option value="usa">Hoa Kỳ</option>
                <option value="japan">Nhật Bản</option>
                <option value="korea">Hàn Quốc</option>
            </select>
        </div>
        <div>
            <label>Sở thích:</label>
            <input type="checkbox" id="reading" name="hobbies" value="reading">
            <label for="reading">Đọc sách</label>
            <input type="checkbox" id="sports" name="hobbies" value="sports">
            <label for="sports">Thể thao</label>
            <input type="checkbox" id="music" name="hobbies" value="music">
            <label for="music">Âm nhạc</label>
        </div>
        <div>
            <input type="submit" value="Đăng ký">
            <input type="reset" value="Làm lại">
        </div>
    </form>
</body>
</html>
```

### Servlet xử lý Form

```java
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet("/register")
public class RegistrationServlet extends HttpServlet {
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        // Lấy dữ liệu từ form
        String name = request.getParameter("name");
        String email = request.getParameter("email");
        String password = request.getParameter("password");
        String gender = request.getParameter("gender");
        String country = request.getParameter("country");
        String[] hobbies = request.getParameterValues("hobbies");
        
        // Thiết lập response
        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();
        
        out.println("<!DOCTYPE html>");
        out.println("<html>");
        out.println("<head>");
        out.println("<title>Registration Result</title>");
        out.println("</head>");
        out.println("<body>");
        out.println("<h1>Đăng ký thành công!</h1>");
        out.println("<h2>Thông tin đăng ký:</h2>");
        out.println("<p><strong>Họ tên:</strong> " + name + "</p>");
        out.println("<p><strong>Email:</strong> " + email + "</p>");
        out.println("<p><strong>Giới tính:</strong> " + 
                   ("male".equals(gender) ? "Nam" : "female".equals(gender) ? "Nữ" : "Không xác định") + "</p>");
        out.println("<p><strong>Quốc gia:</strong> " + 
                   ("vietnam".equals(country) ? "Việt Nam" : 
                    "usa".equals(country) ? "Hoa Kỳ" : 
                    "japan".equals(country) ? "Nhật Bản" : 
                    "korea".equals(country) ? "Hàn Quốc" : country) + "</p>");
        
        out.println("<p><strong>Sở thích:</strong> ");
        if (hobbies != null && hobbies.length > 0) {
            for (int i = 0; i < hobbies.length; i++) {
                String hobby = "reading".equals(hobbies[i]) ? "Đọc sách" : 
                              "sports".equals(hobbies[i]) ? "Thể thao" : 
                              "music".equals(hobbies[i]) ? "Âm nhạc" : hobbies[i];
                out.print(hobby);
                if (i < hobbies.length - 1) {
                    out.print(", ");
                }
            }
        } else {
            out.print("Không có");
        }
        out.println("</p>");
        
        out.println("</body>");
        out.println("</html>");
    }
}
```

## Session Tracking trong Servlet

### 1. Sử dụng Cookie

```java
@WebServlet("/cookieDemo")
public class CookieDemoServlet extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        // Kiểm tra xem đã có cookie "username" chưa
        Cookie[] cookies = request.getCookies();
        String username = null;
        
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("username".equals(cookie.getName())) {
                    username = cookie.getValue();
                    break;
                }
            }
        }
        
        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();
        
        out.println("<!DOCTYPE html>");
        out.println("<html>");
        out.println("<head><title>Cookie Demo</title></head>");
        out.println("<body>");
        
        if (username != null) {
            out.println("<h1>Welcome back, " + username + "!</h1>");
            out.println("<p>Your cookie was set during a previous visit.</p>");
        } else {
            // Tạo cookie mới
            String newUser = "user" + System.currentTimeMillis();
            Cookie cookie = new Cookie("username", newUser);
            cookie.setMaxAge(60 * 60 * 24 * 30); // 30 ngày
            response.addCookie(cookie);
            
            out.println("<h1>Welcome, " + newUser + "!</h1>");
            out.println("<p>This is your first visit. A cookie has been set.</p>");
        }
        
        out.println("</body>");
        out.println("</html>");
    }
}
```

### 2. Sử dụng HttpSession

```java
@WebServlet("/sessionDemo")
public class SessionDemoServlet extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        // Lấy hoặc tạo session
        HttpSession session = request.getSession(true);
        
        // Lấy biến đếm từ session
        Integer visitCount = (Integer) session.getAttribute("visitCount");
        if (visitCount == null) {
            visitCount = 1;
        } else {
            visitCount++;
        }
        
        // Cập nhật session
        session.setAttribute("visitCount", visitCount);
        
        // Hiển thị thông tin
        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();
        
        out.println("<!DOCTYPE html>");
        out.println("<html>");
        out.println("<head><title>Session Demo</title></head>");
        out.println("<body>");
        out.println("<h1>Session Demo</h1>");
        
        out.println("<p>ID Phiên: " + session.getId() + "</p>");
        out.println("<p>Số lần truy cập: " + visitCount + "</p>");
        out.println("<p>Thời điểm tạo phiên: " + new Date(session.getCreationTime()) + "</p>");
        out.println("<p>Thời điểm truy cập cuối: " + 
                   new Date(session.getLastAccessedTime()) + "</p>");
        
        out.println("</body>");
        out.println("</html>");
    }
}
```

### 3. URL Rewriting

```java
@WebServlet("/urlRewritingDemo")
public class URLRewritingDemoServlet extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        String username = request.getParameter("username");
        
        if (username == null) {
            username = "guest";
        }
        
        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();
        
        out.println("<!DOCTYPE html>");
        out.println("<html>");
        out.println("<head><title>URL Rewriting Demo</title></head>");
        out.println("<body>");
        out.println("<h1>URL Rewriting Demo</h1>");
        out.println("<p>Welcome, " + username + "!</p>");
        
        // Tạo URL với thông tin session
        String encodedURL = response.encodeURL("urlRewritingDemo?username=" + username + "&count=1");
        
        out.println("<p><a href='" + encodedURL + "'>Click để tiếp tục</a></p>");
        
        out.println("</body>");
        out.println("</html>");
    }
}
```

## Redirect và Forward trong Servlet

### Redirect - Chuyển hướng

```java
@WebServlet("/redirectDemo")
public class RedirectDemoServlet extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        // Chuyển hướng đến URL khác
        response.sendRedirect("https://example.com/newPage");
        
        // Hoặc chuyển hướng đến servlet khác
        // response.sendRedirect("anotherServlet");
    }
}
```

### Forward - Chuyển tiếp

```java
@WebServlet("/forwardDemo")
public class ForwardDemoServlet extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        // Thiết lập thuộc tính cho request
        request.setAttribute("message", "Hello from ForwardDemo!");
        
        // Chuyển tiếp đến servlet khác hoặc JSP
        RequestDispatcher dispatcher = request.getRequestDispatcher("/targetServlet");
        dispatcher.forward(request, response);
    }
}

@WebServlet("/targetServlet")
public class TargetServlet extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        // Lấy thuộc tính từ request
        String message = (String) request.getAttribute("message");
        
        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();
        
        out.println("<!DOCTYPE html>");
        out.println("<html>");
        out.println("<head><title>Target Servlet</title></head>");
        out.println("<body>");
        out.println("<h1>Target Servlet</h1>");
        out.println("<p>Message: " + message + "</p>");
        out.println("</body>");
        out.println("</html>");
    }
}
```

## Filter trong Servlet

Filter là các thành phần cho phép xử lý request trước khi đến servlet và response sau khi rời servlet.

```java
import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.Date;

@WebFilter("/*")
public class LoggingFilter implements Filter {
    
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // Khởi tạo filter
    }
    
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) 
            throws IOException, ServletException {
        
        // Xử lý trước khi request đến servlet
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        String uri = httpRequest.getRequestURI();
        
        System.out.println("Request received at " + new Date() + " for URI: " + uri);
        
        // Cho phép request đi tiếp
        chain.doFilter(request, response);
        
        // Xử lý sau khi response từ servlet
        System.out.println("Response sent at " + new Date() + " for URI: " + uri);
    }
    
    @Override
    public void destroy() {
        // Hủy filter
    }
}
```

## Ví dụ ứng dụng thực tế: Hệ thống đăng nhập

#### 1. LoginServlet

```java
@WebServlet("/login")
public class LoginServlet extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();
        
        out.println("<!DOCTYPE html>");
        out.println("<html>");
        out.println("<head>");
        out.println("<title>Login Page</title>");
        out.println("<style>");
        out.println("body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }");
        out.println(".login-container { width: 300px; margin: 100px auto; background-color: white; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }");
        out.println("h1 { text-align: center; color: #333; }");
        out.println(".form-group { margin-bottom: 15px; }");
        out.println("label { display: block; margin-bottom: 5px; }");
        out.println("input[type=text], input[type=password] { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 3px; }");
        out.println(".btn { background-color: #4CAF50; color: white; padding: 10px 15px; border: none; border-radius: 3px; cursor: pointer; width: 100%; }");
        out.println(".btn:hover { background-color: #45a049; }");
        out.println(".message { color: red; margin-bottom: 15px; }");
        out.println("</style>");
        out.println("</head>");
        out.println("<body>");
        out.println("<div class='login-container'>");
        out.println("<h1>Đăng nhập</h1>");
        
        // Hiển thị thông báo lỗi nếu có
        String error = request.getParameter("error");
        if ("1".equals(error)) {
            out.println("<p class='message'>Tên đăng nhập hoặc mật khẩu không đúng!</p>");
        }
        
        out.println("<form action='login' method='post'>");
        out.println("<div class='form-group'>");
        out.println("<label for='username'>Tên đăng nhập:</label>");
        out.println("<input type='text' id='username' name='username' required>");
        out.println("</div>");
        out.println("<div class='form-group'>");
        out.println("<label for='password'>Mật khẩu:</label>");
        out.println("<input type='password' id='password' name='password' required>");
        out.println("</div>");
        out.println("<input type='submit' class='btn' value='Đăng nhập'>");
        out.println("</form>");
        out.println("</div>");
        out.println("</body>");
        out.println("</html>");
    }
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        
        // Kiểm tra thông tin đăng nhập (trong thực tế nên kiểm tra với cơ sở dữ liệu)
        if ("admin".equals(username) && "password123".equals(password)) {
            // Tạo session cho người dùng
            HttpSession session = request.getSession();
            session.setAttribute("username", username);
            session.setAttribute("isLoggedIn", true);
            
            // Chuyển hướng đến trang dashboard
            response.sendRedirect("dashboard");
        } else {
            // Chuyển hướng về trang đăng nhập với thông báo lỗi
            response.sendRedirect("login?error=1");
        }
    }
}
```

#### 2. AuthenticationFilter

```java
@WebFilter("/*")
public class AuthenticationFilter implements Filter {
    
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
    }
    
    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) 
            throws IOException, ServletException {
        
        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;
        
        HttpSession session = request.getSession(false);
        String requestURI = request.getRequestURI();
        
        // Những URL không cần xác thực
        boolean isPublicResource = requestURI.endsWith("login") || 
                                  requestURI.endsWith(".css") || 
                                  requestURI.endsWith(".js") || 
                                  requestURI.endsWith(".png") || 
                                  requestURI.endsWith(".jpg");
        
        boolean isLoggedIn = session != null && session.getAttribute("isLoggedIn") != null;
        
        if (isPublicResource || isLoggedIn) {
            // Cho phép truy cập
            chain.doFilter(request, response);
        } else {
            // Chuyển hướng đến trang đăng nhập
            response.sendRedirect("login");
        }
    }
    
    @Override
    public void destroy() {
    }
}
```

#### 3. DashboardServlet

```java
@WebServlet("/dashboard")
public class DashboardServlet extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        HttpSession session = request.getSession(false);
        String username = (String) session.getAttribute("username");
        
        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();
        
        out.println("<!DOCTYPE html>");
        out.println("<html>");
        out.println("<head>");
        out.println("<title>Dashboard</title>");
        out.println("<style>");
        out.println("body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }");
        out.println("header { background-color: #333; color: white; padding: 15px; text-align: right; }");
        out.println(".container { width: 80%; margin: 20px auto; background-color: white; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }");
        out.println("h1 { color: #333; }");
        out.println(".logout-btn { background-color: #f44336; color: white; padding: 8px 12px; text-decoration: none; border-radius: 3px; }");
        out.println(".logout-btn:hover { background-color: #d32f2f; }");
        out.println("</style>");
        out.println("</head>");
        out.println("<body>");
        out.println("<header>");
        out.println("Xin chào, " + username + " | <a href='logout' class='logout-btn'>Đăng xuất</a>");
        out.println("</header>");
        out.println("<div class='container'>");
        out.println("<h1>Dashboard</h1>");
        out.println("<p>Chào mừng đến với hệ thống quản trị!</p>");
        out.println("<p>Đây là trang được bảo vệ và chỉ hiển thị cho người dùng đã đăng nhập.</p>");
        out.println("</div>");
        out.println("</body>");
        out.println("</html>");
    }
}
```

#### 4. LogoutServlet

```java
@WebServlet("/logout")
public class LogoutServlet extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        HttpSession session = request.getSession(false);
        
        if (session != null) {
            session.invalidate(); // Hủy session
        }
        
        response.sendRedirect("login");
    }
}
```

## Kết luận

Java Servlet là một công nghệ mạnh mẽ cho phép phát triển các ứng dụng web động trên nền tảng Java. Trong bài viết này, chúng ta đã tìm hiểu:

- Kiến trúc và vòng đời của Servlet
- Xử lý request và response
- Xử lý form
- Session tracking với Cookie và HttpSession
- Redirect và Forward
- Filter trong Servlet
- Ứng dụng thực tế với hệ thống đăng nhập

Mặc dù ngày nay có nhiều framework hiện đại hơn như Spring MVC, Spring Boot, nhưng hiểu về servlet vẫn là kiến thức nền tảng quan trọng vì các framework này đều được xây dựng dựa trên Servlet API.

## Tài liệu tham khảo

1. Oracle Java Documentation - [Java Servlet Technology](https://docs.oracle.com/javaee/7/tutorial/servlets.htm)
2. "Head First Servlets & JSP" - Kathy Sierra, Bert Bates
3. Apache Tomcat Documentation - [https://tomcat.apache.org/](https://tomcat.apache.org/)
4. "Professional Java for Web Applications" - Nicholas S. Williams
5. [Java Servlet Specification](https://jcp.org/en/jsr/detail?id=369)





