﻿using System;
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
    #region
    /*
	*****************************************************************************
	Class Name:		StockManagementWebUI      
	Purpose:		This class used to handle 
	Company:		CargoFlash 
	Author:			Shivang Srivastava
	Created On:		22 March 2014
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    public class StockManagementWebUI : BaseWebUISecureObject
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

            }
            return ConnectionType;
        }
        public StockManagementWebUI()
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
                this.MyAppID = "StockManagement";
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
        public StockManagementWebUI(Page PageContext)
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
                this.MyAppID = "StockManagement";
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
            StringBuilder containerLocal = new StringBuilder();

            containerLocal.Append(container);
            containerLocal.Append("<input id='hdnSNo' name='hdnSNo' type='hidden' value='" + this.MyRecordID + "'/>");
            containerLocal.Append("<table class='WebFormTable'><tr><td class'formActiontitle'>&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;<input type='submit' value='Generate' text='Generate' class='btn btn-success' onClick='GenerateStock()' id='btnGenerate'> <input type='button' name='btnReset' value='Reset' onclick='ResetStock();' id='btnReset' tabindex='8' class='btn btn-success' title='Reset'> </td></tr></table>");
            containerLocal.Append("<div id='StockCreated' style='width:100%'><fieldset><legend>Created Stock Information</legend>");
            containerLocal.Append("<table width='100%'> <tbody><tr><td class='tdSpace' colspan='4'></td></tr>");
            containerLocal.Append("<tr><td colspan='4'>");

            containerLocal.Append("<table  style='border: solid 1px gray;' class='appendGrid ui-widget'><tbody><tr class='ui-widget-header'>");
            containerLocal.Append("<td id='tdTotalGeneratedAWBNo' width='250px' style='text-align: center; height: 20px;' class='ui-state-active caption'>Generated Total AWBNo [<span id='lblTotalGeneratedAWBNo'></span>]</td>");
            containerLocal.Append("<td id='tdExistStock' width='250px' style='text-align: center;' class='ui-state-active caption'>Stock Already Created [<span id='lblExistStock'></span>]</td>");
            containerLocal.Append("<td id='tdTotalCreatedAWB' style='text-align: center;' width='250px' class='ui-state-active caption'>Available Stock [<span id='lblTotalCreatedStock'></span>]</td>");
            containerLocal.Append("<td id='tdTotalIssueAWB' width='250px' style='text-align: center; height: 20px;' class='ui-state-active caption'>Issued  Stock to Office [<span id='lblIssueStockOffice'></span>]</td>");
            containerLocal.Append("<td id='tdTotalIssueAWBtoAgent' width='250px' style='text-align: center; height: 20px;' class='ui-state-active caption' >Issue Stock to Forwarder (Agent) [<span id='lblIssueStockAgent'></span>]</td>");
            containerLocal.Append("</tr>");
            containerLocal.Append("<tr><td class='tdSpace' colspan='5'></td></tr>");
            containerLocal.Append("<tr><td id='tdlCreatedstock'style='text-align: center;'><select size='4' name='lstCreatedstock' id='lstCreatedstock' tabindex='8' class='formInputcolumn' title='Created stock' style='height:125px;width:120px;'></select></td>");
            containerLocal.Append("<td id='tdlExistStock'style='text-align: center;'><select size='4' name='lstExistStock' id='lstExistStock' tabindex='9' class='formInputcolumn' title='Exist Stock' style='height:125px;width:120px;'></select></td>");
            containerLocal.Append("<td  id='tdlstTotalCreatedStock' style='text-align: center;'><select multiple='multiple' size='4' name='lstTotalCreatedStock' id='lstTotalCreatedStock' tabindex='10' class='formInputcolumn' title='Total Created Stock' style='height:125px;width:120px;'></select></td>");
            containerLocal.Append("<td style='text-align: center;'><select multiple='multiple' size='4' name='lstIssueStockOffice' id='lstIssueStockOffice' tabindex='11' class='selectDropDownList' title='Office Stock' style='height:125px;width:120px;'></select></td>");
            containerLocal.Append("<td style='text-align: center;'><select size='4' name='lstIssueStockAgent' id='lstIssueStockAgent' tabindex='12' class='selectDropDownList' title='Forwarder (Agent) Stock' style='height:125px;width:120px;'></select></td>");
            containerLocal.Append(" </tr></tbody></table><div id='pnlAddStock' style='width:100%'>");
            containerLocal.Append("<table class='grdTable'><tbody><tr><td class='tdSpace'></td></tr>");
            //containerLocal.Append(" <tr><td class='tdpading'></td></tr>");
            //containerLocal.Append("<tr><td class='tdborder'></td></tr>");
            containerLocal.Append("<tr><td class='toolbar'><input type='button' name='btnCreateStock' value='Create Stock' onclick='CreateStock();' id='btnCreateStock' tabindex='13' class='btn btn-success' title='Create Stock'></td></tr>");
            //containerLocal.Append("<tr id='trIssueStock'><td class='toolbar'>");
            //containerLocal.Append("<spna>Issue to : &nbsp;</span>  ");
            //containerLocal.Append("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>Office Name : &nbsp;</span>");
            //containerLocal.Append("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>No. of AWB : &nbsp;</span>");
            //containerLocal.Append("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
            //containerLocal.Append("</td></tr>");
            containerLocal.Append("</tbody></table></div></td>");

            containerLocal.Append("</tr></tbody></table>");

            containerLocal.Append("</td></tr></tbody></table>");
            containerLocal.Append("</fieldset></div>");

            containerLocal.Append("<div id='IssueStock' style='width:100%'><fieldset><legend>Issue Stock Information</legend>");
            containerLocal.Append("<table width='100%' class='WebFormTable' id='tblIssueStock'> <tbody><tr><td class='tdSpace' colspan='4'></td></tr>");
            containerLocal.Append("<tr><td class='formlabel'><font color='red'>*</font> City Code</td><td class='formInputcolumn'><input type='hidden' id='City' name='City'><input type='text' name='Text_City' id='Text_City' tabindex='7' data-role='autocomplete' controltype='autocomplete' data-valid='required' data-valid-msg='City can not be blank'></td>");
            containerLocal.Append("<td class='formlabel'><font color='red'>*</font> Office Name</td><td class='formInputcolumn'><input type='hidden' id='Office' name='Office'>  <input type='text' name='Text_Office' id='Text_Office' tabindex='8' data-role='autocomplete' controltype='autocomplete' data-valid='required' data-valid-msg='Office Name can not be blank'></td></tr>");

            containerLocal.Append("<tr id='trAgentName'><td class='formlabel'><font color='red'>*</font>Forwarder (Agent) Name</td><td class='formInputcolumn'><div id='divAccount'><input type='hidden' id='Account' name='Account'><input type='text' name='Text_Account' id='Text_Account' tabindex='7' data-role='autocomplete' controltype='autocomplete' data-valid='required' data-valid-msg='Forwarder (Agent) can not be blank'</div></td>");
            //disabled='disabled'
            containerLocal.Append("<td class='formlabel'>Auto Retrieval Date</td><td class='formInputcolumn'><input type='text' controltype='datetype'  name='AutoRetrievalDate'  id='AutoRetrievalDate' width=90px; value='" + string.Format("{0:dd-MMM-yyyy }", DateTime.Now.AddMonths(1)) + "' /></td></tr>");

            containerLocal.Append("<tr><td class='formlabel'><font color='red'>*</font> AWB Number:   From</td><td class='formInputcolumn'><textarea class='k-input' name='AWBFROM' onkeyup='keyupAWBFrom()' id ='AWBFROM' style='width: 100px; text-transform: none;' controltype='alphanumeric' allowchar='/-,' data-valid='required' data-valid-msg='Starting From: AWB No. can not be blank' tabindex='10' maxlength='100' data-role='alphabettextbox' autocomplete='off'></textarea></td>");
            containerLocal.Append("<td class='formlabel'><font color='red'></font>To</td><td class='formInputcolumn'><textarea class='k-input' name='AWBTO' onkeyup='keyupAWBTo()' id='AWBTO' style='width: 100px; text-transform: none;' controltype='alphanumeric' allowchar='/-,' tabindex='10' maxlength='100' data-role='alphabettextbox' autocomplete='off'></textarea></td></tr>");

            containerLocal.Append("<tr><td class='formlabel'><font color='red'></font> No. of AWB</td><td class='formInputcolumn'><input onblur='GetMaxIssueAWB(this)' type='text' class='k-input k-state-default' name='IssueAWB' id='IssueAWB' style='width: 30px; text-align: right; display: none;' controltype='range'  tabindex='5' maxlength='4' value='' data-role='numerictextbox'></td>");
            containerLocal.Append("<td class='formlabel'>Remarks</td><td class='formInputcolumn'><textarea class='k-input' name='Remarks' id='Remarks' style='width: 150px; text-transform: none;' controltype='alphanumeric' allowchar='/-,' tabindex='10' maxlength='500' data-role='alphabettextbox' autocomplete='off'></textarea></td></tr>");

            containerLocal.Append("<tr><td class'formactiontitle' colspan='4'><input type='button' name='btnIssueStock' value='Issue Stock to Office' onclick='IssueStock();' id='btnIssueStock' tabindex='10' class='btn btn-info' title='Issue Stock'>");
            containerLocal.Append("<input type='button' name='btnIssueStocktoAgent' value='Issue Stock to Forwarder (Agent)' onclick='IssueStocktoAgent();' id='btnIssuetoStockAgent' tabindex='10' class='btn btn-info' title='Issue Stock to Forwarder (Agent)'></td></tr>");

            containerLocal.Append("</tbody></table>");
            containerLocal.Append("</fieldset></div>");
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
                    g.CommandButtonNewText = "New Stock Management";
                    g.FormCaptionText = "Issue Available Stock";
                    g.ActionTitle = "Issue To";
                    g.IsDisplayOnly = false;
                    g.PrimaryID = this.MyPrimaryID;
                    g.PageName = this.MyPageName;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.IsShowEdit = false;
                    g.IsShowDelete = false;
                    g.IsAllExport = false;
                    g.IsCurrentExport = false;
                    g.IsExportToExcel = false;
                    g.ServiceModuleName = this.MyModuleID;
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    g.SuccessGrid = "ShowStockAction";
                    g.Column.Add(new GridColumn { Field = "AWBPrefix", Title = "AWB Prefix", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "TotalStock", Title = "Total Stock", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "UnusedStock", Title = "Unused Stock", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "TotalIssueStock", Title = "Issued Office Stock", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "TotalAgentIssueStock", Title = "Issued Forwarder (Agent) Stock", DataType = GridDataType.String.ToString(), Width = 180 });
                    g.Column.Add(new GridColumn { Field = "OfficeName", Title = "Office Name", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "OfficeCity", Title = "Office City", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "AgentName", Title = "Agent Name", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "AWBNo", Title = "AWB No", DataType = GridDataType.String.ToString(), Width = 130 });
                    g.Column.Add(new GridColumn { Field = "LotNo", Title = "Lot Number", DataType = GridDataType.String.ToString(), Width = 140 });
                    g.Column.Add(new GridColumn { Field = "AWBType", Title = "AWB Type", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Text_IsAutoAWB", Title = "Stock Type", DataType = GridDataType.String.ToString() });
                    // g.Column.Add(new GridColumn { Field = "CreatedOn", Title = "Created On", DataType = GridDataType.Date.ToString(), Template = "#= kendo.toString(new Date(data.CreatedOn.getTime() + data.CreatedOn.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + "\") #" });
                    g.Column.Add(new GridColumn { Field = "CreatedBy", Title = "Created By", DataType = GridDataType.String.ToString() });

                   

                    CargoFlash.Cargo.DataService.Common.CommonService COMSer = new DataService.Common.CommonService();
                    CargoFlash.Cargo.Business.GetPageRightsByUser obj = new CargoFlash.Cargo.Business.GetPageRightsByUser();
                    obj.Module = "Stock";
                    obj.Apps = "StockManagement";
                    CargoFlash.Cargo.DataService.Common.PageRightsByAppName Rights = COMSer.GetPageRightsByAppName(obj);

                    if (Rights.IsEdit == true)
                    {
                        g.Action = new List<GridAction>();
                        g.Action.Add(new GridAction { ButtonCaption = "Office", ActionName = "READ", AppsName = this.MyAppID, CssClassName = "Read", ModuleName = this.MyModuleID });
                        g.Action.Add(new GridAction { ButtonCaption = "Forwarder (Agent)", ActionName = "EDIT", AppsName = this.MyAppID, CssClassName = "Read", ModuleName = this.MyModuleID });
                    }
                    else
                    {
                        g.IsActionRequired = false;
                    }
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

public class getPageRightsByUser
{
    public string Module { get; set; }
    public string Apps { get; set; }
}
