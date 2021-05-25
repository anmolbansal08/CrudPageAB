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

namespace CargoFlash.Cargo.DataService.Master
{
    #region Commodity Density Group interface Description
    /*
	*****************************************************************************
	interface Name:		ICommodityDensityGroup      
	Purpose:		    This interface used to handle
	Company:		    CargoFlash Infotech Pvt Ltd.
	Author:			    Tarun Kumar
	Created On:		    19 May 2014
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [ServiceContract]
    public interface ICommodityDensityGroupService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetCommodityDensityGroupRecord?recid={RecordID}&UserSNo={UserSNo}")]
        CommodityDensityGroup GetCommodityDensityGroupRecord(string recordID, string UserSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveCommodityDensityGroup")]
        List<string> SaveCommodityDensityGroup(List<CommodityDensityGroup> CommodityDensityGroup);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateCommodityDensityGroup")]
        List<string> UpdateCommodityDensityGroup(List<CommodityDensityGroup> CommodityDensityGroup);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteCommodityDensityGroup")]
        List<string> DeleteCommodityDensityGroup(List<string> RecordID);
    }
}
