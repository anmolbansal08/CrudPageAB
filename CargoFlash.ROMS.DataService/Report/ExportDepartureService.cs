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
    public class ExportDepartureService : SignatureAuthenticate, IExportDepartureService
    {
        public KeyValuePair<string, List<ExportDeparture>> GetExportDepartureRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {

                string FlightDt = whereCondition.Split('*')[0];
                string Exclude = whereCondition.Split('*')[1];

                DateTime todt;

                whereCondition = "";

                String tdt = "01/01/1900";
                if (FlightDt == "")
                {

                    todt = Convert.ToDateTime(tdt);
                }
                else
                {
                    todt = Convert.ToDateTime(FlightDt);
                }




                ExportDeparture ExportDeparture = new ExportDeparture();
                SqlParameter[] Parameters = { 
                                            new SqlParameter("@FlightDt",todt),
                                            new SqlParameter("@Exclude",Convert.ToInt32(Exclude)),
                                            new  SqlParameter("@Usersno", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())                                              
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetExportDeparture", Parameters);
                var ExportDepartureList = ds.Tables[0].AsEnumerable().Select(e => new ExportDeparture
                {

                    FlightNo = Convert.ToString(e["FlightNo"].ToString()),
                    FlightDate = Convert.ToString(e["FlightDate"].ToString()),
                    ETD = Convert.ToString(e["ETD"].ToString()),
                    ATD = Convert.ToString(e["ATD"].ToString()),
                    ACType = Convert.ToString(e["ACType"].ToString()),
                    FlightRoute = Convert.ToString(e["FlightRoute"].ToString()),
                    FlightStatus = Convert.ToString(e["FlightStatus"].ToString()),
                    Delay = Convert.ToString(e["Delay"].ToString()),
                    DelayMN = Convert.ToString(e["DelayInMn"].ToString()),
                    Dt = Convert.ToString(e["Dt"].ToString()),
                    NILManifest = Convert.ToString(e["NILManifest"].ToString())

                });
                return new KeyValuePair<string, List<ExportDeparture>>(ds.Tables[1].Rows[0][0].ToString(), ExportDepartureList.AsQueryable().ToList());
            }
            catch(Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetExportDeparture"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }


        public List<ExportDeparture> SearchData(ExportDeparture obj)
        {
            try
            {
                List<ExportDeparture> lst = new List<ExportDeparture>();



                DateTime todt;

                String tdt = "01/01/1900";
                if (obj.FlightDt == "")
                {

                    todt = Convert.ToDateTime(tdt);
                }
                else
                {
                    todt = Convert.ToDateTime(obj.FlightDt);
                }


                SqlParameter[] Parameters = { 
                                            new SqlParameter("@FlightDt",todt),
                                              new SqlParameter("@Exclude",Convert.ToInt32(obj.Exclude)),
                                            new  SqlParameter("@Usersno", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())                                              
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetExportDeparture", Parameters);

                if (ds != null && ds.Tables.Count > 0)
                    lst = ds.Tables[0].AsEnumerable().Select(e => new ExportDeparture
                    {

                        FlightNo = Convert.ToString(e["FlightNo"].ToString()),
                        FlightDate = Convert.ToString(e["FlightDate"].ToString()),
                        ETD = Convert.ToString(e["ETD"].ToString()),
                        ATD = Convert.ToString(e["ATD"].ToString()),
                        ACType = Convert.ToString(e["ACType"].ToString()),
                        FlightRoute = Convert.ToString(e["FlightRoute"].ToString()),
                        FlightStatus = Convert.ToString(e["FlightStatus"].ToString()),
                        Delay = Convert.ToString(e["Delay"].ToString()),
                        DelayMN = Convert.ToString(e["DelayInMn"].ToString()),
                        Dt = Convert.ToString(e["Dt"].ToString()),
                        NILManifest = Convert.ToString(e["NILManifest"].ToString())
                    }).ToList();
                return lst;
            }
            catch(Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetExportDeparture"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }

    }
}
