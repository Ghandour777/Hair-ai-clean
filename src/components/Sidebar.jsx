function Sidebar({ tool, setTool }) {
  const sidebarItem = (active) => ({
    padding: "14px",
    borderRadius: "12px",
    marginBottom: "10px",
    cursor: "pointer",
    background: active ? "#7c3aed" : "transparent",
    transition: "0.2s",
    color: "white",
  });

  return (
    <div
      style={{
        width: "260px",
        background: "#111827",
        padding: "30px 20px",
        borderRight: "1px solid #1e293b",
        color: "white",
      }}
    >
      <h1
        style={{
          fontSize: "28px",
          marginBottom: "40px",
        }}
      >
        ✨ Hair AI
      </h1>

      <div
        onClick={() => setTool("caption")}
        style={sidebarItem(tool === "caption")}
      >
        Instagram Caption
      </div>

      <div
        onClick={() => setTool("hook")}
        style={sidebarItem(tool === "hook")}
      >
        TikTok Hook
      </div>

      <div
        onClick={() => setTool("hashtags")}
        style={sidebarItem(tool === "hashtags")}
      >
        Viral Hashtags
      </div>

      <div
        onClick={() => setTool("ad")}
        style={sidebarItem(tool === "ad")}
      >
        Marketing Ad
      </div>
    </div>
  );
}

export default Sidebar;