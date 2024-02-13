sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function (Controller) {
        "use strict";

        return Controller.extend("com.sap.client.controller.EmployeeDetails", {
            onInit: function () {
                this.onLoad();
            },

            onLoad: function () {
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.getRoute("EmployeeDetails").attachPatternMatched(this.onObjectMatched, this);
            },

            onObjectMatched(oEvent) {
                let Id = window.decodeURIComponent(oEvent.getParameter("arguments").Id);
                this.oneEmployeeDetail(Id);
            },
            
            onNavBack: function () {
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("DepartmentsList");
            },

            oneEmployeeDetail: function (Id) {
                var sUrl = this.getOwnerComponent().getModel("mainModel").getServiceUrl() + `Employees/${Id}`
                console.log('sUrl', sUrl)
                var that = this;
                //Make a Call using AJAX

                $.ajax({
                    type: "GET",
                    url: sUrl,
                    success: function (data) {
                        var oModel = that.getView().getModel("EmployeeData");
                        oModel.setProperty("/EmployeeDetail", data)
                        oModel.setProperty("/OriginalEmployeeDetail", data);
                        console.log(data);
                    },
                    error: function () {
                        console.log(error)
                    }
                });
            },

            onOpenAddDialog: function () {
                this.getView().byId("OpenDialog").open();
            },
            // onCancelDialog: function (oEvent) {
            //     oEvent.getSource().getParent().close();
            // },
            // onCancelDialog: function () {
            //     this.getView().byId("OpenDialog").close();
            //     this.onObjectMatched()
            // },

            onUpdate: function (e) {
                var sUrl = this.getOwnerComponent().getModel("mainModel").getServiceUrl() + "Employees";
                var that = this;

                var oModel = this.getView().getModel("EmployeeData");
                var updatedEmployee = oModel.getProperty("/EmployeeDetail");
                console.log('updatedEmployee', JSON.stringify(updatedEmployee));

                // Make a PUT request using AJAX
                $.ajax({
                    headers: {
                        "X-Requested-With": "XMLHttpsRequest"
                    },
                    type: "PUT", // Change method to PUT
                    url: sUrl + "/" + updatedEmployee.Id, // Include the ID of the updated employee in the URL
                    contentType: "application/json", // Specify content type as JSON
                    data: JSON.stringify(updatedEmployee), // Convert data to JSON string
                    success: function (data) {
                        that.onCancelDialog();
                        that.oneEmployeeDetail(updatedEmployee.Id);
                        console.log("Data updated successfully:", data);
                    },
                    error: function (xhr, status, error) {
                        console.error("Error updating data:", error);
                    }
                });
            },

            onCancelDialog: async function () {
                // Get the original employee detail data from the model
                // var oModel = this.getView().getModel("EmployeeData");
                // var originalEmployeeDetail = oModel.getProperty("/OriginalEmployeeDetail");

                // console.log('originalEmployeeDetail',originalEmployeeDetail)

                // // Reset the employee detail data to the original values
                // await oModel.setProperty("/EmployeeDetail", originalEmployeeDetail);

                // Close the dialog
                await this.onLoad();
                this.getView().byId("OpenDialog").close();
            },



        });
    }
);
