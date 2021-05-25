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
    #region DutyArea Service Description
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
    class DutyAreaService : SignatureAuthenticate, IDutyAreaService
    {
        public DutyArea GetDutyAreaRecord(string recordID, string UserID)
        {
            DutyArea dutyArea = new DutyArea();
            SqlDataReader dr = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@UserID", Convert.ToInt32(UserID)) };
                dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordDutyArea", Parameters);
                if (dr.Read())
                {
                    dutyArea.SNo = Convert.ToInt32(dr["SNo"]);
                    dutyArea.AreaName = Convert.ToString(dr["AreaName"]);
                    // DutyArea.Hierarchy = Convert.ToString(dr["Hierarchy"]);
                    dutyArea.CreatedOn = Convert.ToString(dr["CreatedOn"]);
                    dutyArea.CreatedBy = Convert.ToString(dr["CreatedUser"]);
                    dutyArea.UpdatedBy = Convert.ToString(dr["UpdatedUser"]);
                    dutyArea.UpdatedOn = Convert.ToString(dr["UpdatedOn"]);
                
                    dutyArea.IsActive = Convert.ToBoolean(dr["IsActive"]);
                    dutyArea.Active = Convert.ToString(dr["ACTIVE"]);
                    dutyArea.TerminalSno = Convert.ToInt32(dr["TerminalSno"]);
                    dutyArea.Text_TerminalSno = dr["Terminal"].ToString();
                    dutyArea.IsExport = Convert.ToBoolean(dr["IsExport"]);
                    dutyArea.ColorName = dr["ColorName"].ToString().ToUpper();
                    dutyArea.HashColorCodeSno = Convert.ToInt32(dr["HashColorCodeSno"]);
                    dutyArea.Text_HashColorCodeSno = dr["HColorName"].ToString();
                    dutyArea.Export = Convert.ToString(dr["Export"]).ToString().ToUpper();
                    dutyArea.DutyAreaName = Convert.ToString(dr["DutyAreaName"]).ToString().ToUpper();
                }
            }
            catch(Exception ex)// (Exception ex)
            {
                dr.Close();
            }
            return dutyArea;
        }
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            string sorts = GridSort.ProcessSorting(sort);
            string filters = GridFilter.ProcessFilters<DutyArea>(filter);
            //string _connectionStringName = ConfigurationManager.AppSettings.Get("DataProvider");
          
            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListDutyArea", Parameters);
            var DutyAreaList = ds.Tables[0].AsEnumerable().Select(e => new DutyArea
            {
                SNo = Convert.ToInt32(e["SNo"]),
                AreaName = e["AreaName"].ToString().ToUpper().ToUpper(),
                Text_TerminalSno = e["TerminalName"].ToString().ToUpper(),
                ColorName = e["ColorName"].ToString().ToUpper(),
                Text_HashColorCodeSno = e["HashColorName"].ToString().ToUpper(),
                Export = e["Type"].ToString().ToUpper(),
                DutyAreaName = e["DutyAreaName"].ToString().ToUpper(),
                Active = e["ACTIVE"].ToString(),
            });
            ds.Dispose();
            return new DataSourceResult
            {
                Data = DutyAreaList.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
            };
        }
        public List<string> SaveDutyArea(List<DutyArea> DutyArea)
        {
            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
            DataTable dtCreateDutyArea = CollectionHelper.ConvertTo(DutyArea, "Active,Export,Text_TerminalSno,Text_HashColorCodeSno,DutyAreaName");
            BaseBusiness baseBusiness = new BaseBusiness();
            if (!baseBusiness.ValidateBaseBusiness("DutyArea", dtCreateDutyArea, "SAVE"))
            {
                ErrorMessage = baseBusiness.ErrorMessage;
                return ErrorMessage;
            }
            SqlParameter param = new SqlParameter();
            param.ParameterName = "@DutyAreaTable";
            param.SqlDbType = System.Data.SqlDbType.Structured;
            param.Value = dtCreateDutyArea;
            SqlParameter[] Parameters = { param };
            int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateDutyArea", Parameters);
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    //For Customised Validation Messages like 'Record Already Exists' etc
                    string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "DutyArea");
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
        public List<string> UpdateDutyArea(List<DutyArea> DutyArea)
        {
            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
            DataTable dtCreateDutyArea = CollectionHelper.ConvertTo(DutyArea, "Active,Export,Text_TerminalSno,Text_HashColorCodeSno,DutyAreaName");
            BaseBusiness baseBusiness = new BaseBusiness();

            if (!baseBusiness.ValidateBaseBusiness("DutyArea", dtCreateDutyArea, "UPDATE"))
            {
                ErrorMessage = baseBusiness.ErrorMessage;
                return ErrorMessage;
            }
            SqlParameter param = new SqlParameter();
            param.ParameterName = "@DutyAreaTable";
            param.SqlDbType = System.Data.SqlDbType.Structured;
            param.Value = dtCreateDutyArea;
            SqlParameter[] Parameters = { param };
            int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateDutyArea", Parameters);
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    //For Customised Validation Messages like 'Record Already Exists' etc
                    string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "DutyArea");
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
        public List<string> DeleteDutyArea(List<string> listID)
        {
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            if (listID.Count > 0)
            {
                string RecordId = listID[0].ToString();
                string UserId = listID[1].ToString();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", RecordId), new SqlParameter("@UserID", Convert.ToInt32(UserId)) };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteDutyArea", Parameters);

                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "DutyArea");
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

        public HashColorName GetColorName(string hashColorCodeSno)
        {
         
            HashColorName hcn = new HashColorName();
            SqlDataReader dr = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@HashColorCodeSno", hashColorCodeSno) };
                dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetColorName", Parameters);
                if (dr.Read())
                {
                    hcn.ColorName = dr["ColorName"].ToString().ToUpper();
                }
            }
            catch(Exception ex)// (Exception e)
            {
                dr.Close();
            }
            dr.Close();
            return hcn;
        }
    }
}
