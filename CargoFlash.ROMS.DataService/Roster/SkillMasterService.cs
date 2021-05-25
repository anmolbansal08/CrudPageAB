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

namespace CargoFlash.Cargo.DataService.Roster
{
    #region Skill Service Description
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
    class SkillMasterService : SignatureAuthenticate, ISkillMasterService
    {

         public SkillMaster GetSkillMasterRecord(string recordID, string UserID)
        {
            SkillMaster skillMaster = new SkillMaster();
            SqlDataReader dr = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@UserID", Convert.ToInt32(UserID)) };
                dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordSkillMaster", Parameters);
                if (dr.Read())
                {
                    skillMaster.SNo = Convert.ToInt32(dr["SNo"]);
                    skillMaster.Name = Convert.ToString(dr["Name"]);
                   // skillMaster.Hierarchy = Convert.ToString(dr["Hierarchy"]);
                    skillMaster.CreatedOn = Convert.ToString(dr["CreatedOn"]);
                    skillMaster.CreatedBy = Convert.ToString(dr["CreatedBy"]);
                    skillMaster.UpdatedBy = Convert.ToString(dr["UpdatedBy"]);
                    skillMaster.UpdatedOn = Convert.ToString(dr["UpdatedOn"]);                
                    skillMaster.IsActive = Convert.ToBoolean(dr["IsActive"]);
                    skillMaster.Active = Convert.ToString(dr["Active"]);
                    
                    
                }
            }
            catch(Exception ex)// (Exception ex)
            {
                dr.Close();
            }
            return skillMaster;
        }
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            string sorts = GridSort.ProcessSorting(sort);
            string filters = GridFilter.ProcessFilters<SkillMaster>(filter);
            //string _connectionStringName = ConfigurationManager.AppSettings.Get("DataProvider");
            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListSkillMaster", Parameters);
            var SkillMasterList = ds.Tables[0].AsEnumerable().Select(e => new SkillMaster
            {
                SNo = Convert.ToInt32(e["SNo"]),

                Name = e["Name"].ToString().ToUpper(),
                //Hierarchy = Convert.ToString(e["Hierarchy"]),
               
                //CreatedBy = e["CreatedBy"].ToString(),
                Active = e["Active"].ToString()
            });
            ds.Dispose();
            return new DataSourceResult
            {
                Data = SkillMasterList.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
            };
        }
        public List<string> SaveSkillMaster(List<SkillMaster> SkillMaster)
        {
            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
            DataTable dtCreateSkillMaster = CollectionHelper.ConvertTo(SkillMaster, "Active");
            BaseBusiness baseBusiness = new BaseBusiness();

            if (!baseBusiness.ValidateBaseBusiness("SkillMaster", dtCreateSkillMaster, "SAVE"))
            {
                ErrorMessage = baseBusiness.ErrorMessage;
                return ErrorMessage;
            }
            SqlParameter param = new SqlParameter();
            param.ParameterName = "@SkillMasterTable";
            param.SqlDbType = System.Data.SqlDbType.Structured;
            param.Value = dtCreateSkillMaster;
            SqlParameter[] Parameters = { param };
            int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateSkillMaster", Parameters);
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    //For Customised Validation Messages like 'Record Already Exists' etc
                    string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "SkillMaster");
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
        public List<string> UpdateSkillMaster(List<SkillMaster> SkillMaster)
        {
            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
            DataTable dtCreateSkillMaster = CollectionHelper.ConvertTo(SkillMaster, "Active");
            BaseBusiness baseBusiness = new BaseBusiness();

            if (!baseBusiness.ValidateBaseBusiness("SkillMaster", dtCreateSkillMaster, "UPDATE"))
            {
                ErrorMessage = baseBusiness.ErrorMessage;
                return ErrorMessage;
            }
            SqlParameter param = new SqlParameter();
            param.ParameterName = "@SkillMasterTable";
            param.SqlDbType = System.Data.SqlDbType.Structured;
            param.Value = dtCreateSkillMaster;
            SqlParameter[] Parameters = { param };
            int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateSkillMaster", Parameters);
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    //For Customised Validation Messages like 'Record Already Exists' etc
                    string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "SkillMaster");
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
        public List<string> DeleteSkillMaster(List<string> listID)
        {
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            if (listID.Count > 0)
            {
                string RecordId = listID[0].ToString();
                string UserId = listID[1].ToString();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", RecordId), new SqlParameter("@UserID", Convert.ToInt32(UserId)) };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteSkillMaster", Parameters);

                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "SkillMaster");
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
    }
    }

