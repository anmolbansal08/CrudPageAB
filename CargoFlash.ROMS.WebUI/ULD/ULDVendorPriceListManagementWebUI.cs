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
using System.Web;
using CargoFlash.Cargo.WebUI;

namespace CargoFlash.Cargo.WebUI.ULD
{
   public class ULDVendorPriceListManagementWebUI : BaseWebUISecureObject
    {

       public object GetRecordVendorPriceList()
       {

           object VendorPList = null;
           try
           {
               if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
               {
                   VendorPriceList priceList = new VendorPriceList();
                   object obj = (object)priceList;
                   VendorPList = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, this.MyModuleID);
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

           } return VendorPList;
       }
       public ULDVendorPriceListManagementWebUI(Page PageContext)
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
                this.MyAppID = "ULDVendorPriceList";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }
           public ULDVendorPriceListManagementWebUI()
        {
            try
            {
                this.MyModuleID = "ULD";
                this.MyAppID = "ULDVendorPriceList";
                this.MyPrimaryID = "SNo";
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
                       htmlFormAdapter.HeadingColumnName = "PartNumber";
                       switch (DisplayMode)
                       {
                           case DisplayModeReadView:
                               htmlFormAdapter.objFormData = GetRecordVendorPriceList();
                               htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                               htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                               htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                               htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                               htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                               container.Append(htmlFormAdapter.InstantiateIn());
                               break;
                           case DisplayModeDuplicate:
                               htmlFormAdapter.objFormData = GetRecordVendorPriceList();
                               htmlFormAdapter.DisplayMode = DisplayModeType.New;
                               htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                               container.Append(htmlFormAdapter.InstantiateIn());
                               break;
                           case DisplayModeEdit:
                               htmlFormAdapter.objFormData = GetRecordVendorPriceList();
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
                               htmlFormAdapter.objFormData = GetRecordVendorPriceList();
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


                   // if (System.Web.HttpContext.Current.Request.QueryString["FormAction"] != null)
                   {
                       //Set the display Mode form the URL QuesyString.
                       this.DisplayMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
                       //Match the display Mode of the form.
                       switch (this.DisplayMode)
                       {
                           case DisplayModeIndexView:
                               strContent =  CreateGrid(container);
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
               }
               catch (Exception ex)
               {
                   ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                   applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

               }
               return strContent;
           }

           // private StringBuilder CreateGrid(StringBuilder Container)
           //{
           //    using (Grid g = new Grid())
           //    {
           //        g.PageName = this.MyPageName;
           //        g.PrimaryID = "VendorPriceList";
           //        g.ModuleName = this.MyModuleID;
           //        g.AppsName = this.MyAppID;

           //        g.PrimaryID = this.MyPrimaryID;
           //        g.DataSoruceUrl = "Services/ULD/VendorPriceListService.svc/GetGridData";
           //        g.PageName = this.MyPageName;
           //        g.ModuleName = this.MyModuleID;
           //        g.AppsName = this.MyAppID;
           //        g.ServiceModuleName = this.MyModuleID;
           //        g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
           //        g.Column = new List<GridColumn>();
           //       // g.ProcessName = ProcessName;
           //       // g.SuccessGrid = "checkRepairOrScrap";

           //        g.Column = new List<GridColumn>();
           //        g.Column.Add(new GridColumn { Field = "CustomerSNo", Title = "Vendor Name", DataType = GridDataType.String.ToString() });
           //        g.Column.Add(new GridColumn { Field = "PartNumber", Title = "Part Number", DataType = GridDataType.String.ToString() });
           //        g.Column.Add(new GridColumn { Field = "ItemDescription", Title = "Item Description", DataType = GridDataType.String.ToString() });
           //        g.Column.Add(new GridColumn { Field = "Qty", Title = "Quantity", DataType = GridDataType.String.ToString() });
           //        g.Column.Add(new GridColumn { Field = "UOM", Title = "UOM", DataType = GridDataType.String.ToString() });
           //        g.Column.Add(new GridColumn { Field = "Price", Title = "Price", DataType = GridDataType.String.ToString() });
           //        g.Column.Add(new GridColumn { Field = "IsActive", Title = "Active", DataType = GridDataType.String.ToString() });
           //        g.Action = new List<GridAction>();
           //        g.Action.Add(new GridAction
           //        {
           //            ButtonCaption = "Read",
           //            ClientAction = "BindEvents",
           //            ActionName = "READ",
           //          //  AppsName = ProcessName,
           //            CssClassName = "read",
           //            ModuleName = "V"
           //        });
           //        g.Action.Add(new GridAction
           //        {
           //            ButtonCaption = "Edit",
           //            ClientAction = "BindEvents",
           //            ActionName = "EDIT",
           //            //AppsName = ProcessName,
           //            CssClassName = "read",
           //            ModuleName = "E"
           //        });

           //       /// g.ExtraParam = new List<GridExtraParam>();                              
           //        g.InstantiateIn(Container);
           //    }
           //    return Container;
           //}

           private StringBuilder CreateGrid(StringBuilder Container)
           {
               try
               {
                   using (Grid g = new Grid())
                   {
                       g.CommandButtonNewText = "New Vendor Price List";
                       g.FormCaptionText = "New Vendor Price List";
                       g.PrimaryID = this.MyPrimaryID;
                       g.PageName = this.MyPageName;
                       g.ModuleName = this.MyModuleID;
                       g.AppsName = this.MyAppID;
                       g.ServiceModuleName = this.MyModuleID;
                       g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                       g.Column = new List<GridColumn>();
                       g.Column.Add(new GridColumn { Field = "Name", Title = "Vendor Name", DataType = GridDataType.String.ToString() });
                       g.Column.Add(new GridColumn { Field = "PartNumber", Title = "Part Number", DataType = GridDataType.String.ToString() });
                       g.Column.Add(new GridColumn { Field = "ItemDescription", Title = "Item Description", DataType = GridDataType.String.ToString() });
                       g.Column.Add(new GridColumn { Field = "Qty", Title = "Quantity", DataType = GridDataType.String.ToString() });
                       g.Column.Add(new GridColumn { Field = "Text_UOM", Title = "UOM", DataType = GridDataType.String.ToString() });
                       g.Column.Add(new GridColumn { Field = "price", Title = "Price", DataType = GridDataType.String.ToString() });
                       g.Column.Add(new GridColumn { Field = "Active", Title = "Active", DataType = GridDataType.String.ToString() });
                      // g.Column.Add(new GridColumn { Field = "CreatedBy", Title = "Created By", DataType = GridDataType.String.ToString() });

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
               //try
               //{

               this.OperationMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
               switch (OperationMode)
               {
                   case DisplayModeSave:
                       SaveULDVendorPriceList();
                       if (string.IsNullOrEmpty(ErrorMessage))
                           System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                       break;
                   case DisplayModeSaveAndNew:
                       SaveULDVendorPriceList();
                       if (string.IsNullOrEmpty(ErrorMessage))
                           System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                       break;
                   case DisplayModeUpdate:

                       UpdateVendorPriceList(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                       if (string.IsNullOrEmpty(ErrorMessage))
                           System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                       break;

                   case DisplayModeDelete:
                       DeleteVendorPriceList(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
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

           private void SaveULDVendorPriceList()
           {
               try
               {
                   string sno="";
                   List<VendorPriceList> listCharges = new List<VendorPriceList>();
                   // String[] Logo = SaveImage();
                   var FormElement = System.Web.HttpContext.Current.Request.Form;
                   var PriceList = new VendorPriceList
                   {

                       // SNo=0,
         
                       CustomerSNo = Convert.ToInt32(FormElement["CustomerSNo"]),
                       PartNumber = Convert.ToString(FormElement["PartNumber"]),//not null
                       ItemDescription = Convert.ToString(FormElement["ItemDescription"]),
                       Qty = Convert.ToInt32(FormElement["Qty"]),
                       UOM = Convert.ToInt32(FormElement["UOM"]),
                       price = decimal.Parse(FormElement["price"]),
                       IsActive = FormElement["IsActive"] == "0" ? true : false,//not null
                       Active =FormElement["IsActive"] == "0" ? "1" : "0",
                       CreatedOn = DateTime.UtcNow,
                       // UpdatedOn = DateTime.UtcNow.ToString(),
                       CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                      // UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()


                   };

                   listCharges.Add(PriceList);

                   object datalist = (object)listCharges;
                   DataOperationService(DisplayModeSave, datalist, MyModuleID);

               }
               catch (Exception ex)
               {
                   ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                   applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
               }  
           }

           private void UpdateVendorPriceList(string RecordID)
           {
               try
               {
                   List<VendorPriceList> listCharges = new List<VendorPriceList>();
                   // String[] Logo = SaveImage();
                   var FormElement = System.Web.HttpContext.Current.Request.Form;
                   var PriceList = new VendorPriceList
                   {

                       // SNo=0,
                       SNo =Convert.ToInt32(RecordID),
                       CustomerSNo = Convert.ToInt32(FormElement["CustomerSNo"]),
                       PartNumber = Convert.ToString(FormElement["PartNumber"]),//not null
                       ItemDescription = Convert.ToString(FormElement["ItemDescription"]),
                       Qty = Convert.ToInt32(FormElement["Qty"]),
                       UOM = Convert.ToInt32(FormElement["UOM"]),
                       price = decimal.Parse(FormElement["price"]),
                       IsActive = FormElement["IsActive"] == "0" ? true : false,//not null
                       Active = FormElement["IsActive"] == "0" ? "1" : "0",
                      // CreatedOn = DateTime.UtcNow,
                       UpdatedOn = DateTime.UtcNow,
                       CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                       UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),


                   };

                   listCharges.Add(PriceList);
                   object datalist = (object)listCharges;
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
           private void DeleteVendorPriceList(string RecordID)
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
