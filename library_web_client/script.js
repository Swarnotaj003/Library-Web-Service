const API_URL = 'http://localhost:8083/graphql';

// DOM Elements
const authorNameInput = document.querySelector('input[name="authorName"]');
const addAuthorBtn = document.querySelector('#author-section button:last-of-type');
const authorListTbody = document.querySelector('#author-list');
const authorSearchInput = document.querySelector('input[name="authorId"]');
const authorSearchBtn = document.querySelector('#author-section button:first-of-type');
const authorSearchResult = document.querySelector('#author-search-result');

const bookTitleInput = document.querySelector('input[name="bookTitle"]');
const pageCountInput = document.querySelector('input[name="pageCount"]');
const bookAuthorIdInput = document.querySelector('#book-section input[name="authorId"]');
const addBookBtn = document.querySelector('#book-section .add-book-inputs button');
const bookListTbody = document.querySelector('#book-list');
const bookSearchInput = document.querySelector('input[name="bookId"]');
const bookSearchBtn = document.querySelector('#book-section button:first-of-type');
const bookSearchResult = document.querySelector('#book-search-result');

// Generic GraphQL fetcher
async function fetchGraphQL(query, variables = {}) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, variables })
        });
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        return { errors: [error] };
    }
}

// Author Functions
async function fetchAllAuthors() {
    const query = `query { 
        authors { 
            id 
            name 
            books { id } 
        } 
    }`;
    
    const result = await fetchGraphQL(query);
    if (result.errors) {
        alert(`Error fetching authors: ${result.errors[0].message}`);
        return;
    }
    renderAuthors(result.data.authors);
}

async function searchAuthor() {
    const id = authorSearchInput.value;
    if (!id) return;

    const query = `query ($id: ID!) {
        authorById(id: $id) {
            id
            name
            books { title }
        }
    }`;

    const result = await fetchGraphQL(query, { id });
    if (result.errors) {
        alert(`Error fetching author: ${result.errors[0].message}`);
        return;
    }

    const author = result.data.authorById;
    authorSearchResult.innerHTML = author 
        ? `Author: ${author.name}, Books: ${author.books.length}`
        : `Author not found`;
}

async function addNewAuthor() {
    const name = authorNameInput.value.trim();
    if (!name) return;

    const mutation = `mutation ($author: AuthorInput!) {
        addAuthor(author: $author) { id name }
    }`;

    const result = await fetchGraphQL(mutation, { author: { name } });
    if (result.errors) {
        alert(`Error adding author: ${result.errors[0].message}`);
        return;
    }

    authorNameInput.value = '';
    fetchAllAuthors();
}

// Book Functions
async function fetchAllBooks() {
    const query = `query {
        books {
            id
            title
            pageCount
            author { name }
        }
    }`;

    const result = await fetchGraphQL(query);
    if (result.errors) {
        alert(`Error fetching books: ${result.errors[0].message}`);
        return;
    }
    renderBooks(result.data.books);
}

async function searchBook() {
    const id = bookSearchInput.value.trim();
    if (!id) {
        alert('Please enter a book ID');
        return;
    }

    const query = `query ($id: ID!) {
        bookById(id: $id) {
            id
            title
            pageCount
            author {
                name
            }
        }
    }`;
    const result = await fetchGraphQL(query, { id });
    if (result.errors) {
        alert(`Error fetching book: ${result.errors[0].message}`);
        return;
    }
    const book = result.data.bookById;
    bookSearchResult.innerHTML = book
        ? `Title: ${book.title}, Page-count: ${book.pageCount}, Author: ${book.author.name}`
        : `Book not found`;
}

async function addNewBook() {
    const bookData = {
        title: bookTitleInput.value.trim(),
        pageCount: parseInt(pageCountInput.value) || null,
        authorId: bookAuthorIdInput.value.trim()
    };

    if (!bookData.title || !bookData.authorId) return;

    const mutation = `mutation ($book: BookInput!) {
        addBook(book: $book) {
            id
            title
            author { name }
        }
    }`;

    const result = await fetchGraphQL(mutation, { book: bookData });
    if (result.errors) {
        alert(`Error adding book: ${result.errors[0].message}`);
        return;
    }

    bookTitleInput.value = '';
    pageCountInput.value = '';
    bookAuthorIdInput.value = '';
    fetchAllBooks();
}

// Function to show the update form
function showUpdateBookForm(id, title, pageCount, authorId) {
    bookTitleInput.value = title;
    pageCountInput.value = pageCount || '';
    bookAuthorIdInput.value = authorId;

    window.currentBookId = id;
    console.log(`Updating book with ID: ${id}`);
}

async function updateBook() {
    const bookData = {
        title: bookTitleInput.value.trim(),
        pageCount: parseInt(pageCountInput.value) || null,
        authorId: bookAuthorIdInput.value.trim()
    };

    if (!bookData.title || !bookData.authorId || !window.currentBookId) return;

    const mutation = `mutation ($id: ID!, $book: BookInput!) {
        updateBook(id: $id, book: $book) {
            id
            title
            author { name }
        }
    }`;

    const result = await fetchGraphQL(mutation, { id: window.currentBookId, book: bookData });
    if (result.errors) {
        alert(`Error updating book: ${result.errors[0].message}`);
        return;
    }
    bookTitleInput.value = '';
    pageCountInput.value = '';
    bookAuthorIdInput.value = '';
    window.currentBookId = null;
    fetchAllBooks();
}

async function deleteBook(bookId) {
    if (!confirm('Are you sure you want to delete this book?')) return;

    const mutation = `mutation ($id: ID!) {
        deleteBook(id: $id)
    }`;

    const result = await fetchGraphQL(mutation, { id: bookId });
    if (result.errors) {
        alert(`Error deleting book: ${result.errors[0].message}`);
        return;
    }

    if (result.data.deleteBook) {
        alert('Book deleted successfully');
        fetchAllBooks(); // Refresh the book list
    }
}

// Rendering Functions
function renderAuthors(authors) {
    authorListTbody.innerHTML = authors
        .map(author => `
            <tr>
                <td>${author.id}</td>
                <td>${author.name}</td>
            </tr>
        `).join('');
}

function renderBooks(books) {
    bookListTbody.innerHTML = books
        .map(book => `
            <tr>
                <td>${book.id}</td>
                <td>${book.title}</td>
                <td>${book.pageCount || 'N/A'}</td>
                <td>${book.author.name}</td>
                <td>
                    <div class="action-buttons">
                        <button onclick="showUpdateBookForm('${book.id}', '${book.title}', ${book.pageCount || 0}, '${book.author.id}')">Update</button>
                        <button onclick="deleteBook('${book.id}')">Delete</button>
                    </div>
                </td>
            </tr>
        `).join('');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    fetchAllAuthors();
    fetchAllBooks();
});

authorSearchBtn.addEventListener('click', searchAuthor);
addAuthorBtn.addEventListener('click', addNewAuthor);
bookSearchBtn.addEventListener('click', searchBook);
addBookBtn.addEventListener('click', async () => {
    if (window.currentBookId) {
        await updateBook();
    } else {
        await addNewBook();
    }
});