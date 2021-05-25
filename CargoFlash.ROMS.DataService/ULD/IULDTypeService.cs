using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.ULD;
using CargoFlash.SoftwareFactory.Data;


namespace CargoFlash.Cargo.DataService.ULD
{
    #region ULDType interface Description
    /*
    *****************************************************************************
    interface Name:		IULDTypeService   
    Purpose:		    This interface used to handle
    Company:		    CargoFlash Infotech Pvt Ltd.
    Author:			    Swati Rastogi.
    Created On:		    19 Nov 2015
    Updated By:    
    Updated On:
    Approved By:    
    Approved On:	
    *****************************************************************************
    */
    #endregion
    [ServiceContract]
    public interface IULDTypeService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetULDTypeRecord?recid={RecordID}&UserSNo={UserSNo}")]
        ULDType GetULDTypeRecord(int recordID, string UserSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveULDType")]
        List<string> SaveULDType(List<ULDType> ULDType);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateULDType")]
        List<string> UpdateULDType(List<ULDType> ULDType);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteULDType")]
        List<string> DeleteULDType(List<string> RecordID);

    }
}
