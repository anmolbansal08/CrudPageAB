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
using System.ServiceModel.Web;
using System.Net;


namespace CargoFlash.Cargo.DataService.Stock
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class ReturnFromAccountService : SignatureAuthenticate, IReturnFromAccountService
    {
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            string sorts = GridSort.ProcessSorting(sort);
            string filters = GridFilter.ProcessFilters<StockManagement>(filter);

            DataSet ds = new DataSet();
            IEnumerable<StockManagement> airportList = null;

            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) ,
                new System.Data.SqlClient.SqlParameter("@OfficeSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())};
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetReturnToAgentStockList", Parameters);

                if (ds.Tables.Count > 1 && ds.Tables != null)
                {
                    airportList = ds.Tables[0].AsEnumerable().Select(e => new StockManagement
                   {
                       SNo = Convert.ToInt32(e["SNo"].ToString()),
                       AWBPrefix = e["AWBPrefix"].ToString().ToUpper(),
                       TotalIssueStock = Convert.ToInt32(e["TotalIssueStock"]),
                       AWBType = e["AWBType"].ToString().ToUpper(),
                       Text_IsAutoAWB = e["Text_IsAutoAWB"].ToString().ToUpper(),
                       AgentName = e["AgentName"].ToString().ToUpper(),
                       AgentCity = e["AgentCity"].ToString().ToUpper(),
                       AccountIssueDate = e["AccountIssueDate"].ToString(),
                       CreatedOn = Convert.ToDateTime(e["CreatedOn"].ToString().ToUpper()),
                       CreatedBy = e["CreatedBy"].ToString().ToUpper(),
                       LotNo = e["Lotno"].ToString().ToUpper(),


                    });
                    ds.Dispose();
                }

                return new DataSourceResult
                {
                    //Data = airportList.AsQueryable().ToList(),
                    //Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                    Data = ds.Tables.Count > 1 ? airportList.AsQueryable().ToList() : Enumerable.Empty<StockManagement>().ToList<StockManagement>(),
                    Total = ds.Tables.Count > 1 ? Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()) : 0
                };
            }
            catch(Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetReturnToAgentStockList"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }

        public List<LeftStock> ReturnStockFromAccount(string strData, string AWBPrefix, int NoOfAWB, string StockType, int CitySNo, int OfficeSNo,int Type)
        {
            IEnumerable<LeftStock> listLeftStock = null;
            try
            {

                strData = CargoFlash.Cargo.Business.Common.Base64ToString(strData);
                string strData1 = strData.Replace("A", "{@AWBNo@:@");
                string strData2 = strData1.Replace("@", "\"");

                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBusiness = new BaseBusiness();
                // convert JSON string into datatable
                var dtCreateStock = JsonConvert.DeserializeObject<DataTable>(strData2);

                SqlParameter param = new SqlParameter();
                param.ParameterName = "@StockTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                DataSet ds = new DataSet();

                if (dtCreateStock.Rows.Count > 0)
                {
                    param.Value = dtCreateStock;
                    SqlParameter[] Parameters = { param, 
                                              new SqlParameter("@AWBPrefix",AWBPrefix),
                                              new SqlParameter("@NoOfAWB",NoOfAWB),
                                              new SqlParameter("@CreatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                  new SqlParameter("@StockType",StockType),
                                  new SqlParameter("@CitySNo",CitySNo),
                                  new SqlParameter("@OfficeSNo",OfficeSNo),
                                   new SqlParameter("@Type",Type)
                                                };
                    ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "ReturnStockFromAccount", Parameters);
                }
                if (ds.Tables.Count > 0 && ds.Tables != null)
                {

                    listLeftStock = dtCreateStock.AsEnumerable().Take(NoOfAWB).Select(e => new LeftStock
                   {
                       AWBNo = e["AWBNo"].ToString()
                   });
                }

                return listLeftStock.ToList();
            }
            catch(Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","ReturnStockFromAccount"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }

        public StockManagement GetReturnFromAccountRecord(string recordID, string UserID)
        {

            StockManagement stockManagement = new StockManagement();
            SqlDataReader dr = null;
            try
            {
                int number = 0;
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), new SqlParameter("@UserID", Convert.ToInt32(UserID)) };
                dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordStock", Parameters);
                if (dr.Read())
                {
                    stockManagement.SNo = Convert.ToInt32(dr["SNo"]);
                    stockManagement.IsAutoAWB = dr["IsAutoAWB"].ToString();
                    stockManagement.Text_IsAutoAWB = dr["Text_IsAutoAWB"].ToString();
                    stockManagement.AWBPrefix = dr["AWBPrefix"].ToString();
                    stockManagement.AWBType = dr["Text_AWBType"].ToString();
                    stockManagement.Text_AWBType = dr["Text_AWBType"].ToString();
                    stockManagement.Text_AWBPrefix = dr["Text_AWBPrefix"].ToString();
                    stockManagement.CreatedOn = Convert.ToDateTime(dr["CreatedOn"].ToString());
                    stockManagement.OfficeIssueDate = Convert.ToDateTime(dr["AccountIssueDate"].ToString());


                }
                dr.Close();
                return stockManagement;
            }
            catch(Exception ex)// (Exception ex)
            {
                dr.Close();
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetRecordStock"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }

        public string GetIssuedAccountStock(int StockSNo)
        {
            IEnumerable<IssuedOfficeStock> listLeftStock = null;
            try
            {
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBusiness = new BaseBusiness();
                DataSet ds = new DataSet();
                SqlParameter[] Parameters = { new SqlParameter("@StockSNo", StockSNo) ,
                 new SqlParameter("@usersno",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "GetAccountIssuedStock", Parameters);

                //if (ds.Tables.Count > 0 && ds.Tables != null)
                //{
                //    listLeftStock = ds.Tables[0].AsEnumerable().Select(e => new IssuedOfficeStock
                //   {
                //       AWBPrefix = e["AWBPrefix"].ToString(),
                //       AWBNo = e["AWBNumber"].ToString(),
                //       CitySNo = Convert.ToInt32(e["CitySNo"].ToString()),
                //       Text_City = e["Text_City"].ToString(),
                //       OfficeSNo = Convert.ToInt32(e["OfficeSNo"].ToString()),
                //       Text_Office = e["Text_Office"].ToString(),
                //       AccountSNo = Convert.ToInt32(e["AccountSNo"].ToString()),
                //       Text_Account = e["Text_Account"].ToString()
                //   });
                //}

                //return listLeftStock.ToList();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)// (Exception ex)
            {

                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetAccountIssuedStock"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }

        public List<IssuedOfficeStock> GetRecordOnReadOption(int StockSNo)
        {
            IEnumerable<IssuedOfficeStock> listLeftStock = null;
            try
            {
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBusiness = new BaseBusiness();
                DataSet ds = new DataSet();
                SqlParameter[] Parameters = { new SqlParameter("@StockSNo", StockSNo) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "GetRecordOnReadOption", Parameters);
                if (ds.Tables.Count > 0 && ds.Tables != null)
                {
                    listLeftStock = ds.Tables[0].AsEnumerable().Select(e => new IssuedOfficeStock
                   {
                       AWBPrefix = e["AWBPrefix"].ToString(),
                       AWBNo = e["AWBNumber"].ToString(),
                       CitySNo = Convert.ToInt32(e["CitySNo"].ToString()),
                       Text_City = e["Text_City"].ToString(),
                       OfficeSNo = Convert.ToInt32(e["OfficeSNo"].ToString()),
                       Text_Office = e["Text_Office"].ToString(),
                       AccountSNo = Convert.ToInt32(e["AccountSNo"].ToString()),
                       Text_Account = e["Text_Account"].ToString()
                   });
                }
                return listLeftStock.ToList();
            }
            catch(Exception ex)// (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetRecordOnReadOption"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }
    }
}
