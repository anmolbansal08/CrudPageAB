using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI;
using CargoFlash.Cargo.Model.Stock;
using CargoFlash.Cargo.WebUI;
using CargoFlash.SoftwareFactory.WebUI;
using CargoFlash.SoftwareFactory.WebUI.Adapters;
using CargoFlash.SoftwareFactory.WebUI.Controls;

namespace CargoFlash.Cargo.WebUI.Stock
{
   public class AWBVoidManagementWebUI: BaseWebUISecureObject
    {
         public object GetRecordAWBVoidManagement()
        {
            object ConnectionType = null;
            try
            {
                if (!string.IsNullOrEmpty(HttpContext.Current.Request.QueryString["RecID"]))
                {
                    AWBVoid AWBStockList = new AWBVoid();
                    object obj = (object)AWBStockList;
                    //retrieve Entity from Database according to the record
                    ConnectionType = DataGetRecordService(HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID);
                    this.MyRecordID = (HttpContext.Current.Request.QueryString["RecID"]);
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

            } return ConnectionType;
        }
        public AWBVoidManagementWebUI()
        {
            try
            {
                this.MyPrimaryID = "SNo";
                this.MyModuleID = "Stock";
                this.MyAppID = "AWBVoid";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }

        public AWBVoidManagementWebUI(Page PageContext)
        {
            try
            {
                if (this.SetCurrentPageContext(PageContext))
                {
                    this.ErrorNumber = 0;
                    this.ErrorMessage = "";
                }
                this.MyPrimaryID = "SNo";
                this.MyPageName = "Default.aspx";
                this.MyModuleID = "Stock";
                this.MyAppID = "AWBVoid";
            }

            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }
//        public StringBuilder CreateAWBLostManagementDetailsPage(StringBuilder container)
//        {
//            var GroupSNo = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).GroupSNo;
//            StringBuilder containerLocal = new StringBuilder();
//            containerLocal.Append(@"
//        <div id='MainDiv'>
//        <div id='ApplicationTabs'>
//            
//            <div id='divTab1'> 
//              <span id='spnOfficeInformation'>");
//            containerLocal.Append(container);
//            containerLocal.Append("<table class='WebFormTable'><tr><td class'formActiontitle'><input type='button' value='Generate' text='Generate' class='btn btn-success' onClick='GenerateStock()' id='btnGenerate'> <input type='button' name='btnReset' value='Reset' onclick='ResetStock();' id='btnReset' tabindex='8' class='btn btn-success' title='Reset'> </td></tr></table>");
//            containerLocal.Append("</span></div></div> </div>");
//            return containerLocal;

//        }
        public StringBuilder BuildFormView(string DisplayMode, StringBuilder container)
        {
            try
            {
                using (HtmlFormAdapter htmlFormAdapter = new HtmlFormAdapter(MyModuleID))
                {
                    htmlFormAdapter.CurrentPage = this.CurrentPageContext;
                     
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.objFormData = GetRecordAWBVoidManagement();
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            htmlFormAdapter.CommandSaveAndNewText = "Void & New";
                            //container.Append(CreateAWBLostManagementDetailsPage(htmlFormAdapter.InstantiateIn()));
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
                {
                    //Set the display Mode form the URL QuesyString.
                    this.DisplayMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
                    //Match the display Mode of the form.
                    switch (this.DisplayMode)
                    {
                        case DisplayModeIndexView:
                            strContent = CreateGrid(container);
                            break;
                        case DisplayModeNew:
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
        private StringBuilder CreateGrid(StringBuilder Container)
        {
            try
            {
                using (Grid g = new Grid())
                {
                    g.CommandButtonNewText = "Create AWB Void";
                    g.FormCaptionText = "AWB Void Management";
                    g.IsActionRequired = false;
                    g.ActionTitle = "Issue To";
                    g.PrimaryID = this.MyPrimaryID;
                    g.PageName = this.MyPageName;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.ServiceModuleName = this.MyModuleID;
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                   // g.SuccessGrid = "ShowScheduleAction";
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "AWBNumber", Title = "AWB Number", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "AirlineName", Title = "Airline Name", DataType = GridDataType.String.ToString()});
                    g.Column.Add(new GridColumn { Field = "UpdatedOn", Title = "Updated By", DataType = GridDataType.String.ToString() });
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
        /// <summary>
        /// Insert new Schedule record into the database
        /// Retrieve information from webform and store the same into modal object 
        /// call webservice to save that data into the database
        /// </summary>
        private void SaveAWBVoid()
        {
            try
            {
                int number = 0;
                List<AWBVoid> listAWBVoid = new List<AWBVoid>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var AWBVoid = new AWBVoid
                {

                    StartRange = Int32.TryParse(FormElement["StartRange"].Split('-')[1].ToString().Substring(0, 7), out number) ? number : 0,
                    EndRange = Int32.TryParse(FormElement["EndRange"].Split('-')[1].ToString().Substring(0, 7), out number) ? number : 0,
                    AWBNumber = FormElement["StartRange"].Split('-')[0].ToString(),
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                   
                };
                listAWBVoid.Add(AWBVoid);
                object datalist = (object)listAWBVoid;
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
        public override void DoPostBack()
        {
            try
            {

                this.OperationMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
                switch (OperationMode)
                {
                    case "FORMACTION.VOID":
                        SaveAWBVoid();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                        break;
                    case "FORMACTION.VOID & NEW":
                        SaveAWBVoid();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                        break;
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
