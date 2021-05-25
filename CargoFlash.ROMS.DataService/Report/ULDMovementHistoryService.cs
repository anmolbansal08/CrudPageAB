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
using CargoFlash.Cargo.Model.Report;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using CargoFlash.Cargo.Model;
using System.Net;

namespace CargoFlash.Cargo.DataService.Report
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class ULDMovementHistoryService : SignatureAuthenticate, IULDMovementHistoryService
    {
        // Changes by Vipin Kumar
        //public KeyValuePair<string, List<ULDMovementHistory>> GetULDMovementHistoryRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        public KeyValuePair<string, List<ULDMovementHistory>> GetULDMovementHistoryRecord(string recordID, int page, int pageSize, ULDMovement uldMovement, string sort)
        // Ends
        {
            try
            {
            //string FDt = whereCondition.Split('*')[0];
            //string TDt = whereCondition.Split('*')[1];
            //string ULDSno = whereCondition.Split('*')[2];
            
            //string[] Condition = Condition1.Split('=')[1].ToString();

            //whereCondition = "";
        
            CargoRankingEI CargoRankingEI = new CargoRankingEI();
            SqlParameter[] Parameters = {             
                                           //  new  SqlParameter("@AirportCode", AirportCode.Split('-')[0]),
                                           //new SqlParameter("@ULDSno", ULDSno) ,
                                           //new SqlParameter("@FromDate", Convert.ToDateTime(FDt)),
                                           new SqlParameter("@PageNo", page),
                                           new SqlParameter("@PageSize", pageSize),
                                           new SqlParameter("@ULDNo",uldMovement.ULDNo),
                                           new SqlParameter("@ToDate",uldMovement.ToDate),
                                           new SqlParameter("@FromDate",uldMovement.FromDate),
                                           new SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                        };
            DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "UldMovement", Parameters);
          
                var ULDMovementHistoryList = ds.Tables[0].AsEnumerable().Select(e => new ULDMovementHistory
                {

                    Status = Convert.ToString(e["Status"].ToString()),
                    MovementType = Convert.ToString(e["MovementType"].ToString()),
                    OriginAirPortCode = Convert.ToString(e["OriginAirPortCode"].ToString()),
                    DestinationAirPortCode = Convert.ToString(e["DestinationAirPortCode"].ToString()),
                    FlightNo = Convert.ToString(e["FlightNo"].ToString()),
                    FlightDate = Convert.ToString(e["FlightDate"].ToString()),
                    ULDNo = Convert.ToString(e["ULDNo"].ToString()),

                    ATA = Convert.ToString(e["ATA"].ToString()),
                    ATD = Convert.ToString(e["ATD"].ToString()),

                });
                return new KeyValuePair<string, List<ULDMovementHistory>>(ds.Tables[1].Rows[0][0].ToString(), ULDMovementHistoryList.AsQueryable().ToList());
            }
            catch(Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","UldMovement"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }
        // Changes by Vipin Kumar
        //public string getULDDetails(string ULDSNo)
        public string getULDDetails(int? ULDSNo)
        // Ends
        {
            try
            {
            SqlParameter[] Parameters = { new SqlParameter("@ULDSNo", Convert.ToString(ULDSNo)) };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "getUldStatus", Parameters);
            
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","getUldStatus"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }
        // Changes by Vipin Kumar
        //public string SearchData(string AirportSNo, string ULDSNo, string FromDate, string ToDate)
        public string SearchData(SearchData searchData)
        // Ends
        
        {
            try
            {
            SqlParameter[] Parameters = { new SqlParameter("@AirportCode", searchData.Airport.Split('-')[0]),
                                            new SqlParameter("@ULDSno", searchData.ULDSNo),
                                            new SqlParameter("@FromDate", searchData.FromDate),
                                            new SqlParameter("@ToDate", searchData.ToDate)
                                        
                                        
                                        };
            DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "SpExcelUldMovement", Parameters);
          
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","SpExcelUldMovement"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }
        
    }
}
