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
    public class FlightStatusService : SignatureAuthenticate, IFlightStatusService
    {

        public KeyValuePair<string, List<FlightStatus>> GetFlightStatusRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {

            try
            {
                string FDt = whereCondition.Split('*')[0];
                string FlightOrigin = whereCondition.Split('*')[1];
                string FlightNo = whereCondition.Split('*')[2];


                whereCondition = "";

                FlightStatus FlightStatus = new FlightStatus();
                SqlParameter[] Parameters = { 
                                            new SqlParameter("@FlightNo", FlightNo),                                         
                                            new SqlParameter("@FlightDate", Convert.ToDateTime(FDt)),
                                                  new SqlParameter("@FlightOrigin", FlightOrigin)     ,
                                                   
                                                      new  SqlParameter("@Usersno", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())                                   
                                        };

                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAllLoadPlan_LI_BUP", Parameters);
                var FlightStatusList = ds.Tables[0].AsEnumerable().Select(e => new FlightStatus
                {
                    FlightNo = Convert.ToString(e["FlightNo"].ToString()),
                    FlightDate = Convert.ToString(e["FlightDate"].ToString()),
                    FlightOrigin = Convert.ToString(e["FlightOrigin"].ToString()),
                    TotalPlannedULD = Convert.ToString(e["TotalPlannedULD"].ToString()),
                    TotalManpower = Convert.ToString(e["TotalManpower"].ToString()),
                    TotalTime = Convert.ToString(e["TotalTime"].ToString()),
                    CompletedULD = Convert.ToString(e["CompletedULD"].ToString()),
                    TotalPercent = Convert.ToString(e["TotalPercent"].ToString()),
                    Dt = Convert.ToString(e["Dt"].ToString())

                });
                return new KeyValuePair<string, List<FlightStatus>>(ds.Tables[1].Rows[0][0].ToString(), FlightStatusList.AsQueryable().ToList());
            }
            catch(Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetAllLoadPlan_LI_BUP"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }


        public List<FlightStatus> SearchData(FlightStatus obj)
        {
            try
            {
                List<FlightStatus> lst = new List<FlightStatus>();
               

                SqlParameter[] Parameters = {    new SqlParameter("@FlightNo", obj.FlightNo),                                         
                                            new SqlParameter("@FlightDate", Convert.ToDateTime(obj.FlightDate)),
                                                  new SqlParameter("@FlightOrigin", obj.FlightOrigin),
                                                  
                                                      new  SqlParameter("@Usersno", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                            };

                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetAllLoadPlan_LI_BUP", Parameters);
                if (ds != null && ds.Tables.Count > 0)
                    lst = ds.Tables[0].AsEnumerable().Select(e => new FlightStatus
                    {

                        FlightNo = Convert.ToString(e["FlightNo"].ToString()),
                        FlightDate = Convert.ToString(e["FlightDate"].ToString()),
                        FlightOrigin = Convert.ToString(e["FlightOrigin"].ToString()),
                        TotalPlannedULD = Convert.ToString(e["TotalPlannedULD"].ToString()),
                        TotalManpower = Convert.ToString(e["TotalManpower"].ToString()),
                        TotalTime = Convert.ToString(e["TotalTime"].ToString()),
                        CompletedULD = Convert.ToString(e["CompletedULD"].ToString()),
                        TotalPercent = Convert.ToString(e["TotalPercent"].ToString()) ,
                        Dt = Convert.ToString(e["Dt"].ToString())

                    }).ToList();
                return lst;
            }
            catch(Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetAllLoadPlan_LI_BUP"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }

    }
}
