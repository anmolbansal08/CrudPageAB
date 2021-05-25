using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using CargoFlash.Cargo.Model.ULD;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using Newtonsoft.Json;
using System.ServiceModel.Web;
using System.Net;

namespace CargoFlash.Cargo.DataService.ULD
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]
    [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class ULDInventoryService : SignatureAuthenticate, IULDInventoryService
    {
        //public ULDInventory GetRecordULDInventory(string recordID, string UserID)
        //{
        //    ULDInventory uldInventory = new ULDInventory();
        //    SqlDataReader dr = null;
        //    try
        //    {
        //        SqlParameter[] Parameters = { new SqlParameter("@AirlineCode", recordID), new SqlParameter("@UserID", Convert.ToInt32(UserID)) };
        //        dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListULDInventory", Parameters);
        //        if (dr.Read())
        //        {

        //            uldInventory.ULDNo = Convert.ToInt32(dr["ULDNo"]);
        //            uldInventory.AirlineCode = Convert.ToString(dr["AirlineCode"]);
        //            uldInventory.AirlineName = Convert.ToString(dr["AirlineName"]);
        //            uldInventory.LoadedInSystem = Convert.ToString(dr["LoadedInSystem"]);
        //            uldInventory.Found = Convert.ToString(dr["Found"]);
        //            uldInventory.Damaged = Convert.ToString(dr["Damage"]);
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        dr.Close();
        //    }
        //    return uldInventory;
        //}

        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<ULDInventory>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page),
                                            new SqlParameter("@PageSize", pageSize),
                                            new SqlParameter("@WhereCondition", filters.Replace("InventoryDateSearch", "InventoryDate").Replace("InventoryTakenAtSearch", "InventoryTakenAt")), new SqlParameter("@OrderBy", sorts),
                                            new SqlParameter("@CityCode", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportCode.ToString()) ,
                                            new SqlParameter("@UserSno", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())};
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListULDInventory", Parameters);
                var ULDInventoryList = ds.Tables[0].AsEnumerable().Select(e => new ULDInventory
                {
                    SNo = Convert.ToInt32(e["SNo"].ToString()),
                    //InventoryDate = DateTime.Parse(e["InventoryDate"].ToString()),
                    InventoryDate = e["InventoryDate"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["InventoryDate"]), DateTimeKind.Utc),
                    AirlineName = e["AirlineName"].ToString().ToUpper(),
                    Station = e["Station"].ToString().ToUpper(),
                    InventoryTakenBy = e["InventoryTakenBy"].ToString().ToUpper(),
                    //InventoryTakenAt = DateTime.Parse(e["InventoryTakenAt"].ToString()),
                    InventoryTakenAt = e["InventoryTakenAt"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["InventoryTakenAt"]), DateTimeKind.Utc),
                    IsSCMSent = e["IsSCMSent"].ToString().ToUpper(),
                    IsScm = e["IsSCMMsg"].ToString().ToUpper()
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = ULDInventoryList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public KeyValuePair<string, List<ULDInventoryListValue>> GetULDInventoryRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                ULDInventoryListValue phyUldInventory = new ULDInventoryListValue();
                //string searchby = whereCondition.ToString();
                string[] searchULDInventory = whereCondition.Split('-');
                whereCondition = "";
                SqlParameter[] Parameters = { new SqlParameter("@AirlineSNo", recordID), new SqlParameter("@ULDLocationSNo", searchULDInventory[0])
                                            , new SqlParameter("@CityCode", searchULDInventory[4])
                                            , new SqlParameter("@ULDNo", searchULDInventory[1])
                                            , new SqlParameter("@IsLoadedInSystem", searchULDInventory[2]), new SqlParameter("@SearchULDType", searchULDInventory[3])
                                            , new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition)
                                            , new SqlParameter("@OrderBy", sort)
                                            , new SqlParameter("@UserSno", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                            , new SqlParameter("@SearchFound", searchULDInventory[5])};
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetULDInventoryRecord", Parameters);
                var ULDInventoryList = ds.Tables[0].AsEnumerable().Select(e => new ULDInventoryListValue
                {
                    RowSNo = Convert.ToInt32(e["RowSNo"]),
                    ULDStockSNo = Convert.ToInt32(e["ULDStockSNo"]),
                    AirlineCode = e["AirlineCode"].ToString(),
                    AirlineName = e["AirlineName"].ToString(),
                    ULDNo = e["ULDNo"].ToString(),
                    HdnULDType = e["HdnULDType"].ToString(),
                    ULDType = e["ULDType"].ToString(),
                    SerialNo = e["SerialNo"].ToString(),
                    OwnerCode = e["OwnerCode"].ToString(),
                    ULDLocation = e["ULDLocation"].ToString().ToUpper(),
                    IsLoadedInSystem = Convert.ToInt32(e["IsLoadedInSystem"]),
                    IsPhysicallyAvailable = Convert.ToBoolean(e["IsPhysicallyAvailable"]),
                    IsFound = Convert.ToInt32(e["IsFound"]),
                    HdnPageULDLocationValue = e["HdnPageULDLocationValue"].ToString(),
                    PageULDLocationValue = e["PageULDLocationValue"].ToString().ToUpper(),
                    IsDamaged = Convert.ToBoolean(e["IsDamaged"]),
                    IsServiceable = Convert.ToInt32(e["IsServiceable"]),
                    IsStatus = e["IsStatus"].ToString(),
                    CurrentStatus = e["CurrentStatus"].ToString()

                });
                return new KeyValuePair<string, List<ULDInventoryListValue>>(ds.Tables[1].Rows[0][0].ToString(), ULDInventoryList.AsQueryable().ToList());
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public List<Tuple<string, int>> SaveUpdateULDInventory(List<ULDInventoryListValue> lst)
        {
            try
            {

                string strDate = "";
                int ret = 0;
                List<Tuple<string, int>> ErrorMessage = new List<Tuple<string, int>>();
                BaseBusiness baseBussiness = new BaseBusiness();
                //var dtULDInventory = JsonConvert.DeserializeObject<DataTable>(strDate);
                DataTable dtULDInventory = CollectionHelper.ConvertTo(lst, "CurrentStatus");

                dtULDInventory.Columns.Remove("HdnUldLocation");
                dtULDInventory.Columns.Remove("LoadedInSystem");


                SqlParameter param = new SqlParameter();
                param.ParameterName = "@ULDInventoryTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                if (dtULDInventory.Rows.Count > 0)
                {
                    param.Value = dtULDInventory;
                    SqlParameter[] Parameters = { param, new SqlParameter("@CreatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                                new SqlParameter("@CityCode", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CityCode.ToString()) ,
                                                new SqlParameter("@CurrAirPortSno", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportSNo.ToString())
                                            };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateULDInventory", Parameters);
                    //  DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "SpUldinventory_email", Parameters);
                    // DataSet Get = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "SpUldinventory_email", Parameters);

                }
                if (1 > 0)
                {
                    if (ret == 547)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "ULDInventory");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(new Tuple<string, int>(serverErrorMessage, 0));
                    }
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "ULDInventory");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(new Tuple<string, int>(serverErrorMessage, 1));
                    }
                    else
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "ULDInventory");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(new Tuple<string, int>(serverErrorMessage, 0));
                    }
                }
                return ErrorMessage;
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public List<Tuple<string, int>> CreateUpdateULDInventory(string strDate)
        {
            try
            {
                int ret = 0;
                List<Tuple<string, int>> ErrorMessage = new List<Tuple<string, int>>();
                BaseBusiness baseBussiness = new BaseBusiness();
                var dtULDInventory = JsonConvert.DeserializeObject<DataTable>(strDate);
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@ULDInventoryTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                if (dtULDInventory.Rows.Count > 0)
                {
                    param.Value = dtULDInventory;
                    SqlParameter[] Parameters = { param, new SqlParameter("@CreatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                                new SqlParameter("@CityCode", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CityCode.ToString()) ,
                                              new SqlParameter("@CurrAirPortSno", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportSNo.ToString())
                                            };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateULDInventory", Parameters);
                }
                if (1 > 0)
                {
                    if (ret == 547)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "ULDInventory");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(new Tuple<string, int>(serverErrorMessage, 0));
                    }
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "ULDInventory");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(new Tuple<string, int>(serverErrorMessage, 1));
                    }
                    else
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "ULDInventory");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(new Tuple<string, int>(serverErrorMessage, 0));
                    }
                }
                return ErrorMessage;
            }

            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public string GetULDInventoryOverview(string AirlineCode, string SearchAirport, string UldLocationSNo, string CityCode)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AirlineCode", AirlineCode),new SqlParameter("@SearchAirport", SearchAirport), new SqlParameter("@UldLocationSNo", UldLocationSNo),
                                            new SqlParameter("@CityCode", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportCode.ToString()) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetULDInventoryOverview", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }


        //public string InitiateSCM(string AirlineCode, string SI1, string SI2)
        //{
        //    DataSet ds = new DataSet();
        //    try
        //    {
        //        SqlParameter[] Parameters = { new SqlParameter("@AirlineCode", AirlineCode), new SqlParameter("@CityCode", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CityCode.ToString()), new SqlParameter("@SI1", SI1), new SqlParameter("@SI2", SI2), new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
        //        ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "InitiateSCM", Parameters);
        //        ds.Dispose();
        //    }
        //    catch (Exception)
        //    {

        //    }
        //    return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        //}

        public int SaveSCM(Scm ObjSCM)
        {

            string SitaAddress = CargoFlash.Cargo.Business.Common.Base64ToString(ObjSCM.SitaAddress);
            string EmailAddress = CargoFlash.Cargo.Business.Common.Base64ToString(ObjSCM.EmailAddress);
            string SCMMessage = CargoFlash.Cargo.Business.Common.Base64ToString(ObjSCM.SCMMessage);


            try
            {
                SqlParameter param = new SqlParameter();

                SqlParameter[] Parameters = { new SqlParameter("@SitaAddress", SitaAddress), new SqlParameter("@EmailAddress", EmailAddress), new SqlParameter("@SCMMessage", SCMMessage), new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "SaveSCM", Parameters);
                return ret;
            }
            catch (Exception ex)
            {
                throw new WebFaultException<string>("Bad Request.", HttpStatusCode.BadRequest);
            }
        }

        public string GenerateANDSaveCIMPMessage(string AirlineCode, string SI1, string SI2)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AirlineCode", AirlineCode), new SqlParameter("@CityCode", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CityCode.ToString()), new SqlParameter("@SI1", SI1), new SqlParameter("@SI2", SI2), new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GenerateANDSaveCIMPMessage", Parameters);
                ds.Dispose();


                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public string GetInventoryReport(string ULDInventoryMasterSNo)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@ULDInventoryMasterSNo", ULDInventoryMasterSNo), new SqlParameter("@AirportCode", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportCode.ToString()) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetInventoryReport", Parameters);
                ds.Dispose();


                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public string GetGeneratedSCM(string AirlineCode)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AirlineCode", AirlineCode) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetGeneratedSCM", Parameters);
                ds.Dispose();


                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public string GetAirlineSNo(string AirlineCode)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AirlineCode", AirlineCode) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAirlineSNo", Parameters);
                ds.Dispose();

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public string CheckULDStaton(string ULDNo)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@ULDNo", ULDNo) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "SPCheckULDStaton", Parameters);
                ds.Dispose();

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public string GetScmMessage(string ID)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@ID", ID) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "SpGetScmMessage", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }

    }
  
}
