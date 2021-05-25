using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using Newtonsoft.Json;
using System.Runtime.Serialization;
using CargoFlash.Cargo.Model.Shipment;
using System.Net;
using System.ServiceModel.Web;

namespace CargoFlash.Cargo.DataService.Shipment
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class UCMInOutAlertService : SignatureAuthenticate, IUCMInOutAlertService
    {
        CargoFlash.Cargo.Business.BaseBusiness basebusiness = new CargoFlash.Cargo.Business.BaseBusiness();
  

        public KeyValuePair<string, List<UCMInOutAlert>> getUCMINOutAlertDetails(string recid, int pageNo, int pageSize, string whereCondition, string sort)
        {
            try
            {
                SqlParameter[] Parameters = { 
                                          new SqlParameter("@PageNo", pageNo),
                                          new SqlParameter("@PageSize", pageSize),
                                          new SqlParameter("@WhereCondition", whereCondition),
                                          new SqlParameter("@OrderBy", sort),
                                           new SqlParameter("@UserSno", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                        };

                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "getUCMINOutAlertDetails", Parameters);
                var UCMInOutAlertList = ds.Tables[0].AsEnumerable().Select(e => new UCMInOutAlert
               {
                   DailyFlightSNo = Convert.ToInt32(e["SNo"]),
                   FlightNo = Convert.ToString(e["FlightNo"]),
                   DailyFlightNo = Convert.ToString(e["FlightNo"]),
                   FlightDate = Convert.ToString(e["FlightDate"]),
                   OriginAirportSNo = Convert.ToString(e["OriginAirportCode"]),
                   DestinationAirPortSNo = Convert.ToString(e["DestinationAirPortCode"]),
                   ATD = Convert.ToString(e["ATD"]),
                   ATA = Convert.ToString(e["ATA"]),
                   UCMOutAlertCount = Convert.ToString(e["UCMoutAlertCount"]),
                   UCMInAlertCount = Convert.ToString(e["UCMInAlertCount"]),
                   //UCMIn = Convert.ToString(e["UCMIn"]),
                   //EmailCount = Convert.ToString(e["EmailCount"]),

               });
                if (ds.Tables[0].Rows.Count == 0)
                {
                    return new KeyValuePair<string, List<UCMInOutAlert>>(null, UCMInOutAlertList.AsQueryable().ToList());
                }
                else
                {
                    return new KeyValuePair<string, List<UCMInOutAlert>>(ds.Tables[0].Rows[0][0].ToString(), UCMInOutAlertList.AsQueryable().ToList());
                }
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }


        public string getUCMINOutAlertULDDetails(Int32 DailyFlightSNO)
        {

            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { new SqlParameter("@DailyFlightSNO", DailyFlightSNO)};
            DataSet ds1 = new DataSet();
            try
            {
                ds1 = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "spUCMINOUTAlert_uldDetails", Parameters);
               // return ds1.Tables[0].Rows[0][0].ToString();
                ds1.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds1);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }

        public string SendUCMINOutAlertULDDetails(string MailTo, string MailBody, Int32 DailyFlightSNO)
        {

            DataSet ds = new DataSet();
            SqlParameter[] Parameters = { new SqlParameter("@DailyFlightSNO", DailyFlightSNO), new SqlParameter("@MailTo", MailTo), new SqlParameter("@MailBody", MailBody.ToString()), new SqlParameter("@UserSno",Convert.ToInt32( ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo)) };
            DataSet ds1 = new DataSet();
            try
            {
                ds1 = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, "spSendUCMINOutAlertULDDetails", Parameters);
             
                ds1.Dispose();
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds1);
            }
            catch(Exception ex)//
            {
                throw ex;
            }
        }
 




    }
}
