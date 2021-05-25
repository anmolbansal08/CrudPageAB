using CargoFlash.Cargo.Model.Inventory;
using CargoFlash.SoftwareFactory.WebUI;
using CargoFlash.SoftwareFactory.WebUI.Adapters;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.UI;

namespace CargoFlash.Cargo.WebUI.Inventory
{
    public class InvVehicleServiceManagementWebUI: BaseWebUISecureObject
    {
         public InvVehicleServiceManagementWebUI(Page PageContext)
        {
            try
            {
                if (this.SetCurrentPageContext(PageContext))
                {
                    this.ErrorNumber = 0;
                    this.ErrorMessage = "";
                }
                this.MyPageName = "Default.cshtml";
                this.MyModuleID = "Inventory";
                this.MyAppID = "InvVehicleService";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }
         public InvVehicleServiceManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Inventory";
                this.MyAppID = "InvVehicleService";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
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
         private StringBuilder CreateGrid(StringBuilder Container)
         {
             try
             {
                 using (Grid g = new Grid())
                 {
                     g.PrimaryID = this.MyPrimaryID;
                     g.PageName = this.MyPageName;
                     g.ModuleName = this.MyModuleID;
                     g.AppsName = this.MyAppID;
                     g.ServiceModuleName = this.MyModuleID;
                     g.FormCaptionText = "Vehicle Service";
                     g.CommandButtonNewText = "New Vehicle Service";
                     g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                     g.Column = new List<GridColumn>();
                     g.Column.Add(new GridColumn { Field = "Text_VehicleSNo", Title = "Vehicle Name", DataType = GridDataType.String.ToString() });
                     g.Column.Add(new GridColumn { Field = "RegistrationNo", Title = "Vehicle Registration No", DataType = GridDataType.String.ToString() });
                     g.Column.Add(new GridColumn { Field = "Text_VehicleServiceType", Title = "Vehicle Service Type", DataType = GridDataType.String.ToString() });
                     g.Column.Add(new GridColumn { Field = "ServicedOn", Title = "Serviced On", DataType = GridDataType.Date.ToString() });
                     g.Column.Add(new GridColumn { Field = "NextServiceDueOn", Title = "Next Service Due On", DataType = GridDataType.Date.ToString() });
                     g.Column.Add(new GridColumn { Field = "IsActive", Title = "Active", DataType = GridDataType.String.ToString() });
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
         public StringBuilder BuildFormView(string DisplayMode, StringBuilder container)
         {
             try
             {
                 using (HtmlFormAdapter htmlFormAdapter = new HtmlFormAdapter(MyModuleID))
                 {
                     htmlFormAdapter.CurrentPage = this.CurrentPageContext;
                     htmlFormAdapter.HeadingColumnName = "Name";
                     switch (DisplayMode)
                     {
                         case DisplayModeReadView:
                             htmlFormAdapter.objFormData = GetRecordInvVehicleService();
                             htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                             htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                             htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                             htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                             htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                             container.Append(htmlFormAdapter.InstantiateIn());
                             break;
                         case DisplayModeDuplicate:
                             htmlFormAdapter.objFormData = GetRecordInvVehicleService();
                             htmlFormAdapter.DisplayMode = DisplayModeType.New;
                             htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                             container.Append(htmlFormAdapter.InstantiateIn());
                             break;
                         case DisplayModeEdit:

                             htmlFormAdapter.objFormData = GetRecordInvVehicleService();
                             htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                             htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                             container.Append(htmlFormAdapter.InstantiateIn());
                             break;
                         case DisplayModeNew:
                             htmlFormAdapter.DisplayMode = DisplayModeType.New;
                             htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                             container.Append(htmlFormAdapter.InstantiateIn());
                             break;
                         case DisplayModeDelete:
                             htmlFormAdapter.objFormData = GetRecordInvVehicleService();
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
         public object GetRecordInvVehicleService()
         {

             object InventoryVehType = null;
             try
             {
                 if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                 {
                     InvVehicleService InventoryVehTypeList = new InvVehicleService();
                     object obj = (object)InventoryVehTypeList;
                     InventoryVehType = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, this.MyModuleID);
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

             } return InventoryVehType;
         }
         public override void DoPostBack()
         {
             //try
             //{

             this.OperationMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
             switch (OperationMode)
             {
                 case DisplayModeSave:
                     SaveInvVehicleService();
                     if (string.IsNullOrEmpty(ErrorMessage))
                         System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                     break;
                 case DisplayModeSaveAndNew:
                     SaveInvVehicleService();
                     if (string.IsNullOrEmpty(ErrorMessage))
                         System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                     break;
                 case DisplayModeUpdate:

                     UpdateInvVehicleService(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                     if (string.IsNullOrEmpty(ErrorMessage))
                         System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                     break;

                 case DisplayModeDelete:
                     DeleteInvVehicleService(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                     if (string.IsNullOrEmpty(ErrorMessage))
                         System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2002), false);
                     break;
             }
             //}
             //catch (Exception ex)
             //{
             //    ApplicationWebUI applicationWebUI = new ApplicationWebUI();
             //    applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

             //}
         }
         private void SaveInvVehicleService()
         {
             try
             {
                 List<InvVehicleService> listInvVehicleService = new List<InvVehicleService>();
                 // String[] Logo = SaveImage();
                 var FormElement = System.Web.HttpContext.Current.Request.Form;
                 var InvVehicleService = new InvVehicleService
                 {
                     VehicleSNo = Convert.ToInt32(FormElement["VehicleSNo"]),
                     VehicleServiceTypeSNo = Convert.ToInt32(FormElement["VehicleServiceTypeSNo"]),
                     ServicedOn = DateTime.Parse(FormElement["ServicedOn"]),
                     NextServiceDueOn = DateTime.Parse(FormElement["NextServiceDueOn"]),
                     CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                     UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                     IsActive = true
                 };
                 listInvVehicleService.Add(InvVehicleService);
                 object datalist = (object)listInvVehicleService;
                 DataOperationService(DisplayModeSave, datalist, MyModuleID);
             }
             catch (Exception ex)
             {
                 ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                 applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
             }
         }
         private void UpdateInvVehicleService(string RecordID)
         {
             try
             {
                 List<InvVehicleService> listInvVehicleService = new List<InvVehicleService>();
                 // String[] Logo = SaveImage();
                 var FormElement = System.Web.HttpContext.Current.Request.Form;
                 var InvVehicleService = new InvVehicleService
                 {
                     SNo = int.Parse(RecordID),
                     VehicleSNo = Convert.ToInt32(FormElement["VehicleSNo"]),
                     VehicleServiceTypeSNo = Convert.ToInt32(FormElement["VehicleServiceTypeSNo"]),
                     ServicedOn = DateTime.Parse(FormElement["ServicedOn"]),
                     NextServiceDueOn = DateTime.Parse(FormElement["NextServiceDueOn"]),
                     CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                     UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                     IsActive = true
                 };
                 listInvVehicleService.Add(InvVehicleService);
                 object datalist = (object)listInvVehicleService;
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
         private void DeleteInvVehicleService(string RecordID)
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
    }
}
