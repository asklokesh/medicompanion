
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Camera, Image, Search, AlertTriangle, XCircle, Loader } from "lucide-react";
import { cn } from "@/lib/utils";

const IdentifyPill = () => {
  const [searchText, setSearchText] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [identifyMethod, setIdentifyMethod] = useState<'camera' | 'text'>('camera');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<null | { name: string, description: string, imgSrc: string }[]>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);

  // Mock data for pill identification (in a real app, this would come from an API)
  const mockPillData = [
    {
      name: "Lisinopril 10mg",
      description: "Round, pink tablet with 'L10' imprinted on one side. Used to treat high blood pressure and heart failure.",
      imgSrc: "https://www.drugs.com/images/pills/fio/JJP03630.JPG"
    },
    {
      name: "Metformin 500mg",
      description: "White to off-white, oval tablet with '500' imprinted on one side. Used to manage type 2 diabetes.",
      imgSrc: "https://www.drugs.com/images/pills/nlm/006033910.jpg"
    },
    {
      name: "Aspirin 81mg",
      description: "Round, orange tablet. Used as a pain reliever and to reduce fever or inflammation.",
      imgSrc: "https://www.drugs.com/images/pills/mmx/t110211f/aspirin.jpg"
    }
  ];

  const startCamera = async () => {
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setCameraActive(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("Could not access camera. Please check permissions.");
      setIdentifyMethod('text');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setCameraActive(false);
      
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const imageDataUrl = canvas.toDataURL('image/png');
      setImagePreview(imageDataUrl);
      
      stopCamera();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const performSearch = () => {
    setLoading(true);
    
    // Simulate API call with a delay
    setTimeout(() => {
      // When using camera or image, return all results for demo purposes
      // In a real app, this would use image recognition to find matching pills
      if (imagePreview) {
        setResults(mockPillData);
      } 
      // When using text search, filter the results
      else if (searchText) {
        const filtered = mockPillData.filter(pill => 
          pill.name.toLowerCase().includes(searchText.toLowerCase()) ||
          pill.description.toLowerCase().includes(searchText.toLowerCase())
        );
        setResults(filtered.length > 0 ? filtered : []);
      } else {
        toast.error("Please enter search text or upload an image");
        setResults([]);
      }
      
      setLoading(false);
    }, 1500);
  };

  useEffect(() => {
    // Clean up camera resources when component unmounts
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Identify Pill</h1>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">How would you like to identify?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex justify-center space-x-4">
                <Button
                  variant={identifyMethod === 'camera' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => setIdentifyMethod('camera')}
                >
                  <Camera className="h-5 w-5 mr-2" />
                  Camera/Upload
                </Button>
                <Button
                  variant={identifyMethod === 'text' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => {
                    setIdentifyMethod('text');
                    stopCamera();
                  }}
                >
                  <Search className="h-5 w-5 mr-2" />
                  Text Search
                </Button>
              </div>
              
              {identifyMethod === 'camera' && (
                <div className="space-y-4">
                  {!imagePreview && !cameraActive && (
                    <div className="space-y-4">
                      <Button 
                        onClick={startCamera} 
                        className="w-full"
                      >
                        <Camera className="h-5 w-5 mr-2" />
                        Open Camera
                      </Button>
                      
                      <div className="text-center">
                        <span className="text-gray-500">or</span>
                      </div>
                      
                      <div className="flex items-center justify-center">
                        <Label 
                          htmlFor="picture" 
                          className="cursor-pointer flex flex-col items-center justify-center w-full h-40 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Image className="h-10 w-10 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500">
                              <span className="font-medium">Click to upload</span> or drag and drop
                            </p>
                          </div>
                          <Input
                            id="picture"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                          />
                        </Label>
                      </div>
                    </div>
                  )}
                  
                  {cameraActive && (
                    <div className="relative">
                      <video 
                        ref={videoRef} 
                        autoPlay 
                        playsInline 
                        className="w-full h-64 bg-black rounded-lg object-cover"
                      />
                      
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                        <Button 
                          onClick={captureImage} 
                          variant="default" 
                          size="icon" 
                          className="h-12 w-12 rounded-full"
                        >
                          <Camera className="h-6 w-6" />
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  <canvas ref={canvasRef} className="hidden" />
                  
                  {imagePreview && (
                    <div className="relative">
                      <div className="relative border rounded-lg overflow-hidden">
                        <img 
                          src={imagePreview} 
                          alt="Pill Preview" 
                          className="w-full h-64 object-contain bg-black/5"
                        />
                        <Button 
                          onClick={clearImage} 
                          variant="destructive" 
                          size="icon" 
                          className="absolute top-2 right-2 h-8 w-8 rounded-full"
                        >
                          <XCircle className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {identifyMethod === 'text' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="search">Describe the pill (color, shape, markings, etc.)</Label>
                    <Textarea
                      id="search"
                      placeholder="e.g., round white pill with 'L10' imprint"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={performSearch} 
              className="w-full" 
              disabled={loading || (identifyMethod === 'text' && !searchText) || (identifyMethod === 'camera' && !imagePreview)}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader className="h-4 w-4 animate-spin" />
                  <span>Searching...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  <span>Identify Pill</span>
                </div>
              )}
            </Button>
          </CardFooter>
        </Card>
        
        {results !== null && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              {results.length > 0 ? 'Results' : 'No Results Found'}
            </h2>
            
            {results.length > 0 ? (
              <div className="space-y-4">
                {results.map((pill, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="bg-gray-100 rounded-lg overflow-hidden w-full md:w-1/4 h-40 flex items-center justify-center">
                          <img 
                            src={pill.imgSrc} 
                            alt={pill.name} 
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <div className="md:w-3/4">
                          <h3 className="text-lg font-medium">{pill.name}</h3>
                          <p className="text-gray-600 mt-2">{pill.description}</p>
                          <div className="mt-4">
                            <p className="text-sm text-gray-500">
                              <span className="font-medium">Note:</span> Always confirm with a healthcare professional before taking any medication.
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertTriangle className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        <span className="font-medium">Important:</span> This tool provides a best guess and is not a substitute for professional medical advice. Always consult with your healthcare provider or pharmacist.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No matching pills found</h3>
                  <p className="text-gray-500 mt-2">
                    Try a different search term or upload a clearer image
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default IdentifyPill;
