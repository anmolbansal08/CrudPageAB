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
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Model.Master;
using CargoFlash.Cargo.Business;
using System.Net;

namespace CargoFlash.Cargo.DataService.Master
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class AirlineAuctionService : SignatureAuthenticate, IAirlineAuctionService
    {
        public AirlineAuction GetAirlineAuctionRecord(string recordID, string UserID)
        {
            try
            {
                AirlineAuction airlineAuction = new AirlineAuction();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@UserID", Convert.ToInt32(UserID)) };
                SqlDataReader dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordAirlineAuction", Parameters);
                if (dr.Read())
                {
                    airlineAuction.SNo = Convert.ToInt32(dr["SNo"]);
                    airlineAuction.AuctionRate = Convert.ToDouble(dr["AuctionRate"]);
                    airlineAuction.CurrencyCode = dr["CurrencyCode"].ToString();
                    airlineAuction.Text_CurrencyCode = dr["CurrencyCode"].ToString();
                    airlineAuction.AuctionName = dr["AuctionName"].ToString();
                    airlineAuction.CutoffTime = Convert.ToInt32(dr["CutoffTime"]);
                    airlineAuction.TotalBucketSpace = Convert.ToDouble(dr["TotalBucketSpace"]);
                    airlineAuction.FlightNo = dr["FlightNo"].ToString();
                    airlineAuction.Origin = dr["Origin"].ToString();
                    airlineAuction.Text_Origin = dr["CityCode"].ToString();
                    airlineAuction.Destination = dr["Destination"].ToString();
                    airlineAuction.Text_Destination = dr["CityCode"].ToString();
                    airlineAuction.ValidFrom = Convert.ToDateTime(dr["ValidFrom"]);
                    airlineAuction.ValidTo = Convert.ToDateTime(dr["ValidTo"]);
                    airlineAuction.ApprovedBy = Convert.ToInt32(dr["ApprovedBy"]);
                    airlineAuction.Text_ApprovedBy = dr["UserName"].ToString();
                    airlineAuction.ApprovedOn = Convert.ToDateTime(dr["ApprovedOn"]);
                    airlineAuction.CreatedBy = dr["CreatedUser"].ToString();
                    airlineAuction.UpdatedBy = dr["UpdatedUser"].ToString();
                }
                dr.Close();
                return airlineAuction;
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
                string filters = GridFilter.ProcessFilters<AirlineAuction>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListAirlineAuction", Parameters);

                var AirlineList = ds.Tables[0].AsEnumerable().Select(e => new AirlineAuction
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    AuctionName = e["AuctionName"].ToString().ToUpper(),
                    CurrencyCode = e["CurrencyCode"].ToString().ToUpper(),
                    //Text_CustomerSNo = e["CustomerName"].ToString(),
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = AirlineList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }
        public List<string> SaveAirlineAuction(List<AirlineAuction> AirlineAuction)
        {
            //validate Business Rule
            List<string> ErrorMessage = new List<string>();
            //DataTable dtCreateAirlineAuction = CollectionHelper.ConvertTo(AirlineAuction, "Text_CurrencyCode, Text_Origin, Text_Destination, Text_ApprovedBy");



            ////validate Business Rule
            //int returnValue = 0;
            try
            {
                DataTable dtCreateAirline = CollectionHelper.ConvertTo(AirlineAuction, "Text_CurrencyCode, Text_Origin, Text_Destination, Text_ApprovedBy");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("AirlineAuction", dtCreateAirline, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                string[] columnRemoved = new string[] { "Text_CurrencyCode", "Text_Origin", "Text_Destination", "Text_ApprovedBy" };
                foreach (var item in columnRemoved)
                {
                    if (dtCreateAirline.Columns.Contains(item))
                    {
                        dtCreateAirline.Columns.Remove(item);
                    }
                }
                columnRemoved = null;
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@AirlineAuctionTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateAirline;
                SqlParameter[] Parameters = { param };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateAirlineAuction", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "AirlineAuction");
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

        public List<string> UpdateAirlineAuction(List<AirlineAuction> AirlineAuction)
        {
            //validate Business Rule
            try
            {
                List<string> ErrorMessage = new List<string>();
                DataTable dtCreateAirlineAuction = CollectionHelper.ConvertTo(AirlineAuction, "");
                BaseBusiness baseBusiness = new BaseBusiness();
                if (!baseBusiness.ValidateBaseBusiness("AirlineAuction", dtCreateAirlineAuction, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }

                ////validate Business Rule
                //int returnValue = 0;
                DataTable dtCreateAirline = CollectionHelper.ConvertTo(AirlineAuction, "Text_CurrencyCode,Text_Origin,Text_Destination,Text_ApprovedBy");
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@AirlineAuctionTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateAirline;
                SqlParameter[] Parameters = { param };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateAirlineAuction", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "AirlineAuction");
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

        public List<string> DeleteAirlineAuction(List<string> listID)
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
                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteAirlineAuction", Parameters);

                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AirlineAuction");
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

