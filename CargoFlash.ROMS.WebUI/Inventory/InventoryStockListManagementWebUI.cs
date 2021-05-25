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
using CargoFlash.Cargo.Model.Inventory;
using System.Collections;
using CargoFlash.Cargo.Business;
using System.Web;

namespace CargoFlash.Cargo.WebUI.Inventory
{
    public class InventoryStockListManagementWebUI : BaseWebUISecureObject
    {
        public InventoryStockListManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Inventory";
                this.MyAppID = "InventoryStockList";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }

        public InventoryStockListManagementWebUI(Page PageContext)
        {
            try
            {
                if (this.SetCurrentPageContext(PageContext))
                {
                    this.ErrorNumber = 0;
                    this.ErrorMessage = "";
                }
                this.MyPageName = "Default.aspx";
                this.MyModuleID = "Inventory";
                this.MyAppID = "InventoryStockList";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }

        public object GetRecordInventoryStockList()
        {
            object InventoryStockList = null;
            try
            {
                if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                {
                    InventoryStockList InventoryStockLis = new InventoryStockList();
                    object obj = (object)InventoryStockLis;
                    IDictionary<string, string> qString = new Dictionary<string, string>();
                    qString.Add("UserSNo", ((Model.UserLogin)(HttpContext.Current.Session["UserDetail"])).UserSNo.ToString());
                    InventoryStockList = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, this.MyModuleID, "", "", qString);
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

            } return InventoryStockList;
        }

        public StringBuilder BuildFormView(string DisplayMode, StringBuilder container)
        {
            try
            {
                using (HtmlFormAdapter htmlFormAdapter = new HtmlFormAdapter(MyModuleID))
                {
                    htmlFormAdapter.CurrentPage = this.CurrentPageContext;
                    htmlFormAdapter.HeadingColumnName = "ULDNo";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.objFormData = GetRecordInventoryStockList();
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            //htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.objFormData = GetRecordInventoryStockList();
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeDelete:
                            htmlFormAdapter.objFormData = GetRecordInventoryStockList();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Delete;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
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
                this.DisplayMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
                switch (this.DisplayMode)
                {
                    case DisplayModeIndexView:
                        strContent = CreateGrid(container);
                        break;
                    case DisplayModeReadView:
                        strContent = BuildFormView(this.DisplayMode, container);
                        break;
                    case DisplayModeNew:
                        strContent = BuildFormView(this.DisplayMode, container);
                        break;
                    case DisplayModeEdit:
                        strContent = BuildFormView(this.DisplayMode, container);
                        break;
                    case DisplayModeDelete:
                        strContent = BuildFormView(this.DisplayMode, container);
                        break;
                    default:
                        break;
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
                    g.CommandButtonNewText = "";
                    g.FormCaptionText = "Inventory Stock List";
                    g.PrimaryID = this.MyPrimaryID;
                    g.PageName = this.MyPageName;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.ServiceModuleName = this.MyModuleID;
                    //g.IsCurrentExport = true;
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "ULDType", Title = "CART Code", DataType = GridDataType.String.ToString() });
                    //g.Column.Add(new GridColumn { Field = "ContainerType", Title = "ULD Type", DataType = GridDataType.String.ToString() });
                  //  g.Column.Add(new GridColumn { Field = "ULDNo", Title = "CART No", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "ConsumableEquipmentNo", Title = "CART No", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "City", Title = "City", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "OriginAirport", Title = "Airport", DataType = GridDataType.String.ToString()});
                    g.Column.Add(new GridColumn { Field = "EmptyWeight", Title = "Tare Weight", DataType = GridDataType.String.ToString()});         
                    g.Column.Add(new GridColumn { Field = "Available", Title = "Available", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Active", Title = "Active", DataType = GridDataType.String.ToString() });
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

        public override void DoPostBack()
        {
            try
            {

                this.OperationMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
                switch (OperationMode)
                {
                    case DisplayModeSave:
                        SaveInventoryStockList();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                        break;
                    case DisplayModeSaveAndNew:
                        SaveInventoryStockList();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                        break;
                    case DisplayModeUpdate:
                        UpdateInventoryStockList(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                        break;
                    case DisplayModeDelete:
                        DeleteInventoryStockList(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
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

        private void UpdateInventoryStockList(string RecordID)
        {

            try
            {
                List<InventoryStockList> listInventoryStockList = new List<InventoryStockList>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;

                var InventoryStockList = new InventoryStockList
                {
                    SNo = Convert.ToInt32(RecordID),
                    IsActive = Convert.ToInt32(FormElement["IsActive"]) == 0 ? 1 : 0,
                    CreatedBy = (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo).ToString(),
                    IsAvailable = Convert.ToInt32(FormElement["IsAvailable"]) == 0 ? 1 : 0,
                    EmptyWeight = Convert.ToDecimal(FormElement["EmptyWeight"]),
                };
                listInventoryStockList.Add(InventoryStockList);
                object datalist = (object)listInventoryStockList;
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
        private void SaveInventoryStockList()
        {
            try
            {
                List<InventoryStockList> listInventoryStockList = new List<InventoryStockList>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;




                var InventoryStockList = new InventoryStockList
                {
                    ULDType = FormElement["ULDTypeSNo"].ToUpper(),
                    City = FormElement["CityCode"].ToUpper(),
                    AirlineCode = FormElement["AirlineSNo"].ToString(), //FormElement["Text_AirlineSNo"].Split('-')[0].ToUpper(),
                    CityCode = FormElement["CityCode"].ToUpper(),
                    PurchaseFrom = FormElement["PurchaseFrom"].ToUpper(),
                    PurchaseAt = FormElement["PurchaseAt"].ToUpper(),
                    IsActive = Convert.ToInt32(FormElement["IsActive"]) == 0 ? 1 : 0,
                    //Active = Convert.ToInt32(FormElement["IsActive"]) == 0 ? 1 : 0,
                    IsAvailable = 1,
                    TotalNoOfULD = Convert.ToInt16(FormElement["TotalNoOfULD"]),
                    ULDSerialNo = FormElement["ULDSerialNo"].ToUpper(),
                    CreatedBy = (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo).ToString(),
                    OwnerCode = FormElement["OwnerCode"].ToString().ToUpper(),
                    PurchaseDate = FormElement["PurchaseDate"],
                    OwnershipSNo = Convert.ToInt32(FormElement["OwnershipSNo"]),
                    IsDamaged = 0,
                    IsServiceable = 1,
                    AirportSNo = FormElement["AirportSNo"].ToUpper(),
                    EmptyWeight = Convert.ToDecimal(FormElement["EmptyWeight"]),
                    Scrape = Convert.ToInt32(FormElement["Scrape"]) == 0 ? 1 : 0,
                    PurchasedPrice = Convert.ToDecimal(FormElement["PurchasedPrice"] == "" ? "0" : FormElement["PurchasedPrice"]),
                    ContentType = FormElement["ContentType"],
                    ContentCategory = FormElement["ContentCategory"],
                    SHCGroupSNo = FormElement["SHCGroupSNo"],
                    SHCSNo = FormElement["SHCSNo"],
                    //InventoryStockListSNo = Convert.ToInt32(FormElement["InventoryStockListSNo"]),

                    //  ULDNo = "0",           
                };

                listInventoryStockList.Add(InventoryStockList);

                object datalist = (object)listInventoryStockList;

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
        private void DeleteInventoryStockList(string RecordID)
        {
            try
            {
                List<string> listID = new List<string>();
                listID.Add(RecordID);
                listID.Add(MyUserID.ToString());
                object recordID = (object)listID;
                DataOperationService(DisplayModeDelete, recordID, MyModuleID);
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            }
        }
    }
}
