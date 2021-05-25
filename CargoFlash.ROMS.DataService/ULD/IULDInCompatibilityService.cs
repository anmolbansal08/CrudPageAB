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
using CargoFlash.Cargo.Model;

namespace CargoFlash.Cargo.DataService.ULD
{
      [ServiceContract]
    interface IULDInCompatibilityService
    {

        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);


        [OperationContract]
        [WebGet(UriTemplate = "GetULDInCompatibilityRecord?recid={RecordID}&UserID={UserID}")]
        ULDInCompatibility GetULDInCompatibilityRecord(string recordID, string UserID);

        //[OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "/SaveCharges")]
        //List<string> SaveCharges(List<ULDInCompatibility> Charges);

        // [OperationContract]
        // [WebGet(UriTemplate = "GetULDInCompatibilityTransRecord?recid={RecordID}")]
        //List<ULDInCompatibilityTrans> GetULDInCompatibilityTransRecord(string recordID);

        [OperationContract]
        [WebGet(UriTemplate = "GetULDInCompatibilityTransRecord?recid={RecordID}")]
        List<ULDInCompatibilityTrans> GetULDInCompatibilityTransRecord(string recordID);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        List<string> SaveSPHC(List<ULDInCompatibility> ULDInCompatibilityInfo);

        [OperationContract]
        //[WebInvoke(Method = "POST", UriTemplate = "/UpdateSPHC")]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        List<string> UpdateSPHC(List<ULDInCompatibility> ULDInCompatibilityInfo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteULDIncompatibility")]
        List<string> DeleteULDIncompatibility(List<string> RecordID);
    }
}
