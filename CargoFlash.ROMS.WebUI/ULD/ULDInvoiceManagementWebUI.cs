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
    public class ULDInvoiceManagementWebUI : BaseWebUISecureObject
    {
           public ULDInvoiceManagementWebUI()
             {
            try
            {
                this.MyModuleID = "ULD";
                this.MyAppID = "ULDInvoice";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
            }
           public ULDInvoiceManagementWebUI(Page PageContext)
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
                this.MyAppID = "ULDInvoice";
                this.MyPrimaryID = "SNo";
            }


            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }

           //public StringBuilder BuildFormView(string DisplayMode, StringBuilder container)
           //{
           //    try
           //    {
           //        using (HtmlFormAdapter htmlFormAdapter = new HtmlFormAdapter(MyModuleID))
           //        {
           //            htmlFormAdapter.CurrentPage = this.CurrentPageContext;
           //            htmlFormAdapter.HeadingColumnName = "ULDInvoice";
           //            switch (DisplayMode)
           //            {
           //                case DisplayModeReadView:
           //                    //htmlFormAdapter.objFormData = GetULDType();
           //                    htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
           //                    htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
           //                    htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
           //                    htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
           //                    htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
           //                    container.Append(htmlFormAdapter.InstantiateIn());
           //                    break;
           //                case DisplayModeDuplicate:
           //                    //htmlFormAdapter.objFormData = GetULDType();
           //                    htmlFormAdapter.DisplayMode = DisplayModeType.New;
           //                    htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
           //                    container.Append(htmlFormAdapter.InstantiateIn());
           //                    break;
           //                case DisplayModeEdit:
           //                   // htmlFormAdapter.objFormData = GetULDType();
           //                    htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
           //                    htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
           //                    container.Append(htmlFormAdapter.InstantiateIn());
           //                    break;
           //                case DisplayModeNew:
           //                    htmlFormAdapter.DisplayMode = DisplayModeType.New;
           //                    htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
           //                    container.Append(RenderULDInvoiceContainerForm());
           //                    break;
           //                case DisplayModeDelete:
           //                   // htmlFormAdapter.objFormData = GetULDType();
           //                    htmlFormAdapter.DisplayMode = DisplayModeType.Delete;
           //                    htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
           //                    container.Append(htmlFormAdapter.InstantiateIn());
           //                    break;
           //                default:
           //                    break;
           //            }
           //        }
           //    }
           //    catch (Exception ex)
           //    {
           //        ApplicationWebUI applicationWebUI = new ApplicationWebUI();
           //        applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

           //    }
           //    return container;
           //}

           public StringBuilder BuildFormView(string DisplayMode, StringBuilder container)
           {
               try
               {
                   using (HtmlFormAdapter htmlFormAdapter = new HtmlFormAdapter(MyModuleID))
                   {
                       htmlFormAdapter.CurrentPage = this.CurrentPageContext;
                       htmlFormAdapter.HeadingColumnName = "ReturntoShipper";
                       switch (DisplayMode)
                       {
                           case DisplayModeReadView:

                               htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;



                               htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                               container.Append(RenderULDInvoiceContainerForm());
                               break;


                           case DisplayModeNew:
                               htmlFormAdapter.DisplayMode = DisplayModeType.New;
                               htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                               container.Append(RenderULDInvoiceContainerForm());

                               break;

                           case DisplayModeEdit:
                               htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                               htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                               container.Append(RenderULDInvoiceContainerForm());

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

           private StringBuilder RenderULDInvoiceContainerForm()
           {
               StringBuilder Container = new StringBuilder();
               Container.Append("<Div id='ULDInvoiceContainer'></Div>");
               return Container;
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
                           case DisplayModeReadView:
                               BuildFormView(this.DisplayMode, container);
                               break;
                           case DisplayModeDuplicate:
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
           public override void DoPostBack()
           {
               try
               {
                   this.OperationMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
                   switch (OperationMode)
                   {
                       case DisplayModeSave:
                           //SaveULDType();
                           if (string.IsNullOrEmpty(ErrorMessage))
                               System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                           break;
                       case DisplayModeSaveAndNew:
                           //SaveULDType();
                           if (string.IsNullOrEmpty(ErrorMessage))
                               System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                           break;
                       case DisplayModeUpdate:
                           //UpdateULDType(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                           if (string.IsNullOrEmpty(ErrorMessage))
                               System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                           break;
                       case DisplayModeDelete:
                           //DeleteULDType(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
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
                       g.IsShowDelete = false;
                       g.EditName = "Print";
                       g.CommandButtonNewText = "New Cost Approval";
                       g.FormCaptionText = "Cost Approval";
                       g.DataSoruceUrl = "Services/ULD/ULDInvoiceService.svc/GetGridData";
                       g.ServiceModuleName = this.MyModuleID;
                       g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                       g.Column = new List<GridColumn>();
                       g.Column.Add(new GridColumn { Field = "SNo", Title = "SNo", DataType = GridDataType.String.ToString(),IsHidden=true});
                       
                       g.Column.Add(new GridColumn { Field = "Name", Title = "Customer", DataType = GridDataType.String.ToString() });
                       g.Column.Add(new GridColumn { Field = "UldNo", Title = "ULD", DataType = GridDataType.String.ToString() });
                       g.Column.Add(new GridColumn { Field = "NPPANo", Title = "NPPA No", DataType = GridDataType.String.ToString() });

                       g.Column.Add(new GridColumn { Field = "InvoiceDate", Title = "Cost Approval Date", DataType = GridDataType.DateTime.ToString(), Template = "# if( InvoiceDate==null) {# # } else {# #= kendo.toString(new Date(data.InvoiceDate.getTime() + data.InvoiceDate.getTimezoneOffset()*60000),\"" + UIDateTimeFormat.UIDateFormatString + " " + "\") # #}#" });
                       g.Column.Add(new GridColumn { Field = "ULDreturnedStatus", Title = "ULD Returned Status", DataType = GridDataType.String.ToString() });
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
    }
}
