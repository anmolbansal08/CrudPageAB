using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Data;
using System.Net;
using System.IO;
using System.Reflection;
using System.Runtime.Serialization;
using CargoFlash.SoftwareFactory.WebUI;
using CargoFlash.SoftwareFactory.WebUI.Adapters;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using CargoFlash.Cargo.Model.Shipment;
using System.Collections;
using CargoFlash.Cargo.WebUI;

namespace CargoFlash.Cargo.WebUI.Shipment
{
    #region Back Log Cargo Class Description
    /*
	*****************************************************************************
	Class Name:		BackLogCargoManagementWebUI      
	Purpose:		This Class used to get details Back Log Cargo
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Tarun Kumar
	Created On:		02 FEB 2016
    Updated By:    
	Updated On:	
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    public class BackLogCargoManagementWebUI : BaseWebUISecureObject
    {
        public BackLogCargoManagementWebUI()
        {

            try
            {
                this.MyPrimaryID = "SNo";
                this.MyModuleID = "Shipment";
                this.MyAppID = "BackLogCargo";

            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }

        public BackLogCargoManagementWebUI(Page PageContext)
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
                this.MyModuleID = "Shipment";
                this.MyAppID = "BackLogCargo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }

        public object GetRecordBackLogCargo()
        {
            object BackLogCargo = null;

            try
            {

                if (!DisplayMode.ToLower().Contains("new"))
                {
                    if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                    {
                        BackLogCargo BackLogCargoList = new BackLogCargo();
                        object obj = (object)BackLogCargoList;

                        BackLogCargo = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID);
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
            return BackLogCargo;
        }

        public StringBuilder BuildFormView(string DisplayMode, StringBuilder container)
        {
            try
            {
                using (HtmlFormAdapter htmlFormAdapter = new HtmlFormAdapter(MyModuleID))
                {
                    htmlFormAdapter.CurrentPage = this.CurrentPageContext;
                    htmlFormAdapter.HeadingColumnName = "BackLogCargoName";
                    switch (DisplayMode)
                    {
                        //case DisplayModeReadView:
                        //    htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                        //    htmlFormAdapter.objFormData = GetRecordBackLogCargo();
                        //    htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                        //    htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                        //    htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                        //    htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                        //    container.Append(htmlFormAdapter.InstantiateIn());
                        //    break;

                        //case DisplayModeDuplicate:
                        //    htmlFormAdapter.DisplayMode = DisplayModeType.New;
                        //    htmlFormAdapter.objFormData = GetRecordBackLogCargo();
                        //    htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                        //    container.Append(htmlFormAdapter.InstantiateIn());
                        //    break;
                        //case DisplayModeEdit:
                        //    htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                        //    htmlFormAdapter.objFormData = GetRecordBackLogCargo();
                        //    htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                        //    container.Append(htmlFormAdapter.InstantiateIn());
                        //    break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        //case DisplayModeDelete:
                        //    htmlFormAdapter.DisplayMode = DisplayModeType.Delete;
                        //    htmlFormAdapter.objFormData = GetRecordBackLogCargo();
                        //    htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);

                        //    container.Append(htmlFormAdapter.InstantiateIn());
                        //    break;
                        default:
                            break;
                    }
                    container.Append("<div id='divBackLogCargo'></div><table id='tblBackLogCargo'></table>");
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
                        //case DisplayModeIndexView:
                        //    CreateGrid(container);
                        //    break;
                        //case DisplayModeReadView:
                        //    BuildFormView(this.DisplayMode, container);
                        //    break;
                        //case DisplayModeEdit:
                        //    BuildFormView(this.DisplayMode, container);
                        //    break;
                        case DisplayModeNew:
                            BuildFormView(this.DisplayMode, container);
                            break;
                        //case DisplayModeDuplicate:
                        //    BuildFormView(this.DisplayMode, container);
                        //    break;
                        //case DisplayModeDelete:
                        //    BuildFormView(this.DisplayMode, container);
                        //    break;
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

        //private StringBuilder CreateGrid(StringBuilder Container)
        //{
        //    try
        //    {
        //        using (Grid g = new Grid())
        //        {
        //            g.CommandButtonNewText = "New BackLogCargo";
        //            g.FormCaptionText = "BackLogCargo";
        //            g.PrimaryID = this.MyPrimaryID;
        //            g.PageName = this.MyPageName;
        //            g.ModuleName = this.MyModuleID;
        //            g.AppsName = this.MyAppID;
        //            g.ServiceModuleName = this.MyModuleID;
        //            g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
        //            g.Column = new List<GridColumn>();

        //            g.Column.Add(new GridColumn { Field = "BackLogCargoCode", Title = "BackLogCargo Code", DataType = GridDataType.String.ToString() });
        //            g.Column.Add(new GridColumn { Field = "BackLogCargoName", Title = "BackLogCargo Name", DataType = GridDataType.String.ToString() });
        //            g.Column.Add(new GridColumn { Field = "CountryCode", Title = "Country Code", DataType = GridDataType.String.ToString() });
        //            g.Column.Add(new GridColumn { Field = "StandardName", Title = "Standard Name", DataType = GridDataType.String.ToString() });
        //            g.Column.Add(new GridColumn { Field = "DayLightSaving", Title = "Daylight Saving", DataType = GridDataType.String.ToString() });

        //            // g.Column.Add(new GridColumn { Field = "TimeDifference", Title = "Time Difference", DataType = GridDataType.Number.ToString() });
        //            g.Column.Add(new GridColumn { Field = "Active", Title = "Active", DataType = GridDataType.String.ToString() });
        //            g.Column.Add(new GridColumn { Field = "IsPriorApproval", Title = "Prior Approval", DataType = GridDataType.String.ToString() });
        //            g.Column.Add(new GridColumn { Field = "UpdatedBy", Title = "Updated By", DataType = GridDataType.String.ToString() });

        //            g.InstantiateIn(Container);
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        ApplicationWebUI applicationWebUI = new ApplicationWebUI();
        //        applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
        //        ErrorMessage = applicationWebUI.ErrorMessage;
        //    }
        //    return Container;
        //}

        //public override void DoPostBack()
        //{
        //    try
        //    {
        //        this.OperationMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
        //        switch (OperationMode)
        //        {
        //            case DisplayModeSave:
        //                SaveBackLogCargo();
        //                if (string.IsNullOrEmpty(ErrorMessage))
        //                    System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
        //                break;
        //            case DisplayModeUpdate:
        //                UpdateBackLogCargo(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
        //                if (string.IsNullOrEmpty(ErrorMessage))
        //                    System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
        //                break;
        //            case DisplayModeSaveAndNew:
        //                SaveBackLogCargo();
        //                if (string.IsNullOrEmpty(ErrorMessage))
        //                    System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
        //                //else
        //                //    return;
        //                break;

        //            case DisplayModeDelete:
        //                DeleteBackLogCargo(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
        //                if (string.IsNullOrEmpty(ErrorMessage))
        //                    System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2002), false);
        //                break;
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        ApplicationWebUI applicationWebUI = new ApplicationWebUI();
        //        applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
        //        ErrorMessage = applicationWebUI.ErrorMessage;

        //    }
        //}

        //private void SaveBackLogCargo()
        //{
        //    try
        //    {
        //        List<BackLogCargo> listBackLogCargo = new List<BackLogCargo>();
        //        var FormElement = System.Web.HttpContext.Current.Request.Form;
        //        //string TimeofDifference = FormElement["TimeDifference"].Split(new char[] { ')' })[1];
        //        var BackLogCargo = new BackLogCargo
        //        {
        //            //ZoneSNo =FormElement["ZoneSNo"]=="" ? 0: Convert.ToInt32(FormElement["ZoneSNo"]),
        //            //ZoneName = FormElement["Text_ZoneSNo"] == "" ? null : FormElement["Text_ZoneSNo"],
        //            BackLogCargoCode = FormElement["BackLogCargoCode"],
        //            BackLogCargoName = FormElement["BackLogCargoName"],
        //            CountrySNo = Convert.ToInt32(FormElement["CountrySNo"]),
        //            CountryCode = FormElement["Text_CountrySNo"].Split('-')[0],  //FormElement["Text_CountrySNo"],
        //            CountryName = FormElement["Text_CountrySNo"].Split('-')[1],// FormElement["Text_CountrySNo"],
        //            //DaylightSaving = FormElement["DaylightSaving"],
        //            IATAArea = FormElement["IATAArea"],
        //            //TimeDifference = Convert.ToInt32(TimeofDifference),
        //            TimeZoneSNo = Convert.ToInt32(FormElement["TimeZoneSNo"]),
        //            //IsDayLightSaving = FormElement["IsDayLightSaving"] == "0",
        //            IsActive = FormElement["IsActive"] == "0",//not null
        //            PriorApproval = FormElement["PriorApproval"] == "0",
        //            CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
        //            UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
        //        };
        //        listBackLogCargo.Add(BackLogCargo);
        //        object datalist = (object)listBackLogCargo;
        //        DataOperationService(DisplayModeSave, datalist, MyModuleID);
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

        //private void UpdateBackLogCargo(string RecordID)
        //{
        //    try
        //    {
        //        List<BackLogCargo> listBackLogCargo = new List<BackLogCargo>();
        //        var FormElement = System.Web.HttpContext.Current.Request.Form;
        //        var BackLogCargo = new BackLogCargo
        //        {
        //            SNo = Convert.ToInt32(RecordID),
        //            //ZoneSNo = FormElement["ZoneSNo"] == "" ? 0 : Convert.ToInt32(FormElement["ZoneSNo"]),
        //            //ZoneName = FormElement["Text_ZoneSNo"] == "" ? null : FormElement["Text_ZoneSNo"],
        //            BackLogCargoCode = FormElement["BackLogCargoCode"],
        //            BackLogCargoName = FormElement["BackLogCargoName"],
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
        //            PriorApproval = FormElement["PriorApproval"] == "0",
        //            UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
        //        };
        //        listBackLogCargo.Add(BackLogCargo);
        //        object datalist = (object)listBackLogCargo;
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

        //private void DeleteBackLogCargo(string RecordID)
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
