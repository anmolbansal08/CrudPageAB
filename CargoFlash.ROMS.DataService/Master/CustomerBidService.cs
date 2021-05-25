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
using System.Net;

namespace CargoFlash.Cargo.DataService.Master
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class CustomerBidService : SignatureAuthenticate, ICustomerBidService
    {
        public CustomerBid GetCustomerBidRecord(string recordID,string UserID)
        {
            try
            {
                CustomerBid customerBid = new CustomerBid();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@UserID", Convert.ToInt32(UserID)) };
                SqlDataReader dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordCustomerBid", Parameters);
                if (dr.Read())
                {
                    customerBid.SNo = Convert.ToInt32(dr["SNo"]);
                    customerBid.AuctionSNo = dr["AuctionSNo"].ToString();
                    customerBid.Text_AuctionSNo = dr["AuctionName"].ToString();
                    customerBid.CustomerSNo = dr["CustomerName"].ToString();
                    customerBid.Text_CustomerSNo = dr["CustomerName"].ToString();
                    customerBid.CustomerRate = Convert.ToDouble(dr["CustomerRate"]);
                    customerBid.CurrencyCode = dr["CurrencyCode"].ToString();
                    customerBid.Text_CurrencyCode = dr["CurrencyCode"].ToString();
                    customerBid.UpdatedBy = dr["UpdatedUser"].ToString();
                    customerBid.CreatedBy = dr["CreatedUser"].ToString();
                }
                dr.Close();
                return customerBid;
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }
        public DataSourceResult GetAuctionRecord(String ID, string UserID)
        {
            try
            {
                List<String> myList = new List<String>();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToInt32(ID)), new SqlParameter("@UserID", Convert.ToInt32(ID)) };
                SqlDataReader dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordAirlineAuction", Parameters);
                if (dr.Read())
                {
                    myList.Add(dr["Origin"].ToString());
                    myList.Add(dr["Destination"].ToString());
                    myList.Add(dr["FlightNo"].ToString());
                }
                return new DataSourceResult
                {
                    Data = myList,
                    Total = myList.Count()
                };
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<CustomerBid>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListCustomerBid", Parameters);
                var CustomerBid = ds.Tables[0].AsEnumerable().Select(e => new CustomerBid
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    CustomerRate = Convert.ToDouble(e["CustomerRate"]),
                    Text_AuctionSNo = e["Text_AuctionSno"].ToString(),
                    Text_CurrencyCode = e["Text_CurrencyCode"].ToString(),
                    Text_CustomerSNo = e["Text_CustomerSNo"].ToString()
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = CustomerBid.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }
        public List<string> SaveCustomerBid(List<CustomerBid> CustomerBid)
        {
            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
            try
            {
                DataTable dtCreateCustomerBid = CollectionHelper.ConvertTo(CustomerBid, "Text_AuctionSNo,Text_CustomerSNo,Text_CurrencyCode");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("CustomerBid", dtCreateCustomerBid, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@CustomerBidTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateCustomerBid;
                SqlParameter[] Parameters = { param };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateCustomerBid", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "CustomerBid");
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


        public List<string> UpdateCustomerBid(List<CustomerBid> CustomerBid)
        {
            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
            try
            {
                DataTable dtCreateCustomerBid = CollectionHelper.ConvertTo(CustomerBid, "Text_AuctionSNo,Text_CustomerSNo,Text_CurrencyCode");
                BaseBusiness baseBusiness = new BaseBusiness();
                if (!baseBusiness.ValidateBaseBusiness("CustomerBid", dtCreateCustomerBid, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@CustomerBidTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateCustomerBid;
                SqlParameter[] Parameters = { param };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateCustomerBid", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "CustomerBid");
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

        public List<string> DeleteCustomerBid(List<string> listID)
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
                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteCustomerBid", Parameters);

                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "CustomerBid");
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
