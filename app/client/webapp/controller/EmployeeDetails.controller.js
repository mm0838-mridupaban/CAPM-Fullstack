sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function(Controller) {
      "use strict";
  
      return Controller.extend("com.sap.client.controller.EmployeeDetails", {
        onInit: function() {
            const oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("EmployeeDetails").attachPatternMatched(this.onObjectMatched, this);
        },
 
        onObjectMatched(oEvent) {
			let Id= window.decodeURIComponent(oEvent.getParameter("arguments").Id);	
            this.oneEmployeeDetail(Id);
		},

        oneEmployeeDetail:function (Id) {
            var sUrl = this.getOwnerComponent().getModel("mainModel").getServiceUrl() + `Employees/${Id}`
            console.log('sUrl',sUrl)
            var that = this;
            //Make a Call using AJAX
          
            $.ajax({
                type: "GET",
                url: sUrl,
                success: function (data){
                    var oModel=that.getView().getModel("EmployeeData");
                   oModel.setProperty("/EmployeeDetail",data)
                    console.log(data);
                },
                error: function(){
                    console.log(error)
                }
            });
          },
      });
    }
  );
  