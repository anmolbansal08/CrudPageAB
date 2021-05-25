using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI;
using CargoFlash.Cargo.Model.Stock;
using CargoFlash.Cargo.WebUI;
using CargoFlash.SoftwareFactory.WebUI;
using CargoFlash.SoftwareFactory.WebUI.Adapters;
using CargoFlash.SoftwareFactory.WebUI.Controls;

namespace CargoFlash.Cargo.WebUI.Stock
{
   public class AWBStockManagementWebUI : BaseWebUISecureObject
    {
        public object GetRecordStockManagement()
        {
            object ConnectionType = null;
            try
            {
                if (!string.IsNullOrEmpty(HttpContext.Current.Request.QueryString["RecID"]))
                {
                    AWBStock AWBStockList = new AWBStock();
                    object obj = (object)AWBStockList;
                    //retrieve Entity from Database according to the record
                    ConnectionType = DataGetRecordService(HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID);
                    this.MyRecordID = (HttpContext.Current.Request.QueryString["RecID"]);
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

            } return ConnectionType;
        }
        public AWBStockManagementWebUI()
        {
            try
            {
                this.MyPrimaryID = "SNo";
                this.MyModuleID = "Stock";
                this.MyAppID = "AWBStock";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }
     
        public AWBStockManagementWebUI(Page PageContext)
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
                this.MyModuleID = "Stock";
                this.MyAppID = "AWBStock";
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
                    htmlFormAdapter.HeadingColumnName = "ConnectionTypeName";
                    switch (DisplayMode)
                    {
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            //container.Append(CreateStockManagementDetailsPage(htmlFormAdapter.InstantiateIn()));
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
            return container;
        }

        public StringBuilder CreateWebForm(StringBuilder container)
        {
            StringBuilder strContent = new StringBuilder();
            try
            {
                {
                    //Set the display Mode form the URL QuesyString.
                    this.DisplayMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
                    //Match the display Mode of the form.
                    switch (this.DisplayMode)
                    {
                        case DisplayModeIndexView:
                            strContent = CreateGrid(container);
                            break;
                        case DisplayModeNew:
                            strContent = BuildFormView(this.DisplayMode, container);
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
            return strContent;
        }
        private StringBuilder CreateGrid(StringBuilder Container)
        {
            try
            {
                using (Grid g = new Grid())
                {
                    g.CommandButtonNewText = "Create GHA Stock";
                    g.FormCaptionText = "GHA Stock Management";
                    g.IsActionRequired = false;
                    g.ActionTitle = "Issue To";
                    g.PrimaryID = this.MyPrimaryID;
                    g.PageName = this.MyPageName;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.ServiceModuleName = this.MyModuleID;
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.SuccessGrid = "ShowScheduleAction";
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "AirlineName", Title = "Airline", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "AWBSeries", Title = "AWB Series", DataType = GridDataType.String.ToString() ,Width=200});
                    g.Column.Add(new GridColumn { Field = "IsAutoAWB", Title = "AWB Stock Type", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "AWBType", Title = "AWB Type", DataType = GridDataType.String.ToString(), Width = 150 });
                    g.Column.Add(new GridColumn { Field = "Counts", Title = "Total Count", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "RemainingCount", Title = "Remaining Count", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "BlackListed", Title = "Black Listed", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "ExpiryDate", Title = "Expiry Date", DataType = GridDataType.Date.ToString() });
                    g.Column.Add(new GridColumn { Field = "CreatedOn", Title = "Created On", DataType = GridDataType.Date.ToString() });
                    g.Column.Add(new GridColumn { Field = "CreatedBy", Title = "Created By", DataType = GridDataType.String.ToString() });
                    g.InstantiateIn(Container);
                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            }
            return Container;
        }
        /// <summary>
        /// Insert new Schedule record into the database
        /// Retrieve information from webform and store the same into modal object 
        /// call webservice to save that data into the database
        /// </summary>
        private void SaveGHAStock()
        {
            try
            {
                int number = 0;
                List<AWBStock> listAWBStock = new List<AWBStock>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var AWBStock = new AWBStock
                {
                    ExpiryDate = Convert.ToDateTime(FormElement["ExpiryDate"]),
                    Counts = Int32.TryParse(FormElement["NOOFAWB"], out number) ? number : 0,
                    StartRange = Int32.TryParse(FormElement["StartRange"], out number) ? number : 0,
                    AirlineSNo = Int32.TryParse(FormElement["AirlineSNo"].Split('-')[0], out number) ? number : 0,
                    AirlineName = FormElement["Text_AirlineSNo"].ToUpper(),
                    IsAutoAWB = FormElement["Text_IsAutoAWB"].ToUpper(),
                    AWBType =FormElement["Text_AWBType"].ToUpper(),
                    IsAutoAWBSNo = Int32.TryParse(FormElement["IsAutoAWB"].Split('-')[0], out number) ? number : 0,
                    AWBTypeSNo = Int32.TryParse(FormElement["AWBType"].Split('-')[0], out number) ? number : 0,
                    AWBPrefix = FormElement["AirlineSNo"].Split('-')[0],
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    CitySNo =5,//get from session as discuss with Manish Sir
                    OfficeSNo = 1,//get from session as discuss with Manish Sir
                };
                listAWBStock.Add(AWBStock);
                object datalist = (object)listAWBStock;
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
        public override void DoPostBack()
        {
            try
            {

                this.OperationMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
                switch (OperationMode)
                {
                    case DisplayModeSave:
                        SaveGHAStock();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                        break;
                    case DisplayModeSaveAndNew:
                        SaveGHAStock();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                        break;
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
