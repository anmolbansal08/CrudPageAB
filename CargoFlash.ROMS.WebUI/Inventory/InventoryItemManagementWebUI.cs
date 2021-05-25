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
   public class InventoryItemManagementWebUI : BaseWebUISecureObject
    {        
          public InventoryItemManagementWebUI()
           {
            try
            {
                this.MyModuleID = "Inventory";
                this.MyAppID = "InventoryItem";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }

          public InventoryItemManagementWebUI(Page PageContext)
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
                this.MyAppID = "InventoryItem";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }

        public object GetRecordInventoryItem()
        {
            object InventoryItem = null;
            try
            {
                if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                {
                    InventoryItem ConsumableStockList = new InventoryItem();
                    object obj = (object)ConsumableStockList;
                    InventoryItem = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, this.MyModuleID);
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

            } return InventoryItem;
        }
        public StringBuilder BuildFormView(string DisplayMode, StringBuilder container)
        {
            try
            {
                using (HtmlFormAdapter htmlFormAdapter = new HtmlFormAdapter(MyModuleID))
                {
                    htmlFormAdapter.CurrentPage = this.CurrentPageContext;
                    htmlFormAdapter.HeadingColumnName = "ItemName";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.objFormData = GetRecordInventoryItem();
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.objFormData = GetRecordInventoryItem();
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.objFormData = GetRecordInventoryItem();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());                           
                            break;
                        case DisplayModeDelete:
                            htmlFormAdapter.objFormData = GetRecordInventoryItem();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Delete;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.objFormData = null;
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
                    case DisplayModeEdit:
                       strContent=  BuildFormView(this.DisplayMode, container);
                        break;
                    case DisplayModeDuplicate:
                        strContent = BuildFormView(this.DisplayMode, container);
                        break;
                    case DisplayModeDelete:
                        strContent=  BuildFormView(this.DisplayMode, container);
                        break;
                    case DisplayModeReadView:
                        strContent = BuildFormView(this.DisplayMode, container);
                        break;                 
                    case DisplayModeNew:
                        strContent = BuildFormView(this.DisplayMode, container);
                        break;                 
                    default:
                        break;



                    //case DisplayModeIndexView:
                    //    CreateGrid(container);
                    //    break;
                    //case DisplayModeReadView:
                    //    BuildFormView(this.DisplayMode, container);
                    //    break;
                    //case DisplayModeEdit:
                    //    BuildFormView(this.DisplayMode, container);
                    //    break;
                    //case DisplayModeNew:
                    //    BuildFormView(this.DisplayMode, container);
                    //    break;
                    //case DisplayModeDuplicate:
                    //    BuildFormView(this.DisplayMode, container);
                    //    break;
                    //case DisplayModeDelete:
                    //    BuildFormView(this.DisplayMode, container);
                    //    break;
                    //default:
                    //    break;
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
                    g.CommandButtonNewText = "New Inventory Item";
                    g.FormCaptionText = "Inventory Item";
                    g.PrimaryID = this.MyPrimaryID;
                    g.PageName = this.MyPageName;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    //g.DataSoruceUrl = "Services/Master/HoldTypeService.svc/GetGridData";
                    g.ServiceModuleName = this.MyModuleID;
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "ItemName", Title = "ITEM", DataType = GridDataType.String.ToString() });                  
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
                        SaveInventoryItem();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                        break;
                    case DisplayModeSaveAndNew:
                        SaveInventoryItem();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                        break;
                    case DisplayModeUpdate:
                        UpdateInventoryItem(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                        break;
                    case DisplayModeDelete:
                        DeleteInventoryItem(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
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

        private void SaveInventoryItem()
        {
            try
            {
                List<InventoryItem> listInventory = new List<InventoryItem>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var Inventory = new InventoryItem
                {
                    ItemName = FormElement["ItemName"].ToString().ToUpper(),                
                    IsActive = FormElement["IsActive"] == "0",
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),         
                };
                listInventory.Add(Inventory);
                object datalist = (object)listInventory;
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


        private void UpdateInventoryItem(string RecordID)
        {
            try
            {
                List<InventoryItem> listInventoryItem = new List<InventoryItem>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var InventoryItem = new InventoryItem
                {
                    SNo = Convert.ToInt32(RecordID),
                    ItemName=  FormElement["ItemName"].ToString().ToUpper(),
                    IsActive = FormElement["IsActive"] == "0",
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                };
                listInventoryItem.Add(InventoryItem);
                object datalist = (object)listInventoryItem;
                DataOperationService(DisplayModeUpdate, datalist, MyModuleID);
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
            }

        }

        private void DeleteInventoryItem(string RecordID)
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
