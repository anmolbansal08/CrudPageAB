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
using CargoFlash.Cargo.Model.Roster;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using Newtonsoft.Json;

namespace CargoFlash.Cargo.DataService.Roster
{

    #region Manage Team Service Description
    /*
	*****************************************************************************
	Service Name:	AirlineService      
	Purpose:		This Service used to get details of Airline save update and delete
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Tarun Kumar
	Created On:		25 Mar 2014
    Updated By:    
	Updated On:	
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    class ManageTeamService : SignatureAuthenticate, IManageTeamService
    {
        public KeyValuePair<string, List<ManageTeam>> GetTeamRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            List<ManageTeam> listStock = new List<ManageTeam>();
            SqlParameter[] Parameters = { new SqlParameter("@TeamIdSNo", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordManageTeam", Parameters);
            //DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordManageTeam");
            var ViewOpendetailList = ds.Tables[0].AsEnumerable().Select(e => new ManageTeam
            {
                EmpSNo = Convert.ToInt32(e["EmpSNo"].ToString()),
                TeamIdSNo = e["TeamIdSNo"].ToString() == "" ? 0 : Convert.ToInt32(e["TeamIdSNo"].ToString()),
                EmployeeName = e["EmployeeName"].ToString().ToUpper(),
                TeamName = e["TeamName"].ToString().ToUpper(),
                Designation = e["Designation"].ToString()
            });

            return new KeyValuePair<string, List<ManageTeam>>(ds.Tables[0].Rows[0][0].ToString(), ViewOpendetailList.AsQueryable().ToList());

        }

        public CargoFlash.Cargo.Model.Roster.ManageTeam GetManageTeamRecord(string recordID, string UserID)
        {
            ManageTeam manageTeam = new ManageTeam();
            SqlDataReader dr = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@UserID", Convert.ToInt32(UserID)) };
                dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordTeam", Parameters);
                if (dr.Read())
                {
                    manageTeam.SNo = Convert.ToInt32(dr["SNo"]);
                    //manageTeam.TeamIdSNo = Convert.ToInt32(dr["TeamIDSNo"]);
                    manageTeam.TeamName = dr["TeamIDSNo"].ToString();
                    manageTeam.Text_TeamName= dr["Name"].ToString().ToUpper();
                    manageTeam.ValidFrom = dr["ValidFrom"].ToString();
                    manageTeam.ValidTo = dr["ValidTo"].ToString();
                    manageTeam.IsActive = Convert.ToBoolean(dr["IsActive"]);
                    //manageTeam.EmpSNo = Convert.ToInt32(dr["EmpSNo"]);
                    //manageTeam.CreatedBy = Convert.ToString(dr["CreatedBy"]);
                    //manageTeam.UpdatedBy = Convert.ToString(dr["UpdatedBy"]);
                    manageTeam.Active = Convert.ToString(dr["Active"]);
                }
            }
            catch(Exception ex)// (Exception ex)
            {
                dr.Close();
            }
            return manageTeam;
        }
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            string sorts = GridSort.ProcessSorting(sort);
            string filters = GridFilter.ProcessFilters<ManageTeam>(filter);
            //string _connectionStringName = ConfigurationManager.AppSettings.Get("DataProvider");
         
            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListTeam", Parameters);
            var ManageTeamList = ds.Tables[0].AsEnumerable().Select(e => new ManageTeam
            {
                SNo = Convert.ToInt32(e["SNo"]),

                TeamName = e["Team Name"].ToString().ToUpper(),
                ValidFrom = Convert.ToString(e["ValidFrom"]),
                ValidTo = Convert.ToString(e["ValidTo"]),

                //CreatedBy = e["CreatedBy"].ToString(),
                Active = e["Active"].ToString(),
            });
            ds.Dispose();
            return new DataSourceResult
            {
                Data = ManageTeamList.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
            };
        }
        //public List<string> SaveTeam(List<ManageTeam> ManageTeam)
        //{
        //    //validate Business Rule
        //    List<string> ErrorMessage = new List<string>();
        //    DataTable dtCreateManageTeam = CollectionHelper.ConvertTo(ManageTeam, "Active");
        //    BaseBusiness baseBusiness = new BaseBusiness();

        //    if (!baseBusiness.ValidateBaseBusiness("ManageTeam", dtCreateManageTeam, "SAVE"))
        //    {
        //        ErrorMessage = baseBusiness.ErrorMessage;
        //        return ErrorMessage;
        //    }
        //    SqlParameter param = new SqlParameter();
        //    param.ParameterName = "@ManageTeamTable";
        //    param.SqlDbType = System.Data.SqlDbType.Structured;
        //    param.Value = dtCreateManageTeam;
        //    SqlParameter[] Parameters = { param };
        //    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateManageTeam", Parameters);
        //    if (ret > 0)
        //    {
        //        if (ret > 1000)
        //        {
        //            //For Customised Validation Messages like 'Record Already Exists' etc
        //            string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "ManageTeam");
        //            if (!string.IsNullOrEmpty(serverErrorMessage))
        //                ErrorMessage.Add(serverErrorMessage);
        //        }
        //        else
        //        {
        //            //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
        //            string dataBaseExceptionMessage = baseBusiness.ReadServerErrorMessages(ret, baseBusiness.DatabaseExceptionFileName);
        //            if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
        //                ErrorMessage.Add(dataBaseExceptionMessage);
        //        }
        //    }
        //    return ErrorMessage;
        //}

        ///// </summary>
        ///// <param name="Irregularity"></param>
        ///// <returns></returns>
        public List<string> SaveTeam(List<ManageTeam> ManageTeamInfo)
        {
            List<string> ErrorMessage = new List<string>();
            DataTable dtCreateManage = CollectionHelper.ConvertTo(ManageTeamInfo, "Active");
            dtCreateManage.Columns.Remove("TeamName");
            dtCreateManage.Columns.Remove("Employeename");
            dtCreateManage.Columns.Remove("Designation");
            dtCreateManage.Columns.Remove("CreatedBy");
            dtCreateManage.Columns.Remove("UpdatedBy");
            dtCreateManage.Columns.Remove("Text_TeamName");
            dtCreateManage.Columns.Remove("ValidFrom");
            dtCreateManage.Columns.Remove("ValidTo");
            ////  DataTable dtCreateManageTeam = CollectionHelper.ConvertTo(ManageTeamInfoTrans, "Active");


            BaseBusiness baseBusiness = new BaseBusiness();



            if (!baseBusiness.ValidateBaseBusiness("ManageTeam", dtCreateManage, "SAVE"))
            {
                ErrorMessage = baseBusiness.ErrorMessage;
                return ErrorMessage;
            }
            SqlParameter[] param = 
                                        { 
                                            new SqlParameter("@ManageTeamTable",dtCreateManage),
                                            new SqlParameter("@CreatedBy",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                            new SqlParameter("@UpdatedBy",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                        };

            int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateManageTeam", param);
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    //For Customised Validation Messages like 'Record Already Exists' etc
                    string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "ManageTeam");
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
            return ErrorMessage;
        }
        public List<string> UpdateTeam(List<ManageTeam> ManageTeam)
        {
            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
            DataTable dtCreateManageTeam = CollectionHelper.ConvertTo(ManageTeam, "Active");
            BaseBusiness baseBusiness = new BaseBusiness();
            if (!baseBusiness.ValidateBaseBusiness("ManageTeam", dtCreateManageTeam, "UPDATE"))
            {
                ErrorMessage = baseBusiness.ErrorMessage;
                return ErrorMessage;
            }
            SqlParameter param = new SqlParameter();
            param.ParameterName = "@ManageTeamTable";
            param.SqlDbType = System.Data.SqlDbType.Structured;
            param.Value = dtCreateManageTeam;
            SqlParameter[] Parameters = { param };
            int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateManageTeam", Parameters);
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    //For Customised Validation Messages like 'Record Already Exists' etc
                    string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "ManageTeam");
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

            return ErrorMessage;
        }
        public List<string> DeleteTeam(List<string> listID)
        {
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            if (listID.Count > 0)
            {
                string RecordId = listID[0].ToString();
                string UserId = listID[1].ToString();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", RecordId), new SqlParameter("@UserID", Convert.ToInt32(UserId)) };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteManageTeam", Parameters);

                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "ManageTeam");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);

                    }
                    else
                    {

                        //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                        string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(ret, baseBussiness.DatabaseExceptionFileName);
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErrorMessage.Add(dataBaseExceptionMessage);
                    }

                }
            }
            else
            {
                //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(9001, baseBussiness.DatabaseExceptionFileName);
                if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                    ErrorMessage.Add(dataBaseExceptionMessage);
                //Error
            }
            return ErrorMessage;
        }
        //public string GetEmployeeData(int TeamIDSNO)
        //{
        //    SqlParameter[] Parameters = { new SqlParameter("@TeamIDSNO", TeamIDSNO) };
        //    DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetEmployeeData", Parameters);
        //    ds.Dispose();
        //    return DStoJSON(ds);
        //}

        private static string DStoJSON(DataSet ds)
        {
            StringBuilder json = new StringBuilder();
            json.Append("[");
            int lInteger = 0;
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                lInteger = lInteger + 1;
                json.Append("{");
                int i = 0;
                int colcount = dr.Table.Columns.Count;
                foreach (DataColumn dc in dr.Table.Columns)
                {
                    json.Append("\"");
                    json.Append(dc.ColumnName);
                    json.Append("\":\"");
                    json.Append(dr[dc]);
                    json.Append("\"");
                    i++;
                    if (i < colcount) json.Append(",");
                }

                if (lInteger < ds.Tables[0].Rows.Count)
                {
                    json.Append("},");
                }
                else
                {
                    json.Append("}");
                }
            }

            json.Append("]");

            return json.ToString();
        }


    }
}
