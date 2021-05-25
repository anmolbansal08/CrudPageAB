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
    public class StockManagementService : SignatureAuthenticate, IStockManagementService
    {
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            string sorts = GridSort.ProcessSorting(sort);
            string filters = GridFilter.ProcessFilters<StockManagement>(filter);
            DataSet ds = new DataSet();
            IEnumerable<StockManagement> airportList = null;

            try
            {

                //string _connectionStringName = ConfigurationManager.AppSettings.Get("DataProvider");
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters.Replace("CreatedOn", "CreatedOnSearch")), new SqlParameter("@OrderBy", sorts),
                new System.Data.SqlClient.SqlParameter("@OfficeSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).OfficeSNo.ToString())};
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListStock", Parameters);

                if (ds.Tables.Count > 1 && ds.Tables != null)
                {
                    airportList = ds.Tables[0].AsEnumerable().Select(e => new StockManagement
                {
                    SNo = Convert.ToInt32(e["SNo"].ToString()),
                    AWBPrefix = e["AWBPrefix"].ToString().ToUpper(),
                    TotalStock = Convert.ToInt32(e["TotalStock"]),
                    UnusedStock = Convert.ToInt32(e["UnusedStock"]),
                    TotalIssueStock = Convert.ToInt32(e["TotalIssueStock"]),
                    TotalAgentIssueStock = Convert.ToInt32(e["TotalAgentIssueStock"]),
                    //CityCode = e["City"].ToString().ToUpper(),
                    OfficeName = e["OfficeName"].ToString().ToUpper(),
                    OfficeCity = e["OfficeCity"].ToString().ToUpper(),             /*Added By Shivam for tfs id :- 16071     */
                    AWBNo = e["AWBNo"].ToString().ToUpper(),
                    LotNo = e["LotNo"].ToString().ToUpper(),
                    AWBType = e["AWBType"].ToString().ToUpper(),
                    Text_IsAutoAWB = e["Text_IsAutoAWB"].ToString().ToUpper(),
                    // CreatedOn = DateTime.SpecifyKind(Convert.ToDateTime(e["CreatedOn"]), DateTimeKind.Utc),
                    CreatedBy = e["CreatedBy"].ToString().ToUpper(),
                    AgentName = e["AgentName"].ToString().ToUpper()

                });
                    ds.Dispose();
                }
                else
                {

                }
            }
            catch(Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetListStock"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }

            return new DataSourceResult
            {
                //return new KeyValuePair<string, List<BindFAASectionAWBInformation>>("Record not Found", Enumerable.Empty<BindFAASectionAWBInformation>().ToList<BindFAASectionAWBInformation>());
                Data = ds.Tables.Count > 1 ? airportList.AsQueryable().ToList() : Enumerable.Empty<StockManagement>().ToList<StockManagement>(),
                Total = ds.Tables.Count > 1 ? Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString()) : 0
            };
        }

        public DataSourceResult GetMaxAWBNumber(string AWBPrefix, string AWBType, string IsAutoAWB, string CountryCode, DateTime ExpiryDate)
        {
            List<String> MaxAWB = new List<String>();
            SqlParameter[] Parameters = { new SqlParameter("@AWBPrefix", AWBPrefix), new SqlParameter("@AWBType", AWBType), new SqlParameter("@IsAutoAWB", IsAutoAWB), new SqlParameter("@CountryCode", CountryCode), new SqlParameter("@ExpiryDate", ExpiryDate) };
            try
            {
                SqlDataReader dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordMaxAWBNumber", Parameters);
                if (dr.Read())
                {
                    MaxAWB.Add(dr["AWBNumber"].ToString());
                }
            }
            catch(Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetRecordMaxAWBNumber"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
            return new DataSourceResult
            {
                Data = MaxAWB
            };
        }

        public DataSourceResult GenerateStock(string AWBPrefix, string AWBType, string IsAutoAWB)
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

        public List<StockCollection> CreateStock(string strData, string AWBPrefix, int AWBType, int IsAutoAWB, int CountryCode, DateTime ExpiryDate)
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
                                              new SqlParameter("@AWBType",AWBType),
                                              new SqlParameter("@IsAutoAWB",Convert.ToInt32(IsAutoAWB)),
                                              new SqlParameter("@CreatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                            new SqlParameter("@CountryCode",CountryCode),
                                            new SqlParameter("@ExpiryDate",ExpiryDate),};
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "CreateStock", Parameters);
            }
            var listAlradyCreatedStock = ds.Tables[0].AsEnumerable().Select(e => new AlradyCreatedStock
            {
                AWBNo = e["AWBNumber"].ToString()
            });
            var listLeftStock = ds.Tables[1].AsEnumerable().Select(e => new LeftStock
            {
                AWBNo = e["AWBNumber"].ToString()
            });
            StockCollection stockCollection = new StockCollection
            {
                alradyCreatedStock = listAlradyCreatedStock.ToList(),
                leftStock = listLeftStock.ToList(),
            };
            List<StockCollection> listStockCollection = new List<StockCollection>();
            listStockCollection.Add(stockCollection);
            //----------------------------------------------------------------------------------------------------------------
            DataTable dtLeftStock = CollectionHelper.ConvertTo(listLeftStock.ToList(), "Active");
            int result = saveStock(dtLeftStock, AWBPrefix, AWBType, IsAutoAWB, CountryCode, ExpiryDate); // Save Generated stock which is not alrady exist  

            //----------------------------------------------------------------------------------------------------------------
            return listStockCollection;

        }

        public int saveStock(DataTable dtLeftStock, string AWBPrefix, int AWBType, int IsAutoAWB, int CountryCode, DateTime ExpiryDate)
        {
            int ret = 0;
            List<string> ErrorMessage = new List<string>();
            BaseBusiness baseBusiness = new BaseBusiness();

            DataTable dtFinalStock = dtLeftStock;
            dtFinalStock.Columns.Add("ID", typeof(int));

            for (int i = 0; i < dtLeftStock.Rows.Count; i++)
            {
                dtFinalStock.Rows[i]["ID"] = i + 1;
            }

            int min = 1; int max = 100;
            int totalrow = 0;
            totalrow = (dtFinalStock.Rows.Count / 100);
            if (dtFinalStock.Rows.Count % 100 != 0)
                totalrow = totalrow + 1;

            for (int i = 0; i < totalrow; i++)
            {
                DataRow[] drFinalStock = dtFinalStock.Select("ID >= " + min + " AND ID <= " + max + "");
                min = min + 100;
                max = max + 100;

                DataTable DtStock = new DataTable();
                DtStock.Columns.Add("AWBNo", typeof(string));
                DtStock.Columns.Add("ID", typeof(int));
                drFinalStock.CopyToDataTable<DataRow>(DtStock, LoadOption.Upsert);
                DtStock.Columns.Remove("ID");

                SqlParameter param1 = new SqlParameter();
                param1.ParameterName = "@StockTable";
                param1.SqlDbType = System.Data.SqlDbType.Structured;
                param1.Value = DtStock;
                SqlParameter[] Parameters1 = { param1,
                                                       new SqlParameter("@AWBPrefix",AWBPrefix),
                                                       new SqlParameter("@AWBType",AWBType),
                                                       new SqlParameter("@IsAutoAWB",Convert.ToInt32(IsAutoAWB)),
                                                       new SqlParameter("@CreatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                                       new SqlParameter("@CountryCode",CountryCode),
                                                       new SqlParameter("@ExpiryDate",ExpiryDate), };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "SaveStock", Parameters1);

            }
            return ret;
        }

        public List<LeftStock> IssueStock(string strData, string AWBPrefix, int CitySNo, int OfficeSNo, string Remark, int NoOfAWB, DateTime AutoRetrievalDate)
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
                                              new SqlParameter("@CitySNo",CitySNo),
                                              new SqlParameter("@OfficeSNo",OfficeSNo),
                                              new SqlParameter("@Remark",Remark),
                                              new SqlParameter("@NoOfAWB",NoOfAWB),
                                               new SqlParameter("@AutoRetrievalDate",AutoRetrievalDate),
                                              new SqlParameter("@CreatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
                    ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "IssueStock", Parameters);
                }

                listLeftStock = dtCreateStock.AsEnumerable().Take(NoOfAWB).Select(e => new LeftStock
                {
                    AWBNo = e["AWBNo"].ToString()
                });

            }
            catch(Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","IssueStock"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
            return listLeftStock.ToList();

        }

        public List<LeftStock> IssueStocktoAgent(string strData, string AWBPrefix, int AccountSNo, int OfficeSNo, string Remark, int NoOfAWB, DateTime AutoRetrievalDate)
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
                                              new SqlParameter("@AccountSNo",AccountSNo),
                                              new SqlParameter("@OfficeSNo",OfficeSNo),
                                              new SqlParameter("@Remark",Remark),
                                              new SqlParameter("@NoOfAWB",NoOfAWB),
                                              new SqlParameter("@AutoRetrievalDate",AutoRetrievalDate),
                                              new SqlParameter("@CreatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
                    ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "IssueStockToAgent", Parameters);
                }

                listLeftStock = dtCreateStock.AsEnumerable().Take(NoOfAWB).Select(e => new LeftStock
               {
                   AWBNo = e["AWBNo"].ToString()
               });
            }
            catch(Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","IssueStockToAgent"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
            return listLeftStock.ToList();

        }

        public StockManagement GetStockManagementRecord(string recordID, string UserID)
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
                    stockManagement.AWBType = dr["AWBType"].ToString();
                    stockManagement.Text_AWBType = dr["Text_AWBType"].ToString();
                    stockManagement.Text_AWBPrefix = dr["Text_AWBPrefix"].ToString();
                    stockManagement.CreatedOn = Convert.ToDateTime(dr["CreatedOn"].ToString());
                    stockManagement.OfficeIssueDate = dr["OfficeIssueDate"].ToString() == "" ? (DateTime?)null : (DateTime?)Convert.ToDateTime(dr["OfficeIssueDate"].ToString());
                    //RateSurchargeCommodity.StartWeight = Convert.ToDecimal(dr["StartWeight"] == "" ? "0" : dr["StartWeight"]);
                    //RateSurchargeCommodity.EndWeight = Convert.ToDecimal(dr["EndWeight"] == "" ? "0" : dr["EndWeight"]);
                    //RateSurchargeCommodity.ValueType = Int32.TryParse(dr["ValueType"].ToString(), out number) ? number : 0;
                    //RateSurchargeCommodity.Text_ValueType = dr["ValueTypeName"].ToString();
                    //RateSurchargeCommodity.Text_CommoditySNo = dr["Text_CommoditySNo"].ToString();
                    //RateSurchargeCommodity.Text_CommoditySubGroupSNo = dr["Text_CommoditySubGroupSNo"].ToString();
                    //RateSurchargeCommodity.Value = Convert.ToDecimal(dr["Value"] == "" ? "0" : dr["Value"]);
                    //RateSurchargeCommodity.ValidFrom = Convert.ToDateTime(dr["ValidFrom"]);
                    //RateSurchargeCommodity.ValidTo = Convert.ToDateTime(dr["ValidTo"]);
                    //RateSurchargeCommodity.IsActive = Convert.ToBoolean(dr["IsActive"]);
                    //RateSurchargeCommodity.IsInternational = Convert.ToBoolean(dr["IsInternational"]);
                    //RateSurchargeCommodity.IsEditable = Convert.ToBoolean(dr["IsEditable"]);

                }
            }

            catch(Exception ex)// (Exception ex)
            {
                dr.Close();
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetRecordStock"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
            return stockManagement;
        }

        public List<LeftStock> GetReIssue(int StockSNo)
        {

            IEnumerable<LeftStock> listLeftStock = null;
            try
            {
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBusiness = new BaseBusiness();
                DataSet ds = new DataSet();
                SqlParameter[] Parameters = { new SqlParameter("@StockSNo", StockSNo) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "GetCreatedStock", Parameters);


                listLeftStock = ds.Tables[0].AsEnumerable().Select(e => new LeftStock
               {
                   AWBNo = e["AWBNumber"].ToString()
               });
            }
            catch(Exception ex)// (Exception ex)
            {

                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetCreatedStock"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
            return listLeftStock.ToList();

        }

        public List<IssuedOfficeStock> GetIssuedOfficeStock(int StockSNo)
        {
            IEnumerable<IssuedOfficeStock> listLeftStock = null;

            try
            {
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBusiness = new BaseBusiness();
                DataSet ds = new DataSet();
                SqlParameter[] Parameters = { new SqlParameter("@StockSNo", StockSNo)
                       ,new SqlParameter("@usersno",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "GetOfficeIssuedStock", Parameters);


                listLeftStock = ds.Tables[0].AsEnumerable().Select(e => new IssuedOfficeStock
               {
                   AWBNo = e["AWBNumber"].ToString(),
                   CitySNo = Convert.ToInt32(e["CitySNo"].ToString()),
                   Text_City = e["Text_City"].ToString(),
                   OfficeSNo = Convert.ToInt32(e["OfficeSNo"].ToString()),
                   Text_Office = e["Text_Office"].ToString(),
                   // AutoRetrievalDate = e["AutoRetrievalDate"] == DBNull.Value ? (DateTime?)DateTime.Now.AddMonths(1) : (DateTime?)e["AutoRetrievalDate"]
               });
            }
            catch(Exception ex)// (Exception ex)
            {

                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetOfficeIssuedStock"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
            return listLeftStock.ToList();

        }


        public string GetCityofficeInformation(string CitySNo)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@CitySNo", CitySNo) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetCityofficeInformation", Parameters);
                ds.Dispose();
            }
            catch(Exception ex)// (Exception ex)
            {

                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetCityofficeInformation"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }

        public string CountAlreadyIssuedStock(string StockSNo, string IsAutoAWB, string AWBType, string CitySNo, string OfficeSNo, string AccountSNo, string WhereCondition)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = {
                                                new SqlParameter("@StockSNo", StockSNo) ,
                                                new SqlParameter("@IsAutoAWB", IsAutoAWB) ,
                                                new SqlParameter("@AWBType", AWBType) ,
                                                new SqlParameter("@CitySNo", CitySNo) ,
                                                new SqlParameter("@OfficeSNo", OfficeSNo) ,
                                                new SqlParameter("@AccountSNo", AccountSNo) ,
                                                new SqlParameter("@WhereCondition", WhereCondition) ,
                                            };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spStockManagement_CountAlreadyIssuedStock", Parameters);
                ds.Dispose();
            }
            catch(Exception ex)// (Exception ex)
            {

                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spStockManagement_CountAlreadyIssuedStock"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }

        public string Getofficelist(string OfficeSNo)
        {

            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@OfficeSNo", OfficeSNo) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Getofficelist", Parameters);
                ds.Dispose();
            }
            catch(Exception ex)// (Exception ex)
            {

                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","Getofficelist"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }
    }
}
