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
using CargoFlash.Cargo.Model.Permissions;
using System.Collections;
using CargoFlash.Cargo.Business;

namespace CargoFlash.Cargo.WebUI.Permissions
{
    public class ProcessDependencyManagementWebUI : BaseWebUISecureObject
    {
          public ProcessDependencyManagementWebUI(Page PageContext)
        {
            if (this.SetCurrentPageContext(PageContext))
            {
                this.ErrorNumber = 0;
                this.ErrorMessage = "";
            }
            this.MyPageName = "Default.cshtml";
            this.MyModuleID = "Permissions";
            this.MyAppID = "ProcessDependency ";
            this.MyPrimaryID = "SNo";
        }

        public ProcessDependencyManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Permissions";
                this.MyAppID = "ProcessDependency";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }


        public StringBuilder CreateWebForm(StringBuilder container)
        {
            StringBuilder strContent = new StringBuilder();
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


        private void UpdateProcessDependency(string RecordID)
        {
            try
            {
                System.Web.Script.Serialization.JavaScriptSerializer js = new System.Web.Script.Serialization.JavaScriptSerializer();

                var FormElement = System.Web.HttpContext.Current.Request.Form;
                ProcessDependency pc = new ProcessDependency();
                var e = js.Deserialize<List<ProcessDependencyGridAppendGrid>>(CargoFlash.Cargo.Business.Common.Base64ToString(FormElement["hdnFormData"]));

               

                var formData = new ProcessDependencyTransSave
                {
                    SNo = Convert.ToInt32(RecordID),
                    AirlineSNo = Convert.ToInt32(FormElement["AirlineSNo"]),
                    CitySNo = Convert.ToInt32(FormElement["CitySNo"] == "" ? "0" : FormElement["CitySNo"]),
                    AirportSNo = Convert.ToInt32(FormElement["AirportSNo"] == "" ? "0" : FormElement["AirportSNo"]),
                    TerminalSNo = Convert.ToInt32(FormElement["TerminalSNo"] == "" ? "0" : FormElement["TerminalSNo"]),
                    TransactionType = Convert.ToInt16(FormElement["TransactionType"] == "" ? "0" : FormElement["TransactionType"]),
                    ProcessDependencyTransData = e
                };
                object datalist = (object)formData;
                DataOperationService(DisplayModeUpdate, datalist, MyModuleID);
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
            }
        }

        public override void DoPostBack()
        {
            try
            {
                this.OperationMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
                switch (OperationMode)
                {
                    case DisplayModeSave:
                        SaveProcessDependencyTrans();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                        break;
                    case DisplayModeSaveAndNew:
                        SaveProcessDependencyTrans();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                        break;
                    case DisplayModeUpdate:
                        UpdateProcessDependency(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                        break;

                    case DisplayModeDelete:

                        DeleteProcessDependency(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
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

        private void DeleteProcessDependency(string RecordID)
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
        private StringBuilder CreateGrid(StringBuilder Container)
        {
            try
            {
                using (Grid g = new Grid())
                {
                    g.CommandButtonNewText = "New Process Dependency";
                    g.FormCaptionText = "Process Dependency";
                    g.PrimaryID = this.MyPrimaryID;
                    g.PageName = this.MyPageName;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.ServiceModuleName = this.MyModuleID;
                    g.DataSoruceUrl = "Services/Permissions/ProcessDependencyService.svc/GetGridData";
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "SNo", Title = "SNo", DataType = GridDataType.String.ToString(),IsHidden=true });
                    g.Column.Add(new GridColumn { Field = "AirlineName", Title = "Airline Name", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "AirportName", Title = "Airport Name", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "CityName", Title = "City Name", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "TerminalName", Title = "Terminal Name", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "TransactionTypeName", Title = "Transaction Type", DataType = GridDataType.String.ToString() });
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



        public StringBuilder BuildFormView(string DisplayMode, StringBuilder container)
        {
            try
            {
                using (HtmlFormAdapter htmlFormAdapter = new HtmlFormAdapter(MyModuleID))
                {
                    htmlFormAdapter.CurrentPage = this.CurrentPageContext;
                    htmlFormAdapter.HeadingColumnName = "Text_AirlineSNo";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.objFormData = GetProcessDependencyRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            container.Append(CreateProcessDependencyTransPageUpdate(htmlFormAdapter.InstantiateIn()));
                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.objFormData = GetProcessDependencyRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(CreateProcessDependencyTransPageUpdate(htmlFormAdapter.InstantiateIn()));
                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.objFormData = GetProcessDependencyRecord();
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(CreateProcessDependencyTransPageUpdate(htmlFormAdapter.InstantiateIn()));
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(CreateProcessDependencyTransPage(htmlFormAdapter.InstantiateIn()));
                            break;

                        case DisplayModeDelete:
                            htmlFormAdapter.objFormData = GetProcessDependencyRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Delete;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(CreateProcessDependencyTransPageUpdate(htmlFormAdapter.InstantiateIn()));
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
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
            return container;
        }

        public object GetProcessDependencyRecord()
        {
            object ProcessDependency = null;
            try
            {
                if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                {
                    ProcessDependency ProcessDependencyrList = new ProcessDependency();
                    object obj = (object)ProcessDependencyrList;
                    ProcessDependency = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID);
                    this.MyRecordID = System.Web.HttpContext.Current.Request.QueryString["RecID"];


                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            } return ProcessDependency;
        }
        public StringBuilder CreateProcessDependencyTransPageUpdate(StringBuilder container)
        {
            var GroupSNo = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).GroupSNo;
            StringBuilder containerLocal = new StringBuilder();
            containerLocal.Append(@"<div id='div1'>");
            containerLocal.Append(container);
            containerLocal.Append("<input id='hdnFormData' name='hdnFormData' type='hidden'/>");
            containerLocal.Append("<div id='div2'>");
            containerLocal.Append("<table class='WebFormTable' validateonsubmit='true' id='tblProcessDependencyTrans'> <tbody>");
            containerLocal.Append("</tbody></table></div>");
            containerLocal.Append("</div>");
            return containerLocal;
        }
        public StringBuilder CreateProcessDependencyTransPage(StringBuilder container)
        {
            var GroupSNo = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).GroupSNo;
            StringBuilder containerLocal = new StringBuilder();
            containerLocal.Append(@"<div id='div1'>");
            containerLocal.Append(container);
            containerLocal.Append("<input id='hdnFormData' name='hdnFormData' type='hidden'/>");
            containerLocal.Append("<div id='div2'>");
            containerLocal.Append("<table class='WebFormTable' validateonsubmit='true' id='tblProcessDependencyTrans'> <tbody>");
            containerLocal.Append("</tbody></table></div>");
            containerLocal.Append("</div>");
            return containerLocal;
        }
        private void SaveProcessDependencyTrans()
        {
            try
            {
                System.Web.Script.Serialization.JavaScriptSerializer js = new System.Web.Script.Serialization.JavaScriptSerializer();

                var FormElement = System.Web.HttpContext.Current.Request.Form;

                List<ProcessDependencyGridAppendGrid> e = js.Deserialize<List<ProcessDependencyGridAppendGrid>>(CargoFlash.Cargo.Business.Common.Base64ToString(FormElement["hdnFormData"]));
                var formData = new ProcessDependencyTransSave
                {

                    SNo = FormElement["SNo"] != "" ? Convert.ToInt32 ( FormElement["SNo"]) : 0,
                    AirlineSNo = Convert.ToInt32(FormElement["AirlineSNo"]),
                    CitySNo = FormElement["CitySNo"]!="" ? Convert.ToInt32(FormElement["CitySNo"]): 0,
                    AirportSNo =FormElement["AirportSNo"]!="" ? Convert.ToInt32(FormElement["AirportSNo"]): 0 ,
                    TerminalSNo =FormElement["TerminalSNo"]!="" ? Convert.ToInt32(FormElement["TerminalSNo"]): 0,
                    TransactionType =FormElement["TransactionType"]!="" ? Convert.ToInt16(FormElement["TransactionType"]): Convert.ToInt16(0),
                    ProcessDependencyTransData = e
                  
                };
                object datalist = (object)formData;
                DataOperationService(DisplayModeSave, datalist, MyModuleID);
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            }

        }

    }
}
