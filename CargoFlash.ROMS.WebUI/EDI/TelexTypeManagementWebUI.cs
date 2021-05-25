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
using CargoFlash.Cargo.Model.EDI;
using System.Collections;
using CargoFlash.Cargo.WebUI;


namespace CargoFlash.Cargo.WebUI.EDI
{
    public class TelexTypeManagementWebUI : BaseWebUISecureObject
    {
      public object GetRecordTelexType()
        {
            object TelexType = null;
            try
            {
                if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                {
                    TelexType TelexTypeList = new TelexType();
                    object obj = (object)TelexTypeList;
                    TelexType = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, this.MyModuleID);
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
            }
            return TelexType;
        }

        public TelexTypeManagementWebUI()
        {

            try
            {
                this.MyPrimaryID = "SNo";
                this.MyModuleID = "EDI";
                this.MyAppID = "TelexType";

            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }
        
        public TelexTypeManagementWebUI(Page PageContext)
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
                this.MyModuleID = "EDI";
                this.MyAppID = "TelexType";
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
                    htmlFormAdapter.HeadingColumnName = "Free Text EDI Message";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.objFormData = GetRecordTelexType();
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.objFormData = GetRecordTelexType();
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.objFormData = GetRecordTelexType();
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());

                            break;
                        case DisplayModeDelete:
                            htmlFormAdapter.DisplayMode = DisplayModeType.Delete;
                            htmlFormAdapter.objFormData = GetRecordTelexType();
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        default:
                            break;
                    }
                    container.Append(@"<input type='button' id='SendMessage' value='Send Message'>");
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
                    //Set the display Mode form the URL QuesyString.
                    this.DisplayMode = "FORMACTION." + System.Web.HttpContext.Current.Request.QueryString["FormAction"].ToString().ToUpper().Trim();

                    //Match the display Mode of the form.
                    switch (this.DisplayMode)
                    {
                        case DisplayModeIndexView:
                       //     CreateGrid(container);
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
                        case DisplayModeDuplicate:
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
                       // SaveTelexType();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                        break;
                    case DisplayModeUpdate:
                    //    UpdateTelexType(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                        break;
                    case DisplayModeSaveAndNew:
                    //    SaveTelexType();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                        break;

                    case DisplayModeDelete:
                    //    DeleteTelexType(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2002), false);
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

        //private void SaveTelexType()
        //{
        //    try
        //    {
        //        List<TelexType> listTelexType = new List<TelexType>();
        //        var FormElement = System.Web.HttpContext.Current.Request.Form;
        //        var TelexType = new TelexType
        //        {
        //            SitaAddress = FormElement["Text_SitaAddress"].ToUpper(),
        //            EmailAddress = FormElement["Text_EmailAddress"].ToUpper(),
        //            TeleTextMessage = FormElement["TeleTextMessage"].ToUpper()
        //        };
        //        listTelexType.Add(TelexType);
        //        object datalist = (object)listTelexType;
        //        DataOperationService(DisplayModeSave, datalist, MyModuleID);
        //    }
        //    catch (Exception ex)
        //    {
        //        ApplicationWebUI applicationWebUI = new ApplicationWebUI();
        //        applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

        //    }

        //}
        //private StringBuilder CreateGrid(StringBuilder Container)
        //{
        //    try
        //    {
        //        using (Grid g = new Grid())
        //        {
        //            g.CommandButtonNewText = "New TelexType";
        //            g.FormCaptionText = "TelexType";
        //            g.PrimaryID = this.MyPrimaryID;
        //            g.PageName = this.MyPageName;
        //            g.ModuleName = this.MyModuleID;
        //            g.AppsName = this.MyAppID;
        //            g.ServiceModuleName = this.MyModuleID;
        //            g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
        //            g.Column = new List<GridColumn>();

        //            g.Column.Add(new GridColumn { Field = "FName", Title = "First Name", DataType = GridDataType.String.ToString() });
        //            g.Column.Add(new GridColumn { Field = "LName", Title = "Last Name", DataType = GridDataType.String.ToString() });
        //            g.Column.Add(new GridColumn { Field = "FatherName", Title = "Father's Name", DataType = GridDataType.String.ToString() });
        //            g.Column.Add(new GridColumn { Field = "Mobile", Title = "Mobile", DataType = GridDataType.String.ToString() });
        //            g.Column.Add(new GridColumn { Field = "DOB", Title = "DOB", DataType = GridDataType.Date.ToString() });
        //            g.Column.Add(new GridColumn { Field = "Text_Nationality", Title = "Nationality", DataType = GridDataType.String.ToString().ToUpper() });
        //            g.Column.Add(new GridColumn { Field = "Text_Country", Title = "Country", DataType = GridDataType.String.ToString().ToUpper() });
        //            g.Column.Add(new GridColumn { Field = "Gender", Title = "Gender", DataType = GridDataType.String.ToString().ToUpper() });
        //            g.InstantiateIn(Container);
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        ApplicationWebUI applicationWebUI = new ApplicationWebUI();
        //        applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
        //        ErrorMessage = applicationWebUI.ErrorMessage;
        //    }
        //    return Container;
        //}

        

        //private void UpdateTelexType(string RecordID)
        //{
        //    try
        //    {
        //        List<TelexType> listTelexType = new List<TelexType>();
        //        var FormElement = System.Web.HttpContext.Current.Request.Form;
        //        var TelexType = new TelexType
        //        {
        //            SNo = Convert.ToInt32(RecordID),
        //            FName = FormElement["FName"],
        //            LName = FormElement["LName"],
        //            FatherName = FormElement["FatherName"],
        //            Mobile = FormElement["Mobile"],  //FormElement["Text_CountrySNo"],
        //            //CountryName = FormElement["Text_CountrySNo"].Split('-')[1],// FormElement["Text_CountrySNo"],
        //            DOB = DateTime.Parse(FormElement["DOB"].ToString()),
        //            Nationality = Convert.ToInt32(FormElement["Nationality"]),
        //            Text_Nationality = FormElement["Text_Nationality"].ToString(),
        //            //  IsGender = (FormElement["IsGender"])=="1"
        //            IsGender = Convert.ToInt32(FormElement["IsGender"]) == 0 ? 0 : 1,
        //            Country = FormElement["Country"].ToString(),
        //            Text_Country = FormElement["Text_Country"].ToString(),
        //        };
        //        listTelexType.Add(TelexType);
        //        object datalist = (object)listTelexType;
        //        DataOperationService(DisplayModeUpdate, datalist, MyModuleID);
        //        {
        //            //ErrorNumer
        //            //Error Message
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        ApplicationWebUI applicationWebUI = new ApplicationWebUI();
        //        applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
        //    }

        //}

        //private void DeleteTelexType(string RecordID)
        //{
        //    try
        //    {
        //        List<string> listID = new List<string>();
        //        listID.Add(RecordID);
        //        listID.Add(MyUserID.ToString());
        //        object recordID = (object)listID;
        //        DataOperationService(DisplayModeDelete, recordID, MyModuleID);              
        //    }
        //    catch (Exception ex)
        //    {
        //        ApplicationWebUI applicationWebUI = new ApplicationWebUI();
        //        applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
        //    }
        //}

        //private void DeleteTelexTypeSlab(string RecordID)
        //{
        //    try
        //    {
        //        List<string> listID = new List<string>();
        //        listID.Add(RecordID);
        //        listID.Add(MyUserID.ToString());
        //        object recordID = (object)listID;
        //        DataOperationService(DisplayModeDelete, recordID, MyModuleID);
        //    }
        //    catch (Exception ex)
        //    {
        //        ApplicationWebUI applicationWebUI = new ApplicationWebUI();
        //        applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
        //    }
        //}
    }
}
