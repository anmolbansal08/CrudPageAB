using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.ULD
{
  
    [KnownType(typeof(ULDInvoice))]
    public class ULDInvoice
    {

        public int SNo { get; set; }
        public string NPPANo { get; set; }

        public string Name { get; set; }
        public string SalesOrderNo { get; set; }
       public DateTime InvoiceDate { get; set; }
        public string ParticipientSNo { get; set; }
      
        public int ULDRepairSNo { get; set; }
        public string AgreementNumber { get; set; }
        public string UldNo { get; set; }
        public string ULDreturnedStatus { get; set; }
    }

    [KnownType(typeof(ULDInvoiceGridAppendGrid))]
    public class ULDInvoiceGridAppendGrid
    {
        //public int  RowNo { get; set; }
        public Nullable<int> SNo { get; set; }

        public string Equipment { get; set; }
       
        public string Registration { get; set; }
        public string Work_Inspection { get; set; }
        public string Meterial { get; set; }
        public string ManHours { get; set; }
        public string Total { get; set; }


        public string NPPANo { get; set; }
        public string SalesOrderNo { get; set; }
        public Nullable<DateTime> InvoiceDate { get; set; }
        public string ParticipientSNo { get; set; }
        public int ULDRepairSNo { get; set; }
        public string AgreementNumber { get; set; }
        public string RONO { get; set; }
        

    

    }
}
