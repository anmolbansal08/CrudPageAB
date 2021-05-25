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
using CargoFlash.Cargo.Model.Master;
using System.Collections;

namespace CargoFlash.Cargo.WebUI.Master
{
    public class AirlineAuctionManagementWebUI : BaseWebUISecureObject
    {

        public AirlineAuctionManagementWebUI(Page PageContext)
        {
            try
            {
                if (this.SetCurrentPageContext(PageContext))
                {
                    this.ErrorNumber = 0;
                    this.ErrorMessage = "";
                }
                this.MyPageName = "Default.aspx";
                this.MyModuleID = "Master";
                this.MyAppID = "AirlineAuction";
                this.MyPrimaryID = "SNo";
            }


            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }



        public object GetAirlineAution()
        {
            object AirlineAuction = null;
            try
            {
                if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                {
                    AirlineAuction AirlineList = new AirlineAuction();
                    object obj = (object)AirlineList;
                    AirlineAuction = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, this.MyModuleID);
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

            } return AirlineAuction;
        }
        public override void BuildFormView(string DisplayMode, StringBuilder container)
        {
            try
            {
                using (HtmlFormAdapter htmlFormAdapter = new HtmlFormAdapter(this.MyModuleID))
                {
                    htmlFormAdapter.CurrentPage = this.CurrentPageContext;
                    htmlFormAdapter.HeadingColumnName = "AuctionName";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.objFormData = GetAirlineAution();
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.objFormData = GetAirlineAution();
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.objFormData = GetAirlineAution();
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
                            htmlFormAdapter.objFormData = GetAirlineAution();
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
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }


        public override void CreateWebForm(StringBuilder container)
        {
            try
            {
                if (System.Web.HttpContext.Current.Request.QueryString["FormAction"] != null)
                {
                    //Set the display Mode form the URL QuesyString.
                    this.DisplayMode = "FORMACTION." + System.Web.HttpContext.Current.Request.QueryString["FormAction"].ToString().ToUpper().Trim();
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
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }

        private void CreateGrid(StringBuilder Container)
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
                    g.FormCaptionText = "Airline Auction";
                    g.CommandButtonNewText = "New Airline Auction";
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    //g.Column.Add(new GridColumn { Field = "Text_CustomerSNo", Title = "Customer Name", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "AuctionName", Title = "Auction Name", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "CurrencyCode", Title = "Currency Code", DataType = GridDataType.String.ToString() });
                    g.InstantiateIn(Container);
                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }

        public override void DoPostBack()
        {
            try
            {
                this.OperationMode = "FORMACTION." + CurrentPageContext.Request.Form["Operation"].ToString().ToUpper().Trim();
                switch (OperationMode)
                {
                    case DisplayModeSave:
                        SaveAirlineAuction();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            CurrentPageContext.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false,2000), false);
                        break;
                    case DisplayModeSaveAndNew:
                        SaveAirlineAuction();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            CurrentPageContext.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false,2000), false);
                        break;
                    case DisplayModeUpdate:
                        UpdateAirlineAuction(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                        if (string.IsNullOrEmpty(ErrorMessage))
                            CurrentPageContext.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false,2001), false);
                        break;
                    case DisplayModeDelete:
                        DeleteAirline(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                        if (string.IsNullOrEmpty(ErrorMessage))
                            CurrentPageContext.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false,2002), false);
                        break;
                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }

        private void SaveAirlineAuction()
        {
            try
            {
                List<AirlineAuction> listAirline = new List<AirlineAuction>();
                double dblNumber = 0;
                int number = 0;
                DateTime dt;
                var AirlineAuction = new AirlineAuction
                {
                    //CustomerSNo = Convert.ToInt32(System.Web.HttpContext.Current.Request["CustomerSNo"]).ToString(),
                    AuctionRate = double.TryParse(System.Web.HttpContext.Current.Request["AuctionRate"], out dblNumber) ? dblNumber : 0,
                    //Rate = double.TryParse(System.Web.HttpContext.Current.Request["Rate"], out dblNumber) ? dblNumber : 0,
                    CurrencyCode = System.Web.HttpContext.Current.Request["CurrencyCode"],
                    AuctionName = System.Web.HttpContext.Current.Request["AuctionName"].ToUpper(),
                    CutoffTime = int.TryParse(System.Web.HttpContext.Current.Request["CutoffTime"], out number) ? number : 0,
                    TotalBucketSpace = double.TryParse(System.Web.HttpContext.Current.Request["TotalBucketSpace"], out dblNumber) ? dblNumber : 0,
                    FlightNo = CurrentPageContext.Request.Form["FlightNo"],
                    Origin = CurrentPageContext.Request.Form["Origin"],
                    Destination = CurrentPageContext.Request.Form["Destination"],
                    ValidFrom = DateTime.TryParse(System.Web.HttpContext.Current.Request["ValidFrom"], out dt) ? dt : (DateTime?)null,
                    ValidTo = DateTime.TryParse(System.Web.HttpContext.Current.Request["ValidTo"], out dt) ? dt : (DateTime?)null,
                    ApprovedBy = Convert.ToInt32(System.Web.HttpContext.Current.Request["ApprovedBy"]),
                    ApprovedOn = DateTime.TryParse(System.Web.HttpContext.Current.Request["ApprovedOn"], out dt) ? dt : (DateTime?)null,
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(CurrentPageContext.Session["UserDetail"])).UserSNo.ToString(),
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(CurrentPageContext.Session["UserDetail"])).UserSNo.ToString()
                };
                listAirline.Add(AirlineAuction);
                object datalist = (object)listAirline;
                DataOperationService(DisplayModeSave, datalist, MyModuleID);
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            }
        }

        private void UpdateAirlineAuction(string RecordID)
        {

            try
            {
                List<AirlineAuction> listAirline = new List<AirlineAuction>();
                double dblNumber = 0;
                int number = 0;
                DateTime dt;
                var AirlineAuction = new AirlineAuction
                {
                    SNo = Int32.Parse(RecordID),
                    //CustomerSNo = Convert.ToInt32(System.Web.HttpContext.Current.Request["CustomerSNo"]).ToString(),
                    AuctionRate = double.TryParse(System.Web.HttpContext.Current.Request["AuctionRate"], out dblNumber) ? dblNumber : 0,
                    //Rate = double.TryParse(System.Web.HttpContext.Current.Request["Rate"], out dblNumber) ? dblNumber : 0,
                    CurrencyCode = System.Web.HttpContext.Current.Request["CurrencyCode"],
                    AuctionName = System.Web.HttpContext.Current.Request["AuctionName"].ToUpper(),
                    CutoffTime = int.TryParse(System.Web.HttpContext.Current.Request["CutoffTime"], out number) ? number : 0,
                    TotalBucketSpace = double.TryParse(System.Web.HttpContext.Current.Request["TotalBucketSpace"], out dblNumber) ? dblNumber : 0,
                    ValidFrom = DateTime.TryParse(System.Web.HttpContext.Current.Request["ValidFrom"], out dt) ? dt : (DateTime?)null,
                    FlightNo = CurrentPageContext.Request.Form["FlightNo"],
                    Origin = CurrentPageContext.Request.Form["Origin"],
                    Destination = CurrentPageContext.Request.Form["Destination"],
                    ValidTo = DateTime.TryParse(System.Web.HttpContext.Current.Request["ValidTo"], out dt) ? dt : (DateTime?)null,
                    ApprovedBy = Convert.ToInt32(System.Web.HttpContext.Current.Request["ApprovedBy"]),
                    ApprovedOn = DateTime.TryParse(System.Web.HttpContext.Current.Request["ApprovedOn"], out dt) ? dt : (DateTime?)null,
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(CurrentPageContext.Session["UserDetail"])).UserSNo.ToString(),
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(CurrentPageContext.Session["UserDetail"])).UserSNo.ToString()
                };
                listAirline.Add(AirlineAuction);
                object datalist = (object)listAirline;
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

        private void DeleteAirline(string RecordID)
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
