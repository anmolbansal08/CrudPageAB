using System.Collections.Generic;
using System.ServiceModel;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.Master;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.DataService.Master
{
    #region Country interface Description
    /*
	*****************************************************************************
	interface Name:		ICountryService      
	Purpose:		    This interface used to handle
	Company:		    CargoFlash Infotech Pvt Ltd.
	Author:			    Tarun Kumar
	Created On:		    24 feb 2014
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [ServiceContract]
    public interface ICountryService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetCountryRecord?recid={RecordID}&UserSNo={UserSNo}")]
        Country GetCountryRecord(string recordID, string UserSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveCountry")]
        List<string> SaveCountry(List<Country> Country);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateCountry")]
        List<string> UpdateCountry(List<Country> Country);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteCountry")]
        List<string> DeleteCountry(List<string> RecordID);

    }
}
