+++
title = "JDBC và Database Connection trong Java: Từ cơ bản đến nâng cao"
date = "2025-09-23"
description = "Hướng dẫn chi tiết về JDBC trong Java, kết nối cơ sở dữ liệu, thực hiện truy vấn và các kỹ thuật tối ưu"
categories = ["Java"]
tags = ["Java", "Database", "JDBC"]
author = "Phạm Minh Kha"
+++

## JDBC là gì?

JDBC (Java Database Connectivity) là một API chuẩn trong Java cho phép kết nối và tương tác với các hệ quản trị cơ sở dữ liệu khác nhau. JDBC cung cấp một bộ các lớp và giao diện giúp lập trình viên thực hiện các thao tác cơ bản với cơ sở dữ liệu như kết nối, truy vấn, cập nhật dữ liệu mà không cần quan tâm đến chi tiết cài đặt của từng hệ quản trị cụ thể.

JDBC hoạt động như một lớp trừu tượng giữa ứng dụng Java và cơ sở dữ liệu, cho phép ứng dụng giao tiếp với nhiều loại cơ sở dữ liệu khác nhau thông qua một API thống nhất.

## Kiến trúc JDBC

JDBC có kiến trúc bốn lớp:

1. **Ứng dụng Java**: Chứa code Java của chúng ta
2. **JDBC API**: Cung cấp giao diện lập trình cho ứng dụng (package `java.sql` và `javax.sql`)
3. **JDBC Driver Manager**: Quản lý các driver và thiết lập kết nối
4. **JDBC Drivers**: Cài đặt giao thức giao tiếp với từng loại cơ sở dữ liệu cụ thể

## Thiết lập kết nối cơ sở dữ liệu

### Bước 1: Thêm JDBC Driver

Đầu tiên, cần thêm JDBC driver tương ứng với cơ sở dữ liệu bạn muốn kết nối. Ví dụ với MySQL:

```xml
<!-- Maven dependency -->
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>8.0.28</version>
</dependency>
```

### Bước 2: Kết nối đến cơ sở dữ liệu

```java
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DatabaseConnection {
    // Thông tin kết nối
    private static final String DB_URL = "jdbc:mysql://localhost:3306/mydatabase";
    private static final String USER = "root";
    private static final String PASSWORD = "password";
    
    public static Connection getConnection() throws SQLException {
        try {
            // Từ Java 6, không cần đăng ký driver rõ ràng
            // Class.forName("com.mysql.cj.jdbc.Driver");
            
            // Tạo kết nối
            return DriverManager.getConnection(DB_URL, USER, PASSWORD);
        } catch (SQLException e) {
            System.err.println("Không thể kết nối đến cơ sở dữ liệu: " + e.getMessage());
            throw e;
        }
    }
    
    public static void main(String[] args) {
        try (Connection conn = getConnection()) {
            if (conn != null) {
                System.out.println("Kết nối thành công đến cơ sở dữ liệu!");
                System.out.println("Database product: " + conn.getMetaData().getDatabaseProductName());
                System.out.println("Database version: " + conn.getMetaData().getDatabaseProductVersion());
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
```

### Định dạng URL kết nối cho các cơ sở dữ liệu phổ biến

1. **MySQL**:
   ```
   jdbc:mysql://hostname:port/database
   ```

2. **PostgreSQL**:
   ```
   jdbc:postgresql://hostname:port/database
   ```

3. **Oracle**:
   ```
   jdbc:oracle:thin:@hostname:port:database
   ```

4. **Microsoft SQL Server**:
   ```
   jdbc:sqlserver://hostname:port;databaseName=database
   ```

5. **SQLite**:
   ```
   jdbc:sqlite:path/to/database.db
   ```

## Thực hiện truy vấn cơ sở dữ liệu

JDBC cung cấp các đối tượng chính để thực hiện truy vấn:

- **Statement**: Thực thi các câu lệnh SQL tĩnh
- **PreparedStatement**: Thực thi các câu lệnh SQL đã được biên dịch trước với tham số
- **CallableStatement**: Thực thi các stored procedure

### Truy vấn SELECT với Statement

```java
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class SimpleQuery {
    public static void main(String[] args) {
        String sql = "SELECT id, name, email FROM users";
        
        try (
            Connection conn = DatabaseConnection.getConnection();
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery(sql)
        ) {
            // Duyệt qua kết quả
            while (rs.next()) {
                int id = rs.getInt("id");
                String name = rs.getString("name");
                String email = rs.getString("email");
                
                System.out.println("User: " + id + ", " + name + ", " + email);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
```

### Truy vấn với PreparedStatement

PreparedStatement giúp ngăn chặn SQL Injection và cải thiện hiệu suất khi thực thi câu truy vấn nhiều lần.

```java
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class PreparedStatementExample {
    public static void main(String[] args) {
        String sql = "SELECT id, name, email FROM users WHERE department = ? AND salary > ?";
        
        try (
            Connection conn = DatabaseConnection.getConnection();
            PreparedStatement pstmt = conn.prepareStatement(sql)
        ) {
            // Thiết lập các tham số
            pstmt.setString(1, "IT");
            pstmt.setDouble(2, 50000);
            
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    int id = rs.getInt("id");
                    String name = rs.getString("name");
                    String email = rs.getString("email");
                    
                    System.out.println("User: " + id + ", " + name + ", " + email);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
```

### Thực hiện thay đổi dữ liệu (INSERT, UPDATE, DELETE)

```java
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class DataModification {
    public static void main(String[] args) {
        // Thêm người dùng mới
        insertUser("Nguyễn Văn B", "nguyenvanb@example.com", "IT", 60000);
        
        // Cập nhật thông tin người dùng
        updateUserSalary("nguyenvanb@example.com", 65000);
        
        // Xóa người dùng
        deleteUser("nguyenvanb@example.com");
    }
    
    public static void insertUser(String name, String email, String department, double salary) {
        String sql = "INSERT INTO users (name, email, department, salary) VALUES (?, ?, ?, ?)";
        
        try (
            Connection conn = DatabaseConnection.getConnection();
            PreparedStatement pstmt = conn.prepareStatement(sql)
        ) {
            pstmt.setString(1, name);
            pstmt.setString(2, email);
            pstmt.setString(3, department);
            pstmt.setDouble(4, salary);
            
            int rowsAffected = pstmt.executeUpdate();
            System.out.println("Đã thêm " + rowsAffected + " người dùng.");
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
    
    public static void updateUserSalary(String email, double newSalary) {
        String sql = "UPDATE users SET salary = ? WHERE email = ?";
        
        try (
            Connection conn = DatabaseConnection.getConnection();
            PreparedStatement pstmt = conn.prepareStatement(sql)
        ) {
            pstmt.setDouble(1, newSalary);
            pstmt.setString(2, email);
            
            int rowsAffected = pstmt.executeUpdate();
            System.out.println("Đã cập nhật " + rowsAffected + " người dùng.");
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
    
    public static void deleteUser(String email) {
        String sql = "DELETE FROM users WHERE email = ?";
        
        try (
            Connection conn = DatabaseConnection.getConnection();
            PreparedStatement pstmt = conn.prepareStatement(sql)
        ) {
            pstmt.setString(1, email);
            
            int rowsAffected = pstmt.executeUpdate();
            System.out.println("Đã xóa " + rowsAffected + " người dùng.");
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
```

## Quản lý Transactions

Transactions cho phép bạn nhóm nhiều thao tác cơ sở dữ liệu thành một đơn vị, đảm bảo tính toàn vẹn dữ liệu.

```java
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class TransactionExample {
    public static void main(String[] args) {
        transferMoney("account1", "account2", 1000);
    }
    
    public static void transferMoney(String fromAccount, String toAccount, double amount) {
        Connection conn = null;
        
        try {
            conn = DatabaseConnection.getConnection();
            
            // Tắt auto-commit để bắt đầu transaction
            conn.setAutoCommit(false);
            
            // Trừ tiền từ tài khoản nguồn
            String sqlWithdraw = "UPDATE accounts SET balance = balance - ? WHERE account_number = ?";
            try (PreparedStatement pstmt = conn.prepareStatement(sqlWithdraw)) {
                pstmt.setDouble(1, amount);
                pstmt.setString(2, fromAccount);
                int rowsAffected = pstmt.executeUpdate();
                
                if (rowsAffected == 0) {
                    throw new SQLException("Không thể trừ tiền từ tài khoản " + fromAccount);
                }
            }
            
            // Cộng tiền vào tài khoản đích
            String sqlDeposit = "UPDATE accounts SET balance = balance + ? WHERE account_number = ?";
            try (PreparedStatement pstmt = conn.prepareStatement(sqlDeposit)) {
                pstmt.setDouble(1, amount);
                pstmt.setString(2, toAccount);
                int rowsAffected = pstmt.executeUpdate();
                
                if (rowsAffected == 0) {
                    throw new SQLException("Không thể cộng tiền vào tài khoản " + toAccount);
                }
            }
            
            // Nếu mọi thứ OK, commit transaction
            conn.commit();
            System.out.println("Chuyển tiền thành công!");
            
        } catch (SQLException e) {
            // Nếu có lỗi, rollback transaction
            if (conn != null) {
                try {
                    conn.rollback();
                    System.out.println("Transaction đã được rollback.");
                } catch (SQLException ex) {
                    ex.printStackTrace();
                }
            }
            e.printStackTrace();
        } finally {
            // Khôi phục auto-commit và đóng kết nối
            if (conn != null) {
                try {
                    conn.setAutoCommit(true);
                    conn.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
    }
}
```

## Batch Processing

Batch processing cho phép gửi nhiều câu lệnh SQL đến cơ sở dữ liệu trong một lần, giúp cải thiện hiệu suất.

```java
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class BatchProcessingExample {
    public static void main(String[] args) {
        try (
            Connection conn = DatabaseConnection.getConnection();
            PreparedStatement pstmt = conn.prepareStatement(
                "INSERT INTO products (name, price, category) VALUES (?, ?, ?)")
        ) {
            // Tắt auto-commit
            conn.setAutoCommit(false);
            
            // Thêm các lệnh vào batch
            for (int i = 1; i <= 1000; i++) {
                String productName = "Sản phẩm " + i;
                double price = 100 + i * 0.5;
                String category = (i % 5 == 0) ? "Điện tử" : 
                                 (i % 5 == 1) ? "Thời trang" : 
                                 (i % 5 == 2) ? "Thực phẩm" :
                                 (i % 5 == 3) ? "Sách" : "Đồ gia dụng";
                
                pstmt.setString(1, productName);
                pstmt.setDouble(2, price);
                pstmt.setString(3, category);
                
                pstmt.addBatch();
                
                // Thực thi batch sau mỗi 100 bản ghi để tránh OutOfMemory
                if (i % 100 == 0) {
                    int[] results = pstmt.executeBatch();
                    System.out.println("Đã thêm " + results.length + " sản phẩm.");
                }
            }
            
            // Thực thi batch cuối cùng
            int[] remainingResults = pstmt.executeBatch();
            System.out.println("Đã thêm " + remainingResults.length + " sản phẩm còn lại.");
            
            // Commit transaction
            conn.commit();
            
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
```

## Connection Pooling

Connection Pooling là kỹ thuật tái sử dụng kết nối cơ sở dữ liệu để tránh chi phí tạo và đóng kết nối liên tục. Java cung cấp API `javax.sql.DataSource` để làm việc với connection pooling.

### Sử dụng HikariCP - thư viện connection pool phổ biến

```java
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class ConnectionPoolExample {
    private static DataSource dataSource;
    
    static {
        // Cấu hình HikariCP
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl("jdbc:mysql://localhost:3306/mydatabase");
        config.setUsername("root");
        config.setPassword("password");
        
        // Cấu hình pool
        config.setMaximumPoolSize(10);
        config.setMinimumIdle(5);
        config.setIdleTimeout(30000);
        config.setPoolName("MySQLPool");
        
        // Thêm thuộc tính cache cho MySQL
        config.addDataSourceProperty("cachePrepStmts", "true");
        config.addDataSourceProperty("prepStmtCacheSize", "250");
        config.addDataSourceProperty("prepStmtCacheSqlLimit", "2048");
        
        dataSource = new HikariDataSource(config);
    }
    
    public static Connection getConnection() throws SQLException {
        return dataSource.getConnection();
    }
    
    public static void main(String[] args) {
        // Sử dụng connection từ pool
        try (
            Connection conn = getConnection();
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT COUNT(*) AS user_count FROM users")
        ) {
            if (rs.next()) {
                System.out.println("Tổng số người dùng: " + rs.getInt("user_count"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
```

## Xử lý các loại dữ liệu phức tạp

#### 1. Làm việc với BLOB và CLOB

```java
import java.io.*;
import java.sql.*;

public class BlobExample {
    public static void main(String[] args) {
        // Lưu ảnh vào cơ sở dữ liệu
        saveImageToDatabase("avatar.jpg", 1);
        
        // Đọc ảnh từ cơ sở dữ liệu
        retrieveImageFromDatabase(1, "retrieved_avatar.jpg");
    }
    
    public static void saveImageToDatabase(String imagePath, int userId) {
        String sql = "UPDATE users SET profile_picture = ? WHERE id = ?";
        
        try (
            Connection conn = DatabaseConnection.getConnection();
            PreparedStatement pstmt = conn.prepareStatement(sql);
            FileInputStream fis = new FileInputStream(imagePath)
        ) {
            pstmt.setBinaryStream(1, fis);
            pstmt.setInt(2, userId);
            
            int rowsAffected = pstmt.executeUpdate();
            System.out.println("Đã cập nhật ảnh cho " + rowsAffected + " người dùng.");
            
        } catch (SQLException | FileNotFoundException e) {
            e.printStackTrace();
        }
    }
    
    public static void retrieveImageFromDatabase(int userId, String outputPath) {
        String sql = "SELECT profile_picture FROM users WHERE id = ?";
        
        try (
            Connection conn = DatabaseConnection.getConnection();
            PreparedStatement pstmt = conn.prepareStatement(sql)
        ) {
            pstmt.setInt(1, userId);
            
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    Blob blob = rs.getBlob("profile_picture");
                    if (blob != null) {
                        try (
                            InputStream is = blob.getBinaryStream();
                            FileOutputStream fos = new FileOutputStream(outputPath)
                        ) {
                            byte[] buffer = new byte[4096];
                            int bytesRead;
                            
                            while ((bytesRead = is.read(buffer)) != -1) {
                                fos.write(buffer, 0, bytesRead);
                            }
                            
                            System.out.println("Đã lưu ảnh thành công!");
                        }
                    }
                }
            }
        } catch (SQLException | IOException e) {
            e.printStackTrace();
        }
    }
}
```

#### 2. Làm việc với Date và Time

```java
import java.sql.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class DateTimeExample {
    public static void main(String[] args) {
        createEventWithDateTime();
        retrieveEvents();
    }
    
    public static void createEventWithDateTime() {
        String sql = "INSERT INTO events (title, event_date, event_timestamp) VALUES (?, ?, ?)";
        
        try (
            Connection conn = DatabaseConnection.getConnection();
            PreparedStatement pstmt = conn.prepareStatement(sql)
        ) {
            // Java 8+ Date/Time API
            LocalDate today = LocalDate.now();
            LocalDateTime now = LocalDateTime.now();
            
            pstmt.setString(1, "Hội thảo Java");
            pstmt.setDate(2, java.sql.Date.valueOf(today));
            pstmt.setTimestamp(3, java.sql.Timestamp.valueOf(now));
            
            int rowsAffected = pstmt.executeUpdate();
            System.out.println("Đã thêm " + rowsAffected + " sự kiện.");
            
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
    
    public static void retrieveEvents() {
        String sql = "SELECT id, title, event_date, event_timestamp FROM events";
        
        try (
            Connection conn = DatabaseConnection.getConnection();
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery(sql)
        ) {
            while (rs.next()) {
                int id = rs.getInt("id");
                String title = rs.getString("title");
                Date date = rs.getDate("event_date");
                Timestamp timestamp = rs.getTimestamp("event_timestamp");
                
                // Chuyển đổi sang Java 8+ Date/Time
                LocalDate localDate = date.toLocalDate();
                LocalDateTime localDateTime = timestamp.toLocalDateTime();
                
                System.out.println("Event: " + id + ", " + title);
                System.out.println("  Ngày: " + localDate);
                System.out.println("  Thời gian chính xác: " + localDateTime);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
```

## Xử lý ngoại lệ và SQLState

JDBC cung cấp thông tin chi tiết về lỗi thông qua SQLException.

```java
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class ErrorHandlingExample {
    public static void main(String[] args) {
        try {
            insertUserWithErrorHandling("Nguyễn Văn C", "nguyenvanc@example.com", "HR");
        } catch (SQLException e) {
            handleSQLException(e);
        }
    }
    
    public static void insertUserWithErrorHandling(String name, String email, String department) 
            throws SQLException {
        String sql = "INSERT INTO users (name, email, department) VALUES (?, ?, ?)";
        
        try (
            Connection conn = DatabaseConnection.getConnection();
            PreparedStatement pstmt = conn.prepareStatement(sql)
        ) {
            pstmt.setString(1, name);
            pstmt.setString(2, email);
            pstmt.setString(3, department);
            
            pstmt.executeUpdate();
        }
    }
    
    public static void handleSQLException(SQLException e) {
        System.err.println("Lỗi SQL: " + e.getMessage());
        System.err.println("SQLState: " + e.getSQLState());
        System.err.println("Mã lỗi: " + e.getErrorCode());
        
        // Xử lý các lỗi phổ biến
        switch (e.getSQLState()) {
            case "23000":
                System.err.println("Lỗi vi phạm ràng buộc duy nhất. Email có thể đã tồn tại.");
                break;
            case "42000":
                System.err.println("Lỗi cú pháp SQL.");
                break;
            case "08S01":
                System.err.println("Mất kết nối cơ sở dữ liệu. Vui lòng kiểm tra kết nối mạng.");
                break;
            default:
                System.err.println("Lỗi không xác định.");
        }
        
        // Hiển thị stack trace của các ngoại lệ bị ràng buộc
        SQLException nextEx = e.getNextException();
        if (nextEx != null) {
            System.err.println("Ngoại lệ bị ràng buộc:");
            nextEx.printStackTrace();
        }
    }
}
```

## Mẫu DAO (Data Access Object)

Mẫu DAO là một kỹ thuật phổ biến để tách biệt logic truy cập dữ liệu khỏi logic nghiệp vụ.

### Ví dụ DAO cho thực thể User

```java
// User entity
public class User {
    private int id;
    private String name;
    private String email;
    private String department;
    private double salary;
    
    // Constructors, getters, setters
    public User(int id, String name, String email, String department, double salary) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.department = department;
        this.salary = salary;
    }
    
    public User(String name, String email, String department, double salary) {
        this.name = name;
        this.email = email;
        this.department = department;
        this.salary = salary;
    }
    
    // Getters and setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public double getSalary() { return salary; }
    public void setSalary(double salary) { this.salary = salary; }
    
    @Override
    public String toString() {
        return "User{" +
               "id=" + id +
               ", name='" + name + '\'' +
               ", email='" + email + '\'' +
               ", department='" + department + '\'' +
               ", salary=" + salary +
               '}';
    }
}

// UserDAO interface
public interface UserDAO {
    User findById(int id) throws SQLException;
    List<User> findAll() throws SQLException;
    List<User> findByDepartment(String department) throws SQLException;
    void insert(User user) throws SQLException;
    void update(User user) throws SQLException;
    void delete(int id) throws SQLException;
}

// UserDAOImpl - implementation using JDBC
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class UserDAOImpl implements UserDAO {
    
    @Override
    public User findById(int id) throws SQLException {
        String sql = "SELECT id, name, email, department, salary FROM users WHERE id = ?";
        
        try (
            Connection conn = DatabaseConnection.getConnection();
            PreparedStatement pstmt = conn.prepareStatement(sql)
        ) {
            pstmt.setInt(1, id);
            
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return extractUserFromResultSet(rs);
                }
            }
        }
        return null; // Không tìm thấy
    }
    
    @Override
    public List<User> findAll() throws SQLException {
        List<User> users = new ArrayList<>();
        String sql = "SELECT id, name, email, department, salary FROM users";
        
        try (
            Connection conn = DatabaseConnection.getConnection();
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery(sql)
        ) {
            while (rs.next()) {
                User user = extractUserFromResultSet(rs);
                users.add(user);
            }
        }
        return users;
    }
    
    @Override
    public List<User> findByDepartment(String department) throws SQLException {
        List<User> users = new ArrayList<>();
        String sql = "SELECT id, name, email, department, salary FROM users WHERE department = ?";
        
        try (
            Connection conn = DatabaseConnection.getConnection();
            PreparedStatement pstmt = conn.prepareStatement(sql)
        ) {
            pstmt.setString(1, department);
            
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    User user = extractUserFromResultSet(rs);
                    users.add(user);
                }
            }
        }
        return users;
    }
    
    @Override
    public void insert(User user) throws SQLException {
        String sql = "INSERT INTO users (name, email, department, salary) VALUES (?, ?, ?, ?)";
        
        try (
            Connection conn = DatabaseConnection.getConnection();
            PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)
        ) {
            pstmt.setString(1, user.getName());
            pstmt.setString(2, user.getEmail());
            pstmt.setString(3, user.getDepartment());
            pstmt.setDouble(4, user.getSalary());
            
            int affectedRows = pstmt.executeUpdate();
            
            if (affectedRows == 0) {
                throw new SQLException("Thêm người dùng thất bại, không có dòng nào bị ảnh hưởng.");
            }
            
            // Lấy ID được sinh ra
            try (ResultSet generatedKeys = pstmt.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    user.setId(generatedKeys.getInt(1));
                } else {
                    throw new SQLException("Thêm người dùng thất bại, không lấy được ID.");
                }
            }
        }
    }
    
    @Override
    public void update(User user) throws SQLException {
        String sql = "UPDATE users SET name = ?, email = ?, department = ?, salary = ? WHERE id = ?";
        
        try (
            Connection conn = DatabaseConnection.getConnection();
            PreparedStatement pstmt = conn.prepareStatement(sql)
        ) {
            pstmt.setString(1, user.getName());
            pstmt.setString(2, user.getEmail());
            pstmt.setString(3, user.getDepartment());
            pstmt.setDouble(4, user.getSalary());
            pstmt.setInt(5, user.getId());
            
            int affectedRows = pstmt.executeUpdate();
            
            if (affectedRows == 0) {
                throw new SQLException("Cập nhật người dùng thất bại, không tìm thấy ID: " + user.getId());
            }
        }
    }
    
    @Override
    public void delete(int id) throws SQLException {
        String sql = "DELETE FROM users WHERE id = ?";
        
        try (
            Connection conn = DatabaseConnection.getConnection();
            PreparedStatement pstmt = conn.prepareStatement(sql)
        ) {
            pstmt.setInt(1, id);
            
            int affectedRows = pstmt.executeUpdate();
            
            if (affectedRows == 0) {
                throw new SQLException("Xóa người dùng thất bại, không tìm thấy ID: " + id);
            }
        }
    }
    
    private User extractUserFromResultSet(ResultSet rs) throws SQLException {
        return new User(
            rs.getInt("id"),
            rs.getString("name"),
            rs.getString("email"),
            rs.getString("department"),
            rs.getDouble("salary")
        );
    }
}
```

## Kết luận

JDBC là một API mạnh mẽ trong Java cho phép tương tác với cơ sở dữ liệu một cách hiệu quả và linh hoạt. Trong bài viết này, chúng ta đã tìm hiểu:

- Cơ bản về JDBC và cách thiết lập kết nối
- Thực hiện các truy vấn và cập nhật dữ liệu
- Quản lý transactions
- Sử dụng batch processing để cải thiện hiệu suất
- Connection pooling để tái sử dụng kết nối
- Xử lý các loại dữ liệu phức tạp
- Xử lý ngoại lệ và các lỗi cơ sở dữ liệu
- Mẫu thiết kế DAO để tổ chức code

Những kỹ thuật này là nền tảng quan trọng để xây dựng các ứng dụng Java có khả năng tương tác với cơ sở dữ liệu một cách hiệu quả, an toàn và dễ bảo trì.

## Tài liệu tham khảo

1. Oracle Java Documentation - [JDBC Database Access](https://docs.oracle.com/javase/tutorial/jdbc/index.html)
2. "JDBC API Tutorial and Reference" - Maydene Fisher, Jon Ellis, Jonathan Bruce
3. HikariCP - [GitHub Repository](https://github.com/brettwooldridge/HikariCP)
4. [Oracle: Advanced JDBC Concepts](https://docs.oracle.com/javase/tutorial/jdbc/basics/index.html)
5. [MySQL Connector/J Developer Guide](https://dev.mysql.com/doc/connector-j/8.0/en/)





