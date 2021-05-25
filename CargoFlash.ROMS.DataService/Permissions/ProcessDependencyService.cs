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
using CargoFlash.Cargo.Model.Permissions;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using CargoFlash.Cargo.DataService.Common;
using CargoFlash.Cargo.DataService;


namespace CargoFlash.Cargo.Permissions.DataService
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class ProcessDependencyService : SignatureAuthenticate, IProcessDependencyService
    {
        #region Constructors
        public ProcessDependencyService()
            : base()
        {
        }
        public ProcessDependencyService(bool authenticationCheck)
            //: base(authenticationCheck)
        {
        }
        #endregion





        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            string sorts = GridSort.ProcessSorting(sort);
            string filters = GridFilter.ProcessFilters<GroupsGridData>(filter);
        
            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts),
            new SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))};
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListProcessDependency", Parameters);
            var processdependencyList = ds.Tables[0].AsEnumerable().Select(e => new ProcessDependency
            {          
                SNo = Convert.ToInt32(e["SNo"]),
                AirlineName =e["AirlineName"].ToString(),
                

                CityName = e["CityName"].ToString(),
                AirportName = e["AirportName"].ToString(),
                TerminalName = e["TerminalName"].ToString(),
                TransactionType =Convert.ToInt32( e["TransactionType"]),
                TransactionTypeName =e["TransactionTypeName"].ToString()
            });
            ds.Dispose();
            return new DataSourceResult
            {
                Data = processdependencyList.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
            };
        }

        public string GetAirportInformation(string SNo)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", SNo) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAirportInformation", Parameters);
                ds.Dispose();
            }
            catch (Exception) { }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }



        public KeyValuePair<string, List<ProcessDependencyGridAppendGrid>> GetProcessDependencyGridAppendGrid(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
         
            ProcessDependencyGridAppendGrid AirCraftCapacitySPHC = new ProcessDependencyGridAppendGrid();
            SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordProcessDependencyTransAppendGrid1", Parameters);
            var ProcessDependencyGridAppendGridList = ds.Tables[0].AsEnumerable().Select(e => new ProcessDependencyGridAppendGrid
            {
              SNo=0,           
                SubProcessName = e["SubProcess"].ToString(),
                HdnSubProcessName = e["HdnSubProcessName"].ToString(),
                AWBStatusType = e["AWBStatusType"].ToString(),
                HdnAWBStatusType = e["HdnAWBStatusType"].ToString(),
                DependSubProcessName = e["DependSubProcessName"].ToString(),
                HdnDependSubProcessName = e["HdnDependSubProcessName"].ToString(),
                ReturnMessage = e["ReturnMessage"].ToString()
            });
            return new KeyValuePair<string, List<ProcessDependencyGridAppendGrid>>(ds.Tables[1].Rows[0][0].ToString(), ProcessDependencyGridAppendGridList.AsQueryable().ToList());
        }



        public List<string> SaveProcessDependency(ProcessDependencyTransSave data)
        {
            DataTable dtProcessDependencyTrans = CollectionHelper.ConvertTo(data.ProcessDependencyTransData, "");

            //Remove column which is not required in Table Type
            dtProcessDependencyTrans.Columns.Remove("SNo");
            dtProcessDependencyTrans.Columns.Remove("SubProcessName");
            dtProcessDependencyTrans.Columns.Remove("AWBStatusType");
            dtProcessDependencyTrans.Columns.Remove("DependSubProcessName");

        

            int ret=0;
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBusiness = new BaseBusiness();
            if (dtProcessDependencyTrans.Rows.Count>0)
            {
                
                SqlParameter[] param = { new SqlParameter("@AirlineSNo", data.AirlineSNo),
                                       new SqlParameter("@CitySNo", data.CitySNo),
                                       new SqlParameter("@AirportSNo", data.AirportSNo),
                                       new SqlParameter("@TerminalSNo", data.TerminalSNo),
                                        new SqlParameter("@TransactionType", data.TransactionType),
                                       new SqlParameter("@tt", dtProcessDependencyTrans) };

                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "spSubProcessDependencyTrans_Create", param);
            }
            else
            {
                ret = 2003;
            }
          
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "ProcessDependency");
                    if (!string.IsNullOrEmpty(serverErrorMessage))
                        ErrorMessage.Add(serverErrorMessage);
                }
                else
                {
                    string dataBaseExceptionMessage = baseBusiness.ReadServerErrorMessages(ret, baseBusiness.DatabaseExceptionFileName);
                    if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                        ErrorMessage.Add(dataBaseExceptionMessage);
                }
            }
            return ErrorMessage;
        }
        public List<string> DeleteProcessDependency(List<string> listID)
        {
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBusiness = new BaseBusiness();
            if (listID.Count > 1)
            {
                string RecordID = listID[0].ToString();
                string UserID = listID[1].ToString();

                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToString(RecordID))
                                            };

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "spProcessDependency_Delete", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "ProcessDependency");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }
                    else
                    {

                        //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                        string dataBaseExceptionMessage = baseBusiness.ReadServerErrorMessages(ret, baseBusiness.DatabaseExceptionFileName);
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErrorMessage.Add(dataBaseExceptionMessage);
                    }

                }

            }
            else
            {
                //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                string dataBaseExceptionMessage = baseBusiness.ReadServerErrorMessages(9001, baseBusiness.DatabaseExceptionFileName);
                if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                    ErrorMessage.Add(dataBaseExceptionMessage);
                //Error
            }
            return ErrorMessage;
        }

        public List<string> UpdateProcessDependency(ProcessDependencyTransSave data)
        {
            DataTable dtProcessDependencyTrans = CollectionHelper.ConvertTo(data.ProcessDependencyTransData, "");
           
            //Remove column which is not required in Table Type
            dtProcessDependencyTrans.Columns.Remove("SNo");
            dtProcessDependencyTrans.Columns.Remove("SubProcessName");
            dtProcessDependencyTrans.Columns.Remove("AWBStatusType");
            dtProcessDependencyTrans.Columns.Remove("DependSubProcessName");
           
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBusiness = new BaseBusiness();
             int ret=0;

            if (dtProcessDependencyTrans.Rows.Count > 0)
            {
                SqlParameter[] param = { new SqlParameter("@SNo", data.SNo ),
                                        new SqlParameter("@AirlineSNo", data.AirlineSNo),
                                       new SqlParameter("@CitySNo", data.CitySNo),
                                       
                                       new SqlParameter("@AirportSNo", data.AirportSNo),
                                       new SqlParameter("@TerminalSNo", data.TerminalSNo),
                                        new SqlParameter("@TransactionType", data.TransactionType),

                                      new SqlParameter("@tt", dtProcessDependencyTrans) };
               ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "spProcessDependencyTrans_Update", param);
            }
            else
            {
                ret = 2003;
            }
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "ProcessDependency");
                    if (!string.IsNullOrEmpty(serverErrorMessage))
                        ErrorMessage.Add(serverErrorMessage);
                }
                else
                {
                    string dataBaseExceptionMessage = baseBusiness.ReadServerErrorMessages(ret, baseBusiness.DatabaseExceptionFileName);
                    if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                        ErrorMessage.Add(dataBaseExceptionMessage);
                }
            }
            return ErrorMessage;
        }

        public ProcessDependency GetProcessDependencyRecord(string recordID, string UserID)
        {
            ProcessDependency c = new ProcessDependency();
            SqlDataReader dr = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", (recordID)), new SqlParameter("@UserID", Convert.ToInt32(UserID)) };
                dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordProcessDependencyTrans", Parameters);
                if (dr.Read())
                {
                    c.SNo = Convert.ToInt32(dr["SNo"]);
                    c.Text_AirlineSNo = dr["AirlineName"].ToString();
                    c.AirlineSNo =Convert.ToInt32( dr["AirlineSNo"]);

                    c.Text_CitySNo = dr["CityName"].ToString();
                    c.CitySNo =dr["CitySNo"].ToString() !=""? Convert.ToInt32(dr["CitySNo"]) : 0;

                    c.Text_AirportSNo = dr["AirportName"].ToString();
                    c.AirportSNo =dr["AirportSNo"].ToString() !=""? Convert.ToInt32(dr["AirportSNo"]):0;

                    c.Text_TerminalSNo = dr["TerminalName"].ToString();
                    c.TerminalSNo = dr["TerminalSNo"].ToString() != "" ? Convert.ToInt32(dr["TerminalSNo"]) : 0;

                    c.Text_TransactionType =dr["TransactionTypeName"].ToString();
                    c.TransactionType = dr["TransactionType"].ToString() != "" ? Convert.ToInt32(dr["TransactionType"]) : 0;

                    c.hdnEditSno = dr["SNo"].ToString() != "" ? Convert.ToInt32(dr["SNo"]) : 0;

                }
            }
            catch (Exception ex)
            {
                dr.Close();
            }
            return c;
        }
    }
}
