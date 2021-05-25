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
    #region ChargeGroup interface Description
    /*
	*****************************************************************************
	interface Name:		IChargeGroupService   
	Purpose:		    This interface used to handle
	Company:		    CargoFlash Infotech Pvt Ltd.
	Author:			    Swati Rastogi.
	Created On:		    14 Dec 2016
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [ServiceContract]
    public interface IChargeGroupService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetChargeGroupRecord?recid={RecordID}&UserID={UserID}")]
        ChargeGroup GetChargeGroupRecord(int recordID, string UserID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveChargeGroup")]
        List<string> SaveChargeGroup(List<ChargeGroup> ChargeGroup);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateChargeGroup")]
        List<string> UpdateChargeGroup(List<ChargeGroup> ChargeGroup);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteChargeGroup")]
        List<string> DeleteChargeGroup(List<string> RecordID);


    }
}
