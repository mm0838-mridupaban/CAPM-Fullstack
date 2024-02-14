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

                var oMessageTemplate = new MessageItem({
                    type: '{type}',
                    title: '{title}',
                    activeTitle: "{active}",
                    description: '{description}',
                    subtitle: '{subtitle}',
                    counter: '{counter}',

                });


                oMessagePopover = new MessagePopover({
                    items: {
                        path: '/',
                        template: oMessageTemplate
                    },
                    activeTitlePress: function () {
                        MessageToast.show('Active title is pressed');
                    }
                });


                let aMockMessages = []
                var errorModel = new JSONModel();
                errorModel.setData(aMockMessages);
                this.getView().setModel(errorModel);

                this.byId("messagePopoverBtn").addDependent(oMessagePopover);

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


            //   ----------------------

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




            // ----------------------



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


            onOpenAddDialog: function () {
                this.getView().byId("OpenDialog").open();
            },
            // onCancelDialog: function (oEvent) {
            //     oEvent.getSource().getParent().close();
            // },
            onCancelDialog: function () {
                this.getView().byId("OpenDialog").close();
            },

            onCreate: function (e) {

                // --------------------Validation-------------------------------
                let oModel = this.getView().getModel("EmployeeData");
                let newEmployee = oModel.getProperty("/NewEmployee");


                // Mobile Number Validation
                if (!isValidMobileNumber(newEmployee.Phone_Number)) {
                    let sMobileNumber = "Invalid mobile number. Please enter a valid mobile number.";
                    this.addMessageToPopover('Warning', 'Validation Error', true, sMobileNumber, 'Subtitle', 1)
                    return;
                }

                // Email ID Validation
                if (!isValidEmail(newEmployee.Email)) {
                    let sEmailVali = "Invalid Email. Please enter a valid Email.";
                    this.addMessageToPopover('Warning', 'Email Validation Error', true, sEmailVali, 'close it', 1)
                    return;
                }

                // Employee ID and Last Name Check
                if (!newEmployee.Id || !newEmployee.Last_Name) {
                    let UserDetails = "Employee Id and Emplyee Last Name is Required. Please enter a valid Details.";
                    this.addMessageToPopover('Warning', ' Invalid Credentials ', true, UserDetails, 'close it', 1)
                    return;
                }

                function isValidMobileNumber(mobileNumber) {
                    const mobileRegex = /^\d{10}$/;
                    return mobileRegex.test(mobileNumber);
                }

                function isValidEmail(email) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    return emailRegex.test(email);
                }

                // -------------------------------------------------------------
                var sUrl = this.getOwnerComponent().getModel("mainModel").getServiceUrl() + "Employees";
                var that = this;

                console.log('newEmployee', JSON.stringify(newEmployee))

                // Make a POST request using AJAX
                $.ajax({
                    headers: {
                        "X-Requested-With": "XMLHttpsRequest"
                    },
                    type: "POST", // Change method to POST
                    url: sUrl,
                    contentType: "application/json", // Specify content type as JSON
                    data: JSON.stringify(newEmployee), // Convert data to JSON string
                    success: function (data) {
                        that.onCancelDialog();
                        that.allEmployeeDetails();
                        console.log("Data posted successfully:", data);
                    },
                    error: function (xhr, status, error) {
                        console.error("Error posting data:", error);
                    }
                });
            },

            // ----------For Department suggestion

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

            // -----------------------Mesaage Popover

            addMessageToPopover: function (type, title, active, description, subtitle, counter) {
                var oMessageModel = this.getView().getModel();
                var aMessages = oMessageModel.oData;
                if (!Array.isArray(aMessages)) {
                    aMessages = []
                }
                console.log(aMessages);
                var oNewMessage = {
                    type: type,
                    title: title,
                    active: active,
                    description: description,
                    subtitle: subtitle,
                    counter: counter
                };

                aMessages.push(oNewMessage);
                oMessageModel.setData(aMessages)
                console.log(this.getView().getModel().oData);


                if (!oMessagePopover.isOpen()) {
                    oMessagePopover.toggle(this.byId("messagePopoverBtn"));
                }

            },



            buttonTypeFormatter: function () {
                var sHighestSeverityIcon;
                var aMessages = this.getView().getModel().oData;
                console.log(aMessages);
                aMessages.forEach(function (sMessage) {
                    switch (sMessage.type) {
                        case "Error":
                            sHighestSeverityIcon = "Negative";
                            break;
                        case "Warning":
                            sHighestSeverityIcon = sHighestSeverityIcon !== "Negative" ? "Critical" : sHighestSeverityIcon;
                            break;
                        case "Success":
                            sHighestSeverityIcon = sHighestSeverityIcon !== "Negative" && sHighestSeverityIcon !== "Critical" ? "Success" : sHighestSeverityIcon;
                            break;
                        default:
                            sHighestSeverityIcon = !sHighestSeverityIcon ? "Neutral" : sHighestSeverityIcon;
                            break;
                    }
                });

                return sHighestSeverityIcon;
            },

            // Display the number of messages with the highest severity
            highestSeverityMessages: function () {
                var sHighestSeverityIconType = this.buttonTypeFormatter();
                var sHighestSeverityMessageType;

                switch (sHighestSeverityIconType) {
                    case "Negative":
                        sHighestSeverityMessageType = "Error";
                        break;
                    case "Critical":
                        sHighestSeverityMessageType = "Warning";
                        break;
                    case "Success":
                        sHighestSeverityMessageType = "Success";
                        break;
                    default:
                        sHighestSeverityMessageType = !sHighestSeverityMessageType ? "Information" : sHighestSeverityMessageType;
                        break;
                }

                return this.getView().getModel().oData.reduce(function (iNumberOfMessages, oMessageItem) {
                    return oMessageItem.type === sHighestSeverityMessageType ? ++iNumberOfMessages : iNumberOfMessages;
                }, 0);
            },

            // Set the button icon according to the message with the highest severity
            buttonIconFormatter: function () {
                var sIcon;
                var aMessages = this.getView().getModel().oData;;
                console.log(aMessages);
                aMessages.forEach(function (sMessage) {
                    switch (sMessage.type) {
                        case "Error":
                            sIcon = "sap-icon://error";
                            break;
                        case "Warning":
                            sIcon = sIcon !== "sap-icon://error" ? "sap-icon://alert" : sIcon;
                            break;
                        case "Success":
                            sIcon = sIcon !== "sap-icon://error" && sIcon !== "sap-icon://alert" ? "sap-icon://sys-enter-2" : sIcon;
                            break;
                        default:
                            sIcon = !sIcon ? "sap-icon://information" : sIcon;
                            break;
                    }
                });

                return sIcon;
            },

            handleMessagePopoverPress: function (oEvent) {
                oMessagePopover.toggle(oEvent.getSource());
            }
        })
    })