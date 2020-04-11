import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {

  employeeForm: FormGroup;
  constructor() { }

  ngOnInit(): void {
    this.employeeForm = new FormGroup({

      fullName: new FormControl(),
      email: new FormControl(),

      skills: new FormGroup({

        skillName: new FormControl(),
        experienceInYears: new FormControl(),
        proficiency: new FormControl()

      })

    });
  }

  onSubmit(): void {
    console.log(this.employeeForm.value)
  }

  onLoadDataClick(): void {

    this.employeeForm.patchValue({

      fullName: 'Nishchal jain',
      email: 'nishchaljain786@gmail.com',
      skills: {
        skillName: 'C#',
        experienceInYears: 7,
        proficiency: 'beginner'
      }

    });
  }

}
