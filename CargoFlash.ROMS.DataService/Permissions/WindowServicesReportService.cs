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
using CargoFlash.Cargo.Model.Master;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using CargoFlash.Cargo.Model;
using CargoFlash.Cargo.Model.Permissions;


namespace CargoFlash.Cargo.DataService.Permissions
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class WindowServicesReportService : IWindowServicesReportService
    {
        CargoFlash.Cargo.Business.BaseBusiness basebusiness = new CargoFlash.Cargo.Business.BaseBusiness();
       

        public KeyValuePair<string, List<WindowServicesReport>> GetWindowsServiceDetails(int page, int pageSize, string whereCondition, string sort)
        {
            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort), new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
            DataSet ds = new DataSet();
            ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "SPWindowServiceReport_GetWindowsServiceDetails", Parameters);
           
            var WindowServicesReportSlabList = ds.Tables[1].AsEnumerable().Select(e => new WindowServicesReport
            {

                SNo = Convert.ToInt32(e["SNo"]),
                ScheduleName = (e["ScheduleName"]).ToString(),
                StartAt = (e["StartAt"]).ToString(),
                EndAt = (e["EndAt"]).ToString(),
                Duration = (e["Duration"]).ToString(),
                IsRunning = Convert.ToInt32(e["IsRunning"]),
                Exception = (e["Exception"]).ToString(),
                TimeDiff = (e["TimeDiff"]).ToString(), //Added By DEVENDRA SINGH ON 21 August 2017
            });
            return new KeyValuePair<string, List<WindowServicesReport>>(ds.Tables[1].Rows[0][0].ToString(), WindowServicesReportSlabList.AsQueryable().ToList());
        }


        public string StopWindowService(Int32 SNo)
        {
            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { new SqlParameter("@SNo", SNo), new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
            DataSet ds1 = new DataSet();
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "SPWindowServiceReport_StopWindowService", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)// (Exception ex)
            {
                return ex.Message;
            }
        }
            //Added By DEVENDRA SINGH ON 09 August 2017
        public KeyValuePair<string, List<WindowProcessStatus>> GetWindowsServiceStatus(int PageNo, int pageSize, string whereCondition, string sort)
        {
            SqlParameter[] Parameters = { new SqlParameter("@PageNo", PageNo), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
            DataSet ds = new DataSet();
            ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetWindowProcessStatus", Parameters);

            var WindowProcessList = ds.Tables[0].AsEnumerable().Select(e => new WindowProcessStatus
            {

                SNo = Convert.ToInt32(e["SNo"]),
                ProcessName = (e["ProcessName"]).ToString(),
                Remarks = (e["Remarks"]).ToString(),
                Process = (e["Process"]).ToString(),
                LastExecutionTime = (e["LastExecutionTime"]) == DBNull.Value ? "" : Convert.ToDateTime(e["LastExecutionTime"].ToString()).ToString("dd-MMM-yyyy HH:mm:ss"),

            });
            return new KeyValuePair<string, List<WindowProcessStatus>>(ds.Tables[1].Rows[0][0].ToString(), WindowProcessList.AsQueryable().ToList());
        }
        //public DataSourceResult GetWindowsServiceStatus(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        //{

        //    string sorts = GridSort.ProcessSorting(sort);
        //    string filters = GridFilter.ProcessFilters<WindowProcessStatus>(filter);
        //    SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
        //    DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetWindowProcessStatus", Parameters);

        //    var WindowProcessStatusList = ds.Tables[0].AsEnumerable().Select(e => new WindowProcessStatus
        //    {
        //        SNo = Convert.ToInt32(e["SNo"]),
        //        ProcessName = (e["ProcessName"]).ToString(),
        //        ProcessStatus = (e["ProcessStatus"]).ToString(),
        //        remarks = (e["remarks"]).ToString(),
        //        status = (e["status"]).ToString(),
        //        LastExecutionTime = (e["LastExecutionTime"]).ToString(),
                
        //    });
        //    ds.Dispose();
        //    return new DataSourceResult
        //    {
        //        Data = WindowProcessStatusList.AsQueryable().ToList(),
        //        Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
        //    };

        //}



             //*** Added by Devendra*** ON 22 AUG 2017
        public string GetCountServiceFail()
        {
            BaseBusiness baseBusiness = new BaseBusiness();
            List<string> ErrorMessage = new List<string>();
            try
            {
                SqlParameter[] Parameters = {};
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetCountServiceFail", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);

            }
            catch(Exception ex)// (Exception ex)
            {
                throw ex;
            }

        }



   }
}
