+++
title = "Java Servlet Basics: Building Dynamic Web Applications"
date = "2025-09-22"
description = "Learn about Java Servlets, architecture, lifecycle, and how to build simple dynamic web applications with Java Servlets"
categories = ["Java"]
tags = ["Java", "Web", "Servlet"]
author = "Pham Minh Kha"
translationKey = "java-servlet"
+++

## What is Java Servlet?

Java Servlet is a technology that extends the capabilities of web servers to serve dynamic HTTP requests. Servlets are Java programs that run on web servers (such as Apache Tomcat, Jetty, WildFly), processing requests and creating responses to send back to clients.

Servlets act as an intermediary layer between browser requests and databases or applications on web servers. They play a crucial role in developing dynamic web applications.

### Advantages of Java Servlets

- **High Performance**: Servlets are loaded once and kept in memory, processing multiple requests simultaneously
- **Platform Independent**: Works on any web server that supports servlets
- **Powerful**: Leverages the full power of the Java language
- **Secure**: Inherits Java's security model
- **Extensible**: Easily extensible with many existing Java libraries

### Servlet Architecture

Servlets operate in a client-server architecture:

1. Client sends HTTP request to web server
2. Web server forwards request to Servlet Container
3. Servlet Container finds appropriate Servlet, creates ServletRequest and ServletResponse objects
4. Servlet processes request and writes result to response object
5. Servlet Container sends response back to client

## Servlet API and Servlet Container

Servlet API is a collection of classes and interfaces we use to create servlets. This API is defined in the `javax.servlet` and `javax.servlet.http` packages.

Servlet Container (also called Web Container) is a part of the web server that manages the servlet lifecycle, maps URLs to servlets, and ensures requests and responses are processed correctly.

Popular Servlet Containers:
- Apache Tomcat
- Jetty
- WildFly (JBoss)
- GlassFish
- WebLogic

## Setting Up Servlet Development Environment

#### Step 1: Install JDK

First, ensure JDK is installed on your computer. Download and install JDK from Oracle's website.

#### Step 2: Install Apache Tomcat

1. Download Apache Tomcat from the official website: https://tomcat.apache.org/
2. Extract to desired directory (e.g., `C:\apache-tomcat`)
3. Set `CATALINA_HOME` environment variable pointing to Tomcat directory

#### Step 3: Install IDE (Eclipse or IntelliJ IDEA)

Install Eclipse or IntelliJ IDEA and configure them to work with Tomcat.

#### Step 4: Create Web Project

In Eclipse:
1. File > New > Dynamic Web Project
2. Name the project and select Tomcat as target runtime
3. Complete wizard to create project

## Servlet Lifecycle

Servlet has three main lifecycle methods:

1. **init()**: Called once when servlet is initialized
2. **service()**: Called every time there's a request to the servlet
3. **destroy()**: Called when servlet is destroyed, usually when server shuts down

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
        // Called when servlet is initialized
        hitCount = 0;
        System.out.println("Servlet initialized");
    }
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        // Handle HTTP GET request
        hitCount++;
        
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        out.println("<html>");
        out.println("<head><title>Lifecycle Servlet</title></head>");
        out.println("<body>");
        out.println("<h1>Lifecycle Servlet</h1>");
        out.println("<p>Hit count: " + hitCount + "</p>");
        out.println("</body>");
        out.println("</html>");
    }
    
    @Override
    public void destroy() {
        // Called when servlet is destroyed
        System.out.println("Servlet destroyed. Total hits: " + hitCount);
    }
}
```

## Servlet HelloWorld

Let's create a simple servlet that displays "Hello World":

```java
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

// Use annotation to define URL pattern (Servlet 3.0+)
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
            out.println("<p>This is my first servlet.</p>");
            out.println("</body>");
            out.println("</html>");
        } finally {
            out.close();
        }
    }
}
```

## Configuring Servlet in web.xml

If not using annotations, we can configure servlets in `web.xml` file:

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

## Handling Request and Response

### HTTP Request

Servlet API provides `HttpServletRequest` to access information from the request:

```java
@WebServlet("/requestDemo")
public class RequestDemoServlet extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        // Get information from URL query string
        String name = request.getParameter("name");
        String age = request.getParameter("age");
        
        // Get request information
        String method = request.getMethod();
        String uri = request.getRequestURI();
        String protocol = request.getProtocol();
        String remoteAddr = request.getRemoteAddr();
        
        // Get header information
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

`HttpServletResponse` allows us to customize the response:

```java
@WebServlet("/responseDemo")
public class ResponseDemoServlet extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        // Set headers
        response.setContentType("text/html;charset=UTF-8");
        response.setHeader("Cache-Control", "no-cache");
        
        // Set cookie
        Cookie cookie = new Cookie("sessionId", "abc123");
        cookie.setMaxAge(3600);  // 1 hour
        response.addCookie(cookie);
        
        // Write response
        PrintWriter out = response.getWriter();
        out.println("<!DOCTYPE html>");
        out.println("<html>");
        out.println("<head><title>Response Demo</title></head>");
        out.println("<body>");
        out.println("<h1>HTTP Response Demo</h1>");
        out.println("<p>Cookie has been set!</p>");
        out.println("</body>");
        out.println("</html>");
    }
}
```

## Handling Forms in Servlets

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
            <label for="name">Full Name:</label>
            <input type="text" id="name" name="name" required>
        </div>
        <div>
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required>
        </div>
        <div>
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required>
        </div>
        <div>
            <label>Gender:</label>
            <input type="radio" id="male" name="gender" value="male">
            <label for="male">Male</label>
            <input type="radio" id="female" name="gender" value="female">
            <label for="female">Female</label>
        </div>
        <div>
            <label for="country">Country:</label>
            <select id="country" name="country">
                <option value="vietnam">Vietnam</option>
                <option value="usa">United States</option>
                <option value="japan">Japan</option>
                <option value="korea">Korea</option>
            </select>
        </div>
        <div>
            <label>Hobbies:</label>
            <input type="checkbox" id="reading" name="hobbies" value="reading">
            <label for="reading">Reading</label>
            <input type="checkbox" id="sports" name="hobbies" value="sports">
            <label for="sports">Sports</label>
            <input type="checkbox" id="music" name="hobbies" value="music">
            <label for="music">Music</label>
        </div>
        <div>
            <input type="submit" value="Register">
            <input type="reset" value="Reset">
        </div>
    </form>
</body>
</html>
```

### Servlet Processing Form

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
        
        // Get data from form
        String name = request.getParameter("name");
        String email = request.getParameter("email");
        String password = request.getParameter("password");
        String gender = request.getParameter("gender");
        String country = request.getParameter("country");
        String[] hobbies = request.getParameterValues("hobbies");
        
        // Set response
        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();
        
        out.println("<!DOCTYPE html>");
        out.println("<html>");
        out.println("<head>");
        out.println("<title>Registration Result</title>");
        out.println("</head>");
        out.println("<body>");
        out.println("<h1>Registration Successful!</h1>");
        out.println("<h2>Registration Information:</h2>");
        out.println("<p><strong>Full Name:</strong> " + name + "</p>");
        out.println("<p><strong>Email:</strong> " + email + "</p>");
        out.println("<p><strong>Gender:</strong> " + 
                   ("male".equals(gender) ? "Male" : "female".equals(gender) ? "Female" : "Not specified") + "</p>");
        out.println("<p><strong>Country:</strong> " + 
                   ("vietnam".equals(country) ? "Vietnam" : 
                    "usa".equals(country) ? "United States" : 
                    "japan".equals(country) ? "Japan" : 
                    "korea".equals(country) ? "Korea" : country) + "</p>");
        
        out.println("<p><strong>Hobbies:</strong> ");
        if (hobbies != null && hobbies.length > 0) {
            for (int i = 0; i < hobbies.length; i++) {
                String hobby = "reading".equals(hobbies[i]) ? "Reading" : 
                              "sports".equals(hobbies[i]) ? "Sports" : 
                              "music".equals(hobbies[i]) ? "Music" : hobbies[i];
                out.print(hobby);
                if (i < hobbies.length - 1) {
                    out.print(", ");
                }
            }
        } else {
            out.print("None");
        }
        out.println("</p>");
        
        out.println("</body>");
        out.println("</html>");
    }
}
```

## Session Tracking in Servlets

### 1. Using Cookies

```java
@WebServlet("/cookieDemo")
public class CookieDemoServlet extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        // Check if "username" cookie exists
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
            // Create new cookie
            String newUser = "user" + System.currentTimeMillis();
            Cookie cookie = new Cookie("username", newUser);
            cookie.setMaxAge(60 * 60 * 24 * 30); // 30 days
            response.addCookie(cookie);
            
            out.println("<h1>Welcome, " + newUser + "!</h1>");
            out.println("<p>This is your first visit. A cookie has been set.</p>");
        }
        
        out.println("</body>");
        out.println("</html>");
    }
}
```

### 2. Using HttpSession

```java
@WebServlet("/sessionDemo")
public class SessionDemoServlet extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        // Get or create session
        HttpSession session = request.getSession(true);
        
        // Get visit count from session
        Integer visitCount = (Integer) session.getAttribute("visitCount");
        if (visitCount == null) {
            visitCount = 1;
        } else {
            visitCount++;
        }
        
        // Update session
        session.setAttribute("visitCount", visitCount);
        
        // Display information
        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();
        
        out.println("<!DOCTYPE html>");
        out.println("<html>");
        out.println("<head><title>Session Demo</title></head>");
        out.println("<body>");
        out.println("<h1>Session Demo</h1>");
        
        out.println("<p>Session ID: " + session.getId() + "</p>");
        out.println("<p>Visit count: " + visitCount + "</p>");
        out.println("<p>Session created: " + new Date(session.getCreationTime()) + "</p>");
        out.println("<p>Last accessed: " + 
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
        
        // Create URL with session information
        String encodedURL = response.encodeURL("urlRewritingDemo?username=" + username + "&count=1");
        
        out.println("<p><a href='" + encodedURL + "'>Click to continue</a></p>");
        
        out.println("</body>");
        out.println("</html>");
    }
}
```

## Redirect and Forward in Servlets

### Redirect

```java
@WebServlet("/redirectDemo")
public class RedirectDemoServlet extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        // Redirect to another URL
        response.sendRedirect("https://example.com/newPage");
        
        // Or redirect to another servlet
        // response.sendRedirect("anotherServlet");
    }
}
```

### Forward

```java
@WebServlet("/forwardDemo")
public class ForwardDemoServlet extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        // Set attribute for request
        request.setAttribute("message", "Hello from ForwardDemo!");
        
        // Forward to another servlet or JSP
        RequestDispatcher dispatcher = request.getRequestDispatcher("/targetServlet");
        dispatcher.forward(request, response);
    }
}

@WebServlet("/targetServlet")
public class TargetServlet extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        // Get attribute from request
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

## Filters in Servlets

Filters are components that allow processing requests before reaching servlets and responses after leaving servlets.

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
        // Initialize filter
    }
    
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) 
            throws IOException, ServletException {
        
        // Process before request reaches servlet
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        String uri = httpRequest.getRequestURI();
        
        System.out.println("Request received at " + new Date() + " for URI: " + uri);
        
        // Allow request to proceed
        chain.doFilter(request, response);
        
        // Process after response from servlet
        System.out.println("Response sent at " + new Date() + " for URI: " + uri);
    }
    
    @Override
    public void destroy() {
        // Destroy filter
    }
}
```

## Real-World Example: Login System

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
        out.println("<h1>Login</h1>");
        
        // Display error message if any
        String error = request.getParameter("error");
        if ("1".equals(error)) {
            out.println("<p class='message'>Invalid username or password!</p>");
        }
        
        out.println("<form action='login' method='post'>");
        out.println("<div class='form-group'>");
        out.println("<label for='username'>Username:</label>");
        out.println("<input type='text' id='username' name='username' required>");
        out.println("</div>");
        out.println("<div class='form-group'>");
        out.println("<label for='password'>Password:</label>");
        out.println("<input type='password' id='password' name='password' required>");
        out.println("</div>");
        out.println("<input type='submit' class='btn' value='Login'>");
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
        
        // Check login credentials (in practice should check with database)
        if ("admin".equals(username) && "password123".equals(password)) {
            // Create session for user
            HttpSession session = request.getSession();
            session.setAttribute("username", username);
            session.setAttribute("isLoggedIn", true);
            
            // Redirect to dashboard page
            response.sendRedirect("dashboard");
        } else {
            // Redirect back to login page with error message
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
        
        // URLs that don't require authentication
        boolean isPublicResource = requestURI.endsWith("login") || 
                                  requestURI.endsWith(".css") || 
                                  requestURI.endsWith(".js") || 
                                  requestURI.endsWith(".png") || 
                                  requestURI.endsWith(".jpg");
        
        boolean isLoggedIn = session != null && session.getAttribute("isLoggedIn") != null;
        
        if (isPublicResource || isLoggedIn) {
            // Allow access
            chain.doFilter(request, response);
        } else {
            // Redirect to login page
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
        out.println("Hello, " + username + " | <a href='logout' class='logout-btn'>Logout</a>");
        out.println("</header>");
        out.println("<div class='container'>");
        out.println("<h1>Dashboard</h1>");
        out.println("<p>Welcome to the admin system!</p>");
        out.println("<p>This is a protected page only shown to logged-in users.</p>");
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
            session.invalidate(); // Destroy session
        }
        
        response.sendRedirect("login");
    }
}
```

## Conclusion

Java Servlet is a powerful technology that enables development of dynamic web applications on the Java platform. In this article, we learned about:

- Servlet architecture and lifecycle
- Handling requests and responses
- Form processing
- Session tracking with Cookies and HttpSession
- Redirect and Forward
- Filters in Servlets
- Real-world application with login system

Although there are many more modern frameworks today like Spring MVC and Spring Boot, understanding servlets remains foundational knowledge as these frameworks are all built on top of the Servlet API.

## References

1. Oracle Java Documentation - [Java Servlet Technology](https://docs.oracle.com/javaee/7/tutorial/servlets.htm)
2. "Head First Servlets & JSP" - Kathy Sierra, Bert Bates
3. Apache Tomcat Documentation - [https://tomcat.apache.org/](https://tomcat.apache.org/)
4. "Professional Java for Web Applications" - Nicholas S. Williams
5. [Java Servlet Specification](https://jcp.org/en/jsr/detail?id=369)













