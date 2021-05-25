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
using Newtonsoft.Json;
using System.Net;

namespace CargoFlash.Cargo.DataService.Master
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class TaskAreaService : SignatureAuthenticate, ITaskAreaService
    {
        public TaskArrea GetTaskAreaRecord(string recordID, string UserID)
        {
            TaskArrea  TA = new TaskArrea();
            SqlDataReader dr = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@TSNo", recordID) };
                dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordTaskArea", Parameters);
                if (dr.Read())
                {
                    TA.TaskSno = Convert.ToInt32(dr["SNo"].ToString());
                    TA.Text_TaskSno = dr["TaskName"].ToString();
                    TA.TIsActive = true;
                }
            }
            
            catch(Exception ex)//
            {
                dr.Close();
                throw ex;
            }
            dr.Close();
            return TA;
        }

        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {

                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<RegistryControl>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListTaskArea", Parameters);
                var TAList = ds.Tables[0].AsEnumerable().Select(e => new TaskArrea
                {
                    SNo = Convert.ToInt32(e["SNo"].ToString()),
                    TaskName = e["TaskName"].ToString().ToUpper(),
                    AreaName = e["AreaName"].ToString().ToUpper(),
                    TIsActive = true,
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = TAList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//
            {
                throw ex;
            }

        }

        public KeyValuePair<string, List<TaskArrea>> GetTaskAreaDetailRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {

                TaskArrea ta = new TaskArrea();
                SqlParameter[] Parameters = {   new SqlParameter("@Sno", recordID),
                                            new SqlParameter("@PageNo", 1),
                                            new SqlParameter("@PageSize", 100),
                                            new SqlParameter("@WhereCondition", ""),
                                            new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetTaskArea", Parameters);

                //select sp.SNo, ProcessSNo,subProcessName, priority,isRequired,IsDisplay,IsActive,IsOneClick,DisplayCaption,ProgressCheck,IsPopUpSubProcess
                var talist = ds.Tables[0].AsEnumerable().Select(e => new TaskArrea
                {
                    TASNo = Convert.ToInt32(e["taSNo"].ToString()),
                    AreaName = e["AreaName"].ToString(),
                    TAIsActive = true,
                    totRowCount = ds.Tables[1].Rows[0][0].ToString()
                });
                return new KeyValuePair<string, List<TaskArrea>>(ds.Tables[1].Rows[0][0].ToString(), talist.AsQueryable().ToList());
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
    }
}
