using CargoFlash.SoftwareFactory.Data;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;

namespace CargoFlashCargoWebApps.Controllers
{
    public class InterlineCSRController : Controller
    {
        // GET: InterlineCSR
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult GetInterlineCSRDetail([FromUri]int AirlineSNo, string month, string year = null, string Fortnight = null, string BookingType = null,int OfficeSNo=0)//,string AWBNo)
        {
            DataSet ds = new DataSet();
            try
            {
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                    new System.Data.SqlClient.SqlParameter("@AirlineSNo",AirlineSNo),
                                                                     new System.Data.SqlClient.SqlParameter("@OfficeSNo",OfficeSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@Month",month),
                                                                    new System.Data.SqlClient.SqlParameter("@Year",year),
                                                                    new System.Data.SqlClient.SqlParameter("@Fortnight",Fortnight),
                                                                    new System.Data.SqlClient.SqlParameter("@BookingType",BookingType)

                                                              };
                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "GetInterlineCSRDetails", Parameters);
                ds.Dispose();
                return Json(new DataSourceResult
                {
                    Data = CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds),
                    //Total = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString())
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","GetInterlineCSRDetails"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;
            }
        }
        //public ActionResult GetGSACSRReport(string careerCode, string Agentsno, string Year, string Month, string FortNightDate, int CurrencySNo, int BookingType, int CSRbtn)
        //{
        //    int RowNo = 0;
        //    string startDate, endDate;
        //    StringBuilder strData = new StringBuilder("</br>");
        //    DateTime stdate, edate;
        //    DataSet ds = new DataSet();
        //    string dsrowsvalue = string.Empty;

        //    List<Agent> listobjagentgent = new List<Agent>();
        //    try
        //    {
        //        string cssClassRight = string.Empty, cssClassLeft = string.Empty, cssClassCenter = string.Empty;


        //        FortNightDate = ("0" + FortNightDate).Substring(("0" + FortNightDate).Length - 2);

        //        Month = ("0" + Month).Substring(("0" + Month).Length - 2);

        //        startDate = ((FortNightDate == "01") ? "01" : "16") + "-" + Month + "-" +
        //                       Year;




        //        var dateAdd1Month = DateTime.ParseExact("01-" + Month + "-" + Year, "dd-MM-yyyy", System.Globalization.CultureInfo.InvariantCulture);

        //        endDate = ((FortNightDate == "01") ? "15" : dateAdd1Month.AddMonths(1).AddDays(-1).Day.ToString()) + "-" + Month + "-" + Year;


        //        stdate = DateTime.ParseExact(startDate, "dd-MM-yyyy", System.Globalization.CultureInfo.InvariantCulture);
        //        edate = DateTime.ParseExact(endDate, "dd-MM-yyyy", System.Globalization.CultureInfo.InvariantCulture);


        //        var fromdate_result = stdate.ToString("yyyy-MM-dd");


        //        var todate_result = edate.ToString("yyyy-MM-dd");


        //        System.Data.SqlClient.SqlParameter[] Parameters = {
        //                                                            new System.Data.SqlClient.SqlParameter("@_AirlineCode",careerCode),
        //                                                               new System.Data.SqlClient.SqlParameter("@OfficeSNo",Agentsno),
        //                                                                  new System.Data.SqlClient.SqlParameter("@_StartDate",fromdate_result),
        //                                                              new System.Data.SqlClient.SqlParameter("@_EndDate",todate_result),
        //                                                            new System.Data.SqlClient.SqlParameter("@_Currency",CurrencySNo)

        //                                                      };


        //        ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "GetAWBWiseCSR", Parameters);
        //        //DataView dvData = new DataView(ds.Tables[0], "OfficeSNo !='" + 0 + "'", "OfficeSNo", DataViewRowState.CurrentRows);
        //        //DataTable DataView = ds.Tables[0].DefaultView.ToTable(true, "OfficeSNo");

        //        if (ds.Tables[0].Rows.Count > 0)
        //        {
        //            DataView dvGSAData;
        //            int srNo = 0, no = 0;
        //            string fortNite = (stdate.Day == 1 ? "FIRST F/N" : "SECOND F/N");
        //            //if (dvData.ToTable().Rows.Count > 0)
        //            //{
        //            DataTable dtDataRow = ds.Tables[0].DefaultView.ToTable(true, "OfficeSNo");
        //            DataTable dataTable = ds.Tables[1];
        //            foreach (DataRow drGSA in dtDataRow.Rows)
        //            {
        //                no += 1;
        //                dvGSAData = new DataView(ds.Tables[0], "OfficeSNo='" + drGSA["OfficeSNo"] + "'", "Name", DataViewRowState.CurrentRows);
        //                //<tr><td colspan='29' aling='center'><img src='Images/" + "LOGO" + "_Logo.gif' style='width:100px' /></td></tr>
        //                strData.Append("<div class='k-grid-header-wrap' id='grid_bookingprofile' style='width: 100%; height: 100%; overflow-x: scroll; overflow-y: scroll;'><table class='dataTable' ></tr><tr><td colspan='29' style='background-color: #D5E1F0;border:1px solid;font-size: 12px;height: 20px;'><b>CSR</b></td></tr><tr style='background-color:#C0C0C0;border:1px solid'><td colspan='2' style='color:#FF0000'><b>GSA/CSA</b></td><td colspan='6' align='left'>: " + dvGSAData.ToTable().Rows[0]["Name"].ToString() + "</td><td rowspan='5' colspan='21' align='center' style='color:#FF0000;background-color:#FFFFFF;border:1px solid black'><b>CSR FOR THE  PERIOD " + fortNite + " " + CultureInfo.CurrentCulture.DateTimeFormat.MonthNames[stdate.Month - 1].ToUpper() + " " + stdate.Year + "</b></td></tr>");
        //                strData.Append("<tr style='background-color:#C0C0C0;border:1px solid'><td colspan='2' style='color:#FF0000'><b>BILLING CURRENCY </b></td><td colspan='6' align='left'>: " + dvGSAData.ToTable().Rows[0]["CurrencyCode"].ToString() + "</td></tr>");
        //                strData.Append("<tr style='background-color:#C0C0C0;border:1px solid'><td colspan='2' style='color:#FF0000'><b>PERIOD </b></td><td colspan='6' align='left'>: " + stdate.ToString("MMM-dd-yyyy") + " - " + edate.ToString("MMM-dd-yyyy") + "</td></tr>");
        //                strData.Append("<tr style='background-color:#C0C0C0;border:1px solid'><td colspan='2' style='color:#FF0000'><b>INVOICE NO </b></td><td colspan='6' align='left'>: " + dvGSAData.ToTable().Rows[0]["CsrNumberprfix"].ToString() + "</td></tr>");
        //                strData.Append("<tr style='background-color:#C0C0C0;border:1px solid'><td colspan='2' style='color:#FF0000'><b>AR-CODE </b></td><td colspan='6' align='left'>: " + dvGSAData.ToTable().Rows[0]["ERPCode"].ToString() + "</td></tr>");

        //                strData.Append("<tr style='font-weight:bold'><td rowspan='2' style='background-color:#D8D8D8;border:1px solid'>AWB Date</td><td rowspan='2' style='background-color:#D8D8D8;border:1px solid'>AWB NO</td><td rowspan='2' style='background-color:#D8D8D8;border:1px solid'>CARRIER</td><td rowspan='2' style='background-color:#D8D8D8;border:1px solid'>ORIGIN</td><td rowspan='2' style='background-color:#D8D8D8;border:1px solid'>Transit Point</td><td rowspan='2' style='background-color:#D8D8D8;border:1px solid'>Interline Carrier</td><td rowspan='2' style='background-color:#D8D8D8;border:1px solid'>DESTN</td><td rowspan='2' style='background-color:#D8D8D8;border:1px solid'>Flight date</td><td rowspan='2' style='background-color:#D8D8D8;border:1px solid'>COMMODITY</td><td rowspan='2' style='background-color:#D8D8D8;border:1px solid'>GR WGT</td><td rowspan='2' style='background-color:#D8D8D8;border:1px solid'>CHG WGT</td><td rowspan='2' style='background-color:#D8D8D8;border:1px solid'>Base rate</td><td rowspan='2' style='background-color:#D8D8D8;border:1px solid'>Flown Revenue</td><td colspan='" + ((dataTable.Columns.Count == 0 ? 1 : dataTable.Columns.Count) - 2) + "' align='center' style='color:#FFFFFF;background-color:#000000;border:1px solid'><b>Surcharges</b></td><td rowspan='2' style='background-color:#FF0000;border:1px solid'>" + dvGSAData.ToTable().Rows[0]["Carriercode"].ToString() + " TOTAL</td><td rowspan='2' style='background-color:#D8D8D8;border:1px solid'>INTERLINE RATE </td><td rowspan='2' style='background-color:#D8D8D8;border:1px solid'>Europe customs charges</td><td rowspan='2' style='background-color:#FF0000;border:1px solid'>INTERLINE TOTAL</td><td rowspan='2' style='background-color:#D8D8D8;border:1px solid'>NET TOTAL PAYABLE TO " + dvGSAData.ToTable().Rows[0]["Carriercode"].ToString() + "</td></tr>");
        //                //strData.Append("<tr style='font-weight:bold'><td style='background-color:#B8CCE4;border:1px solid'>Others</td><td style='background-color:#B8CCE4;border:1px solid'>Transit Fees (MCT transit shipments)</td><td style='background-color:#B8CCE4;border:1px solid'>FW</td><td style='background-color:#B8CCE4;border:1px solid'>IC</td><td style='background-color:#B8CCE4;border:1px solid'>MO</td></tr>");
        //                strData.Append("<tr style='font-weight:bold'>");

        //                foreach (DataColumn col in dataTable.Columns)
        //                {
        //                    if (col.ColumnName != "AWBSNO" && col.ColumnName != "OfficeSNo")
        //                        strData.Append("<td style='background-color:#B8CCE4;border:1px solid'>" + col.ColumnName + "</td>");
        //                }
        //                strData.Append("</tr>");
        //                foreach (DataRow drData in dvGSAData.ToTable().Rows)
        //                {
        //                    srNo += 1;
        //                    // set row CSS                       
        //                    cssClassRight = srNo % 2 == 0 ? "ui-widget-content" : "ui-widget-content";
        //                    cssClassLeft = srNo % 2 == 0 ? "ui-widget-content" : "ui-widget-content";
        //                    cssClassCenter = srNo % 2 == 0 ? "ui-widget-content" : "ui-widget-content";
        //                    //Math.Round(Convert.ToDecimal(drData["GSARate"], 3));
        //                    strData.Append("<tr><td class='" + cssClassCenter + "'>" + DateTime.Parse(drData["AWBDate"].ToString()).ToString("dd-MM-yyyy") + "</td><td class='" + cssClassCenter + "'>" + drData["AWBNumber"] + "</td><td class='" + cssClassCenter + "'>" + drData["Carriercode"] + "</td><td class='" + cssClassCenter + "'>" + drData["Origin"] + "</td><td class='" + cssClassCenter + "'>" + drData["Transit"] + "</td><td class='" + cssClassCenter + "'>" + drData["ISInterLineCarrier"] + "</td><td class='" + cssClassCenter + "'>" + drData["Destination"] + "</td><td class='" + cssClassCenter + "'>" + DateTime.Parse(drData["FlightDate"].ToString()).ToString("dd-MM-yyyy") + "</td><td class='" + cssClassCenter + "'>" + drData["Commodity"] + "</td><td class='" + cssClassRight + "'>" + drData["GrossWeight"] + "</td><td class='" + cssClassRight + "'>" + drData["ChargeableWeight"] + "</td><td class='" + cssClassRight + "'>" + Convert.ToDecimal(drData["BaseRate"]).ToString() + "</td><td class='" + cssClassRight + "'>" + Convert.ToDecimal(drData["FlownRevenue"]).ToString("N") + "</td>");

        //                    DataView dvDueCarrierData = new DataView(ds.Tables[1], "AWBSNO='" + drData["AWBSNO"] + "'", "AWBSNO", DataViewRowState.CurrentRows);
        //                    if (dvDueCarrierData.Count > 0)
        //                    {
        //                        foreach (DataRow drData1 in dvDueCarrierData.ToTable().Rows)
        //                        {
        //                            foreach (DataColumn col in dataTable.Columns)
        //                            {
        //                                if (col.ColumnName != "AWBSNO" && col.ColumnName != "OfficeSNo")
        //                                    strData.Append("<td class='" + cssClassRight + "'>" + Convert.ToDecimal(drData1[col.ColumnName].ToString() == "" ? "0.00" : drData1[col.ColumnName].ToString()) + "</td>");
        //                            }

        //                        }
        //                    }
        //                    else
        //                    {
        //                        foreach (DataColumn col in dataTable.Columns)
        //                        {
        //                            if (col.ColumnName != "AWBSNO" && col.ColumnName != "OfficeSNo")
        //                                strData.Append("<td class='" + cssClassRight + "'>" + "0.00" + "</td>");
        //                        }
        //                    }
        //                    //strData.Append("<td class='" + cssClassRight + "'>" + Convert.ToDecimal(drData["FSC"]).ToString("N") + "</td><td class='" + cssClassRight + "'>" + Convert.ToDecimal(drData["SSC"]).ToString("N") + "</td><td class='" + cssClassRight + "'>" + Convert.ToDecimal(drData["XRAY"]).ToString("N") + "</td><td class='" + cssClassRight + "'>" + Convert.ToDecimal(drData["CARTINGCHARGES"]).ToString("N") + "</td><td class='" + cssClassRight + "'>" + Convert.ToDecimal(drData["AwbFee"]).ToString("N") + "</td><td class='" + cssClassRight + "'>" + Convert.ToDecimal(drData["VoidCharges"]).ToString("N") + "</td><td class='" + cssClassRight + "'>" + Convert.ToDecimal(drData["OC"]).ToString("N") + "</td><td class='" + cssClassRight + "'>" + Convert.ToDecimal(drData["MctCharges"]).ToString("N") + "</td><td class='" + cssClassRight + "'>" + Convert.ToDecimal(drData["FW"]).ToString("N") + "</td><td class='" + cssClassRight + "'>" + Convert.ToDecimal(drData["IC"]).ToString("N") + "</td><td class='" + cssClassRight + "'>" + Convert.ToDecimal(drData["MO"]).ToString("N") + "</td>");

        //                    strData.Append("<td class='" + cssClassRight + "'>" + Convert.ToDecimal(drData["TotalAmlount"]).ToString("N") + "</td><td class='" + cssClassRight + "'>" + Convert.ToDecimal(drData["InterlineRate"]).ToString("N") + "</td><td class='" + cssClassRight + "'>" + Convert.ToDecimal(drData["EuropeCustomCharges"]).ToString("N") + "</td><td class='" + cssClassRight + "'>" + Convert.ToDecimal(drData["InterlineTotal"]).ToString("N") + "</td><td class='" + cssClassRight + "'>" + Convert.ToDecimal(decimal.Parse(drData["NetTotalPaybleAmount"].ToString()) + decimal.Parse(drData["InterlineTotal"].ToString())).ToString("N") + "</td></tr>");
        //                }
        //                // total
        //                strData.Append("<tr style='color:#FFFFFF;background-color:#FF0000;border:1px solid black;font-weight:bold;text-align:right'><td colspan='9' style='border:1px solid black' ><b>TOTAL</b></td><td style='border:1px solid black'>" + dvGSAData.ToTable().Compute("SUM(GrossWeight)", "") + "</td><td style='border:1px solid black'>" + Convert.ToDecimal(dvGSAData.ToTable().Compute("SUM(ChargeableWeight)", "")).ToString("N") + "</td></td><td style='border:1px solid black'></td><td style='border:1px solid black'>" + Convert.ToDecimal(dvGSAData.ToTable().Compute("SUM(FlownRevenue)", "")).ToString("N") + "</td>");

        //                DataView dvCountDueCarrierData = new DataView(ds.Tables[1], "OfficeSNo='" + drGSA["OfficeSNo"] + "'", "OfficeSNo", DataViewRowState.CurrentRows);
        //                foreach (DataColumn col in dataTable.Columns)
        //                {
        //                    if (col.ColumnName != "AWBSNO" && col.ColumnName != "OfficeSNo")
        //                        //strData.Append("<td class='" + cssClassRight + "'>" + drData2[col.ColumnName] + "</td>");
        //                        strData.Append("<td style='border:1px solid black'>" + Convert.ToDecimal((dvCountDueCarrierData.ToTable().Compute("SUM(" + col.ColumnName + ")", "")).ToString() == "" ? "0" : (dvCountDueCarrierData.ToTable().Compute("SUM(" + col.ColumnName + ")", ""))) + "</td>");
        //                }


        //                //strData.Append("<td style='border:1px solid black'>" + Convert.ToDecimal(dvGSAData.ToTable().Compute("SUM(FSC)", "")).ToString("N") + "</td><td style='border:1px solid black'>" + Convert.ToDecimal(dvGSAData.ToTable().Compute("SUM(SSC)", "")).ToString("N") + "</td><td style='border:1px solid black'>" + Convert.ToDecimal(dvGSAData.ToTable().Compute("SUM(XRAY)", "")).ToString("N") + "</td><td style='border:1px solid black'>" + Convert.ToDecimal(dvGSAData.ToTable().Compute("SUM(CARTINGCHARGES)", "")).ToString("N") + "</td><td style='border:1px solid black'>" + Convert.ToDecimal(dvGSAData.ToTable().Compute("SUM(AwbFee)", "")).ToString("N") + "</td><td style='border:1px solid black'>" + Convert.ToDecimal(dvGSAData.ToTable().Compute("SUM(VoidCharges)", "")).ToString("N") + "</td><td style='border:1px solid black'>" + Convert.ToDecimal(dvGSAData.ToTable().Compute("SUM(OC)", "")).ToString("N") + "</td><td style='border:1px solid black'>" + Convert.ToDecimal(dvGSAData.ToTable().Compute("SUM(MctCharges)", "")).ToString("N") + "</td><td style='border:1px solid black'>" + Convert.ToDecimal(dvGSAData.ToTable().Compute("SUM(FW)", "")).ToString("N") + "</td><td style='border:1px solid black'>" + Convert.ToDecimal(dvGSAData.ToTable().Compute("SUM(IC)", "")).ToString("N") + "</td><td style='border:1px solid black'>" + Convert.ToDecimal(dvGSAData.ToTable().Compute("SUM(MO)", "")).ToString("N") + "</td>");

        //                strData.Append("<td style='border:1px solid black'>" + Convert.ToDecimal(dvGSAData.ToTable().Compute("SUM(TotalAmlount)", "")).ToString("N") + "</td><td style='border:1px solid black'></td><td style='border:1px solid black'>" + Convert.ToDecimal(dvGSAData.ToTable().Compute("SUM(EuropeCustomCharges)", "")).ToString("N") + "</td><td style='border:1px solid black'>" + Convert.ToDecimal(dvGSAData.ToTable().Compute("SUM(InterlineTotal)", "")).ToString("N") + "</td><td style='border:1px solid black'>" + Convert.ToDecimal((decimal.Parse(dvGSAData.ToTable().Compute("SUM(NetTotalPaybleAmount)", "").ToString()) + decimal.Parse(dvGSAData.ToTable().Compute("SUM(InterlineTotal)", "").ToString()))).ToString("N") + "</td></tr>");

        //                strData.Append("</table></div><br/><br/>");
        //                RowNo = 1;
        //            }
        //        }
        //        else
        //        {
        //            strData.Append("Data Not Found.");
        //            RowNo = 0;

        //        }


        //    }
        //    catch (Exception ex)
        //    {
        //        DataSet dsError;
        //        System.Data.SqlClient.SqlParameter[] ParametersError = {
        //                                                           new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
        //                                                            new System.Data.SqlClient.SqlParameter("@ProcName","GetAWBWiseCSRNew"),
        //                                                            new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
        //                                                      };
        //        dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
        //        throw ex;

        //    }
        //    return Json(new DataSourceResult
        //    {
        //        Data = strData.ToString(),
        //        Total = RowNo,
        //    }, JsonRequestBehavior.AllowGet);
        //}
        public ActionResult GenerateInterlineCSRReport([FromUri]int AirlineSNo, string FromDate, string ToDate,string BookingType = null, int OfficeSNo=0)
        {

            try
            {

                DataSet ds = new DataSet();


                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                    new System.Data.SqlClient.SqlParameter("@AirlineSNo",AirlineSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@OfficeSNo",OfficeSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",FromDate),
                                                                    new System.Data.SqlClient.SqlParameter("@ToDate",ToDate),
                                                                    new System.Data.SqlClient.SqlParameter("@BookingType",BookingType)

                                                              };
                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "uspGenrateInterlineCSRReport", Parameters);
                return Json(new DataSourceResult
                {
                    Data = ds.Tables[0].Rows[0][0].ToString(),

                }, JsonRequestBehavior.AllowGet);
            }

            catch (Exception ex)//
            {
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","uspGenrateInterlineCSRReport"),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString())
                                                              };
                dsError = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString, System.Data.CommandType.StoredProcedure, "ProcOfHandleErrors", ParametersError);
                throw ex;

            }
        }
    }
}