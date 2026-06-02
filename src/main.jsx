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
  cases: [],
  complaints: [],
  people: [
    { id: "P-001", name: "James Gamble", rank: "Chief of Police", badgeNumber: "201", assignment: "", division: "", supervisorName: "" },
    { id: "P-002", name: "Jimmy Rockford", rank: "Deputy Chief", badgeNumber: "202", assignment: "", division: "", supervisorName: "" },
    { id: "P-003", name: "Frank Church", rank: "Commander", badgeNumber: "203", assignment: "", division: "", supervisorName: "" },
    { id: "P-004", name: "Ezrael Kayne", rank: "Commander", badgeNumber: "204", assignment: "", division: "", supervisorName: "" },
    { id: "P-005", name: "Levi Pendragon", rank: "Captain", badgeNumber: "205", assignment: "", division: "", supervisorName: "" },
    { id: "P-006", name: "Calvin Sidhe", rank: "Captain", badgeNumber: "206", assignment: "", division: "", supervisorName: "" },
    { id: "P-007", name: "Arnold Williams", rank: "Captain", badgeNumber: "207", assignment: "", division: "", supervisorName: "" },
    { id: "P-008", name: "Ted Woods", rank: "Lieutenant", badgeNumber: "210", assignment: "", division: "", supervisorName: "" },
    { id: "P-009", name: "", rank: "Lieutenant", badgeNumber: "211", assignment: "", division: "", supervisorName: "" },
    { id: "P-010", name: "Shawn Braddington", rank: "Lieutenant", badgeNumber: "212", assignment: "", division: "", supervisorName: "" },
    { id: "P-011", name: "Daniel \"Hondo\" Harelson", rank: "Lieutenant", badgeNumber: "213", assignment: "", division: "", supervisorName: "" },
    { id: "P-012", name: "", rank: "Lieutenant", badgeNumber: "214", assignment: "", division: "", supervisorName: "" },
    { id: "P-013", name: "Annabelle Sable", rank: "Sergeant", badgeNumber: "215", assignment: "", division: "", supervisorName: "" },
    { id: "P-014", name: "David Hinkleberry", rank: "Sergeant", badgeNumber: "216", assignment: "", division: "", supervisorName: "" },
    { id: "P-015", name: "Ayumi Hirano", rank: "Sergeant", badgeNumber: "217", assignment: "", division: "", supervisorName: "" },
    { id: "P-016", name: "Mike Kraus", rank: "Sergeant", badgeNumber: "218", assignment: "", division: "", supervisorName: "" },
    { id: "P-017", name: "Mason Crow", rank: "Sergeant", badgeNumber: "219", assignment: "", division: "", supervisorName: "" },
    { id: "P-018", name: "Molly Gabagooly", rank: "Sergeant", badgeNumber: "220", assignment: "", division: "", supervisorName: "" },
    { id: "P-019", name: "Bobby Light", rank: "Sergeant", badgeNumber: "221", assignment: "", division: "", supervisorName: "" },
    { id: "P-020", name: "Jay Savage", rank: "Sergeant", badgeNumber: "222", assignment: "", division: "", supervisorName: "" },
  ],
  evidence: [],
  events: [],
  notes: [],
  tasks: [],
  findings: [],
};

const storeKey = "case-logger-data-v2";
const caseStatuses = [
  "Intake",
  "Preliminary Review",
  "Active Investigation",
  "Evidence Collection",
  "Interview Phase",
  "Command Review",
  "Adjudication",
  "Appeal",
  "Closed",
  "Archived",
];

const rankOrder = ["Chief of Police", "Deputy Chief", "Commander", "Captain", "Lieutenant", "Sergeant", "Corporal", "Officer", "Cadet"];

const themeColors = [
  { name: "Forest", dark: "#14201e", accent: "#2f7f67" },
  { name: "Ocean", dark: "#1a2b4a", accent: "#3b82f6" },
  { name: "Amethyst", dark: "#3d1f47", accent: "#a855f7" },
  { name: "Crimson", dark: "#4a1f1f", accent: "#ef4444" },
  { name: "Slate", dark: "#1e293b", accent: "#64748b" },
  { name: "Teal", dark: "#0f3f3f", accent: "#14b8a6" },
];

const findingTypes = ["Sustained", "Not Sustained", "Exonerated", "Unfounded", "Policy Failure"];
const iaRecommendationTemplates = ["No Action", "Coaching", "Counseling", "Written Warning", "Suspension", "Termination"];
const disciplineTemplates = ["None", "Counseling", "Written Warning", "Suspension", "Termination"];
const severityLevels = ["None", "Low", "Medium", "High"];

function getRankIndex(rank) {
  return rankOrder.indexOf(rank || "") === -1 ? rankOrder.length : rankOrder.indexOf(rank);
}

function nextCaseNumber(cases) {
  const year = new Date().getFullYear();
  const currentYearNumbers = cases
    .map((item) => String(item.id).match(new RegExp(`^CASE-${year}-(\\d+)$`))?.[1])
    .filter(Boolean)
    .map(Number);
  const next = currentYearNumbers.length ? Math.max(...currentYearNumbers) + 1 : 1;
  return `CASE-${year}-${String(next).padStart(3, "0")}`;
}

function nextComplaintNumber(complaints) {
  const numbers = complaints
    .map((item) => String(item.id).match(/^CPL-(\d+)$/)?.[1])
    .filter(Boolean)
    .map(Number);
  const next = numbers.length ? Math.max(...numbers) + 1 : 1;
  return `CPL-${String(next).padStart(3, "0")}`;
}

function nextFindingNumber(findings) {
  const numbers = findings
    .map((item) => String(item.id).match(/^FN-(\d+)$/)?.[1])
    .filter(Boolean)
    .map(Number);
  const next = numbers.length ? Math.max(...numbers) + 1 : 1;
  return `FN-${String(next).padStart(3, "0")}`;
}

function normalizeData(data) {
  return {
    ...seedData,
    ...data,
    cases: (data.cases ?? []).map((item) => ({
      ...item,
      status: caseStatuses.includes(item.status) ? item.status : item.status === "Closed" ? "Closed" : "Intake",
      priority: item.priority || "Medium",
      classification: item.classification || "Unclassified",
      investigationType: item.investigationType || item.type || "General",
      assignedInvestigator: item.assignedInvestigator || "Unassigned",
      supervisingInvestigator: item.supervisingInvestigator || "Unassigned",
      opened: item.opened || new Date().toISOString().slice(0, 10),
      closed: item.closed || "",
      tags: item.tags ?? [],

      relatedCaseIds: item.relatedCaseIds ?? [],
      priorComplaintIds: item.priorComplaintIds ?? [],
      involvedPersonIds: item.involvedPersonIds ?? [],
      incidentId: item.incidentId || "",
    })),
  people: (data.people ?? []).map((p) => ({
      ...p,
      rank: p.rank ?? "",
      badgeNumber: p.badgeNumber ?? "",
      assignment: p.assignment ?? "",
      division: p.division ?? "",
      supervisorName: p.supervisorName ?? "",
      riskScoreOverride: p.riskScoreOverride ?? null,
      riskScoreOverrideDate: p.riskScoreOverrideDate ?? null,
      riskScoreOverrideReason: p.riskScoreOverrideReason ?? "",
      trainingDeficiencies: p.trainingDeficiencies ?? "",
      personnelHistory: p.personnelHistory ?? {
        previousComplaints: [],
        previousInvestigations: [],
        sustainedFindings: [],
        disciplinaryHistory: [],
        commendations: [],
        trainingRecords: [],
      },
    })),
    complaints: (data.complaints ?? []).map((item) => ({  
      ...item,

      // Backward compatibility for old schema
      date: item.date || new Date().toISOString().slice(0, 10),
      source: item.source || "Unspecified",
      description: item.description || "",
      involvedPersonIds: item.involvedPersonIds ?? [],
      linkedCaseIds: item.linkedCaseIds ?? [],

      // New intake fields
      complaintType: item.complaintType || (item.anonymous ? "Anonymous" : "Citizen"),
      category: item.category || item.complaintCategory || "Uncategorized",

      complainant: {
        name: item?.complainant?.name || "",
        id: item?.complainant?.id || "",
      },
      contact: {
        phone: item?.contact?.phone || "",
        email: item?.contact?.email || "",
        address: item?.contact?.address || "",
      },

      incident: {
        location: item?.incident?.location || item.source || "Unspecified",
        dateTime: item?.incident?.dateTime || "",
      },

      narrative: item.narrative || item.description || "",

      evidence: (item.evidence ?? []).map((ev) => ({
        id: ev.id || `EV-${Math.random().toString(16).slice(2, 6)}`,
        name: ev.name || ev.filename || "Evidence",
        type: ev.type || "Unknown",
        addedAt: ev.addedAt || ev.obtained || new Date().toISOString().slice(0, 10),
        notes: ev.notes || "",
      })),

      // Workflow
      status: item.status || "Submitted",
      intakeStage: item.intakeStage || (item.status === "Intake" ? "Intake" : "Submitted"),
      supervisorReferral: item.supervisorReferral || {
        enabled: Boolean(item?.supervisorReferral?.enabled),
        supervisorName: item?.supervisorReferral?.supervisorName || "",
        supervisorId: item?.supervisorReferral?.supervisorId || "",
        referralReason: item?.supervisorReferral?.referralReason || "",
      },

      // Screening outputs
      screening: {
        duplicateDetected: Boolean(item?.screening?.duplicateDetected),
        duplicateScore: item?.screening?.duplicateScore ?? null,
        duplicateOfComplaintId: item?.screening?.duplicateOfComplaintId ?? "",
        possibleDuplicates: item?.screening?.possibleDuplicates ?? [],
        historyFound: Boolean(item?.screening?.historyFound),
        reasons: item?.screening?.reasons ?? [],
      },
      mandatoryIAReviewAlert: Boolean(item?.mandatoryIAReviewAlert),
      mandatoryIAReviewReasons: item?.mandatoryIAReviewReasons ?? [],
    })),
    findings: (data.findings ?? []).map((item) => ({
      ...item,
      finding: findingTypes.includes(item.finding) ? item.finding : "Sustained",
      iaRecommendationTemplate: iaRecommendationTemplates.includes(item.iaRecommendationTemplate) ? item.iaRecommendationTemplate : "",
      disciplineTemplate: disciplineTemplates.includes(item.disciplineTemplate) ? item.disciplineTemplate : "None",
      severityLevel: severityLevels.includes(item.severityLevel) ? item.severityLevel : "None",
      commandReviewStatus: ["Pending", "Approved", "Rejected"].includes(item.commandReviewStatus) ? item.commandReviewStatus : "Pending",
      appealStatus: ["None", "Pending", "Approved", "Denied"].includes(item.appealStatus) ? item.appealStatus : "None",
      description: item.description || "",
      iaRecommendation: item.iaRecommendation || "",
      disciplineRecommendation: item.disciplineRecommendation || "",
      correctiveActionRecommendation: item.correctiveActionRecommendation || "",
      commandReview: item.commandReview || "",
      finalDisposition: item.finalDisposition || "",
      officerInvolved: item.officerInvolved || "",
      dateCreated: item.dateCreated || new Date().toISOString().slice(0, 10),
      adjudicatedBy: item.adjudicatedBy || "",
    })),
  };
}


function loadData() {
  try {
    const saved = localStorage.getItem(storeKey);
    return saved ? normalizeData(JSON.parse(saved)) : seedData;
  } catch {
    return seedData;
  }
}

function App() {
  const [data, setData] = useState(loadData);
  const [activeCaseId, setActiveCaseId] = useState(data.cases[0]?.id ?? "");
  const [activeComplaintId, setActiveComplaintId] = useState(data.complaints?.[0]?.id ?? "");
  const [activeView, setActiveView] = useState("Dashboard");
  const [query, setQuery] = useState("");
  const [caseFilter, setCaseFilter] = useState("All");
  const [quickAdd, setQuickAdd] = useState("evidence");

  const [complaintQuickAdd, setComplaintQuickAdd] = useState("complaint");

  const activeCase = data.cases.find((item) => item.id === activeCaseId) ?? data.cases[0];
  const activeComplaint = data.complaints?.find((item) => item.id === activeComplaintId) ?? data.complaints?.[0];
  const navItems = ["Dashboard", "Cases", "Evidence", "People", "Officer Profile", "Timeline", "Tasks", "Notes", "Complaints", "Adjudication", "Reports", "Settings"];
  const [themeIndex, setThemeIndex] = useState(() => {
    const saved = localStorage.getItem("theme-index");
    return saved ? parseInt(saved) : 0;
  });

  useMemo(() => {
    const theme = themeColors[themeIndex];
    document.documentElement.style.setProperty("--theme-dark", theme.dark);
    document.documentElement.style.setProperty("--theme-accent", theme.accent);
    localStorage.setItem("theme-index", themeIndex.toString());
  }, [themeIndex]);

  const [selectedOfficerId, setSelectedOfficerId] = useState(null);

  function save(next) {
    setData(next);
    localStorage.setItem(storeKey, JSON.stringify(next));
  }

  function createCase(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = form.get("title").toString().trim();
    if (!title) return;
    const id = nextCaseNumber(data.cases);
    const opened = form.get("opened").toString() || new Date().toISOString().slice(0, 10);
    const next = {
      ...data,
      cases: [
        {
          id,
          title,
          status: form.get("status"),
          priority: form.get("priority"),
          classification: form.get("classification").toString().trim() || "Unclassified",
          investigationType: form.get("investigationType").toString().trim() || "General",
          assignedInvestigator: form.get("assignedInvestigator").toString().trim() || "Unassigned",
          supervisingInvestigator: form.get("supervisingInvestigator").toString().trim() || "Unassigned",
          opened,
          closed: form.get("closed").toString(),
          summary: form.get("summary").toString().trim(),
          tags: form
            .get("tags")
            .toString()
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
          relatedCaseIds: [],
          priorComplaintIds: [],
          involvedPersonIds: [],
          incidentId: form.get("incidentId").toString().trim(),
        },
        ...data.cases,
      ],
    };
    save(next);
    setActiveCaseId(id);
    event.currentTarget.reset();
  }

  function parseCsv(text) {
    return (text || "")
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
  }

  function daysBetween(a, b) {
    const ms = Math.abs(new Date(a).getTime() - new Date(b).getTime());
    return Math.floor(ms / (1000 * 60 * 60 * 24));
  }

  function normalizeText(s) {
    return String(s || "")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function tokenize(s) {
    const t = normalizeText(s);
    if (!t) return [];
    return t.split(" ").filter(Boolean);
  }

  function jaccardSimilarity(aTokens, bTokens) {
    if (!aTokens.length || !bTokens.length) return 0;
    const a = new Set(aTokens);
    const b = new Set(bTokens);
    let inter = 0;
    for (const x of a) if (b.has(x)) inter++;
    const union = a.size + b.size - inter;
    return union ? inter / union : 0;
  }

  function computeComplaintScreening(candidate, existingComplaints) {
    const reasons = [];
    const possibleDuplicates = [];

    const candidateIncident = candidate?.incident?.location || "";
    const candidateDt = candidate?.incident?.dateTime || "";
    const candidateCategory = candidate?.category || "";
    const candidateNarr = candidate?.narrative || "";
    const candidateContact = candidate?.contact?.email || candidate?.contact?.phone || candidate?.complainant?.id || "";
    const candidateTokens = tokenize(candidateNarr);

    let best = null;
    let bestScore = -1;

    for (const c of existingComplaints) {
      const cIncident = c?.incident?.location || c?.source || "";
      const cDt = c?.incident?.dateTime || c?.date || "";
      const cCategory = c?.category || c?.complaintCategory || "";
      const cNarr = c?.narrative || c?.description || "";
      const cContact = c?.contact?.email || c?.contact?.phone || c?.complainant?.id || "";

      const locationMatch = normalizeText(cIncident) && normalizeText(candidateIncident)
        ? normalizeText(cIncident) === normalizeText(candidateIncident)
        : false;

      const categoryMatch = candidateCategory && cCategory && normalizeText(candidateCategory) === normalizeText(cCategory);

      const dtOk = candidateDt && cDt ? daysBetween(candidateDt, cDt) <= 7 : false;

      const narrativeSim = jaccardSimilarity(candidateTokens, tokenize(cNarr));

      const contactMatch = candidateContact && cContact ? normalizeText(candidateContact) === normalizeText(cContact) : false;

      let score = 0;
      if (locationMatch) score += 0.35;
      if (categoryMatch) score += 0.2;
      if (dtOk) score += 0.2;
      score += narrativeSim * 0.25;
      if (contactMatch) score += 0.25;

      if (score >= 0.55) {
        possibleDuplicates.push({ id: c.id, score: Number(score.toFixed(2)) });
      }

      if (score > bestScore) {
        bestScore = score;
        best = c;
      }
    }

    const duplicateDetected = Boolean(best && bestScore >= 0.6);
    const duplicateScore = best ? Number(bestScore.toFixed(2)) : null;
    const duplicateOfComplaintId = best?.id || "";

    if (duplicateDetected) reasons.push("Possible duplicate complaint detected (heuristic match)." );
    if (possibleDuplicates.length && !duplicateDetected) reasons.push("Similar complaints found; review recommended." );

    // Previous history check
    const priorHistoryFound = (() => {
      if (!candidateContact) return false;
      return existingComplaints.some((c) => {
        const cContact = c?.contact?.email || c?.contact?.phone || c?.complainant?.id || "";
        return cContact && normalizeText(cContact) === normalizeText(candidateContact);
      });
    })();

    if (priorHistoryFound) reasons.push("Prior complaint history found for complainant/contact." );

    // Mandatory IA review trigger
    let mandatory = false;
    const mandatoryReasons = [];

    if (candidate.complaintType === "Internal") {
      mandatory = true;
      mandatoryReasons.push("Internal complaint requires IA review." );
    }
    if (candidate.supervisorReferral?.enabled) {
      mandatory = true;
      mandatoryReasons.push("Supervisor referral enabled." );
    }
    if (duplicateDetected) {
      mandatory = true;
      mandatoryReasons.push("Duplicate risk threshold exceeded." );
    }
    if (priorHistoryFound) {
      mandatory = true;
      mandatoryReasons.push("History check indicates prior reporting." );
    }

    if (!mandatory && reasons.length) {
      // Soft trigger if we have screening reasons, but not strict
      mandatory = reasons.length >= 2;
      if (mandatory) mandatoryReasons.push("Screening reasons meet IA threshold." );
    }

    return {
      duplicateDetected,
      duplicateScore,
      duplicateOfComplaintId,
      possibleDuplicates: possibleDuplicates
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map((x) => x.id),
      historyFound: priorHistoryFound,
      reasons,
      mandatoryIAReviewAlert: mandatory,
      mandatoryIAReviewReasons: mandatoryReasons,
    };
  }

  function submitComplaint(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    const mode = form.get("mode").toString(); // Intake | Submission

    const title = form.get("title")?.toString().trim();
    if (!title) return;

    const anonymous = form.get("complaintType").toString() === "Anonymous";
    const complaintType = anonymous ? "Anonymous" : (form.get("complaintType").toString() || "Citizen");

    const incidentLocation = form.get("incidentLocation")?.toString().trim() || "Unspecified";
    const incidentDate = form.get("incidentDate")?.toString();
    const incidentTime = form.get("incidentTime")?.toString();
    const incidentDateTime = incidentDate ? `${incidentDate}T${incidentTime || "00:00"}` : "";

    const category = form.get("category")?.toString().trim() || "Uncategorized";

    const complainantName = (form.get("complainantName")?.toString().trim() || "");
    const complainantId = (form.get("complainantId")?.toString().trim() || "");

    const contactPhone = form.get("contactPhone")?.toString().trim() || "";

    const narrative = form.get("narrative")?.toString().trim();
    const requiredOk = Boolean(incidentDateTime && narrative && category);
    if (mode === "Submission" && !requiredOk) return;

    const evidenceNames = parseCsv(form.get("evidenceNames")?.toString());
    const evidenceNotes = parseCsv(form.get("evidenceNotes")?.toString());

    const next = {
      ...data,
      complaints: [
        {
          id: nextComplaintNumber(data.complaints),
          title,
          // legacy fields
          date: form.get("date")?.toString() || (incidentDate ? incidentDate : new Date().toISOString().slice(0, 10)),
          source: form.get("source")?.toString() || incidentLocation,
          description: form.get("description")?.toString() || narrative,
          involvedPersonIds: parseCsv(form.get("involvedPersonIds")?.toString()),
          linkedCaseIds: [],

          // intake fields
          complaintType,
          category,
          complainant: {
            name: anonymous ? "" : complainantName,
            id: anonymous ? "" : complainantId,
          },
          contact: {
            phone: anonymous ? "" : contactPhone,
            address: "",
          },
          incident: {
            location: incidentLocation,
            dateTime: incidentDateTime,
          },
          narrative,

          evidence: (evidenceNames.length
            ? evidenceNames.map((name, idx) => ({
                id: `EV-${idx + 1}`,
                name,
                filename: name,
                type: "Attachment",
                addedAt: new Date().toISOString().slice(0, 10),
                notes: evidenceNotes[idx] || "",
              }))
            : []),

          // supervisor referral
          supervisorReferral: {
            enabled: Boolean(form.get("supervisorReferralEnabled")),
            supervisorName: form.get("supervisorName")?.toString().trim() || "",
            supervisorId: form.get("supervisorId")?.toString().trim() || "",
            referralReason: form.get("supervisorReferralReason")?.toString().trim() || "",
          },

          status: mode === "Intake" ? "Intake" : "Submitted",
          intakeStage: mode === "Intake" ? "Intake" : "Submitted",

          // screening placeholders
          screening: {
            duplicateDetected: false,
            duplicateScore: null,
            duplicateOfComplaintId: "",
            possibleDuplicates: [],
            historyFound: false,
            reasons: [],
          },
          mandatoryIAReviewAlert: false,
          mandatoryIAReviewReasons: [],
        },
        ...data.complaints,
      ],
    };

    const created = next.complaints[0];
    if (mode === "Submission") {
      const screening = computeComplaintScreening(created, data.complaints);
      created.screening = {
        duplicateDetected: screening.duplicateDetected,
        duplicateScore: screening.duplicateScore,
        duplicateOfComplaintId: screening.duplicateOfComplaintId,
        possibleDuplicates: screening.possibleDuplicates,
        historyFound: screening.historyFound,
        reasons: screening.reasons,
      };
      created.mandatoryIAReviewAlert = screening.mandatoryIAReviewAlert;
      created.mandatoryIAReviewReasons = screening.mandatoryIAReviewReasons;
    }

    save(next);
    setActiveComplaintId(created.id);
    event.currentTarget.reset();
  }


function createPerson(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    const name = (form.get("name")?.toString() ?? "").trim();
    if (!name) return;

    const next = {
      ...data,
      people: [
        {
          id: `P-${String(data.people.length + 1).padStart(3, "0")}`,
          name,
          // Employee profile fields
          rank: (form.get("rank")?.toString() ?? "").trim() || "",
          badgeNumber: (form.get("badgeNumber")?.toString() ?? "").trim() || "",
          assignment: (form.get("assignment")?.toString() ?? "").trim() || "",
          division: (form.get("division")?.toString() ?? "").trim() || "",
          supervisorName: (form.get("supervisorName")?.toString() ?? "").trim() || "",
          // Legacy fields
          role: (form.get("role")?.toString() ?? "").trim() || "Unspecified",
          contact: (form.get("contact")?.toString() ?? "").trim() || "",
          notes: (form.get("notes")?.toString() ?? "").trim() || "",
          caseId: (form.get("caseId")?.toString() ?? "").trim() || (activeCase?.id ?? ""),

          // Personnel history containers (derived for now)
          personnelHistory: {
            previousComplaints: [],
            previousInvestigations: [],
            sustainedFindings: [],
            disciplinaryHistory: [],
            commendations: [],
            trainingRecords: [],
          },
        },
        ...data.people,
      ],
    };

    save(next);
    event.currentTarget.reset();
  }

  function editPerson(personId, updates) {
    const next = {
      ...data,
      people: data.people.map((p) =>
        p.id !== personId ? p : { ...p, ...updates }
      ),
    };
    save(next);
  }

  function createFinding(event) {
    event.preventDefault();
    if (!activeCase) return;
    const form = new FormData(event.currentTarget);
    const finding = form.get("finding").toString().trim();
    if (!finding) return;

    const next = {
      ...data,
      findings: [
        {
          id: nextFindingNumber(data.findings),
          caseId: activeCase.id,
          finding,
          description: form.get("description")?.toString().trim() || "",
          officerInvolved: form.get("officerInvolved")?.toString().trim() || "",
          iaRecommendation: form.get("iaRecommendation")?.toString().trim() || "",
          iaRecommendationTemplate: form.get("iaRecommendationTemplate")?.toString() || "",
          disciplineRecommendation: form.get("disciplineRecommendation")?.toString().trim() || "",
          disciplineTemplate: form.get("disciplineTemplate")?.toString() || "None",
          severityLevel: form.get("severityLevel")?.toString() || "None",
          correctiveActionRecommendation: form.get("correctiveActionRecommendation")?.toString().trim() || "",
          commandReview: form.get("commandReview")?.toString().trim() || "",
          commandReviewStatus: form.get("commandReviewStatus")?.toString() || "Pending",
          finalDisposition: form.get("finalDisposition")?.toString().trim() || "",
          appealStatus: form.get("appealStatus")?.toString() || "None",
          dateCreated: new Date().toISOString().slice(0, 10),
          adjudicatedBy: form.get("adjudicatedBy")?.toString().trim() || "",
        },
        ...data.findings,
      ],
    };
    save(next);
    event.currentTarget.reset();
  }

  function editFinding(findingId, updates) {
    const next = {
      ...data,
      findings: data.findings.map((f) =>
        f.id !== findingId ? f : { ...f, ...updates }
      ),
    };
    save(next);
  }

  function updateOfficerRiskScore(officerId, riskScore, reason) {
    const next = {
      ...data,
      people: data.people.map((p) =>
        p.id !== officerId ? p : {
          ...p,
          riskScoreOverride: riskScore,
          riskScoreOverrideDate: new Date().toISOString().slice(0, 10),
          riskScoreOverrideReason: reason,
        }
      ),
    };
    save(next);
  }

  function updateTrainingDeficiencies(officerId, notes) {
    const next = {
      ...data,
      people: data.people.map((p) =>
        p.id !== officerId ? p : { ...p, trainingDeficiencies: notes }
      ),
    };
    save(next);
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
      const queryMatch = [
        item.title,
        item.id,
        item.summary,
        item.classification,
        item.investigationType,
        item.assignedInvestigator,
        item.supervisingInvestigator,
        item.incidentId,
        ...item.tags,
      ]
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
      findings: data.findings.filter((item) => item.caseId === activeCase.id),
    };
  }, [activeCase, data]);

  const complaintRecords = useMemo(() => {
    return {
      all: data.complaints ?? [],
      linkedToActiveCase: data.complaints.filter((c) => c.linkedCaseIds?.includes(activeCase?.id)) ?? [],
    };
  }, [data.complaints, activeCase]);

  function deriveEarlyInterventionFlagsForEmployees() {
    const employees = data.people ?? [];
    const complaints = data.complaints ?? [];

    const employeeById = Object.fromEntries(employees.map((e) => [e.id, e]));

    const complaintsByEmployeeId = {};
    for (const emp of employees) complaintsByEmployeeId[emp.id] = [];

    for (const c of complaints) {
      const empIds = c?.involvedPersonIds ?? [];
      for (const empId of empIds) {
        if (!employeeById[empId]) continue;
        if (!complaintsByEmployeeId[empId]) complaintsByEmployeeId[empId] = [];
        complaintsByEmployeeId[empId].push(c);
      }
    }

    function parseComplaintDate(c) {
      // prefer incident dateTime, fall back to legacy date
      const dt = c?.incident?.dateTime || c?.date;
      if (!dt) return null;
      const t = new Date(dt).getTime();
      return Number.isFinite(t) ? t : null;
    }

    function normalizeText(s) {
      return String(s || "")
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    }

    function matchCategoryOrNarrative(c, keywords) {
      const hay = normalizeText([c?.category, c?.complaintCategory, c?.narrative, c?.description].filter(Boolean).join(" "));
      return keywords.some((k) => hay.includes(normalizeText(k)));
    }

    const rules = {
      multipleComplaints30Days: { windowDays: 30, threshold: 3 },
      excessiveForce: { threshold: 2, keywords: ["excessive force", "use of force", "force", "physical force"] },
      reportViolations: { threshold: 2, keywords: ["report violation", "report", "missing report", "false report", "no report"] },
      pursuitViolations: { threshold: 2, keywords: ["pursuit", "pursuit violation", "vehicle pursuit", "unsafe pursuit"] },
      repeatedCitizenComplaints: { threshold: 2 },
    };

    const result = {};

    for (const emp of employees) {
      const empComplaints = (complaintsByEmployeeId[emp.id] ?? []).slice();

      const flags = [];
      const complaintDates = empComplaints
        .map((c) => ({ c, t: parseComplaintDate(c) }))
        .filter((x) => x.t != null)
        .sort((a, b) => a.t - b.t);

      // Multiple complaints in 30 days
      // Count max number of complaints in any rolling window
      let maxInWindow = 0;
      let bestWindow = null;
      for (let i = 0; i < complaintDates.length; i++) {
        const start = complaintDates[i].t;
        let j = i;
        while (j < complaintDates.length && complaintDates[j].t - start <= rules.multipleComplaints30Days.windowDays * 86400000) {
          j++;
        }
        const count = j - i;
        if (count > maxInWindow) {
          maxInWindow = count;
          bestWindow = { start: start, end: complaintDates[j - 1]?.t };
        }
      }
      if (maxInWindow >= rules.multipleComplaints30Days.threshold && bestWindow) {
        const windowStart = new Date(bestWindow.start).toISOString().slice(0, 10);
        const windowEnd = new Date(bestWindow.end).toISOString().slice(0, 10);
        flags.push({
          type: "Multiple complaints (30 days)",
          severity: "critical",
          count: maxInWindow,
          windowStart,
          windowEnd,
        });
      }

      // Excessive force
      const forceCount = empComplaints.filter((c) => matchCategoryOrNarrative(c, rules.excessiveForce.keywords)).length;
      if (forceCount >= rules.excessiveForce.threshold) {
        flags.push({
          type: "Excessive force trend",
          severity: forceCount >= rules.excessiveForce.threshold + 1 ? "critical" : "reviewing",
          count: forceCount,
        });
      }

      // Report violations
      const reportViolationCount = empComplaints.filter((c) => matchCategoryOrNarrative(c, rules.reportViolations.keywords)).length;
      if (reportViolationCount >= rules.reportViolations.threshold) {
        flags.push({
          type: "Repeated report violations",
          severity: reportViolationCount >= rules.reportViolations.threshold + 1 ? "critical" : "reviewing",
          count: reportViolationCount,
        });
      }

      // Pursuit violations
      const pursuitViolationCount = empComplaints.filter((c) => matchCategoryOrNarrative(c, rules.pursuitViolations.keywords)).length;
      if (pursuitViolationCount >= rules.pursuitViolations.threshold) {
        flags.push({
          type: "Repeated pursuit violations",
          severity: pursuitViolationCount >= rules.pursuitViolations.threshold + 1 ? "critical" : "reviewing",
          count: pursuitViolationCount,
        });
      }

      // Repeated citizen complaints
      const citizenCount = empComplaints.filter((c) => c?.complaintType === "Citizen").length;
      if (citizenCount >= rules.repeatedCitizenComplaints.threshold) {
        flags.push({
          type: "Repeated citizen complaints",
          severity: citizenCount >= rules.repeatedCitizenComplaints.threshold + 1 ? "critical" : "reviewing",
          count: citizenCount,
        });
      }

      result[emp.id] = {
        employeeId: emp.id,
        flags: flags.sort((a, b) => (a.severity === "critical" ? -1 : 1) - (b.severity === "critical" ? -1 : 1)),
        summary:
          flags.length === 0
            ? ""
            : `Early intervention flags triggered: ${flags.map((f) => f.type).join(", ")}`,
      };
    }

  return result;
  }

  const earlyInterventionByEmployeeId = useMemo(
    () => deriveEarlyInterventionFlagsForEmployees(),
    [data]
  );

  const officerProfiles = useMemo(() => {
    const profiles = {};
    const investigationStatuses = ["Active Investigation", "Evidence Collection", "Interview Phase"];

    for (const officer of data.people) {
      const complaints = data.complaints.filter((c) => (c.involvedPersonIds ?? []).includes(officer.id)) ?? [];
      const findings = data.findings.filter((f) => f.officerInvolved === officer.id) ?? [];
      const cases = data.cases.filter((c) => (c.involvedPersonIds ?? []).includes(officer.id)) ?? [];

      const sustainedFindings = findings.filter((f) => f.finding === "Sustained");
      const complaintsIn30Days = complaints.filter((c) => {
        const complaintDate = new Date(c.date || c.incident?.dateTime || "");
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return complaintDate >= thirtyDaysAgo;
      });

      const currentInvestigations = cases.filter((c) => investigationStatuses.includes(c.status));
      const priorDiscipline = sustainedFindings.filter((f) => f.disciplineTemplate !== "None").length;

      const flagPoints = (earlyInterventionByEmployeeId[officer.id]?.flags ?? []).reduce((sum, flag) => {
        return sum + (flag.severity === "critical" ? 15 : 7.5);
      }, 0);

      const baseRiskScore = (sustainedFindings.length * 25) + (complaintsIn30Days.length * 10) + flagPoints;
      const autoRiskScore = Math.min(100, Math.round(baseRiskScore));
      const finalRiskScore = officer.riskScoreOverride !== null ? officer.riskScoreOverride : autoRiskScore;

      profiles[officer.id] = {
        officer,
        totalComplaints: complaints.length,
        sustainedComplaints: sustainedFindings.length,
        currentInvestigations: currentInvestigations.length,
        priorDiscipline,
        commendations: officer.personnelHistory?.commendations?.length ?? 0,
        trainingDeficiencies: officer.trainingDeficiencies,
        autoRiskScore,
        riskScore: finalRiskScore,
        riskScoreOverride: officer.riskScoreOverride,
        riskScoreOverrideDate: officer.riskScoreOverrideDate,
        riskScoreOverrideReason: officer.riskScoreOverrideReason,
        earlyInterventionFlags: earlyInterventionByEmployeeId[officer.id]?.flags ?? [],
        complaints,
        sustainedFindings,
        cases: currentInvestigations,
      };
    }

    return profiles;
  }, [data, earlyInterventionByEmployeeId]);

  const metrics = [
    { label: "Active cases", value: data.cases.filter((item) => !["Closed", "Archived"].includes(item.status)).length, icon: FileSearch },
    { label: "Evidence items", value: data.evidence.length, icon: Fingerprint },
    { label: "Timeline events", value: data.events.length, icon: CalendarDays },
    { label: "Open tasks", value: data.tasks.filter((item) => item.status !== "Done").length, icon: ClipboardList },
  ];

  const caseTitle = (caseId) => data.cases.find((item) => item.id === caseId)?.title ?? "Unassigned";

  const visibleRecords = useMemo(() => {
    const lower = query.toLowerCase();
    const matches = (values) => values.join(" ").toLowerCase().includes(lower);
    return {
      evidence: data.evidence.filter((item) =>
        matches([item.id, item.title, item.type, item.source, item.description, item.confidence, caseTitle(item.caseId)]),
      ),
      people: data.people.filter((item) => matches([item.id, item.name, item.role, item.contact, item.notes, caseTitle(item.caseId)])),
      complaints: (data.complaints ?? []).filter((item) => matches([item.id, item.title, item.date, item.source, item.description])),
      events: data.events.filter((item) => matches([item.id, item.title, item.date, item.time, item.location, item.confidence, caseTitle(item.caseId)])),
      tasks: data.tasks.filter((item) => matches([item.id, item.title, item.status, item.priority, item.due, caseTitle(item.caseId)])),
      notes: data.notes.filter((item) => matches([item.id, item.title, item.body, item.tag, item.created, caseTitle(item.caseId)])),
    };
  }, [data, query]);

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
          {navItems.map((item) => (
            <button key={item} className={item === activeView ? "active" : ""} onClick={() => setActiveView(item)}>
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

        {activeView === "Dashboard" && (
          <>
            <MetricGrid metrics={metrics} />
            <section className="grid">
              <CaseList activeCase={activeCase} caseFilter={caseFilter} filteredCases={filteredCases} setActiveCaseId={setActiveCaseId} setCaseFilter={setCaseFilter} />
              <CaseDetail activeCase={activeCase} caseRecords={caseRecords} data={data} setData={setData} editFinding={editFinding} />
              <Forms activeCase={activeCase} addItem={addItem} createCase={createCase} quickAdd={quickAdd} setQuickAdd={setQuickAdd} />
            </section>
          </>
        )}

        {activeView === "Cases" && (
          <section className="single-grid">
            <CaseList activeCase={activeCase} caseFilter={caseFilter} filteredCases={filteredCases} setActiveCaseId={setActiveCaseId} setCaseFilter={setCaseFilter} />
            <CaseDetail activeCase={activeCase} caseRecords={caseRecords} data={data} setData={setData} editFinding={editFinding} />
            <Forms activeCase={activeCase} addItem={addItem} createCase={createCase} quickAdd={quickAdd} setQuickAdd={setQuickAdd} />
          </section>
        )}

        {activeView === "Evidence" && <CollectionView title="Evidence" icon={Fingerprint} items={visibleRecords.evidence} render={EvidenceItem} />}
        {activeView === "People" && <PeopleView data={data} visiblePeople={visibleRecords.people} createPerson={createPerson} editPerson={editPerson} earlyInterventionByEmployeeId={earlyInterventionByEmployeeId} />}
        {activeView === "Officer Profile" && <OfficerProfileView data={data} officerProfiles={officerProfiles} selectedOfficerId={selectedOfficerId} setSelectedOfficerId={setSelectedOfficerId} updateOfficerRiskScore={updateOfficerRiskScore} updateTrainingDeficiencies={updateTrainingDeficiencies} />}
        {activeView === "Complaints" && <ComplaintsView data={data} activeCase={activeCase} visibleComplaints={visibleRecords.complaints} createComplaint={submitComplaint} setActiveComplaintId={setActiveComplaintId} />}
        {activeView === "Adjudication" && <AdjudicationTab data={data} activeCase={activeCase} editFinding={editFinding} />}

        {activeView === "Timeline" && <CollectionView title="Timeline" icon={CalendarDays} items={visibleRecords.events} render={EventItem} />}
        {activeView === "Tasks" && <CollectionView title="Tasks" icon={ClipboardList} items={visibleRecords.tasks} render={TaskItem} />}
        {activeView === "Notes" && <CollectionView title="Notes" icon={FileSearch} items={visibleRecords.notes} render={NoteItem} />}
        {activeView === "Reports" && <Reports data={data} metrics={metrics} earlyInterventionByEmployeeId={earlyInterventionByEmployeeId} />}
        {activeView === "Settings" && <SettingsView themeIndex={themeIndex} setThemeIndex={setThemeIndex} />}

      </section>
    </main>
  );
}

function MetricGrid({ metrics }) {
  return (
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
  );
}

function CaseList({ activeCase, caseFilter, filteredCases, setActiveCaseId, setCaseFilter }) {
  return (
    <section className="panel case-list">
      <div className="panel-head">
        <h2>Cases</h2>
        <select value={caseFilter} onChange={(event) => setCaseFilter(event.target.value)}>
          <option>All</option>
          {caseStatuses.map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>
      </div>
      <div className="stack">
        {filteredCases.length ? (
          filteredCases.map((item) => (
            <button className={`case-card ${activeCase?.id === item.id ? "selected" : ""}`} key={item.id} onClick={() => setActiveCaseId(item.id)}>
              <span className="case-id">{item.id}</span>
              <strong>{item.title}</strong>
              <small>{item.summary}</small>
              <span className="meta-row">
                <Pill value={item.status} />
                <Pill value={item.priority} />
                <Pill value={item.classification} />
                <span>Opened {item.opened}</span>
              </span>
            </button>
          ))
        ) : (
          <p className="empty-small">No cases match this view.</p>
        )}
      </div>
    </section>
  );
}

function CaseLinking({ activeCase, data, save, setData }) {
  const [relatedCaseText, setRelatedCaseText] = useState("");
  const [priorComplaintText, setPriorComplaintText] = useState("");
  const [involvedPersonText, setInvolvedPersonText] = useState("");

  const relatedCases = (activeCase.relatedCaseIds ?? []).map((id) => data.cases.find((c) => c.id === id)).filter(Boolean);
  const priorComplaints = (activeCase.priorComplaintIds ?? []).map((id) => data.complaints?.find((c) => c.id === id)).filter(Boolean);
  const involvedPeople = (activeCase.involvedPersonIds ?? []).map((id) => data.people.find((p) => p.id === id)).filter(Boolean);

  const incidentId = activeCase.incidentId || "";
  const sameIncidentCases = incidentId
    ? data.cases.filter((c) => c.incidentId === incidentId && c.id !== activeCase.id)
    : [];

  function toggleListField(list, addIds) {
    const set = new Set(list ?? []);
    for (const id of addIds) {
      if (id && id !== activeCase.id) set.add(id);
    }
    return Array.from(set);
  }

  function parseCsv(text) {
    return text
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
  }

  function updateRelatedCases(newIds) {
    save({
      ...data,
      cases: data.cases.map((c) =>
        c.id !== activeCase.id
          ? c
          : {
              ...c,
              relatedCaseIds: Array.from(new Set(newIds.filter((id) => id !== activeCase.id))),
            }
      ),
    });
  }

  function updatePriorComplaints(newIds) {
    save({
      ...data,
      cases: data.cases.map((c) =>
        c.id !== activeCase.id
          ? c
          : {
              ...c,
              priorComplaintIds: Array.from(new Set(newIds)),
            }
      ),
    });
  }

  function updateInvolvedPeople(newIds) {
    save({
      ...data,
      cases: data.cases.map((c) =>
        c.id !== activeCase.id
          ? c
          : {
              ...c,
              involvedPersonIds: Array.from(new Set(newIds)),
            }
      ),
    });
  }

  function removeIdFromField(fieldName, id) {
    const current = activeCase[fieldName] ?? [];
    const nextIds = current.filter((x) => x !== id);
    if (fieldName === "relatedCaseIds") return updateRelatedCases(nextIds);
    if (fieldName === "priorComplaintIds") return updatePriorComplaints(nextIds);
    if (fieldName === "involvedPersonIds") return updateInvolvedPeople(nextIds);
  }

  return (
    <section className="panel forms" style={{ padding: 16 }}>
      <div className="panel-head compact" style={{ marginTop: 0 }}>
        <h2>Linking</h2>
      </div>

      <div className="row" style={{ marginTop: 12 }}>
        <input
          placeholder="Incident ID (used to link same-incident investigations)"
          value={incidentId}
          onChange={(e) => {
            const nextIncident = e.target.value;
            save({
              ...data,
              cases: data.cases.map((c) => (c.id !== activeCase.id ? c : { ...c, incidentId: nextIncident })),
            });
          }}
        />
      </div>

      <div style={{ marginTop: 14, display: "grid", gap: 12 }}>
        <LinkSection
          title="Related cases"
          icon={Link2}
          items={relatedCases}
          itemLabel={(c) => `${c.id} · ${c.title}`}
          text={relatedCaseText}
          setText={setRelatedCaseText}
          candidates={data.cases.filter((c) => c.id !== activeCase.id)}
          candidateValue={(c) => c.id}
          candidateLabel={(c) => c.id}
          onAdd={() => updateRelatedCases(toggleListField(activeCase.relatedCaseIds, parseCsv(relatedCaseText)).filter(Boolean))}
          onRemove={(id) => removeIdFromField("relatedCaseIds", id)}
        />

        <LinkSection
          title="Prior complaints"
          icon={FileSearch}
          items={priorComplaints}
          itemLabel={(c) => `${c.id} · ${c.title}`}
          text={priorComplaintText}
          setText={setPriorComplaintText}
          candidates={(data.complaints ?? []).slice()}
          candidateValue={(c) => c.id}
          candidateLabel={(c) => c.id}
          onAdd={() => updatePriorComplaints(toggleListField(activeCase.priorComplaintIds, parseCsv(priorComplaintText)).filter(Boolean))}
          onRemove={(id) => removeIdFromField("priorComplaintIds", id)}
        />

        <LinkSection
          title="Involved personnel"
          icon={UserRound}
          items={involvedPeople}
          itemLabel={(p) => `${p.name} · ${p.rank || "Officer"} #${p.badgeNumber || "—"}`}
          text={involvedPersonText}
          setText={setInvolvedPersonText}
          candidates={data.people}
          candidateValue={(p) => p.badgeNumber || p.name}
          candidateLabel={(p) => `${p.name} · ${p.rank || "Officer"} (Badge #${p.badgeNumber || "—"})`}
          onAdd={() => {
            const lookupIds = parseCsv(involvedPersonText).map((input) => {
              const person = data.people.find((p) => p.badgeNumber === input || p.name.toLowerCase() === input.toLowerCase());
              return person?.id || input;
            });
            updateInvolvedPeople(toggleListField(activeCase.involvedPersonIds, lookupIds).filter(Boolean));
          }}
          onRemove={(id) => removeIdFromField("involvedPersonIds", id)}
        />

        <div className="link-section">
          <div className="record-title" style={{ marginBottom: 8 }}>
            <Link2 size={18} />
            <h3>Investigations for same incident</h3>
            <span>{sameIncidentCases.length}</span>
          </div>
          {incidentId ? (
            sameIncidentCases.length ? (
              <div className="collection-list" style={{ padding: 0, border: 0, background: "transparent" }}>
                {sameIncidentCases.map((c) => (
                  <div key={c.id} className="record" style={{ borderTop: 0, paddingTop: 0 }}>
                    <strong>{c.id}</strong>
                    <small>{c.title}</small>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-small">No other cases share this incident ID.</p>
            )
          ) : (
            <p className="empty-small">Set an Incident ID to auto-link other investigations.</p>
          )}
        </div>
      </div>
    </section>
  );
}

function LinkSection({
  title,
  icon: Icon,
  items,
  itemLabel,
  text,
  setText,
  candidates,
  candidateValue,
  candidateLabel,
  onAdd,
  onRemove,
}) {
  return (
    <div className="link-section">
      <div className="record-title" style={{ marginBottom: 8 }}>
        <Icon size={18} />
        <h3>{title}</h3>
        <span>{items.length}</span>
      </div>

      <div className="row">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`Search by badge # or name (comma-separated). Example: ${candidates.slice(0, 2).map((c) => c.badgeNumber || c.name).join(", ") || "201, 202"}`}
        />
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        <button
          className="primary"
          type="button"
          onClick={() => {
            onAdd();
            setText("");
          }}
        >
          <Plus size={17} /> Add link
        </button>
        <div className="empty-small" style={{ alignSelf: "center" }}>
          Current: {items.map((x) => x.name || x.title || x.id).join(", ") || "None"}
        </div>
      </div>

      {items.length ? (
        <div className="tags" style={{ margin: "10px 0 0" }}>
          {items.map((x) => (
            <span key={x.id}>
              {x.name || x.title || x.id}
              <button
                type="button"
                onClick={() => onRemove(x.id)}
                style={{ marginLeft: 8, border: 0, background: "transparent", color: "#2f7f67", cursor: "pointer", fontWeight: 900 }}
                aria-label={`Remove ${x.name || x.title || x.id}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      ) : (
        <p className="empty-small" style={{ marginTop: 8 }}>
          No linked items yet.
        </p>
      )}
    </div>
  );
}

function CaseDetail({ activeCase, caseRecords, data, setData, editFinding }) {
  return (
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
              <Pill value={activeCase.classification} />
              <Pill value={activeCase.investigationType} />
            </div>
          </div>

          <div className="case-fields">
            <InfoField label="Date opened" value={activeCase.opened} />
            <InfoField label="Date closed" value={activeCase.closed || "Not closed"} />
            <InfoField label="Assigned investigator" value={activeCase.assignedInvestigator} />
            <InfoField label="Supervising investigator" value={activeCase.supervisingInvestigator} />
          </div>

          <StatusTracker currentStatus={activeCase.status} />

          <div className="tags">
            {activeCase.tags.map((item) => (
              <span key={item}>
                <Tag size={14} />
                {item}
              </span>
            ))}
          </div>

          <CaseLinking
            activeCase={activeCase}
            data={data}
            setData={setData}
            save={(next) => {
              setData(next);
              localStorage.setItem(storeKey, JSON.stringify(next));
            }}
          />

          <div className="record-grid">
            <RecordPanel title="Evidence" icon={Fingerprint} items={caseRecords.evidence} render={EvidenceItem} />
            <RecordPanel title="Timeline" icon={Clock} items={caseRecords.events} render={EventItem} />
            <RecordPanel title="People & Entities" icon={UserRound} items={caseRecords.people} render={PersonItem} />
            <RecordPanel title="Tasks" icon={CheckCircle2} items={caseRecords.tasks} render={TaskItem} />
            <RecordPanel title="Notes" icon={FileSearch} items={caseRecords.notes} render={NoteItem} wide />
            <RecordPanel title="Findings & Adjudication" icon={CheckCircle2} items={caseRecords.findings} render={FindingItem} wide />
          </div>

          <AdjudicationPanel caseId={activeCase.id} findings={caseRecords.findings} editFinding={editFinding} people={data.people} />
        </>
      ) : (
        <div className="empty">Create a case to begin logging records.</div>
      )}
    </section>
  );
}

function Forms({ activeCase, addItem, createCase, quickAdd, setQuickAdd }) {
  return (
    <section className="panel forms">
      <div className="panel-head">
        <h2>New Case</h2>
        <Plus size={18} />
      </div>
      <form onSubmit={createCase}>
        <input name="title" placeholder="Case title" />
        <div className="row">
          <select name="status" defaultValue="Intake">
            {caseStatuses.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
          <select name="priority" defaultValue="Medium">
            <option>Critical</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>
        <input name="classification" placeholder="Case classification" />
        <input name="investigationType" placeholder="Investigation type" />
        <div className="row">
          <input name="opened" type="date" />
          <input name="closed" type="date" />
        </div>
        <input name="assignedInvestigator" placeholder="Assigned investigator" />
        <input name="supervisingInvestigator" placeholder="Supervising investigator" />
        <input name="incidentId" placeholder="Incident ID (for same-incident linking)" />
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
        {!activeCase && <p className="empty-small">Create or select a case before adding records.</p>}
        <input name="title" placeholder={`${quickAdd} title`} disabled={!activeCase} />
        <div className="row">
          <input name="type" placeholder="Type/tag" disabled={!activeCase} />
          <select name="confidence" defaultValue="Medium" disabled={!activeCase}>
            <option>Confirmed</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
            <option>Needs review</option>
          </select>
        </div>
        <div className="row">
          <input name="source" placeholder="Source/location" disabled={!activeCase} />
          <input name="date" type="date" disabled={!activeCase} />
        </div>
        <input name="time" type="time" disabled={!activeCase} />
        <textarea name="details" placeholder="Description, observation, or chain-of-custody note" disabled={!activeCase} />
        <button className="primary" type="submit" disabled={!activeCase}>
          <Database size={17} />
          Add to active case
        </button>
      </form>
    </section>
  );
}

function InfoField({ label, value }) {
  return (
    <div className="info-field">
      <span>{label}</span>
      <strong>{value || "Not set"}</strong>
    </div>
  );
}

function StatusTracker({ currentStatus }) {
  const currentIndex = caseStatuses.indexOf(currentStatus);
  return (
    <div className="status-tracker" aria-label="Status tracking">
      {caseStatuses.map((status, index) => (
        <div className={`status-step ${index <= currentIndex ? "complete" : ""} ${status === currentStatus ? "current" : ""}`} key={status}>
          <span>{index + 1}</span>
          <strong>{status}</strong>
        </div>
      ))}
    </div>
  );
}

function CollectionView({ title, icon: Icon, items, render }) {
  return (
    <section className="collection-view">
      <div className="collection-head">
        <Icon size={22} />
        <h2>{title}</h2>
        <span>{items.length} total</span>
      </div>
      <div className="collection-list">
        {items.length ? items.map((item) => <React.Fragment key={item.id}>{render(item)}</React.Fragment>) : <p className="empty">No records found.</p>}
      </div>
    </section>
  );
}

function Reports({ data, metrics, earlyInterventionByEmployeeId }) {
  const allEntries = Object.entries(earlyInterventionByEmployeeId || {});
  const flagged = allEntries.filter(([, v]) => (v?.flags?.length ?? 0) > 0);
  const countByType = flagged.reduce((acc, [, v]) => {
    for (const f of v.flags) acc[f.type] = (acc[f.type] || 0) + 1;
    return acc;
  }, {});
  const topFlagRows = Object.entries(countByType)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([type, employeesCount]) => ({ id: type, title: type, body: `${employeesCount} employee${employeesCount === 1 ? "" : "s"}` }));

  return (
    <section className="reports-view">
      <MetricGrid metrics={metrics} />
      <div className="report-grid">
        <RecordPanel title="Case Status" icon={ShieldCheck} items={statusRows(data.cases)} render={ReportItem} />
        <RecordPanel title="Evidence Types" icon={Fingerprint} items={countRows(data.evidence, "type")} render={ReportItem} />
        <RecordPanel title="Early Intervention Flags" icon={AlertCircle} items={topFlagRows.length ? topFlagRows : [{ id: "none", title: "No flags", body: "Early intervention flags will appear once employees are linked to complaints." }]} render={ReportItem} />
      </div>
    </section>
  );
}

function countRows(items, key) {
  const counts = items.reduce((acc, item) => ({ ...acc, [item[key] || "Unspecified"]: (acc[item[key] || "Unspecified"] || 0) + 1 }), {});
  return Object.entries(counts).map(([label, count]) => ({ id: label, title: label, body: `${count} record${count === 1 ? "" : "s"}` }));
}

function statusRows(cases) {
  return countRows(cases, "status");
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

function FindingItem(item) {
  return (
    <div className="record">
      <strong>{item.finding}</strong>
      <span>
        <CheckCircle2 size={14} /> {item.id}
      </span>
      <small>{item.description}</small>
      <span style={{ display: "flex", gap: 8 }}>
        <span className={`pill ${item.commandReviewStatus === "Approved" ? "confirmed" : item.commandReviewStatus === "Rejected" ? "high" : "pending"}`}>
          Command: {item.commandReviewStatus}
        </span>
        <span className={`pill ${item.appealStatus === "None" ? "confirmed" : item.appealStatus === "Approved" ? "confirmed" : "high"}`}>
          Appeal: {item.appealStatus}
        </span>
      </span>
    </div>
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
        <Network size={14} /> {item.rank ? `${item.rank} · ${item.badgeNumber ? `#${item.badgeNumber}` : ""}`.trim() : item.role}
      </span>
      <small>
        {[item.assignment, item.division, item.supervisorName].filter(Boolean).join(" · ") || item.notes}
      </small>
    </div>
  );
}

function PersonEditPanel({ person, editPerson }) {
  if (!person) return null;
  return (
    <div className="panel" style={{ padding: 16, marginTop: 16 }}>
      <div className="panel-head compact" style={{ marginTop: 0 }}>
        <h2>Edit {person.name}</h2>
      </div>
      <div className="row" style={{ marginTop: 10 }}>
        <select
          value={person.rank || ""}
          onChange={(e) => editPerson(person.id, { rank: e.target.value })}
        >
          <option value="">Select rank...</option>
          {rankOrder.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        <input
          value={person.badgeNumber || ""}
          onChange={(e) => editPerson(person.id, { badgeNumber: e.target.value })}
          placeholder="Badge number"
        />
      </div>
      <div className="row" style={{ marginTop: 10 }}>
        <input
          value={person.assignment || ""}
          onChange={(e) => editPerson(person.id, { assignment: e.target.value })}
          placeholder="Assignment"
        />
        <input
          value={person.division || ""}
          onChange={(e) => editPerson(person.id, { division: e.target.value })}
          placeholder="Division"
        />
      </div>
      <div className="row" style={{ marginTop: 10 }}>
        <input
          value={person.supervisorName || ""}
          onChange={(e) => editPerson(person.id, { supervisorName: e.target.value })}
          placeholder="Supervisor name"
        />
      </div>
    </div>
  );
}

function PeopleView({ data, visiblePeople, createPerson, editPerson, earlyInterventionByEmployeeId }) {
  const [selectedPersonId, setSelectedPersonId] = useState(null);
  const sortedPeople = visiblePeople.slice().sort((a, b) => getRankIndex(a.rank) - getRankIndex(b.rank));
  const selectedPerson = data.people.find((p) => p.id === selectedPersonId);
  return (
    <section className="collection-view">
      <div className="collection-head">
        <UserRound size={22} />
        <h2>Employees & Personnel</h2>
        <span>{visiblePeople.length} total</span>
      </div>

      <div className="record-grid" style={{ gridTemplateColumns: "1fr" }}>
        <div className="panel" style={{ padding: 16 }}>
          <h3 style={{ margin: "0 0 10px" }}>Add Employee</h3>
          <form onSubmit={createPerson}>
            <div className="row" style={{ marginTop: 0 }}>
              <input name="name" placeholder="Name" />
              <input name="rank" placeholder="Rank" />
            </div>
            <div className="row" style={{ marginTop: 10 }}>
              <input name="badgeNumber" placeholder="Badge number" />
              <input name="assignment" placeholder="Assignment" />
            </div>
            <div className="row" style={{ marginTop: 10 }}>
              <input name="division" placeholder="Division" />
              <input name="supervisorName" placeholder="Supervisor name" />
            </div>
            <div className="row" style={{ marginTop: 10 }}>
              <input name="contact" placeholder="Contact" />
              <input name="role" placeholder="Legacy role (optional)" />
            </div>
            <textarea name="notes" placeholder="Notes" />
            <button className="primary" type="submit" style={{ marginTop: 10 }}>
              <Plus size={17} /> Create employee
            </button>
          </form>
        </div>

        <div className="collection-list" style={{ marginTop: 12 }}>
          {sortedPeople.length ? (
            sortedPeople.map((item) => (
              <React.Fragment key={item.id}>
                <button
                  onClick={() => setSelectedPersonId(item.id)}
                  style={{
                    all: "unset",
                    display: "block",
                    width: "100%",
                    paddingBottom: 12,
                    borderBottom: "1px solid #edf1ef",
                    marginBottom: 12,
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <PersonItem {...item} />
                  {earlyInterventionByEmployeeId?.[item.id]?.flags?.length ? (
                    <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
                      {earlyInterventionByEmployeeId[item.id].flags.map((f, idx) => (
                        <div key={idx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                          <span className={`pill ${f.severity === "critical" ? "critical" : "needs-review"}`} style={{ fontWeight: 900 }}>
                            {f.type}
                          </span>
                          <small style={{ color: "#5a6b66" }}>
                            {f.count} occurrence{f.count === 1 ? "" : "s"}
                            {f.windowStart && f.windowEnd ? ` · ${f.windowStart} → ${f.windowEnd}` : ""}
                          </small>
                        </div>
                      ))}
                      {earlyInterventionByEmployeeId[item.id].summary ? (
                        <small style={{ color: "#4e605b" }}>
                          {earlyInterventionByEmployeeId[item.id].summary}
                        </small>
                      ) : null}
                    </div>
                  ) : (
                    <small style={{ color: "#687872" }}>No early intervention flags</small>
                  )}
                </button>
              </React.Fragment>
            ))
          ) : (
            <p className="empty">No employees found.</p>
          )}
        </div>

        <PersonEditPanel person={selectedPerson} editPerson={editPerson} />
      </div>
    </section>
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

function ReportItem(item) {
  return (
    <div className="record">
      <strong>{item.title}</strong>
      <small>{item.body}</small>
    </div>
  );
}

function AdjudicationPanel({ caseId, findings, editFinding, people }) {
  const [selectedFindingId, setSelectedFindingId] = useState(null);
  const caseFinding = findings.find((f) => f.id === selectedFindingId);

  if (!findings.length) return null;

  return (
    <section className="panel forms" style={{ padding: 16 }}>
      <div className="panel-head compact" style={{ marginTop: 0 }}>
        <h2>Findings & Adjudication</h2>
      </div>

      <div className="stack" style={{ maxHeight: 300, overflow: "auto", marginBottom: 12 }}>
        {findings.map((f) => (
          <button
            key={f.id}
            onClick={() => setSelectedFindingId(f.id)}
            style={{
              all: "unset",
              display: "block",
              padding: 10,
              border: selectedFindingId === f.id ? "2px solid #2f7f67" : "1px solid #dce4e1",
              borderRadius: 6,
              textAlign: "left",
              cursor: "pointer",
              background: selectedFindingId === f.id ? "#f0faf8" : "#fbfcfb",
            }}
          >
            <strong style={{ fontSize: 13 }}>{f.finding}</strong>
            <small style={{ display: "block", color: "#60716c" }}>{f.id}</small>
          </button>
        ))}
      </div>

      {caseFinding && (
        <div style={{ paddingTop: 12, borderTop: "1px solid #dce4e1" }}>
          <div className="row" style={{ marginTop: 10 }}>
            <select value={caseFinding.finding} onChange={(e) => editFinding(caseFinding.id, { finding: e.target.value })}>
              {findingTypes.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
            <select value={caseFinding.appealStatus} onChange={(e) => editFinding(caseFinding.id, { appealStatus: e.target.value })}>
              <option value="None">Appeal: None</option>
              <option value="Pending">Appeal: Pending</option>
              <option value="Approved">Appeal: Approved</option>
              <option value="Denied">Appeal: Denied</option>
            </select>
          </div>
          <textarea
            value={caseFinding.description}
            onChange={(e) => editFinding(caseFinding.id, { description: e.target.value })}
            placeholder="Finding description"
            style={{ marginTop: 10, minHeight: 60 }}
          />
        </div>
      )}
    </section>
  );
}

function AdjudicationTab({ data, activeCase, editFinding }) {
  const allFindings = data.findings || [];
  const caseFindingIds = new Set(allFindings.filter((f) => f.caseId === activeCase?.id).map((f) => f.id));

  return (
    <section className="collection-view">
      <div className="collection-head">
        <h2>Findings & Adjudication</h2>
        <span>{allFindings.length} total</span>
      </div>

      <div className="collection-list">
        {allFindings.length ? (
          allFindings.map((finding) => (
            <div
              key={finding.id}
              style={{
                padding: 12,
                borderBottom: "1px solid #edf1ef",
                background: caseFindingIds.has(finding.id) ? "#f0faf8" : "transparent",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 12 }}>
                <div>
                  <strong style={{ fontSize: 14 }}>{finding.finding}</strong>
                  <small style={{ display: "block", color: "#60716c", marginTop: 2 }}>{finding.id} · {finding.caseId}</small>
                  <small style={{ display: "block", color: "#60716c", marginTop: 4 }}>{finding.description}</small>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <span className={`pill ${finding.commandReviewStatus === "Approved" ? "confirmed" : finding.commandReviewStatus === "Rejected" ? "high" : "pending"}`}>
                    {finding.commandReviewStatus}
                  </span>
                  <span className={`pill ${finding.appealStatus === "None" ? "confirmed" : finding.appealStatus === "Approved" ? "confirmed" : "high"}`}>
                    {finding.appealStatus}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="empty">No findings yet.</p>
        )}
      </div>
    </section>
  );
}

function OfficerProfileView({ data, officerProfiles, selectedOfficerId, setSelectedOfficerId, updateOfficerRiskScore, updateTrainingDeficiencies }) {
  const profile = selectedOfficerId ? officerProfiles[selectedOfficerId] : null;

  if (!data.people.length) {
    return <section className="collection-view"><p className="empty">No officers found.</p></section>;
  }

  const sortedOfficers = data.people.slice().sort((a, b) => a.name.localeCompare(b.name));

  return (
    <section className="collection-view">
      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 16, minHeight: "80vh" }}>
        {/* Officer Selector Sidebar */}
        <div style={{ background: "#ffffff", border: "1px solid #dce4e1", borderRadius: 8, padding: 16, overflow: "auto" }}>
          <h3 style={{ margin: "0 0 12px" }}>Officers</h3>
          <div style={{ display: "grid", gap: 8 }}>
            {sortedOfficers.map((officer) => (
              <button
                key={officer.id}
                onClick={() => setSelectedOfficerId(officer.id)}
                style={{
                  all: "unset",
                  padding: 10,
                  border: selectedOfficerId === officer.id ? "2px solid var(--theme-accent)" : "1px solid #dce4e1",
                  borderRadius: 6,
                  background: selectedOfficerId === officer.id ? "#f0faf8" : "#fbfcfb",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <strong style={{ fontSize: 13, display: "block" }}>{officer.name}</strong>
                <small style={{ color: "#60716c", display: "block" }}>{officer.rank || "Officer"}</small>
                <small style={{ color: "#60716c" }}>#{officer.badgeNumber || "—"}</small>
              </button>
            ))}
          </div>
        </div>

        {/* Officer Profile Details */}
        {profile ? (
          <div style={{ overflow: "auto" }}>
            {/* Profile Header */}
            <div style={{ background: "#ffffff", border: "1px solid #dce4e1", borderRadius: 8, padding: 20, marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 20 }}>
                <div>
                  <h2 style={{ margin: "0 0 8px", fontSize: 28 }}>{profile.officer.name}</h2>
                  <p style={{ margin: 0, color: "#5a6b66" }}>
                    {profile.officer.rank} • Badge #{profile.officer.badgeNumber || "—"}
                  </p>
                  <p style={{ margin: "8px 0 0", color: "#60716c" }}>
                    {profile.officer.assignment || "Unassigned"} · {profile.officer.division || "—"}
                  </p>
                  <p style={{ margin: "4px 0 0", color: "#60716c" }}>Supervisor: {profile.officer.supervisorName || "—"}</p>
                </div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 16 }}>
              {[
                { label: "Total Complaints", value: profile.totalComplaints },
                { label: "Sustained Findings", value: profile.sustainedComplaints },
                { label: "Current Investigations", value: profile.currentInvestigations },
                { label: "Prior Discipline", value: profile.priorDiscipline },
                { label: "Commendations", value: profile.commendations },
                { label: "Training Deficiencies", value: profile.trainingDeficiencies || "None" },
                { label: "Risk Score", value: profile.riskScore, isScore: true, override: profile.riskScoreOverride },
                { label: "Early Intervention Flags", value: profile.earlyInterventionFlags.length },
              ].map((metric, idx) => (
                <div key={idx} style={{ background: "#ffffff", border: "1px solid #dce4e1", borderRadius: 8, padding: 16 }}>
                  <small style={{ color: "#60716c", display: "block", marginBottom: 8 }}>{metric.label}</small>
                  {metric.isScore ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div
                        style={{
                          fontSize: 32,
                          fontWeight: 800,
                          color: metric.value >= 70 ? "#ef4444" : metric.value >= 50 ? "#f59e0b" : metric.value >= 30 ? "#eab308" : "#16a34a",
                        }}
                      >
                        {metric.value}
                      </div>
                      {metric.override !== null && (
                        <small style={{ color: "#8b5cf6", fontStyle: "italic" }}>Override</small>
                      )}
                    </div>
                  ) : (
                    <strong style={{ fontSize: 24, display: "block" }}>{metric.value}</strong>
                  )}
                </div>
              ))}
            </div>

            {/* Risk Score Override Form */}
            <div style={{ background: "#ffffff", border: "1px solid #dce4e1", borderRadius: 8, padding: 16, marginBottom: 16 }}>
              <h3 style={{ margin: "0 0 12px" }}>Risk Score Override</h3>
              <div style={{ display: "grid", gap: 10 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    defaultValue={profile.riskScoreOverride ?? ""}
                    placeholder="Override score (0-100)"
                    onBlur={(e) => {
                      const value = e.target.value ? parseInt(e.target.value) : null;
                      if (value !== null && value >= 0 && value <= 100) {
                        updateOfficerRiskScore(profile.officer.id, value, e.currentTarget.nextElementSibling?.value || "");
                      }
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Reason for override"
                    defaultValue={profile.riskScoreOverrideReason || ""}
                    onBlur={(e) => {
                      if (profile.riskScoreOverride !== null) {
                        updateOfficerRiskScore(profile.officer.id, profile.riskScoreOverride, e.target.value);
                      }
                    }}
                  />
                </div>
                {profile.riskScoreOverrideDate && (
                  <small style={{ color: "#60716c" }}>Override date: {profile.riskScoreOverrideDate}</small>
                )}
              </div>
            </div>

            {/* Training Deficiencies */}
            <div style={{ background: "#ffffff", border: "1px solid #dce4e1", borderRadius: 8, padding: 16, marginBottom: 16 }}>
              <h3 style={{ margin: "0 0 12px" }}>Training Deficiencies</h3>
              <textarea
                value={profile.trainingDeficiencies}
                onChange={(e) => updateTrainingDeficiencies(profile.officer.id, e.target.value)}
                placeholder="Notes on training gaps, required trainings, etc."
                style={{ minHeight: 100, width: "100%" }}
              />
            </div>

            {/* Early Intervention Alerts */}
            {profile.earlyInterventionFlags.length > 0 && (
              <div style={{ background: "#ffe7da", border: "1px solid #d97706", borderRadius: 8, padding: 16, marginBottom: 16 }}>
                <h3 style={{ margin: "0 0 12px", color: "#8c3b13" }}>Early Intervention Alerts</h3>
                <div style={{ display: "grid", gap: 10 }}>
                  {profile.earlyInterventionFlags.map((flag, idx) => (
                    <div key={idx} style={{ background: "rgba(255,255,255,0.5)", padding: 10, borderRadius: 6 }}>
                      <strong style={{ color: "#8c3b13" }}>{flag.type}</strong>
                      <small style={{ display: "block", color: "#8c3b13", marginTop: 4 }}>
                        Count: {flag.count} · Severity: {flag.severity}
                        {flag.windowStart && flag.windowEnd && ` · ${flag.windowStart} to ${flag.windowEnd}`}
                      </small>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Complaint History */}
            {profile.complaints.length > 0 && (
              <div style={{ background: "#ffffff", border: "1px solid #dce4e1", borderRadius: 8, padding: 16, marginBottom: 16 }}>
                <h3 style={{ margin: "0 0 12px" }}>Complaint History ({profile.complaints.length})</h3>
                <div style={{ display: "grid", gap: 10 }}>
                  {profile.complaints.slice(0, 10).map((complaint) => (
                    <div key={complaint.id} style={{ padding: 10, border: "1px solid #edf1ef", borderRadius: 6 }}>
                      <strong style={{ fontSize: 13 }}>{complaint.title || complaint.category}</strong>
                      <small style={{ display: "block", color: "#60716c", marginTop: 4 }}>
                        {complaint.id} · {complaint.date || complaint.incident?.dateTime?.slice(0, 10)} · {complaint.complaintType}
                      </small>
                    </div>
                  ))}
                  {profile.complaints.length > 10 && (
                    <small style={{ color: "#60716c" }}>+{profile.complaints.length - 10} more complaints</small>
                  )}
                </div>
              </div>
            )}

            {/* Sustained Findings */}
            {profile.sustainedFindings.length > 0 && (
              <div style={{ background: "#ffffff", border: "1px solid #dce4e1", borderRadius: 8, padding: 16 }}>
                <h3 style={{ margin: "0 0 12px" }}>Sustained Findings ({profile.sustainedFindings.length})</h3>
                <div style={{ display: "grid", gap: 10 }}>
                  {profile.sustainedFindings.map((finding) => (
                    <div key={finding.id} style={{ padding: 10, border: "1px solid #edf1ef", borderRadius: 6 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                        <div>
                          <strong style={{ fontSize: 13 }}>{finding.finding}</strong>
                          <small style={{ display: "block", color: "#60716c", marginTop: 2 }}>
                            {finding.id} · {finding.dateCreated}
                          </small>
                        </div>
                        <span className="pill" style={{ background: "#ffe7da", color: "#8c3b13" }}>
                          {finding.disciplineTemplate}
                        </span>
                      </div>
                      {finding.description && (
                        <small style={{ display: "block", color: "#60716c", marginTop: 6 }}>{finding.description}</small>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "#687872" }}>
            Select an officer to view their profile
          </div>
        )}
      </div>
    </section>
  );
}

function SettingsView({ themeIndex, setThemeIndex }) {
  return (
    <section className="collection-view">
      <div className="collection-head">
        <h2>Settings</h2>
      </div>

      <div className="record-grid" style={{ gridTemplateColumns: "1fr" }}>
        <div className="panel" style={{ padding: 16 }}>
          <h3 style={{ margin: "0 0 16px" }}>Theme Color</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {themeColors.map((theme, idx) => (
              <button
                key={idx}
                onClick={() => setThemeIndex(idx)}
                style={{
                  all: "unset",
                  display: "grid",
                  gap: 8,
                  padding: 12,
                  border: themeIndex === idx ? "2px solid #17212b" : "2px solid #dce4e1",
                  borderRadius: 8,
                  cursor: "pointer",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    height: 60,
                    borderRadius: 6,
                    background: theme.accent,
                  }}
                />
                <span style={{ fontSize: 14, fontWeight: 600, color: "#17212b" }}>
                  {theme.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ComplaintsView({ data, activeCase, visibleComplaints, createComplaint, setActiveComplaintId }) {
  const [tab, setTab] = useState("Intake"); // Intake | Submission

  return (
    <section className="collection-view">
      <div className="collection-head">
        <FileSearch size={22} />
        <h2>Complaints</h2>
        <span>{visibleComplaints.length} total</span>
      </div>

      <div className="record-grid" style={{ gridTemplateColumns: "1fr" }}>
        <div className="panel" style={{ padding: 16 }}>
          <div className="panel-head compact" style={{ marginTop: 0 }}>
            <h2 style={{ fontSize: 18 }}>Complaint Intake</h2>
            <select value={tab} onChange={(e) => setTab(e.target.value)} style={{ width: 240 }}>
              <option value="Intake">Intake</option>
              <option value="Submission">Submission</option>
            </select>
          </div>

          <form onSubmit={createComplaint}>
            <input name="mode" type="hidden" value={tab} />

            <input name="title" placeholder="Complaint title" />

            <div className="row" style={{ marginTop: 10 }}>
              <select name="complaintType" defaultValue="Citizen">
                <option value="Citizen">Citizen complaint</option>
                <option value="Internal">Internal complaint</option>
                <option value="Anonymous">Anonymous complaint</option>
              </select>
              <input
                name="category"
                placeholder="Complaint category"
                defaultValue={"Uncategorized"}
              />
            </div>

            <div style={{ display: tab === "Intake" ? "grid" : "grid", gap: 10, marginTop: 10 }}>
              {/* Complainant + contact */}
              <div className="row" style={{ marginTop: 0 }}>
                <input
                  name="complainantName"
                  placeholder="Complainant name (hidden for anonymous)"
                  disabled={tab === "Submission" ? false : false}
                  // disabled state will be controlled visually by placeholder guidance
                />
                <input name="complainantId" placeholder="Complainant ID (optional)" />
              </div>

              <div className="row">
                <input name="contactPhone" placeholder="Contact phone (hidden for anonymous)" />
              </div>
            </div>

            {/* Incident location + datetime */}
            <div style={{ marginTop: 10 }}>
              <div className="row">
                <input name="incidentLocation" placeholder="Incident location" defaultValue={"Unspecified"} />
                <input name="incidentDate" type="date" placeholder="Incident date" />
              </div>
              <div className="row" style={{ marginTop: 10 }}>
                <input name="incidentTime" type="time" placeholder="Incident time" />
                <input
                  name="source"
                  placeholder="(legacy) Source/Location (auto-filled from Incident location)"
                  style={{ display: "none" }}
                />
              </div>
            </div>

            {/* Narrative */}
            <textarea name="narrative" placeholder="Narrative statement (required on submission)" />

            {/* Evidence attachments (metadata) */}
            <div style={{ marginTop: 10 }}>
              <input
                name="evidenceNames"
                placeholder="Attached evidence filenames (comma-separated)"
              />
              <textarea name="evidenceNotes" placeholder="Evidence notes aligned by comma (optional)" />
            </div>

            {/* Supervisor referral */}
            <div style={{ marginTop: 10 }}>
              <select name="supervisorReferralEnabled" defaultValue={"false"}>
                <option value={"false"}>No supervisor referral</option>
                <option value={"true"}>Supervisor referral</option>
              </select>
              <div className="row" style={{ marginTop: 10 }}>
                <input name="supervisorName" placeholder="Supervisor name" />
                <input name="supervisorId" placeholder="Supervisor ID" />
              </div>
              <textarea name="supervisorReferralReason" placeholder="Referral reason (optional)" />
            </div>

            {/* Involved personnel IDs (optional) */}
            <input
              name="involvedPersonIds"
              placeholder="Involved person ids (comma-separated, optional)"
              defaultValue={""}
              style={{ marginTop: 10 }}
            />

            <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
              <button className="primary" type="submit">
                <Plus size={17} />
                {tab === "Intake" ? "Save intake" : "Submit complaint (auto-screening)"}
              </button>
              {tab === "Submission" && (
                <p className="empty-small" style={{ margin: 0 }}>
                  Submission triggers automated review: duplicate detection, history check, and mandatory IA review alerts.
                </p>
              )}
            </div>
          </form>
        </div>

        <div className="collection-list" style={{ marginTop: 12 }}>
          {visibleComplaints.length ? (
            visibleComplaints.map((c) => {
              const ia = Boolean(c.mandatoryIAReviewAlert);
              const dup = Boolean(c?.screening?.duplicateDetected);
              return (
                <button
                  key={c.id}
                  className={`case-card ${activeCase?.id && false ? "selected" : ""}`}
                  onClick={() => setActiveComplaintId(c.id)}
                  style={ia ? { borderColor: "#d64545" } : undefined}
                >
                  <span className="case-id">{c.id}</span>
                  <strong>{c.title}</strong>
                  <small>{c.narrative || c.description}</small>

                  <span className="meta-row">
                    <span style={{ fontWeight: 800 }}>
                      {c.incident?.dateTime ? `Incident ${String(c.incident.dateTime).replace("T", " ")}` : `Incident ${c.date}`}
                    </span>
                    <span>{c.incident?.location || c.source}</span>
                  </span>

                  <span className="meta-row">
                    <span className={`pill ${ia ? "critical" : "pending"}`}
                      style={{ padding: "3px 9px", fontWeight: 900 }}
                    >
                      {ia ? "IA review required" : "IA review pending"}
                    </span>
                    {dup && (
                      <span className="pill needs-review" style={{ fontWeight: 900 }}>
                        Possible duplicate
                      </span>
                    )}
                    <span className="pill" style={{ background: "#edf2f0" }}>
                      {c.category || "Uncategorized"}
                    </span>
                    {Array.isArray(c.evidence) && c.evidence.length ? (
                      <span className="pill" style={{ fontWeight: 900 }}>
                        Evidence: {c.evidence.length}
                      </span>
                    ) : null}
                  </span>
                </button>
              );
            })
          ) : (
            <p className="empty">No complaints found.</p>
          )}
        </div>
      </div>
    </section>
  );
}


createRoot(document.getElementById("root")).render(<App />);
