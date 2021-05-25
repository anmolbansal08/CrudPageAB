using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using CargoFlash.Cargo.Model.Master;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using Newtonsoft.Json;
using System.Net;
using System.ServiceModel.Web;

namespace CargoFlash.Cargo.DataService.Master
{
    #region Department Service Description
    /*
	*****************************************************************************
	Service Name:	DepartmentService      
	Purpose:		This Service used to get details of Department save update and delete
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Tarun Kumar
	Created On:		17 May 2014
    Updated By:    
	Updated On:	
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class DepartmentService : SignatureAuthenticate, IDepartmentService
    {
        public Department GetDepartmentRecord(string recordID, string UserID)
        {
            Department Department = new Department();
            SqlDataReader dr = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(recordID)), new SqlParameter("@UserID", Convert.ToInt32(UserID)) };
                dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordDepartment", Parameters);
                if (dr.Read())
                {
                    Department.SNo = Convert.ToInt32(dr["SNo"]);
                    Department.Name = dr["Name"].ToString().ToUpper();
                    Department.BackendName = dr["BackendName"].ToString().ToUpper();
                    if (!String.IsNullOrEmpty(dr["IsActive"].ToString()))
                    {
                        Department.IsActive = Convert.ToBoolean(dr["IsActive"]);
                        Department.Active = dr["Active"].ToString().ToUpper();
                    }
                    Department.UpdatedBy = dr["UpdatedUser"].ToString();
                    Department.CreatedBy = dr["CreatedUser"].ToString();

                }
            //}
            //catch(Exception ex)// (Exception ex)
            //{
            //    dr.Close();
            //}
            return Department;
            }
            catch(Exception ex)//
            {
                dr.Close();
                throw ex;
            }
        }

        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<Department>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListDepartment", Parameters);
                var departmentList = ds.Tables[0].AsEnumerable().Select(e => new Department
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    Name = e["Name"].ToString().ToUpper(),
                    BackendName = e["BackendName"].ToString().ToUpper(),
                    Active = e["Active"].ToString(),
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = departmentList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//
            {
                
                throw ex;
            }
            

        }

        public List<string> SaveDepartment(List<Department> Department)
        {
            try
            { 
            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
            DataTable dtCreateDepartment = CollectionHelper.ConvertTo(Department, "Active");
            BaseBusiness baseBusiness = new BaseBusiness();
            if (!baseBusiness.ValidateBaseBusiness("Department", dtCreateDepartment, "SAVE"))
            {
                ErrorMessage = baseBusiness.ErrorMessage;
                return ErrorMessage;
            }
            SqlParameter param = new SqlParameter();
            param.ParameterName = "@DepartmentTable";
            param.SqlDbType = System.Data.SqlDbType.Structured;
            param.Value = dtCreateDepartment;
            SqlParameter[] Parameters = { param };
            int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateDepartment", Parameters);
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    //For Customised Validation Messages like 'Record Already Exists' etc
                    string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Department");
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
            catch(Exception ex)//
            {
                
                throw ex;
            }
        }

        public List<string> UpdateDepartment(List<Department> Department)
        {
            try
            { 
            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
            DataTable dtCreateDepartment = CollectionHelper.ConvertTo(Department, "Active");
            BaseBusiness baseBusiness = new BaseBusiness();
            if (!baseBusiness.ValidateBaseBusiness("Department", dtCreateDepartment, "UPDATE"))
            {
                ErrorMessage = baseBusiness.ErrorMessage;
                return ErrorMessage;
            }
            SqlParameter param = new SqlParameter();
            param.ParameterName = "@DepartmentTable";
            param.SqlDbType = System.Data.SqlDbType.Structured;
            param.Value = dtCreateDepartment;
            SqlParameter[] Parameters = { param };
            int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateDepartment", Parameters);
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    //For Customised Validation Messages like 'Record Already Exists' etc
                    string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Department");
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
            catch(Exception ex)//
            {
               
                throw ex;
            }
        }

        public List<string> DeleteDepartment(List<string> listID)
        {
            try
            { 
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            if (listID.Count > 0)
            {
                string RecordId = listID[0].ToString();
                string UserId = listID[1].ToString();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(RecordId)), new SqlParameter("@UserID", Convert.ToInt32(UserId)) };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteDepartment", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "Department");
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
            catch(Exception ex)//
            {
                
                throw ex;
            }
        }

    }
}
