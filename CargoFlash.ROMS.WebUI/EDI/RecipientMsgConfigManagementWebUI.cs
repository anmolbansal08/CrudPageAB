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
    public class RecipientMsgConfigManagementWebUI : BaseWebUISecureObject
    {
        int SNo = 0;

        public object GetRecipientMsgConfigRecord()
        {
            object recipientMsgConfig = null;
            try
            {
                if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                {
                    RecipientMsgConfig RecipientMsgConfigList = new RecipientMsgConfig();
                    object obj = (object)RecipientMsgConfigList;
                    recipientMsgConfig = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID);
                    this.MyRecordID = System.Web.HttpContext.Current.Request.QueryString["RecID"];


                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            } return recipientMsgConfig;
        }
        private DataTable GetRecipientMsgConfigTransRecord()
        {
            object RecipientMsgConfigforwardrateTrans = null;
            DataTable dtRecipientMsgConfigForwardRateTransRecord = null;
            if ((!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"])))
            {
                List<RecipientMsgConfigUpdateTrans> ULDforwardTransList = new List<RecipientMsgConfigUpdateTrans>();
                object obj = (object)ULDforwardTransList;

                RecipientMsgConfigforwardrateTrans = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, this.MyModuleID, "RecipientMsgConfigTrans");
                dtRecipientMsgConfigForwardRateTransRecord = BaseWebUISecureObject.ConvertToDataTable((List<RecipientMsgConfigUpdateTrans>)RecipientMsgConfigforwardrateTrans);
                this.MyRecordID = (System.Web.HttpContext.Current.Request.QueryString["RecID"]);
            }
            else
            {
                //Error Messgae: Record not found.
            }
            return dtRecipientMsgConfigForwardRateTransRecord;
        }
        public RecipientMsgConfigManagementWebUI()
        {
            try
            {
                this.MyModuleID = "EDI";
                this.MyAppID = "RecipientMsgConfig";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }
        public RecipientMsgConfigManagementWebUI(Page PageContext)
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
                this.MyAppID = "RecipientMsgConfig";
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
                    htmlFormAdapter.HeadingColumnName = "Text_MessageType";

                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.objFormData = GetRecipientMsgConfigRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            //htmlFormAdapter.objFormData = null;
                            //htmlFormAdapter.objDataTable = GetRecipientMsgConfigTransRecord();
                            //container.Append(htmlFormAdapter.TransInstantiateWithHeader("EDI", "RecipientMsgConfigTrans", "Read"));
                            container.Append("<div id='divRecipientMsgConfigTrans'><span id='spnRecipientMsgConfigTrans'><input id='hdnPageType' name='hdnPageType' type='hidden' value='View'/><input id='hdnRecordID' name='hdnRecordID' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value=" + this.FormAction.ToString().ToUpper().Trim() + "/><table id='tblRecipientMsgConfigTrans'></table></span></div>");

                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.objFormData = GetRecipientMsgConfigRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            //htmlFormAdapter.objFormData = null;
                           // htmlFormAdapter.objDataTable = GetRecipientMsgConfigTransRecord();
                            //container.Append(htmlFormAdapter.TransInstantiateWithHeader("EDI", "RecipientMsgConfigTrans", "EDIT", ValidateOnSubmit: true));
                            container.Append("<div id='divRecipientMsgConfigTrans'><span id='spnRecipientMsgConfigTrans'><input id='hdnPageType' name='hdnPageType' type='hidden' value='Duplicate'/><input id='hdnRecordID' name='hdnRecordID' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value=" + this.FormAction.ToString().ToUpper().Trim() + "/><table id='tblRecipientMsgConfigTrans'></table></span></div>");

                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.objFormData = GetRecipientMsgConfigRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            //htmlFormAdapter.objFormData = null;
                            //htmlFormAdapter.objDataTable = GetRecipientMsgConfigTransRecord();
                            //container.Append(htmlFormAdapter.TransInstantiateWithHeader("EDI", "RecipientMsgConfigTrans", "EDIT", ValidateOnSubmit: true));
                            container.Append("<div id='divRecipientMsgConfigTrans'><span id='spnRecipientMsgConfigTrans'><input id='hdnPageType' name='hdnPageType' type='hidden' value='Edit'/><input id='hdnRecordID' name='hdnRecordID' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value=" + this.FormAction.ToString().ToUpper().Trim() + "/><table id='tblRecipientMsgConfigTrans'></table></span></div>");

                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            //container.Append(htmlFormAdapter.TransInstantiateWithHeader("EDI", "RecipientMsgConfigTrans", ValidateOnSubmit: true));
                            container.Append("<div id='divRecipientMsgConfigTrans'><span id='spnRecipientMsgConfigTrans'><input id='hdnPageType' name='hdnPageType' type='hidden' value='New'/><input id='hdnRecordID' name='hdnRecordID' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value=" + this.FormAction.ToString().ToUpper().Trim() + "/><table id='tblRecipientMsgConfigTrans'></table></span></div>");
                            break;
                        case DisplayModeDelete:
                            htmlFormAdapter.objFormData = GetRecipientMsgConfigRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Delete;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append("<div id='divRecipientMsgConfigTrans'><span id='spnRecipientMsgConfigTrans'><input id='hdnPageType' name='hdnPageType' type='hidden' value='Delete'/><input id='hdnRecordID' name='hdnRecordID' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value=" + this.FormAction.ToString().ToUpper().Trim() + "/><table id='tblRecipientMsgConfigTrans'></table></span></div>");

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
                       // DeleteMessageTypeMaster(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                        DeleteRecipientMsgConfig(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
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
                    g.FormCaptionText = "Recipient Message Config";
                    g.CommandButtonNewText = "New Recipient Message Config";
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "RecipientType1", Title = "RecipientType", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "AirlineName", Title = "Airline", DataType = GridDataType.String.ToString() });
                   // g.Column.Add(new GridColumn { Field = "OfficeName", Title = "Office", DataType = GridDataType.String.ToString() });
                    //g.Column.Add(new GridColumn { Field = "AgentName", Title = "Agent", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "ExecutionType", Title = "Execution Type", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "MessageMovementType", Title = "Msg Movement Type", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "MessageTypeVersion", Title = "Message", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Version", Title = "Version", DataType = GridDataType.String.ToString() });
                   // g.Column.Add(new GridColumn { Field = "DestinationCountry", Title = "Country", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "OriginAirport", Title = "Origin Airport", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "DestinationCity", Title = "Destination Airport", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "FlightNo", Title = "FlightNo", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "RecipientId", Title = "Recipient Id", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "CreatedBy", Title = "Created By", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "UpdatedBy", Title = "Updated By", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Active", Title = "Active", DataType = GridDataType.String.ToString() });             
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
                //List<EventMessageTrans> listEventMessageTrans = new List<EventMessageTrans>();
                //var FormElement = System.Web.HttpContext.Current.Request.Form;
                //var eventMessageTrans = new EventMessageTrans
                //{
                //    EventSNo = Convert.ToInt32(FormElement["EventSNo"]),
                //    MessageTypeSNo = Convert.ToInt32(FormElement["MessageTypeSNo"])
                //};
                //listEventMessageTrans.Add(eventMessageTrans);
                //object datalist = (object)listEventMessageTrans;
                //DataOperationService(DisplayModeSave, datalist, MyModuleID);


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
                //List<MessageTypeMaster> listMessageTypeMaster = new List<MessageTypeMaster>();
                //var FormElement = System.Web.HttpContext.Current.Request.Form;
                //var messageTypeMaster = new MessageTypeMaster
                //{
                //    SNo = Convert.ToInt32(RecordID),
                //    MessageType = FormElement["MessageType"].ToString(),
                //    MessageDescription = FormElement["MessageDescription"].ToString(),
                //    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()
                //};
                //listMessageTypeMaster.Add(messageTypeMaster);
                //object datalist = (object)listMessageTypeMaster;
                //DataOperationService(DisplayModeUpdate, datalist, MyModuleID);
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            }
        }
        private void DeleteRecipientMsgConfig(string RecordID)
        {
            try
            {
                //DeleteMessageTypeMaster

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
    }
}
