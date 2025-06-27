
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, BookOpen, Target, Users, MessageSquare, BarChart3 } from "lucide-react";

const AIToolsSection = () => {
  const aiTools = [
    {
      icon: <Brain className="w-8 h-8 text-purple-600" />,
      title: "AI-Powered Learning Assistant",
      description: "Get personalized explanations, doubt clarification, and concept breakdowns using ChatGPT, Claude, or Gemini.",
      howTo: "Use prompts like: 'Explain Product Management frameworks in simple terms' or 'Help me understand user personas'"
    },
    {
      icon: <BookOpen className="w-8 h-8 text-blue-600" />,
      title: "Smart Content Creation",
      description: "Generate case studies, project documentation, and practice scenarios using AI tools.",
      howTo: "Prompt: 'Create a product launch case study for a fintech app' or 'Generate user interview questions'"
    },
    {
      icon: <Target className="w-8 h-8 text-green-600" />,
      title: "Practice & Mock Interviews",
      description: "Use AI to simulate real interview scenarios and get feedback on your responses.",
      howTo: "Ask AI: 'Conduct a mock product manager interview' or 'Give me behavioral interview questions'"
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-orange-600" />,
      title: "Data Analysis & Insights",
      description: "Learn to interpret data and create actionable insights with AI assistance.",
      howTo: "Upload data to ChatGPT/Claude and ask: 'Analyze this user behavior data and suggest improvements'"
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-red-600" />,
      title: "Communication Skills",
      description: "Improve your presentation and stakeholder communication using AI feedback.",
      howTo: "Share your presentation draft and ask: 'How can I make this more compelling for executives?'"
    },
    {
      icon: <Users className="w-8 h-8 text-indigo-600" />,
      title: "Team Collaboration",
      description: "Use AI tools for project planning, team coordination, and agile methodologies.",
      howTo: "Prompt: 'Create a sprint planning template' or 'Help me write user stories for this feature'"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            🤖 Use AI Tools to Master Your Courses
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Learn how to leverage AI tools like ChatGPT, Claude, Gemini, and more to understand, 
            access, learn, and practice these courses conveniently and efficiently.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {aiTools.map((tool, index) => (
            <Card key={index} className="h-full hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3 mb-2">
                  {tool.icon}
                  <CardTitle className="text-lg">{tool.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-600 mb-4">{tool.description}</p>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-1">💡 How to use:</p>
                  <p className="text-sm text-gray-600 italic">"{tool.howTo}"</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-white rounded-xl p-8 shadow-lg max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">
            🚀 Recommended AI Tools for Learning
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-green-100 p-4 rounded-lg mb-3">
                <h4 className="font-semibold text-green-800">ChatGPT</h4>
              </div>
              <p className="text-sm text-gray-600">Best for explanations, code help, and general learning assistance</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-lg mb-3">
                <h4 className="font-semibold text-blue-800">Claude</h4>
              </div>
              <p className="text-sm text-gray-600">Excellent for document analysis and detailed explanations</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 p-4 rounded-lg mb-3">
                <h4 className="font-semibold text-purple-800">Gemini</h4>
              </div>
              <p className="text-sm text-gray-600">Great for research and multi-modal learning</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 p-4 rounded-lg mb-3">
                <h4 className="font-semibold text-orange-800">Perplexity</h4>
              </div>
              <p className="text-sm text-gray-600">Perfect for real-time research and fact-checking</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIToolsSection;
