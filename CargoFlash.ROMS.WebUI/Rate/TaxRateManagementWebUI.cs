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
using System.Collections;
using CargoFlash.Cargo.Model.Rate;





namespace CargoFlash.Cargo.WebUI.Rate
{
    public class TaxRateManagementWebUI : BaseWebUISecureObject
    {
        public TaxRateManagementWebUI(Page PageContext)
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
                this.MyAppID = "TaxRate";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }

        public TaxRateManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Rate";
                this.MyAppID = "TaxRate";
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
                    htmlFormAdapter.HeadingColumnName = "REFNo"; // "TaxCode";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.objFormData = GetRecordRate();
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            //container.Append(htmlFormAdapter.InstantiateIn());

                            strf.Append("<div id='divRateParam'><span id='spnRateBase'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnTaxRateSNo' name='hdnTaxRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRateParam' border=1 class='WebFormTable'></table></span></div>");
                            strf.Append("<div id='divRemarks'><span id='spnRemarks'><input id='hdnCurrencySNo' name='hdnCurrencySNo' type='hidden' value=''/><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnTaxRateSNo' name='hdnTaxRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRemarks'></table></span></div>");
                            htmlFormAdapter.Childform = strf.ToString();
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.objFormData = GetRecordRate();
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            //container.Append(htmlFormAdapter.InstantiateIn());

                            strf.Append("<div id='divRateParam'><span id='spnRateBase'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnTaxRateSNo' name='hdnTaxRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRateParam' border=1 class='WebFormTable'></table></span></div>");
                            strf.Append("<div id='divRemarks'><span id='spnRemarks'><input id='hdnCurrencySNo' name='hdnCurrencySNo' type='hidden' value=''/><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnTaxRateSNo' name='hdnTaxRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRemarks'></table></span></div>");

                            htmlFormAdapter.Childform = strf.ToString();
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.objFormData = GetRecordRate();
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            // container.Append(htmlFormAdapter.InstantiateIn());

                            strf.Append("<div id='divRateParam'><span id='spnRateBase'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnTaxRateSNo' name='hdnTaxRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRateParam' border=1 class='WebFormTable'></table></span></div>");
                            strf.Append("<div id='divRemarks'><span id='spnRemarks'><input id='hdnCurrencySNo' name='hdnCurrencySNo' type='hidden' value=''/><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnTaxRateSNo' name='hdnTaxRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRemarks'></table></span></div>");

                            htmlFormAdapter.Childform = strf.ToString();
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            htmlFormAdapter.objFormData = GetRecordRate();
                            container.Append(htmlFormAdapter.InstantiateIn());

                            container.Append("<div id='divRateParam'><span id='spnRateBase'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnTaxRateSNo' name='hdnTaxRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRateParam' border=1 class='WebFormTable'></table></span></div>");
                            container.Append("<div id='divRemarks'><span id='spnRemarks'><input id='hdnCurrencySNo' name='hdnCurrencySNo' type='hidden' value=''/><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnTaxRateSNo' name='hdnTaxRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRemarks'></table></span></div>");
                            break;
                        //case DisplayModeDelete:
                        //    htmlFormAdapter.DisplayMode = DisplayModeType.Delete;
                        //    htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                        //    htmlFormAdapter.objFormData = GetRecordRate();
                        //    container.Append(htmlFormAdapter.InstantiateIn());

                        //    container.Append("<div id='divRateParam'><span id='spnRateBase'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnTaxRateSNo' name='hdnTaxRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRateParam' border=1 class='WebFormTable'></table></span></div>");
                        //    container.Append("<div id='divRemarks'><span id='spnRemarks'><input id='hdnCurrencySNo' name='hdnCurrencySNo' type='hidden' value=''/><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnTaxRateSNo' name='hdnTaxRateSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblRemarks'></table></span></div>");
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

            }
        }

        private object GetRecordRate()
        {
            object Rate = null;

            try
            {

                if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                {
                    ReadTaxRateDetails RateDetils = new ReadTaxRateDetails();
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
                        // SaveRate();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                        break;
                    case DisplayModeSaveAndNew:
                        // SaveRate();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                        break;
                    case DisplayModeUpdate:
                        // UpdateRate(Convert.ToInt32(System.Web.HttpContext.Current.Request.QueryString["RecID"]));
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                        break;

                    case DisplayModeDelete:
                        // DeleteRate(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
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
                    g.CommandButtonNewText = "New Manage Tax";
                    g.FormCaptionText = "Manage Tax";
                    g.ServiceModuleName = this.MyModuleID;
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.SuccessGrid = "OnSuccessGrid";
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "Airline", Title = "Airline", DataType = GridDataType.String.ToString() });
                    // g.Column.Add(new GridColumn { Field = "TaxDefination", Title = "Tax Definition", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "TaxType", Title = "Tax Type", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "OriginLevel", Title = "Origin Level", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "DestinationLevel", Title = "Destination Level", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "StartDate", Title = "Valid From", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "EndDate", Title = "Valid To", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Status", Title = "Status", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "ReferenceNo", Title = "Reference No.", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "TaxCode", Title = "Tax Code", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "TaxAppliedOn", Title = "Tax Applicability", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Createduser", Title = "Created By", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "UpdatedUser", Title = "Updated By", DataType = GridDataType.String.ToString() });
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
