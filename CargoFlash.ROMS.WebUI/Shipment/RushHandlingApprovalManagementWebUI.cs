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
    
    public   class RushHandlingApprovalManagementWebUI : BaseWebUISecureObject
    {

    

        public RushHandlingApprovalManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Shipment";
                this.MyAppID = "RushHandlingApproval";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }

        public RushHandlingApprovalManagementWebUI(Page PageContext)
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
                this.MyAppID = "RushHandlingApproval";
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
                    // g.CommandButtonNewText = "New DirectPayment";
                    g.FormCaptionText = "Rush Handling Approval";
                    g.PrimaryID = this.MyPrimaryID;
                    g.PageName = this.MyPageName;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.ServiceModuleName = this.MyModuleID;
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);

                    g.Column = new List<GridColumn>();
                   
                    g.Column.Add(new GridColumn { Field = "AWBNo", Title = "AWB No", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Origin", Title = "Origin", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Destination", Title = "Destination", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Pieces", Title = "Pieces", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Grossweight ", Title = "Gross Weight", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Chargeableweight", Title = "Chargeable Weight", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Requestedby", Title = "Requested by", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Approvedby", Title = "Approved by", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "ApproveStatus", Title = "Status", DataType = GridDataType.String.ToString() });

                    g.Action = new List<GridAction>();

                    g.Action.Add(new GridAction
                    {
                        ButtonCaption = "Approve",
                        ActionName = "READ",
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
