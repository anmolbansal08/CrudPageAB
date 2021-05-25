using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using CargoFlash.Cargo.Model.Master;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using System.Web.Http;
using System.Net.Http;

namespace CargoFlash.Cargo.Master.Web.API.Controllers
{

    public class AirlineController : ApiController
    {
        /// <summary>
        /// Retrieve Airline infromation from database 
        /// </summary>
        /// <param name="recordID">Record id according to which touple is to be retrieved</param>
        /// <returns></returns>
        public Airline GetAirlineRecord(string recordID, string UserID)
        {
            string connectionString = ConfigurationManager.AppSettings["DBMSClientString"].ToString();
            Airline airline = new Airline();
            SqlParameter[] Parameters = { new SqlParameter("@AirlineCode", recordID), new SqlParameter("@UserID", Convert.ToInt32(UserID)) };
            SqlDataReader dr = SqlHelper.ExecuteReader(connectionString, CommandType.StoredProcedure, "GetRecordAirline", Parameters);
            if (dr.Read())
            {
                //airline.AirlineCode = Convert.ToString(dr["AirlineCode"]);
                //airline.CarrierCode = Convert.ToString(dr["CarrierCode"]);
                //airline.AirlineName = Convert.ToString(dr["AirlineName"]);
                //airline.CityCode = Convert.ToString(dr["CityCode"]);//foriegn key
                //airline.Text_CityCode = Convert.ToString(dr["CityCode"]);//foriegn key
                //airline.Address = Convert.ToString(dr["Address"]);
                //airline.SenderEmailId = Convert.ToString(dr["SenderEmailId"]);
                //airline.AirlineEmailId = Convert.ToString(dr["AirlineEmailId"]);
                //airline.AirlineLogo = "./" + Convert.ToString(dr["AirlineLogo"]).Replace('\\', '/');
                //airline.AwbLogo = Convert.ToString(dr["AwbLogo"]).Replace('\\', '/');
                //airline.ReportLogo = Convert.ToString(dr["ReportLogo"]).Replace('\\', '/');
                //airline.AirlineWebsite = Convert.ToString(dr["AirlineWebsite"]);
                //airline.MobileNo = Convert.ToString(dr["MobileNo"]);
                //airline.PhoneNo = Convert.ToString(dr["PhoneNo"]);
                //airline.CsrPhone = Convert.ToString(dr["CsrPhone"]);
                //airline.IsActive = Convert.ToBoolean(dr["IsActive"]);
                //airline.Active = dr["Active"].ToString();
                //airline.CurrencyCode = Convert.ToString(dr["CurrencyCode"]);
                //airline.Text_CurrencyCode = Convert.ToString(dr["CurrencyCode"]);
                //airline.IsDimensionAtBooking = Convert.ToBoolean(dr["IsDimensionAtBooking"]);
                //airline.IsDimensionAtHandover = Convert.ToBoolean(dr["IsDimensionAtHandover"]);
                //airline.IsPerPieceChecked = Convert.ToBoolean(dr["IsPerPieceChecked"]);
                //airline.IsCustomerCreation = Convert.ToBoolean(dr["IsCustomerCreation"]);
                //airline.UpdatedBy = dr["UpdatedUser"].ToString();
                //airline.CreatedBy = dr["CreatedUser"].ToString();
                //airline.MinimumCreditLimit = Convert.ToDecimal(dr["MinimumCreditLimit"]);
                //airline.DomesticBookingDay = Convert.ToInt32(dr["DomesticBookingDay"]);
                //airline.InternationalBookingDay = Convert.ToInt32(dr["InternationalBookingDay"]);
                //airline.DimensionAtBooking = dr["DimensionAtBooking"].ToString();
                //airline.DimensionAtHandover = dr["DimensionAtHandover"].ToString();
                //airline.PerPieceChecked = dr["PerPieceChecked"].ToString();
                //airline.CustomerCreation = dr["CustomerCreation"].ToString();
            }
            dr.Close();
            return airline;
        }
        /// <summary>
        ///  Get list of the records to be shown in the grid
        /// </summary>
        /// <param name="skip">nos. of records to be Skipped</param>
        /// <param name="take">nos. of records to be Retrieved</param>
        /// <param name="page">page no</param>
        /// <param name="pageSize">Size of the page i.e. No of record to be displayed</param>
        /// <param name="sort">column no according to which records to be ordered</param>
        /// <param name="filter">values/parameter According to which record are filtered</param>
        /// <returns>List of the records</returns>
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            string sorts = GridSort.ProcessSorting(sort);
            string filters = GridFilter.ProcessFilters<Airline>(filter);
            //string _connectionStringName = ConfigurationManager.AppSettings.Get("DataProvider");
            string connectionString = ConfigurationManager.AppSettings["DBMSClientString"].ToString();
            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
            DataSet ds = SqlHelper.ExecuteDataset(connectionString, CommandType.StoredProcedure, "GetListAirline", Parameters);
            var AirlineList = ds.Tables[0].AsEnumerable().Select(e => new Airline
            {
                AirlineCode = e["AirlineCode"].ToString().ToUpper(),
                AirlineName = e["AirlineName"].ToString().ToUpper(),
                //CityCode = e["CityCode"].ToString(),//foriegn key
                CurrencyCode = e["CurrencyCode"].ToString(),
                Active = e["Active"].ToString()
            });
            ds.Dispose();
            return new DataSourceResult
            {
                Data = AirlineList.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
            };
        }
       [AcceptVerbs("POST")]
        public string POSTAirline( string value)
        {
            int ret = 0;
            SqlParameter[] Parameters = { new SqlParameter("@Value", value) };
            ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateTestDhir", Parameters);
            if (ret > 0)
            {
            }
            else
            {
            }
            return ret.ToString();

        }
       
        /// <summary>
        /// Save the Entity into the database
        /// </summary>
        /// <param 
        /// name="Airline">object of the Entity</param>
       [AcceptVerbs("POST")]
        public List<string> SaveAirline(List<Airline> Airline)
        {
            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
            DataTable dtCreateAirline = CollectionHelper.ConvertTo(Airline, "Active,Text_CityCode,Text_CurrencyCode,CreatedByName,UpdatedByName,DimensionAtBooking,PerPieceChecked,DimensionAtHandover,CustomerCreation");
            BaseBusiness baseBusiness = new BaseBusiness();

            if (!baseBusiness.ValidateBaseBusiness("Airline", dtCreateAirline, "SAVE"))
            {
                ErrorMessage = baseBusiness.ErrorMessage;
                return ErrorMessage;
            }

            SqlParameter param = new SqlParameter();
            param.ParameterName = "@AirlineTable";
            param.SqlDbType = System.Data.SqlDbType.Structured;
            param.Value = dtCreateAirline;
            SqlParameter[] Parameters = { param };
            int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateAirline", Parameters);
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    //For Customised Validation Messages like 'Record Already Exists' etc
                    string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Airline");
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



        /// <summary>
        /// Update the Entity into the database
        /// </summary>
        /// <param name="Airline">list of airline to be updated</param>
         [AcceptVerbs("PUT")]
        public List<string> UpdateAirline(List<Airline> Airline)
        {
            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
            DataTable dtCreateAirline = CollectionHelper.ConvertTo(Airline, "Active,Text_CityCode,Text_CurrencyCode,CreatedByName,UpdatedByName,DimensionAtBooking,PerPieceChecked,DimensionAtHandover,CustomerCreation");
            BaseBusiness baseBusiness = new BaseBusiness();

            if (!baseBusiness.ValidateBaseBusiness("Airline", dtCreateAirline, "UPDATE"))
            {
                ErrorMessage = baseBusiness.ErrorMessage;
                return ErrorMessage;
            }
            SqlParameter param = new SqlParameter();
            param.ParameterName = "@AirlineTable";
            param.SqlDbType = System.Data.SqlDbType.Structured;
            param.Value = dtCreateAirline;
            SqlParameter[] Parameters = { param };
            int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateAirline", Parameters);
            if (ret > 0)
            {
                if (ret > 1000)
                {
                    //For Customised Validation Messages like 'Record Already Exists' etc
                    string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Airline");
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
        /// <summary>
        /// delete the perticular Airline touple
        /// </summary>
        /// <param name="RecordID">Id of that Airline touple</param>
        public List<string> DeleteAirline(List<string> listID)
        {
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBussiness = new BaseBusiness();
            if (listID.Count > 0)
            {
                string RecordId = listID[0].ToString();
                string UserId = listID[1].ToString();
                SqlParameter[] Parameters = { new SqlParameter("@AirlineCode", RecordId), new SqlParameter("@UserID", Convert.ToInt32(UserId)) };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteAirline", Parameters);

                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "Airline");
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


        public DataSourceResult GetCurrency(String CityCode)
        {
            List<String> cur = new List<String>();
            SqlParameter[] Parameters = { new SqlParameter("@CityCode", CityCode) };
            SqlDataReader dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordCurrencyCity", Parameters);
            if (dr.Read())
            {
                cur.Add(dr["CurrencyCode"].ToString());
                cur.Add(dr["CurrencyName"].ToString());
            }
            return new DataSourceResult
            {
                Data = cur,
                Total = cur.Count()
            };
        }
    }

}
