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
    public class StockAWBService : SignatureAuthenticate, IStockAWBService
    {
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {

            string sorts = GridSort.ProcessSorting(sort);
            string filters = GridFilter.ProcessFilters<StockManagement>(filter);
            DataSet ds = new DataSet();
            IEnumerable<StockManagement> airportList = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters.Replace("CreatedOn", "CreatedOnSearch")), new SqlParameter("@OrderBy", sorts),
                                                new SqlParameter("@UserSNo",Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))};
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListStockNew", Parameters);
                if (ds.Tables.Count > 1 && ds.Tables != null)
                {
                    airportList = ds.Tables[0].AsEnumerable().Select(e => new StockManagement
                   {
                       //SNo = Convert.ToInt32(e["SNo"].ToString()),
                       AWBPrefix = e["AWBPrefix"].ToString().ToUpper(),
                       TotalStock = Convert.ToInt32(e["TotalStock"]),
                        UnIssuedStock = Convert.ToInt32(e["UnIssuedStock"]),
                        UnusedStock = Convert.ToInt32(e["UnusedStock"]),
                       TotalIssueStock = Convert.ToInt32(e["TotalIssueStock"]),
                       TotalAgentIssueStock = Convert.ToInt32(e["TotalAgentIssueStock"]),
                       //CityCode = e["City"].ToString().ToUpper(),
                       //OfficeName = e["Office"].ToString().ToUpper(),
                       AWBType = e["AWBType"].ToString().ToUpper(),
                       Text_IsAutoAWB = e["Text_IsAutoAWB"].ToString().ToUpper(),
                       AWBNo = e["AWBNo"].ToString().ToUpper(),
                       LotNo = e["LotNo"].ToString().ToUpper(),
                       // CreatedOn = DateTime.SpecifyKind(Convert.ToDateTime(e["CreatedOn"]), DateTimeKind.Utc),
                       CreatedBy = e["CreatedBy"].ToString().ToUpper(),


                   });
                    ds.Dispose();

                }

                return new DataSourceResult
                {
                    //return new KeyValuePair<string, List<BindFAASectionAWBInformation>>("Record not Found", Enumerable.Empty<BindFAASectionAWBInformation>().ToList<BindFAASectionAWBInformation>());
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
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetListStockNew"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }

        public DataSourceResult GetMaxAWBNumber(string AWBPrefix, string AWBType, string IsAutoAWB, string CountryCode, DateTime ExpiryDate)
        {

            List<String> MaxAWB = new List<String>();
            try
            {
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
                dr.Close();
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

        }

        public DataSourceResult GenerateStock(string AWBPrefix, string AWBType, string IsAutoAWB)
        {
            List<String> MaxAWB = new List<String>();

            try
            {
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
                dr.Close();
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
        }

        public List<StockCollection> CreateStock(List<AwbNo> AwbList, string AWBPrefix, int AWBType, int IsAutoAWB, int CountryCode, string ExpiryDate)
        {
            //decimal MinimumRecords = 1000;
            List<StockCollection> listStockCollection = new List<StockCollection>();
            List<DuplicateStock> lstDuplicate = new List<DuplicateStock>();
            DataSet ds = new DataSet();
            //string AWBPrefix = Convert.ToString(AwbList[0].AWBPrefix);
            //int AWBType = Convert.ToInt32(AwbList[0].AWBType);
            //int IsAutoAWB = Convert.ToInt32(AwbList[0].IsAutoAWB);
            //int CountryCode = Convert.ToInt32(AwbList[0].CountryCode);
            try
            {
                //DateTime ExpiryDateStock = Convert.ToDateTime(ExpiryDate);
                int TotalRecords = AwbList.Count;
                if (TotalRecords <= 100000)
                {
                    GetStockList(AwbList, AWBPrefix, AWBType, IsAutoAWB, CountryCode, ExpiryDate, ds, listStockCollection, lstDuplicate);
                }
                else
                {
                    int Count = Convert.ToInt32(Math.Ceiling(TotalRecords / 100000f));
                    List<AwbNo> lstAwbNo = new List<AwbNo>();
                    for (int i = 1; i <= Count; i++)
                    {
                        lstAwbNo.Clear();
                        for (int j = (i - 1) * 100000; j < (i * 100000); j++)
                        {
                            if (j < TotalRecords)
                            {
                                lstAwbNo.Add(new AwbNo() { AWBNo = AwbList[j].AWBNo });
                            }
                        }
                        GetStockList(lstAwbNo, AWBPrefix, AWBType, IsAutoAWB, CountryCode, ExpiryDate, ds, listStockCollection, lstDuplicate);
                    }
                }

                return listStockCollection;
            }
            catch(Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","Create Stock Function in Create Stock Page"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }
        private int GetStockList(List<AwbNo> lstAwbNo, string AWBPrefix, int AWBType, int IsAutoAWB, int CountryCode, string ExpiryDate, DataSet ds, List<StockCollection> listStockCollection, List<DuplicateStock> lstDuplicate)
        {
            int result = 0;
            try
            {
                DataTable dtcreateofficetarget = CollectionHelper.ConvertTo(lstAwbNo, "");
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@StockTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;


                if (dtcreateofficetarget.Rows.Count > 0)
                {
                    param.Value = dtcreateofficetarget;
                    SqlParameter[] Parameters = { param, 
                                              new SqlParameter("@AWBPrefix",AWBPrefix),
                                              new SqlParameter("@AWBType",AWBType),
                                              new SqlParameter("@IsAutoAWB",IsAutoAWB),
                                              new SqlParameter("@CreatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                              new SqlParameter("@CountryCode",CountryCode),
                                              new SqlParameter("@ExpiryDate",ExpiryDate)
                                            };
                    ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "CreateStock", Parameters);
                }
                if (ds.Tables.Count > 0 && ds.Tables != null)
                {
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
                    //lstDuplicate.Add(listAlradyCreatedStock.ToList());
                    // lstDuplicate.Add(new DuplicateStock() { DuplicateAWBNo = listAlradyCreatedStock.ToList() });
                    listStockCollection.Add(stockCollection);
                    //----------------------------------------------------------------------------------------------------------------
                    DataTable dtLeftStock = CollectionHelper.ConvertTo(listLeftStock.ToList(), "Active");
                    result = saveStock(dtLeftStock, AWBPrefix, AWBType, IsAutoAWB, CountryCode, ExpiryDate); // Save Generated stock which is not alrady exist  
                }

                return result;
            }
            catch(Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","CreateStock"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
            //----------------------------------------------------------------------------------------------------------------
        }
        //public List<StockCollection> CreateStock(string strData, string AWBPrefix, int AWBType, int IsAutoAWB, int CountryCode, DateTime ExpiryDate)
        //{
        //    string strData1 = strData.Replace("A", "{@AWBNo@:@");
        //    string strData2 = strData1.Replace("@", "\"");
        //    List<string> ErrorMessage = new List<string>();
        //    BaseBusiness baseBusiness = new BaseBusiness();
        //    // convert JSON string into datatable
        //    var dtCreateStock = JsonConvert.DeserializeObject<DataTable>(strData2);

        //    SqlParameter param = new SqlParameter();
        //    param.ParameterName = "@StockTable";
        //    param.SqlDbType = System.Data.SqlDbType.Structured;
        //    DataSet ds = new DataSet();

        //    if (dtCreateStock.Rows.Count > 0)
        //    {
        //        param.Value = dtCreateStock;
        //        SqlParameter[] Parameters = { param, 
        //                                      new SqlParameter("@AWBPrefix",AWBPrefix),
        //                                      new SqlParameter("@AWBType",AWBType),
        //                                      new SqlParameter("@IsAutoAWB",Convert.ToInt32(IsAutoAWB)),
        //                                      new SqlParameter("@CreatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
        //                                    new SqlParameter("@CountryCode",CountryCode),
        //                                    new SqlParameter("@ExpiryDate",ExpiryDate),};
        //        ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "CreateStock", Parameters);
        //    }
        //    var listAlradyCreatedStock = ds.Tables[0].AsEnumerable().Select(e => new AlradyCreatedStock
        //    {
        //        AWBNo = e["AWBNumber"].ToString()
        //    });
        //    var listLeftStock = ds.Tables[1].AsEnumerable().Select(e => new LeftStock
        //    {
        //        AWBNo = e["AWBNumber"].ToString()
        //    });
        //    StockCollection stockCollection = new StockCollection
        //    {
        //        alradyCreatedStock = listAlradyCreatedStock.ToList(),
        //        leftStock = listLeftStock.ToList(),
        //    };
        //    List<StockCollection> listStockCollection = new List<StockCollection>();
        //    listStockCollection.Add(stockCollection);
        //    //----------------------------------------------------------------------------------------------------------------
        //    DataTable dtLeftStock = CollectionHelper.ConvertTo(listLeftStock.ToList(), "Active");
        //    int result = saveStock(dtLeftStock, AWBPrefix, AWBType, IsAutoAWB, CountryCode, ExpiryDate); // Save Generated stock which is not alrady exist  

        //    //----------------------------------------------------------------------------------------------------------------
        //    return listStockCollection;

        //}

        public int saveStock(DataTable dtLeftStock, string AWBPrefix, int AWBType, int IsAutoAWB, int CountryCode, string ExpiryDate)
        {
            int ret = 0;
            try
            {
                int? CitySNo = null;
                int? OfficeSNo = null;
                DateTime CreatedOn = DateTime.Now;

                SqlParameter param1 = new SqlParameter();
                param1.ParameterName = "@StockTable";
                param1.SqlDbType = System.Data.SqlDbType.Structured;
                //param1.Value = DtStock;
                param1.Value = dtLeftStock;
                int GroupSNo = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).GroupSNo;

                SqlParameter[] Parameters1 = { param1,
                                                       new SqlParameter("@AWBPrefix",AWBPrefix),
                                                       new SqlParameter("@AWBType",AWBType),
                                                       new SqlParameter("@IsAutoAWB",Convert.ToInt32(IsAutoAWB)),
                                                       new SqlParameter("@CreatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                                       new SqlParameter("@CountryCode",CountryCode),
                                                       new SqlParameter("@ExpiryDate",ExpiryDate), 
                                                       new SqlParameter("@CitySNo",CitySNo), 
                                                       new SqlParameter("@OfficeSNo",OfficeSNo), 
                                                        new SqlParameter("@CreatedOn",CreatedOn), 
                                             };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "SaveStock", Parameters1);

                return ret;
            }
            catch(Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","SaveStock"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }

        public List<IssueStockOfficeCollection> IssueStock(string strData, string AWBPrefix, int CitySNo, int OfficeSNo, string Remark, int NoOfAWB)
        {

            List<IssueStockOfficeCollection> listStockCollection = new List<IssueStockOfficeCollection>();
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
                                              new SqlParameter("@CreatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
                    ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "IssueStockToOffice", Parameters);
                }

                var listAlradyOfficeIssuedStock = ds.Tables[0].AsEnumerable().Select(e => new AlradyOfficeIssuedStock
                {
                    AWBNo = e["AWBNumber"].ToString()
                });
                var listLeftStock = ds.Tables[1].AsEnumerable().Select(e => new LeftStock
                {
                    AWBNo = e["AWBNumber"].ToString()
                });
                var listAWBLeftStock = ds.Tables[2].AsEnumerable().Select(e => new LeftAWBStock
                {
                    AWBNo = e["AWBNumber"].ToString()
                });
                IssueStockOfficeCollection stockCollection = new IssueStockOfficeCollection
                {
                    //alradyCreatedStock = listAlradyOfficeIssuedStock.ToList(),
                    leftStock = listLeftStock.ToList(),
                    leftAWBStock = listAWBLeftStock.ToList(),
                };

                listStockCollection.Add(stockCollection);

                return listStockCollection;

            }
            catch(Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","IssueStockToOffice"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }

        }

        public List<IssueStockOfficeCollection> IssueStocktoAgent(string strData, string AWBPrefix, int AccountSNo, int OfficeSNo, string Remark, int NoOfAWB, DateTime AutoRetrievalDate)
        {
            List<IssueStockOfficeCollection> listStockCollection = new List<IssueStockOfficeCollection>();
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
                    ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "IssueStockToAgentNew", Parameters);
                }

                var listAlradyOfficeIssuedStock = ds.Tables[0].AsEnumerable().Select(e => new AlradyOfficeIssuedStock
                {
                    AWBNo = e["AWBNumber"].ToString()
                });
                var listLeftStock = ds.Tables[1].AsEnumerable().Select(e => new LeftStock
                {
                    AWBNo = e["AWBNumber"].ToString()
                });
                var listAWBLeftStock = ds.Tables[2].AsEnumerable().Select(e => new LeftAWBStock
                {
                    AWBNo = e["AWBNumber"].ToString()
                });
                IssueStockOfficeCollection stockCollection = new IssueStockOfficeCollection
                {
                    alradyCreatedStock = listAlradyOfficeIssuedStock.ToList(),
                    leftStock = listLeftStock.ToList(),
                    leftAWBStock = listAWBLeftStock.ToList(),
                };

                listStockCollection.Add(stockCollection);

                return listStockCollection;
            }
            catch(Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","IssueStockToAgentNew"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
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
                    stockManagement.Text_AWBPrefix = dr["Text_AWBPrefix"].ToString();
                    stockManagement.CreatedOn = Convert.ToDateTime(dr["CreatedOn"].ToString());
                    stockManagement.OfficeIssueDate = Convert.ToDateTime(dr["OfficeIssueDate"].ToString());
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

                return stockManagement;
            }
            catch(Exception ex)// (Exception ex)
            {
                // do something for error
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

        public List<IssuedOfficeStock> GetReIssue(int StockSNo)
        {
            IEnumerable<IssuedOfficeStock> listLeftStock = null;
            try
            {
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBusiness = new BaseBusiness();
                DataSet ds = new DataSet();
                SqlParameter[] Parameters = { new SqlParameter("@StockSNo", StockSNo) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "GetCreatedStockNew", Parameters);


                listLeftStock = ds.Tables[0].AsEnumerable().Select(e => new IssuedOfficeStock
               {
                   AWBNo = e["AWBNumber"].ToString(),
                   AWBPrefix = e["AWBPrefix"].ToString()
               });

                return listLeftStock.ToList();

            }
            catch(Exception ex)// (Exception ex)
            {
                // do something for error

                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetCreatedStockNew"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }

        }

        public List<IssuedOfficeStock> GetIssuedOfficeStock(int StockSNo)
        {
            IEnumerable<IssuedOfficeStock> listLeftStock = null;
            try
            {
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBusiness = new BaseBusiness();
                DataSet ds = new DataSet();
                SqlParameter[] Parameters = { new SqlParameter("@StockSNo", StockSNo) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "GetOfficeIssuedStockNew", Parameters);


                listLeftStock = ds.Tables[0].AsEnumerable().Select(e => new IssuedOfficeStock
               {
                   AWBNo = e["AWBNumber"].ToString(),
                   CitySNo = Convert.ToInt32(e["CitySNo"].ToString()),
                   Text_City = e["Text_City"].ToString(),
                   OfficeSNo = Convert.ToInt32(e["OfficeSNo"].ToString()),
                   Text_Office = e["Text_Office"].ToString(),
                   AWBPrefix = e["AWBPrefix"].ToString()
               });


                return listLeftStock.ToList();
            }
            catch(Exception ex)// (Exception ex)
            {
                // do something for error

                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetOfficeIssuedStockNew"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }

        }

        public List<LeftStock> GetIssueStock(string AWBPrefix, int AWBType, int IsAutoAWB, int CitySNo, int OfficeSNo)
        {
            IEnumerable<LeftStock> listLeftStock = null;
            try
            {
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBusiness = new BaseBusiness();
                DataSet ds = new DataSet();

                if (CitySNo > 0)
                {
                    SqlParameter[] Parameters = {  new SqlParameter("@AWBPrefix",AWBPrefix),
                                              new SqlParameter("@AWBType",AWBType),
                                              new SqlParameter("@IsAutoAWB",IsAutoAWB),
                                              new SqlParameter("@CitySNo",CitySNo),
                                              new SqlParameter("@OfficeSNo",OfficeSNo)
                                           };
                    ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "GetIssueStock", Parameters);
                }

                listLeftStock = ds.Tables[0].AsEnumerable().Select(e => new LeftStock
               {
                   AWBNo = e["AWBNo"].ToString()
               });

                return listLeftStock.ToList();
            }
            catch(Exception ex)// (Exception ex)
            {
                // do something for error

                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetIssueStock"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }


        public string GetCityofficeInformation(string CitySNo)
        {
            DataSet ds = new DataSet();

            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@CitySNo", CitySNo) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetCityofficeInformation", Parameters);
                ds.Dispose();

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
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
        }



        public string Getofficelist(string OfficeSNo)
        {

            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@OfficeSNo", OfficeSNo) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "Getofficelist", Parameters);
                ds.Dispose();

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
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
        }

        //aded for check stock by anmol
        public string GetCheckStockAwb(string AwbNo)
        {

            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@awbno", AwbNo) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "CheckStockAwb", Parameters);
                ds.Dispose();

                //  return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
                return ds.Tables[0].Rows[0][0].ToString();
            }
            catch(Exception ex)// (Exception ex)
            {
                // do something for error

                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","CheckStockAwb"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }
        //end
        public string CountAlreadyIssuedStock(string AWBPrefix, string IsAutoAWB, string AWBType, string CitySNo, string OfficeSNo, string AccountSNo, string WhereCondition)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = {
                                                new SqlParameter("@AWBPrefix", AWBPrefix) ,
                                                new SqlParameter("@IsAutoAWB", IsAutoAWB) ,
                                                new SqlParameter("@AWBType", AWBType) ,
                                                new SqlParameter("@CitySNo", CitySNo) ,
                                                new SqlParameter("@OfficeSNo", OfficeSNo) ,
                                                new SqlParameter("@AccountSNo", AccountSNo) ,
                                                new SqlParameter("@WhereCondition", WhereCondition) ,
                                            };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spStockAWb_CountAlreadyIssuedStock", Parameters);
                ds.Dispose();

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)// (Exception ex)
            {
                // do something for error

                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spStockAWb_CountAlreadyIssuedStock"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }


        public string CountAlreadyIssuedStockForAccount(string AWBPrefix, string IsAutoAWB, string AWBType, string CitySNo, string OfficeSNo, string AccountSNo, string WhereCondition)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = {
                                                new SqlParameter("@AWBPrefix", AWBPrefix) ,
                                                new SqlParameter("@IsAutoAWB", IsAutoAWB) ,
                                                new SqlParameter("@AWBType", AWBType) ,
                                                new SqlParameter("@CitySNo", CitySNo) ,
                                                new SqlParameter("@OfficeSNo", OfficeSNo) ,
                                                new SqlParameter("@AccountSNo", AccountSNo) ,
                                                new SqlParameter("@WhereCondition", WhereCondition) ,
                                            };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spStockAWb_CountAlreadyIssuedStockForAccount", Parameters);
                ds.Dispose();

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)// (Exception ex)
            {
                // do something for error

                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spStockAWb_CountAlreadyIssuedStockForAccount"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }


    }
}
