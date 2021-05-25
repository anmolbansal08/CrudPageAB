using CargoFlash.Cargo.Business;
using CargoFlash.Cargo.Model.Master;
using CargoFlash.SoftwareFactory.Data;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Text;

namespace CargoFlash.Cargo.DataService.Master
{/*
	*****************************************************************************
	Class Name:		EmployeeService
	Purpose:		This Service used to get details of Employee save update and delete
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Krishan Kant Agarwal
	Created On:		19 Nov 2015
    Updated By:    
	Updated On:	
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class EmployeeService : SignatureAuthenticate, IEmployeeService
    {
        public Employee GetEmployeeRecord(string recordID, string UserID)
        {
            Employee c = new Employee();
            SqlDataReader dr = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@EmployeeCode", (recordID)), new SqlParameter("@UserID", Convert.ToInt32(UserID)) };
                dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordEmployeeTest", Parameters);
                if (dr.Read())
                {
                    c.SNo = Convert.ToInt32(dr["SNo"]);
                    c.EmployeeCode = dr["EmployeeCode"].ToString();
                    c.EmployeeName = dr["EmployeeName"].ToString().ToUpper();
                    c.Mobile = Convert.ToInt32(dr["CurrencySNo"]);
                    c.Email = dr["CurrencySNo"].ToString();                   
                    c.UpdateBy = dr["UpdateBy"].ToString();
                    c.UpdatedAt = dr["UpdatedAt"].ToString();
                }
            }
            catch(Exception ex)// //(Exception ex)
            {
                dr.Close();
                throw ex;
            }
            return c;
        }
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<Employee>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListEmployee", Parameters);
                var EmployeeList = ds.Tables[0].AsEnumerable().Select(e => new Employee
                {
                    EmployeeCode = e["EmployeeCode"].ToString().ToUpper(),
                    EmployeeName = e["EmployeeName"].ToString().ToUpper(),
                    Mobile = Convert.ToInt32(e["Mobile"].ToString()),
                    Email = e["Email"].ToString().ToUpper()
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = EmployeeList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//
            {
                throw ex;
            }

        }
        public List<string> SaveEmployee(List<Employee> Employee)
        {
            try
            {
                //validate Business Rule
                DataTable dtCreateEmployee = CollectionHelper.ConvertTo(Employee, "Text_EmployeeCode,Text_EmployeeName,Text_Email,Text_Mobile");
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBusiness = new BaseBusiness();
                if (!baseBusiness.ValidateBaseBusiness("Employee", dtCreateEmployee, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@EmployeeTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateEmployee;
                SqlParameter[] Parameters = { param };

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateEmployeeTest", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Employee");
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
        public List<string> UpdateEmployee(List<Employee> Employee)
        {
            try
            {
                //validate Business Rule
                DataTable dtUpdateEmployee = CollectionHelper.ConvertTo(Employee, "Text_EmployeeCode,Text_EmployeeName,Text_Email,Text_Mobile");
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBusiness = new BaseBusiness();
                if (!baseBusiness.ValidateBaseBusiness("Employee", dtUpdateEmployee, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@EmployeeTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtUpdateEmployee;
                SqlParameter[] Parameters = { param };

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateEmployeeTest", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Employee");
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
        public List<string> DeleteEmployee(List<string> listID)
        {
            try
            {
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBusiness = new BaseBusiness();
                if (listID.Count > 1)
                {
                    string RecordID = listID[0].ToString();
                    string UserID = listID[1].ToString();

                    SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToString(RecordID)),
                                             new SqlParameter("@UserID",  Convert.ToInt32(UserID))};

                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteEmployeeTest", Parameters);
                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            //For Customised Validation Messages like 'Record Already Exists' etc
                            string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Employee");
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
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        
    }
   
}
