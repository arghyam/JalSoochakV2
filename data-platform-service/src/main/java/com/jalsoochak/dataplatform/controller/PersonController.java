package com.jalsoochak.dataplatform.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jalsoochak.dataplatform.dto.request.CreatePersonRequestDTO;
import com.jalsoochak.dataplatform.dto.request.PersonFilterDTO;
import com.jalsoochak.dataplatform.dto.response.ApiResponseDTO;
import com.jalsoochak.dataplatform.dto.response.PersonResponseDTO;
import com.jalsoochak.dataplatform.service.PersonService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v2/person")
public class PersonController {
    
    private final PersonService personService;
    
    public PersonController(PersonService personService) {
        this.personService = personService;
    }

    /**
     * Get all persons with optional filters
     * 
     * @param filter Filter criteria (all fields optional)
     * @return List of persons matching the filters
     */
    @PostMapping("/search")
    public ResponseEntity<ApiResponseDTO<List<PersonResponseDTO>>> getAllPersons(
            @RequestBody(required = false) PersonFilterDTO filter) {
        
        ApiResponseDTO<List<PersonResponseDTO>> response = personService.getAllPersons(filter);
        return ResponseEntity.ok(response);
    }

    /**
     * Get person by ID
     * 
     * @param id Person ID
     * @return Person details
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<PersonResponseDTO>> getPersonById(@PathVariable Long id) {
        ApiResponseDTO<PersonResponseDTO> response = personService.getPersonById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Create a new person with role-based validation
     * 
     * @param request Person creation request
     * @param currentUserId Current user's ID from header (for authorization)
     * @return Created person details
     */
    @PostMapping("/create")
    public ResponseEntity<ApiResponseDTO<PersonResponseDTO>> createPerson(
            @Valid @RequestBody CreatePersonRequestDTO request) {
        ApiResponseDTO<PersonResponseDTO> response = personService.createPerson(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

}
