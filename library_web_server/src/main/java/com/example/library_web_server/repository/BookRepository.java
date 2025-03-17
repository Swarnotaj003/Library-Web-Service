package com.example.library_web_server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.library_web_server.model.Book;

@Repository
public interface BookRepository extends JpaRepository<Book, Integer> {
	
}
