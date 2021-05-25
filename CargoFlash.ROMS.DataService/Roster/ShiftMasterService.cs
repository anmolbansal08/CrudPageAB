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

    #region Shift Master Service Description
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
    class ShiftMasterService : SignatureAuthenticate, IShiftMasterService
    {
          public ShiftMaster GetShiftMasterRecord(string recordID, string UserID)
        {
            ShiftMaster shiftMaster = new ShiftMaster();
            SqlDataReader dr = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@UserID", Convert.ToInt32(UserID)) };
                dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordShiftMaster", Parameters);
                if (dr.Read())
                {
                    shiftMaster.SNo = Convert.ToInt32(dr["SNo"]);
                    shiftMaster.ShiftName = Convert.ToString(dr["ShiftName"]);
                    shiftMaster.TimeIn=Convert.ToString(dr["TimeIn"]);
                    shiftMaster.TimeOut=Convert.ToString(dr["TimeOut"]);
                     shiftMaster.NextDay = Convert.ToBoolean(dr["NextDay"]);
                    shiftMaster.IsActive = Convert.ToBoolean(dr["IsActive"]);
                    //shiftMaster.CreatedOn = Convert.ToString(dr["CreatedOn"]);
                    shiftMaster.CreatedBy = Convert.ToString(dr["CreatedBy"]);
                    shiftMaster.UpdatedBy = Convert.ToString(dr["UpdatedBy"]);
                    //shiftMaster.UpdatedOn = Convert.ToString(dr["UpdatedOn"]);
            
                    shiftMaster.Active = Convert.ToString(dr["Active"]);
                    shiftMaster.DayNext = Convert.ToString(dr["DayNext"]);
                    
                }
            }
            catch(Exception ex)// (Exception ex)
            {
                dr.Close();
            }
            return shiftMaster;
        }
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            string sorts = GridSort.ProcessSorting(sort);
            string filters = GridFilter.ProcessFilters<ShiftMaster>(filter);
            //string _connectionStringName = ConfigurationManager.AppSettings.Get("DataProvider");
    
            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListShiftMaster", Parameters);
            var ShiftMasterList = ds.Tables[0].AsEnumerable().Select(e => new ShiftMaster
            {
                SNo = Convert.ToInt32(e["SNo"]),

               ShiftName = e["ShiftName"].ToString().ToUpper(),
               TimeIn = Convert.ToString(e["TimeIn"]),
               TimeOut=  Convert.ToString(e["TimeOut"]),
               
                //CreatedBy = e["CreatedBy"].ToString(),

                DayNext = e["DayNext"].ToString(),
               Active=e["Active"].ToString()
               
            });
            ds.Dispose();
            return new DataSourceResult
            {
                Data = ShiftMasterList.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
            };
        }
        public List<string> SaveShiftMaster(List<ShiftMaster> ShiftMaster)
        {
            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
            DataTable dtCreateShiftMaster = CollectionHelper.ConvertTo(ShiftMaster, "Active");
            dtCreateShiftMaster.Columns.Remove("DayNext");
            BaseBusiness baseBusiness = new BaseBusiness();

            if (!baseBusiness.ValidateBaseBusiness("ShiftMaster", dtCreateShiftMaster, "SAVE"))
            {
                ErrorMessage = baseBusiness.ErrorMessage;
                return ErrorMessage;
            }
            SqlParameter param = new SqlParameter();
            param.ParameterName = "@ShiftMasterTable";
            param.SqlDbType = System.Data.SqlDbType.Structured;
            param.Value = dtCreateShiftMaster;
            SqlParameter[] Parameters = { param };
            int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateShiftMaster", Parameters);
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    //For Customised Validation Messages like 'Record Already Exists' etc
                    string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "ShiftMaster");
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
        public List<string> UpdateShiftMaster(List<ShiftMaster> ShiftMaster)
        {
            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
            DataTable dtCreateShiftMaster = CollectionHelper.ConvertTo(ShiftMaster, "Active");
            dtCreateShiftMaster.Columns.Remove("DayNext");
            BaseBusiness baseBusiness = new BaseBusiness();

            if (!baseBusiness.ValidateBaseBusiness("ShiftMaster", dtCreateShiftMaster, "UPDATE"))
            {
                ErrorMessage = baseBusiness.ErrorMessage;
                return ErrorMessage;
            }
            SqlParameter param = new SqlParameter();
            param.ParameterName = "@ShiftMasterTable";
            param.SqlDbType = System.Data.SqlDbType.Structured;
            param.Value = dtCreateShiftMaster;
            SqlParameter[] Parameters = { param };
            int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateShiftMaster", Parameters);
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    //For Customised Validation Messages like 'Record Already Exists' etc
                    string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "ShiftMaster");
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
        public List<string> DeleteShiftMaster(List<string> listID)
        {
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            if (listID.Count > 0)
            {
                string RecordId = listID[0].ToString();
                string UserId = listID[1].ToString();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", RecordId), new SqlParameter("@UserID", Convert.ToInt32(UserId)) };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteShiftMaster", Parameters);

                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "ShiftMaster");
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

