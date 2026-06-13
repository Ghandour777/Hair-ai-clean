import { useState } from "react";
import Sidebar from "./components/Sidebar";
import { supabase } from "./lib/supabase";
function App() {
  const savedHistory =
    JSON.parse(localStorage.getItem("ai-history")) || [];

  const [business, setBusiness] = useState("");
  const [tool, setTool] = useState("caption");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState(savedHistory);

  const signUp = async () => {
  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    alert(error.message);
  } else {
    alert("Check your email");
  }
};

const signIn = async () => {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    alert(error.message);
  } else {
    alert("Logged in!");
  }
};

  const generateAI = async () => {
    if (!business) return;
    
    setLoading(true);
    setResult("");

    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          },

          body: JSON.stringify({
            model: "openai/gpt-3.5-turbo",

            messages: [
              {
                role: "system",
                content:
                  "You are a world-class AI marketing assistant.",
              },

              {
                role: "user",
                content: `

Business: ${business}

Tool Type: ${tool}

If tool type is:
- caption → create Instagram caption
- hook → create viral TikTok hook
- hashtags → generate viral hashtags
- ad → create Facebook advertisement

Make the output modern and engaging.

`,
              },
            ],
          }),
        }
      );

      const data = await response.json();

      if (data.choices) {
        const aiResult = data.choices[0].message.content;

        setResult(aiResult);

        const updatedHistory = [aiResult, ...history];

        setHistory(updatedHistory);

        localStorage.setItem(
          "ai-history",
          JSON.stringify(updatedHistory)
        );

        console.log("Saving to Supabase...");

        const { data: supabaseData, error: supabaseError } = await supabase
          .from("captions")
          .insert([
            {
              business: business,
              caption: aiResult,
            },
          ]);

        console.log("SUPABASE RESULT:", supabaseData);
        console.log("SUPABASE ERROR:", supabaseError);

        console.log("Saved!");
      } else {  

        setResult("AI Error");
      }
    } catch (error) {
      console.log(error);
      setResult("Something went wrong");
    }

    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#0f172a",
        fontFamily: "Arial",
      }}
    >
      <Sidebar tool={tool} setTool={setTool} />

      <div
        style={{
          flex: 1,
          padding: "50px",
          color: "white",
        }}
      >
        <h1
          style={{
            fontSize: "42px",
            marginBottom: "10px",
          }}
        >
          AI Content Workspace 🚀
        </h1>

        <div
          style={{
            color: "#94a3b8",
            marginBottom: "30px",
          }}
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              display: "block",
              marginBottom: "8px",
              padding: "8px",
              borderRadius: "6px",
              border: "none",
              background: "#0f172a",
              color: "white",
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              display: "block",
              marginBottom: "8px",
              padding: "8px",
              borderRadius: "6px",
              border: "none",
              background: "#0f172a",
              color: "white",
            }}
          />

          <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
            <button
              onClick={signUp}
              style={{
                padding: "10px 16px",
                borderRadius: "10px",
                border: "none",
                background: "#7c3aed",
                color: "white",
                cursor: "pointer",
              }}
            >
              Sign Up
            </button>
            <button
              onClick={signIn}
              style={{
                padding: "10px 16px",
                borderRadius: "10px",
                border: "none",
                background: "#7c3aed",
                color: "white",
                cursor: "pointer",
              }}
            >
              Sign In
            </button>
          </div>

          <p style={{ margin: 0 }}>Logged in user: Guest</p>
        </div>
        <input
          type="text"
          placeholder="Enter your business..."
          value={business}
          onChange={(e) => setBusiness(e.target.value)}
          style={{
            width: "100%",
            maxWidth: "700px",
            padding: "16px",
            borderRadius: "14px",
            border: "none",
            outline: "none",
            background: "#1e293b",
            color: "white",
            marginBottom: "20px",
            fontSize: "16px",
          }}
        />

        <button
          onClick={generateAI}
          style={{
            padding: "16px 24px",
            borderRadius: "14px",
            border: "none",
            background: "#7c3aed",
            color: "white",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          {loading ? "Generating..." : "Generate AI 🚀"}
        </button>

        {result && (
          <div
            style={{
              marginTop: "30px",
              background: "#111827",
              padding: "25px",
              borderRadius: "16px",
              maxWidth: "700px",
              lineHeight: "1.8",
              whiteSpace: "pre-wrap",
            }}
          >
            {result}

            <button
              onClick={copyToClipboard}
              style={{
                marginTop: "20px",
                padding: "10px 16px",
                borderRadius: "10px",
                border: "none",
                background: "#7c3aed",
                color: "white",
                cursor: "pointer",
              }}
            >
              Copy 📋
            </button>
          </div>
        )}

        {history.length > 0 && (
          <div
            style={{
              marginTop: "40px",
              maxWidth: "700px",
            }}
          >
            <h2>History 📜</h2>

            {history.map((item, index) => (
              <div
                key={index}
                style={{
                  background: "#1e293b",
                  padding: "16px",
                  borderRadius: "12px",
                  marginTop: "10px",
                }}
              >
                {item}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;