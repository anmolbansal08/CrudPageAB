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
    #region Country Service Description
    /*
	*****************************************************************************
	Service Name:	CountryService      
	Purpose:		This Service used to get details of Country save update and delete
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Tarun Kumar
	Created On:		24 feb 2014
    Updated By:    
	Updated On:	
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class CountryService : SignatureAuthenticate, ICountryService
    {
        public Country GetCountryRecord(string recordID, string UserSNo)
        {
            Country c = new Country();
            SqlDataReader dr = null;
            try
            {

                SqlParameter[] Parameters = { new SqlParameter("@CountryCode", (recordID)), new SqlParameter("@UserID", Convert.ToInt32(UserSNo)) };
                dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordCountry", Parameters);
                if (dr.Read())
                {
                    c.SNo = Convert.ToInt32(dr["SNo"]);
                    c.CountryCode = dr["CountryCode"].ToString();
                    c.CountryName = dr["CountryName"].ToString().ToUpper();
                    c.CurrencySNo = dr["CurrencySNo"] == DBNull.Value ? (int?)null : Convert.ToInt32(dr["CurrencySNo"]); 
                    c.CurrencyCode = dr["CurrencySNo"].ToString();
                    c.Text_Continent = dr["Continent"].ToString();
                    c.Text_CurrencyCode = dr["CurrencyCode"].ToString();
                    c.Continent = dr["Continent"].ToString().ToUpper();
                    c.IATAAreaCode = dr["IATAAreaCode"].ToString();
                    c.Text_IATAAreaCode = dr["strIATAAreaCode"].ToString();
                    c.ISDCode = dr["ISDCode"].ToString();
                    c.UpdatedBy = dr["UpdatedUser"].ToString();
                    c.CreatedBy = dr["CreatedUser"].ToString();
                    c.IsDiscountOnTactRate = Convert.ToBoolean(dr["DiscountOnTactRate"]);
                    c.Text_DiscountOnTactRate = dr["Text_DiscountOnTactRate"].ToString().ToUpper();
                }
            }
            catch(Exception ex)//
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
                string filters = GridFilter.ProcessFilters<Country>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListCountry", Parameters);
                var countryList = ds.Tables[0].AsEnumerable().Select(e => new Country
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    CountryCode = e["CountryCode"].ToString().ToUpper(),
                    CountryName = e["CountryName"].ToString().ToUpper(),
                    CurrencyCode = e["CurrencyCode"].ToString().ToUpper(),
                    Continent = e["Continent"].ToString().ToUpper()
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = countryList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//
            {

                throw ex;
            }

        }
        public List<string> SaveCountry(List<Country> Country)
        {
            //validate Business Rule
            DataTable dtCreateCountry = CollectionHelper.ConvertTo(Country, "Text_CurrencyCode,Text_Continent,Text_IATAAreaCode,Text_DiscountOnTactRate");
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBusiness = new BaseBusiness();
            try
            {
                if (!baseBusiness.ValidateBaseBusiness("Country", dtCreateCountry, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@CountryTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateCountry;
                SqlParameter[] Parameters = { param };

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateCountry", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Country");
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
        public List<string> UpdateCountry(List<Country> Country)
        {
            //validate Business Rule
            DataTable dtUpdateCountry = CollectionHelper.ConvertTo(Country, "Text_CurrencyCode,Text_Continent,Text_IATAAreaCode,Text_DiscountOnTactRate");
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBusiness = new BaseBusiness();
            try
            {
                if (!baseBusiness.ValidateBaseBusiness("Country", dtUpdateCountry, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@CountryTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtUpdateCountry;
                SqlParameter[] Parameters = { param };

                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateCountry", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Country");
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
        public List<string> DeleteCountry(List<string> listID)
        {
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBusiness = new BaseBusiness();
            try
            {
                if (listID.Count > 1)
                {
                    string RecordID = listID[0].ToString();
                    string UserID = listID[1].ToString();

                    SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToString(RecordID)),
                                             new SqlParameter("@UserID",  Convert.ToInt32(UserID))};

                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteCountry", Parameters);
                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            //For Customised Validation Messages like 'Record Already Exists' etc
                            string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Country");
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
            }
            catch(Exception ex)//
            {

                throw ex;
            }
            return ErrorMessage;
        }
    }
}
