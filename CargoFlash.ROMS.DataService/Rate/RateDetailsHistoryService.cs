using CargoFlash.Cargo.Business;
using CargoFlash.Cargo.Model.Rate;
using CargoFlash.SoftwareFactory.Data;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Text;
namespace CargoFlash.Cargo.DataService.Rate
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class RateDetailsHistoryService : SignatureAuthenticate, IRateDetailsHistoryService
    {
        public string GetRateDetailsHistoryData(string AirlineSNo, string OfficeSNo, string RateTypeSNo, string stausval, string OriginLev, string Origin, string DestLev, string Destination, string vallidFrom, string VallidTo)
        {
         //OtherChargesHistory OtherChargesHistory = new OtherChargesHistory();
            RateDetailsHistory RateDetailsHistory = new RateDetailsHistory();
            DataSet dsRead = new DataSet();
            SqlDataReader dr = null;
            string Result = ""; 
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@AirlineSNo", AirlineSNo), new SqlParameter("@OfficeSNo", OfficeSNo), new SqlParameter("@RateTypeSNo", RateTypeSNo), new SqlParameter("@Origin", OriginLev), new SqlParameter("@OriginType", Origin), new SqlParameter("@Destnation", DestLev), new SqlParameter("@DestinationType", Destination), new SqlParameter("@Status", stausval), new SqlParameter("@VallidFrom", vallidFrom), new SqlParameter("@VallidTo", VallidTo) };
                //, new SqlParameter("@VallidFrom", vallidFrom), new SqlParameter("@VallidTo", VallidTo) };
                //dr = SqlHelper.ExecuteReader(connectionString, CommandType.StoredProcedure, "ReadAircraftDimensionMatrix", Parameters);
                dsRead = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetRateDetailsHistory_Record", Parameters);
                //if (dsRead != null)
                //{
                //var basicdata = dsRead.Tables[0];
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(dsRead);



                //if(dsRead.Tables[0].Rows.Count > 0)
                //{
                //    AircraftMatrixRead.Aircraft = dsRead.Tables[0].Rows[0][1].ToString();
                //    AircraftMatrixRead.HoldType = dsRead.Tables[0].Rows[0][2].ToString();
                //    AircraftMatrixRead.Unit = dsRead.Tables[0].Rows[0][3].ToString();
                //    AircraftMatrixRead.Rows = Convert.ToInt32(dsRead.Tables[0].Rows[0][4].ToString());
                //    AircraftMatrixRead.Cols = Convert.ToInt32(dsRead.Tables[0].Rows[0][5].ToString());
                //    AircraftMatrixRead.CreatedBy = dsRead.Tables[0].Rows[0][6].ToString();
                //    AircraftMatrixRead.UpdatedBy = dsRead.Tables[0].Rows[0][7].ToString();
                //    AircraftMatrixRead.CreatedOn = Convert.ToDateTime(dsRead.Tables[0].Rows[0][8].ToString());
                //    AircraftMatrixRead.UpdatedOn = Convert.ToDateTime(dsRead.Tables[0].Rows[0][9].ToString());
                //}


                //var data = dsRead.Tables[1];


                //.AsEnumerable().Select(e => new AircraftMatrixRead
                //{
                //SNo = Convert.ToInt32(e["SNo"]),
                //AirlineName = e["AirlineName"].ToString().ToUpper().ToUpper(),
                //FlightNo = e["FlightNo"].ToString().ToUpper(),
                //FlightDate = e["FlightDate"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["FlightDate"]), DateTimeKind.Utc),
                //AgentName = e["AgentName"].ToString().ToUpper(),
                //OriginCityCode = e["OriginCityCode"].ToString().ToUpper(),
                //CreatedBy = e["CreatedBy"].ToString().ToUpper(),
                //CreatedOn = e["CreatedOn"] == DBNull.Value ? (DateTime?)null : DateTime.SpecifyKind(Convert.ToDateTime(e["CreatedOn"]), DateTimeKind.Utc),
                //UploadFrom = e["UploadFrom"].ToString().ToUpper(),
                //TotalULD = Convert.ToInt32(e["TotalULD"]),
                //TotalShipment = Convert.ToInt32(e["TotalShipment"]),
                //});
                //    }


            }
            catch(Exception ex)// (Exception ex)
            {
                Result = "{\"Table0\":[{\"Result\":\"Unable to save. " + ex.Message.Replace(@"""", @"\""") + "\"}]}";
            }
            //return AircraftMatrixRead;
            return Result;
        }

        public string GetData()
        {

            try
            {
                //OtherChargesHistory OtherChargesHistory = new OtherChargesHistory();
                RateDetailsHistory RateDetailsHistory = new RateDetailsHistory();
                DataSet dsRead = new DataSet();
                SqlDataReader dr = null;
                string Result = "";
                //try
                //{
                //    SqlParameter[] Parameters = { new SqlParameter("@AirlineSNo", AirlineSNo), new SqlParameter("@OfficeSNo", OfficeSNo), new SqlParameter("@RateTypeSNo", RateTypeSNo), new SqlParameter("@Origin", OriginLev), new SqlParameter("@OriginType", Origin), new SqlParameter("@Destnation", DestLev), new SqlParameter("@DestinationType", Destination), new SqlParameter("@Status", stausval), new SqlParameter("@VallidFrom", vallidFrom), new SqlParameter("@VallidTo", VallidTo) };
                //    //, new SqlParameter("@VallidFrom", vallidFrom), new SqlParameter("@VallidTo", VallidTo) };
                //    //dr = SqlHelper.ExecuteReader(connectionString, CommandType.StoredProcedure, "ReadAircraftDimensionMatrix", Parameters);
                //    dsRead = SqlHelper.ExecuteDataset(connectionString, CommandType.StoredProcedure, "GetRateDetailsHistory_Record", Parameters);
                //    //if (dsRead != null)
                //    //{
                //    //var basicdata = dsRead.Tables[0];
                //    return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(dsRead);

                //}
                //catch(Exception ex)// (Exception ex)
                //{
                //    Result = "{\"Table0\":[{\"Result\":\"Unable to save. " + ex.Message.Replace(@"""", @"\""") + "\"}]}";
                //}
                ////return AircraftMatrixRead;
                return Result;
            }
            catch(Exception ex)//
            {

                throw ex;
            }
        }
    }
}
