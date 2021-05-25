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
using CargoFlash.Cargo.Model.ULD;
using System.Collections;
using CargoFlash.Cargo.Business;
using System.Web;

namespace CargoFlash.Cargo.WebUI.ULD
{
    public class ULDStockNonInventoryManagementWebUI : BaseWebUISecureObject
    {
        public ULDStockNonInventoryManagementWebUI()
        {
            try
            {
                this.MyModuleID = "ULD";
                this.MyAppID = "ULDStockNonInventory";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }

        public ULDStockNonInventoryManagementWebUI(Page PageContext)
        {
            try
            {
                if (this.SetCurrentPageContext(PageContext))
                {
                    this.ErrorNumber = 0;
                    this.ErrorMessage = "";
                }
                this.MyPageName = "Default.aspx";
                this.MyModuleID = "ULD";
                this.MyAppID = "ULDStockNonInventory";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }

        public object GetRecordULDStockNonInventory()
        {
            object ULDStockNonInventory = null;
            try
            {
                if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                {
                    ULDStockNonInventory ULDStockNonInventoryList = new ULDStockNonInventory();
                    object obj = (object)ULDStockNonInventoryList;
                    ULDStockNonInventory = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, this.MyModuleID);
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

            } return ULDStockNonInventory;
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
                            htmlFormAdapter.objFormData = GetRecordULDStockNonInventory();
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
                            htmlFormAdapter.objFormData = GetRecordULDStockNonInventory();
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeDelete:
                            htmlFormAdapter.objFormData = GetRecordULDStockNonInventory();
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

        //private StringBuilder CreateGrid(StringBuilder Container)
        //{
        //    try
        //    {
        //        using (Grid g = new Grid())
        //        {
        //           g.CommandButtonNewText = "";
        //            g.FormCaptionText = "ULD Stock Non-Inventory";
        //            g.PrimaryID = this.MyPrimaryID;
        //            g.PageName = this.MyPageName;
        //            g.ModuleName = this.MyModuleID;
        //            g.AppsName = this.MyAppID;
        //          //  g.SuccessGrid = "OnSuccessGrid";
        //            g.ServiceModuleName = this.MyModuleID;
        //            //g.IsCurrentExport = true;
        //            g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
        //            g.Column = new List<GridColumn>();
        //            g.Column.Add(new GridColumn { Field = "ULDType", Title = "ULD Code", DataType = GridDataType.String.ToString(), Width = 70 });
        //            //g.Column.Add(new GridColumn { Field = "ContainerType", Title = "ULD Type", DataType = GridDataType.String.ToString() });
        //            g.Column.Add(new GridColumn { Field = "ULDNo", Title = "ULD No", DataType = GridDataType.String.ToString() });
        //            g.Column.Add(new GridColumn { Field = "City", Title = "City", DataType = GridDataType.String.ToString(), Width = 40 });
        //            g.Column.Add(new GridColumn { Field = "OriginAirport", Title = "Airport", DataType = GridDataType.String.ToString(), Width = 60 });
        //            g.Column.Add(new GridColumn { Field = "CurrentStatus", Title = "Status", DataType = GridDataType.String.ToString(), Width = 70 });
        //            g.Column.Add(new GridColumn { Field = "LostRemarks", Title = "Lost", DataType = GridDataType.String.ToString(), Width = 50 });
        //            g.Column.Add(new GridColumn { Field = "AirlineName", Title = "Current Airline ", DataType = GridDataType.String.ToString() });
        //            g.Column.Add(new GridColumn { Field = "PurchaseFrom", Title = "Purchased From", DataType = GridDataType.String.ToString() });
        //            g.Column.Add(new GridColumn { Field = "PurchaseAt", Title = "Purchased At", DataType = GridDataType.String.ToString() });
        //            g.Column.Add(new GridColumn { Field = "PurchaseDate", Title = "Purchased Date", DataType = GridDataType.Date.ToString(), Template = "# if( PurchaseDate==null) {# # } else {# #= kendo.toString(new Date(data.PurchaseDate.getTime() + data.PurchaseDate.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + "\") # #}#" });
        //            // g.Column.Add(new GridColumn { Field = "PurchasedPrice", Title = "Purchased Price", DataType = GridDataType.String.ToString() });
        //            g.Column.Add(new GridColumn { Field = "EmptyWeight", Title = "Tare Weight", DataType = GridDataType.String.ToString(), Width = 60 });
        //            g.Column.Add(new GridColumn { Field = "Content", Title = "Content Type", DataType = GridDataType.String.ToString() });
        //            g.Column.Add(new GridColumn { Field = "BaggageType", Title = "Content Category", DataType = GridDataType.String.ToString() });
        //            g.Column.Add(new GridColumn { Field = "SHC", Title = "Compatibility", DataType = GridDataType.String.ToString() });


        //            g.Column.Add(new GridColumn { Field = "Available", Title = "Available", DataType = GridDataType.String.ToString(), Width = 65 });
        //            g.Column.Add(new GridColumn { Field = "Serviceable", Title = "Serviceable", DataType = GridDataType.String.ToString(), Width = 70 });
        //            g.Column.Add(new GridColumn { Field = "Damaged", Title = "Damaged", DataType = GridDataType.String.ToString(), Width = 70 });
        //            g.Column.Add(new GridColumn { Field = "Active", Title = "Active", DataType = GridDataType.String.ToString(), Width = 50 });
        //            g.Column.Add(new GridColumn
        //            {
        //                Field = "SNo",
        //                Title = "Move To",
        //                DataType = GridDataType.String.ToString(),
        //                Width = 50,
        //                Template =
        //                    "#<input type=\"button\" class=\"incompleteprocess\" style=\"cursor:pointer\" value=\"M\" title=\"Non-Inventory Move\" onclick=\"IsNonInventory(this,#=SNo#);\" />&nbsp;&nbsp; #"
        //            });
        //            g.Column.Add(new GridColumn { Field = "IsNonInventory", IsLocked = false, Title = "IsNonInventory", DataType = GridDataType.String.ToString(), IsHidden = true });
        //            g.Column.Add(new GridColumn { Field = "SNo", IsLocked = false, Title = "SNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                
        //            g.InstantiateIn(Container);
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        ApplicationWebUI applicationWebUI = new ApplicationWebUI();
        //        applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
        //    }
        //    return Container;
        //}

        private StringBuilder CreateGrid(StringBuilder Container)
        {
            try
            {
                using (Grid g = new Grid())
                {
                   

                    g.CommandButtonNewText = "";
                    g.FormCaptionText = "ULD Stock Non-Inventory";
                    g.ActionTitle = "Edit";
                    g.IsDisplayOnly = false;
                    g.PrimaryID = this.MyPrimaryID;
                    g.PageName = this.MyPageName;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.IsShowEdit = false;
                    g.IsShowDelete = false;
                    g.IsActionRequired = false;
                    g.ServiceModuleName = this.MyModuleID;
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    //g.SuccessGrid = "ShowEditAction";
                    g.Column.Add(new GridColumn { Field = "SNo", Title = "SNo", IsHidden = true, DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "ULDType", Title = "ULD Code", DataType = GridDataType.String.ToString(), Width = 70 });
                    //g.Column.Add(new GridColumn { Field = "ContainerType", Title = "ULD Type", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "ULDNo", Title = "ULD No", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "City", Title = "City", DataType = GridDataType.String.ToString(), Width = 40 });
                    g.Column.Add(new GridColumn { Field = "OriginAirport", Title = "Airport", DataType = GridDataType.String.ToString(), Width = 60 });
                    g.Column.Add(new GridColumn { Field = "CurrentStatus", Title = "Status", DataType = GridDataType.String.ToString(), Width = 70 });
                    g.Column.Add(new GridColumn { Field = "LostRemarks", Title = "Lost", DataType = GridDataType.String.ToString(), Width = 50 });
                    g.Column.Add(new GridColumn { Field = "AirlineName", Title = "Current Airline ", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "PurchaseFrom", Title = "Purchased From", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "PurchaseAt", Title = "Purchased At", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "PurchaseDate", Title = "Purchased Date", DataType = GridDataType.Date.ToString(), Template = "# if( PurchaseDate==null) {# # } else {# #= kendo.toString(new Date(data.PurchaseDate.getTime() + data.PurchaseDate.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + "\") # #}#" });
                    // g.Column.Add(new GridColumn { Field = "PurchasedPrice", Title = "Purchased Price", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "EmptyWeight", Title = "Tare Weight", DataType = GridDataType.String.ToString(), Width = 60 });
                    g.Column.Add(new GridColumn { Field = "Content", Title = "Content Type", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "BaggageType", Title = "Content Category", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "SHC", Title = "Compatibility", DataType = GridDataType.String.ToString() });


                    g.Column.Add(new GridColumn { Field = "Available", Title = "Available", DataType = GridDataType.String.ToString(), Width = 65 });
                    g.Column.Add(new GridColumn { Field = "IsScrape", Title = "Scrapped", DataType = GridDataType.String.ToString(), Width = 70 });
                    
                    g.Column.Add(new GridColumn { Field = "Serviceable", Title = "Serviceable", DataType = GridDataType.String.ToString(), Width = 70 });
                    g.Column.Add(new GridColumn { Field = "Damaged", Title = "Damaged", DataType = GridDataType.String.ToString(), Width = 70 });
                    g.Column.Add(new GridColumn { Field = "Active", Title = "Active", DataType = GridDataType.String.ToString(), Width = 50 });
                    g.Column.Add(new GridColumn
                    {
                        Field = "SNo",
                        Title = "Move",
                        DataType = GridDataType.String.ToString(),
                        Width = 70,
                        Template =
                            "# if( IsNonInventory==0) {#  #} else if(IsNonInventory==1) {#<input type=\"button\" class=\"incompleteprocess\" style=\"cursor:pointer\" value=\"M\" title=\"Move To ULD Stock\" onclick=\"Inventorymessage(this,#=SNo#);\" /> #} #"
                    });

                    g.Action = new List<GridAction>();
                    g.Action.Add(new GridAction { ButtonCaption = "EDIT", ActionName = "EDIT", AppsName = this.MyAppID, CssClassName = "Read", ModuleName = this.MyModuleID });

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
                        SaveULDStockNonInventory();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                        break;
                    case DisplayModeSaveAndNew:
                        SaveULDStockNonInventory();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                        break;
                    case DisplayModeUpdate:
                        UpdateULDStockNonInventory(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                        break;
                    case DisplayModeDelete:
                        DeleteULDStockNonInventory(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
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

        private void UpdateULDStockNonInventory(string RecordID)
        {

            try
            {
                List<ULDStockNonInventory> listULDStockNonInventory = new List<ULDStockNonInventory>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;

                var ULDStockNonInventory = new ULDStockNonInventory
                {
                    SNo = Convert.ToInt32(RecordID),
                    //purDate = FormElement["PurchaseDate"],
                    //City = FormElement["CityCode"].ToUpper(),
                    //CityCode = FormElement["CityCode"].ToUpper(),
                    //AirlineCode = FormElement["Text_AirlineSNo"].Split('-')[0].ToUpper(),//FormElement["AirlineSNo"].ToUpper(),
                    //ULDType = FormElement["ULDTypeSNo"].ToUpper(),
                    //ULDNo = "0",
                    //ULDSerialNo = FormElement["ULDSerialNo"].ToUpper(),
                    //TotalNoOfULD = Convert.ToInt16(FormElement["TotalNoOfULD"]),
                    //PurchaseFrom = FormElement["PurchaseFrom"].ToUpper(),
                    //PurchaseAt = FormElement["PurchaseAt"].ToUpper(),

                    IsActive = Convert.ToInt32(FormElement["IsActive"]) == 0 ? 1 : 0,
                    IsAvailable = Convert.ToInt32(FormElement["IsAvailable"]) == 0 ? 1 : 0,
                    CreatedBy = (((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo).ToString(),
                    IsDamaged = Convert.ToInt32(FormElement["IsDamaged"]) == 1 ? 0 : 1,
                    IsServiceable = Convert.ToInt32(FormElement["IsServiceable"]) == 0 ? 1 : 0,
                    EmptyWeight = Convert.ToDecimal(FormElement["EmptyWeight"]),
                    Scrape = Convert.ToInt32(FormElement["Scrape"]) == 0 ? 1 : 0,
                    ContentType = FormElement["ContentType"],
                    ContentCategory = FormElement["ContentCategory"],
                    SHCGroupSNo = FormElement["SHCGroupSNo"],
                    SHCSNo = FormElement["SHCSNo"],
                    //OwnerCode = FormElement["OwnerCode"].ToString().ToUpper(),
                    //OwnershipSNo = Convert.ToInt32(FormElement["OwnershipSNo"])
                };
                listULDStockNonInventory.Add(ULDStockNonInventory);
                object datalist = (object)listULDStockNonInventory;
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
        private void SaveULDStockNonInventory()
        {
            try
            {
                List<ULDStockNonInventory> listULDStockNonInventory = new List<ULDStockNonInventory>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;




                var ULDStockNonInventory = new ULDStockNonInventory
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
                    //ULDStockNonInventorySNo = Convert.ToInt32(FormElement["ULDStockNonInventorySNo"]),

                    //  ULDNo = "0",           
                };

                listULDStockNonInventory.Add(ULDStockNonInventory);

                object datalist = (object)listULDStockNonInventory;

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
        private void DeleteULDStockNonInventory(string RecordID)
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
