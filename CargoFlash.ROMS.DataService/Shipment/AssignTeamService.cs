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
using CargoFlash.Cargo.Model.Shipment;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using CargoFlash.Cargo.Model;
using CargoFlash.Cargo.DataService.Common;
using System.Net;

namespace CargoFlash.Cargo.DataService.Shipment
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class AssignTeamService : SignatureAuthenticate, IAssignTeamService
    {
        public KeyValuePair<string, List<AssignTeam>> GetAssignTeamRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                string DailyFlightSNo = whereCondition.Split('*')[0];
                whereCondition = "";

                AssignTeam AssignTeam = new AssignTeam();
                SqlParameter[] Parameters = { new SqlParameter("@DailyFlightSNo", DailyFlightSNo) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAssignTeamRecord", Parameters);
                var AssignTeamList = ds.Tables[0].AsEnumerable().Select(e => new AssignTeam
                {
                    SNo = Convert.ToInt32(e["SNo"]),
                    //Airline = Convert.ToString(e["AirlineName"].ToString()),
                    //Origin = Convert.ToString(e["OriginAirportCode"].ToString()),
                    //Destination = Convert.ToString(e["DestinationAirportCode"].ToString()),
                    //FlightNo = Convert.ToString(e["FlightNo"].ToString()),
                    ////FlightDate = Convert.ToDateTime(e["FlightDate"]),
                    //FlightDate = Convert.ToDateTime(e["FlightDate"].ToString()).ToString("dd MMMM yyyy"),
                    //AWBNo = Convert.ToString(e["AWBNo"].ToString()),
                    //Pieces = Convert.ToString(e["Pieces"].ToString()),
                    //GrossWeight = Convert.ToString(e["GrossWeight"].ToString()),
                    //VolumeWeight = Convert.ToString(e["VolumeWeight"].ToString()),
                    ////ULD = Convert.ToString(e["ULD"].ToString()),
                    //SHC = Convert.ToString(e["SPHC"].ToString()),
                    //Status = Convert.ToString(e["Status"].ToString())
                });
                return new KeyValuePair<string, List<AssignTeam>>(ds.Tables[1].Rows[0][0].ToString(), AssignTeamList.AsQueryable().ToList());
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }


        public string AssignTeamTable(Int32 DailyFlightSNo, int MovementTypeSNo)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@DailyFlightSNo", DailyFlightSNo), new SqlParameter("@MovementTypeSNo", MovementTypeSNo) };
                DataSet ds = new DataSet();
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "AssignTeamGetRecord", Parameters);
                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public string UpdateAssignTeam(String GroupSNo, String AssignTeam, Int16 Time, Int32 DailFlightSNo, Int32 SNo, Int32 MovementTypeSNo)
        {
            try
            {
                DataSet ds = new DataSet();
                SqlParameter[] Parameters = { 
                new SqlParameter("@GroupSNo", GroupSNo),
                new SqlParameter("@AssignTeam", AssignTeam),
                new SqlParameter("@Time", Time),
                new SqlParameter("@DailFlightSNo", DailFlightSNo),
                new SqlParameter("@SNo", SNo),
                new SqlParameter("MovementTypeSNo", MovementTypeSNo),
                                        };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "UpdateAssignTeam", Parameters);
                //Finish:

                var msg = ds.Tables[ds.Tables.Count - 1].Rows[0][0].ToString();
                if (msg == "2000")
                {
                    CommonService.SaveFlightSubProcessTrans(DailFlightSNo, 6, 2094, true, null);  //update subprocess for Loading Instruction
                }
                else
                {
                    CommonService.SaveFlightSubProcessTrans(DailFlightSNo, 6, 2094, false, null);
                }

                ds.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
    }
}
