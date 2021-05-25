using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CargoFlash.Cargo.Model.Report
{
   public class MarineInsuranceReport
    {
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public string Airline { get; set; }
        public string City { get; set; }
        public string Agent { get; set; }
        public string UserSNo { get; set; }
        public string No { get; set; }
        public string BOREPORT { get; set; }
        public string GASALESatauCARGOASSISTANCE { get; set; }
        public string customername { get; set; }
        public string AWB { get; set; }
        public string ROUTE { get; set; }
        public string FLIGHT { get; set; }
        public string DATE { get; set; }
        public string PCS { get; set; }
        public string Weight { get; set; }
        public string Commodity { get; set; }
        public string DecleredvalueIDR { get; set; }
        public string CommodityClassification { get; set; }
        public string CertificateNumber { get; set; }
        public string PremiumRate { get; set; }
        public string PublishPremiumRate { get; set; }
        public string ChargeableInsuranceRate { get; set; }
        public string NETRATE { get; set; }
        public string PremiumRates { get; set; }
        public string ChargeableInsuranceRateForGA { get; set; }
        public string Formula { get; set; }
        public string Nominal { get; set; }
        public string FormulaForGA { get; set; }
        public string NominalIDR { get; set; }
        public string ChargeablePremi { get; set; }
        public string MinimumPremiApplied { get; set; }
        public string GAFeeGeneral { get; set; }
        public string GAFeePremium { get; set; }
        public string ChargeablePremiGAToInsurence { get; set; }
        public string PremiumGAFee { get; set; }
    }
}
