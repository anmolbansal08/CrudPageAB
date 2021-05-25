using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using CargoFlash.Cargo.Model.Accounts;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using Newtonsoft.Json;
using System.Net;

namespace CargoFlash.Cargo.DataService.Accounts
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class SummaryReportService : SignatureAuthenticate, ISummaryReportService
    {
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<SummaryReport>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts), new SqlParameter("@LoginUserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListSummaryReport", Parameters);
                var SummaryList = ds.Tables[0].AsEnumerable().Select(e => new SummaryReport
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    CashierId = e["CashierId"].ToString().ToUpper(),
                    CashierName = e["CashierName"].ToString(),
                    CashRegisterDate = e["CashRegisterDate"].ToString() == String.Empty ? "" : DateTime.Parse(e["CashRegisterDate"].ToString()).ToString("dd-MMM-yyyy"),
                    StartSession = e["StartSession"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["StartSession"]), DateTimeKind.Utc),
                    EndSession = e["EndSession"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["EndSession"]), DateTimeKind.Utc),
                    Startbalance = e["Startbalance"].ToString().ToUpper(),
                    ClosingBalance = e["ClosingBalance"].ToString().ToUpper(),
                    ShiftStart = e["StartShift"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["StartShift"]), DateTimeKind.Utc),
                    ShiftEnd = e["EndShift"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["EndShift"]), DateTimeKind.Utc),
                    CashierIDGroupSNo = e["CashierIDGroupSNo"].ToString(),
                    cashregisterSNo = e["cashregisterSNo"].ToString()
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = SummaryList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetSummaryReport(string CashierID, string Date, string StartSession, string EndSession)
        {
            try
            {

                SqlParameter[] Parameters = { new SqlParameter("@CashierID", CashierID), new SqlParameter("@Date", Date.ToString()), new SqlParameter("@StartSession", StartSession.ToString()), new SqlParameter("@EndSession", EndSession.ToString()) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetSummaryReport", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);

            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
    }
}
