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
    #region OffloadReason interface Description
    /*
	*****************************************************************************
	interface Name:		IOffloadReasonService      
	Purpose:		This interface used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Priti Yadav
	Created On:		15 Apr 2020
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [ServiceContract]
    public interface IOffloadReasonService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetOffloadReasonRecord?recid={RecordID}&UserSNo={UserSNo}")]
        OffloadReason GetOffloadReasonRecord(int recordID, string UserSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveOffloadReason")]
        List<string> SaveOffloadReason(List<OffloadReason> OffloadReason);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateOffloadReason")]
        List<string> UpdateOffloadReason(List<OffloadReason> OffloadReason);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteOffloadReason")]
        List<string> DeleteOffloadReason(List<string> RecordID);

    }
}
