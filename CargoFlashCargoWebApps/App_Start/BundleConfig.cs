using System.Web;
using System.Web.Optimization;

namespace CargoFlashCargoWebApps
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {

             

            #region Common Js Filess

            #region Space Control

            bundles.Add(new ScriptBundle("~/bundles/spacecontrol").Include(
                "~/JScript/SpaceControl/SpaceControl.js"
                   ));


            #endregion Space Control

            #region Schedule

            bundles.Add(new ScriptBundle("~/bundles/vieweditflightV2").Include(
                "~/JScript/Schedule/ViewEditFlightV2.js"
                   ));

            #endregion Schedule


            bundles.Add(new ScriptBundle("~/bundles/jqueryOld").Include(
                "~/Scripts/jquery-1.7.2.js",
                "~/Scripts/kendo/kendo.web.js",
                   "~/Scripts/jquery.toolbar.js",
                   "~/Scripts/validator.js",
                   "~/Scripts/jquery.signalR-1.2.2.min.js",
                   "~/signalr/hubs",
                   "~/Scripts/Common.js",
                   "~/Scripts/CfiMessage.js"

                   ));

            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/KendoSchedular/Content/JS/jquery.min.js",
                        "~/Scripts/KendoSchedular/Content/JS/angular.min.js",
                //"~/JScript/Roster/Schedular/kendo.all.min.js",
                "~/Scripts/KendoSchedular/Content/JS/kendo.dataviz.min.js",
                "~/Scripts/KendoSchedular/Content/JS/kendo.all.min.js",
                //"~/Scripts/kendo/kendo.web.js",
                        "~/Scripts/jquery.toolbar.js",
                        "~/Scripts/validator.js",
                        "~/Scripts/KendoSchedular/Content/JS/Common.js",
                        "~/Scripts/CfiMessage.js"

                        ));


            //==============added by ankit====================//
            bundles.Add(new ScriptBundle("~/bundles/jqueryforFlightSchedular").Include(
                       "~/Scripts/KendoSchedular/Content/JS/jquery.min.js",
                       "~/Scripts/KendoSchedular/Content/JS/kendo.dataviz.min.js",
                       "~/Scripts/KendoSchedular/Content/JS/kendo.all.min.js",
                       "~/Scripts/jquery.toolbar.js",
                       "~/Scripts/validator.js",
                       "~/Scripts/CfiMessage.js"
                       
                       ));

            #endregion


            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate.min.js",
                        "~/Scripts/jquery.validate.unobtrusive.min.js"

                        ));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js"));
            #region Login
            //bundles GarudaLogin page file
            bundles.Add(new ScriptBundle("~/bundles/jq").Include(
                      "~/Scripts/jquery-1.7.2.js",
                      "~/Images/Login/ga.js",
                      "~/Images/Login/Page.js",
                      "~/Images/Login/HomePage.js"
                      ));
            bundles.Add(new ScriptBundle("~/bundles/Login").Include(
                     "~/Scripts/jquery-ui-1.7.2.custom.min.js",
                      "~/Scripts/Login.js",
                      "~/Scripts/api.js"
                      ));
            #endregion Login

            #region Index
            //bundling for Index.cshtml page
            bundles.Add(new ScriptBundle("~/Scripts/index").Include(
                      "~/Scripts/jquery-1.7.2.js",
                      "~/Scripts/kendo/kendo.web.js",
                      "~/Scripts/shortcut.js",
                      "~/Scripts/index.js",
                      "~/Scripts/jquery-ui-1.10.2.custom.min.js"));
            #endregion Index

            #region _MenuLayout
            //bundling for _MenuLayout.cshtml (for Else Condition)
            bundles.Add(new ScriptBundle("~/Scripts/default/common").Include(
                      "~/Scripts/signalRFactory.js",
                      "~/Scripts/Common.js",
                      "~/Scripts/jquery.toolbar.js"
                      ));

          

                  bundles.Add(new ScriptBundle("~/Scripts/default/commono").Include(
                      "~/Scripts/signalRFactory.js",
                      "~/Scripts/commono.js"
                      ));

            bundles.Add(new ScriptBundle("~/Scripts/default/jqcommon").Include(
                      "~/Scripts/jquery-1.7.2.js",
                      "~/Scripts/kendo/Newkendo.web.js",
                      "~/Scripts/jquery.signalR-1.2.2.min.js"
                      ));

            //bundling for _MenuLayout.cshtml (for module=report)
            bundles.Add(new ScriptBundle("~/Scripts/default/report").Include(
                      "~/Scripts/jquery-1.9.1.min.js",
                      "~/Scripts/KendoSchedular/Content/JS/kendo.all.min.js",
                      "~/Scripts/KendoSchedular/Content/JS/kendo.dataviz.min.js",
                      "~/Scripts/common.js"
                      ));

            //bundling for _MenuLayout.cshtml (for module=shipment&apps=buildup)
            bundles.Add(new ScriptBundle("~/Scripts/default/buildup").Include(
                      "~/Scripts/jquery-2.1.3.js",
                      "~/Scripts/kendo/kendoo.web.js",
                      "~/Scripts/jquery.signalR-1.2.2.min.js"
                      ));


            //bundling for _MenuLayout.cshtml (for all)
            bundles.Add(new ScriptBundle("~/Scripts/default/all").Include(
                     "~/Scripts/validator.js",
                     "~/Scripts/CfiMessage.js",
                     "~/Scripts/maketrans.js",
                     "~/Scripts/jquery.appendGrid-1.3.2.js",
                     "~/Scripts/jquery.serializeToJSON.js",
                     "~/Scripts/jquery.shortcut.js",
                     "~/Scripts/jquery-ui-1.10.2.custom.min.js",
                     "~/Scripts/jqueryPrintNew.js",
                     "~/Scripts/jquery.alerts.js"
                //add By Sushant
                //"~/Scripts/jspdf.js",
                //"~/Scripts/jspdf.min.js"   // Comment has been made by Braj because this js stoped minification functionality 
                     ));

            #endregion _MenuLayout

            #region Shipment

            //bundling for Short Acceptance Page
            bundles.Add(new ScriptBundle("~/bundles/ShortAcceptance").Include(
                     "~/JScript/Shipment/ShortAcceptance.js")
                     );
            //bundling for Reservation Booking Page
            bundles.Add(new ScriptBundle("~/bundles/ReservationBooking").Include(
                     "~/JScript/Shipment/ReservationBooking.js")
                     );
			//bundling for Short Booking Page
			bundles.Add(new ScriptBundle("~/bundles/ShortBooking").Include(
					 "~/JScript/Shipment/ShortBooking.js")
					 );
			//bundling for Reservation Booking Page for Back date
			bundles.Add(new ScriptBundle("~/bundles/BackDateBooking").Include(
                     "~/JScript/Shipment/BackDateBooking.js")
                     );
            //bundling for XrayExemption Page
            bundles.Add(new ScriptBundle("~/bundles/XrayExemption").Include(
                     "~/JScript/Shipment/XrayExemption.js")
                     );
            //bundling for Booking Page
            bundles.Add(new ScriptBundle("~/bundles/Booking").Include(
                     "~/JScript/Shipment/Booking.js")
                     );
            //bundling for FlightTransfer Page
            bundles.Add(new ScriptBundle("~/bundles/FlightTransfer").Include(
                     "~/JScript/Shipment/FlightTransfer.js")
                     );
            //bundling for AWBSwapping Page
            bundles.Add(new ScriptBundle("~/bundles/AWBSwapping").Include(
                     "~/JScript/Shipment/AWBSwapping.js")
                     );
            //bundling for UNKBooking Page
            bundles.Add(new ScriptBundle("~/bundles/UNKBooking").Include(
                     "~/JScript/Shipment/UNKBooking.js")
                     );
            //bundling for WalkingRate Page
            bundles.Add(new ScriptBundle("~/bundles/WalkingRate").Include(
                     "~/JScript/Shipment/WalkingRate.js")
                     );
            //bundling for BackLogCargo Page
            bundles.Add(new ScriptBundle("~/bundles/BackLogCargo").Include(
                     "~/JScript/Shipment/BackLogCargo.js")
                     );
            //bundling for AssignTeam Page
            bundles.Add(new ScriptBundle("~/bundles/AssignTeam").Include(
                     "~/JScript/Shipment/AssignTeam.js")
                     );
            //bundling for ULDBreakdown Page
            bundles.Add(new ScriptBundle("~/bundles/ULDBreakdown").Include(
                     "~/JScript/Shipment/ULDBreakdown.js")
                     );
            //bundling for Reservationindex Page
            bundles.Add(new ScriptBundle("~/bundles/Reservationindex").Include(
                     "~/JScript/Shipment/Reservationindex.js")
                     );
            //bundling for Acceptence Page
            bundles.Add(new ScriptBundle("~/bundles/Acceptence").Include(
                     "~/JScript/Shipment/Acceptence.js")
                     );
            //bundling for FBL Page
            bundles.Add(new ScriptBundle("~/bundles/FBL").Include(
                     "~/JScript/Shipment/FBL.js")
                     );
            //bundling for CCA Page
            bundles.Add(new ScriptBundle("~/bundles/CCA").Include(
                     "~/JScript/Shipment/CCA.js")
                     );
            //bundling for HouseIndex Page
            bundles.Add(new ScriptBundle("~/bundles/HouseIndex").Include(
                     "~/JScript/Shipment/HouseIndex.js")
                     );
            //bundling for SLInfo Page
            bundles.Add(new ScriptBundle("~/bundles/SLInfo").Include(
                     "~/JScript/SLI/SLInfo.js")
                     );
            //bundling for SLICancellation Page
            bundles.Add(new ScriptBundle("~/bundles/SLICancellation").Include(
                     "~/JScript/SLI/SLICancellation.js")
                     );
            //bundling for UCMDiscrepancyReport Page
            bundles.Add(new ScriptBundle("~/bundles/UCMDiscrepancyReport").Include(
                     "~/JScript/Shipment/UCMDiscrepancyReport.js")
                     );
            //bundling for UWSInfo Page
            bundles.Add(new ScriptBundle("~/bundles/UWSInfo").Include(
                     "~/JScript/UWS/UWSInfo.js",
                     "~/Scripts/jquery-barcode-2.0.2.js")
                     );
            //bundling for FlightControl Page
            bundles.Add(new ScriptBundle("~/bundles/FlightControl").Include(
                     "~/Scripts/jspdf.debug.js",     
                     "~/Scripts/html2canvas.js",
                     "~/JScript/FlightControl/FlightControl.js") 
                     );
            //bundling for GatePass Page
            bundles.Add(new ScriptBundle("~/bundles/GatePass").Include(
                     "~/JScript/GatePass/GatePass.js")
                     );
            //bundling for AmendFlightShipment Page
            bundles.Add(new ScriptBundle("~/bundles/AmendFlightShipment").Include(
                     "~/JScript/Shipment/AmendFlightShipment.js"));

            bundles.Add(new ScriptBundle("~/bundles/GroupBooking").Include(
                     "~/JScript/Shipment/GroupBooking.js"));
            //bundling for Build Up Page
            bundles.Add(new ScriptBundle("~/bundles/Buildup").Include(
                     "~/JScript/BuildUp/Buildup.js",
                     "~/Scripts/jquery-barcode-2.0.2.js")
                     );
            //bundling for ReadyToUnloading Page
            bundles.Add(new ScriptBundle("~/bundles/ReadyToUnloading").Include(
                     "~/JScript/Shipment/ReadyToUnloading.js"));
            //bundling for Payment Page
            bundles.Add(new ScriptBundle("~/bundles/ShipmentPayment").Include(
                     "~/JScript/Shipment/Payment.js"));
            //bundling for FWB Page
            bundles.Add(new ScriptBundle("~/bundles/FWB").Include(
                     "~/JScript/Shipment/FWB.js"));
            //bundling for Tracking Page
            bundles.Add(new ScriptBundle("~/bundles/Tracking").Include(
                     "~/JScript/Shipment/Tracking.js"));
            //bundling for UldOut Page
            bundles.Add(new ScriptBundle("~/bundles/ExportUldOut").Include(
                     "~/JScript/Export/UldTransfer/UldOut.js"));
            //bundling for LUC Page
            bundles.Add(new ScriptBundle("~/bundles/LUC").Include(
                     "~/JScript/Export/UldTransfer/LUC.js"));
            //bundling for LUCIN Page
            bundles.Add(new ScriptBundle("~/bundles/LUCIN").Include(
                     "~/JScript/Export/UldTransfer/LUCIN.js"));
            //bundling for UwsPrint Page
            bundles.Add(new ScriptBundle("~/bundles/UwsPrint").Include(
                     "~/JScript/Shipment/UwsPrint.js"));
            //bundling for UCM Page
            bundles.Add(new ScriptBundle("~/bundles/UCM").Include(
                     "~/JScript/Shipment/UCM.js"));
            //bundling for UCMINOUTALERT Page
            bundles.Add(new ScriptBundle("~/bundles/UCMINOUTALERT").Include(
                     "~/JScript/Shipment/UCMINOUTALERT.js"));
            //bundling for FHLExport Page
            bundles.Add(new ScriptBundle("~/bundles/FHLExport").Include(
                     "~/JScript/Shipment/FHLExport.js"));
            //bundling for ReturntoShipper Page
            bundles.Add(new ScriptBundle("~/bundles/ReturntoShipper").Include(
                     "~/JScript/Shipment/ReturntoShipper.js"));
            //bundling for AWBTracking Page
            bundles.Add(new ScriptBundle("~/bundles/AWBTracking").Include(
                     "~/JScript/Shipment/AWBTracking.js"));
            //bundling for RushHandlingApproval Page
            bundles.Add(new ScriptBundle("~/bundles/RushHandlingApproval").Include(
                     "~/JScript/Shipment/RushHandlingApproval.js"));
            //bundling for MarineInsurance Page
            bundles.Add(new ScriptBundle("~/bundles/MarineInsurance").Include(
                     "~/JScript/Shipment/MarineInsurance.js"));
            #endregion Shipment

            #region Master
            //bundling for LoginColorCode Page
            bundles.Add(new ScriptBundle("~/bundles/LoginColorCode").Include(
                     "~/JScript/Master/LoginColorCode.js")
                     );
            //bundling for ExchangeRateConfiguration Page
            bundles.Add(new ScriptBundle("~/bundles/ExchangeRateConfiguration").Include(
                     "~/JScript/Master/ExchangeRateConfiguration.js")
                     );
            //bundling for BTL Page
            bundles.Add(new ScriptBundle("~/bundles/BTL").Include(
                     "~/JScript/Master/BTL.js")
                     );
            //bundling for AirlineHub Page
            bundles.Add(new ScriptBundle("~/bundles/AirlineHub").Include(
                     "~/JScript/Master/AirlineHub.js")
                     );
            //bundling for Airline Page
            bundles.Add(new ScriptBundle("~/bundles/Airline").Include(
                     "~/JScript/Master/Airline.js")
                     );
            //bundling for CheckListType Page
            bundles.Add(new ScriptBundle("~/bundles/CheckListType").Include(
                     "~/JScript/Master/CheckListType.js")
                     );
            //bundling for AirlineCheckList Page
            bundles.Add(new ScriptBundle("~/bundles/AirlineCheckList").Include(
                     "~/JScript/Master/AirlineCheckList.js")
                     );


            //bundling for Terminal Page
            bundles.Add(new ScriptBundle("~/bundles/Terminal").Include(
                     "~/JScript/Master/Terminal.js")
                     );
            //bundling for RegistryControl Page
            bundles.Add(new ScriptBundle("~/bundles/RegistryControl").Include(
                     "~/JScript/Master/RegistryControl.js")
                     );
            //bundling for TaskArea Page
            bundles.Add(new ScriptBundle("~/bundles/TaskArea").Include(
                     "~/JScript/Master/TaskArea.js")
                     );

            //bundling for Schedue Page
            bundles.Add(new ScriptBundle("~/bundles/Schedue").Include(
                     "~/JScript/Master/Schedue.js")
                     );
            //bundling for CommodityGroup Page
            bundles.Add(new ScriptBundle("~/bundles/CommodityGroup").Include(
                     "~/JScript/Master/CommodityGroup.js")
                     );
            //bundling for Country Page
            bundles.Add(new ScriptBundle("~/bundles/Country").Include(
                     "~/JScript/Master/Country.js")
                     );
            //bundling for UnLockedPage Page
            bundles.Add(new ScriptBundle("~/bundles/UnLockedPage").Include(
                     "~/JScript/Master/UnLockedPage.js")
                     );
            //bundling for SLA Page
            bundles.Add(new ScriptBundle("~/bundles/SLA").Include(
                     "~/JScript/Master/SLA.js",
                     "~/JScript/Report/SLA.js") //Added by Shahbaz Akhtar
                     );
            //bundling for Account Page
            bundles.Add(new ScriptBundle("~/bundles/Account").Include(
                     "~/JScript/Master/Account.js")
                     );
            //bundling for AccountType Page
            bundles.Add(new ScriptBundle("~/bundles/AccountType").Include(
                     "~/JScript/Master/AccountType.js")
                     );
            //bundling for Airport Page
            bundles.Add(new ScriptBundle("~/bundles/Airport").Include(
                     "~/JScript/Master/Airport.js")
                     );
            //bundling for Customer Page
            bundles.Add(new ScriptBundle("~/bundles/Customer").Include(
                     "~/JScript/Master/Customer.js")
                     );
            //bundling for Currency Page
            bundles.Add(new ScriptBundle("~/bundles/Currency").Include(
                     "~/JScript/Master/Currency.js")
                     );
            //bundling for Office Page
            bundles.Add(new ScriptBundle("~/bundles/Office").Include(
                     "~/JScript/Master/Office.js")
                     );
            bundles.Add(new ScriptBundle("~/bundles/BTBMachinePallet").Include(
                     "~/JScript/Master/BTBMachinePallet.js")
                     );
            //CRUDPAGE AB
            bundles.Add(new ScriptBundle("~/bundles/CrudPageAB").Include(
                    "~/JScript/Master/CrudPageAB.js")
                    );

            bundles.Add(new ScriptBundle("~/bundles/Details").Include(
                "~/JScript/Master/Details.js")
                );


            //bundling for OfficeTarget Page
            bundles.Add(new ScriptBundle("~/bundles/OfficeTarget").Include(
                     "~/JScript/Master/OfficeTarget.js")
                     );
            //bundling for CityConnectionTime Page
            bundles.Add(new ScriptBundle("~/bundles/CityConnectionTime").Include(
                     "~/JScript/Master/CityConnectionTime.js")
                     );
            //bundling for ConnectionTime Page
            bundles.Add(new ScriptBundle("~/bundles/ConnectionTime").Include(
                     "~/JScript/Master/ConnectionTime.js")
                     );
            //bundling for City Page
            bundles.Add(new ScriptBundle("~/bundles/City").Include(
                     "~/JScript/Master/City.js")
                     );
            bundles.Add(new ScriptBundle("~/bundles/State").Include(
                 "~/JScript/Master/State.js")
                 );
            //bundling for EDox Page
            bundles.Add(new ScriptBundle("~/bundles/EDox").Include(
                     "~/JScript/Master/EDox.js")
                     );
            //bundling for HoldType Page
            bundles.Add(new ScriptBundle("~/bundles/HoldType").Include(
                     "~/JScript/Master/HoldType.js")
                     );
            //bundling for DocumentMaster Page
            bundles.Add(new ScriptBundle("~/bundles/DocumentMaster").Include(
                     "~/JScript/Master/DocumentMaster.js")
                     );
            //bundling for SPHCDocument Page
            bundles.Add(new ScriptBundle("~/bundles/SPHCDocument").Include(
                     "~/JScript/Master/SPHCDocument.js")
                     );
            //bundling for EDIMaster Page
            bundles.Add(new ScriptBundle("~/bundles/EDIMaster").Include(
                     "~/JScript/Master/EDIMaster.js")
                     );
            //bundling for Commodity Page
            bundles.Add(new ScriptBundle("~/bundles/Commodity").Include(
                     "~/JScript/Master/Commodity.js")
                     );
            //bundling for FlightType Page
            bundles.Add(new ScriptBundle("~/bundles/FlightType").Include(
                     "~/JScript/Master/FlightType.js")
                     );
            //bundling for SPHCClass Page
            bundles.Add(new ScriptBundle("~/bundles/SPHCClass").Include(
                     "~/JScript/Master/SPHCClass.js")
                     );
            //bundling for SlabMaster Page
            bundles.Add(new ScriptBundle("~/bundles/SlabMaster").Include(
                     "~/JScript/Master/SlabMaster.js")
                     );
            //bundling for AccountTarget Page
            bundles.Add(new ScriptBundle("~/bundles/AccountTarget").Include(
                     "~/JScript/Master/AccountTarget.js")
                     );
            //bundling for AirCraft Page
            bundles.Add(new ScriptBundle("~/bundles/AirCraft").Include(
                     "~/JScript/Master/AirCraft.js")
                     );
            //bundling for AircraftDimensionMatrix Page
            bundles.Add(new ScriptBundle("~/bundles/AircraftDimensionMatrix").Include(
                     "~/JScript/Master/AircraftDimensionMatrix.js")
                     );
            //bundling for AirCraftCapacity Page
            bundles.Add(new ScriptBundle("~/bundles/AirCraftCapacity").Include(
                     "~/JScript/Master/AirCraftCapacity.js")
                     );
            //bundling for Contacts Page
            bundles.Add(new ScriptBundle("~/bundles/Contacts").Include(
                     "~/JScript/Master/Contacts.js")
                     );
            //bundling for Product Page
            bundles.Add(new ScriptBundle("~/bundles/Product").Include(
                     "~/JScript/Master/Product.js")
                     );
            //bundling for Department Page
            bundles.Add(new ScriptBundle("~/bundles/Department").Include(
                     "~/JScript/Master/Department.js")
                     );
            //bundling for CommodityDensityGroup Page
            bundles.Add(new ScriptBundle("~/bundles/CommodityDensityGroup").Include(
                     "~/JScript/Master/CommodityDensityGroup.js")
                     );
            //bundling for Product Page
            bundles.Add(new ScriptBundle("~/bundles/Product").Include(
                     "~/JScript/Master/Product.js")
                     );
            //bundling for SPHCGroup Page
            bundles.Add(new ScriptBundle("~/bundles/SPHCGroup").Include(
                     "~/JScript/Master/SPHCGroup.js")
                     );
            //bundling for AccountGroup Page
            bundles.Add(new ScriptBundle("~/bundles/AccountGroup").Include(
                     "~/JScript/Master/AccountGroup.js")
                     );
            //bundling for CommodityPackage Page
            bundles.Add(new ScriptBundle("~/bundles/CommodityPackage").Include(
                     "~/JScript/Master/CommodityPackage.js")
                     );
            //bundling for PageCreation Page
            bundles.Add(new ScriptBundle("~/bundles/PageCreation").Include(
                     "~/JScript/Master/PageCreation.js")
                     );
            //bundling for Priority Page
            bundles.Add(new ScriptBundle("~/bundles/Priority").Include(
                     "~/JScript/Master/Priority.js")
                     );
            //bundling for SpecialHandlingCode Page
            bundles.Add(new ScriptBundle("~/bundles/SpecialHandlingCode").Include(
                     "~/JScript/Master/SpecialHandlingCode.js")
                     );
            //bundling for Embargo Page
            bundles.Add(new ScriptBundle("~/bundles/Embargo").Include(
                     "~/JScript/Master/Embargo.js")
                     );
            //bundling for EdiInboundAndOutbound Page
            bundles.Add(new ScriptBundle("~/bundles/EdiInboundAndOutbound").Include(
                     "~/JScript/Master/EdiInboundAndOutbound.js")
                     );
            //bundling for Tax Page
            bundles.Add(new ScriptBundle("~/bundles/Tax").Include(
                     "~/JScript/Master/Tax.js")
                     );
            //bundling for ExcelUpload Page
            bundles.Add(new ScriptBundle("~/bundles/ExcelUpload").Include(
                     "~/JScript/Master/ExcelUpload.js")
                     );
            //bundling for CreditLimitUpdate Page
            bundles.Add(new ScriptBundle("~/bundles/CreditLimitUpdate").Include(
                     "~/JScript/Master/CreditLimitUpdate.js")
                     );
            //bundling for WeighingScale Page
            bundles.Add(new ScriptBundle("~/bundles/WeighingScale").Include(
                     "~/JScript/Master/WeighingScale.js")
                     );
            //bundling for TruckType Page
            bundles.Add(new ScriptBundle("~/bundles/TruckType").Include(
                     "~/JScript/Master/TruckType.js")
                     );
            //bundling for Route Page
            bundles.Add(new ScriptBundle("~/bundles/Route").Include(
                     "~/JScript/Master/Route.js")
                     );
            //bundling for Distance Page
            bundles.Add(new ScriptBundle("~/bundles/Distance").Include(
                     "~/JScript/Master/Distance.js")
                     );
            //bundling for RateCard Page
            bundles.Add(new ScriptBundle("~/bundles/RateCard").Include(
                     "~/JScript/Master/RateCard.js")
                     );
            //bundling for PenaltyParameters Page
            bundles.Add(new ScriptBundle("~/bundles/PenaltyParameters").Include(
                     "~/JScript/Master/PenaltyParameters.js")
                     );
            //bundling for RateTypePriority Page
            bundles.Add(new ScriptBundle("~/bundles/RateTypePriority").Include(
                     "~/JScript/Master/RateTypePriority.js")
                     );
            //bundling for Zone Page
            bundles.Add(new ScriptBundle("~/bundles/Zone").Include(
                     "~/JScript/Master/Zone.js")
                     );
            //bundling for XRayMachine Page
            bundles.Add(new ScriptBundle("~/bundles/XRayMachine").Include(
                     "~/JScript/Master/XRayMachine.js")
                     );
            //bundling for EdiInboundAndOutbound Page
            bundles.Add(new ScriptBundle("~/bundles/EdiInboundAndOutbound").Include(
                     "~/JScript/Master/EdiInboundAndOutbound.js")
                     );
            //bundling for RateType Page
            bundles.Add(new ScriptBundle("~/bundles/RateType").Include(
                     "~/JScript/Master/RateType.js")
                     );
            //bundling for Commission Page
            bundles.Add(new ScriptBundle("~/bundles/Commission").Include(
                     "~/JScript/Master/Commission.js")
                     );
            //bundling for Region Page
            bundles.Add(new ScriptBundle("~/bundles/Region").Include(
                     "~/JScript/Master/Region.js")
                     );
            //bundling for MessageTest Page
            bundles.Add(new ScriptBundle("~/bundles/MessageTest").Include(
                     "~/JScript/Master/MessageTest.js")
                     );
            //bundling for CityConnectionTimePriority Page
            bundles.Add(new ScriptBundle("~/bundles/CityConnectionTimePriority").Include(
                     "~/JScript/Master/CityConnectionTimePriority.js")
                     );
            //bundling for RatePriorityMaster Page
            bundles.Add(new ScriptBundle("~/bundles/RatePriorityMaster").Include(
                     "~/JScript/Master/RatePriorityMaster.js")
                     );
            //bundling for TruckMaster Page
            bundles.Add(new ScriptBundle("~/bundles/TruckMaster").Include(
                   "~/JScript/Master/TruckMaster.js")
                   );

            //bundling for DriverMaster Page
            bundles.Add(new ScriptBundle("~/bundles/DriverMaster").Include(
                   "~/JScript/Master/DriverMaster.js")
                   );
            //bundling for DriverMaster Page
            bundles.Add(new ScriptBundle("~/bundles/VehicleMake").Include(
                   "~/JScript/Master/VehicleMake.js")
                   );
            //bundling for DriverMaster Page
            bundles.Add(new ScriptBundle("~/bundles/Vehicle").Include(
                   "~/JScript/Master/Vehicle.js")
                   );
            //bundling for DriverMaster Page
            bundles.Add(new ScriptBundle("~/bundles/Drivers").Include(
                   "~/JScript/Master/Drivers.js")
                   );


            #endregion

            #region Inventory
            //bundling for InventoryVehType Page
            bundles.Add(new ScriptBundle("~/bundles/InventoryVehType").Include(
                     "~/JScript/Inventory/InventoryVehType.js")
                     );
            //bundling for InventoryItem Page
            bundles.Add(new ScriptBundle("~/bundles/InventoryItem").Include(
                     "~/JScript/Inventory/InventoryItem.js")
                     );
            //bundling for InvVehicle Page
            bundles.Add(new ScriptBundle("~/bundles/InvVehicle").Include(
                     "~/JScript/Inventory/InvVehicle.js")
                     );
            //bundling for InvVehicleService Page
            bundles.Add(new ScriptBundle("~/bundles/InvVehicleService").Include(
                     "~/JScript/Inventory/InvVehicleService.js")
                     );
            //bundling for ConsumableStock Page
            bundles.Add(new ScriptBundle("~/bundles/ConsumableStock").Include(
                     "~/JScript/Inventory/ConsumableStock.js")
                     );
            //bundling for Consumable Page
            bundles.Add(new ScriptBundle("~/bundles/Consumable").Include(
                     "~/JScript/Inventory/Consumable.js")
                     );
            //bundling for IssueConsumables Page
            bundles.Add(new ScriptBundle("~/bundles/IssueConsumables").Include(
                     "~/JScript/Inventory/IssueConsumables.js")
                     );
            //bundling for ReturnConsumable Page
            bundles.Add(new ScriptBundle("~/bundles/ReturnConsumable").Include(
                     "~/JScript/Inventory/ReturnConsumable.js")
                     );
            //bundling for InventoryStockList Page 25-04-2018 Add By Sushant 
            bundles.Add(new ScriptBundle("~/bundles/InventoryStockList").Include(
                     "~/JScript/Inventory/InventoryStockList.js")
                     );
            #endregion Inventory


            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css"));

            bundles.Add(new StyleBundle("~/Content/index").Include(
                "~/Styles/Application.css",
                "~/Styles/Grid/kendo.common.min.css",
                "~/Styles/Grid/kendo.blueopal.min.css",
                "~/Styles/Site.css",
                "~/Styles/jquery-ui/jquery-ui-1.10.2.custom.css"));

            //bundling for _MenuLayout.cshtml
            bundles.Add(new StyleBundle("~/Content/default").Include(
                "~/Styles/Application.css",
                "~/Styles/Grid/kendo.common.min.css",
                "~/Styles/Grid/kendo.blueopal.min.css",
                "~/Styles/Site.css",
                "~/Styles/validator.theme.red.css",
                "~/Styles/jquery.appendGrid-1.3.2.css",
                "~/Styles/jquery-ui/jquery-ui-1.10.2.custom.css",
                "~/Styles/CfiMessage.css",
                "~/Styles/font-awesome.min.css",
                "~/Styles/jquery.alerts.css"));


            #region Common css files
            bundles.Add(new StyleBundle("~/Content/AppCssV1").Include(
                      "~/Styles/Application.css",
                      "~/Styles/Grid/kendo.common.min.css",
                      "~/Styles/Grid/kendo.blueopal.min.css",
                      "~/Styles/Site.css",
                      "~/Styles/validator.theme.red.css",
                      "~/Styles/jquery.appendGrid-1.3.2.css",
                      "~/Styles/jquery-ui/jquery-ui-1.10.2.custom.css",
                      "~/Styles/CfiMessage.css",
                      "~/Styles/font-awesome.min.css",
                      "~/Styles/jquery.alerts.css"
                ));

            bundles.Add(new StyleBundle("~/Content/AppCssV2").Include(
                     "~/Styles/Application.css",
                     "~/Scripts/KendoSchedular/Content/CSS/kendo.common.min.css",
                     "~/Styles/Grid/kendo.blueopal.min.css",
                     "~/Styles/Site.css",
                     "~/Styles/validator.theme.red.css",
                     "~/Styles/jquery.appendGrid-1.3.2.css",
                     "~/Styles/jquery-ui/jquery-ui-1.10.2.custom.css",
                     "~/Styles/CfiMessage.css",
                     "~/Styles/font-awesome.min.css",
                     "~/Styles/jquery.alerts.css"
               ));

            #endregion
            //// Add by Susahnt
            #region RATE
            //bundling for RATE Page
            bundles.Add(new ScriptBundle("~/bundles/Rate").Include(
                     "~/JScript/Rate/Rate.js")
                     );
            //bundling for RATEHEAVYWEIGHTSURCHARGE Page
            bundles.Add(new ScriptBundle("~/bundles/RateHeavyWeightSurcharge").Include(
                   "~/JScript/Rate/RateHeavyWeightSurcharge.js")
                   );
            //bundling for DUECARRIER Page
            bundles.Add(new ScriptBundle("~/bundles/DueCarrier").Include(
                   "~/JScript/Rate/DueCarrier.js")
                   );
            //bundling for RateSurChargeSPHC Page
            bundles.Add(new ScriptBundle("~/bundles/RateSurChargeSPHC").Include(
                   "~/JScript/Rate/RateSurChargeSPHC.js")
                   );
            //bundling for RateSurchargeCommodity Page
            bundles.Add(new ScriptBundle("~/bundles/RateSurchargeCommodity").Include(
                   "~/JScript/Rate/RateSurchargeCommodity.js")
                   );
            //bundling for RateAirlineMaster Page
            bundles.Add(new ScriptBundle("~/bundles/RateAirlineMaster").Include(
                   "~/JScript/Rate/RateAirlineMaster.js")
                   );
            //bundling for RateExchangeDueCarrier Page
            bundles.Add(new ScriptBundle("~/bundles/RateExchangeDueCarrier").Include(
                   "~/JScript/Rate/RateExchangeDueCarrier.js")
                   );
            //bundling for RateGlobalDueCarrier Page
            bundles.Add(new ScriptBundle("~/bundles/RateGlobalDueCarrier").Include(
                   "~/JScript/Rate/RateGlobalDueCarrier.js")
                   );
            //bundling for ExchangeRate Page
            bundles.Add(new ScriptBundle("~/bundles/ExchangeRate").Include(
                   "~/JScript/Rate/ExchangeRate.js")
                   );
            //bundling for RateSearch Page
            bundles.Add(new ScriptBundle("~/bundles/RateSearch").Include(
                   "~/JScript/Rate/RateSearch.js")
                   );
            //bundling for RateSurcharge Page
            bundles.Add(new ScriptBundle("~/bundles/RateSurcharge").Include(
                   "~/JScript/Rate/RateSurcharge.js")
                   );
            //bundling for SpotRate Page
            bundles.Add(new ScriptBundle("~/bundles/SpotRate").Include(
                   "~/JScript/Rate/SpotRate.js")
                   );
            //bundling for OtherCharges Page
            bundles.Add(new ScriptBundle("~/bundles/OtherCharges").Include(
                   "~/JScript/Rate/OtherCharges.js")
                   );
            //bundling for OtherChargesHistory Page
            bundles.Add(new ScriptBundle("~/bundles/OtherChargesHistory").Include(
                   "~/JScript/Rate/OtherChargesHistory.js"));
            //bundling for RateDetailsHistory Page
            bundles.Add(new ScriptBundle("~/bundles/RateDetailsHistory").Include(
                   "~/JScript/Rate/RateDetailsHistory.js")
                   );
            //bundling for AgentGroup Page
            bundles.Add(new ScriptBundle("~/bundles/AgentGroup").Include(
                   "~/JScript/Rate/AgentGroup.js")
                   );
            //bundling for TaxRate Page
            bundles.Add(new ScriptBundle("~/bundles/TaxRate").Include(
                   "~/JScript/Rate/TaxRate.js")
                   );
            //bundling for TaxLogs Page
            bundles.Add(new ScriptBundle("~/bundles/TaxLogs").Include(
                   "~/JScript/Rate/TaxLogs.js")
                   );
            //bundling for ManageClassRate Page
            bundles.Add(new ScriptBundle("~/bundles/ManageClassRate").Include(
                   "~/JScript/Rate/ManageClassRate.js")
                   );
            //bundling for ManageTactRate Page
            bundles.Add(new ScriptBundle("~/bundles/ManageTactRate").Include(
                   "~/JScript/Rate/ManageTactRate.js")
                   );
            //bundling for SearchTactRate Page
            bundles.Add(new ScriptBundle("~/bundles/SearchTactRate").Include(
                   "~/JScript/Rate/SearchTactRate.js")
                   );
            #endregion
            #region  STOCK
            //bundling for StockManagement Page
            bundles.Add(new ScriptBundle("~/bundles/StockManagement").Include(
                   "~/JScript/Stock/StockManagement.js", "~/JScript/Stock/StockIssueStatus.js")
                   );
            //bundling for ReturnToOffice Page
            bundles.Add(new ScriptBundle("~/bundles/ReturnToOffice").Include(
                   "~/JScript/Stock/ReturnToOffice.js")
                   );
            //bundling for ReturnFromAccount Page
            bundles.Add(new ScriptBundle("~/bundles/ReturnFromAccount").Include(
                   "~/JScript/Stock/ReturnFromAccount.js")
                   );
            //bundling for StockValidate Page
            bundles.Add(new ScriptBundle("~/bundles/StockValidate").Include(
                   "~/JScript/Stock/StockValidate.js")
                   );
            //bundling for StockAWB Page
            bundles.Add(new ScriptBundle("~/bundles/StockAWB").Include(
                   "~/JScript/Stock/StockAWB.js",
                   "~/JScript/Stock/StockAWBIndexview.js")
                   );
            //bundling for AWBStock Page
            bundles.Add(new ScriptBundle("~/bundles/AWBStock").Include(
                   "~/JScript/Stock/AWBStock.js"
                   , "~/JScript/Stock/StockAWBIndexview.js")
                   );
            //bundling for AWBLost Page
            bundles.Add(new ScriptBundle("~/bundles/AWBLost").Include(
                   "~/JScript/Stock/AWBLost.js")
                   );
            //bundling for AWBVoid Page
            bundles.Add(new ScriptBundle("~/bundles/AWBVoid").Include(
                   "~/JScript/Stock/AWBVoid.js")
                   );
            //bundling for AWBBlacklisted Page
            bundles.Add(new ScriptBundle("~/bundles/AWBBlacklisted").Include(
                   "~/JScript/Stock/AWBBlacklisted.js")
                   );
            //bundling for AWBBlacklisted Page
            bundles.Add(new ScriptBundle("~/bundles/AWBReserved").Include(
                   "~/JScript/Stock/AWBReserved.js")
                   );
            //bundling for IssueDistributedStocktoSubBranch Page
            bundles.Add(new ScriptBundle("~/bundles/IssueDistributedStocktoSubBranch").Include(
                   "~/JScript/Stock/IssueDistributedStocktoSubBranch.js")
                   );
            #endregion
            #region SPACECONTROL
            //bundling for SpaceAllocation Page
            bundles.Add(new ScriptBundle("~/bundles/SpaceAllocation").Include(
                   "~/JScript/SpaceControl/SpaceAllocation.js")
                   );
            //bundling for SpaceAllocationAccount Page
            bundles.Add(new ScriptBundle("~/bundles/SpaceAllocationAccount").Include(
                   "~/JScript/SpaceControl/SpaceAllocationAccount.js")
                   );
            //bundling for AWBQueueManagement Page
            bundles.Add(new ScriptBundle("~/bundles/AWBQueueManagement").Include(
                   "~/JScript/SpaceControl/AWBQueueManagement.js")
                   );
            //bundling for FreightBookingList Page
            bundles.Add(new ScriptBundle("~/bundles/FreightBookingList").Include(
                   "~/JScript/SpaceControl/FreightBookingList.js")
                   );

            #endregion
            #region flightwise discounting
            bundles.Add(new ScriptBundle("~/bundles/FlightWiseDiscounting").Include(
                   "~/JScript/Rate/FlightWiseDiscountingForRate.js")
                   );
            #endregion

            #region ACCOUNTS
            //bundling for Payment Page
            bundles.Add(new ScriptBundle("~/bundles/AccountsPayment").Include(
                   "~/JScript/Accounts/Payment.js")
                   );

            //bundling for CreditDebitNote Page
            bundles.Add(new ScriptBundle("~/bundles/CreditDebitNote").Include(
                   "~/JScript/Accounts/CreditDebitNote.js")
                   );
            //bundling for CreditDebitNoteApproval Page
            bundles.Add(new ScriptBundle("~/bundles/CreditDebitNoteApproval").Include(
                   "~/JScript/Accounts/CreditDebitNoteApproval.js")
                   );

            //bundling for ChargeGroup Page
            bundles.Add(new ScriptBundle("~/bundles/ChargeGroup").Include(
                   "~/JScript/Accounts/ChargeGroup.js")
                   );
            //bundling for Ledger Page
            bundles.Add(new ScriptBundle("~/bundles/Ledger").Include(
                   "~/JScript/Accounts/Ledger.js")
                   );
            //bundling for TransactionHistory Page
            bundles.Add(new ScriptBundle("~/bundles/TransactionHistory").Include(
                   "~/JScript/Accounts/TransactionHistory.js")
                   );
            //bundling for NOTOC Page
            bundles.Add(new ScriptBundle("~/bundles/NOTOC").Include(
                   "~/JScript/Accounts/NOTOC.js")
                   );
            //bundling for CashRegister Page
            bundles.Add(new ScriptBundle("~/bundles/CashRegister").Include(
                   "~/JScript/Accounts/CashRegister.js")
                   );
            //bundling for DirectPayment Page
            bundles.Add(new ScriptBundle("~/bundles/DirectPayment").Include(
                   "~/JScript/Accounts/DirectPayment.js")
                   );
            //bundling for VerifyPayment Page
            bundles.Add(new ScriptBundle("~/bundles/VerifyPayment").Include(
                   "~/JScript/Accounts/VerifyPayment.js")
                   );
            //bundling for ApprovePayment Page
            bundles.Add(new ScriptBundle("~/bundles/ApprovePayment").Include(
                   "~/JScript/Accounts/ApprovePayment.js")
                   );
            //bundling for ReversePayment Page
            bundles.Add(new ScriptBundle("~/bundles/ReversePayment").Include(
                   "~/JScript/Accounts/ReversePayment.js")
                   );
            //bundling for InvoiceGroup Page
            bundles.Add(new ScriptBundle("~/bundles/InvoiceGroup").Include(
                   "~/JScript/Accounts/InvoiceGroup.js")
                   );
            //bundling for SummaryReport Page
            bundles.Add(new ScriptBundle("~/bundles/SummaryReport").Include(
                   "~/JScript/Accounts/SummaryReport.js")
                   );
            //bundling for CreditLimitReport Page
            bundles.Add(new ScriptBundle("~/bundles/CreditLimitReport").Include(
                   "~/JScript/Accounts/CreditLimitReport.js")
                   );
            //bundling for CreditLimitReport Page By Arman 
            bundles.Add(new ScriptBundle("~/bundles/PaymentStatusReport").Include(
                   "~/JScript/Accounts/PaymentStatusReport.js",
                    "~/Scripts/validator.js",
                     "~/Scripts/CfiMessage.js",
                     "~/Scripts/maketrans.js",
                     "~/Scripts/jquery.appendGrid-1.3.2.js",
                     "~/Scripts/jquery.serializeToJSON.js",
                     "~/Scripts/jquery.shortcut.js",
                     "~/Scripts/jquery-ui-1.10.2.custom.min.js",
                     "~/Scripts/jqueryPrintNew.js",
                     "~/Scripts/jquery.alerts.js"
                      )
                   );

            //bundling for BTB Report Page By Arman 
            bundles.Add(new ScriptBundle("~/bundles/BTBReport").Include(
                   "~/JScript/Report/BTBReport.js",
                    "~/Scripts/validator.js",
                     "~/Scripts/CfiMessage.js",
                     "~/Scripts/maketrans.js",
                     "~/Scripts/jquery.appendGrid-1.3.2.js",
                     "~/Scripts/jquery.serializeToJSON.js",
                     "~/Scripts/jquery.shortcut.js",
                     "~/Scripts/jquery-ui-1.10.2.custom.min.js",
                     "~/Scripts/jqueryPrintNew.js",
                     "~/Scripts/jquery.alerts.js"
                      )
                   );
            #endregion
            #region ULD
            //bundling for ULDInventory Page
            bundles.Add(new ScriptBundle("~/bundles/ULDULDInventory").Include(
                   "~/JScript/ULD/ULDInventory.js")
                   );
            //bundling for ULDType Page
            bundles.Add(new ScriptBundle("~/bundles/ULDType").Include(
                   "~/JScript/ULD/ULDType.js")
                   );

            //bundling for CreditLimitReport Page
            bundles.Add(new ScriptBundle("~/bundles/ULDStock").Include(
                   "~/JScript/ULD/ULDStock.js")
                   );


            //bundling for ULD Stock Non Inventory Page
            bundles.Add(new ScriptBundle("~/bundles/ULDStockNonInventory").Include(
                   "~/JScript/ULD/ULDStockNonInventory.js")
                   );

            //bundling for CityWiseULDAllocation Page
            bundles.Add(new ScriptBundle("~/bundles/CityWiseULDAllocation").Include(
                   "~/JScript/ULD/CityWiseULDAllocation.js")
                   );

            //bundling for ULDTracking Page
            bundles.Add(new ScriptBundle("~/bundles/ULDTracking").Include(
                   "~/JScript/ULD/ULDTracking.js")
                   );

            //bundling for UldInCompatibility Page
            bundles.Add(new ScriptBundle("~/bundles/UldInCompatibility").Include(
                   "~/JScript/ULD/UldInCompatibility.js", "~/Scripts/maketrans")
                   );

            //bundling for UldStack Page
            bundles.Add(new ScriptBundle("~/bundles/UldStack").Include(
                   "~/JScript/ULD/UldStack.js")
                   );

            //bundling for ULDRepair Page
            bundles.Add(new ScriptBundle("~/bundles/ULDRepair").Include(
                   "~/JScript/ULD/ULDRepair.js")
                   );

            //bundling for VendorPriceList Page
            bundles.Add(new ScriptBundle("~/bundles/VendorPriceList").Include(
                   "~/JScript/ULD/VendorPriceList.js")
                   );

            //bundling for ULDCharge Page
            bundles.Add(new ScriptBundle("~/bundles/ULDCharge").Include(
                   "~/JScript/ULD/ULDCharge.js")
                   );

            //bundling for ULDInvoice Page
            bundles.Add(new ScriptBundle("~/bundles/ULDInvoice").Include(
                   "~/JScript/ULD/ULDInvoice.js")
                   );

            //bundling for ULDSLA Page
            bundles.Add(new ScriptBundle("~/bundles/ULDSLA").Include(
                   "~/JScript/ULD/ULDSLA.js")
                   );

            //bundling for MaintenanceType Page
            bundles.Add(new ScriptBundle("~/bundles/MaintenanceType").Include(
                   "~/JScript/ULD/MaintenanceType.js")
                   );

            //bundling for ULDAllocationReport Page
            bundles.Add(new ScriptBundle("~/bundles/ULDAllocationReport").Include(
                   "~/JScript/ULD/ULDAllocationReport.js")
                   );

            //bundling for ULDReports Page
            bundles.Add(new ScriptBundle("~/bundles/ULDReports").Include(
                   "~/JScript/ULD/ULDReports.js")
                   );

            //bundling for ULDSupportRequest Page
            bundles.Add(new ScriptBundle("~/bundles/ULDSupportRequest").Include(
                   "~/JScript/ULD/ULDSupportRequest.js")
                   );

            //bundling for ULDSupportAssigned Page
            bundles.Add(new ScriptBundle("~/bundles/ULDSupportAssigned").Include(
                   "~/JScript/ULD/ULDSupportAssigned.js")
                   );

            //bundling for ULDSupportProcessed Page
            bundles.Add(new ScriptBundle("~/bundles/ULDSupportProcessed").Include(
                   "~/JScript/ULD/ULDSupportProcessed.js")
                   );

            //bundling for DemurrageFreePeriod Page
            bundles.Add(new ScriptBundle("~/bundles/DemurrageFreePeriod").Include(
                   "~/JScript/ULD/DemurrageFreePeriod.js")
                   );
            //bundling for ULDRepairSLAReport Page
            bundles.Add(new ScriptBundle("~/bundles/ULDRepairSLAReport").Include(
                   "~/JScript/ULD/ULDRepairSLAReport.js")
                   );
            //bundling for ULDRepairSLAReport Page
            bundles.Add(new ScriptBundle("~/bundles/ULDStockReportDetails").Include(
                   "~/JScript/ULD/ULDStockReportDetails.js")
                   );
            /*----------------------Added By Pankaj Kumar Ishwar---------------------*/
            //bundling for ULDSLACalendar Page
            bundles.Add(new ScriptBundle("~/bundles/ULDSLACalendar").Include(
                "~/JScript/ULD/ULDSLACalendar.js")
                );
            //bundling for SCMDiscrepancy Page Ad By Sushant 
            bundles.Add(new ScriptBundle("~/bundles/SCMDiscrepancy").Include(
                   "~/JScript/ULD/SCMDiscrepancy.js")
                   );
            //bundling for ULDStatisticReports Page Ad By Sushant 05-02-2018
            bundles.Add(new ScriptBundle("~/bundles/ULDStatisticReports").Include(
                   "~/JScript/ULD/ULDStatisticReports.js")
                   );

            #endregion
            #region WAREHOUSE
            //bundling for LocationSubType Page
            bundles.Add(new ScriptBundle("~/bundles/LocationSubType").Include(
                   "~/JScript/Warehouse/LocationSubType.js")
                   );
            //bundling for WarehouseLocation Page
            bundles.Add(new ScriptBundle("~/bundles/WarehouseLocation").Include(
                   "~/JScript/Warehouse/WarehouseLocation.js")
                   );
            //bundling for Area Page
            bundles.Add(new ScriptBundle("~/bundles/Area").Include(
                   "~/JScript/Warehouse/Area.js"));
            //bundling for WarehousePlanning Page
            bundles.Add(new ScriptBundle("~/bundles/WarehousePlanning").Include(
                   "~/JScript/Warehouse/WarehousePlanning.js")
                   );
            //bundling for WarehouseSetup Page
            bundles.Add(new ScriptBundle("~/bundles/WarehouseSetup").Include(
                   "~/JScript/Warehouse/WarehouseSetup.js")
                   );
            //bundling for LocationSearch Page
            bundles.Add(new ScriptBundle("~/bundles/LocationSearch").Include(
                   "~/JScript/Warehouse/LocationSearch.js")
                   );
            //bundling for LocationType Page
            bundles.Add(new ScriptBundle("~/bundles/LocationType").Include(
                   "~/JScript/Warehouse/LocationType.js")
                   );
            #endregion
            #region IRREGULARITY
            //bundling for IrregularitySeverity Page
            bundles.Add(new ScriptBundle("~/bundles/IrregularitySeverity").Include(
                   "~/JScript/Irregularity/IrregularitySeverity.js")
                   );
            //bundling for IrregularityDamage Page
            bundles.Add(new ScriptBundle("~/bundles/IrregularityDamage").Include(
                   "~/JScript/Irregularity/IrregularityDamage.js")
                   );
            //bundling for IrregularityNonDeliveryReason Page
            bundles.Add(new ScriptBundle("~/bundles/IrregularityNonDeliveryReason").Include(
                   "~/JScript/Irregularity/IrregularityNonDeliveryReason.js")
                   );
            //bundling for IrregularityPacking Page
            bundles.Add(new ScriptBundle("~/bundles/IrregularityPacking").Include(
                   "~/JScript/Irregularity/IrregularityPacking.js")
                   );
            //bundling for Irregularity Page
            bundles.Add(new ScriptBundle("~/bundles/Irregularity").Include(
                   "~/JScript/Irregularity/Irregularity.js")
                   );
            //bundling for IrregularityEvent Page
            bundles.Add(new ScriptBundle("~/bundles/IrregularityEvent").Include(
                   "~/JScript/Irregularity/IrregularityEvent.js")
                   );
            //bundling for IrregularityRecuperation Page
            bundles.Add(new ScriptBundle("~/bundles/IrregularityRecuperation").Include(
                   "~/JScript/Irregularity/IrregularityRecuperation.js")
                   );
            //bundling for IrregularityDisposalAdvice Page
            bundles.Add(new ScriptBundle("~/bundles/IrregularityDisposalAdvice").Include(
                   "~/JScript/Irregularity/IrregularityDisposalAdvice.js")
                   );
            //bundling for IrregularityStatus Page
            bundles.Add(new ScriptBundle("~/bundles/IrregularityStatus").Include(
                   "~/JScript/Irregularity/IrregularityStatus.js")
                   );
            //bundling for SpecialCargo Page
            bundles.Add(new ScriptBundle("~/bundles/SpecialCargo").Include(
                   "~/JScript/Irregularity/SpecialCargo.js")
                   );
            //bundling for IrregularityIncident Page
            bundles.Add(new ScriptBundle("~/bundles/IrregularityIncident").Include(
                   "~/JScript/Irregularity/IrregularityIncident.js")
                   );
            //bundling for Complaint Page
            bundles.Add(new ScriptBundle("~/bundles/Complaint").Include(
                   "~/JScript/Irregularity/Complaint.js", "~/JScript/Irregularity/ComplaintNew.js", "~/Scripts/maketrans.js")
                   );
            //bundling for ApplicationEntity Page
            bundles.Add(new ScriptBundle("~/bundles/ApplicationEntity").Include(
                   "~/JScript/Irregularity/ApplicationEntity.js")
                   );
            //bundling for Claim Page
            bundles.Add(new ScriptBundle("~/bundles/Claim").Include(
                   "~/JScript/Irregularity/Claim.js")
                   );
            //bundling for IrregularityAWBReport Page
            bundles.Add(new ScriptBundle("~/bundles/IrregularityAWBReport").Include(
                   "~/JScript/Irregularity/IrregularityAWBReport.js")
                   );
            //bundling for CargoClaimReport Page
            bundles.Add(new ScriptBundle("~/bundles/CargoClaimReport").Include(
                   "~/JScript/Irregularity/CargoClaimReport.js")
                   );
            //bundling for IrregularityFlightReport Page
            bundles.Add(new ScriptBundle("~/bundles/IrregularityFlightReport").Include(
                   "~/JScript/Irregularity/IrregularityFlightReport.js")
                   );
            //bundling for ApplicationEntity Page
            bundles.Add(new ScriptBundle("~/bundles/ApplicationEntity").Include(
                   "~/JScript/Irregularity/ApplicationEntity.js")
                   );
            //bundling for ClaimReport Page
            bundles.Add(new ScriptBundle("~/bundles/ClaimReport").Include(
                   "~/JScript/Irregularity/ClaimReport.js")
                   );
            //bundling for ComplainReport Page
            bundles.Add(new ScriptBundle("~/bundles/ComplainReport").Include(
                   "~/JScript/Irregularity/ComplainReport.js")
                   );
            //bundling for ClaimComplaintTracking Page
            bundles.Add(new ScriptBundle("~/bundles/ClaimComplaintTracking").Include(
                   "~/JScript/Irregularity/ClaimComplaintTracking.js")
                   );


            #endregion
            #region SCHEDULE
            //bundling for Schedule Page
            bundles.Add(new ScriptBundle("~/bundles/Schedule").Include(
                   "~/JScript/Schedule/Schedule.js")
                   );
            //bundling for flightopen Page
            bundles.Add(new ScriptBundle("~/bundles/flightopen").Include(
                   "~/JScript/Schedule/flightopen.js")
                   );
            //bundling for ViewEditFlight Page
            bundles.Add(new ScriptBundle("~/bundles/ViewEditFlight").Include(
                   "~/JScript/Schedule/ViewEditFlight.js")
                   );
            //bundling for SSIMUpload Page
            bundles.Add(new ScriptBundle("~/bundles/SSIMUpload").Include(
                   "~/JScript/Schedule/SSIMUpload.js")
                   );
            //bundling for SASSSIMUpload Page
            bundles.Add(new ScriptBundle("~/bundles/SASSSIMUpload").Include(
                   "~/JScript/Schedule/SASSSIMUpload.js")
                   );

            #endregion
            #region REPORT
            //bundling for WorkOrder Page
            bundles.Add(new ScriptBundle("~/bundles/WorkOrder").Include(
                   "~/JScript/Report/WorkOrder.js")
                   );
            //bundling for Operation Page
            bundles.Add(new ScriptBundle("~/bundles/Operation").Include(
                   "~/JScript/Operation/Operation.js")
                   );
            //bundling for ImpOperation Page
            bundles.Add(new ScriptBundle("~/bundles/ImpOperation").Include(
                   "~/JScript/ImpOperation/ImpOperation.js")
                   );
            //bundling for CargoRanking Page
            bundles.Add(new ScriptBundle("~/bundles/CargoRanking").Include(
                   "~/JScript/Report/CargoRanking.js")
                   );
            //bundling for Consume Page
            bundles.Add(new ScriptBundle("~/bundles/Consume").Include(
                   "~/JScript/Report/Consume.js"));
            //bundling for ULDInventory Page
            bundles.Add(new ScriptBundle("~/bundles/ReportULDInventory").Include(
                   "~/JScript/Report/ULDInventory.js")
                   );
            //bundling for BalanceStock Page
            bundles.Add(new ScriptBundle("~/bundles/BalanceStock").Include(
                   "~/JScript/Report/BalanceStock.js")
                   );
            //bundling for CommonExportImportReport Page
            bundles.Add(new ScriptBundle("~/bundles/CommonExportImportReport").Include(
                   "~/JScript/Report/CommonExportImportReport.js")
                   );
            //bundling for UnclearedShipment Page
            bundles.Add(new ScriptBundle("~/bundles/UnclearedShipment").Include(
                   "~/JScript/Report/UnclearedShipment.js")
                   );
            //bundling for ExportDeparture Page
            bundles.Add(new ScriptBundle("~/bundles/ExportDeparture").Include(
                   "~/JScript/Report/ExportDeparture.js")
                   );
            //bundling for MovementRegister Page
            bundles.Add(new ScriptBundle("~/bundles/MovementRegister").Include(
                   "~/JScript/Report/SchMovementRegisteredule.js")
                   );
            //bundling for ImportStatus Page
            bundles.Add(new ScriptBundle("~/bundles/ImportStatus").Include(
                   "~/JScript/Report/ImportStatus.js")
                   );
            //bundling for Petty Page
            bundles.Add(new ScriptBundle("~/bundles/Petty").Include(
                   "~/JScript/Report/Petty.js")
                   );
            //bundling for DeliveryPending Page
            bundles.Add(new ScriptBundle("~/bundles/DeliveryPending").Include(
                   "~/JScript/Report/DeliveryPending.js")
                   );
            //bundling for ULDOut Page
            bundles.Add(new ScriptBundle("~/bundles/ULDOut").Include(
                   "~/JScript/Report/ULDOut.js")
                   );
            //bundling for ExportImport Page
            bundles.Add(new ScriptBundle("~/bundles/ExportImport").Include(
                   "~/JScript/Report/ExportImport.js")
                   );
            //bundling for UWSPending Page
            bundles.Add(new ScriptBundle("~/bundles/UWSPending").Include(
                   "~/JScript/Report/UWSPending.js")
                   );
            //bundling for ExportCSR Page
            bundles.Add(new ScriptBundle("~/bundles/ExportCSR").Include(
                   "~/JScript/Report/ExportCSR.js")
                   );
            //bundling for ImportCSR Page
            bundles.Add(new ScriptBundle("~/bundles/ImportCSR").Include(
                   "~/JScript/Report/ImportCSR.js")
                   );
            //bundling for CargoRankingEI Page
            bundles.Add(new ScriptBundle("~/bundles/CargoRankingEI").Include(
                   "~/JScript/Report/CargoRankingEI.js")
                   );
            //bundling for Schedule Page
            bundles.Add(new ScriptBundle("~/bundles/ConsigneeSummary").Include(
                   "~/JScript/Report/ConsigneeSummary.js")
                   );
            //bundling for TariffHistory Page
            bundles.Add(new ScriptBundle("~/bundles/TariffHistory").Include(
                   "~/JScript/Report/TariffHistory.js")
                   );
            //bundling for FlightAvailCapacity Page
            bundles.Add(new ScriptBundle("~/bundles/FlightAvailCapacity").Include(
                   "~/JScript/Report/FlightAvailCapacity.js")
                   );
            bundles.Add(new ScriptBundle("~/bundles/FlightAvailCapacity").Include(
                   "~/Scripts/KendoSchedular/Content/JS/jszip.js")
                   );
            //bundling for HandedOver Page
            bundles.Add(new ScriptBundle("~/bundles/HandedOver").Include(
                   "~/JScript/Report/HandedOver.js")
                   );
            //bundling for FlightStatus Page
            bundles.Add(new ScriptBundle("~/bundles/FlightStatus").Include(
                   "~/JScript/Report/FlightStatus.js")
                   );
            //bundling for ULDHistory Page
            bundles.Add(new ScriptBundle("~/bundles/ULDHistory").Include(
                   "~/JScript/Report/ULDHistory.js")
                   );
            //bundling for ULDMovementHistory Page
            bundles.Add(new ScriptBundle("~/bundles/ULDMovementHistory").Include(
                   "~/JScript/Report/ULDMovementHistory.js")
                   );
            //bundling for ULDMonitoring Page
            bundles.Add(new ScriptBundle("~/bundles/ULDMonitoring").Include(
                   "~/JScript/Report/ULDMonitoring.js")
                   );
            //bundling for ULDMonitoring Page
            //bundles.Add(new ScriptBundle("~/bundles/SLA").Include(
            //       "~/JScript/Report/SLA.js")
            //       ); //Commented by Shahbaz akhtar
            //bundling for Handling Page
            bundles.Add(new ScriptBundle("~/bundles/Handling").Include(
                   "~/JScript/Report/Handling.js")
                   );
            //bundling for ESS Page
            bundles.Add(new ScriptBundle("~/bundles/ESS").Include(
                   "~/JScript/Report/ESS.js")
                   );
            bundles.Add(new ScriptBundle("~/bundles/ESS_DailyReport").Include(
                  "~/JScript/Report/ESS_DailyReport.js")
                  );
            bundles.Add(new ScriptBundle("~/bundles/DailyFinalDeliveryReport").Include(
                "~/JScript/Report/DailyFinalDeliveryReport.js")
                );
            //bundling for CreditLimit Page
            bundles.Add(new ScriptBundle("~/bundles/CreditLimit").Include(
                   "~/JScript/Report/CreditLimit.js")
                   );

            //bundling for CreditLimitTransactionReport Page
            bundles.Add(new ScriptBundle("~/bundles/CreditLimitTransactionReport").Include(
                   "~/JScript/Report/CreditLimitTransactionReport.js")
                   );

            //bundling for SeaAir Page
            bundles.Add(new ScriptBundle("~/bundles/SeaAir").Include(
                   "~/JScript/Report/SeaAir.js")
                   );

            //bundling for CargoAirlineVolume Page
            bundles.Add(new ScriptBundle("~/bundles/CargoAirlineVolume").Include(
                   "~/JScript/Report/CargoAirlineVolume.js")
                   );

            //bundling for ExportFlightMonitoring Page
            bundles.Add(new ScriptBundle("~/bundles/ExportFlightMonitoring").Include(
                   "~/JScript/Report/ExportFlightMonitoring.js")
                   );
            //bundling for ImportFlightMonitoring Page
            bundles.Add(new ScriptBundle("~/bundles/ImportFlightMonitoring").Include(
                   "~/JScript/Report/ImportFlightMonitoring.js")
                   );
            //bundling for Builtupreport Page
            bundles.Add(new ScriptBundle("~/bundles/Builtupreport").Include(
                   "~/JScript/Report/Builtupreport.js")
                   );
            // By Arman Ali 
            bundles.Add(new ScriptBundle("~/bundles/NonExecutedBooking").Include(
                 "~/JScript/Report/NonExecutedBooking.js")
                 );
            #endregion
            #region MAIL
            //bundling for AirMail Page
            bundles.Add(new ScriptBundle("~/bundles/AirMail").Include(
                   "~/JScript/Mail/AirMail.js", "~/JScript/Mail/Flightmail")
                   );
            //bundling for AirMailManifest Page
            bundles.Add(new ScriptBundle("~/bundles/AirMailManifest").Include(
                   "~/JScript/Mail/AirMailManifest.js")
                   );
            #endregion
            #region BUILDUP
            //bundling for AgentBuildUp Page
            bundles.Add(new ScriptBundle("~/bundles/AgentBuildUp").Include(
                   "~/JScript/BuildUp/AgentBuildUp.js")
                   );
            //bundling for AgentBuildUpWeighing Page
            bundles.Add(new ScriptBundle("~/bundles/AgentBuildUpWeighing").Include(
                   "~/JScript/BuildUp/AgentBuildUpWeighing.js")
                   );
            #endregion
            #region PERMISSIONS
            //bundling for ProcessDependency Page
            bundles.Add(new ScriptBundle("~/bundles/ProcessDependency").Include(
                "~/Scripts/Manage/ProcessDependency.js")
                );
            //bundling for Users Page
            bundles.Add(new ScriptBundle("~/bundles/Users").Include(
                "~/Scripts/Manage/Users.js")
                );
            //bundling for UserStatus Page
            bundles.Add(new ScriptBundle("~/bundles/UserStatus").Include(
                "~/Scripts/Manage/UserStatus.js")
                );
            //Add By Pankaj Kumar Ishwar for Release Note
            bundles.Add(new ScriptBundle("~/bundles/ReleaseNote").Include(
                "~/JScript/Permissions/ReleaseNote.js")
                );
            //Add By SUSHANT KUMAR NAYAK For  Email Alert 
            bundles.Add(new ScriptBundle("~/bundles/EmailAlert").Include(
                "~/JScript/Permissions/EmailAlert.js")
                );
            //Add By Devendra For  UserType Alert 
            bundles.Add(new ScriptBundle("~/bundles/UserType").Include(
                "~/JScript/Permissions/UserType.js")
                );
            bundles.Add(new ScriptBundle("~/bundles/Banner").Include(
             "~/JScript/Permissions/Banner.js")
             );
            #endregion
            #region WINDOWSERVICESREPORT
            //bundling for WindowServicesReport Page
            bundles.Add(new ScriptBundle("~/bundles/WindowServicesReport").Include(
                "~/JScript/Permissions/WindowServicesReport.js")
                );
            #endregion
            #region HOLDSHPT
            //bundling for HoldShpt Page
            bundles.Add(new ScriptBundle("~/bundles/HoldShpt").Include(
                "~/JScript/Permissions/HoldShpt.js")
                );
            //bundling for AlertEvents Page
            bundles.Add(new ScriptBundle("~/bundles/AlertEvents").Include(
                "~/JScript/Permissions/AlertEvents.js")
                );
            //bundling for ChangePassword Page
            bundles.Add(new ScriptBundle("~/bundles/ChangePassword").Include(
                "~/JScript/Permissions/ChangePassword.js")
                );
            //bundling for Allotment Page
            bundles.Add(new ScriptBundle("~/bundles/Allotment").Include(
                "~/JScript/Permissions/Allotment.js")
                );

            #endregion
            #region AUDITLOG
            //bundling for ActivityLog Page
            bundles.Add(new ScriptBundle("~/bundles/ActivityLog").Include(
                "~/JScript/AuditLog/ActivityLog.js")
                );
            #endregion
            #region SECURITY
            //bundling for Manage Page
            bundles.Add(new ScriptBundle("~/bundles/Group").Include(
                "~/PermissionScripts/Manage/Group.js", "~/PermissionScripts/Manage/manage-permission.js")
                );

            #endregion
            #region TOOLS
            //bundling for SeaAirTool Page
            bundles.Add(new ScriptBundle("~/bundles/SeaAirTool").Include(
                "~/JScript/Tools/SeaAirTool.js")
                );
            #endregion
            #region TARIFF
            //bundling for BasisOfCharge Page
            bundles.Add(new ScriptBundle("~/bundles/BasisOfCharge").Include(
                "~/JScript/Tariff/BasisOfCharge.js")
                );
            //bundling for ESSCharges Page
            bundles.Add(new ScriptBundle("~/bundles/ESSCharges").Include(
                "~/JScript/Tariff/ESSCharges.js")
                );
            //bundling for RoundOffCurrency Page
            bundles.Add(new ScriptBundle("~/bundles/RoundOffCurrency").Include(
                "~/JScript/Tariff/RoundOffCurrency.js")
                );
            //bundling for ManageTariff Page
            bundles.Add(new ScriptBundle("~/bundles/ManageTariff").Include(
                "~/JScript/Tariff/ManageTariff.js")
                );

            //bundling for HandlingCharges Page
            bundles.Add(new ScriptBundle("~/bundles/HandlingCharges").Include(
                "~/JScript/Tariff/HandlingCharges.js", "~/Scripts/maketrans.js")
                );

            //bundling for HolidayList Page
            bundles.Add(new ScriptBundle("~/bundles/HolidayList").Include(
                "~/JScript/Rate/HolidayList.js")
                );

            //bundling for GenerateInvoice Page
            bundles.Add(new ScriptBundle("~/bundles/GenerateInvoice").Include(
                "~/JScript/Tariff/GenerateInvoice.js")
                );
            //bundling for TariffSearch Page
            bundles.Add(new ScriptBundle("~/bundles/TariffSearch").Include(
                "~/JScript/Tariff/TariffSearch.js")
                );

            #endregion
            #region IMPORT
            //bundling for InboundFlight Page
            bundles.Add(new ScriptBundle("~/bundles/InboundFlight").Include(
                "~/JScript/Import/InboundFlight.js")
                );
            //bundling for DeliveryOrder Page
            bundles.Add(new ScriptBundle("~/bundles/DeliveryOrder").Include(
                "~/JScript/Import/DeliveryOrder.js",
                "~/JScript/Import/DeliveryOrderNew.js",
                "~/JScript/Import/DeliveryProcessFHL.js")
                );
            //bundling for FlightArrival Page
            bundles.Add(new ScriptBundle("~/bundles/FlightArrival").Include(
                "~/JScript/Import/FlightArrival.js")
                );
            //bundling for ReceivedConsumable Page
            bundles.Add(new ScriptBundle("~/bundles/ReceivedConsumable").Include(
                "~/JScript/Import/ReceivedConsumable.js")
                );
            //bundling for FWBImport Page
            bundles.Add(new ScriptBundle("~/bundles/FWBImport").Include(
                "~/JScript/Import/FWBImport.js")
                );
            //bundling for ImportFWBMaster Page
            bundles.Add(new ScriptBundle("~/bundles/ImportFWBMaster").Include(
                "~/JScript/Import/ImportFWBMaster.js")
                );
            //bundling for TransitMonitoring Page
            bundles.Add(new ScriptBundle("~/bundles/TransitMonitoring").Include(
                "~/JScript/Import/TransitMonitoring.js")
                );
            //bundling for CTM Page
            bundles.Add(new ScriptBundle("~/bundles/CTM").Include(
                "~/JScript/Import/CTM.js"));
            //bundling for TransitFWB Page
            bundles.Add(new ScriptBundle("~/bundles/TransitFWB").Include(
                "~/JScript/Shipment/TransitFWB.js")
                );
            //bundling for ImportRFS Page
            bundles.Add(new ScriptBundle("~/bundles/ImportRFS").Include(
                "~/JScript/Import/ImportRFS.js")
                );
            //bundling for AddShipmentAdjustment Page
            bundles.Add(new ScriptBundle("~/bundles/AddShipmentAdjustment").Include(
                "~/JScript/Import/AddShipmentAdjustment.js")
                );
            #endregion
            #region EXPORT
            //bundling for RampOffload Page
            bundles.Add(new ScriptBundle("~/bundles/RampOffload").Include(
                "~/JScript/Export/RampOffload.js")
                );
            #endregion
            #region EDI
            //bundling for EventMaster Page
            bundles.Add(new ScriptBundle("~/bundles/EventMaster").Include(
                "~/JScript/EDI/EventMaster.js")
                );
            //bundling for MessageTypeMaster Page
            bundles.Add(new ScriptBundle("~/bundles/MessageTypeMaster").Include(
                "~/JScript/EDI/MessageTypeMaster.js"
                , "~/Scripts/maketrans.js")
                );
            //bundling for EventMessageTrans Page
            bundles.Add(new ScriptBundle("~/bundles/EventMessageTrans").Include(
                "~/JScript/EDI/EventMessageTrans.js")
                );
            //bundling for RecipientMsgConfig Page
            bundles.Add(new ScriptBundle("~/bundles/RecipientMsgConfig").Include(
                "~/JScript/EDI/RecipientMsgConfig.js")
                );
            //bundling for TelexType Page
            bundles.Add(new ScriptBundle("~/bundles/TelexType").Include(
                "~/JScript/EDI/TelexType.js")
                );
            //bundling for MOP Page
            bundles.Add(new ScriptBundle("~/bundles/MOP").Include(
                "~/JScript/EDI/MOP.js")
                );

            #endregion
            #region RFS
            //bundling for RFS Page
            bundles.Add(new ScriptBundle("~/bundles/RFS").Include(
                "~/JScript/RFS/RFS.js")
                );

            #endregion
            #region DASHBOARD
            //bundling for Dashboard Page
            bundles.Add(new ScriptBundle("~/bundles/Dashboard").Include(
                "~/JScript/Dashboard/Dashboard.js")
                );
            bundles.Add(new ScriptBundle("~/bundles/Dashboard").Include(
              "~/JScript/Dashboard/MainDashboard.js")
              );
            #endregion
            #region CRA
            //bundling for Dashboard Page
            bundles.Add(new ScriptBundle("~/bundles/CRAInvoiceList").Include(
                "~/JScript/CRA/CRAInvoiceList.js")
                );
            #endregion

            #region Maindahboard
            //bundling for Dashboard Page
            bundles.Add(new ScriptBundle("~/bundles/Maindahboard").Include(
                "~/JScript/Dashboard/MainDashboard.js")
                );
			#endregion

			#region NEW Booking
			//bundling for NEW Booking Page
			bundles.Add(new ScriptBundle("~/bundles/Booking").Include(
					 "~/JScript/Reservation/Booking.js")
					 );
			bundles.Add(new StyleBundle("~/Content/default").Include(
			   "~/Styles/Booking.css"));
            #endregion

            #region budget
            //bundling for NEW Booking Page
            bundles.Add(new ScriptBundle("~/bundles/budget").Include(
                     "~/JScript/budget/budget.js")
                     );
            #endregion

            #region OffloadReason
            //bundling for Offload Reason Page -- Added By Priti Yadav (15 Apr 2020)
            bundles.Add(new ScriptBundle("~/bundles/OffloadReason").Include(
                     "~/JScript/Master/OffloadReason.js")
                     );
            #endregion

            #region HSCode
            //bundling for Offload Reason Page -- Added By Priti Yadav (20 Apr 2020)
            bundles.Add(new ScriptBundle("~/bundles/HSCode").Include(
                     "~/JScript/Master/HSCode.js")
                     );
            #endregion


        }

    }
}
