
import { MessageCircle, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const WhatsAppButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const { toast } = useToast();
  const whatsappNumber = "+918275513895";

  const toggleChat = () => setIsOpen(!isOpen);

  const sendWhatsAppMessage = (customMessage?: string) => {
    const messageToSend = customMessage || message || "Hi, I have a query regarding your mentorship programs.";
    const encodedMessage = encodeURIComponent(messageToSend);
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace('+', '')}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    
    if (!customMessage) {
      setMessage("");
      setIsOpen(false);
      toast({
        title: "Redirecting to WhatsApp",
        description: "You'll be connected with our customer executive shortly.",
      });
    }
  };

  const quickMessages = [
    "I want to know about your courses",
    "I need help with course selection",
    "I want to speak to a mentor",
    "I have questions about pricing",
    "I need technical support"
  ];

  // Function to send order notification (will be called from checkout)
  const sendOrderNotification = (orderDetails: any) => {
    const orderMessage = `🔔 NEW ORDER ALERT 🔔
    
Customer: ${orderDetails.name}
Email: ${orderDetails.email}
Phone: ${orderDetails.phone}
Course: ${orderDetails.course}
Amount: ${orderDetails.price}
Payment Status: ${orderDetails.paymentStatus || 'Pending'}

Please follow up with the customer immediately.`;
    
    sendWhatsAppMessage(orderMessage);
  };

  // Expose the function globally for use in checkout
  (window as any).sendOrderNotification = sendOrderNotification;

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={toggleChat}
          className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
        >
          {isOpen ? (
            <X size={24} className="text-white" />
          ) : (
            <MessageCircle size={24} className="text-white group-hover:scale-110 transition-transform" />
          )}
        </Button>
      </div>

      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 max-w-[calc(100vw-3rem)]">
          <Card className="shadow-xl border-0 animate-scale-in">
            <CardHeader className="bg-green-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle size={20} />
                <span>WhatsApp Support</span>
              </CardTitle>
              <p className="text-green-100 text-sm">
                Chat with our customer executive
              </p>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Quick Messages:</p>
                {quickMessages.map((quickMsg, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="w-full text-left justify-start text-xs h-auto py-2 px-3"
                    onClick={() => sendWhatsAppMessage(quickMsg)}
                  >
                    {quickMsg}
                  </Button>
                ))}
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Or type your message:</p>
                <Textarea
                  placeholder="Type your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[80px] resize-none"
                />
              </div>
              
              <div className="flex space-x-2">
                <Button
                  onClick={() => sendWhatsAppMessage()}
                  className="flex-1 bg-green-500 hover:bg-green-600"
                  disabled={!message.trim()}
                >
                  Send Message
                </Button>
                <Button
                  onClick={toggleChat}
                  variant="outline"
                  className="px-4"
                >
                  Close
                </Button>
              </div>
              
              <div className="text-xs text-gray-500 text-center">
                Response time: Usually within 5 minutes
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default WhatsAppButton;
