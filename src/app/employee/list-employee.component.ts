import { Component, OnInit } from '@angular/core';
import { IEmployee } from './iemployee';
import { EmployeeService } from './employee.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-employee',
  templateUrl: './list-employee.component.html',
  styleUrls: ['./list-employee.component.css']
})
export class ListEmployeeComponent implements OnInit {

  employees: IEmployee[];

  constructor(private _employeeService: EmployeeService,
    private _router: Router) { }

  ngOnInit(): void {
    this._employeeService.getEmployees().subscribe((response) => {
      this.employees = response;
    },
      (error) => {
        console.log(error);
      })
  }

  onEditClick(empID: number) {
    this._router.navigate(['/employees/edit', empID])
  }

}
