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
    [GlobalErrorHandlerBehaviour(typeof(GlobalErrorHandler))]
    [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class UnclearedShipmentService : SignatureAuthenticate, IUnclearedShipmentService
    {
        public KeyValuePair<string, List<UnclearedShipment>> GetUnclearedShipmentRecord(int page, int pageSize, UnclearedShipmentRequestModel Model)
        {
            try
            {


                UnclearedShipment UnclearedShipment = new UnclearedShipment();
                SqlParameter[] Parameters = { 
                                            new SqlParameter("@FromDt", Model.FromDt),
                                            new SqlParameter("@ToDt", Model.ToDt),
                                             new SqlParameter("@Airline",Model.AirlineSNo),
                                              new SqlParameter("@Airport",Model.AirportSNo),
                                            new SqlParameter("@Type",Model.Type),
                                                 new SqlParameter("@Agent",Model.AgentSNo),
                                               new  SqlParameter("@Usersno", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),

                                               new SqlParameter("@PageNo", page),
                                             new SqlParameter("@PageSize",pageSize),        
                                       
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetUnclearedShipment", Parameters);
                var UnclearedShipmentList = ds.Tables[0].AsEnumerable().Select(e => new UnclearedShipment
                {
                    AirlineName = Convert.ToString(e["Airline"].ToString()),
                    AgentName = Convert.ToString(e["AgentName"].ToString()),
                    AWBNo = Convert.ToString(e["AWBNo"].ToString()),
                    DeliveryOrder = Convert.ToString(e["DeliveryOrder"].ToString()),
                    DateofIssuance = Convert.ToString(e["DateofIssuance"].ToString()),
                    Consignee = Convert.ToString(e["Consignee"].ToString()),
                    Origin = Convert.ToString(e["Origin"].ToString()),
                    Dest = Convert.ToString(e["Dest"].ToString()),
                    
                    TotalPieces = Convert.ToString(e["TotalPieces"].ToString()),
                    TotalWeight = Convert.ToString(e["TotalWeight"].ToString()),
                    FlightNo = Convert.ToString(e["FlightNo"].ToString()),
                    FlightDate = Convert.ToString(e["FlightDate"].ToString()),
                    HAWBNo = Convert.ToString(e["HAWBNo"].ToString()),
                    DLVPC = Convert.ToString(e["DLVPC"].ToString()),
                    DLVWT = Convert.ToString(e["DLVWT"].ToString()),
                    DIff = Convert.ToString(e["DIff"].ToString()),
                    TimeFromArrivalDaysHour = Convert.ToString(e["TimeFromArrivalDaysHour"].ToString())
                });
                return new KeyValuePair<string, List<UnclearedShipment>>(ds.Tables[1].Rows[0][0].ToString(), UnclearedShipmentList.AsQueryable().ToList());
            }
            catch (Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetUnclearedShipment"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }


        //public List<UnclearedShipment> SearchData(UnclearedShipment obj)
        //{
        //    try
        //    {
        //        List<UnclearedShipment> lst = new List<UnclearedShipment>();


        //        SqlParameter[] Parameters = { new SqlParameter("@FromDt", Convert.ToDateTime(obj.FromDate)),
        //                                    new SqlParameter("@ToDt", Convert.ToDateTime(obj.ToDate)),
        //                                     new SqlParameter("@Airline",obj.Airline),        
        //                                    new  SqlParameter("@Usersno", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
        //                                    };

        //        DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetUnclearedShipment", Parameters);
        //        if (ds != null && ds.Tables.Count > 0)
        //            lst = ds.Tables[0].AsEnumerable().Select(e => new UnclearedShipment
        //            {
        //                AirlineName = Convert.ToString(e["Airline"].ToString()),
        //                AWBNo = Convert.ToString(e["AWBNo"].ToString()),
        //                DeliveryOrder = Convert.ToString(e["DeliveryOrder"].ToString()),
        //                DeliveryDate = Convert.ToString(e["DeliveryDate"].ToString()),
        //                Consignee = Convert.ToString(e["Customer"].ToString()),
        //                TotalPieces = Convert.ToString(e["TotalPieces"].ToString()),
        //                TotalWeight = Convert.ToString(e["TotalWeight"].ToString()),
        //                FlightNo = Convert.ToString(e["FlightNo"].ToString()),
        //                FlightDate = Convert.ToString(e["FlightDate"].ToString()),
        //                hawb = Convert.ToString(e["hawb"].ToString()),
        //                dlvpc = Convert.ToString(e["dlvpc"].ToString()),
        //                dlvwt = Convert.ToString(e["dlvwt"].ToString()),
        //                DIff = Convert.ToString(e["DIff"].ToString()),
        //                Dt = Convert.ToString(e["Dt"].ToString())

        //            }).ToList();
        //        return lst;
        //    }
        //    catch (Exception ex)// (Exception ex)
        //    {
        //        // do something for error
        //        DataSet dsError;
        //        System.Data.SqlClient.SqlParameter[] ParametersError = { 
        //                                                           new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
        //                                                            new System.Data.SqlClient.SqlParameter("@ProcName","GetUnclearedShipment"),
        //                                                            new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
        //                                                      };
        //        dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
        //        throw ex;
        //    }
        //}

    }
}
