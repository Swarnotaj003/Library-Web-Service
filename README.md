# Library Web Service

## About
The **Library Web Service** is a full-stack application designed to manage a library's authors and books. This project serves as a practical implementation of a `GraphQL API` using the `Spring Boot` framework in `Java` for the *backend*, and a simple webpage using `HTML`, `CSS`, and `JavaScript` for the *frontend*. 

## Objective
The primary objective of this project is to learn and **implement GraphQL** in a **real-world application**. By building this Library Web Service, we aim to:
- Understand the fundamentals of GraphQL and how it differs from REST APIs.
- Gain hands-on experience with Spring Boot for creating a GraphQL server.
- Develop a responsive and interactive frontend using HTML, CSS, and JavaScript.
- Learn how to make API calls to a GraphQL server and handle responses effectively.

## The Server (Backend)
The backend is implemented as a **GraphQL** API which follows the given schema for **Queries** (*to fetch data*) & **Mutations** (*to modify data*):
```
# To fetch data
type Query {
	authors: [Author]
	authorById(id: ID!): Author
	
	books: [Book]
	bookById(id: ID!): Book
}

# To modify data
type Mutation {
	addAuthor(author: AuthorInput!): Author

	addBook(book: BookInput!): Book
	updateBook(id: ID!, book: BookInput!): Book
	deleteBook(id: ID!): Boolean
}

# Input type definition
# '!' indicates required field
input BookInput {
	title: String!	
	pageCount: Int
	authorId: ID!
}

input AuthorInput {
	name: String!
}

type Author {
	id: ID!		
	name: String!
	books: [Book]
}

type Book {
	id: ID!
	title: String!
	pageCount: Int
	author: Author!
}
```

## The Client (Frontend)
The frontend is designed as a **single-page application**, featuring the following *previews*:

**Preview-1**

![image](https://github.com/user-attachments/assets/d16edd56-b805-4977-b268-82f59b738c75)

**Preview-2**

![image](https://github.com/user-attachments/assets/78714687-3193-4c3d-be04-efe3195ea7c9)
