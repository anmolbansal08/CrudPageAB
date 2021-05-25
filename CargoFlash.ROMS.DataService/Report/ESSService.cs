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
    public class ESSService : SignatureAuthenticate, IESSService
    {

        public string GetESSRecord(String FromDate, String ToDate, String Type, String Handling, String Reporting, String Party, string citysno)
        {

            try
            {

                String procname = string.Empty;
                if (Type == "1")
                {


                    procname = "GetIECashESS";
                }
                else if (Type == "2")
                {

                    procname = "GetIECreditESS";
                }
                else if (Type == "3")
                {

                    procname = "GetIEESS";
                }



                SqlParameter[] Parameters = {   new SqlParameter("@FromDt", Convert.ToDateTime(FromDate.Replace('_', ':'))), 
                                            new SqlParameter("@ToDt",Convert.ToDateTime(ToDate.Replace('_', ':'))), 
                                            new SqlParameter("@HandlingType",Handling)  ,      
                                            new SqlParameter("@Reporting",Reporting)  ,   
                                            new SqlParameter("@Party",Party)  ,   
                                              new  SqlParameter("@Usersno", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                                               new  SqlParameter("@citysno",Convert.ToInt32(citysno))
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
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetIECashESS"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }
                 //Added by Devendra singh on 28 Aug 2017
        public string GetCashierRecord(String FromDate, String ToDate, String CashierSno)
        {

            try
            {
                SqlParameter[] Parameters = {   new SqlParameter("@FromDt",FromDate.ToString()), 
                                           new SqlParameter("@ToDt",ToDate.ToString()), 
                                           new SqlParameter("@CashierSno",CashierSno)  ,                                             
                                           new  SqlParameter("@Usersno", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                           };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetBothCashESSCashier", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetBothCashESSCashier"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }  


    }
}
