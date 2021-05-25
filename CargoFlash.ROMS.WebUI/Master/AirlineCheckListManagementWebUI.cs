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
using CargoFlash.Cargo.Model.Master;
using System.Collections;
using System.Web;


namespace CargoFlash.Cargo.WebUI.Master
{
    public class AirlineCheckListManagementWebUI : BaseWebUISecureObject
    {
        public object GetRecordAirlineCheckList()
        {

            object AirlineCL = null;
            try
            {
                if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                {
                    AirlineCheckList AirlineCList = new AirlineCheckList();
                    object obj = (object)AirlineCList;
                    AirlineCL = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, this.MyModuleID);
                    this.MyRecordID = (System.Web.HttpContext.Current.Request.QueryString["RecID"]);
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

            } return AirlineCL;
        }
        public AirlineCheckListManagementWebUI(Page PageContext)
        {
            try
            {
                if (this.SetCurrentPageContext(PageContext))
                {
                    this.ErrorNumber = 0;
                    this.ErrorMessage = "";
                }
                this.MyPageName = "Default.aspx";
                this.MyModuleID = "Master";
                this.MyAppID = "AirlineCheckList";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }
        public AirlineCheckListManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Master";
                this.MyAppID = "AirlineCheckList";
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
                            htmlFormAdapter.objFormData = GetRecordAirlineCheckList();
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append("<input id='hdnSNo' name='hdnSNo' type='hidden' value='" + this.MyRecordID + "'/>");
                            //container.Append(AirlineTransTab(htmlFormAdapter.InstantiateIn()));
                            //container.Append("<input type='hidden' id='hdnTXTAirlinesno' name='hdnTXTAirlinesno' value=" + ((CargoFlash.Cargo.Model.Master.Airline)(htmlFormAdapter.objFormData)).SNo.ToString() + " /><input type='hidden' id='hdnIsCCAllowed' name='hdnIsCCAllowed' value=" + ((CargoFlash.Cargo.Model.Master.Airline)(htmlFormAdapter.objFormData)).IsCCAllowed.ToString() + " /><input type='hidden' id='hdnIsPartAllowed' name='hdnIsPartAllowed' value=" + ((CargoFlash.Cargo.Model.Master.Airline)(htmlFormAdapter.objFormData)).IsPartAllowed.ToString() + " />");
                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.objFormData = GetRecordAirlineCheckList();
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append("<input id='hdnSNo' name='hdnSNo' type='hidden' value='" + this.MyRecordID + "'/>");
                           // container.Append(AirlineTransTab(htmlFormAdapter.InstantiateIn()));
                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.objFormData = (AirlineCheckList)GetRecordAirlineCheckList();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append("<input id='hdnSNo' name='hdnSNo' type='hidden' value='" + this.MyRecordID + "'/>");
                            //container.Append(AirlineTransTab(htmlFormAdapter.InstantiateIn()));
                            //container.Append("<input type='hidden' id='hdnTXTAirlinesno' name='hdnTXTAirlinesno' value=" + ((CargoFlash.Cargo.Model.Master.Airline)(htmlFormAdapter.objFormData)).SNo.ToString() + " /><input type='hidden' id='hdnIsCCAllowed' name='hdnIsCCAllowed' value=" + ((CargoFlash.Cargo.Model.Master.Airline)(htmlFormAdapter.objFormData)).IsCCAllowed.ToString() + " /><input type='hidden' id='hdnIsPartAllowed' name='hdnIsPartAllowed' value=" + ((CargoFlash.Cargo.Model.Master.Airline)(htmlFormAdapter.objFormData)).IsPartAllowed.ToString() + " />");
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                           // container.Append(AirlineTransTab(htmlFormAdapter.InstantiateIn()));
                            break;
                        case DisplayModeDelete:
                            htmlFormAdapter.objFormData = GetRecordAirlineCheckList();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Delete;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append("<input id='hdnSNo' name='hdnSNo' type='hidden' value='" + this.MyRecordID + "'/>");
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
        private StringBuilder CreateGrid(StringBuilder Container)
        {
            try
            {
                using (Grid g = new Grid())
                {
                    g.CommandButtonNewText = "New Airline SHC CheckList";
                    g.FormCaptionText = "Airline SHC Checklist";
                    g.PrimaryID = this.MyPrimaryID;
                    g.PageName = this.MyPageName;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;

                    g.ServiceModuleName = this.MyModuleID;
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "AirlineName", Title = "Airline Name", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Code", Title = "Code", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "name", Title = "Group Name", DataType = GridDataType.String.ToString() });

                    g.Column.Add(new GridColumn { Field = "CheckListType", Title = "Checklist Type", DataType = GridDataType.String.ToString() });
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
        public override void DoPostBack()
        {
            //try
            //{

            this.OperationMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
            switch (OperationMode)
            {
                case DisplayModeSave:
                    SaveAirlineCheckList();
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                    break;
                case DisplayModeSaveAndNew:
                    SaveAirlineCheckList();
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                    break;
                case DisplayModeUpdate:

                    UpdateAirlineCheckList(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                    break;

                case DisplayModeDelete:
                    DeleteAirlineCheckList(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2002), false);
                    break;
            }
        }
        private void SaveAirlineCheckList()
        {
            try
            {
                List<AirlineCList> listAirlineCList = new List<AirlineCList>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var AirlineCList = new AirlineCList
                {
                    AirlineSNo = FormElement["AirlineName"].ToUpper(),
                    SPHCSNo = FormElement["Code"].ToUpper(),
                    CheckListType = FormElement["CheckListType"].ToUpper(),
                    IsGroup = FormElement["ISGROUP"].ToString(),
                    SPHGroup = FormElement["SPHCGroup"].ToString(),
                };
                listAirlineCList.Add(AirlineCList);
                object datalist = (object)listAirlineCList;
                DataOperationService(DisplayModeSave, datalist, MyModuleID);
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
            }
        }
        private void UpdateAirlineCheckList(string RecordID)
        {
            try
            {
                List<AirlineCList> listAirlineCList = new List<AirlineCList>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var AirlineCList = new AirlineCList
                {
                    SNo = Convert.ToInt32(FormElement["hdnSNo"].ToString()),
                    AirlineSNo = FormElement["AirlineName"].ToUpper(),
                    SPHCSNo = FormElement["Code"].ToUpper(),
                    CheckListType = FormElement["CheckListType"].ToUpper(),
                    IsGroup = FormElement["ISGROUP"].ToString(),
                    SPHGroup = FormElement["SPHCGroup"].ToString(),
                };
                listAirlineCList.Add(AirlineCList);
                object datalist = (object)listAirlineCList;
                DataOperationService(DisplayModeUpdate, datalist, MyModuleID);
                {
                    //ErrorNumer
                    //Error Message
                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
            }

        }
        private void DeleteAirlineCheckList(string RecordID)
        {
            try
            {
                List<string> listID = new List<string>();
                listID.Add(RecordID);
                listID.Add(MyUserID.ToString());
                object recordID = (object)listID;
                DataOperationService(DisplayModeDelete, recordID, MyModuleID);
                {
                    //ErrorNumer
                    //Error Message
                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
            }
        }
    }
}
