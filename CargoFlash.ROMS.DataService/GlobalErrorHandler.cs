using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ServiceModel;
using System.ServiceModel.Channels;
using System.ServiceModel.Dispatcher;

namespace CargoFlash.Cargo.DataService
{
    public class GlobalErrorHandler : IErrorHandler
    {
        public bool HandleError(Exception error) //this runs async
        {
            Cargo.Business.Common.insertAppException(error);
            return true;
        }

        public void ProvideFault(Exception error, System.ServiceModel.Channels.MessageVersion version, ref System.ServiceModel.Channels.Message fault)
        {
            if (!(error is FaultException))
            {
                FaultException FE = new FaultException("We apologize for the inconvenience, an error occurred while processing your request.");
                MessageFault MF = FE.CreateMessageFault();
                fault = Message.CreateMessage(version, MF, null);
            }
        }
    }


    public class MyCustomFault : FaultException
    {
        public string FaultDetails { get; set; }
    }
}
