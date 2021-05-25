using CargoFlash.Cargo.Model.Master;
using CargoFlash.SoftwareFactory.WebUI;
using CargoFlash.SoftwareFactory.WebUI.Adapters;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI;

namespace CargoFlash.Cargo.WebUI.Master
{
    public class CommissionManagementWebUI : BaseWebUISecureObject
    {
        public CommissionManagementWebUI()
        {

            try
            {
                this.MyPrimaryID = "SNo";
                this.MyModuleID = "Master";
                this.MyAppID = "Commission";

            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }
        public CommissionManagementWebUI(Page PageContext)
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
                this.MyAppID = "Commission";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;

            }
        }

        /// <summary>
        /// Get Record from City
        /// </summary>
        /// <returns></returns>
        public object GetCommissionRecord()
        {
            object commission = null;

            try
            {

                if (!DisplayMode.ToLower().Contains("new"))
                {
                    if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                    {
                        Commission commissionList = new Commission();
                        object obj = (object)commissionList;
                        IDictionary<string, string> qString = new Dictionary<string, string>();
                        qString.Add("UserSNo", ((Model.UserLogin)(HttpContext.Current.Session["UserDetail"])).UserSNo.ToString());
                        commission = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID, "", "", qString);
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
            return commission;
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
                    StringBuilder strf = new StringBuilder();
                    htmlFormAdapter.Ischildform = true;
                    htmlFormAdapter.CurrentPage = this.CurrentPageContext;
                    htmlFormAdapter.HeadingColumnName = "RefNo";
                    htmlFormAdapter.AuditLogColumn = "Text_OfficeSNo,Text_Agent";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.objFormData = GetCommissionRecord();
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);


                            strf.Append("<div id='divCommissionSlab'><span id='spnCommissionSlab'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnCommissionSlabSNo' name='hdnCommissionSlabSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblCommissionSlab'></table></span></div>");
                            htmlFormAdapter.Childform = strf.ToString();
                            container.Append(htmlFormAdapter.InstantiateIn());


                            break;

                        case DisplayModeDuplicate:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.objFormData = GetCommissionRecord();
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);

                            strf.Append("<div id='divCommissionSlab'><span id='spnCommissionSlab'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnCommissionSlabSNo' name='hdnCommissionSlabSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblCommissionSlab' Style='margin-top: 20px;'></table></span></div>");
                            htmlFormAdapter.Childform = strf.ToString();
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.objFormData = GetCommissionRecord();
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);

                            strf.Append("<div id='divCommissionSlab'><span id='spnCommissionSlab'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnCommissionSlabSNo' name='hdnCommissionSlabSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblCommissionSlab' Style='margin-top: 20px;'></table></span></div>");
                            htmlFormAdapter.Childform = strf.ToString();
                            container.Append(htmlFormAdapter.InstantiateIn());

                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            strf.Append("<div id='divCommissionSlab'><span id='spnCommissionSlab'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnCommissionSlabSNo' name='hdnCommissionSlabSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblCommissionSlab' Style='margin-top: 20px;'></table></span></div>");

                            htmlFormAdapter.Childform = strf.ToString();
                            container.Append(htmlFormAdapter.InstantiateIn());
                            break;
                        case DisplayModeDelete:
                            htmlFormAdapter.DisplayMode = DisplayModeType.Delete;
                            htmlFormAdapter.objFormData = GetCommissionRecord();
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            strf.Append("<div id='divCommissionSlab'><span id='spnCommissionSlab'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnCommissionSlabSNo' name='hdnCommissionSlabSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><table id='tblCommissionSlab' ></table></span></div>");

                            htmlFormAdapter.Childform = strf.ToString();
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
                    g.CommandButtonNewText = "New Commission";
                    g.FormCaptionText = "Commission";
                    g.PrimaryID = this.MyPrimaryID;
                    g.PageName = this.MyPageName;
                    g.ModuleName = this.MyModuleID;
                    g.AppsName = this.MyAppID;
                    g.ServiceModuleName = this.MyModuleID;
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "RefNo", Title = "Reference No", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Text_OfficeSNo", Title = "Office", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Text_Agent", Title = "Agent", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "CustomerType", Title = "Shipment Type", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Text_AirlineSNo", Title = "Airline", DataType = GridDataType.String.ToString() });
                    // g.Column.Add(new GridColumn { Field = "CommissionTypeText", Title = "Commission Type", DataType = GridDataType.String.ToString() });
                    // g.Column.Add(new GridColumn { Field = "CommissionAmount", Title = "Commission", DataType = GridDataType.String.ToString() });
                    // g.Column.Add(new GridColumn { Field = "IncentiveAmount", Title = "Incentive", DataType = GridDataType.String.ToString() });
                    //    g.Column.Add(new GridColumn { Field = "ValidFromText", Title = "Valid From", DataType = GridDataType.String.ToString() });
                    //  g.Column.Add(new GridColumn { Field = "ValidToText", Title = "Valid To", DataType = GridDataType.String.ToString() });
                      g.Column.Add(new GridColumn { Field = "Active", Title = "Active", DataType = GridDataType.String.ToString() });
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
                        SaveCommission();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                        //else
                        //    System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                        break;
                    case DisplayModeUpdate:
                        UpdateCommission(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                        break;
                    case DisplayModeSaveAndNew:
                        SaveCommission();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                        break;

                    case DisplayModeDelete:
                        DeleteCommission(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
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
        /// Save Commission record into the database 
        /// call webservice to save that data into the database
        /// </summary>
        private void SaveCommission()
        {
            try
            {
                //
                List<Commission> listCommission = new List<Commission>();
                List<CommissionTrans> listCommissiontrans = new List<CommissionTrans>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                string[] values = FormElement["tblCommissionSlab_rowOrder"].ToString().Split(',');

                for (int count = 0; count < Convert.ToInt32(FormElement["tblCommissionSlab_rowOrder"].ToString().Split(',').Length); count++)
                {
                    //SNo,OfficeSNo,AccountSNo,IsDomestic,Unit,CommissionType,CommissionAmount,IncentiveType,IncentiveAmount,NetNet,ValidFrom,ValidTo,IsActive,CreatedBy,CreatedOn,UpdatedBy,UpdatedOn
                    listCommissiontrans.Add(new CommissionTrans()
                    {
                        Sno = 1,
                        CommissionTransSNo = 1,
                        StartWeight = Convert.ToDecimal(FormElement["tblCommissionSlab_StartWeight_" + values[count]]),
                        EndWeight = Convert.ToDecimal(FormElement["tblCommissionSlab_EndWeight_" + values[count]]),
                        Unit = Convert.ToInt32(FormElement["tblCommissionSlab_Unit_" + values[count]]),
                        Incentive = FormElement["tblCommissionSlab_Incentive_" + values[count]] == "" ? 0 : Convert.ToDecimal(FormElement["tblCommissionSlab_Incentive_" + values[count]]),
                        Commission = Convert.ToDecimal(FormElement["tblCommissionSlab_Commission_" + values[count]]),
                        ValidFrom = Convert.ToDateTime(FormElement["tblCommissionSlab_ValidFrom_" + values[count]]).ToString("MM-dd-yyyy"),
                        ValidTo = Convert.ToDateTime(FormElement["tblCommissionSlab_ValidTo_" + values[count]]).ToString("MM-dd-yyyy"),
                    }
                    );

                }



                var commission = new Commission
                {
                    //SNo,OfficeSNo,AccountSNo,IsDomestic,Unit,CommissionType,CommissionAmount,IncentiveType,IncentiveAmount,NetNet,ValidFrom,ValidTo,IsActive,CreatedBy,CreatedOn,UpdatedBy,UpdatedOn
                    OfficeSNo = FormElement["OfficeSNo"] == "" ? 0 : Convert.ToInt32(FormElement["OfficeSNo"]),
                    Agent = FormElement["Agent"] == "" ? 0 : Convert.ToInt32(FormElement["Agent"].Split('-')[0]),
                    IsDomestic = Convert.ToInt32(FormElement["CustomerType"] != null ? Convert.ToInt32(FormElement["CustomerType"]) : Convert.ToInt32(FormElement["Agent"].Split('-')[1])),
                    AirlineSNo = Convert.ToInt32(FormElement["AirlineSNo"]),
                    // IsDomestic = Convert.ToBoolean(FormElement["CustomerType"] == "0"),
                    //  Unit = Convert.ToInt16(FormElement["Unit"] == "0" ? 1 : 2),
                    //   CommissionType = Convert.ToInt16(FormElement["Type"]),
                    //  CommissionAmount = Convert.ToDecimal(FormElement["Commission"]),
                    //IncentiveType = Convert.ToInt16(FormElement["Unit"]),
                    //  IncentiveAmount = Convert.ToDecimal(FormElement["Incentive"]),
                    //   NetNet = Convert.ToInt16(FormElement["CommissionUnit"] == "0" ? 1 : 2),
                    ValidFrom = DateTime.Now,//Convert.ToDateTime(FormElement["ValidFrom"]),
                    ValidTo = DateTime.Now,//Convert.ToDateTime(FormElement["ValidTo"]),
					//IsActive = true,
					IsActive = FormElement["Active"] == "0" ? true : false,
                    CreatedBy = Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                    UpdatedBy = Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                    OriginCountrySNo = FormElement["OriginCountrySNo"] == "" ? (Int32?)null : Convert.ToInt32(FormElement["OriginCountrySNo"]),
                    DestinationCountrySNo = FormElement["DestinationCountrySNo"] == "" ? (Int32?)null : Convert.ToInt32(FormElement["DestinationCountrySNo"]),
                    OriginCitySNo = FormElement["OriginCitySNo"] == "" ? (Int32?)null : Convert.ToInt32(FormElement["OriginCitySNo"]),
                    DestinationCitySNo = FormElement["DestinationCitySNo"] == "" ? (Int32?)null : Convert.ToInt32(FormElement["DestinationCitySNo"]),
                    CommissionTrans = listCommissiontrans,
                };
                listCommission.Add(commission);
                object datalist = (object)listCommission;
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
        ///// <summary>
        ///// Update City record into the database 
        ///// Retrieve information from webform and store the same into modal 
        ///// call webservice to update that data into the database
        ///// </summary>
        ///// <param name="RecordID">Key column/attribute value which touple has be updated</param>
        private void UpdateCommission(string RecordID)
        {
            try
            {
                List<Commission> listCommission = new List<Commission>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                // List<Commission> listCommission = new List<Commission>();
                List<CommissionTrans> listCommissiontrans = new List<CommissionTrans>();
                //  var FormElement = System.Web.HttpContext.Current.Request.Form;
                string[] values = FormElement["tblCommissionSlab_rowOrder"].ToString().Split(',');


                for (int count = 0; count < FormElement["tblCommissionSlab_rowOrder"].ToString().Split(',').Length; count++)
                {
                    //SNo,OfficeSNo,AccountSNo,IsDomestic,Unit,CommissionType,CommissionAmount,IncentiveType,IncentiveAmount,NetNet,ValidFrom,ValidTo,IsActive,CreatedBy,CreatedOn,UpdatedBy,UpdatedOn
                    listCommissiontrans.Add(new CommissionTrans()
                    {
                        Sno = 1,
                        CommissionTransSNo = 1,
                        StartWeight = Convert.ToDecimal(FormElement["tblCommissionSlab_StartWeight_" + values[count]]),
                        EndWeight = Convert.ToDecimal(FormElement["tblCommissionSlab_EndWeight_" + values[count]]),
                        Unit = Convert.ToInt32(FormElement["tblCommissionSlab_Unit_" + values[count]]),
                        Incentive = Convert.ToDecimal(FormElement["tblCommissionSlab_Incentive_" + values[count]]),
                        Commission = Convert.ToDecimal(FormElement["tblCommissionSlab_Commission_" + values[count]]),
                        ValidFrom = Convert.ToDateTime(FormElement["tblCommissionSlab_ValidFrom_" + values[count]]).ToString("MM-dd-yyyy"),
                        ValidTo = Convert.ToDateTime(FormElement["tblCommissionSlab_ValidTo_" + values[count]]).ToString("MM-dd-yyyy"),
                        IsActive = true,//FormElement["tblCommissionSlab_RbtnIsActive_"+ values[count]] == "1" ? true : false,
                    }
                    );

                }

                var commission = new Commission
                {
                    SNo = Convert.ToInt32(RecordID),
                    OfficeSNo = FormElement["OfficeSNo"] == "" ? 0 : Convert.ToInt32(FormElement["OfficeSNo"]),
                    Agent = FormElement["Agent"] == "" ? 0 : Convert.ToInt32(FormElement["Agent"].Split('-')[0]),
                    IsDomestic = Convert.ToInt32( FormElement["CustomerType"] ),
                    AirlineSNo = Convert.ToInt32(FormElement["AirlineSNo"]),
                    ValidFrom = DateTime.Now,//Convert.ToDateTime(FormElement["ValidFrom"]),
                    ValidTo = DateTime.Now,//Convert.ToDateTime(FormElement["ValidTo"]),
                                           ////IsActive = true,
                    IsActive = FormElement["Active"] == "0" ? true : false,
                    CreatedBy = Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                    UpdatedBy = Convert.ToInt32(((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()),
                    OriginCountrySNo = FormElement["OriginCountrySNo"] == "" ? (Int32?)null : Convert.ToInt32(FormElement["OriginCountrySNo"]),
                    DestinationCountrySNo = FormElement["DestinationCountrySNo"] == "" ? (Int32?)null : Convert.ToInt32(FormElement["DestinationCountrySNo"]),
                    OriginCitySNo = FormElement["OriginCitySNo"] == "" ? (Int32?)null : Convert.ToInt32(FormElement["OriginCitySNo"]),
                    DestinationCitySNo = FormElement["DestinationCitySNo"] == "" ? (Int32?)null : Convert.ToInt32(FormElement["DestinationCitySNo"]),
                    CommissionTrans = listCommissiontrans,
                };
                listCommission.Add(commission);
                object datalist = (object)listCommission;
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
        ///// <summary>
        ///// Delete City record from the database 
        ///// call webservice to update that data into the database
        ///// </summary>
        ///// <param name="RecordID"></param>
        public void DeleteCommission(string RecordID)
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
