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
using Newtonsoft.Json;
using System.Net;
using System.Web;

namespace CargoFlash.Cargo.DataService.Master
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class AirportService : SignatureAuthenticate, IAirportService
    {
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<Airport>(filter);
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListAirport", Parameters);
                var airportList = ds.Tables[0].AsEnumerable().Select(e => new Airport
                {
                    SNo = Convert.ToInt32(e["SNo"].ToString()),
                    AirportCode = e["AirportCode"].ToString().ToUpper(),
                    AirportName = e["AirportName"].ToString().ToUpper(),//not null
                    //CitySNo = e["CitySNo"].ToString().ToUpper(),
                    CityCode = e["CityCode"].ToString().ToUpper(),
                    CityName = e["CityName"].ToString().ToUpper(),
                    // CountrySNo = e["CountrySNo"].ToString().ToUpper(),//not null
                    CountryCode = e["CountryCode"].ToString().ToUpper(),//not null
                    CountryName = e["CountryName"].ToString().ToUpper(),//not null
                    IsDayLightSaving = e["IsDayLightSaving"].ToString() == "0",//not null
                    DayLightSaving = e["DayLightSaving"].ToString().ToUpper(),
                    IsActive = e["IsActive"].ToString() == "0",//not null
                    Active = e["Active"].ToString().ToUpper(),//foriegn key
                    CreatedBy = e["UpdatedUser"].ToString().ToUpper(),
                    UpdatedBy = e["UpdatedUser"].ToString().ToUpper(),
                    Text_IsDefaultAirport = e["Text_IsDefaultAirport"].ToString().ToUpper(),
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
        public Airport GetAirportRecord(string recordID, string UserSNo)
        {
            try
            {
                recordID = (HttpContext.Current.Request.QueryString["RecID"]);
                Airport airport = new Airport();
                SqlParameter[] Parameters = { new SqlParameter("@AirportCode", recordID), new SqlParameter("@UserID", Convert.ToInt32(UserSNo)) };
                SqlDataReader dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordAirport", Parameters);
                if (dr.Read())
                {
                    airport.SNo = Convert.ToInt32(dr["SNo"]);
                    airport.AirportCode = Convert.ToString(dr["AirportCode"]).ToUpper();
                    airport.AirportName = Convert.ToString(dr["AirportName"]).ToUpper();
                    //airport.CitySNo = Convert.ToString(dr["CitySNo"]).ToUpper();
                    airport.CityCode = Convert.ToString(dr["CityName"]).ToUpper();
                    airport.CityName = Convert.ToString(dr["CityName"]).ToUpper();
                    airport.Text_CityCode = Convert.ToString(dr["CityCode"]).ToUpper() + "-" + Convert.ToString(dr["CityName"]).ToUpper();
                    airport.CountryCode = Convert.ToString(dr["CountryName"]).ToUpper();
                    airport.CountryName = Convert.ToString(dr["CountryName"]).ToUpper();
                    airport.Text_CountryCode = Convert.ToString(dr["CountryCode"]).ToUpper() + "-" + Convert.ToString(dr["CountryName"]).ToUpper();
                    //connectionType.IsActive = Convert.ToBoolean(dr["IsActive"]);

                    //airport.ProductSNo = dr["ProductSNo"] == DBNull.Value ? 0 : Convert.ToInt32(dr["ProductSNo"]);
                    //airport.Text_ProductSNo = Convert.ToString(dr["ProductName"]).ToUpper();

                    //airport.SPHCSNo = Convert.ToString(dr["SHCSNo"]).ToUpper();
                    //airport.Text_SPHCSNo = Convert.ToString(dr["SHCCode"]).ToUpper();


                    //airport.AirlineSNo = dr["AirlineSNo"] == DBNull.Value ? 0 : Convert.ToInt32(dr["AirlineSNo"]);
                    //airport.Text_AirlineSNo = Convert.ToString(dr["AirlineCode"]).ToUpper();

                    //airport.AircraftSNo = dr["AircraftSNo"] == DBNull.Value ? 0 : Convert.ToInt32(dr["AircraftSNo"]);
                    //airport.Text_AircraftSNo = Convert.ToString(dr["AircraftType"]).ToUpper();

                    //airport.AcceptanceCutoffType = dr["AcceptanceCutoffType"] == DBNull.Value ? 0 : Convert.ToInt32(dr["SNo"]);
                    //airport.Text_AcceptanceCutoffType = Convert.ToString(dr["Text_AcceptanceCutoffType"]).ToUpper();
                    //airport.ConnectionTime = dr["AcceptanceCutoffTime"] == DBNull.Value ? 0 : Convert.ToInt32(dr["AcceptanceCutoffTime"]);

                    if (!String.IsNullOrEmpty(dr["IsDayLightSaving"].ToString()))
                    {
                        airport.IsDayLightSaving = Convert.ToBoolean(dr["IsDayLightSaving"]);
                        airport.DayLightSaving = dr["DayLightSaving"].ToString().ToUpper();
                    }
                    if (!String.IsNullOrEmpty(dr["IsActive"].ToString()))
                    {
                        airport.IsActive = Convert.ToBoolean(dr["IsActive"]);
                        airport.Active = dr["Active"].ToString().ToUpper();
                    }
                    //if (!String.IsNullOrEmpty(dr["IsAcceptanceActive"].ToString()))
                    //{
                    //    airport.IsAcceptanceActive = Convert.ToBoolean(dr["IsAcceptanceActive"]);
                    //    airport.AcceptanceActive = dr["AcceptanceActive"].ToString().ToUpper();
                    //}
                    //if (!String.IsNullOrEmpty(dr["IsBaseSetting"].ToString()))
                    //{
                    //    airport.IsBaseSetting = Convert.ToBoolean(dr["IsBaseSetting"]);
                    //    airport.BaseSetting = dr["BaseSetting"].ToString().ToUpper();
                    //}
                    if(!String.IsNullOrEmpty(dr["IsEmailAlertonoffloadedCargo"].ToString()))
                    {
                        airport.IsEmailAlertonoffloadedCargo = Convert.ToBoolean(dr["IsEmailAlertonoffloadedCargo"]);
                        airport.EmailAlertonoffloadedCargo = dr["EmailAlertonoffloadedCargo"].ToString().ToUpper();
                    }
                    airport.EmailAlertTime = dr["Time"].ToString();
                    airport.Time = dr["Time"].ToString();
                    airport.UpdatedBy = dr["UpdatedUser"].ToString().ToUpper();
                    airport.CreatedBy = dr["CreatedUser"].ToString().ToUpper();
                    airport.IsDefaultAirport = Convert.ToBoolean(dr["IsDefaultAirport"]);
                    airport.Text_IsDefaultAirport = dr["Text_IsDefaultAirport"].ToString().ToUpper();
                    airport.IsDoChargeApplicable = Convert.ToBoolean(dr["IsDoChargeApplicable"]);
                    airport.Text_DoChargeApplicable = dr["Text_DoChargeApplicable"].ToString().ToUpper();
                }
                dr.Close();
                return airport;
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public List<string> SaveAirport(List<Airport> Airport)
        {
            try
            {
                //validate Business Rule
                List<string> ErrorMessage = new List<string>();
                DataTable dtCreateAirport = CollectionHelper.ConvertTo(Airport, "Text_AirlineSNo,AirlineCode,,Text_AircraftSNo,Text_ProductSNo,ProductName,Text_ConnectionTypeSNo,AircraftType,Text_SPHCSNo,SPHCode,AcceptanceCutoffTypeName,BaseSetting,AcceptanceActive,Text_AcceptanceCutoffType,Active,Text_AirportCode,DayLightSaving,Text_CityCode,Text_CountryCode,EmailAlertonoffloadedCargo,Time,Text_IsDefaultAirport,Text_DoChargeApplicable");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("Airport", dtCreateAirport, "SAVE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@AirportTypeTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateAirport;
                SqlParameter[] Parameters = { param };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateAirport", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Airport");
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
        public List<string> DeleteAirport(List<string> listID)
        {
            try
            {
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                if (listID.Count > 0)
                {
                    string RecordId = listID[0].ToString();
                    string UserId = listID[1].ToString();
                    SqlParameter[] Parameters = { new SqlParameter("@AirportCode", RecordId), new SqlParameter("@UserID", Convert.ToInt32(UserId)) };
                    int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "DeleteAirport", Parameters);

                    if (ret > 0)
                    {
                        if (ret > 1000)
                        {
                            string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "Airport");
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
        public List<string> UpdateAirport(List<Airport> Airport)
        {
            try
            {
                //validate Business Rule
                List<string> ErrorMessage = new List<string>();
                DataTable dtCreateAirport = CollectionHelper.ConvertTo(Airport, "Text_AirlineSNo,AirlineCode,,Text_AircraftSNo,Text_ProductSNo,ProductName,Text_ConnectionTypeSNo,AircraftType,Text_SPHCSNo,SPHCode,AcceptanceCutoffTypeName,BaseSetting,AcceptanceActive,Text_AcceptanceCutoffType,Active,Text_AirportCode,DayLightSaving,Text_CityCode,Text_CountryCode,EmailAlertonoffloadedCargo,Time,Text_IsDefaultAirport,Text_DoChargeApplicable");
                BaseBusiness baseBusiness = new BaseBusiness();

                if (!baseBusiness.ValidateBaseBusiness("Airport", dtCreateAirport, "UPDATE"))
                {
                    ErrorMessage = baseBusiness.ErrorMessage;
                    return ErrorMessage;
                }
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@AirportTypeTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                param.Value = dtCreateAirport;
                SqlParameter[] Parameters = { param };
                int ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateAirport", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        //For Customised Validation Messages like 'Record Already Exists' etc
                        string serverErrorMessage = baseBusiness.ReadServerErrorMessages(ret, "Airport");
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

        public DataSourceResult GetCity(String CountryCode)
        {
            try
            {
                List<String> cur = new List<String>();
                SqlParameter[] Parameters = { new SqlParameter("@CountryCode", CountryCode) };
                SqlDataReader dr = SqlHelper.ExecuteReader(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRecordCityAutocomplete", Parameters);
                if (dr.Read())
                {
                    cur.Add(dr["CityCode"].ToString());
                    cur.Add(dr["CityName"].ToString());
                }
                return new DataSourceResult
                {
                    Data = cur,
                    Total = cur.Count()
                };
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }
        public KeyValuePair<string, List<AirportCutoffTime>> GetAirportCutoffTimeRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                AirportCutoffTime CommoditySubGroup = new AirportCutoffTime();
                SqlParameter[] Parameters = { new SqlParameter("@AirportSNo", recordID), new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListAirportCutoffTime", Parameters);

                var AirportCutoffTimeList = ds.Tables[0].AsEnumerable().Select(e => new AirportCutoffTime
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    AirportSNo = Convert.ToInt32(e["AirportSNo"]),
                    ProductSNo = e["ProductName"].ToString(),
                    HdnProductSNo = e["ProductSNo"].ToString(),
                    HdnAirlineSNo = e["AirlineSNo"].ToString(),
                    AirlineSNo = e["AirlineCode"].ToString().ToUpper(),
                    HdnAircraftSNo = e["AircraftSNo"].ToString(),
                    AircraftSNo = e["AircraftType"].ToString().ToUpper(),
                    HdnSPHCSNo = e["SHCSNo"].ToString(),
                    SPHCSNo = e["SHCode"].ToString() == "" ? e["SHCode"].ToString() : e["SHCode"].ToString().Remove(e["SHCode"].ToString().Length - 1, 1),
                    HdnAcceptanceCutoffType = e["AcceptanceCutoffType"].ToString(),
                    AcceptanceCutoffType = e["Text_AcceptanceCutoffType"].ToString().ToUpper(),
                    ConnectionTime = Convert.ToInt32(e["AcceptanceCutoffTime"].ToString()),
                    IsBaseSetting = Convert.ToBoolean(e["IsBaseSetting"]),
                    BaseSetting = e["BaseSetting"].ToString(),
                    IsActive = Convert.ToBoolean(e["IsActive"]),
                    Active = e["Active"].ToString(),
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()
                });
                return new KeyValuePair<string, List<AirportCutoffTime>>(ds.Tables[1].Rows[0][0].ToString(), AirportCutoffTimeList.AsQueryable().ToList());
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }

        public List<Tuple<string, int>> createUpdateAirportCutoffTime(string strData)
        {
            try
            {
                int ret = 0;
                List<Tuple<string, int>> ErrorMessage = new List<Tuple<string, int>>();
                BaseBusiness baseBussiness = new BaseBusiness();
                // Convert JSON string into datatable
                var dtAirportCutoffTime = JsonConvert.DeserializeObject<DataTable>(CargoFlash.Cargo.Business.Common.Base64ToString(strData));
                dtAirportCutoffTime.Columns.Remove("AirlineSNo");
                dtAirportCutoffTime.Columns.Remove("ProductSNo");
                dtAirportCutoffTime.Columns.Remove("AircraftSNo");
                dtAirportCutoffTime.Columns.Remove("SPHCSNo");
                dtAirportCutoffTime.Columns.Remove("AcceptanceCutoffType");



                dtAirportCutoffTime.Columns["SNo"].SetOrdinal(0);
                dtAirportCutoffTime.Columns["AirportSNo"].SetOrdinal(1);
                dtAirportCutoffTime.Columns["HdnProductSNo"].SetOrdinal(2);
                dtAirportCutoffTime.Columns["HdnAirlineSNo"].SetOrdinal(3);
                dtAirportCutoffTime.Columns["HdnAircraftSNo"].SetOrdinal(4);
                dtAirportCutoffTime.Columns["HdnSPHCSNo"].SetOrdinal(5);
                dtAirportCutoffTime.Columns["HdnAcceptanceCutoffType"].SetOrdinal(6);
                dtAirportCutoffTime.Columns["ConnectionTime"].SetOrdinal(7);
                dtAirportCutoffTime.Columns["IsBaseSetting"].SetOrdinal(8);
                dtAirportCutoffTime.Columns["IsActive"].SetOrdinal(9);
                dtAirportCutoffTime.Columns["CreatedBy"].SetOrdinal(10);
                dtAirportCutoffTime.Columns["UpdatedBy"].SetOrdinal(11);



                var dtCreateSPHCSubClass = (new DataView(dtAirportCutoffTime, "SNo=0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                var dtUpdateSPHCSubClass = (new DataView(dtAirportCutoffTime, "SNo>0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@AirportCutOffTypeTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;
                // for create new record

                // for update existing record
                if (dtUpdateSPHCSubClass.Rows.Count > 0)
                {
                    param.Value = dtUpdateSPHCSubClass;
                    SqlParameter[] Parameters = { param };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateAirportCutOff", Parameters);
                }
                if (dtCreateSPHCSubClass.Rows.Count > 0)
                {
                    param.Value = dtCreateSPHCSubClass;
                    SqlParameter[] Parameters = { param };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "CreateAirportCutOff", Parameters);
                }
                if (ret > 0)
                {
                    if (ret == 2601)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AirportCutOffTime");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(new Tuple<string, int>(serverErrorMessage, 0));
                    }
                    else if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AirportCutOffTime");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(new Tuple<string, int>(serverErrorMessage, 1));
                    }
                    else
                    {
                        //For DataBase Exceptions like 'Foreign Key refrence Errors' etc
                        string dataBaseExceptionMessage = baseBussiness.ReadServerErrorMessages(ret, baseBussiness.DatabaseExceptionFileName);
                        if (!string.IsNullOrEmpty(dataBaseExceptionMessage))
                            ErrorMessage.Add(new Tuple<string, int>(dataBaseExceptionMessage, 0));
                    }
                }
                return ErrorMessage;
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }
        public List<string> deleteAirportCutoffTime(string recordID)
        {
            try
            {
                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
                ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "deleteAirportCutoffTime", Parameters);
                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "AirportCutOffTime");
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
                return ErrorMessage;
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }

        public string GetCountry(int CitySNo)
        {
            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { 
                                            new SqlParameter("@CitySNo", CitySNo), 
                                        };
            try
            {
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "GetTaxCountry", Parameters);
                return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }


        public string GetCityInformation(string SNo)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@SNo", SNo) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetCityInformation", Parameters);
                ds.Dispose();
            }
            catch(Exception ex)//
            {

                throw ex;
            }
            return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
        }
    }
}
