// namespace cap_assignment1;

// entity Employees {
//  key Id:String;
//   First_Name:String;
//   Last_Name:String;
//   Phone_Number:String;
//   Email:String;
//   Department:String;
//   DepartmentName:Association to many Departments on Depart.Name = $self.Department;
// }

// entity Departments {
// key Id:String;
// Name:String;
// HOD:String;
// Employee :Association to many Employees on Employee.Department = $self.Name;
// }

namespace cap_assignment1;

entity Employees {
    key Id : String;
    First_Name : String;
    Last_Name : String;
    Phone_Number : String;
    Email : String;
    Department : String;
    DepartmentName : Association to many Departments on DepartmentName.Id = $self.Department;
}

entity Departments {
    key Id : String;
    Name : String;
    HOD : String;
    Employee : Association to many Employees on Employee.Department = $self.Id;
}
