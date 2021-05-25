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
    public class ULDInventoryService : SignatureAuthenticate, IULDInventoryService
    {
        public KeyValuePair<string, List<ULDInventory>> GetULDInventoryRecord(string recordID, int page, int pageSize, UldInventory model, string sort)
        {
            try
            {



                CargoRankingEI CargoRankingEI = new CargoRankingEI();

                SqlParameter[] Parameters = { 
                                             new SqlParameter("@Airline", model.AirlineN),
                                            new SqlParameter("@Type", model.Type),
                                           // new SqlParameter("@Airline",model.Air) ,
                                           new SqlParameter("@Airportcode", model.Airportcode),
                                            new SqlParameter("@ULDNo",model.ULDNumber) ,
                                           new SqlParameter("@ownercode",model.ownercode) ,
                                              new  SqlParameter("@Usersno", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                        };
                string proc = string.Empty;
                if (model.rpt == "1")
                {
                    proc = "GetULDInventory";
                }
                else
                {
                    proc = "GetULDInventoryDetail";
                }

                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, proc, Parameters);
                var ULDInventoryList = ds.Tables[0].AsEnumerable().Select(e => new ULDInventory
                {

                    Airline = Convert.ToString(e["Airline"].ToString()),
                    ULDType = Convert.ToString(e["ULDType"].ToString()),
                    ULDNo = Convert.ToString(e["ULDNo"].ToString()),
                    Dt = Convert.ToString(e["Dt"].ToString()),
                    FlightNo = Convert.ToString(e["FlightNo"].ToString()),
                    FlightDate = Convert.ToString(e["FlightDate"].ToString()),
                    CurrentCity = Convert.ToString(e["CurrentCity"].ToString()),
                    ContentType = Convert.ToString(e["ContentType"].ToString()),
                    CurrentAirPort = Convert.ToString(e["CurrentAirPort"].ToString())
                });
                return new KeyValuePair<string, List<ULDInventory>>(ds.Tables[1].Rows[0][0].ToString(), ULDInventoryList.AsQueryable().ToList());

            }

            catch(Exception ex)// (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetULDInventoryDetail"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }

        }


        public List<ULDInventory> SearchData(ULDInventory obj)
        {
            try
            {
                List<ULDInventory> lst = new List<ULDInventory>();


                SqlParameter[] Parameters = { 
                                            new SqlParameter("@Type", obj.Type),
                                           // new SqlParameter("@Airline",model.Air) ,
                                           new SqlParameter("@Airportcode", obj.Airportcode),
                                           new SqlParameter("@ownercode",obj.ownercode) ,
                                              new  SqlParameter("@Usersno", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                        };
                string proc = string.Empty;
                if (obj.Rpt == "1")
                {
                    proc = "GetULDInventory";
                }
                else
                {
                    proc = "GetULDInventoryDetail";
                }
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, proc, Parameters);
                if (ds != null && ds.Tables.Count > 0)
                    lst = ds.Tables[0].AsEnumerable().Select(e => new ULDInventory
                    {

                        Airline = Convert.ToString(e["Airline"].ToString()),
                        ULDType = Convert.ToString(e["ULDType"].ToString()),
                        ULDNo = Convert.ToString(e["ULDNo"].ToString()),
                        Dt = Convert.ToString(e["Dt"].ToString()),
                        FlightNo = Convert.ToString(e["FlightNo"].ToString()),
                        FlightDate = Convert.ToString(e["FlightDate"].ToString()),
                        CurrentCity = Convert.ToString(e["CurrentCity"].ToString()),
                        ContentType = Convert.ToString(e["ContentType"].ToString())

                    }).ToList();
                return lst;
            }
            catch(Exception ex)// (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetULDInventoryDetail"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }


        }



    }
}
