import { Phone, MessageCircle, Star, Clock, Award, MapPin, ChevronRight } from "lucide-react";
import { motion } from "motion/react";

const officers = [
  {
    id: 1,
    name: "Suresh Kumar M.",
    role: "Krishibhavan Officer",
    location: "Thrissur",
    rating: 4.8,
    reviews: 124,
    experience: "12 years",
    specialization: "Crop diseases, Pest control",
    available: true,
    emoji: "👨‍🌾",
    responseTime: "~30 min",
  },
  {
    id: 2,
    name: "Meena Krishnan",
    role: "Senior Agri Scientist",
    location: "Palakkad",
    rating: 4.9,
    reviews: 87,
    experience: "15 years",
    specialization: "Soil health, Organic farming",
    available: true,
    emoji: "👩‍🔬",
    responseTime: "~1 hour",
  },
  {
    id: 3,
    name: "Ramesh Nair",
    role: "Horticulture Officer",
    location: "Ernakulam",
    rating: 4.6,
    reviews: 62,
    experience: "8 years",
    specialization: "Fruit crops, Plantation",
    available: false,
    emoji: "👨‍💼",
    responseTime: "Next day",
  },
];

const statusSteps = [
  { label: "Query Submitted", status: "completed", time: "10:30 AM" },
  { label: "Officer Assigned", status: "completed", time: "10:45 AM" },
  { label: "In Review", status: "active", time: "Expected ~12:30 PM" },
  { label: "Resolved", status: "pending", time: "—" },
];

export function AgriOfficer() {
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Officers List */}
        <div className="lg:col-span-2">
          <h2 className="text-[var(--farmgpt-text-primary)] mb-2" style={{ fontSize: "1.25rem", fontWeight: 700 }}>
            Available Experts
          </h2>
          <p className="text-[var(--farmgpt-text-secondary)] mb-6" style={{ fontSize: "0.875rem" }}>
            Connect with certified Krishibhavan officers and agricultural scientists
          </p>

          <div className="space-y-4">
            {officers.map((officer, index) => (
              <motion.div
                key={officer.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-5">
                  <div className="w-16 h-16 bg-[var(--farmgpt-surface-green)] rounded-2xl flex items-center justify-center text-3xl shrink-0">
                    {officer.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-[var(--farmgpt-text-primary)]" style={{ fontSize: "1rem", fontWeight: 700 }}>
                            {officer.name}
                          </h3>
                          <span
                            className="px-2 py-0.5 rounded-full"
                            style={{
                              fontSize: "0.7rem",
                              fontWeight: 600,
                              background: officer.available ? "#dcfce7" : "#f3f4f6",
                              color: officer.available ? "#15803d" : "#9ca3af",
                            }}
                          >
                            {officer.available ? "● Available" : "● Busy"}
                          </span>
                        </div>
                        <p className="text-[var(--farmgpt-text-secondary)]" style={{ fontSize: "0.8rem" }}>
                          {officer.role}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 mb-4">
                      <div className="flex items-center gap-1.5">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={13}
                              className={i < Math.floor(officer.rating) ? "text-[var(--farmgpt-accent-amber)] fill-[var(--farmgpt-accent-amber)]" : "text-gray-200 fill-gray-200"}
                            />
                          ))}
                        </div>
                        <span style={{ fontSize: "0.8rem", color: "var(--farmgpt-text-secondary)" }}>
                          {officer.rating} ({officer.reviews})
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[var(--farmgpt-text-secondary)]">
                        <MapPin size={13} />
                        <span style={{ fontSize: "0.8rem" }}>{officer.location}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[var(--farmgpt-text-secondary)]">
                        <Award size={13} />
                        <span style={{ fontSize: "0.8rem" }}>{officer.experience}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[var(--farmgpt-text-secondary)]">
                        <Clock size={13} />
                        <span style={{ fontSize: "0.8rem" }}>{officer.responseTime}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-[var(--farmgpt-text-secondary)]" style={{ fontSize: "0.8rem" }}>
                        🎓 {officer.specialization}
                      </p>
                      <div className="flex gap-2">
                        <button
                          disabled={!officer.available}
                          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-opacity ${
                            officer.available
                              ? "bg-[var(--farmgpt-primary-green)] text-white hover:opacity-90"
                              : "bg-gray-100 text-gray-400 cursor-not-allowed"
                          }`}
                          style={{ fontSize: "0.8rem", fontWeight: 600 }}
                        >
                          <Phone size={15} />
                          Call
                        </button>
                        <button
                          disabled={!officer.available}
                          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-opacity ${
                            officer.available
                              ? "bg-[#25D366] text-white hover:opacity-90"
                              : "bg-gray-100 text-gray-400 cursor-not-allowed"
                          }`}
                          style={{ fontSize: "0.8rem", fontWeight: 600 }}
                        >
                          <MessageCircle size={15} />
                          WhatsApp
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Panel: Active Consultation */}
        <div className="space-y-5">
          {/* Active Query */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl p-5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[var(--farmgpt-text-primary)]" style={{ fontSize: "1rem", fontWeight: 700 }}>
                Active Consultation
              </h3>
              <span className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full" style={{ fontSize: "0.75rem", fontWeight: 600 }}>
                In Progress
              </span>
            </div>

            <div className="bg-[var(--farmgpt-surface-green)] rounded-xl p-4 mb-4">
              <p className="text-[var(--farmgpt-text-primary)] mb-2" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                Your Query
              </p>
              <p className="text-[var(--farmgpt-text-secondary)]" style={{ fontSize: "0.8rem", lineHeight: 1.6 }}>
                Tomato plants showing leaf curl symptoms with yellowing. Need expert advice on treatment and prevention.
              </p>
            </div>

            <div className="border border-[var(--border)] rounded-xl p-4 mb-4">
              <p className="text-[var(--farmgpt-primary-green)] mb-2" style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                🤖 AI's Preliminary Analysis
              </p>
              <p className="text-[var(--farmgpt-text-secondary)]" style={{ fontSize: "0.78rem", lineHeight: 1.6 }}>
                Identified as Tomato Leaf Curl Virus with 87% confidence. Recommended basic treatment measures pending expert review.
              </p>
            </div>

            <div className="flex items-center gap-2 text-amber-600" style={{ fontSize: "0.78rem" }}>
              <ChevronRight size={14} />
              <span>Requires expert confirmation</span>
            </div>
          </motion.div>

          {/* Status Timeline */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="bg-white rounded-2xl p-5 shadow-sm"
          >
            <h3 className="text-[var(--farmgpt-text-primary)] mb-4" style={{ fontSize: "1rem", fontWeight: 700 }}>
              Consultation Status
            </h3>
            <div className="space-y-1">
              {statusSteps.map((step, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        background:
                          step.status === "completed"
                            ? "var(--farmgpt-primary-green)"
                            : step.status === "active"
                            ? "var(--farmgpt-accent-amber)"
                            : "#e5e7eb",
                        color:
                          step.status === "pending" ? "#9ca3af" : "white",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                      }}
                    >
                      {step.status === "completed" ? "✓" : index + 1}
                    </div>
                    {index < statusSteps.length - 1 && (
                      <div
                        className="w-0.5 flex-1 my-1"
                        style={{
                          minHeight: 24,
                          background: step.status === "completed" ? "var(--farmgpt-primary-green)" : "#e5e7eb",
                        }}
                      />
                    )}
                  </div>
                  <div className="pb-4 flex-1">
                    <p
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: step.status !== "pending" ? 600 : 400,
                        color: step.status === "pending" ? "var(--farmgpt-text-secondary)" : "var(--farmgpt-text-primary)",
                      }}
                    >
                      {step.label}
                    </p>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: step.status === "active" ? "var(--farmgpt-accent-amber)" : "var(--farmgpt-text-secondary)",
                      }}
                    >
                      {step.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Emergency CTA */}
          <div className="bg-[var(--farmgpt-primary-green)] rounded-2xl p-5 text-center">
            <p className="text-white mb-1" style={{ fontSize: "0.9rem", fontWeight: 700 }}>Need Urgent Help?</p>
            <p className="text-white/70 mb-4" style={{ fontSize: "0.8rem" }}>
              Call the Krishibhavan helpline directly
            </p>
            <a
              href="tel:1800-180-1551"
              className="flex items-center justify-center gap-2 py-3 bg-white text-[var(--farmgpt-primary-green)] rounded-xl hover:opacity-90 transition-opacity"
              style={{ fontSize: "0.875rem", fontWeight: 700 }}
            >
              <Phone size={18} />
              1800-180-1551
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
