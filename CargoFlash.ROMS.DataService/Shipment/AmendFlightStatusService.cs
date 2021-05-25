using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using CargoFlash.Cargo.Model.Schedule;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using Newtonsoft.Json;
using CargoFlash.Cargo.Model.Shipment;
using System.ServiceModel.Web;
using System.Net;

namespace CargoFlash.Cargo.DataService.Shipment
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class AmendFlightStatusService :SignatureAuthenticate, IAmendFlightStatusService
    {
        //public DataSourceResult GetFlightControlGridData(string recordID, int page, int pageSize, string whereCondition, string sorts)
        public KeyValuePair<string, List<CargoFlash.Cargo.Model.FlightControl.WMSAmendFlightControlGridData>> GetFlightControlGridData(string recordID, int page, int pageSize, FlightCondition model, string sort)
        {

           // string[] str = whereCondition.Split('~');
            try
            {
                string OriginCity = "0";
                //if (str[0] != "")
                //    OriginCity = str[0].Substring(0, 3).ToString();
                //String DestinationCity = "0";
                //if (str[1] != "")
                //    DestinationCity = str[1].Substring(0, 3).ToString();
                //String FlightNo = "A~A";
                //if (str[2] != "")
                //    FlightNo = str[2].ToString();
                //string FlightDate = "0";
                //if (str[3] != "")
                //    FlightDate = str[3].ToString();
                //string AirlineName = "";
                //if (str[4] != "")
                //    AirlineName = str[4].ToString();
                //string FlightStatus = "";
                //if (str[5] != "")
                //    FlightStatus = str[5].ToString();

                if (model.Org != "")
                    OriginCity = model.Org.ToString();
                String DestinationCity = "0";
                if (model.Dest != "")
                    DestinationCity = model.Dest.ToString();
                String FlightNo = "A~A";
                if (model.SearchFlightNo != "")
                    FlightNo = model.SearchFlightNo.ToString();
                string FlightDate = "0";
                if (model.DateFlight != "")
                    FlightDate = model.DateFlight.ToString();
                string AirlineName = "";
                if (model.Airline != "")
                    AirlineName = model.Airline.ToString();
                string FlightStatus = "";
                if (model.SearchFlightStatus != "")
                    FlightStatus = model.SearchFlightStatus.ToString();



                //string FlightStatus = "A~A";
                string LoggedInCity = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportCode.ToString();
                SoftwareFactory.Data.GridFilter filter;
                filter = null;

                string ProcName = "";
                if (filter == null)
                {
                    filter = new GridFilter();
                    filter.Logic = "AND";
                    filter.Filters = new List<GridFilter>();
                }

                DataSet ds = new DataSet();

                // ProcName = "GetListWMSFlightControl"; 
                //ProcName = "GetListWMSFlightReopen";
                ProcName = "GetListWMSFlightReopen_Reservation_New";

                string filters = GridFilter.ProcessFilters<CargoFlash.Cargo.Model.FlightControl.WMSFlightControlGridData>(filter);

                SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sort), new SqlParameter("@OriginCity", OriginCity), new SqlParameter("@DestinationCity", DestinationCity), new SqlParameter("@FlightNo", FlightNo), new SqlParameter("@FlightDate", FlightDate), new SqlParameter("@FlightStatus", FlightStatus), new SqlParameter("@LoggedInCity", LoggedInCity), new SqlParameter("@AirlineName", AirlineName) };

                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, ProcName, Parameters);

                var wmsFlightControlList = ds.Tables[0].AsEnumerable().Select(e => new CargoFlash.Cargo.Model.FlightControl.WMSAmendFlightControlGridData
                {
                    SNo = Convert.ToInt32(e["SNo"]),

                    BoardingPoint = e["BoardingPoint"].ToString(),
                    AirlineName = e["AirlineName"].ToString(),
                    EndPoint = e["EndPoint"].ToString(),
                    FlightNo = e["FlightNo"].ToString(),
                    // FlightDate = e["FlightDate"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["FlightDate"]), DateTimeKind.Utc),
                    FlightDate = e["FlightDate"].ToString() == "" ? "" : Convert.ToDateTime(e["FlightDate"].ToString()).ToString(DateFormat.DateFormatString),
                    FlightStatus = e["FlightStatus"].ToString(),
                    ACType = e["ACType"].ToString(),
                    CAO = e["CAO"].ToString(),
                    DAY = e["DAY"].ToString(),
                    ETA = e["ETA"].ToString(),
                    ETD = e["ETD"].ToString(),
                    ProcessStatus = Convert.ToString(e["ProcessStatus"]),
                    FlightRoute = e["SearchRoute"].ToString(),
                    /* Changes by Vipin Kumar 
                    Booked_G_V_CBM = Convert.ToString(e["Booked_G_V_CBM"]),
                    Avilable_G_V_CBM = Convert.ToString(e["Avilable_G_V_CBM"])
                    */
                    AvilableGrossWeight = Convert.ToDecimal(e["AvilableGrossWeight"]),
                    AvilableVolumeWeight = Convert.ToDecimal(e["AvilableVolumeWeight"]),
                    FlightAmendmentRemarks = e["FlightAmendmentRemarks"].ToString(),
                });
                ds.Dispose();
                return new KeyValuePair<string, List<CargoFlash.Cargo.Model.FlightControl.WMSAmendFlightControlGridData>>(ds.Tables[1].Rows[0][0].ToString(), wmsFlightControlList.AsQueryable().ToList());
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }


        public string createUpdateAmendFlightStatus(List<AmendFlightStatus> AmendFlightStatus)
        {
           
                //List<string> ErrorMessage = new List<string>();
                int ret = 0;
                BaseBusiness baseBussiness = new BaseBusiness();
                // convert JSON string ito datatable
                //var dtAmendFlightStatus = JsonConvert.DeserializeObject<DataTable>(strData);
                DataTable dtAmendFlightStatus = CollectionHelper.ConvertTo(AmendFlightStatus, "");
                var dtUpdateAFS = (new DataView(dtAmendFlightStatus, "SNo>0", "SNo", DataViewRowState.CurrentRows)).ToTable();
                SqlParameter param = new SqlParameter();
                param.ParameterName = "@AirCraftDoorTable";
                param.SqlDbType = System.Data.SqlDbType.Structured;

                // for update existing record
                if (dtUpdateAFS.Rows.Count > 0)
                {
                    //param.Value = dtUpdateAFS;
                    //SqlParameter[] Parameters = { param };
                    SqlParameter[] Parameters = { new SqlParameter("@sno", dtAmendFlightStatus.Rows[0]["SNo"].ToString()), new SqlParameter("@FlightStatus", dtAmendFlightStatus.Rows[0]["FlightStatus"].ToString()), new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()), new SqlParameter("@FlightAmendmentRemarks", dtAmendFlightStatus.Rows[0]["FlightAmendmentRemarks"].ToString()) };
                    //ret = (int)SqlHelper.ExecuteScalar(DMLConnectionString.WebConfigConnectionString, "UpdateAmendFlightStatus", Parameters);
                    DataSet ds = new DataSet();
                    try
                    {
                        ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "UpdateAmendFlightStatus", Parameters);
                        return ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
                    }
                    catch(Exception ex)//
                    {
                        throw ex;
                    }
                }
                else
                {
                    return null;
                }
           
        }

        public string GetFlightDetails(int DailyFlightSno, string AirlineName, string FlightNo, string BoardPoint, string EndPoint)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@DailyFlightSno", DailyFlightSno) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "DF_GetFlightDetails", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public string UpdateFlightPlan(int ExistingDailyFlightSNo, string ReferenceNumber, string FlightNumber, string FlightDate, int BoardingPoint, int EndPoint, string OriginFlightNo, string Pieces, string GrossWeight, string Volume, string TransferRemarks, bool IsReExecute, int TransferDailyFlightSNo)
        {       
            try
            {
                SqlParameter[] Parameters = {
                                         new SqlParameter("@ExistingDailyFlightSNo", ExistingDailyFlightSNo),
                                         new SqlParameter("@ReferenceNumber", ReferenceNumber),
                                         new SqlParameter("@FlightNumber", FlightNumber),
                                         new SqlParameter("@FlightDate", FlightDate),
                                         new SqlParameter("@BoardingPoint", BoardingPoint),
                                         new SqlParameter("@EndPoint", EndPoint),
                                         new SqlParameter("@OriginFlightNo", OriginFlightNo),
                                         new SqlParameter("@Pieces", Pieces),
                                         new SqlParameter("@GrossWeight", GrossWeight),
                                         new SqlParameter("@Volume", Volume),
                                         new SqlParameter("@TransferRemarks", TransferRemarks),
                                         new SqlParameter("@IsReExecute", IsReExecute),
                                          new SqlParameter("@TransferDailyFlightSNo", TransferDailyFlightSNo),  
                                         new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo)
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "FlightStatus_FlightTransfer", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public string BreachFlightStatusUpdate(string ReferenceNo, string OldOriginAirportSNo, string OldDestinationAirportSNo, string FlightDate)
        {
            try
            {
                SqlParameter[] Parameters = {
                                         new SqlParameter("@ReferenceNo", ReferenceNo),
                                         new SqlParameter("@OldOriginAirportSNo", OldOriginAirportSNo) ,
                                         new SqlParameter("@OldDestinationAirportSNo", OldDestinationAirportSNo) ,
                                         new SqlParameter("@FlightDate", FlightDate),
                                         new SqlParameter("@UpdatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo)
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "BreachFlight_StatusUpdate", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public string getFlightOrigin(string FlightNo, string FlightDate)
        {
            try
            {
                SqlParameter[] Parameters = {
                                         new SqlParameter("@FlightNo", FlightNo),
                                         new SqlParameter("@FlightDate", FlightDate)
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "AmendFlight_GetFlightOrigin", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public string getFlightCapacity(string FlightNo, string FlightDate, int OriginSNo, int DestinationSNo)
        {
            try
            {
                SqlParameter[] Parameters = {
                                         new SqlParameter("@FlightNo", FlightNo),
                                         new SqlParameter("@FlightDate", FlightDate),
                                         new SqlParameter("@OriginSNo", OriginSNo),
                                         new SqlParameter("@DestinationSNo", DestinationSNo)
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "AmendFlightTransfer_FlightCapacity", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public string getFlightDetails(string FlightNo, string FlightDate, string Source, string Destination, string CarrierCode)
        {
            try
            {
                //SqlParameter[] Parameters = {
                //                             new SqlParameter("@FlightNo", FlightNo),
                //                             new SqlParameter("@FlightDate", FlightDate),
                //                             new SqlParameter("@Source", Source),
                //                             new SqlParameter("@Destination", Destination)
                //                            };
                //DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "AmendFlightTransfer_FlightDetails", Parameters);
                SqlParameter[] Parameters = {
                                         new SqlParameter("@LoginSNo",((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo),
                                         new SqlParameter("@FlightNo",""),
                                         new SqlParameter("@FlightDate",FlightDate),
                                         new SqlParameter("@Origin", Source),
                                         new SqlParameter("@Destination", Destination),
                                         new SqlParameter("@Volume", null),
                                         new SqlParameter("@GrWeight", null),
                                         new SqlParameter("@ProductSNo", 0),
                                         new SqlParameter("@CommoditySNo", ""),
                                         new SqlParameter("@SHCSNo", ""),
                                         new SqlParameter("@AgentSNo", 0),
                                         new SqlParameter("@ShipperSNo", 0),
                                         new SqlParameter("@IsCAO",false),
                                         new SqlParameter("@IsUld", false),
                                         new SqlParameter("@OverrideBCT", false),
                                         new SqlParameter("@OverrideMCT", false),
                                         new SqlParameter("@IsMCT", false),
                                         new SqlParameter("@ETD", "00:00"),
                                         new SqlParameter("@SearchCarrierCode", ""),
                                         new SqlParameter("@SearchFrom", ""),
                                         new SqlParameter("@BookingNo", ""),
                                         new SqlParameter("@ErrorMessage ", "")
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spReservation_GroupBookingFlightSearch", Parameters);
                //ds.Tables[0].DefaultView.RowFilter = "FlightNo = '" + FlightNo + "' AND FlightDate = '" + FlightDate + "'";
                //ds.Tables[0].DefaultView.RowFilter = "FlightNo <> '" + FlightNo + "' OR FlightDate = '" + FlightDate + "'";
                ds.Tables[0].DefaultView.RowFilter = "FlightDate = '" + FlightDate + "'";
                //ds.Tables[0].DefaultView.RowFilter = "FlightNo <> 'GA-2323'";
                DataTable dt = (ds.Tables[0].DefaultView).ToTable();
                ds.Clear();
                ds.Merge(dt);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
    }
}
