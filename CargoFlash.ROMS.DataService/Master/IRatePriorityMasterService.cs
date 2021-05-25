
using CargoFlash.Cargo.Model.Irregularity;
using CargoFlash.Cargo.Model.Master;
using CargoFlash.SoftwareFactory.Data;
using KLAS.Business;
using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using CargoFlash.Cargo.Business;
using System.Data.SqlClient;

namespace CargoFlash.Cargo.DataService.Master
{
    [ServiceContract]
    public  interface IRatePriorityMasterService
    {
        [OperationContract]
        [WebInvoke(Method = "GET", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string BindDatatable();

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
         string UpdateRatePriorityMaster(List<RatePriorityMaster> RatePriorityMaster, int UpdatedBy);

    }
}
