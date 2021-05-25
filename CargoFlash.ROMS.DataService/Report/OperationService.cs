using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ServiceModel;
using System.ServiceModel.Activation;
using CargoFlash.Cargo.Model.Operation;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using CargoFlash.SoftwareFactory.WebUI;
using System.IO;
using System.ServiceModel.Web;
using CargoFlash.Cargo.Model.Report;
using System.Net;



namespace CargoFlash.Cargo.DataService.Report
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class OperationService : BaseWebUISecureObject, IOperationService
    {

        public List<RCSData> GetRCSData(string from, string to, string citycode, string Type)
        {
            try
            {

                List<RCSData> lst = new List<RCSData>();
                SqlParameter[] Parameters = { 
                                              
                                                new SqlParameter("@FromDate", Convert.ToDateTime(from.Replace('_', ':'))) ,
                                                 new SqlParameter("@ToDate", Convert.ToDateTime(to.Replace('_', ':'))),
                                                    new  SqlParameter("@Usersno", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                };

                string procname = string.Empty;
                if (Type == "1")
                {
                    procname = "GetExportOperationAgent";

                }
                else if (Type == "2")
                {
                    procname = "GetExportOperationDestination";

                }
                else if (Type == "3")
                {
                    procname = "GetExportOperationSHC";

                }
                else if (Type == "4")
                {
                    procname = "GetExportOperationAirline";

                }
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, procname, Parameters);
                var res = ds.Tables[1].AsEnumerable().Select(e => new RCSData
                {
                    AgentName = e["Agent"].ToString(),
                    TotalRCSCargo = e["RCSCargo"].ToString(),
                    TotalRCSCargoNotBuild = e["RCSCargoNotBuild"].ToString(),
                    TotalOngoingBuild = e["OngoingBuild"].ToString(),
                    TotalRCSBuild = e["RCSBuild"].ToString(),
                    TotalUWSNotDone = e["UWSNotDone"].ToString(),
                    TotalUWSDone = e["UWSDone"].ToString(),


                }).ToList();
                return res;
            }
            catch(Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetExportOperationDestination"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }


        public string GetData(string from, string to, string citycode, string Type)
        {

            try
            {

                List<RCSData> lst = new List<RCSData>();
                SqlParameter[] Parameters = { 
                                              
                                                new SqlParameter("@FromDate", Convert.ToDateTime(from.Replace('_', ':'))) ,
                                                 new SqlParameter("@ToDate", Convert.ToDateTime(to.Replace('_', ':'))),
                                                   new  SqlParameter("@Usersno", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                };

                string procname = string.Empty;
                if (Type == "1")
                {
                    procname = "GetExportOperationAgent";

                }
                else if (Type == "2")
                {
                    procname = "GetExportOperationDestination";

                }
                else if (Type == "3")
                {
                    procname = "GetExportOperationSHC";

                }
                else if (Type == "4")
                {
                    procname = "GetExportOperationAirline";

                }
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, procname, Parameters);


                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);

            }
            catch(Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetExportOperationAirline"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }

    }
}
