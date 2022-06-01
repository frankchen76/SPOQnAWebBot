// connection string to your Service Bus namespace
using Azure.Messaging.ServiceBus;
using BotBiz;

string connectionString = "";

// name of your Service Bus queue
string queueName = "tokenrenewrequest";

// number of messages to be sent to the queue
int numOfMessages = 3;

ServiceBusClient client = new ServiceBusClient(connectionString);
ServiceBusSender sender = client.CreateSender(queueName);

try
{
    SBMessage sbMessage = new SBMessage("57650015-0CDF-4311-BBA5-A4EB57732546", "frank@m365x725618.onmicrosoft.com","", "");
    ServiceBusMessage message = new ServiceBusMessage(sbMessage.ToJson());
    await sender.ScheduleMessageAsync(message, DateTimeOffset.Now.AddSeconds(10));
    Console.WriteLine("Service Bus message was sent.");
}
finally
{
    // Calling DisposeAsync on client types is required to ensure that network
    // resources and other unmanaged objects are properly cleaned up.
    await sender.DisposeAsync();
    await client.DisposeAsync();

}


Console.WriteLine("Press any key to end the application");
Console.ReadKey();