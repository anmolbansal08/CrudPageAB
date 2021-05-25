using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Kendo.Mvc.UI;
using System.Data;
using System.IO;
using System.Web.UI;
using System.Drawing;
using System.Text;
using CargoFlash.SoftwareFactory.Data;
using System.Data.SqlClient;
using CargoFlash.Cargo.Model.Export;
using Kendo.Mvc.Extensions;
using System.ServiceModel.Web;
using System.Net;
namespace CargoFlashCargoWebApps.Controllers
{
    public class AWBPenaltyController : Controller
    {
        //
        // GET: /AWBPenalty/
        string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult GetAWBPenalty([DataSourceRequest]DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, string ReferenceNumber, string PenaltyType, string BookingFromDate, string BookingToDate, string AWBNo, string AccountSno, string GroupName)
        {
            // int i  = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo;
            // int uid = 0;
            //  Session["uid"] = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo;
            // ViewBag.uid = Session["uid"];
            try
            {
                string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
                string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<CargoFlash.Cargo.Model.Export.AWBPenalty>(filter);


                System.Data.SqlClient.SqlParameter[] Parameters = { 
                                                                    new System.Data.SqlClient.SqlParameter("@ReferenceNumber",ReferenceNumber),
                                                                    new System.Data.SqlClient.SqlParameter("@BookingFromDate",BookingFromDate),
                                                                    new System.Data.SqlClient.SqlParameter("@BookingToDate",BookingToDate),
                                                                    new System.Data.SqlClient.SqlParameter("@PenaltyType",PenaltyType),
                                                                    new System.Data.SqlClient.SqlParameter("@AWBNo",AWBNo),
                                                                       new System.Data.SqlClient.SqlParameter("@AccountSno",AccountSno),
                                                                        new System.Data.SqlClient.SqlParameter("@GroupName",GroupName),
                                                                        new System.Data.SqlClient.SqlParameter("@UserSNo", (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo).ToString()),
                                                                        new System.Data.SqlClient.SqlParameter("@citySno",  (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CitySNo).ToString()),
                        
            };
                
                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "uspGetAwbReferenceBooking", Parameters);

                var AWBPenaltyList = ds.Tables[0].AsEnumerable().Select(e => new CargoFlash.Cargo.Model.Export.AWBPenalty
                {


                    PenaltyType = e["PenaltyType"].ToString().ToUpper(),
                    ReferenceNumber = e["ReferenceNumber"].ToString().ToUpper(),
                    AWBNo = e["AWBNo"].ToString().ToUpper(),
                    // BookingFromDate=e["BookingFromDate"].ToString().ToUpper(),
                    AWBPieces = e["AWBPieces"].ToString().ToUpper(),
                    GrossWeight = e["GrossWeight"].ToString().ToUpper(),
                    Volume = e["Volume"].ToString().ToUpper(),
                    TotalPenaltyCharges = e["TotalPenaltyCharges"].ToString().ToUpper(),

                    Origin = e["Origin"].ToString().ToUpper(),
                    Destination = e["Destination"].ToString().ToUpper(),
                    ProductName = e["ProductName"].ToString().ToUpper(),
                    CommodityDescription = e["CommodityCode"].ToString().ToUpper(),
                    AgentName = e["AgentName"].ToString().ToUpper(),
                    CreatedDate = e["CreatedDate"].ToString().ToUpper(),
                    Status = e["Status"].ToString().ToUpper(),
                    ExecutedGrossWeight = e["ExecutedGrossWeight"].ToString().ToUpper(),
                    TaxOnPenalty = e["TaxOnPenalty"].ToString().ToUpper(),
                    FlightNo = e["FlightNo"].ToString().ToUpper(),
                    FlightDate = e["FlightDate"].ToString().ToUpper(),
                    TotalPenalty = e["TotalPenalty"].ToString().ToUpper(),
                    ReferencePenaltyParameter = e["ReferencePenaltyParameter"].ToString().ToUpper(),
                    PenaltyCurrency=e["penaltyCurrency"].ToString().ToUpper()
                });
                ds.Dispose();
                return Json(new CargoFlash.SoftwareFactory.Data.DataSourceResult
                {
                    Data = AWBPenaltyList.AsQueryable().ToList(),
                    //Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                }, JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","uspGetAwbReferenceBooking"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }


        //   public string UpdateAWBPenalty(List<AWBPenaltyUpdate> AwbNoList, List<AWBPenaltyUpdate> PenaltyType)
        public string UpdateAWBPenalty(List<AWBPenaltyUpdate> AwbNoList)
        {
            try
            {
                DataSet ds = null;
                if (AwbNoList != null)
                {


                    DataTable DtRateTypePriority = CollectionHelper.ConvertTo(AwbNoList, "");

                    SqlParameter[] Parameters = { 
                                            new SqlParameter("@AWBReservationPenalty", SqlDbType.Structured){Value=DtRateTypePriority} 
                                            
                                        };

                    ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "UspAddDataawbreservationpenalty", Parameters);
                }
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","uspGetAwbReferenceBooking"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }


        public string GetMessageForAgentIn2ndTimeCancel(List<AWBPenaltAgentMessageForJT> AwbNoList)
        {
            try
            {
                DataSet ds = null;
                if (AwbNoList != null)
                {


                    DataTable DtRateTypePriority = CollectionHelper.ConvertTo(AwbNoList, "");

                    SqlParameter[] Parameters = {
                                            new SqlParameter("@AWBReservationPenalty", SqlDbType.Structured){Value=DtRateTypePriority}

                                        };

                    ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "uspCancelPenaltyMessageForAgentInJT", Parameters);
                }
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","uspCancelPenaltyMessageForAgentInJT"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }

        ////////////////////// This is for Build up And Li Message///////////////////
        public ActionResult GetMessageForBuildUP(List<AWBPenaltyMessageforBuildUPInVoidPenalty> AwbNoList)
        {
            try
            {
                DataSet ds = null;
                if (AwbNoList != null)
                {


                    DataTable DtRateTypePriority = CollectionHelper.ConvertTo(AwbNoList, "");

                    SqlParameter[] Parameters = {
                                            new SqlParameter("@AWBReservationPenalty", SqlDbType.Structured){Value=DtRateTypePriority}

                                        };

                    ds = SqlHelper.ExecuteDataset(ReadConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "USPChekValidationForVoidBuilUpAndLingList", Parameters);
                }
                var AWBPenaltyList = ds.Tables[0].AsEnumerable().Select(e => new CargoFlash.Cargo.Model.Export.AWBPenaltyMessageforBuildUPInVoidPenaltyResponse
                    {
                        ReturnError = e["ReturnError"].ToString(),
                        Message = e["Message"].ToString(),
                        AWBNo = e["AWBNo"].ToString(),
                    Status=e["Status"].ToString()
                });
                    ds.Dispose();

                    return Json(new CargoFlash.SoftwareFactory.Data.DataSourceResult
                    {
                        Data = AWBPenaltyList.AsQueryable().ToList(),

                    }, JsonRequestBehavior.AllowGet);
             
            }
            catch (Exception ex)
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","USPChekValidationForVoidBuilUpAndLingList"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }

        //////////////////////////////////////
    }
}