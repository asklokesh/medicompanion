
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { File, Plus, Calendar, User, Clock, Search, Filter, MoreVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface Note {
  id: number;
  title: string;
  content: string;
  seniorName: string;
  createdAt: string;
  category: 'medication' | 'observation' | 'appointment' | 'other';
}

const CareNotes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const notes: Note[] = [
    {
      id: 1,
      title: "Medication Side Effects",
      content: "Mary reported feeling dizzy after taking her blood pressure medication. Consider following up with her doctor.",
      seniorName: "Mary Johnson",
      createdAt: "Today, 10:30 AM",
      category: 'medication'
    },
    {
      id: 2,
      title: "Appointment Follow-up",
      content: "Robert's cardiologist recommended increased fluid intake and daily walks. Need to create a reminder for this.",
      seniorName: "Robert Smith",
      createdAt: "Yesterday, 2:15 PM",
      category: 'appointment'
    },
    {
      id: 3,
      title: "Mood Observation",
      content: "Patricia seems more energetic after starting the new vitamin regimen. Continue to monitor for sustained improvement.",
      seniorName: "Patricia Wilson",
      createdAt: "Sep 15, 2023",
      category: 'observation'
    }
  ];

  // Filter notes based on search term
  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.seniorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'medication': return 'bg-blue-100 text-blue-800';
      case 'observation': return 'bg-green-100 text-green-800';
      case 'appointment': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Care Notes</h1>
            <p className="text-gray-500 mt-2">Document observations and care details for your seniors</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" /> New Note
          </Button>
        </div>
        
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search notes..." 
              className="pl-10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" /> Filter
          </Button>
        </div>
        
        <div className="space-y-4">
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note) => (
              <Card key={note.id} className="hover:shadow-md transition-all">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <File className="h-5 w-5 text-primary" />
                          <h3 className="font-medium text-lg">{note.title}</h3>
                        </div>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-gray-600 mt-2">{note.content}</p>
                      <div className="mt-4 flex items-center flex-wrap gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(note.category)}`}>
                          {note.category.charAt(0).toUpperCase() + note.category.slice(1)}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <User className="h-3 w-3" />
                          <span>{note.seniorName}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>{note.createdAt}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <File className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No notes found</h3>
                <p className="text-gray-500 mt-2">Try adjusting your search or create a new note</p>
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" /> Create Note
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Voice Notes</h2>
              <p className="text-gray-600 mt-1">Record spoken notes for faster documentation</p>
            </div>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              Start Voice Recording
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CareNotes;
