package com.example.library_web_server.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.example.library_web_server.model.Author;
import com.example.library_web_server.repository.AuthorRepository;

import jakarta.persistence.EntityNotFoundException;

record AuthorInput (
	String name
) {}

@Controller
@CrossOrigin(origins = "http://127.0.0.1:5500", allowedHeaders = "*", allowCredentials = "true")
public class AuthorController {
	
	@Autowired
	private AuthorRepository authorRepository;
	
	@QueryMapping(name="authors")
	public List<Author> getAuthors() {
		return authorRepository.findAll();
	}
	
	@QueryMapping(name="authorById")
	public Author getAuthorById(@Argument int id) {
		return authorRepository.findById(id).orElseThrow(
			() -> new EntityNotFoundException("## ERROR! Author with id " + id + " doesn't exist! ##")
		);
	}
	
	@MutationMapping
	public Author addAuthor(@Argument(name="author") AuthorInput authorInput) {
		return authorRepository.save(new Author(0, authorInput.name(), null));
	}
	
}
