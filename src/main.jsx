import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  AlertCircle,
  Archive,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock,
  Database,
  FilePlus2,
  FileSearch,
  Fingerprint,
  Link2,
  MapPin,
  Network,
  Plus,
  Search,
  ShieldCheck,
  Tag,
  UserRound,
} from "lucide-react";
import "./styles.css";

const seedData = {
  cases: [
    {
      id: "CASE-2026-001",
      title: "Warehouse Access Review",
      status: "Open",
      priority: "High",
      type: "Internal",
      opened: "2026-05-28",
      summary:
        "Reviewing unusual after-hours access logs, statements, and camera exports connected to the north warehouse entrance.",
      tags: ["access", "video", "statements"],
    },
    {
      id: "CASE-2026-002",
      title: "Vendor Invoice Discrepancy",
      status: "Reviewing",
      priority: "Medium",
      type: "Financial",
      opened: "2026-05-19",
      summary:
        "Collecting invoice versions, email approvals, and vendor contact records to reconcile a payment mismatch.",
      tags: ["finance", "email", "vendor"],
    },
  ],
  people: [
    {
      id: "P-001",
      name: "Mara Ellis",
      role: "Witness",
      contact: "mara.ellis@example.com",
      caseId: "CASE-2026-001",
      notes: "Reported seeing loading bay lights on at 22:40.",
    },
    {
      id: "P-002",
      name: "Northline Supply",
      role: "Organization",
      contact: "accounts@northline.example",
      caseId: "CASE-2026-002",
      notes: "Vendor account under review.",
    },
  ],
  evidence: [
    {
      id: "EV-001",
      title: "North entrance camera export",
      type: "Video",
      source: "Security system",
      obtained: "2026-05-29",
      caseId: "CASE-2026-001",
      confidence: "Confirmed",
      description: "Camera clip covering 22:15 to 23:10 on May 27.",
    },
    {
      id: "EV-002",
      title: "Invoice approval email thread",
      type: "Email",
      source: "Finance mailbox",
      obtained: "2026-05-22",
      caseId: "CASE-2026-002",
      confidence: "Needs review",
      description: "Forwarded approval chain with two conflicting attachment names.",
    },
  ],
  events: [
    {
      id: "TL-001",
      title: "Badge entry recorded",
      date: "2026-05-27",
      time: "22:34",
      location: "North warehouse entrance",
      caseId: "CASE-2026-001",
      support: "EV-001",
      confidence: "High",
    },
    {
      id: "TL-002",
      title: "Revised invoice received",
      date: "2026-05-17",
      time: "09:12",
      location: "Email",
      caseId: "CASE-2026-002",
      support: "EV-002",
      confidence: "Medium",
    },
  ],
  notes: [
    {
      id: "N-001",
      title: "Initial review",
      body: "Need to compare badge access with camera timestamps and interview schedule.",
      caseId: "CASE-2026-001",
      created: "2026-05-29",
      tag: "Follow-up",
    },
  ],
  tasks: [
    {
      id: "T-001",
      title: "Request raw access logs",
      status: "Open",
      priority: "High",
      due: "2026-06-03",
      caseId: "CASE-2026-001",
    },
    {
      id: "T-002",
      title: "Compare invoice hashes",
      status: "In progress",
      priority: "Medium",
      due: "2026-06-05",
      caseId: "CASE-2026-002",
    },
  ],
};

const storeKey = "case-logger-data-v1";

function loadData() {
  try {
    const saved = localStorage.getItem(storeKey);
    return saved ? JSON.parse(saved) : seedData;
  } catch {
    return seedData;
  }
}

function App() {
  const [data, setData] = useState(loadData);
  const [activeCaseId, setActiveCaseId] = useState(data.cases[0]?.id ?? "");
  const [query, setQuery] = useState("");
  const [caseFilter, setCaseFilter] = useState("All");
  const [quickAdd, setQuickAdd] = useState("evidence");

  const activeCase = data.cases.find((item) => item.id === activeCaseId) ?? data.cases[0];

  function save(next) {
    setData(next);
    localStorage.setItem(storeKey, JSON.stringify(next));
  }

  function createCase(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = form.get("title").toString().trim();
    if (!title) return;
    const id = `CASE-${new Date().getFullYear()}-${String(data.cases.length + 1).padStart(3, "0")}`;
    const next = {
      ...data,
      cases: [
        {
          id,
          title,
          status: form.get("status"),
          priority: form.get("priority"),
          type: form.get("type").toString().trim() || "General",
          opened: new Date().toISOString().slice(0, 10),
          summary: form.get("summary").toString().trim(),
          tags: form
            .get("tags")
            .toString()
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
        },
        ...data.cases,
      ],
    };
    save(next);
    setActiveCaseId(id);
    event.currentTarget.reset();
  }

  function addItem(event) {
    event.preventDefault();
    if (!activeCase) return;
    const form = new FormData(event.currentTarget);
    const title = form.get("title").toString().trim();
    if (!title) return;
    const today = new Date().toISOString().slice(0, 10);

    const next = { ...data };
    if (quickAdd === "evidence") {
      next.evidence = [
        {
          id: `EV-${String(data.evidence.length + 1).padStart(3, "0")}`,
          title,
          type: form.get("type") || "Document",
          source: form.get("source").toString().trim() || "Unspecified",
          obtained: today,
          caseId: activeCase.id,
          confidence: form.get("confidence") || "Needs review",
          description: form.get("details").toString().trim(),
        },
        ...data.evidence,
      ];
    }
    if (quickAdd === "event") {
      next.events = [
        {
          id: `TL-${String(data.events.length + 1).padStart(3, "0")}`,
          title,
          date: form.get("date") || today,
          time: form.get("time") || "",
          location: form.get("source").toString().trim() || "Unspecified",
          caseId: activeCase.id,
          support: "",
          confidence: form.get("confidence") || "Medium",
        },
        ...data.events,
      ];
    }
    if (quickAdd === "note") {
      next.notes = [
        {
          id: `N-${String(data.notes.length + 1).padStart(3, "0")}`,
          title,
          body: form.get("details").toString().trim(),
          caseId: activeCase.id,
          created: today,
          tag: form.get("type") || "General",
        },
        ...data.notes,
      ];
    }
    if (quickAdd === "task") {
      next.tasks = [
        {
          id: `T-${String(data.tasks.length + 1).padStart(3, "0")}`,
          title,
          status: "Open",
          priority: form.get("confidence") || "Medium",
          due: form.get("date") || today,
          caseId: activeCase.id,
        },
        ...data.tasks,
      ];
    }
    save(next);
    event.currentTarget.reset();
  }

  const filteredCases = useMemo(() => {
    const lower = query.toLowerCase();
    return data.cases.filter((item) => {
      const statusMatch = caseFilter === "All" || item.status === caseFilter;
      const queryMatch = [item.title, item.id, item.summary, item.type, ...item.tags]
        .join(" ")
        .toLowerCase()
        .includes(lower);
      return statusMatch && queryMatch;
    });
  }, [caseFilter, data.cases, query]);

  const caseRecords = useMemo(() => {
    if (!activeCase) return {};
    return {
      people: data.people.filter((item) => item.caseId === activeCase.id),
      evidence: data.evidence.filter((item) => item.caseId === activeCase.id),
      events: data.events.filter((item) => item.caseId === activeCase.id),
      notes: data.notes.filter((item) => item.caseId === activeCase.id),
      tasks: data.tasks.filter((item) => item.caseId === activeCase.id),
    };
  }, [activeCase, data]);

  const metrics = [
    { label: "Open cases", value: data.cases.filter((item) => item.status !== "Closed").length, icon: FileSearch },
    { label: "Evidence items", value: data.evidence.length, icon: Fingerprint },
    { label: "Timeline events", value: data.events.length, icon: CalendarDays },
    { label: "Open tasks", value: data.tasks.filter((item) => item.status !== "Done").length, icon: ClipboardList },
  ];

  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand">
          <ShieldCheck size={28} />
          <div>
            <strong>Case Logger</strong>
            <span>Evidence workspace</span>
          </div>
        </div>
        <nav>
          {["Dashboard", "Cases", "Evidence", "People", "Timeline", "Tasks", "Notes", "Reports"].map((item) => (
            <button key={item} className={item === "Dashboard" ? "active" : ""}>
              {item}
            </button>
          ))}
        </nav>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p>Investigation Control</p>
            <h1>Track facts, evidence, and follow-ups in one case file.</h1>
          </div>
          <div className="searchbox">
            <Search size={18} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search cases, tags, summaries" />
          </div>
        </header>

        <section className="metrics">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <article className="metric" key={metric.label}>
                <Icon size={20} />
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </article>
            );
          })}
        </section>

        <section className="grid">
          <section className="panel case-list">
            <div className="panel-head">
              <h2>Cases</h2>
              <select value={caseFilter} onChange={(event) => setCaseFilter(event.target.value)}>
                <option>All</option>
                <option>Open</option>
                <option>Reviewing</option>
                <option>Closed</option>
              </select>
            </div>
            <div className="stack">
              {filteredCases.map((item) => (
                <button
                  className={`case-card ${activeCase?.id === item.id ? "selected" : ""}`}
                  key={item.id}
                  onClick={() => setActiveCaseId(item.id)}
                >
                  <span className="case-id">{item.id}</span>
                  <strong>{item.title}</strong>
                  <small>{item.summary}</small>
                  <span className="meta-row">
                    <Pill value={item.status} />
                    <Pill value={item.priority} />
                    <span>{item.opened}</span>
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="case-detail">
            {activeCase ? (
              <>
                <div className="detail-head">
                  <div>
                    <span className="case-id">{activeCase.id}</span>
                    <h2>{activeCase.title}</h2>
                    <p>{activeCase.summary}</p>
                  </div>
                  <div className="status-strip">
                    <Pill value={activeCase.status} />
                    <Pill value={activeCase.priority} />
                    <Pill value={activeCase.type} />
                  </div>
                </div>

                <div className="tags">
                  {activeCase.tags.map((item) => (
                    <span key={item}>
                      <Tag size={14} />
                      {item}
                    </span>
                  ))}
                </div>

                <div className="record-grid">
                  <RecordPanel title="Evidence" icon={Fingerprint} items={caseRecords.evidence} render={EvidenceItem} />
                  <RecordPanel title="Timeline" icon={Clock} items={caseRecords.events} render={EventItem} />
                  <RecordPanel title="People & Entities" icon={UserRound} items={caseRecords.people} render={PersonItem} />
                  <RecordPanel title="Tasks" icon={CheckCircle2} items={caseRecords.tasks} render={TaskItem} />
                  <RecordPanel title="Notes" icon={FileSearch} items={caseRecords.notes} render={NoteItem} wide />
                </div>
              </>
            ) : (
              <div className="empty">Create a case to begin logging records.</div>
            )}
          </section>

          <section className="panel forms">
            <div className="panel-head">
              <h2>New Case</h2>
              <Plus size={18} />
            </div>
            <form onSubmit={createCase}>
              <input name="title" placeholder="Case title" />
              <div className="row">
                <select name="status" defaultValue="Open">
                  <option>Open</option>
                  <option>Reviewing</option>
                  <option>Closed</option>
                </select>
                <select name="priority" defaultValue="Medium">
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
              <input name="type" placeholder="Type or category" />
              <textarea name="summary" placeholder="Short case summary" />
              <input name="tags" placeholder="Tags, separated by commas" />
              <button className="primary" type="submit">
                <FilePlus2 size={17} />
                Create case
              </button>
            </form>

            <div className="panel-head compact">
              <h2>Quick Add</h2>
              <select value={quickAdd} onChange={(event) => setQuickAdd(event.target.value)}>
                <option value="evidence">Evidence</option>
                <option value="event">Timeline</option>
                <option value="note">Note</option>
                <option value="task">Task</option>
              </select>
            </div>
            <form onSubmit={addItem}>
              <input name="title" placeholder={`${quickAdd} title`} />
              <div className="row">
                <input name="type" placeholder="Type/tag" />
                <select name="confidence" defaultValue="Medium">
                  <option>Confirmed</option>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                  <option>Needs review</option>
                </select>
              </div>
              <div className="row">
                <input name="source" placeholder="Source/location" />
                <input name="date" type="date" />
              </div>
              <input name="time" type="time" />
              <textarea name="details" placeholder="Description, observation, or chain-of-custody note" />
              <button className="primary" type="submit">
                <Database size={17} />
                Add to active case
              </button>
            </form>
          </section>
        </section>
      </section>
    </main>
  );
}

function Pill({ value }) {
  return <span className={`pill ${String(value).toLowerCase().replace(/\s+/g, "-")}`}>{value}</span>;
}

function RecordPanel({ title, icon: Icon, items, render, wide }) {
  return (
    <article className={`record-panel ${wide ? "wide" : ""}`}>
      <div className="record-title">
        <Icon size={18} />
        <h3>{title}</h3>
        <span>{items.length}</span>
      </div>
      <div className="record-list">
        {items.length ? items.map((item) => <React.Fragment key={item.id}>{render(item)}</React.Fragment>) : <p className="empty-small">No records yet.</p>}
      </div>
    </article>
  );
}

function EvidenceItem(item) {
  return (
    <div className="record">
      <strong>{item.title}</strong>
      <span>
        <Fingerprint size={14} /> {item.id} · {item.type}
      </span>
      <small>{item.description}</small>
      <span>
        <Link2 size={14} /> {item.source} · {item.obtained}
      </span>
    </div>
  );
}

function EventItem(item) {
  return (
    <div className="record">
      <strong>{item.title}</strong>
      <span>
        <CalendarDays size={14} /> {item.date} {item.time}
      </span>
      <span>
        <MapPin size={14} /> {item.location}
      </span>
    </div>
  );
}

function PersonItem(item) {
  return (
    <div className="record">
      <strong>{item.name}</strong>
      <span>
        <Network size={14} /> {item.role}
      </span>
      <small>{item.notes}</small>
    </div>
  );
}

function TaskItem(item) {
  return (
    <div className="record">
      <strong>{item.title}</strong>
      <span>
        <AlertCircle size={14} /> {item.priority} · {item.status}
      </span>
      <span>
        <Clock size={14} /> Due {item.due}
      </span>
    </div>
  );
}

function NoteItem(item) {
  return (
    <div className="record">
      <strong>{item.title}</strong>
      <small>{item.body}</small>
      <span>
        <Archive size={14} /> {item.tag} · {item.created}
      </span>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
