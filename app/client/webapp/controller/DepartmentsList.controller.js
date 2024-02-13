sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
],
function (Controller, JSONModel, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("com.sap.client.controller.DepartmentsList", {
        onInit: function () {
        },

        onSelect: function(oEvent) {
            // Get the selected column item
            var oSelectedItem = oEvent.getSource();
            
            // Access the details of the selected column
            var sColumnId = oSelectedItem.getId();
            var oColumnData = oSelectedItem.getBindingContext("mainModel").getObject();
            
            // Handle the column details as needed
            // console.log("Selected column ID:", sColumnId);
            console.log("Column data:", oColumnData.Id);
            
            // Perform further processing, display in a dialog, etc.
            let Id = oColumnData.Id;
            let oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("DepartmentDetails", { Id: Id });
        },
        

        

    })
})