using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CargoFlash.Cargo.Model.Report
{

    [System.Runtime.Serialization.KnownType(typeof(FPRLionReportRequestModel))]
    public class FPRLionReportRequestModel
    {
        public string AirlineCode { get; set; }
        //public string FlightNo { get; set; }
        public string OriginSNo { get; set; }
        public string DestinationSNo { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public string AWBNo { get; set; }
        public string CurrencySNo { get; set; }
        public string AccountSNo { get; set; }
        public int IsAutoProcess { get; set; }
    }


    [System.Runtime.Serialization.KnownType(typeof(FPRLionReport))]
    public class FPRLionReport
    {
        //TransactionDate,AgentCode,AgentName,TransactionType,Commodity,Product,SPCharges,NetPyable,AWBNo,User,Remark,TariffRate,ChargeableWeight,AWBCurrency,Sector
        public int SNo { get; set; }

        public string TransactionDate { get; set; }
        public string AgentCode { get; set; }
        public string AgentName { get; set; }

        public string DebitCredit { get; set; }
        public string TransactionType { get; set; }

        public string PenaltySubType { get; set; }
        public string ServiceCargo { get; set; }
        public string RateClass { get; set; }
        public string Commodity { get; set; }
        public string NOG {get; set;}
        public string Product { get; set; }
        public string SPCharges { get; set; }
        public string ReplanCharges { get; set; }
        
        public string NetPayable { get; set; }
        public string AWBNo { get; set; }
        public string AWBOrigin { get; set; }
        public string AWBDestination { get; set; }
        public string User { get; set; }
        public string Remark { get; set; }
        public string TariffRate { get; set; }
        public string ChargeableWeight { get; set; }

        public string AWBCurrency { get; set; }
        public string Sector { get; set; }
        public string ExchangeRate { get; set; }
        public string ExchangeCurrency { get; set; }
        public string LACharges { get; set; }

    }
}
