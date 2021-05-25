using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using CargoFlash.Cargo.Model.Stock;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using Newtonsoft.Json;
using System.Net;
using System.ServiceModel.Web;

namespace CargoFlash.Cargo.DataService.Stock
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class AWBStockService : SignatureAuthenticate, IAWBStockService
    {
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<AWBStock>(filter);
                //string _connectionStringName = ConfigurationManager.AppSettings.Get("DataProvider");
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListAWBStock", Parameters);
                var airportList = ds.Tables[0].AsEnumerable().Select(e => new AWBStock
                {
                    SNo = Convert.ToInt32(e["SNo"].ToString()),
                    AirlineName = e["AirlineName"].ToString().ToUpper(),
                    AWBSeries = e["AWBSeries"].ToString().ToUpper(),
                    IsAutoAWB = e["IsAutoAWB"].ToString().ToUpper(),
                    AWBType = e["AWBType"].ToString().ToUpper(),
                    Counts = Convert.ToInt16(e["Counts"]),
                    RemainingCount = Convert.ToInt16(e["RemainingCount"]),
                    BlackListed = Convert.ToInt16(e["BlackListed"]),
                    CreatedOn = Convert.ToDateTime(e["CreatedOn"].ToString().ToUpper()),
                    CreatedBy = e["CreatedBy"].ToString().ToUpper(),
                    ExpiryDate = Convert.ToDateTime(e["ExpiryDate"].ToString().ToUpper()),

                });

                ds.Dispose();
                return new DataSourceResult
                {
                    Data = airportList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public DataSourceResult GetMaxAWBNumber(string AWBPrefix, string AWBType, string IsAutoAWB, string CountryCode, DateTime ExpiryDate)
        {

            try
            {
                List<String> MaxAWB = new List<String>();
                SqlParameter[] Parameters = { new SqlParameter("@AWBPrefix", AWBPrefix), new SqlParameter("@AWBType", AWBType), new SqlParameter("@IsAutoAWB", IsAutoAWB), new SqlParameter("@CountryCode", CountryCode), new SqlParameter("@ExpiryDate", ExpiryDate) };
                SqlDataReader dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordMaxAWBNumber", Parameters);
                if (dr.Read())
                {
                    MaxAWB.Add(dr["AWBNumber"].ToString());
                }
                return new DataSourceResult
                {
                    Data = MaxAWB
                };
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public DataSourceResult GenerateStock(string AWBPrefix, string AWBType, string IsAutoAWB)
        {
            try
            {
                List<String> MaxAWB = new List<String>();
                SqlParameter[] Parameters = { new SqlParameter("@AWBPrefix", AWBPrefix), new SqlParameter("@AWBType", AWBType), new SqlParameter("@IsAutoAWB", IsAutoAWB) };
                SqlDataReader dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordMaxAWBNumber", Parameters);
                if (dr.Read())
                {
                    MaxAWB.Add(dr["AWBNumber"].ToString());
                }
                return new DataSourceResult
                {
                    Data = MaxAWB
                };
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public List<string> SaveAWBStock(List<AWBStock> AWBStock)
        {
            try
            {
                //validate Business Rule
                List<string> ErrorMessage = new List<string>();
                DataTable dtCreateAWBStock = CollectionHelper.ConvertTo(AWBStock, "");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("AWBStock", dtCreateAWBStock, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@AWBStockTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateAWBStock;
                SqlParameter[] Parameters = { param };
                //    new SqlParameter("@AWBPrefix",AWBStock[0].AWBPrefix),
                //               new SqlParameter("@AWBType",AWBStock[0].AWBTypeSNo),
                //               new SqlParameter("@IsAutoAWB",Convert.ToInt32(AWBStock[0].IsAutoAWBSNo)),
                //               new SqlParameter("@NoOfAWB",Convert.ToInt32(AWBStock[0].Counts)),
                //               new SqlParameter("@StartRange",Convert.ToInt32(AWBStock[0].StartRange)),
                //               new SqlParameter("@CreatedBy", AWBStock[0].CreatedBy),
                //new SqlParameter("@ExpiryDate", AWBStock[0].ExpiryDate),};
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "SaveAWBStock", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "AWBStock");
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

        //public List<string> CreateStock(int NoOfAWB,string StartRange, string AWBPrefix, int AWBType, int IsAutoAWB)
        //{
        //    int ret = 0;
        //    List<string> ErrorMessage = new List<string>();
        //    BaseBusiness baseBusiness = new BaseBusiness();

          

           
        //        SqlParameter[] Parameters1 = {         new SqlParameter("@AWBPrefix",AWBPrefix),
        //                                               new SqlParameter("@AWBType",AWBType),
        //                                               new SqlParameter("@IsAutoAWB",Convert.ToInt32(IsAutoAWB)),
        //                                               new SqlParameter("@NoOfAWB",Convert.ToInt32(NoOfAWB)),
        //                                               new SqlParameter("@StartRange",Convert.ToInt32(StartRange)),
        //                                               new SqlParameter("@CreatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
        //                                               };
        //        ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "SaveAWBStock", Parameters1);

        //        if (ret > 0)
        //        {
        //            if (ret > 1000)
        //            {
        //                //For Customised Validation Messages like 'Record Already Exists' etc
        //                string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "AWBStock");
        //                if (!string.IsNullOrEmpty(serverErrorMessage))
        //                    ErrorMessage.Add(serverErrorMessage);
        //            }
        //            else
        //            {

        //                //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
        //                string dataBaseExceptionMessage = baseBusiness.ReadServerErrorMessages(ret, baseBusiness.DatabaseExceptionFileName);
        //                if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
        //                    ErrorMessage.Add(dataBaseExceptionMessage);
        //            }
        //        }

        //        return ErrorMessage;
            
        //}

       
    }
}
