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
    public class MessageTypeMasterManagementWebUI : BaseWebUISecureObject
    {
        int SNo = 0;

        public object GetMessageTypeMasterRecord()
        {
            object messageTypeMaster = null;
            try
            {
                if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                {
                    MessageTypeMaster MessageTypeMasterList = new MessageTypeMaster();
                    object obj = (object)MessageTypeMasterList;
                    messageTypeMaster = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID);
                    this.MyRecordID = System.Web.HttpContext.Current.Request.QueryString["RecID"];


                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            } return messageTypeMaster;
        }
        private DataTable GetMessageTypeMasterTransRecord()
        {
            object MessageTypeforwardrateTrans = null;
            DataTable dtCreateMessageTypeForwardRateTransRecord = null;
            if ((!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"])))
            {
                List<MessageTypeMasterTrans> ULDforwardTransList = new List<MessageTypeMasterTrans>();
                object obj = (object)ULDforwardTransList;

                MessageTypeforwardrateTrans = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, this.MyModuleID, "MessageTypeMasterTrans");
                dtCreateMessageTypeForwardRateTransRecord = BaseWebUISecureObject.ConvertToDataTable((List<MessageTypeMasterTrans>)MessageTypeforwardrateTrans);
                this.MyRecordID = (System.Web.HttpContext.Current.Request.QueryString["RecID"]);
            }
            else
            {
                //Error Messgae: Record not found.
            }
            return dtCreateMessageTypeForwardRateTransRecord;
        }
        public MessageTypeMasterManagementWebUI()
        {
            try
            {
                this.MyModuleID = "EDI";
                this.MyAppID = "MessageTypeMaster";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }
        public MessageTypeMasterManagementWebUI(Page PageContext)
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
                this.MyAppID = "MessageTypeMaster";
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
                    htmlFormAdapter.HeadingColumnName = "MessageType";

                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.objFormData = GetMessageTypeMasterRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            htmlFormAdapter.objFormData = null;
                            htmlFormAdapter.objDataTable = GetMessageTypeMasterTransRecord();
                            container.Append(htmlFormAdapter.TransInstantiateWithHeader("EDI", "MessageTypeMasterTrans", "Read"));

                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.objFormData = GetMessageTypeMasterRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            htmlFormAdapter.objFormData = null;
                            htmlFormAdapter.objDataTable = GetMessageTypeMasterTransRecord();
                            container.Append(CreateStockManagementDetailsPage(htmlFormAdapter.TransInstantiateWithHeader("EDI", "MessageTypeMasterTrans","EDIT", ValidateOnSubmit: true)));
                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.objFormData = GetMessageTypeMasterRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            htmlFormAdapter.objFormData = null;
                            htmlFormAdapter.objDataTable = GetMessageTypeMasterTransRecord();
                            container.Append(CreateStockManagementDetailsPage(htmlFormAdapter.TransInstantiateWithHeader("EDI", "MessageTypeMasterTrans", "EDIT", ValidateOnSubmit: true)));

                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append(CreateStockManagementDetailsPage(htmlFormAdapter.TransInstantiateWithHeader("EDI", "MessageTypeMasterTrans", ValidateOnSubmit: true)));
                            //container.Append(TabNew());
                            break;
                        case DisplayModeDelete:
                            htmlFormAdapter.objFormData = GetMessageTypeMasterRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Delete;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            htmlFormAdapter.objFormData = null;
                            htmlFormAdapter.objDataTable = GetMessageTypeMasterTransRecord();
                            container.Append(htmlFormAdapter.TransInstantiateWithHeader("EDI", "MessageTypeMasterTrans", "Read"));
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
                        SaveMessageTypeMaster();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                        break;
                    case DisplayModeSaveAndNew:
                        SaveMessageTypeMaster();
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
                    g.ServiceModuleName = this.MyModuleID;
                    g.FormCaptionText = "Message Type";
                    g.CommandButtonNewText = "New Message Type";
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "MessageType", Title = "Message Type", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "MessageSubType", Title = "Message Sub Type", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "MessageDescription", Title = "Message Description", DataType = GridDataType.String.ToString() });
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
        private void SaveMessageTypeMaster()
        {
            try
            {
                List<MessageTypeMaster> listMessageTypeMaster = new List<MessageTypeMaster>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var messageTypeMaster = new MessageTypeMaster
                {
                    //SNo=Convert.ToInt32(FormElement["SNo"]),
                    MessageType = FormElement["MessageType"].ToString(),
                    MessageDescription = FormElement["MessageDescription"].ToString(),//not null
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()
                };
                listMessageTypeMaster.Add(messageTypeMaster);
                object datalist = (object)listMessageTypeMaster;
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
                List<MessageTypeMaster> listMessageTypeMaster = new List<MessageTypeMaster>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var messageTypeMaster = new MessageTypeMaster
                {
                    //SNo = Convert.ToInt32(RecordID),
                    //MessageType = FormElement["MessageType"].ToString(),
                    MessageDescription = FormElement["MessageDescription"].ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()
                };
                listMessageTypeMaster.Add(messageTypeMaster);
                object datalist = (object)listMessageTypeMaster;
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


        public StringBuilder CreateStockManagementDetailsPage(StringBuilder container)
        {
            var GroupSNo = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).GroupSNo;
            StringBuilder containerLocal = new StringBuilder();
            containerLocal.Append(@"<div id='divTab1'> <span id='spnOfficeInformation'>");
            containerLocal.Append(container);
            containerLocal.Append("<input id='hdnFormData' name='hdnFormData' type='hidden' />");
            //containerLocal.Append("<input id='hdnGroupSNo' name='hdnGroupSNo' type='hidden' value='" + GroupSNo + "'/>");
            containerLocal.Append("<table class='WebFormTable'><tr><td class'formActiontitle'><input type='button' value='Save'  class='btn btn-success' id='btnGenerate'> </td></tr></table>");
            containerLocal.Append("</span> </div>");
            return containerLocal;
        }
    }
}
