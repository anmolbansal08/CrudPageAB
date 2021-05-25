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
using CargoFlash.Cargo.Business;

namespace CargoFlash.Cargo.WebUI.Master
{
    public class CheckListTypeManagementWebUI : BaseWebUISecureObject
    {
        int SNo = 0;

        public object GetCheckListTypeRecord()
        {
            object checkListType = null;
            try
            {
                if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                {
                    CheckListType CheckListTypeList = new CheckListType();
                    object obj = (object)CheckListTypeList;
                    checkListType = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID);
                    this.MyRecordID = System.Web.HttpContext.Current.Request.QueryString["RecID"];


                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            } return checkListType;
        }

        public CheckListTypeManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Master";
                this.MyAppID = "CheckListType";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }

        public CheckListTypeManagementWebUI(Page PageContext)
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
                this.MyAppID = "CheckListType";
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
                    htmlFormAdapter.HeadingColumnName = "Name";

                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.objFormData = GetCheckListTypeRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            container.Append(CheckListTypetabs(htmlFormAdapter.InstantiateIn()));
                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.objFormData = GetCheckListTypeRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(CheckListTypetabs(htmlFormAdapter.InstantiateIn()));
                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.objFormData = GetCheckListTypeRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(CheckListTypetabs(htmlFormAdapter.InstantiateIn()));
                            //container.Append(CheckListTypetabs(htmlFormAdapter.InstantiateIn()));
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(CheckListTypetabs(htmlFormAdapter.InstantiateIn()));
                            break;
                        case DisplayModeDelete:
                            htmlFormAdapter.objFormData = GetCheckListTypeRecord();
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
                        SaveCheckListType();

                        if (ErrorMessageList.Count > 0)
                        {
                            if (ErrorMessageList[0] == "0")
                                ErrorMessage = ErrorMessage.Replace("<li>0</li>", string.Empty);
                            else
                            {
                                this.MyRecordID = ErrorMessageList[0].Split('-')[1];
                                ErrorMessage = "";
                                System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", true), false);
                            }
                        }

                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                        break;
                    case DisplayModeSaveAndNew:
                        SaveCheckListType();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                        break;
                    case DisplayModeUpdate:
                        UpdateCheckListType(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                        break;

                    case DisplayModeDelete:
                        DeleteMessageTypeMaster(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                        if (!string.IsNullOrEmpty(ErrorMessage))
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
                    g.FormCaptionText = "Checklist Type";
                    g.CommandButtonNewText = "New Checklist Type";
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "Name", Title = "Name", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "AirlineName", Title = "Airline", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "AirportName", Title = "Airport", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "SPHCCode", Title = "SHC Code", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "SPHCGroupName", Title = "SHC Group Name", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "ISIATA", Title = "IATA", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "ISSAS", Title = "CTO", DataType = GridDataType.String.ToString() });
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

        private void SaveCheckListType()
        {
            try
            {
                List<CheckListType> listCheckListType = new List<CheckListType>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var checkListType = new CheckListType
                {
                    Name = FormElement["Name"].ToString(),
                    For = Convert.ToInt32(FormElement["FOR"]),
                    AirportSNo = FormElement["AirportName"] == "" ? 0 : Convert.ToInt32(FormElement["AirportName"]),
                    SHC = Convert.ToInt32(FormElement["SHC"]),
                    SPHCCode = FormElement["SHC"] == "0" ? FormElement["Text_SPHCCode"].ToString() : "",
                    SPHCSNo = FormElement["SHC"] == "0" ? Convert.ToInt32(FormElement["SPHCCode"]) : 0,
                    SPHCGroupSNo = FormElement["SHC"] == "1" ? Convert.ToInt32(FormElement["SPHCCode"]) : 0,
                    IsIATA = FormElement["FOR"] == "0" ? true : false,
                    IsSAS = FormElement["FOR"] == "1" ? true : false,
                    Text_CopyFrom = FormElement["Text_SPHCCode"].ToString(),
                    CopyFrom = FormElement["CopyFrom"] == "" ? 0 : Convert.ToInt32(FormElement["CopyFrom"]),
                    AirlineSNo = FormElement["AirlineName"] == "" ? "0" : FormElement["AirlineName"].ToString(),
                    EnteredBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo,
                    ChecklistVersion = FormElement["ChecklistVersion"].ToString(),
                    GeneralHeader = FormElement["GeneralHeader"].ToString(),
                    GeneralFooter = FormElement["GeneralFooter"].ToString(),
                    ColumnName1 = FormElement["ColumnName1"].ToString(),
                   ColumnName2 = FormElement["ColumnName2"].ToString(),
                   ColumnName3 = FormElement["ColumnName3"].ToString(),
                    Type = FormElement["Type"] == "" ? "0" : FormElement["Type"].ToString(),
                    Text_Type = FormElement["Text_Type"].ToString(),
                    SPHCSubGroupSNo = FormElement["SPHCSubGroupSNo"].ToString(),
                    Text_SPHCSubGroupSNo = FormElement["Text_SPHCSubGroupSNo"].ToString(),
                };
                listCheckListType.Add(checkListType);
                object datalist = (object)listCheckListType;
                DataOperationService(DisplayModeSave, datalist, MyModuleID);
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
            }
        }

        private void UpdateCheckListType(string RecordID)
        {
            try
            {
                List<CheckListType> listCheckListType = new List<CheckListType>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var checkListType = new CheckListType
                {
                    Name = FormElement["Name"].ToString(),
                    For = Convert.ToInt32(FormElement["FOR"]),
                    AirportSNo = FormElement["AirportName"] == "" ? 0 : Convert.ToInt32(FormElement["AirportName"]),
                    SNo = Convert.ToInt32(FormElement["SNo"]),
                    SHC = Convert.ToInt32(FormElement["SHC"]),
                    SPHCCode = FormElement["SHC"] == "0" ? FormElement["Text_SPHCCode"].ToString() : "",
                    SPHCSNo = FormElement["SHC"] == "0" ? Convert.ToInt32(FormElement["SPHCCode"]) : 0,
                    SPHCGroupSNo = FormElement["SHC"] == "1" ? Convert.ToInt32(FormElement["SPHCCode"]) : 0,
                    IsIATA = FormElement["FOR"] == "0" ? true : false,
                    IsSAS = FormElement["FOR"] == "1" ? true : false,
                    AirlineSNo = FormElement["AirlineName"] == "" ? "0" : FormElement["AirlineName"].ToString(),
                    EnteredBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo,
                    ChecklistVersion = FormElement["ChecklistVersion"].ToString(),
                    GeneralHeader = FormElement["GeneralHeader"].ToString(),
                    GeneralFooter = FormElement["GeneralFooter"].ToString(),
                    ColumnName1 = FormElement["ColumnName1"].ToString(),
                    ColumnName2 = FormElement["ColumnName2"].ToString(),
                    ColumnName3 = FormElement["ColumnName3"].ToString(),
                    Type = FormElement["Type"] == "" ? "0" : FormElement["Type"].ToString(),
                    Text_Type = FormElement["Text_Type"].ToString(),
                    SPHCSubGroupSNo = FormElement["SPHCSubGroupSNo"].ToString(),
                    Text_SPHCSubGroupSNo = FormElement["Text_SPHCSubGroupSNo"].ToString(),

                };
                listCheckListType.Add(checkListType);
                object datalist = (object)listCheckListType;
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

        private void DeleteMessageTypeMaster(string RecordID)
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

        public StringBuilder CheckListTypetabs(StringBuilder container)
        {
            StringBuilder containerLocal = new StringBuilder();
            containerLocal.Append(@"
            <div id='MainDiv'>
            <div id='CheckListTypeTabs'>
            <ul>
                <li  id='liCheckListType' class='k-state-active'>Checklist</li>
                <li id='liCheckListHeader'>Checklist Header</li>
                <li id='liCheckListDetail'>Checklist Detail</li>
            </ul>
            <div id='divTab1'> 
              ");
            containerLocal.Append(container);
            containerLocal.Append(@" </div> <div id='divTab2'> <table class='WebFormTable' id='tblCheckListType'  width='100%'> <tbody> </tbody></table><table class='WebFormTable' id='tblCheckListType2'  width='100%'><tr><td class'formActiontitle'><input type='button' value='Save' class='btn btn-success' id='btnGenerate'><input type='button' value='Back' class='btn btn-inverse' onclick='javascript:BackButton();'> </td></tr></table></div>");
            containerLocal.Append(@"<div id='divTab3'> <table class='WebFormTable' id='tblCheckListDetail'  width='100%'> <tbody> </tbody></table><table class='WebFormTable' id='tblCheckListDetail2'  width='100%'><tr><td class'formActiontitle'><input type='button' value='Save' class='btn btn-success' id='btnGenerateDetail'><input type='button' value='Back' class='btn btn-inverse' onclick='javascript:BackButton();'> </td></tr></table></div>");
            containerLocal.Append(@"</div></div>");
            return containerLocal;
        }
    }
}
