import React, { useState, useEffect, useRef } from "react";
import { Send, X } from "lucide-react";

// ------------------ Sports Data ------------------
const sportsData = {
  badminton: {
    startingAge: "7-9 years",
    notes: "Enhances concentration and agility.",
  },
  football: {
    startingAge: "4-6 years",
    notes: "Small-sided games aid movement and coordination. Instills sharing and camaraderie.",
  },
  cricket: {
    startingAge: "4-6 years",
    notes: "Light games enhance hand-eye coordination. Good training can lead to matches and career opportunities.",
  },
  swimming: {
    startingAge: "4-6 years",
    notes: "Develops stamina and confidence.",
  },
  tennis: {
    startingAge: "7-9 years",
    notes: "Enhances concentration and agility. Develops high-level skills later.",
  },
  "table tennis": {
    startingAge: "7-9 years",
    notes: "Similar to tennis, improves reflexes and hand-eye coordination.",
  },
};

// ------------------ Local Response Patterns ------------------
const responses = [
  {
    question: /i'?m\s*(\d+)\s*(years\s*old)?\s*enroll.*(badminton|football|cricket|swimming|tennis|table tennis)/i,
    answer: (match: RegExpMatchArray) => {
      const age = parseInt(match[1], 10);
      const sport = match[3].toLowerCase();
      if (!(sport in sportsData)) return "Sorry, I don't have information on that sport yet.";
      const data = sportsData[sport as keyof typeof sportsData];

      const [minAge] = data.startingAge.split("-").map(Number);
      return age >= minAge
        ? `At ${age}, you can enroll in ${sport}! Recommended starting age is ${data.startingAge}. ${data.notes}`
        : `At ${age}, you might be a bit young for ${sport}. Recommended starting age is ${data.startingAge}. ${data.notes}`;
    },
  },
  {
    question: /scope.*(badminton|football|cricket|swimming|tennis|table tennis)/i,
    answer: (match: RegExpMatchArray) => {
      const sport = match[1].toLowerCase();
      return `${sport.charAt(0).toUpperCase() + sport.slice(1)} offers great opportunities if you train hard and stay dedicated. You can aim for local clubs, school teams, or even professional levels!`;
    },
  },
  {
    question: /how.*start.*(badminton|football|cricket|swimming|tennis|table tennis)/i,
    answer: (match: RegExpMatchArray) => {
      const sport = match[1].toLowerCase();
      const data = sportsData[sport as keyof typeof sportsData];
      if (!data) return "Sorry, I don't have information on that sport yet.";
      return `To start ${sport}, join a local club or academy. Recommended age: ${data.startingAge}. Practice basic skills and stay consistent. ${data.notes}`;
    },
  },
  {
    question: /what sports.*available/i,
    answer: "We support inquiries for: Badminton, Football, Cricket, Swimming, Tennis, Table Tennis, and more! Ask about any sport!",
  },
  {
    question: /^(hi|hii|hello|hey)$/i,
    answer: "Hey there! I'm ready to answer any sports-related question. Ask about enrollment, training, rules, or anything else!",
  },
  {
    question: /train(ing)?\b.*(sport|sports)?/i,
    answer: "Sports training involves regular practice, strength conditioning, and skill development. Could you specify a sport for tailored training tips?",
  },
];

// ------------------ Mock API Simulation ------------------
const fetchSportsAnswer = async (question: string) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const mockApiResponses = {
    "best sports for kids": "Sports like swimming, football, and gymnastics are great for kids as they build coordination, teamwork, and fitness.",
    "how to improve basketball skills": "Practice dribbling, shooting, and passing daily. Join a local team and watch professional games for techniques.",
    "is volleyball good for fitness": "Yes! Volleyball improves agility, strength, and cardiovascular health.",
    "equipment needed for hockey": "Hockey requires a stick, puck, helmet, gloves, shin guards, and skates for ice hockey—or a ball and shin pads for field hockey.",
    "sports": "Popular sports include football, basketball, cricket, swimming, tennis, and more.",
    "training tips": "Practice regularly, focus on strength and cardio, eat well, and work with a coach.",
    "how to train for sports": "Build endurance with cardio, improve strength, and practice sport-specific skills daily.",
  };

  const lowerQ = question.toLowerCase();
  for (const [key, value] of Object.entries(mockApiResponses)) {
    if (lowerQ.includes(key)) return value;
  }

  if (lowerQ.includes("sport") || lowerQ.includes("training")) {
    return "I can provide training tips or info on any sport! Please specify a sport or ask for general advice.";
  }

  return "I can help with any sports question! Try asking about a specific sport, rules, or training tips.";
};

// ------------------ Bot Response Logic ------------------
async function getBotResponse(userInput: string) {
  for (let resp of responses) {
    const match = userInput.match(resp.question);
    if (match) {
      return typeof resp.answer === "function" ? resp.answer(match) : resp.answer;
    }
  }
  return fetchSportsAnswer(userInput);
}

// ------------------ Main Component ------------------
const Chatbot = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! Ask me anything about sports—enrollment, rules, training, or more!", timestamp: new Date() },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await getBotResponse(input);
      setMessages((prev) => [...prev, { sender: "bot", text: response, timestamp: new Date() }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { sender: "bot", text: "Oops, something went wrong. Please try again!", timestamp: new Date() }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{ sender: "bot", text: "Hello! Ask me anything about sports—enrollment, rules, training, or more!", timestamp: new Date() }]);
  };

  const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg shadow-sm p-4 sm:p-6 w-full max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Sports Chatbot</h3>
        <button onClick={clearChat} className="text-gray-500 hover:text-gray-700" aria-label="Clear chat">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Chat Body */}
      <div
        ref={chatRef}
        className="h-64 sm:h-80 overflow-y-auto mb-4 p-4 bg-white rounded-lg border border-gray-100"
      >
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === "bot" ? "justify-start" : "justify-end"} mb-3`}>
            <div className={`max-w-[75%] p-3 rounded-lg ${msg.sender === "bot" ? "bg-gray-100 text-gray-900" : "bg-emerald-100 text-emerald-900"}`}>
              <p className="text-sm">{msg.text}</p>
              <p className="text-xs text-gray-500 mt-1">{formatTime(msg.timestamp)}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start mb-3">
            <div className="bg-gray-100 p-3 rounded-lg">
              <p className="text-sm text-gray-500">Typing...</p>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
          placeholder="Ask about any sport..."
        />
        <button
          onClick={sendMessage}
          className="bg-emerald-600 text-white p-2 rounded-lg hover:bg-emerald-700"
          aria-label="Send message"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
