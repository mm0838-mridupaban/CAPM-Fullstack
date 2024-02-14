sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox",
    'sap/m/MessagePopover',
    'sap/m/MessageItem',
    'sap/m/MessageToast',
],
    function (Controller, JSONModel, Filter, FilterOperator, Fragment, MessageBox, MessagePopover, MessageItem, MessageToast) {
        "use strict";
        var oMessagePopover;

        return Controller.extend("com.sap.client.controller.EmployeeList", {

            onInit: function () {
                this.allEmployeeDetails();
            },


            allEmployeeDetails: function () {
                var sUrl = this.getOwnerComponent().getModel("mainModel").getServiceUrl() + "Employees"
                var that = this;
                //Make a Call using AJAX

                $.ajax({
                    type: "GET",
                    url: sUrl,
                    success: function (data) {
                        var oModel = that.getView().getModel("EmployeeData");
                        oModel.setProperty("/EmployeeList", data.value)
                    },
                    error: function () {
                        console.log(error)
                    }
                });
            },


            //   ----------------on Search---------------------------------

            onSearch: function (oEvent) {
                // build filter array
                const aFilters = [];
                const sQuery = oEvent.getParameter("query");

                if (sQuery) {
                    // Create a filter for each property you want to search
                    const oFirstNameFilter = new Filter("First_Name", FilterOperator.Contains, sQuery);
                    const oLastNameFilter = new Filter("Last_Name", FilterOperator.Contains, sQuery);
                    const oDepartmentFilter = new Filter("Department", FilterOperator.Contains, sQuery);

                    // Combine filters with OR logic
                    aFilters.push(new Filter({
                        filters: [oFirstNameFilter, oLastNameFilter, oDepartmentFilter],
                        and: false // Use OR logic
                    }));
                }

                // filter binding
                const oList = this.byId("table0"); // Assuming your table's ID is "table0"
                const oBinding = oList.getBinding("items");
                oBinding.filter(aFilters);
            },




            // -----------on Selecting, Navigating to  Employee Details-----------

            onSelect: function (oEvent) {
                // Get the selected column item
                var oSelectedItem = oEvent.getSource();

                // Access the details of the selected column
                var sColumnId = oSelectedItem.getId();
                var oColumnData = oSelectedItem.getBindingContext("EmployeeData").getObject();

                // Handle the column details as needed
                // console.log("Selected column ID:", sColumnId);
                console.log("Column data:", oColumnData.Id);
                // Perform further processing, display in a dialog, etc.
                let Id = oColumnData.Id
                let oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("EmployeeDetails", { Id: Id });
            },

// -----------------------Opening & Closing the Dialog Box (The Signup Form)-------------------------

            onOpenAddDialog: function () {
                this.getView().byId("OpenDialog").open();
            },
            // onCancelDialog: function (oEvent) {
            //     oEvent.getSource().getParent().close();
            // },
            onCancelDialog: function () {
                this.getView().byId("OpenDialog").close();
            },

// ------------------------------on Clicking ADD, creating New Employee----------------

            onCreate: function () {
                let oModel = this.getView().getModel("EmployeeData");
                let newEmployee = oModel.getProperty("/NewEmployee");

                var sUrl = this.getOwnerComponent().getModel("mainModel").getServiceUrl() + "Employees";
                var that = this;


                // Sending data to backend-------------------------
                // $.ajax({
                //     headers: {
                //         "X-Requested-With": "XMLHttpsRequest"
                //     },
                //     type: "POST",
                //     url: sUrl,
                //     contentType: "application/json",
                //     data: JSON.stringify(newEmployee),
                //     success: function (data) {
                //         // Handle successful response
                //         console.log("Data posted successfully:", data);
                //         that.onCancelDialog();
                //         that.allEmployeeDetails();
                //     },
                //     error: function (xhr, status, error) {
                //         // Handle errors
                //         // MessageBox.error(xhr.status, xhr.statusText)
                //         MessageBox.error(`${xhr.status} ${xhr.statusText}`);
                //         console.error("typeof",typeof xhr.status,typeof xhr.statusText);
                //         console.error("Error posting data:", xhr.status, xhr.statusText,status);
                //         if (xhr.responseJSON && xhr.responseJSON.message) {
                //             console.error("Error message:", xhr.responseJSON.message);
                //         } else {
                //             console.error("Error details:", error);
                //         }
                //     }
                // });
                
            },

            // ----------For Department suggestion------------------------------------------

            onValueHelpRequest: function (oEvent) {
                var sInputValue = oEvent.getSource().getValue(),
                    oView = this.getView();
                console.log(sInputValue, oView.id);

                this.pDialog ??= this.loadFragment({
                    name: "com.sap.client.view.ValueHelpDialog",
                });
                this.pDialog.then((oDialog) => {
                    oDialog.open();

                });

                if (!this._pValueHelpDialog) {
                    this._pValueHelpDialog = Fragment.load({
                        id: oView.getId(),
                        name: "com.sap.client.view.ValueHelpDialog",
                        controller: this
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        return oDialog;
                    });
                }
                this._pValueHelpDialog.then(function (oDialog) {
                    // Create a filter for the binding
                    oDialog.getBinding("items").filter([new Filter("Name", FilterOperator.Contains, sInputValue)]);
                    // Open ValueHelpDialog filtered by the input's value
                    oDialog.open(sInputValue);
                });
            },

            onValueHelpSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter("Name", FilterOperator.Contains, sValue);

                oEvent.getSource().getBinding("items").filter([oFilter]);
            },

            onValueHelpClose: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                console.log('oSelectedItem', oSelectedItem.getTitle())
                oEvent.getSource().getBinding("items").filter([]);

                if (!oSelectedItem) {
                    return;
                }

                this.byId("productInput").setValue(oSelectedItem.getTitle());
            },

                // --------------Message Box Trial1-----------------------------

           



            

           
            



            handleMessagePopoverPress: function (oEvent) {
                oMessagePopover.toggle(oEvent.getSource());
            }
        })
    })