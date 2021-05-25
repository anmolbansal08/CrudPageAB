using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using CargoFlash.Cargo.Model.Shipment;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using Newtonsoft.Json;
using System.Text;
using System.ServiceModel.Web;
using System.Net;



namespace CargoFlash.Cargo.DataService.Shipment
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class FlightTransferService : SignatureAuthenticate, IFlightTransferService
    {

        public CargoFlash.Cargo.Model.Shipment.FlightGridData GetFlightTransferRecord(string recordID)
        {
            try
            {
                CargoFlash.Cargo.Model.Shipment.FlightGridData ft = new CargoFlash.Cargo.Model.Shipment.FlightGridData();
                SqlParameter[] Parameters = { new SqlParameter("@SNo", recordID) };
                SqlDataReader dr = SqlHelper.ExecuteReader(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetFlightRecord", Parameters);
                if (dr.Read())
                {
                    ft.FlightSNo = Convert.ToInt32(dr["DailyFlightSNo"]);
                    ft.FlightNo = dr["FlightNo"].ToString();
                    ft.FlightDate = dr["FlightDate"].ToString();
                    ft.Origin = dr["Origin"].ToString();
                    ft.Dest = dr["Dest"].ToString();
                    ft.Atype = dr["AType"].ToString();
                    ft.Route = dr["Route"].ToString();
                    ft.UCapacity = dr["UCapacity"].ToString();
                    ft.FStatus = dr["FStatus"].ToString();
                    ft.FSNo = 1;
                    ft.Text_FSNo = "FIFO";
                }
                dr.Close();
                return ft;
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }


        public KeyValuePair<string, List<FTGridData>> GetFlightTransfer1Record(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                FTGridData FTData = new FTGridData();
                SqlParameter[] Parameters = { new SqlParameter("@DFSno", recordID), new SqlParameter("@PageNo", 1), new SqlParameter("@PageSize", 100), new SqlParameter("@WhereCondition", ""), new SqlParameter("@OrderBy", sort) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListFlightShipmentTransfer", Parameters);
                var FlightTransferList = ds.Tables[0].AsEnumerable().Select(e => new FTGridData
                    {
                        FCheck = false,
                        FlightSNo = e["FlightPlanSno"].ToString(),
                        OASNO = e["ORiginAirportsno"].ToString(),
                        DASNo = e["destinationairportSNo"].ToString(),
                        AWBNo = e["AWBNo"].ToString(),
                        AcceptTime = e["acceptancetime"].ToString(),
                        TotalPic = e["totalpieces"].ToString(),
                        PlanPic = e["PlannedPieces"].ToString(),
                        TotGrWt = e["TotalGrossWeight"].ToString(),
                        PlanGrWt = e["plannedgrosswt"].ToString(),
                        TotVolWt = e["totalvolumeweight"].ToString(),
                        PlanVolWt = e["PlannedVolumeWt"].ToString(),
                        AWBStatus = e["awbstatus"].ToString(),
                        AWBOrigin = e["AWBorigin"].ToString(),
                        AWBDest = e["AWBDestination"].ToString(),
                        NatureGood = e["NatureofGoods"].ToString(),
                        Yield = "0",
                        FlightDate = "",
                        HdnFlightNo = "",
                        FlightNo = "",
                        ADD = "ADD"

                    });
                return new KeyValuePair<string, List<FTGridData>>(ds.Tables[1].Rows[0][0].ToString(), FlightTransferList.AsQueryable().ToList());
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public KeyValuePair<string, List<FlightGridData>> GetFlightSummaryRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                FlightGridData FTData = new FlightGridData();
                SqlParameter[] Parameters = { new SqlParameter("@DFSno", recordID), new SqlParameter("@PageNo", 1), new SqlParameter("@PageSize", 100), new SqlParameter("@WhereCondition", ""), new SqlParameter("@OrderBy", "") };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListFlightSummary", Parameters);
                var FTList = ds.Tables[0].AsEnumerable().Select(e => new FlightGridData
                {

                    FlightNo = e["FlightNo"].ToString().ToUpper(),
                    FlightDate = e["FlightDate"].ToString().ToUpper(),
                    ETD = e["ETD"].ToString().ToUpper(),
                    ETA = e["ETA"].ToString().ToUpper(),
                    Origin = e["Origin"].ToString(),
                    Dest = e["Dest"].ToString(),
                    Atype = e["AType"].ToString(),
                    Route = e["Route"].ToString(),
                    TCapacity = e["TCapacity"].ToString().ToUpper(),
                    ACapacity = e["ACapacity"].ToString(),
                    UCapacity = e["UCapacity"].ToString(),
                    FStatus = e["FStatus"].ToString()

                });
                return new KeyValuePair<string, List<FlightGridData>>(ds.Tables[1].Rows[0][0].ToString(), FTList.AsQueryable().ToList());
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public KeyValuePair<string, List<FlightGridData>> GetFlightSearchRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {

            try
            {
                FlightGridData FTData = new FlightGridData();
                SqlParameter[] Parameters = { new SqlParameter("@DFSno", recordID), new SqlParameter("@PageNo", 1), new SqlParameter("@PageSize", 100), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", "") };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListFlightSummary1", Parameters);
                var FTList = ds.Tables[0].AsEnumerable().Select(e => new FlightGridData
                {
                    DFSNo = e["DailyFlightSNo"].ToString(),
                    FlightNo = e["FlightNo"].ToString().ToUpper(),
                    FlightDate = e["FlightDate"].ToString().ToUpper(),
                    ETD = e["ETD"].ToString().ToUpper(),
                    ETA = e["ETA"].ToString().ToUpper(),
                    Origin = e["Origin"].ToString(),
                    Dest = e["Dest"].ToString(),
                    Atype = e["AType"].ToString(),
                    Route = e["Route"].ToString(),
                    TCapacity = e["TCapacity"].ToString().ToUpper(),
                    ACapacity = e["ACapacity"].ToString(),
                    UCapacity = e["UCapacity"].ToString(),
                    FStatus = e["FStatus"].ToString()

                });
                return new KeyValuePair<string, List<FlightGridData>>(ds.Tables[1].Rows[0][0].ToString(), FTList.AsQueryable().ToList());
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        {
            try
            {
                string sorts = GridSort.ProcessSorting(sort);
                string filters = GridFilter.ProcessFilters<FlightGridData>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListFlightTransfer", Parameters);
                var FTList = ds.Tables[0].AsEnumerable().Select(e => new FlightGridData
                {
                    FlightSNo = Convert.ToInt32(e["DailyFlightSNo"].ToString()),
                    FlightNo = e["FlightNo"].ToString().ToUpper(),
                    FlightDate = e["FlightDate"].ToString().ToUpper(),
                    ETA = e["ETA"].ToString().ToUpper(),
                    ETD = e["ETD"].ToString().ToUpper(),
                    Origin = e["Origin"].ToString(),
                    Dest = e["Dest"].ToString(),
                    Atype = e["AType"].ToString(),
                    Route = e["Route"].ToString(),
                    TCapacity = e["TCapacity"].ToString().ToUpper(),
                    ACapacity = e["ACapacity"].ToString(),
                    UCapacity = e["UCapacity"].ToString(),
                    FStatus = e["FStatus"].ToString()

                });
                ds.Dispose();
                return new DataSourceResult
                {
                    Data = FTList.AsQueryable().ToList(),
                    Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                };
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }

        public List<string> createUpdateFlightTransfer1 (string strData)
        {
            try
            {
                int ret = 0;
                List<string> ErrorMessage = new List<string>();
                BaseBusiness baseBussiness = new BaseBusiness();
                var FlightTransfer = JsonConvert.DeserializeObject<DataTable>(CargoFlash.Cargo.Business.Common.Base64ToString(strData));
                FlightTransfer.Columns.Remove("OASNO");
                FlightTransfer.Columns.Remove("DASNO");
                FlightTransfer.Columns.Remove("ADD");


                var dtCreateDailyFlightTransfer = (new DataView(FlightTransfer, "FCheck>0", "FlightDate", DataViewRowState.CurrentRows)).ToTable();

                SqlParameter param = new SqlParameter();
                param.ParameterName = "@DFT";
                param.SqlDbType = System.Data.SqlDbType.Structured;

                if (dtCreateDailyFlightTransfer.Rows.Count > 0)
                {
                    param.Value = dtCreateDailyFlightTransfer;
                    SqlParameter[] Parameters = { param };
                    ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateDailyFlight", Parameters);
                }
                else
                {
                    ret = 3001;
                }

                if (ret > 0)
                {
                    if (ret > 1000)
                    {
                        string serverErrorMessage = baseBussiness.ReadServerErrorMessages(ret, "FlightTransfer");
                        if (!string.IsNullOrEmpty(serverErrorMessage))
                            ErrorMessage.Add(serverErrorMessage);
                    }
                    else
                    {
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

        public string GetFlight(string FlightNo, string FlightDate)
        {

            try
            {
                SqlParameter[] Parameters = { 
                new SqlParameter("@FlightNo", FlightNo),
               new SqlParameter("@FlightDate", FlightDate)                         };

                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetDailyFlight", Parameters);

                return ds.Tables[0].Rows[0][0].ToString();
            }
            catch(Exception ex)//(Exception ex)
            {
                throw ex;
            }
        }
        
        
    }
}
