using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ServiceModel;
using System.ServiceModel.Activation;
using CargoFlash.Cargo.Model.ImpOperation;
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
    public class ImpOperationService : BaseWebUISecureObject, IImpOperationService
    {

        public List<Data> GetFFMData(string from, string to, string citycode,string Type)
        {
            try
            {

                List<Data> lst = new List<Data>();
                SqlParameter[] Parameters = { 
                                              
                                                new SqlParameter("@FromDate", Convert.ToDateTime(from.Replace('_', ':'))) ,
                                                 new SqlParameter("@ToDate", Convert.ToDateTime(to.Replace('_', ':'))),
                                                  new  SqlParameter("@Usersno", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                };

                string procname = string.Empty;
                if (Type == "2")
                {
                    procname = "GetImportOperationOrigin";

                }
                else if (Type == "3")
                {
                    procname = "GetImportOperationSHC";

                }
                else if (Type == "4")
                {
                    procname = "GetImportOperationAirline";

                }
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, procname, Parameters);
                var res = ds.Tables[0].AsEnumerable().Select(e => new Data
                {
                    AirlineName = e["Airline"].ToString(),
                    TotalTonnageRecd = e["TonnageRecd"].ToString(),
                    TotalTonnageArrived = e["TonnageArrived"].ToString(),
                    TotalPending = e["Pending"].ToString(),
                    TotalOngoing = e["Ongoing"].ToString(),
                    TotalCompleted = e["Completed"].ToString(),
                    TotalLocation = e["Location"].ToString(),
                   

                }).ToList();
                return res;
            }
            catch(Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetImportOperationOrigin"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }

        }


        public string GetData(string from, string to, string citycode, string Type)
        {

           

                List<Data> lst = new List<Data>();
                SqlParameter[] Parameters = { 
                                              
                                                new SqlParameter("@FromDate", Convert.ToDateTime(from.Replace('_', ':'))) ,
                                                 new SqlParameter("@ToDate", Convert.ToDateTime(to.Replace('_', ':'))),
                                                  new  SqlParameter("@Usersno", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                };

                string procname = string.Empty;
                
                 if (Type == "2")
                {
                    procname = "GetImportOperationOrigin";

                }
                else if (Type == "3")
                {
                    procname = "GetImportOperationSHC";

                }
                else if (Type == "4")
                {
                    procname = "GetImportOperationAirline";

                }
                 DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, procname, Parameters);


                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
           
            
        }

    }
}
