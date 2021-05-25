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
    public class ExchangeRateManagementWebUI : BaseWebUISecureObject
    {
        /// <summary>
        /// Set context of the page(form) i.e bind Module ID,App ID
        /// </summary>
        /// <param name="PageContext"></param>
        public ExchangeRateManagementWebUI(Page PageContext)
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
                this.MyAppID = "ExchangeRate";
                this.MyPrimaryID = "SNo";
            }


            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }

        public ExchangeRateManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Rate";
                this.MyAppID = "ExchangeRate";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }

        }

        /// <summary>
        /// Generate form layout
        /// </summary>
        /// <param name="DisplayMode">Identify which operation has to be performed i.e(Read,Write,Update,Delete)</param>
        /// <param name="container">Control Object</param>
        public override void BuildFormView(string DisplayMode, StringBuilder container)
        {
            try
            {
                using (HtmlFormAdapter htmlFormAdapter = new HtmlFormAdapter(MyModuleID))
                {
                    htmlFormAdapter.CurrentPage = this.CurrentPageContext;
                    htmlFormAdapter.HeadingColumnName = "FromCurrencyCode";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.objFormData = GetRecordExchangeRate();
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            //htmlFormAdapter.objFormData = null;
                            //htmlFormAdapter.objDataTable = GetRecordExchangeRate();
                            //container.Append(htmlFormAdapter.TransInstantiateWithHeader("ExchangeRate", "ExchangeRateError"));
                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.objFormData = GetRecordExchangeRate();
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.objFormData = GetRecordExchangeRate();
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
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            htmlFormAdapter.objFormData = GetRecordExchangeRate();
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

        /// <summary>
        /// Generate ExchangeRate web page from XML
        /// </summary>
        /// <param name="container"></param>
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

        /// <summary>
        /// Postback Method to GET or POST 
        /// to set Mode/Context of the page
        /// </summary>
        public override void DoPostBack()
        {
            try
            {
                this.OperationMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
                switch (OperationMode)
                {
                    case DisplayModeSave:
                        SaveExchangeRate();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                        break;
                    case DisplayModeSaveAndNew:
                        SaveExchangeRate();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                        break;
                    case DisplayModeUpdate:
                        UpdateExchangeRate(Convert.ToInt32(System.Web.HttpContext.Current.Request.QueryString["RecID"]));
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                        break;

                    case DisplayModeDelete:
                        DeleteExchangeRate(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
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
        /// <summary>
        /// Generate Grid for the page as per the columns of the entity supplied
        /// </summary>
        /// <param name="Container"></param>
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
                    g.CommandButtonNewText = "New Exchange Rate";
                    g.FormCaptionText = "Exchange Rate";
                    g.ServiceModuleName = this.MyModuleID;
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "FromCurrencyCode", Title = "Currency From", DataType = GridDataType.String.ToString().ToUpper() });
                    g.Column.Add(new GridColumn { Field = "ToCurrencyCode", Title = "Converted To", DataType = GridDataType.String.ToString().ToUpper() });
                    g.Column.Add(new GridColumn { Field = "Rate", Title = "Rate", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "ValidFrom", Title = "Valid From", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "ValidTo", Title = "Valid To", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Text_ExchangeRateTypeSNo", Title = "Conversion Type", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Text_InverseApplicable", Title = "Inverse Applicable", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Text_IsIataApplicable", Title = "IATA Applicable", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Text_ApplicableCountrySNo", Title = "Applicable Country", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Active", Title = "Active", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "RefNo", Title = "Ref. No", DataType = GridDataType.String.ToString() });
                    g.InstantiateIn(Container);
                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            }
        }

        /// <summary>
        /// Insert new ExchangeRate record into the database
        /// Retrieve information from webform and store the same into modal object
        /// call webservice to save that data into the database
        /// </summary>
        private void SaveExchangeRate()
        {
            try
            {
                List<ExchangeRate> listExchangeRate = new List<ExchangeRate>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var ExchangeRate = new ExchangeRate
                {
                    Rate = Convert.ToString(FormElement["Rate"].ToString()),
                    FromCurrencySNo = Convert.ToInt32(FormElement["FromCurrencySNo"].ToString()),
                    Text_FromCurrencySNo = Convert.ToString(FormElement["Text_FromCurrencySNo"].ToString()),
                    FromCurrencyCode = Convert.ToString(FormElement["Text_FromCurrencySNo"].ToString()),
                    ToCurrencySNo = Convert.ToInt32(FormElement["ToCurrencySNo"].ToString()),
                    Text_ToCurrencySNo = Convert.ToString(FormElement["Text_ToCurrencySNo"].ToString()),
                    ToCurrencyCode = Convert.ToString(FormElement["Text_ToCurrencySNo"].ToString()),
                    ValidFrom = FormElement["ValidFrom"].ToString(),
                    ValidTo = FormElement["ValidTo"].ToString(),
                    IsActive = FormElement["IsActive"] == "0",
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    IsIataApplicable = FormElement["IsIataApplicable"] == "0"?true:false,
                    ApplicableCountrySNo = FormElement["ApplicableCountrySNo"] == "" ? 0 : Convert.ToInt32(FormElement["ApplicableCountrySNo"]),
                    ExchangeRateTypeSNo = FormElement["ExchangeRateTypeSNo"] == ""? 0 : Convert.ToInt32(FormElement["ExchangeRateTypeSNo"]),
                    InverseApplicable = FormElement["InverseApplicable"] == "0" ? true : false
                };
                listExchangeRate.Add(ExchangeRate);
                object datalist = (object)listExchangeRate;
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

        /// <summary>
        /// Update ExchangeRate record into the database
        /// Retrieve information from webform and store the same into modal object
        /// call webservice to update that data into the database
        /// </summary>
        /// <param name="RecordID"></param>
        private void UpdateExchangeRate(int RecordID)
        {
            try
            {
                List<ExchangeRate> listExchangeRate = new List<ExchangeRate>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var ExchangeRate = new ExchangeRate
                {
                    SNo = Convert.ToInt32(RecordID),
                    Rate = Convert.ToString(FormElement["Rate"].ToString()),
                    FromCurrencySNo = Convert.ToInt32(FormElement["FromCurrencySNo"].ToString()),
                    //Text_FromCurrencySNo = Convert.ToString(FormElement["Text_FromCurrencySNo"].ToString()),
                    //FromCurrencyCode = Convert.ToString(FormElement["Text_FromCurrencySNo"].ToString()),
                    ToCurrencySNo = Convert.ToInt32(FormElement["ToCurrencySNo"].ToString()),
                    //Text_ToCurrencySNo = Convert.ToString(FormElement["Text_ToCurrencySNo"].ToString()),
                    //ToCurrencyCode = Convert.ToString(FormElement["Text_ToCurrencySNo"].ToString()),
                    ValidFrom = FormElement["ValidFrom"].ToString(),
                    ValidTo = FormElement["ValidTo"].ToString(),
                    IsActive = FormElement["IsActive"] == "0",
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    IsIataApplicable = FormElement["IsIataApplicable"] == "0"?true:false,
                    ApplicableCountrySNo = FormElement["ApplicableCountrySNo"] == "" ? 0 : Convert.ToInt32(FormElement["ApplicableCountrySNo"]),
                    ExchangeRateTypeSNo = FormElement["ExchangeRateTypeSNo"] == "" ? 0 : Convert.ToInt32(FormElement["ExchangeRateTypeSNo"]),
                    InverseApplicable = FormElement["InverseApplicable"] == "0" ? true : false
                };

                listExchangeRate.Add(ExchangeRate);
                object datalist = (object)listExchangeRate;
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

        /// <summary>
        /// Delete ExchangeRate record from the database 
        /// call webservice to update that data into the database 
        /// </summary>
        /// <param name="RecordID"></param>
        private void DeleteExchangeRate(string RecordID)
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

        /// <summary>
        ///  Get information of individual ExchangeRate from database according record id supplied
        /// </summary>
        /// <returns>object type of entity ExchangeRate found from database</returns>

        public object GetRecordExchangeRate()
        {
            object ExchangeRate = null;
            try
            {
                if (!DisplayMode.ToLower().Contains("new"))
                {
                    if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                    {
                        ExchangeRate gpList = new ExchangeRate();
                        object obj = (object)gpList;
                        ExchangeRate = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID);
                        this.MyRecordID = (System.Web.HttpContext.Current.Request.QueryString["RecID"]);
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

            } return ExchangeRate;
        }

    }
}
