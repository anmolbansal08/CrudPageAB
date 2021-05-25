using CargoFlash.Cargo.Model.Master;
using CargoFlash.Cargo.Model.Rate;
using CargoFlash.SoftwareFactory.WebUI;
using CargoFlash.SoftwareFactory.WebUI.Adapters;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI;

namespace CargoFlash.Cargo.WebUI.Rate
{
    public class OtherChargesManagementWebUI : BaseWebUISecureObject
    {
        public OtherChargesManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Rate";
                this.MyAppID = "OtherCharges";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }
        public OtherChargesManagementWebUI(Page PageContext)
        {
            try
            {
                if (this.SetCurrentPageContext(PageContext))
                {
                    this.ErrorNumber = 0;
                    this.ErrorMessage = "";
                }
                this.MyPageName = "Default.aspx";
                this.MyModuleID = "OtherCharges";
                this.MyAppID = "OtherCharges";
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
                    StringBuilder strf = new StringBuilder();
                    htmlFormAdapter.Ischildform = true;
                    htmlFormAdapter.CurrentPage = this.CurrentPageContext;
                    htmlFormAdapter.HeadingColumnName = "ReferenceNumber";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.objFormData = GetOtherChargesRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            //container.Append(htmlFormAdapter.InstantiateIn());
                            strf.Append("<div id='divRateBase'><span id='spnRateBase'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRateBase'></table></span></div>");
                            //container.Append("<div id='divULDRate'><span id='spnULDRate'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblULDRate'></table></span></div>");
                            strf.Append("<div id='divRateParam'><span id='spnRateBase'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRateParam' border=1 class='WebFormTable'></table></span></div>");
                            strf.Append("<div id='divRemarks'><span id='spnRemarks'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRemarks'></table></span></div>");
                            htmlFormAdapter.Childform = strf.ToString();
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.objFormData = GetOtherChargesRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            //container.Append(htmlFormAdapter.InstantiateIn());
                            strf.Append("<div id='divRateBase'><span id='spnRateBase'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRateBase'></table></span></div>");
                            //container.Append("<div id='divULDRate'><span id='spnULDRate'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblULDRate'></table></span></div>");
                            strf.Append("<div id='divRateParam'><span id='spnRateBase'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRateParam' border=1 class='WebFormTable'></table></span></div>");
                            strf.Append("<div id='divRemarks'><span id='spnRemarks'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRemarks'></table></span></div>");
                            htmlFormAdapter.Childform = strf.ToString();
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.objFormData = GetOtherChargesRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            //container.Append(htmlFormAdapter.InstantiateIn());
                            strf.Append("<div id='divRateBase'><span id='spnRateBase'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRateBase'></table></span></div>");
                            //container.Append("<div id='divULDRate'><span id='spnULDRate'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblULDRate'></table></span></div>");
                            strf.Append("<div id='divRateParam'><span id='spnRateBase'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRateParam' border=1 class='WebFormTable'></table></span></div>");
                            strf.Append("<div id='divRemarks'><span id='spnRemarks'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRemarks'></table></span></div>");
                            htmlFormAdapter.Childform = strf.ToString();
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append("<div id='divRateBase'><span id='spnRateBase'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRateBase'></table></span></div>");
                            //container.Append("<div id='divULDRate'><span id='spnULDRate'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblULDRate'></table></span></div>");
                            container.Append("<div id='divRateParam'><span id='spnRateBase'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRateParam' border=1 class='WebFormTable'></table></span></div>");
                            container.Append("<div id='divRemarks'><span id='spnRemarks'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRemarks'></table></span></div>");
                            break;
                        case DisplayModeDelete:
                            htmlFormAdapter.objFormData = GetOtherChargesRecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Delete;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append("<div id='divRateBase'><span id='spnRateBase'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRateBase'></table></span></div>");
                            //container.Append("<div id='divULDRate'><span id='spnULDRate'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblULDRate'></table></span></div>");
                            container.Append("<div id='divRateParam'><span id='spnRateBase'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRateParam' border=1 class='WebFormTable'></table></span></div>");
                            container.Append("<div id='divRemarks'><span id='spnRemarks'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateSNo' name='hdnRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRemarks'></table></span></div>");
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
                            //DownloadExcelGrid(container);
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
        //private StringBuilder CreateGrid(StringBuilder container)
        //{
        //    try
        //    {
        //        using (Grid g = new Grid())
        //        {
        //            g.CommandButtonNewText = "New Other Charges";
        //            g.FormCaptionText = "Charges";
        //            g.PrimaryID = this.MyPrimaryID;
        //            g.PageName = this.MyPageName;
        //            g.ModuleName = this.MyModuleID;
        //            g.AppsName = this.MyAppID;
        //            g.IsAllowedAction = false;
        //            g.ServiceModuleName = this.MyModuleID;
        //           // g.SuccessGrid = "ExporttoExcel";
        //            g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
        //            g.Column = new List<GridColumn>();
                  
        //            g.Column.Add(new GridColumn { Field = "Airline", Title = "Airline", DataType = GridDataType.String.ToString() });
        //            g.Column.Add(new GridColumn { Field = "OriginLevel", Title = "Origin Level", DataType = GridDataType.String.ToString() });
        //            g.Column.Add(new GridColumn { Field = "DestinationLevel", Title = "Destination Level", DataType = GridDataType.String.ToString() });
        //            g.Column.Add(new GridColumn { Field = "OtherCharges", Title = "Other Charges", DataType = GridDataType.String.ToString() });
        //            g.Column.Add(new GridColumn { Field = "ChargeType", Title = "Charge Type", DataType = GridDataType.String.ToString() });
        //            g.Column.Add(new GridColumn { Field = "PaymentType", Title = "Payment Type", DataType = GridDataType.String.ToString() });
        //            g.Column.Add(new GridColumn { Field = "Currency", Title = "Currency", DataType = GridDataType.String.ToString() });
        //            g.Column.Add(new GridColumn { Field = "ValidFrom", Title = "Valid From", DataType = GridDataType.Date.ToString() });
        //            g.Column.Add(new GridColumn { Field = "ValidTo", Title = "Valid To", DataType = GridDataType.Date.ToString() });
        //            g.Column.Add(new GridColumn { Field = "Charge_Type", Title = "Charge Type", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= Charge_Type  #\">#= Charge_Type  #</span>" });
        //            g.Column.Add(new GridColumn { Field = "Status", Title = "Status", DataType = GridDataType.String.ToString() });
        //            g.Column.Add(new GridColumn { Field = "ReferenceNumber", Title = "Reference Number", DataType = GridDataType.String.ToString() });
        //            g.Column.Add(new GridColumn { Field = "Mandatory", Title = "Mandatory", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= Mandatory  #\">#= Mandatory  #</span>" });
        //            g.Column.Add(new GridColumn { Field = "Taxable", Title = "Taxable", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= Taxable  #\">#= Taxable  #</span>" });
        //            g.Column.Add(new GridColumn { Field = "Commissionable", Title = "Commissionable", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= Commissionable  #\">#= Commissionable  #</span>" });
        //            g.Column.Add(new GridColumn { Field = "Unit", Title = "Unit", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= Unit  #\">#= Unit  #</span>" });
        //            g.Column.Add(new GridColumn { Field = "ApplicableOn", Title = "Applicable On", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= ApplicableOn  #\">#= ApplicableOn  #</span>" });
        //            g.Column.Add(new GridColumn { Field = "IsReplanCharges", Title = "Replan Charges", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= IsReplanCharges  #\">#= IsReplanCharges  #</span>" });
        //            g.Column.Add(new GridColumn { Field = "MinimumCharge", Title = "Minimum Value", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= MinimumCharge  #\">#= MinimumCharge  #</span>" });
        //            g.Column.Add(new GridColumn { Field = "Charge", Title = "Charge Value", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= Charge  #\">#= Charge  #</span>" });
        //            g.Column.Add(new GridColumn { Field = "CreatedUser", Title = "Created By", DataType = GridDataType.String.ToString() });
        //            g.Column.Add(new GridColumn { Field = "UpdatedUser", Title = "Updated By", DataType = GridDataType.String.ToString() });
        //            // StartWeight,EndWeight,Rate,BasedOn,SlabName,
        //            //g.Column.Add(new GridColumn { Field = "StartWeight", Title = "Start Weight", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= StartWeight  #\">#= StartWeight  #</span>" });
        //            //g.Column.Add(new GridColumn { Field = "EndWeight", Title = "End Weight", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= EndWeight  #\">#= EndWeight  #</span>" });
        //            //g.Column.Add(new GridColumn { Field = "Rate", Title = "Rate", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= Rate  #\">#= Rate  #</span>" });
        //            //g.Column.Add(new GridColumn { Field = "BasedOn", Title = "Type", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= BasedOn  #\">#= BasedOn  #</span>" });
                   
                    

        //            g.InstantiateIn(container);
                  
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        ApplicationWebUI applicationWebUI = new ApplicationWebUI();
        //        applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
        //    }
        //    return container;
        //}

        private StringBuilder CreateGrid(StringBuilder container)
        {
            try
            {
                using (Grid g = new Grid())
                {
                    g.CommandButtonNewText = "New Other Charges";
                    g.FormCaptionText = "Charges";
                    g.PrimaryID = this.MyPrimaryID;
                    g.PageName = this.MyPageName;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.IsAllowedAction = false;
                    g.ServiceModuleName = this.MyModuleID;
                    // g.SuccessGrid = "ExporttoExcel";
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();

                    g.Column.Add(new GridColumn { Field = "Airline", Title = "Airline", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "OriginLevel", Title = "Origin Level", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "DestinationLevel", Title = "Destination Level", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "OtherCharges", Title = "Other Charges", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "ChargeType", Title = "Charge Type", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "PaymentType", Title = "Payment Type", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Currency", Title = "Currency", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "ValidFrom", Title = "Valid From", DataType = GridDataType.Date.ToString() });
                    g.Column.Add(new GridColumn { Field = "ValidTo", Title = "Valid To", DataType = GridDataType.Date.ToString() });
                    g.Column.Add(new GridColumn { Field = "Charge_Type", Title = "Charge Type", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= Charge_Type  #\">#= Charge_Type  #</span>" });
                    g.Column.Add(new GridColumn { Field = "Status", Title = "Status", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "ReferenceNumber", Title = "Reference Number", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Mandatory", Title = "Mandatory", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= Mandatory  #\">#= Mandatory  #</span>" });
                    g.Column.Add(new GridColumn { Field = "Taxable", Title = "Taxable", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= Taxable  #\">#= Taxable  #</span>" });
                    g.Column.Add(new GridColumn { Field = "Commissionable", Title = "Commissionable", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= Commissionable  #\">#= Commissionable  #</span>" });
                    g.Column.Add(new GridColumn { Field = "Unit", Title = "Unit", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= Unit  #\">#= Unit  #</span>" });
                    g.Column.Add(new GridColumn { Field = "ApplicableOn", Title = "Applicable On", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= ApplicableOn  #\">#= ApplicableOn  #</span>" });
                    g.Column.Add(new GridColumn { Field = "IsReplanCharges", Title = "Replan Charges", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= IsReplanCharges  #\">#= IsReplanCharges  #</span>" });
                    g.Column.Add(new GridColumn { Field = "MinimumCharge", Title = "Minimum Value", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= MinimumCharge  #\">#= MinimumCharge  #</span>" });
                    g.Column.Add(new GridColumn { Field = "Charge", Title = "Charge Value", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= Charge  #\">#= Charge  #</span>" });
                    g.Column.Add(new GridColumn { Field = "CreatedUser", Title = "Created By", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "UpdatedUser", Title = "Updated By", DataType = GridDataType.String.ToString() });
                    // StartWeight,EndWeight,Rate,BasedOn,SlabName,
                    //g.Column.Add(new GridColumn { Field = "StartWeight", Title = "Start Weight", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= StartWeight  #\">#= StartWeight  #</span>" });
                    //g.Column.Add(new GridColumn { Field = "EndWeight", Title = "End Weight", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= EndWeight  #\">#= EndWeight  #</span>" });
                    //g.Column.Add(new GridColumn { Field = "Rate", Title = "Rate", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= Rate  #\">#= Rate  #</span>" });
                    //g.Column.Add(new GridColumn { Field = "BasedOn", Title = "Type", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= BasedOn  #\">#= BasedOn  #</span>" });
                    g.Column.Add(new GridColumn { Field = "SlabName", Title = "Slab Name", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= SlabName  #\">#= SlabName  #</span>" });
                    g.Column.Add(new GridColumn { Field = "SlabDetails", Title = "Slab Details with Rate", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= SlabDetails  #\">#= SlabDetails  #</span>" });
                    g.Column.Add(new GridColumn { Field = "REMARKS", Title = "REMARKS", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= REMARKS  #\">#= REMARKS  #</span>" });
                    g.Column.Add(new GridColumn { Field = "IssueCarrier", Title = "Issue Carrier", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= IssueCarrier  #\">#= IssueCarrier  #</span>" });
                    g.Column.Add(new GridColumn { Field = "IssueCarrier_IsInclude", Title = "IssueCarrier_IsInclude", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= IssueCarrier_IsInclude  #\">#= IssueCarrier_IsInclude  #</span>" });
                    g.Column.Add(new GridColumn { Field = "FlightNumber", Title = "Flight Number", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= FlightNumber  #\">#= FlightNumber  #</span>" });
                    g.Column.Add(new GridColumn { Field = "FlightNumber_IsInclude", Title = "FlightNumber_IsInclude", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= FlightNumber_IsInclude  #\">#= FlightNumber_IsInclude  #</span>" });
                    g.Column.Add(new GridColumn { Field = "ProductName", Title = "Product Name", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= ProductName  #\">#= ProductName  #</span>" });
                    g.Column.Add(new GridColumn { Field = "Product_IsInclude", Title = "Product_IsInclude", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= Product_IsInclude  #\">#= Product_IsInclude  #</span>" });
                    g.Column.Add(new GridColumn { Field = "AgentGroup", Title = "Agent Group", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= AgentGroup  #\">#= AgentGroup  #</span>" });
                    g.Column.Add(new GridColumn { Field = "AccountGroup_IsInclude", Title = "AccountGroup_IsInclude", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= AccountGroup_IsInclude  #\">#= AccountGroup_IsInclude  #</span>" });
                    g.Column.Add(new GridColumn { Field = "Commodity", Title = "Commodity", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= Commodity  #\">#= Commodity  #</span>" });
                    g.Column.Add(new GridColumn { Field = "Commodity_IsInclude", Title = "Commodity_IsInclude", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= Commodity_IsInclude  #\">#= Commodity_IsInclude  #</span>" });
                    g.Column.Add(new GridColumn { Field = "Shipper", Title = "Shipper", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= Shipper  #\">#= Shipper  #</span>" });
                    g.Column.Add(new GridColumn { Field = "AccountShipper_IsInclude", Title = "AccountShipper_IsInclude", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= AccountShipper_IsInclude  #\">#= AccountShipper_IsInclude  #</span>" });
                    g.Column.Add(new GridColumn { Field = "Agent", Title = "Agent", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= Agent  #\">#= Agent  #</span>" });
                    g.Column.Add(new GridColumn { Field = "Account_IsInclude", Title = "Account_IsInclude", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= Account_IsInclude  #\">#= Account_IsInclude  #</span>" });
                    g.Column.Add(new GridColumn { Field = "SPHC", Title = "SPHC", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= SPHC  #\">#= SPHC  #</span>" });
                    g.Column.Add(new GridColumn { Field = "SPHC_IsInclude", Title = "SPHC_IsInclude", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= SPHC_IsInclude  #\">#= SPHC_IsInclude  #</span>" });
                    g.Column.Add(new GridColumn { Field = "SPHCGroup", Title = "SPHC Group", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= SPHCGroup  #\">#= SPHCGroup  #</span>" });
                    g.Column.Add(new GridColumn { Field = "SPHCGroup_IsInclude", Title = "SPHCGroup_IsInclude", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= SPHCGroup_IsInclude  #\">#= SPHCGroup_IsInclude  #</span>" });
                    g.Column.Add(new GridColumn { Field = "TransitStation", Title = "Transit Station", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= TransitStation  #\">#= TransitStation  #</span>" });
                    g.Column.Add(new GridColumn { Field = "Transit_IsInclude", Title = "Transit_IsInclude", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= Transit_IsInclude  #\">#= Transit_IsInclude  #</span>" });
                    g.Column.Add(new GridColumn { Field = "WeekDays", Title = "WeekDays", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= WeekDays  #\">#= WeekDays  #</span>" });
                    g.Column.Add(new GridColumn { Field = "WeekDays_IsInclude", Title = "WeekDays_IsInclude", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= WeekDays_IsInclude  #\">#= WeekDays_IsInclude  #</span>" });
                    g.Column.Add(new GridColumn { Field = "ETDT", Title = "ETDT", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= ETDT  #\">#= ETDT  #</span>" });
                    g.Column.Add(new GridColumn { Field = "ETDT_IsInclude", Title = "ETDT_IsInclude", IsHidden = true, DataType = GridDataType.String.ToString(), Template = "<span title=\"#= ETDT_IsInclude  #\">#= ETDT_IsInclude  #</span>" });


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
                        SaveOtherCharges();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                        break;
                    case DisplayModeSaveAndNew:
                        SaveOtherCharges();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                        break;
                    case DisplayModeUpdate:
                        UpdateOtherCharges(Convert.ToInt32(System.Web.HttpContext.Current.Request.QueryString["RecID"]));
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                        break;
                    case DisplayModeDelete:
                        DeleteOtherCharges(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
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

        private void SaveOtherCharges()
        {
            try
            {
                List<OtherCharges> listOtherChargesDetails = new List<OtherCharges>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                List<OtherChargesRemarks> listRemarks = new List<OtherChargesRemarks>();
                List<OtherChargesSlabParameter> listSlabs = new List<OtherChargesSlabParameter>();
                List<OtherChargesRateParameter> listOtherChargesRateParameter = new List<OtherChargesRateParameter>();
                listRemarks.Add(new OtherChargesRemarks { Remarks = FormElement["tblRemarks_Remarks_1"] });
                
                if (Convert.ToInt16(FormElement["ChargeType"]) == 1 || Convert.ToInt16(FormElement["ChargeType"]) == 4 || Convert.ToInt16(FormElement["ChargeType"]) == 5 || ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).SysSetting["FlateChargesOnSlabRateApply"].ToString().Trim() == "TRUE")
                {
                    int SlabCount = Convert.ToInt32(FormElement["SlabCount"].Split(',').Length);
                    //   var FormElement = System.Web.HttpContext.Current.Request.Form;
                    string[] values = FormElement["SlabCount"].ToString().Split(',');

                    for (int i = 0; i < SlabCount - 1; i++)
                    {
                        listSlabs.Add(new OtherChargesSlabParameter()
                        {
                            SNo = i,
                            SlabSNo = FormElement["tblRateBase_SNo_" + values[i]] == "" ? 0 : Convert.ToInt32(FormElement["tblRateBase_SNo_" + values[i]]),
                            RateClassSNo = FormElement["tblRateBase_RateClassSNo_" + values[i]] == "" ? 0 : Convert.ToInt32(FormElement["tblRateBase_RateClassSNo_" + values[i]]), //Convert.ToInt32(FormElement["tblRateBase_RateClassSNo_" + i]),
                            RateValue = Convert.ToDecimal(FormElement["tblRateBase_RateValue_" + values[i]]),
                            SlabName = Convert.ToString(FormElement["tblRateBase_SlabName_" + values[i]]),
                            StartWt = Convert.ToDecimal(FormElement["tblRateBase_StartWt_" + values[i]]),
                            EndWt = Convert.ToDecimal(FormElement["tblRateBase_EndWt_" + values[i]])
                        });
                    }
                }
                var rateParameters = new OtherChargesRateParameter
                {
                    SNo = 0,
                    IssueCarrierSNo = Convert.ToString(FormElement["IssueCarrierSNo"]),
                    IEIssueCarrier = Convert.ToString(FormElement["IEIssueCarrier"]) == "1" ? true : false,
                    FlightSNo = Convert.ToString(FormElement["FlightSNo"]),
                    IEFlight = Convert.ToString(FormElement["IEFlight"]) == "1" ? true : false,
                    StartTime = Convert.ToInt32(FormElement["StartTime"] == "" ? "0" : FormElement["StartTime"]),
                    EndTime = Convert.ToInt32(FormElement["EndTime"] == "" ? "0" : FormElement["EndTime"]),
                    IEEtd = Convert.ToString(FormElement["IEEtd"]) == "1" ? true : false,
                    Days = Convert.ToString(FormElement["Days"]),
                    IEDays = Convert.ToString(FormElement["IEDays"]) == "1" ? true : false,
                    TransitStationsSNo = Convert.ToString(FormElement["TransitStationsSNo"]),
                    IETransitStation = Convert.ToString(FormElement["IETransitStation"]) == "1" ? true : false,
                    ProductSNo = Convert.ToString(FormElement["ProductSNo"]),
                    IEProduct = Convert.ToString(FormElement["IEProduct"]) == "1" ? true : false,
                    AgentGroupSNo = Convert.ToString(FormElement["AgentGroupSNo"]),
                    IEAgentGroup = Convert.ToString(FormElement["IEAgentGroup"]) == "1" ? true : false,
                    CommoditySNo = Convert.ToString(FormElement["CommoditySNo"]),
                    IECommodity = Convert.ToString(FormElement["IECommodity"]) == "1" ? true : false,
                    AccountSNo = Convert.ToString(FormElement["AccountSNo"]),
                    IEAccount = Convert.ToString(FormElement["IEAccount"]) == "1" ? true : false,
                    SHCSNo = Convert.ToString(FormElement["SHCSNo"]),
                    IESHCS = Convert.ToString(FormElement["IESHCS"]) == "1" ? true : false,
                    ShipperSNo = Convert.ToString(FormElement["ShipperSNo"]),
                    IEShipper = Convert.ToString(FormElement["IEShipper"]) == "1" ? true : false,
                    SPHCGroupSNo = Convert.ToString(FormElement["SPHCGroupSNo"]),
                    IESPHCGroup = Convert.ToString(FormElement["IESPHCGroup"]) == "1" ? true : false,
                };
                listOtherChargesRateParameter.Add(rateParameters);
                var otherCharges = new OtherCharges
                {
                    SNo = 0,
                    AirlineSNo = Convert.ToString(FormElement["AirlineSNo"].Split('-')[0]),
                    OtherChargeType = Convert.ToInt32(FormElement["Charge"]),
                    ApplicableOn = Convert.ToInt32(FormElement["ApplicableOn"]),
                    DueCarrierCodeSNo = Convert.ToString(FormElement["OCCodeSNo"].Split('-')[0]),
                    IsOtherChargeMandatory = FormElement["IsOtherChargeMandatory"] == null ? false : true,
                    IsTaxable = FormElement["IsTaxable"] == null ? false : true,
                    IsCommissionable = FormElement["IsCommissionable"] == null ? false : true,
                    OriginLevel = Convert.ToInt32(FormElement["OriginType"]),
                    DestinationLevel = Convert.ToInt32(FormElement["DestinationType"]),
                    OriginCitySNo = Convert.ToInt32(FormElement["OriginSNo"]),
                    DestinationCitySNo = Convert.ToInt32(FormElement["DestinationSNo"]),
                    CurrencySNo = Convert.ToInt32(FormElement["CurrencySNo"]),
                    ValidFrom = Convert.ToDateTime(FormElement["ValidFrom"]),
                    ValidTo = Convert.ToDateTime(FormElement["ValidTo"] == "" ? "31/12/9999" : FormElement["ValidTo"]),
                    Unit = Convert.ToInt16(FormElement["UOMSNo"]),
                    PaymentType = Convert.ToInt16(FormElement["PaymentType"]),
                    Status = Convert.ToInt16(FormElement["Active"]),
                    MinimumCharge = FormElement["Minimum"] == "" ? 0 : Convert.ToDecimal(FormElement["Minimum"]),
                    Charge = FormElement["ChargeText"] == "" ? 0 : Convert.ToDecimal(FormElement["ChargeText"]),
                    ChargeType = Convert.ToInt16(FormElement["ChargeType"]),
                    ReferenceNumber = "",
                    IsActive = true,
                    CreatedBy = Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                    UpdatedBy = Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                   
                    IsReplanCharges = Convert.ToBoolean(FormElement["IsReplanCharges"] == "0" ? true : false),
                    listOtherChargesRemarks = listRemarks,
                    listOtherChargesSLABParameter = listSlabs,
                    listOtherChargesRateParameter = listOtherChargesRateParameter
                };
                listOtherChargesDetails.Add(otherCharges);
                //listOtherChargesDetails.Add(region);
                object datalist = (object)listOtherChargesDetails;

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

        private object GetOtherChargesRecord()
        {
            object othercharges = null;
            try
            {
                if (!DisplayMode.ToLower().Contains("new"))
                {
                    if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                    {
                        OtherCharges otherChargesList = new OtherCharges();
                        CargoFlash.Cargo.DataService.Common.CommonService cs = new CargoFlash.Cargo.DataService.Common.CommonService();
                        //var RecordId = cs.Decrypt(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                        object obj = (object)otherChargesList;
                        IDictionary<string, string> qString = new Dictionary<string, string>();
                        qString.Add("UserSNo", ((Model.UserLogin)(HttpContext.Current.Session["UserDetail"])).UserSNo.ToString());
                        othercharges = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID, "", "", qString);
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
            return othercharges;
        }

        private void UpdateOtherCharges(int RecordID)
        {
            try
            {
                List<OtherCharges> listOtherChargesDetails = new List<OtherCharges>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                List<OtherChargesRemarks> listRemarks = new List<OtherChargesRemarks>();
                List<OtherChargesSlabParameter> listSlabs = new List<OtherChargesSlabParameter>();
                List<OtherChargesRateParameter> listOtherChargesRateParameter = new List<OtherChargesRateParameter>();
                int RemarksCount = Convert.ToInt32(FormElement["RemarksCount"]);
                for (int i = 1; i <= RemarksCount; i++)
                {
                    if (Convert.ToString(FormElement["tblRemarks_Remarks_" + i]) != null)
                        listRemarks.Add(new OtherChargesRemarks { Remarks = FormElement["tblRemarks_Remarks_" + i] });
                }
                if (Convert.ToInt16(FormElement["ChargeType"]) == 1 || Convert.ToInt16(FormElement["ChargeType"]) == 4 || Convert.ToInt16(FormElement["ChargeType"]) == 5)
                {
                    int SlabCount = Convert.ToInt32(FormElement["SlabCount"].Split(',').Length);
                    //   var FormElement = System.Web.HttpContext.Current.Request.Form;
                    string[] values = FormElement["SlabCount"].ToString().Split(',');

                    for (int i = 0; i < SlabCount - 1; i++)
                    {
                        listSlabs.Add(new OtherChargesSlabParameter()
                        {
                            SNo = i,
                            SlabSNo = FormElement["tblRateBase_SNo_" + values[i]] == "" ? 0 : Convert.ToInt32(FormElement["tblRateBase_SNo_" + values[i]]),
                            RateClassSNo = FormElement["tblRateBase_RateClassSNo_" + values[i]] == "" ? 0 : Convert.ToInt32(FormElement["tblRateBase_RateClassSNo_" + values[i]]), //Convert.ToInt32(FormElement["tblRateBase_RateClassSNo_" + i]),
                            RateValue = Convert.ToDecimal(FormElement["tblRateBase_RateValue_" + values[i]]),
                            SlabName = Convert.ToString(FormElement["tblRateBase_SlabName_" + values[i]]),
                            StartWt = Convert.ToDecimal(FormElement["tblRateBase_StartWt_" + values[i]]),
                            EndWt = Convert.ToDecimal(FormElement["tblRateBase_EndWt_" + values[i]])
                        });
                    }
                }
                var rateParameters = new OtherChargesRateParameter
                {
                    SNo = 0,
                    IssueCarrierSNo = Convert.ToString(FormElement["IssueCarrierSNo"]).TrimStart(','),
                    IEIssueCarrier = Convert.ToString(FormElement["IEIssueCarrier"]) == "1" ? true : false,
                    FlightSNo = Convert.ToString(FormElement["FlightSNo"]).TrimStart(','),
                    IEFlight = Convert.ToString(FormElement["IEFlight"]) == "1" ? true : false,
                    StartTime = Convert.ToInt32(FormElement["StartTime"] == "" ? "0" : FormElement["StartTime"]),
                    EndTime = Convert.ToInt32(FormElement["EndTime"] == "" ? "0" : FormElement["EndTime"]),
                    IEEtd = Convert.ToString(FormElement["IEEtd"]) == "1" ? true : false,
                    Days = Convert.ToString(FormElement["Days"] == null ? "" : FormElement["Days"]).TrimStart(','),
                    IEDays = Convert.ToString(FormElement["IEDays"]) == "1" ? true : false,
                    TransitStationsSNo = Convert.ToString(FormElement["TransitStationsSNo"]).TrimStart(','),
                    IETransitStation = Convert.ToString(FormElement["IETransitStation"]) == "1" ? true : false,
                    ProductSNo = Convert.ToString(FormElement["ProductSNo"]).TrimStart(','),
                    IEProduct = Convert.ToString(FormElement["IEProduct"]) == "1" ? true : false,
                    AgentGroupSNo = Convert.ToString(FormElement["AgentGroupSNo"]).TrimStart(','),
                    IEAgentGroup = Convert.ToString(FormElement["IEAgentGroup"]) == "1" ? true : false,
                    CommoditySNo = Convert.ToString(FormElement["CommoditySNo"]).TrimStart(','),
                    IECommodity = Convert.ToString(FormElement["IECommodity"]) == "1" ? true : false,
                    AccountSNo = Convert.ToString(FormElement["AccountSNo"]).TrimStart(','),
                    IEAccount = Convert.ToString(FormElement["IEAccount"]) == "1" ? true : false,
                    SHCSNo = Convert.ToString(FormElement["SHCSNo"]).TrimStart(','),
                    IESHCS = Convert.ToString(FormElement["IESHCS"]) == "1" ? true : false,
                    ShipperSNo = Convert.ToString(FormElement["ShipperSNo"]).TrimStart(','),
                    IEShipper = Convert.ToString(FormElement["IEShipper"]) == "1" ? true : false,
                    SPHCGroupSNo = Convert.ToString(FormElement["SPHCGroupSNo"]).TrimStart(','),
                    IESPHCGroup = Convert.ToString(FormElement["IESPHCGroup"]) == "1" ? true : false,
                };
                listOtherChargesRateParameter.Add(rateParameters);
                var otherCharges = new OtherCharges
                {
                    SNo = RecordID,
                    AirlineSNo = Convert.ToString(FormElement["AirlineSNo"].Split('-')[0]),
                    OtherChargeType = Convert.ToInt32(FormElement["Charge"]),
                    ApplicableOn = Convert.ToInt32(FormElement["ApplicableOn"]),
                    DueCarrierCodeSNo = Convert.ToString(FormElement["OCCodeSNo"].Split('-')[0]),
                    IsOtherChargeMandatory = FormElement["IsOtherChargeMandatory"] == null ? false : true,
                    IsTaxable = FormElement["IsTaxable"] == null ? false : true,
                    IsCommissionable = FormElement["IsCommissionable"] == null ? false : true,
                    OriginLevel = Convert.ToInt32(FormElement["OriginType"]),
                    DestinationLevel = Convert.ToInt32(FormElement["DestinationType"]),
                    OriginCitySNo = Convert.ToInt32(FormElement["OriginSNo"]),
                    DestinationCitySNo = Convert.ToInt32(FormElement["DestinationSNo"]),
                    CurrencySNo = Convert.ToInt32(FormElement["CurrencySNo"]),
                    ValidFrom = Convert.ToDateTime(DateTime.Now),
                    ValidTo = Convert.ToDateTime(FormElement["ValidTo"] == "" ? "31/12/9999" : FormElement["ValidTo"]),
                    Unit = Convert.ToInt16(FormElement["UOMSNo"]),
                    PaymentType = Convert.ToInt16(FormElement["PaymentType"]),
                    Status = Convert.ToInt16(FormElement["Active"]),
                    MinimumCharge = FormElement["Minimum"] == "" ? 0 : Convert.ToDecimal(FormElement["Minimum"]),
                    Charge = FormElement["ChargeText"] == "" ? 0 : Convert.ToDecimal(FormElement["ChargeText"]),
                    ChargeType = Convert.ToInt16(FormElement["ChargeType"]),
                    IsActive = true,
                    CreatedBy = Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                    UpdatedBy = Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                    IsReplanCharges = Convert.ToBoolean(FormElement["IsReplanCharges"] == "0" ? true : false),
                    listOtherChargesRemarks = listRemarks,
                    listOtherChargesSLABParameter = listSlabs,
                    listOtherChargesRateParameter = listOtherChargesRateParameter
                };
                listOtherChargesDetails.Add(otherCharges);
                //listOtherChargesDetails.Add(region);
                object datalist = (object)listOtherChargesDetails;

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

        public void DeleteOtherCharges(string RecordID)
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
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }
    }
}
