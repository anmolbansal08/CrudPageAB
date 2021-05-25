using CargoFlash.Cargo.WebUI;
using CargoFlash.SoftwareFactory.WebUI;
using CargoFlash.SoftwareFactory.WebUI.Adapters;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using CargoFlash.Cargo.Model;
using CargoFlash.Cargo.Model.Master;

namespace CargoFlash.Cargo.WebUI.Master
{
    public class AccountTargetManagementWebUI : BaseWebUISecureObject
    {
        public AccountTargetManagementWebUI() 
        {
            try
            {
                this.MyModuleID = "Master";
                this.MyAppID = "AccountTarget";
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
                            CreateGrid(container);
                            break;
                        case DisplayModeReadView:
                            BuildFormView(this.DisplayMode, container);
                            break;
                        case DisplayModeEdit:
                            BuildFormView(this.DisplayMode, container);
                            break;
                        case DisplayModeDuplicate:
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
                using (Grid p = new Grid())
                {

                    p.PageName = this.MyPageName;
                    p.PrimaryID = this.MyPrimaryID;
                    p.ModuleName = this.MyModuleID;
                    p.AppsName = this.MyAppID;
                    p.CommandButtonNewText = "New Account Target";
                    p.FormCaptionText = "Account Target";

                    p.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    p.ServiceModuleName = this.MyModuleID;
                    p.Column = new List<GridColumn>();
                    p.Column.Add(new GridColumn { Field = "AirportName", Title = "Airport Name", DataType = GridDataType.String.ToString() });
                    p.Column.Add(new GridColumn { Field = "Name", Title = "Account Name", DataType = GridDataType.String.ToString() });
                    p.Column.Add(new GridColumn { Field = "ProductName", Title = "Product Name", DataType = GridDataType.String.ToString() });
                    p.Column.Add(new GridColumn { Field = "TargetTypeDisplay", Title = "Target Type", DataType = GridDataType.String.ToString() });
                    p.Column.Add(new GridColumn { Field = "TargetName", Title = "Target Name", DataType = GridDataType.String.ToString() });
                    p.Column.Add(new GridColumn { Field = "CurrencyCode", Title = "Currency Code", DataType = GridDataType.String.ToString() });
                    p.Column.Add(new GridColumn { Field = "Active", Title = "Active", DataType = GridDataType.String.ToString() });
                    p.InstantiateIn(Container);
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
                    htmlFormAdapter.HeadingColumnName = "TargetName";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.objFormData = GetRecordAccountTarget();
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(CreateAccountTargetTab(htmlFormAdapter.InstantiateIn()));
                            //container.Append(ReadSPHCSubClassPage(htmlFormAdapter.InstantiateIn()));

                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.objFormData = GetRecordAccountTarget();
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                           // container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append(CreateAccountTargetTab(htmlFormAdapter.InstantiateIn()));
                            //container.Append(CreateSPHCSubClassPage(htmlFormAdapter.InstantiateIn()));
                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.objFormData = GetRecordAccountTarget();
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(CreateAccountTargetTab(htmlFormAdapter.InstantiateIn()));
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                           // container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append(CreateAccountTargetTab(htmlFormAdapter.InstantiateIn()));
                            break;
                        case DisplayModeDelete:
                            htmlFormAdapter.DisplayMode = DisplayModeType.Delete;
                            htmlFormAdapter.objFormData = GetRecordAccountTarget();
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

        public override void DoPostBack()
        {

            try
            {
                //this.OperationMode = "FORMACTION." + CurrentPageContext.Request.Form["Operation"].ToString().ToUpper().Trim();
                this.OperationMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
                switch (OperationMode)
                {
                    case DisplayModeSave:
                        SaveAccountTarget();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            //CurrentPageContext.Server.Transfer(MyPageName + "?" + GetWebURLString("INDEXVIEW", false,2000), false);
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                        break;
                    case DisplayModeSaveAndNew:
                        SaveAccountTarget();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            //CurrentPageContext.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false,2000), false);
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                        break;
                    case DisplayModeUpdate:
                        UpdateAccountTarget(Convert.ToInt32(System.Web.HttpContext.Current.Request.QueryString["RecID"]));
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                        //CurrentPageContext.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false,2001), false);
                        break;
                    case DisplayModeDelete:
                        DeleteAccountTarget(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                        if (string.IsNullOrEmpty(ErrorMessage))
                            //CurrentPageContext.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false,2002), false);
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


        public object GetRecordAccountTarget()
        {
            object AccountTarget = null;

            try
            {

                if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                {
                    AccountTarget AccountTargetList = new AccountTarget();
                    object obj = (object)AccountTargetList;
                    //retrieve Entity from Database according to the record
                    AccountTarget = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID);
                    this.MyRecordID = (System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                }
                else
                {
                    //Error Message: Record not found.
                }

            }

            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            } return AccountTarget;
        }


        private void SaveAccountTarget()
        {
            try
            {
                List<AccountTarget> listAccountTarget = new List<AccountTarget>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var AccountTarget = new AccountTarget
                {
                    SNo = Convert.ToInt32(FormElement["SNo"]),
                    AirportSNo = Convert.ToInt32(FormElement["AirportSNo"]),
                    AccountSNo = Convert.ToInt32(FormElement["AccountSNo"] == string.Empty ? "0" : FormElement["AccountSNo"]),
                    FlightTypeSNo = Convert.ToInt32(FormElement["FlightTypeSNo"] == string.Empty ? "0" : FormElement["FlightTypeSNo"]),
                    ProductSNo = Convert.ToInt32(FormElement["ProductSNo"] == string.Empty ? "0" : FormElement["ProductSNo"]),
                    ProductName = Convert.ToString(FormElement["Text_ProductSNo"]),
                    CurrencySNo = Convert.ToInt32(FormElement["CurrencySno"]),
                    CurrencyCode = Convert.ToString(FormElement["Text_CurrencySNo"]),
                    TargetName = Convert.ToString(FormElement["TargetName"]),
                    //TargetType = FormElement["TargetType"] == "0",
                    TargetType = FormElement["TargetType"] == "0" ? 0 : 1,
                    NoOfFlight=Convert.ToInt32(FormElement["NoOfFlight"]),
                    IsActive = FormElement["IsActive"] == "0" ? true : false,
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo,
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo
                };


                listAccountTarget.Add(AccountTarget);
                object datalist = (object)listAccountTarget;
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
        private void UpdateAccountTarget(int RecordID)
        {

            try
            {
                List<AccountTarget> listAccountTarget = new List<AccountTarget>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var AccountTarget = new AccountTarget
                {
                    SNo = Convert.ToInt32(RecordID),
                    AirportSNo = Convert.ToInt32(FormElement["AirportSNo"]),
                    AccountSNo = Convert.ToInt32(FormElement["AccountSNo"] == string.Empty ? "0" : FormElement["AccountSNo"]),
                    FlightTypeSNo = Convert.ToInt32(FormElement["FlightTypeSNo"] == string.Empty ? "0" : FormElement["FlightTypeSNo"]),
                    ProductSNo = Convert.ToInt32(FormElement["ProductSNo"] == string.Empty ? "0" : FormElement["ProductSNo"]),
                    ProductName = Convert.ToString(FormElement["Text_ProductSNo"]),
                    CurrencySNo = Convert.ToInt32(FormElement["CurrencySno"]),
                    CurrencyCode = Convert.ToString(FormElement["Text_CurrencySNo"]),
                    TargetName = Convert.ToString(FormElement["TargetName"]),
                    //TargetType = FormElement["TargetType"] == "0",
                    TargetType = FormElement["TargetType"]=="0" ? 0 : 1,
                    NoOfFlight = Convert.ToInt32(FormElement["NoOfFlight"]),
                    IsActive = FormElement["IsActive"] == "0",
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo,
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo
                };
                listAccountTarget.Add(AccountTarget);
                object datalist = (object)listAccountTarget;
                DataOperationService(DisplayModeUpdate, datalist, MyModuleID);
                {

                    //ErrorNumer
                    //Error Message
                }
                //}
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            }


        }
        private void DeleteAccountTarget(string RecordID)
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

        /// <summary>
        /// 
        /// </summary>
        /// <param name="container"></param>
        /// <returns></returns>
        private StringBuilder CreateAccountTargetTab(StringBuilder container)
        {
            StringBuilder strBuilder = new StringBuilder();

            strBuilder.Append(@"
        <div id='MainDiv'>
        <div id='ApplicationTabs'>
            <ul>
                <li  id='liAccount' class='k-state-active'>Target Information</li>
                <li id='liAccountTargetCommision'>Target Commission</li>
                <li id='liAccountTargetPenalty'>Target Penalty</li>
            </ul>
            <div id='divTab1'> 
              <span id='spnAccountTargetInformation'>");
            strBuilder.Append(container);
            strBuilder.Append(@"</span> 
            </div>
            <div id='divTab2'>
            <span id='spnAccountTarget'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnAccountTargetSNo' name='hdnAccountTargetSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblAccountTargetCommTrans'></table></span></div><div id='divTab3' ><span id='spnAccountTargetPenalty'><input id='hdnAccountTargetPenaltySNo' name='hdnAccountTargetPenaltySNo' type='hidden' value='" + this.MyRecordID + "'/><table id='tblAccountTargetPenaltyTrans'></table></span></div></div> </div>");
            return strBuilder;

        }

    }
}
