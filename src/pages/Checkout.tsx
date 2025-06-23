
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Tag, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Checkout = () => {
  const [courseType, setCourseType] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: ""
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const course = urlParams.get("course") || "";
    const price = urlParams.get("price") || "";
    
    setCourseType(course);
    setOriginalPrice(price);
    setCurrentPrice(price);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const applyReferralCode = () => {
    if (referralCode.toLowerCase() === "save20" || referralCode.toLowerCase() === "student20") {
      const priceNumber = parseInt(originalPrice.replace(/[^\d]/g, ""));
      const discount = Math.floor(priceNumber * 0.2);
      const newPrice = priceNumber - discount;
      
      setCurrentPrice(`₹${newPrice.toLocaleString()}`);
      setDiscountAmount(discount);
      setDiscountApplied(true);
    } else if (referralCode.toLowerCase() === "first10") {
      const priceNumber = parseInt(originalPrice.replace(/[^\d]/g, ""));
      const discount = Math.floor(priceNumber * 0.1);
      const newPrice = priceNumber - discount;
      
      setCurrentPrice(`₹${newPrice.toLocaleString()}`);
      setDiscountAmount(discount);
      setDiscountApplied(true);
    } else {
      alert("Invalid referral code. Try SAVE20, STUDENT20, or FIRST10");
    }
  };

  const removeDiscount = () => {
    setCurrentPrice(originalPrice);
    setDiscountApplied(false);
    setDiscountAmount(0);
    setReferralCode("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you for your order! Our team will contact you shortly to complete the enrollment process.");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => window.history.back()}
            className="flex items-center space-x-2"
          >
            <ArrowLeft size={20} />
            <span>Back to Courses</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-b pb-4">
                <h3 className="text-xl font-semibold text-gray-800">{courseType}</h3>
                <p className="text-gray-600 mt-2">
                  {courseType === "Lean Startup" && "8-week duration • 15 hours mentorship"}
                  {courseType === "Project Management" && "8-week duration • 15 hours mentorship"}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Course Price:</span>
                  <span className={discountApplied ? "line-through text-gray-500" : "font-semibold"}>
                    {originalPrice}
                  </span>
                </div>
                
                {discountApplied && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount Applied:</span>
                    <span>-₹{discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="border-t pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total:</span>
                    <span className="text-blue-600">{currentPrice}</span>
                  </div>
                </div>
              </div>

              {/* Referral Code Section */}
              <div className="border-t pt-6">
                <Label htmlFor="referralCode" className="text-base font-semibold">
                  Have a Referral Code?
                </Label>
                <div className="flex space-x-2 mt-2">
                  <Input
                    id="referralCode"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    placeholder="Enter code (e.g., SAVE20)"
                    disabled={discountApplied}
                  />
                  {!discountApplied ? (
                    <Button onClick={applyReferralCode} variant="outline">
                      <Tag size={16} className="mr-1" />
                      Apply
                    </Button>
                  ) : (
                    <Button onClick={removeDiscount} variant="outline">
                      Remove
                    </Button>
                  )}
                </div>
                
                {discountApplied && (
                  <div className="flex items-center space-x-2 mt-2 text-green-600">
                    <CheckCircle size={16} />
                    <span className="text-sm">Referral code applied successfully!</span>
                  </div>
                )}

                <div className="mt-3 text-sm text-gray-600">
                  <p>Available codes:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>SAVE20 - 20% off</li>
                    <li>STUDENT20 - 20% student discount</li>
                    <li>FIRST10 - 10% first-time customer</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Checkout Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg py-3"
                >
                  Complete Enrollment - {currentPrice}
                </Button>

                <p className="text-sm text-gray-600 text-center">
                  By completing this enrollment, you agree to our terms and conditions. 
                  Our team will contact you within 24 hours to confirm your enrollment and schedule your first session.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;
