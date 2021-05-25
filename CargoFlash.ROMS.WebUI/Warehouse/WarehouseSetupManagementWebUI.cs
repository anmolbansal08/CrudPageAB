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
using CargoFlash.Cargo.Model.Warehouse;
using System.Collections;
using CargoFlash.Cargo.WebUI;

namespace CargoFlash.Cargo.WebUI.Warehouse
{
    public class WarehouseSetupManagementWebUI : BaseWebUISecureObject
    {

        int SNo = 0;

        public object GetWarehouseSetupRecord()
        {
            object warehouseSetup = null;
            try
            {
                if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                {
                    WarehouseSetup WarehouseSetupList = new WarehouseSetup();
                    object obj = (object)WarehouseSetupList;
                    warehouseSetup = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID);
                    this.MyRecordID = System.Web.HttpContext.Current.Request.QueryString["RecID"];


                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            } return warehouseSetup;
        }
        public WarehouseSetupManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Warehouse";
                this.MyAppID = "WarehouseSetup";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }
        public WarehouseSetupManagementWebUI(Page PageContext)
        {
            try
            {
                if (this.SetCurrentPageContext(PageContext))
                {
                    this.ErrorNumber = 0;
                    this.ErrorMessage = "";
                }
                this.MyPageName = "Default.aspx";
                this.MyModuleID = "Warehouse";
                this.MyAppID = "WarehouseSetup";
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
                    htmlFormAdapter.HeadingColumnName = "WarehouseName";

                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.objFormData = GetWarehouseSetupRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.objFormData = GetWarehouseSetupRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.objFormData = GetWarehouseSetupRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            //container.Append(htmlFormAdapter.TransInstantiateWithHeader("EDI", "EventMessageTransOne", ValidateOnSubmit: true));
                            //container.Append(TabNew());
                            break;
                        case DisplayModeDelete:
                            htmlFormAdapter.objFormData = GetWarehouseSetupRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Delete;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
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
                        SaveWarehouseSetup();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                        break;
                    case DisplayModeSaveAndNew:
                        SaveWarehouseSetup();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                        break;
                    case DisplayModeUpdate:
                        UpdateWarehouseSetup(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                        break;

                    case DisplayModeDelete:
                        DeleteMessageTypeMaster(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
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
                    g.FormCaptionText = "Warehouse Setup";
                    g.CommandButtonNewText = "New Warehouse Setup";
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.QueryString.Add("TerminalSNo");
                    g.QueryString.Add("TerminalName");
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "AirportName", Title = "Airport Name", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "WarehouseName", Title = "Warehouse Name", DataType = GridDataType.String.ToString().ToUpper() });
                    g.Column.Add(new GridColumn { Field = "Text_WarehouseType", Title = "WarehouseType", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "TerminalName", Title = "Terminal Name", DataType = GridDataType.String.ToString().ToUpper() });
                    g.Column.Add(new GridColumn { Field = "LevelNo", Title = "Level No.", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "TotalArea", Title = "Total Area", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Active", Title = "Active", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "TerminalSNo", Title = "TerminalSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                    g.Action = new List<GridAction>();
                    g.Action.Add(new GridAction { ButtonCaption = "Read", ActionName = "Read", AppsName = this.MyAppID, CssClassName = "icon-read", ModuleName = this.MyModuleID });
                    g.Action.Add(new GridAction { ButtonCaption = "Planning", ActionName = "Edit", AppsName = "WarehousePlanning", CssClassName = "Read", ModuleName = this.MyModuleID });
                    g.Action.Add(new GridAction { ButtonCaption = "Edit", ActionName = "Edit", AppsName = this.MyAppID, CssClassName = "Read", ModuleName = this.MyModuleID });
                    


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
        private void SaveWarehouseSetup()
        {
            try
            {
                List<WarehouseSetup> listWarehouseSetup = new List<WarehouseSetup>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var eventMessageTrans = new WarehouseSetup
                {
                    AirportSNo = Convert.ToInt32(FormElement["AirportName"]),
                    WarehouseName = FormElement["WarehouseName"].ToString(),
                    WarehouseCode = FormElement["WarehouseCode"].ToString(),
                    LevelNo = Convert.ToInt32(FormElement["LevelNo"]),
                    WHRowCount = Convert.ToInt32(FormElement["WHRowCount"]),
                    WHColumnCount = Convert.ToInt32(FormElement["WHColumnCount"]),
                    TotalArea = Convert.ToInt32(FormElement["TotalArea"]),
                    IsActive = Convert.ToBoolean(FormElement["Active"]=="0" ? true : false),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    TerminalSNo=FormElement["TerminalName"].ToString(),
                    WarehouseType = Convert.ToInt32(FormElement["WarehouseType"]),

                };
                listWarehouseSetup.Add(eventMessageTrans);
                object datalist = (object)listWarehouseSetup;
                DataOperationService(DisplayModeSave, datalist, MyModuleID);
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            }

        }
        private void UpdateWarehouseSetup(string RecordID)
        {
            try
            {
                List<WarehouseSetup> listWarehouseSetup = new List<WarehouseSetup>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var warehouseSetup = new WarehouseSetup
                {
                    SNo = Convert.ToInt32(RecordID),
                    WarehouseName=FormElement["WarehouseName"],
                    LevelNo = Convert.ToInt32(FormElement["LevelNo"]),
                    TotalArea = Convert.ToInt32(FormElement["TotalArea"]),
                    IsActive = Convert.ToBoolean(FormElement["Active"] == "0" ? true : false),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    WarehouseType = Convert.ToInt32(FormElement["WarehouseType"]),
                };
                listWarehouseSetup.Add(warehouseSetup);
                object datalist = (object)listWarehouseSetup;
                DataOperationService(DisplayModeUpdate, datalist, MyModuleID);
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            }
        }
        private void DeleteMessageTypeMaster(string RecordID)
        {
            try
            {
                //List<string> listID = new List<string>();
                //listID.Add(RecordID);
                //listID.Add(MyUserID.ToString());
                //object recordID = (object)listID;
                //DataOperationService(DisplayModeDelete, recordID, MyModuleID);
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            }
        }

        //public StringBuilder CreateEventMessageTransPage(StringBuilder container)
        //{
        //    var GroupSNo = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).GroupSNo;
        //    StringBuilder containerLocal = new StringBuilder();
        //    containerLocal.Append(@"<div id='div1'>");
        //    //style='width:98%;height:98%:'
        //    containerLocal.Append(container);
        //    //containerLocal.Append("<input id='hdnSNo' name='hdnSNo' type='hidden' value='" + this.MyRecordID + "'/>");
        //    //containerLocal.Append("<input id='hdnGroupSNo' name='hdnGroupSNo' type='hidden' value='" + GroupSNo + "'/>");
        //    //containerLocal.Append("<div id='div2' style='width:98%;border:1px solid blue;height:100px;margin:5px;'>");
        //    //containerLocal.Append("<table width='100%' class='WebFormTable' id='tbl'> <tbody>");
        //    //containerLocal.Append("<input type='text' name='Airline' id='Text_Airline' tabindex='1' data-role='autocomplete' controltype='autocomplete' data-valid='required' data-valid-msg='Airline can not be blank'>");
        //    //containerLocal.Append("</tbody></table></div>");
        //    containerLocal.Append("<div id='div2'>");
        //    //style='width:98%;height:350px;margin:5px;margin-top:-0.5px;'
        //    containerLocal.Append("<table class='WebFormTable' id='tblEventmessageTrans'> <tbody>");
        //    containerLocal.Append("</tbody></table></div>");
        //    containerLocal.Append("<table class='WebFormTable'><tr><td class'formActiontitle'><input type='button' value='Save'  class='btn btn-success' id='btnGenerate'> </td></tr></table>");
        //    //containerLocal.Append("</div>");
        //    //containerLocal.Append("<div id=div4' style='border:1px solid green;width:48.5%;height:350px;margin:5px;'>");
        //    containerLocal.Append("</div>");
        //    return containerLocal;
        //}

        //public StringBuilder CreateEventMessageTransPageUpdate(StringBuilder container)
        //{
        //    var GroupSNo = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).GroupSNo;
        //    StringBuilder containerLocal = new StringBuilder();
        //    containerLocal.Append(@"<div id='div1'>");
        //    //style='width:98%;height:98%:'
        //    containerLocal.Append(container);
        //    //containerLocal.Append("<input id='hdnSNo' name='hdnSNo' type='hidden' value='" + this.MyRecordID + "'/>");
        //    //containerLocal.Append("<input id='hdnGroupSNo' name='hdnGroupSNo' type='hidden' value='" + GroupSNo + "'/>");
        //    //containerLocal.Append("<div id='div2' style='width:98%;border:1px solid blue;height:100px;margin:5px;'>");
        //    //containerLocal.Append("<table width='100%' class='WebFormTable' id='tbl'> <tbody>");
        //    //containerLocal.Append("<input type='text' name='Airline' id='Text_Airline' tabindex='1' data-role='autocomplete' controltype='autocomplete' data-valid='required' data-valid-msg='Airline can not be blank'>");
        //    //containerLocal.Append("</tbody></table></div>");
        //    containerLocal.Append("<div id='div2'>");
        //    //style='width:98%;height:350px;margin:5px;margin-top:-0.5px;'
        //    containerLocal.Append("<table class='WebFormTable' id='tblUpdateEventmessageTrans'> <tbody>");
        //    containerLocal.Append("</tbody></table></div>");
        //    containerLocal.Append("<table class='WebFormTable'><tr><td class'formActiontitle'><input type='button' value='Update'  class='btn btn-success' id='btnGenerate'> </td></tr></table>");
        //    //containerLocal.Append("</div>");
        //    //containerLocal.Append("<div id=div4' style='border:1px solid green;width:48.5%;height:350px;margin:5px;'>");
        //    containerLocal.Append("</div>");
        //    return containerLocal;
        //}

        //private StringBuilder TabNew()
        //{
        //    StringBuilder strBuilder = new StringBuilder();
        //    // string FormAction = CurrentPageContext.Request.QueryString["FormAction"].ToString().ToUpper().Trim();
        //    strBuilder.Append(@"<div id='spnUpdateShipmentDetail'><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='0'/><table class='WebFormTable'>");
        //    if (FormAction != "READ")
        //    strBuilder.Append(@"<div></div> <br></br><tr></tr>");
        //    strBuilder.Append(@"<tr><td><table id='tblMessageTypeMaster' width='100%'></table></td></tr><tr><td class='k-content'></td></tr></table></div>");
        //    return strBuilder;
        //}

    }
}

