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
using CargoFlash.Cargo.Model.Rate;
using System.Collections;
using System.Web;


namespace CargoFlash.Cargo.WebUI.Rate
{
    #region RateHeavyWeightSurchargeManagementWebUI Class Description

    /*
	*****************************************************************************
	Class Name:		RateHeavyWeightSurchargeManagementWebUI      
	Purpose:		This class used to handle HTTP Type Request/Response	
                    and communicate with REST Services for DML operations
                    object of this class is used in various Code behind files 
                    of Modules
	Company:		CargoFlash 
	Author:			Madhav Kumar Jha
	Created On:		24 Feb 2014
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    public class RateHeavyWeightSurchargeManagementWebUI : BaseWebUISecureObject
    {
        /// <summary>
        /// Get information of individual RateHeavyWeightSurcharge from database according record id supplied
        /// </summary>
        /// <returns>object type of entity RateHeavyWeightSurcharge found from database return null in case if touple not found</returns>
        public object GetRecordRateHeavyWeightSurcharge()
        {
            object RateHeavyWeightSurcharge = null;
            try
            {
                if (!string.IsNullOrEmpty(HttpContext.Current.Request.QueryString["RecID"]))
                {
                    RateHeavyWeightSurcharge RateHeavyWeightSurchargeList = new RateHeavyWeightSurcharge();
                    object obj = (object)RateHeavyWeightSurchargeList;
                    //retrieve Entity from Database according to the record
                    RateHeavyWeightSurcharge = DataGetRecordService(HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID);
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

            } return RateHeavyWeightSurcharge;
        }
        /// <summary>
        /// Set context of the page(Form) i.e. bind Module ID,App ID
        /// </summary>
        /// <param name="PageContext"></param>
        public RateHeavyWeightSurchargeManagementWebUI(Page PageContext)
        {
            try
            {
                if (this.SetCurrentPageContext(PageContext))
                {
                    this.ErrorNumber = 0;
                    this.ErrorMessage = "";
                }
                this.MyPageName = "Default.aspx";
                this.MyModuleID = "Rate";
                this.MyAppID = "RateHeavyWeightSurcharge";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }


        public RateHeavyWeightSurchargeManagementWebUI()
        {
            try
            {
                //if (this.SetCurrentPageContext(PageContext))
                //{
                //    this.ErrorNumber = 0;
                //    this.ErrorMessage = "";
                //}
                //   this.MyPageName = "Default.aspx";
                this.MyModuleID = "Rate";
                this.MyAppID = "RateHeavyWeightSurcharge";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }

        public StringBuilder CreateRateHeavyWeightSurchargeDetailsPage(StringBuilder container, string pageType)
        {
            StringBuilder containerLocal = new StringBuilder();
            containerLocal.Append(@"
    <div id='RateHeavyWeightSurchargeDiv'>
        <div id='ApplicationTabs'>
            <ul>
                <li  id='liRateHeavyWeightSurcharge' class='k-state-active'>Heavy Weight Surcharge Information</li>
                <li id='liHeavyWeightCommodityExemption' onclick='javascript:CreateRateHeavyWeightCommodityExemption();'\>Heavy Weight Commodity Exemption</li>
  <li id='liHeavyWeightCommodityExemption' onclick='javascript:CreateRateHeavyWeightSPHCExemption();'>Heavy Weight SPHC Exemption</li>
                
            </ul>
            <div id='divTab1' > 
              <span id='spnAccountInformation'>");
            containerLocal.Append(container);
            containerLocal.Append(@"</span> 
            </div>
            <div id='divTab2' >
                    <input id='hdnPageType' name='hdnPageType' type='hidden' value='" + pageType + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='Edit'/><input id='hdnRateHeavyWeightSurchargeSNo' name='hdnRateHeavyWeightSurchargeSNo' type='hidden' value='" + this.MyRecordID + "'/><span id='spnHeavyWeightCommodityExemption'><table id='tblRateHeavyWeightCommodityExemption'></table></span></div><div id='divTab3' ><span id='spnHeavyWeightSPHCExemption'><table cellspacing=0 cellpadding=0 border=0 id='tblRateHeavyWeightSPHCExemption'><tr><td></td></tr></table></span></div></div></div>");
            return containerLocal;
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
                    htmlFormAdapter.HeadingColumnName = "RateHeavyWeightSurchargeName";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.objFormData = GetRecordRateHeavyWeightSurcharge();
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            //container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append(CreateRateHeavyWeightSurchargeDetailsPage(htmlFormAdapter.InstantiateIn(),"View"));
                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.objFormData = GetRecordRateHeavyWeightSurcharge();
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            //container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append(CreateRateHeavyWeightSurchargeDetailsPage(htmlFormAdapter.InstantiateIn(),"Edit"));
                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.objFormData = GetRecordRateHeavyWeightSurcharge();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(CreateRateHeavyWeightSurchargeDetailsPage(htmlFormAdapter.InstantiateIn(),"Edit"));
                            //container.Append(htmlFormAdapter.InstantiateIn());

                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            //container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append(CreateRateHeavyWeightSurchargeDetailsPage(htmlFormAdapter.InstantiateIn(),"Edit"));
                            break;
                        case DisplayModeDelete:
                            htmlFormAdapter.objFormData = GetRecordRateHeavyWeightSurcharge();
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
        /// <summary>
        /// Generate RateHeavyWeightSurcharge web page from XML
        /// e.g from ~/HtmlForm/WebFormDefinitionRateHeavyWeightSurcharge.xml
        /// </summary>
        /// <param name="container"></param>
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
        private StringBuilder CreateGrid(StringBuilder Container)
        {
            try
            {
                using (Grid g = new Grid())
                {
                    g.CommandButtonNewText = "New Heavy Weight Surcharge";
                    g.FormCaptionText = "Heavy Weight Surcharge";
                    g.PrimaryID = this.MyPrimaryID;
                    g.PageName = this.MyPageName;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.ServiceModuleName = this.MyModuleID;
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "HeavyWeightName", Title = "Heavy Weight Name", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "StartWeight", Title = "Start Weight", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "EndWeight", Title = "End Weight", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Text_ValueType", Title = "Value Type", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Value", Title = "Value", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "ValidFrom", Title = "Valid From", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "ValidTo", Title = "Valid To", DataType = GridDataType.String.ToString() });
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
        /// Postback Method to GET or POST 
        /// to set Mode/Context of the page
        /// </summary>
        public override void DoPostBack()
        {
            //try
            //{

            this.OperationMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
            switch (OperationMode)
            {
                case DisplayModeSave:
                    SaveRateHeavyWeightSurcharge();
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                    break;
                case DisplayModeSaveAndNew:
                    SaveRateHeavyWeightSurcharge();
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                    break;
                case DisplayModeUpdate:

                    UpdateRateHeavyWeightSurcharge(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                    break;

                case DisplayModeDelete:
                    DeleteRateHeavyWeightSurcharge(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                    if (string.IsNullOrEmpty(ErrorMessage))
                        System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2002), false);
                    break;
            }
            //}
            //catch (Exception ex)
            //{
            //    ApplicationWebUI applicationWebUI = new ApplicationWebUI();
            //    applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            //}
        }
        /// <summary>
        /// Save Images viz(RateHeavyWeightSurchargeLogo,AwbLogo,ReportLogo)
        /// input from webform to stipulated folder 
        /// </summary>
        private String[] SaveImage()
        {
            String RateHeavyWeightSurchargeLogo = "", AwbLogo = "", ReportLogo = "";
            try
            {
                System.Web.HttpFileCollection multipleFiles = System.Web.HttpContext.Current.Request.Files;

                String[] inputName = multipleFiles.AllKeys;
                var server = System.Web.HttpContext.Current.Server;
                String str = server.MapPath("~/");
                if (!Directory.Exists(Path.Combine(str, "Logo")))
                {
                    Directory.CreateDirectory(Path.Combine(str, "Logo"));
                }
                for (int fileCount = 0; fileCount < multipleFiles.Count; fileCount++)
                {
                    System.Web.HttpPostedFile uploadedFile = multipleFiles[fileCount];
                    string fileName = Path.GetFileName(uploadedFile.FileName);
                    if (uploadedFile.ContentLength > 0 && ((uploadedFile.ContentLength / 1024) <= 2048))
                    {
                        switch (inputName[fileCount])
                        {
                            case "RateHeavyWeightSurchargeLogo":
                                RateHeavyWeightSurchargeLogo = Path.Combine("Logo", "RateHeavyWeightSurchargeLogo" + Guid.NewGuid() + System.IO.Path.GetExtension(uploadedFile.FileName));
                                uploadedFile.SaveAs(Path.Combine(str, RateHeavyWeightSurchargeLogo));
                                break;
                            case "AwbLogo":
                                AwbLogo = Path.Combine("Logo", "AwbLogo" + Guid.NewGuid() + System.IO.Path.GetExtension(uploadedFile.FileName));
                                uploadedFile.SaveAs(Path.Combine(str, AwbLogo));
                                //@todo
                                break;
                            case "ReportLogo":
                                ReportLogo = Path.Combine("Logo", "ReportLogo" + Guid.NewGuid() + System.IO.Path.GetExtension(uploadedFile.FileName));
                                uploadedFile.SaveAs(Path.Combine(str, ReportLogo));
                                //@todo
                                break;
                            //ReportLogo { get; set; } 
                        }
                    }
                }
                return new String[] { RateHeavyWeightSurchargeLogo, AwbLogo, ReportLogo };
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            } return new String[] { RateHeavyWeightSurchargeLogo, AwbLogo, ReportLogo };
        }
        /// <summary>
        /// Insert new RateHeavyWeightSurcharge record into the database
        /// Retrieve information from webform and store the same into modal object 
        /// call webservice to save that data into the database
        /// </summary>
        private void SaveRateHeavyWeightSurcharge()
        {
            try
            {
                List<RateHeavyWeightSurcharge> listRateHeavyWeightSurcharge = new List<RateHeavyWeightSurcharge>();
                String[] Logo = SaveImage();
                int number = 0;
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var RateHeavyWeightSurcharge = new RateHeavyWeightSurcharge
                {
                    HeavyWeightName = FormElement["HeavyWeightName"],
                    StartWeight = Convert.ToDecimal(FormElement["StartWeight"] == "" ? "0" : FormElement["StartWeight"]),
                    EndWeight = Convert.ToDecimal(FormElement["EndWeight"] == "" ? "0" : FormElement["EndWeight"]),
                    ValueType = Int32.TryParse(FormElement["ValueTypeSNo"], out number) ? number : 0,
                    Value = Convert.ToDecimal(FormElement["Value"] == "" ? "0" : FormElement["Value"]),
                    ValidFrom = Convert.ToDateTime(FormElement["ValidFrom"]),
                    ValidTo = Convert.ToDateTime(FormElement["ValidTo"]),
                    IsActive = FormElement["IsActive"] == "0",
                    IsInternational = FormElement["IsInternational"] == "0",
                    IsEditable = FormElement["IsEditable"] == "0",
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()

                };
                listRateHeavyWeightSurcharge.Add(RateHeavyWeightSurcharge);
                object datalist = (object)listRateHeavyWeightSurcharge;
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
        /// Update RateHeavyWeightSurcharge record into the database 
        /// Retrieve information from webform and store the same into modal 
        /// call webservice to update that data into the database
        /// </summary>
        /// <param name="RecordID">Key column/attribute value which touple has be updated</param>
        private void UpdateRateHeavyWeightSurcharge(string RecordID)
        {
            try
            {
                List<RateHeavyWeightSurcharge> listRateHeavyWeightSurcharge = new List<RateHeavyWeightSurcharge>();
                int number = 0;

                String[] Logo = SaveImage();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var RateHeavyWeightSurcharge = new RateHeavyWeightSurcharge
                {
                    SNo = Int32.TryParse(RecordID, out number) ? number : 0,
                    HeavyWeightName = FormElement["HeavyWeightName"],
                    StartWeight = Convert.ToDecimal(FormElement["StartWeight"] == "" ? "0" : FormElement["StartWeight"]),
                    EndWeight = Convert.ToDecimal(FormElement["EndWeight"] == "" ? "0" : FormElement["EndWeight"]),
                    ValueType = Int32.TryParse(FormElement["ValueType"], out number) ? number : 0,
                    Value = Convert.ToDecimal(FormElement["Value"] == "" ? "0" : FormElement["Value"]),
                    ValidFrom = Convert.ToDateTime(FormElement["ValidFrom"]),
                    ValidTo = Convert.ToDateTime(FormElement["ValidTo"]),
                    IsActive = FormElement["IsActive"] == "0",
                    IsInternational = FormElement["IsInternational"] == "0",
                    IsEditable = FormElement["IsEditable"] == "0",
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()
                };
                listRateHeavyWeightSurcharge.Add(RateHeavyWeightSurcharge);
                object datalist = (object)listRateHeavyWeightSurcharge;
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
        /// Delete RateHeavyWeightSurcharge record from the database 
        /// call webservice to update that data into the database
        /// </summary>
        /// <param name="RecordID"></param>
        private void DeleteRateHeavyWeightSurcharge(string RecordID)
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
