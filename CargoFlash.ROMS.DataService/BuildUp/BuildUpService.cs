using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using CargoFlash.Cargo.Model.BuildUp;
using CargoFlash.SoftwareFactory.Data;
using CargoFlash.Cargo.Business;
using CargoFlash.Cargo.Model;
using CargoFlash.SoftwareFactory.WebUI.Controls;
using System.IO;
using CargoFlash.SoftwareFactory.WebUI.Adapters;
using CargoFlash.SoftwareFactory.WebUI;
using System.Net;

namespace CargoFlash.Cargo.DataService.BuildUp
{

    [ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class BuildUpService : BaseWebUISecureObject, IBuildUpService
    {
        #region BuildUp

        public Stream GetWebForm(WebFormBuildUpRequest model)
        {
            return BuildWebForm(model.processName, model.moduleName, model.appName, model.Action, "", (model.IsSubModule == "1"));
        }

        private Stream BuildWebForm(string processName, string moduleName, string appName, string formAction, string recordID = "", bool IsSubModule = true, string FlightNo = "", string FlightDate = "", string LoggedInCity = "", string Origin = "", string Destination = "", string AWBNo = "", string DailyFlightSNo = "", string ULDStockSNo = "")
        {
            this.DisplayMode = "FORMACTION." + formAction.ToUpper().Trim();
            StringBuilder myCurrentForm = new StringBuilder();
            switch (this.DisplayMode)
            {
                case DisplayModeNew:
                    if (processName.ToUpper() == "AGENTBUILDUP")
                    {
                        using (HtmlFormGenerator htmlFormAdapter = new HtmlFormGenerator(processName))
                        {
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            myCurrentForm.Append(htmlFormAdapter.InstantiateIn(moduleName, appName, formAction, IsSubModule: IsSubModule));
                        }
                    }
                    else if (processName.ToUpper() == "ULDDETAILS")
                    {
                        using (HtmlFormGenerator htmlFormAdapter = new HtmlFormGenerator(processName))
                        {
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            myCurrentForm.Append(htmlFormAdapter.InstantiateIn(moduleName, appName, formAction, IsSubModule: IsSubModule));
                            myCurrentForm.Append("<input type='button' class='btn btn-block btn-success btn-sm' name='btnPrintULD' id='btnPrintULD' onclick='PrintULDTag();' style='width:120px;' value='Print ULD Tag'>");
                            myCurrentForm.Append("<button class='btn btn-block btn-success btn-sm'  id='btnSaveULD' onclick='SaveBuildUpPlan();'>Save</button>");
                        }
                    }
                    else if (processName.ToUpper() == "FLIGHTDETAILS")
                    {
                        using (HtmlFormGenerator htmlFormAdapter = new HtmlFormGenerator(processName))
                        {
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            myCurrentForm.Append("<table class='WebFormTable'><tr><td style='width:100%;vertical-align:top;'><div id='divFlightSection' style='width:100%;vertical-align:top;'>");
                            myCurrentForm.Append(htmlFormAdapter.InstantiateIn(moduleName, appName, formAction, IsSubModule: IsSubModule));

                            myCurrentForm.Append("</div></td></tr>");
                        }
                        //myCurrentForm.Append("<td style='width:45%;vertical-align:top;' rowspan='2'><div id='divNonUldShipmentSection' style='width:100%;vertical-align:top;'></div><div id='divLyingListSearchSection' style='width:100%;vertical-align:top;'></div><div id='divLyingListSection'></div></td></tr>");
                        myCurrentForm.Append("<tr><td style='width:100%;vertical-align:top;'><div id='divAddUldShipmentSection'></div></td></tr>");
                        myCurrentForm.Append("</table>");
                    }
                    else
                    {
                        using (HtmlFormGenerator htmlFormAdapter = new HtmlFormGenerator(processName))
                        {
                            htmlFormAdapter.DisplayMode = DisplayModeType.New;
                            myCurrentForm.Append("<table class='WebFormTable'><tr><td style='width:50%;vertical-align:top;'><table class='WebFormTable'><tr><td  style='vertical-align:top;' colspan='2'><div id='divAddUldSection' style='width:100%;vertical-align:top;'>");
                            myCurrentForm.Append(htmlFormAdapter.InstantiateIn(moduleName, appName, formAction, IsSubModule: IsSubModule));
                            myCurrentForm.Append("</div></td></tr>");
                            myCurrentForm.Append("<tr><td style='width:90%;vertical-align:top;'><div id='divUldShipmentSection'></div></td><td style='width:10%;vertical-align:middle;'><div id='divShipmentMoveSection' style='width:50%;vertical-align:top;float:right;'>");
                            myCurrentForm.Append("<span class='rightmovableme' data-action='fromuldmove' style='position:relative;'>");
                            myCurrentForm.Append("<i class='fa fa-arrow-circle-right hit'></i></span>");
                            myCurrentForm.Append("<span class='leftmovableme' data-action='touldmove' style='position:relative;'>");
                            myCurrentForm.Append("<i class='fa fa-arrow-circle-left hit'></i></span>");
                            myCurrentForm.Append("</div></td></tr></table></td>");
                        }
                        myCurrentForm.Append("<td style='width:50%;vertical-align:top;' rowspan='2'><div id='divDetail'></div><div id='ApplicationTabs'><ul><li class='k-state-active'>Build Up</li><li>Lying List</li></ul><div id='divBuildUpPlan' style='width:95%;vertical-align:top;'><div id='divNonUldShipmentSection' style='width:98%;vertical-align:top;'></div></div><div id='divLyingList' style='width:95%;vertical-align:top;'><div id='divLyingListSearchSection' style='width:98%;vertical-align:top;'></div><div id='divLyingListSection' style='width:98%;vertical-align:top;'></div></div></div></td></tr>");
                        myCurrentForm.Append("</table>");
                    }
                    break;
                case DisplayModeSearch:
                    using (HtmlFormGenerator htmlFormAdapter = new HtmlFormGenerator(processName))
                    {
                        htmlFormAdapter.DisplayMode = DisplayModeType.Search;
                        myCurrentForm.Append(htmlFormAdapter.InstantiateIn(moduleName, appName, formAction, IsSubModule: IsSubModule));
                        UserLogin user = ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"]));
                        string userDetails = user.UserSNo.ToString() + "#" + user.UserName + "#" + user.CityCode + "#" + user.CitySNo;
                        myCurrentForm.Append("<input type='hidden' id='hdn_userInfo' value='" + userDetails + "'>");
                    }
                    break;
                case DisplayModeDuplicate:

                    break;
                case DisplayModeEdit:

                    break;
                case DisplayModeDelete:

                    break;
                case DisplayModeIndexView:
                    switch (processName)
                    {
                        case "BUILDUP":
                            if (appName.ToUpper().Trim() == "SEARCHBUILDUP")
                                CreateBuildupGrid(myCurrentForm, DailyFlightSNo, isV2: true);
                            else if (appName.ToUpper().Trim() == "SEARCHBUILDUPULD")
                                CreateBuildupULDGrid(myCurrentForm, DailyFlightSNo);
                            else if (appName.ToUpper().Trim() == "SEARCHLYINGLIST")
                                CreateLyingListGrid(myCurrentForm, FlightNo, FlightDate, Origin, Destination, AWBNo, LoggedInCity, DailyFlightSNo, isV2: true);
                            else if (appName.ToUpper().Trim() == "OFFLOADFROMPROCESS")
                                CreateProcessOffloadListGrid(myCurrentForm);
                            else if (appName.ToUpper().Trim() == "SEARCHBUILDUPOFFLOADEDULD")
                                CreateBuildupOffloadedULDGrid(myCurrentForm, DailyFlightSNo, ULDStockSNo);
                            break;
                        default:
                            break;
                    }
                    break;
                case DisplayModeReadView:

                    break;
                default:
                    break;
            }
            byte[] resultMyForm = Encoding.UTF8.GetBytes(myCurrentForm.ToString());
            WebOperationContext.Current.OutgoingResponse.ContentType = "text/html";
            return new MemoryStream(resultMyForm);
        }

        public Stream GetBuildupGridData(WebFormBuildWebFormRequest model)
        {
            return BuildWebForm(model.processName, model.moduleName, model.appName, "IndexView", DailyFlightSNo: model.DailyFlightSNo);
        }

        public Stream GetLyingListGridData(WebFormBuildUpRequestLyingListGrid model)
        {
            return BuildWebForm(model.processName, model.moduleName, model.appName, "IndexView", FlightNo: model.FlightNo, FlightDate: model.FlightDate, Origin: model.Origin, Destination: model.Destination, AWBNo: model.AWBNo, LoggedInCity: model.LoggedInCity, DailyFlightSNo: model.DailyFlightSNo);
        }

        public Stream GetBuildupULDGridData(WebFormBuildWebFormRequest model)
        {
            return BuildWebForm(model.processName, model.moduleName, model.appName, "IndexView", DailyFlightSNo: model.DailyFlightSNo);
        }

        private void CreateBuildupGrid(StringBuilder Container, string DailyFlightSNo = "", bool isV2 = false)
        {
            using (Grid g = new Grid())
            {
                g.Height = 300;
                g.IsAutoHeight = false;
                g.PageName = this.MyPageName;
                g.PrimaryID = this.MyPrimaryID;
                g.ModuleName = this.MyModuleID;
                g.AppsName = this.MyAppID;
                g.IsDisplayOnly = true;
                g.DefaultPageSize = 1000;
                g.IsAllowCopy = false;
                g.DataSoruceUrl = "Services/BuildUp/BuildUpProcessService.svc/GetGridData";
                g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                g.ServiceModuleName = this.MyModuleID;
                g.UserID = this.MyUserID;
                g.FormCaptionText = "Build Up Plan";
                g.IsPageable = true;
                g.IsAllowedPaging = true;
                g.IsProcessPart = true;
                // g.IsRowChange = true;
                g.IsRowDataBound = false;
                g.IsPageSizeChange = false;
                g.IsPager = false;
                g.IsOnlyTotalDisplay = true;
                g.ProcessName = "Buildup";
                g.IsRefresh = false;
                g.IsAllowedSorting = false;
                g.SuccessOnBlank = "AttachUnBilledShipment";

                g.Column = new List<GridColumn>();
                g.Column.Add(new GridColumn { Field = "AWBSNo", Title = "SNo", IsHidden = true, DataType = GridDataType.Number.ToString() });
                g.Column.Add(new GridColumn { Field = "FPSNo", Title = "FPSNo", IsHidden = true, DataType = GridDataType.Number.ToString() });
                g.Column.Add(new GridColumn { Field = "MCBookingSNo", Title = "MCBookingSNo", IsHidden = true, DataType = GridDataType.Number.ToString() });
                //g.Column.Add(new GridColumn { Field = "IsChanged", Title = "IsChanged", DataType = GridDataType.Boolean.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "AWBSNo", Template = "<input type=\"checkbox\" id=\"chkSelect_#=AWBSNo#\" onclick=\"CheckUnPlanShipment(this,#=MCBookingSNo#);\" /> ", Title = "Select", Sortable = "false", DataType = GridDataType.String.ToString(), Width = 25 });

                g.Column.Add(new GridColumn { Field = "AWBNo", Tooltip = "AWBNo", Title = "AWB No", DataType = GridDataType.String.ToString(), Width = 90 });
                //g.Column.Add(new GridColumn { Field = "Pieces", Template = "<input type=\"text\" value=\"#=Pieces#\" /> ", Title = "Pieces", DataType = GridDataType.String.ToString(), Width = 90 });
                g.Column.Add(new GridColumn { Field = "LIPieces", Title = "Pieces", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "Pieces", Title = "Pieces", FixTooltip = "Available / Total", DataType = GridDataType.String.ToString(), Width = 50 });
                g.Column.Add(new GridColumn { Field = "GrossWeight", Title = "Gross Weight", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "VolumeWeight", Title = "Volume Weight", DataType = GridDataType.String.ToString(), IsHidden = true });

                g.Column.Add(new GridColumn { Field = "WeightDetail", Title = "Wt. Detail", FixTooltip = "Gross / Volume", DataType = GridDataType.String.ToString(), Width = 80 });

                g.Column.Add(new GridColumn { Field = "LoadDetail", Template = "<input type=\"text\" id=\"txtPcs\" maxlength=\"5\" value=\"#=LoadPieces#\" onblur=CalculateValues(this);fn_GetPOMAilDNDetails(this,#=AWBPieces#,#=MCBookingSNo#) style=\"width:30px\" />/<input type=\"text\" id=\"txtGross\" value=\"#=LoadGrossWeight#\" onblur=\"CheckGrossValues(this);\"  style=\"width:30px\"/>/<input type=\"text\" id=\"txtVol\" value=\"#=LoadVol#\" onblur=\"CheckVolValues(this);\"  style=\"width:35px\"/> ", Title = "Load Detail(Pcs/Gr. Wt/Vol. Wt)", DataType = GridDataType.Number.ToString(), Width = 110 });

                g.Column.Add(new GridColumn { Field = "LoadPieces", Title = "Load Pcs", DataType = GridDataType.Number.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "LoadGrossWeight", Title = "Load Gr. Wt", DataType = GridDataType.Number.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "LoadVol", Title = "Load Vol. Wt", DataType = GridDataType.Number.ToString(), IsHidden = true });

                g.Column.Add(new GridColumn { Field = "Priority", Title = "Priority", Tooltip = "Priority", DataType = GridDataType.String.ToString(), Width = 50 });

                g.Column.Add(new GridColumn { Field = "SPHC", Title = "SHC", Tooltip = "SPHC", DataType = GridDataType.String.ToString(), Width = 30 });
                //g.Column.Add(new GridColumn { Field = "Commodity", Title = "Commodity", DataType = GridDataType.String.ToString(), Width = 90 });
                g.Column.Add(new GridColumn { Field = "Plan", Title = "Plan", DataType = GridDataType.String.ToString(), Width = 35 });

                g.Column.Add(new GridColumn { Field = "ShipmentType", Title = "Type", FixTooltip = "ShipmentType", DataType = GridDataType.String.ToString(), Width = 50 });

                g.Column.Add(new GridColumn { Field = "ShipmentDetail", Title = "Sector", FixTooltip = "[Origin]-[Destination]", DataType = GridDataType.String.ToString(), Width = 60 });
                g.Column.Add(new GridColumn { Field = "FromTable", Title = "From", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "FromTableSNo", Title = "From", DataType = GridDataType.String.ToString(), IsHidden = true });

                g.Column.Add(new GridColumn { Field = "AWBPieces", Title = "AWBPieces", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "AWBGrossWeight", Title = "AWB Gross Weight", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "AWBVolumeWeight", Title = "AWB Volume Weight", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "OffloadStage", Title = "OffloadStage", DataType = GridDataType.String.ToString(), IsHidden = true });
                //g.Column.Add(new GridColumn { Field = "DailyFlightSNo", Title = "DailyFlightSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "Status", Title = "Status", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "CBM", Title = "CBM", DataType = GridDataType.String.ToString(), IsHidden = true });
                //g.Column.Add(new GridColumn { Field = "CBM", Title = "CBM", Template = "<input type=\"label\" id=\"CBM\" value=\"#= CBM #\">", DataType = GridDataType.String.ToString(), Width = 50, IsHidden = true });
                g.Column.Add(new GridColumn { Field = "AWBCBM", Title = "AWBCBM", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "LoadCBM", Title = "Load CBM", IsHidden = true, DataType = GridDataType.Number.ToString() });
                //g.Column.Add(new GridColumn { Field = "AWBSNo", Title = "Action", Template = "<a id=\"#=ShipmentId#\" onclick=\"fnMoveToLoadingInstruction(this);\"><i class=\"fa fa-mail-forward\" style=\"font-size:15px;\" title=\"Move to Lying List\"></i></a>", DataType = GridDataType.String.ToString(), Width = 50 });
                //g.Column.Add(new GridColumn { Field = "Action", Title = "Action", Template = "# if(Action == 0) {#  #}else{# <a id=\"#=ShipmentId#\" onclick=\"fnMoveToLyingList(this);\"><i class=\"fa fa-mail-forward\" style=\"font-size:15px;\" title=\"Move to Lying List\"></i></a> #} #", DataType = GridDataType.String.ToString(), Width = 30 });
                //g.Column.Add(new GridColumn { Field = "Action", Title = "Action", Template = "\"#=Action#\"", DataType = GridDataType.String.ToString(), Width = 30 });
                g.Column.Add(new GridColumn { Field = "Action", Title = "Action", Template = "#=Action#", DataType = GridDataType.String.ToString(), Width = 30 });
                g.Column.Add(new GridColumn { Field = "IsPlanned", Title = "IsPlanned", IsHidden = true, DataType = GridDataType.Number.ToString() });
                //g.Column.Add(new GridColumn { Field = "IsChanged", Title = "IsChanged", IsHidden = true, DataType = GridDataType.Number.ToString() });
                //g.Column.Add(new GridColumn { Field = "IsPlanned", Title = "IsPlanned", Template = "<input type=\"label\" id=\"hdnIsPlanned\" value=\"#=IsPlanned#\" />", IsHidden = true, DataType = GridDataType.Number.ToString() });
                //Template = "# if(ShipmentId == '0') {# "" #}else{# <a id=\"#=ShipmentId#\" onclick=\"fnMoveToLoadingInstruction(this);\"><i class=\"fa fa-mail-forward\" style=\"font-size:15px;\" title=\"Move to Lying List\"></i></a> #} #",
                g.ExtraParam = new List<GridExtraParam>();
                g.ExtraParam.Add(new GridExtraParam { Field = "DailyFlightSNo", Value = DailyFlightSNo });
                g.InstantiateIn(Container, isV2);

            }


        }

        private void CreateBuildupULDGrid(StringBuilder Container, string DailyFlightSNo)
        {
            using (NestedGrid g = new NestedGrid())
            {
                g.Height = 300;
                g.PageName = this.MyPageName;
                g.PrimaryID = this.MyPrimaryID;
                g.ModuleName = this.MyModuleID;
                g.AppsName = this.MyAppID;
                g.IsDisplayOnly = true;
                g.DefaultPageSize = 1500;
                g.IsAutoHeight = true;

                //g.IsAllowCopy = false;
                g.DataSoruceUrl = "Services/BuildUp/BuildUpProcessService.svc/GetULDGridData";
                g.PrimaryID = "ULDStockSNo";
                g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                g.ModuleName = this.MyModuleID;
                //g.UserID = this.MyUserID;
                g.FormCaptionText = "ULD/Bulk/Cart Details";
                g.IsFormHeader = false;
                g.IsModule = true;
                g.IsShowEdit = false;
                g.IsSaveChanges = false;
                g.IsAccordion = true;
                g.ReferenceId = "ULDStockSNo";
                g.IsToggleColumns = false;
                g.IsColumnMenu = false;
                g.DetailCollapse = "detailCollapse";
                g.DetailExpand = "detailExpand";
                //g.IsPageable = true;
                //g.IsAllowedPaging = true;
                //g.IsProcessPart = true;
                //g.IsRowChange = true;
                //g.IsRowDataBound = false;
                //g.IsPageSizeChange = false;
                //g.IsPager = false;
                //g.IsOnlyTotalDisplay = true;
                //g.ProcessName = "BUILDUPULD";
                //g.SuccessGrid = "AppendRow";

                g.Column = new List<GridColumn>();
                g.Column.Add(new GridColumn { Field = "ULDStockSNo", Title = "ULD No", IsHidden = true, DataType = GridDataType.Number.ToString() });
                g.Column.Add(new GridColumn { Field = "ULDNo", Title = "ULD No", DataType = GridDataType.String.ToString(), Width = 80 });
                g.Column.Add(new GridColumn { Field = "ULDWeight", FixTooltip = "ULD Wt (Empty / Gross / Vol)", Title = "ULD Wt (Empty / Gross / Vol)", IsHidden = false, DataType = GridDataType.String.ToString(), Width = 130 });
                g.Column.Add(new GridColumn { Field = "EmptyWeight", Title = "Emply Wt", FixTooltip = "Empty Wt", IsHidden = true, DataType = GridDataType.Number.ToString() });
                g.Column.Add(new GridColumn { Field = "MaxVolumeWeight", Title = "Max. Vol Weight", IsHidden = true, DataType = GridDataType.Number.ToString() });
                g.Column.Add(new GridColumn { Field = "MaxGrossWeight", Title = "Max. Gross Weight", IsHidden = true, DataType = GridDataType.Number.ToString() });

                g.Column.Add(new GridColumn { Field = "VolumeWeight", Title = "Volume Weight", IsHidden = true, DataType = GridDataType.Number.ToString() });
                g.Column.Add(new GridColumn { Field = "GrossWeight", Title = "GrossWeight", IsHidden = true, DataType = GridDataType.Number.ToString() });

                g.Column.Add(new GridColumn { Field = "Used", Title = "Used Wt. (Gross / Vol)", FixTooltip = "Used Wt. (Gross / Vol)", DataType = GridDataType.String.ToString(), Width = 100 });
                g.Column.Add(new GridColumn { Field = "Shipments", Title = "No Of Shipment", DataType = GridDataType.Number.ToString(), Width = 30, FixTooltip = "No Of Shipment" });

                g.Column.Add(new GridColumn { Field = "LastPoint", Title = "Off Point", FixTooltip = "Off Point", Template = "<input type=\"hidden\" name=\"offloadPoint_#=ULDStockSNo#\" id=\"offloadPoint_#=ULDStockSNo#\" value=\"#=LastPoint#\" /><input type=\"text\" class=\"\" name=\"Text_offloadPoint_#=ULDStockSNo#\" style=\"padding-right:5px\"  id=\"Text_offloadPoint_#=ULDStockSNo#\"  tabindex=1002  controltype=\"autocomplete\"   maxlength=\"10\" data-width=\"40px\" value=\"#=LastPoint#\" placeholder=\"City\" />", DataType = GridDataType.String.ToString(), Width = 40 });

                //g.Column.Add(new GridColumn { Field = "ConnectingFlight", Title = "Connecting Flight", FixTooltip = "Connecting Flight", Width = 50 });

                //g.Column.Add(new GridColumn { Field = "ConnectingFlight", Title = "Connecting Flight", FixTooltip = "Connecting Flight", DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "SHC", Title = "SHC", DataType = GridDataType.String.ToString(), Width = 30, FixTooltip = "SHC" });

                g.Column.Add(new GridColumn { Field = "Status", Title = "Action", Template = "# if( Status==\"Details\") {if (ULDNo==\"BULK\" && IsUWS==\"True\"){#<a onclick=\"ViewAssignEquipment(" + DailyFlightSNo + "); \" class=\"bulkdetails label label-info\" title=\"Equipment Assignment\"><i class=\"fa fa-edit\"></i></a>#}else if(ULDNo==\"BULK\"){#<a onclick=\"AssignEquipment(" + DailyFlightSNo + "); \" class=\"bulkdetails label label-info\" title=\"Equipment Assignment\"><i class=\"fa fa-edit\"></i></a>#}else{#<a class=\"details label label-info\" title=\"Equipment Assignment\"><i class=\"fa fa-edit\"></i></a>#} } else {#<a class=\"details label label-info\" title=\"Equipment Assignment\"><i class=\"fa fa-edit\"></i></a># }if (FlightStatus !=\"PRE\" ){#<a class=\"removed label label-danger\" title=\"Remove\"><i class=\"fa fa-trash-o\"></i></a>#}#&nbsp;&nbsp;<a id=\"#=ShipmentId#\" onclick=\"fnMoveToLyingList(this);\"><i class=\"fa fa-mail-forward\" style=\"font-size:15px;\" title=\"Move to Lying List\"></i></a>", DataType = GridDataType.String.ToString(), Width = 55 });//added for AssignEquipmentBulk
                //g.Column.Add(new GridColumn { Field = "Status", Title = "Action", Template = "# if( Status==\"Details\") {if (ULDNo==\"BULK\" && IsUWS==\"True\"){#<a onclick=\"ViewAssignEquipment(" + DailyFlightSNo + "); \" class=\"bulkdetails label label-info\" title=\"BulkDetails\"><i class=\"fa fa-edit\"></i></a>#}else if(ULDNo==\"BULK\"){#<a onclick=\"AssignEquipment(" + DailyFlightSNo + "); \" class=\"bulkdetails label label-info\" title=\"BulkDetails\"><i class=\"fa fa-edit\"></i></a>#}else{#<a class=\"details label label-info\" title=\"Details\"><i class=\"fa fa-edit\"></i></a>#} } else {#<a class=\"details label label-info\" title=\"Closed\"><i class=\"fa fa-edit\"></i></a># } # <a class=\"removed label label-danger\" title=\"Remove\"><i class=\"fa fa-trash-o\"></i></a>&nbsp;&nbsp;<a onclick=\"fnTransferToLoadingInstruction(this);\"><i class=\"fa fa-mail-forward\" style=\"font-size:15px;\" title=\"Move to LI\"></i></a>", DataType = GridDataType.String.ToString(), Width = 55 });//added for AssignEquipmentBulk

                g.Column.Add(new GridColumn { Field = "FromTable", Title = "From", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "FromTableSNo", Title = "From", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "IsBUP", Title = "IsBUP", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "ULDStatus", Title = "ULDStatus", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "IsCart", Title = "IsCart", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "EquipmentSNo", Title = "EquipmentSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.ParentSuccessGrid = "AttachEventForULD";
                g.ExtraParam = new List<GridExtraParams>();
                g.ExtraParam.Add(new GridExtraParams { Field = "DailyFlightSNo", Value = DailyFlightSNo });


                //#region Nested Grid Section

                g.NestedPrimaryID = "AWBSno";
                g.NestedModuleName = this.MyModuleID;
                g.NestedAppsName = this.MyAppID;
                g.NestedParentID = "ULDStockSNo";
                g.SuccessGrid = "GetSavedULDCapacity";
                g.NestedIsShowEdit = false;
                g.NestedDefaultPageSize = 1500;
                g.NestedHeight = 300;
                g.NestedIsPageable = false;
                g.IsNestedAllowedFiltering = false;
                g.IsNestedAllowedSorting = false;
                g.NestedDataSoruceUrl = "Services/BuildUp/BuildUpProcessService.svc/GetULDChildGridData";
                g.NestedSuccessOnBlank = "AttachProcessedShipment";
                g.SuccessGrid = "fnBuildUpSuccess";
                g.NestedColumn = new List<GridColumn>();

                g.NestedColumn.Add(new GridColumn { Field = "AWBSno", Title = "Select", DataType = GridDataType.Number.ToString(),Width = 20, Template = " <input type=\"checkbox\" id=\"chkAWB\" />" });
                //g.NestedColumn.Add(new GridColumn { Field = "IsChanged", Title = "IsChanged", DataType = GridDataType.Boolean.ToString(), IsHidden = true });
                //g.NestedColumn.Add(new GridColumn { Field = "AWBSno", Title = "Select", DataType = GridDataType.Number.ToString(), Width = 20, Template = "# if(IsChanged == true) {# <input type=\"checkbox\" id=\"chkAWB\" /> #}else{# <input type=\"checkbox\" id=\"chkAWB\" disabled=\"disabled\" /> #} #" });
                g.NestedColumn.Add(new GridColumn { Field = "AwbNo", Title = "AWB No", DataType = GridDataType.String.ToString(), Width = 80 });
                g.NestedColumn.Add(new GridColumn { Field = "Pieces", Title = "Pieces", DataType = GridDataType.Number.ToString(), Width = 25 });

                g.NestedColumn.Add(new GridColumn { Field = "GrossWeight", Title = "Gross Weight", DataType = GridDataType.Number.ToString(), Width = 30 });
                g.NestedColumn.Add(new GridColumn { Field = "VolumeWeight", Title = "Volume Weight", DataType = GridDataType.Number.ToString(), Width = 30 });
                g.NestedColumn.Add(new GridColumn { Field = "SPHC", Title = "SHC", DataType = GridDataType.String.ToString(), Width = 25 });

                g.NestedColumn.Add(new GridColumn { Field = "ShipmentType", Title = "Shipment Type", FixTooltip = "ShipmentType", DataType = GridDataType.String.ToString(), Width = 50 });

                g.NestedColumn.Add(new GridColumn { Field = "ShipmentDetail", Title = "Detail", DataType = GridDataType.String.ToString(), Width = 50 });
                g.Column.Add(new GridColumn { Field = "FromTable", Title = "From", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "FromTableSNo", Title = "From", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "FromTableTotalPieces", Title = "From", DataType = GridDataType.String.ToString(), IsHidden = true });

                g.Column.Add(new GridColumn { Field = "AWBPieces", Title = "AWBPieces", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "AWBGrossWeight", Title = "AWB Gross Weight", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "AWBVolumeWeight", Title = "AWB Volume Weight", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.NestedColumn.Add(new GridColumn { Field = "OffloadStage", Title = "Offload Stage", DataType = GridDataType.String.ToString(), IsHidden = true });

                g.NestedColumn.Add(new GridColumn { Field = "Priority", Title = "Priority", Tooltip = "Priority", DataType = GridDataType.String.ToString(), Width = 40 });

                g.NestedColumn.Add(new GridColumn { Field = "AWBOffPoint", Title = "Off Point", FixTooltip = "Off Point", Template = "<input type=\"hidden\" name=\"AWBOffPoint_#=ULDStockSNo#_#=AWBSno#\" id=\"AWBOffPoint_#=ULDStockSNo#_#=AWBSno#\" value=\"#=AWBOffPoint#\" /><input type=\"text\" class=\"\" name=\"Text_AWBOffPoint_#=ULDStockSNo#_#=AWBSno#\"  id=\"Text_AWBOffPoint_#=ULDStockSNo#_#=AWBSno#\"  controltype=\"autocomplete\"  style=\"padding-right:5px\" maxlength=\"10\" data-width=\"40px\" value=\"#=AWBOffPoint#\" placeholder=\"Off Point\" />", DataType = GridDataType.String.ToString(), Width = 40 });
                // Added by Vipin Kumar
                g.NestedColumn.Add(new GridColumn { Field = "Action", Title = "Action", Template = "#=Action#", DataType = GridDataType.String.ToString(), Width = 25 });
            
                //g.NestedColumn.Add(new GridColumn { Field = "AWBSno", Title = "Action", Template = "<a id=\"#=ShipmentId#\" onclick=\"fnMoveToLyingList(this);\"><i class=\"fa fa-mail-forward\" style=\"font-size:15px;\" title=\"Move to Lying List\"></i></a>", DataType = GridDataType.String.ToString(), Width = 50 });
                //g.NestedColumn.Add(new GridColumn { Field = "AWBSno", Title = "Action", Template = "<a onclick=\"fnMoveToLoadingInstruction(this);\"><i class=\"fa fa-mail-forward\" style=\"font-size:15px;\" title=\"Move to LI\"></i></a>", DataType = GridDataType.String.ToString(), Width = 50 });
                // Ends
                //g.NestedColumn.Add(new GridColumn { Field = "IsPlanned", Title = "IsPlanned", Template = "<input type=\"label\" id=\"hdnIsPlanned\" value=\"#=IsPlanned#\" />", IsHidden = true, DataType = GridDataType.Number.ToString() });
                g.NestedColumn.Add(new GridColumn { Field = "IsPlanned", Title = "IsPlanned", IsHidden = true, DataType = GridDataType.Number.ToString() });
                g.NestedColumn.Add(new GridColumn { Field = "HDQ", Title = "HDQ", Template = "#=HDQ#", DataType = GridDataType.String.ToString(), Width = 25 });
                g.NestedColumn.Add(new GridColumn { Field = "ConnectingFlight", Title = "Connecting Flight", IsHidden = true, FixTooltip = "Connecting Flight", Template = "<input type=\"hidden\" name=\"ConnectingFlight_#=ULDStockSNo#_#=AWBSno#\" id=\"ConnectingFlight_#=ULDStockSNo#_#=AWBSno#\" value=\"#=ConnectingFlight#\" /><input type=\"text\" class=\"\" name=\"Text_ConnectingFlight_#=ULDStockSNo#_#=AWBSno#\"  id=\"Text_ConnectingFlight_#=ULDStockSNo#_#=AWBSno#\"  controltype=\"autocomplete\"  style=\"padding-right:5px\" maxlength=\"10\" data-width=\"40px\" value=\"#=ConnectingFlight#\" placeholder=\"Connecting Flight\" />", DataType = GridDataType.String.ToString(), Width = 0 });

                g.NestedColumn.Add(new GridColumn { Field = "ConnectingFlightSNo", Title = "ConnectingFlightSNo", IsHidden = true, DataType = GridDataType.Number.ToString() });

                g.NestedColumn.Add(new GridColumn { Field = "FPSNo", Title = "FPSNo", Width = 0, IsHidden = true, DataType = GridDataType.Number.ToString() });

                g.NestedColumn.Add(new GridColumn { Field = "MCBookingSNo", Title = "MCBookingSNo", Width = 0, IsHidden = true, DataType = GridDataType.Number.ToString() });
                //g.NestedColumn.Add(new GridColumn { Field = "IsChanged", Title = "IsChanged", DataType = GridDataType.Boolean.ToString(), IsHidden = true });
                g.NestedColumn.Add(new GridColumn { Field = "Status", Title = "Status", Width = 0, DataType = GridDataType.String.ToString(), IsHidden = true });
                g.NestedColumn.Add(new GridColumn { Field = "CBM", Title = "CBM", Width = 0, DataType = GridDataType.String.ToString(), IsHidden = true });
                g.NestedColumn.Add(new GridColumn { Field = "AWBCBM", Title = "AWBCBM", Width = 0, DataType = GridDataType.String.ToString(), IsHidden = true });




                //g.NestedExtraParam
                g.NestedExtraParam = new List<NestedGridExtraParam>();
                g.NestedExtraParam.Add(new NestedGridExtraParam { Field = "DailyFlightSNo", Value = DailyFlightSNo });
                //#endregion


                g.InstantiateIn(Container);

            }
        }


        private void CreateBuildupOffloadedULDGrid(StringBuilder Container, string DailyFlightSNo,string ULDStockSNo)
        {
            using (NestedGrid g = new NestedGrid())
            {
                g.Height = 300;
                g.PageName = this.MyPageName;
                g.PrimaryID = this.MyPrimaryID;
                g.ModuleName = this.MyModuleID;
                g.AppsName = this.MyAppID;
                g.IsDisplayOnly = true;
                g.DefaultPageSize = 1500;
                g.IsAutoHeight = true;

                //g.IsAllowCopy = false;
                g.DataSoruceUrl = "Services/BuildUp/BuildUpProcessService.svc/GetOffloadedULDGridData";
                g.PrimaryID = "ULDStockSNo";
                g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                g.ModuleName = this.MyModuleID;
                //g.UserID = this.MyUserID;
                g.FormCaptionText = "ULD Details";
                g.IsFormHeader = false;
                g.IsModule = true;
                g.IsShowEdit = false;
                g.IsSaveChanges = false;
                g.IsAccordion = true;
                g.ReferenceId = "ULDStockSNo";
                g.IsToggleColumns = false;
                g.IsColumnMenu = false;
                g.DetailCollapse = "detailCollapse";
                g.DetailExpand = "detailExpand";
                //g.IsPageable = true;
                //g.IsAllowedPaging = true;
                //g.IsProcessPart = true;
                //g.IsRowChange = true;
                //g.IsRowDataBound = false;
                //g.IsPageSizeChange = false;
                //g.IsPager = false;
                //g.IsOnlyTotalDisplay = true;
                //g.ProcessName = "BUILDUPULD";
                //g.SuccessGrid = "AppendRow";

                g.Column = new List<GridColumn>();
                g.Column.Add(new GridColumn { Field = "ULDStockSNo", Template = "<input type=\"checkbox\" id=\"chkSelect_#=ULDStockSNo#\"  /> ", Title = "Action", Sortable = "false", DataType = GridDataType.String.ToString(), Width = 20 });
            
                g.Column.Add(new GridColumn { Field = "ULDStockSNo", Title = "ULD No", IsHidden = true, DataType = GridDataType.Number.ToString() });
                g.Column.Add(new GridColumn { Field = "ULDNo", Title = "ULD No", DataType = GridDataType.String.ToString(), Width = 80 });
                g.Column.Add(new GridColumn { Field = "Pieces", Title = "Pieces", DataType = GridDataType.Number.ToString() });
                g.Column.Add(new GridColumn { Field = "GrossWeight", Title = "Gross Weight", DataType = GridDataType.Number.ToString() });
                g.Column.Add(new GridColumn { Field = "VolumeWeight", Title = "Volume Weight", DataType = GridDataType.Number.ToString() });
               
               
            
                //g.Column.Add(new GridColumn { Field = "OriginAirportCode", Title = "Boarding Point", DataType = GridDataType.String.ToString(), Width = 80 });
                //g.Column.Add(new GridColumn { Field = "DestinationAirportCode", Title = "Off Point", DataType = GridDataType.String.ToString(), Width = 80 });

                g.ParentSuccessGrid = "AttachEventForULD";
                g.ExtraParam = new List<GridExtraParams>();
                g.ExtraParam.Add(new GridExtraParams { Field = "DailyFlightSNo", Value = DailyFlightSNo });
           

                //#region Nested Grid Section

                g.NestedPrimaryID = "AWBSno";
                g.NestedModuleName = this.MyModuleID;
                g.NestedAppsName = this.MyAppID;
                g.NestedParentID = "ULDStockSNo";
                g.SuccessGrid = "GetSavedULDCapacity";
                g.NestedIsShowEdit = false;
                g.NestedDefaultPageSize = 1500;
                g.NestedHeight = 300;
                g.NestedIsPageable = false;
                g.IsNestedAllowedFiltering = false;
                g.IsNestedAllowedSorting = false;
                g.NestedDataSoruceUrl = "Services/BuildUp/BuildUpProcessService.svc/GetOffloadedULDChildGridData";
                g.NestedSuccessOnBlank = "AttachProcessedShipment";
                g.SuccessGrid = "fnBuildUpSuccess";
                g.NestedColumn = new List<GridColumn>();

                //  g.NestedColumn.Add(new GridColumn { Field = "AWBSno", Title = "Select", DataType = GridDataType.Number.ToString(), Width = 20, Template = " <input type=\"checkbox\" id=\"chkAWB\" />" });
                //g.NestedColumn.Add(new GridColumn { Field = "IsChanged", Title = "IsChanged", DataType = GridDataType.Boolean.ToString(), IsHidden = true });
                //g.NestedColumn.Add(new GridColumn { Field = "AWBSno", Title = "Select", DataType = GridDataType.Number.ToString(), Width = 20, Template = "# if(IsChanged == true) {# <input type=\"checkbox\" id=\"chkAWB\" /> #}else{# <input type=\"checkbox\" id=\"chkAWB\" disabled=\"disabled\" /> #} #" });
                g.NestedColumn.Add(new GridColumn { Field = "AwbNo", Title = "AWB No", DataType = GridDataType.String.ToString(), Width = 80 });
                g.NestedColumn.Add(new GridColumn { Field = "AWBSector", Title = "AWB Sector", FixTooltip = "AWB Sector", DataType = GridDataType.String.ToString(), Width = 50 });

                
                g.NestedColumn.Add(new GridColumn { Field = "Pieces", Title = "Pieces", DataType = GridDataType.Number.ToString(), Width = 25 });

                g.NestedColumn.Add(new GridColumn { Field = "GrossWeight", Title = "Gross Weight", DataType = GridDataType.Number.ToString(), Width = 30 });
                g.NestedColumn.Add(new GridColumn { Field = "VolumeWeight", Title = "Volume Weight", DataType = GridDataType.Number.ToString(), Width = 30 });
                g.NestedColumn.Add(new GridColumn { Field = "SPHC", Title = "SHC", DataType = GridDataType.String.ToString(), Width = 25 });

           
               


                //g.NestedExtraParam
                g.NestedExtraParam = new List<NestedGridExtraParam>();
                g.NestedExtraParam.Add(new NestedGridExtraParam { Field = "DailyFlightSNo", Value = DailyFlightSNo });
                //g.NestedExtraParam.Add(new NestedGridExtraParam { Field = "ULDStockSNo", Value = ULDStockSNo });
                //#endregion


                g.InstantiateIn(Container);

            }
        }

        private void CreateLyingListGrid(StringBuilder Container, string FlightNo = "", string FlightDate = "", string Origin = "", string Destination = "", string AWBNo = "", string LoggedInCity = "", string DailyFlightSNo = "", bool isV2 = false)
        {
            using (Grid g = new Grid())
            {
                g.Height = 300;
                g.IsAutoHeight = false;
                g.PageName = this.MyPageName;
                g.PrimaryID = "SNo";
                g.ModuleName = this.MyModuleID;
                g.AppsName = this.MyAppID;
                g.IsDisplayOnly = true;
                g.DefaultPageSize = 1000;
                g.IsAllowCopy = false;
                g.DataSoruceUrl = "Services/BuildUp/BuildUpProcessService.svc/GetLyingListGridData";
                g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                g.ServiceModuleName = this.MyModuleID;
                g.UserID = this.MyUserID;
                g.FormCaptionText = "Lying List Shipment";
                g.IsPageable = true;
                g.IsAllowedPaging = true;
                g.IsProcessPart = true;
                g.IsRowChange = false;
                g.IsRowDataBound = false;
                g.IsPageSizeChange = false;
                g.IsPager = false;
                g.IsOnlyTotalDisplay = true;
                g.ProcessName = "LyingList";
                g.SuccessOnBlank = "AttachLyingListShipment";
                g.IsAllowedSorting = false;

                g.Column = new List<GridColumn>();
                g.Column.Add(new GridColumn { Field = "AWBSNo", Title = "SNo", Width = 0, IsHidden = true, DataType = GridDataType.Number.ToString() });
                g.Column.Add(new GridColumn { Field = "FPSNo", Title = "FPSNo", Width = 0, IsHidden = true, DataType = GridDataType.Number.ToString() });
                g.Column.Add(new GridColumn { Field = "MCBookingSNo", Title = "MCBookingSNo", Width = 0, IsHidden = true, DataType = GridDataType.Number.ToString() });

                //g.Column.Add(new GridColumn { Field = "IsChanged", Title = "IsChanged", DataType = GridDataType.Boolean.ToString(), IsHidden = true });

                g.Column.Add(new GridColumn { Field = "AWBSNo", Template = "<input type=\"checkbox\" id=\"chkSelect_#=AWBSNo#\" onclick=\"CheckUnPlanShipment(this,#=MCBookingSNo#);\" /> ", Title = "Action", Sortable = "false", DataType = GridDataType.String.ToString(), Width = 20 });

                g.Column.Add(new GridColumn { Field = "AWBNo", Tooltip = "AWBNo", Title = "AWB No", DataType = GridDataType.String.ToString(), Width = 85 });
                //g.Column.Add(new GridColumn { Field = "Pieces", Template = "<input type=\"text\" value=\"#=Pieces#\" /> ", Title = "Pieces", DataType = GridDataType.String.ToString(), Width = 90 });
                g.Column.Add(new GridColumn { Field = "LIPieces", Title = "Pieces", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "Pieces", Title = "Pieces", FixTooltip = "Available / Total", DataType = GridDataType.String.ToString(), Width = 50 });
                g.Column.Add(new GridColumn { Field = "GrossWeight", Title = "Gross Weight", Width = 0, IsHidden = true, DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "VolumeWeight", Title = "Volume Weight", Width = 0, IsHidden = true, DataType = GridDataType.String.ToString() });
                g.Column.Add(new GridColumn { Field = "WeightDetail", Title = "Wt. Detail", FixTooltip = "Gross / Volume", DataType = GridDataType.String.ToString(), Width = 80 });



                g.Column.Add(new GridColumn { Field = "LoadDetail", Template = "<input type=\"text\" value=\"#=LoadPieces#\" id=\"txtLPcs\" maxlength=\"5\"  onblur=CalculateLyingValues(this);fn_GetPOMAilDNDetails(this,#=AWBPieces#,#=MCBookingSNo#); style=\"width:20px\" />/<input type=\"text\" value=\"#=LoadGrossWeight#\" id=\"txtLGross\" onblur=\"CheckLyingGrossValues(this);\"  style=\"width:20px\"/>/<input type=\"text\" value=\"#=LoadVol#\" id=\"txtLVol\" onblur=\"CheckLyingVolValues(this);\"  style=\"width:35px\"/> ", Title = "Load Detail(Pcs/Gr. Wt/Vol. Wt)", DataType = GridDataType.Number.ToString(), Width = 110 });

                //g.Column.Add(new GridColumn { Field = "LoadDetail", Template = "<input type=\"text\" value=\"#=LoadPieces#\" id=\"txtLPcs\" maxlength=\"5\" onblur=CalculateLyingValues(this);fn_GetLyingPOMAilDNDetails(this,#=AWBPieces#,0,#=MCBookingSNo#,\"BUPOFLD\"); style=\"width:25px\" />/<input type=\"text\" value=\"#=LoadGrossWeight#\" id=\"txtLGross\" onblur=\"CheckLyingGrossValues(this);\"  style=\"width:35px\"/>/<input type=\"text\" value=\"#=LoadVol#\" id=\"txtLVol\" onblur=\"CheckLyingVolValues(this);\"  style=\"width:35px\"/> ", Title = "Load Detail", DataType = GridDataType.Number.ToString(), Width = 110 });




                g.Column.Add(new GridColumn { Field = "LoadPieces", Title = "Load Pcs", Width = 0, IsHidden = true, DataType = GridDataType.Number.ToString() });
                g.Column.Add(new GridColumn { Field = "LoadGrossWeight", Title = "Load Gr. Wt", Width = 0, IsHidden = true, DataType = GridDataType.Number.ToString() });
                g.Column.Add(new GridColumn { Field = "LoadVol", Title = "Load Vol. Wt", Width = 0, IsHidden = true, DataType = GridDataType.Number.ToString() });

                g.Column.Add(new GridColumn { Field = "SPHC", Title = "SHC", Tooltip = "SPHC", DataType = GridDataType.String.ToString(), Width = 30 });
                //g.Column.Add(new GridColumn { Field = "ShipmentDetail", Title = "Shipment Info", FixTooltip="[Origin]-[Destination]/[Flight No]/[Flight Date(dd-mm)]", DataType = GridDataType.String.ToString(), Width = 93 });

                g.Column.Add(new GridColumn { Field = "ShipmentType", Title = "Type", FixTooltip = "ShipmentType", DataType = GridDataType.String.ToString(), Width = 45 });

                g.Column.Add(new GridColumn { Field = "ShipmentDetail", Title = "Shipment Info", FixTooltip = "ShipmentDetail", DataType = GridDataType.String.ToString(), Width = 93 });
                //g.Column.Add(new GridColumn { Field = "Commodity", Title = "Commodity", DataType = GridDataType.String.ToString(), Width = 90 });
                //g.Column.Add(new GridColumn { Field = "Plan", Title = "Plan", DataType = GridDataType.String.ToString(), Width = 50 });
                g.Column.Add(new GridColumn { Field = "FromTable", Title = "From", DataType = GridDataType.String.ToString(), Width = 0, IsHidden = true });
                g.Column.Add(new GridColumn { Field = "FromTableSNo", Title = "From", DataType = GridDataType.String.ToString(), Width = 0, IsHidden = true });

                g.Column.Add(new GridColumn { Field = "AWBPieces", Title = "AWBPieces", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "AWBGrossWeight", Title = "AWB Gross Weight", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "AWBVolumeWeight", Title = "AWB Volume Weight", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "OffloadStage", Title = "Offload Stage", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "Priority", Title = "Priority", Tooltip = "Priority", DataType = GridDataType.String.ToString(), Width = 50 });
                g.Column.Add(new GridColumn { Field = "Status", Title = "Status", DataType = GridDataType.String.ToString(), Width = 50 });
                g.Column.Add(new GridColumn { Field = "CBM", Title = "CBM", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "AWBCBM", Title = "AWBCBM", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "LoadCBM", Title = "Load CBM", IsHidden = true, DataType = GridDataType.Number.ToString() });

                g.ExtraParam = new List<GridExtraParam>();
                g.ExtraParam.Add(new GridExtraParam { Field = "FlightNo", Value = FlightNo });
                g.ExtraParam.Add(new GridExtraParam { Field = "FlightDate", Value = FlightDate });
                g.ExtraParam.Add(new GridExtraParam { Field = "Origin", Value = Origin });
                g.ExtraParam.Add(new GridExtraParam { Field = "Destination", Value = Destination });
                g.ExtraParam.Add(new GridExtraParam { Field = "AWBNo", Value = AWBNo });
                g.ExtraParam.Add(new GridExtraParam { Field = "LoggedInCity", Value = LoggedInCity });
                g.ExtraParam.Add(new GridExtraParam { Field = "DailyFlightSNo", Value = DailyFlightSNo });
                g.InstantiateIn(Container, isV2);
            }
        }

        private void CreateProcessOffloadListGrid(StringBuilder Container)
        {
            using (Grid g = new Grid())
            {
                g.Height = 200;
                g.IsAutoHeight = false;
                g.PageName = this.MyPageName;
                g.PrimaryID = "SNo";
                g.ModuleName = this.MyModuleID;
                g.AppsName = this.MyAppID;
                g.IsDisplayOnly = true;
                g.DefaultPageSize = 10;
                g.IsAllowCopy = false;
                g.DataSoruceUrl = "Services/BuildUp/BuildUpProcessService.svc/GetOffloadListFromProcessGridData";
                g.NewURL = MyPageName + "?" + GetWebURLString("New", false);
                g.ServiceModuleName = this.MyModuleID;
                g.UserID = this.MyUserID;
                g.FormCaptionText = "Build Up :- Offload List";
                g.IsPageable = true;
                g.IsAllowedPaging = true;
                g.IsProcessPart = true;
                g.IsRowChange = true;
                g.IsRowDataBound = false;
                g.IsPageSizeChange = false;
                g.IsPager = false;
                g.IsOnlyTotalDisplay = true;
                g.ProcessName = "LyingList";
                g.IsRefresh = false;
                g.IsAllowedSorting = false;

                g.Column = new List<GridColumn>();
                g.Column.Add(new GridColumn { Field = "AWBSNo", Title = "SNo", IsHidden = true, DataType = GridDataType.Number.ToString() });
                g.Column.Add(new GridColumn { Field = "AWBSNo", Template = "<input type=\"checkbox\" id=\"chkSelect\" /> ", Title = "Select", Sortable = "false", DataType = GridDataType.String.ToString(), Width = 50 });

                g.Column.Add(new GridColumn { Field = "AWBNo", Title = "AWB No", DataType = GridDataType.String.ToString(), Width = 85 });
                //g.Column.Add(new GridColumn { Field = "Pieces", Template = "<input type=\"text\" value=\"#=Pieces#\" /> ", Title = "Pieces", DataType = GridDataType.String.ToString(), Width = 90 });
                g.Column.Add(new GridColumn { Field = "LIPieces", Title = "Pieces", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "GrossWeight", Title = "Gross Weight", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "VolumeWeight", Title = "Volume Weight", DataType = GridDataType.String.ToString(), IsHidden = true });

                //g.Column.Add(new GridColumn { Field = "LoadPieces", Title = "Load Pcs", DataType = GridDataType.Number.ToString(), IsHidden = true, Width = 50 });
                //g.Column.Add(new GridColumn { Field = "LoadGrossWeight", Title = "Load Gr. Wt", DataType = GridDataType.Number.ToString(), IsHidden = true, Width = 50 });
                //g.Column.Add(new GridColumn { Field = "LoadVol", Title = "Load Vol. Wt", DataType = GridDataType.Number.ToString(), IsHidden = true, Width = 50 });

                g.Column.Add(new GridColumn { Field = "Pieces", Template = "#=LIPieces# / #=GrossWeight# / #=VolumeWeight# ", Title = "Load Detail(Pcs/Gr. Wt/Vol. Wt)", DataType = GridDataType.Number.ToString(), Width = 130 });

                g.Column.Add(new GridColumn { Field = "LoadPieces", Template = "<input type=\"text\" value=\"#=LIPieces#\" onblur=\"CalculateOffloadValues(this);\" style=\"width:40px;\"/> / <span id=\"spnGrWt\">#=GrossWeight#</span> / <span id=\"spnVolWt\">#=VolumeWeight#</span> ", Title = "Load Detail(Pcs/Gr. Wt/Vol. Wt)", DataType = GridDataType.Number.ToString(), Width = 130 });

                g.Column.Add(new GridColumn { Field = "SPHC", Title = "SHC", DataType = GridDataType.String.ToString(), Width = 50 });
                //g.Column.Add(new GridColumn { Field = "Commodity", Title = "Commodity", DataType = GridDataType.String.ToString(), Width = 90 });
                g.Column.Add(new GridColumn { Field = "Plan", Title = "Plan", DataType = GridDataType.String.ToString(), Width = 50 });
                g.Column.Add(new GridColumn { Field = "FromTable", Title = "From", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "FromTableSNo", Title = "From", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.Column.Add(new GridColumn { Field = "DailyFlightSNo", Title = "DailyFlightSNo", DataType = GridDataType.String.ToString(), IsHidden = true });
                g.InstantiateIn(Container);
            }
        }

        #endregion
        //added for AssignEquipmentBulk
        public KeyValuePair<string, List<BuildUpBulkAssignEquipment>> GetBulkRecordForAssignEquipmentBuildUp(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@DailyFlightSNo", recordID), new SqlParameter("@CityCode", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).CityCode) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetBuildUp_BulkShipmentForAssignEquipment", Parameters);
                // return resultData.Tables[0].AsEnumerable().ToList();
                var BuildUpBulkAssignEquipmentGridList = ds.Tables[0].AsEnumerable().Select(e => new BuildUpBulkAssignEquipment
                {
                    SNo = e["SNo"].ToString(),
                    DailyFlightSNo = e["DailyFlightSNo"].ToString(),
                    HdnAWBNo = e["AWBSNo"].ToString(),
                    AWBNo = e["AWBNo"].ToString(),
                    // Text_AWBNo = e["AWBNo"].ToString(),
                    // TotalPieces = e["BuildPieces"].ToString(),
                    Pieces = e["Pieces"].ToString(),
                    //GrossWt = e["Quantity"].ToString(),
                    HdnEquipmentNo = e["EquipmentSNo"].ToString(),
                    EquipmentNo = e["EquipmentNo"].ToString(),
                    Text_EquipmentNo = "",



                });
                if (ds.Tables[0].Rows.Count == 0)
                {
                    return new KeyValuePair<string, List<BuildUpBulkAssignEquipment>>(ds.Tables[0].Rows.ToString(), BuildUpBulkAssignEquipmentGridList.AsQueryable().ToList());

                }
                else
                {

                    return new KeyValuePair<string, List<BuildUpBulkAssignEquipment>>(ds.Tables[0].Rows[0][0].ToString(), BuildUpBulkAssignEquipmentGridList.AsQueryable().ToList());
                }
            }
            catch
            {
                throw new WebFaultException<string>("Bad Request.", HttpStatusCode.BadRequest);
            }
        }
        public KeyValuePair<string, List<BuildUpViewBulkAssignEquipment>> GetViewBulkRecordForAssignEquipmentBuildUp(string recordID, int page, int pageSize, string whereCondition, string sort)
        {
            try
            {
                SqlParameter[] Parameters = { new SqlParameter("@DailyFlightSNo", recordID) };
                DataSet ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "GetBuildUp_ViewBulkShipmentForAssignEquipment", Parameters);
                // return resultData.Tables[0].AsEnumerable().ToList();
                var BuildUpBulkAssignEquipmentGridList = ds.Tables[0].AsEnumerable().Select(e => new BuildUpViewBulkAssignEquipment
                {
                    SNo = e["SNo"].ToString(),
                    DailyFlightSNo = e["DailyFlightSNo"].ToString(),
                    HdnAWBNo = e["AWBSNo"].ToString(),
                    AWBNo = e["AWBNo"].ToString(),
                    Text_AWBNo = e["AWBNo"].ToString(),
                    //  TotalPieces = e["BuildPieces"].ToString(),
                    Pieces = e["Pieces"].ToString(),
                    //GrossWt = e["Quantity"].ToString(),
                    HdnEquipmentNo = e["EquipmentSNo"].ToString(),
                    EquipmentNo = e["EquipmentNo"].ToString(),
                    Text_EquipmentNo = "",
                    FlightNo = e["FlightNo"].ToString(),
                    FlightDate = e["FlightDate"].ToString(),
                    OffPoint = e["OffPoint"].ToString(),
                    ScaleWeight = e["ScaleWeight"].ToString(),
                });
                return new KeyValuePair<string, List<BuildUpViewBulkAssignEquipment>>(ds.Tables[0].Rows[0][0].ToString(), BuildUpBulkAssignEquipmentGridList.AsQueryable().ToList());
            }
            catch
            {
                throw new WebFaultException<string>("Bad Request.", HttpStatusCode.BadRequest);
            }
        }

        public string ValidateBulkRecordForAssignEquipmentBuildUp(List<BuildUpBulkAssignEquipment> dataDetails)
        {

            string Result = "";
            DataSet ds = new DataSet();
            try
            {

                DataTable dtBuildUpBulkAssignEquipment = CollectionHelper.ConvertTo(dataDetails, "Text_AWBNo,Text_EquipmentNo");


                // foreach (DataRow row in dtBuildUpBulkAssignEquipment.Rows)
                // {
                //     string DailyFlightSNo = row["DailyFlightSNo"].ToString();

                //string []     DailyFlightSNoarr = DailyFlightSNo.Split(',');


                //if (DailyFlightSNoarr.Length>1)
                //     {
                //         row["DailyFlightSNo"] = DailyFlightSNoarr[0];
                //         DailyFlightSNoarr = null;
                //    }



                // }

                SqlParameter paramBuildUpBulkAssignEquipment = new SqlParameter();
                paramBuildUpBulkAssignEquipment.ParameterName = "@BuildUpBulkAssignEquipment";
                paramBuildUpBulkAssignEquipment.SqlDbType = System.Data.SqlDbType.Structured;
                paramBuildUpBulkAssignEquipment.Value = dtBuildUpBulkAssignEquipment;





                SqlParameter[] Parameters = { paramBuildUpBulkAssignEquipment, new SqlParameter("@CurrentCitySNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportSNo) };



                //SqlParameter[] Parameters = {
                //                           new SqlParameter("@BuildUpBulkAssignEquipment", dtBuildUpBulkAssignEquipment),
                //                           new SqlParameter("@CurrentCitySNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportSNo)

                //                        };


                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spValidateBulkRecordForAssignEquipmentBuildUp", Parameters);
                ds.Dispose();
                Result = CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)
            {
                Result = "{\"Table0\":[{\"Msg\":\"<tr><td>" + ex.Message.Replace(@"""", @"\""") + "</td></tr>\"},{\"IsValidate\":\"" + 0 + "\"}]}";
            }
            return Result;
        }
        public string SaveBulkRecordForAssignEquipmentBuildUp(List<BuildUpBulkAssignEquipment> dataDetails, List<BuildUpBulkAssignEquipmentScaleWeight> ScaleWeightData, string dailyFlightSNo, int AirportSNo, int UserSNo)
        {
            string Result = "";
            DataSet ds = new DataSet();
            try
            {
                DataTable dtBuildUpBulkAssignEquipment = CollectionHelper.ConvertTo(dataDetails, "Text_AWBNo,Text_EquipmentNo");


                //foreach (DataRow row in dtBuildUpBulkAssignEquipment.Rows)
                //{
                //    string DailyFlightSNo = row["DailyFlightSNo"].ToString();

                //    string[] DailyFlightSNoarr = DailyFlightSNo.Split(',');


                //    if (DailyFlightSNoarr.Length > 1)
                //    {
                //        row["DailyFlightSNo"] = DailyFlightSNoarr[0];
                //        DailyFlightSNoarr = null;
                //    }



                //}
                DataTable dtBuildUpBulkAssignEquipmentScaleWeight = CollectionHelper.ConvertTo(ScaleWeightData, "");
                SqlParameter paramBuildUpBulkAssignEquipment = new SqlParameter();
                paramBuildUpBulkAssignEquipment.ParameterName = "@BuildUpBulkAssignEquipment";
                paramBuildUpBulkAssignEquipment.SqlDbType = System.Data.SqlDbType.Structured;
                paramBuildUpBulkAssignEquipment.Value = dtBuildUpBulkAssignEquipment;

                SqlParameter paramBuildUpBulkAssignEquipmentScaleWeight = new SqlParameter();
                paramBuildUpBulkAssignEquipmentScaleWeight.ParameterName = "@BuildUpBulkAssignEquipmentScaleWeight";
                paramBuildUpBulkAssignEquipmentScaleWeight.SqlDbType = System.Data.SqlDbType.Structured;
                paramBuildUpBulkAssignEquipmentScaleWeight.Value = dtBuildUpBulkAssignEquipmentScaleWeight;

                SqlParameter[] Parameters = { paramBuildUpBulkAssignEquipment, paramBuildUpBulkAssignEquipmentScaleWeight, new SqlParameter("@DailyFlightSNo", dailyFlightSNo), new SqlParameter("@AirportSNo", AirportSNo), new SqlParameter("@UserSNo", UserSNo), new SqlParameter("@CurrentCitySNo", ((CargoFlash.Cargo.Model.UserLogin)(System.Web.HttpContext.Current.Session["UserDetail"])).AirportSNo) };
                ds = SqlHelper.ExecuteDataset(DMLConnectionString.WebConfigConnectionString, CommandType.StoredProcedure, "spSaveBulkRecordForAssignEquipmentBuildUp", Parameters);
                ds.Dispose();
                Result = CargoFlash.Cargo.Business.Common.CompleteDStoJSON(ds);
            }
            catch (Exception ex)
            {
                Result = "{\"Table0\":[{\"Msg\":\"<tr><td>" + ex.Message.Replace(@"""", @"\""") + "</td></tr>\",\"IsValidate\":\"" + 0 + "\"}]}";
            }
            return Result;
        }


    }
}
