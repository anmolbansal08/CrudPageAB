using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.UI;
using System.Data;
using System.Net;
using System.IO;
using System.Reflection;
using System.Runtime.Serialization;
using CargoFlash.SoftwareFactory.WebUI;
using CargoFlash.SoftwareFactory.WebUI.Adapters;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using CargoFlash.Cargo.Model.Inventory;
using System.Collections;
using CargoFlash.Cargo.WebUI;

namespace CargoFlash.Cargo.WebUI.Inventory
{
    #region IssueConsumables Class Description
    /*
	*****************************************************************************
	Class Name:		IssueConsumablesManagementWebUI      
	Purpose:		This Class used to get details of Country save update and delete
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Karan Kumar
	Created On:		18 DEC 2015
    Updated By:    
	Updated On:	
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    public class IssueConsumablesManagementWebUI : BaseWebUISecureObject
    {
        int SNo = 0;

        public object GetIssueConsumablesRecord()
        {
            object issueConsumables = null;
            try
            {
                if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                {
                    IssueConsumables IssueConsumablesList = new IssueConsumables();
                    object obj = (object)IssueConsumablesList;
                    issueConsumables = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID);
                    this.MyRecordID = System.Web.HttpContext.Current.Request.QueryString["RecID"];


                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            } return issueConsumables;
        }
        public IssueConsumablesManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Inventory";
                this.MyAppID = "IssueConsumables";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }
        public IssueConsumablesManagementWebUI(Page PageContext)
        {
            try
            {
                if (this.SetCurrentPageContext(PageContext))
                {
                    this.ErrorNumber = 0;
                    this.ErrorMessage = "";
                }
                this.MyPageName = "Default.aspx";
                this.MyModuleID = "Inventory";
                this.MyAppID = "IssueConsumables";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }
        public StringBuilder BuildFormView(string DisplayMode, StringBuilder container)
        {
            try
            {
                using (HtmlFormAdapter htmlFormAdapter = new HtmlFormAdapter(MyModuleID))
                {
                    htmlFormAdapter.CurrentPage = this.CurrentPageContext;
                    htmlFormAdapter.HeadingColumnName = "Issue Consumables";

                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.objFormData = GetIssueConsumablesRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            //container.Append(TabView());
                            break;
                        case DisplayModeDuplicate:
                           htmlFormAdapter.objFormData = GetIssueConsumablesRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeEdit:
                           htmlFormAdapter.objFormData = GetIssueConsumablesRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeDelete:
                        htmlFormAdapter.objFormData = GetIssueConsumablesRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Delete;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                           // container.Append(TabView());
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

            container.Append("<input id='hdnIssueConsumablesSNo' name='hdnIssueConsumablesSNo' type='hidden' value='" + this.MyRecordID.Split('-')[0] + "'/><table id='tblIssueConsumables' width='100%'></table>");
            container.Append(GenerateIssueConsumablesTab());
            return container;
        }

        public StringBuilder GenerateIssueConsumablesTab()
        {

            StringBuilder containerLocal = new StringBuilder();

            containerLocal.Append("<div id='divIssueConsumables' style='width:100%'>");
            containerLocal.Append("<table width='100%'> <tbody><tr><td class='tdSpace' colspan='4'></td></tr>");
            containerLocal.Append("<tr><td colspan='4'>");
            containerLocal.Append("<table cellspacing='0'  style='border: solid 1px gray;width:100%' ><tbody><tr class='ui-widget-header'>");

            containerLocal.Append("<td  style='text-align: center; height: 20px;' class='ui-state-active caption'></td>");
            containerLocal.Append("<td class='ui-state-active caption'></td>");
            containerLocal.Append("<td  style='text-align: center;' class='ui-state-active caption'></td>");
            //containerLocal.Append("<td   style='text-align: center;' class='ui-state-active caption'> </td>");
            //containerLocal.Append("<td   style='text-align: center; height: 20px;' class='ui-state-active caption'></td>");
            containerLocal.Append("</tr>");
            containerLocal.Append("<tr><td class='tdSpace' style='text-align:center;' colspan='5'></td></tr>");
            containerLocal.Append("<tr><td style='text-align: left;'><div style='margin-top: 1px; margin-left: 10px;border-radius:5px' ><fieldset><legend>Inventory Stock List</legend><div style='margin-top: 1px;'><select multiple='multiple' size='4' name='lstConsumablesStockRecord' id='lstConsumablesStockRecord' class='formInputcolumn' title='Consumables Stock List' style='height:150px;width:300px;margin-top:1px;margin-left:10px;'></select></div></fieldset></div></td>");
            containerLocal.Append("<td width='50px' style='text-align: center;'><table><tr><td><input type='button' name='btnAllIssueConsumables' id='btnAllIssueConsumables' value='>>' class='btn btn-danger' onclick='MovetoNextAllIssueConsumables();' ></td></tr><tr><td><input type='button' name='btnMovetoNextIssueConsumables' id='btnMovetoNextIssueConsumables' value='>' class='btn btn-danger' onclick='MovetoNextIssueConsumables();'></td></tr><tr><td><input type='button' name='btnReverseIssueConsumables' id='btnReverseIssueConsumables' value='<' class='btn btn-danger' onclick='ReverseIssueConsumables();'></td></tr><tr><td><input type='button' title='Move All' name='btnReverseAllIssueConsumables' id='btnReverseAllIssueConsumables' value='<<' class='btn btn-danger' onclick='ReverseAllIssueConsumables();'></td></tr></table></td>");

            //containerLocal.Append("<td  style='text-align: center;'><select size='4' name='lstAirlinePriority' id='listAirlinePriority' tabindex='8' class='formInputcolumn' multiple='multiple' style='height:125px;width:120px;'></select></td>");


            containerLocal.Append("<td align='left'  style='text-align: left;'><div style='margin-top: 1px; margin-left: 10px;border-radius:5px;' ><fieldset><legend>Issued Inventory List</legend><select multiple='multiple' size='4' name='listIssueConsumables' id='listIssueConsumables' class='formInputcolumn' title='Consumables Stock List' style='height:150px;width:300px;margin-top:1px;margin-left:10px;'></select></div></fieldset></td>");

            //containerLocal.Append("<td style='text-align: center;'><table><tr><td><input type='button' name='btnUp' id='btnMoveUp' value='^' class='btn btn-danger'  title='Move Up' onclick='MoveItemUp();'></td></tr><tr><td><input type='button' title='Move Down' name='BtnMoveDown' id='BtnMoveDown' value='v' class='btn btn-danger' onclick='MoveItemDown();' ></td></tr><tr><td></td></tr></table></td>");

            containerLocal.Append("<tr><td class'formactiontitle' colspan='5'></tr>");
            containerLocal.Append(" </tbody></table></td></tr>");      
            containerLocal.Append("</tbody></table>");
            containerLocal.Append("</td></tr></tbody></table>");
            containerLocal.Append("</div>");
            return containerLocal;
        }
        public StringBuilder CreateWebForm(StringBuilder container)
        {
            try
            {
                if (System.Web.HttpContext.Current.Request.QueryString["FormAction"] != null)
                {
                    //Set the display Mode form the URL QuesyString.
                    this.DisplayMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
                    //Match the display Mode of the form.
                    switch (this.DisplayMode)
                    {
                        case DisplayModeIndexView:
                            CreateGrid(container);
                            break;
                        case DisplayModeDuplicate:
                            BuildFormView(this.DisplayMode, container);
                            break;
                        case DisplayModeReadView:
                            BuildFormView(this.DisplayMode, container);
                            break;
                        case DisplayModeEdit:
                            BuildFormView(this.DisplayMode, container);
                            break;
                        case DisplayModeNew:
                            BuildFormView(this.DisplayMode, container);
                            break;
                        case DisplayModeDelete:
                            BuildFormView(this.DisplayMode, container);
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
            return container;
        }
        public override void DoPostBack()
        {
            try
            {
                this.OperationMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
                switch (OperationMode)
                {
                    case DisplayModeSave:
                     //   SaveIssueConsumables();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                        break;
                    case DisplayModeSaveAndNew:
                     //   SaveIssueConsumables();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                        break;
                    //case DisplayModeUpdate:
                    //    UpdateIssueConsumables(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                    //    if (string.IsNullOrEmpty(ErrorMessage))
                    //        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                    //    break;

                    case DisplayModeDelete:
                   //     DeleteIssueConsumables(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2002), false);
                        break;
                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            }
        }
        private StringBuilder CreateGrid(StringBuilder Container)
        {
            try
            {
                using (Grid g = new Grid())
                {
                    g.PrimaryID = this.MyPrimaryID;
                    g.PageName = this.MyPageName;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.ServiceModuleName = this.MyModuleID;
                    g.FormCaptionText = "Issue Inventory";
                    g.CommandButtonNewText = "Issue Inventory";
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    //g.Column.Add(new GridColumn { Field = "Name", Title = "Name", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Item", Title = "Item", DataType = GridDataType.String.ToString() });
                      g.Column.Add(new GridColumn { Field = "IssuedType", Title = "Issued Type", DataType = GridDataType.String.ToString() });
                      g.Column.Add(new GridColumn { Field = "IssuedTo", Title = "Issued To", DataType = GridDataType.String.ToString() });
                      g.Column.Add(new GridColumn { Field = "NoOfItem", Title = "No Of Items", DataType = GridDataType.String.ToString() });
                    
                    //  g.Column.Add(new GridColumn { Field = "IssuedDate", Title = "Issued Date", DataType = GridDataType.String.ToString() });

                      g.Column.Add(new GridColumn { Field = "IssuedDate", Title = "Issued Date", DataType = GridDataType.DateTime.ToString(), Template = "# if(IssuedDate==null) {# # } else {# #= kendo.toString(new Date(data.IssuedDate.getTime() + data.IssuedDate.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + " " + "\") # #}#" });

                      g.Column.Add(new GridColumn { Field = "Type", Title = "Type", DataType = GridDataType.String.ToString() });
                 //   g.Column.Add(new GridColumn { Field = "Qty", Title = "Qty", DataType = GridDataType.String.ToString() });
                      g.Action = new List<GridAction>();

                      g.Action.Add(new GridAction { ActionName = "READ", ButtonCaption = "Read", AppsName = this.MyAppID, CssClassName = "read", ModuleName = this.MyModuleID });
                    
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
        private void SaveIssueConsumables()
        {
            //try
            //{
            //    List<IssueConsumablesList> listIssueConsumables = new List<IssueConsumablesList>();
            //    var FormElement = System.Web.HttpContext.Current.Request.Form;
            //    var issueConsumables = new IssueConsumablesList
            //    {
            //        IssueDate = FormElement["IssueDate"].ToString(),
            //        IssuedToSNo = Convert.ToInt32(FormElement["IssuedTo"]),
            //        FlightDate = FormElement["FlightDate"].ToString(),
            //        FlightNo = FormElement["FlightNo"].ToString(),
            //        NoOfItems = Convert.ToInt32(FormElement["NoOfItems"].ToString()),
            //        ConsumableSNo = Convert.ToInt32(FormElement["Item"].ToString()),
            //        IsBillable = Convert.ToBoolean(FormElement["IsBillable"] == "on" ? true : false),
            //        ULDNo = FormElement["ULDNo"].ToString(),
            //        UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()
            //    };
            //    listIssueConsumables.Add(issueConsumables);
            //    object datalist = (object)listIssueConsumables;
            //    DataOperationService(DisplayModeSave, datalist, MyModuleID);
            //}
            //catch (Exception ex)
            //{
            //    ApplicationWebUI applicationWebUI = new ApplicationWebUI();
            //    applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            //}

        }
        private void DeleteIssueConsumables(string RecordID)
        {
            try
            {
                List<string> listID = new List<string>();
                listID.Add(RecordID);
                listID.Add(MyUserID.ToString());
                object recordID = (object)listID;
                DataOperationService(DisplayModeDelete, recordID, MyModuleID);
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            }
        }
        private StringBuilder TabView()
        {

            StringBuilder strBuilder = new StringBuilder();
            // string FormAction = CurrentPageContext.Request.QueryString["FormAction"].ToString().ToUpper().Trim();
            strBuilder.Append(@"          
            <div id='spnUpdateShipmentDetail'><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='10'/><table class='WebFormTable'>");

            if (FormAction == "READ")
                strBuilder.Append(@"<div></div> <br></br><tr></tr>");
            strBuilder.Append(@"<tr><td><table id='tblIssueConsumablesView' width='100%'></table></td></tr><tr><td class='k-content'><input id='btnBack' name='btnBack' class='btn btn-inverse' type='button' tabindex='16' value='Back'/></td></tr></table></div>");
            return strBuilder;
        }
    }
}
