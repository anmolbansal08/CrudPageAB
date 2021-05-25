using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.CRA
{
     [KnownType(typeof(CRAInvoiceList))]
    public class CRAInvoiceList
    {
         public int Invoice_Summary_ID { get; set; }
         public string Invc_No { get; set; }
         public string Invc_Curr { get; set; }
         public string Party_Name { get; set; }
         public string Party_type { get; set; }
         public string Invoice_Type { get; set; }
         public string Total_Amount { get; set; }
         public string Generated_By { get; set; }
         public string Verified_by { get; set; }
         public string Printed_by { get; set; }
         public string Status { get; set; }

         public string Draft_Informed { get; set; }
         public string Final_Informed { get; set; }

        

    }
    [KnownType(typeof(InvoiceAWBDetailsGrid))]
    public class InvoiceAWBDetailsGrid
    {
        public string AWB_Serial_Number { get; set; }
        public string Weight_Charges_PP { get; set; }
        public string Weight_Charges_CC { get; set; }
        public string Other_Charges_Due_Agent_PP { get; set; }
        public string Other_Charges_Due_Carrier_PP { get; set; }
        public string Commission { get; set; }
        public string Incentive { get; set; }
        public string Payable { get; set; }
        public string Other_Charges_Due_Agent_CC { get; set; }
        public string Other_Charges_Due_Carrier_CC { get; set; }

        public string AWB_Currency { get; set; }
        public string AWB_Gross_Weight { get; set; }

        public string AWB_Total_PP { get; set; }
        public string AWB_Total_CC { get; set; }
        public string AWB_Valuation_Charge_PP { get; set; }
        public string AWB_Valuation_Charge_CC { get; set; }
        public string AWB_WT_VAL_Charge_PP { get; set; }
        public string AWB_WT_VAL_Charge_CC { get; set; }
        public string Net_Total { get; set; }

       
    }
}
