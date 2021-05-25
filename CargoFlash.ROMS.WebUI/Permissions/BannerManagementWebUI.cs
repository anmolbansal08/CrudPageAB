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
using CargoFlash.Cargo.Model.Permissions;
using System.Collections;
using CargoFlash.Cargo.Business;

//namespace CargoFlash.Cargo.WebUI.Permissions
//{
//   public class BannerManagementWebUI : BaseWebUISecureObject
//    {
//        public BannerManagementWebUI(Page PageContext)
//        {
//            try
//            {
//                if (this.SetCurrentPageContext(PageContext))
//                {
//                    this.ErrorNumber = 0;
//                    this.ErrorMessage = "";
//                }
//                this.MyPageName = "Default.cshtml";
//                this.MyModuleID = "Permissions";
//                this.MyAppID = "Banner";
//                this.MyPrimaryID = "SNo";
//            }


//            catch (Exception ex)
//            {
//                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
//                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
//                ErrorMessage = applicationWebUI.ErrorMessage;

//            }
//        }
//        public BannerManagementWebUI()
//        {
//            try
//            {
//                this.MyModuleID = "Permissions";
//                this.MyAppID = "Banner";
//                this.MyPrimaryID = "SNo";

//            }
//            catch (Exception ex)
//            {
//                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
//                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
//                ErrorMessage = applicationWebUI.ErrorMessage;
//            }



//        }

//        /// <summary>
//        /// Generate form layout
//        /// </summary>
//        /// <param name="DisplayMode">Identify which operation has to be performed i.e(Read,Write,Update,Delete)</param>
//        /// <param name="container">Control Object</param>
//        public override void BuildFormView(string DisplayMode, StringBuilder container)
//        {
//            try
//            {
//                using (HtmlFormAdapter htmlFormAdapter = new HtmlFormAdapter(MyModuleID))
//                {
//                    htmlFormAdapter.CurrentPage = this.CurrentPageContext;
//                    htmlFormAdapter.HeadingColumnName = "Banner";
//                    switch (DisplayMode)
//                    {
//                        //case DisplayModeReadView:
//                        //    htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
//                        //    htmlFormAdapter.objFormData = GetRecordBanner();
//                        //    htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
//                        //    htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
//                        //    htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
//                        //    htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
//                        //    container.Append(htmlFormAdapter.InstantiateIn());

//                        //    break;
//                        case DisplayModeDuplicate:
//                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
//                            htmlFormAdapter.objFormData = GetRecordBanner();
//                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
//                            container.Append(htmlFormAdapter.InstantiateIn());
//                            break;
//                        //case DisplayModeEdit:
//                        //    htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
//                        //    htmlFormAdapter.objFormData = GetRecordBanner();
//                        //    htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
//                        //    container.Append(htmlFormAdapter.InstantiateIn());
//                        //    break;
//                        case DisplayModeNew:
//                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
//                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
//                            container.Append(htmlFormAdapter.InstantiateIn());
//                            break;
//                        //case DisplayModeDelete:
//                        //    htmlFormAdapter.DisplayMode = DisplayModeType.Delete;
//                        //    htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
//                        //    htmlFormAdapter.objFormData = GetRecordBanner();
//                        //    container.Append(htmlFormAdapter.InstantiateIn());
//                        //    break;
//                        default:
//                            break;
//                    }
//                }
//            }
//            catch (Exception ex)
//            {
//                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
//                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

//            }
//        }

//        /// <summary>
//        /// Generate ULDSLA web page from XML
//        /// </summary>
//        /// <param name="container"></param>
//        public StringBuilder CreateWebForm(StringBuilder container)
//        {
//            StringBuilder strContent = new StringBuilder();
//            try
//            {
//                if (System.Web.HttpContext.Current.Request.QueryString["FormAction"] != null)
//                {
//                    //Set the display Mode form the URL QuesyString.
//                    //this.DisplayMode = "FORMACTION." + System.Web.HttpContext.Current.Request.QueryString["FormAction"].ToString().ToUpper().Trim();
//                    this.DisplayMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
//                    //Match the display Mode of the form.
//                    switch (this.DisplayMode)
//                    {
//                        case DisplayModeIndexView:
//                            CreateGrid(container);
//                            break;
//                        case DisplayModeReadView:
//                            BuildFormView(this.DisplayMode, container);
//                            break;
//                        case DisplayModeEdit:
//                            BuildFormView(this.DisplayMode, container);
//                            break;
//                        case DisplayModeDuplicate:
//                            BuildFormView(this.DisplayMode, container);
//                            break;
//                        case DisplayModeNew:
//                            BuildFormView(this.DisplayMode, container);
//                            break;
//                        case DisplayModeDelete:
//                            BuildFormView(this.DisplayMode, container);
//                            break;
//                        default:
//                            break;
//                    }
//                }
//            }
//            catch (Exception ex)
//            {
//                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
//                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

//            }
//            return container;



//        }

//        /// <summary>
//        /// Postback Method to GET or POST 
//        /// to set Mode/Context of the page
//        /// </summary>
//        public override void DoPostBack()
//        {
//            try
//            {
//                this.OperationMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
//                switch (OperationMode)
//                {
//                    case DisplayModeSave:
//                        SaveBanner();
//                        if (string.IsNullOrEmpty(ErrorMessage))
//                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
//                        break;
//                    case DisplayModeSaveAndNew:
//                        SaveBanner();
//                        if (string.IsNullOrEmpty(ErrorMessage))
//                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
//                        break;
//                        //case DisplayModeUpdate:
//                        //    UpdateULDSLA(Convert.ToInt32(System.Web.HttpContext.Current.Request.QueryString["RecID"]));
//                        //    if (string.IsNullOrEmpty(ErrorMessage))
//                        //        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
//                        //    break;

//                        //case DisplayModeDelete:
//                        //    DeleteULDSLA(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
//                        //    if (string.IsNullOrEmpty(ErrorMessage))
//                        //        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2002), false);
//                        //    break;
//                }
//            }
//            catch (Exception ex)
//            {
//                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
//                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

//            }
//        }
//        /// <summary>
//        /// Generate Grid for the page as per the columns of the entity supplied
//        /// </summary>
//        /// <param name="Container"></param>
//        private void CreateGrid(StringBuilder Container)
//        {
//            try
//            {
//                using (Grid g = new Grid())
//                {
//                    g.PrimaryID = this.MyPrimaryID;
//                    g.PageName = this.MyPageName;
//                    g.ModuleName = this.MyModuleID;
//                    g.AppsName = this.MyAppID;
//                    g.CommandButtonNewText = "New Banner";
//                    g.FormCaptionText = "Banner";
//                    g.ServiceModuleName = this.MyModuleID;
//                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
//                    g.Column = new List<GridColumn>();
//                    g.Column.Add(new GridColumn { Field = "Text_BannerType", Title = "Banner Type", DataType = GridDataType.String.ToString().ToUpper() });
//                    g.Column.Add(new GridColumn { Field = "Title", Title = "Title", DataType = GridDataType.String.ToString().ToUpper() });
//                    g.Column.Add(new GridColumn { Field = "BannerSubject", Title = "Banner Subject", DataType = GridDataType.String.ToString() });
//                    g.Column.Add(new GridColumn { Field = "Active", Title = "Active", DataType = GridDataType.String.ToString() });
//                    g.InstantiateIn(Container);

//                }
//            }
//            catch (Exception ex)
//            {
//                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
//                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

//            }
//        }

//        /// <summary>
//        /// Insert new ULDSLA record into the database
//        /// Retrieve information from webform and store the same into modal object
//        /// call webservice to save that data into the database
//        /// </summary>
//        private void SaveBanner()
//        {
//            try
//            {
//                List<Banner> listBanner = new List<Banner>();
//                var FormElement = System.Web.HttpContext.Current.Request.Form;
//                string SNo = string.Empty;
//                SNo = Convert.ToString(FormElement["SNo"].ToString());
//                if (!string.IsNullOrEmpty(SNo))
//                    SNo = SNo.Split('-')[0].ToString();

//                var Banner = new Banner
//                {

//                    SNo = Convert.ToInt32(SNo),
//                    Title = Convert.ToString(FormElement["Title"].ToString()),
//                    BannerSubject = Convert.ToString(FormElement["BannerSubject"].ToString()),
//                    //BannerType = Convert.ToString(FormElement["BannerSno"].ToString()),
//                    BannerType = Convert.ToBoolean(FormElement["BannerType"] == "0"),
//                    BannerDescription = Convert.ToString(FormElement["BannerDescription"].ToString()),
//                    Isactive = Convert.ToBoolean(FormElement["IsActive"] == "0"),
//                    UploadDocument = Convert.ToString(FormElement["UploadDocument"].ToString()),


//                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
//                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
//                    //ManHrsCost = Convert.ToDecimal(string.IsNullOrEmpty(FormElement["ManHrsCost"]) == true ? "0" : FormElement["ManHrsCost"])


//                };
//                listBanner.Add(Banner);
//                object datalist = (object)listBanner;
//                DataOperationService(DisplayModeSave, datalist, MyModuleID);
//                {
//                    //ErrorNumer
//                    //Error Message
//                }
//            }
//            catch (Exception ex)
//            {
//                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
//                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

//            }
//        }


//        public object GetRecordBanner()
//        {
//            object Banner = null;
//            try
//            {
//                if (!DisplayMode.ToLower().Contains("new"))
//                {
//                    if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
//                    {
//                        Banner gpList = new Banner();
//                        object obj = (object)gpList;
//                        Banner = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID);
//                        this.MyRecordID = (System.Web.HttpContext.Current.Request.QueryString["RecID"]);
//                    }
//                    else
//                    {
//                        //Error Messgae: Record not found.
//                    }

//                }

//            }
//            catch (Exception ex)
//            {
//                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
//                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

//            }
//            return Banner;
//        }




//    }
//}


//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Web.UI;
//using System.Data;
//using System.Net;
//using System.IO;
//using System.Reflection;
//using System.Runtime.Serialization;
//using CargoFlash.SoftwareFactory.WebUI;
//using CargoFlash.SoftwareFactory.WebUI.Adapters;
//using CargoFlash.SoftwareFactory.WebUI.Controls;
//using CargoFlash.nGenDTD.Model;
//using System.Collections;
//using CargoFlash.nGenDTD.Model.Master;
//using System.Configuration;
//using CargoFlash.nGenDTD.Business;
//using CargoFlash.nGenDTD.WebUI.CustomerService;


namespace CargoFlash.Cargo.WebUI.Permissions
{
    /// <summary>
    /// This is Banner Management Class.
    /// Created By : devendra
    /// Created On : 15 JAN 2019   
    /// </summary>
    public class BannerManagementWebUI : BaseWebUISecureObject
    {
        /// <summary>
        /// Default Constructor and Initialized Variables.
        /// </summary>
        /// <param name="PageContext"></param>       
        public BannerManagementWebUI(Page PageContext)
        {
            if (this.SetCurrentPageContext(PageContext))
            {
                this.ErrorNumber = 0;
                this.ErrorMessage = "";
            }
            this.MyPageName = "Default.cshtml";
            this.MyModuleID = "Permissions";
            this.MyAppID = "Banner";
            //this.MyUserID = int.Parse(System.Web.HttpContext.Current.Session["LoginSNo"].ToString().ToUpper());
        }
        public BannerManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Permissions";
                this.MyAppID = "Banner";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }

        /// <summary>
        /// Create Form as per given Display Mode like Read, Edit, New and Delete
        /// Created By :devendra
        /// Created On : 15 JAN 2019
        /// </summary>
        /// <param name="DisplayMode"></param>
        /// <param name="container"></param> 
        public override void BuildFormView(string DisplayMode, StringBuilder container)
        {
            using (HtmlFormAdapter htmlFormAdapter = new HtmlFormAdapter(MyModuleID))
            {
                htmlFormAdapter.CurrentPage = this.CurrentPageContext;
                htmlFormAdapter.HeadingColumnName = "Title";
                switch (DisplayMode)
                {
                    case DisplayModeReadView:
                        htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                        htmlFormAdapter.objFormData = GetBannerRecord();
                        htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                        htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                        htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                        htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                        container.Append(htmlFormAdapter.InstantiateIn());
                        break;
                    case DisplayModeDuplicate:
                        htmlFormAdapter.DisplayMode = DisplayModeType.New;
                        htmlFormAdapter.objFormData = GetBannerRecord();
                        htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                        container.Append(htmlFormAdapter.InstantiateIn());
                        break;
                    case DisplayModeEdit:
                        htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                        htmlFormAdapter.objFormData = GetBannerRecord();
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
                        htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                        htmlFormAdapter.objFormData = GetBannerRecord();
                        container.Append(htmlFormAdapter.InstantiateIn());
                        break;
                    default:
                        break;
                }
            }
        }

        /// <summary>
        /// To Create form as per Requested Form Action
        /// Created By : devendra
        /// Created On : 15 JAN 2019
        /// <param name="container"></param>        
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

        /// <summary>
        /// Validated/ Save / Update and Delete Record as per requested form action.
        /// Created By : devendra
        /// Created On : 15 JAN 2019
        /// </summary>
        public override void DoPostBack()
        {
            this.OperationMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
            switch (OperationMode)
            {
                case DisplayModeSave:
                    if (string.IsNullOrEmpty(CheckImage()))
                    {
                        SaveBanner();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                    }
                    else
                    {
                        this.ErrorMessage = "You can not upload more than 2 MB file.";
                    }
                    break;
                //case DisplayModeSave:                    
                //    SaveBanner();
                //    if (string.IsNullOrEmpty(ErrorMessage))
                //        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                //    break;
                case DisplayModeSaveAndNew:
                    SaveBanner();
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                    break;
                case DisplayModeUpdate:
                    UpdateBanner(Convert.ToInt32(System.Web.HttpContext.Current.Request.QueryString["RecID"]));
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                    break;
                case DisplayModeDelete:
                    DeleteBanner(Convert.ToInt32(System.Web.HttpContext.Current.Request.QueryString["RecID"]));
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2002), false);
                    break;
            }
        }

        /// <summary>
        /// create Banner list
        /// Created By : devendra
        /// Created On : 15 JAN 2019
        /// </summary>
        /// <param name="Container"></param>
        private void CreateGrid(StringBuilder Container)
        {
            using (Grid g = new Grid())
            {
                g.PrimaryID = this.MyPrimaryID;
                g.PageName = this.MyPageName;
                g.ModuleName = this.MyModuleID;
                g.AppsName = this.MyAppID;
                g.ServiceModuleName = this.MyModuleID;
                g.UserID = this.MyUserID;
                g.CommandButtonNewText = "New Banner";
                g.FormCaptionText = "Banner";
                g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                g.Column = new List<GridColumn>();
                g.Column.Add(new GridColumn { Field = "BannerType", Title = "Banner Type", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "Title", Title = "Title", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "BannerSubject", Title = "Banner Subject", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "Active", Title = "Active", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "CreatedUser", Title = "Created By", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "UpdatedUser", Title = "Updated By", DataType = GridDataType.String.ToString() });
                g.InstantiateIn(Container);
            }
        }

        /// <summary>
        /// Save Banner
        /// Created By : DEvendra
        /// Created On : 15 feb 2019
        /// </summary>
        private void SaveBanner()
        {
            List<Banner> listBanner = new List<Banner>();
            var FormElement = System.Web.HttpContext.Current.Request.Form;
            string lUploadDocument = SaveImage();
            //ComplaintManagementWebUI da = new ComplaintManagementWebUI(null);
            //string lUploadDocument = da.SaveImage("Banner");
            var department = new Banner
            {
                SNo = 0,
                BannerType = (Convert.ToInt32(FormElement["BannerType"]) == 0 || Convert.ToInt32(FormElement["BannerType"]) == 1) ? Convert.ToInt32(FormElement["BannerType"]) : (int?)null,
                Title = FormElement["Title"].ToString().ToUpper(),
                BannerSubject = FormElement["BannerSubject"].ToString().ToUpper(),
                BannerDescription = FormElement["BannerDescription"].ToString().ToUpper(),
                CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo,
                UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo,
                UploadDocument = lUploadDocument,
                ValidFrom = Convert.ToDateTime(FormElement["ValidFrom"]),
                ValidTo = Convert.ToDateTime(FormElement["ValidTo"]),
            };
            listBanner.Add(department);
            object datalist = (object)listBanner;
            DataOperationService(DisplayModeSave, datalist, MyModuleID);
        }

        /// <summary>
        /// Update Banner as per given recordid
        /// Created By : devendra
        /// Created On : 15 JAN 2019
        /// </summary>
        private void UpdateBanner(int RecordID)
        {
            List<Banner> listBanner = new List<Banner>();
            var FormElement = System.Web.HttpContext.Current.Request.Form;
            string lUploadDocument = SaveImage();
            //ComplaintManagementWebUI da = new ComplaintManagementWebUI(null);
            //string lUploadDocument = da.SaveImage("Banner");

            string lUploadDocument2 = FormElement["UploadDocumentFile"].ToString().ToUpper();
            if (lUploadDocument == "")
            {
                lUploadDocument = lUploadDocument2;
            }
            else
            {
                lUploadDocument2 = lUploadDocument;
            }
            var department = new Banner
            {
                SNo = RecordID,
                BannerType = Convert.ToInt32(FormElement["BannerType"].ToUpper()),
                Title = FormElement["Title"].ToString().ToUpper(),
                BannerSubject = FormElement["BannerSubject"].ToString().ToUpper(),
                BannerDescription = FormElement["BannerDescription"].ToString().ToUpper(),
                IsActive = FormElement["IsActive"] == "0",
                UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo,
                UploadDocument = lUploadDocument,
                ValidFrom = Convert.ToDateTime(FormElement["ValidFrom"]),
                ValidTo = Convert.ToDateTime(FormElement["ValidTo"]),
            };
            listBanner.Add(department);
            object datalist = (object)listBanner;
            DataOperationService(DisplayModeUpdate, datalist, MyModuleID);
        }

        /// <summary>
        /// Delete Banner as per given record id
        /// Created By : devendra
        /// Created On : 15 JAN 2019
        /// </summary>
        /// <param name="RecordID"></param>        
        private void DeleteBanner(int RecordID)
        {
            List<string> listID = new List<string>();
            listID.Add(RecordID.ToString());
            listID.Add(MyUserID.ToString());
            object recordID = (object)listID;
            DataOperationService(DisplayModeDelete, recordID, MyModuleID);

        }

        /// <summary>
        /// Get Banner Record as per given record id
        /// Created By : devendra
        /// Created On : 15 JAN 2019
        /// </summary>
        /// <param name="RecordID"></param>       
        private object GetBannerRecord()
        {
            object dp = null;

            if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
            {
                Banner dpList = new Banner();
                object obj = (object)dpList;

                dp = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID);
                this.MyRecordID = (System.Web.HttpContext.Current.Request.QueryString["RecID"]);
            }
            else
            {
                //Error Messgae: Record not found.
            }
            return dp;
        }

        private string CheckImage()
        {
            string UploadDocument = "";
            System.Web.HttpFileCollection multipleFiles = System.Web.HttpContext.Current.Request.Files;
            String[] inputName = multipleFiles.AllKeys;
            var server = System.Web.HttpContext.Current.Server;
            String str = server.MapPath("~/");

            for (int fileCount = 0; fileCount < multipleFiles.Count; fileCount++)
            {
                System.Web.HttpPostedFile uploadedFile = multipleFiles[fileCount];
                string fileName = Path.GetFileName(uploadedFile.FileName);

                if (uploadedFile.ContentLength > 2048000)
                {
                    UploadDocument = "Large";
                }
            }
            return UploadDocument;
        }

        private string SaveImage()
        {
            string UploadDocument = "";
            System.Web.HttpFileCollection multipleFiles = System.Web.HttpContext.Current.Request.Files;
            String[] inputName = multipleFiles.AllKeys;
            var server = System.Web.HttpContext.Current.Server;
            String str = server.MapPath("~/");

            for (int fileCount = 0; fileCount < multipleFiles.Count; fileCount++)
            {
                System.Web.HttpPostedFile uploadedFile = multipleFiles[fileCount];
                string fileName = Path.GetFileName(uploadedFile.FileName);

                if (uploadedFile.ContentLength > 0)
                {
                    switch (inputName[fileCount])
                    {
                        case "UploadDocument":
                            if (!System.IO.File.Exists(Path.Combine(str, "BannerImage", uploadedFile.FileName)))
                                uploadedFile.SaveAs(Path.Combine(str, "BannerImage", uploadedFile.FileName));
                            UploadDocument = uploadedFile.FileName;
                            break;
                        case ".docx":
                            if (!System.IO.File.Exists(Path.Combine(str, "BannerImage", ".docx" + System.IO.Path.GetExtension(uploadedFile.FileName))))
                                uploadedFile.SaveAs(Path.Combine(str, "BannerImage", ".docx" + System.IO.Path.GetExtension(uploadedFile.FileName)));
                            UploadDocument = uploadedFile.FileName;
                            break;
                        case ".Pdf":
                            if (!System.IO.File.Exists(Path.Combine(str, "BannerImage", ".Pdf" + System.IO.Path.GetExtension(uploadedFile.FileName))))
                                uploadedFile.SaveAs(Path.Combine(str, "BannerImage", ".Pdf" + System.IO.Path.GetExtension(uploadedFile.FileName)));
                            UploadDocument = uploadedFile.FileName;
                            break;
                        case ".jpg":
                            if (!System.IO.File.Exists(Path.Combine(str, "BannerImage", ".jpg" + System.IO.Path.GetExtension(uploadedFile.FileName))))
                                uploadedFile.SaveAs(Path.Combine(str, "BannerImage", ".jpg" + System.IO.Path.GetExtension(uploadedFile.FileName)));
                            UploadDocument = uploadedFile.FileName;
                            break;
                        case ".png":
                            if (!System.IO.File.Exists(Path.Combine(str, "BannerImage", ".png" + System.IO.Path.GetExtension(uploadedFile.FileName))))
                                uploadedFile.SaveAs(Path.Combine(str, "BannerImage", ".png" + System.IO.Path.GetExtension(uploadedFile.FileName)));
                            UploadDocument = uploadedFile.FileName;
                            break;
                    }
                }
            }
            return UploadDocument;
        }
    }
}