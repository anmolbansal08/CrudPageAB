using System;
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
using System.Net;
using System.ServiceModel.Web;
using ClosedXML.Excel;


namespace CargoFlashCargoWebApps.Controllers
{
    public class AnyTimeCSRController : Controller
    {
        //
        // GET: /AnyTimeCSR/
        public ActionResult Index()
        {
            
            return View();
        }

        public void GetRecordInExcel(string AirlineSNo, string OfficeSNo, string AccountSNo, string BranchSNo, string CitySNo, string CurrencySNo, string FromDate, string ToDate,string UserSNo)
        {
            try
            {
                  
                StringBuilder strAnyTimeCSR = new StringBuilder();
                System.Data.DataSet ds = new DataSet();

                string connectionString = CargoFlash.SoftwareFactory.Data.DMLConnectionString.WebConfigConnectionString.ToString();
                System.Data.SqlClient.SqlParameter[] Parameters = {
                                                                    new System.Data.SqlClient.SqlParameter("@AirlineSNo",AirlineSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@OfficeSNo",OfficeSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@AccountSNo",AccountSNo),                                                                  
                                                                    new System.Data.SqlClient.SqlParameter("@BranchSNo",BranchSNo),
                                                                    new System.Data.SqlClient.SqlParameter("@CitySNo",CitySNo),
                                                                    new System.Data.SqlClient.SqlParameter("@ToCurrencySNo",CurrencySNo),
                                                                    new System.Data.SqlClient.SqlParameter("@FromDate",FromDate),                                                           
                                                                    new System.Data.SqlClient.SqlParameter("@ToDate",ToDate),
                                                                    new System.Data.SqlClient.SqlParameter("@UserSNo",UserSNo),
                                                              };
                ds = CargoFlash.SoftwareFactory.Data.SqlHelper.ExecuteDataset(connectionString, System.Data.CommandType.StoredProcedure, "spGetAnytimeCSRRecord_Report", Parameters);


                //DataTable dt1 = ds.Tables[0];
                //DataTable dtAnyTimeCSR = ds.Tables[0];
                ////////////////////////////////

                decimal sumGrossWt = Convert.ToDecimal("0"), sumChWt = Convert.ToDecimal("0"), sumCC = Convert.ToDecimal("0"), sumFreightPP = Convert.ToDecimal("0"), sumFreightCC = Convert.ToDecimal("0"), sumCommission = Convert.ToDecimal("0"), sumNP = Convert.ToDecimal("0");
                //DataView dvAnyTimeCSR = reportBuilder.GetAnyTimeCSRReport(AirlineSNo, Origin, Convert.ToInt32(OfficeCode), Convert.ToInt32(AgentCode), Convert.ToDateTime(StartDate), Convert.ToDateTime(EndDate), "").Tables[0].DefaultView;
               
                //DataView dvAnyTimeCSR = ds.Tables[0].DefaultView;               
                //DataTable dtAnyTimeCSR = dvAnyTimeCSR.ToTable();
                //DataTable dt1 = ds.Tables[1];

                DataTable dtAnyTimeCSR = ds.Tables[0];
                
                if (dtAnyTimeCSR != null && dtAnyTimeCSR.Rows.Count > 0)               
                {
                    strAnyTimeCSR.Append("<div style=\"width:3432px;height:100%;overflow:auto;\" id='divCSR'>");
                    strAnyTimeCSR.Append("<table class=\"grdTable\" border='1'><tr>");
                    strAnyTimeCSR.Append("<td class=\"grdHeaderFixedCSR\">AWB No</td>");
                    strAnyTimeCSR.Append("<td class=\"grdHeaderFixedCSR\">Shipper Name</td>");
                    strAnyTimeCSR.Append("<td class=\"grdHeaderFixedCSR\">Ori</td>");
                    strAnyTimeCSR.Append("<td class=\"grdHeaderFixedCSR\">Dest</td>");
                    strAnyTimeCSR.Append("<td class=\"grdHeaderFixedCSR\">Flight No</td>");
                    strAnyTimeCSR.Append("<td class=\"grdHeaderFixedCSR\">Flight Date</td>");
                    strAnyTimeCSR.Append("<td class=\"grdHeaderFixedCSR\">Pieces</td>");
                    strAnyTimeCSR.Append("<td class=\"grdHeaderFixedCSR\">Gr. Wt</td>");
                    strAnyTimeCSR.Append("<td class=\"grdHeaderFixedCSR\">Ch. Wt</td>");
                    strAnyTimeCSR.Append("<td class=\"grdHeaderFixedCSR\">AWB Rate</td>");
                    strAnyTimeCSR.Append("<td class=\"grdHeaderFixedCSR\">Currency</td>");
                    strAnyTimeCSR.Append("<td class=\"grdHeaderFixedCSR\">Exchange Rate</td>");
                    strAnyTimeCSR.Append("<td class=\"grdHeaderFixedCSR\">Revenue</td>");
                    strAnyTimeCSR.Append("<td class=\"grdHeaderFixedCSR\">Valuation Charge</td>");
                    strAnyTimeCSR.Append("<td class=\"grdHeaderFixedCSR\">Adm Fee</td>");
                    strAnyTimeCSR.Append("<td class=\"grdHeaderFixedCSR\">Warehouse Fee</td>");
                    strAnyTimeCSR.Append("<td class=\"grdHeaderFixedCSR\">Spl. Charges</td>");
                    strAnyTimeCSR.Append("<td class=\"grdHeaderFixedCSR\">Other Charge</td>");
                    strAnyTimeCSR.Append("<td class=\"grdHeaderFixedCSR\">Tax</td>");
                    strAnyTimeCSR.Append("<td class=\"grdHeaderFixedCSR\">Freight PP</td>");                   
                    strAnyTimeCSR.Append("<td class=\"grdHeaderFixedCSR\">NTA</td>");//Net Payble
                    strAnyTimeCSR.Append("<td class=\"grdHeaderFixedCSR\">NTA Tax</td>");
                    strAnyTimeCSR.Append("<td class=\"grdHeaderFixedCSR\">Commodity</td>");
                    strAnyTimeCSR.Append("<td class=\"grdHeaderFixedCSR\">Product</td>");
                    strAnyTimeCSR.Append("<td class=\"grdHeaderFixedCSR\">Remarks</td>");
                    strAnyTimeCSR.Append("<td class=\"grdHeaderFixedCSR\">Created By</td>");
                    strAnyTimeCSR.Append("</tr>");
                    strAnyTimeCSR.Append("</table><div style=\"width:3450px;height:300px;overflow:auto;\" ><table class=\"grdTable\" border='1'>");

                    string officeName = dtAnyTimeCSR.Rows[0]["OfficeName"].ToString();
                    decimal officeGrossWt = Convert.ToDecimal("0"), officeChWt = Convert.ToDecimal("0"), officeCC = Convert.ToDecimal("0"), officeFreightPP = Convert.ToDecimal("0"), officeFreightCC = Convert.ToDecimal("0"), officeCommission = Convert.ToDecimal("0"), officeNP = Convert.ToDecimal("0");

                    string agentName = dtAnyTimeCSR.Rows[0]["agentName"].ToString();
                    decimal agentGrossWt = Convert.ToDecimal("0"), agentChWt = Convert.ToDecimal("0"), agentCC = Convert.ToDecimal("0"), agentFreightPP = Convert.ToDecimal("0"), agentFreightCC = Convert.ToDecimal("0"), agentCommission = Convert.ToDecimal("0"), agentNP = Convert.ToDecimal("0");

                    string Currency = dtAnyTimeCSR.Rows[0]["Currency"].ToString();
                    decimal CGrossWt = Convert.ToDecimal("0"), CChWt = Convert.ToDecimal("0"), CCC = Convert.ToDecimal("0"), CFreightPP = Convert.ToDecimal("0"), CFreightCC = Convert.ToDecimal("0"), CCommission = Convert.ToDecimal("0"), CNP = Convert.ToDecimal("0");


                    strAnyTimeCSR.Append("<tr><td colspan='24' class='grdRowFixedCSR'><b>Office " + dtAnyTimeCSR.Rows[0]["OfficeName"] + "</b></td></tr>");
                    strAnyTimeCSR.Append("<tr><td colspan='24' class='grdRowFixedCSR'><b>Agent " + dtAnyTimeCSR.Rows[0]["AgentName"] + "</b></td></tr>");
                    strAnyTimeCSR.Append("<tr><td colspan='24' class='grdRowFixedCSR'><b>Currency " + dtAnyTimeCSR.Rows[0]["Currency"] + "</b></td></tr>");
                    foreach (DataRow dr in dtAnyTimeCSR.Rows)
                    {
                        if (!agentName.Equals(dr["AgentName"]))
                        {
                            strAnyTimeCSR.Append("<tr><td colspan='7' class='grdRowFixedCSR'><b>Currency : Sub Total for  " + Currency + "</b></td>");
                            strAnyTimeCSR.Append("<td class='grdRowFixedCSR'><b>" + CGrossWt + "</b></td>");
                            strAnyTimeCSR.Append("<td class='grdRowFixedCSR'><b>" + CChWt + "</b></td>");
                            strAnyTimeCSR.Append("<td colspan='3' class='grdRowFixedCSR'><b>&nbsp;</b></td>");
                            strAnyTimeCSR.Append("<td class='grdRowFixedCSR'><b>" + CCC + "</b></td>");
                            strAnyTimeCSR.Append("<td colspan='5' class='grdRowFixedCSR'><b>&nbsp;</b></td>");
                            strAnyTimeCSR.Append("<td class='grdRowFixedCSR'></td>");
                            strAnyTimeCSR.Append("<td class='grdRowFixedCSR'><span style='font-weight:bold;' currformat='currformat'>" + string.Format("{0:#,0.00}", CFreightPP) + "</span></td>");
                            strAnyTimeCSR.Append("<td class='grdRowFixedCSR'><span style='font-weight:bold;' currformat='currformat'>" + string.Format("{0:#,0.00}", CNP) + "</span></td>");
                            strAnyTimeCSR.Append("<td class='grdRowFixedCSR'></td>");
                           
                            
                            strAnyTimeCSR.Append("<td colspan='3' class='grdRowFixedCSR'><b>&nbsp;</b></td></tr>");
                            sumNP += CNP;
                            sumGrossWt += CGrossWt;
                            sumFreightPP += CFreightPP;
                            sumFreightCC += CFreightCC;
                            sumCommission += CCommission;
                            sumChWt += CChWt;
                            sumCC += CCC;
                            CNP = Convert.ToDecimal("0");
                            CGrossWt = Convert.ToDecimal("0");
                            CFreightPP = Convert.ToDecimal("0");
                            CFreightCC = Convert.ToDecimal("0");
                            CCommission = Convert.ToDecimal("0");
                            CChWt = Convert.ToDecimal("0");
                            CCC = Convert.ToDecimal("0");
                            Currency = dr["Currency"].ToString();


                            //agent
                            strAnyTimeCSR.Append("<tr><td colspan='7' class='grdRowFixedCSR'><b>Agent : Sub Total for  " + agentName + "</b></td>");
                            strAnyTimeCSR.Append("<td class='grdRowFixedCSR'><b>" + agentGrossWt + "</b></td>");
                            strAnyTimeCSR.Append("<td class='grdRowFixedCSR'><b>" + agentChWt + "</b></td>");
                            strAnyTimeCSR.Append("<td colspan='3' class='grdRowFixedCSR'><b>&nbsp;</b></td>");
                            strAnyTimeCSR.Append("<td class='grdRowFixedCSR'><b>" + agentCC + "</b></td>");
                            strAnyTimeCSR.Append("<td colspan='5' class='grdRowFixedCSR'><b>&nbsp;</b></td>");
                            strAnyTimeCSR.Append("<td class='grdRowFixedCSR'></td>");
                            strAnyTimeCSR.Append("<td class='grdRowFixedCSR'><span style='font-weight:bold;' currformat='currformat'>" + string.Format("{0:#,0.00}", agentFreightPP) + "</span></td>");
                            strAnyTimeCSR.Append("<td class='grdRowFixedCSR'><span style='font-weight:bold;' currformat='currformat'>" + string.Format("{0:#,0.00}", agentNP) + "</span></td>");
                            strAnyTimeCSR.Append("<td class='grdRowFixedCSR'></td>");
                            
                            strAnyTimeCSR.Append("<td colspan='3' class='grdRowFixedCSR'><b>&nbsp;</b></td></tr>");
                            strAnyTimeCSR.Append("<tr><td colspan='24' class='grdRowFixedCSR'><b>Agent " + dr["agentName"] + "</b></td></tr>");
                            strAnyTimeCSR.Append("<tr><td colspan='24' class='grdRowFixedCSR'><b>Currency" + dr["Currency"] + "</b></td></tr>");
                            sumNP += agentNP;
                            sumGrossWt += agentGrossWt;
                            sumFreightPP += agentFreightPP;
                            sumFreightCC += agentFreightCC;
                            sumCommission += agentCommission;
                            sumChWt += agentChWt;
                            sumCC += agentCC;
                            agentNP = Convert.ToDecimal("0");
                            agentGrossWt = Convert.ToDecimal("0");
                            agentFreightPP = Convert.ToDecimal("0");
                            agentFreightCC = Convert.ToDecimal("0");
                            agentCommission = Convert.ToDecimal("0");
                            agentChWt = Convert.ToDecimal("0");
                            agentCC = Convert.ToDecimal("0");

                            agentName = dr["agentName"].ToString();
                        }
                        if (!Currency.Equals(dr["Currency"].ToString()))
                        {
                            strAnyTimeCSR.Append("<tr><td colspan='7' class='grdRowFixedCSR'><b>Currency : Sub Total for  " + Currency + "</b></td>");
                            strAnyTimeCSR.Append("<td class='grdRowFixedCSR'><b>" + CGrossWt + "</b></td>");
                            strAnyTimeCSR.Append("<td class='grdRowFixedCSR'><b>" + CChWt + "</b></td>");
                            strAnyTimeCSR.Append("<td colspan='3' class='grdRowFixedCSR'><b>&nbsp;</b></td>");
                            strAnyTimeCSR.Append("<td class='grdRowFixedCSR'><b>" + CCC + "</b></td>");
                            strAnyTimeCSR.Append("<td colspan='5' class='grdRowFixedCSR'><b>&nbsp;</b></td>");
                            strAnyTimeCSR.Append("<td class='grdRowFixedCSR'></td>");
                            strAnyTimeCSR.Append("<td class='grdRowFixedCSR'><span style='font-weight:bold;' currformat='currformat'>" + CFreightPP + "</span></td>");
                            //strAnyTimeCSR.Append("<td class='grdRowFixedCSR'><b>" + officeFreightCC + "</b></td>");
                            //strAnyTimeCSR.Append("<td class='grdRowFixedCSR' style='display:none;'><b>" + CCommission + "</b></td>");
                            strAnyTimeCSR.Append("<td class='grdRowFixedCSR'><span style='font-weight:bold;' currformat='currformat'>" + CNP + "</span></td>");
                            strAnyTimeCSR.Append("<td class='grdRowFixedCSR'></td>");
                         
                            strAnyTimeCSR.Append("<td colspan='3' class='grdRowFixedCSR'><b>&nbsp;</b></td></tr>");
                            strAnyTimeCSR.Append("<tr><td colspan='24' class='grdRowFixedCSR'><b>Currency" + dr["Currency"] + "</b></td></tr>");
                            sumNP += CNP;
                            sumGrossWt += CGrossWt;
                            sumFreightPP += CFreightPP;
                            sumFreightCC += CFreightCC;
                            sumCommission += CCommission;
                            sumChWt += CChWt;
                            sumCC += CCC;
                            CNP = Convert.ToDecimal("0");
                            CGrossWt = Convert.ToDecimal("0");
                            CFreightPP = Convert.ToDecimal("0");
                            CFreightCC = Convert.ToDecimal("0");
                            CCommission = Convert.ToDecimal("0");
                            CChWt = Convert.ToDecimal("0");
                            CCC = Convert.ToDecimal("0");
                            Currency = dr["Currency"].ToString();
                        }
                        if (!officeName.Equals(dr["OfficeName"]))
                        {
                            strAnyTimeCSR.Append("<tr><td colspan='7' class='grdRowFixedCSR'><b>Office : Sub Total for  " + officeName + "</b></td>");
                            strAnyTimeCSR.Append("<td class='grdRowFixedCSR'><b>" + officeGrossWt + "</b></td>");
                            strAnyTimeCSR.Append("<td class='grdRowFixedCSR'><b>" + officeChWt + "</b></td>");
                            strAnyTimeCSR.Append("<td colspan='3' class='grdRowFixedCSR'><b>&nbsp;</b></td>");
                            strAnyTimeCSR.Append("<td class='grdRowFixedCSR'><b>" + officeCC + "</b></td>");
                            strAnyTimeCSR.Append("<td colspan='5' class='grdRowFixedCSR'><b>&nbsp;</b></td>");
                            strAnyTimeCSR.Append("<td class='grdRowFixedCSR'></td>");
                            strAnyTimeCSR.Append("<td class='grdRowFixedCSR'><span style='font-weight:bold;' currformat='currformat'>" + string.Format("{0:#,0.00}", officeFreightPP) + "</span></td>");
                            //strAnyTimeCSR.Append("<td class='grdRowFixedCSR'><b>" + officeFreightCC + "</b></td>");
                            //strAnyTimeCSR.Append("<td class='grdRowFixedCSR' style='display:none;'><b>" + officeCommission + "</b></td>");
                            strAnyTimeCSR.Append("<td class='grdRowFixedCSR'><span style='font-weight:bold;' currformat='currformat'>" + string.Format("{0:#,0.00}", officeNP) + "</span></td>");
                            strAnyTimeCSR.Append("<td class='grdRowFixedCSR'></td>");
                           
                            strAnyTimeCSR.Append("<td colspan='3' class='grdRowFixedCSR'><b>&nbsp;</b></td></tr>");
                            strAnyTimeCSR.Append("<tr><td colspan='24' class='grdRowFixedCSR'><b>Office : " + dr["OfficeName"] + "</b></td></tr>");
                            sumNP += officeNP;
                            sumGrossWt += officeGrossWt;
                            sumFreightPP += officeFreightPP;
                            sumFreightCC += officeFreightCC;
                            sumCommission += officeCommission;
                            sumChWt += officeChWt;
                            sumCC += officeCC;
                            officeNP = Convert.ToDecimal("0");
                            officeGrossWt = Convert.ToDecimal("0");
                            officeFreightPP = Convert.ToDecimal("0");
                            officeFreightCC = Convert.ToDecimal("0");
                            officeCommission = Convert.ToDecimal("0");
                            officeChWt = Convert.ToDecimal("0");
                            officeCC = Convert.ToDecimal("0");
                            officeName = dr["OfficeName"].ToString();
                        }


                        strAnyTimeCSR.Append("<tr>");
                        strAnyTimeCSR.Append("<td class='grdRowFixedCSR'>" + dr["AWBNo"] + "</td>");
                        strAnyTimeCSR.Append("<td class='grdRowFixedCSR'>" + dr["ShipperName"] + "</td>");
                        strAnyTimeCSR.Append("<td class='grdRowFixedCSR'>" + dr["OriginCity"] + "</td>");
                        strAnyTimeCSR.Append("<td class='grdRowFixedCSR'>" + dr["DestinationCity"] + "</td>");
                        strAnyTimeCSR.Append("<td class='grdRowFixedCSR'>" + dr["FlightNo"] + "</td>");
                        strAnyTimeCSR.Append("<td class='grdRowFixedCSR'>" + Convert.ToDateTime(dr["FlightDate"]).ToString("MM/dd/yyyy") + "</td>");
                        strAnyTimeCSR.Append("<td class='grdRowFixedCSR'>" + dr["Pieces"] + "</td>");
                        strAnyTimeCSR.Append("<td class='grdRowFixedCSR'>" + dr["GrossWeight"] + "</td>");
                        strAnyTimeCSR.Append("<td class='grdRowFixedCSR'>" + dr["ChargeableWeight"] + "</td>");
                        strAnyTimeCSR.Append("<td class='grdRowFixedCSR' currformath='currformath'>" + dr["AWBRate"] + "</td>");
                        strAnyTimeCSR.Append("<td class='grdRowFixedCSR'>" + dr["Currency"] + "</td>");
                        strAnyTimeCSR.Append("<td class='grdRowFixedCSR'>" + dr["ExchangeRate"] + "</td>");
                        strAnyTimeCSR.Append("<td class='grdRowFixedCSR' currformath='currformath'>" + dr["Revenue"] + "</td>");
                        strAnyTimeCSR.Append("<td class='grdRowFixedCSR' currformath='currformath'>" + dr["ValuationCharges"] + "</td>");
                        strAnyTimeCSR.Append("<td class='grdRowFixedCSR' currformath='currformath'>" + dr["AdmFee"] + "</td>");
                        strAnyTimeCSR.Append("<td class='grdRowFixedCSR' currformath='currformath'>" + dr["WarehouseFee"] + "</td>");
                        strAnyTimeCSR.Append("<td class='grdRowFixedCSR'>" + dr["SplCharges"] + "</td>");
                        strAnyTimeCSR.Append("<td class='grdRowFixedCSR' currformath='currformath'>" + dr["OtherCharge"] + "</td>");
                        strAnyTimeCSR.Append("<td class='grdRowFixedCSR' currformath='currformath'>" + dr["Tax"] + "</td>");
                        strAnyTimeCSR.Append("<td class='grdRowFixedCSR' currformath='currformath'>" + dr["FreightPP"] + "</td>");
                       
                        strAnyTimeCSR.Append("<td class='grdRowFixedCSR' currformath='currformath'>" + dr["NTA"] + "</td>");
                        strAnyTimeCSR.Append("<td class='grdRowFixedCSR' currformath='currformath'>" + dr["NTATax"] + "</td>");
                        strAnyTimeCSR.Append("<td class='grdRowFixedCSR'>" + dr["Commodity"] + "</td>");
                        strAnyTimeCSR.Append("<td class='grdRowFixedCSR'>" + dr["Product"] + "</td>");
                        strAnyTimeCSR.Append("<td class='grdRowFixedCSR'>" + dr["Remarks"] + "</td>");
                        strAnyTimeCSR.Append("<td class='grdRowFixedCSR'>" + dr["CreatedBy"] + "</td>");
                        strAnyTimeCSR.Append("</tr>");

                        officeNP += Convert.ToDecimal(dr["NTA"].ToString() == "" ? "0" : Convert.ToString(dr["NTA"]));
                        officeGrossWt += Convert.ToDecimal(dr["GrossWeight"].ToString() == "" ? "0" : Convert.ToString(dr["GrossWeight"]));
                        officeFreightPP += Convert.ToDecimal(dr["FreightPP"].ToString() == "" ? "0" : Convert.ToString(dr["FreightPP"]));
                       // officeFreightCC += Convert.ToDecimal(dr["FreightCC"].ToString() == "" ? "0" : Convert.ToString(dr["FreightCC"]));
                       // officeCommission += Convert.ToDecimal(dr["GSACommission"].ToString() == "" ? "0" : Convert.ToString(dr["NTA"]));
                        officeChWt += Convert.ToDecimal(dr["ChargeableWeight"].ToString() == "" ? "0" : Convert.ToString(dr["ChargeableWeight"]));
                        officeCC += Convert.ToDecimal(dr["ValuationCharges"].ToString() == "" ? "0" : Convert.ToString(dr["ValuationCharges"]));

                        agentNP += Convert.ToDecimal(dr["NTA"].ToString() == "" ? "0" : Convert.ToString(dr["NTA"]));
                        agentGrossWt += Convert.ToDecimal(dr["GrossWeight"].ToString() == "" ? "0" : Convert.ToString(dr["GrossWeight"]));
                        agentFreightPP += Convert.ToDecimal(dr["FreightPP"].ToString() == "" ? "0" : Convert.ToString(dr["FreightPP"]));
                        //agentFreightCC += Convert.ToDecimal(dr["FreightCC"].ToString() == "" ? "0" : Convert.ToString(dr["FreightCC"]));
                        //agentCommission += Convert.ToDecimal(dr["GSACommission"].ToString() == "" ? "0" : Convert.ToString(dr["NTA"]));
                        agentChWt += Convert.ToDecimal(dr["ChargeableWeight"].ToString() == "" ? "0" : Convert.ToString(dr["ChargeableWeight"]));
                        agentCC += Convert.ToDecimal(dr["ValuationCharges"].ToString() == "" ? "0" : Convert.ToString(dr["ValuationCharges"]));


                        CNP +=  Convert.ToDecimal(dr["NTA"].ToString() == "" ? "0" : string.Format("{0:#,0.00}", Convert.ToString(dr["NTA"])));
                        CGrossWt += Convert.ToDecimal(dr["GrossWeight"].ToString() == "" ? "0" : Convert.ToString(dr["GrossWeight"]));
                        CFreightPP += Convert.ToDecimal(dr["FreightPP"].ToString() == "" ? "0" : string.Format("{0:#,0.00}", Convert.ToString(dr["FreightPP"])));
                        //CFreightCC += Convert.ToDecimal(dr["FreightCC"].ToString() == "" ? "0" : Convert.ToString(dr["FreightCC"]));
                        //CCommission += Convert.ToDecimal(dr["GSACommission"].ToString() == "" ? "0" : Convert.ToString(dr["NTA"]));
                        CChWt += Convert.ToDecimal(dr["ChargeableWeight"].ToString() == "" ? "0" : Convert.ToString(dr["ChargeableWeight"]));
                        CCC += Convert.ToDecimal(dr["ValuationCharges"].ToString() == "" ? "0" : Convert.ToString(dr["ValuationCharges"]));

                    }
                    sumNP +=  officeNP;
                    sumGrossWt += officeGrossWt;
                    sumFreightPP += officeFreightPP;
                    sumFreightCC += officeFreightCC;
                    sumCommission += officeCommission;
                    sumChWt += officeChWt;
                    sumCC += officeCC;
                    //Add currency total
                    strAnyTimeCSR.Append("<tr><td colspan='7' class='grdRowFixedCSR'><b>Currency : Sub Total for  " + Currency + "</b></td>");
                    strAnyTimeCSR.Append("<td class='grdRowFixedCSR'><b>" + CGrossWt + "</b></td>");
                    strAnyTimeCSR.Append("<td class='grdRowFixedCSR'><b>" + CChWt + "</b></td>");
                    strAnyTimeCSR.Append("<td colspan='3' class='grdRowFixedCSR'><b>&nbsp;</b></td>");
                    strAnyTimeCSR.Append("<td class='grdRowFixedCSR'><b>" + CCC + "</b></td>");
                    strAnyTimeCSR.Append("<td colspan='5' class='grdRowFixedCSR'><b>&nbsp;</b></td>");
                    strAnyTimeCSR.Append("<td class='grdRowFixedCSR'></td>");
                    strAnyTimeCSR.Append("<td class='grdRowFixedCSR'><span style='font-weight:bold;' currformat='currformat'>" + string.Format("{0:#,0.00}", CFreightPP) + "</span></td>");
                   
                    strAnyTimeCSR.Append("<td class='grdRowFixedCSR'><span style='font-weight:bold;' currformat='currformat'>" + string.Format("{0:#,0.00}", CNP) + "</span></td>");
                    strAnyTimeCSR.Append("<td colspan='3' class='grdRowFixedCSR'><b>&nbsp;</b></td></tr>");


                    //Add Agent total
                    strAnyTimeCSR.Append("<tr><td colspan='7' class='grdRowFixedCSR'><b>Agent : Sub Total for  " + agentName + "</b></td>");
                    strAnyTimeCSR.Append("<td class='grdRowFixedCSR'><b>" + agentGrossWt + "</b></td>");
                    strAnyTimeCSR.Append("<td class='grdRowFixedCSR'><b>" + agentChWt + "</b></td>");
                    strAnyTimeCSR.Append("<td colspan='3' class='grdRowFixedCSR'><b>&nbsp;</b></td>");
                    strAnyTimeCSR.Append("<td class='grdRowFixedCSR'><b>" + agentCC + "</b></td>");
                    strAnyTimeCSR.Append("<td colspan='5' class='grdRowFixedCSR'><b>&nbsp;</b></td>");
                    strAnyTimeCSR.Append("<td class='grdRowFixedCSR'></td>");
                    strAnyTimeCSR.Append("<td class='grdRowFixedCSR'><span style='font-weight:bold;' currformat='currformat'>" + string.Format("{0:#,0.00}",agentFreightPP) + "</span></td>");
                    
                    strAnyTimeCSR.Append("<td class='grdRowFixedCSR'><span style='font-weight:bold;' currformat='currformat'>" + string.Format("{0:#,0.00}", agentNP) + "</span></td>");
                    strAnyTimeCSR.Append("<td colspan='3' class='grdRowFixedCSR'><b>&nbsp;</b></td></tr>");
                    //Add office total
                    strAnyTimeCSR.Append("<tr><td colspan='7' class='grdRowFixedCSR'><b>Sub Total for  " + officeName + "</b></td>");
                    strAnyTimeCSR.Append("<td class='grdRowFixedCSR'><b>" + officeGrossWt + "</b></td>");
                    strAnyTimeCSR.Append("<td class='grdRowFixedCSR'><b>" + officeChWt + "</b></td>");
                    strAnyTimeCSR.Append("<td colspan='3' class='grdRowFixedCSR'><b>&nbsp;</b></td>");
                    strAnyTimeCSR.Append("<td class='grdRowFixedCSR'><b>" + officeCC + "</b></td>");
                    strAnyTimeCSR.Append("<td colspan='5' class='grdRowFixedCSR'><b>&nbsp;</b></td>");
                    strAnyTimeCSR.Append("<td class='grdRowFixedCSR'></td>");
                    strAnyTimeCSR.Append("<td class='grdRowFixedCSR'><span style='font-weight:bold;' currformat='currformat'>" + string.Format("{0:#,0.00}", officeFreightPP) + "</span></td>");
                   
                    strAnyTimeCSR.Append("<td class='grdRowFixedCSR'><span style='font-weight:bold;' currformat='currformat'>" + string.Format("{0:#,0.00}", officeNP) + "</span></td>");
                    strAnyTimeCSR.Append("<td colspan='3' class='grdRowFixedCSR'><b>&nbsp;</b></td></tr>");

                    strAnyTimeCSR.Append("<tr><td colspan='7' class='grdRowFixedCSR'><b>Gross Total</b></td>");
                    strAnyTimeCSR.Append("<td class='grdRowFixedCSR'><b>" + sumGrossWt + "</b></td>");
                    strAnyTimeCSR.Append("<td class='grdRowFixedCSR'><b>" + sumChWt + "</b></td>");
                    strAnyTimeCSR.Append("<td colspan='3' class='grdRowFixedCSR'><b>&nbsp;</b></td>");
                    strAnyTimeCSR.Append("<td class='grdRowFixedCSR'><b>" + sumCC + "</b></td>");
                    strAnyTimeCSR.Append("<td colspan='5' class='grdRowFixedCSR'><b>&nbsp;</b></td>");
                    strAnyTimeCSR.Append("<td class='grdRowFixedCSR'></td>");
                    strAnyTimeCSR.Append("<td class='grdRowFixedCSR'><span style='font-weight:bold;' currformat='currformat'>" + string.Format("{0:#,0.00}", sumFreightPP) + "</span></td>");
                    
                    strAnyTimeCSR.Append("<td class='grdRowFixedCSR'><span style='font-weight:bold;' currformat='currformat'>" + string.Format("{0:#,0.00}", sumNP) + "</span></td>");
                    strAnyTimeCSR.Append("<td colspan='3' class='grdRowFixedCSR'><b>&nbsp;</b></td></tr>");
                    strAnyTimeCSR.Append("<tr><td colspan='24'class='grdRowFixedCSR'>&nbsp;</td></tr>");
                    strAnyTimeCSR.Append("<tr><td colspan='24'class='grdRowFixedCSR'>&nbsp;</td></tr>");
                    strAnyTimeCSR.Append("<tr><td colspan='2'class='grdRowFixedCSR'><b>Prepared By:</b></td><td colspan='22' class='grdRowFixedCSR'>&nbsp;</td></tr>");
                    strAnyTimeCSR.Append("<tr><td colspan='2'class='grdRowFixedCSR'><b>Designation:</b></td><td colspan='22' class='grdRowFixedCSR'>&nbsp;</td></tr>");
                    strAnyTimeCSR.Append("<tr><td colspan='2'class='grdRowFixedCSR'><b>Signature:</b></td><td colspan='22' class='grdRowFixedCSR'>&nbsp;</td></tr>");
                    strAnyTimeCSR.Append("<tr><td colspan='2'class='grdRowFixedCSR'><b>Date:</b></td><td colspan='22' class='grdRowFixedCSR'>&nbsp;</td></tr>");
                    strAnyTimeCSR.Append("</table>");
                    strAnyTimeCSR.Append("</div></div>");

                }

                Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                HttpContext.Response.AddHeader("content-disposition", "attachment;filename=Report.xls");
                HttpContext.Response.Charset = String.Empty;
                HttpContext.Response.Write(strAnyTimeCSR);
                               
                ////////////////////////////////
                //dt1.Columns.Remove("OfficeSNo");
                //dt1.Columns.Remove("CitySNo");
                //dt1.Columns.Remove("AccountSNo");
                //dt1.Columns.Remove("StockStatus");
                //ConvertDSToExcel_Success(dt1, 0);

            }

            catch (Exception ex)
            {
                // do something for error
                DataSet dsError;
                System.Data.SqlClient.SqlParameter[] ParametersError = {
                                                                   new System.Data.SqlClient.SqlParameter("@ErrorMessage",ex.Message),
                                                                    new System.Data.SqlClient.SqlParameter("@ProcName","spGetAnytimeCSRRecord_Report"),
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
                Response.AddHeader("content-disposition", "attachment;filename=AnyTimeCSR_'" + date + "'.xlsx");
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