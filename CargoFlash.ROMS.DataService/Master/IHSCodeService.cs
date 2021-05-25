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
    #region HSCode interface Description
    /*
	*****************************************************************************
	interface Name:		IHSCodeService      
	Purpose:		This interface used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Priti Yadav
	Created On:		20 Apr 2020
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [ServiceContract]
    public interface IHSCodeService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetHSCodeRecord?recid={RecordID}&UserSNo={UserSNo}")]
        HSCodes GetHSCodeRecord(int recordID, string UserSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveHSCode")]
        List<string> SaveHSCode(List<HSCodes> HSCodes);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateHSCode")]
        List<string> UpdateHSCode(List<HSCodes> HSCodes);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteHSCode")]
        List<string> DeleteHSCode(List<string> RecordID);

    }
}
