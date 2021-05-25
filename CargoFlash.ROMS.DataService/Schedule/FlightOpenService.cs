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
using System.Net;
using System.ServiceModel.Web;

namespace CargoFlash.Cargo.DataService.Schedule
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class FlightOpenService : SignatureAuthenticate, IFlightOpenService
    {
        public DataSourceResult GetGridData(int skip, int take, int page, int pageSize, List<GridSort> sort, GridFilter filter)
        { try{
            string sorts = GridSort.ProcessSorting(sort);
            string filters = GridFilter.ProcessFilters<CargoFlash.Cargo.Model.Schedule.Schedule>(filter);
            //string _connectionStringName = ConfigurationManager.AppSettings.Get("DataProvider");

            SqlParameter[] Parameters = { new SqlParameter("@PageNo", page), new SqlParameter("@PageSize", pageSize), new SqlParameter("@WhereCondition", filters), new SqlParameter("@OrderBy", sorts) };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListSchedule", Parameters);
            var ScheduleList = ds.Tables[0].AsEnumerable().Select(e => new CargoFlash.Cargo.Model.Schedule.Schedule
            {
                SNo = Convert.ToInt32(e["SNo"]),
                ScheduleType = Convert.ToInt32(e["ScheduleType"]),
                ScheduleTypeName = e["ScheduleTypeName"].ToString(),
                AirlineSNo = Convert.ToInt32(Convert.ToString(e["AirlineSNo"])),
                AWBCode = Convert.ToString(e["AWBCode"]),
                CarrierCode = Convert.ToString(e["AirlineSNo"]) + "-" + Convert.ToString(e["AWBCode"]) + "-" + e["CarrierCode"].ToString(),
                Text_CarrierCode = e["CarrierCode"].ToString(),
                FlightNumber = Convert.ToString(e["FlightNumber"]),
                FlightNo = Convert.ToString(e["FlightNo"]),
                Origin = Convert.ToInt32(e["OriginAirportSNo"]),
                Text_Origin = Convert.ToString(e["OriginAirportCode"]),
                Destination = Convert.ToInt32(e["DestinationAirPortSNo"]),
                Text_Destination = Convert.ToString(e["DestinationAirportCode"]),
                Routing = Convert.ToString(e["Routing"]),
                IsCAO = Convert.ToBoolean(e["IsCAO"]),
                CAO = Convert.ToString(e["CAO"]),
                IsActive = Convert.ToBoolean(e["IsActive"]),
                Active = Convert.ToString(e["Active"]),
                //CreatedBy = Convert.ToString(e["CreatedUser"]),
                //UpdatedBy = Convert.ToString(e["UpdatedUser"])
            });
            ds.Dispose();
            return new DataSourceResult
            {
                Data = ScheduleList.AsQueryable().ToList(),
                Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
            };
             }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public string OpenFlight(OpenFlight Model)
        {
            try
            {
                DataSet ds = new DataSet();
                SqlParameter[] Parameters = { 
            new SqlParameter("@StartDate", Model.SD),
            new SqlParameter("@EndDate", Model.ED),
            new SqlParameter("@CarrierCode",Model.CarrierCode),
            new SqlParameter("@Airline", Model.Airline),
            new SqlParameter("@ScheduleType", Model.ScheduleType),
            new SqlParameter("@createdBy", Model.createdBy),
            new SqlParameter("@From", "Manual Flight Booking Open")};

                ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spFlight_BookingOpen", Parameters);
                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                {
                    var msg = ds.Tables[0].Rows[0][0].ToString();
                    if (msg.Contains("ROLLBACK"))
                    {
                        return "No Flight Open";
                    }
                    else
                        return DStoJSON(ds);
                }
                else
                    return "No Flight Open";
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public string DownloadExcelFile(Int64[] Model)  //(List<string> SNo)
        {
            try { 
            DataTable dt = new DataTable();
            dt.Columns.Add("SNo");
            foreach (int Array in Model)
            {
                dt.Rows.Add(Array);
            }

            SqlParameter[] Parameters = { new SqlParameter("@DFSno", SqlDbType.Structured) { Value = dt }, new SqlParameter("@PageNo", 0), new SqlParameter("@PageSize", 0), new SqlParameter("@WhereCondition", ""), new SqlParameter("@OrderBy", "") };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListFlightOpenDetails", Parameters);
            string str = DStoJSON(ds);
            return str;
            }
            catch(Exception ex)//
            {
                throw ex;
            }
            //StringBuilder str = new StringBuilder();
            //str.Append("<table><tr><td>Flight No</td><td>Flight Date</td><td>ETD</td><td>ETA</td><td>Origin</td><td>Destination</td><td>AirCraft</td></tr>");
            //foreach (DataRow dr in ds.Tables[0].Rows)
            //{
            //    string strline = string.Empty;
            //    strline = "<tr>";
            //    strline += "<td>'" + dr["FlightNo"].ToString() + "'</td>";
            //    strline += "<td>'" + dr["FlightDate"].ToString() + "'</td>";
            //    strline += "<td>'" + dr["ETD"].ToString() + "'</td>";
            //    strline += "<td>'" + dr["ETA"].ToString() + "'</td>";
            //    strline += "<td>'" + dr["OriginAirportCode"].ToString() + "'</td>";
            //    strline += "<td>'" + dr["DestinationAirportCode"].ToString() + "'</td>";
            //    strline += "<td>'" + dr["AirCraftSNo"].ToString() + "'</td>";
            //    strline += "</tr>";
            //    str.Append(strline);
            //}
            //str.Append("</table>");


            //return str.ToString();
        }

        public string DStoJSON(DataSet ds)
        {
            try{
            return CargoFlash.Cargo.Business.Common.DStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
            //StringBuilder json = new StringBuilder();
            //json.Append("[");
            //if (ds != null && ds.Tables.Count > 0)
            //{
            //    int lInteger = 0;
            //    foreach (DataRow dr in ds.Tables[ds.Tables.Count - 1].Rows)
            //    {
            //        lInteger = lInteger + 1;
            //        json.Append("{");
            //        int i = 0;
            //        int colcount = dr.Table.Columns.Count;
            //        foreach (DataColumn dc in dr.Table.Columns)
            //        {
            //            json.Append("\"");
            //            json.Append(dc.ColumnName);
            //            json.Append("\":\"");
            //            json.Append(dr[dc].ToString() == "" ? "" : dr[dc].ToString().Trim());
            //            json.Append("\"");
            //            i++;
            //            if (i < colcount) json.Append(",");
            //        }

            //        if (lInteger < ds.Tables[ds.Tables.Count - 1].Rows.Count)
            //        {
            //            json.Append("},");
            //        }
            //        else
            //        {
            //            json.Append("}");
            //        }
            //    }
            //}
            //json.Append("]");


            //return json.ToString();
        }

        public KeyValuePair<string, List<FlightOpen>> GetFlightCreatedRecord(string recordID, int page, int pageSize, FlightCreatedRecord model, string sort)
        {
            try{

            string whereCondition = model.DFAlreadyCreated;
            FlightOpen FTData = new FlightOpen();
            SqlParameter[] Parameters = { new SqlParameter("@DFSno", recordID), new SqlParameter("@PageNo", 1), new SqlParameter("@PageSize", 100), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", "") };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListFlightOpen", Parameters);
            var FTList = ds.Tables[0].AsEnumerable().Select(e => new FlightOpen
            {

                FlightNo = e["FlightNo"].ToString().ToUpper(),
                FlightDate = e["FlightDate"].ToString().ToUpper(),
                ETD = e["ETD"].ToString().ToUpper(),
                ETA = e["ETA"].ToString().ToUpper(),
                Origin = e["OriginAirportcode"].ToString(),
                Destination = e["Destinationairportcode"].ToString(),
                AirCraftSNo = e["AirCraftSNo"].ToString()
            });
            return new KeyValuePair<string, List<FlightOpen>>(ds.Tables[1].Rows[0][0].ToString(), FTList.AsQueryable().ToList());

            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public KeyValuePair<string, List<FlightOpen>> GetFlightAlreadyOpenedRecord(string recordID, int page, int pageSize, FlightCreatedRecord model, string sort)
        {
            try{
            string whereCondition = model.DFAlreadyCreated;
            FlightOpen FTData = new FlightOpen();
            SqlParameter[] Parameters = { new SqlParameter("@DFSno", recordID), new SqlParameter("@PageNo", 1), new SqlParameter("@PageSize", 100), new SqlParameter("@WhereCondition", whereCondition), new SqlParameter("@OrderBy", "") };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetListFlightOpen", Parameters);
            var FTList = ds.Tables[0].AsEnumerable().Select(e => new FlightOpen
            {
                FlightNo = e["FlightNo"].ToString().ToUpper(),
                FlightDate = e["FlightDate"].ToString().ToUpper(),
                ETD = e["ETD"].ToString().ToUpper(),
                ETA = e["ETA"].ToString().ToUpper(),
                Origin = e["OriginAirportcode"].ToString(),
                Destination = e["Destinationairportcode"].ToString(),
                AirCraftSNo = e["AirCraftSNo"].ToString()
            });
            return new KeyValuePair<string, List<FlightOpen>>(ds.Tables[1].Rows[0][0].ToString(), FTList.AsQueryable().ToList());
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        //Getting Flight capacity by Vikram Singh 30/12/2016


        //public string FlightCapacity(string str)
        //{
        //    DataSet ds = new DataSet();
        //    SqlParameter[] Parameters = { new SqlParameter("@CarrierCode", str.Remove(str.LastIndexOf(",")))};
        //    ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "getFlightCapacity", Parameters);
        //    FlightOpenService fos = new FlightOpenService();
        //    return fos.DStoJSON(ds);
        //}
        //Getting Flight capacity by Vikram Singh 30/12/2016
    }
}
