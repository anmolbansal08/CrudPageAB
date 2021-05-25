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
using CargoFlash.Cargo.Model.Warehouse;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using Newtonsoft.Json;
using CargoFlash.Cargo.DataService.Schedule;
using System.Net;

namespace CargoFlash.Cargo.DataService.Warehouse
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class LocationSearchService :SignatureAuthenticate,ILocationSearchService
    {
        public string FindLocation(WarehouseLocationSearch obj)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@TerminalSNo", obj.Terminal),
                                                    new SqlParameter("@AirlineSNo", obj.Airline),
                                                    new SqlParameter("@SHCSNo", obj.SHC),
                                                    new SqlParameter("@DestinationCountrySNo", obj.DestCountry),
                                                    new SqlParameter("@DestinationCitySNo", obj.DestCity),
                                                    new SqlParameter("@AccountSNo", obj.AgentForwarder),
                                                     new SqlParameter("@LocationTypeSNo", obj.Location),
                                                    new SqlParameter("@SearchBy", obj.SubLocation),
                                                    new SqlParameter("@SearchText", obj.SubAreaName)

                                            };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spWH_LocationSearch_MapArea", Parameters);
                if (ds.Tables[0].Rows.Count > 0)
                {
                    return ds.Tables[0].Rows[0]["SubAreaSNo"].ToString().TrimEnd(',');
                }
                return "";
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }

        }


        public KeyValuePair<string, List<WarehouseLocationSearchResult>> SearchData(string recid, int pageNo, int pageSize, string whereCondition, string sort)
        {
            try
            {
                List<WarehouseLocationSearchResult> lst = new List<WarehouseLocationSearchResult>();

                SqlParameter[] Parameters = { 
                                          new SqlParameter("@PageNo", pageNo),
                                          new SqlParameter("@PageSize", pageSize),
                                          new SqlParameter("@WhereCondition", whereCondition),
                                          new SqlParameter("@OrderBy", sort)
                                        };

                //SqlParameter[] Parameters = { new SqlParameter("@TerminalSNo", obj.Terminal),
                //                                    new SqlParameter("@AirlineSNo", obj.Airline),
                //                                    new SqlParameter("@SHCSNo", obj.SHC),
                //                                    new SqlParameter("@DestinationCountrySNo", obj.DestCountry),
                //                                    new SqlParameter("@DestinationCitySNo", obj.DestCity),
                //                                    new SqlParameter("@AccountSNo", obj.AgentForwarder),
                //                                     new SqlParameter("@LocationTypeSNo", obj.Location),
                //                                    new SqlParameter("@SearchBy", obj.SubLocation),
                //                                    new SqlParameter("@SearchText", obj.SubAreaName)

                //                            };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spWH_LocationSearch_Result_CS", Parameters);
                if (ds != null && ds.Tables.Count > 0)
                    lst = ds.Tables[0].AsEnumerable().Select(e => new WarehouseLocationSearchResult
                    {
                        SNo = e["aptsno"].ToString(),
                        HdnLocationName = e["SNo"].ToString(),
                        AWBNo = e["AWBNo"].ToString(),
                        LocationName = e["LocationName"].ToString(),
                        SPHC = e["SPHC"].ToString(),
                        CountryName = e["CountryName"].ToString(),
                        CityName = e["CityName"].ToString(),
                        TerminalName = e["TerminalName"].ToString(),
                        AgentName = e["AgentName"].ToString(),
                        AirlineName = e["AirlineName"].ToString(),
                        ULDNo = e["ULDNo"].ToString(),
                        PicNo = e["PieceNo"].ToString()

                    }).ToList();
                return new KeyValuePair<string, List<WarehouseLocationSearchResult>>(ds.Tables[1].Rows[0][0].ToString(), lst.AsQueryable().ToList());
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }

        }

        public List<string> createUpdateLocationSearch(string strData)
        {
            try
            {
                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                // convert JSON string into datatable
                var dtLocationSearch = JsonConvert.DeserializeObject<DataTable>(strData);
                dtLocationSearch.Columns.Remove("LocationName");



                dtLocationSearch.Columns["SNo"].SetOrdinal(0);
                dtLocationSearch.Columns["HdnLocationName"].SetOrdinal(1);
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@locSrc";
                param.SqlDbType = System.Data.SqlDbType.Structured;

                if (dtLocationSearch.Rows.Count > 0)
                {
                    param.Value = dtLocationSearch;
                    SqlParameter[] Parameters = { param };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "updateLocationSearch", Parameters);
                }

                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "ScheduleTrans");
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
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        
        }

        public string UpdateLocationDetails(string AWBNo, string MPIECE, string Location, string IsImport, string SLISNo, string UserSNo, bool AllPcs)
        {
            try
            {
                DataSet ds = new DataSet();

                var l = Location.Split(',')[0];
                var t = Location.Split(',')[1];
                SqlParameter[] Parameters = { 
                                            new SqlParameter("@AWBNo", AWBNo),
                                            new SqlParameter("@MPIECE", MPIECE),
                                            new SqlParameter("@Location", l),
                                            new SqlParameter("@Type", t),
                                            new SqlParameter("@IsImport",IsImport),
                                            new SqlParameter("@SLISNo",SLISNo),
                                            new SqlParameter("@IsAllPcs",AllPcs),
                                            new SqlParameter("@UpdatedBy",UserSNo)                                            
                                        };
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "UpdateWarehouseLocationPiece", Parameters);
                FlightOpenService fos = new FlightOpenService();
                return fos.DStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string GetAWBNOLOCATionDetails(String AWBNo, String Location, string IsImport, string ConsumableSNo, string SLISNo)
        {
            try
            {
                DataSet ds = new DataSet();
                SqlParameter[] Parameters = { 
                                            new SqlParameter("@AWBNo", AWBNo),                                          
                                            new SqlParameter("@LSNO", Location),
                                            new SqlParameter("@IsImport",IsImport),
                                            new SqlParameter("@ConsumableSNo",ConsumableSNo),
                                            new SqlParameter("@SLISNo",SLISNo)
                                        };
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAWBLOCATIONWISEPIECE", Parameters);
                FlightOpenService fos = new FlightOpenService();
                return fos.DStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string UpdateMoveableLocationDetails(String ConsumablesName, String Location)
        {
            try
            {
                DataSet ds = new DataSet();
                SqlParameter[] Parameters = { 
                                            new SqlParameter("@ConsumablesName", ConsumablesName),                                           
                                            new SqlParameter("@Location", Location)
                                        };
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "UpdateWarehouseMoveableLocation", Parameters);
                FlightOpenService fos = new FlightOpenService();
                return fos.DStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public string UpdateULDLocationDetails(String ULDNo, String Location)
        {
            try
            {
                DataSet ds = new DataSet();
                SqlParameter[] Parameters = { 
                                            new SqlParameter("@ULDNo", ULDNo),                                           
                                            new SqlParameter("@Location", Location)
                                        };
                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "UpdateULDLocationDetails", Parameters);
                FlightOpenService fos = new FlightOpenService();
                return fos.DStoJSON(ds);
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        //public string GetAllPieces(string AWBNo)
        //{
        //    DataSet ds = new DataSet();
        //    SqlParameter[] Parameters = { 
        //                                    new SqlParameter("@AWBNo", AWBNo)
        //                                };
        //    ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAllPIECE", Parameters);
        //    FlightOpenService fos = new FlightOpenService();
        //    return fos.DStoJSON(ds);
        //}
    }
}
