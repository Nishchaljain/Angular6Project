import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl, FormArray } from '@angular/forms';
import { CustomValidators } from '../shared/custom.validator';
@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {

  employeeForm: FormGroup;

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
    },
    'skillName': {
      'required': 'Skill Name is required.',
    },
    'experienceInYears': {
      'required': 'Experience is required.',
    },
    'proficiency': {
      'required': 'Proficiency is required.',
    },
  };

  // This object will hold the messages to be displayed to the user
  // Notice, each key in this object has the same name as the
  // corresponding form control
  formErrors = {
    'fullName': '',
    'email': '',
    'confirmEmail': '',
    'emailGroup': '',
    'phone': '',
    'skillName': '',
    'experienceInYears': '',
    'proficiency': ''
  };


  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.employeeForm = this.fb.group({

      fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
      contactPreference: ['email'],
      emailGroup: this.fb.group({
        email: ['', [Validators.required, CustomValidators.emailDomainValidator('dell.com')]],
        confirmEmail: ['', Validators.required],
      }, { validator: matchEmail }),

      phone: [''],
      skills: this.fb.group({

        skillName: ['', Validators.required],
        experienceInYears: ['', Validators.required],
        proficiency: ['', Validators.required]
      })
    });

    this.employeeForm.get('contactPreference').valueChanges.subscribe((value: string) => {
      this.onContactPreferenceChange(value);
    })

    this.employeeForm.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.employeeForm);
    })

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
    console.log(this.employeeForm.value)
  }

  onLoadDataClick() {

    const formArray1 = this.fb.array([
      new FormControl('Nish', Validators.required),
      new FormControl('IT', Validators.required),
      new FormControl('', Validators.required),
    ]);

    const formGroup = this.fb.group([
      new FormControl('Nish', Validators.required),
      new FormControl('IT', Validators.required),
      new FormControl('', Validators.required),
    ]);

    console.log(formArray1);
    console.log(formGroup);



  }

  logValidationErrors(group: FormGroup = this.employeeForm): void {
    Object.keys(group.controls).forEach((control: string) => {
      const abstractControl = group.get(control);
      this.formErrors[control] = '';
      if (abstractControl && abstractControl.invalid &&
        (abstractControl.touched || abstractControl.dirty)) {

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

  if (email.value === confirmEmail.value || confirmEmail.pristine) {
    return null;
  }
  else {
    return { 'emailMismatch': true };
  }
}