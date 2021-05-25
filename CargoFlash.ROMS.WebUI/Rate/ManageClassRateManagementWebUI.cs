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
using CargoFlash.Cargo.Model.Rate;
using System.Collections;
using CargoFlash.Cargo.Business;
using CargoFlash.Cargo.WebUI;
using System.Web;


namespace CargoFlash.Cargo.WebUI.Rate
{
    #region ManageClassRateManagementWebUI Description
    /*
	*****************************************************************************
	Class Name:		ManageClassRateManagementWebUI   
	Purpose:		This Class used to get details of ManageClassRate save update and delete
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Shahbaz Akhtar
	Created On:		1 Feb APR 2017
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    public class ManageClassRateManagementWebUI : BaseWebUISecureObject
    {

        public ManageClassRateManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Rate";
                this.MyAppID = "ManageClassRate";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }
        public ManageClassRateManagementWebUI(Page PageContext)
        {
            try
            {
                if (this.SetCurrentPageContext(PageContext))
                {
                    this.ErrorNumber = 0;
                    this.ErrorMessage = "";
                }
                this.MyPageName = "Default.aspx";
                this.MyModuleID = "Rate";
                this.MyAppID = "ManageClassRate";
                this.MyPrimaryID = "Sno";
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
                    htmlFormAdapter.HeadingColumnName = "ReferenceNumber";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.objFormData = GetRecordManageClassRate();
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append("<div id='divClassRateSlab'><span id='spnClassRateSlab'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnClassRateSlabSNo' name='hdnClassRateSlabSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblClassRateSlab'></table></span></div>");
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append("<div id='divRateCondition' validateonsubmit='true'><span id='spnRateBase'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblManageRateCondition' border=1 class='WebFormTable'></table></span></div>");
                            container.Append("<div id='divClassRateSlab'><span id='spnClassRateSlab'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnClassRateSlabSNo' name='hdnClassRateSlabSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblClassRateSlab'></table></span></div>");
                            break;
                        case DisplayModeEdit:

                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.objFormData = GetRecordManageClassRate();
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append("<div id='divRateCondition' validateonsubmit='true'><span id='spnRateBase'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblManageRateCondition' border=1 class='WebFormTable'></table></span></div>");
                            container.Append("<div id='divClassRateSlab'><span id='spnClassRateSlab'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnClassRateSlabSNo' name='hdnClassRateSlabSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblClassRateSlab'></table></span></div>");
                            break;
                        //case DisplayModeDelete:
                        //    htmlFormAdapter.DisplayMode = DisplayModeType.Delete;
                        //    htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                        //    //     htmlFormAdapter.objFormData = GetRecordManageClassRate();
                        //    container.Append(htmlFormAdapter.InstantiateIn());
                        //    break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.objFormData = GetRecordManageClassRate();
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append("<div id='divRateCondition' validateonsubmit='true'><span id='spnRateBase'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblManageRateCondition' border=1 class='WebFormTable'></table></span></div>");
                            container.Append("<div id='divClassRateSlab'><span id='spnClassRateSlab'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnClassRateSlabSNo' name='hdnClassRateSlabSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblClassRateSlab'></table></span></div>");
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
                        case DisplayModeNew:
                            BuildFormView(this.DisplayMode, container);
                            break;
                        case DisplayModeReadView:
                            BuildFormView(this.DisplayMode, container);
                            break;
                        case DisplayModeEdit:
                            BuildFormView(this.DisplayMode, container);
                            break;
                        case DisplayModeDelete:
                            BuildFormView(this.DisplayMode, container);
                            break;
                        case DisplayModeDuplicate:
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

        private StringBuilder CreateGrid(StringBuilder container)
        {
            try
            {
                using (Grid g = new Grid())
                {

                    g.CommandButtonNewText = "New Class Rate";
                    g.FormCaptionText = "Class Rate";
                    g.PrimaryID = this.MyPrimaryID;
                    g.PageName = this.MyPageName;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.ServiceModuleName = this.MyModuleID;
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "ReferenceNumber", Title = "ReferenceNumber", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "ClassRateName", Title = "Class Rate Name", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Text_AirlineSNo", Title = "Airline", DataType = GridDataType.String.ToString() });

                    g.Column.Add(new GridColumn { Field = "Text_OriginSNo", Title = "Origin", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Text_DestinationSNo", Title = "Destination", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "RateInPercentage", Title = "Rate InPercentage", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "ValidFrom", Title = "Valid From", DataType = GridDataType.DateTime.ToString(), Template = "# if(ValidFrom==null) {# # } else {# #= kendo.toString(new Date(data.ValidFrom.getTime() + data.ValidFrom.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + " " + "\") # #}#" });

                    g.Column.Add(new GridColumn { Field = "ValidTo", Title = "Valid To", DataType = GridDataType.DateTime.ToString(), Template = "# if(ValidTo==null) {# # } else {# #= kendo.toString(new Date(data.ValidTo.getTime() + data.ValidTo.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + " " + "\") # #}#" });
                    g.Column.Add(new GridColumn { Field = "Text_Status", Title = "Status", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "CreatedBy", Title = "Created By", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "UpdatedBy", Title = "Updated By", DataType = GridDataType.String.ToString() });

                    g.InstantiateIn(container);

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
                        SaveManageClassRate();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                        break;
                    case DisplayModeUpdate:
                        UpdateManageClassRate(Convert.ToInt32(System.Web.HttpContext.Current.Request.QueryString["RecID"]));
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                        break;
                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            }
        }

        private void SaveManageClassRate()
        {
            try
            {
                List<ManageClassRate> listManageClassRate = new List<ManageClassRate>();
                List<ClassRateSlab> listClassRateSlab = new List<ClassRateSlab>();
                string ClassRateSlb = ((CargoFlash.Cargo.Model.UserLogin)System.Web.HttpContext.Current.Session["UserDetail"]).SysSetting["IsClassRateWithSlab"].ToUpper();
                string Env = ((CargoFlash.Cargo.Model.UserLogin)System.Web.HttpContext.Current.Session["UserDetail"]).SysSetting["ICMSEnvironment"].ToUpper();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                if( ClassRateSlb == "TRUE"){
                
                string[] values = FormElement["tblClassRateSlab_rowOrder"].ToString().Split(',');

                for (int count = 0; count < Convert.ToInt32(FormElement["tblClassRateSlab_rowOrder"].ToString().Split(',').Length); count++)
                {
                    listClassRateSlab.Add(new ClassRateSlab()
                    {
                        SNo = 1,
                        RateAirlineClassRate = 1,
                        StartWeight =  Convert.ToDecimal( FormElement["tblClassRateSlab_StartWeight_" + values[count]] == "" ? (decimal?)0 : Convert.ToDecimal(FormElement["tblClassRateSlab_StartWeight_" + values[count]])),
                        EndWeight = Convert.ToDecimal(FormElement["tblClassRateSlab_EndWeight_" + values[count]] == "" ? (decimal?)0 : Convert.ToDecimal(FormElement["tblClassRateSlab_EndWeight_" + values[count]])),
                        RateBasedOn = Convert.ToInt32(FormElement["tblClassRateSlab_RateBasedOn_" + values[count]] == "" ? (decimal?)0 : Convert.ToDecimal(FormElement["tblClassRateSlab_RateBasedOn_" + values[count]])),
                        Value = Convert.ToDecimal(FormElement["tblClassRateSlab_Value_" + values[count]] == "" ? (decimal?)0 : Convert.ToDecimal(FormElement["tblClassRateSlab_Value_" + values[count]])),
                    }
                    );

                }
                }
                var ManageClassRate = new ManageClassRate
                {
                    SNo = 0,
                    AirlineSNo = Convert.ToInt32(FormElement["AirlineSNo"].ToUpper()),
                    OriginLevel = Convert.ToInt32(FormElement["OriginLevel"] == "" ? "0" : FormElement["OriginLevel"]),
                    DestinationLevel = Convert.ToInt32(FormElement["DestinationLevel"] == "" ? "0" : FormElement["DestinationLevel"]),
                    OriginSNo = Convert.ToInt32(FormElement["OriginSNo"] == "" ? "0" : FormElement["OriginSNo"]),
                    DestinationSNo = Convert.ToInt32(FormElement["DestinationSNo"] == "" ? "0" : FormElement["DestinationSNo"]),
                    Status = Convert.ToInt32(FormElement["Status"].ToString()),
                    ValidFrom = DateTime.Parse(FormElement["ValidFrom"]),
                    ValidTo = DateTime.Parse(FormElement["ValidTo"]),
                    RateInPercentage = ClassRateSlb == "TRUE" ? 0 : Convert.ToInt32(FormElement["RateInPercentage"].ToString()),
                    ApplicableOn = Convert.ToInt32(FormElement["ApplicableOn"].ToString()),
                    CommoditySNo = FormElement["CommoditySNo"].ToString() == "" ? "0" : FormElement["CommoditySNo"].ToString(),
                    IsInclude = 1,// Convert.ToInt32(FormElement["IsInclude"].ToString()),
                    IsInternational = (FormElement["IsInternational"] == "1"),
                    //IsActive = FormElement["IsActive"] == "0",
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    SHCSNO = FormElement["SHCSNO"].ToString() == "" ? "0" : FormElement["SHCSNO"].ToString(),//,
                    ClassRateSlab= listClassRateSlab,
                    BasedOn = ClassRateSlb == "FALSE" ? 0  : Convert.ToInt32(FormElement["BasedOn"] == "" ? "0" : FormElement["BasedOn"]),
                    AccountSNo = ClassRateSlb == "FALSE" ? "" : FormElement["AccountSNo"].ToString(),
                    ClassRateName = FormElement["ClassRateName"].ToString(),
                    FlightSNo = Env == "JT" ? FormElement["FlightSNo"].ToString() : "",
                    OtherAirlineSNo =  FormElement["OtherAirlineSNo"].ToString()
                    //  SHCGroupSno = HttpContext.Current.Session["Company"].ToString()
                };
                listManageClassRate.Add(ManageClassRate);
                object datalist = (object)listManageClassRate;
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


        public object GetRecordManageClassRate()
        {
            object ManageClassRate = null;
            try
            {
                if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                {
                    ManageClassRate ManageClassRateList = new ManageClassRate();
                    object obj = (object)ManageClassRateList;
                    IDictionary<string, string> qString = new Dictionary<string, string>();
                    qString.Add("UserSNo", ((Model.UserLogin)(HttpContext.Current.Session["UserDetail"])).UserSNo.ToString());
                    ManageClassRate = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, this.MyModuleID, "", "", qString);
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

            } return ManageClassRate;
        }

        private void UpdateManageClassRate(int RecordID)
        {

            try
            {
                List<ManageClassRate> listManageClassRate = new List<ManageClassRate>();
                List<ClassRateSlab> listClassRateSlab = new List<ClassRateSlab>();
                string ClassRateSlb = ((CargoFlash.Cargo.Model.UserLogin)System.Web.HttpContext.Current.Session["UserDetail"]).SysSetting["IsClassRateWithSlab"].ToUpper();
                string Env = ((CargoFlash.Cargo.Model.UserLogin)System.Web.HttpContext.Current.Session["UserDetail"]).SysSetting["ICMSEnvironment"].ToUpper();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                if (ClassRateSlb == "TRUE")
                {

                    string[] values = FormElement["tblClassRateSlab_rowOrder"].ToString().Split(',');

                    for (int count = 0; count < Convert.ToInt32(FormElement["tblClassRateSlab_rowOrder"].ToString().Split(',').Length); count++)
                    {
                        listClassRateSlab.Add(new ClassRateSlab()
                        {
                            SNo = 1,
                            RateAirlineClassRate = 1,
                            StartWeight = Convert.ToDecimal(FormElement["tblClassRateSlab_StartWeight_" + values[count]] == "" ? (decimal?)0 : Convert.ToDecimal(FormElement["tblClassRateSlab_StartWeight_" + values[count]])),
                            EndWeight = Convert.ToDecimal(FormElement["tblClassRateSlab_EndWeight_" + values[count]] == "" ? (decimal?)0 : Convert.ToDecimal(FormElement["tblClassRateSlab_EndWeight_" + values[count]])),
                            RateBasedOn = Convert.ToInt32(FormElement["tblClassRateSlab_RateBasedOn_" + values[count]] == "" ? (decimal?)0 : Convert.ToDecimal(FormElement["tblClassRateSlab_RateBasedOn_" + values[count]])),
                            Value = Convert.ToDecimal(FormElement["tblClassRateSlab_Value_" + values[count]] == "" ? (decimal?)0 : Convert.ToDecimal(FormElement["tblClassRateSlab_Value_" + values[count]])),
                        }
                        );

                    }
                }
                var ManageClassRate = new ManageClassRate
                {
                    SNo = Convert.ToInt32(RecordID),
                    AirlineSNo = Convert.ToInt32(FormElement["AirlineSNo"].ToUpper()),
                    OriginLevel = Convert.ToInt32(FormElement["OriginLevel"] == "" ? "0" : FormElement["OriginLevel"]),
                    DestinationLevel = Convert.ToInt32(FormElement["DestinationLevel"] == "" ? "0" : FormElement["DestinationLevel"]),
                    OriginSNo = Convert.ToInt32(FormElement["OriginSNo"] == "" ? "0" : FormElement["OriginSNo"]),
                    DestinationSNo = Convert.ToInt32(FormElement["DestinationSNo"] == "" ? "0" : FormElement["DestinationSNo"]),
                    Status = Convert.ToInt32(FormElement["Status"].ToString()),
                    ValidFrom = DateTime.Parse(FormElement["ValidFrom"]),
                    ValidTo = DateTime.Parse(FormElement["ValidTo"]),
                    RateInPercentage = ClassRateSlb == "TRUE" ? 0 : Convert.ToInt32(FormElement["RateInPercentage"].ToString()),
                    ApplicableOn = Convert.ToInt32(FormElement["ApplicableOn"].ToString()),
                    CommoditySNo = FormElement["CommoditySNo"].ToString(),
                    IsInclude = 1,//Convert.ToInt32(FormElement["IsInclude"].ToString()),
                    IsInternational = FormElement["IsInternational"] == "1",
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    SHCSNO = FormElement["SHCSNO"].ToString() == "" ? "0" : FormElement["SHCSNO"].ToString(),
                    ClassRateSlab = listClassRateSlab,//,
                    BasedOn = ClassRateSlb == "FALSE" ? 0 : Convert.ToInt32(FormElement["BasedOn"] == "" ? "0" : FormElement["BasedOn"]),
                    AccountSNo = ClassRateSlb == "FALSE" ? "" : FormElement["AccountSNo"].ToString(),
                    ClassRateName = FormElement["ClassRateName"].ToString(),
                    // SHCGroupSno = HttpContext.Current.Session["Company"].ToString()
                    FlightSNo = Env == "JT" ? FormElement["FlightSNo"].ToString() : "",
                    OtherAirlineSNo = FormElement["OtherAirlineSNo"].ToString()
                };
                listManageClassRate.Add(ManageClassRate);
                object datalist = (object)listManageClassRate;
                DataOperationService(DisplayModeUpdate, datalist, MyModuleID);
                {

                    //ErrorNumer
                    //Error Message
                }
                //}
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            }


        }
    }
}
