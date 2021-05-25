using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data;
using System.ServiceModel.Web;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Model;

namespace CargoFlash.Cargo.DataService.Shipment
{
    [ServiceContract]
    interface IAcceptanceCheckSheetService
    {
        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetAcceptanceCheckSheetRecordGeneral(string pageNo,string pageSize,string WhereCondition,string orderBy,string awbSNo,string checkListTypeSNo,string SPHCSNo);
        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetAcceptanceCheckSheetRecordOther(string pageNo, string pageSize, string WhereCondition, string orderBy, string AWBSNo, string SPHCSNo, string checkListTypeSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetAcceptanceCheckSheetRecordFooter(string awbSNo, string SPHCSNo, string ChecklistTypeSno);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetAcceptanceCheckSheetRecordHeader(string awbSNo, string SPHCSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        string GetColumnName(string awbSNo);
        
    }
}
