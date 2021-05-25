﻿using System;
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
    [ServiceContract]
    public interface IZoneService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [OperationContract]

        [WebGet(UriTemplate = "GetZoneRecord?recid={RecordID}&UserSNo={UserSNo}")]
        Zone GetZoneRecord(string recordID, string UserSNo);

        [OperationContract]

        [WebInvoke(Method = "POST", UriTemplate = "/SaveZone")]
        List<string> SaveZone(List<Zone> Zone);



        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateZone")]
        List<string> UpdateZone(List<Zone> Zone);



        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/DeleteZone")]
        List<string> DeleteZone(List<string> RecordID);
    }
}
