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
using CargoFlash.Cargo.Model.Tariff;
using System.Collections;
using CargoFlash.Cargo.WebUI;

namespace CargoFlash.Cargo.WebUI.Tariff
{
    public class ManageTariffManagementWebUI : BaseWebUISecureObject
    {
        public ManageTariffManagementWebUI()
        {
            try
            {
                this.MyPrimaryID = "SNo";
                this.MyModuleID = "Tariff";
                this.MyAppID = "ManageTariff";

            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }

        public ManageTariffManagementWebUI(Page PageContext)
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
                this.MyModuleID = "Tariff";
                this.MyAppID = "ManageTariff";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }

        /// <summary>
        /// Get Record from ManageTariff
        /// </summary>
        /// <returns></returns>
        public object GetRecordManageTariff()
        {
            object manageTariff = null;
            try
            {
                if (!DisplayMode.ToLower().Contains("new"))
                {
                    if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                    {
                        ManageTariff manageTariffList = new ManageTariff();
                        object obj = (object)manageTariffList;

                        manageTariff = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID);
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
            return manageTariff;
        }

        /// <summary>
        /// Generate form layout
        /// </summary>
        /// <param name="DisplayMode">Identify which operation has to be performed viz(Read,Write,Update,Delete)</param>
        /// <param name="container"></param>
        public StringBuilder BuildFormView(string DisplayMode, StringBuilder container)
        {
            try
            {
                using (HtmlFormAdapter htmlFormAdapter = new HtmlFormAdapter(MyModuleID))
                {
                    StringBuilder strf = new StringBuilder();
                    htmlFormAdapter.Ischildform = true;
                    htmlFormAdapter.CurrentPage = this.CurrentPageContext;
                    htmlFormAdapter.AuditLogColumn = "TariffIdName,Text_TariffCode,Text_TariffName";
                    htmlFormAdapter.HeadingColumnName = "TariffIdName";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.objFormData = GetRecordManageTariff();
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("Delete", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);

                            strf.Append("<div id='divTariffSlab'><span id='spnTariffSlab'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnTariffSNo' name='hdnTariffSlabSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblTariffSlab'></table><table id='tblRevenueSharingSlab'></table></span></div>");
                            // strf.Append("<div id='divTariffSlab'><span id='spnCommissionSlab'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnCommissionSlabSNo' name='hdnCommissionSlabSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblCommissionSlab'></table></span></div>");
                            htmlFormAdapter.Childform = strf.ToString();
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.objFormData = GetRecordManageTariff();
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            //container.Append(htmlFormAdapter.InstantiateIn());
                            //container.Append("<div id='divTariffSlab'><span id='spnTariffSlab'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnTariffSNo' name='hdnTariffSlabSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblTariffSlab'></table><table id='tblRevenueSharingSlab'></table></span></div>");
                            strf.Append("<div id='divTariffSlab'><span id='spnTariffSlab'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnTariffSNo' name='hdnTariffSlabSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblTariffSlab'></table><table id='tblRevenueSharingSlab'></table></span></div>");
                            htmlFormAdapter.Childform = strf.ToString();
                            container.Append(htmlFormAdapter.InstantiateIn());

                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.objFormData = GetRecordManageTariff();
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            //container.Append(htmlFormAdapter.InstantiateIn());
                            //container.Append("<div id='divTariffSlab'><span id='spnTariffSlab'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnTariffSNo' name='hdnTariffSlabSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblTariffSlab'></table><table id='tblRevenueSharingSlab'></table></span></div>");
                            strf.Append("<div id='divTariffSlab'><span id='spnTariffSlab'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnTariffSNo' name='hdnTariffSlabSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblTariffSlab'></table><table id='tblRevenueSharingSlab'></table></span></div>");
                            htmlFormAdapter.Childform = strf.ToString();
                            container.Append(htmlFormAdapter.InstantiateIn());

                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);

                            strf.Append("<div id='divTariffSlab'><span id='spnTariffSlab'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnTariffSNo' name='hdnTariffSlabSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblTariffSlab'></table><table id='tblRevenueSharingSlab'></table></span></div>");
                            // strf.Append("<div id='divTariffSlab'><span id='spnCommissionSlab'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnCommissionSlabSNo' name='hdnCommissionSlabSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblCommissionSlab'></table></span></div>");
                            htmlFormAdapter.Childform = strf.ToString();
                            container.Append(htmlFormAdapter.InstantiateIn());

                            //container.Append(htmlFormAdapter.InstantiateIn());
                            // container.Append("<div id='divTariffSlab'><span id='spnTariffSlab'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnTariffSNo' name='hdnTariffSlabSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblTariffSlab'></table><table id='tblRevenueSharingSlab'></table></span></div>");
                            break;
                        case DisplayModeDelete:
                            htmlFormAdapter.DisplayMode = DisplayModeType.Delete;
                            htmlFormAdapter.objFormData = GetRecordManageTariff();
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);

                            strf.Append("<div id='divTariffSlab'><span id='spnTariffSlab'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnTariffSNo' name='hdnTariffSlabSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblTariffSlab'></table><table id='tblRevenueSharingSlab'></table></span></div>");
                            // strf.Append("<div id='divTariffSlab'><span id='spnCommissionSlab'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnCommissionSlabSNo' name='hdnCommissionSlabSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblCommissionSlab'></table></span></div>");
                            htmlFormAdapter.Childform = strf.ToString();
                            container.Append(htmlFormAdapter.InstantiateIn());
                            //container.Append(htmlFormAdapter.InstantiateIn());
                            // container.Append("<div id='divTariffSlab'><span id='spnTariffSlab'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnTariffSNo' name='hdnTariffSlabSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblTariffSlab'></table><table id='tblRevenueSharingSlab'></table></span></div>");
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

        /// <summary>
        /// Generate ManageTariff web page from XML
        /// e.g from ~/HtmlForm/WebFormDefinitionIManageTariff.xml
        /// </summary>
        /// <param name="container"></param>
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

        /// <summary>
        /// Generate Grid the for the page
        /// as per the columns of entity supplied
        /// </summary>
        /// <param name="Container"></param>
        private StringBuilder CreateGrid(StringBuilder Container)
        {
            try
            {
                using (Grid g = new Grid())
                {
                    g.CommandButtonNewText = "New Tariff";
                    g.FormCaptionText = "Tariff";
                    g.PrimaryID = this.MyPrimaryID;
                    g.PageName = this.MyPageName;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.IsShowDelete = true;
                    g.ServiceModuleName = this.MyModuleID;
                    g.SuccessGrid = "OnSuccessGrid";
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "SNo", Title = "Tariff SNo", DataType = GridDataType.String.ToString(), Width = 90 });
                    g.Column.Add(new GridColumn { Field = "TariffForValue", Title = "Tariff For", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Location", Title = "Location", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "TariffName", Title = "Tariff Name", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "TariffIdName", Title = "TariffId Name ", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "TariffCode", Title = "Tariff Code", DataType = GridDataType.String.ToString(), Width = 90 });
                    g.Column.Add(new GridColumn { Field = "Mandatory", Title = "Mandatory", DataType = GridDataType.String.ToString(), Width = 90 });
                    g.Column.Add(new GridColumn { Field = "ValidFrom", Title = "Valid From", DataType = GridDataType.Date.ToString() });
                    g.Column.Add(new GridColumn { Field = "ValidTo", Title = "Valid To", DataType = GridDataType.Date.ToString() });
                    //  g.Column.Add(new GridColumn { Field = "ValidFrom", Title = "Valid From", DataType = GridDataType.DateTime.ToString(), Template = "# if(ValidFrom==null) {# # } else {# #= kendo.toString(new Date(data.ValidFrom.getTime() + data.ValidFrom.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + " " + "\") # #}#" });

                    // g.Column.Add(new GridColumn { Field = "ValidTo", Title = "Valid To", DataType = GridDataType.DateTime.ToString(), Template = "# if(ValidTo==null) {# # } else {# #= kendo.toString(new Date(data.ValidTo.getTime() + data.ValidTo.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + " " + "\") # #}#" });

                    g.Column.Add(new GridColumn { Field = "ApplicableFor", Title = "Applicable For", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Domestic", Title = "Tariff Type", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "BuildUpTypeValue", Title = "BuildUp Type", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "ChargeTo", Title = "Charge To", DataType = GridDataType.String.ToString(), Width = 90 });

                    g.Column.Add(new GridColumn { Field = "ShipmentType", Title = "Shipment Type", DataType = GridDataType.String.ToString() });

                    g.Column.Add(new GridColumn { Field = "SPHC", Title = "SHC", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Text_SHCGroup", Title = "SHC Group", DataType = GridDataType.String.ToString(), Width = 100 });

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
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
            return Container;
        }

        /// <summary>
        /// Postback Method to GET or POST 
        /// to set Mode/Context of the page
        /// </summary>
        public override void DoPostBack()
        {
            try
            {
                this.OperationMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
                if (OperationMode.Contains("UPDATE"))
                    OperationMode = OperationMode.Replace("UPDATE", "EDIT");
                switch (OperationMode)
                {
                    case DisplayModeSave:
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                        break;
                    case DisplayModeEdit:
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                        break;
                    case DisplayModeDelete:
                        DeleteManageTariff(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2002), false);
                        break;
                    case DisplayModeDuplicate:
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
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

        /// <summary>
        /// Delete ManageTariff record from the database 
        /// call webservice to update that data into the database
        /// </summary>
        /// <param name="RecordID"></param>
        private void DeleteManageTariff(string RecordID)
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
