import { useState } from "react";
import { useNavigate } from "react-router";
import { Search, ChevronRight, Filter, Trash2, MessageCircle, Camera } from "lucide-react";
import { motion } from "motion/react";

const queryHistory = [
  {
    date: "Today",
    queries: [
      { id: 1, question: "What pesticide should I use for tomato leaf curl?", time: "2 hours ago", category: "Crop", categoryColor: "bg-green-100 text-green-700", type: "text" },
      { id: 2, question: "Best fertilizer for rice vegetative stage?", time: "5 hours ago", category: "Crop", categoryColor: "bg-green-100 text-green-700", type: "text" },
    ],
  },
  {
    date: "Yesterday",
    queries: [
      { id: 3, question: "When is the best time to harvest rice?", time: "Yesterday, 3:45 PM", category: "Harvest", categoryColor: "bg-amber-100 text-amber-700", type: "text" },
      { id: 4, question: "Current price of coconut in Thrissur market", time: "Yesterday, 11:20 AM", category: "Market", categoryColor: "bg-blue-100 text-blue-700", type: "text" },
      { id: 5, question: "Image diagnosis: Tomato leaf curl", time: "Yesterday, 9:15 AM", category: "Diagnosis", categoryColor: "bg-rose-100 text-rose-700", type: "image" },
    ],
  },
  {
    date: "Last Week",
    queries: [
      { id: 6, question: "How to control whitefly in tomato plants?", time: "March 28", category: "Pest Control", categoryColor: "bg-red-100 text-red-700", type: "text" },
      { id: 7, question: "Subsidy schemes for drip irrigation in Kerala", time: "March 27", category: "Schemes", categoryColor: "bg-purple-100 text-purple-700", type: "text" },
      { id: 8, question: "Weather forecast for next week", time: "March 26", category: "Weather", categoryColor: "bg-blue-100 text-blue-700", type: "text" },
      { id: 9, question: "Organic fertilizers for banana cultivation", time: "March 25", category: "Crop", categoryColor: "bg-green-100 text-green-700", type: "text" },
      { id: 10, question: "Image diagnosis: Coconut yellowing", time: "March 24", category: "Diagnosis", categoryColor: "bg-rose-100 text-rose-700", type: "image" },
    ],
  },
];

const allCategories = ["All", "Crop", "Harvest", "Market", "Diagnosis", "Pest Control", "Schemes", "Weather"];

export function History() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredHistory = queryHistory.map((section) => ({
    ...section,
    queries: section.queries.filter((q) => {
      const matchSearch = q.question.toLowerCase().includes(search.toLowerCase());
      const matchCategory = selectedCategory === "All" || q.category === selectedCategory;
      return matchSearch && matchCategory;
    }),
  })).filter((section) => section.queries.length > 0);

  const totalCount = queryHistory.reduce((acc, s) => acc + s.queries.length, 0);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar: Filters */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-5 shadow-sm sticky top-6">
            <h3 className="text-[var(--farmgpt-text-primary)] mb-4" style={{ fontSize: "1rem", fontWeight: 700 }}>
              Filters
            </h3>

            {/* Category Filter */}
            <div className="mb-5">
              <p className="text-[var(--farmgpt-text-secondary)] mb-3" style={{ fontSize: "0.75rem", fontWeight: 600 }}>
                CATEGORY
              </p>
              <div className="space-y-1">
                {allCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-3 py-2 rounded-xl transition-all`}
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: selectedCategory === cat ? 600 : 400,
                      background: selectedCategory === cat ? "var(--farmgpt-primary-green)" : "transparent",
                      color: selectedCategory === cat ? "white" : "var(--farmgpt-text-secondary)",
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="border-t border-[var(--border)] pt-4">
              <p className="text-[var(--farmgpt-text-secondary)] mb-3" style={{ fontSize: "0.75rem", fontWeight: 600 }}>
                SUMMARY
              </p>
              <div className="space-y-2">
                {[
                  { label: "Total Queries", value: totalCount },
                  { label: "This Month", value: 18 },
                  { label: "Image Diagnoses", value: 5 },
                ].map((s, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-[var(--farmgpt-text-secondary)]" style={{ fontSize: "0.8rem" }}>{s.label}</span>
                    <span className="text-[var(--farmgpt-text-primary)]" style={{ fontSize: "0.875rem", fontWeight: 700 }}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main: History List */}
        <div className="lg:col-span-3">
          {/* Search Bar */}
          <div className="flex items-center gap-3 mb-6">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--farmgpt-text-secondary)]" />
              <input
                type="text"
                placeholder="Search your queries..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white rounded-2xl pl-12 pr-4 py-3 outline-none border border-[var(--border)] focus:border-[var(--farmgpt-primary-green)] transition-colors"
                style={{ fontSize: "0.9rem" }}
              />
            </div>
            <button className="p-3 bg-white rounded-xl border border-[var(--border)] hover:border-[var(--farmgpt-primary-green)] transition-colors">
              <Filter size={18} className="text-[var(--farmgpt-text-secondary)]" />
            </button>
          </div>

          {filteredHistory.length === 0 ? (
            <div className="bg-white rounded-2xl p-16 text-center">
              <p className="text-[var(--farmgpt-text-secondary)]" style={{ fontSize: "1rem" }}>No queries found</p>
            </div>
          ) : (
            filteredHistory.map((section, sectionIndex) => (
              <div key={sectionIndex} className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-[var(--farmgpt-text-primary)]" style={{ fontSize: "0.875rem", fontWeight: 700 }}>
                    {section.date}
                  </h3>
                  <div className="flex-1 h-px bg-[var(--border)]" />
                  <span className="text-[var(--farmgpt-text-secondary)]" style={{ fontSize: "0.75rem" }}>
                    {section.queries.length} {section.queries.length === 1 ? "query" : "queries"}
                  </span>
                </div>

                <div className="space-y-3">
                  {section.queries.map((query, queryIndex) => (
                    <motion.div
                      key={query.id}
                      initial={{ x: -15, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: queryIndex * 0.05, duration: 0.3 }}
                      onClick={() => navigate(query.type === "image" ? "/app/image-diagnosis" : "/app/chat")}
                      className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group flex items-center gap-4"
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        query.type === "image" ? "bg-rose-50" : "bg-[var(--farmgpt-surface-green)]"
                      }`}>
                        {query.type === "image" ? (
                          <Camera size={18} className="text-rose-600" />
                        ) : (
                          <MessageCircle size={18} className="text-[var(--farmgpt-primary-green)]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[var(--farmgpt-text-primary)] mb-1" style={{ fontSize: "0.9rem", fontWeight: 500 }}>
                          {query.question}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full ${query.categoryColor}`} style={{ fontSize: "0.7rem", fontWeight: 600 }}>
                            {query.category}
                          </span>
                          <span className="text-[var(--farmgpt-text-secondary)]" style={{ fontSize: "0.75rem" }}>
                            {query.time}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={16} className="text-red-400" />
                        </button>
                        <ChevronRight size={18} className="text-[var(--farmgpt-text-secondary)] group-hover:text-[var(--farmgpt-primary-green)] transition-colors" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
