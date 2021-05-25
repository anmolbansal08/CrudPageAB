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
using CargoFlash.Cargo.Model.BuildUp;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using CargoFlash.Cargo.Model;
using Newtonsoft.Json;
using System.Net;

namespace CargoFlash.Cargo.DataService.BuildUp
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class AgentBuildUpWeighingService :SignatureAuthenticate, IAgentBuildUpWeighingService
    {
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<AgentBuildUpWeighingGrid>(filter);
                SqlParameter[] Parameters = {
                                            new SqlParameter("@PageNo", page),
                                            new SqlParameter("@PageSize", pageSize),
                                            new SqlParameter("@WhereCondition", filters),
                                            new SqlParameter("@OrderBy", sorts)
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "AgentBuildUpWeighingGetList", Parameters);
                var data = ds.Tables[0].AsEnumerable().Select(e => new AgentBuildUpWeighingGrid
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    AirlineName = e["AirlineName"].ToString().ToUpper().ToUpper(),
                    FlightNo = e["FlightNo"].ToString().ToUpper(),
                    FlightDate = e["FlightDate"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["FlightDate"]), DateTimeKind.Utc),
                    AgentName = e["AgentName"].ToString().ToUpper(),
                    OriginCityCode = e["OriginCityCode"].ToString().ToUpper(),
                    WeighingStatus = e["WeighingStatus"].ToString().ToUpper(),
                    WeighingBy = e["WeighingBy"].ToString().ToUpper(),
                    WeighingOn = e["WeighingOn"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["WeighingOn"]), DateTimeKind.Utc),
                    LotNo = e["LotNo"].ToString().ToUpper(),
                    ULDStatus = e["ULDStatus"].ToString().ToUpper(),
                    EqptAssignedtoBulk = e["EqptAssignedtoBulk"].ToString().ToUpper(),
                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = data.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public string GetULDDetails(int AgentBuildUpSNo, int UserSNo)
        {
            try
            {
                SqlParameter[] Parameters = {
                                            new SqlParameter("@AgentBuildUpSNo", AgentBuildUpSNo),
                                            new SqlParameter("@UserSNo", UserSNo)
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAgentBuildUpULDDetails", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSONOnlyString(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public string SaveAgentBuildUpWeighing(List<AgentBuildUpWeighing> AgentBuildUpWeighing, int AgentBuildUpSNo, int UserSNo, int AirportSNo, string DailyFlightSNo, string WeighingBy)
        {

            string Result = "";
            string ProcName = "SaveAgentBuildupWeighing";
            try
            {

                DataTable dtAgentBuildUpWeighing = CollectionHelper.ConvertTo(AgentBuildUpWeighing, "");

                SqlParameter paramAgentBuildUp = new SqlParameter();
                paramAgentBuildUp.ParameterName = "@ULDData";
                paramAgentBuildUp.SqlDbType = System.Data.SqlDbType.Structured;
                paramAgentBuildUp.Value = dtAgentBuildUpWeighing;

                SqlParameter[] Parameters = { 
                                            paramAgentBuildUp ,
                                            new SqlParameter("@AgentBuildUpSNo",AgentBuildUpSNo),
                                            new SqlParameter("@UpdatedBy",UserSNo),
                                            new SqlParameter("@AirportSNo",AirportSNo),
                                            new SqlParameter("@WeighingBy",WeighingBy),
                                        };


                if (!string.IsNullOrEmpty(DailyFlightSNo) && DailyFlightSNo != "0")
                {
                    ProcName = "SaveAgentBuildupWeighingWithFlight";
                }

                DataSet dsResult = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "SaveAgentBuildupWeighing_New", Parameters);
                Result = CargoFlash.Cargo.Business.Common.CompleteDStoJSON(dsResult);
            }
            //catch(Exception ex)//
            //{
            //    throw ex;
            //}
            catch(Exception ex)// (Exception ex)
            {
                Result = "{\"Table0\":[{\"Result\":\"" + ex.Message.Replace(@"""", @"\""") + "\"}]}";

            }
            return Result;
        }

        public string SaveAssignFlight(int AgentBuildUpSNo, int UldStockSNo, int DailyFlightSNo, int UserSNo, int AirportSNo, string ULDOffPoint)
        {
            string Result = "";
            string ProcName = "";
            if (DailyFlightSNo == -1)
            {
                ProcName = "SaveAgentBuildupPushedInLyingList";
            }
            else
            {
                ProcName = "SaveAgentBuildupAssignFlight";
            }


            try
            {

                SqlParameter[] Parameters = { 
                                            new SqlParameter("@AgentBuildUpSNo",AgentBuildUpSNo),
                                            new SqlParameter("@UpdatedBy",UserSNo),
                                            new SqlParameter("@DailyFlightSNo",DailyFlightSNo),
                                            new SqlParameter("@UldStockSNo",UldStockSNo),
                                            new SqlParameter("@AirportSNo",AirportSNo),
                                            new SqlParameter("@ULDOffPoint",ULDOffPoint)
                                        };

                DataSet dsResult = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, ProcName, Parameters);
                Result = CargoFlash.Cargo.Business.Common.CompleteDStoJSON(dsResult);
            }
            //catch(Exception ex)//
            //{
            //    throw ex;
            //}
            catch(Exception ex)// (Exception ex)
            {
                Result = "{\"Table0\":[{\"Result\":\"" + ex.Message.Replace(@"""", @"\""") + "\"}]}";

            }
            return Result;
        }




        public string GetChildULDAgentBuildUpRecord(string AgentBuildUpSNo)
        {
            DataSet ds = new DataSet();
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AgentBuildUpSNo ", AgentBuildUpSNo) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetChildULDAgentBuildUpRecord", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            //catch(Exception ex)// (Exception) { }
            catch(Exception ex)//
            {
                throw ex;
            }
           
        }

        public KeyValuePair<string, List<AgentBuildUpBulkAssignEquipment>> GetBulkRecordForAssignEquipment(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AgentBuildUpSNo", recordID) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAgentBuildUp_BulkShipmentForAssignEquipment", Parameters);
                // return resultData.Tables[0].AsEnumerable().ToList();
                var AgentBuildUpBulkAssignEquipmentGridList = ds.Tables[0].AsEnumerable().Select(e => new AgentBuildUpBulkAssignEquipment
                {
                    SNo = e["SNo"].ToString(),
                    AgentBuildUpSNo = e["AgentBuildUpSNo"].ToString(),
                    HdnAWBNo = e["AWBSNo"].ToString(),
                    AWBNo = e["AWBNo"].ToString(),
                    Text_AWBNo = e["AWBNo"].ToString(),
                    TotalPieces = e["BuildPieces"].ToString(),
                    Pieces = e["BuildPieces"].ToString(),
                    //GrossWt = e["Quantity"].ToString(),
                    HdnEquipmentNo = "",
                    EquipmentNo = "",
                    Text_EquipmentNo = "",



                });
                return new KeyValuePair<string, List<AgentBuildUpBulkAssignEquipment>>(ds.Tables[0].Rows[0][0].ToString(), AgentBuildUpBulkAssignEquipmentGridList.AsQueryable().ToList());
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public KeyValuePair<string, List<AgentBuildUpViewBulkAssignEquipment>> GetViewBulkRecordForAssignEquipment(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AgentBuildUpSNo", recordID) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAgentBuildUp_ViewBulkShipmentForAssignEquipment", Parameters);
                // return resultData.Tables[0].AsEnumerable().ToList();
                var AgentBuildUpBulkAssignEquipmentGridList = ds.Tables[0].AsEnumerable().Select(e => new AgentBuildUpViewBulkAssignEquipment
                {
                    SNo = e["SNo"].ToString(),
                    AgentBuildUpSNo = e["AgentBuildUpSNo"].ToString(),
                    HdnAWBNo = e["AWBSNo"].ToString(),
                    AWBNo = e["AWBNo"].ToString(),
                    Text_AWBNo = e["AWBNo"].ToString(),
                    TotalPieces = e["BuildPieces"].ToString(),
                    Pieces = e["BuildPieces"].ToString(),
                    //GrossWt = e["Quantity"].ToString(),
                    HdnEquipmentNo = e["EquipmentSNo"].ToString(),
                    EquipmentNo = e["EquipmentNo"].ToString(),
                    Text_EquipmentNo = "",
                    FlightNo = e["FlightNo"].ToString(),
                    FlightDate = e["FlightDate"].ToString(),
                    OffPoint = e["OffPoint"].ToString(),
                    ScaleWeight = e["ScaleWeight"].ToString(),
                });
                return new KeyValuePair<string, List<AgentBuildUpViewBulkAssignEquipment>>(ds.Tables[0].Rows[0][0].ToString(), AgentBuildUpBulkAssignEquipmentGridList.AsQueryable().ToList());
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public string ValidateBulkRecordForAssignEquipment(List<AgentBuildUpBulkAssignEquipment> dataDetails)
        {
            try
            {
                string Result = "";
                DataSet ds = new DataSet();
                try
                {
                    DataTable dtAgentBuildUpBulkAssignEquipment = CollectionHelper.ConvertTo(dataDetails, "Text_AWBNo,Text_EquipmentNo");
                    SqlParameter paramAgentBuildUpBulkAssignEquipment = new SqlParameter();
                    paramAgentBuildUpBulkAssignEquipment.ParameterName = "@AgentBuildUpBulkAssignEquipment";
                    paramAgentBuildUpBulkAssignEquipment.SqlDbType = System.Data.SqlDbType.Structured;
                    paramAgentBuildUpBulkAssignEquipment.Value = dtAgentBuildUpBulkAssignEquipment;
                    SqlParameter[] Parameters = { paramAgentBuildUpBulkAssignEquipment };
                    ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spValidateBulkRecordForAssignEquipment", Parameters);
                    ds.Dispose();
                    Result = CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
                }
                catch(Exception ex)// (Exception ex)
                {
                    Result = "{\"Table0\":[{\"Msg\":\"<tr><td>" + ex.Message.Substring(0, 50).Replace(@"""", @"\""") + "</td></tr>\"},{\"IsValidate\":\"" + 0 + "\"}]}";
                }
                return Result;
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
        public string SaveBulkRecordForAssignEquipment(List<AgentBuildUpBulkAssignEquipment> dataDetails, List<AgentBuildUpBulkAssignEquipmentScaleWeight> ScaleWeightData, int dailyFlightSNo, int AirportSNo, int UserSNo)
        {

            string Result = "";
            DataSet ds = new DataSet();
            try
            {
                DataTable dtAgentBuildUpBulkAssignEquipment = CollectionHelper.ConvertTo(dataDetails, "Text_AWBNo,Text_EquipmentNo");
                DataTable dtAgentBuildUpBulkAssignEquipmentScaleWeight = CollectionHelper.ConvertTo(ScaleWeightData, "");
                SqlParameter paramAgentBuildUpBulkAssignEquipment = new SqlParameter();
                paramAgentBuildUpBulkAssignEquipment.ParameterName = "@AgentBuildUpBulkAssignEquipment";
                paramAgentBuildUpBulkAssignEquipment.SqlDbType = System.Data.SqlDbType.Structured;
                paramAgentBuildUpBulkAssignEquipment.Value = dtAgentBuildUpBulkAssignEquipment;

                SqlParameter paramAgentBuildUpBulkAssignEquipmentScaleWeight = new SqlParameter();
                paramAgentBuildUpBulkAssignEquipmentScaleWeight.ParameterName = "@AgentBuildUpBulkAssignEquipmentScaleWeight";
                paramAgentBuildUpBulkAssignEquipmentScaleWeight.SqlDbType = System.Data.SqlDbType.Structured;
                paramAgentBuildUpBulkAssignEquipmentScaleWeight.Value = dtAgentBuildUpBulkAssignEquipmentScaleWeight;

                SqlParameter[] Parameters = { paramAgentBuildUpBulkAssignEquipment, paramAgentBuildUpBulkAssignEquipmentScaleWeight, new SqlParameter("@DailyFlightSNo", dailyFlightSNo), new SqlParameter("@AirportSNo", AirportSNo), new SqlParameter("@UserSNo", UserSNo) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spSaveBulkRecordForAssignEquipment", Parameters);
                ds.Dispose();
                Result = CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            //catch(Exception ex)//
            //{
            //    throw ex;
            //}
            catch(Exception ex)// (Exception ex)
            {
                Result = "{\"Table0\":[{\"Msg\":\"<tr><td>" + ex.Message.Substring(0, 50).Replace(@"""", @"\""") + "</td></tr>\",\"IsValidate\":\"" + 0 + "\"}]}";
            }
            return Result;
        }
    }
}
