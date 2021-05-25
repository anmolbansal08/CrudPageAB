using CargoFlash.Cargo.Model.Tariff;
using CargoFlash.SoftwareFactory.WebUI;
using CargoFlash.SoftwareFactory.WebUI.Adapters;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CargoFlash.Cargo.WebUI.Rate
{
    public class RateGlobalDueCarrierManagementWebUI : BaseWebUISecureObject
    {
        public RateGlobalDueCarrierManagementWebUI()
        {
            try
            {
                this.MyModuleID = "Rate";
                this.MyAppID = "RateGlobalDueCarrier";
                this.MyPrimaryID = "SNo";
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
                    g.CommandButtonNewText = "New Due Carrier Global Rate";
                    g.FormCaptionText = "Due Carrier Global Rate";
                    g.ServiceModuleName = this.MyModuleID;
                    g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                    g.Column = new List<GridColumn>();
                    g.Column.Add(new GridColumn { Field = "Airline", Title = "Airline Name", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "OriginIATA", Title = "Origin IATA Code", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "DestinationIATA", Title = "Destination IATA Code", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "OriginCountry", Title = "Origin Country Code", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "DestinationCountry", Title = "Destination Country Code", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "OriginAirPort", Title = "Origin AirPort Code", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "DestinationAirPort", Title = "Destination AirPort Code", DataType = GridDataType.String.ToString() });
                    g.Column.Add(new GridColumn { Field = "Active", Title = "Active", DataType = GridDataType.String.ToString() });
                    g.InstantiateIn(Container);
                }
            }
            catch (Exception ex)
            {
                ApplicationWebUI applicationWebUI = new ApplicationWebUI();
                applicationWebUI.InsertExceptionIntoDatabase(true, ex, this.GetType());

            }
        }

        public StringBuilder CreateWebForm(StringBuilder container)
        {
            StringBuilder strContent = new StringBuilder();
            try
            {
                if (System.Web.HttpContext.Current.Request.QueryString["FormAction"] != null)
                {
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

        public override void BuildFormView(string DisplayMode, StringBuilder container)
        {
            try
            {
                using (HtmlFormAdapter htmlFormAdapter = new HtmlFormAdapter(MyModuleID))
                {
                    htmlFormAdapter.CurrentPage = this.CurrentPageContext;
                    htmlFormAdapter.HeadingColumnName = "Airline";
                    switch (DisplayMode)
                    {
                        case DisplayModeReadView:
                            htmlFormAdapter.DisplayMode = DisplayModeType.ReadOnly;
                            htmlFormAdapter.objFormData = GetRecordRateGlobalDueCarrier();
                            htmlFormAdapter.CommandDeleteURL = MyPageName + "?" + GetWebURLString("DELETE", true);
                            htmlFormAdapter.CommandEditURL = MyPageName + "?" + GetWebURLString("Edit", true);
                            htmlFormAdapter.CommandDuplicateURL = MyPageName + "?" + GetWebURLString("DUPLICATE", true);
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(ReadRateGlobalDueCarrierTransPage(htmlFormAdapter.InstantiateIn()));

                            break;
                        case DisplayModeDuplicate:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.objFormData = GetRecordRateGlobalDueCarrier();
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            //container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append(CreateRateGlobalDueCarrierTransPage(htmlFormAdapter.InstantiateIn()));
                            break;
                        case DisplayModeEdit:
                            htmlFormAdapter.DisplayMode = DisplayModeType.Edit;
                            htmlFormAdapter.objFormData = GetRecordRateGlobalDueCarrier();
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            container.Append(CreateRateGlobalDueCarrierTransPage(htmlFormAdapter.InstantiateIn()));
                            break;
                        case DisplayModeNew:
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            //container.Append(htmlFormAdapter.InstantiateIn());
                            container.Append(CreateRateGlobalDueCarrierTransPage(htmlFormAdapter.InstantiateIn()));
                            break;
                        case DisplayModeDelete:
                            htmlFormAdapter.DisplayMode = DisplayModeType.Delete;
                            htmlFormAdapter.CommandCancelURL = MyPageName + "?" + GetWebURLString("INDEXVIEW", false);
                            htmlFormAdapter.objFormData = GetRecordRateGlobalDueCarrier();
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
        }


        public StringBuilder ReadRateGlobalDueCarrierTransPage(StringBuilder container)
        {
            StringBuilder containerLocal = new StringBuilder();
            containerLocal.Append(@"
    <div id='MainDiv'>
        <div id='ApplicationTabs'>
            <ul>
                <li  id='liRateGlobalDueCarrier' class='k-state-active'>Due Carrier Global Rate</li>
                <li id='liRateGlobalDueCarrierTrans' onclick='javascript:RateGlobalDueCarrierTransGrid();'>Global Due Carrier Details</li>
            </ul>
            <div id='divTab1' > 
              <span id='spnRateGlobalDueCarrier'>");
            containerLocal.Append(container);
            containerLocal.Append(@"</span> 
            </div>
             <div id='divTab2'>
                <span id='spnRateGlobalDueCarrierNew'><input id='hdnPageType' name='hdnPageType' type='hidden' value='View'/><input id='hdnRateGlobalDuecarrierSNo' name='hdnRateGlobalDuecarrierSNo' type='hidden' value='" + this.MyRecordID + "'/><table id='tblRateGlobalDueCarrierTrans'></table></span></div></div></div>");
            return containerLocal;
        }

        public StringBuilder CreateRateGlobalDueCarrierTransPage(StringBuilder container)
        {

            StringBuilder containerLocal = new StringBuilder();
            containerLocal.Append(@"
    <div id='MainDiv'>
        <div id='ApplicationTabs'>
            <ul>
                <li  id='liRateGlobalDueCarrier' class='k-state-active'>Due Carrier Global Rate</li>
                <li id='liRateGlobalDueCarrierTrans' onclick='javascript:RateGlobalDueCarrierTransGrid();'>Global Due Carrier Details</li>
            </ul>
            <div id='divTab1' > 
              <span id='spnRateGlobalDueCarrier'>");
            containerLocal.Append(container);
            containerLocal.Append(@"</span> 
            </div>
             <div id='divTab2'>
                <span id='spnRateGlobalDueCarrierNew'><input id='hdnPageType' name='hdnPageType' type='hidden' value='" + this.FormAction.ToString().ToUpper().Trim() + "'/><input id='hdnRateGlobalDuecarrierSNo' name='hdnRateGlobalDuecarrierSNo' type='hidden' value='" + this.MyRecordID + "'/><input id='hdnPageSize' name='hdnPageSize' type='hidden'  value='" + this.MyRecordID + "'/><input id='hdnCreatedBy' name='hdnCreatedBy' type='hidden' value='" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString() + "'/><input id='hdnUpdatedBy' name='hdnUpdatedBy' type='hidden' value='" + ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString() + "'/><table id='tblRateGlobalDueCarrierTrans'></table></span></div></div></div>");

            return containerLocal;
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
                        SaveRateGlobalDueCarrier();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2000), false);
                        break;
                    case DisplayModeSaveAndNew:
                        SaveRateGlobalDueCarrier();
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("NEW", false, 2000), false);
                        break;
                    case DisplayModeUpdate:
                        UpdateRateGlobalDueCarrier(Convert.ToInt32(System.Web.HttpContext.Current.Request.QueryString["RecID"]));
                        if (string.IsNullOrEmpty(ErrorMessage))
                            System.Web.HttpContext.Current.Response.Redirect(MyPageName + "?" + GetWebURLString("INDEXVIEW", false, 2001), false);
                        break;

                    case DisplayModeDelete:
                        DeleteRateGlobalDueCarrier(System.Web.HttpContext.Current.Request.QueryString["RecID"]);
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

        public object GetRecordRateGlobalDueCarrier()
        {
            object RateGlobalDueCarrier = null;

            try
            {

                if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.QueryString["RecID"]))
                {
                    RateGlobalDueCarrier RateExchangeDueCarrierList = new RateGlobalDueCarrier();
                    object obj = (object)RateExchangeDueCarrierList;
                    //retrieve Entity from Database according to the record
                    RateGlobalDueCarrier = DataGetRecordService(System.Web.HttpContext.Current.Request.QueryString["RecID"], obj, MyModuleID);
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

            } return RateGlobalDueCarrier;
        }


        /// <summary>
        /// Insert new RateGlobalDueCarrier record into the database
        /// Retrieve information from webform and store the same into modal object
        /// call webservice to save that data into the database
        /// </summary>
        private void SaveRateGlobalDueCarrier()
        {
            try
            {
                List<RateGlobalDueCarrier> listRateGlobalDueCarrier = new List<RateGlobalDueCarrier>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var RateGlobalDueCarrier = new RateGlobalDueCarrier
                {
                    AirlineSNo = Convert.ToInt32(FormElement["AirlineSNo"].ToString()),

                    OriginIATASNo = Convert.ToInt32(FormElement["OriginIATASNo"].ToString() == string.Empty ? "0" : FormElement["OriginIATASNo"].ToString()),
                    DestinationIATASNo = Convert.ToInt32(FormElement["DestinationIATASNo"].ToString() == string.Empty ? "0" : FormElement["DestinationIATASNo"].ToString()),

                    OriginCountrySNo = Convert.ToInt32(FormElement["OriginCountrySNo"].ToString() == string.Empty ? "0" : FormElement["OriginCountrySNo"].ToString()),
                    DestinationCountrySNo = Convert.ToInt32(FormElement["DestinationCountrySNo"].ToString() == string.Empty ? "0" : FormElement["DestinationCountrySNo"].ToString()),


                    OriginAirportSNo = Convert.ToInt32(FormElement["OriginAirportSNo"].ToString() == string.Empty ? "0" : FormElement["OriginAirportSNo"].ToString()),
                    DestinationAirportSNo = Convert.ToInt32(FormElement["DestinationAirportSNo"].ToString() == string.Empty ? "0" : FormElement["DestinationAirportSNo"].ToString()),



                    IsActive = FormElement["IsActive"] == "0",
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                };
                listRateGlobalDueCarrier.Add(RateGlobalDueCarrier);
                object datalist = (object)listRateGlobalDueCarrier;
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
        /// Update RateGlobalDueCarrier record into the database
        /// Retrieve information from webform and store the same into modal object
        /// call webservice to update that data into the database
        /// </summary>
        /// <param name="RecordID"></param>
        private void UpdateRateGlobalDueCarrier(int RecordID)
        {
            try
            {
                List<RateGlobalDueCarrier> listRateGlobalDueCarrier = new List<RateGlobalDueCarrier>();
                var FormElement = System.Web.HttpContext.Current.Request.Form;
                var RateGlobalDueCarrier = new RateGlobalDueCarrier
                {
                    SNo = Convert.ToInt32(RecordID),
                    AirlineSNo = Convert.ToInt32(FormElement["AirlineSNo"].ToString()),

                    OriginIATASNo = Convert.ToInt32(FormElement["OriginIATASNo"].ToString() == string.Empty ? "0" : FormElement["OriginIATASNo"].ToString()),
                    DestinationIATASNo = Convert.ToInt32(FormElement["DestinationIATASNo"].ToString() == string.Empty ? "0" : FormElement["DestinationIATASNo"].ToString()),

                    OriginCountrySNo = Convert.ToInt32(FormElement["OriginCountrySNo"].ToString() == string.Empty ? "0" : FormElement["OriginCountrySNo"].ToString()),
                    DestinationCountrySNo = Convert.ToInt32(FormElement["DestinationCountrySNo"].ToString() == string.Empty ? "0" : FormElement["DestinationCountrySNo"].ToString()),


                    OriginAirportSNo = Convert.ToInt32(FormElement["OriginAirportSNo"].ToString() == string.Empty ? "0" : FormElement["OriginAirportSNo"].ToString()),
                    DestinationAirportSNo = Convert.ToInt32(FormElement["DestinationAirportSNo"].ToString() == string.Empty ? "0" : FormElement["DestinationAirportSNo"].ToString()),



                    IsActive = FormElement["IsActive"] == "0",
                    CreatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                    UpdatedBy = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).UserSNo.ToString(),
                };
                listRateGlobalDueCarrier.Add(RateGlobalDueCarrier);
                object datalist = (object)listRateGlobalDueCarrier;
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
        /// Delete RateGlobalDueCarrier record from the database 
        /// call webservice to update that data into the database 
        /// </summary>
        /// <param name="RecordID"></param>
        private void DeleteRateGlobalDueCarrier(string RecordID)
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
