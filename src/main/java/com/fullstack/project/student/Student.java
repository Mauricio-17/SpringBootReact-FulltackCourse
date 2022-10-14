package com.fullstack.project.student;

import lombok.*;

@ToString
@Getter
@Setter
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
//@Data : This replaces all the anterior ones but requires final attributes
public class Student {

    private Long id;
    private String name;
    private String email;
    private Gender gender;
}
