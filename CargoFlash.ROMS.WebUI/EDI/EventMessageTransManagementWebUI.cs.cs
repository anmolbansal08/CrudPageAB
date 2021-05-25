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
using CargoFlash.Cargo.Model.EDI;
using System.Collections;
using CargoFlash.Cargo.WebUI;

namespace CargoFlash.Cargo.WebUI.EDI
{
    public class EventMessageTransManagementWebUI: BaseWebUISecureObject
     {
         int SNo = 0;

         public object GetEventMessageTransRecord()
        {
            object eventMessageTrans = null;
            try
            {
                if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                {
                    EventMessageTrans MessageTypeMasterList = new EventMessageTrans();
                    object obj = (object)MessageTypeMasterList;
                    eventMessageTrans = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID);
                    this.MyRecordID = System.Web.HttpContext.Current.Request.QueryString["RecID"];
                  

                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            } return eventMessageTrans;
        }
        public EventMessageTransManagementWebUI()
        {
            try
            {
                this.MyModuleID = "EDI";
                this.MyAppID = "EventMessageTrans";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }
        public EventMessageTransManagementWebUI(Page PageContext)
        {
            try
            {
                if (this.SetCurrentPageContext(PageContext))
                {
                    this.ErrorNumber = 0;
                    this.ErrorMessage = "";
                }
                this.MyPageName = "Default.aspx";
                this.MyModuleID = "EDI";
                this.MyAppID = "EventMessageTrans";
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
                    htmlFormAdapter.HeadingColumnName = "Text_AirlineName";

                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.objFormData = GetEventMessageTransRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            container.Append(CreateEventMessageTransPageUpdate(htmlFormAdapter.InstantiateIn()));
                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.objFormData = GetEventMessageTransRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(CreateEventMessageTransPageUpdate(htmlFormAdapter.InstantiateIn()));
                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.objFormData = GetEventMessageTransRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(CreateEventMessageTransPageUpdate(htmlFormAdapter.InstantiateIn()));
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(CreateEventMessageTransPage(htmlFormAdapter.InstantiateIn()));
                            //container.Append(htmlFormAdapter.TransInstantiateWithHeader("EDI", "EventMessageTransOne", ValidateOnSubmit: true));
                            //container.Append(TabNew());
                            break;
                        case DisplayModeDelete:
                            htmlFormAdapter.objFormData = GetEventMessageTransRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Delete;
                          //  htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(CreateEventMessageTransPageUpdate(htmlFormAdapter.InstantiateIn()));
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
                        SaveEventMessageTrans();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                        break;
                    case DisplayModeSaveAndNew:
                        SaveEventMessageTrans();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                        break;
                    case DisplayModeUpdate:
                        UpdateMessageTypeMaster(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
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
                   // g.IsShowDelete = false;
                    g.ServiceModuleName = this.MyModuleID;
                    g.FormCaptionText = "Event Message Config";
                    g.CommandButtonNewText = "New Event Message Config";
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "AirlineName", Title = "Airline Name", DataType = GridDataType.String.ToString() });
                 //   g.Column.Add(new GridColumn { Field = "SubProcess", Title = "Sub Process", DataType = GridDataType.String.ToString() });
                    //g.Column.Add(new GridColumn { Field = "EventName", Title = "Event Name", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "MessageType", Title = "Message Type", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "CreatedBy", Title = "Created By", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "UpdatedBy", Title = "Updated By", DataType = GridDataType.String.ToString() });
                    
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
        private void SaveEventMessageTrans()
        {
            try
            {
                System.Web.Script.Serialization.JavaScriptSerializer js = new System.Web.Script.Serialization.JavaScriptSerializer();

                var FormElement = System.Web.HttpContext.Current.Request.Form;

                List<EventMessageGridAppendGrid> e = js.Deserialize<List<EventMessageGridAppendGrid>>(CargoFlash.Cargo.Business.Common.Base64ToString(FormElement["hdnFormData"]));
                var formData = new EventMessageTransSave
                {
                    SNo=Convert.ToInt32(FormElement["SNo"]),
                    AirlineSNo=FormElement["AirlineName"].ToString(),
                    UserSNo= ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    EventTransData =e
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
        private void UpdateMessageTypeMaster(string RecordID)
        {
            try
            {
                System.Web.Script.Serialization.JavaScriptSerializer js = new System.Web.Script.Serialization.JavaScriptSerializer();

                var FormElement = System.Web.HttpContext.Current.Request.Form;

                var e = js.Deserialize<List<EventMessageGridAppendGrid>>(CargoFlash.Cargo.Business.Common.Base64ToString(FormElement["hdnFormData"]));
               
                var formData = new EventMessageTransSave
                {
                    SNo = Convert.ToInt32(RecordID),
                    AirlineSNo = FormElement["AirlineName"].ToString(),
                    UserSNo = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    EventTransData = e
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
        private void DeleteMessageTypeMaster(string RecordID)
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

        public StringBuilder CreateEventMessageTransPage(StringBuilder container)
        {
            var GroupSNo = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).GroupSNo;
            StringBuilder containerLocal = new StringBuilder();
            containerLocal.Append(@"<div id='div1'>");
            //style='width:98%;height:98%:'
            containerLocal.Append(container);
            containerLocal.Append("<input id='hdnFormData' name='hdnFormData' type='hidden'/>");
            //containerLocal.Append("<input id='hdnGroupSNo' name='hdnGroupSNo' type='hidden' value='" + GroupSNo + "'/>");
            //containerLocal.Append("<div id='div2' style='width:98%;border:1px solid blue;height:100px;margin:5px;'>");
            //containerLocal.Append("<table width='100%' class='WebFormTable' id='tbl'> <tbody>");
            //containerLocal.Append("<input type='text' name='Airline' id='Text_Airline' tabindex='1' data-role='autocomplete' controltype='autocomplete' data-valid='required' data-valid-msg='Airline can not be blank'>");
            //containerLocal.Append("</tbody></table></div>");
            containerLocal.Append("<div id='div2'>");
            //style='width:98%;height:350px;margin:5px;margin-top:-0.5px;'
            containerLocal.Append("<table class='WebFormTable' id='tblEventmessageTrans' validateonsubmit='true' > <tbody>");
            containerLocal.Append("</tbody></table></div>");
            //containerLocal.Append("<table class='WebFormTable'><tr><td class'formActiontitle'><input type='button' value='Save'  class='btn btn-success' id='btnGenerate'> </td></tr></table>");
            //containerLocal.Append("</div>");
            //containerLocal.Append("<div id=div4' style='border:1px solid green;width:48.5%;height:350px;margin:5px;'>");
            containerLocal.Append("</div>");
            return containerLocal;
        }

        public StringBuilder CreateEventMessageTransPageUpdate(StringBuilder container)
        {
            var GroupSNo = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).GroupSNo;
            StringBuilder containerLocal = new StringBuilder();
            containerLocal.Append(@"<div id='div1'>");
            //style='width:98%;height:98%:'
            containerLocal.Append(container);
            containerLocal.Append("<input id='hdnFormData' name='hdnFormData' type='hidden'/>");
            //containerLocal.Append("<input id='hdnSNo' name='hdnSNo' type='hidden' value='" + this.MyRecordID + "'/>");
            //containerLocal.Append("<input id='hdnGroupSNo' name='hdnGroupSNo' type='hidden' value='" + GroupSNo + "'/>");
            //containerLocal.Append("<div id='div2' style='width:98%;border:1px solid blue;height:100px;margin:5px;'>");
            //containerLocal.Append("<table width='100%' class='WebFormTable' id='tbl'> <tbody>");
            //containerLocal.Append("<input type='text' name='Airline' id='Text_Airline' tabindex='1' data-role='autocomplete' controltype='autocomplete' data-valid='required' data-valid-msg='Airline can not be blank'>");
            //containerLocal.Append("</tbody></table></div>");
            containerLocal.Append("<div id='div2'>");
            //style='width:98%;height:350px;margin:5px;margin-top:-0.5px;'
            containerLocal.Append("<table class='WebFormTable' id='tblEventmessageTrans'  validateonsubmit='true'> <tbody>");
            containerLocal.Append("</tbody></table></div>");
            //containerLocal.Append("<table class='WebFormTable'><tr><td class'formActiontitle'><input type='button' value='Update'  class='btn btn-success' id='btnGenerate'> </td></tr></table>");
            //containerLocal.Append("</div>");
            //containerLocal.Append("<div id=div4' style='border:1px solid green;width:48.5%;height:350px;margin:5px;'>");
            containerLocal.Append("</div>");
            return containerLocal;
        }

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
