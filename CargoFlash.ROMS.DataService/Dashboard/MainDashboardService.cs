using System;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Data;
using System.Data.SqlClient;
using CargoFlash.Cargo.Model.Dashboard;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.DataService.Dashboard
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]
    [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class MainDashboardService : SignatureAuthenticate, IMainDashboardService
    {
        public string GetRecord(MainDashboard obj)
        {
            try
            {
                SqlParameter[] Parameters = {
                 new SqlParameter("@AirlineSno", obj.Airline),
                new SqlParameter("@FromDate", obj.FromDate),
                new SqlParameter("@ToDate",obj.ToDate),
                new SqlParameter("@CountrySNo", obj.Country),
                new SqlParameter("@CitySNo", obj.City == "" ? "0": obj.City),
                new SqlParameter("@CurrencySno", obj.Currency == "" ? "0": obj.Currency),

                };

                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Dashboard_GetAllCount", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public string GetLiData(MainDashboard obj)
        {
            try
            {
                SqlParameter[] Parameters = {
                 new SqlParameter("@AirlineSno", obj.Airline),
                new SqlParameter("@FromDate", obj.FromDate),
                new SqlParameter("@ToDate",obj.ToDate),
                 new SqlParameter("@CountrySNo", obj.Country),
                new SqlParameter("@CitySNo",obj.City == "" ? "0": obj.City),
                new SqlParameter("@CurrencySno",  obj.Currency == "" ? "0": obj.Currency),
                new SqlParameter("@Mode", obj.Mode),
                };

                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "usp_GetDashBoardRecord", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
        public string GetTOPAgents(MainDashboard obj)
        {
            try
            {
                SqlParameter[] Parameters = {
                 new SqlParameter("@AirlineSno", obj.Airline),
                new SqlParameter("@FromDate", obj.FromDate),
                new SqlParameter("@ToDate",obj.ToDate),
                 new SqlParameter("@CountrySNo", obj.Country),
                new SqlParameter("@CitySNo",obj.City == "" ? "0": obj.City),
                new SqlParameter("@CurrencySno",  obj.Currency == "" ? "0": obj.Currency),
                new SqlParameter("@Mode", obj.Mode),
                new SqlParameter("@AccountSNo", obj.AccountSNo == "0" ? "": obj.AccountSNo),
                new SqlParameter("@UserSNo", obj.UserSNo == "0" ? "": obj.UserSNo)
                };

                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Dashboard_GetTOP10AgentContributionRecord", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
    }
}
