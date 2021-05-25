using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Model.Stock;

namespace CargoFlash.Cargo.DataService.Stock
{
    #region StockValidateService interface Description
    /*
	*****************************************************************************
	interface Name:		IStockValidateService      
	Purpose:		    This interface used to handle StockValidateService
	Company:		    CargoFlash Infotech Pvt Ltd.
	Author:			    Parvez KHan
	Created On:		    7 NOV 2014
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [ServiceContract]
    public interface IStockValidateService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetStockValidateRecord?recid={RecordID}&UserID={UserID}")]
        StockValidate GetStockValidateRecord(string recordID, string UserID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveStockValidate")]
        List<string> SaveStockValidate(List<StockValidate> RateSurchargeSPHC);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateStockValidate")]
        List<string> UpdateStockValidate(List<StockValidate> RateSurchargeSPHC);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteStockValidate")]
        List<string> DeleteStockValidate(List<string> ids);
    }
}
