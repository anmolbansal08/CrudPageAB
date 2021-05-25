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
using CargoFlash.Cargo.Business;

namespace CargoFlash.Cargo.WebUI.Master
{
    public class CreditLimitUpdateManagementWebUI : BaseWebUISecureObject
    {
        public object GetCreditLimitUpdate()
        {
            object CreditLimitUpdate = null;
            try
            {
                if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                {
                    AccountGroup AccountGroupList = new AccountGroup();
                    object obj = (object)AccountGroupList;
                    CreditLimitUpdate = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, this.MyModuleID);
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

            } return CreditLimitUpdate;
        }

        public CreditLimitUpdateManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Master";
                this.MyAppID = "CreditLimitUpdate";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }

        public CreditLimitUpdateManagementWebUI(Page PageContext)
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
                this.MyAppID = "CreditLimitUpdate";
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
                    htmlFormAdapter.HeadingColumnName = "Name";
                    switch (DisplayMode)
                    {
                        //case DisplayModeReadView:
                        //    htmlFormAdapter.objFormData = GetAccountGroup();
                        //    htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                        //    htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                        //    htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                        //    htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                        //    htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                        //    container.Append(htmlFormAdapter.InstantiateIn());                            
                        //    break;
                        //case DisplayModeDuplicate:
                        //    htmlFormAdapter.objFormData = GetAccountGroup();
                        //    htmlFormAdapter.DisplayMode = DisplayModeType.New;
                        //    htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                        //    container.Append(htmlFormAdapter.InstantiateIn());
                        //    break;
                        //case DisplayModeEdit:
                        //    htmlFormAdapter.objFormData = GetAccountGroup();
                        //    htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                        //    htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                        //    container.Append(htmlFormAdapter.InstantiateIn());
                        //    break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("NEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                            //case DisplayModeDelete:
                            //    htmlFormAdapter.objFormData = GetAccountGroup();
                            //    htmlFormAdapter.DisplayMode = DisplayModeType.Delete;
                            //    htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            //    container.Append(htmlFormAdapter.InstantiateIn());
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
                if (System.Web.HttpContext.Current.Request.QueryString["FormAction"] != null)
                {

                    this.DisplayMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
                    //Match the display Mode of the form.
                    switch (this.DisplayMode)
                    {
                        //case DisplayModeIndexView:
                        //    CreateGrid(container);
                        //    break;
                        //case DisplayModeDuplicate:
                        //    BuildFormView(this.DisplayMode, container);
                        //    break;
                        //case DisplayModeReadView:
                        //    BuildFormView(this.DisplayMode, container);
                        //    break;
                        //case DisplayModeEdit:
                        //    BuildFormView(this.DisplayMode, container);
                        //    break;
                        case DisplayModeNew:
                            BuildFormView(this.DisplayMode, container);
                            break;
                        //case DisplayModeDelete:
                        //    BuildFormView(this.DisplayMode, container);
                        //    break;
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
                    case DisplayModeUpdate:
                        SaveCreditLimit();
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

        public void SaveCreditLimit()
        {
            try
            {
                List<CreditLimitUpdate> listCreditLimitUpdate = new List<CreditLimitUpdate>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var CreditLimitUpdate = new CreditLimitUpdate
                {
                    Agent = Convert.ToInt32(FormElement["Agent"]),//It is AccountSNo
                    UpdateType = Convert.ToInt32(FormElement["UpdateType"].ToString()) == 0 ? false : true,
                    ApprovedBy = Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo),
                    TopUpCreditLimit = Convert.ToDecimal(FormElement["TopUpCreditLimit"]),
                    Remarks = FormElement["Remarks"].ToString(),
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo,
                    IsRevert = FormElement["IsRevert"] == "on" ? true : false
                };
                listCreditLimitUpdate.Add(CreditLimitUpdate);
                object datalist = (object)listCreditLimitUpdate;
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
    }
}
