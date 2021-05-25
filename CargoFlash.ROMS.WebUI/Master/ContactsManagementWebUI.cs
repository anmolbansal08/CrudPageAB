using CargoFlash.Cargo.WebUI;
using CargoFlash.SoftwareFactory.WebUI;
using CargoFlash.SoftwareFactory.WebUI.Adapters;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI;
using CargoFlash.Cargo.Model.Master;

namespace CargoFlash.Cargo.WebUI.Master
{
    public class ContactsManagementWebUI : BaseWebUISecureObject
    {

        public ContactsManagementWebUI()
        {
            try
            {
                this.MyPrimaryID = "SNo";
                this.MyModuleID = "Master";
                this.MyAppID = "Contacts";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }

        /// <summary>
        /// Set context of the page(Form) i.e. bind Module ID,App ID
        /// </summary>
        /// <param name="PageContext"></param>
        
        public ContactsManagementWebUI(Page PageContext)
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
                this.MyModuleID = "Master";
                this.MyAppID = "Contacts";
            }

            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }
        
        /// <summary>
        /// Generate AccountType web page from XML
        /// e.g from ~/HtmlForm/WebFormDefinitionAccountType.xml
        /// </summary>
        /// <param name="container"></param>
        /// 
       
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
                            strContent = CreateGrid(container);
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
       
        /// <summary>
        /// Generate Grid the for the page
        /// as per the columns of entity supplied
        /// </summary>
        /// <param name="Container"></param>
        /// 
        
        private StringBuilder CreateGrid(StringBuilder Container)
        {
            try
            {
                using (Grid g = new Grid())
                {
                    g.CommandButtonNewText = "New Contact";
                    g.FormCaptionText = "Contact";
                    g.PrimaryID = this.MyPrimaryID;
                    g.PageName = this.MyPageName;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.ServiceModuleName = this.MyModuleID;
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "ContactsTypeName", Title = "Contacts Type", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "ContactsTypeDis", Title = "Contacts Type Name", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Name", Title = "Name", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "DepartmentName", Title = "Department", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "PersonName", Title = "Person Name", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Email", Title = "Email ID", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Mobile", Title = "Mobile No", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Phone", Title = "Phone No", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Primary", Title = "Primary", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Active", Title = "Active", DataType = GridDataType.String.ToString() });
                    
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
        /// Generate form layout
        /// </summary>
        /// <param name="DisplayMode">Identify which operation has to be performed viz(Read,Write,Update,Delete)</param>
        /// <param name="container">Control object</param>
       
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
                        case DisplayModeReadView:
                            htmlFormAdapter.objFormData = GetRecordContacts();
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.objFormData = GetRecordContacts();
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.objFormData = GetRecordContacts();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            //container.Append("<table visibility='false'><tr><td><input id='hdnContactSNo' name='hdnContactSNo' type='hidden' value='" + this.MyRecordID + "'/></td></tr></table>");
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeDelete:
                            htmlFormAdapter.objFormData = GetRecordContacts();
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
        
        public override void DoPostBack()
        {

            try
            {

                this.OperationMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
                switch (OperationMode)
                {
                    case DisplayModeSave:
                        SaveContacts();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                        break;
                    case DisplayModeSaveAndNew:
                        SaveContacts();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                        break;
                    case DisplayModeUpdate:
                        UpdateContacts(Convert.ToInt32(System.Web.HttpContext.Current.Request.QueryString["RecID"]));
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                        break;
                    case DisplayModeDelete:
                        DeleteContacts(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
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

        public object GetRecordContacts()
        {
            object Contacts = null;
            try
            {
                if (!string.IsNullOrEmpty(HttpContext.Current.Request.QueryString["RecID"]))
                {
                    Contacts ContactsList = new Contacts();
                    object obj = (object)ContactsList;
                    //retrieve Entity from Database according to the record
                    Contacts = DataGetRecordService(HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID);
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

            } return Contacts;
        }
        
        private void SaveContacts()
        {
            try
            {
                List<Contacts> listContacts = new List<Contacts>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var Contacts = new Contacts
                {

                    ContactsType= Convert.ToInt32(FormElement["ContactsType"].ToString() == string.Empty ? "0" : FormElement["ContactsType"].ToString()),
                    ContactTypeSNo = Convert.ToInt32(FormElement["ContactTypeSNo"].ToString() == string.Empty ? "0" : FormElement["ContactTypeSNo"].ToString()),
                    Name=Convert.ToString(FormElement["Name"].ToString()),
                    DepartmentSNo = Convert.ToInt32(FormElement["DepartmentSNo"].ToString() == string.Empty ? "0" : FormElement["DepartmentSNo"].ToString()),
                    Text_DepartmentSNo = Convert.ToString(FormElement["Text_DepartmentSNo"].ToString() == string.Empty ? "" : FormElement["Text_DepartmentSNo"].ToString()),
                    DepartmentName = Convert.ToString(FormElement["Text_DepartmentSNo"].ToString() == string.Empty ? "" : FormElement["Text_DepartmentSNo"].ToString()),
                    PersonName = Convert.ToString(FormElement["PersonName"].ToString()),
                    Email = Convert.ToString(FormElement["Email"].ToString()),
                    IsPrimary = FormElement["IsPrimary"] == "0",
                    Mobile = Convert.ToString(FormElement["Mobile"].ToString() == string.Empty ? "" : FormElement["Mobile"].ToString()),
                    Phone = Convert.ToString(FormElement["Phone"].ToString() == string.Empty ? "" : FormElement["Phone"].ToString()),
                    Address = Convert.ToString(FormElement["Address"].ToString() == string.Empty ? "" : FormElement["Address"].ToString()),
                    CountryCode = Convert.ToString(FormElement["CountryCode"].ToString() == string.Empty ? "" : FormElement["CountryCode"].ToString()),
                    Text_CountryCode = Convert.ToString(FormElement["Text_CountryCode"].ToString() == string.Empty ? "" : FormElement["Text_CountryCode"].ToString()),
                    CitySNo = Convert.ToInt32(FormElement["CitySNo"].ToString() == string.Empty ? "0" : FormElement["CitySNo"].ToString()),
                    Text_CitySNo = Convert.ToString(FormElement["Text_CitySNo"].ToString() == string.Empty ? "" : FormElement["Text_CitySNo"].ToString()).ToUpper(),
                    CityCode = Convert.ToString(FormElement["Text_CitySNo"].ToString() == string.Empty ? "" : FormElement["Text_CitySNo"].ToString()).ToUpper(),
                    PostalCode = Convert.ToString(FormElement["PostalCode"].ToString() == string.Empty ? "" : FormElement["PostalCode"].ToString()),
                    IsActive = FormElement["IsActive"] == "0",
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()
                };


                listContacts.Add(Contacts);
                object datalist = (object)listContacts;
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

        private void UpdateContacts(int RecordID)
        {

            try
            {
                List<Contacts> listContacts = new List<Contacts>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var Contacts = new Contacts
                {
                    SNo = Convert.ToInt32(RecordID),
                    ContactsType = Convert.ToInt32(FormElement["ContactsType"].ToString() == string.Empty ? "0" : FormElement["ContactsType"].ToString()),
                    ContactTypeSNo = Convert.ToInt32(FormElement["ContactTypeSNo"].ToString() == string.Empty ? "0" : FormElement["ContactTypeSNo"].ToString()),
                    Name = Convert.ToString(FormElement["Name"].ToString()),
                    DepartmentSNo = Convert.ToInt32(FormElement["DepartmentSNo"].ToString() == string.Empty ? "0" : FormElement["DepartmentSNo"].ToString()),
                    Text_DepartmentSNo = Convert.ToString(FormElement["Text_DepartmentSNo"].ToString() == string.Empty ? "" : FormElement["Text_DepartmentSNo"].ToString()),
                    DepartmentName = Convert.ToString(FormElement["Text_DepartmentSNo"].ToString() == string.Empty ? "" : FormElement["Text_DepartmentSNo"].ToString()),
                    PersonName = Convert.ToString(FormElement["PersonName"].ToString()),
                    Email = Convert.ToString(FormElement["Email"].ToString()),
                    IsPrimary = FormElement["IsPrimary"] == "0",
                    Mobile = Convert.ToString(FormElement["Mobile"].ToString() == string.Empty ? "" : FormElement["Mobile"].ToString()),
                    Phone = Convert.ToString(FormElement["Phone"].ToString() == string.Empty ? "" : FormElement["Phone"].ToString()),
                    Address = Convert.ToString(FormElement["Address"].ToString() == string.Empty ? "" : FormElement["Address"].ToString()),
                    CountryCode = Convert.ToString(FormElement["CountryCode"].ToString() == string.Empty ? "" : FormElement["CountryCode"].ToString()),
                    Text_CountryCode = Convert.ToString(FormElement["Text_CountryCode"].ToString() == string.Empty ? "" : FormElement["Text_CountryCode"].ToString()),
                    CitySNo = Convert.ToInt32(FormElement["CitySNo"].ToString() == string.Empty ? "0" : FormElement["CitySNo"].ToString()),
                    Text_CitySNo = Convert.ToString(FormElement["Text_CitySNo"].ToString() == string.Empty ? "" : FormElement["Text_CitySNo"].ToString()).ToUpper(),
                    CityCode = Convert.ToString(FormElement["Text_CitySNo"].ToString() == string.Empty ? "" : FormElement["Text_CitySNo"].ToString()).ToUpper(),
                    PostalCode = Convert.ToString(FormElement["PostalCode"].ToString() == string.Empty ? "" : FormElement["PostalCode"].ToString()),
                    IsActive = FormElement["IsActive"] == "0",
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()
                };
                listContacts.Add(Contacts);
                object datalist = (object)listContacts;
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

        private void DeleteContacts(string RecordID)
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
