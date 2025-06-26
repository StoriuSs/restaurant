CREATE DATABASE restaurant;
SHOW DATABASES;
USE restaurant;
SHOW TABLES;
DESC Discount;

CREATE TABLE Customer (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    f_name VARCHAR(50) NOT NULL,
    l_name VARCHAR(50) NOT NULL,
    age INT NOT NULL CHECK (age >= 0)
);

CREATE TABLE Customer_Phone (
    customer_id INT,
    phone VARCHAR(20) NOT NULL UNIQUE,
    PRIMARY KEY (customer_id, phone),
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id)
);

CREATE TABLE Customer_Email (
    customer_id INT,
    email VARCHAR(100),
    PRIMARY KEY (customer_id, email),
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id)
);

CREATE TABLE RestaurantTable (
    table_id INT PRIMARY KEY AUTO_INCREMENT,
    num_seats INT NOT NULL CHECK (num_seats > 0),
    status ENUM('available', 'reserved', 'occupied') DEFAULT 'available'
);

CREATE TABLE Reservation (
    reservation_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT,
    table_id INT,
    reservation_time DATETIME NOT NULL,
    number_guests INT NOT NULL CHECK (number_guests > 0),
    status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id),
    FOREIGN KEY (table_id) REFERENCES RestaurantTable(table_id)
);

CREATE TABLE Dish (
    dish_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    price INT NOT NULL CHECK (price >= 0),  # Đơn vị đồng
    description TEXT,
    availability BOOLEAN DEFAULT TRUE
);

CREATE TABLE CustomerOrder (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    table_id INT,
    order_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'served', 'cancelled') DEFAULT 'pending',
    FOREIGN KEY (table_id) REFERENCES RestaurantTable(table_id)
);

CREATE TABLE OrderItem (
    order_id INT,
    dish_id INT,
    quantity INT NOT NULL CHECK (quantity > 0),
    note TEXT,
    PRIMARY KEY (order_id, dish_id),
    FOREIGN KEY (order_id) REFERENCES CustomerOrder(order_id),
    FOREIGN KEY (dish_id) REFERENCES Dish(dish_id)
);

CREATE TABLE Employee (
    employee_id INT PRIMARY KEY AUTO_INCREMENT,
    f_name VARCHAR(50) NOT NULL,
    l_name VARCHAR(50) NOT NULL,
    DoB DATE NOT NULL,
    gender ENUM('male', 'female'),
    hired_date DATE NOT NULL,
    role ENUM('waiter', 'chef', 'cashier') NOT NULL,
    shift VARCHAR(50),
    salary FLOAT CHECK (salary >= 0)   # Đơn vị triệu đồng
);

CREATE TABLE Employee_Phone (
    employee_id INT,
    phone VARCHAR(20) NOT NULL UNIQUE,
    PRIMARY KEY (employee_id, phone),
    FOREIGN KEY (employee_id) REFERENCES Employee(employee_id)
);

CREATE TABLE Employee_Email (
    employee_id INT,
    email VARCHAR(100),
    PRIMARY KEY (employee_id, email),
    FOREIGN KEY (employee_id) REFERENCES Employee(employee_id)
);

CREATE TABLE Handles (
    employee_id INT,
    order_id INT,
    role_in_order ENUM('waiter', 'chef', 'cashier'),
    PRIMARY KEY (employee_id, order_id),
    FOREIGN KEY (employee_id) REFERENCES Employee(employee_id),
    FOREIGN KEY (order_id) REFERENCES CustomerOrder(order_id)
);

CREATE TABLE Discount (
    discount_id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    type ENUM('percent', 'amount') NOT NULL,
    value INT NOT NULL,
    valid_from DATE NOT NULL,
    valid_to DATE NOT NULL,
    min_order_amount INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE Invoice (
    invoice_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT UNIQUE,
    discount_id INT UNIQUE,
    invoice_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total_amount INT NOT NULL CHECK (total_amount >= 0),
    FOREIGN KEY (order_id) REFERENCES CustomerOrder(order_id),
    FOREIGN KEY (discount_id) REFERENCES Discount(discount_id)
);

CREATE TABLE Payment (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    invoice_id INT UNIQUE,
    payment_method ENUM('cash', 'card', 'online-transfer') NOT NULL,
    status ENUM('success', 'failure', 'pending') DEFAULT 'pending',
    FOREIGN KEY (invoice_id) REFERENCES Invoice(invoice_id)
);
