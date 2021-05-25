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
    #region SLA Class Description
    /*
	*****************************************************************************
	Class Name:		SLAManagementWebUI      
	Purpose:		This Class used to get details of SLA save update and delete
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Tarun Kumar
	Created On:		25 Jan 2016
    Updated By:    
	Updated On:	
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    public class SLAManagementWebUI : BaseWebUISecureObject
    {
        public object GetSLARecord()
        {
            object SLA = null;
            try
            {
                if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                {
                    SLA SLAList = new SLA();
                    object obj = (object)SLAList;
                    IDictionary<string, string> qString = new Dictionary<string, string>();
                    qString.Add("UserSNo", ((Model.UserLogin)(HttpContext.Current.Session["UserDetail"])).UserSNo.ToString());
                    SLA = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID, "", "", qString);
                    this.MyRecordID = System.Web.HttpContext.Current.Request.QueryString["RecID"];


                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            } return SLA;
        }

        private DataTable GetSLATransRecord()
        {
            object SLATrans = null;
            DataTable dtCreateSLATransRecord = null;
            if ((!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"])))
            {
                List<SLATrans> SLATransList = new List<SLATrans>();
                object obj = (object)SLATransList;

                SLATrans = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, this.MyModuleID, "SLATrans");
                dtCreateSLATransRecord = BaseWebUISecureObject.ConvertToDataTable((List<SLATrans>)SLATrans);
                this.MyRecordID = (System.Web.HttpContext.Current.Request.QueryString["RecID"]);
            }
            else
            {
                //Error Messgae: Record not found.
            }
            return dtCreateSLATransRecord;
        }

        public SLAManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Master";
                this.MyAppID = "SLA";
                this.MyPrimaryID = "SNo";
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());
                ErrorMessage = applicationWebUI.ErrorMessage;
            }
        }

        public SLAManagementWebUI(Page PageContext)
        {
            try
            {
                if (this.SetCurrentPageContext(PageContext))
                {
                    this.ErrorNumber = 0;
                    this.ErrorMessage = "";
                }
                this.MyPageName = "Default.cshtml";
                this.MyModuleID = "Master";
                this.MyAppID = "SLA";
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

                    StringBuilder strf = new StringBuilder();
                    htmlFormAdapter.Ischildform = true;
                    //Updated by Akash for Audit Log on 6 Nov 2017
                    htmlFormAdapter.CurrentPage = this.CurrentPageContext;
                    htmlFormAdapter.HeadingColumnName = "StandardName";

                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.objFormData = GetSLARecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            //container.Append(htmlFormAdapter.InstantiateIn());
                            strf.Append("<input id='hdnPageType' name='hdnPageType' type='hidden' value='View'/>");
                            strf.Append("<input id='hdnSNo' name='hdnSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnUpdatedBy' name='hdnUpdatedBy' type='hidden' value='" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString() + "'/><table id='tblSLATrans' width='100%'></table>");
                            htmlFormAdapter.Childform = strf.ToString();
                            container.Append(htmlFormAdapter.InstantiateIn());
                            //Updated by Akash for Audit Log on 6 Nov 2017
                            //htmlFormAdapter.objFormData = null;
                            //htmlFormAdapter.objDataTable = GetSLATransRecord();
                            //container.Append(htmlFormAdapter.TransInstantiateWithHeader("Master", "SLATrans", "Read"));
                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.objFormData = GetSLARecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            //container.Append(htmlFormAdapter.InstantiateIn());
                            strf.Append("<input id='hdnPageType' name='hdnPageType' type='hidden' value='New'/>");
                            strf.Append("<input id='hdnSNo' name='hdnSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnUpdatedBy' name='hdnUpdatedBy' type='hidden' value='" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString() + "'/><table id='tblSLATrans' width='100%'></table>");
                            htmlFormAdapter.Childform = strf.ToString();
                            container.Append(htmlFormAdapter.InstantiateIn());
                            //Updated by Akash for Audit Log on 6 Nov 2017
                            //htmlFormAdapter.objFormData = null;
                            //container.Append(htmlFormAdapter.TransInstantiateWithHeader("Master", "SLATrans", ValidateOnSubmit: true));
                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.objFormData = GetSLARecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            //container.Append(htmlFormAdapter.InstantiateIn());
                            strf.Append("<input id='hdnPageType' name='hdnPageType' type='hidden' value='Edit'/>");
                            strf.Append("<input id='hdnSNo' name='hdnSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnUpdatedBy' name='hdnUpdatedBy' type='hidden' value='" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString() + "'/><table id='tblSLATrans' width='100%'></table>");
                            htmlFormAdapter.Childform = strf.ToString();
                            container.Append(htmlFormAdapter.InstantiateIn());
                            //Updated by Akash for Audit Log on 6 Nov 2017
                            //htmlFormAdapter.objFormData = null;
                            //htmlFormAdapter.objDataTable = GetSLATransRecord();
                            //container.Append(htmlFormAdapter.TransInstantiateWithHeader("Master", "SLATrans", ValidateOnSubmit: true));
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            //container.Append(htmlFormAdapter.InstantiateIn());
                            strf.Append("<input id='hdnPageType' name='hdnPageType' type='hidden' value='New'/>");
                            strf.Append("<input id='hdnSNo' name='hdnSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnUpdatedBy' name='hdnUpdatedBy' type='hidden' value='" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString() + "'/><table id='tblSLATrans' width='100%'></table>");
                            htmlFormAdapter.Childform = strf.ToString();
                            container.Append(htmlFormAdapter.InstantiateIn());
                            //Updated by Akash for Audit Log on 6 Nov 2017
                            //container.Append(htmlFormAdapter.TransInstantiateWithHeader("Master", "SLATrans", ValidateOnSubmit: true));
                            break;
                        case DisplayModeDelete:
                            htmlFormAdapter.objFormData = GetSLARecord();
                            htmlFormAdapter.DisplayMode = DisplayModeType.Delete;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            //container.Append(htmlFormAdapter.InstantiateIn());
                            strf.Append("<input id='hdnPageType' name='hdnPageType' type='hidden' value='Delete'/>");
                            strf.Append("<input id='hdnSNo' name='hdnSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnUpdatedBy' name='hdnUpdatedBy' type='hidden' value='" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString() + "'/><table id='tblSLATrans' width='100%'></table>");
                            htmlFormAdapter.Childform = strf.ToString();
                            container.Append(htmlFormAdapter.InstantiateIn());
                            //Updated by Akash for Audit Log on 6 Nov 2017
                            //htmlFormAdapter.objFormData = null;
                            //htmlFormAdapter.objDataTable = GetSLATransRecord();
                            //container.Append(htmlFormAdapter.TransInstantiateWithHeader("Master", "SLATrans", "Read"));
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
                    //Set the display Mode form the URL QuesyString.
                    this.DisplayMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
                    //Match the display Mode of the form.
                    switch (this.DisplayMode)
                    {
                        case DisplayModeIndexView:
                            CreateGrid(container);
                            break;
                        case DisplayModeDuplicate:
                            BuildFormView(this.DisplayMode, container);
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

        public override void DoPostBack()
        {
            try
            {
                this.OperationMode = "FORMACTION." + this.FormAction.ToString().ToUpper().Trim();
                switch (OperationMode)
                {
                    case DisplayModeSave:
                        SaveSLA();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                        break;
                    case DisplayModeSaveAndNew:
                        SaveSLA();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                        break;
                    case DisplayModeUpdate:
                        UpdateSLA(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                        break;

                    case DisplayModeDelete:
                        DeleteSLA(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
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

        private StringBuilder CreateGrid(StringBuilder Container)
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
                    g.FormCaptionText = "SLA";
                    g.CommandButtonNewText = "New SLA";
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "StandardName", Title = "Name", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "SLAType", Title = "SLA Type", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "MovementType", Title = "Movement Type", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Text_AirportSNo", Title = "Airport", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Text_AirlineSNo", Title = "Airline", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Text_EventSNo", Title = "Event Name", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "MinimumCutOffMins", Title = "CutOffMins", DataType = GridDataType.String.ToString() });
                    //g.Column.Add(new GridColumn { Field = "Continent", Title = "Continent", DataType = GridDataType.String.ToString() });

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

        private void SaveSLA()
        {
            try
            {
                //List<SLA> listSLA = new List<SLA>();
                //var FormElement = System.Web.HttpContext.Current.Request.Form;
                //var SLA = new SLA
                //{
                //    AirportSNo = Convert.ToInt16(FormElement["AirportSNo"]),
                //    TerminalSNo = Convert.ToInt16(FormElement["TerminalSNo"]),
                //    AirlineSNo = Convert.ToInt16(FormElement["AirlineSNo"]),
                //    StandardName = FormElement["StandardName"].ToUpper(),
                //    MovementType = FormElement["MovementType"],
                //    Basis = FormElement["Basis"],
                //    EventSNo = FormElement["EventSNo"],
                //    DisplayOrder = FormElement["DisplayOrder"],
                //    MinimumCutOffMins = FormElement["MinimumCutOffMins"],
                //    AircraftSNo = FormElement["AircraftSNo"],
                //    SHCSNo = FormElement["SHCSNo"],
                //    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                //    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()
                //};
                ////string SLATrans44 = CurrentPageContext.Request.Form["valueareaTrans_Master_SLATrans"];
                //string SLATrans11 = System.Web.HttpContext.Current.Request.Form["divareaTrans_Master_SLATrans"];
                //string SLATrans = System.Web.HttpContext.Current.Request.Form["valueareaTrans_Master_SLATrans"];
                //string[] SLATranslist = SLATrans.Split('^');
                //List<SLATrans> listSLATrans = new List<SLATrans>();

                //foreach (string strSLA in SLATranslist)
                //{
                //    SLATrans slaTrans = new SLATrans();
                //    string[] strSLARecord = strSLA.Split('~');

                //    if (strSLARecord.Length > 1)
                //    {
                //        slaTrans.SNo = 0;
                //        slaTrans.SlabName = (strSLARecord[0]);
                //        slaTrans.StartWeight = (strSLARecord[1]);
                //        slaTrans.EndWeight = (strSLARecord[2]);
                //        slaTrans.StartPercentage = (strSLARecord[3]);
                //        slaTrans.EndPercentage = (strSLARecord[4]);
                //        slaTrans.CutOffMins = (strSLARecord[5]);
                //        listSLATrans.Add(slaTrans);
                //    }
                //}

                //listSLA.Add(SLA);
                //List<SLAMasterInfo> listSLAMasterInfo = new List<SLAMasterInfo>();
                //var SLAMasterInfo = new SLAMasterInfo { SLA = listSLA, SLATrans = listSLATrans };
                //listSLAMasterInfo.Add(SLAMasterInfo);

                //object datalist = (object)listSLAMasterInfo;
                ////object datalist = (object)listSLA;
                //DataOperationService(DisplayModeSave, datalist, MyModuleID);
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            }

        }

        private void UpdateSLA(string RecordID)
        {
            try
            {
                //List<SLA> listSLA = new List<SLA>();
                //var FormElement = System.Web.HttpContext.Current.Request.Form;
                //var SLA = new SLA
                //{
                //SNo = Convert.ToInt32(RecordID),
                //SLAName = FormElement["SLAName"].ToUpper(),
                //CurrencySNo = Convert.ToInt32(FormElement["CurrencyCode"]),
                //CurrencyCode = FormElement["Text_CurrencyCode"].Split('-')[0].ToUpper(),
                //Continent = FormElement["Continent"],
                //IATAAreaCode = FormElement["IATAAreaCode"] == "" ? null : FormElement["IATAAreaCode"],
                //ISDCode = FormElement["ISDCode"],
                //CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                //UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString()
                //};
                //listSLA.Add(SLA);
                //object datalist = (object)listSLA;
                //DataOperationService(DisplayModeUpdate, datalist, MyModuleID);
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            }
        }

        private void DeleteSLA(string RecordID)
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
