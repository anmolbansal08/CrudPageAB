using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI;
using CargoFlash.Cargo.Model.Stock;
using CargoFlash.Cargo.WebUI;
using CargoFlash.SoftwareFactory.WebUI;
using CargoFlash.SoftwareFactory.WebUI.Adapters;
using CargoFlash.SoftwareFactory.WebUI.Controls;

namespace CargoFlash.Cargo.WebUI.Stock
{
    public class StockAWBManagementWebUI : BaseWebUISecureObject
    {
        public object GetRecordStockManagement()
        {
            object ConnectionType = null;
            try
            {
                if (!string.IsNullOrEmpty(HttpContext.Current.Request.QueryString["RecID"]))
                {
                    StockManagement StockManagementList = new StockManagement();
                    object obj = (object)StockManagementList;
                    //retrieve Entity from Database according to the record
                    ConnectionType = DataGetRecordService(HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID);
                    this.MyRecordID = (HttpContext.Current.Request.QueryString["RecID"]);
                }
                else
                {
                    //Error Messgae: Record not found.
                }

            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            } return ConnectionType;
        }
        public StockAWBManagementWebUI()
        {
            try
            {
                //if (this.SetCurrentPageContext(PageContext))
                //{
                //    this.ErrorNumber = 0;
                //    this.ErrorMessage = "";
                //}
                //   this.MyPageName = "Default.aspx";
                this.MyPrimaryID = "SNo";
                this.MyModuleID = "Stock";
                this.MyAppID = "StockAWB";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }
        // <summary>
        // Set context of the page(Form) i.e. bind Module ID,App ID
        // </summary>
        // <param name="PageContext"></param>
        public StockAWBManagementWebUI(Page PageContext)
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
                this.MyModuleID = "Stock";
                this.MyAppID = "StockAWB";
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
                    htmlFormAdapter.HeadingColumnName = "ConnectionTypeName";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.objFormData = GetRecordStockManagement();
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            container.Append(CreateStockManagementDetailsPage(htmlFormAdapter.InstantiateIn()));
                            break;
                        //    case DisplayModeDuplicate:
                        //        htmlFormAdapter.objFormData = GetRecordConnectionType();
                        //        htmlFormAdapter.DisplayMode = DisplayModeType.New;
                        //        htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                        //        container.Append(htmlFormAdapter.InstantiateIn());
                        //        break;
                        case DisplayModeEdit:
                            htmlFormAdapter.objFormData = GetRecordStockManagement();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(CreateStockManagementDetailsPage(htmlFormAdapter.InstantiateIn()));
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(CreateStockManagementDetailsPage(htmlFormAdapter.InstantiateIn()));
                            break;
                        //    case DisplayModeDelete:
                        //        htmlFormAdapter.objFormData = GetRecordConnectionType();
                        //        htmlFormAdapter.DisplayMode = DisplayModeType.Delete;
                        //        htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                        //        container.Append(htmlFormAdapter.InstantiateIn());
                        //        break;
                        //    default:
                        //        break;
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
        public StringBuilder CreateStockManagementDetailsPage(StringBuilder container)
        {
            var GroupSNo = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).GroupSNo;
            StringBuilder containerLocal = new StringBuilder();
            containerLocal.Append(@"
        <div id='MainDiv'>
        <div id='ApplicationTabs'>
            <ul>
                <li  id='lioffice' class='k-state-active'>Create Stock</li>
                <li id='liOfficeAirline'>Issue Stock To Office</li>
                <li id='liOfficeCommision'>Issue Stock To Forwarder (Agent)</li>
                              
            </ul>
            <div id='divTab1'> 
              <span id='spnOfficeInformation'>");
            containerLocal.Append(container);

            containerLocal.Append("<input id='hdnSNo' name='hdnSNo' type='hidden' value='" + this.MyRecordID + "'/>");
            containerLocal.Append("<input id='hdnGroupSNo' name='hdnGroupSNo' type='hidden' value='" + GroupSNo + "'/>");
            containerLocal.Append("<table class='WebFormTable'><tr><td class'formActiontitle'><input type='button' value='Generate' text='Generate' class='btn btn-success' onClick='GenerateStock()' id='btnGenerate'> <input type='button' name='btnReset' value='Reset' onclick='ResetStock();' id='btnReset' tabindex='8' class='btn btn-success' title='Reset'> </td></tr></table>");

            containerLocal.Append("<div id='StockCreated' style='width:100%'><fieldset><legend>Created Stock Information</legend>");
            containerLocal.Append("<table width='100%'> <tbody><tr><td class='tdSpace' colspan='4'></td></tr>");
            containerLocal.Append("<tr><td colspan='4'>");

            containerLocal.Append("<table  style='border: solid 1px gray;' class='appendGrid ui-widget'><tbody><tr class='ui-widget-header'>");
            containerLocal.Append("<td id='tdTotalGeneratedAWBNo' width='250px' style='text-align: center; height: 20px;' class='ui-state-active caption'>Generated Total AWBNo [<span id='lblTotalGeneratedAWBNo'></span>]</td>");
            //containerLocal.Append("<td width='50px' class='ui-state-active caption'></td>");
            containerLocal.Append("<td id='tdExistStock' width='250px' style='text-align: center;' class='ui-state-active caption'>Stock Already Created [<span id='lblExistStock'></span>]</td>");
            containerLocal.Append("<td id='tdTotalCreatedAWB' style='text-align: center;' width='250px' class='ui-state-active caption'>Created Stock [<span id='lblTotalCreatedStock'></span>]</td>");
            containerLocal.Append("</tr>");

            containerLocal.Append("<tr><td class='tdSpace' colspan='5'></td></tr>");
            containerLocal.Append("<tr><td id='tdlCreatedstock'style='text-align: center;'><select multiple='multiple' size='4' name='lstCreatedstock' id='lstCreatedstock' tabindex='8' class='formInputcolumn' title='Created stock' style='height:125px;width:120px;'></select></td>");
            //containerLocal.Append("<td width='50px' style='text-align: center;'><table><tr><td><input type='button' name='btnFor' id='btnFor' value='>>' class='btn btn-danger' onclick='ForwardAllStock();' title='Move All'></td></tr><tr><td><input type='button' title='Move Selected' name='btnForAll' id='btnForAll' value='>' class='btn btn-danger' onclick='ForwardStock();'></td></tr><tr><td><input type='button' name='btnRev' title='Move Selected' id='btnRev' onclick='ReverseStock();' value='<' class='btn btn-danger'></td></tr><tr><td><input type='button' title='Move All' name='btnRevAll' id='btnRevAll' value='<<' class='btn btn-danger' onclick='ReverseAllStock();'></td></tr></table></td>");
            containerLocal.Append("<td id='tdlExistStock'style='text-align: center;'><select size='4' name='lstExistStock' id='lstExistStock' tabindex='9' class='formInputcolumn' title='Exist Stock' style='height:125px;width:120px;'></select></td>");
            containerLocal.Append("<td  td id='tdlstTotalCreatedStock' style='text-align: center;'><select size='4' name='lstTotalCreatedStock' id='lstTotalCreatedStock' tabindex='10' class='formInputcolumn' title='Total Created Stock' style='height:125px;width:120px;'></select></td>");

            containerLocal.Append(" </tr></tbody></table><div id='pnlAddStock' style='width:100%'>");
            containerLocal.Append("<table class='grdTable'><tbody><tr><td class='tdSpace'></td></tr>");
            containerLocal.Append("<tr><td class='toolbar'><input type='button' name='btnCreateStock' value='Create Stock' onclick='CreateStock();' id='btnCreateStock' tabindex='13' class='btn btn-success' title='Create Stock'></td></tr>");
            containerLocal.Append("</tbody></table></div></td>");
            containerLocal.Append("</tr></tbody></table>");
            containerLocal.Append("</td></tr></tbody></table>");
            containerLocal.Append("</fieldset></div></span></div>");

            //-------------------------Second DIV---------------------------------------------------------------------------------------------------------------
            containerLocal.Append(@"<div id='divTab2'><span id='spnOfficeAirlineTrans'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/>");

            containerLocal.Append(@"<div id='IssueStock' style='width:100%'><fieldset><legend>Issue Stock To Office</legend>");
            containerLocal.Append("<table width='100%' class='WebFormTable' id='tblIssueStock'> <tbody><tr><td class='tdSpace' colspan='4'></td></tr>");
            containerLocal.Append("<tr><td class='formlabel'><font color='red'>*</font> City Code</td><td class='formInputcolumn'><input type='hidden' id='City' name='City'><input type='text' name='Text_City' id='Text_City' tabindex='7' data-role='autocomplete' controltype='autocomplete' data-valid='required' data-valid-msg='City can not be blank'></td>");
            containerLocal.Append("<td class='formlabel'><font color='red'>*</font> Office Name</td><td class='formInputcolumn'><input type='hidden' id='Office' name='Office'>  <input type='text' name='Text_Office' id='Text_Office' tabindex='8' data-role='autocomplete' controltype='autocomplete' data-valid='required' data-valid-msg='Office Name can not be blank'></td></tr>");
            //containerLocal.Append("<td class='formlabel'><font color='red'>*</font> No. of AWB</td><td class='formInputcolumn'><input onblur='GetMaxIssueAWB(this)' type='text' class='k-input k-state-default' name='IssueAWB' id='IssueAWB' style='width: 30px; text-align: right; display: none;' controltype='range' data-valid='required' data-valid-msg='No of AWB can not be blank' tabindex='5' maxlength='3' value='' data-role='numerictextbox'></td>");
            containerLocal.Append("<tr><td class='formlabel'>Remarks</td><td class='formInputcolumn'><textarea class='k-input' name='Remarks' id='Remarks' style='width: 150px; text-transform: none;' controltype='alphanumeric' allowchar='/-,' tabindex='8' maxlength='500' data-role='alphabettextbox' autocomplete='off'></textarea></td><td class='formlabel'></td><td class='formInputcolumn'></td></tr>");

            containerLocal.Append("</tbody></table>");
            containerLocal.Append("</fieldset></div> ");

            containerLocal.Append("<div id='OfficeStockCreated' style='width:100%'><fieldset><legend>Created Stock Information</legend>");
            containerLocal.Append("<table width='100%'> <tbody><tr><td class='tdSpace' colspan='4'></td></tr>");
            containerLocal.Append("<tr><td colspan='4'>");
            containerLocal.Append("<table  style='border: solid 1px gray;' class='appendGrid ui-widget'><tbody><tr class='ui-widget-header'>");
            containerLocal.Append("<td id='tdTotalCreatedAWB' style='text-align: center;' width='250px' class='ui-state-active caption'>Available Stock [<span id='lblOfficeCreatedStock'></span>]</td>");
            containerLocal.Append("<td width='50px' class='ui-state-active caption'></td>");
            containerLocal.Append("<td id='tdTotalCreatedAWB' style='text-align: center;' width='250px' class='ui-state-active caption'>Issue Stock [<span id='lblIssue-To-Office'></span>]</td>");
            containerLocal.Append("<td id='tdExistStock' width='250px' style='text-align: center;' class='ui-state-active caption'>Already Issued Office Stock [<span id='lblOfficeExistStock'></span>]</td>");
            containerLocal.Append("<td id='tdTotalIssueAWB' width='250px' style='text-align: center; height: 20px;' class='ui-state-active caption'>Issued Office Stock [<span id='lblIssueStockOffice'></span>]</td>");

            containerLocal.Append("</tr>");
            containerLocal.Append("<tr><td class='tdSpace' colspan='5'></td></tr>");
            containerLocal.Append("<tr><td id='tdlCreatedstock'style='text-align: center;'><select size='4' name='lstOfficeCreatedstock' id='lstOfficeCreatedstock' tabindex='8' class='formInputcolumn' title='Created stock' multiple='multiple' style='height:125px;width:120px;'></select></td>");
            containerLocal.Append("<td width='50px' style='text-align: center;'><table><tr><td><input type='button' name='btnFor' id='btnFor' value='>>' class='btn btn-danger' onclick='ForwardAllStock();' title='Move All'></td></tr><tr><td><input type='button' title='Move Selected' name='btnForAll' id='btnForAll' value='>' class='btn btn-danger' onclick='ForwardStock();'></td></tr><tr><td><input type='button' name='btnRev' title='Move Selected' id='btnRev' onclick='ReverseStock();' value='<' class='btn btn-danger'></td></tr><tr><td><input type='button' title='Move All' name='btnRevAll' id='btnRevAll' value='<<' class='btn btn-danger' onclick='ReverseAllStock();'></td></tr></table></td>");
            containerLocal.Append("<td id='tdlCreatedstock'style='text-align: center;'><select size='4' name='lstIssue-To-Office' id='lstIssue-To-Office' tabindex='8' class='formInputcolumn' title='Created stock' multiple='multiple' style='height:125px;width:120px;'></select></td>");
            containerLocal.Append("<td id='tdlExistStock'style='text-align: center;'><select size='4' name='lstOfficeExistStock' id='lstOfficeExistStock' tabindex='9' class='formInputcolumn' title='Exist Stock' style='height:125px;width:120px;'></select></td>");
            containerLocal.Append("<td style='text-align: center;'><select size='4' name='lstIssueStockOffice' id='lstIssueStockOffice' tabindex='11' class='selectDropDownList' title='Office Stock' style='height:125px;width:120px;'></select></td>");

            containerLocal.Append(" </tr></tbody></table></td>");
            containerLocal.Append("</tr></tbody></table></td></tr>");
            containerLocal.Append("<tr><td class'formactiontitle' colspan='4'><input type='button' name='btnIssueStock' value='Issue Stock to Office' onclick='IssueStock();' id='btnIssueStock' tabindex='10' class='btn btn-info' title='Issue Stock'><input type='button' value='Back' onclick=\"navigateUrl('Default.cshtml?Module=Stock&amp;Apps=StockAWB&amp;FormAction=INDEXVIEW');\" class='btn btn-inverse'>");
            containerLocal.Append("</td></tr>");
            containerLocal.Append("</tbody></table>");
            containerLocal.Append("</fieldset></div>");



            containerLocal.Append("</span></div>");

            //-------------------------Third DIV---------------------------------------------------------------------------------------------------------------

            containerLocal.Append("<div id='divTab3' ><span id='spnOfficeCommision'><input id='hdnOfficeCommisionSNo' name='hdnOfficeCommisionSNo' type='hidden' value='" + this.MyRecordID + "'/>");

            containerLocal.Append(@"<div id='divGetIssuedOfficeStock' style='width:100%'><fieldset><legend>Get Stock</legend>");
            containerLocal.Append("<table width='100%' class='WebFormTable'> <tbody><tr><td class='tdSpace' colspan='4'></td></tr>");
            containerLocal.Append("<tr><td class='formlabel'><font color='red'>*</font> City Code</td><td class='formInputcolumn'><input type='hidden' id='GSACity' name='GSACity'><input type='text' name='Text_GSACity' id='Text_GSACity' tabindex='7' data-role='autocomplete' controltype='autocomplete' data-valid='required' data-valid-msg='City can not be blank'></td>");
            containerLocal.Append("<td class='formlabel'><font color='red'>*</font> Office Name</td><td class='formInputcolumn'><input type='hidden' id='GSAOffice' name='GSAOffice'>  <input type='text' name='Text_GSAOffice' id='Text_GSAOffice' tabindex='8' data-role='autocomplete' controltype='autocomplete' data-valid='required' data-valid-msg='Office Name can not be blank'></td></tr>");

            //containerLocal.Append(@"<tr><td class='formlabel'><font color='red'>*</font> AWB Type</td><td class='formInputcolumn'>"+
            //    //"<input type='radio' tabindex='2' class='' name='GSAAWBType' checked='checked' id='GSAAWBType' value='1' onclick='SetAWB(this)'>IATA AWB <input type='radio' tabindex='2' class='' name='GSAAWBType' id='GSAAWBType' value='2' onclick='SetAWB(this)'>Courier <input type='radio' tabindex='2' class='' name='GSAAWBType' id='GSAAWBType' value='3' data-valid='required' data-valid-msg='AWBType can not be blank' onclick='SetAWB(this)'>Mail" +
            //    "<input type='hidden' id='GSAAWBType' name='GSAAWBType'>  <input type='text' name='Text_GSAAWBType' id='Text_GSAAWBType' tabindex='8' data-role='autocomplete' controltype='autocomplete' data-valid='required' data-valid-msg='AWBType can not be blank'>" +
            //    "</td>");
            containerLocal.Append(@"<tr><td class='formlabel'><font color='red'>*</font> Stock Type</td><td class='formInputcolumn'>" +
                //"<input type='radio' tabindex='3' class='' name='GSAIsAutoAWB' checked='checked' id='GSAIsAutoAWB' value='0' onclick='SetAWB(this)'>Electronic <input type='radio' tabindex='3' class='' name='GSAIsAutoAWB' id='GSAIsAutoAWB' value='1' onclick='SetAWB(this)'>Manual <input type='radio' tabindex='3' class='' name='GSAIsAutoAWB' id='GSAIsAutoAWB' value='2' data-valid='required' data-valid-msg='AWBType can not be blank' onclick='SetAWB(this)'>Company Material"+

                "<input type='hidden' id='GSAIsAutoAWB' name='GSAIsAutoAWB'>  <input type='text' name='Text_GSAIsAutoAWB' id='Text_GSAIsAutoAWB' tabindex='8' data-role='autocomplete' controltype='autocomplete' data-valid='required' data-valid-msg=' Please select autoawb '>" +

                "</td></tr>");


            containerLocal.Append("<tr><td class'formactiontitle' colspan='4'><input type='button' name='btnGetIssueStock' value='Get Stock' onclick='GetIssueStock();' id='btnGetIssueStock' tabindex='10' class='btn btn-info' title='Issue Stock'><input type='button' name='btnResetIssueStock' value='Reset' onclick='ResetIssueStock();' id='btnResetIssueStock' tabindex='10' class='btn btn-info' title='Reset Issue Stock'>");
            containerLocal.Append("</td></tr>");
            containerLocal.Append("</tbody></table>");
            containerLocal.Append("</fieldset></div> ");
            containerLocal.Append(@"<div id='AgentIssueStock' style='width:100%'><fieldset><legend>Forwarder (Agent) Information</legend>");
            containerLocal.Append("<table width='100%' class='WebFormTable' id='tblIssueStock'> <tbody><tr><td class='tdSpace' colspan='6'></td></tr>");
            containerLocal.Append("<tr id='trAgentName'><td class='formlabel'><font color='red'>*</font>Forwarder (Agent) Name</td><td><div id='divAccount'><input type='hidden' id='Account' name='Account'><input type='text' name='Text_Account' id='Text_Account' tabindex='7' data-role='autocomplete' controltype='autocomplete' data-valid='required' data-valid-msg='Forwarder (Agent) can not be blank'</div></td>");

            containerLocal.Append("<td class='formlabel'>Auto Retrieval Date</td><td class='formInputcolumn'><input type='text' controltype='datetype'  name='AutoRetrievalDate'  id='AutoRetrievalDate' width=90px; value='" + string.Format("{0:dd-MMM-yyyy }", DateTime.Now.AddMonths(1)) + "' /></td></tr>");

            containerLocal.Append("<td class='formlabel'>Remarks</td><td class='formInputcolumn'><textarea class='k-input' name='AgentRemarks' id='AgentRemarks' style='width: 150px; text-transform: none;' controltype='alphanumeric' allowchar='/-,' tabindex='23' maxlength='500' data-role='alphabettextbox' autocomplete='off'></textarea></td></tr>");
            //containerLocal.Append("<td class='formlabel'><font color='red'>*</font> No. of AWB</td><td class='formInputcolumn'><input onblur='GetMaxIssueAWB(this)' type='text' class='k-input k-state-default' name='IssueAgentAWB' id='IssueAgentAWB' style='width: 30px; text-align: right; display: none;' controltype='range' data-valid='required' data-valid-msg='No of AWB can not be blank' tabindex='5' maxlength='3' value='' data-role='numerictextbox'></td>");
            containerLocal.Append("</tbody></table>");
            containerLocal.Append("</fieldset></div> ");

            containerLocal.Append("<div id='AgentStockCreated' style='width:100%'><fieldset><legend>Stock Information</legend>");
            containerLocal.Append("<table width='100%'> <tbody><tr><td class='tdSpace' colspan='4'></td></tr>");
            containerLocal.Append("<tr><td colspan='4'>");
            containerLocal.Append("<table  style='border: solid 1px gray;' class='appendGrid ui-widget'><tbody><tr class='ui-widget-header'>");

            containerLocal.Append("<td id='tdTotalIssueAWB' width='250px' style='text-align: center; height: 20px;' class='ui-state-active caption'>Available Stock [<span id='lblIssuedOfficeStock'></span>]</td>");
            containerLocal.Append("<td width='50px' class='ui-state-active caption'></td>");
            containerLocal.Append("<td id='tdTotalCreatedAWB' style='text-align: center;' width='250px' class='ui-state-active caption'>Issue Stock [<span id='lblIssue-To-Agent'></span>]</td>");
            containerLocal.Append("<td id='tdExistStock' width='250px' style='text-align: center;' class='ui-state-active caption'>Already Issued Forwarder (Agent) Stock [<span id='lblAgentExistStock'></span>]</td>");
            containerLocal.Append("<td id='tdTotalIssueAWBtoAgent' width='250px' style='text-align: center; height: 20px;' class='ui-state-active caption' >Issued Forwarder (Agent) Stock [<span id='lblIssueStockAgent'></span>]</td>");

            containerLocal.Append("</tr>");
            containerLocal.Append("<tr><td class='tdSpace' colspan='5'></td></tr>");
            containerLocal.Append("<tr><td id='tdlCreatedstock'style='text-align: center;'><select multiple='multiple' size='4' name='lstIssuedOfficeStock' id='lstIssuedOfficeStock' tabindex='8' class='formInputcolumn' title='Created stock' style='height:125px;width:120px;'></select></td>");
            containerLocal.Append("<td width='50px' style='text-align: center;'><table><tr><td><input type='button' name='btnForAgent' id='btnForAgent' value='>>' class='btn btn-danger' onclick='ForwardAllStockAgent();' title='Move All'></td></tr><tr><td><input type='button' title='Move Selected' name='btnForAllAgent' id='btnForAllAgent' value='>' class='btn btn-danger' onclick='ForwardStockAgent();'></td></tr><tr><td><input type='button' name='btnRevAgent' title='Move Selected' id='btnRevAgent' onclick='ReverseStockAgent();' value='<' class='btn btn-danger'></td></tr><tr><td><input type='button' title='Move All' name='btnRevAllAgent' id='btnRevAllAgent' value='<<' class='btn btn-danger' onclick='ReverseAllStockAgent();'></td></tr></table></td>");
            containerLocal.Append("<td id='tdlCreatedstock'style='text-align: center;'><select size='4' name='lstIssue-To-Agent' id='lstIssue-To-Agent' tabindex='8' class='formInputcolumn' title='Created stock' multiple='multiple' style='height:125px;width:120px;'></select></td>");
            containerLocal.Append("<td id='tdlExistStock'style='text-align: center;'><select size='4' name='lstAgentExistStock' id='lstAgentExistStock' tabindex='9' class='formInputcolumn' title='Exist Stock' style='height:125px;width:120px;'></select></td>");
            containerLocal.Append("<td style='text-align: center;'><select size='4' name='lstIssueStockAgent' id='lstIssueStockAgent' tabindex='12' class='selectDropDownList' title='Forwarder (Agent) Stock' style='height:125px;width:120px;'></select></td></tr>");

            

            containerLocal.Append(" </tbody></table></td></tr>");
            containerLocal.Append("<tr><td><input type='button' name='btnIssueStocktoAgent' value='Issue Stock to Forwarder (Agent)' onclick='IssueStocktoAgent();' id='btnIssuetoStockAgent' tabindex='10' class='btn btn-info' title='Issue Stock to Forwarder (Agent)'><input type='button' value='Back' onclick=\"navigateUrl('Default.cshtml?Module=Stock&amp;Apps=StockAWB&amp;FormAction=INDEXVIEW');\" class='btn btn-inverse'></td></tr>");
            containerLocal.Append("</tbody></table>");
            containerLocal.Append("</td></tr></tbody></table>");
            containerLocal.Append("</fieldset></div>");


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
                    this.DisplayMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
                    //Match the display Mode of the form.
                    switch (this.DisplayMode)
                    {
                        case DisplayModeIndexView:
                            strContent = CreateGrid(container);
                            break;
                        case DisplayModeDuplicate:
                            strContent = BuildFormView(this.DisplayMode, container);
                            break;
                        case DisplayModeReadView:
                            strContent = BuildFormView(this.DisplayMode, container);
                            break;
                        case DisplayModeEdit:
                            strContent = BuildFormView(this.DisplayMode, container);
                            break;
                        case DisplayModeNew:
                            strContent = BuildFormView(this.DisplayMode, container);
                            break;
                        case DisplayModeDelete:
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
        /// <summary>
        /// Generate Grid the for the page
        /// as per the columns of entity supplied
        /// </summary>
        /// <param name="Container"></param>
        private StringBuilder CreateGrid(StringBuilder Container)
        {
            try
            {
                using (Grid g = new Grid())
                {


                    g.CommandButtonNewText = "Create Stock";
                    g.FormCaptionText = "Stock Management";
                    g.IsActionRequired = false;
                    g.ActionTitle = "Issue To";
                    g.IsAllExport = false;
                    g.IsCurrentExport = false;
                    g.IsExportToExcel = false;
                    g.PrimaryID = this.MyPrimaryID;
                    g.PageName = this.MyPageName;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.ServiceModuleName = this.MyModuleID;
                    g.FormCaptionText = "Stock Management";
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                  //  g.SuccessGrid = "ShowScheduleAction";
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "AWBPrefix", Title = "AWB Prefix", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "TotalStock", Title = "Total Stock", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "UnIssuedStock", Title = "Unissued Stock", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "UnusedStock", Title = "Unused Stock", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "TotalIssueStock", Title = "Issued Office Stock", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "TotalAgentIssueStock", Title = "Issued Forwarder Stock", DataType = GridDataType.String.ToString() });

                    //g.Column.Add(new GridColumn { Field = "OfficeIssueDate", Title = "Office Issue Date", DataType = GridDataType.String.ToString() });
                    //g.Column.Add(new GridColumn { Field = "CityCode", Title = "City", DataType = GridDataType.String.ToString() });
                    //g.Column.Add(new GridColumn { Field = "OfficeName", Title = "Office", DataType = GridDataType.String.ToString() });
                    // g.Column.Add(new GridColumn { Field = "AWBType", Title = "AWB Type", DataType = GridDataType.String.ToString() });
                    
                    g.Column.Add(new GridColumn { Field = "Text_IsAutoAWB", Title = "Stock Type", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "AWBNo", Title = "AWB No", DataType = GridDataType.String.ToString() });//added for Lot No. by anmol
                    g.Column.Add(new GridColumn { Field = "LotNo", Title = "Lot No", DataType = GridDataType.String.ToString() });//added for Lot No. by anmol
                    
                    //g.Column.Add(new GridColumn { Field = "CreatedOn", Title = "Created On", DataType = GridDataType.Date.ToString(), Template = "#= kendo.toString(new Date(data.CreatedOn.getTime() + data.CreatedOn.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + "\") #" });
                    g.Column.Add(new GridColumn { Field = "CreatedBy", Title = "Created By", DataType = GridDataType.String.ToString() });

                    g.Action = new List<GridAction>();
                    //  g.Action.Add(new GridAction { ButtonCaption = "Office", ActionName = "READ", AppsName = this.MyAppID, CssClassName = "Read", ModuleName = this.MyModuleID });
                    // g.Action.Add(new GridAction { ButtonCaption = "Agent", ActionName = "EDIT", AppsName = this.MyAppID, CssClassName = "read", ModuleName = this.MyModuleID });

                    g.InstantiateIn(Container);

                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            }
            return Container;
        }
    }
}
