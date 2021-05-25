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
    #region Customer interface Description
    /*
	*****************************************************************************
	interface Name:		ICustomerService      
	Purpose:		    This interface used to handle
	Company:		    CargoFlash Infotech Pvt Ltd.
	Author:			    Tarun Kumar
	Created On:		    17 feb 2014
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [ServiceContract]
    public interface ICustomerService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetCustomerRecord?recid={RecordID}&UserSNo={UserSNo}")]
        Customer GetCustomerRecord(string recordID, string UserSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveCustomer")]
        List<string> SaveCustomer(List<Customer> Customer);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateCustomer")]
        List<string> UpdateCustomer(List<Customer> Customer);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteCustomer")]
        List<string> DeleteCustomer(List<string> ids);

        //[OperationContract]
        //[WebInvoke(Method = "GET", UriTemplate = "GetCustomerAddressRecord?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //List<CustomerAddress> GetCustomerAddressRecord(string recordID);

        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "createUpdateCustomerAddress?strData={strData}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //List<string> createUpdateCustomerAddress(string strData);

        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "deleteCustomerAddress?recid={RecordID}", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //List<string> deleteCustomerAddress(string recordID);

        //[OperationContract]
        //[WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, UriTemplate = "GetCity?recid={RecordID}", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //DataSourceResult GetCity(String RecordID);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetRecordAuthorizedPersonnel(string CustomerSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveAuthorizedPersonal", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveAuthorizedPersonal(List<AuthorizedPersonal> AuthorizedPersonal);

        //[OperationContract]
        //[WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //string GetAuthorizedImage(string CustomerSNo, string ImagePath, string ImageId, string CustomerAuthorizedPERSONNELSNo);
        //=============by arman  Date: 18-05-2017 ==========
        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetCountrySNo(int CitySNo);

        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string CheckAgreementNumber(string AgreementNumber);
        //=======end=============
        //added by tarun Kumar singh
        //[OperationContract]
        //[WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        //string DownloadBLOB(int customersno, string filecolumn);
    }
}
