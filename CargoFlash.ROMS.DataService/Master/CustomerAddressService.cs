using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using CargoFlash.Cargo.Model.Master;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using Newtonsoft.Json;
using System.ServiceModel.Web;
using System.Net;

namespace CargoFlash.Cargo.DataService.Master
{
    #region Customer Address Service Description
    /*
	*****************************************************************************
	Service Name:	CustomerAddressService      
	Purpose:		This Service used to get details of Customer Address save update and delete
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Tarun Kumar
	Created On:		25 feb 2014
    Updated By:    
	Updated On:	
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class CustomerAddressService : SignatureAuthenticate, ICustomerAddressService
    {
        public KeyValuePair<string, List<CustomerAddress>> GetCustomerAddressRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                CustomerAddress CustomerAddress = new CustomerAddress();
                SqlParameter[] Parameters = { new SqlParameter("@CustomerSNo", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordCustomerAddress", Parameters);
                // return resultData.Tables[0].AsEnumerable().ToList();
                var CustomerAddressList = ds.Tables[0].AsEnumerable().Select(e => new CustomerAddress
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    CustomerSNo = Convert.ToInt32(e["CustomerSNo"]),
                    CustomerName = e["CustomerName"].ToString(),
                    //Address = e["Address"].ToString().ToUpper(),
                    CitySNo = e["CityName"].ToString(),
                    CountrySNo = e["CountryCode"].ToString(),
                    HdnCitySNo = e["CitySNo"].ToString(),
                    HdnCountrySNo = e["CountrySNo"].ToString(),
                    State = e["State"].ToString().ToUpper(),
                    PostalCode = e["PostalCode"].ToString().ToUpper(),
                    Phone = e["Phone"].ToString(),
                    Telex = e["Telex"].ToString(),
                    Fax = e["Fax"].ToString(),
                    Email = e["Email"].ToString(),
                    Primary = e["PRMRY"].ToString().ToUpper(),
                    Active = e["ACTIVE"].ToString().ToUpper(),
                    IsPrimary = Convert.ToInt32(e["IsPrimary"]),
                    IsActive = Convert.ToInt32(e["IsActive"]),
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    Street = e["Street"].ToString().ToUpper(),
                    Address2 = e["Address2"].ToString().ToUpper(),
                    Town = e["Town"].ToString().ToUpper(),
                });
                return new KeyValuePair<string, List<CustomerAddress>>(ds.Tables[1].Rows[0][0].ToString(), CustomerAddressList.AsQueryable().ToList());
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }

       
        public List<string> createUpdateCustomerAddress(string strData)
        {
            int ret = 0;
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            try
            {
                // convert JSON string ito datatable
                var dtCustomerAddress = JsonConvert.DeserializeObject<DataTable>(CargoFlash.Cargo.Business.Common.Base64ToString(strData));
                //dtCustomerAddress.Columns.Remove("HdnCountryCode");
                //dtCustomerAddress.Columns.Remove("HdnCityName");
                var dtCreateCustomerAddress = (new DataView(dtCustomerAddress, "SNo=0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                var dtUpdateCustomerAddress = (new DataView(dtCustomerAddress, "SNo>0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@CustomerAddressTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                // for create new record
                if (dtCreateCustomerAddress.Rows.Count > 0)
                {
                    param.Value = dtCreateCustomerAddress;
                    SqlParameter[] Parameters = { param };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateCustomerAddress", Parameters);
                }
                // for update existing record
                if (dtUpdateCustomerAddress.Rows.Count > 0)
                {
                    param.Value = dtUpdateCustomerAddress;
                    SqlParameter[] Parameters = { param };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateCustomerAddress", Parameters);
                }
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "CustomerAddress");
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
            catch(Exception ex)//
            {

                throw ex;
            }
            return ErrorMessage;
        }

        public List<string> deleteCustomerAddress(string recordID)
        {
            int ret = 0;
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteCustomerAddress", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "CustomerAddress");
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
            catch(Exception ex)//
            {

                throw ex;
            }
            return ErrorMessage;
        }

        public DataSourceResult GetCity(String CountryCode)
        {
            try
            {
                List<String> cur = new List<String>();
                SqlParameter[] Parameters = { new SqlParameter("@CountryCode", CountryCode) };
                SqlDataReader dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordCityAutocomplete", Parameters);
                if (dr.Read())
                {
                    cur.Add(dr["CityCode"].ToString());
                    cur.Add(dr["CityName"].ToString());
                }
                return new DataSourceResult
                {
                    Data = cur,
                    Total = cur.Count()
                };
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }
    }
}
