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
    public class AllotmentManagementWebUI : BaseWebUISecureObject
    {
         public AllotmentManagementWebUI()
        {
            try
            {

                this.MyPrimaryID = "SNo";
                this.MyModuleID = "Permissions";
                this.MyAppID = "Allotment";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }

         public AllotmentManagementWebUI(Page PageContext)
        {
            if (this.SetCurrentPageContext(PageContext))
            {
                this.ErrorNumber = 0;
                this.ErrorMessage = "";
            }
            this.MyPrimaryID = "SNo";
            this.MyPageName = "Default.cshtml";
            this.MyModuleID = "Permissions";
            this.MyAppID = "Allotment";
        }

         public object GetRecordAllotment()
         {
             object Allotment = null;

             try
             {

                 if (!DisplayMode.ToLower().Contains("new"))
                 {
                     if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                     {
                         Allotment AllotmentList = new Allotment();
                         object obj = (object)AllotmentList;
                         IDictionary<string, string> qString = new Dictionary<string, string>();
                         qString.Add("UserSNo", ((Model.UserLogin)(HttpContext.Current.Session["UserDetail"])).UserSNo.ToString());
                         Allotment = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID, "", "", qString);
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
             return Allotment;
         }

         public StringBuilder BuildFormView(string DisplayMode, StringBuilder container)
         {
             try
             {
                 using (HtmlFormAdapter htmlFormAdapter = new HtmlFormAdapter(MyModuleID))
                 {
                     StringBuilder strf = new StringBuilder();
                     htmlFormAdapter.Ischildform = true;
                     htmlFormAdapter.CurrentPage = this.CurrentPageContext;
                     htmlFormAdapter.HeadingColumnName = "AllotmentCode";
                     htmlFormAdapter.AuditLogColumn = "Text_AccountSNo";
                     switch (DisplayMode)
                     {
                         case DisplayModeReadView:
                             htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                             htmlFormAdapter.objFormData = GetRecordAllotment();
                             htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", false);
                             htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                             htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                             htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", false);
                             container.Append(ReadAllotmentPage(htmlFormAdapter.InstantiateIn()));
                             //container.Append(htmlFormAdapter.InstantiateIn());
                             //container.Append(@"<div id='AllotmentData' style='width: 100%; height:350px; overflow: scroll;'><table id='tblAllotmentData'></table></div><div ><input id='RecordID' type='hidden' value='" + System.Web.HttpContext.Current.Request.QueryString["RecID"] + "'></div>");
                             break;

                         //case DisplayModeDuplicate:
                         //    htmlFormAdapter.DisplayMode = DisplayModeType.New;
                         //    htmlFormAdapter.objFormData = GetRecordAllotment();
                         //    htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                         //    container.Append(htmlFormAdapter.InstantiateIn());
                         //    break;
                         case DisplayModeEdit:
                             htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                             htmlFormAdapter.objFormData = GetRecordAllotment();
                             htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                             container.Append(ReadAllotmentPage(htmlFormAdapter.InstantiateIn()));
                             //container.Append(htmlFormAdapter.InstantiateIn());
                             
                             //container.Append(@"<div id='AllotmentData' style='width: 100%; height:350px; overflow: scroll;'><table id='tblAllotmentData'></table><div id='ValidateData'></div><div ><input id='RecordID' type='hidden' value='" + System.Web.HttpContext.Current.Request.QueryString["RecID"] + "'></div>");
                             break;
                         case DisplayModeNew:
                             htmlFormAdapter.DisplayMode = DisplayModeType.New;
                             htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                             container.Append(htmlFormAdapter.InstantiateIn());
                             container.Append(@"<div id='ValidateData'></div>");
                             break;
                         //case DisplayModeDelete:
                         //    htmlFormAdapter.DisplayMode = DisplayModeType.Delete;
                         //    htmlFormAdapter.objFormData = GetRecordAllotment();
                         //    htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                         //    container.Append(htmlFormAdapter.InstantiateIn());
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
                     g.CommandButtonNewText = "New Allotment";
                     g.FormCaptionText = "Allotment";
                     g.PrimaryID = this.MyPrimaryID;
                     g.PageName = this.MyPageName;
                     g.ModuleName = this.MyModuleID;
                     g.AppsName = this.MyAppID;
                     g.ServiceModuleName = this.MyModuleID;
                     g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                     g.Column = new List<GridColumn>();

                     g.Column.Add(new GridColumn { Field = "AllotmentCode", Title = "Allotment Code", DataType = GridDataType.String.ToString() });
                     g.Column.Add(new GridColumn { Field = "AllotmentType", Title = "Allotment Type", DataType = GridDataType.String.ToString() });
                     g.Column.Add(new GridColumn { Field = "FlightNo", Title = "Flight No", DataType = GridDataType.String.ToString() });
                     g.Column.Add(new GridColumn { Field = "Origin", Title = "Origin", DataType = GridDataType.String.ToString() });
                     g.Column.Add(new GridColumn { Field = "Destination", Title = "Destination", DataType = GridDataType.String.ToString() });
                     g.Column.Add(new GridColumn { Field = "OfficeName", Title = "Office", DataType = GridDataType.String.ToString() });
                     g.Column.Add(new GridColumn { Field = "AgentName", Title = "Forwarder (Agent)", DataType = GridDataType.String.ToString() });
                     g.Column.Add(new GridColumn { Field = "GrossWeight", Title = "Gross Weight", DataType = GridDataType.String.ToString() });
                     g.Column.Add(new GridColumn { Field = "VolumeWeight", Title = "Volume (CBM)", DataType = GridDataType.String.ToString() });
                     g.Column.Add(new GridColumn { Field = "ValidFrom", Title = "Valid From", DataType = GridDataType.Date.ToString(), Template = "# if( ValidFrom==null) {# # } else {# #= kendo.toString(new Date(data.ValidFrom.getTime() + data.ValidFrom.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + "\") # #}#" });
                     g.Column.Add(new GridColumn { Field = "ValidTo", Title = "Valid To", DataType = GridDataType.Date.ToString(), Template = "# if( ValidTo==null) {# # } else {# #= kendo.toString(new Date(data.ValidTo.getTime() + data.ValidTo.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + "\") # #}#" });                
                     g.Column.Add(new GridColumn { Field = "DaysOfOps", Title = "Days Of Ops", DataType = GridDataType.String.ToString() });
                     g.Column.Add(new GridColumn { Field = "AllotmentReleaseTime", Title = "Release Time", DataType = GridDataType.String.ToString() });
                     g.InstantiateIn(Container);
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
                          SaveAllotment();
                         if (string.IsNullOrEmpty(ErrorMessage))
                             System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                         break;
                     case DisplayModeUpdate:
                         UpdateAllotment(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                         if (string.IsNullOrEmpty(ErrorMessage))
                             System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                         break;
                     case DisplayModeSaveAndNew:
                         SaveAllotment();
                         if (string.IsNullOrEmpty(ErrorMessage))
                             System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                         
                         break;

                     case DisplayModeDelete:
                         //DeleteAllotment(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                         if (string.IsNullOrEmpty(ErrorMessage))
                             System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2002), false);
                         break;
                 }
             }
             catch (Exception ex)
             {
                 ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                 applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                 ErrorMessage = applicationWebUI.ErrorMessage;

             }
         }

         private void SaveAllotment()
         {
             try
             {
                 List<Allotment> listAllotment = new List<Allotment>();
                 var FormElement = System.Web.HttpContext.Current.Request.Form;
                 var Allotment = new Allotment
                 {
                     //AircraftSNo = Convert.ToInt32(FormElement["AircraftSNo"]),
                     IsSector =Convert.ToInt32(FormElement["IsSector"]),
                     OriginSNo = String.IsNullOrEmpty(FormElement["OriginSNo"]) == true ? (Int32?)null : Convert.ToInt32(FormElement["OriginSNo"]),
                     DestinationSNo = String.IsNullOrEmpty(FormElement["DestinationSNo"]) == true ? (Int32?)null : Convert.ToInt32(FormElement["DestinationSNo"]),
                     FlightNo = String.IsNullOrEmpty(FormElement["FlightNo"]) == true ? (Int32?)null : Convert.ToInt32(FormElement["FlightNo"]),
                     AllotmentType = Convert.ToInt32(FormElement["AllotmentType"]),
                     OfficeSNo = String.IsNullOrEmpty(FormElement["OfficeSNo"])==true? (Int32?)null : Convert.ToInt32(FormElement["OfficeSNo"]),
                     AccountSNo = String.IsNullOrEmpty(FormElement["AccountSNo"]) == true ? (Int32?)null : Convert.ToInt32(FormElement["AccountSNo"]),
                     ShipperAccountSNo = String.IsNullOrEmpty(FormElement["ShipperAccountSNo"]) == true ? (Int32?)null : Convert.ToInt32(FormElement["ShipperAccountSNo"]),
                     GrossWeightType = Convert.ToInt32(FormElement["GrossWeightType"]),
                     GrossWeight= Convert.ToDecimal(FormElement["GrossWeight"]),
                     VolumeWeight = Convert.ToDecimal(FormElement["VolumeWeight"]),
                     VolumeWeightType = Convert.ToInt32(FormElement["VolumeWeightType"]),
                     ValidFrom = Convert.ToDateTime(FormElement["ValidFrom"]),
                     ValidTo = Convert.ToDateTime(FormElement["ValidTo"]),
                     CommodityType = String.IsNullOrEmpty(FormElement["CommodityType"]) ? (Int32?)null : Convert.ToInt32(FormElement["CommodityType"]),
                     Commodity = FormElement["Commodity"],
                     SHCType = String.IsNullOrEmpty(FormElement["SHCType"]) ? (Int32?)null : Convert.ToInt32(FormElement["SHCType"]),
                     SHC = FormElement["SHC"],
                     ProductType = String.IsNullOrEmpty(FormElement["ProductType"]) ? (Int32?)null : Convert.ToInt32(FormElement["ProductType"]),
                     ProductSNo = FormElement["ProductSNo"],
                     Days = FormElement["Days"],
                     IsActive = FormElement["IsActive"] == "0" ? true : false,
                     CreatedBy = (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo).ToString(),
                     ExcludeScheduleTransSNo = FormElement["ExcludeScheduleTransSNo"],
                     GrossWeightVariance_P = String.IsNullOrEmpty(FormElement["GrossWeightVariance_P"]) == true ? 0 : Convert.ToInt32(FormElement["GrossWeightVariance_P"]),
                     GrossWeightVariance_N = String.IsNullOrEmpty(FormElement["GrossWeightVariance_N"]) == true ? 0 : Convert.ToInt32(FormElement["GrossWeightVariance_N"]),
                     VolumeVariance_P = String.IsNullOrEmpty(FormElement["VolumeVariance_P"]) == true ? 0 : Convert.ToInt32(FormElement["VolumeVariance_P"]),
                     VolumeVariance_N = String.IsNullOrEmpty(FormElement["VolumeVariance_N"]) == true ? 0 : Convert.ToInt32(FormElement["VolumeVariance_N"]),
                   //  AllotmentReleaseTime = String.IsNullOrEmpty(FormElement["AllotmentReleaseTime"]) == true ? 0 : Convert.ToInt32(FormElement["AllotmentReleaseTime"]),

                     AllotmentReleaseTime = ((string.IsNullOrEmpty(FormElement["AllotmentReleaseTimeHr"]) == true ? 0 : Convert.ToInt32(FormElement["AllotmentReleaseTimeHr"])) * 60 + (string.IsNullOrEmpty(FormElement["AllotmentReleaseTimeMin"]) == true ? 0 : Convert.ToInt32(FormElement["AllotmentReleaseTimeMin"]))).ToString(),

                     AllotmentReleaseTimeHr = string.IsNullOrEmpty(FormElement["AllotmentReleaseTimeHr"]) == true ? 0 : Convert.ToInt32(FormElement["AllotmentReleaseTimeHr"]),
                     AllotmentReleaseTimeMin = string.IsNullOrEmpty(FormElement["AllotmentReleaseTimeMin"]) == true ? 0 : Convert.ToInt32(FormElement["ConnectionTimeMin"]),
                     AirlineSNo = String.IsNullOrEmpty(FormElement["AirlineSNo"]) == true ? 0 : Convert.ToInt32(FormElement["AirlineSNo"]),
                 };
                 listAllotment.Add(Allotment);
                 object datalist = (object)listAllotment;
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

         private void UpdateAllotment(string RecordID)
         {
             try
             {
                 List<Allotment> listAllotment = new List<Allotment>();
                 var FormElement = System.Web.HttpContext.Current.Request.Form;
                 var Allotment = new Allotment
                 {
                     SNo=Convert.ToInt32(RecordID),
                     //AircraftSNo = Convert.ToInt32(FormElement["AircraftSNo"]),
                     //IsSector = FormElement["IsSector"] == "on" ? true : false,
                     //OriginSNo = String.IsNullOrEmpty(FormElement["OriginSNo"]) == true ? (Int32?)null : Convert.ToInt32(FormElement["OriginSNo"]),
                     //DestinationSNo = String.IsNullOrEmpty(FormElement["DestinationSNo"]) == true ? (Int32?)null : Convert.ToInt32(FormElement["DestinationSNo"]),
                     //FlightNo = String.IsNullOrEmpty(FormElement["FlightNo"]) == true ? (Int32?)null : Convert.ToInt32(FormElement["FlightNo"]),
                     //AllotmentType = Convert.ToInt32(FormElement["AllotmentType"]),
                     //OfficeSNo = String.IsNullOrEmpty(FormElement["OfficeSNo"]) == true ? (Int32?)null : Convert.ToInt32(FormElement["OfficeSNo"]),
                     //AccountSNo = String.IsNullOrEmpty(FormElement["AccountSNo"]) == true ? (Int32?)null : Convert.ToInt32(FormElement["AccountSNo"]),
                     //ShipperAccountSNo = String.IsNullOrEmpty(FormElement["ShipperAccountSNo"]) == true ? (Int32?)null : Convert.ToInt32(FormElement["ShipperAccountSNo"]),
                     //GrossWeightType = Convert.ToInt32(FormElement["GrossWeightType"]),
                     GrossWeight = Convert.ToDecimal(FormElement["GrossWeight"]),
                     VolumeWeight = Convert.ToDecimal(FormElement["VolumeWeight"]),
                     //VolumeWeightType = Convert.ToInt32(FormElement["VolumeWeightType"]),
                     ValidFrom = Convert.ToDateTime(FormElement["ValidFrom"]),
                     ValidTo = Convert.ToDateTime(FormElement["ValidTo"]),
                     //CommodityType = Convert.ToInt32(FormElement["CommodityType"]),
                     //Commodity = FormElement["Commodity"],
                     //ProductType = Convert.ToInt32(FormElement["ProductType"]),
                     //ProductSNo = FormElement["ProductSNo"],
                     Days = FormElement["Days"],
                     IsActive = FormElement["IsActive"] == "0" ? true : false,
                     CreatedBy = (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo).ToString(),
                     ExcludeScheduleTransSNo = FormElement["ExcludeScheduleTransSNo"],
                     GrossWeightVariance_P = String.IsNullOrEmpty(FormElement["GrossWeightVariance_P"]) == true ? 0 : Convert.ToInt32(FormElement["GrossWeightVariance_P"]),
                     GrossWeightVariance_N = String.IsNullOrEmpty(FormElement["GrossWeightVariance_N"]) == true ? 0 : Convert.ToInt32(FormElement["GrossWeightVariance_N"]),
                     VolumeVariance_P = String.IsNullOrEmpty(FormElement["VolumeVariance_P"]) == true ? 0 : Convert.ToInt32(FormElement["VolumeVariance_P"]),
                     VolumeVariance_N = String.IsNullOrEmpty(FormElement["VolumeVariance_N"]) == true ? 0 : Convert.ToInt32(FormElement["VolumeVariance_N"]),
                     //AllotmentReleaseTime = String.IsNullOrEmpty(FormElement["AllotmentReleaseTime"]) == true ? 0 : Convert.ToInt32(FormElement["AllotmentReleaseTime"]),
                     AllotmentReleaseTime = ((string.IsNullOrEmpty(FormElement["AllotmentReleaseTimeHr"]) == true ? 0 : Convert.ToInt32(FormElement["AllotmentReleaseTimeHr"])) * 60 + (string.IsNullOrEmpty(FormElement["AllotmentReleaseTimeMin"]) == true ? 0 : Convert.ToInt32(FormElement["AllotmentReleaseTimeMin"]))).ToString(),

                     AllotmentReleaseTimeHr = string.IsNullOrEmpty(FormElement["AllotmentReleaseTimeHr"]) == true ? 0 : Convert.ToInt32(FormElement["AllotmentReleaseTimeHr"]),
                     AllotmentReleaseTimeMin = string.IsNullOrEmpty(FormElement["AllotmentReleaseTimeMin"]) == true ? 0 : Convert.ToInt32(FormElement["ConnectionTimeMin"]),
                 };
                 listAllotment.Add(Allotment);
                 object datalist = (object)listAllotment;
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

         public StringBuilder ReadAllotmentPage(StringBuilder container)
         {
             StringBuilder containerLocal = new StringBuilder();
             containerLocal.Append(@"
        <div id='ApplicationTabs'>
            <ul>
                <li  id='liAllotment' class='k-state-active'>Allotment Information</li>
                <li id='liBranch' onclick='javascript:AllotmentData();'>Allotment Flights Information</li>
            </ul>
                            <div id='divTab1' > 
                              <span id='spnAllotmentInformation'>");
                            containerLocal.Append(container);
                            containerLocal.Append(@"</span> 
                            </div>");

                            containerLocal.Append(@"<div id='divBranch'>
    <table class='WebFormTable' id='tblnew' validateonsubmit='true'><tbody><tr><td class='formSection' colspan='4'>Search Flights Information</td></tr>

<tr><td class='formlabel' title='Select From'>From</td><td class='formInputcolumn'><span class='k-picker-wrap k-state-default k-widget k-datepicker k-header' style='width: 150px;'><input type='text' class='k-input k-state-default' name='From' id='From' style='width: 100%; color: rgb(0, 0, 0);' colname='from' tabindex='31' controltype='datetype' maxlength='15' data-role='datepicker'><span unselectable='on' class='k-select'><span unselectable='on' class='k-icon k-i-calendar'>select</span></span></span></td><td class='formlabel' title='Select To'>To</td><td class='formInputcolumn'><span class='k-picker-wrap k-state-default k-widget k-datepicker k-header' style='width: 150px;'><input type='text' class='k-input k-state-default' name='To' id='To' style='width: 100%; color: rgb(0, 0, 0);' colname='to' tabindex='32' controltype='datetype' maxlength=''  data-role='datepicker' ><span unselectable='on' class='k-select'><span unselectable='on' class='k-icon k-i-calendar'>select</span></span></span></td></tr><tr><td class='formtwolabel' title='Select Flight No'>Flight No</td><td class='formInputcolumn'><div><input type='hidden' name='SHFlightNo' id='SHFlightNo' value=''><input type='text' class='k-input' name='Text_SHFlightNo' id='Text_SHFlightNo' style='text-transform: uppercase; width: 100%;' colname='flight no' tabindex='6' controltype='autocomplete' maxlength='' value='' data-role='autocomplete' autocomplete='off'><div></td><td class='formlabel' title='Select '></td><td class='formInputcolumn'><input type='button' tabindex='34' class='btn btn-success' name='SearchAllotment' id='SearchAllotment' onclick='javascript:AllotmentData();' style='width:90px;' value='Search'></td></tr></tbody></table>

<span id='spnBranch'><div id='AllotmentData' style='width: 100%; height:350px; overflow: scroll;'>
<table id='tblAllotmentData'></table></div><div ><input id='RecordID' type='hidden' value='" + System.Web.HttpContext.Current.Request.QueryString["RecID"] + "'></div></span></div>");
             return containerLocal;
         }
    }
}
