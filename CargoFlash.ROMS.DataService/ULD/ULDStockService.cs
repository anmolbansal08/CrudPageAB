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
using System.Net;
using System.ServiceModel.Web;

namespace CargoFlash.Cargo.DataService.ULD
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]
    [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class ULDStockService : SignatureAuthenticate, IULDStockService
    {
        public ULDStock GetULDStockRecord(string recordID, string UserID)
        {
            BaseBusiness baseBusiness = new BaseBusiness();
            List<string> ErrorMessage = new List<string>();
            ULDStock uldStock = new ULDStock();
            SqlDataReader dr = null;
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID), 
                                            new SqlParameter("@UserSNo", UserID) 
                                            };
                dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordULDStock", Parameters);
                if (dr.Read())
                {
                    uldStock.SNo = Convert.ToInt32(dr["SNo"]);
                    uldStock.PurchaseDate = string.IsNullOrEmpty(dr["DateofPurchase"].ToString()) ? "" : Convert.ToDateTime(dr["DateofPurchase"]).ToString("dd-MMM-yyyy");
                    uldStock.City = Convert.ToString(dr["CurrentCityCode"]);
                    uldStock.CityCode = Convert.ToString(dr["CurrentCityCode"]);
                    uldStock.AirlineCode = Convert.ToString(dr["AirlineName"]);
                    uldStock.ULDType = Convert.ToString(dr["ULDType"]);
                    uldStock.ULDNo = Convert.ToString(dr["ULDNo"]);
                    uldStock.PurchaseFrom = Convert.ToString(dr["PurchasedFrom"]);
                    uldStock.Active = Convert.ToString(dr["Active"]);
                    uldStock.IsActive = Convert.ToString(dr["Active"]) == "YES" ? 0 : 1;
                    uldStock.Available = Convert.ToString(dr["Available"]);
                    uldStock.IsAvailable = Convert.ToString(dr["Available"]) == "YES" ? 0 : 1;
                    uldStock.PurchaseAt = dr["CityName"].ToString();
                    uldStock.OwnerCode = dr["OwnerCode"].ToString().ToUpper();
                    uldStock.Text_OwnershipSNo = dr["Ownership"].ToString();
                    uldStock.CreatedBy = dr["CreatedUser"].ToString();
                    uldStock.UpdatedBy = dr["UpdatedUser"].ToString();
                    uldStock.Damaged = dr["Damaged"].ToString();
                    uldStock.Serviceable = dr["Serviceable"].ToString();
                    uldStock.IsDamaged = Convert.ToString(dr["Damaged"]) == "YES" ? 0 : 1;
                    uldStock.IsServiceable = Convert.ToString(dr["Serviceable"]) == "YES" ? 0 : 1;
                    uldStock.Text_AirportSNo = Convert.ToString(dr["AirportName"]).ToUpper();
                    uldStock.EmptyWeight = Convert.ToDecimal(dr["EmptyWeight"]);
                    uldStock.Scrape = Convert.ToString(dr["Scrape"]) == "YES" ? 0 : 1;
                    uldStock.PurchasedPrice = Convert.ToDecimal(dr["PurchasedPrice"]);

                    uldStock.Text_ContentType = dr["Text_ContentType"].ToString().ToUpper();
                    uldStock.ContentType = (dr["ContentType"].ToString());
                    uldStock.Text_ContentCategory = dr["BaggageType"].ToString().ToUpper();
                    uldStock.ContentCategory = (dr["BSNo"].ToString());

                    uldStock.SHCGroupSNo = dr["SPHCSNo"].ToString();
                    uldStock.Text_SHCGroupSNo = dr["Text_SHCGroupSNo"].ToString().ToUpper();
                    uldStock.SHCSNo = dr["SHCSNo"].ToString().ToUpper();
                    uldStock.Text_SHCSNo = dr["Text_SHCSNo"].ToString().ToUpper();
                }
            }
            catch (Exception ex)
            {
                throw ex;
                dr.Close();
            }
            return uldStock;
        }
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<ULDStockGrid>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters)
                                                ,new SqlParameter("@OrderBy", sorts)
                                                ,new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                 ,new SqlParameter("@AirportCode", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportCode.ToString())};
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListULDStock", Parameters);
                var ULDStockList = ds.Tables[0].AsEnumerable().Select(e => new ULDStockGrid
                {
                    // ContentCategory = Convert.ToInt32(e["ContentCategory"].ToString().ToUpper()),
                    SNo = Convert.ToInt32(e["SNo"].ToString().ToUpper()),
                    ULDType = e["ULDType"].ToString().ToUpper(),
                    ULDNo = e["ULDNo"].ToString().ToUpper(),
                    City = e["City"].ToString().ToUpper(),
                    AirlineName = e["AirlineName"].ToString().ToUpper(),
                    PurchaseFrom = e["PurchaseFrom"].ToString().ToUpper(),
                    PurchaseAt = e["PurchaseAt"].ToString().ToUpper(),
                    PurchaseDate = e["PurchaseDate"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["PurchaseDate"]), DateTimeKind.Utc),
                    Active = e["Active"].ToString().ToUpper(),
                    Available = e["Available"].ToString().ToUpper(),
                    Damaged = e["Damaged"].ToString().ToUpper(),
                    Serviceable = e["Serviceable"].ToString().ToUpper(),
                    ContainerType = e["ContainerType"].ToString().ToUpper(),
                    OriginAirport = e["OriginAirport"].ToString().ToUpper(),
                    Content = e["Content"].ToString().ToUpper(),
                    BaggageType = e["BaggageType"].ToString().ToUpper(),
                    SHC = e["SHC"].ToString().ToUpper(),
                    CurrentStatus = e["CurrentStatus"].ToString().ToUpper(),
                    PurchasedPrice = e["PurchasedPrice"].ToString().ToUpper(),
                    EmptyWeight = e["EmptyWeight"].ToString().ToUpper(),
                    LostRemarks = e["LostRemarks"].ToString().ToUpper(),
                    IsNonInventory = e["IsNonInventory"].ToString().ToUpper(),
                    // ContentCategory =Convert.ToInt32( e["ContentCategory"].ToString()),
                    //BaggageType = e["BaggageType"].ToString().ToUpper(),
                    //Code = e["Code"].ToString().ToUpper(),
                    //Text_ContentType = e["Text_ContentType"].ToString().ToUpper(),
                    //ContentType = Convert.ToInt32(e["ContentType"].ToString())
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = ULDStockList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }

            catch (Exception ex)//
            {
                throw ex;
            }

        }
        public DataSourceResult GetMaxULDSerial(int ULDTypeSNo, string AirlineCode)
        {
            try
            {
                List<String> MaxULDSerial = new List<String>();
                SqlParameter[] Parameters = { new SqlParameter("@ULDTypeSNo", ULDTypeSNo), new SqlParameter("@AirlineCode", AirlineCode) };
                SqlDataReader dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordMaxULDSerial", Parameters);
                if (dr.Read())
                {
                    MaxULDSerial.Add(dr["MaxULDSerial"].ToString());
                }
                return new DataSourceResult
                {
                    Data = MaxULDSerial
                };
            }

            catch (Exception ex)//
            {
                throw ex;
            }

        }
        public DataSourceResult CheckCityCode(string CityCode)
        {
            try
            {
                List<String> IsExist = new List<String>();
                SqlParameter[] Parameters = { new SqlParameter("@CityCode", CityCode) };
                SqlDataReader dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "CheckCityCode", Parameters);
                if (dr.Read())
                {
                    IsExist.Add(dr["IsExist"].ToString());
                }
                return new DataSourceResult
                {
                    Data = IsExist
                };
            }

            catch (Exception ex)//
            {
                throw ex;
            }
        }
        public List<string> SaveULDStock(List<ULDStock> ULDStock)
        {
            try
            {
                //validate Business Rule
                List<string> ErrorMessage = new List<string>();
                DataTable dtCreateULDStock = CollectionHelper.ConvertTo(ULDStock, "Text_Scrape,Text_AirportSNo,Text_OwnershipSNo,Serviceable,Damaged,ContainerType,UpdatedBy,Text_ContentCategory,Code,Text_ContentType,Text_SHCSNo,Text_SHCGroupSNo");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("ULDStock", dtCreateULDStock, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@ULDStockTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateULDStock;
                SqlParameter[] Parameters = { param };
                //  int ret = 0;
                // DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "SaveULDStock_TEMP", Parameters);
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "SaveULDStock", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "ULDStock");
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

            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public List<string> UpdateULDStock(List<ULDStock> ULDStock)
        {

            try
            {
                //validate Business Rule
                List<string> ErrorMessage = new List<string>();
                DataTable dtCreateULDStock = CollectionHelper.ConvertTo(ULDStock, "Text_Scrape,Text_AirportSNo,Text_OwnershipSNo,Serviceable,Damaged,ContainerType,UpdatedBy,Text_ContentCategory,Code,Text_ContentType,Text_SHCSNo,Text_SHCGroupSNo");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("ULDStock", dtCreateULDStock, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@ULDStockTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateULDStock;
                SqlParameter[] Parameters = { param };

                //int ret = 0;
                //DataSet ds = (DataSet)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateULDStock", Parameters);
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateULDStock", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "ULDStock");
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


            catch (Exception ex)//
            {
                throw ex;
            }
        }


        public List<string> DeleteULDStock(List<string> listID)
        {
            try
            {
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBusiness = new BaseBusiness();
                if (listID.Count > 1)
                {
                    string RecordID = listID[0].ToString();
                    string UserID = listID[1].ToString();

                    SqlParameter[] Parameters = { new SqlParameter("@SNo", Convert.ToString(RecordID)),
                                             new SqlParameter("@UserID",  Convert.ToInt32(UserID))};

                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteULDStock", Parameters);
                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            //For Customised Validation Messages like 'Record Already Exists' etc
                            string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "ULDStock");
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
                return ErrorMessage;
            }

            catch (Exception ex)//
            {
                throw ex;
            }
        }

        public string GetTareWeight(string ULDSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@ULDSNo", ULDSNo) };
                string ret = (string)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "GetTareWeight", Parameters);
                return ret;
            }


            catch (Exception ex)//
            {
                throw ex;
            }
        }


        public string GetAirportuldInformation(string Code)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@Code", Code) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAirportuldInformation", Parameters);
                ds.Dispose();

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }
        public string getavailableData(string UDlSno)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@UDlSno", UDlSno) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "UDLStockCheckUldisAvailable", Parameters);
                ds.Dispose();

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }
        //public SelectBaggage SelectBaggage()
        //{
        //    String DeltaSeconds = String.Empty;
        //    SelectBaggage dst = new SelectBaggage();
        //    SqlDataReader dr = null;
        //    try
        //    {
        //       // SqlParameter[] Parameters = { new SqlParameter("@CustomerSNo", CustomerSNo) };
        //        dr = SqlHelper.ExecuteReader(connectionString, CommandType.StoredProcedure, "GetSelectBaggage");
        //        if (dr.Read())
        //        {
        //            dst.BaggageType = dr["BaggageType"].ToString();
        //            dst.SNo = Convert.ToInt32(dr["SNo"].ToString());
        //        }
        //    }
        //    catch (Exception e)
        //    {
        //        dr.Close();
        //    }
        //    dr.Close();
        //    return dst; 
        //}
        public string GetULDStockSpecialRights()
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@CreatedBy", Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetULDStockSpecialRights", Parameters);
                ds.Dispose();

                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)//
            {
                throw ex;
            }
        }
        //Added By Shivali Thakur
        public string Inventorymessage(string ID)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@ID", ID) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "SpUpdateULDStock", Parameters);
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
