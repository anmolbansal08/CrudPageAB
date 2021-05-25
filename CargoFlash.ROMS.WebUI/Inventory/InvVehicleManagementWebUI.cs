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
   public  class InvVehicleManagementWebUI : BaseWebUISecureObject
    {
         public InvVehicleManagementWebUI(Page PageContext)
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
                this.MyAppID = "InvVehicle";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }
         public InvVehicleManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Inventory";
                this.MyAppID = "InvVehicle";
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
                     g.FormCaptionText = "Vehicle";
                     g.CommandButtonNewText = "New Vehicle";
                     g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                     g.Column = new List<GridColumn>();
                     g.Column.Add(new GridColumn { Field = "Text_VehicleTypeSNo", Title = "Vehicle Name", DataType = GridDataType.String.ToString() });
                     g.Column.Add(new GridColumn { Field = "ManufactureDate", Title = "Manufacture Date", DataType = GridDataType.Date.ToString() });
                     g.Column.Add(new GridColumn { Field = "EngineNo", Title = "Engine No", DataType = GridDataType.String.ToString() });
                     g.Column.Add(new GridColumn { Field = "ChasisNo", Title = "Chasis No", DataType = GridDataType.String.ToString() });
                     g.Column.Add(new GridColumn { Field = "RegistrationNo", Title = "Registration No", DataType = GridDataType.String.ToString() });
                     g.Column.Add(new GridColumn { Field = "DateofPurchase", Title = "Date of Purchase", DataType = GridDataType.Date.ToString() });
                     g.Column.Add(new GridColumn { Field = "VehicleType", Title = "Type of Vehicle", DataType = GridDataType.String.ToString() });
                     g.Column.Add(new GridColumn { Field = "PurchasedFrom", Title = "Purchased From", DataType = GridDataType.String.ToString() });
                     g.Column.Add(new GridColumn { Field = "CostOfVehicle", Title = "Cost of Vehicle", DataType = GridDataType.String.ToString() });
                     g.Column.Add(new GridColumn { Field = "CityCode", Title = "City Code", DataType = GridDataType.String.ToString() });
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
                             htmlFormAdapter.objFormData = GetRecordInvVehicle();
                             htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                             htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                             htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                             htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                             htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                             container.Append(htmlFormAdapter.InstantiateIn());
                             break;
                         case DisplayModeDuplicate:
                             htmlFormAdapter.objFormData = GetRecordInvVehicle();
                             htmlFormAdapter.DisplayMode = DisplayModeType.New;
                             htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                             container.Append(htmlFormAdapter.InstantiateIn());
                             break;
                         case DisplayModeEdit:

                             htmlFormAdapter.objFormData = GetRecordInvVehicle();
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
                             htmlFormAdapter.objFormData = GetRecordInvVehicle();
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
         public object GetRecordInvVehicle()
         {

             object InventoryVehType = null;
             try
             {
                 if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                 {
                     InvVehicle InventoryVehTypeList = new InvVehicle();
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
                     SaveInvVehicle();
                     if (string.IsNullOrEmpty(ErrorMessage))
                         System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                     break;
                 case DisplayModeSaveAndNew:
                     SaveInvVehicle();
                     if (string.IsNullOrEmpty(ErrorMessage))
                         System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                     break;
                 case DisplayModeUpdate:

                     UpdateInvVehicle(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                     if (string.IsNullOrEmpty(ErrorMessage))
                         System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                     break;

                 case DisplayModeDelete:
                     DeleteInvVehicle(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
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
         private void SaveInvVehicle()
         {
             try
             {
                 List<InvVehicle> listInvVehicle = new List<InvVehicle>();
                 // String[] Logo = SaveImage();
                 var FormElement = System.Web.HttpContext.Current.Request.Form;
                 var InvVehicle = new InvVehicle
                 {
                     VehicleTypeSNo = Convert.ToInt32(FormElement["VehicleTypeSNo"]),
                     ManufactureDate = DateTime.Parse(FormElement["ManufactureDate"]),
                     EngineNo = FormElement["EngineNo"].ToUpper(),
                     ChasisNo = FormElement["ChasisNo"].ToUpper(),
                     RegistrationNo = FormElement["RegistrationNo"].ToUpper(),
                     DateofPurchase = DateTime.Parse(FormElement["DateofPurchase"]),
                     TypeOfVehicle = Convert.ToBoolean(FormElement["TypeOfVehicle"].ToString()=="0"?false:true),
                     PurchasedFrom = FormElement["PurchasedFrom"].ToUpper(),
                     CostOfVehicle = Convert.ToDecimal(FormElement["CostOfVehicle"]),
                     CurrentMileageReading = FormElement["CurrentMileageReading"].ToString() == "" ? 0 : Convert.ToInt32(FormElement["CurrentMileageReading"]),
                     NextServiceDueOn = DateTime.Parse(FormElement["NextServiceDueOn"]),
                     CityCode = FormElement["CityCode"].ToUpper(),
                     CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                     UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                     IsActive = true
                 };
                 listInvVehicle.Add(InvVehicle);
                 object datalist = (object)listInvVehicle;
                 DataOperationService(DisplayModeSave, datalist, MyModuleID);
             }
             catch (Exception ex)
             {
                 ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                 applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
             }
         }
         private void UpdateInvVehicle(string RecordID)
         {
             try
             {
                 List<InvVehicle> listInvVehicle = new List<InvVehicle>();
                 // String[] Logo = SaveImage();
                 var FormElement = System.Web.HttpContext.Current.Request.Form;
                 var InvVehicle = new InvVehicle
                 {
                     SNo = int.Parse(RecordID),
                     VehicleTypeSNo = Convert.ToInt32(FormElement["VehicleTypeSNo"]),
                     ManufactureDate = DateTime.Parse(FormElement["ManufactureDate"]),
                     EngineNo = FormElement["EngineNo"].ToUpper(),
                     ChasisNo = FormElement["ChasisNo"].ToUpper(),
                     RegistrationNo = FormElement["RegistrationNo"].ToUpper(),
                     DateofPurchase = DateTime.Parse(FormElement["DateofPurchase"]),
                     TypeOfVehicle = Convert.ToBoolean(FormElement["TypeOfVehicle"].ToString() == "0" ? false : true),
                     PurchasedFrom = FormElement["PurchasedFrom"].ToUpper(),
                     CostOfVehicle = Convert.ToDecimal(FormElement["CostOfVehicle"]),
                     CurrentMileageReading = FormElement["CurrentMileageReading"].ToString() == "" ? 0 : Convert.ToInt32(FormElement["CurrentMileageReading"]),
                     NextServiceDueOn = DateTime.Parse(FormElement["NextServiceDueOn"]),
                     CityCode = FormElement["CityCode"].ToUpper(),
                     CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                     UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                     IsActive = true
                 };
                 listInvVehicle.Add(InvVehicle);
                 object datalist = (object)listInvVehicle;
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
         private void DeleteInvVehicle(string RecordID)
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
