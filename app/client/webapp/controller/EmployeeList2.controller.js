sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Fragment) {
        "use strict";

        return Controller.extend("com.sap.client.controller.EmployeeList", {
            _oTable: null, // Define _oTable property
            onInit: function () {
                this._oTable = this.getView().byId("table0"); // Initialize _oTable with table reference

            },
            // onAddEmployee: function () {
            //     var oDialog = new Dialog({
            //         title: "Add Employee",
            //         beginButton: new Button({
            //             text: "Add",
            //             press: function () {
            //                 // Handle registration logic

            //                 let empId = sap.ui.getCore().byId("empId").getValue()
            //                 let empFName = sap.ui.getCore().byId("empFirstName").getValue()
            //                 let empLName = sap.ui.getCore().byId("empLastName").getValue()
            //                 let empPhno = sap.ui.getCore().byId("empPhoneNumber").getValue()
            //                 let empDep = sap.ui.getCore().byId("empDepartmentId").getValue()

            //                 let oEmployee = {
            //                     "Employee_Id": empId,
            //                     "Employee_First_Name": empFName,
            //                     "Employee_Last_Name": empLName,
            //                     "Employee_Full_Name": empFName + " " + empLName,
            //                     "Employee_Phone_Number": empPhno,
            //                     "Employee_Department_ID": empDep
            //                 };

            //                 //pending for post Data to the OData Service
            //                 console.log(oEmployee);
            //                 jQuery.ajax({
            //                     method: "POST",
            //                     url: "https://port4004-workspaces-ws-wt95r.us10.trial.applicationstudio.cloud.sap/odata/v4/company/Employees",
            //                     contentType: "application/json",
            //                     data: JSON.stringify(oEmployee),
            //                     success: function () {
            //                         console.log('Data Saved in to Odata Service');
            //                     },
            //                     error: function (error) {
            //                         console.log(error);
            //                     }

            //                 })



            //                 oDialog.close();
            //             }
            //         }),
            //     });
            // }



            // onOpenDialog: function (oInvoice) {
            //     console.log("Opening")
            //     // console.log("oInvoice", oInvoice);
            //     // create dialog lazily
            //     this.pDialog ??= this.loadFragment({
            //       name: "client.view.EmployeeForm",
            //     });
            //     this.pDialog.then((oDialog) => {
            //       // Construct a string containing multiple properties of the oInvoice object
            //     //   var text =
            //     //     "ProductName: " +
            //     //     oInvoice.ProductName +
            //     //     "\n" +
            //     //     "Quantity: " +
            //     //     oInvoice.Quantity +
            //     //     "\n" +
            //     //     "ExtendedPrice: " +
            //     //     oInvoice.ExtendedPrice +
            //     //     "\n" +
            //     //     "ShipperName: " +
            //     //     oInvoice.ShipperName +
            //     //     "\n" +
            //     //     "ShippedDate: " +
            //     //     oInvoice.ShippedDate +
            //     //     "\n" +
            //     //     "Status: " +
            //     //     oInvoice.Status;

            //       // Set the value of the Text control
            //     //   oDialog.getContent()[0].setText(text);
            //       oDialog.open();
            //     });
            //   },

            onOpenAddDialog: function () {
                this.getView().byId("OpenDialog").open();
            },

            onCancelDialog: function (oEvent) {
                oEvent.getSource().getParent().close();
            },

            // onCreate: function () {
                // var Id = this.getView().byId("Id").getValue();
                // if (Id !== "") {
                //     const oList = this._oTable;
                //     const oBinding = oList.getBinding("items");
                //     const oContext = oBinding.create({
                //         "Id": Id,
                //         "First_Name": this.getView().byId("FirstName").getValue(),
                //         "Last_Name": this.getView().byId("LastName").getValue(),
                //         "Phone_Number": this.getView().byId("MobileNumber").getValue(),
                //         "Email": this.getView().byId("Email").getValue(),
                //         "Department": this.getView().byId("Department").getValue(),
                //     });
                //     // oContext.created().then(()=>{
                //     //         // that._focusItem(oList, oContext);
                //     //         console.log("success")
                //     //         this.getView().byId("OpenDialog").close();
                //     // });
                //     // After creating the entity, call submitChanges()
                //     oBinding.submitChanges().then(() => {
                //         // Success callback: Close the dialog
                //         this.getView().byId("OpenDialog").close();
                //     }, (error) => {
                //         // Error callback: Handle any errors
                //         console.error("Error occurred during entity creation:", error);
                //     });

                // } else {
                //     MessageToast.show("So cannot be blank");
                // }
            //     let Employee = {
            //         Id: this.getView().byId("Id").getValue(),
            //         First_Name: this.getView().byId("FirstName").getValue(),
            //         Last_Name: this.getView().byId("LastName").getValue(),
            //         Phone_Number: this.getView().byId("MobileNumber").getValue(),
            //         Email: this.getView().byId("Email").getValue(),
            //         Department: this.getView().byId("Department").getValue(),
            //     }

            //     jQuery.ajax({
            //         method: "POST",
            //         url: "https://port4004-workspaces-ws-q5tzf.us10.trial.applicationstudio.cloud.sap/odata/v4/company/Employees",
            //         contentType: "application/json",
            //         data: JSON.stringify(Employee),
            //         success: function () {
            //             console.log('Data Saved in to Odata Service');
            //         },
            //         error: function (error) {
            //             console.log(error);
            //         }

            //     })

            //     //    console.log('Employee',Employee)

            // },

            onCreate: function () {
                
                // Get employee data from input fields
                let Employee = {
                    Id: this.byId("Id").getValue(),
                    First_Name: this.byId("FirstName").getValue(),
                    Last_Name: this.byId("LastName").getValue(),
                    Phone_Number: this.byId("MobileNumber").getValue(),
                    Email: this.byId("Email").getValue(),
                    Department: this.byId("Department").getValue(),
                };
            console.log('Employee',Employee)
            console.log(JSON.stringify(Employee))
                // Send POST request
                jQuery.ajax({
                    method: "POST",
                    // url: "https://port4004-workspaces-ws-q5tzf.us10.trial.applicationstudio.cloud.sap/odata/v4/company/Employees",
                    url: "http://localhost:4004/odata/v4/company/Employees",
                    headers: {
                        "X-Requested-With": "XMLHttpsRequest"
                    },
                    contentType: "application/json",
                    data: JSON.stringify(Employee),
                    success: function () {
                        console.log('Data saved into OData service.');
                    },
                    error: function (error) {
                        console.error('Error occurred:', error);
                    }
                });
            }
            



        });
    })
