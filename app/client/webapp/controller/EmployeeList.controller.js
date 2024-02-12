sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
],
function (Controller, JSONModel, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("com.sap.client.controller.EmployeeList", {
        onInit: function () {
            this.allEmployeeDetails()

        },


        allEmployeeDetails:function () {
            var sUrl = this.getOwnerComponent().getModel("mainModel").getServiceUrl() + "Employees"
            var that = this;
            //Make a Call using AJAX
          
            $.ajax({
                type: "GET",
                url: sUrl,
                success: function (data){
                    var oModel=that.getView().getModel("EmployeeData");
                   oModel.setProperty("/EmployeeList",data.value)
                },
                error: function(){
                    console.log(error)
                }
            });
          },


        //   ----------------------

        onSearch(oEvent) {
			// build filter array
			const aFilter = [];
			const sQuery = oEvent.getParameter("query");
            console.log('sQuery',sQuery)
			if (sQuery) {
				aFilter.push(new Filter("ProductName", FilterOperator.Contains, sQuery));
			}

			// filter binding
			const oList = this.byId("invoiceList");
			const oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);
		},



        // ----------------------

        oneEmployeeDetail:function () {
            var sUrl = this.getOwnerComponent().getModel("mainModel").getServiceUrl() + "Employees/1"
            var that = this;
            //Make a Call using AJAX
          
            $.ajax({
                type: "GET",
                url: sUrl,
                success: function (data){
                //     var oModel=that.getView().getModel("EmployeeData");
                //    oModel.setProperty("/EmployeeList",data.value)
                    console.log(data);
                },
                error: function(){
                    console.log(error)
                }
            });
          },



        onSelect: function(oEvent) {
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
            oRouter.navTo("EmployeeDetails", { Id: Id});
        },

        // onCreate:function(){
        //     var sUrl = this.getOwnerComponent().getModel("mainModel").getServiceUrl() + "Employees"
        //     var that = this;
        //     //Make a Call using AJAX
          
        //     $.ajax({
        //         type: "GET",
        //         url: sUrl,
        //         success: function (data){
        //         //     var oModel=that.getView().getModel("EmployeeData");
        //         //    oModel.setProperty("/EmployeeList",data.value)
        //             console.log(data);
        //         },
        //         error: function(){
        //             console.log(error)
        //         }
        //     });
        // }

        
        onOpenAddDialog: function () {
            this.getView().byId("OpenDialog").open();
        },


        onCreate: function(e) {
            e.preventDefault();
            var sUrl = this.getOwnerComponent().getModel("mainModel").getServiceUrl() + "Employees";
            var that = this;

            var oModel = this.getView().getModel("EmployeeData");
            var newEmployee = oModel.getProperty("/NewEmployee");
            console.log('newEmployee',JSON.stringify(newEmployee))
        
            // Make a POST request using AJAX
            $.ajax({
                headers: {
                    "X-Requested-With": "XMLHttpsRequest"
                },
                type: "POST", // Change method to POST
                url: sUrl,
                contentType: "application/json", // Specify content type as JSON
                data: JSON.stringify(newEmployee), // Convert data to JSON string
                success: function(data) {
                    console.log("Data posted successfully:", data);
                },
                error: function(xhr, status, error) {
                    console.error("Error posting data:", error);
                }
            });
        }
        

    })
})