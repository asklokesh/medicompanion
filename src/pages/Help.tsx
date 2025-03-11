
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Help = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-green-50">
      <Card className="w-full max-w-3xl glass rounded-3xl p-8 shadow-lg space-y-6">
        <Link 
          to="/" 
          className="inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Home
        </Link>

        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">Need Help?</h1>
          
          <div className="space-y-4">
            <section className="space-y-2">
              <h2 className="text-2xl font-semibold text-gray-800">For Seniors</h2>
              <p className="text-lg text-gray-600">
                MediCompanion helps you manage your medications with ease. Track your medications, 
                set reminders, and stay connected with your caregivers.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-2xl font-semibold text-gray-800">For Caregivers</h2>
              <p className="text-lg text-gray-600">
                Monitor medication schedules, receive alerts, and stay updated on your loved one's 
                medication adherence.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">Quick Links</h2>
              <div className="grid gap-3">
                <Button asChild variant="outline" className="justify-start text-lg">
                  <Link to="/login/senior">Senior Login</Link>
                </Button>
                <Button asChild variant="outline" className="justify-start text-lg">
                  <Link to="/login/caregiver">Caregiver Login</Link>
                </Button>
              </div>
            </section>

            <section className="space-y-2">
              <h2 className="text-2xl font-semibold text-gray-800">Contact Support</h2>
              <p className="text-lg text-gray-600">
                Need additional help? Our support team is available 24/7.
                Email us at support@medicompanion.com
              </p>
            </section>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Help;
