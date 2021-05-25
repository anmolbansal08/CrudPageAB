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
    public class SeaAirService : SignatureAuthenticate, ISeaAirService
    {

        public string GetSeaAirRecord(String FromDate, String ToDate, String rpt,String Agent,String Airline,String Awb)
        {
            try
            {

                String procname = string.Empty;
                String id = String.Empty;
                if (rpt == "1")
                {
                    id = Airline;
                    procname = "GetSeaAirline";
                }
                else if (rpt == "2")
                {
                    id = Agent;
                    procname = "GetSeaAgent";
                }

                String tdt = "01/01/1900";
                DateTime fdt;
                DateTime todt;

                if (FromDate == "")
                {

                    fdt = Convert.ToDateTime(tdt);
                }
                else
                {
                    fdt = Convert.ToDateTime(FromDate);
                }

                if (ToDate == "")
                {

                    todt = Convert.ToDateTime(tdt);
                }
                else
                {
                    todt = Convert.ToDateTime(ToDate);
                }



                SqlParameter[] Parameters = {   new SqlParameter("@FromDt",fdt),
                                            new SqlParameter("@ToDt",todt) ,  
                                            new SqlParameter("@id",id)  ,
                                             new SqlParameter("@Awb",Awb)  ,
                                             
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
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetSeaAgent"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }

    }
}
