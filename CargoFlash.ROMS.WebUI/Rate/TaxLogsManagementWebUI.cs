using System;
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
using System.Collections;
using CargoFlash.Cargo.Model.Rate;
using System.Collections.Generic;

namespace CargoFlash.Cargo.WebUI.Rate
{
    public class TaxLogsManagementWebUI : BaseWebUISecureObject
    {
         public TaxLogsManagementWebUI(Page PageContext)
        {
            try
            {
                if (this.SetCurrentPageContext(PageContext))
                {
                    this.ErrorNumber = 0;
                    this.ErrorMessage = "";
                }
                this.MyPageName = "Default.aspx";
                this.MyModuleID = "Rate";
                this.MyAppID = "TaxLogs";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }

         public TaxLogsManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Rate";
                this.MyAppID = "TaxLogs";
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
             StringBuilder strContent = new StringBuilder();
             try
             {
                 if (System.Web.HttpContext.Current.Request.QueryString["FormAction"] != null)
                 {
                     //Set the display Mode form the URL QuesyString.
                     //this.DisplayMode = "FORMACTION." + System.Web.HttpContext.Current.Request.QueryString["FormAction"].ToString().ToUpper().Trim();
                     this.DisplayMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
                     //Match the display Mode of the form.
                     switch (this.DisplayMode)
                     {
                         case DisplayModeIndexView:
                             BuildFormView(this.DisplayMode, container);
                            // CreateGrid(container);
                             break;
                         //case DisplayModeReadView:
                         //    BuildFormView(this.DisplayMode, container);
                         //    break;
                         
                         case DisplayModeNew:
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

         
         public StringBuilder BuildFormView(string DisplayMode, StringBuilder container)
         {
             try
             {
                 using (HtmlFormAdapter htmlFormAdapter = new HtmlFormAdapter(MyModuleID))
                 {
                     htmlFormAdapter.CurrentPage = this.CurrentPageContext;
                     htmlFormAdapter.HeadingColumnName = "TaxLogs";
                     switch (DisplayMode)
                     {
                         case DisplayModeIndexView:
                             htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            // htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                             container.Append(htmlFormAdapter.InstantiateIn());
                             break;
                         default:
                             break;
                     }
                     container.Append("<div id='divTaxLogs' style='width:100%;top:0px;margin-top:0px;'></div>");
                    // container.Append("<div id='divTaxLogs'></div><div id='divTaxLogsAction'></div><div id='divTaxLogsPopUp'  style='width:100%;top:0px;margin-top:0px;'></div><table id='tblTacLogsGrid' class='appendGrid ui-widget'></table><input id='hdncreatedBy' name='hdncreatedBy' type='hidden' value='" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString() + "'/><input type='hidden' id='hdnTaxLogsSNo'/>");
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
                     g.FormCaptionText = "TaxLogs";
                     g.CommandButtonNewText = "New TaxLogs";
                     g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                     g.Column = new List<GridColumn>();
                     //g.Column.Add(new GridColumn { Field = "CountryCode", Title = "Country Code", DataType = GridDataType.String.ToString() });
                     //g.Column.Add(new GridColumn { Field = "CountryName", Title = "Country Name", DataType = GridDataType.String.ToString() });
                     //g.Column.Add(new GridColumn { Field = "CurrencyCode", Title = "Currency Code", DataType = GridDataType.String.ToString() });
                     //g.Column.Add(new GridColumn { Field = "Continent", Title = "Continent", DataType = GridDataType.String.ToString() });

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
