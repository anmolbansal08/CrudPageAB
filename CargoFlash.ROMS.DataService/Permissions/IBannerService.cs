using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Data;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Model.Permissions;

//namespace CargoFlash.Cargo.DataService.Permissions
//{
//    [ServiceContract]
//    public interface IBannerService
//    {
//        [OperationContract]
//        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
//        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

//        [WebInvoke(Method = "POST", UriTemplate = "SaveBanner")]
//        List<string> SaveBanner(List<Banner> Allotment);
//    }

//}

//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Runtime.Serialization;
//using System.ServiceModel;
//using System.Text;
//using System.Data;
//using System.ServiceModel.Web;
//using CargoFlash.nGenDTD.Model.Master;
//using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.DataService.Permissions
{

    [ServiceContract]
    public interface IBannerService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]
        [WebGet(UriTemplate = "GetBannerRecord?recid={RecordID}&UserID={UserID}")]
        Banner GetBannerRecord(string recordID, string UserID);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveBanner")]
        List<string> SaveBanner(List<Banner> Banner);


        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateBanner")]
        List<string> UpdateBanner(List<Banner> Banner);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteBanner")]
        List<string> DeleteBanner(List<string> listID);
    }
}

