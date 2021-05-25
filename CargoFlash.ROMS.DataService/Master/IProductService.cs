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
    #region Product interface Description
    /*
	*****************************************************************************
	interface Name:		IProductService      
	Purpose:		    This interface used to handle
	Company:		    CargoFlash Infotech Pvt Ltd.
	Author:			    Shivang Srivastava.
	Created On:		    04 Mar 2014
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [ServiceContract]
    public interface IProductService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetProductRecord?recid={RecordID}&UserSNo={UserSNo}")]
        Product GetProductRecord(int recordID, string UserSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveProduct")]
        List<string> SaveProduct(List<Product> Product);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateProduct")]
        List<string> UpdateProduct(List<Product> Product);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteProduct")]
        List<string> DeleteProduct(List<string> RecordID);

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, UriTemplate = "GetDefault", ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetDefault();
    }
}
