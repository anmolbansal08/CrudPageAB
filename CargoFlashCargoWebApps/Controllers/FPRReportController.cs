﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using Kendo.Mvc.UI;
using Kendo.Mvc.Extensions;
using CargoFlash.Cargo.Model.Rate;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using System.Web.UI.WebControls;
using System.IO;
using System.Web.UI;
using System.Drawing;
using System.Text;
using CargoFlash.Cargo.Model;
using CargoFlash.Cargo.Model.Report;
using ClosedXML.Excel;
using System.ServiceModel.Web;
using System.Net;

namespace CargoFlashCargoWebApps.Controllers
{
    public class FPRReportController : Controller
    {
        //
        // GET: /FPRReport/
        public ActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public ActionResult FPRReportGetRecord([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, FPRReportRequestModel Model)
        {
            string sorts = CargoFlash.SoftwareFactory.Data.GridSort.ProcessSorting(sort);
            string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<FPRReport>(filter);
            System.Data.DataSet dsFPRReport = new DataSet();


            IEnumerable<FPRReport> CommodityList = null;

            try
            {
                System.Data.SqlClient.SqlParameter[] Parameters = { 
                                                                   new System.Data.SqlClient.SqlParameter("@AirlineCode",Model.AirlineCode),
                                                                   new System.Data.SqlClient.SqlParameter("@FlightNo",Model.FlightNo),
                                                                   new System.Data.SqlClient.SqlParameter("@OriginSNo",Model.OriginSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@DestinationSNo",Model.DestinationSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",Model.FromDate),
                                                                    new System.Data.SqlClient.SqlParameter("@ToDate",Model.ToDate),
                                                                     new System.Data.SqlClient.SqlParameter("@AWBNo",Model.AWBNo),
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page), 
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize),
                                                                    new System.Data.SqlClient.SqlParameter("@IsAutoProcess",Model.IsAutoProcess),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))

                                                              };

                dsFPRReport = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spFPRReport_GetRecord", Parameters);
                if (dsFPRReport.Tables.Count > 1 && dsFPRReport.Tables != null)
                {
                    CommodityList = dsFPRReport.Tables[0].AsEnumerable().Select(e => new FPRReport
                    {
                        //AWBNo	Origin	Destination	AWBDate	PlaceOfAWB	AgentName	AgentCode  FlightNo	FlightDate	ETD	ETA	AircraftType	RegistrationNo	FreightType	
                        //Pieces	GrossWeight	ChargeableWeight TariffRate	ProductName	Commodity	FlightType	WeightCharge	ValulationCharge	OtherCharges	
                        //SurchargeName	SurchargeValue	Tax	TotalPrepaid	Part
                        SNo = Convert.ToInt32(e["SNo"]),
                        AWBNo = e["AWBNo"].ToString().ToUpper(),
                        Origin = e["Origin"].ToString().ToUpper(),
                        Destination = e["Destination"].ToString().ToUpper(),
                        AWBDate = e["AWBDate"].ToString().ToUpper(),
                        PlaceOfAWB = e["PlaceOfAWB"].ToString().ToUpper(),
                        AgentName = e["AgentName"].ToString().ToUpper(),
                        AgentCode = e["AgentCode"].ToString().ToUpper(),
                        FlightNo = e["FlightNo"].ToString().ToUpper(),
                        Charter=e["Charter"].ToString().ToUpper(),
                        AirlineCode = e["AirlineCode"].ToString().ToUpper(),
                        FlightDate = e["FlightDate"].ToString().ToUpper(),
                        ETD = e["ETD"].ToString().ToUpper(),
                        ETA = e["ETA"].ToString().ToUpper(),
                        AircraftType = e["AircraftType"].ToString().ToUpper(),
                        RegistrationNo = e["RegistrationNo"].ToString().ToUpper(),
                        FreightType = e["FreightType"].ToString().ToUpper(),
                        Pieces = e["Pieces"].ToString().ToUpper(),
                        GrossWeight = e["GrossWeight"].ToString().ToUpper(),
                        ChargeableWeight = e["ChargeableWeight"].ToString().ToUpper(),
                        TariffRate = e["TariffRate"].ToString().ToUpper(),
                        ProductName = e["ProductName"].ToString().ToUpper(),
                        Commodity = e["Commodity"].ToString().ToUpper(),
                        FlightType = e["FlightType"].ToString().ToUpper(),
                        WeightCharge = e["WeightCharge"].ToString().ToUpper(),
                        ValuationCharge = e["ValuationCharge"].ToString().ToUpper(),
                        OtherCharges = e["OtherCharges"].ToString().ToUpper(),
                        SurchargeName = e["SurchargeName"].ToString().ToUpper(),
                        SurchargeValue = e["SurchargeValue"].ToString().ToUpper(),
                        Tax = e["Tax"].ToString().ToUpper(),
                        TotalPrepaid = e["TotalPrepaid"].ToString().ToUpper(),
                        Part = e["Part"].ToString().ToUpper(),
                        OriginAirportCode=e["OriginAirportCode"].ToString().ToUpper(),
                        DestinationAirportCode = e["DestinationAirportCode"].ToString().ToUpper(),
                        TotalDistance = e["TotalDistance"].ToString().ToUpper(),
                        SectorDistance = e["SectorDistance"].ToString().ToUpper(),
                        NatureOfGoods=e["NatureOfGoods"].ToString().ToUpper()
                    });
                    dsFPRReport.Dispose();
                }



                return Json(new DataSourceResult
                {
                    Data = dsFPRReport.Tables.Count > 1 ? CommodityList.AsQueryable().ToList() : Enumerable.Empty<FPRReport>().ToList<FPRReport>(),
                    Total = dsFPRReport.Tables.Count > 1 ? Convert.ToInt32(dsFPRReport.Tables[1].Rows[0][0].ToString()) : 0
                }, JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spFPRReport_GetRecord"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }





        public void ExportToExcel([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, CargoFlash.SoftwareFactory.Data.GridFilter filter, FPRReportRequestModel Model)
        {

            string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<HoldTypeReport>(filter);

            string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
            System.Data.SqlClient.SqlParameter[] Parameters = { 
                                                                    new System.Data.SqlClient.SqlParameter("@AirlineCode",Model.AirlineCode),
                                                                   new System.Data.SqlClient.SqlParameter("@FlightNo",Model.FlightNo),
                                                                   new System.Data.SqlClient.SqlParameter("@OriginSNo",Model.OriginSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@DestinationSNo",Model.DestinationSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",Model.FromDate),
                                                                    new System.Data.SqlClient.SqlParameter("@ToDate",Model.ToDate),
                                                                     new System.Data.SqlClient.SqlParameter("@AWBNo",Model.AWBNo),
                                                                    new System.Data.SqlClient.SqlParameter("@PageNo", request.Page), 
                                                                    new System.Data.SqlClient.SqlParameter("@PageSize", 1048576),
                                                                     new System.Data.SqlClient.SqlParameter("@IsAutoProcess",Model.IsAutoProcess),
                                                                      new System.Data.SqlClient.SqlParameter("@UserSNo", Convert.ToString(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo))

                                                              };
            try
            {
                System.Data.DataSet ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "spFPRReport_GetRecord_Excel", Parameters);
                DataTable dt1 = ds.Tables[0];
                //dt1.Columns.Remove("SNo");
                ConvertDSToExcel_Success(dt1, 0);
            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spFPRReport_GetRecord"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }

        }


        public void ConvertDSToExcel_Success(DataTable dt, int mode)
        {
            string date = DateTime.Now.ToString();
            StringBuilder sb = new StringBuilder();
           

            if (dt.Rows.Count > 0)
            {
                //DataTable table = ds.Tables[0];
                foreach (DataColumn column in dt.Columns)
                    sb.Append(column.ColumnName + ",");

                sb.Append(Environment.NewLine);

                foreach (DataRow row in dt.Rows)
                {
                    for (int i = 0; i < dt.Columns.Count; i++)
                        sb.Append(row[i].ToString() + ",");

                    sb.Append(Environment.NewLine);
                }
            }
            Response.Write(sb.ToString());
            Response.ContentType = "text/csv";
            Response.AppendHeader("Content-Disposition", "attachment; filename=FMRReport_'" + date + "'.csv");
            Response.End();

            //using (XLWorkbook wb = new XLWorkbook())
            //{
            //    wb.Worksheets.Add(dt);
            //    Response.Clear();
            //    Response.Buffer = true;
            //    Response.Charset = "";
            //    Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            //    Response.AddHeader("content-disposition", "attachment;filename=FMRReport_'" + date + "'.xlsx");
            //    using (MemoryStream MyMemoryStream = new MemoryStream())
            //    {
            //        wb.SaveAs(MyMemoryStream);
            //        MyMemoryStream.WriteTo(Response.OutputStream);
            //        Response.Flush();
            //        Response.End();
            //    }

            //}
        }
    }
}