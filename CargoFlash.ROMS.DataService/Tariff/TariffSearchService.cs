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
using CargoFlash.Cargo.Model.Tariff;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using CargoFlash.Cargo.Model;
using System.Net;
namespace CargoFlash.Cargo.DataService.Tariff
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class TariffSearchService : SignatureAuthenticate, ITariffSearchService
    {

        public string GetTariffSearchRecord(String TariffType, String TariffAgent, String TariffAirline, String TariffDate)
        {

            try
            {
                String tcode = string.Empty;
                String procname = string.Empty;

                //if (TariffAgent != "")
                //{
                //    tcode = TariffAgent;

                //}
                //else if (TariffAirline != "")
                //{
                //    tcode = TariffAirline;

                //}
                //else {
                //    tcode = "0";

                //}


                if (TariffType == "0")
                {
                    tcode = "0";
                    procname = "GetTariffSearch";
                }

                else if (TariffType == "1")
                {
                    tcode = TariffAirline;
                    procname = "GetTariffAirline";
                }
                else if (TariffType == "2")
                {
                    tcode = TariffAgent;
                    procname = "GetTariffAgent";
                }

                String tdt = "01/01/1900";
                DateTime dt;

                if (TariffDate == "")
                {

                    dt = Convert.ToDateTime(tdt);
                }
                else
                {
                    dt = Convert.ToDateTime(TariffDate);
                }

                SqlParameter[] Parameters = {  
                                             new SqlParameter("@TariffCode", tcode),
                                              new SqlParameter("@TariffDate", dt),
                                                 new  SqlParameter("@Usersno", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                            };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, procname, Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

    }
}
