// Connect to plp_bookstore
use plp_bookstore;

// Task 2: Basic CRUD Operations

// Find all books in a specific genre (e.g. Fantasy)
db.books.find({ genre: "Fantasy" });

// Find books published after a certain year (e.g. 2010)
db.books.find({ published_year: { $gt: 2010 } });

// Find books by a specific author (e.g. "J.K. Rowling")
db.books.find({ author: "J.K. Rowling" });

// Update the price of a specific book (e.g. "The Hobbit")
db.books.updateOne(
  { title: "The Hobbit" },
  { $set: { price: 17.99 } }
);

// Delete a book by its title (e.g. "The Catcher in the Rye")
db.books.deleteOne({ title: "The Catcher in the Rye" });

// Task 3: Advanced Queries

// Find books both in stock and published after 2010
db.books.find({ in_stock: true, published_year: { $gt: 2010 } });

// Projection: only title, author, price
db.books.find({}, { _id: 0, title: 1, author: 1, price: 1 });

// Sort by price ascending
db.books.find().sort({ price: 1 });

// Sort by price descending
db.books.find().sort({ price: -1 });

// Pagination: 5 books per page
// Page 1:
db.books.find().skip(0).limit(5);
// Page 2:
db.books.find().skip(5).limit(5);

// Task 4: Aggregation Pipeline

// Average price of books by genre
db.books.aggregate([
  { $group: { _id: "$genre", averagePrice: { $avg: "$price" } } }
]);

// Author with most books
db.books.aggregate([
  { $group: { _id: "$author", count: { $sum: 1 } } },
  { $sort: { count: -1 } },
  { $limit: 1 }
]);

// Group books by publication decade and count
db.books.aggregate([
  {
    $project: {
      decade: {
        $concat: [
          { $toString: { $subtract: ["$published_year", { $mod: ["$published_year", 10] }] } },
          "s"
        ]
      }
    }
  },
  {
    $group: {
      _id: "$decade",
      count: { $sum: 1 }
    }
  },
  { $sort: { _id: 1 } }
]);

// Task 5: Indexing

// Create index on title
db.books.createIndex({ title: 1 });

// Create compound index on author and published_year
db.books.createIndex({ author: 1, published_year: -1 });

// Explain to check index usage
db.books.find({ title: "The Hobbit" }).explain("executionStats");
db.books.find({ author: "J.K. Rowling", published_year: 1997 }).explain("executionStats");
