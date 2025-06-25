
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CreditCard } from "lucide-react";

interface OrderSummaryProps {
  course: string;
  price: string;
}

const OrderSummary = ({ course, price }: OrderSummaryProps) => {
  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard size={20} />
          <span>Order Summary</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span className="font-medium">Course:</span>
          <span>{course}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Duration:</span>
          <span>8-12 weeks</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Mentorship:</span>
          <span>1:1 Sessions</span>
        </div>
        <Separator />
        <div className="flex justify-between text-lg font-bold">
          <span>Total Amount:</span>
          <span className="text-purple-600">{price}</span>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-purple-700">
            ✅ Certificate of Achievement<br />
            ✅ Live Project Experience<br />
            ✅ Mock Interview Session<br />
            ✅ CV Review & Approval
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
