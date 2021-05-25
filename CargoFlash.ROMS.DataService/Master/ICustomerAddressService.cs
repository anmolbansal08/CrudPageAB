using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using System.Data;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Model.Master;

namespace CargoFlash.Cargo.DataService.Master
{
    #region Customer Address interface Description
    /*
	*****************************************************************************
	interface Name:		ICustomerAddressService      
	Purpose:		    This interface used to handle Customer Address.
	Company:		    CargoFlash Infotech Pvt Ltd.
	Author:			    Tarun Kumar
	Created On:		    25 feb 2014
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [ServiceContract]
    public interface ICustomerAddressService
    {

        //[OperationContract]
        //[WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        //[OperationContract]
        //[WebInvoke(Method = "GET", UriTemplate = "GetCustomerAddressRecord?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //List<CustomerAddress> GetCustomerAddressRecord(string recordID);

        [OperationContract]
        [WebInvoke(Method = "GET", UriTemplate = "GetCustomerAddressRecord?recid={RecordID}&pageNo={page}&pageSize={pageSize}&whereCondition={whereCondition}&sort={sort}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        KeyValuePair<string, List<CustomerAddress>> GetCustomerAddressRecord(string recordID, int page, int pageSize, string whereCondition, string sort);

        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "/SaveCommoditySubGroup")]
        //List<string> SaveCommoditySubGroup(List<CommoditySubGroup> CommoditySubGroup);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/createUpdateCustomerAddress", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> createUpdateCustomerAddress(string strData);

        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "/UpdateCommoditySubGroup")]
        //List<string> UpdateCommoditySubGroup(List<CommoditySubGroup> CommoditySubGroup);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "deleteCustomerAddress?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        List<string> deleteCustomerAddress(string recordID);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, UriTemplate = "GetCity?recid={RecordID}", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetCity(String RecordID);
    }
}
