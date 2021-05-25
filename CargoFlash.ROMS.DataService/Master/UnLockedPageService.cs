using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using CargoFlash.Cargo.Model.Master;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using Newtonsoft.Json;
using System.ServiceModel.Web;
using System.Net;

namespace CargoFlash.Cargo.DataService.Master
{
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]   [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]

    public class UnLockedPageService : SignatureAuthenticate, IUnLockedPageService
    {




        public KeyValuePair<string, List<UnLockedPage>> GetUnLockedPageRecord(int recid, int pageNo, int pageSize, whereconditionmodel model, string sort)
          {

           try
           {
               UnLockedPage UnLockedPage = new UnLockedPage();
                //var Type = whereCondition.Split('/')[0];
                //var typeOf = whereCondition.Split('/')[1];
                //var Lockedby = whereCondition.Split('/')[2];
                string airportcode = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportCode;
                SqlParameter[] Parameters = { new SqlParameter("@PageNo", pageNo), new SqlParameter("@PageSize", pageSize), new SqlParameter("@OrderBy", sort), new SqlParameter("@type", model.type), new SqlParameter("@Typeof", model.Typeof), new SqlParameter("@LockedBySNo", model.LockedBySNo), new SqlParameter("@FlightDate", model.FlightDate), new SqlParameter("@airportcode", airportcode) };
               DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spUnLockedProcessGet", Parameters);

                 var UnLockedPageList = ds.Tables[0].AsEnumerable().Select(e => new UnLockedPage
                  {

                    SNo = Convert.ToInt32(e["SNo"]),
                    AWBNo = e["AWBNo"].ToString(),
                    ULDNo = e["ULDNo"].ToString(),
                    FLIGHTNo = e["FLIGHTNo"].ToString(),

                    FlightDate = e["FlightDate"].ToString(),

                    LockedProcessName = e["LockedProcessName"].ToString(),

                    IsLocked = e["IsLocked"].ToString(),
                    LockedBy = e["LockedBy"].ToString(),

                    LockedOn = e["LockedOn"].ToString()

                });


                // if(ds.Tables.Count()>0)
                return new KeyValuePair<string, List<UnLockedPage>>(ds.Tables[1].Rows[0][0].ToString(), UnLockedPageList.AsQueryable().ToList());
                //return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                
                throw ex;
            }
        }


       //public string UpdateProcessGetLock(string AWBNo, string ULDNo, string FlightNo, DateTime FlightDate)
        public string UpdateProcessGetLock(string AWBNo, string ULDNo, string FlightNo, string FlightDate)
        {
            try
            {
                SqlParameter[] Parameter =
                {
                new SqlParameter("@AWBNo", AWBNo),
                new SqlParameter("@ULDNo", ULDNo),
                new SqlParameter("@FlightNo", FlightNo),
                new SqlParameter("@FlightDate", @FlightDate),
                new SqlParameter("@CreatedBy", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())};


                //"@ULDNo", ULDNo, "@FlightNo", FlightNo, "@FlightDate", FlightDate) };
                DataSet ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "UpdateProcessGetLock", Parameter);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch(Exception ex)//
            {
                
                throw ex;
            }
        }





    }
}
