using CargoFlash.Cargo.Model.Irregularity;
using CargoFlash.SoftwareFactory.Data;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;

namespace CargoFlash.Cargo.DataService.Irregularity
{
    [ServiceContract]
    public interface IClaimService
    {
        [OperationContract]
        [WebGet(UriTemplate = "GetWebForm/{processName}/{moduleName}/{appName}/{formAction}/{IsSubModule}/{RecID}", BodyStyle = WebMessageBodyStyle.Bare)]
        Stream GetWebForm(string processName, string moduleName, string appName, string formAction, string IsSubModule, string RecID);

        [OperationContract]
        [WebInvoke(Method = "POST", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        Stream GetGridData(ClaimWhereConditionModel modal);

        [OperationContract]
        [WebInvoke(UriTemplate = "/GetClaimGridData", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        DataSourceResult GetClaimGridData(GetClaimGridData model, int skip, int take, int page, int pageSize, List<SoftwareFactory.Data.GridSort> sort, SoftwareFactory.Data.GridFilter filter);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveNewClaim", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveNewClaim(ClaimNew obj);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/UpdateClaim", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string UpdateClaim(ClaimNew obj);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveAssign", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveAssign(ClaimAssign obj);

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetEdoxAtClaimSNo(Int32 CurrentClaimSNo,Int32 UserType);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveClaimEDoxDetail", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveClaimEDoxDetail(int CurrentClaimSNo, List<ClaimEDoxDetail> ClaimEDoxDetail, int UserType);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/GetActionHistory", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetActionHistory(int CurrentClaimSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/GetAssignHistory", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetAssignHistory(int CurrentClaimSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/GetIrregularityHistory", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetIrregularityHistory(int CurrentClaimSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/GetClaimAmountRecord", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetClaimAmountRecord(int CurrentClaimSNo);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/SaveAction", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string SaveAction(ClaimAction obj);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/GetAWBComplaintIrregularityList", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetAWBComplaintIrregularityList(string AWBNo, int Status);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/GetAWBPieces", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetAWBPieces(string CurrentClaimSNo);

         [OperationContract]
         [WebInvoke(Method = "POST", UriTemplate = "/GetAWBRecords", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
        string GetAWBRecords(int AWBSNo, int MovementTypeSNo);

         [OperationContract]
         [WebInvoke(Method = "POST", UriTemplate = "/GetHouseAWBRecords", BodyStyle = WebMessageBodyStyle.WrappedRequest, ResponseFormat = WebMessageFormat.Json, RequestFormat = WebMessageFormat.Json)]
         string GetHouseAWBRecords(int HAWBSNo, int MovementTypeSNo);


         [OperationContract]
         [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
         string GetCargoClaimFormPrint(string CurrentClaimSNo);

         [OperationContract]
         [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
         string GetFinalReleasePrint(string CurrentClaimSNo);

         [OperationContract]
         [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
         string GetSettelmentClaimPrint(string CurrentClaimSNo);

         [OperationContract]
         [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
         string GetOffice(string CitySNo, string UserSNo);

         [OperationContract]
         [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
         string GetCarrierSurveyReportFormPrint(string CurrentClaimSNo);

         [OperationContract]
         [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
         string GetAnalysisClaimCargoFormPrint(string CurrentClaimSNo);
        


    }
}
