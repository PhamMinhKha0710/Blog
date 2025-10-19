+++
title = "REST API with Spring Boot: Building Modern Backend"
date = "2025-09-21"
description = "Detailed guide on building RESTful API with Spring Boot, designing endpoints, handling request/response and applying best practices"
categories = ["Java"]
tags = ["Java", "API", "Web"]
author = "Pham Minh Kha"
translationKey = "rest-api"
+++

## What is REST API?

REST (Representational State Transfer) is a software architecture style for distributed applications, proposed by Roy Fielding in 2000. REST is not dependent on any specific protocol, but most REST implementations use HTTP.

RESTful API is an API that follows REST principles:
- **Client-Server**: Separates user interface and data storage
- **Stateless**: Each request from client must contain all necessary information
- **Cacheable**: Responses can be cached
- **Uniform Interface**: Uniform interface between components
- **Layered System**: Layered architecture
- **Code on Demand** (optional): Server can send code for client to execute

## Spring Boot: Efficient REST API Development Platform

Spring Boot is a powerful framework that enables rapid and easy development of Java applications. Spring Boot provides many features for building REST APIs:

- Auto-configuration: Automatically configures based on dependencies
- Standalone: No external server required
- Opinionated: Provides reasonable default configurations
- Production-ready: Ready for production environment

## Setting Up Spring Boot Project

### Step 1: Create Spring Boot Project

Use [Spring Initializr](https://start.spring.io/) to create project with dependencies:
- Spring Web
- Spring Data JPA
- H2 Database (or MySQL, PostgreSQL)
- Spring Boot DevTools
- Lombok (optional)

Or, use Maven:

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

### Step 2: Configure Database

Create `application.properties` file:

```properties
# H2 Database configuration
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

## Building REST API with Spring Boot

### Create Entity

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
    
    @NotBlank(message = "Name cannot be blank")
    @Size(min = 2, max = 100, message = "Name must be 2-100 characters")
    private String name;
    
    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Invalid email")
    @Column(unique = true)
    private String email;
    
    @NotBlank(message = "Address cannot be blank")
    private String address;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Called before entity is saved
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    // Called before entity is updated
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
```

### Create Repository

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

### Create Service

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
        
        // Check if new email is already used by another user
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

### Create Exception Handler

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

### Create Controller

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

## Advanced Features in REST API

#### 1. Pagination and Sorting

```java
// In Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Page<User> findByNameContaining(String name, Pageable pageable);
}

// In Service
public Page<User> getAllUsers(int page, int size, String sortBy, String sortDir) {
    Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name())
            ? Sort.by(sortBy).ascending()
            : Sort.by(sortBy).descending();
    
    Pageable pageable = PageRequest.of(page, size, sort);
    return userRepository.findAll(pageable);
}

// In Controller
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

// ModelMapper to convert between entity and DTO
@Configuration
public class ModelMapperConfig {
    
    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }
}

// In Service
public List<UserDTO> getAllUsersDTO() {
    List<User> users = userRepository.findAll();
    return users.stream()
            .map(user -> modelMapper.map(user, UserDTO.class))
            .collect(Collectors.toList());
}

// In Controller
@GetMapping("/dto")
public ResponseEntity<List<UserDTO>> getAllUsersDTO() {
    List<UserDTO> usersDTO = userService.getAllUsersDTO();
    return new ResponseEntity<>(usersDTO, HttpStatus.OK);
}
```

#### 3. Securing API with Spring Security

```java
// Add dependency
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>

// Basic configuration
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

#### 4. Swagger/OpenAPI for API Documentation

```java
// Add dependency
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-ui</artifactId>
    <version>1.6.9</version>
</dependency>

// Configure OpenAPI
@Configuration
public class OpenAPIConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("User Management API")
                        .version("1.0")
                        .description("API documentation for user management application")
                        .contact(new Contact()
                                .name("John Doe")
                                .email("johndoe@example.com")));
    }
}
```

#### 5. Handling Validation

```java
// Entity with validation annotations
@NotBlank(message = "Name cannot be blank")
@Size(min = 2, max = 100, message = "Name must be 2-100 characters")
private String name;

@NotBlank(message = "Email cannot be blank")
@Email(message = "Invalid email")
@Column(unique = true)
private String email;

// Controller with @Valid annotation
@PostMapping
public ResponseEntity<User> createUser(@Valid @RequestBody User user) {
    User savedUser = userService.createUser(user);
    return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
}
```

## Best Practices for REST API

#### 1. Use HTTP Methods Correctly

- **GET**: Retrieve data (idempotent)
- **POST**: Create new data
- **PUT**: Update entire data (idempotent)
- **PATCH**: Update partial data
- **DELETE**: Delete data (idempotent)

#### 2. Use Appropriate HTTP Status Codes

- **2xx**: Success (200 OK, 201 Created, 204 No Content)
- **4xx**: Client error (400 Bad Request, 401 Unauthorized, 404 Not Found)
- **5xx**: Server error (500 Internal Server Error)

#### 3. Design Meaningful URLs

```
# Good
GET /users                   # Get user list
GET /users/123               # Get user with ID 123
POST /users                  # Create new user
PUT /users/123               # Update user with ID 123
DELETE /users/123            # Delete user with ID 123
GET /users/123/orders        # Get orders of user with ID 123

# Not Good
GET /get-all-users           # Verb in URL
GET /users/get/123           # Verb in URL
```

#### 4. Handle Exceptions Properly

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

#### 5. API Versioning

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
// Use Spring Cloud Gateway or Bucket4j
@Bean
public Customizer<RateLimiter> defaultRateLimiter() {
    return c -> c.setLimitForPeriod(10)
                 .setLimitRefreshPeriod(Duration.ofSeconds(1));
}
```

## Real-World Application: Restaurant Management API

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

## Conclusion

Spring Boot is a powerful framework that helps build REST APIs quickly and efficiently. In this article, we learned about:

- Basic principles of REST
- Setting up Spring Boot project
- Building CRUD API for Entity
- Advanced features: pagination, DTOs, security
- Best Practices for REST API design
- Real-world application with restaurant management API

These techniques help build reliable, maintainable and scalable REST APIs that meet modern application requirements.

## References

1. [Spring Boot Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/)
2. [Spring Data JPA Reference](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/)
3. [RESTful API Design Best Practices](https://restfulapi.net/)
4. "Spring in Action" - Craig Walls
5. "REST API Design Rulebook" - Mark Masse













