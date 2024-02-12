using { cap_assignment1 as db } from '../db/data-model';

// service CatalogService@(path:'/CatalogService')
//     {

//     entity SalesOrder as projection on db.SalesOrders
//     }
service Company {
     entity Employees as projection on db.Employees;
}