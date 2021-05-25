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
using System.Web;

namespace CargoFlash.Cargo.WebUI.Permissions
{
    public class UserStatusManagementWebUI : BaseWebUISecureObject
    {
        public UserStatusManagementWebUI()
        {

            try
            {
                this.MyPrimaryID = "SNo";
                this.MyModuleID = "Permissions";
                this.MyAppID = "UserStatus";

            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }

        public UserStatusManagementWebUI(Page PageContext)
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
                this.MyModuleID = "Permissions";
                this.MyAppID = "UserStatus";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }

        public object GetRecordUserStatus()
        {
            object UserStatus = null;

            try
            {

                if (!DisplayMode.ToLower().Contains("new"))
                {
                    if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                    {
                        UserStatus UserStatusList = new UserStatus();
                        object obj = (object)UserStatusList;

                        UserStatus = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID);
                        this.MyRecordID = System.Web.HttpContext.Current.Request.QueryString["RecID"];
                    }
                    else
                    {
                        //Error Messgae: Record not found.
                    }
                }

            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
            return UserStatus;
        }

        public StringBuilder BuildFormView(string DisplayMode, StringBuilder container)
        {
            try
            {
                using (HtmlFormAdapter htmlFormAdapter = new HtmlFormAdapter(MyModuleID))
                {
                    htmlFormAdapter.CurrentPage = this.CurrentPageContext;
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.objFormData = GetRecordUserStatus();
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;

                        case DisplayModeDuplicate:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.objFormData = GetRecordUserStatus();
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.objFormData = GetRecordUserStatus();
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeDelete:
                            htmlFormAdapter.DisplayMode = DisplayModeType.Delete;
                            htmlFormAdapter.objFormData = GetRecordUserStatus();
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);

                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        default:
                            break;
                    }
                    container.Append("<div class='k-content' style='font-size: 12px;' id='divUserDescription'></div>");
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

        public StringBuilder CreateWebForm(StringBuilder container)
        {
            try
            {
                if (System.Web.HttpContext.Current.Request.QueryString["FormAction"] != null)
                {
                    //Set the display Mode form the URL QuesyString.
                    this.DisplayMode = "FORMACTION." + System.Web.HttpContext.Current.Request.QueryString["FormAction"].ToString().ToUpper().Trim();

                    //Match the display Mode of the form.
                    switch (this.DisplayMode)
                    {
                        case DisplayModeIndexView:
                            CreateGrid(container);
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
                        case DisplayModeDuplicate:
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
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
            return container;
        }

        private StringBuilder CreateGrid(StringBuilder Container)
        {
            try
            {
                using (Grid g = new Grid())
                {
                    g.CommandButtonNewText = "New Terminal";
                    g.FormCaptionText = "Change Terminal Request";
                    g.PrimaryID = this.MyPrimaryID;
                    g.IsActionRequired = false;
                    g.PageName = this.MyPageName;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.ServiceModuleName = this.MyModuleID;
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "UserName", Title = "User Name", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "OldTerminal", Title = "Default Terminal", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "NewTerminal", Title = "Current Terminal", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "WeighingScaleName", Title = "Weighing Scale", DataType = GridDataType.String.ToString() }); 
                    g.Column.Add(new GridColumn { Field = "UpdatedBy", Title = "Updated By", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "UpdatedOn", Title = "Updated On", DataType = GridDataType.DateTime.ToString(), Template = "# if( UpdatedOn==null) {# # } else {# #= kendo.toString(new Date(data.UpdatedOn.getTime() + data.UpdatedOn.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + " " + UIDateTimeFormat.UITimeFormatString + "\") # #}#" });
                    g.InstantiateIn(Container);

                    g.Action = new List<GridAction>();
                    g.Action.Add(new GridAction { ActionName = "PRINT", AppsName = "PRINT", CssClassName = "print", ModuleName = this.MyModuleID });
                    g.IsToggleColumns = false;
                    //g.InstantiateIn(strcontent);
                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
            return Container;
        }

        public override void DoPostBack()
        {
            try
            {
                this.OperationMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
                switch (OperationMode)
                {
                    case DisplayModeSave:
                        SaveUserStatus();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                        break;
                    //case DisplayModeUpdate:
                    //    UpdateUserStatus(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                    //    if (string.IsNullOrEmpty(ErrorMessage))
                    //        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                    //    break;
                    case DisplayModeSaveAndNew:
                        SaveUserStatus();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                        //else
                        //    return;
                        break;

                    //case DisplayModeDelete:
                    //    DeleteUserStatus(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                    //    if (string.IsNullOrEmpty(ErrorMessage))
                    //        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2002), false);
                    //    break;
                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }

        private void SaveUserStatus()
        {
            try
            {
                List<UserStatus> listUserStatus = new List<UserStatus>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var UserStatus = new UserStatus
                {
                    UserSNo = Convert.ToInt32(FormElement["UserSNo"]),                  
                    NewTerminalSNo = FormElement["NewTerminalSNo"].ToString() == "" ? 0 : Convert.ToInt32(FormElement["NewTerminalSNo"]),
                    WeighingScaleSNo = FormElement["WeighingScaleSNo"].ToString() == "" ? 0 : Convert.ToInt32(FormElement["WeighingScaleSNo"]),
                    //NewTerminalName = FormElement["Text_NewTerminalSNo"].ToString(),                   
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                };
                listUserStatus.Add(UserStatus);
                object datalist = (object)listUserStatus;
                DataOperationService(DisplayModeSave, datalist, MyModuleID);
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

        //private void UpdateUserStatus(string RecordID)
        //{
        //    try
        //    {
        //        List<City> listCity = new List<City>();
        //        var FormElement = System.Web.HttpContext.Current.Request.Form;
        //        var city = new City
        //        {
        //            SNo = Convert.ToInt32(RecordID),
        //            //ZoneSNo = FormElement["ZoneSNo"] == "" ? 0 : Convert.ToInt32(FormElement["ZoneSNo"]),
        //            //ZoneName = FormElement["Text_ZoneSNo"] == "" ? null : FormElement["Text_ZoneSNo"],
        //            CityCode = FormElement["CityCode"],
        //            CityName = FormElement["CityName"],
        //            CountrySNo = Convert.ToInt32(FormElement["CountrySNo"]),
        //            //CountryCode = FormElement["Text_CountrySNo"],
        //            //CountryName = FormElement["Text_CountrySNo"],
        //            CountryCode = FormElement["Text_CountrySNo"].Split('-')[0],  //FormElement["Text_CountrySNo"],
        //            CountryName = FormElement["Text_CountrySNo"].Split('-')[1],// FormElement["Text_CountrySNo"],
        //            // DaylightSaving = FormElement["DaylightSaving"],
        //            IATAArea = FormElement["IATAArea"],
        //            // TimeDifference = Convert.ToInt32(FormElement["TimeDifference"]),
        //            TimeZoneSNo = Convert.ToInt32(FormElement["TimeZoneSNo"]),
        //            // IsDayLightSaving = FormElement["IsDayLightSaving"] == "0",
        //            IsActive = FormElement["IsActive"] == "0",//not null
        //            UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
        //        };
        //        listCity.Add(city);
        //        object datalist = (object)listCity;
        //        DataOperationService(DisplayModeUpdate, datalist, MyModuleID);
        //        {
        //            //ErrorNumer
        //            //Error Message
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        ApplicationWebUI applicationWebUI = new ApplicationWebUI();
        //        applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
        //    }

        //}

        //private void DeleteUserStatus(string RecordID)
        //{
        //    try
        //    {
        //        List<string> listID = new List<string>();
        //        listID.Add(RecordID);
        //        listID.Add(MyUserID.ToString());
        //        object recordID = (object)listID;
        //        DataOperationService(DisplayModeDelete, recordID, MyModuleID);
        //        {
        //            //ErrorNumer
        //            //Error Message
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        ApplicationWebUI applicationWebUI = new ApplicationWebUI();
        //        applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
        //        ErrorMessage = applicationWebUI.ErrorMessage;
        //    }
        //}
    }
}
