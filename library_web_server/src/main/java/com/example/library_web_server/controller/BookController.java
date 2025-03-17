package com.example.library_web_server.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.example.library_web_server.model.Author;
import com.example.library_web_server.model.Book;
import com.example.library_web_server.repository.AuthorRepository;
import com.example.library_web_server.repository.BookRepository;

import jakarta.persistence.EntityNotFoundException;

record BookInput (
	String title,
	int pageCount,
	int authorId
) {}

@Controller
@CrossOrigin(origins = "http://127.0.0.1:5500", allowedHeaders = "*", allowCredentials = "true")
public class BookController {
	
	@Autowired
	private BookRepository bookRepository; 
	
	@Autowired
	private AuthorRepository authorRepository;
	
	@QueryMapping(name="books")
	public List<Book> getBooks() {
		return bookRepository.findAll();
	}
	
	@QueryMapping(name="bookById")
	public Book getBookById(@Argument int id) {
		return bookRepository.findById(id).orElseThrow(
			() -> new EntityNotFoundException("## ERROR! Book with id " + id + " doesn't exist! ##")
		);
	}
	
	@MutationMapping
	public Book addBook(@Argument(name="book") BookInput bookInput) {
		Author author = authorRepository.findById(bookInput.authorId()).orElseThrow(
			() -> new IllegalArgumentException("## ERROR! Author with id " + bookInput.authorId() + " doesn't exist! ##")
		);
		Book book = new Book(0, bookInput.title(), bookInput.pageCount(), author);
		return bookRepository.save(book);
	}
	
	@MutationMapping
	public Book updateBook(@Argument int id, @Argument(name="book") BookInput bookInput) {
		Book prevBook = bookRepository.findById(id).orElse(null);
		if (prevBook == null) {
			throw new EntityNotFoundException("## ERROR! Book with id " + id + " doesn't exist! ##");
		}
		Author author = authorRepository.findById(bookInput.authorId()).orElse(null);
		if (author == null) {
			throw new IllegalArgumentException("## ERROR! Author with id " + bookInput.authorId() + " doesn't exist! ##");
		}
		Book newBook = new Book(id, bookInput.title(), bookInput.pageCount() > 0 ? bookInput.pageCount() : prevBook.getPageCount(), author);
		return bookRepository.save(newBook);
	}
	
	@MutationMapping
	public boolean deleteBook(@Argument int id) {
		Book book = bookRepository.findById(id).orElse(null);
		if (book  != null) {
			bookRepository.deleteById(id);
			return true;
		}
		return false;
	}
	
}
