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
using CargoFlash.Cargo.Model.Rate;

namespace CargoFlash.Cargo.WebUI.Rate
{
    public class RateManagementWebUI : BaseWebUISecureObject
    {
        public RateManagementWebUI(Page PageContext)
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
                this.MyAppID = "Rate";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }

        public RateManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Rate";
                this.MyAppID = "Rate";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }

        }
        public override void BuildFormView(string DisplayMode, StringBuilder container)
        {
            try
            {
                using (HtmlFormAdapter htmlFormAdapter = new HtmlFormAdapter(MyModuleID))
                {
                    StringBuilder strf = new StringBuilder();
                    htmlFormAdapter.Ischildform = true;
                    htmlFormAdapter.CurrentPage = this.CurrentPageContext;
                    htmlFormAdapter.HeadingColumnName = "REFNo"; // added by arman ali date: 08-05-2017 , HeadingColumnName is Required now
                    htmlFormAdapter.AuditLogColumn = "REFNo,Text_OriginSNo,Text_DestinationSNo";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.objFormData = GetRecordRate();
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            strf.Append("<div id='divRateBase' validateonsubmit='true'><span id='spnRateBase'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRateBase' validateonsubmit='true' class='WebFormTable'></table></span></div>");
                            strf.Append("<div id='divULDRate' validateonsubmit='true'><span id='spnULDRate'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblULDRate' validateonsubmit='true' class='WebFormTable'></table></span></div>");
                            strf.Append("<div id='divRateParam'><span id='spnRateBase'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRateParam' border=1 class='WebFormTable'></table></span></div>");
                            strf.Append("<div id='divRemarks' validateonsubmit='true'><span id='spnRemarks'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRemarks' class='WebFormTable' validateonsubmit='true'></table></span></div>");
                            htmlFormAdapter.Childform = strf.ToString();
                            container.Append(htmlFormAdapter.InstantiateIn()); 
                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.objFormData = GetRecordRate();
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            strf.Append("<div id='divRateBase' validateonsubmit='true'><span id='spnRateBase'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRateBase' validateonsubmit='true' class='WebFormTable'></table></span></div>");
                            strf.Append("<div id='divULDRate' validateonsubmit='true'><span id='spnULDRate'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblULDRate' validateonsubmit='true' class='WebFormTable'></table></span></div>");
                            strf.Append("<div id='divRateParam'><span id='spnRateBase'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRateParam' border=1 class='WebFormTable'></table></span></div>");
                            strf.Append("<div id='divRemarks' validateonsubmit='true'><span id='spnRemarks'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRemarks' class='WebFormTable' validateonsubmit='true'></table></span></div>");
                            htmlFormAdapter.Childform = strf.ToString();
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.objFormData = GetRecordRate();
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            strf.Append("<div id='divRateBase' validateonsubmit='true'><span id='spnRateBase'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRateBase' validateonsubmit='true' class='WebFormTable'></table></span></div>");
                            strf.Append("<div id='divULDRate' validateonsubmit='true'><span id='spnULDRate'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblULDRate' validateonsubmit='true' class='WebFormTable'></table></span></div>");
                            strf.Append("<div id='divRateParam'><span id='spnRateBase'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRateParam' border=1 class='WebFormTable'></table></span></div>");
                            strf.Append("<div id='divRemarks' validateonsubmit='true'><span id='spnRemarks'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRemarks' class='WebFormTable' validateonsubmit='true'></table></span></div>");
                            htmlFormAdapter.Childform = strf.ToString();
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append("<div id='divRateBase' validateonsubmit='true'><span id='spnRateBase'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRateBase' validateonsubmit='true' class='WebFormTable'></table></span></div>");
                            container.Append("<div id='divULDRate' validateonsubmit='true'><span id='spnULDRate'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblULDRate' validateonsubmit='true' class='WebFormTable'></table></span></div>");
                            container.Append("<div id='divRateParam'><span id='spnRateBase'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRateParam' border=1 class='WebFormTable'></table></span></div>");
                            container.Append("<div id='divRemarks' validateonsubmit='true'><span id='spnRemarks'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRemarks' class='WebFormTable' validateonsubmit='true'></table></span></div>");
                           // htmlFormAdapter.Childform = strf.ToString();
                         
                           // strf.Append("<div id='divRateBase'><span id='spnRateBase'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRateBase' Style='margin-top: 20px;'></table></span></div>");
                             //strf.Append("<div id='divRateBase' validateonsubmit='true'><span id='spnRateBase'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRateBase' validateonsubmit='true' class='WebFormTable'></table></span></div>");
                            // htmlFormAdapter.Childform = strf.ToString();
                            // container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeDelete:
                            htmlFormAdapter.DisplayMode = DisplayModeType.Delete;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            htmlFormAdapter.objFormData = GetRecordRate();
                            strf.Append("<div id='divRateBase' validateonsubmit='true'><span id='spnRateBase'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRateBase' validateonsubmit='true' class='WebFormTable'></table></span></div>");
                            strf.Append("<div id='divULDRate' validateonsubmit='true'><span id='spnULDRate'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblULDRate' validateonsubmit='true' class='WebFormTable'></table></span></div>");
                            strf.Append("<div id='divRateParam'><span id='spnRateBase'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRateParam' border=1 class='WebFormTable'></table></span></div>");
                            strf.Append("<div id='divRemarks' validateonsubmit='true'><span id='spnRemarks'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRemarks' class='WebFormTable' validateonsubmit='true'></table></span></div>");
                            htmlFormAdapter.Childform = strf.ToString();
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
        }

        private object GetRecordRate()
        {
            object Rate = null;

            try
            {

                if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                {
                    RateDetailsER RateDetils = new RateDetailsER();
                    object obj = (object)RateDetils;
                    //retrieve Entity from Database according to the record
                    Rate = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID);
                    this.MyRecordID = (System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                }
                else
                {
                    //Error Message: Record not found.
                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            } return Rate;
        }


        public StringBuilder CreateWebForm(StringBuilder container)
        {
            StringBuilder strContent = new StringBuilder();
            try
            {
                if (System.Web.HttpContext.Current.Request.QueryString["FormAction"] != null)
                {
                    //Set the display Mode form the URL QuesyString.
                    //this.DisplayMode = "FORMACTION." + System.Web.HttpContext.Current.Request.QueryString["FormAction"].ToString().ToUpper().Trim();
                    this.DisplayMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
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
                        case DisplayModeDuplicate:
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
                        //SaveRate();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                        break;
                    case DisplayModeSaveAndNew:
                        //SaveRate();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                        break;
                    case DisplayModeUpdate:
                        //UpdateRate(Convert.ToInt32(System.Web.HttpContext.Current.Request.QueryString["RecID"]));
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                        break;

                    case DisplayModeDelete:
                        //DeleteRate(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
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

        private void DeleteRate(string p)
        {
            throw new NotImplementedException();
        }

        private void UpdateRate(int p)
        {
            throw new NotImplementedException();
        }

        private void SaveRate()
        {
            throw new NotImplementedException();
        }
        private void CreateGrid(StringBuilder Container)
        {
            try
            {
                using (Grid g = new Grid())
                {
                    g.PrimaryID = this.MyPrimaryID;
                    g.PageName = this.MyPageName;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.CommandButtonNewText = "New Rate";
                    g.FormCaptionText = "Rate";
                    g.ServiceModuleName = this.MyModuleID;
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.SuccessGrid = "OnSuccessGrid";
                    
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "OD", Title = "Airline", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "RateCardName", Title = "Rate Card", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "RateBased", Title = "Rate Based", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "OriginType", Title = "Origin Level", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "DestinationType", Title = "Destination Level", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Currency", Title = "Currency", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "ValidFrom", Title = "Valid From", DataType = GridDataType.Date.ToString() });
                    g.Column.Add(new GridColumn { Field = "ValidTo", Title = "Valid To", DataType = GridDataType.Date.ToString() });
                    g.Column.Add(new GridColumn { Field = "Active", Title = "Status", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "RateRaferenceNumber", Title = "Reference No", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "CreatedBy", Title = "Created By", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "UpdatedBy", Title = "Updated By", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "IsExcelUpload", Title = "Uploaded by Excel", DataType = GridDataType.String.ToString() });

                    //g.Column.Add(new GridColumn { Field = "Unit", Title = "Unit", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= Unit  #\">#= Unit  #</span>" });
                    //g.Column.Add(new GridColumn { Field = "FlightTypeName", Title = "Flight Type", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= FlightTypeName  #\">#= FlightTypeName  #</span>" });
                    //g.Column.Add(new GridColumn { Field = "OfficeName", Title = "Office Name", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= OfficeName  #\">#= OfficeName  #</span>" });
                    //g.Column.Add(new GridColumn { Field = "Commissionable", Title = "Commissionable", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= Commissionable  #\">#= Commissionable  #</span>" });
                    //g.Column.Add(new GridColumn { Field = "Weight_Breakup_Advantage", Title = "Weight Breakup Advantage", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= Weight_Breakup_Advantage  #\">#= Weight_Breakup_Advantage  #</span>" });

                    //g.Column.Add(new GridColumn { Field = "SlabName", Title = "Slab Name", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= SlabName  #\">#= SlabName  #</span>" });
                    //g.Column.Add(new GridColumn { Field = "SlabDetails", Title = "Slab Details with Rate", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= SlabDetails  #\">#= SlabDetails  #</span>" });
                    //g.Column.Add(new GridColumn { Field = "REMARKS", Title = "REMARKS", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= REMARKS  #\">#= REMARKS  #</span>" });
                    //g.Column.Add(new GridColumn { Field = "IssueCarrier", Title = "Issue Carrier", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= IssueCarrier  #\">#= IssueCarrier  #</span>" });
                    //g.Column.Add(new GridColumn { Field = "IssueCarrier_IsInclude", Title = "IssueCarrier_IsInclude", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= IssueCarrier_IsInclude  #\">#= IssueCarrier_IsInclude  #</span>" });
                    //g.Column.Add(new GridColumn { Field = "FlightNumber", Title = "Flight Number", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= FlightNumber  #\">#= FlightNumber  #</span>" });
                    //g.Column.Add(new GridColumn { Field = "Flight_IsInclude", Title = "Flight_IsInclude", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= Flight_IsInclude  #\">#= Flight_IsInclude  #</span>" });
                    //g.Column.Add(new GridColumn { Field = "ProductName", Title = "Product Name", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= ProductName  #\">#= ProductName  #</span>" });
                    //g.Column.Add(new GridColumn { Field = "ProductName_IsInclude", Title = "ProductName_IsInclude", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= ProductName_IsInclude  #\">#= ProductName_IsInclude  #</span>" });
                    //g.Column.Add(new GridColumn { Field = "AgentGroup", Title = "Agent Group", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= AgentGroup  #\">#= AgentGroup  #</span>" });
                    //g.Column.Add(new GridColumn { Field = "AgentGroup_IsInclude", Title = "AgentGroup_IsInclude", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= AgentGroup_IsInclude  #\">#= AgentGroup_IsInclude  #</span>" });
                    //g.Column.Add(new GridColumn { Field = "Commodity", Title = "Commodity", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= Commodity  #\">#= Commodity  #</span>" });
                    //g.Column.Add(new GridColumn { Field = "Commodity_IsInclude", Title = "Commodity_IsInclude", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= Commodity_IsInclude  #\">#= Commodity_IsInclude  #</span>" });
                    //g.Column.Add(new GridColumn { Field = "Shipper", Title = "Shipper", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= Shipper  #\">#= Shipper  #</span>" });
                    //g.Column.Add(new GridColumn { Field = "Shipper_IsInclude", Title = "Shipper_IsInclude", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= Shipper_IsInclude  #\">#= Shipper_IsInclude  #</span>" });
                    //g.Column.Add(new GridColumn { Field = "Agent", Title = "Agent", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= Agent  #\">#= Agent  #</span>" });
                    //g.Column.Add(new GridColumn { Field = "Agent_IsInclude", Title = "Agent_IsInclude", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= Agent_IsInclude  #\">#= Agent_IsInclude  #</span>" });
                    //g.Column.Add(new GridColumn { Field = "SPHC", Title = "SPHC", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= SPHC  #\">#= SPHC  #</span>" });
                    //g.Column.Add(new GridColumn { Field = "SPHC_IsInclude", Title = "SPHC_IsInclude", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= SPHC_IsInclude  #\">#= SPHC_IsInclude  #</span>" });
                    //g.Column.Add(new GridColumn { Field = "SPHCGroup", Title = "SPHC Group", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= SPHCGroup  #\">#= SPHCGroup  #</span>" });
                    //g.Column.Add(new GridColumn { Field = "SPHCGroup_IsInclude", Title = "SPHCGroup_IsInclude", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= SPHCGroup_IsInclude  #\">#= SPHCGroup_IsInclude  #</span>" });
                    //g.Column.Add(new GridColumn { Field = "TransitStation", Title = "Transit Station", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= TransitStation  #\">#= TransitStation  #</span>" });
                    //g.Column.Add(new GridColumn { Field = "TransitStation_IsInclude", Title = "TransitStation_IsInclude", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= TransitStation_IsInclude  #\">#= TransitStation_IsInclude  #</span>" });
                    //g.Column.Add(new GridColumn { Field = "WeekDays", Title = "WeekDays", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= WeekDays  #\">#= WeekDays  #</span>" });
                    //g.Column.Add(new GridColumn { Field = "WeekDays_IsInclude", Title = "WeekDays_IsInclude", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= WeekDays_IsInclude  #\">#= WeekDays_IsInclude  #</span>" });
                    //g.Column.Add(new GridColumn { Field = "ETDT", Title = "ETDT", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= ETDT  #\">#= ETDT  #</span>" });
                    //g.Column.Add(new GridColumn { Field = "ETD_IsInclude", Title = "ETD_IsInclude", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= ETD_IsInclude  #\">#= ETD_IsInclude  #</span>" });


                    g.InstantiateIn(Container);
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
