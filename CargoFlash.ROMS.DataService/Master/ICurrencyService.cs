using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.Master;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Model;

namespace CargoFlash.Cargo.DataService.Master
{
    #region Currency interface Description
    /*
	*****************************************************************************
	interface Name:		ICurrencyService      
	Purpose:		    This interface used to handle
	Company:		    CargoFlash Infotech Pvt Ltd.
	Author:			    Tarun Kumar
	Created On:		    05 Mar 2014
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion

    [ServiceContract]
    public interface ICurrencyService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetCurrencyRecord?recid={RecordID}&UserSNo={UserSNo}")]
        Currency GetCurrencyRecord(string recordID, string UserSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveCurrency")]
        List<string> SaveCurrency(List<Currency> Currency);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateCurrency")]
        List<string> UpdateCurrency(List<Currency> Currency);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteCurrency")]
        List<string> DeleteCurrency(List<string> RecordID);
    }
}