using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using CargoFlash.SoftwareFactory.WebUI;
using CargoFlash.SoftwareFactory.WebUI.Adapters;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using CargoFlash.Cargo.Model.Inventory;
using System.Collections;
using CargoFlash.Cargo.Business;
using System.Web.UI;
using System.Configuration;
using System.Data;

namespace CargoFlash.Cargo.WebUI.Inventory
{
    public class ConsumableManagementWebUI : BaseWebUISecureObject
    {
          public ConsumableManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Inventory";
                this.MyAppID = "Consumable";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }

          public ConsumableManagementWebUI(Page PageContext)
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
                this.MyAppID = "Consumable";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }

        public object GetRecordConsumable()
        {
            object ConsumableStock = null;
            try
            {
                if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                {
                    Consumable ConsumableStockList = new Consumable();
                    object obj = (object)ConsumableStockList;
                    ConsumableStock = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, this.MyModuleID);
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

            } return ConsumableStock;
        }
        public StringBuilder BuildFormView(string DisplayMode, StringBuilder container)
        {
            try
            {
                using (HtmlFormAdapter htmlFormAdapter = new HtmlFormAdapter(MyModuleID))
                {
                    htmlFormAdapter.CurrentPage = this.CurrentPageContext;
                    htmlFormAdapter.HeadingColumnName = "Text_Item";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.objFormData = GetRecordConsumable();
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.objFormData = GetRecordConsumable();
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.objFormData = GetRecordConsumable();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                           
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.objFormData = null;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                          
                            break;
                        case DisplayModeDelete:
                            htmlFormAdapter.objFormData = GetRecordConsumable();
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
                    case DisplayModeDuplicate:
                        strContent = BuildFormView(this.DisplayMode, container);
                        break;
                    case DisplayModeReadView:
                        strContent = BuildFormView(this.DisplayMode, container);
                        break;
                    case DisplayModeEdit:
                        strContent = BuildFormView(this.DisplayMode, container);
                        break;
                    case DisplayModeNew:
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
                    g.CommandButtonNewText = "New Inventory Type";
                    g.FormCaptionText = "Inventory Type";
                    g.PrimaryID = this.MyPrimaryID;
                    g.PageName = this.MyPageName;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.ServiceModuleName = this.MyModuleID;
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "Item", Title = "Item", DataType = GridDataType.String.ToString() });
                   // g.Column.Add(new GridColumn { Field = "Text_BasisOfChargeSNo", Title = "Basis Of Charge", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Chargeable", Title = "Chargeable", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Numbered", Title = "Numbered", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Returnable", Title = "Returnable", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Text_Owner", Title = "Owner", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Text_OwnerName", Title = "Owner Name", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Text_Type", Title = "Type", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Text_City", Title = "City", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "AirportName", Title = "Airport Name", DataType = GridDataType.String.ToString() });

                    g.Column.Add(new GridColumn { Field = "AllTareWeight", Title = "Tare Weight", DataType = GridDataType.String.ToString() });
               

                    //g.Action = new List<GridAction>();
                    //g.Action.Add(new GridAction { ButtonCaption = "Trans", ActionName = "Edit", AppsName = this.MyAppID, CssClassName = "read", ModuleName = this.MyModuleID });
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
                        SaveConsumable();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                        break;
                    case DisplayModeSaveAndNew:
                        SaveConsumable();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                        break;
                    case DisplayModeUpdate:

                        UpdateConsumable(Convert.ToInt32(System.Web.HttpContext.Current.Request.QueryString["RecID"]));
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                        break;
                    case DisplayModeDelete:
                        DeleteConsumable(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
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
        private void SaveConsumable()
        {
            try
            {
                List<Consumable> listConsumable = new List<Consumable>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var Consumable = new Consumable
                {
                    Item = FormElement["Text_Item"].ToUpper(),
                    ItemSno = Convert.ToInt32(FormElement["Item"]),
                  //  BasisOfChargeSNo = Convert.ToInt32(FormElement["BasisOfChargeSNo"]==""?"0":FormElement["BasisOfChargeSNo"]),
                    IsChargeable = FormElement["IsChargeable"] == "0",
                    IsNumbered = FormElement["IsNumbered"] == "0",
                    IsReturnable = FormElement["IsReturnable"] == "0",
                    TareWeight=Convert.ToDecimal(FormElement["TareWeight"]),
                    Type = FormElement["Type"] == "1",
                    City=Convert.ToInt32(FormElement["City"]),
                    Airport = Convert.ToInt32(FormElement["Airport"]),
                    Owner = Convert.ToInt32(FormElement["Owner"]),
                    OwnerName = Convert.ToInt32(FormElement["OwnerName"] == "" ? "0" : FormElement["OwnerName"]),
                    Office = Convert.ToInt32(FormElement["Office"]),
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo,
                    //InventoryBuild = Convert.ToBoolean(FormElement["InventoryBuild"] == "on" ? 1 : 0),
                    //InventoryLocation = Convert.ToBoolean(FormElement["InventoryLocation"] == "on" ? 1 : 0),
                    //InventoryWeighing = Convert.ToBoolean(FormElement["InventoryWeighing"] == "on" ? 1 : 0),
                    InvenatoryUsage= FormElement["Checkboxvalue"],

                };
                listConsumable.Add(Consumable);
                object datalist = (object)listConsumable;
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
        private void DeleteConsumable(string RecordID)
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
        private void UpdateConsumable(int RecordID)
        {
            try
            {
                List<Consumable> listConsumable = new List<Consumable>();
                int number = 0;

               
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var Consumable = new Consumable
                {
                    SNo = Convert.ToInt32(RecordID),
                   // BasisOfChargeSNo = Int32.TryParse(FormElement["BasisOfChargeSNo"], out number) ? number : 0,
                    IsChargeable = FormElement["IsChargeable"] == "0",
                    IsNumbered = FormElement["IsNumbered"] == "0",
                    IsReturnable = FormElement["IsReturnable"] == "0",
                    //Item = FormElement["Text_Item"],
                    Item = FormElement["Text_Item"],
                    ItemSno = Convert.ToInt32(FormElement["Item"]),
                    TareWeight = Convert.ToDecimal(FormElement["TareWeight"]),
                    Type =FormElement["Type"]=="1",
                    City = Convert.ToInt32(FormElement["City"]),
                    Airport = Convert.ToInt32(FormElement["Airport"]),
                    Owner = Convert.ToInt32(FormElement["Owner"]),
                    OwnerName = Convert.ToInt32(FormElement["OwnerName"]==""?"0":FormElement["OwnerName"]),
                    Office = Convert.ToInt32(FormElement["Office"]),
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo,
                    InvenatoryUsage = FormElement["Checkboxvalue"],
                };
                listConsumable.Add(Consumable);
                object datalist = (object)listConsumable;
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
    }
}
