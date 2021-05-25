using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.Accounts;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Model.Master;

namespace CargoFlash.Cargo.DataService.Accounts
{
    #region Ledger interface Description
    /*
	*****************************************************************************
	interface Name:		ILedgerService   
	Purpose:		    This interface used to handle
	Company:		    CargoFlash Infotech Pvt Ltd.
	Author:			    Swati Rastogi.
	Created On:		    26 Dec 2016
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [ServiceContract]
    public interface ILedgerService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetLedgerRecord?recid={RecordID}&UserID={UserID}")]
        Ledger GetLedgerRecord(int recordID, string UserID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveLedger")]
        List<string> SaveLedger(List<Ledger> Ledger);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateLedger")]
        List<string> UpdateLedger(List<Ledger> Ledger);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteLedger")]
        List<string> DeleteLedger(List<string> RecordID);


    }
}
