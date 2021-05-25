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
using CargoFlash.Cargo.Model;
using System.Net;


namespace CargoFlash.Cargo.DataService.Master
{
    #region CustomerType Service Description
    /*
	*****************************************************************************
	Service Name:		CustomerTypeService      
	Purpose:		This Service used to get details of Customer save update and delete
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Tarun Kumar
	Created On:		13 feb 2014
    Updated By:    
	Updated On:	
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class CustomerTypeService : SignatureAuthenticate, ICustomerTypeService
    {
        public CustomerType GetCustomerTypeRecord(int recordID, string UserSNo)
        {
            CustomerType ct = new CustomerType();
            SqlDataReader dr = null;
            try
            {
                
                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(recordID)), new SqlParameter("@UserID", Convert.ToInt32(UserSNo)) };
                dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordCustomerType", Parameters);
                if (dr.Read())
                {
                    ct.SNo = Convert.ToInt32(dr["SNo"]);
                    if (!String.IsNullOrEmpty(dr["IsActive"].ToString()))
                    {
                        ct.IsActive = Convert.ToBoolean(dr["IsActive"]);
                        ct.Active = dr["Active"].ToString().ToUpper();
                    }
                    if (!String.IsNullOrEmpty(dr["IsMandatory"].ToString()))
                    {
                        ct.IsMandatory = Convert.ToBoolean(dr["IsMandatory"]);
                        ct.Mandatory = dr["Mandatory"].ToString().ToUpper();
                    }
                    ct.CustomerTypeName = dr["CustomerTypeName"].ToString().ToUpper();
                    ct.UpdatedBy = dr["UpdatedUser"].ToString();
                    ct.CreatedBy = dr["CreatedUser"].ToString();

                }
            }
            catch(Exception ex)//
            {
                dr.Close();
                throw ex;
            }
            return ct;
        }
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {

                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<CustomerType>(filter);


                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListCustomerType", Parameters);

                var customertypeList = ds.Tables[0].AsEnumerable().Select(e => new CustomerType
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    CustomerTypeName = e["CustomerTypeName"].ToString().ToUpper(),
                    Active = e["Active"].ToString().ToUpper(),
                    Mandatory = e["Mandatory"].ToString().ToUpper()
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = customertypeList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }
        public List<string> SaveCustomerType(List<CustomerType> CustomerType)
        {
            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
            try
            {
                DataTable dtCreateCustomerType = CollectionHelper.ConvertTo(CustomerType, "Active,Mandatory");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("CustomerType", dtCreateCustomerType, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }


                SqlParameter param = new SqlParameter();
                param.ParameterName = "@CustomerTypeTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateCustomerType;
                SqlParameter[] Parameters = { param };

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateCustomerType", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "CustomerType");
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
            catch(Exception ex)//
            {

                throw ex;
            }

            return ErrorMessage;
        }
        public List<string> UpdateCustomerType(List<CustomerType> CustomerType)
        {
            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
            try
            {
                DataTable dtCreateCustomerType = CollectionHelper.ConvertTo(CustomerType, "Active,Mandatory");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("CustomerType", dtCreateCustomerType, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }


                SqlParameter param = new SqlParameter();
                param.ParameterName = "@CustomerTypeTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateCustomerType;
                SqlParameter[] Parameters = { param };

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateCustomerType", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "CustomerType");
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
            catch(Exception ex)//
            {

                throw ex;
            }
            return ErrorMessage;
        }
        public List<string> DeleteCustomerType(List<string> listID)
        {
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            try
            {
                if (listID.Count > 0)
                {
                    string RecordId = listID[0].ToString();
                    string UserId = listID[1].ToString();
                    SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(RecordId)), new SqlParameter("@UserID", Convert.ToInt32(UserId)) };
                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteCustomerType", Parameters);

                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "CustomerType");
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
            }
            catch(Exception ex)//
            {

                throw ex;
            }
            return ErrorMessage;
        }

    }
}
