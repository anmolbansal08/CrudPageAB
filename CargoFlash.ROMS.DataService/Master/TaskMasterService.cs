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
    public class TaskMasterService : SignatureAuthenticate, ITaskMasterService
    {
        public RegistryControl GetTaskMasterRecord(string recordID, string UserID)
        {
            RegistryControl RegistryControl = new RegistryControl();
            SqlDataReader dr = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@PSNo", recordID) };
                dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordRegistryControl", Parameters);
                if (dr.Read())
                {
                    RegistryControl.ProcessSNo = Convert.ToInt32(dr["SNo"].ToString());
                    RegistryControl.Text_ProcessSNo = dr["ProcessName"].ToString();
                    RegistryControl.CitySNo = 0;
                    RegistryControl.Text_CitySNo = "";
                    RegistryControl.AirlineSNo = 0;
                    RegistryControl.Text_AirlineSNo = "";
                    RegistryControl.GroupSNo = 0;
                    RegistryControl.Text_GroupSNo = "";
                    RegistryControl.PageSNo = 0;
                    RegistryControl.Text_PageSNo = "";
                    RegistryControl.RType = "";


                }
            }
            
            catch(Exception ex)//
            {
                dr.Close();
                throw ex;
            }
            dr.Close();
            return RegistryControl;
        }

        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {

                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<RegistryControl>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListRegistryMaster", Parameters);

                // sno, processName,SubProcessName,pagename,priority,IsRequired,isdisplay,
                //isactive,isdeleted,isoneclick,displaycaption,progresscheck,ispopupsubprocess 
                var RCList = ds.Tables[0].AsEnumerable().Select(e => new RegistryControl
                {
                    SNo = Convert.ToInt32(e["SNo"].ToString()),
                    processName = e["processName"].ToString().ToUpper(),
                    SubProcessName = e["SubProcessName"].ToString().ToUpper(),
                    pagename = e["pagename"].ToString().ToUpper(),
                    priority = e["priority"].ToString(),
                    IsRequired = e["IsRequired"].ToString(),
                    isdisplay = e["isdisplay"].ToString(),

                    isactive = e["isactive"].ToString(),
                    isdeleted = e["isdeleted"].ToString(),
                    isoneclick = e["isoneclick"].ToString(),
                    displaycaption = e["displaycaption"].ToString().ToUpper(),
                    progresscheck = e["progresscheck"].ToString(),
                    ispopupsubprocess = e["ispopupsubprocess"].ToString(),
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = RCList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
    }
}
