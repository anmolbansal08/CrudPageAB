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
    public class ULDHistoryService : SignatureAuthenticate, IULDHistoryService
    {
        public KeyValuePair<string, List<ULDHistory>> GetULDHistoryRecord(string recordID, int page, int pageSize, whereConditionULDHistory model, string sort)
        {
            try
            {
                string FDt = model.FDate;
                string TDt = model.TDate;
                string ULDSno = model.ULD;
                System.Web.HttpContext.Current.Session["FDT"] = FDt;
                System.Web.HttpContext.Current.Session["TDt"] = TDt;
                System.Web.HttpContext.Current.Session["ULDSno"] = ULDSno;

                CargoRankingEI CargoRankingEI = new CargoRankingEI();
                SqlParameter[] Parameters = {                                             
                                           new SqlParameter("@ULDSno", ULDSno),
                                           new SqlParameter("@FromDate", Convert.ToDateTime(FDt)),
                                            new SqlParameter("@ToDate", Convert.ToDateTime(TDt)) ,
                                              new  SqlParameter("@Usersno", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                        };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetULDHistoryDetail", Parameters);
                var ULDHistoryList = ds.Tables[0].AsEnumerable().Select(e => new ULDHistory
                {
                    StageSequence = Convert.ToString(e["StageSequence"].ToString()),
                    StageName = Convert.ToString(e["StageName"].ToString()),
                    StageDate = Convert.ToString(e["StageDate"].ToString()),
                    GrossWeight = Convert.ToString(e["GrossWeight"].ToString()),
                    VolumeWeight = Convert.ToString(e["VolumeWeight"].ToString()),
                    WaybillCount = Convert.ToString(e["WaybillCount"].ToString()),
                    FlightNo = Convert.ToString(e["FlightNo"].ToString()),
                    FlightDate = Convert.ToString(e["FlightDate"].ToString()),
                    UserID = Convert.ToString(e["UserID"].ToString()),
                    CityCode = Convert.ToString(e["CityCode"].ToString()),
                    EventTime = Convert.ToString(e["EventTime"].ToString()),
                    Dt = Convert.ToString(e["Dt"].ToString()),
                });
                return new KeyValuePair<string, List<ULDHistory>>(ds.Tables[1].Rows[0][0].ToString(), ULDHistoryList.AsQueryable().ToList());
            }

            catch(Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetULDHistoryDetail"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }

        }

        public List<ULDHistory> SearchData(ULDHistory obj)
        {
            try
            {
                List<ULDHistory> lst = new List<ULDHistory>();


                SqlParameter[] Parameters = { new SqlParameter("@ULDSno",System.Web.HttpContext.Current.Session["ULDSno"]),
                                                new SqlParameter("@FromDate",  System.Web.HttpContext.Current.Session["FDT"]),
                                            new SqlParameter("@ToDate", System.Web.HttpContext.Current.Session["TDt"]),
                                            new  SqlParameter("@Usersno", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                            };
                string procname = "GetULDHistoryDetail";
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, procname, Parameters);
                if (ds != null && ds.Tables.Count > 0)
                    lst = ds.Tables[0].AsEnumerable().Select(e => new ULDHistory
                    {
                        StageSequence = Convert.ToString(e["StageSequence"]),
                        StageName = Convert.ToString(e["StageName"]),
                        StageDate = Convert.ToString(e["StageDate"]),
                        GrossWeight = Convert.ToString(e["GrossWeight"]),
                        VolumeWeight = Convert.ToString(e["VolumeWeight"]),
                        WaybillCount = Convert.ToString(e["WaybillCount"]),
                        FlightNo = Convert.ToString(e["FlightNo"]),
                        FlightDate = Convert.ToString(e["FlightDate"]),
                        UserID = Convert.ToString(e["UserID"]),
                        CityCode = Convert.ToString(e["CityCode"]),
                        EventTime = Convert.ToString(e["EventTime"]),
                        Dt = Convert.ToString(e["Dt"]),
                    }).ToList();
                return lst;
                System.Web.HttpContext.Current.Session.Abandon();
                System.Web.HttpContext.Current.Session.Abandon();
                System.Web.HttpContext.Current.Session.Abandon();
                System.Web.HttpContext.Current.Session.Remove("ULDSno");
                System.Web.HttpContext.Current.Session.Remove("FDT");
                System.Web.HttpContext.Current.Session.Remove("TDt");
            }
            catch(Exception ex)// (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetULDHistoryDetail"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }

    }
}
