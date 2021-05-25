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
    public class DeliveryPendingService : SignatureAuthenticate, IDeliveryPendingService
    {
        public KeyValuePair<string, List<DeliveryPending>> GetDeliveryPendingRecord(string recordID, int page, int pageSize, string whereCondition, string sort)
        {

            try
            {
                string FDt = whereCondition.Split('*')[0];
                string TDt = whereCondition.Split('*')[1];
                string airline = whereCondition.Split('*')[2];

                whereCondition = "";

                DeliveryPending DeliveryPending = new DeliveryPending();
                SqlParameter[] Parameters = { 
                                            new SqlParameter("@FromDt", Convert.ToDateTime(FDt)),
                                            new SqlParameter("@ToDt", Convert.ToDateTime(TDt)),
                                              new SqlParameter("@Airline",airline),                                         
                                               new  SqlParameter("@Usersno", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                       
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetDeliveryPending", Parameters);
                var DeliveryPendingList = ds.Tables[0].AsEnumerable().Select(e => new DeliveryPending
                {
                    AirlineName = Convert.ToString(e["Airline"].ToString()),
                    AWBNo = Convert.ToString(e["AWBNo"].ToString()),
                    TotalPieces = Convert.ToString(e["TotalPieces"].ToString()),
                    TotalWeight = Convert.ToString(e["TotalWeight"].ToString()),
                    Origin = Convert.ToString(e["Origin"].ToString()),
                    FlightDate = Convert.ToString(e["FlightDate"].ToString()),
                    FlightNo = Convert.ToString(e["FlightNo"].ToString()),
                    NatureOfGoods = Convert.ToString(e["NatureOfGoods"].ToString()),
                    Cargotype = Convert.ToString(e["Cargotype"].ToString()),
                    Consignee = Convert.ToString(e["Customer"].ToString()),
                    DIff = Convert.ToString(e["DIff"].ToString()),
                    FreightType = Convert.ToString(e["FreightType"].ToString()),
                    Dt = Convert.ToString(e["Dt"].ToString()),
                    NFDBy = Convert.ToString(e["NFDBy"].ToString()),
                    NFDRemark = Convert.ToString(e["Remarks"].ToString()),
                    NFDDate = Convert.ToString(e["LastNFDDateTime"].ToString()),
                    FromDate = Convert.ToString(e["FromDate"]).ToString(),
                    ToDate = Convert.ToString(e["ToDate"]).ToString()

                });
                return new KeyValuePair<string, List<DeliveryPending>>(ds.Tables[1].Rows[0][0].ToString(), DeliveryPendingList.AsQueryable().ToList());

            }
            catch(Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetDeliveryPending"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }


        public List<DeliveryPending> SearchData(DeliveryPending obj)
        {
            try
            {
                List<DeliveryPending> lst = new List<DeliveryPending>();


                SqlParameter[] Parameters = { new SqlParameter("@FromDt", Convert.ToDateTime(obj.FromDate)),
                                            new SqlParameter("@ToDt", Convert.ToDateTime(obj.ToDate)),
                                            new SqlParameter("@Airline",obj.Airline),
                                            new  SqlParameter("@Usersno", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                            };

                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetDeliveryPending", Parameters);
                if (ds != null && ds.Tables.Count > 0)
                    lst = ds.Tables[0].AsEnumerable().Select(e => new DeliveryPending
                    {
                        AirlineName = Convert.ToString(e["Airline"].ToString()),
                        AWBNo = Convert.ToString(e["AWBNo"].ToString()),
                        TotalPieces = Convert.ToString(e["TotalPieces"].ToString()),
                        TotalWeight = Convert.ToString(e["TotalWeight"].ToString()),
                        Origin = Convert.ToString(e["Origin"].ToString()),
                        FlightDate = Convert.ToString(e["FlightDate"].ToString()),
                        FlightNo = Convert.ToString(e["FlightNo"].ToString()),
                        NatureOfGoods = Convert.ToString(e["NatureOfGoods"].ToString()),
                        Cargotype = Convert.ToString(e["Cargotype"].ToString()),
                        Consignee = Convert.ToString(e["Customer"].ToString()),
                        DIff = Convert.ToString(e["DIff"].ToString()),
                        FreightType = Convert.ToString(e["FreightType"].ToString()),
                        Dt = Convert.ToString(e["Dt"].ToString()),
                        NFDBy = Convert.ToString(e["NFDBy"].ToString()),
                        NFDRemark = Convert.ToString(e["Remarks"].ToString()),
                        NFDDate = Convert.ToString(e["LastNFDDateTime"].ToString()),
                        FromDate = Convert.ToString(e["FromDate"]).ToString(),
                        ToDate = Convert.ToString(e["ToDate"]).ToString()

                    }).ToList();
                return lst;
            }
            catch(Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetDeliveryPending"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }

        }

    }
}
