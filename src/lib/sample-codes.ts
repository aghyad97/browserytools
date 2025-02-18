export const SAMPLE_CODES = {
  javascript: `// Example of a JavaScript function
function calculateFactorial(n) {
    if (n === 0 || n === 1) {
        return 1;
    }
    return n * calculateFactorial(n - 1);
}

const result = calculateFactorial(5);
console.log(\`Factorial of 5 is \${result}\`);`,

  python: `# Example of a Python class
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def greet(self):
        return f"Hello, my name is {self.name}"

person = Person("Alice", 30)
print(person.greet())`,

  typescript: `// Example of TypeScript interfaces
interface User {
    id: number;
    name: string;
    email: string;
    age?: number;
}

function createUser(data: Partial<User>): User {
    return {
        id: Math.random(),
        name: data.name || 'Anonymous',
        email: data.email || 'no@email.com',
        age: data.age
    };
}`,

  rust: `// Example of Rust structs and implementations
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn area(&self) -> u32 {
        self.width * self.height
    }

    fn can_hold(&self, other: &Rectangle) -> bool {
        self.width > other.width && self.height > other.height
    }
}`,

  go: `// Example of Go concurrency
package main

import (
    "fmt"
    "time"
)

func worker(id int, jobs <-chan int, results chan<- int) {
    for j := range jobs {
        fmt.Printf("worker %d started job %d\\n", id, j)
        time.Sleep(time.Second)
        fmt.Printf("worker %d finished job %d\\n", id, j)
        results <- j * 2
    }
}`,

  sql: `-- Example of SQL queries
CREATE TABLE Users (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO Users (name, email) VALUES
    ('John Doe', 'john@example.com'),
    ('Jane Smith', 'jane@example.com');

SELECT 
    u.name,
    COUNT(o.id) as order_count
FROM Users u
LEFT JOIN Orders o ON u.id = o.user_id
GROUP BY u.id
HAVING order_count > 5;`,

  html: `<!-- Example of HTML structure -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sample Page</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <nav>
            <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
            </ul>
        </nav>
    </header>
    <main>
        <h1>Welcome</h1>
        <p>This is a sample page.</p>
    </main>
</body>
</html>`,

  css: `/* Example of CSS styling */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem;
}

.card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease;
}

.card:hover {
    transform: translateY(-2px);
}

@media (max-width: 768px) {
    .container {
        padding: 0.5rem;
    }
}`,

  php: `<?php
// Example of PHP class and inheritance
abstract class Animal {
    protected $name;
    
    public function __construct($name) {
        $this->name = $name;
    }
    
    abstract public function makeSound();
}

class Dog extends Animal {
    public function makeSound() {
        return "Woof! My name is " . $this->name;
    }
}

$dog = new Dog("Rex");
echo $dog->makeSound();
?>`,
};
