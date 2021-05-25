using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI;
using CargoFlash.Cargo.Model.Shipment;
using CargoFlash.Cargo.WebUI;
using CargoFlash.SoftwareFactory.WebUI;
using CargoFlash.SoftwareFactory.WebUI.Adapters;
using CargoFlash.SoftwareFactory.WebUI.Controls;

namespace CargoFlash.Cargo.WebUI.Shipment
{
    public class TrackingManagementWebUI : BaseWebUISecureObject
    {
        public TrackingManagementWebUI()
        {
            try
            {
                this.MyPrimaryID = "SNo";
                this.MyModuleID = "Shipment";
                this.MyAppID = "Tracking";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }
        public TrackingManagementWebUI(Page PageContext)
        {
            try
            {
                if (this.SetCurrentPageContext(PageContext))
                {
                    this.ErrorNumber = 0;
                    this.ErrorMessage = "";
                }
                this.MyPrimaryID = "SNo";
                this.MyPageName = "Default.aspx";
                this.MyModuleID = "Shipment";
                this.MyAppID = "Tracking";
            }

            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }
        /// <summary>
        /// Generate form layout
        /// </summary>
        /// <param name="DisplayMode">Identify which operation has to be performed viz(Read,Write,Update,Delete)</param>
        /// <param name="container">Control object</param>
        public StringBuilder BuildFormView(string DisplayMode, StringBuilder container)
        {
            try
            {
                using (HtmlFormAdapter htmlFormAdapter = new HtmlFormAdapter(MyModuleID))
                {
                    htmlFormAdapter.CurrentPage = this.CurrentPageContext;
                    htmlFormAdapter.HeadingColumnName = "Tracking";
                    switch (DisplayMode)
                    {

                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(CreateManageTrackingDetailsPage());
                            break;
                    }

                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            }
            return container;
        }
        public StringBuilder CreateManageTrackingDetailsPage()
        {
            var GroupSNo = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).GroupSNo;
            StringBuilder containerLocal = new StringBuilder();
            //                <li id='liCT'>Consolidated Tracking</li>
            containerLocal.Append(@"
            <div id='MainDiv'>
            <div id='ApplicationTabs'>
                <ul>
                    <li id='liCT' onclick='javascript:onclickliCT() ;'>Consolidated History</li>
                    <li  id='liPT'>Process History</li>
                    <li id='liET' onclick='javascript:onclickliET() ;'>EDI Message History</li>

                    <li id='liFT' onclick='javascript:onclickliFT() ;'>Flight History</li>
                    <li id='liFT'>ULD History</li>
                    <li id='liFT'>PO Mail History</li>
                </ul>");


            //-------------------------Third DIV---------------------------------------------------------------------------------------------------------------

            //if (this.FormAction.ToString().ToUpper().Trim() == "INDEXVIEW")
            //{
                containerLocal.Append("<div id='divTab3' ><span id='spnCT'><input id='hdnOfficeCommisionSNo' name='hdnOfficeCommisionSNo' type='hidden' value='" + this.MyRecordID + "'/>");

                containerLocal.Append("<table class='WebFormTable'>");
                containerLocal.Append("<tr><td class='formSection' colspan='6'>Consolidated History</td>");


                containerLocal.Append("<tr><td colspan='6'><span><b>&nbsp; Based On </b><input type='radio' tabindex='1' data-radioval='Yes' class='' name='BasedOn' checked='True' id='BasedOn' value='0'>AWB No<input type='radio' tabindex='1' data-radioval='No' class='' name='BasedOn' id='BasedOn' value='1'>Reference Number</span>&nbsp;&nbsp;&nbsp;&nbsp;<span id='spnConAWBPrefix'><input id='Text_ConAWBPrefix' name='Text_ConAWBPrefix' tabindex='2'  placeholder='Prefix' controltype='autocomplete' data-valid='maxlength[3],minlength[3],required' type='text' style='width: 75px; text-transform: uppercase;' data-role='autocomplete' autocomplete='off'><input type='hidden' name='ConAWBPrefix' id='ConAWBPrefix' value=''></span>&nbsp;&nbsp;<span id='awbno'><input id='Text_ConAWB' name='Text_ConAWB' tabindex='3'  placeholder='Awb Number' controltype='text' data-valid='maxlength[8],minlength[8],required' type='text' style='width: 100px; text-transform: uppercase;' data-role='autocomplete' autocomplete='off'><input type='hidden' name='ConAWB' id='ConAWB' value=''></span><span id='RefNo'><input id='Text_ConRef' name='Text_ConRef' tabindex='3'  placeholder='Reference Number' controltype='text' data-valid='maxlength[17],minlength[17]' type='text' style='width: 150px; text-transform: uppercase;' data-role='autocomplete' autocomplete='off'><input type='hidden' name='ConRef' id='ConRef' value=''></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type='button' value='Track' text='ConsolidateTrack' class='btn btn-success' onClick='ConsolidateTrack()' id='btnConsolidateTrack'>&nbsp;&nbsp;&nbsp;&nbsp;<input type='button'  class='btn btn-success' id='btnprint' onclick='printConsolidate()' name='Print' value='Print'/></td>");


                containerLocal.Append("</tr></table>");
                containerLocal.Append("<div id='divConTracking' style='width:100%'></div>");
                containerLocal.Append("<div id='divConTrackingTrans' style='width:100%'></div>");
                containerLocal.Append("</span></div>");
        //}



            containerLocal.Append("<div id='divTab1'> ");
            containerLocal.Append("<span id='spnPT'>");
            // containerLocal.Append(container);

            containerLocal.Append("<input id='hdnSNo' name='hdnSNo' type='hidden' value='" + this.MyRecordID + "'/>");
            containerLocal.Append("<input id='hdnGroupSNo' name='hdnGroupSNo' type='hidden' value='" + GroupSNo + "'/>");
            containerLocal.Append("<table class='WebFormTable'>");
            containerLocal.Append("<tr><td class='formSection' colspan='6'>Process History</td>");
            containerLocal.Append("<tr><td colspan='6' class='formInputcolumn'><input type='radio' id='rblTrackingAWB' name='TrackingHistoryAWB' value='0' /><input type='radio' id='rblHistoryAWB' name='TrackingHistoryAWB' value='1' checked='checked' /><span>History</span></td>");
            containerLocal.Append("<tr><td colspan='6' class='formInputcolumn'><input type='radio' id='rblAirWaybill' name='ProcesTrackType' value='0' checked='checked' onclick='CheckAWBRadio(\"ProcesTrackType\");' /><span>Air Waybill</span><input type='radio' id='rblSLI' name='ProcesTrackType' value='1' onclick='CheckAWBRadio(\"ProcesTrackType\");' /> <span> Lot No</span>&nbsp;&nbsp;&nbsp;&nbsp;<span id='spnAWBPrefix'><input type='text' class='k - input' name='Text_AWBPrefix' id='Text_AWBPrefix' style='width: 50px; text - transform: uppercase; ' placeholder='' allowchar='0123456789' data-valid='maxlength[3],minlength[3],required' data-valid-msg='AWB Prefix cannot be blank.Minimum 3 Characters required' tabindex='1' maxlength='3' value='' data-role='alphabettextbox'></span>&nbsp;&nbsp;<input id='Text_AWB' name='Text_AWB' tabindex='2'  placeholder='Awb number' controltype='autocomplete' data-valid='maxlength[8],minlength[8],required' type='text' style='width: 100px; text-transform: uppercase;' data-role='autocomplete' autocomplete='off'><input type='hidden' name='AWB' id='AWB' value=''>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type='button' tabindex='3' value='Track' text='ProcessTrack' class='btn btn-success' onClick='ProcessTrack()' id='btnTrack'>&nbsp;&nbsp;&nbsp;&nbsp;<input type='button'  class='btn btn-success' id='btnprint' onclick='printProcess()' name='Print' value='Print'/></td>");

            //&nbsp;&nbsp;<span>Tracking</span>
            containerLocal.Append("</tr></table>");
            containerLocal.Append("<div id='divTracking' style='width:100%'></div>");
            containerLocal.Append("<div id='divTrackingTrans' style='width:100%'></div>");
            containerLocal.Append("<div id='divChoiceOfTracking' style='width:100%'></div>");
            containerLocal.Append("</span></div>");

            //-------------------------Second DIV---------------------------------------------------------------------------------------------------------------

            //if (this.FormAction.ToString().ToUpper().Trim() == "EDI MESSAGE HISTORY")
            //{

            containerLocal.Append(@"<div id='divTab2'><span id='spnET'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/>");

                    containerLocal.Append("<table class='WebFormTable'>");
                    containerLocal.Append("<tr><td class='formSection' colspan='6'>EDI Message History</td>");

                    containerLocal.Append("<tr><td colspan='6'><span>Air Waybill</span>&nbsp;&nbsp;&nbsp;&nbsp;<span id='spnEDIAWBPrefix'><input type='text' class='k - input' name='Text_EDIAWBPrefix' id='Text_EDIAWBPrefix' style='width: 50px; text - transform: uppercase; ' placeholder='' allowchar='0123456789' data-valid='maxlength[3],minlength[3],required' data-valid-msg='AWB Prefix cannot be blank.Minimum 3 Characters required' tabindex='1' maxlength='3' value='' data-role='alphabettextbox'></span>&nbsp;&nbsp;<input id='Text_EDIAWB' name='Text_EDIAWB' tabindex='2'  placeholder='Awb Number' controltype='autocomplete' data-valid='maxlength[8],minlength[8],required' type='text' style='width: 100px; text-transform: uppercase;' data-role='autocomplete' autocomplete='off'><input type='hidden' name='EDIAWB' id='EDIAWB' value=''>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type='button' value='Track' text='EDITrack' class='btn btn-success' tabindex='3' onClick='EDITrack()' id='btnEDITrack'>&nbsp;&nbsp;&nbsp;&nbsp;<input type='button'  class='btn btn-success' id='btnprint' onclick='printEDI()' name='Print' value='Print'/></td></tr>");
                    containerLocal.Append("<tr><td colspan='6'><table id='tbltracking' style='text-align: center'><div style=height:10px' /></table><table id='tblMessageType' style='text-align: center'></table></td>");
                    containerLocal.Append("</tr></table>");
                    containerLocal.Append("<div id='divEDITracking' style='width:100%'></div>");
                    containerLocal.Append("<div id='divEDITrackingTrans' style='width:100%'></div>");
                    containerLocal.Append("</span></div>");
            //}


            //-------------------------Fourth DIV---------------------------------------------------------------------------------------------------------------
            //if (this.FormAction.ToString().ToUpper().Trim() == "FLIGHT HISTORY")
            //{
                containerLocal.Append(@"<div id='divTab4'><span id='spnFT'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/>");
                containerLocal.Append("<table class='WebFormTable'>");
                containerLocal.Append("<tr><td class='formSection' colspan='6'>Flight History</td>");
                containerLocal.Append("<tr><td colspan='6' class='formInputcolumn'><input type='radio' id='rblTrackingFlight' name='TrackingHistoryFlight' value='0' /><input type='radio' id='rblHistoryFlight' name='TrackingHistoryFlight' value='1' checked='checked' /><span>History</span></td>");
                containerLocal.Append("<tr><td colspan='6' class='formInputcolumn'><span> Flight Date.</span>&nbsp;&nbsp;<input type='text' controltype='datetype' id='txtFlightdate' onchange='SetDateRangeValue();' class='flightdatepicker' width='130px' />&nbsp;&nbsp;<span> Flight No.</span>&nbsp;&nbsp;&nbsp;&nbsp;<input type='hidden' name='FlightNo' id='FlightNo' value=''><input id='Text_FlightNo' name='Text_FlightNo'  placeholder='Flight No' controltype='autocomplete' type='text' style='width: 130px; text-transform: uppercase;' data-role='autocomplete' autocomplete='off'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type='button' value='Track' text='FlightTrack' class='btn btn-success'  onClick='FlightTrack()' id='btnFlightTrack'>&nbsp;&nbsp;&nbsp;&nbsp;<input type='button'  class='btn btn-success' id='btnprint' onclick='printFlight()' name='Print' value='Print'/><input type='button' value='Export to Excel' text='ExporttoExcel' class='btn btn-success' onClick='FlightExportToExcel()' id='btnExporttoExcel'></td></tr>");//<span> Origin Airport.</span>&nbsp;&nbsp;&nbsp;&nbsp;<input type='hidden' name='FlightOrigin' id='FlightOrigin' value=''><input id='Text_FlightOrigin' width='130px' name='Text_FlightOrigin' controltype='autocomplete' type='text' style='width: 150px; text-transform: uppercase;' data-role='autocomplete' placeholder='Origin' autocomplete='off'>&nbsp;&nbsp;<span> Destination Airport.</span>&nbsp;&nbsp;<input type='hidden' name='FlightDestination' id='FlightDestination' value=''><input id='Text_FlightDestination' width='130px' name='Text_FlightDestination' placeholder='Destination' controltype='autocomplete' type='text' style='width: 150px; text-transform: uppercase;'  data-role='autocomplete' autocomplete='off'>
                containerLocal.Append("<tr><td colspan='6'><table id='tblFtracking' style='text-align: center'><div style=height:10px' /></table><table id='tblMessageType' style='text-align: center'></table></td>");
                containerLocal.Append("</tr></table>");
                containerLocal.Append("<div id='divFlightTracking' style='width:100%'></div>");
                containerLocal.Append("<div id='divFlightTrackingTrans' style='width:100%'></div>");
                containerLocal.Append("</span></div>");
            //}
            //&nbsp;&nbsp;<span>Tracking</span>
            //-------------------------fifth DIV---------------------------------------------------------------------------------------------------------------
            //if (this.FormAction.ToString().ToUpper().Trim() == "ULD HISTORY")
            //{
                containerLocal.Append(@"<div id='divTab5'><span id='spnHT'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/>");

                containerLocal.Append("<table class='WebFormTable'>");
                containerLocal.Append("<tr><td class='formSection' colspan='6'>ULD History</td>");
                containerLocal.Append("<tr><td colspan='6' class='formInputcolumn'><input type='radio' id='rblTrackingULD' name='TrackingHistoryULD' value='0'  /><input type='radio' id='rblHistoryULD' name='TrackingHistoryULD' value='1' checked='checked' /><span>History</span></td>");
                containerLocal.Append("<tr><td colspan='6' class='formInputcolumn'><span>ULD No.</span>&nbsp;&nbsp;&nbsp;&nbsp;<input id='Text_ULDNo' name='Text_ULDNo' tabindex='1'  placeholder='ULD Number' controltype='autocomplete' type='text' style='width: 150px; text-transform: uppercase;' data-role='autocomplete' autocomplete='off'><input type='hidden' name='ULDNo' id='ULDNo' value=''></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type='button' value='Track' text='ULDTrack' class='btn btn-success' tabindex='3' onClick='ULDTrack()' id='btnULDTrack'>&nbsp;&nbsp;&nbsp;&nbsp;<input type='button'  class='btn btn-success' id='btnprint' onclick='printULD()' name='Print' value='Print'/></td></tr>");
                containerLocal.Append("<tr><td colspan='6' class='formInputcolumn'><div id='divULDTracking' style='width:100%'></div></td>");
                containerLocal.Append("<tr><td colspan='6' class='formInputcolumn'><div id='divULDTrackingTrans' style='width:100%'><table id='tblULDtracking' style='text-align: center'></table></div></td>");
                containerLocal.Append("</tr></table>");
                containerLocal.Append("</span></div>");
            //}
            //-------------------------Sixth DIV---------------------------------------------------------------------------------------------------------------

            //if (this.FormAction.ToString().ToUpper().Trim() == "PO MAIL HISTORY")
            //{
                containerLocal.Append("<div id='divTab6' ><span id='spnPO'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.MyRecordID + "'/>");

                containerLocal.Append("<table class='WebFormTable'>");
                containerLocal.Append("<tr><td class='formSection' colspan='6'>PO Mail History</td>");
                //containerLocal.Append("<tr><td colspan='6'><span><b>&nbsp; Based On </b><input type='radio' tabindex='18' data-radioval='Yes' class='' name='BasedOn' checked='True' id='BasedOn' value='0'>AWB No<input type='radio' tabindex='18' data-radioval='No' class='' name='BasedOn' id='BasedOn' value='1'>Reference Number</span>&nbsp;&nbsp;&nbsp;&nbsp;<span id='spnConAWBPrefix'><input id='Text_ConAWBPrefix' name='Text_ConAWBPrefix' tabindex='1'  placeholder='Prefix' controltype='autocomplete' data-valid='maxlength[3],minlength[3],required' type='text' style='width: 75px; text-transform: uppercase;' data-role='autocomplete' autocomplete='off'><input type='hidden' name='ConAWBPrefix' id='ConAWBPrefix' value=''></span>&nbsp;&nbsp;<span id='awbno'><input id='Text_ConAWB' name='Text_ConAWB' tabindex='2'  placeholder='Awb Number' controltype='autocomplete' data-valid='maxlength[8],minlength[8],required' type='text' style='width: 100px; text-transform: uppercase;' data-role='autocomplete' autocomplete='off'><input type='hidden' name='ConAWB' id='ConAWB' value=''></span><span id='RefNo'><input id='Text_ConRef' name='Text_ConRef' tabindex='2'  placeholder='Reference Number' controltype='autocomplete' data-valid='maxlength[17],minlength[17]' type='text' style='width: 150px; text-transform: uppercase;' data-role='autocomplete' autocomplete='off'><input type='hidden' name='ConRef' id='ConRef' value=''></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type='button' value='Track' text='ConsolidateTrack' class='btn btn-success' onClick='ConsolidateTrack()' id='btnConsolidateTrack'>&nbsp;&nbsp;&nbsp;&nbsp;<input type='button'  class='btn btn-success' id='btnprint' onclick='printConsolidate()' name='Print' value='Print'/></td>");
                containerLocal.Append("<tr><td colspan='6' class='formInputcolumn'><span>PO Mail No.</span>&nbsp;&nbsp;&nbsp;&nbsp;<input id='Text_POMailPrefix' name='Text_POMailPrefix' tabindex='1'  placeholder='Prefix' controltype='autocomplete' data-valid='maxlength[4],minlength[4],required' type='text' style='width: 75px; text-transform: uppercase;' data-role='autocomplete' autocomplete='off'><input type='hidden' name='POMailPrefix' id='POMailPrefix' value=''><input id='Text_POMailNo' name='Text_POMailNo' tabindex='2'  placeholder='POMail Number' controltype='text' type='text' style='width: 150px; text-transform: uppercase;' data-role='autocomplete' autocomplete='off'><input type='hidden' name='POMailNo' id='POMailNo' value=''></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type='button' value='Track' text='POMailTrack' class='btn btn-success' tabindex='3' onClick='ConsolidatePOMailTrack()' id='btnPOMailTrack'>&nbsp;&nbsp;&nbsp;&nbsp;<input type='button'  class='btn btn-success' id='btnprint' tabindex='4' onclick='printPOMail()' name='Print' value='Print'/></td>");
                containerLocal.Append("</tr></table>");
                containerLocal.Append("<div id='divPOTracking' style='width:100%'></div>");
                containerLocal.Append("<div id='divPOTrackingTrans' style='width:100%'></div>");
                containerLocal.Append("</span></div>");
            //}
            containerLocal.Append("<div id='divTab1'> ");
            containerLocal.Append("<span id='spnPO'>");
            // containerLocal.Append(container);

            containerLocal.Append("<input id='hdnPOSNo' name='hdnPOSNo' type='hidden' value='" + this.MyRecordID + "'/>");
            containerLocal.Append("<input id='hdnPOGroupSNo' name='hdnPOGroupSNo' type='hidden' value='" + GroupSNo + "'/>");
            containerLocal.Append("<table class='WebFormTable'>");
            containerLocal.Append("<tr><td class='formSection' colspan='6'>Process History</td>");
            //containerLocal.Append("<tr><td colspan='6' class='formInputcolumn'><input type='radio' id='rblTrackingAWB' name='TrackingHistoryAWB' value='0' /><input type='radio' id='rblHistoryAWB' name='TrackingHistoryAWB' value='1' checked='checked' /><span>History</span></td>");
            //containerLocal.Append("<tr><td colspan='6' class='formInputcolumn'><input type='radio' id='rblAirWaybill' name='ProcesTrackType' value='0' checked='checked' onclick='CheckAWBRadio(\"ProcesTrackType\");' /><span>Air Waybill</span><input type='radio' id='rblSLI' name='ProcesTrackType' value='1' onclick='CheckAWBRadio(\"ProcesTrackType\");' /> <span> Lot No</span>&nbsp;&nbsp;&nbsp;&nbsp;<span id='spnAWBPrefix'><input type='text' class='k - input' name='Text_AWBPrefix' id='Text_AWBPrefix' style='width: 50px; text - transform: uppercase; ' placeholder='' allowchar='0123456789' data-valid='maxlength[3],minlength[3],required' data-valid-msg='AWB Prefix cannot be blank.Minimum 3 Characters required' tabindex='1' maxlength='3' value='' data-role='alphabettextbox'></span>&nbsp;&nbsp;<input id='Text_AWB' name='Text_AWB' tabindex='2'  placeholder='Awb number' controltype='autocomplete' data-valid='maxlength[8],minlength[8],required' type='text' style='width: 100px; text-transform: uppercase;' data-role='autocomplete' autocomplete='off'><input type='hidden' name='AWB' id='AWB' value=''>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type='button' tabindex='3' value='Track' text='ProcessTrack' class='btn btn-success' onClick='ProcessTrack()' id='btnTrack'>&nbsp;&nbsp;&nbsp;&nbsp;<input type='button'  class='btn btn-success' id='btnprint' onclick='printProcess()' name='Print' value='Print'/></td>");

            //&nbsp;&nbsp;<span>Tracking</span>
            containerLocal.Append("</tr></table>");
            containerLocal.Append("<div id='divPOTracking' style='width:100%'></div>");
            containerLocal.Append("<div id='divPOTrackingTrans' style='width:100%'></div>");
            containerLocal.Append("<div id='divPOChoiceOfTracking' style='width:100%'></div>");
            containerLocal.Append("</span></div>");
            //containerLocal.Append(@"<div id='divTab6'><span id='spnPT'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/>");

            //containerLocal.Append("<table class='WebFormTable'>");
            //containerLocal.Append("<tr><td class='formSection' colspan='6'>POMail History</td>");
            ////containerLocal.Append("<tr><td colspan='6' class='formInputcolumn'><input type='radio' id='rblTrackingPOMail' name='TrackingHistoryPOMail' value='0'  /><input type='radio' id='rblHistoryPOMail' name='TrackingHistoryPOmail' value='1' checked='checked' /><span>History</span></td>");
            //containerLocal.Append("<tr><td colspan='6' class='formInputcolumn'><span>POMail No.</span>&nbsp;&nbsp;&nbsp;&nbsp;<input id='Text_POMailNo' name='Text_POMailNo' tabindex='1'  placeholder='POMail Number' controltype='autocomplete' type='text' style='width: 150px; text-transform: uppercase;' data-role='autocomplete' autocomplete='off'><input type='hidden' name='POMailNo' id='POMailNo' value=''></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type='button' value='Track' text='POMailTrack' class='btn btn-success' tabindex='3' onClick='ConsolidatePOMailTrack()' id='btnPOMailTrack'>&nbsp;&nbsp;&nbsp;&nbsp;<input type='button'  class='btn btn-success' id='btnprint' onclick='printPOMail()' name='Print' value='Print'/></td></tr>");
            //containerLocal.Append("<tr><td colspan='6' class='formInputcolumn'><div id='divPOMailTracking' style='width:100%'></div></td>");
            //containerLocal.Append("<tr><td colspan='6' class='formInputcolumn'><div id='divPOMailTrackingTrans' style='width:100%'><table id='tblPOMailtracking' style='text-align: center'></table></div></td>");
            //containerLocal.Append("</tr></table>");
            //containerLocal.Append("</span></div>");
            //&nbsp;&nbsp;<span>Tracking</span>
            containerLocal.Append("</span></div></div> </div>");
            return containerLocal;


        }
        /// <summary>
        /// Generate Airline web page from XML
        /// e.g from ~/HtmlForm/WebFormDefinitionAirline.xml
        /// </summary>
        /// <param name="container"></param>
        public StringBuilder CreateWebForm(StringBuilder container)
        {
            StringBuilder strContent = new StringBuilder();
            try
            {
                // if (System.Web.HttpContext.Current.Request.QueryString["FormAction"] != null)
                {
                    //Set the display Mode form the URL QuesyString.
                    this.DisplayMode = "FORMACTION." + "NEW";
                    //Match the display Mode of the form.
                    switch (this.DisplayMode)
                    {
                        case DisplayModeNew:
                            strContent = BuildFormView(this.DisplayMode, container);
                            break;
                        default:
                            break;

                    }
                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            }
            return strContent;
        }
    }
}
