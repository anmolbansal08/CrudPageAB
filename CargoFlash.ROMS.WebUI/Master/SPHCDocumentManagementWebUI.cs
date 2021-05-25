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
using System.Web;

namespace CargoFlash.Cargo.WebUI.Master
{
    public class SPHCDocumentManagementWebUI : BaseWebUISecureObject
    {
        public SPHCDocumentManagementWebUI()
        {

            try
            {
                this.MyPrimaryID = "SNo";
                this.MyModuleID = "Master";
                this.MyAppID = "SPHCDocument";

            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }
        public SPHCDocumentManagementWebUI(Page PageContext)
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
                this.MyAppID = "SPHCDocument";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }

        /// <summary>
        /// Get Record from DocumentMaster
        /// </summary>
        /// <returns></returns>
        public object GetRecordSPHCDocument()
        {
            object SPHCDocument = null;

            try
            {

                if (!DisplayMode.ToLower().Contains("new"))
                {
                    if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                    {
                        SPHCDocument SPHCDocumentList = new SPHCDocument();
                        object obj = (object)SPHCDocumentList;
                        IDictionary<string, string> qString = new Dictionary<string, string>();
                        qString.Add("UserSNo", ((Model.UserLogin)(HttpContext.Current.Session["UserDetail"])).UserSNo.ToString());
                        SPHCDocument = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID, "", "", qString);
                        this.MyRecordID = System.Web.HttpContext.Current.Request.QueryString["RecID"];
                    }
                    else
                    {
                        //Error Messgae: Record not found.
                    }
                }

            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
            return SPHCDocument;
        }

        /// <summary>
        /// Generate form layout
        /// </summary>
        /// <param name="DisplayMode">Identify which operation has to be performed viz(Read,Write,Update,Delete)</param>
        /// <param name="container"></param>
        public StringBuilder BuildFormView(string DisplayMode, StringBuilder container)
        {
            try
            {
                using (HtmlFormAdapter htmlFormAdapter = new HtmlFormAdapter(MyModuleID))
                {
                    htmlFormAdapter.CurrentPage = this.CurrentPageContext;
                    htmlFormAdapter.HeadingColumnName = "RefNo";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.objFormData = GetRecordSPHCDocument();
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;

                        case DisplayModeDuplicate:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.objFormData = GetRecordSPHCDocument();
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.objFormData = GetRecordSPHCDocument();
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
                            htmlFormAdapter.objFormData = GetRecordSPHCDocument();
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
            return container;
        }
        /// <summary>
        /// Generate City web page from XML
        /// e.g from ~/HtmlForm/WebFormDefinitionCity.xml
        /// </summary>
        /// <param name="container"></param>
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
                            CreateGrid(container);
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
        /// <summary>
        /// Generate Grid the for the page
        /// as per the columns of entity supplied
        /// </summary>
        /// <param name="Container"></param>
        private StringBuilder CreateGrid(StringBuilder Container)
        {
            try
            {
                using (Grid g = new Grid())
                {
                    g.CommandButtonNewText = "New SHC Document";
                    g.FormCaptionText = "SHC Document";
                    g.PrimaryID = this.MyPrimaryID;
                    g.PageName = this.MyPageName;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.ServiceModuleName = this.MyModuleID;
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "RefNo", Title = "Reference No", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "DocumentName", Title = "Document Name", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Text_SPHCType", Title = "SHC Type", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Text_SPHC", Title = "SHC", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Text_AirportCode", Title = "Airport", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Text_AirlineCode", Title = "Airline", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Text_IsUploadMandatory", Title = "Upload Mandatory", DataType = GridDataType.String.ToString() });


                    g.Column.Add(new GridColumn { Field = "Description", Title = "Description", DataType = GridDataType.String.ToString() });



                    g.InstantiateIn(Container);
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
        /// <summary>
        /// Postback Method to GET or POST 
        /// to set Mode/Context of the page
        /// </summary>
        public override void DoPostBack()
        {
            try
            {
                this.OperationMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
                switch (OperationMode)
                {
                    case DisplayModeSave:
                        SaveSPHCDocument(System.Web.HttpContext.Current.Request);
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                        break;
                    case DisplayModeUpdate:
                        UpdateSPHCDocument(System.Web.HttpContext.Current.Request.QueryString["RecID"], System.Web.HttpContext.Current.Request);
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                        break;
                    case DisplayModeSaveAndNew:
                        SaveSPHCDocument(System.Web.HttpContext.Current.Request);
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                        //else
                        //    return;
                        break;

                    case DisplayModeDelete:
                        DeleteSPHCDocument(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
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


        /// <summary>
        /// Save City record into the database 
        /// call webservice to save that data into the database
        /// </summary>
        /// 

        private byte[] convertDocToByte(string doc)
        {

            FileStream fStream = File.OpenRead(doc);
            byte[] contents = new byte[fStream.Length];
            fStream.Read(contents, 0, (int)fStream.Length);
            fStream.Close();
            return contents;
        }
        public static byte[] ReadFile(string imageLocation)
        {
            byte[] imageData = null;
            FileInfo fileInfo = new FileInfo(imageLocation);
            long imageFileLength = fileInfo.Length;
            FileStream fs = new FileStream(imageLocation, FileMode.Open, FileAccess.Read);
            BinaryReader br = new BinaryReader(fs);
            imageData = br.ReadBytes((int)imageFileLength);
            return imageData;
        }


        private void SaveSPHCDocument(HttpRequest httpRequest)
        {
            try
            {

                List<SPHCDocument> listSPHCDocument = new List<SPHCDocument>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;

                var file = httpRequest.Files[0];
                var b = new BinaryReader(file.InputStream);
                var file1 = b.ReadBytes(file.ContentLength);

                var SPHCDocument = new SPHCDocument
                {
                    //ZoneSNo =FormElement["ZoneSNo"]=="" ? 0: Convert.ToInt32(FormElement["ZoneSNo"]),
                    //ZoneName = FormElement["Text_ZoneSNo"] == "" ? null : FormElement["Text_ZoneSNo"],
                    DocumentName = FormElement["DocumentName"],
                    DocumentCode = FormElement["DocumentCode"],
                    AirportCode = FormElement["AirportCode"],
                    AirlineCode = FormElement["AirlineCode"],
                    SPHCType = Convert.ToInt32(FormElement["SPHCType"]),
                    SPHC = FormElement["SPHC"],
                    IsUploadMandatory = (string.IsNullOrEmpty(FormElement["IsUploadMandatory"]) ? false : (FormElement["IsUploadMandatory"].ToString() == "on")),
                    SampleDocument = file1,
                    FileName = file.FileName.ToString(),
                    Description = FormElement["Description"],
                    IsActive = FormElement["IsActive"] == "0",//not null
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    SPHCSubGroupSNo = FormElement["SPHCSubGroupSNo"].ToString(),
                };
                listSPHCDocument.Add(SPHCDocument);
                object datalist = (object)listSPHCDocument;
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
        /// <summary>
        /// Update City record into the database 
        /// Retrieve information from webform and store the same into modal 
        /// call webservice to update that data into the database
        /// </summary>
        /// <param name="RecordID">Key column/attribute value which touple has be updated</param>
        private void UpdateSPHCDocument(string RecordID, HttpRequest httpRequest)
        {
            try
            {


                var file = httpRequest.Files[0];
                var b = new BinaryReader(file.InputStream);
                var file1 = b.ReadBytes(file.ContentLength);
                var FormElement = System.Web.HttpContext.Current.Request.Form;

                //System.Web.HttpFileCollection multipleFiles = System.Web.HttpContext.Current.Request.Files;
                //var serverPath = System.Web.Hosting.HostingEnvironment.MapPath("~/UploadDoc/" + FormElement["SampleDocument"].ToString());

                ////if (!Directory.Exists(serverPath))
                ////    Directory.CreateDirectory(serverPath);

                //    byte[] bytes = File.ReadAllBytes(@"C:\Users\admin\Downloads\query.txt");


                List<SPHCDocument> listSPHCDocument = new List<SPHCDocument>();

                var SPHCDocument = new SPHCDocument
                {
                    SNo = Convert.ToInt32(RecordID),

                    DocumentName = FormElement["DocumentName"],
                    DocumentCode = FormElement["DocumentCode"],
                    AirportCode = FormElement["AirportCode"],
                    AirlineCode = FormElement["AirlineCode"],
                    SPHCType = Convert.ToInt32(FormElement["SPHCType"]),
                    SPHC = FormElement["SPHC"],
                    IsUploadMandatory = (string.IsNullOrEmpty(FormElement["IsUploadMandatory"]) ? false : (FormElement["IsUploadMandatory"].ToString() == "on")),
                    SampleDocument = file1,
                    FileName = file.FileName.ToString(),
                    Description = FormElement["Description"],
                    IsActive = FormElement["IsActive"] == "0",//not null
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    SPHCSubGroupSNo = FormElement["SPHCSubGroupSNo"].ToString(),
                };
                listSPHCDocument.Add(SPHCDocument);
                object datalist = (object)listSPHCDocument;
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
        /// <summary>
        /// Delete City record from the database 
        /// call webservice to update that data into the database
        /// </summary>
        /// <param name="RecordID"></param>
        private void DeleteSPHCDocument(string RecordID)
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
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }
    }
}
