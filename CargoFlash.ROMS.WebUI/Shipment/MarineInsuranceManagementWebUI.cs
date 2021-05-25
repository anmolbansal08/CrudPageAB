using CargoFlash.Cargo.Model.Export;
using CargoFlash.SoftwareFactory.WebUI;
using CargoFlash.SoftwareFactory.WebUI.Adapters;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI;

namespace CargoFlash.Cargo.WebUI.Shipment
{
    public class MarineInsuranceManagementWebUI : BaseWebUISecureObject
    {

        public MarineInsuranceManagementWebUI()
        {

            try
            {
                this.MyModuleID = "Shipment";
                this.MyAppID = "MarineInsurance";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }

        public MarineInsuranceManagementWebUI(Page PageContext)
        {
            try
            {
                if (this.SetCurrentPageContext(PageContext))
                {
                    this.ErrorNumber = 0;
                    this.ErrorMessage = "";
                }
                this.MyPageName = "Default.aspx";
                this.MyModuleID = "Shipment";
                this.MyAppID = "MarineInsurance";
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
                    htmlFormAdapter.HeadingColumnName = "";
                    switch (DisplayMode)
                    {

                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
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
            try
            {
                //if (System.Web.HttpContext.Current.Request.QueryString["FormAction"] != null)
                {

                    this.DisplayMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
                    //Match the display Mode of the form.
                    switch (this.DisplayMode)
                    {
                        case DisplayModeIndexView:
                            CreateGrid(container);
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

        private StringBuilder CreateGrid(StringBuilder Container)//updated by shahbaz akhtar on 28-12-2016 
        {
            try
            {
                using (Grid g = new Grid())
                {
                     g.CommandButtonNewText = "New MarineInsurance";
                    g.FormCaptionText = "Marine Insurance";
                    g.PrimaryID = this.MyPrimaryID;
                    g.PageName = this.MyPageName;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.ServiceModuleName = this.MyModuleID;
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);

                    g.Column = new List<GridColumn>();
                  //  Sno   ,Commodity  ,InsuranceCategory,	InsuranceBasedOn,	InsuranceValue,	Airline,	Createdby
                   // g.Column.Add(new GridColumn { Field = "AWBNo", Title = "AWB No", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Commodity", Title = "Commodity", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "InsuranceCategory", Title = "Insurance Category", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "InsuranceBasedOn", Title = "Insurance BasedOn", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "InsuranceValue ", Title = "Value", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Airline", Title = "Airline", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Active", Title = "Status", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Createdby", Title = "Created by", DataType = GridDataType.String.ToString() });
                  

                    g.Action = new List<GridAction>();

                    g.Action.Add(new GridAction
                    {
                        ButtonCaption = "Read",
                        ActionName = "READ",
                        AppsName = this.MyAppID,
                        CssClassName = "read",
                        ModuleName = this.MyModuleID
                    });
                    g.Action.Add(new GridAction
                    {
                        ButtonCaption = "Edit",
                        ActionName = "EDIT",
                        AppsName = this.MyAppID,
                        CssClassName = "read",
                        ModuleName = this.MyModuleID
                    });

                    g.InstantiateIn(Container);

                    //g.InstantiateIn(Container);
                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
            return Container;
        }


    }
}
