+++
title = "REST API với Spring Boot: Xây dựng backend hiện đại"
date = "2025-09-21"
description = "Hướng dẫn chi tiết về cách xây dựng RESTful API với Spring Boot, thiết kế endpoint, xử lý request/response và áp dụng các best practices"
categories = ["Java"]
tags = ["Java", "API", "Web"]
author = "Phạm Minh Kha"
+++

## REST API là gì?

REST (Representational State Transfer) là một kiểu kiến trúc phần mềm cho các ứng dụng phân tán, được đề xuất bởi Roy Fielding năm 2000. REST không phụ thuộc vào bất kỳ giao thức cụ thể nào, nhưng hầu hết các triển khai REST đều sử dụng HTTP.

RESTful API là API tuân theo các nguyên tắc của REST:
- **Client-Server**: Tách biệt giao diện người dùng và lưu trữ dữ liệu
- **Stateless**: Mỗi request từ client phải chứa tất cả thông tin cần thiết
- **Cacheable**: Các response có thể được lưu trữ trong cache
- **Uniform Interface**: Giao diện thống nhất giữa các thành phần
- **Layered System**: Kiến trúc phân lớp
- **Code on Demand** (tùy chọn): Server có thể gửi code cho client thực thi

## Spring Boot: Nền tảng phát triển REST API hiệu quả

Spring Boot là một framework mạnh mẽ cho phép phát triển các ứng dụng Java nhanh chóng và dễ dàng. Spring Boot cung cấp nhiều tính năng để xây dựng REST API:

- Auto-configuration: Tự động cấu hình dựa trên các dependency
- Standalone: Không cần server bên ngoài
- Opinionated: Cung cấp các cấu hình mặc định hợp lý
- Production-ready: Sẵn sàng cho môi trường sản xuất

## Thiết lập dự án Spring Boot

### Bước 1: Tạo dự án Spring Boot

Sử dụng [Spring Initializr](https://start.spring.io/) để tạo dự án với các dependency:
- Spring Web
- Spring Data JPA
- H2 Database (hoặc MySQL, PostgreSQL)
- Spring Boot DevTools
- Lombok (tùy chọn)

Hoặc, sử dụng Maven:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.7.0</version>
        <relativePath/>
    </parent>
    <groupId>com.example</groupId>
    <artifactId>rest-api-demo</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>rest-api-demo</name>
    <description>Demo project for Spring Boot REST API</description>
    
    <properties>
        <java.version>11</java.version>
    </properties>
    
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

### Bước 2: Cấu hình cơ sở dữ liệu

Tạo file `application.properties`:

```properties
# Cấu hình H2 Database
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console

spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# JPA/Hibernate
spring.jpa.show-sql=true
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.H2Dialect

# Server port
server.port=8080

# Logging
logging.level.org.springframework=INFO
logging.level.com.example=DEBUG
```

## Xây dựng REST API với Spring Boot

### Tạo Entity

```java
package com.example.restapidemo.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Tên không được để trống")
    @Size(min = 2, max = 100, message = "Tên phải có độ dài từ 2-100 ký tự")
    private String name;
    
    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    @Column(unique = true)
    private String email;
    
    @NotBlank(message = "Địa chỉ không được để trống")
    private String address;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Được gọi trước khi entity được lưu
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    // Được gọi trước khi entity được cập nhật
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
```

### Tạo Repository

```java
package com.example.restapidemo.repository;

import com.example.restapidemo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByNameContaining(String name);
    boolean existsByEmail(String email);
}
```

### Tạo Service

```java
package com.example.restapidemo.service;

import com.example.restapidemo.model.User;
import com.example.restapidemo.repository.UserRepository;
import com.example.restapidemo.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional(readOnly = true)
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + id));
    }

    @Transactional(readOnly = true)
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email " + email));
    }

    @Transactional
    public User createUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Email already in use: " + user.getEmail());
        }
        return userRepository.save(user);
    }

    @Transactional
    public User updateUser(Long id, User userDetails) {
        User user = getUserById(id);
        
        // Kiểm tra nếu email mới đã được sử dụng bởi người dùng khác
        if (!user.getEmail().equals(userDetails.getEmail()) && 
            userRepository.existsByEmail(userDetails.getEmail())) {
            throw new IllegalArgumentException("Email already in use: " + userDetails.getEmail());
        }
        
        user.setName(userDetails.getName());
        user.setEmail(userDetails.getEmail());
        user.setAddress(userDetails.getAddress());
        
        return userRepository.save(user);
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = getUserById(id);
        userRepository.delete(user);
    }
    
    @Transactional(readOnly = true)
    public List<User> searchUsersByName(String name) {
        return userRepository.findByNameContaining(name);
    }
}
```

### Tạo Exception Handler

```java
package com.example.restapidemo.exception;

public class ResourceNotFoundException extends RuntimeException {
    
    private static final long serialVersionUID = 1L;
    
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
```

```java
package com.example.restapidemo.exception;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorDetails> handleResourceNotFoundException(
            ResourceNotFoundException ex, WebRequest request) {
        
        ErrorDetails errorDetails = new ErrorDetails(
                LocalDateTime.now(),
                ex.getMessage(),
                request.getDescription(false),
                "NOT_FOUND");
        
        return new ResponseEntity<>(errorDetails, HttpStatus.NOT_FOUND);
    }
    
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorDetails> handleIllegalArgumentException(
            IllegalArgumentException ex, WebRequest request) {
        
        ErrorDetails errorDetails = new ErrorDetails(
                LocalDateTime.now(),
                ex.getMessage(),
                request.getDescription(false),
                "BAD_REQUEST");
        
        return new ResponseEntity<>(errorDetails, HttpStatus.BAD_REQUEST);
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex,
            HttpHeaders headers, HttpStatus status, WebRequest request) {
        
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        ValidationErrorDetails errorDetails = new ValidationErrorDetails(
                LocalDateTime.now(),
                "Validation failed",
                request.getDescription(false),
                "VALIDATION_FAILED",
                errors);
        
        return new ResponseEntity<>(errorDetails, HttpStatus.BAD_REQUEST);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorDetails> handleGlobalException(Exception ex, WebRequest request) {
        ErrorDetails errorDetails = new ErrorDetails(
                LocalDateTime.now(),
                ex.getMessage(),
                request.getDescription(false),
                "INTERNAL_SERVER_ERROR");
        
        return new ResponseEntity<>(errorDetails, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
```

```java
package com.example.restapidemo.exception;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ErrorDetails {
    private LocalDateTime timestamp;
    private String message;
    private String details;
    private String errorCode;
}
```

```java
package com.example.restapidemo.exception;

import lombok.Getter;

import java.time.LocalDateTime;
import java.util.Map;

@Getter
public class ValidationErrorDetails extends ErrorDetails {
    private final Map<String, String> errors;
    
    public ValidationErrorDetails(LocalDateTime timestamp, String message, String details,
                                  String errorCode, Map<String, String> errors) {
        super(timestamp, message, details, errorCode);
        this.errors = errors;
    }
}
```

### Tạo Controller

```java
package com.example.restapidemo.controller;

import com.example.restapidemo.model.User;
import com.example.restapidemo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        User user = userService.getUserByEmail(email);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<User>> searchUsers(@RequestParam String name) {
        List<User> users = userService.searchUsersByName(name);
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<User> createUser(@Valid @RequestBody User user) {
        User savedUser = userService.createUser(user);
        return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @Valid @RequestBody User userDetails) {
        User updatedUser = userService.updateUser(id, userDetails);
        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Boolean>> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
```

## Tính năng nâng cao trong REST API

#### 1. Phân trang và Sắp xếp

```java
// Trong Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Page<User> findByNameContaining(String name, Pageable pageable);
}

// Trong Service
public Page<User> getAllUsers(int page, int size, String sortBy, String sortDir) {
    Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name())
            ? Sort.by(sortBy).ascending()
            : Sort.by(sortBy).descending();
    
    Pageable pageable = PageRequest.of(page, size, sort);
    return userRepository.findAll(pageable);
}

// Trong Controller
@GetMapping
public ResponseEntity<Map<String, Object>> getAllUsers(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "id") String sortBy,
        @RequestParam(defaultValue = "asc") String sortDir) {
    
    Page<User> userPage = userService.getAllUsers(page, size, sortBy, sortDir);
    
    Map<String, Object> response = new HashMap<>();
    response.put("users", userPage.getContent());
    response.put("currentPage", userPage.getNumber());
    response.put("totalItems", userPage.getTotalElements());
    response.put("totalPages", userPage.getTotalPages());
    
    return new ResponseEntity<>(response, HttpStatus.OK);
}
```

#### 2. DTO (Data Transfer Object)

```java
// UserDTO.java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String name;
    private String email;
    private String address;
}

// ModelMapper để chuyển đổi giữa entity và DTO
@Configuration
public class ModelMapperConfig {
    
    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }
}

// Trong Service
public List<UserDTO> getAllUsersDTO() {
    List<User> users = userRepository.findAll();
    return users.stream()
            .map(user -> modelMapper.map(user, UserDTO.class))
            .collect(Collectors.toList());
}

// Trong Controller
@GetMapping("/dto")
public ResponseEntity<List<UserDTO>> getAllUsersDTO() {
    List<UserDTO> usersDTO = userService.getAllUsersDTO();
    return new ResponseEntity<>(usersDTO, HttpStatus.OK);
}
```

#### 3. Bảo mật API với Spring Security

```java
// Thêm dependency
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>

// Cấu hình cơ bản
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .authorizeRequests()
                .antMatchers(HttpMethod.GET, "/api/**").permitAll()
                .antMatchers("/api/**").authenticated()
            .and()
            .httpBasic();
    }
    
    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.inMemoryAuthentication()
                .withUser("admin")
                .password(passwordEncoder().encode("admin"))
                .roles("ADMIN");
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

#### 4. Swagger/OpenAPI cho tài liệu API

```java
// Thêm dependency
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-ui</artifactId>
    <version>1.6.9</version>
</dependency>

// Cấu hình OpenAPI
@Configuration
public class OpenAPIConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("User Management API")
                        .version("1.0")
                        .description("API tài liệu cho ứng dụng quản lý người dùng")
                        .contact(new Contact()
                                .name("Nguyễn Văn A")
                                .email("nguyenvana@example.com")));
    }
}
```

#### 5. Xử lý Validation

```java
// Entity với validation annotations
@NotBlank(message = "Tên không được để trống")
@Size(min = 2, max = 100, message = "Tên phải có độ dài từ 2-100 ký tự")
private String name;

@NotBlank(message = "Email không được để trống")
@Email(message = "Email không hợp lệ")
@Column(unique = true)
private String email;

// Controller với @Valid annotation
@PostMapping
public ResponseEntity<User> createUser(@Valid @RequestBody User user) {
    User savedUser = userService.createUser(user);
    return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
}
```

## Best Practices cho REST API

#### 1. Sử dụng HTTP Methods đúng cách

- **GET**: Lấy dữ liệu (idempotent)
- **POST**: Tạo mới dữ liệu
- **PUT**: Cập nhật toàn bộ dữ liệu (idempotent)
- **PATCH**: Cập nhật một phần dữ liệu
- **DELETE**: Xóa dữ liệu (idempotent)

#### 2. Sử dụng HTTP Status Code phù hợp

- **2xx**: Thành công (200 OK, 201 Created, 204 No Content)
- **4xx**: Lỗi client (400 Bad Request, 401 Unauthorized, 404 Not Found)
- **5xx**: Lỗi server (500 Internal Server Error)

#### 3. Thiết kế URL có ý nghĩa

```
# Tốt
GET /users                   # Lấy danh sách người dùng
GET /users/123               # Lấy thông tin người dùng có ID 123
POST /users                  # Tạo người dùng mới
PUT /users/123               # Cập nhật thông tin người dùng có ID 123
DELETE /users/123            # Xóa người dùng có ID 123
GET /users/123/orders        # Lấy danh sách đơn hàng của người dùng có ID 123

# Không tốt
GET /get-all-users           # Động từ trong URL
GET /users/get/123           # Động từ trong URL
```

#### 4. Xử lý ngoại lệ hợp lý

```java
@ExceptionHandler(ResourceNotFoundException.class)
public ResponseEntity<ErrorDetails> handleResourceNotFoundException(
        ResourceNotFoundException ex, WebRequest request) {
    
    ErrorDetails errorDetails = new ErrorDetails(
            LocalDateTime.now(),
            ex.getMessage(),
            request.getDescription(false),
            "NOT_FOUND");
    
    return new ResponseEntity<>(errorDetails, HttpStatus.NOT_FOUND);
}
```

#### 5. Phiên bản API

```java
// URL versioning
@RestController
@RequestMapping("/api/v1/users")
public class UserControllerV1 { ... }

@RestController
@RequestMapping("/api/v2/users")
public class UserControllerV2 { ... }

// Header versioning
@GetMapping(headers = "API-Version=1")
public ResponseEntity<List<User>> getAllUsersV1() { ... }

@GetMapping(headers = "API-Version=2")
public ResponseEntity<List<UserDTO>> getAllUsersV2() { ... }

// Accept header versioning
@GetMapping(produces = "application/vnd.company.app-v1+json")
public ResponseEntity<List<User>> getAllUsersV1() { ... }

@GetMapping(produces = "application/vnd.company.app-v2+json")
public ResponseEntity<List<UserDTO>> getAllUsersV2() { ... }
```

#### 6. Rate Limiting

```java
// Sử dụng Spring Cloud Gateway hoặc Bucket4j
@Bean
public Customizer<RateLimiter> defaultRateLimiter() {
    return c -> c.setLimitForPeriod(10)
                 .setLimitRefreshPeriod(Duration.ofSeconds(1));
}
```

## Ứng dụng thực tế: Restaurant Management API

### Data Model

```java
@Entity
@Table(name = "categories")
@Data @NoArgsConstructor @AllArgsConstructor
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Size(max = 50)
    private String name;
    
    private String description;
}

@Entity
@Table(name = "dishes")
@Data @NoArgsConstructor @AllArgsConstructor
public class Dish {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Size(max = 100)
    private String name;
    
    @Size(max = 500)
    private String description;
    
    @Positive
    private BigDecimal price;
    
    private String imageUrl;
    
    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;
    
    private boolean available = true;
}

@Entity
@Table(name = "orders")
@Data @NoArgsConstructor @AllArgsConstructor
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    private String customerName;
    
    private String customerPhone;
    
    private String address;
    
    @Enumerated(EnumType.STRING)
    private OrderStatus status;
    
    @Column(name = "order_date")
    private LocalDateTime orderDate;
    
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();
    
    private BigDecimal totalAmount;
    
    public enum OrderStatus {
        PENDING, CONFIRMED, PREPARING, READY, DELIVERED, CANCELLED
    }
}

@Entity
@Table(name = "order_items")
@Data @NoArgsConstructor @AllArgsConstructor
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;
    
    @ManyToOne
    @JoinColumn(name = "dish_id")
    private Dish dish;
    
    @Positive
    private Integer quantity;
    
    private BigDecimal price;
}
```

### API Endpoints

```java
@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    
    private final CategoryService categoryService;
    
    @Autowired
    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }
    
    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        List<Category> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(categories);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable Long id) {
        Category category = categoryService.getCategoryById(id);
        return ResponseEntity.ok(category);
    }
    
    @GetMapping("/{id}/dishes")
    public ResponseEntity<List<Dish>> getDishesByCategory(@PathVariable Long id) {
        List<Dish> dishes = categoryService.getDishesByCategory(id);
        return ResponseEntity.ok(dishes);
    }
    
    @PostMapping
    public ResponseEntity<Category> createCategory(@Valid @RequestBody Category category) {
        Category newCategory = categoryService.createCategory(category);
        return new ResponseEntity<>(newCategory, HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Category> updateCategory(
            @PathVariable Long id, @Valid @RequestBody Category categoryDetails) {
        Category updatedCategory = categoryService.updateCategory(id, categoryDetails);
        return ResponseEntity.ok(updatedCategory);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}
```

```java
@RestController
@RequestMapping("/api/dishes")
public class DishController {
    
    private final DishService dishService;
    
    @Autowired
    public DishController(DishService dishService) {
        this.dishService = dishService;
    }
    
    @GetMapping
    public ResponseEntity<List<Dish>> getAllDishes() {
        List<Dish> dishes = dishService.getAllDishes();
        return ResponseEntity.ok(dishes);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Dish> getDishById(@PathVariable Long id) {
        Dish dish = dishService.getDishById(id);
        return ResponseEntity.ok(dish);
    }
    
    @PostMapping
    public ResponseEntity<Dish> createDish(@Valid @RequestBody Dish dish) {
        Dish newDish = dishService.createDish(dish);
        return new ResponseEntity<>(newDish, HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Dish> updateDish(
            @PathVariable Long id, @Valid @RequestBody Dish dishDetails) {
        Dish updatedDish = dishService.updateDish(id, dishDetails);
        return ResponseEntity.ok(updatedDish);
    }
    
    @PatchMapping("/{id}/available")
    public ResponseEntity<Dish> updateDishAvailability(
            @PathVariable Long id, @RequestParam boolean available) {
        Dish updatedDish = dishService.updateDishAvailability(id, available);
        return ResponseEntity.ok(updatedDish);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDish(@PathVariable Long id) {
        dishService.deleteDish(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Dish>> searchDishes(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Boolean available) {
        
        List<Dish> dishes = dishService.searchDishes(name, minPrice, maxPrice, available);
        return ResponseEntity.ok(dishes);
    }
}
```

```java
@RestController
@RequestMapping("/api/orders")
public class OrderController {
    
    private final OrderService orderService;
    
    @Autowired
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }
    
    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        Order order = orderService.getOrderById(id);
        return ResponseEntity.ok(order);
    }
    
    @PostMapping
    public ResponseEntity<Order> createOrder(@Valid @RequestBody OrderDTO orderDTO) {
        Order newOrder = orderService.createOrder(orderDTO);
        return new ResponseEntity<>(newOrder, HttpStatus.CREATED);
    }
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable Long id, @RequestParam Order.OrderStatus status) {
        Order updatedOrder = orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok(updatedOrder);
    }
    
    @GetMapping("/customer/{phone}")
    public ResponseEntity<List<Order>> getOrdersByCustomerPhone(@PathVariable String phone) {
        List<Order> orders = orderService.getOrdersByCustomerPhone(phone);
        return ResponseEntity.ok(orders);
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Order>> getOrdersByStatus(
            @PathVariable Order.OrderStatus status) {
        List<Order> orders = orderService.getOrdersByStatus(status);
        return ResponseEntity.ok(orders);
    }
}
```

## Kết luận

Spring Boot là một framework mạnh mẽ giúp xây dựng REST API một cách nhanh chóng và hiệu quả. Trong bài viết này, chúng ta đã tìm hiểu:

- Nguyên tắc cơ bản của REST
- Thiết lập dự án Spring Boot
- Xây dựng CRUD API cho Entity
- Các tính năng nâng cao: phân trang, DTOs, bảo mật
- Best Practices cho thiết kế REST API
- Ứng dụng thực tế với API quản lý nhà hàng

Các kỹ thuật này giúp xây dựng REST API đáng tin cậy, dễ bảo trì và có thể mở rộng, đáp ứng các yêu cầu của ứng dụng hiện đại.

## Tài liệu tham khảo

1. [Spring Boot Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/)
2. [Spring Data JPA Reference](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/)
3. [RESTful API Design Best Practices](https://restfulapi.net/)
4. "Spring in Action" - Craig Walls
5. "REST API Design Rulebook" - Mark Masse





