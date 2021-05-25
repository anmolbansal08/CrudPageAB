using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using Kendo.Mvc.UI;
using Kendo.Mvc.Extensions;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using System.Web.UI.WebControls;
using System.IO;
using System.Web.UI;
using System.Drawing;
using System.Text;
using CargoFlash.Cargo.Model;
using ClosedXML.Excel;
using CargoFlash.Cargo.Model.Report;
using System.ServiceModel.Web;
using System.Net;

namespace CargoFlashCargoWebApps.Controllers
{
    public class WarehouseAccountReportController : Controller
    {
        //
        // GET: /WarehouseAccountReport/
        public ActionResult Index()
        {
            return View();
        }


        //public string WarehouseAccountReportGetRecord([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, CargoFlash.SoftwareFactory.Data.GridFilter filter, string airlineSNo, string originSNo, string fromDate, string toDate, string awbSNo, string reportType)
        //{

        //    string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<WarehouseAccountReport>(filter);
        //    System.Data.DataSet ds = new DataSet();


        //    System.Data.SqlClient.SqlParameter[] Parameters = { 
        //                                                           new System.Data.SqlClient.SqlParameter("@AirlineCode",airlineSNo),                                                                    
        //                                                            new System.Data.SqlClient.SqlParameter("@FromDate",fromDate),
        //                                                            new System.Data.SqlClient.SqlParameter("@ToDate",toDate),                                                                     
        //                                                             new System.Data.SqlClient.SqlParameter("@OriginCitySNo",originSNo),
        //                                                             new System.Data.SqlClient.SqlParameter("@AWBSNo",awbSNo),
        //                                                            new System.Data.SqlClient.SqlParameter("@ReportType",reportType)
        //                                                            //,
        //                                                            //new System.Data.SqlClient.SqlParameter("@PageNo", request.Page), 
        //                                                            //new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize) 
        //                                                      };

        //    try
        //    {

        //        ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spReport_WareHouseAccounting", Parameters);

        //        if (ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)  //--- Get All columns for merging the dt1(which is main data table)
        //        {
        //            if (ds.Tables[1] != null && ds.Tables[1].Rows.Count > 0) //-------main data table
        //            {
        //                if (ds.Tables[2] != null && ds.Tables[2].Rows.Count > 0) // -------Child data table
        //                {

        //                    for (int TableRow = 0; TableRow < ds.Tables[0].Rows.Count; TableRow++)
        //                    {
        //                        ds.Tables[1].Columns.Add(ds.Tables[0].Rows[TableRow][0].ToString(), typeof(string));

        //                        foreach (DataRow row in ds.Tables[1].Rows)
        //                        {
        //                            //need to set value to NewColumn column
        //                            row[ds.Tables[0].Rows[TableRow][0].ToString()] = "";   // or set it to some other value
        //                        }
        //                    }
        //                    //----------------Death of table 0 --

        //                    for (int MainDTRow = 0; MainDTRow < ds.Tables[1].Rows.Count; MainDTRow++)
        //                    {
        //                        DataRow[] dr = ds.Tables[2].Select("SNo = " + ds.Tables[1].Rows[MainDTRow]["SNo"].ToString());


        //                        if (dr.Length > 0)
        //                        {
        //                            string TariffHeadName = string.Empty;
        //                            string ChargeValue = string.Empty;
        //                            string Blank = "";
        //                            for (int ChildRow = 0; ChildRow < dr.Length; ChildRow++)
        //                            {
        //                                TariffHeadName = dr[ChildRow]["TariffHeadName"].ToString();
        //                                ChargeValue = dr[ChildRow]["ChargeValue"].ToString();

        //                                if (TariffHeadName != "" && ChargeValue != "")
        //                                {
        //                                    if (ds.Tables[1].Rows[MainDTRow][TariffHeadName].ToString() == Blank)
        //                                        ds.Tables[1].Rows[MainDTRow][TariffHeadName] = ChargeValue;
        //                                    else
        //                                        ds.Tables[1].Rows[MainDTRow][TariffHeadName] += "," + ChargeValue;
        //                                }
        //                            }

        //                        }
        //                    }


        //                }
        //                if (reportType == "1")
        //                {
        //                    if (ds.Tables[1].Columns.Contains("DeliveryOrderNo"))
        //                    {
        //                        ds.Tables[1].Columns.Remove("DeliveryOrderNo");
        //                    }
        //                    if (ds.Tables[1].Columns.Contains("SharingforPoslog"))
        //                    {
        //                        ds.Tables[1].Columns.Remove("SharingforPoslog");
        //                    }
        //                    if (ds.Tables[1].Columns.Contains("TariffCodes"))
        //                    {
        //                        ds.Tables[1].Columns.Remove("TariffCodes");
        //                    }
        //                    if (ds.Tables[1].Columns.Contains("ADMIN RUSH HANDLING"))
        //                    {
        //                        ds.Tables[1].Columns.Remove("ADMIN RUSH HANDLING");
        //                    }
        //                    if (ds.Tables[1].Columns.Contains("PECAH PU IMP"))
        //                    {
        //                        ds.Tables[1].Columns.Remove("PECAH PU IMP");
        //                    }
        //                    if (ds.Tables[1].Columns.Contains("STORAGE RUSH"))
        //                    {
        //                        ds.Tables[1].Columns.Remove("STORAGE RUSH");
        //                    }



        //                    if (ds.Tables[1].Columns.Contains("KADE DOM CHARGE"))
        //                    {
        //                        ds.Tables[1].Columns.Remove("KADE DOM CHARGE");
        //                    }
        //                    if (ds.Tables[1].Columns.Contains("COLD STORAGE CHARGE RUSH"))
        //                    {
        //                        ds.Tables[1].Columns.Remove("COLD STORAGE CHARGE RUSH");
        //                    }
        //                    if (ds.Tables[1].Columns.Contains("KADE CHARGE RUSH"))
        //                    {
        //                        ds.Tables[1].Columns.Remove("KADE CHARGE RUSH");
        //                    }

        //                    if (ds.Tables[1].Columns.Contains("RUSH HANDLING CHARGE"))
        //                    {
        //                        ds.Tables[1].Columns.Remove("RUSH HANDLING CHARGE");
        //                    }


        //                    if (ds.Tables[1].Columns.Contains("CARGO SERVICE DOM"))
        //                    {
        //                        ds.Tables[1].Columns.Remove("CARGO SERVICE DOM");
        //                    }
        //                    if (ds.Tables[1].Columns.Contains("CARGO SERVICE RUSH"))
        //                    {
        //                        ds.Tables[1].Columns.Remove("CARGO SERVICE RUSH");
        //                    }


        //                    if (ds.Tables[1].Columns.Contains("FREIGHT CHARGE"))
        //                    {
        //                        ds.Tables[1].Columns.Remove("FREIGHT CHARGE");
        //                    }


        //                }
        //                else if (reportType == "0")
        //                {


        //                    if (ds.Tables[1].Columns.Contains("SharingforPoslog"))
        //                    {
        //                        ds.Tables[1].Columns.Remove("SharingforPoslog");
        //                    }
        //                    if (ds.Tables[1].Columns.Contains("TariffCodes"))
        //                    {
        //                        ds.Tables[1].Columns.Remove("TariffCodes");
        //                    }
        //                    if (ds.Tables[1].Columns.Contains("ADMIN RUSH HANDLING"))
        //                    {
        //                        ds.Tables[1].Columns.Remove("ADMIN RUSH HANDLING");
        //                    }
        //                    if (ds.Tables[1].Columns.Contains("STORAGE RUSH"))
        //                    {
        //                        ds.Tables[1].Columns.Remove("STORAGE RUSH");
        //                    }
        //                    if (ds.Tables[1].Columns.Contains("KADE DOM CHARGE"))
        //                    {
        //                        ds.Tables[1].Columns.Remove("KADE DOM CHARGE");
        //                    }
        //                    if (ds.Tables[1].Columns.Contains("COLD STORAGE CHARGE RUSH"))
        //                    {
        //                        ds.Tables[1].Columns.Remove("COLD STORAGE CHARGE RUSH");
        //                    }

        //                    if (ds.Tables[1].Columns.Contains("CARGO SERVICE RUSH"))
        //                    {
        //                        ds.Tables[1].Columns.Remove("CARGO SERVICE RUSH");
        //                    }

        //                    if (ds.Tables[1].Columns.Contains("KADE CHARGE RUSH"))
        //                    {
        //                        ds.Tables[1].Columns.Remove("KADE CHARGE RUSH");
        //                    }
        //                    if (ds.Tables[1].Columns.Contains("RUSH HANDLING CHARGE"))
        //                    {
        //                        ds.Tables[1].Columns.Remove("RUSH HANDLING CHARGE");
        //                    }
        //                }

        //                //-------------------------------Domestic
        //                else if (reportType == "2")
        //                {

        //                    if (ds.Tables[1].Columns.Contains("SharingforGapura"))
        //                    {
        //                        ds.Tables[1].Columns.Remove("SharingforGapura");
        //                    }
        //                    if (ds.Tables[1].Columns.Contains("TariffCodes"))
        //                    {
        //                        ds.Tables[1].Columns.Remove("TariffCodes");
        //                    }
        //                    if (ds.Tables[1].Columns.Contains("ADMIN RUSH HANDLING"))
        //                    {
        //                        ds.Tables[1].Columns.Remove("ADMIN RUSH HANDLING");
        //                    }
        //                    if (ds.Tables[1].Columns.Contains("STORAGE RUSH"))
        //                    {
        //                        ds.Tables[1].Columns.Remove("STORAGE RUSH");
        //                    }
        //                    if (ds.Tables[1].Columns.Contains("COLD STORAGE CHARGE RUSH"))
        //                    {
        //                        ds.Tables[1].Columns.Remove("COLD STORAGE CHARGE RUSH");
        //                    }
        //                    if (ds.Tables[1].Columns.Contains("CARGO SERVICE RUSH"))
        //                    {
        //                        ds.Tables[1].Columns.Remove("CARGO SERVICE RUSH");
        //                    }
        //                    if (ds.Tables[1].Columns.Contains("KADE CHARGE RUSH"))
        //                    {
        //                        ds.Tables[1].Columns.Remove("KADE CHARGE RUSH");
        //                    }
        //                    if (ds.Tables[1].Columns.Contains("RUSH HANDLING CHARGE"))
        //                    {
        //                        ds.Tables[1].Columns.Remove("RUSH HANDLING CHARGE");
        //                    }
        //                }
        //                //-------------------------------Rush handling
        //                else if (reportType == "3")
        //                {

        //                    if (ds.Tables[1].Columns.Contains("SharingforPoslog"))
        //                    {
        //                        ds.Tables[1].Columns.Remove("SharingforPoslog");
        //                    }
        //                    if (ds.Tables[1].Columns.Contains("TariffCodes"))
        //                    {
        //                        ds.Tables[1].Columns.Remove("TariffCodes");
        //                    }
        //                    //------------------

        //                }
        //                ds.Tables[1].Columns.Remove("AirlineSNo");
        //                ds.Tables[1].Columns.Remove("LandSideSNo");
        //            }
        //        }


        //        //-----1-Deleveryorderno not required



        //        //DataTable dt1 = ds.Tables[1];
        //        //dt1.Columns.Remove("SNo");
        //        //DataSet MainTable = (DataSet)dt1.DefaultView;
        //        return CargoFlash.Cargo.Business.Common.CompleteDStoJSONOnlyString(ds);
        //    }
        //    catch (Exception ex)
        //    {
        //        // do something for error
        //        DataSet dsError;
        //        System.Data.SqlClient.SqlParameter[] ParametersError = { 
        //                                                           new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
        //                                                            new System.Data.SqlClient.SqlParameter("@ProcName","spReport_WareHouseAccounting"),
        //                                                            new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
        //                                                      };
        //        dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
        //        throw ex;
        //    }
        //}
        //
       



      

        //public void ExportToExcel(WarehouseAccountReport model, [Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, string airlineSNo, string originSNo, string fromDate, string toDate, string awbSNo, string reportType)
        //{
        //    string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<WarehouseAccountReport>(filter);
        //    System.Data.DataSet ds = new DataSet();

        //    System.Data.SqlClient.SqlParameter[] Parameters = { 
        //                                                           new System.Data.SqlClient.SqlParameter("@AirlineCode",airlineSNo),                                                                    
        //                                                            new System.Data.SqlClient.SqlParameter("@FromDate",fromDate),
        //                                                            new System.Data.SqlClient.SqlParameter("@ToDate",toDate),                                                                     
        //                                                             new System.Data.SqlClient.SqlParameter("@OriginCitySNo",originSNo),
        //                                                             new System.Data.SqlClient.SqlParameter("@AWBSNo",awbSNo),
        //                                                            new System.Data.SqlClient.SqlParameter("@ReportType",reportType)
        //                                                            //,
        //                                                            //new System.Data.SqlClient.SqlParameter("@PageNo", request.Page), 
        //                                                            //new System.Data.SqlClient.SqlParameter("@PageSize", request.PageSize) 
        //                                                      };
        //    try
        //    {
        //        ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spReport_WareHouseAccounting", Parameters);

        //        if (ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)  //--- Get All columns for merging the dt1(which is main data table)
        //        {
        //            if (ds.Tables[1] != null && ds.Tables[1].Rows.Count > 0) //-------main data table
        //            {
        //                if (ds.Tables[2] != null && ds.Tables[2].Rows.Count > 0) // -------Child data table
        //                {

        //                    for (int TableRow = 0; TableRow < ds.Tables[0].Rows.Count; TableRow++)
        //                    {
        //                        ds.Tables[1].Columns.Add(ds.Tables[0].Rows[TableRow][0].ToString(), typeof(string));

        //                        foreach (DataRow row in ds.Tables[1].Rows)
        //                        {
        //                            //need to set value to NewColumn column
        //                            row[ds.Tables[0].Rows[TableRow][0].ToString()] = "";   // or set it to some other value
        //                        }
        //                    }
        //                    //----------------Death of table 0 --

        //                    for (int MainDTRow = 0; MainDTRow < ds.Tables[1].Rows.Count; MainDTRow++)
        //                    {
        //                        DataRow[] dr = ds.Tables[2].Select("SNo = " + ds.Tables[1].Rows[MainDTRow]["SNo"].ToString());


        //                        if (dr.Length > 0)
        //                        {
        //                            string TariffHeadName = string.Empty;
        //                            string ChargeValue = string.Empty;
        //                            string Blank = "";
        //                            for (int ChildRow = 0; ChildRow < dr.Length; ChildRow++)
        //                            {
        //                                TariffHeadName = dr[ChildRow]["TariffHeadName"].ToString();
        //                                ChargeValue = dr[ChildRow]["ChargeValue"].ToString();

        //                                if (TariffHeadName != "" && ChargeValue != "")
        //                                {
        //                                    if (ds.Tables[1].Rows[MainDTRow][TariffHeadName].ToString() == Blank)
        //                                        ds.Tables[1].Rows[MainDTRow][TariffHeadName] = ChargeValue;
        //                                    else
        //                                        ds.Tables[1].Rows[MainDTRow][TariffHeadName] += "," + ChargeValue;
        //                                }
        //                            }

        //                        }
        //                    }
        //                    ds.Tables[1].Columns.Remove("AirlineSNo");
        //                    ds.Tables[1].Columns.Remove("LandSideSNo");
        //                }
        //            }
        //        }
        //        DataTable dt1 = ds.Tables[1];
        //        //dt1.Columns.Remove("SNo");
        //        ConvertDSToExcel_Success(dt1, 0);
        //    }
        //    catch (Exception ex)
        //    {
        //        // do something for error
        //        DataSet dsError;
        //        System.Data.SqlClient.SqlParameter[] ParametersError = { 
        //                                                           new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
        //                                                            new System.Data.SqlClient.SqlParameter("@ProcName","spReport_WareHouseAccounting"),
        //                                                            new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
        //                                                      };
        //        dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
        //        throw ex;
        //    }

        //}

        /// <summary> Add BY Sushant 
        ///  
        /// </summary>
        /// 
        /// 
        ///
        ///       
        /// <returns></returns>
        public string WarehouseAccountReportGetRecord([Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, CargoFlash.SoftwareFactory.Data.GridFilter filter, string airlineSNo, string originSNo, string fromDate, string toDate, string awbSNo, string reportType,int IsAutoProcess)
        {

            try
            {
                string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<WarehouseAccountReport>(filter);
                System.Data.DataSet ds = new DataSet();

                System.Data.SqlClient.SqlParameter[] Parameters = { 
                                                                   new System.Data.SqlClient.SqlParameter("@AirlineCode",airlineSNo),                                                                    
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",fromDate),
                                                                    new System.Data.SqlClient.SqlParameter("@ToDate",toDate),                                                                     
                                                                     new System.Data.SqlClient.SqlParameter("@OriginAirportSNo",originSNo),
                                                                     new System.Data.SqlClient.SqlParameter("@AWBSNo",awbSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@ReportType",reportType),
                                                                    new System.Data.SqlClient.SqlParameter("@IsAutoProcess",IsAutoProcess)

                                                              };

                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spReport_WareHouseAccounting", Parameters);
                return CargoFlash.Cargo.Business.Common.CompleteDStoJSONOnlyString(ds);
            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spReport_WareHouseAccounting"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }
        public void ExportToExcel(WarehouseAccountReport model, [Kendo.Mvc.UI.DataSourceRequest]Kendo.Mvc.UI.DataSourceRequest request, List<CargoFlash.SoftwareFactory.Data.GridSort> sort, CargoFlash.SoftwareFactory.Data.GridFilter filter, string airlineSNo, string originSNo, string fromDate, string toDate, string awbSNo, string reportType)
        {
            try
            {
                string filters = CargoFlash.SoftwareFactory.Data.GridFilter.ProcessFilters<WarehouseAccountReport>(filter);
                System.Data.DataSet ds = new DataSet();

                System.Data.SqlClient.SqlParameter[] Parameters = { 
                                                                   new System.Data.SqlClient.SqlParameter("@AirlineCode",airlineSNo),                                                                    
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",fromDate),
                                                                    new System.Data.SqlClient.SqlParameter("@ToDate",toDate),                                                                     
                                                                     new System.Data.SqlClient.SqlParameter("@OriginAirportSNo",originSNo),
                                                                     new System.Data.SqlClient.SqlParameter("@AWBSNo",awbSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@ReportType",reportType)
                                                               
                                                              };

                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "spReport_WareHouseAccounting", Parameters);

                DataTable dt1 = ds.Tables[0];
                ConvertDSToExcel_Success(dt1, 0);
            }
            catch (Exception ex)
            {

                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = { 
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spReport_WareHouseAccounting"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }

        }
        public void ConvertDSToExcel_Success(DataTable dt, int mode)
        {
            string date = DateTime.Now.ToString();
            using (XLWorkbook wb = new XLWorkbook())
            {
                wb.Worksheets.Add(dt);
                Response.Clear();
                Response.Buffer = true;
                Response.Charset = "";
                Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                Response.AddHeader("content-disposition", "attachment;filename=WarehouseAccountingReport_'" + date + "'.xlsx");
                using (MemoryStream MyMemoryStream = new MemoryStream())
                {
                    wb.SaveAs(MyMemoryStream);
                    MyMemoryStream.WriteTo(Response.OutputStream);
                    Response.Flush();
                    Response.End();
                }

            }
        }
    }
}