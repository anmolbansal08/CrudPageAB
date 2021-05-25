using CargoFlash.SoftwareFactory.Data;
using CargoFlash.SoftwareFactory.WebUI;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Data.SqlClient;
using System.ServiceModel;
using System.ServiceModel.Activation;
using CargoFlash.Cargo.Business;
using System.ServiceModel.Web;
using System.Net;
using System;

namespace CargoFlash.Cargo.DataService.Export.UWS.UWSPrint
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class UWSPrintService : BaseWebUISecureObject, IUWSPrintService
    {
        public string GetUWSPrintData(string FlightNo, string FlightDate, string UserSNo)
        {
            try
            { 
            //UserSNo = (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo).ToString();
            SqlParameter[] Parameters = { new SqlParameter("@FlightNo", FlightNo), new SqlParameter("@FlightDate", FlightDate), new SqlParameter("@UserSNo", UserSNo), new SqlParameter("@AirportCode", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportCode.ToString()) };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "UWSPrintRecordNew", Parameters);
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);

            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public int SaveUWSPrintDetails(List<UWSPrintTableData> UWSModel, string OtherInfo1, string OtherInfo2, string UserSNo, int DailyFlightSNo)
        {
            try
            { 
            DataTable dt = CollectionHelper.ConvertTo(UWSModel, "");
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBusiness = new BaseBusiness();
            SqlParameter[] Parameters = { new SqlParameter("@UWSPrintTrans", SqlDbType.Structured) { Value = dt }, new SqlParameter("@DailyFlightSNo", DailyFlightSNo), new SqlParameter("@OtherInfo1", OtherInfo1), new SqlParameter("@OtherInfo2", OtherInfo2), new SqlParameter("@UserSNo", UserSNo) };
            int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "spUWS_Update", Parameters);
            return ret;

            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public List<UWSEDIMessageHistory> getUWSHistoryMessage(int DailyFlightSNo)
        {
            try
            { 
            //UserSNo = (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo).ToString();
            var res = new List<UWSEDIMessageHistory>();
            SqlParameter[] Parameters = { new SqlParameter("@DailyFlightSNo", DailyFlightSNo), new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spUWSEDIMessage", Parameters);
            res = ds.Tables[0].AsEnumerable().Select(e => new UWSEDIMessageHistory
            {
                LBDSNo = e["LBDSNo"].ToString(),
                DailyMovementSNo = e["DailyMovementSNo"].ToString(),
                SentAt = e["SentAt"].ToString(),
                UWSMessage = e["UWSMessage"].ToString(),
            }).ToList();

            ds.Dispose();
            return res;

            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
    }
}
