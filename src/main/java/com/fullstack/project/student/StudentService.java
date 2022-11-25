package com.fullstack.project.student;

import com.fullstack.project.student.exception.BadRequestException;
import com.fullstack.project.student.exception.StudentNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public List<Student> getAllStudents(){
//      throw new IllegalStateException("There was an DBMS error");
        return studentRepository.findAll();
    }

    public void addStudent(Student student) {
        // check if email is taken
        String email = student.getEmail();
        if (studentRepository.selectExistsEmail(email)){
            throw new BadRequestException(String.format("This email %s is already " +
                    "taken", email));
        }
        studentRepository.save(student);
    }

    public void removeStudent(Long idStudent) {
        // Check if student exist
        Student student = studentRepository.findById(idStudent).orElseThrow(() ->
                new StudentNotFoundException(String.format("Student with %d ID not found",
                        idStudent))
        );
        studentRepository.delete(student);
    }

    public void updateStudent(Student student, Long id) {
        Student foundStudent = studentRepository.findById(id).orElseThrow(() ->
                new StudentNotFoundException(String.format("Student with ID %d not found",
                        id)));
        foundStudent.setName(student.getName());
        foundStudent.setEmail(student.getEmail());
        foundStudent.setGender(student.getGender());
        studentRepository.save(foundStudent);
    }
}
