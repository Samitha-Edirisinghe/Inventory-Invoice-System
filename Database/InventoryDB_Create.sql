CREATE DATABASE InventoryDB;
GO

USE InventoryDB;
GO

-- Create tables
CREATE TABLE Items (
    ItemId INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL,
    Price DECIMAL(18,2) NOT NULL,
    StockQuantity INT NOT NULL
);

CREATE TABLE Invoices (
    InvoiceId INT PRIMARY KEY IDENTITY(1,1),
    CustomerName NVARCHAR(100) NOT NULL,
    InvoiceDate DATETIME NOT NULL DEFAULT GETDATE(),
    GrandTotal DECIMAL(18,2) NOT NULL
);

CREATE TABLE InvoiceItems (
    InvoiceItemId INT PRIMARY KEY IDENTITY(1,1),
    InvoiceId INT NOT NULL FOREIGN KEY REFERENCES Invoices(InvoiceId) ON DELETE CASCADE,
    ItemId INT NOT NULL FOREIGN KEY REFERENCES Items(ItemId),
    Quantity INT NOT NULL,
    UnitPrice DECIMAL(18,2) NOT NULL,
    Total DECIMAL(18,2) NOT NULL
);

-- Insert sample data
INSERT INTO Items (Name, Price, StockQuantity) VALUES
('Laptop', 1200.00, 50),
('Mouse', 25.99, 100),
('Keyboard', 45.50, 75),
('Monitor', 300.00, 30);

INSERT INTO Invoices (CustomerName, GrandTotal) VALUES
('John Doe', 1225.99);

INSERT INTO InvoiceItems (InvoiceId, ItemId, Quantity, UnitPrice, Total) VALUES
(1, 1, 1, 1200.00, 1200.00),
(1, 2, 1, 25.99, 25.99);