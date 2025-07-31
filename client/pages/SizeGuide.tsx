import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { Ruler, Info, Phone, AlertCircle } from "lucide-react";

const sizeCharts = {
  sherwanis: {
    title: "Sherwanis & Suits",
    headers: ["Size", "Chest", "Waist", "Hip", "Shoulder", "Length"],
    rows: [
      ["S", "36-38\"", "30-32\"", "38-40\"", "17\"", "42\""],
      ["M", "38-40\"", "32-34\"", "40-42\"", "17.5\"", "43\""],
      ["L", "40-42\"", "34-36\"", "42-44\"", "18\"", "44\""],
      ["XL", "42-44\"", "36-38\"", "44-46\"", "18.5\"", "45\""],
      ["XXL", "44-46\"", "38-40\"", "46-48\"", "19\"", "46\""],
    ]
  },
  kurtas: {
    title: "Kurtas",
    headers: ["Size", "Chest", "Waist", "Length", "Shoulder"],
    rows: [
      ["S", "36-38\"", "30-32\"", "40\"", "16.5\""],
      ["M", "38-40\"", "32-34\"", "41\"", "17\""],
      ["L", "40-42\"", "34-36\"", "42\"", "17.5\""],
      ["XL", "42-44\"", "36-38\"", "43\"", "18\""],
      ["XXL", "44-46\"", "38-40\"", "44\"", "18.5\""],
    ]
  },
  lehengas: {
    title: "Lehengas",
    headers: ["Size", "Bust", "Waist", "Hip", "Blouse Length"],
    rows: [
      ["XS", "32-34\"", "26-28\"", "36-38\"", "14\""],
      ["S", "34-36\"", "28-30\"", "38-40\"", "14.5\""],
      ["M", "36-38\"", "30-32\"", "40-42\"", "15\""],
      ["L", "38-40\"", "32-34\"", "42-44\"", "15.5\""],
      ["XL", "40-42\"", "34-36\"", "44-46\"", "16\""],
    ]
  }
};

const measurementTips = [
  {
    title: "Chest/Bust",
    description: "Measure around the fullest part of your chest/bust, keeping the measuring tape parallel to the floor."
  },
  {
    title: "Waist",
    description: "Measure around your natural waistline, which is typically the narrowest part of your torso."
  },
  {
    title: "Hip",
    description: "Measure around the fullest part of your hips, approximately 7-9 inches below your waistline."
  },
  {
    title: "Shoulder",
    description: "Measure from one shoulder point to the other across your back."
  },
  {
    title: "Length",
    description: "For kurtas and sherwanis, measure from the shoulder point down to your desired length."
  }
];

export default function SizeGuide() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <SectionWrapper variant="hero" padding="lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 bg-gold/10 border-gold/30 text-gold">
              <Ruler className="w-3 h-3 mr-1" />
              Perfect Fit Guide
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-serif font-bold mb-6 bg-gradient-to-r from-foreground via-gold to-foreground bg-clip-text text-transparent">
              Size Guide
            </h1>
            <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
              Find your perfect fit with our comprehensive size charts and measurement guide
            </p>
          </div>
        </div>
      </SectionWrapper>

      {/* How to Measure */}
      <SectionWrapper variant="featured" padding="lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-serif font-bold text-center mb-12">How to Measure</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {measurementTips.map((tip, index) => (
                <Card key={index} className="border-gold/20 hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center mr-3">
                        <span className="text-gold font-bold text-sm">{index + 1}</span>
                      </div>
                      {tip.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{tip.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-12">
              <div className="flex items-start space-x-3">
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Measurement Tips
                  </h3>
                  <ul className="text-blue-800 dark:text-blue-200 space-y-1 text-sm">
                    <li>• Always measure over undergarments or form-fitting clothes</li>
                    <li>• Keep the measuring tape snug but not tight</li>
                    <li>• Stand straight and breathe normally while measuring</li>
                    <li>• Have someone help you for more accurate measurements</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* Size Charts */}
      <SectionWrapper variant="default" padding="lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {Object.entries(sizeCharts).map(([key, chart]) => (
              <Card key={key} className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-2xl font-serif text-center">
                    {chart.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gold/10">
                        <tr>
                          {chart.headers.map((header, index) => (
                            <th key={index} className="px-6 py-4 text-left font-semibold">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {chart.rows.map((row, rowIndex) => (
                          <tr key={rowIndex} className="border-t hover:bg-muted/50 transition-colors">
                            {row.map((cell, cellIndex) => (
                              <td key={cellIndex} className="px-6 py-4">
                                {cellIndex === 0 ? (
                                  <Badge variant="outline" className="font-semibold">
                                    {cell}
                                  </Badge>
                                ) : (
                                  cell
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Custom Tailoring */}
      <SectionWrapper variant="newsletter" padding="lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-yellow-50 dark:bg-yellow-950/50 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mb-8">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                    Need a Custom Fit?
                  </h3>
                  <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                    If you're between sizes or need specific alterations, we offer custom tailoring services. 
                    Contact our team for personalized assistance.
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-serif font-bold mb-6 text-foreground">
              Still Need Help?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Our sizing experts are here to help you find the perfect fit
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:+919876543210" className="inline-flex">
                <div className="bg-gold/10 border border-gold/20 rounded-lg px-6 py-4 flex items-center space-x-3 hover:bg-gold/20 transition-all duration-300">
                  <Phone className="h-5 w-5 text-gold" />
                  <span className="text-foreground font-medium">Call: +91 98765 43210</span>
                </div>
              </a>
              <a href="mailto:hello@monadesigners.com" className="inline-flex">
                <div className="bg-gold/10 border border-gold/20 rounded-lg px-6 py-4 flex items-center space-x-3 hover:bg-gold/20 transition-all duration-300">
                  <Info className="h-5 w-5 text-gold" />
                  <span className="text-foreground font-medium">Email Support</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}
