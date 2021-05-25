using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.SoftwareFactory.Data;
using System.IO;



namespace CargoFlash.Cargo.DataService.AuditLog
{
    [ServiceContract]
  public interface IActivityLogService
    {

        //[OperationContract]
        //[WebGet(UriTemplate = "GetGridData/{processName}/{moduleName}/{appName}/{UserId}/{Module}/{PageName}/{ActionName}/{FromDate}/{ToDate}", BodyStyle = WebMessageBodyStyle.Bare)]
        //Stream GetGridData(string processName, string moduleName, string appName, string userId, string module, string pageName, string actionName, string fromDate, string toDate);



        [OperationContract]
        [WebGet(UriTemplate = "GetWebForm/{processName}/{moduleName}/{appName}/{formAction}/{IsSubModule}", BodyStyle = WebMessageBodyStyle.Bare)]
        Stream GetWebForm(string processName, string moduleName, string appName, string formAction, string IsSubModule);


    }
}
