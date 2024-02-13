sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/odata/v4/ODataModel",
    "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (Controller, JSONModel, ODataModel,Filter,FilterOperator) {
    "use strict";

    return Controller.extend("com.sap.client.controller.DepartmentDetails", {
        onInit() {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("DepartmentDetails").attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched: function (oEvent) {
            var DepartmentId = oEvent.getParameter("arguments").Id; // Ensure parameter name matches
            this.getView().bindElement({
                path: `/Departments('${DepartmentId}')`,
                model: "mainModel",
                parameters: {
                    expand: "Employee"
                }
            });
        },

        onNavBack: function () {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("DepartmentsList");
        },

        onSearch: function(oEvent) {
            // build filter array
            const aFilters = [];
            const sQuery = oEvent.getParameter("query");
        
            if (sQuery) {
                // Create a filter for each property you want to search
                const oFirstNameFilter = new Filter("First_Name", FilterOperator.Contains, sQuery);
                const oLastNameFilter = new Filter("Last_Name", FilterOperator.Contains, sQuery);
                const oEmailFilter = new Filter("Email", FilterOperator.Contains, sQuery);
        
                // Combine filters with OR logic
                aFilters.push(new Filter({
                    filters: [oFirstNameFilter, oLastNameFilter, oEmailFilter],
                    and: false // Use OR logic
                }));
            }
        
            // filter binding
            const oList = this.byId("table0"); // Assuming your table's ID is "table0"
            const oBinding = oList.getBinding("items");
            oBinding.filter(aFilters);
        },
    });
});
