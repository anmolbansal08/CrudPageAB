using CargoFlash.Cargo.Model.Rate;
using CargoFlash.SoftwareFactory.WebUI;
using CargoFlash.SoftwareFactory.WebUI.Adapters;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.UI;

namespace CargoFlash.Cargo.WebUI.Rate
{
    public class RateSearchManagementWebUI : BaseWebUISecureObject
    {
        public RateSearchManagementWebUI()
        {
            try
            {
                this.MyPrimaryID = "SNo";
                this.MyModuleID = "Rate";
                this.MyAppID = "RateSearch";

            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }

        public RateSearchManagementWebUI(Page PageContext)
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
                this.MyModuleID = "Rate";
                this.MyAppID = "RateSearch";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }

        /// <summary>
        /// Get Record from RateSearch
        /// </summary>
        /// <returns></returns>
        public object GetRecordManageTariff()
        {
            object rateSearch = null;
            try
            {
                if (!DisplayMode.ToLower().Contains("new"))
                {
                    if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                    {
                        RateSearch rateSearchList = new RateSearch();
                        object obj = (object)rateSearchList;

                        rateSearch = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID);
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
            return rateSearch;
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
                    htmlFormAdapter.CurrentPage = this.CurrentPageContext;
                    //htmlFormAdapter.HeadingColumnName = "Text_TariffName";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            break;
                        case DisplayModeDuplicate:
                            break;
                        case DisplayModeEdit:
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("NEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeDelete:
                            break;
                        default:
                            break;
                    }
                    container.Append(@"<table class='WebFormTable'><tr><td class'formActiontitle'><input type='button' value='Search' text='Search' class='btn btn-success' onClick='RateSearch()' id='btnGenerate'><input type='button' name='btnReset' value='Reset' id='btnReset' tabindex='8' class='btn btn-success' title='Reset'></td></tr></table>" +
                     "<input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/> " +
                                        "<input id='hdnFSNo' type='hidden'/>" +
                                        "<input id='hdnDFCreated' type='hidden'/>" +
                                        "<input id='hdnDFAlreadyCreated' type='hidden'/>" +
                    "<div >&nbsp;&nbsp;</div><table id='tblRateSearch'></table><div style=height:10px' /><div >&nbsp;&nbsp;</div><div style=height:50px'/><div style=height:20px'/>");
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
        /// Generate RateSearch web page from XML
        /// e.g from ~/HtmlForm/WebFormDefinitionI=RateSearch.xml
        /// </summary>
        /// <param name="container"></param>
        public StringBuilder CreateWebForm(StringBuilder container)
        {
            try
            {
                StringBuilder strContent = new StringBuilder();
                if (System.Web.HttpContext.Current.Request.QueryString["FormAction"] != null)
                {
                    //Set the display Mode form the URL QuesyString.
                    this.DisplayMode = "FORMACTION." + System.Web.HttpContext.Current.Request.QueryString["FormAction"].ToString().ToUpper().Trim();

                    //Match the display Mode of the form.
                    switch (this.DisplayMode)
                    {
                        case DisplayModeIndexView:
                            break;
                        case DisplayModeDuplicate:
                            break;
                        case DisplayModeReadView:
                            break;
                        case DisplayModeEdit:
                            strContent = BuildFormView(this.DisplayMode, container);
                            break;
                        case DisplayModeNew:
                            strContent = BuildFormView(this.DisplayMode, container);
                            break;
                        case DisplayModeDelete:
                            // BuildFormView(this.DisplayMode, container);
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
                    g.CommandButtonNewText = "Rate Search";
                    g.FormCaptionText = "Rate Search";
                    g.PrimaryID = this.MyPrimaryID;
                    g.PageName = this.MyPageName;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.ServiceModuleName = this.MyModuleID;
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "SNo", Title = "Tariff SNo", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "CreatedBy", Title = "Created By", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "UpdatedBy", Title = "Updated By", DataType = GridDataType.String.ToString() });
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
                        //if (string.IsNullOrEmpty(ErrorMessage))
                        //    System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                        break;
                    case DisplayModeEdit:
                        //if (string.IsNullOrEmpty(ErrorMessage))
                        //    System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                        break;
                    case DisplayModeDelete:
                        //DeleteManageTariff(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                        //if (string.IsNullOrEmpty(ErrorMessage))
                        //    System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2002), false);
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
    }
}
