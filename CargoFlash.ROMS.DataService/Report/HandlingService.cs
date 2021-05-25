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
    public class HandlingService : SignatureAuthenticate, IHandlingService
    {

        public string GetHandlingRecord(String FromDate, String ToDate, String HandlingType, String AWBNo, String ReportType, String Agent, String Airline, String Type, String InvoiceNo)
        {
            try
            {
                String procname = string.Empty;
                if (Type == "1")
                {
                    procname = "GetImExCash";
                }
                else if (Type == "2")
                {

                    procname = "GetImExCredit";
                }
                else if (Type == "3")
                {
                    procname = "GetImExBoth";
                }



                SqlParameter[] Parameters = {   new SqlParameter("@FromDt", Convert.ToDateTime(FromDate)),
                                            new SqlParameter("@ToDt",Convert.ToDateTime(ToDate))  ,
                                            new SqlParameter("@HandlingType",HandlingType)  ,
                                            new SqlParameter("@AWBNo",AWBNo)  ,
                                            new SqlParameter("@ReportType",ReportType)  ,
                                            new SqlParameter("@Agent",Agent)  ,
                                            new SqlParameter("@Airline",Airline)  ,
                                            new SqlParameter("@InvoiceNo",InvoiceNo)  ,
                                            new  SqlParameter("@Usersno", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                            };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, procname, Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetImExCredit"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }

    }
}
