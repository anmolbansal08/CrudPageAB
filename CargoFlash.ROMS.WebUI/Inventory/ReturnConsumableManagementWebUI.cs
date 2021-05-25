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
    public class ReturnConsumableManagementWebUI : BaseWebUISecureObject
    {
        int SNo = 0;

        public object GetReturnConsumableRecord()
        {
            object returnConsumable = null;
            try
            {
                if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                {
                    ReturnConsumableTrans ReturnConsumableList = new ReturnConsumableTrans();
                    object obj = (object)ReturnConsumableList;
                    returnConsumable = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID);
                    this.MyRecordID = System.Web.HttpContext.Current.Request.QueryString["RecID"];


                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            } return returnConsumable;
        }
        public ReturnConsumableManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Inventory";
                this.MyAppID = "ReturnConsumable";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }
        public ReturnConsumableManagementWebUI(Page PageContext)
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
                this.MyAppID = "ReturnConsumable";
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
                    htmlFormAdapter.HeadingColumnName = "Return Consumable";

                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.objFormData = GetReturnConsumableRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            //container.Append(TabView());
                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.objFormData = GetReturnConsumableRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.objFormData = GetReturnConsumableRecord();
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
                            htmlFormAdapter.objFormData = GetReturnConsumableRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Delete;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            //container.Append(TabView());
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

            container.Append("<input id='hdnReturnConsumablesSNo' name='hdnReturnConsumablesSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnNumberd' name='hdnNumberd' type='hidden' value=''/><table id='tblReturnConsumables' width='100%'></table>");

            container.Append(GenerateIssueConsumablesTab());
            return container;
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
                       // SaveReturnConsumable();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                        break;
                    //case DisplayModeSaveAndNew:
                    //    SaveReturnConsumable();
                    //    if (string.IsNullOrEmpty(ErrorMessage))
                    //        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                    //    break;
                    case DisplayModeUpdate:
                        UpdateReturnConsumable(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                        break;

                    case DisplayModeDelete:
                        DeleteReturnConsumable(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
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
                    g.FormCaptionText = "Return Inventory";
                    g.CommandButtonNewText = "Return Inventory";
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                 
                    g.Column.Add(new GridColumn { Field = "Item", Title = "Item", DataType = GridDataType.String.ToString() });

                    g.Column.Add(new GridColumn { Field = "ReturnType", Title = "Return Type", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "ReturnFrom", Title = "Return From", DataType = GridDataType.String.ToString() });
                    
                    g.Column.Add(new GridColumn { Field = "NoOFItem", Title = "No Of Item", DataType = GridDataType.String.ToString() });
                   // g.Column.Add(new GridColumn { Field = "ReturnDate", Title = "Return Date", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "ReturnDate", Title = "Return Date", DataType = GridDataType.DateTime.ToString(), Template = "# if(ReturnDate==null) {# # } else {# #= kendo.toString(new Date(data.ReturnDate.getTime() + data.ReturnDate.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + " " + "\") # #}#" });


                    g.Column.Add(new GridColumn { Field = "Type", Title = "Type", DataType = GridDataType.String.ToString() });
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

        private void SaveReturnConsumable()
        {
            try
            {
                List<ReturnConsumable> listReturnConsumable = new List<ReturnConsumable>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var returnConsumable = new ReturnConsumable
                {
                    SNo = Convert.ToInt32(FormElement["ReturnableItem"].ToString().Split('-')[0]),
                    NoOFItem = FormElement["NoOFItems"].ToUpper(),
                    ReturnType = FormElement["ReturnType"],
                    ReturnFrom = FormElement["ReturnFrom"] ,
                    //CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()
                };
                listReturnConsumable.Add(returnConsumable);
                object datalist = (object)listReturnConsumable;
                DataOperationService(DisplayModeSave, datalist, MyModuleID);
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            }
        }
        private void UpdateReturnConsumable(string RecordID)
        {
            try
            {
                List<ReturnConsumable> listReturnConsumable = new List<ReturnConsumable>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var returnConsumable = new ReturnConsumable
                {
                    //SNo = Convert.ToInt32(RecordID),
                    //PackingName = FormElement["PackingName"].ToUpper(),
                    //IsActive = FormElement["IsActive"] == "0",
                    //CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    //UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()
                };
                listReturnConsumable.Add(returnConsumable);
                object datalist = (object)listReturnConsumable;
                DataOperationService(DisplayModeUpdate, datalist, MyModuleID);
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            }
        }
        private void DeleteReturnConsumable(string RecordID)
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

        public StringBuilder GenerateIssueConsumablesTab()
        {

            StringBuilder containerLocal = new StringBuilder();

            containerLocal.Append("<div id='divReturnConsumables' style='width:100%'>");
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
            containerLocal.Append("<tr><td style='text-align: left;'><div style='margin-top: 1px; margin-left: 10px;border-radius:5px;' ><fieldset><legend>Issued Inventory List</legend><div style='margin-top: 1px;'><select multiple='multiple' size='4' name='lstIssueConsumablesRecord' id='lstIssueConsumablesRecord' class='formInputcolumn' title='Issued Consumables List' style='height:150px;width:300px;margin-top:1px;margin-left:10px;'></select></div></fieldset></div></td>");
            containerLocal.Append("<td width='50px' style='text-align: center;'><table><tr><td><input type='button' name='btnAllIssueConsumables' id='btnAllIssueConsumables' value='>>' class='btn btn-danger' onclick='MovetoNextAllIssueConsumables();' ></td></tr><tr><td><input type='button' name='btnMovetoNextIssueConsumables' id='btnMovetoNextIssueConsumables' value='>' class='btn btn-danger' onclick='MovetoNextIssueConsumables();'></td></tr><tr><td><input type='button' name='btnReverseIssueConsumables' id='btnReverseIssueConsumables' value='<' class='btn btn-danger' onclick='ReverseIssueConsumables();'></td></tr><tr><td><input type='button' title='Move All' name='btnReverseAllIssueConsumables' id='btnReverseAllIssueConsumables' value='<<' class='btn btn-danger' onclick='ReverseAllIssueConsumables();'></td></tr></table></td>");

            //containerLocal.Append("<td  style='text-align: center;'><select size='4' name='lstAirlinePriority' id='listAirlinePriority' tabindex='8' class='formInputcolumn' multiple='multiple' style='height:125px;width:120px;'></select></td>");


            containerLocal.Append("<td align='left'  style='text-align: left;'><div style='margin-top: 1px; margin-left: 10px;border-radius:5px;' ><fieldset><legend>Return Inventory List</legend><select multiple='multiple' size='4' name='listReturnConsumables' id='listReturnConsumables' class='formInputcolumn' title='Return Inventory List' style='height:150px;width:300px;margin-top:1px;margin-left:10px;'></select></div></fieldset></td>");

            //containerLocal.Append("<td style='text-align: center;'><table><tr><td><input type='button' name='btnUp' id='btnMoveUp' value='^' class='btn btn-danger'  title='Move Up' onclick='MoveItemUp();'></td></tr><tr><td><input type='button' title='Move Down' name='BtnMoveDown' id='BtnMoveDown' value='v' class='btn btn-danger' onclick='MoveItemDown();' ></td></tr><tr><td></td></tr></table></td>");

            containerLocal.Append("<tr><td class'formactiontitle' colspan='5'></tr>");
            containerLocal.Append(" </tbody></table></td></tr>");
            containerLocal.Append("</tbody></table>");
            containerLocal.Append("</td></tr></tbody></table>");
            containerLocal.Append("</div>");
            return containerLocal;
        }





    }
}
