using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Collections.ObjectModel;
using System.ServiceModel;
using System.ServiceModel.Channels;
using System.ServiceModel.Description;
using System.ServiceModel.Dispatcher;

namespace CargoFlash.Cargo.DataService
{
    public class GlobalErrorHandlerBehaviourAttribute : Attribute, IServiceBehavior
    {
        private readonly Type _errorHandlerType;

        public GlobalErrorHandlerBehaviourAttribute(Type errorHanlderType)
        {
            _errorHandlerType = errorHanlderType;
        }

        public void AddBindingParameters(ServiceDescription serviceDescription, System.ServiceModel.ServiceHostBase serviceHostBase, System.Collections.ObjectModel.Collection<ServiceEndpoint> endpoints, System.ServiceModel.Channels.BindingParameterCollection bindingParameters)
        {
        }

        public void ApplyDispatchBehavior(ServiceDescription serviceDescription, System.ServiceModel.ServiceHostBase serviceHostBase)
        {
            var handler = (IErrorHandler)Activator.CreateInstance(this._errorHandlerType);
            foreach (var channelDispacherBase in serviceHostBase.ChannelDispatchers)
            {
                var channelDispatcher = channelDispacherBase as ChannelDispatcher;
                if (channelDispatcher != null)
                    channelDispatcher.ErrorHandlers.Add(handler);
            }
        }

        public void Validate(ServiceDescription serviceDescription, System.ServiceModel.ServiceHostBase serviceHostBase)
        {
        }
    }
}
