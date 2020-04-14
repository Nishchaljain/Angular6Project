import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl, FormArray } from '@angular/forms';
import { CustomValidators } from '../shared/custom.validator';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from './employee.service';
import { IEmployee } from './iemployee';
import { ISkill } from './iskill';
@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {

  employeeForm: FormGroup;
  employee: IEmployee;
  pageTitle: string;

  // This object contains all the validation messages for this form

  validationMessages = {
    'fullName': {
      'required': 'Full Name is required.',
      'minlength': 'Full Name must be greater than 2 characters.',
      'maxlength': 'Full Name must be less than 10 characters.'
    },
    'email': {
      'required': 'Email is required.',
      'emailDomain': 'Email domain should be dell.com'
    },
    'confirmEmail': {
      'required': 'Confirm Email is required.',

    },
    'emailGroup': {
      'emailMismatch': 'Email and Confirm Email do not match.',

    },
    'phone': {
      'required': 'Phone is required.'
    }
  };

  // This object will hold the messages to be displayed to the user
  // Notice, each key in this object has the same name as the
  // corresponding form control
  formErrors = {
    'fullName': '',
    'email': '',
    'confirmEmail': '',
    'emailGroup': '',
    'phone': ''
  };


  constructor(private fb: FormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _employeeService: EmployeeService,
    private _route: Router) { }

  ngOnInit(): void {
    this.employeeForm = this.fb.group({

      fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
      contactPreference: ['email'],
      emailGroup: this.fb.group({
        email: ['', [Validators.required, CustomValidators.emailDomainValidator('dell.com')]],
        confirmEmail: ['', Validators.required],
      }, { validator: matchEmail }),

      phone: [''],
      skills: this.fb.array([
        this.addSkillsFormGroup()
      ])
    });



    this.employeeForm.get('contactPreference').valueChanges.subscribe((value: string) => {
      this.onContactPreferenceChange(value);
    })

    this.employeeForm.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.employeeForm);
    })

    const employeeID = +this._activatedRoute.snapshot.params['id'];

    if (employeeID) {
      this.pageTitle = 'Edit Employee';
      this.getEmployeeByID(employeeID);
    }
    else {
      this.pageTitle = 'Create Employee';
      this.employee = {
        id: null,
        fullName: '',
        contactPreference: '',
        email: '',
        phone: null,
        skills: []

      };
    }

  }

  getEmployeeByID(employeeID: number) {
    this._employeeService.getEmployeeById(employeeID).subscribe(
      (employee: IEmployee) => {
        this.editEmployee(employee);
        this.employee = employee;
      },
      (error: any) => {
        console.log(error);
      })
  }

  editEmployee(employee: IEmployee) {
    this.employeeForm.patchValue({
      fullName: employee.fullName,
      contactPreference: employee.contactPreference,
      emailGroup: {
        email: employee.email,
        confirmEmail: employee.email
      },
      phone: employee.phone
    });

    this.employeeForm.setControl('skills', this.setExistingSkills(employee.skills));
  }

  setExistingSkills(skillSets: ISkill[]): FormArray {

    const formArray = new FormArray([]);

    skillSets.forEach(s => {
      formArray.push(this.fb.group({
        skillName: s.skillName,
        experienceInYears: s.experienceInYears,
        proficiency: s.proficiency
      }));
    })

    return formArray;
  }

  removeSkillButtonClick(index: number): void {
    const skillFormGroup = <FormArray>this.employeeForm.get('skills');
    skillFormGroup.removeAt(index);
    skillFormGroup.markAsDirty();
    skillFormGroup.markAsTouched();
  }

  addSkillButtonClick(): void {
    (<FormArray>this.employeeForm.get('skills')).push(this.addSkillsFormGroup());
  }

  addSkillsFormGroup(): FormGroup {

    return this.fb.group({

      skillName: ['', Validators.required],
      experienceInYears: ['', Validators.required],
      proficiency: ['', Validators.required]
    });

  }

  onContactPreferenceChange(selectedValue: string) {
    const phoneControl = this.employeeForm.get('phone');
    if (selectedValue === 'phone') {
      phoneControl.setValidators(Validators.required);
    }
    else {
      phoneControl.clearValidators();
    }
    phoneControl.updateValueAndValidity();
  }

  onSubmit(): void {
    this.mapFormValuesToEmployeeModel();
    if (this.employee.id) {
      this._employeeService.updateEmployee(this.employee).subscribe(
        () => {
          this._route.navigate(['employees'])
        },
        (error: any) => {
          console.log(error);
        });
    }
    else {
      this._employeeService.insertEmployee(this.employee).subscribe(
        () => {
          this._route.navigate(['employees'])
        },
        (error: any) => {
          console.log(error);
        });
    }

  }

  mapFormValuesToEmployeeModel() {
    this.employee.fullName = this.employeeForm.value.fullName;
    this.employee.contactPreference = this.employeeForm.value.contactPreference;
    this.employee.email = this.employeeForm.value.emailGroup.email;
    this.employee.phone = this.employeeForm.value.phone;
    this.employee.skills = this.employeeForm.value.skills;
  }

  onLoadDataClick() {

  }



  logValidationErrors(group: FormGroup = this.employeeForm): void {
    Object.keys(group.controls).forEach((control: string) => {
      const abstractControl = group.get(control);
      this.formErrors[control] = '';
      if (abstractControl && abstractControl.invalid &&
        (abstractControl.touched || abstractControl.dirty || abstractControl.value !== '')) {

        const messages = this.validationMessages[control];

        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            this.formErrors[control] += messages[errorKey] + ' ';
          }
        }
      }
      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
      }

    })
  }
}



function matchEmail(group: AbstractControl): { [key: string]: any } | null {
  const email = group.get('email');
  const confirmEmail = group.get('confirmEmail');

  if (email.value === confirmEmail.value || (confirmEmail.pristine && confirmEmail.value === '')) {
    return null;
  }
  else {
    return { 'emailMismatch': true };
  }
}