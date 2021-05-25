﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Model.Stock;
namespace CargoFlash.Cargo.DataService.Stock
{
    [ServiceContract]
    public interface IAWBVoidService
    {
        [OperationContract]
        [WebInvoke(BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter);

        [WebInvoke(Method = "POST", UriTemplate = "/SaveAWBVoid")]
        List<string> SaveAWBVoid(List<AWBVoid> AWBVoid);
    }
}
