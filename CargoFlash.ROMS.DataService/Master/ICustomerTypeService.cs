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
    #region CustomerType interface Description
    /*
	*****************************************************************************
	interface Name:		ICustomerTypeService      
	Purpose:		This interface used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Tarun Kumar
	Created On:		13 feb 2014
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion

    [ServiceContract]
    public interface ICustomerTypeService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetCustomerTypeRecord?recid={RecordID}&UserSNo={UserSNo}")]
        CustomerType GetCustomerTypeRecord(int recordID, string UserSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveCustomerType")]
        List<string> SaveCustomerType(List<CustomerType> CustomerType);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateCustomerType")]
        List<string> UpdateCustomerType(List<CustomerType> CustomerType);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteCustomerType")]
        List<string> DeleteCustomerType(List<string> RecordID);
    }
}
