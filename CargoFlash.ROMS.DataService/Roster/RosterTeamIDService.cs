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
    #region TeamID Service Description
    /*
	*****************************************************************************
	Service Name:	RosterTeamIDService      
	Purpose:		This Service used to get details of RosterTeamIDService save update and delete
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Farogh Haider
	Created On:		27 Oct 2015
    Updated By:    
	Updated On:	
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion

    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class RosterTeamIDService : SignatureAuthenticate, IRosterTeamIDService
    {
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {

            string sorts = GridSort.ProcessSorting(sort);
            string filters = GridFilter.ProcessFilters<RosterTeamID>(filter);
            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListRosterTeamID", Parameters);
            var RosterList = ds.Tables[0].AsEnumerable().Select(e => new RosterTeamID
            {
                SNo = Convert.ToInt32(e["SNo"]),
                Name = e["Name"].ToString().ToUpper(),
                IsActive = Convert.ToBoolean(e["IsActive"]),
                Active = Convert.ToString(e["Active"])
            });
            ds.Dispose();
            return new DataSourceResult
            {
                Data = RosterList.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
            };
        }
        public RosterTeamID GetRosterTeamIDRecord(int recordID, string UserID)
        {
            RosterTeamID model = new RosterTeamID();
            SqlDataReader dr = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@UserID", Convert.ToInt32(UserID)) };
                dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordRosterTeamID", Parameters);
                if (dr.Read())
                {
                    model.SNo = Convert.ToInt32(dr["SNo"]);
                    model.Name = dr["Name"].ToString();
                    model.IsActive = Convert.ToBoolean(dr["IsActive"]);
                    model.Active = Convert.ToString(dr["Active"]);
                 
                    //model.CreatedBy = Convert.ToInt32(dr["CreatedBy"]);
                    //model.CreatedOn = Convert.ToDateTime(dr["CreatedOn"]);
                    //model.UpdatedBy = Convert.ToInt32(dr["UpdatedBy"]);
                    //model.UpdatedOn = Convert.ToDateTime(dr["UpdatedOn"]);

                }
            }
            catch(Exception ex)// (Exception ex)
            {
                dr.Close();
            }
            return model;
        }
        public List<string> SaveRosterTeamID(List<RosterTeamID> lstRosterTeamID)
        {

            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
            DataTable dtCreateIrr = CollectionHelper.ConvertTo(lstRosterTeamID, "Active");
            BaseBusiness baseBusiness = new BaseBusiness();

            if (dtCreateIrr != null)
            {
                if (dtCreateIrr.Columns.Contains("CreatedOn"))
                {
                    dtCreateIrr.Columns.Remove("CreatedOn");
                }
                if (dtCreateIrr.Columns.Contains("UpdatedOn"))
                {
                    dtCreateIrr.Columns.Remove("UpdatedOn");
                }
            }

            if (!baseBusiness.ValidateBaseBusiness("RosterTeamID", dtCreateIrr, "SAVE"))
            {
                ErrorMessage = baseBusiness.ErrorMessage;
                return ErrorMessage;
            }
            SqlParameter param = new SqlParameter();
            param.ParameterName = "@RosterTeamIDTable";
            param.SqlDbType = System.Data.SqlDbType.Structured;
            param.Value = dtCreateIrr;
            SqlParameter[] Parameters = { param };

            int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateRosterTeamID", Parameters);
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    //For Customised Validation Messages like 'Record Already Exists' etc
                    string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "RosterTeamID");
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
        public List<string> UpdateRosterTeamID(List<RosterTeamID> lstRosterTeamID)
        {

            List<string> ErrorMessage = new List<string>();
            DataTable dtCreateIrr = CollectionHelper.ConvertTo(lstRosterTeamID, "Active");
            BaseBusiness baseBusiness = new BaseBusiness();

            if (dtCreateIrr != null)
            {
                if (dtCreateIrr.Columns.Contains("CreatedOn"))
                {
                    dtCreateIrr.Columns.Remove("CreatedOn");
                }
                if (dtCreateIrr.Columns.Contains("UpdatedOn"))
                {
                    dtCreateIrr.Columns.Remove("UpdatedOn");
                }
            }

            if (!baseBusiness.ValidateBaseBusiness("RosterTeamID", dtCreateIrr, "UPDATE"))
            {
                ErrorMessage = baseBusiness.ErrorMessage;
                return ErrorMessage;
            }

            SqlParameter param = new SqlParameter();
            param.ParameterName = "@RosterTeamIDTable";
            param.SqlDbType = System.Data.SqlDbType.Structured;
            param.Value = dtCreateIrr;
            SqlParameter[] Parameters = { param };

            int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateRosterTeamID", Parameters);
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    //For Customised Validation Messages like 'Record Already Exists' etc
                    string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "RosterTeamID");
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
        public List<string> DeleteRosterTeamID(List<string> listID)
        {
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBusiness = new BaseBusiness();
            if (listID.Count > 1)
            {
                string RecordID = listID[0].ToString();
                string UserID = listID[1].ToString();

                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(RecordID)),
                                             new SqlParameter("@UserID",  Convert.ToInt32(UserID))};

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteRosterTeamID", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "RosterTeamID");
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

    }
}
