using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace CargoFlashCargoWebApps
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            //routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "",
                url: "SpaceControl/{action}/{id}",
                defaults: new { controller = "SpaceControl", action = "FlightPlan", id = UrlParameter.Optional }
            );
            routes.MapRoute(
             name: "",
             url: "SpaceControl/{action}/{AWBSNo}/{Status}",
             defaults: new { controller = "SpaceControl", action = "SpaceControlSearch", AWBSNo = UrlParameter.Optional, Status = UrlParameter.Optional }
            );
            routes.MapRoute(
            name: "",
            url: "Reports/{action}/{id}",
            defaults: new { controller = "Reports",  id = UrlParameter.Optional }
           );

            routes.MapRoute(
             name: "",
             url: "budget/{action}/{id}",
             defaults: new { controller = "budget", action = "search", id = UrlParameter.Optional }
            );

            routes.MapRoute(
               name: "",
               url: "Schedule/{action}/{id}",
               defaults: new { controller = "Schedule", action = "ViewEditFlight", id = UrlParameter.Optional }
           );

            routes.MapRoute(
               name: "",
               url: "BLOBUploadAndDownload/{action}/{id}",
               defaults: new { controller = "BLOBUploadAndDownload", action = "UploadToBlob", id = UrlParameter.Optional }
           );


            routes.MapRoute(
              name: "",
              url: "Master/{action}/{id}",
              defaults: new { controller = "Master", id = UrlParameter.Optional }
          );
            routes.MapRoute(
                           name: "",
                           url: "Tracking/{action}/{id}",
                           defaults: new { controller = "Tracking", action = "AWB", id = UrlParameter.Optional }
                       );

            routes.MapRoute(
                         name: "",
                         url: "Tracking/{id}",
                         defaults: new { controller = "Tracking", action = "Status", id = UrlParameter.Optional }
                     );
            //  routes.MapRoute(
            //    name: "",
            //    url: "FBLExcel/{action}/{id}",
            //    defaults: new { controller = "FBLExcel", id = UrlParameter.Optional }
            //);

            routes.MapRoute(
              name: "",
              url: "AWBStockStatus/{action}/{id}",
              defaults: new { controller = "AWBStockStatus", id = UrlParameter.Optional }
          );

            routes.MapRoute(
                name: "",
                url: "AllotmentRelease/{action}/{id}",
                defaults: new { controller = "AllotmentRelease", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                 name: "",
                 url: "WarehouseUtilization/{action}/{id}",
                 defaults: new { controller = "WarehouseUtilization", id = UrlParameter.Optional }
             );

            routes.MapRoute(
               name: "",
               url: "SearchSchedule/{action}/{id}",
               defaults: new { controller = "SearchSchedule", id = UrlParameter.Optional }
           );
            routes.MapRoute(
            name: "",
            url: "SearchTactRate/{action}/{id}",
            defaults: new { controller = "SearchTactRate", id = UrlParameter.Optional }
        );
            routes.MapRoute(
           name: "",
           url: "AWBStockHistory/{action}/{id}",
           defaults: new { controller = "AWBStockHistory", id = UrlParameter.Optional }
       );

            routes.MapRoute(
             name: "",
             url: "AuditLog/{action}/{id}",
             defaults: new { controller = "AuditLog", id = UrlParameter.Optional }
         );
            routes.MapRoute(
         name: "",
         url: "AuditLogNew/{action}/{id}",
         defaults: new { controller = "AuditLogNew", id = UrlParameter.Optional }
     );
            routes.MapRoute(
    name: "",
    url: "InvoiceDetail/{action}/{id}",
    defaults: new { controller = "InvoiceDetail", id = UrlParameter.Optional }
);

            routes.MapRoute(
              name: "",
              url: "ReceiptAdjustmentDetail/{action}/{id}",
              defaults: new { controller = "ReceiptAdjustmentDetail", id = UrlParameter.Optional }
             );


            routes.MapRoute(
      name: "",
      url: "ULDDamageReport/{action}/{id}",
      defaults: new { controller = "ULDDamageReport", id = UrlParameter.Optional }
  );
            routes.MapRoute(
           name: "",
           url: "BlackListAWB/{action}/{id}",
           defaults: new { controller = "BlackListAWB", id = UrlParameter.Optional }
       );
            routes.MapRoute(
         name: "",
         url: "BlackListAWBHistory/{action}/{id}",
         defaults: new { controller = "BlackListAWBHistory", id = UrlParameter.Optional }
     );
            routes.MapRoute(
                name: "",
                url: "AWBStockHistoryReport/{action}/{id}",
                defaults: new { controller = "AWBStockHistoryReport", id = UrlParameter.Optional }
            );

            routes.MapRoute(
              name: "",
              url: "AWBPenalty/{action}/{id}",
              defaults: new { controller = "AWBPenalty", id = UrlParameter.Optional }
          );
            //Added by Shatrughana Gupta
            routes.MapRoute(
               name: "",
               url: "AWBRateAuditLog/{action}/{id}",
               defaults: new { controller = "AWBRateAuditLog", action = "Index", id = UrlParameter.Optional }
           );
            routes.MapRoute(
              name: "",
              url: "AppliedSpotRate/{action}/{id}",
              defaults: new { controller = "AppliedSpotRate", action = "Index", id = UrlParameter.Optional }
          );

            routes.MapRoute(
             name: "",
             url: "PenaltyReport/{action}/{id}",
             defaults: new { controller = "PenaltyReport", id = UrlParameter.Optional }
         );
            routes.MapRoute(
             name: "",
             url: "MasterBookList/{action}/{id}",
             defaults: new { controller = "MasterBookList", id = UrlParameter.Optional }
         );
            routes.MapRoute(
          name: "",
          url: "AgentStockReport/{action}/{id}",
          defaults: new { controller = "AgentStockReport", id = UrlParameter.Optional }
      );
            routes.MapRoute(
          name: "",
          url: "AWBLevelPrimeGCRFlightReport/{action}/{id}",
          defaults: new { controller = "AWBLevelPrimeGCRFlightReport", id = UrlParameter.Optional }
      );
            routes.MapRoute(
             name: "",
             url: "AmendFlightSearch/{action}/{id}",
             defaults: new { controller = "AmendFlightSearch", id = UrlParameter.Optional }
         );

            routes.MapRoute(
               name: "",
               url: "FrieghtBooking/{action}/{id}",
               defaults: new { controller = "FrieghtBooking", id = UrlParameter.Optional }
           );

            routes.MapRoute(
              name: "",
              url: "ULDReport/{action}/{id}",
              defaults: new { controller = "ULDReport", id = UrlParameter.Optional }
          );

            routes.MapRoute(
              name: "",
              url: "CCAReport/{action}/{id}",
              defaults: new { controller = "CCAReport", id = UrlParameter.Optional }
          );

            routes.MapRoute(
                name: "",
                url: "CampaignUtilisationReport/{action}/{id}",
                defaults: new { controller = "CampaignUtilisationReport", id = UrlParameter.Optional }
            );
            routes.MapRoute(
                name: "",
                url: "StockAgeingReport/{action}/{id}",
                defaults: new { controller = "StockAgeingReport", id = UrlParameter.Optional }
            );

            routes.MapRoute(
               name: "",
               url: "AWBHistory/{action}/{id}",
               defaults: new { controller = "AWBHistory", id = UrlParameter.Optional }
           );

            routes.MapRoute(
                 name: "",
                 url: "UserHistory/{action}/{id}",
                 defaults: new { controller = "UserHistory", id = UrlParameter.Optional }
             );
            routes.MapRoute(
               name: "",
               url: "PostFlightReport/{action}/{id}",
               defaults: new { controller = "PostFlightReport", id = UrlParameter.Optional }
           );
            routes.MapRoute(
               name: "",
               url: "DailySalesReport/{action}/{id}",
               defaults: new { controller = "DailySalesReport", id = UrlParameter.Optional }
           );
            routes.MapRoute(
               name: "",
               url: "PerformanceRouteReport/{action}/{id}",
               defaults: new { controller = "PerformanceRouteReport", id = UrlParameter.Optional }
           );

            routes.MapRoute(
                name: "",
                url: "CargoClaimReport/{action}/{id}",
                defaults: new { controller = "CargoClaimReport", id = UrlParameter.Optional }
            );
            routes.MapRoute(
                name: "",
                url: "ClaimReport/{action}/{id}",
                defaults: new { controller = "ClaimReport", id = UrlParameter.Optional }
            );
            routes.MapRoute(
                name: "",
                url: "ComplainReport/{action}/{id}",
                defaults: new { controller = "ComplainReport", id = UrlParameter.Optional }
            );
            routes.MapRoute(
               name: "",
               url: "IrregularityReport/{action}/{id}",
               defaults: new { controller = "IrregularityReport", id = UrlParameter.Optional }
           );
            routes.MapRoute(
                 name: "",
                 url: "DailyStockTransactionReport/{action}/{id}",
                 defaults: new { controller = "DailyStockTransactionReport", id = UrlParameter.Optional }
             );
            routes.MapRoute(
                 name: "",
                 url: "IndividualSalesReport/{action}/{id}",
                 defaults: new { controller = "IndividualSalesReport", id = UrlParameter.Optional }
             );
            routes.MapRoute(
                  name: "",
                  url: "FlightCapacityDashboard/{action}/{id}",
                  defaults: new { controller = "FlightCapacityDashboard", id = UrlParameter.Optional }

              );
            routes.MapRoute(
             name: "",
             url: "DataSetToExcel/{action}/{id}",
             defaults: new { controller = "DataSetToExcel", id = UrlParameter.Optional }
         );

            routes.MapRoute(
            name: "",
            url: "ExcelForEdi/{action}/{id}",
            defaults: new { controller = "ExcelForEdi", id = UrlParameter.Optional }
        );

            routes.MapRoute(
             name: "",
             url: "BookingVarianceReport/{action}/{id}",
             defaults: new { controller = "BookingVarianceReport", id = UrlParameter.Optional }
         );

            routes.MapRoute(
                 name: "",
                 url: "ClaimComplaintTracking/{action}/{id}",
                 defaults: new { controller = "ClaimComplaintTracking", id = UrlParameter.Optional }
             );
            routes.MapRoute(
              name: "",
              url: "WarehouseAccountReport/{action}/{id}",
              defaults: new { controller = "WarehouseAccountReport", id = UrlParameter.Optional }
          );
            routes.MapRoute(
                 name: "",
                 url: "ReservationVSCRAComparision/{action}/{id}",
                 defaults: new { controller = "ReservationVSCRAComparision", id = UrlParameter.Optional }
             );
            routes.MapRoute(
                name: "",
                url: "FreightCalculation/{action}/{id}",
                defaults: new { controller = "FreightCalculation", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                 name: "",
                 url: "AccelaeroReport/{action}/{id}",
                 defaults: new { controller = "AccelaeroReport", id = UrlParameter.Optional }
             );//added by ankit kumar

            routes.MapRoute(
         name: "",
         url: "DailyDepartedFlightReport/{action}/{id}",
         defaults: new { controller = "DailyDepartedFlightReport", id = UrlParameter.Optional }
        );  //added by Nehal Ahmad

            routes.MapRoute(
                 name: "",
                 url: "EmbargoReport/{action}/{id}",
                 defaults: new { controller = "EmbargoReport", id = UrlParameter.Optional }
             );
            routes.MapRoute(
                name: "",
                url: "POMailReport/{action}/{id}",
                defaults: new { controller = "POMailReport", id = UrlParameter.Optional }
            );
            routes.MapRoute(
                 name: "",
                 url: "ChargesCollect/{action}/{id}",
                 defaults: new { controller = "ChargesCollect", id = UrlParameter.Optional }
             );
            routes.MapRoute(
          name: "",
          url: "InsertMessage/{action}/{id}",
          defaults: new { controller = "InsertMessage", id = UrlParameter.Optional }
      );
            routes.MapRoute(
        name: "",
        url: "ManualEdiMessage/{action}/{id}",
        defaults: new { controller = "ManualEdiMessage", id = UrlParameter.Optional }
    );

            routes.MapRoute(
        name: "",
        url: "GroupPermissionDetail/{action}/{id}",
        defaults: new { controller = "GroupPermissionDetail", id = UrlParameter.Optional }
    );
            routes.MapRoute(
                   name: "",
                   url: "UserGroupLevelDetail/{action}/{id}",
                   defaults: new { controller = "UserGroupLevelDetail", id = UrlParameter.Optional }
               );

            routes.MapRoute(
                  name: "",
                  url: "UserSpecialPermission/{action}/{id}",
                  defaults: new { controller = "UserSpecialPermission", id = UrlParameter.Optional }
              );
            routes.MapRoute(
                 name: "",
                 url: "PointOfSales/{action}/{id}",
                 defaults: new { controller = "PointOfSales", id = UrlParameter.Optional }
             );

            routes.MapRoute(
                 name: "",
                 url: "StationWiseSummary/{action}/{id}",
                 defaults: new { controller = "StationWiseSummary", id = UrlParameter.Optional }
             );
            routes.MapRoute(
                 name: "",
                 url: "DailyReportForHO/{action}/{id}",
                 defaults: new { controller = "DailyReportForHO", id = UrlParameter.Optional }
             );
            routes.MapRoute(
                 name: "",
                 url: "FlightWisePerformanceReport/{action}/{id}",
                 defaults: new { controller = "FlightWisePerformanceReport", id = UrlParameter.Optional }
             );
            routes.MapRoute(
     name: "",
     url: "ValidateEDIMessage/{action}/{id}",
     defaults: new { controller = "ValidateEDIMessage", id = UrlParameter.Optional }
 );
            routes.MapRoute(
                  name: "",
                  url: "FlightSummaryReport/{action}/{id}",
                  defaults: new { controller = "FlightSummaryReport", id = UrlParameter.Optional }
              );
            routes.MapRoute(
                  name: "",
                  url: "SpecialCargoReports/{action}/{id}",
                  defaults: new { controller = "SpecialCargoReports", id = UrlParameter.Optional }
              );


            routes.MapRoute(
                name: "",
                url: "ShortAdhoc/{action}/{id}",
                defaults: new { controller = "ShortAdhoc", id = UrlParameter.Optional }
            );


            routes.MapRoute(
                  name: "",
                  url: "OffloadReport/{action}/{id}",
                  defaults: new { controller = "OffloadReport", id = UrlParameter.Optional }
              );

            routes.MapRoute(
                 name: "",
                 url: "FlightAvailCapacity/{action}/{id}",
                 defaults: new { controller = "FlightAvailCapacity", action = "Index", id = UrlParameter.Optional }
             );

            routes.MapRoute(
                   name: "",
                   url: "FlightCapacityReport/{action}/{id}",
                   defaults: new { controller = "FlightCapacityReport", id = UrlParameter.Optional }
               );
            routes.MapRoute(
                     name: "",
                     url: "HoldTypeReport/{action}/{id}",
                     defaults: new { controller = "HoldTypeReport", id = UrlParameter.Optional }
                 );
            routes.MapRoute(
                   name: "",
                   url: "DiscrepancyReport/{action}/{id}",
                   defaults: new { controller = "DiscrepancyReport", id = UrlParameter.Optional }
               );
            routes.MapRoute(
                  name: "",
                  url: "SegregationReport/{action}/{id}",
                  defaults: new { controller = "SegregationReport", id = UrlParameter.Optional }
              );
            routes.MapRoute(
                name: "",
                url: "DOIssuanceReport/{action}/{id}",
                defaults: new { controller = "DOIssuanceReport", id = UrlParameter.Optional }
            );
            routes.MapRoute(
                             name: "",
                             url: "DamageCargoReport/{action}/{id}",
                             defaults: new { controller = "DamageCargoReport", id = UrlParameter.Optional }
                         );
            routes.MapRoute(
                   name: "",
                   url: "TransitShipmentsReport/{action}/{id}",
                   defaults: new { controller = "TransitShipmentsReport", id = UrlParameter.Optional }
               );
            routes.MapRoute(
                name: "",
                url: "AirMailReport/{action}/{id}",
                defaults: new { controller = "AirMailReport", id = UrlParameter.Optional }
            );
            routes.MapRoute(
                   name: "",
                   url: "WarehouseInventoryReport/{action}/{id}",
                   defaults: new { controller = "WarehouseInventoryReport", id = UrlParameter.Optional }
               );

            routes.MapRoute(
                  name: "",
                  url: "FPRReport/{action}/{id}",
                  defaults: new { controller = "FPRReport", id = UrlParameter.Optional }
              );

            //Added By Shivam 
            routes.MapRoute(
                    name: "",
                    url: "FMRDailyReport/{action}/{id}",
                    defaults: new { controller = "FMRDailyReport", id = UrlParameter.Optional }
             );

            //Added By Shivam 
            routes.MapRoute(
                    name: "",
                    url: "CLBalanceReport/{action}/{id}",
                    defaults: new { controller = "CLBalanceReport", id = UrlParameter.Optional }
             );




            routes.MapRoute(
                 name: "",
                 url: "FPRLionReport/{action}/{id}",
                 defaults: new { controller = "FPRLionReport", id = UrlParameter.Optional }
             );
            // Add By Sushant 08-02-2018
            routes.MapRoute(
                name: "",
                url: "Ulducmreport/{action}/{id}",
                defaults: new { controller = "Ulducmreport", id = UrlParameter.Optional }
            );
            // Add By Sushant 10-02-2018
            routes.MapRoute(
                name: "",
                url: "ULDOutInReport/{action}/{id}",
                defaults: new { controller = "ULDOutInReport", id = UrlParameter.Optional }
            );


            routes.MapRoute(
                name: "",
                url: "GlobalServices/{action}/{id}",
                defaults: new { controller = "GlobalServices", id = UrlParameter.Optional }
            );

            routes.MapRoute(
              name: "",
              url: "GenerateInsuranceCertificate/{action}/{id}",
              defaults: new { controller = "GenerateInsuranceCertificate", id = UrlParameter.Optional }
          );
            routes.MapRoute(
             name: "",
             url: "FABReport/{action}/{id}",
             defaults: new { controller = "FABReport", id = UrlParameter.Optional }
         );
            routes.MapRoute(
                             name: "",
                             url: "FlightStatusReport/{action}/{id}",
                             defaults: new { controller = "FlightStatusReport", id = UrlParameter.Optional }
                         );

            routes.MapRoute(
                          name: "",
                          url: "FABSlabWiseReport/{action}/{id}",
                          defaults: new { controller = "FABSlabWiseReport", id = UrlParameter.Optional }
                      );

            routes.MapRoute(
                          name: "",
                          url: "StationSummaryReport/{action}/{id}",
                          defaults: new { controller = "StationSummaryReport", id = UrlParameter.Optional }
                      );


            routes.MapRoute(
                          name: "",
                          url: "ProductWiseReport/{action}/{id}",
                          defaults: new { controller = "ProductWiseReport", id = UrlParameter.Optional }
                      );

            routes.MapRoute(
              name: "",
              url: "PenaltyApprovalReport/{action}/{id}",
              defaults: new { controller = "PenaltyApprovalReport", id = UrlParameter.Optional }
          );
            routes.MapRoute(
            name: "",
            url: "CancelInvoicereport/{action}/{id}",
            defaults: new { controller = "CancelInvoicereport", id = UrlParameter.Optional }
        );
            // Added by Devendra ON 27 JULY  2018 FOR TransitAWBReport
            routes.MapRoute(
          name: "",
          url: "TransitAWBReport/{action}/{id}",
          defaults: new { controller = "TransitAWBReport", id = UrlParameter.Optional }
      );
            // Add by UMAR ON 20-Sep-2018 For AnyTimeCSR Report
            routes.MapRoute(
                name: "",
                url: "AnyTimeCSR/{action}/{id}",
                defaults: new { controller = "AnyTimeCSR", id = UrlParameter.Optional }
            );

            // Add by UMAR ON 18-Dec-2018 For AgentPayment Report
            routes.MapRoute(
                name: "",
                url: "AgentPayment/{action}/{id}",
                defaults: new { controller = "AgentPayment", id = UrlParameter.Optional }
            );
            // Add by Arman ON 18-Dec-2018 For Payment Status Report
            routes.MapRoute(
                name: "",
                url: "PaymentStatusReport/{action}/{id}",
                defaults: new { controller = "PaymentStatusReport", id = UrlParameter.Optional }
            );

            // Add by Arman ON 18-Dec-2018 For BTB Report 
            routes.MapRoute(
                name: "",
                url: "BTBReport/{action}/{id}",
                defaults: new { controller = "BTBReport", id = UrlParameter.Optional }
            );

            // Add by Pankaj Kumar Ishwar on 04-Oct-2018
            routes.MapRoute(
              name: "",
              url: "PendingArrivalReport/{action}/{id}",
              defaults: new { controller = "PendingArrivalReport", id = UrlParameter.Optional }
          );
            routes.MapRoute(
              name: "",
              url: "AddShipmentReport/{action}/{id}",
              defaults: new { controller = "AddShipmentReport", id = UrlParameter.Optional }
          );
            routes.MapRoute(
             name: "",
             url: "LoadFactorFlight/{action}/{id}",
             defaults: new { controller = "LoadFactorFlight", id = UrlParameter.Optional }
         );
            routes.MapRoute(
             name: "",
             url: "MarineInsuranceReport/{action}/{id}",
             defaults: new { controller = "MarineInsuranceReport", id = UrlParameter.Optional }
         );
            routes.MapRoute(
             name: "",
             url: "MarineInsuranceBOReport/{action}/{id}",
             defaults: new { controller = "MarineInsuranceBOReport", id = UrlParameter.Optional }
         );
            routes.MapRoute(
             name: "",
             url: "UnInvoiceAwbReport/{action}/{id}",
             defaults: new { controller = "UnInvoiceAwbReport", id = UrlParameter.Optional }
         );
            routes.MapRoute(
             name: "",
             url: "DailyReportPOD/{action}/{id}",
             defaults: new { controller = "DailyReportPOD", id = UrlParameter.Optional }
         );
            routes.MapRoute(
                name: "",
                url: "DashBoardFlightReport/{action}/{id}",
                defaults: new { controller = "DashBoardFlightReport", id = UrlParameter.Optional }
            );
            // -------------------------------------------------------------------
            routes.MapRoute(
                name: "",
                url: "FlightWiseDiscoutingForRate/{action}/{id}",
                defaults: new { controller = "FlightWiseDiscoutingForRate", action = "Index", id = UrlParameter.Optional }
                );
            routes.MapRoute(
              name: "",
              url: "GenrateAndViewInvoice/{action}/{id}",
              defaults: new { controller = "GenrateAndViewInvoice", action = "Index", id = UrlParameter.Optional }
              );
            routes.MapRoute(
             name: "",
             url: "TACTsearch/{action}/{id}",
             defaults: new { controller = "TACTsearch", action = "Index", id = UrlParameter.Optional }
             );

            routes.MapRoute(
              name: "",
              url: "ViewInvoiceAndReceipt/{action}/{id}",
              defaults: new { controller = "ViewInvoiceAndReceipt", action = "Index", id = UrlParameter.Optional }
              );
            routes.MapRoute(
             name: "",
             url: "CBVSalesReport/{action}/{id}",
             defaults: new { controller = "CBVSalesReport", action = "Index", id = UrlParameter.Optional }
             );
            routes.MapRoute(
             name: "",
             url: "InterlineFlownShipments/{action}/{id}",
             defaults: new { controller = "InterlineFlownShipments", action = "Index", id = UrlParameter.Optional }
             );
            routes.MapRoute(
             name: "",
             url: "ExecutionReport/{action}/{id}",
             defaults: new { controller = "ExecutionReport", id = UrlParameter.Optional }
         );

            routes.MapRoute(
            name: "",
            url: "UnbookedReport/{action}/{id}",
            defaults: new { controller = "UnbookedReport", id = UrlParameter.Optional }
        );
            routes.MapRoute(
                      name: "",
                      url: "OutStationUnbookedReport/{action}/{id}",
                      defaults: new { controller = "OutStationUnbookedReport", id = UrlParameter.Optional }
                  );

            routes.MapRoute(
             name: "",
             url: "InterlineCSR/{action}/{id}",
             defaults: new { controller = "InterlineCSR", action = "Index", id = UrlParameter.Optional }
         );
            routes.MapRoute(
              name: "",
              url: "ValidityOfModules/{action}/{id}",
              defaults: new { controller = "ValidityOfModules", id = UrlParameter.Optional }
          );
            routes.MapRoute(
          name: "",
          url: "Reservation/{action}/{id}",
          defaults: new { controller = "Reservation", id = UrlParameter.Optional }
      );

            routes.MapRoute(
                name: "",
                url: "BudgetReport/{action}/{id}",
                defaults: new { controller = "BudgetReport", action = "TargetBudgetReport", id = UrlParameter.Optional }
                );

            routes.MapRoute(
                name: "",
                url: "AgeingReport/{action}/{id}",
                defaults: new { controller = "AgeingReport", id = UrlParameter.Optional }
                );

            routes.MapRoute(
            name: "",
            url: "BookingListOperations/{action}/{id}",
            defaults: new { controller = "BookingListOperations", id = UrlParameter.Optional }
        );

            routes.MapRoute(
            name: "",
            url: "DeliveryOrderAddShipment/{action}/{id}",
            defaults: new { controller = "DeliveryOrderAddShipment", id = UrlParameter.Optional }
        );
           
        }

    }
}
