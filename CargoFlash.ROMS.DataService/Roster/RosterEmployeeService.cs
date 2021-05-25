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
    #region Employee Service Description
    /*
	*****************************************************************************
	Service Name:	RosterEmployeeService      
	Purpose:		This Service used to get details of RosterEmployeeService save update and delete
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Farogh Haider
	Created On:		02 Nov 2015
    Updated By:    
	Updated On:	
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion

    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class RosterEmployeeService : SignatureAuthenticate, IRosterEmployeeService
    {
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {

            string sorts = GridSort.ProcessSorting(sort);
            string filters = GridFilter.ProcessFilters<RosterEmployeeGrid>(filter);
      
            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListRosterEmployee", Parameters);
            var RosterList = ds.Tables[0].AsEnumerable().Select(e => new RosterEmployeeGrid
            {
                SNo = Convert.ToInt32(e["SNo"]),
                Name = e["EmployeeName"].ToString().ToUpper(),
                StaffNumber=Convert.ToInt32(e["StaffNumber"]),
                Text_DepartmentSNo = e["Text_DepartmentSNo"].ToString().ToUpper(),
                DesignationName = e["DesignationName"].ToString().ToUpper(),
                Active = e["Active"].ToString().ToUpper(),
                //TeamName = e["TeamName"].ToString().ToUpper(),             
                CityName = e["CityName"].ToString().ToUpper(),
                ContactNo = e["ContactNo"].ToString(),
                Address = e["Address"].ToString().ToUpper(),
            
            });
            ds.Dispose();
            return new DataSourceResult
            {
                Data = RosterList.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
            };
        }
        public RosterEmployee GetRosterEmployeeRecord(int recordID, string UserID)
        {
            RosterEmployee model = new RosterEmployee();
            SqlDataReader dr = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@UserID", Convert.ToInt32(UserID)) };
                dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordRosterEmployee", Parameters);
                if (dr.Read())
                {
                    model.SNo = Convert.ToInt32(dr["SNo"]);
                    model.Name = dr["Name"].ToString().ToUpper();
                    model.StaffNo = dr["StaffNo"].ToString() == "" ? 0 : Convert.ToInt32(dr["StaffNo"]);
                    model.CityCode = dr["CityCode"].ToString().ToUpper();
                    model.DepartmentSNo = Convert.ToString(dr["DepartmentSNo"]).ToUpper();
                    model.Text_DepartmentSNo = Convert.ToString(dr["Text_DepartmentSNo"]).ToUpper();
                    model.AirlineSNo = Convert.ToString(dr["AirlineSNo"]).ToUpper();
                    model.Text_AirlineSNo = Convert.ToString(dr["AirlineName"]).ToUpper();
                    model.DesignationSNo = Convert.ToString(dr["DesignationSNo"]).ToUpper();
                    model.Text_DesignationSNo = Convert.ToString(dr["DesignationName"]).ToUpper();
                    //model.TeamIDSNo = Convert.ToInt32(dr["TeamIDSNo"]);
                    //model.Text_TeamIDSNo = Convert.ToString(dr["TeamIDName"]);
                    model.MailID = dr["MailID"].ToString().ToUpper();
                    model.ContactNo = dr["ContactNo"].ToString().ToUpper();
                    model.PhoneNo = dr["PhoneNo"].ToString().ToUpper();
                    model.Address = dr["Address"].ToString().ToUpper();
                    //model.SkillSNo = Convert.ToString(dr["SkillSNo"]);
                    //model.Text_SkillSNo = dr["SkillName"].ToString();
                    model.JoiningDate = (dr["JoiningDate"].ToString() == string.Empty) ? (DateTime?)null : DateTime.Parse(dr["JoiningDate"].ToString());
                    model.ResignDate = (dr["ResignDate"].ToString() == string.Empty) ? (DateTime?)null : DateTime.Parse(dr["ResignDate"].ToString());
                    model.LWorkingDate = (dr["LWorkingDate"].ToString() == string.Empty) ? (DateTime?)null : DateTime.Parse(dr["LWorkingDate"].ToString());
                    model.IsActive = Convert.ToBoolean(dr["IsActive"]);
                    model.Active = dr["Active"].ToString();
                    model.EmployeeTypeSNo = Convert.ToString(dr["EmployeeTypeSNo"]).ToUpper();
                   // model.IsEmployeeType = string.IsNullOrEmpty(dr["IsEmployeeType"].ToString()) == true ? (Int32?)null : Convert.ToInt32(dr["IsEmployeeType"].ToString());
                    model.Text_EmployeeTypeSNo = dr["Text_EmployeeTypeSNo"].ToString().ToUpper();                   
                    model.UpdatedBy = dr["UpdatedUser"].ToString();
                    model.CreatedBy = dr["CreatedUser"].ToString();

                }
            }
            catch(Exception ex)// (Exception ex)
            {
                dr.Close();
            }
            return model;
        }
        public List<string> SaveRosterEmployee(List<RosterEmployee> lstRosterEmployee)
        {

            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
            DataTable dtCreateIrr = CollectionHelper.ConvertTo(lstRosterEmployee, "Active,Text_DepartmentSNo,Text_AirlineSNo,Text_DesignationSNo,Text_TeamIDSNo,Text_SkillSNo,TeamIDSNo,SkillSNo,Text_EmployeeTypeSNo");
            BaseBusiness baseBusiness = new BaseBusiness();

            if (!baseBusiness.ValidateBaseBusiness("RosterEmployee", dtCreateIrr, "SAVE"))
            {
                ErrorMessage = baseBusiness.ErrorMessage;
                return ErrorMessage;
            }
            SqlParameter param = new SqlParameter();
            param.ParameterName = "@RosterEmployeeTable";
            param.SqlDbType = System.Data.SqlDbType.Structured;
            param.Value = dtCreateIrr;
            SqlParameter[] Parameters = { param };

            int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateRosterEmployee", Parameters);
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    //For Customised Validation Messages like 'Record Already Exists' etc
                    string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "RosterEmployee");
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
        public List<string> UpdateRosterEmployee(List<RosterEmployee> lstRosterEmployee)
        {

            List<string> ErrorMessage = new List<string>();
            DataTable dtCreateIrr = CollectionHelper.ConvertTo(lstRosterEmployee, "Active,Text_DepartmentSNo,Text_AirlineSNo,Text_DesignationSNo,Text_TeamIDSNo,Text_SkillSNo,TeamIDSNo,SkillSNo,Text_EmployeeTypeSNo");
            BaseBusiness baseBusiness = new BaseBusiness();

            if (!baseBusiness.ValidateBaseBusiness("RosterEmployee", dtCreateIrr, "UPDATE"))
            {
                ErrorMessage = baseBusiness.ErrorMessage;
                return ErrorMessage;
            }

            SqlParameter param = new SqlParameter();
            param.ParameterName = "@RosterEmployeeTable";
            param.SqlDbType = System.Data.SqlDbType.Structured;
            param.Value = dtCreateIrr;
            SqlParameter[] Parameters = { param };

            int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateRosterEmployee", Parameters);
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    //For Customised Validation Messages like 'Record Already Exists' etc
                    string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "RosterEmployee");
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
        public List<string> DeleteRosterEmployee(List<string> listID)
        {
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBusiness = new BaseBusiness();
            if (listID.Count > 1)
            {
                string RecordID = listID[0].ToString();
                string UserID = listID[1].ToString();

                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(RecordID)),
                                             new SqlParameter("@UserID",  Convert.ToInt32(UserID))};

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteRosterEmployee", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "RosterEmployee");
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
