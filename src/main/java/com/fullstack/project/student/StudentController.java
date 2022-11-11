package com.fullstack.project.student;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/v1/student")
@AllArgsConstructor
public class StudentController {

    private final StudentService studentService;
    @GetMapping
    public List<Student> getAllStudents(){
        return studentService.getAllStudents();
    }

    @PostMapping
    public void addStudent(@Valid @RequestBody Student student){
        studentService.addStudent(student);
    }


    @DeleteMapping("/{id}")
    public void removeStudent(@PathVariable(name = "id") Long idStudent){
        System.out.println(idStudent);
        studentService.removeStudent(idStudent);
    }
}
