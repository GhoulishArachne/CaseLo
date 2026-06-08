import React, { useMemo, useState, useEffect } from "react";
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
  Trash2,
  UserRound,
  LogOut,
} from "lucide-react";
import "./styles.css";
import { AuthProvider, useAuth } from "./AuthContext";
import { LoginForm } from "./LoginForm";
import {
  casesService,
  complaintsService,
  peopleService,
  evidenceService,
  eventsService,
  notesService,
  tasksService,
  findingsService,
  violationsService,
  policiesService,
  templatesService,
  customOptionsService,
  documentFoldersService,
  documentsService,
  storageService,
  riskScoreHistoryService,
  eiInterventionsService,
  eiWeightsService,
} from "./supabaseService";

const seedData = {
  cases: [],
  complaints: [],
  people: [
    { id: "P-001", name: "James Gamble", rank: "Chief of Police", badgeNumber: "201", assignment: "", division: "" },
    { id: "P-002", name: "Jimmy Rockford", rank: "Deputy Chief", badgeNumber: "202", assignment: "", division: "" },
    { id: "P-003", name: "Frank Church", rank: "Commander", badgeNumber: "203", assignment: "", division: "" },
    { id: "P-004", name: "Ezrael Kayne", rank: "Commander", badgeNumber: "204", assignment: "", division: "" },
    { id: "P-005", name: "Levi Pendragon", rank: "Captain", badgeNumber: "205", assignment: "", division: "" },
    { id: "P-006", name: "Calvin Sidhe", rank: "Captain", badgeNumber: "206", assignment: "", division: "" },
    { id: "P-007", name: "Arnold Williams", rank: "Captain", badgeNumber: "207", assignment: "", division: "" },
    { id: "P-008", name: "Ted Woods", rank: "Lieutenant", badgeNumber: "210", assignment: "", division: "" },
    { id: "P-009", name: "", rank: "Lieutenant", badgeNumber: "211", assignment: "", division: "" },
    { id: "P-010", name: "Shawn Braddington", rank: "Lieutenant", badgeNumber: "212", assignment: "", division: "" },
    { id: "P-011", name: "Daniel \"Hondo\" Harelson", rank: "Lieutenant", badgeNumber: "213", assignment: "", division: "" },
    { id: "P-012", name: "", rank: "Lieutenant", badgeNumber: "214", assignment: "", division: "" },
    { id: "P-013", name: "Annabelle Sable", rank: "Sergeant", badgeNumber: "215", assignment: "", division: "" },
    { id: "P-014", name: "David Hinkleberry", rank: "Sergeant", badgeNumber: "216", assignment: "", division: "" },
    { id: "P-015", name: "Ayumi Hirano", rank: "Sergeant", badgeNumber: "217", assignment: "", division: "" },
    { id: "P-016", name: "Mike Kraus", rank: "Sergeant", badgeNumber: "218", assignment: "", division: "" },
    { id: "P-017", name: "Mason Crow", rank: "Sergeant", badgeNumber: "219", assignment: "", division: "" },
    { id: "P-018", name: "Molly Gabagooly", rank: "Sergeant", badgeNumber: "220", assignment: "", division: "" },
    { id: "P-019", name: "Bobby Light", rank: "Sergeant", badgeNumber: "221", assignment: "", division: "" },
    { id: "P-020", name: "Jay Savage", rank: "Sergeant", badgeNumber: "222", assignment: "", division: "" },
  ],
  evidence: [],
  events: [],
  notes: [],
  tasks: [],
  findings: [],
  violations: [
    { id: "COND", name: "Conduct Unbecoming", description: "Any conduct, whether on-duty or off-duty, that damages the integrity, professionalism, credibility, or public trust of the department.", category: "Conduct", severityLevel: "High", defaultDisciplineTemplate: "Suspension", notes: "" },
    { id: "UNPROF", name: "Unprofessional Conduct", description: "Failure to maintain professional demeanor, communication standards, or workplace behavior expected of department personnel.", category: "Conduct", severityLevel: "Medium", defaultDisciplineTemplate: "Written Warning", notes: "" },
    { id: "HARAS", name: "Harassment or Discriminatory Conduct", description: "Any unwelcome conduct, discriminatory behavior, or hostile treatment based on protected characteristics.", category: "Conduct", severityLevel: "High", defaultDisciplineTemplate: "Suspension", notes: "" },
    { id: "ABUSE", name: "Abuse of Authority", description: "Improper use of official position, powers, rank, or influence for personal gain, intimidation, favoritism, retaliation, or unlawful purposes.", category: "Integrity", severityLevel: "High", defaultDisciplineTemplate: "Suspension", notes: "" },
    { id: "RETALIAT", name: "Retaliation", description: "Any adverse action taken against an employee, witness, complainant, or civilian for reporting misconduct, cooperating with investigations, or exercising protected rights.", category: "Conduct", severityLevel: "Critical", defaultDisciplineTemplate: "Termination", notes: "" },
    { id: "SOCMED", name: "Inappropriate Social Media Conduct", description: "Posting, sharing, or engaging in online behavior that violates department standards, damages public trust, compromises investigations, or reflects poorly on the department.", category: "Conduct", severityLevel: "Medium", defaultDisciplineTemplate: "Written Warning", notes: "" },
    { id: "NEGL", name: "Neglect of Duty", description: "Failure to properly perform assigned responsibilities, obligations, or required actions expected of department personnel.", category: "Performance", severityLevel: "Medium", defaultDisciplineTemplate: "Written Warning", notes: "" },
    { id: "DEREL", name: "Dereliction of Duty", description: "Intentional abandonment or refusal to perform required responsibilities or lawful obligations.", category: "Performance", severityLevel: "High", defaultDisciplineTemplate: "Suspension", notes: "" },
    { id: "FAILACT", name: "Failure to Take Appropriate Police Action", description: "Failure to intervene, investigate, respond, or act appropriately when law enforcement action is reasonably required.", category: "Performance", severityLevel: "High", defaultDisciplineTemplate: "Suspension", notes: "" },
    { id: "UNAUTH", name: "Unauthorized Absence", description: "Leaving assigned duty, post, scene, or work assignment without approval or proper authorization.", category: "Performance", severityLevel: "Medium", defaultDisciplineTemplate: "Written Warning", notes: "" },
    { id: "SLEEP", name: "Sleeping on Duty", description: "Being asleep, inattentive, or otherwise unavailable while assigned to active duty status.", category: "Performance", severityLevel: "High", defaultDisciplineTemplate: "Suspension", notes: "" },
    { id: "INCOMP", name: "Incompetence or Unsatisfactory Performance", description: "Repeated inability or unwillingness to meet required operational, procedural, or professional standards.", category: "Performance", severityLevel: "Medium", defaultDisciplineTemplate: "Written Warning", notes: "" },
    { id: "FAILSUP", name: "Failure to Supervise", description: "Failure by supervisory personnel to properly monitor, guide, correct, or control subordinate conduct or operations.", category: "Performance", severityLevel: "High", defaultDisciplineTemplate: "Suspension", notes: "" },
    { id: "TRUTH", name: "Truthfulness Violation", description: "Any dishonest, misleading, deceptive, or intentionally inaccurate statement made verbally, electronically, or in writing.", category: "Integrity", severityLevel: "High", defaultDisciplineTemplate: "Suspension", notes: "" },
    { id: "FALSRPT", name: "Falsifying Reports or Records", description: "Knowingly creating, altering, or submitting false official documentation or records.", category: "Integrity", severityLevel: "Critical", defaultDisciplineTemplate: "Termination", notes: "" },
    { id: "PERJURY", name: "Perjury", description: "Knowingly providing false sworn testimony during legal, administrative, or judicial proceedings.", category: "Integrity", severityLevel: "Critical", defaultDisciplineTemplate: "Termination", notes: "" },
    { id: "EVTAMP", name: "Evidence Tampering", description: "Altering, concealing, destroying, fabricating, or improperly handling evidence to interfere with investigative integrity.", category: "Integrity", severityLevel: "Critical", defaultDisciplineTemplate: "Termination", notes: "" },
    { id: "OBSTRUCT", name: "Obstruction of Investigation", description: "Interfering with, delaying, or compromising criminal or administrative investigations.", category: "Integrity", severityLevel: "Critical", defaultDisciplineTemplate: "Termination", notes: "" },
    { id: "FAILRPT", name: "Failure to Report Misconduct", description: "Failure to report known misconduct, corruption, criminal activity, or major policy violations.", category: "Integrity", severityLevel: "High", defaultDisciplineTemplate: "Suspension", notes: "" },
    { id: "MISINFO", name: "Misuse of Confidential Information", description: "Unauthorized access, disclosure, or misuse of protected or confidential department information.", category: "Integrity", severityLevel: "High", defaultDisciplineTemplate: "Suspension", notes: "" },
    { id: "UNAUTSYS", name: "Unauthorized System or Database Access", description: "Improper access or misuse of department systems, databases, or electronic records without a legitimate law enforcement purpose.", category: "Integrity", severityLevel: "High", defaultDisciplineTemplate: "Suspension", notes: "" },
    { id: "DISHIA", name: "Dishonesty During Internal Affairs Investigation", description: "Providing false, misleading, incomplete, or deceptive information during an administrative investigation.", category: "Integrity", severityLevel: "Critical", defaultDisciplineTemplate: "Termination", notes: "" },
    { id: "EXFO", name: "Excessive Force", description: "Use of force beyond what is objectively reasonable, lawful, or authorized by department policy.", category: "Use of Force", severityLevel: "High", defaultDisciplineTemplate: "Suspension", notes: "" },
    { id: "FAILRPTFO", name: "Failure to Report Use of Force", description: "Failure to properly document or disclose reportable force incidents.", category: "Use of Force", severityLevel: "High", defaultDisciplineTemplate: "Suspension", notes: "" },
    { id: "IMPWEAP", name: "Improper Weapon Use", description: "Unsafe, reckless, negligent, or unauthorized deployment of department weapons.", category: "Use of Force", severityLevel: "High", defaultDisciplineTemplate: "Suspension", notes: "" },
    { id: "DEADLY", name: "Deadly Force Policy Violation", description: "Violation involving the use, attempted use, or threatened use of deadly force outside department standards.", category: "Use of Force", severityLevel: "Critical", defaultDisciplineTemplate: "Termination", notes: "" },
    { id: "DEESCAL", name: "Failure to De-Escalate", description: "Failure to reasonably attempt de-escalation techniques when circumstances safely allow.", category: "Use of Force", severityLevel: "Medium", defaultDisciplineTemplate: "Written Warning", notes: "" },
    { id: "RECKEND", name: "Reckless Endangerment", description: "Creating unnecessary danger to civilians, officers, or suspects through reckless conduct.", category: "Use of Force", severityLevel: "High", defaultDisciplineTemplate: "Suspension", notes: "" },
    { id: "IMPRESTR", name: "Improper Restraint Procedures", description: "Use of unsafe, prohibited, or unauthorized restraint techniques.", category: "Use of Force", severityLevel: "High", defaultDisciplineTemplate: "Suspension", notes: "" },
    { id: "UNLAWARRST", name: "Unlawful Detention or False Arrest", description: "Detaining or arresting individuals without lawful justification or probable cause.", category: "Arrest", severityLevel: "Critical", defaultDisciplineTemplate: "Termination", notes: "" },
    { id: "IMPSEARCH", name: "Improper Search & Seizure", description: "Violation of lawful search, seizure, warrant, or property handling procedures.", category: "Arrest", severityLevel: "High", defaultDisciplineTemplate: "Suspension", notes: "" },
    { id: "PRISABUSE", name: "Prisoner Abuse or Mistreatment", description: "Mistreatment, abuse, neglect, or unnecessary force against detained individuals.", category: "Arrest", severityLevel: "Critical", defaultDisciplineTemplate: "Termination", notes: "" },
    { id: "FAILRIGHTS", name: "Failure to Provide Required Rights Advisements", description: "Failure to provide legally or departmentally required advisements during enforcement actions.", category: "Arrest", severityLevel: "High", defaultDisciplineTemplate: "Suspension", notes: "" },
    { id: "IMPTRANS", name: "Improper Prisoner Transportation or Security", description: "Unsafe or negligent prisoner transportation, supervision, or security procedures.", category: "Arrest", severityLevel: "High", defaultDisciplineTemplate: "Suspension", notes: "" },
    { id: "FAILCOMP", name: "Failure to Complete Required Reports", description: "Failure to complete or submit required reports, forms, or documentation.", category: "Performance", severityLevel: "Medium", defaultDisciplineTemplate: "Written Warning", notes: "" },
    { id: "INACCRPT", name: "Inaccurate or Incomplete Documentation", description: "Submitting reports containing significant inaccuracies, omissions, or misleading information.", category: "Performance", severityLevel: "High", defaultDisciplineTemplate: "Suspension", notes: "" },
    { id: "UNAUTMOD", name: "Unauthorized Modification of Reports or Records", description: "Improper alteration or editing of official department records without authorization.", category: "Integrity", severityLevel: "Critical", defaultDisciplineTemplate: "Termination", notes: "" },
    { id: "FAILEVID", name: "Failure to Upload or Preserve Evidence", description: "Failure to properly submit, preserve, secure, or maintain evidence.", category: "Performance", severityLevel: "High", defaultDisciplineTemplate: "Suspension", notes: "" },
    { id: "FAILREC", name: "Failure to Activate or Improper Deactivation of Recording Equipment", description: "Failure to properly operate required recording systems.", category: "Performance", severityLevel: "High", defaultDisciplineTemplate: "Suspension", notes: "" },
    { id: "UNAUTP", name: "Unauthorized Vehicle Pursuit", description: "Engaging in vehicle pursuits outside department authorization or policy.", category: "Performance", severityLevel: "High", defaultDisciplineTemplate: "Suspension", notes: "" },
    { id: "RECKDRIVE", name: "Reckless Emergency Vehicle Operation", description: "Unsafe operation of emergency vehicles creates unnecessary danger.", category: "Performance", severityLevel: "High", defaultDisciplineTemplate: "Suspension", notes: "" },
    { id: "VEHMIUSE", name: "Vehicle Misuse", description: "Improper or unauthorized use of department vehicles.", category: "Performance", severityLevel: "Medium", defaultDisciplineTemplate: "Written Warning", notes: "" },
    { id: "PREVCRASH", name: "Preventable Collision", description: "Vehicle collision caused by negligence, unsafe operation, or policy violations.", category: "Performance", severityLevel: "High", defaultDisciplineTemplate: "Suspension", notes: "" },
    { id: "MISHANDL", name: "Mishandling or Loss of Evidence", description: "Improper collection, storage, preservation, or handling of evidence resulting in compromise or loss.", category: "Integrity", severityLevel: "Critical", defaultDisciplineTemplate: "Termination", notes: "" },
    { id: "THEFT", name: "Theft or Misappropriation of Property", description: "Unauthorized taking, misuse, or conversion of department or civilian property.", category: "Integrity", severityLevel: "Critical", defaultDisciplineTemplate: "Termination", notes: "" },
    { id: "IMPPROP", name: "Improper Property Handling", description: "Failure to properly secure, document, inventory, or process department or civilian property.", category: "Performance", severityLevel: "Medium", defaultDisciplineTemplate: "Written Warning", notes: "" },
    { id: "CORR", name: "Corruption", description: "Using official authority or position for unlawful gain, favoritism, or improper benefit.", category: "Integrity", severityLevel: "Critical", defaultDisciplineTemplate: "Termination", notes: "" },
    { id: "BRIBE", name: "Bribery", description: "Soliciting, accepting, or offering improper compensation or favors in exchange for official action.", category: "Integrity", severityLevel: "Critical", defaultDisciplineTemplate: "Termination", notes: "" },
    { id: "FRAUD", name: "Fraud", description: "Intentional deception or misrepresentation for personal, financial, or professional gain.", category: "Integrity", severityLevel: "Critical", defaultDisciplineTemplate: "Termination", notes: "" },
    { id: "EXTORT", name: "Extortion", description: "Using authority, threats, coercion, or intimidation for unlawful personal benefit.", category: "Integrity", severityLevel: "Critical", defaultDisciplineTemplate: "Termination", notes: "" },
    { id: "CRIMCOND", name: "Criminal Conduct", description: "Any criminal offense committed by department personnel, whether on-duty or off-duty.", category: "Integrity", severityLevel: "Critical", defaultDisciplineTemplate: "Termination", notes: "" },
    { id: "ASSOCCRIM", name: "Association With Criminal Organizations", description: "Improper association, cooperation, or involvement with criminal enterprises or organizations.", category: "Integrity", severityLevel: "Critical", defaultDisciplineTemplate: "Termination", notes: "" },
    { id: "POSSCONT", name: "Possession of Contraband or Prohibited Substances", description: "Unauthorized possession of illegal substances, contraband, or prohibited materials.", category: "Integrity", severityLevel: "Critical", defaultDisciplineTemplate: "Termination", notes: "" },
    { id: "INSUBORD", name: "Insubordination", description: "Refusal to obey lawful orders, directives, or instructions from authorized personnel.", category: "Conduct", severityLevel: "High", defaultDisciplineTemplate: "Suspension", notes: "" },
    { id: "ABUSRANK", name: "Abuse of Rank or Position", description: "Improper use of supervisory or command authority beyond legitimate department purposes.", category: "Conduct", severityLevel: "High", defaultDisciplineTemplate: "Suspension", notes: "" },
    { id: "FAILPOL", name: "Failure to Follow Department Policy or Procedure", description: "Violation of established department policies, procedures, directives, or standards.", category: "Performance", severityLevel: "Medium", defaultDisciplineTemplate: "Written Warning", notes: "" },
    { id: "UNAUTORD", name: "Unauthorized Orders or Improper Delegation", description: "Issuing unauthorized directives or improperly assigning responsibilities.", category: "Conduct", severityLevel: "High", defaultDisciplineTemplate: "Suspension", notes: "" },
    { id: "ADMISCON", name: "Administrative Misconduct", description: "Improper handling of administrative responsibilities, systems, or oversight obligations.", category: "Performance", severityLevel: "Medium", defaultDisciplineTemplate: "Written Warning", notes: "" },
    { id: "BREACHCON", name: "Breach of Confidentiality", description: "Unauthorized disclosure or release of confidential or protected information.", category: "Integrity", severityLevel: "High", defaultDisciplineTemplate: "Suspension", notes: "" },
    { id: "TARDINESS", name: "Tardiness or Failure to Report for Duty", description: "Repeated lateness, absenteeism, or failure to appear for scheduled assignments.", category: "Performance", severityLevel: "Low", defaultDisciplineTemplate: "Written Warning", notes: "" },
    { id: "UNAUTLEAVE", name: "Unauthorized Leave", description: "Absence from duty without required approval or authorization.", category: "Performance", severityLevel: "Medium", defaultDisciplineTemplate: "Written Warning", notes: "" },
    { id: "FITDUTY", name: "Fitness for Duty Violation", description: "Reporting for duty physically, mentally, or emotionally unfit to safely perform responsibilities.", category: "Performance", severityLevel: "High", defaultDisciplineTemplate: "Suspension", notes: "" },
    { id: "SUBSTABUSE", name: "Substance Abuse", description: "Improper use of alcohol, drugs, or controlled substances affects department performance or readiness.", category: "Integrity", severityLevel: "Critical", defaultDisciplineTemplate: "Termination", notes: "" },
    { id: "IMPRADIO", name: "Improper Radio or Communication Usage", description: "Violation of department communication procedures, professionalism standards, or operational protocols.", category: "Conduct", severityLevel: "Low", defaultDisciplineTemplate: "Verbal Warning", notes: "" },
    { id: "CYBERMIS", name: "Cyber or Digital Misconduct", description: "Improper digital conduct involving department systems, technology, or online resources.", category: "Conduct", severityLevel: "Medium", defaultDisciplineTemplate: "Written Warning", notes: "" },
    { id: "DATABREACH", name: "Data Breach or Unauthorized Disclosure", description: "Unauthorized release, exposure, or compromise of protected department information.", category: "Integrity", severityLevel: "Critical", defaultDisciplineTemplate: "Termination", notes: "" },
    { id: "DESTROYREC", name: "Destruction of Digital Records", description: "Improper deletion, destruction, or alteration of electronic files or digital records.", category: "Integrity", severityLevel: "Critical", defaultDisciplineTemplate: "Termination", notes: "" },
    { id: "FAILCERT", name: "Failure to Maintain Required Certification or Training", description: "Failure to maintain active certifications, qualifications, or required training standards.", category: "Performance", severityLevel: "Medium", defaultDisciplineTemplate: "Written Warning", notes: "" },
    { id: "FALSEREP", name: "False Representation of Qualifications", description: "Falsely claiming training, certifications, experience, or qualifications.", category: "Integrity", severityLevel: "High", defaultDisciplineTemplate: "Suspension", notes: "" },
    { id: "INTERFOIA", name: "Interference With Internal Affairs Investigation", description: "Attempting to obstruct, influence, manipulate, or compromise IA investigations.", category: "Integrity", severityLevel: "Critical", defaultDisciplineTemplate: "Termination", notes: "" },
    { id: "RETALIAGE", name: "Retaliation Against Witnesses or Investigators", description: "Targeting individuals participating in investigations.", category: "Conduct", severityLevel: "Critical", defaultDisciplineTemplate: "Termination", notes: "" },
    { id: "FAILPRESERVE", name: "Failure to Preserve Investigative Evidence", description: "Failure to properly secure or preserve evidence after notice of investigation.", category: "Integrity", severityLevel: "Critical", defaultDisciplineTemplate: "Termination", notes: "" },
    { id: "IABIAS", name: "Investigator Bias or Conflict of Interest", description: "Compromising investigative neutrality through personal bias, favoritism, or conflicts.", category: "Integrity", severityLevel: "High", defaultDisciplineTemplate: "Suspension", notes: "" },
    { id: "METGAME", name: "Metagaming Administrative Information", description: "Improper use of restricted administrative, investigative, or privileged information outside authorized purposes.", category: "Integrity", severityLevel: "High", defaultDisciplineTemplate: "Suspension", notes: "" },
    { id: "ADMINABUSE", name: "Administrative Abuse", description: "Misuse of administrative authority, systems, permissions, or powers.", category: "Conduct", severityLevel: "High", defaultDisciplineTemplate: "Suspension", notes: "" },
    { id: "FAVORTISM", name: "Favoritism", description: "Providing improper preferential treatment inconsistent with department fairness standards.", category: "Conduct", severityLevel: "Medium", defaultDisciplineTemplate: "Written Warning", notes: "" },
    { id: "MALPROS", name: "Malicious Prosecution", description: "Knowingly pursuing unsupported, fabricated, or improper charges or allegations.", category: "Integrity", severityLevel: "Critical", defaultDisciplineTemplate: "Termination", notes: "" },
    { id: "ABUSERES", name: "Abuse of Department Resources", description: "Improper use of department equipment, systems, personnel, or operational resources.", category: "Performance", severityLevel: "Medium", defaultDisciplineTemplate: "Written Warning", notes: "" },
    { id: "OPSABOTAGE", name: "Operational Sabotage", description: "Intentional actions designed to undermine department operations, investigations, administrative processes, or organizational integrity.", category: "Integrity", severityLevel: "Critical", defaultDisciplineTemplate: "Termination", notes: "" },
  ],
  policies: [
    {
      id: "POL-001",
      title: "Use of Force Policy",
      description: "Standard guidelines for use of force incidents and authorized response protocols",
      url: "https://example.com/policies/use-of-force.pdf",
      linkedViolationIds: ["VC-005"],
      category: "Use of Force",
      version: "2.1",
      effectiveDate: "2024-01-15",
      documentSource: "Department Policy Manual",
      notes: "Investigative reference - core policy for use of force violations",
    },
    {
      id: "POL-002",
      title: "Anti-Corruption Policy",
      description: "Standards of conduct prohibiting corruption, bribery, and conflicts of interest",
      url: "https://example.com/policies/anti-corruption.pdf",
      linkedViolationIds: ["VC-003"],
      category: "Corruption",
      version: "1.8",
      effectiveDate: "2023-06-01",
      documentSource: "Department Policy Manual",
      notes: "Investigative reference - primary policy for corruption investigations",
    },
    {
      id: "POL-003",
      title: "Pursuit Vehicles Policy",
      description: "Guidelines for authorized vehicle pursuits and safety protocols",
      url: "https://example.com/policies/pursuit-vehicles.pdf",
      linkedViolationIds: [],
      category: "Pursuit",
      version: "3.0",
      effectiveDate: "2024-02-01",
      documentSource: "Department Operations Manual",
      notes: "Reference for pursuit-related investigations and violations",
    },
    {
      id: "POL-004",
      title: "Harassment and Discrimination Prevention",
      description: "Policy prohibiting harassment, discrimination, and unprofessional conduct",
      url: "https://example.com/policies/harassment-prevention.pdf",
      linkedViolationIds: ["COND"],
      category: "Harassment",
      version: "2.0",
      effectiveDate: "2023-09-01",
      documentSource: "HR Department Manual",
      notes: "Reference for harassment and conduct unbecoming violations",
    },
  ],
  investigationTemplates: [
    {
      id: "TMPL-001",
      name: "Use of Force Investigation",
      description: "Template for investigating excessive force allegations and related officer conduct",
      category: "Use of Force",
      investigationScope: "Examine circumstances of force incident, officer actions, subject behavior, injuries sustained, medical documentation, and compliance with use of force continuum",
      keyQuestions: [
        "Was the suspect armed or posed an immediate threat to officer safety?",
        "Did the officer follow the established use of force continuum?",
        "Was the level of force proportional to the threat presented?",
        "Were there any alternative methods available that would have been appropriate?",
        "Were verbal warnings given prior to use of force?"
      ],
      requiredEvidenceTypes: ["Body camera footage", "Dash camera footage", "Witness statements", "Medical reports", "Scene photographs", "Officer statement"],
      linkedViolations: ["EXFO"],
      linkedPolicies: ["POL-001"],
      estimatedInvestigationDays: 14,
      createdBy: "IA Command",
      dateCreated: "2024-01-01",
    },
    {
      id: "TMPL-002",
      name: "Corruption Investigation",
      description: "Template for investigating allegations of corruption, bribery, and illegal benefits",
      category: "Corruption",
      investigationScope: "Examine financial records, communications, relationships with known criminals or business entities, unauthorized benefits, quid pro quo arrangements, and conflict of interest matters",
      keyQuestions: [
        "Did the officer receive unauthorized benefits or payments?",
        "Was there a quid pro quo agreement or understanding?",
        "Did the officer solicit or encourage illegal payments?",
        "Are there connections to criminal enterprises or suspicious persons?",
        "Were assets acquired beyond what legitimate salary would provide?"
      ],
      requiredEvidenceTypes: ["Financial records", "Communications (email/text)", "Bank statements", "Witness testimony", "Surveillance footage", "Property records"],
      linkedViolations: ["VC-003"],
      linkedPolicies: ["POL-002"],
      estimatedInvestigationDays: 30,
      createdBy: "IA Command",
      dateCreated: "2024-01-01",
    },
    {
      id: "TMPL-003",
      name: "Pursuit Violation Investigation",
      description: "Template for investigating improper vehicle pursuit procedures and safety violations",
      category: "Pursuit",
      investigationScope: "Review pursuit authorization, adherence to pursuit policies, use of emergency equipment, driving behavior, public safety considerations, and supervisory oversight",
      keyQuestions: [
        "Was the pursuit authorized in accordance with policy?",
        "Did the officer comply with speed and safety limitations?",
        "Were emergency lights and sirens activated throughout pursuit?",
        "Were supervisors adequately informed of pursuit status and location?",
        "Did the pursuit endanger innocent civilians or officers?"
      ],
      requiredEvidenceTypes: ["Dispatch records", "Pursuit logs", "Dash/body camera footage", "Speed data", "Officer statements", "Civilian complaints"],
      linkedViolations: [],
      linkedPolicies: ["POL-003"],
      estimatedInvestigationDays: 10,
      createdBy: "IA Command",
      dateCreated: "2024-01-01",
    },
    {
      id: "TMPL-004",
      name: "Harassment Investigation",
      description: "Template for investigating harassment, discrimination, and hostile work environment allegations",
      category: "Harassment",
      investigationScope: "Document alleged conduct, interviews with complainant and witnesses, examination of communications, review of employment records, pattern analysis, and assessment of impact",
      keyQuestions: [
        "What specific conduct is alleged and when did it occur?",
        "Were there any witnesses to the alleged harassment?",
        "Has the complainant reported this previously?",
        "Is there a pattern of similar complaints involving the accused officer?",
        "What is the impact on the complainant's working conditions?"
      ],
      requiredEvidenceTypes: ["Complainant statement", "Witness statements", "Communications (emails, texts, messages)", "Work records", "Prior complaints", "Timeline documentation"],
      linkedViolations: ["COND"],
      linkedPolicies: ["POL-004"],
      estimatedInvestigationDays: 14,
      createdBy: "IA Command",
      dateCreated: "2024-01-01",
    },
  ],
  customOptions: {
    priorityOptions: [],
    investigationTypes: [],
  },
  documentFolders: [],
  documents: [],
};

// Data is now stored in Supabase, not localStorage
// const storeKey = "case-logger-data-v2";
const caseStatuses = ["Intake", "Active", "Closed"];

const rankOrder = ["Chief of Police", "Deputy Chief", "Commander", "Captain", "Lieutenant", "Sergeant", "Corporal", "Officer", "Cadet"];

const themeColors = [
  {
    name: "Dark",
    dark: "#1e1e1e",
    surface: "#252525",
    accent: "#3B82F6",
    text: "#e0e0e0",
    border: "#404040",
    departmentName: "Police Department",
    departmentLogoUrl: "",
    reportHeaderText: "Internal Affairs Investigation",
    signatureBlockText: "Authorized by: ",
    accentSecondaryColor: "#10B981",
  },
  {
    name: "Light",
    dark: "#ffffff",
    surface: "#f9fafb",
    accent: "#2563EB",
    text: "#1F2937",
    border: "#dce4e1",
    departmentName: "Police Department",
    departmentLogoUrl: "",
    reportHeaderText: "Internal Affairs Investigation",
    signatureBlockText: "Authorized by: ",
    accentSecondaryColor: "#1F2937",
  },
];

const findingTypes = ["Sustained", "Not Sustained", "Exonerated", "Unfounded", "Policy Failure"];
const iaRecommendationTemplates = ["No Action", "Coaching", "Counseling", "Written Warning", "Suspension", "Termination"];
const disciplineTemplates = ["None", "Counseling", "Written Warning", "Suspension", "Termination"];
const severityLevels = ["None", "Low", "Medium", "High"];

const violationCategories = ["Conduct", "Performance", "Integrity", "Safety", "Use of Force", "Other"];
const violationSeverityLevels = ["Low", "Medium", "High", "Critical"];

const policyCategories = ["Use of Force", "Corruption", "Pursuit", "Harassment", "Ethics", "Evidence", "Reports", "Other"];

const investigationTemplateCategories = ["Use of Force", "Corruption", "Pursuit", "Harassment", "General", "Other"];

const customizableDropdowns = [
  { key: "priorityOptions", label: "Priority Levels", description: "Custom priority values for cases", hardcoded: ["Critical", "High", "Medium", "Low"] },
  { key: "investigationTypes", label: "Investigation Types", description: "Custom investigation type categories", hardcoded: ["General", "Use of Force", "Corruption", "Pursuit", "Harassment"] },
];

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
      status: caseStatuses.includes(item.status) ? item.status : "Intake",
      priority: item.priority || "Medium",
      opened: item.opened || new Date().toISOString().slice(0, 10),
    })),
  people: (data.people ?? []).map((p) => ({
      ...p,
      badgeNumber: p.badgeNumber ?? p.badge_number ?? "",
      badge_number: undefined,
      riskScoreOverride: p.riskScoreOverride ?? p.risk_score_override ?? null,
      risk_score_override: undefined,
      riskScoreOverrideDate: p.riskScoreOverrideDate ?? p.risk_score_override_date ?? null,
      risk_score_override_date: undefined,
      riskScoreOverrideReason: p.riskScoreOverrideReason ?? p.risk_score_override_reason ?? "",
      risk_score_override_reason: undefined,
      riskScore: p.riskScore ?? p.risk_score ?? 0,
      risk_score: undefined,
      riskTier: p.riskTier ?? p.risk_tier ?? "Monitor",
      risk_tier: undefined,
      riskScoreUpdatedAt: p.riskScoreUpdatedAt ?? p.risk_score_updated_at ?? null,
      risk_score_updated_at: undefined,
      trainingDeficiencies: p.trainingDeficiencies ?? p.training_deficiencies ?? "",
      training_deficiencies: undefined,
      personnelHistory: p.personnelHistory ?? p.personnel_history ?? {
        previousComplaints: [],
        previousInvestigations: [],
        sustainedFindings: [],
        disciplinaryHistory: [],
        commendations: [],
        trainingRecords: [],
      },
      personnel_history: undefined,
      rank: p.rank ?? "",
      assignment: p.assignment ?? "",
      division: p.division ?? "",
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
    violations: (data.violations ?? []).map((item) => ({
      ...item,
      id: item.id || "",
      name: item.name || "",
      description: item.description || "",
      category: violationCategories.includes(item.category) ? item.category : "Other",
      severityLevel: violationSeverityLevels.includes(item.severityLevel) ? item.severityLevel : "Medium",
      defaultDisciplineTemplate: disciplineTemplates.includes(item.defaultDisciplineTemplate) ? item.defaultDisciplineTemplate : "None",
      notes: item.notes || "",
    })),
    policies: (data.policies ?? []).map((item) => ({
      ...item,
      id: item.id || "",
      title: item.title || "",
      description: item.description || "",
      url: item.url || "",
      linkedViolationIds: Array.isArray(item.linkedViolationIds) ? item.linkedViolationIds : [],
      category: policyCategories.includes(item.category) ? item.category : "Other",
      version: item.version || "1.0",
      effectiveDate: item.effectiveDate || "",
      documentSource: item.documentSource || "",
      notes: item.notes || "",
    })),
    investigationTemplates: (data.investigationTemplates ?? []).map((item) => ({
      ...item,
      id: item.id || "",
      name: item.name || "",
      description: item.description || "",
      category: investigationTemplateCategories.includes(item.category) ? item.category : "General",
      investigationScope: item.investigationScope || "",
      keyQuestions: Array.isArray(item.keyQuestions) ? item.keyQuestions : [],
      requiredEvidenceTypes: Array.isArray(item.requiredEvidenceTypes) ? item.requiredEvidenceTypes : [],
      linkedViolations: Array.isArray(item.linkedViolations) ? item.linkedViolations : [],
      linkedPolicies: Array.isArray(item.linkedPolicies) ? item.linkedPolicies : [],
      estimatedInvestigationDays: item.estimatedInvestigationDays || 7,
      createdBy: item.createdBy || "Admin",
      dateCreated: item.dateCreated || "",
    })),
    customOptions: {
      priorityOptions: Array.isArray(data.customOptions?.priorityOptions) ? data.customOptions.priorityOptions : [],
      investigationTypes: Array.isArray(data.customOptions?.investigationTypes) ? data.customOptions.investigationTypes : [],
    },
  };
}


function cleanupOrphanedRecords(data) {
  const validCaseIds = new Set(data.cases.map((c) => c.id));
  return {
    ...data,
    evidence: data.evidence.filter((e) => validCaseIds.has(e.caseId)),
    events: data.events.filter((e) => validCaseIds.has(e.caseId)),
    notes: data.notes.filter((n) => validCaseIds.has(n.caseId)),
    tasks: data.tasks.filter((t) => validCaseIds.has(t.caseId)),
    findings: data.findings.filter((f) => validCaseIds.has(f.caseId)),
  };
}

async function seedViolationsIfEmpty() {
  try {
    const { data: violations, error: fetchError } = await violationsService.getAll();

    if (fetchError) {
      console.error("Error fetching violations:", fetchError);
      return;
    }

    // If no violations exist, seed them
    if (!violations || violations.length === 0) {
      console.log(`Seeding ${seedData.violations.length} violations to Supabase...`);

      // Extract violations from seedData
      const violationsToSeed = seedData.violations;
      let successCount = 0;
      let failureCount = 0;

      // Insert all violations
      for (const v of violationsToSeed) {
        try {
          const { data: created, error: createError } = await violationsService.create({
            violation_code: v.id,
            title: v.name,
            description: v.description,
            category: v.category,
            severity: v.severityLevel,
            discipline_recommendations: v.defaultDisciplineTemplate,
          });

          if (createError) {
            console.error(`Failed to seed violation ${v.id}: ${createError.message}`);
            failureCount++;
          } else {
            successCount++;
          }
        } catch (err) {
          console.error(`Exception seeding violation ${v.id}:`, err);
          failureCount++;
        }
      }

      console.log(
        `Seeding complete: ${successCount} created, ${failureCount} failed`
      );
    } else {
      console.log(`Violations table already has ${violations.length} entries`);
    }
  } catch (error) {
    console.error("Error in seedViolationsIfEmpty:", error);
    // Continue anyway - violations will fall back to seedData
  }
}

async function loadDataFromSupabase() {
  try {
    // Seed violations if they don't exist
    await seedViolationsIfEmpty();

    const [
      { data: cases },
      { data: complaints },
      { data: people },
      { data: evidence },
      { data: events },
      { data: notes },
      { data: tasks },
      { data: findings },
      { data: violations },
      { data: policies },
      { data: templates },
      { data: customOpts },
      { data: documentFolders },
      { data: documents },
    ] = await Promise.all([
      casesService.getAll(),
      complaintsService.getAll(),
      peopleService.getAll(),
      evidenceService.getAll(),
      eventsService.getAll(),
      notesService.getAll(),
      tasksService.getAll(),
      findingsService.getAll(),
      violationsService.getAll(),
      policiesService.getAll(),
      templatesService.getAll(),
      customOptionsService.getAll(),
      documentFoldersService.getAll(),
      documentsService.getAll(),
    ]);

    // Map people from Supabase snake_case to camelCase
    const mappedPeople = (people || []).map(p => ({
      ...p,
      badgeNumber: p.badge_number || p.badgeNumber,
      badge_number: undefined,
    }));

    // Map cases from Supabase (keeping minimal fields)
    const mappedCases = cases || [];

    console.log("Loaded data from Supabase:", {
      cases: mappedCases?.length || 0,
      violations: violations?.length || 0,
      people: mappedPeople?.length || 0,
      policies: policies?.length || 0,
      templates: templates?.length || 0,
    });
    console.log("Raw cases from Supabase:", cases);
    console.log("Mapped cases:", mappedCases);

    return {
      cases: mappedCases || [],
      complaints: complaints || [],
      people: mappedPeople || [],
      evidence: evidence || [],
      events: events || [],
      notes: notes || [],
      tasks: tasks || [],
      findings: findings || [],
      violations: violations || [],
      policies: policies || [],
      investigationTemplates: templates || [],
      customOptions: customOpts || [],
      documentFolders: documentFolders || [],
      documents: documents || [],
    };
  } catch (error) {
    console.error("Failed to load data from Supabase:", error);
    console.log("Falling back to seedData with violations:", seedData.violations?.length || 0);
    return seedData;
  }
}

function App() {
  const [data, setData] = useState(seedData);
  const [loading, setLoading] = useState(true);
  const [activeCaseId, setActiveCaseId] = useState("");
  const [activeComplaintId, setActiveComplaintId] = useState("");
  const [activeView, setActiveView] = useState("Dashboard");

  // Load data from Supabase on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const loadedData = await loadDataFromSupabase();

        // Initialize default folders if none exist
        if (!loadedData.documentFolders || loadedData.documentFolders.length === 0) {
          const defaultFolderNames = [
            "Personnel Files",
            "Training Records",
            "Internal Affairs Reports",
            "Promotion Packets",
            "Department Policies"
          ];

          const createdFolders = [];
          for (const name of defaultFolderNames) {
            const { data: folder, error } = await documentFoldersService.create({
              name,
              document_type: "general",
            });
            if (!error && folder) {
              createdFolders.push(folder);
            }
          }
          if (createdFolders.length > 0) {
            loadedData.documentFolders = createdFolders;
          }
        }

        setData(loadedData);
        setActiveCaseId(loadedData.cases?.[0]?.id ?? "");
        setActiveComplaintId(loadedData.complaints?.[0]?.id ?? "");

        // Apply branding from Supabase if available
        const brandingOpt = loadedData.customOptions?.find(
          (opt) => opt.category === "branding"
        );

        console.log("Branding option from Supabase:", brandingOpt);

        if (brandingOpt) {
          let brandingArray = brandingOpt.options;

          // Handle different storage formats
          if (typeof brandingArray === "string") {
            try {
              brandingArray = JSON.parse(brandingArray);
            } catch (e) {
              console.error("Failed to parse branding string:", e);
              brandingArray = null;
            }
          }

          // If it's an array, parse each element if it's a string
          if (Array.isArray(brandingArray)) {
            brandingArray = brandingArray.map((item) => {
              if (typeof item === "string") {
                try {
                  return JSON.parse(item);
                } catch (e) {
                  console.error("Failed to parse branding item:", item, e);
                  return item;
                }
              }
              return item;
            });
          }

          console.log("Parsed branding array:", brandingArray);

          if (Array.isArray(brandingArray) && brandingArray.length > themeIndex) {
            const savedTheme = brandingArray[themeIndex];
            console.log("Applying saved theme:", savedTheme);

            // Apply CSS variables from saved branding
            if (savedTheme.dark)
              document.documentElement.style.setProperty("--theme-dark", savedTheme.dark);
            if (savedTheme.accent)
              document.documentElement.style.setProperty("--theme-accent", savedTheme.accent);
            if (savedTheme.departmentName)
              document.documentElement.style.setProperty("--dept-name", savedTheme.departmentName);
            if (savedTheme.departmentLogoUrl)
              document.documentElement.style.setProperty(
                "--dept-logo-url",
                savedTheme.departmentLogoUrl ? `url('${savedTheme.departmentLogoUrl}')` : "none"
              );
            if (savedTheme.reportHeaderText)
              document.documentElement.style.setProperty("--report-header", savedTheme.reportHeaderText);
            if (savedTheme.signatureBlockText)
              document.documentElement.style.setProperty("--signature-block", savedTheme.signatureBlockText);
            if (savedTheme.accentSecondaryColor)
              document.documentElement.style.setProperty("--secondary-accent", savedTheme.accentSecondaryColor);
            // Update the global themeColors
            themeColors[themeIndex] = savedTheme;
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
        // Use seedData as fallback
        setData(seedData);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const [query, setQuery] = useState("");

  const [complaintQuickAdd, setComplaintQuickAdd] = useState("complaint");

  const activeCase = data.cases.find((item) => item.id === activeCaseId) ?? data.cases[0];
  const activeComplaint = data.complaints?.find((item) => item.id === activeComplaintId) ?? data.complaints?.[0];
  const navItems = ["Dashboard", "Cases", "Evidence", "People", "Officer Profile", "Records", "Timeline", "Tasks", "Notes", "Complaints", "Adjudication", "Reports", "Settings"];
  const [themeIndex, setThemeIndex] = useState(() => {
    const saved = localStorage.getItem("theme-index");
    const index = saved ? parseInt(saved) : 0;
    return Math.min(Math.max(index, 0), themeColors.length - 1);
  });

  useMemo(() => {
    const theme = themeColors[themeIndex];
    if (theme) {
      document.documentElement.style.setProperty("--theme-dark", theme.dark);
      document.documentElement.style.setProperty("--theme-surface", theme.surface);
      document.documentElement.style.setProperty("--theme-accent", theme.accent);
      document.documentElement.style.setProperty("--theme-text", theme.text);
      document.documentElement.style.setProperty("--theme-border", theme.border);
      document.documentElement.style.setProperty("--dept-name", theme.departmentName);
      document.documentElement.style.setProperty("--dept-logo-url", theme.departmentLogoUrl ? `url('${theme.departmentLogoUrl}')` : "none");
      document.documentElement.style.setProperty("--report-header", theme.reportHeaderText);
      document.documentElement.style.setProperty("--signature-block", theme.signatureBlockText);
      document.documentElement.style.setProperty("--secondary-accent", theme.accentSecondaryColor);
      localStorage.setItem("theme-index", themeIndex.toString());
    }
  }, [themeIndex]);

  const [selectedOfficerId, setSelectedOfficerId] = useState(null);
  const [openCaseWindows, setOpenCaseWindows] = useState([]);
  const [activeCaseWindowId, setActiveCaseWindowId] = useState(null);
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);

  async function syncToSupabase(dataToSync) {
    try {
      // Sync cases
      if (dataToSync.cases?.length > 0) {
        for (const caseItem of dataToSync.cases) {
          const existing = await casesService.getOne(caseItem.id);
          if (existing.data) {
            await casesService.update(caseItem.id, caseItem);
          } else {
            await casesService.create(caseItem);
          }
        }
      }
      // Note: Full sync of all collections would go here
      // For MVP, we focus on cases sync
    } catch (error) {
      console.warn("Sync to Supabase failed:", error);
    }
  }

  function save(next) {
    setData(next);
    // Optional: Sync to Supabase (commented out for now to avoid conflicts)
    // syncToSupabase(next);
  }

  async function createCase(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = form.get("title").toString().trim();
    if (!title) return;
    const id = nextCaseNumber(data.cases);

    // Auto-set date in Eastern Standard Time
    const estDate = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
    const opened = estDate.split(',')[0]; // Get just the date part (MM/DD/YYYY)

    const caseData = {
      case_number: id,
      title,
      status: "Intake",
      priority: form.get("priority"),
      opened,
    };

    // Save to Supabase FIRST
    let supabaseId;
    try {
      const { data: createdCase, error } = await casesService.create(caseData);
      if (error) {
        alert("Error saving case: " + error.message);
        return;
      }
      supabaseId = createdCase?.id;
    } catch (error) {
      alert("Error saving case: " + error.message);
      return;
    }

    // Update local state
    const caseId = supabaseId || id;
    const next = {
      ...data,
      cases: [
        {
          id: caseId,
          title,
          status: "Intake",
          priority: form.get("priority"),
          opened,
        },
        ...data.cases,
      ],
    };
    save(next);
    setActiveCaseId(caseId);
    setShowNewCaseModal(false);
    setOpenCaseWindows([...openCaseWindows, caseId]);
    setActiveCaseWindowId(caseId);
    if (event.currentTarget) {
      event.currentTarget.reset();
    }
  }

  async function deleteCase(caseId) {
    if (!window.confirm(`Delete case ${caseId}? This action cannot be undone.`)) return;

    // Delete from Supabase FIRST (cascade delete will remove related records)
    try {
      const { error } = await casesService.delete(caseId);
      if (error) {
        alert("Error deleting case: " + error.message);
        return;
      }
    } catch (error) {
      alert("Error deleting case: " + error.message);
      return;
    }

    // Then update local state
    const next = {
      ...data,
      cases: data.cases.filter((c) => c.id !== caseId),
      evidence: data.evidence.filter((e) => e.caseId !== caseId),
      events: data.events.filter((e) => e.caseId !== caseId),
      notes: data.notes.filter((n) => n.caseId !== caseId),
      tasks: data.tasks.filter((t) => t.caseId !== caseId),
      findings: data.findings.filter((f) => f.caseId !== caseId),
    };
    save(next);
    setActiveCaseId(null);
  }

  function nextViolationCode(violations) {
    const numbers = violations
      .map((item) => String(item.id).match(/^VIOL-(\d+)$/)?.[1])
      .filter(Boolean)
      .map(Number);
    const next = numbers.length ? Math.max(...numbers) + 1 : 1;
    return `VIOL-${String(next).padStart(3, "0")}`;
  }

  async function createViolation(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = form.get("name").toString().trim();
    if (!name) return;

    const code = nextViolationCode(data.violations);

    try {
      // Create in Supabase
      await violationsService.create({
        violation_code: code,
        title: name,
        description: form.get("description").toString().trim(),
        category: form.get("category") || "Other",
        severity: form.get("severityLevel") || "Medium",
        discipline_recommendations: form.get("defaultDisciplineTemplate") || "None",
      });

      // Update local state
      const next = {
        ...data,
        violations: [
          {
            id: code,
            name,
            description: form.get("description").toString().trim(),
            category: form.get("category") || "Other",
            severityLevel: form.get("severityLevel") || "Medium",
            defaultDisciplineTemplate: form.get("defaultDisciplineTemplate") || "None",
            notes: form.get("notes").toString().trim(),
          },
          ...data.violations,
        ],
      };
      save(next);
      if (event.currentTarget) {
        event.currentTarget.reset();
      }
    } catch (error) {
      console.error("Failed to create violation:", error);
      alert("Failed to create violation. Please try again.");
    }
  }

  async function editViolation(violationId, updates) {
    try {
      // Map local field names to Supabase schema
      const supabaseUpdates = {
        violation_code: updates.id,
        title: updates.name,
        description: updates.description,
        category: updates.category,
        severity: updates.severityLevel,
        discipline_recommendations: updates.defaultDisciplineTemplate,
      };

      // Filter out undefined values
      Object.keys(supabaseUpdates).forEach(
        (key) => supabaseUpdates[key] === undefined && delete supabaseUpdates[key]
      );

      await violationsService.update(violationId, supabaseUpdates);

      const next = {
        ...data,
        violations: data.violations.map((v) =>
          v.id !== violationId ? v : { ...v, ...updates }
        ),
      };
      save(next);
    } catch (error) {
      console.error("Failed to update violation:", error);
      alert("Failed to update violation. Please try again.");
    }
  }

  async function deleteViolation(violationId) {
    if (!window.confirm(`Delete violation ${violationId}? This action cannot be undone.`)) return;

    try {
      await violationsService.delete(violationId);

      const next = {
        ...data,
        violations: data.violations.filter((v) => v.id !== violationId),
      };
      save(next);
    } catch (error) {
      console.error("Failed to delete violation:", error);
      alert("Failed to delete violation. Please try again.");
    }
  }

  function nextPolicyCode(policies) {
    const numbers = policies
      .map((item) => String(item.id).match(/^POL-(\d+)$/)?.[1])
      .filter(Boolean)
      .map(Number);
    const next = numbers.length ? Math.max(...numbers) + 1 : 1;
    return `POL-${String(next).padStart(3, "0")}`;
  }

  async function createPolicy(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = form.get("title").toString().trim();
    if (!title) return;

    const id = nextPolicyCode(data.policies);
    const policyData = {
      policy_name: title,
      description: form.get("description").toString().trim(),
      category: form.get("category") || "Other",
      version: form.get("version").toString().trim() || "1.0",
    };

    // Save to Supabase FIRST
    try {
      await policiesService.create(policyData);
    } catch (error) {
      alert("Error saving policy: " + error.message);
      return;
    }

    // Then update local state
    const next = {
      ...data,
      policies: [
        {
          id,
          title,
          description: form.get("description").toString().trim(),
          url: form.get("url").toString().trim(),
          linkedViolationIds: form
            .get("linkedViolationIds")
            .toString()
            .split(",")
            .map((x) => x.trim())
            .filter(Boolean),
          category: form.get("category") || "Other",
          version: form.get("version").toString().trim() || "1.0",
          effectiveDate: form.get("effectiveDate").toString(),
          documentSource: form.get("documentSource").toString().trim(),
          notes: form.get("notes").toString().trim(),
        },
        ...data.policies,
      ],
    };
    save(next);
    event.currentTarget.reset();
  }

  async function editPolicy(policyId, updates) {
    // Save to Supabase FIRST
    try {
      await policiesService.update(policyId, updates);
    } catch (error) {
      alert("Error updating policy: " + error.message);
      return;
    }

    // Then update local state
    const next = {
      ...data,
      policies: data.policies.map((p) =>
        p.id !== policyId ? p : { ...p, ...updates }
      ),
    };
    save(next);
  }

  async function deletePolicy(policyId) {
    if (!window.confirm(`Delete policy ${policyId}? This action cannot be undone.`)) return;

    // Delete from Supabase FIRST
    try {
      await policiesService.delete(policyId);
    } catch (error) {
      alert("Error deleting policy: " + error.message);
      return;
    }

    // Then update local state
    const next = {
      ...data,
      policies: data.policies.filter((p) => p.id !== policyId),
    };
    save(next);
  }

  function nextTemplateCode(templates) {
    const numbers = templates
      .map((item) => String(item.id).match(/^TMPL-(\d+)$/)?.[1])
      .filter(Boolean)
      .map(Number);
    const next = numbers.length ? Math.max(...numbers) + 1 : 1;
    return `TMPL-${String(next).padStart(3, "0")}`;
  }

  async function createTemplate(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = form.get("name").toString().trim();
    if (!name) return;

    const id = nextTemplateCode(data.investigationTemplates);
    const keyQuestions = form
      .get("keyQuestions")
      .toString()
      .split("\n")
      .map((x) => x.trim())
      .filter(Boolean);
    const evidenceTypes = form
      .get("requiredEvidenceTypes")
      .toString()
      .split("\n")
      .map((x) => x.trim())
      .filter(Boolean);

    const templateData = {
      template_name: name,
      description: form.get("description").toString().trim(),
      category: form.get("category") || "General",
    };

    // Save to Supabase FIRST
    try {
      await templatesService.create(templateData);
    } catch (error) {
      alert("Error saving template: " + error.message);
      return;
    }

    // Then update local state
    const next = {
      ...data,
      investigationTemplates: [
        {
          id,
          name,
          description: form.get("description").toString().trim(),
          category: form.get("category") || "General",
          investigationScope: form.get("investigationScope").toString().trim(),
          keyQuestions,
          requiredEvidenceTypes: evidenceTypes,
          linkedViolations: form
            .get("linkedViolations")
            .toString()
            .split(",")
            .map((x) => x.trim())
            .filter(Boolean),
          linkedPolicies: form
            .get("linkedPolicies")
            .toString()
            .split(",")
            .map((x) => x.trim())
            .filter(Boolean),
          estimatedInvestigationDays: parseInt(form.get("estimatedInvestigationDays") || "7"),
          createdBy: "IA Command",
          dateCreated: new Date().toISOString().slice(0, 10),
        },
        ...data.investigationTemplates,
      ],
    };
    save(next);
    event.currentTarget.reset();
  }

  async function editTemplate(templateId, updates) {
    // Save to Supabase FIRST
    try {
      await templatesService.update(templateId, updates);
    } catch (error) {
      alert("Error updating template: " + error.message);
      return;
    }

    // Then update local state
    const next = {
      ...data,
      investigationTemplates: data.investigationTemplates.map((t) =>
        t.id !== templateId ? t : { ...t, ...updates }
      ),
    };
    save(next);
  }

  async function deleteTemplate(templateId) {
    if (!window.confirm(`Delete template ${templateId}? This action cannot be undone.`)) return;

    // Delete from Supabase FIRST
    try {
      await templatesService.delete(templateId);
    } catch (error) {
      alert("Error deleting template: " + error.message);
      return;
    }

    // Then update local state
    const next = {
      ...data,
      investigationTemplates: data.investigationTemplates.filter((t) => t.id !== templateId),
    };
    save(next);
  }

  async function updateCustomDropdown(dropdownKey, newOptions) {
    // Save to Supabase FIRST
    try {
      const optionsSet = new Set(newOptions);
      await customOptionsService.updateByCategory(dropdownKey, optionsSet);
    } catch (error) {
      console.error("Error updating custom options:", error);
      // Continue with local update even if Supabase fails for better UX
    }

    // Then update local state
    const next = {
      ...data,
      customOptions: {
        ...data.customOptions,
        [dropdownKey]: newOptions,
      },
    };
    save(next);
  }

  function addOptionToDropdown(dropdownKey, option) {
    const trimmedOption = option.toString().trim();
    if (!trimmedOption) return;
    const current = data.customOptions[dropdownKey] || [];
    if (current.includes(trimmedOption)) return;
    updateCustomDropdown(dropdownKey, [...current, trimmedOption]);
  }

  function removeOptionFromDropdown(dropdownKey, option) {
    const current = data.customOptions[dropdownKey] || [];
    updateCustomDropdown(
      dropdownKey,
      current.filter((opt) => opt !== option)
    );
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

  // ============================================
  // EARLY INTERVENTION RISK SCORING
  // ============================================

  async function calculateEarlyInterventionScore(officerId, allWeights) {
    // Get officer data
    const officer = data.people.find(p => p.id === officerId);
    if (!officer) return null;

    // Get 12-month date range
    const now = new Date();
    const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    const oneEightyDaysAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);

    // Calculate signals
    const signals = {};
    const signalSnapshots = {};

    // Signal 1: Complaint count (12 months) normalized against dept max
    const allComplaints12m = data.complaints.filter(c => new Date(c.date) >= oneYearAgo);
    const officerComplaints12m = allComplaints12m.filter(c =>
      c.subjectOfficerIds && c.subjectOfficerIds.includes(officerId)
    );
    const maxComplaints = Math.max(...data.people.map(p =>
      allComplaints12m.filter(c => c.subjectOfficerIds && c.subjectOfficerIds.includes(p.id)).length
    ), 1);
    signals.complaint_count = Math.min(officerComplaints12m.length / maxComplaints, 1);
    signalSnapshots.complaint_count = {
      value: officerComplaints12m.length,
      max: maxComplaints,
      normalized: signals.complaint_count.toFixed(2)
    };

    // Signal 2: Use-of-force complaints
    const uofComplaints = officerComplaints12m.filter(c =>
      c.complaintType === "Use of Force" || c.category?.toLowerCase().includes("force")
    );
    const maxUofComplaints = Math.max(...data.people.map(p =>
      allComplaints12m.filter(c =>
        (c.complaintType === "Use of Force" || c.category?.toLowerCase().includes("force")) &&
        c.subjectOfficerIds && c.subjectOfficerIds.includes(p.id)
      ).length
    ), 1);
    signals.use_of_force_complaints = Math.min(uofComplaints.length / maxUofComplaints, 1);
    signalSnapshots.use_of_force_complaints = {
      value: uofComplaints.length,
      max: maxUofComplaints,
      normalized: signals.use_of_force_complaints.toFixed(2)
    };

    // Signal 3: Sustained finding ratio
    const officerFindings = data.findings.filter(f => {
      const finding = data.cases.find(c => c.id === f.caseId);
      return finding && finding.id && f.caseId;
    });
    const sustainedFindings = officerFindings.filter(f =>
      f.finding?.toLowerCase().includes("sustained") || f.appealStatus === "Sustained"
    );
    signals.sustained_finding_ratio = officerFindings.length > 0
      ? sustainedFindings.length / officerFindings.length
      : 0;
    signalSnapshots.sustained_finding_ratio = {
      sustained: sustainedFindings.length,
      total: officerFindings.length,
      ratio: signals.sustained_finding_ratio.toFixed(2)
    };

    // Signal 4: Complaint velocity spike (last 90 days vs prior 90 days)
    const recentComplaints = officerComplaints12m.filter(c => new Date(c.date) >= ninetyDaysAgo);
    const priorComplaints = officerComplaints12m.filter(c => {
      const cDate = new Date(c.date);
      return cDate >= oneEightyDaysAgo && cDate < ninetyDaysAgo;
    });
    const velocityRatio = priorComplaints.length > 0
      ? recentComplaints.length / priorComplaints.length
      : (recentComplaints.length > 0 ? 2 : 0);
    signals.complaint_velocity_spike = velocityRatio > 1.5 ? Math.min((velocityRatio - 1) / 2, 1) : 0;
    signalSnapshots.complaint_velocity_spike = {
      recent_90d: recentComplaints.length,
      prior_90d: priorComplaints.length,
      ratio: velocityRatio.toFixed(2),
      spike_detected: velocityRatio > 1.5
    };

    // Signal 5: Prior EI flag unresolved
    const { data: priorInterventions } = await eiInterventionsService.getByOfficer(officerId);
    const unresolvedFlags = priorInterventions?.filter(i => !i.resolved_at) || [];
    signals.prior_ei_flag_unresolved = unresolvedFlags.length > 0 ? 1 : 0;
    signalSnapshots.prior_ei_flag_unresolved = {
      has_unresolved: unresolvedFlags.length > 0,
      count: unresolvedFlags.length
    };

    // Normalize weights
    const totalWeight = Object.values(allWeights).reduce((a, b) => a + b, 0);
    const normalizedWeights = {};
    for (const key in allWeights) {
      normalizedWeights[key] = allWeights[key] / totalWeight;
    }

    // Calculate final score
    let score = 0;
    for (const signalKey in signals) {
      if (normalizedWeights[signalKey]) {
        score += signals[signalKey] * normalizedWeights[signalKey] * 100;
      }
    }
    score = Math.round(score);

    // Determine tier (default thresholds)
    let tier = "Monitor";
    if (score >= 70) tier = "Intervene";
    else if (score >= 40) tier = "Review";

    return {
      score,
      tier,
      signals,
      signalSnapshots,
      calculatedAt: new Date().toISOString()
    };
  }

  async function recalculateOfficerEIScore(officerId) {
    // Get current weights from Supabase
    const { data: weights } = await eiWeightsService.getAll();
    if (!weights || weights.length === 0) return;

    const weightMap = {};
    weights.forEach(w => {
      weightMap[w.signal_key] = w.weight;
    });

    // Calculate score
    const scoreResult = await calculateEarlyInterventionScore(officerId, weightMap);
    if (!scoreResult) return;

    // Update officer record
    try {
      await peopleService.update(officerId, {
        risk_score: scoreResult.score,
        risk_tier: scoreResult.tier,
        risk_score_updated_at: scoreResult.calculatedAt,
      });
    } catch (error) {
      console.error("Error updating officer risk score:", error);
    }

    // Save to history
    try {
      await riskScoreHistoryService.create({
        officer_id: officerId,
        score: scoreResult.score,
        tier: scoreResult.tier,
        snapshot_json: scoreResult.signalSnapshots,
      });
    } catch (error) {
      console.error("Error saving risk score history:", error);
    }

    // Check if crossed into Intervene tier and no unresolved intervention exists
    if (scoreResult.tier === "Intervene") {
      const { data: unresolvedInterventions } = await eiInterventionsService.getByOfficer(officerId);
      const hasUnresolved = unresolvedInterventions?.some(i => !i.resolved_at);

      if (!hasUnresolved) {
        // Create intervention record and auto-task
        try {
          await eiInterventionsService.create({
            officer_id: officerId,
            tier_at_flag: scoreResult.tier,
          });

          // Create task for supervisor (store in local state for now)
          const officer = data.people.find(p => p.id === officerId);
          if (officer) {
            const supervisorDivision = officer.division || "Command";
            const supervisors = data.people.filter(p =>
              p.division === supervisorDivision &&
              (p.rank?.includes("Supervisor") || p.rank?.includes("Commander") || p.rank?.includes("Chief"))
            );

            if (supervisors.length > 0) {
              const now = new Date();
              const dueDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
              const task = {
                id: `T-${String(data.tasks.length + 1).padStart(3, "0")}`,
                title: `EI Review Required — ${officer.name}`,
                status: "Open",
                priority: "High",
                due: dueDate.toISOString().slice(0, 10),
                linkedOfficerId: officerId,
                createdAt: now.toISOString(),
              };

              const next = {
                ...data,
                tasks: [task, ...data.tasks],
              };
              save(next);
            }
          }
        } catch (error) {
          console.error("Error creating EI intervention:", error);
        }
      }
    }

    return scoreResult;
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

  async function submitComplaint(event) {
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

    // Convert subject officer badge numbers to officer IDs
    const subjectBadges = parseCsv(form.get("subjectOfficerBadges")?.toString());
    const subjectOfficerIds = subjectBadges
      .map(badge => {
        const officer = data.people.find(p => p.badgeNumber === badge);
        return officer?.id;
      })
      .filter(Boolean);

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
          subjectOfficerIds,
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

    // Save to Supabase FIRST before updating local state
    try {
      const complaintData = {
        complaint_number: created.id,
        complaint_type: created.complaintType,
        complainant: created.complainant,
        contact: created.contact,
        incident: created.incident,
        status: created.status,
        description: created.description,
        narrative: created.narrative,
        category: created.category,
        supervisor_referral: created.supervisorReferral,
        screening: created.screening,
        notes: created.title,
        subject_officer_ids: created.subjectOfficerIds,
      };
      await complaintsService.create(complaintData);
    } catch (error) {
      console.error("Failed to save complaint to Supabase:", error);
      alert("Failed to save complaint. Please try again.");
      return;
    }

    // Only update local state AFTER successful Supabase save
    save(next);
    setActiveComplaintId(created.id);
    event.currentTarget.reset();
  }

  async function deleteComplaint(complaintId) {
    if (!window.confirm(`Delete complaint ${complaintId}? This action cannot be undone.`)) return;

    // Delete from Supabase FIRST
    try {
      await complaintsService.delete(complaintId);
    } catch (error) {
      alert("Error deleting complaint: " + error.message);
      return;
    }

    // Then update local state
    const next = {
      ...data,
      complaints: data.complaints.filter((c) => c.id !== complaintId),
    };
    save(next);
    setActiveComplaintId(null);
  }

async function createPerson(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    const name = (form.get("name")?.toString() ?? "").trim();
    if (!name) return;

    const personData = {
      name,
      rank: (form.get("rank")?.toString() ?? "").trim() || "",
      badge_number: (form.get("badgeNumber")?.toString() ?? "").trim() || "",
      department: (form.get("division")?.toString() ?? "").trim() || "",
      personnel_history: {
        previousComplaints: [],
        previousInvestigations: [],
        sustainedFindings: [],
        disciplinaryHistory: [],
        commendations: [],
        trainingRecords: [],
      },
    };

    try {
      // Save to Supabase
      await peopleService.create(personData);

      // Update local state
      const next = {
        ...data,
        people: [
          {
            id: `P-${String(data.people.length + 1).padStart(3, "0")}`,
            ...personData,
            // Additional fields for UI
            assignment: (form.get("assignment")?.toString() ?? "").trim() || "",
            role: (form.get("role")?.toString() ?? "").trim() || "Unspecified",
            contact: (form.get("contact")?.toString() ?? "").trim() || "",
            notes: (form.get("notes")?.toString() ?? "").trim() || "",
            caseId: (form.get("caseId")?.toString() ?? "").trim() || (activeCase?.id ?? ""),
          },
          ...data.people,
        ],
      };

      save(next);
      if (event.currentTarget) {
        event.currentTarget.reset();
      }
    } catch (error) {
      console.error("Failed to create person:", error);
      alert("Failed to add person. Please try again.");
    }
  }

  async function editPerson(personId, updates) {
    try {
      // Map UI field names to Supabase field names
      const supabaseUpdates = {
        name: updates.name,
        rank: updates.rank,
        badge_number: updates.badgeNumber,
        department: updates.division,
        personnel_history: updates.personnelHistory,
      };

      // Filter out undefined values
      Object.keys(supabaseUpdates).forEach(
        (key) => supabaseUpdates[key] === undefined && delete supabaseUpdates[key]
      );

      // Save to Supabase
      await peopleService.update(personId, supabaseUpdates);

      // Update local state
      const next = {
        ...data,
        people: data.people.map((p) =>
          p.id !== personId ? p : { ...p, ...updates }
        ),
      };
      save(next);
    } catch (error) {
      console.error("Failed to update person:", error);
      alert("Failed to update person. Please try again.");
    }
  }

  async function createFinding(event) {
    event.preventDefault();
    if (!activeCase) return;
    const form = new FormData(event.currentTarget);
    const finding = form.get("finding").toString().trim();
    if (!finding) return;

    const id = nextFindingNumber(data.findings);
    const newFinding = {
      id,
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
    };

    // Save to Supabase FIRST
    let supabaseId = null;
    try {
      const supabaseData = {
        finding_type: newFinding.finding,
        case_id: newFinding.caseId,
        description: newFinding.description,
        severity: newFinding.severityLevel,
        status: newFinding.appealStatus,
      };
      const { data: created, error } = await findingsService.create(supabaseData);
      if (error) {
        alert("Error saving finding: " + error.message);
        return;
      }
      supabaseId = created?.id;
    } catch (error) {
      alert("Error saving finding: " + error.message);
      return;
    }

    // Then update local state with Supabase ID
    const next = {
      ...data,
      findings: [{ ...newFinding, supabaseId }, ...data.findings],
    };
    save(next);
    event.currentTarget.reset();
  }

  async function editFinding(findingId, updates) {
    const finding = data.findings.find(f => f.id === findingId);
    if (!finding) return;

    // Save to Supabase FIRST if we have a Supabase ID
    if (finding.supabaseId) {
      try {
        await findingsService.update(finding.supabaseId, updates);
      } catch (error) {
        console.error("Error updating finding in Supabase:", error);
        // Continue with local update even if Supabase fails
      }
    }

    // Then update local state
    const next = {
      ...data,
      findings: data.findings.map((f) =>
        f.id !== findingId ? f : { ...f, ...updates }
      ),
    };
    save(next);
  }

  async function updateOfficerRiskScore(officerId, riskScore, reason) {
    // Save to Supabase FIRST
    try {
      await peopleService.update(officerId, {
        risk_score_override: riskScore,
        risk_score_override_date: new Date().toISOString().slice(0, 10),
        risk_score_override_reason: reason,
      });
    } catch (error) {
      alert("Error updating officer risk score: " + error.message);
      return;
    }

    // Then update local state
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

  async function updateTrainingDeficiencies(officerId, notes) {
    // Save to Supabase FIRST
    try {
      await peopleService.update(officerId, {
        training_deficiencies: notes,
      });
    } catch (error) {
      alert("Error updating training deficiencies: " + error.message);
      return;
    }

    // Then update local state
    const next = {
      ...data,
      people: data.people.map((p) =>
        p.id !== officerId ? p : { ...p, trainingDeficiencies: notes }
      ),
    };
    save(next);
  }


  async function deleteEvidence(evidenceId) {
    if (!window.confirm("Delete this evidence? This action cannot be undone.")) return;

    // Delete from Supabase FIRST
    try {
      await evidenceService.delete(evidenceId);
    } catch (error) {
      alert("Error deleting evidence: " + error.message);
      return;
    }

    // Then update local state
    const next = {
      ...data,
      evidence: data.evidence.filter((e) => e.id !== evidenceId),
    };
    save(next);
  }

  async function deleteEvent(eventId) {
    if (!window.confirm("Delete this timeline event? This action cannot be undone.")) return;

    // Delete from Supabase FIRST
    try {
      await eventsService.delete(eventId);
    } catch (error) {
      alert("Error deleting event: " + error.message);
      return;
    }

    // Then update local state
    const next = {
      ...data,
      events: data.events.filter((e) => e.id !== eventId),
    };
    save(next);
  }

  async function deleteNote(noteId) {
    if (!window.confirm("Delete this note? This action cannot be undone.")) return;

    // Delete from Supabase FIRST
    try {
      await notesService.delete(noteId);
    } catch (error) {
      alert("Error deleting note: " + error.message);
      return;
    }

    // Then update local state
    const next = {
      ...data,
      notes: data.notes.filter((n) => n.id !== noteId),
    };
    save(next);
  }

  async function deleteTask(taskId) {
    if (!window.confirm("Delete this task? This action cannot be undone.")) return;

    // Delete from Supabase FIRST
    try {
      await tasksService.delete(taskId);
    } catch (error) {
      alert("Error deleting task: " + error.message);
      return;
    }

    // Then update local state
    const next = {
      ...data,
      tasks: data.tasks.filter((t) => t.id !== taskId),
    };
    save(next);
  }

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

  const activeCasesCount = data.cases.filter((item) => !["Closed", "Archived"].includes(item.status)).length;

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

  if (loading) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "#f3f5f4",
        fontSize: "16px",
        color: "var(--theme-text)"
      }}>
        Loading cases...
      </div>
    );
  }

  return (
    <main style={{ display: "grid", gridTemplateRows: "128px 1fr", minHeight: "100vh", background: "var(--theme-dark)", color: "var(--theme-text)" }}>
      {/* Top Navigation Bar */}
      <header style={{
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        alignItems: "center",
        gap: 20,
        padding: "0 24px",
        borderBottom: `2px solid var(--theme-accent)`,
        background: "var(--theme-surface)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <ShieldCheck size={24} color="var(--theme-accent)" />
          <div>
            <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "var(--theme-text)" }}>Case Logger</p>
            <p style={{ margin: "2px 0 0 0", fontSize: 11, color: "var(--theme-text)", fontWeight: 500, opacity: 0.7 }}>Evidence & Investigation</p>
          </div>
        </div>

        <div className="searchbox" style={{ width: 300 }}>
          <Search size={18} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search cases, people, complaints..." />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "flex-end" }}>
          {themeColors[themeIndex]?.departmentLogoUrl && (
            <img
              src={themeColors[themeIndex].departmentLogoUrl}
              alt="Department Logo"
              style={{ height: 36, width: "auto", borderRadius: 4 }}
              onError={() => {}}
            />
          )}
          <div style={{ textAlign: "right" }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "var(--theme-dark)" }}>
              {themeColors[themeIndex]?.departmentName || "Police Department"}
            </p>
            <p style={{ margin: "2px 0 0 0", fontSize: 10, color: "#999" }}>
              {activeView}
            </p>
          </div>
        </div>
      </header>

      {/* Horizontal Navigation Tabs */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "auto 1fr",
        alignItems: "center",
        padding: "0 24px",
        borderBottom: `1px solid var(--theme-border)`,
        background: "var(--theme-surface)",
        gap: 0,
        position: "absolute",
        top: 128,
        left: 0,
        right: 0,
        height: 50,
        zIndex: 10
      }}>
        <nav style={{ display: "flex", gap: 2, overflow: "auto" }}>
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => setActiveView(item)}
              style={{
                all: "unset",
                padding: "12px 16px",
                fontSize: 13,
                fontWeight: item === activeView ? 700 : 500,
                color: item === activeView ? "var(--theme-accent)" : "#666",
                borderBottom: item === activeView ? `3px solid var(--theme-accent)` : "3px solid transparent",
                cursor: "pointer",
                transition: "all 0.2s",
                whiteSpace: "nowrap"
              }}
            >
              {item}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <section style={{
        gridRow: 2,
        overflow: "auto",
        marginTop: 50,
        padding: "24px"
      }}>
        {activeView === "Dashboard" && (
          <div style={{ display: "grid", gap: 24 }}>
            {/* Active Cases Metric */}
            <div style={{
              background: "var(--theme-surface)",
              border: "1px solid var(--theme-border)",
              borderRadius: 8,
              padding: "16px",
              display: "flex",
              alignItems: "center",
              gap: 12
            }}>
              <FileSearch size={20} color="var(--theme-accent)" />
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <strong style={{ fontSize: 18, color: "var(--theme-dark)" }}>{activeCasesCount}</strong>
                <span style={{ fontSize: 12, color: "#666" }}>Active cases</span>
              </div>
            </div>

            {/* Escalation Alerts Section */}
            {(() => {
              const escalatedCases = (data.complaints || []).filter(c => c.supervisorReferral?.enabled);
              const groupedByReason = {};

              escalatedCases.forEach(complaint => {
                const reason = complaint.supervisorReferral?.referralReason || "No reason provided";
                if (!groupedByReason[reason]) {
                  groupedByReason[reason] = [];
                }
                groupedByReason[reason].push(complaint);
              });

              return Object.keys(groupedByReason).length > 0 ? (
                <div style={{ padding: "24px", marginTop: 24 }}>
                  <h2 style={{ margin: "0 0 16px 0", fontSize: 18, fontWeight: 700, color: "var(--theme-text)" }}>Escalations Pending Supervisor Review</h2>
                  <div style={{ display: "grid", gap: 16 }}>
                    {Object.entries(groupedByReason).map(([reason, complaints]) => (
                      <div
                        key={reason}
                        style={{
                          background: "var(--theme-surface)",
                          border: `2px solid var(--theme-accent)`,
                          borderRadius: 8,
                          padding: 16,
                          boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                          <div
                            style={{
                              width: 12,
                              height: 12,
                              borderRadius: "50%",
                              background: "var(--theme-accent)"
                            }}
                          />
                          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "var(--theme-text)" }}>
                            {reason}
                          </h3>
                          <span
                            style={{
                              marginLeft: "auto",
                              background: "var(--theme-accent)",
                              color: "white",
                              padding: "4px 8px",
                              borderRadius: 4,
                              fontSize: 12,
                              fontWeight: 700
                            }}
                          >
                            {complaints.length} case{complaints.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                        <div style={{ display: "grid", gap: 8 }}>
                          {complaints.map((complaint) => (
                            <button
                              key={complaint.id}
                              onClick={() => setActiveComplaintId(complaint.id)}
                              style={{
                                all: "unset",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: 12,
                                background: "var(--theme-light)",
                                border: "1px solid #e5e7eb",
                                borderRadius: 6,
                                cursor: "pointer",
                                transition: "all 0.2s"
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = "#f9fafb";
                                e.currentTarget.style.borderColor = "var(--theme-accent)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = "var(--theme-light)";
                                e.currentTarget.style.borderColor = "#e5e7eb";
                              }}
                            >
                              <div style={{ textAlign: "left" }}>
                                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "var(--theme-text)" }}>
                                  {complaint.id}
                                </p>
                                <p style={{ margin: "4px 0 0 0", fontSize: 11, color: "var(--theme-text)", opacity: 0.7 }}>
                                  Type: {complaint.complaintType || "General"}
                                </p>
                              </div>
                              <div style={{ textAlign: "right" }}>
                                <span
                                  style={{
                                    background: "#FEF3C7",
                                    color: "#92400E",
                                    padding: "4px 8px",
                                    borderRadius: 4,
                                    fontSize: 11,
                                    fontWeight: 600
                                  }}
                                >
                                  Pending
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null;
            })()}

            {/* EI Flags Section */}
            {(() => {
              const eiFlags = (data.people || []).filter(p =>
                p.risk_tier === "Review" || p.risk_tier === "Intervene"
              ).sort((a, b) => (b.risk_score || 0) - (a.risk_score || 0));

              return eiFlags.length > 0 ? (
                <div style={{ padding: "24px", marginTop: 0 }}>
                  <h2 style={{ margin: "0 0 16px 0", fontSize: 18, fontWeight: 700, color: "var(--theme-text)" }}>
                    Early Intervention Flags ({eiFlags.length})
                  </h2>
                  <div style={{ display: "grid", gap: 12 }}>
                    {eiFlags.map((officer) => (
                      <button
                        key={officer.id}
                        onClick={() => {
                          setActiveView("Officer Profile");
                          document.querySelector('[data-officer-id]')?.scrollIntoView();
                        }}
                        style={{
                          all: "unset",
                          display: "grid",
                          gridTemplateColumns: "1fr auto",
                          alignItems: "center",
                          padding: 12,
                          background: officer.risk_tier === "Intervene" ? "#FCEBEB" : "#FAEEDA",
                          border: `1px solid ${officer.risk_tier === "Intervene" ? "#F5D0D0" : "#F3E8C2"}`,
                          borderRadius: 6,
                          cursor: "pointer",
                          transition: "all 0.2s"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        <div style={{ textAlign: "left" }}>
                          <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: officer.risk_tier === "Intervene" ? "#791F1F" : "#633806" }}>
                            {officer.name}
                          </p>
                          <p style={{ margin: "4px 0 0 0", fontSize: 12, color: officer.risk_tier === "Intervene" ? "#791F1F" : "#633806", opacity: 0.8 }}>
                            Badge #{officer.badgeNumber || "—"} • {officer.rank}
                          </p>
                        </div>
                        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                          <div style={{ textAlign: "right" }}>
                            <div style={{
                              fontSize: 24,
                              fontWeight: 900,
                              color: officer.risk_tier === "Intervene" ? "#791F1F" : "#633806"
                            }}>
                              {officer.risk_score || 0}
                            </div>
                            <small style={{ color: officer.risk_tier === "Intervene" ? "#791F1F" : "#633806", opacity: 0.7 }}>
                              score
                            </small>
                          </div>
                          <div style={{
                            padding: "6px 10px",
                            backgroundColor: officer.risk_tier === "Intervene" ? "#791F1F" : "#633806",
                            color: "white",
                            borderRadius: 4,
                            fontSize: 11,
                            fontWeight: 700,
                            minWidth: "70px",
                            textAlign: "center"
                          }}>
                            {officer.risk_tier}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null;
            })()}
          </div>
        )}

        {activeView === "Cases" && (
          <section style={{ display: "grid", gridTemplateRows: "auto 1fr", gap: 0, height: "100%" }}>
            {/* Toolbar: New Case button + Case tabs */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 24px", background: "var(--theme-surface)", borderBottom: "1px solid #dce4e1", overflow: "auto" }}>
              <button
                onClick={() => setShowNewCaseModal(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 12px",
                  background: "var(--theme-accent)",
                  color: "white",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: 13,
                  whiteSpace: "nowrap"
                }}
              >
                <Plus size={16} />
                New Case
              </button>

              {/* Case tabs */}
              <div style={{ display: "flex", gap: 2, borderLeft: "1px solid #dce4e1", paddingLeft: 12 }}>
                {openCaseWindows.map((caseId) => {
                  const caseItem = data.cases.find(c => c.id === caseId);
                  return (
                    <button
                      key={caseId}
                      onClick={() => {
                        setActiveCaseWindowId(caseId);
                        setActiveCaseId(caseId);
                      }}
                      style={{
                        padding: "8px 12px",
                        background: activeCaseWindowId === caseId ? "var(--theme-accent)" : "#f3f4f6",
                        color: activeCaseWindowId === caseId ? "white" : "var(--theme-text)",
                        border: "none",
                        borderRadius: "4px 4px 0 0",
                        cursor: "pointer",
                        fontWeight: activeCaseWindowId === caseId ? 700 : 500,
                        fontSize: 13,
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        maxWidth: 200,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                      }}
                      title={caseItem?.title}
                    >
                      {caseItem?.title || "Untitled"}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenCaseWindows(openCaseWindows.filter(id => id !== caseId));
                          if (activeCaseWindowId === caseId && openCaseWindows.length > 0) {
                            const nextCaseId = openCaseWindows[0] === caseId ? openCaseWindows[1] : openCaseWindows[0];
                            setActiveCaseWindowId(nextCaseId);
                            setActiveCaseId(nextCaseId);
                          }
                        }}
                        style={{
                          all: "unset",
                          cursor: "pointer",
                          fontSize: 16,
                          fontWeight: 700,
                          marginLeft: 4,
                          opacity: 0.7
                        }}
                      >
                        ✕
                      </button>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Case Detail View */}
            <div style={{ overflow: "auto" }}>
              {activeCaseWindowId && activeCase ? (
                <CaseDetail activeCase={activeCase} caseRecords={caseRecords} data={data} setData={setData} editFinding={editFinding} deleteCase={deleteCase} />
              ) : (
                <div style={{ padding: "48px 24px", textAlign: "center", color: "#999" }}>
                  <p>No case selected. Click "New Case" to get started.</p>
                </div>
              )}
            </div>

            {/* New Case Modal */}
            {showNewCaseModal && (
              <div style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000
              }}>
                <div style={{
                  background: "var(--theme-surface)",
                  borderRadius: 8,
                  padding: 24,
                  width: "100%",
                  maxWidth: 400,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.15)"
                }}>
                  <h2 style={{ margin: "0 0 20px 0", fontSize: 20, fontWeight: 700, color: "var(--theme-text)" }}>Create New Case</h2>
                  <form onSubmit={(e) => {
                    createCase(e);
                  }} style={{ display: "grid", gap: 16 }}>
                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 6, color: "var(--theme-text)", textTransform: "uppercase" }}>
                        Case Title
                      </label>
                      <input
                        name="title"
                        placeholder="Enter case title"
                        required
                        autoFocus
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          border: "1px solid var(--theme-border)",
                          borderRadius: 4,
                          fontSize: 14,
                          fontFamily: "inherit"
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 6, color: "var(--theme-text)", textTransform: "uppercase" }}>
                        Priority Level
                      </label>
                      <select
                        name="priority"
                        defaultValue="Medium"
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          border: "1px solid var(--theme-border)",
                          borderRadius: 4,
                          fontSize: 14,
                          fontFamily: "inherit"
                        }}
                      >
                        <option>Critical</option>
                        <option>High</option>
                        <option>Medium</option>
                        <option>Low</option>
                      </select>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 8 }}>
                      <button
                        type="button"
                        onClick={() => setShowNewCaseModal(false)}
                        style={{
                          padding: "10px 16px",
                          background: "#f3f4f6",
                          color: "var(--theme-text)",
                          border: "1px solid var(--theme-border)",
                          borderRadius: 4,
                          cursor: "pointer",
                          fontWeight: 700,
                          fontSize: 13
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        style={{
                          padding: "10px 16px",
                          background: "var(--theme-accent)",
                          color: "white",
                          border: "none",
                          borderRadius: 4,
                          cursor: "pointer",
                          fontWeight: 700,
                          fontSize: 13,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 6
                        }}
                      >
                        <FilePlus2 size={16} />
                        Open Case
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </section>
        )}

        {activeView === "Evidence" && <CollectionView title="Evidence" icon={Fingerprint} items={visibleRecords.evidence} render={(item) => <EvidenceItemWithDelete item={item} onDelete={deleteEvidence} />} />}
        {activeView === "People" && <PeopleView data={data} visiblePeople={visibleRecords.people} createPerson={createPerson} editPerson={editPerson} earlyInterventionByEmployeeId={earlyInterventionByEmployeeId} />}
        {activeView === "Officer Profile" && <OfficerProfileView data={data} officerProfiles={officerProfiles} selectedOfficerId={selectedOfficerId} setSelectedOfficerId={setSelectedOfficerId} updateOfficerRiskScore={updateOfficerRiskScore} updateTrainingDeficiencies={updateTrainingDeficiencies} editPerson={editPerson} />}
        {activeView === "Records" && <RecordsView data={data} setData={setData} />}
        {activeView === "Complaints" && <ComplaintsView data={data} activeCase={activeCase} visibleComplaints={visibleRecords.complaints} createComplaint={submitComplaint} deleteComplaint={deleteComplaint} setActiveComplaintId={setActiveComplaintId} />}
        {activeView === "Adjudication" && <AdjudicationTab data={data} activeCase={activeCase} editFinding={editFinding} />}

        {activeView === "Timeline" && <CollectionView title="Timeline" icon={CalendarDays} items={visibleRecords.events} render={(item) => <EventItemWithDelete item={item} onDelete={deleteEvent} />} />}
        {activeView === "Tasks" && <CollectionView title="Tasks" icon={ClipboardList} items={visibleRecords.tasks} render={(item) => <TaskItemWithDelete item={item} onDelete={deleteTask} />} />}
        {activeView === "Notes" && <CollectionView title="Notes" icon={FileSearch} items={visibleRecords.notes} render={(item) => <NoteItemWithDelete item={item} onDelete={deleteNote} />} />}
        {activeView === "Reports" && <Reports data={data} metrics={metrics} earlyInterventionByEmployeeId={earlyInterventionByEmployeeId} />}
        {activeView === "Settings" && (
          <SettingsView
            themeIndex={themeIndex}
            setThemeIndex={setThemeIndex}
            data={data}
            setData={setData}
            createViolation={createViolation}
            editViolation={editViolation}
            deleteViolation={deleteViolation}
            createPolicy={createPolicy}
            editPolicy={editPolicy}
            deletePolicy={deletePolicy}
            createTemplate={createTemplate}
            editTemplate={editTemplate}
            deleteTemplate={deleteTemplate}
            updateCustomDropdown={updateCustomDropdown}
            addOptionToDropdown={addOptionToDropdown}
            removeOptionFromDropdown={removeOptionFromDropdown}
          />
        )}

      </section>
    </main>
  );
}

function MetricGrid({ metrics }) {
  return (
    <section style={{
      display: "flex",
      flexDirection: "column",
      gap: 12,
      marginLeft: "auto",
      width: "fit-content"
    }}>
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <article style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 16px",
            background: "var(--theme-surface)",
            border: "1px solid var(--theme-border)",
            borderRadius: 8,
            minWidth: 200
          }} key={metric.label}>
            <Icon size={20} color="var(--theme-accent)" />
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <strong style={{ fontSize: 18, color: "var(--theme-dark)" }}>{metric.value}</strong>
              <span style={{ fontSize: 12, color: "#666" }}>{metric.label}</span>
            </div>
          </article>
        );
      })}
    </section>
  );
}

function CaseDetail({ activeCase, caseRecords, data, setData, editFinding, deleteCase }) {
  return (
    <section style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 12, height: "100%", overflow: "auto" }}>
      {activeCase ? (
        <>
          {/* Left: Case header and report */}
          <div style={{ display: "grid", gridTemplateRows: "auto auto 1fr auto", gap: 12 }}>
            {/* Case Header */}
            <div>
              <span style={{ fontSize: 12, color: "#999", fontWeight: 600 }}>{activeCase.id}</span>
              <h2 style={{ margin: "4px 0 0 0", fontSize: 24, fontWeight: 700, color: "var(--theme-text)" }}>{activeCase.title}</h2>
              <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                <Pill value={activeCase.status} />
                <Pill value={activeCase.priority} />
                <span style={{ fontSize: 12, color: "#999" }}>Opened {activeCase.opened}</span>
              </div>
            </div>

            {/* Report Text Area with Toolbar */}
            <div style={{ border: "1px solid var(--theme-border)", borderRadius: 8, overflow: "hidden", display: "grid", gridTemplateRows: "auto 1fr" }}>
              <div style={{ background: "#f9fafb", borderBottom: "1px solid #dce4e1", padding: "8px 12px", display: "flex", gap: 8, alignItems: "center" }}>
                <button type="button" title="Bold" style={{ all: "unset", padding: "4px 8px", cursor: "pointer", fontWeight: 700, fontSize: 12 }}>B</button>
                <button type="button" title="Italic" style={{ all: "unset", padding: "4px 8px", cursor: "pointer", fontStyle: "italic", fontSize: 12 }}>I</button>
                <div style={{ width: "1px", height: 16, background: "#dce4e1" }} />
                <button type="button" title="Bullet List" style={{ all: "unset", padding: "4px 8px", cursor: "pointer", fontSize: 12 }}>• List</button>
              </div>
              <textarea
                placeholder="Enter case report here..."
                value={activeCase.report || ""}
                onChange={(e) => {
                  const updated = { ...activeCase, report: e.target.value };
                  const newData = {
                    ...data,
                    cases: data.cases.map(c => c.id === activeCase.id ? updated : c)
                  };
                  setData(newData);

                  // Debounce save to Supabase (save after 1 second of no changes)
                  clearTimeout(window.reportSaveTimeout);
                  window.reportSaveTimeout = setTimeout(() => {
                    casesService.update(activeCase.id, { report: e.target.value }).catch(err => console.error("Failed to save report:", err));
                  }, 1000);
                }}
                style={{
                  padding: 12,
                  border: "none",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  fontSize: 14,
                  resize: "none",
                  outline: "none"
                }}
              />
            </div>

            {/* Other Sections */}
            <div style={{ display: "grid", gap: 12, overflow: "auto" }}>
              <RecordPanel title="Tasks" icon={CheckCircle2} items={caseRecords.tasks} render={TaskItem} />
              <RecordPanel title="Notes" icon={FileSearch} items={caseRecords.notes} render={NoteItem} wide />
              <RecordPanel title="Timeline" icon={Clock} items={caseRecords.events} render={EventItem} />
              <RecordPanel title="Findings & Adjudication" icon={CheckCircle2} items={caseRecords.findings} render={FindingItem} wide />
            </div>

            <AdjudicationPanel caseId={activeCase.id} findings={caseRecords.findings} editFinding={editFinding} people={data.people} />
          </div>

          {/* Right: Evidence and People & Entities */}
          <div style={{ display: "grid", gridTemplateRows: "auto auto 1fr auto", gap: 12 }}>
            {/* Evidence */}
            <div style={{ background: "var(--theme-surface)", border: "1px solid var(--theme-border)", borderRadius: 8, padding: 12 }}>
              <h4 style={{ margin: "0 0 8px 0", fontSize: 13, fontWeight: 700, color: "var(--theme-text)", display: "flex", alignItems: "center", gap: 6 }}>
                <Fingerprint size={16} />
                Evidence
              </h4>
              <div style={{ display: "grid", gap: 6, maxHeight: "120px", overflowY: "auto" }}>
                {caseRecords.evidence?.length ? (
                  caseRecords.evidence.map((item) => (
                    <div key={item.id} style={{ background: "#f6f9f7", padding: 6, borderRadius: 4, fontSize: 11, color: "var(--theme-text)" }}>
                      <strong>{item.type}</strong>
                    </div>
                  ))
                ) : (
                  <p style={{ margin: 0, color: "#999", fontSize: 11 }}>No evidence added</p>
                )}
              </div>
            </div>

            {/* People & Entities */}
            <div style={{ background: "var(--theme-surface)", border: "1px solid var(--theme-border)", borderRadius: 8, padding: 12 }}>
              <h4 style={{ margin: "0 0 8px 0", fontSize: 13, fontWeight: 700, color: "var(--theme-text)", display: "flex", alignItems: "center", gap: 6 }}>
                <UserRound size={16} />
                People
              </h4>
              <div style={{ display: "grid", gap: 6, maxHeight: "120px", overflowY: "auto" }}>
                {caseRecords.people?.length ? (
                  caseRecords.people.map((item) => (
                    <div key={item.id} style={{ background: "#f0f5f9", padding: 6, borderRadius: 4, fontSize: 11, color: "var(--theme-text)" }}>
                      <strong>{item.name}</strong>
                      {item.badgeNumber && <div style={{ fontSize: 10, color: "#999" }}>#{item.badgeNumber}</div>}
                    </div>
                  ))
                ) : (
                  <p style={{ margin: 0, color: "#999", fontSize: 11 }}>No people added</p>
                )}
              </div>
            </div>

            {/* Delete Button */}
            <button
              type="button"
              onClick={() => deleteCase(activeCase.id)}
              style={{
                marginTop: "auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                border: 0,
                background: "#fee5e3",
                color: "#b6492b",
                borderRadius: 6,
                padding: "8px 12px",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: 13,
              }}
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </>
      ) : (
        <div style={{ gridColumn: "1/-1", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 300, color: "#999", fontSize: 14 }}>
          Create a case to begin logging records.
        </div>
      )}
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
        {[item.assignment, item.division].filter(Boolean).join(" · ") || item.notes}
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
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    alignItems: "start",
                    gap: 16,
                    width: "100%",
                    paddingBottom: 12,
                    borderBottom: "1px solid #edf1ef",
                    marginBottom: 12,
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <div>
                    <PersonItem {...item} />
                  </div>
                  {/* Risk Score Badge */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                    <div style={{
                      padding: "6px 10px",
                      backgroundColor: item.risk_tier === "Intervene" ? "#FCEBEB" :
                                       item.risk_tier === "Review" ? "#FAEEDA" : "#EAF3DE",
                      color: item.risk_tier === "Intervene" ? "#791F1F" :
                             item.risk_tier === "Review" ? "#633806" : "#27500A",
                      borderRadius: 4,
                      fontSize: 11,
                      fontWeight: 700,
                      minWidth: "60px",
                      textAlign: "center"
                    }}>
                      {item.risk_tier || "Monitor"}
                    </div>
                    <div style={{
                      fontSize: 16,
                      fontWeight: 900,
                      color: item.risk_tier === "Intervene" ? "#791F1F" :
                             item.risk_tier === "Review" ? "#633806" : "#27500A"
                    }}>
                      {item.risk_score || 0}
                    </div>
                  </div>
                  {earlyInterventionByEmployeeId?.[item.id]?.flags?.length ? (
                    <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
                      {earlyInterventionByEmployeeId[item.id].flags.map((f, idx) => (
                        <div key={idx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                          <span className={`pill ${f.severity === "critical" ? "critical" : "needs-review"}`} style={{ fontWeight: 900 }}>
                            {f.type}
                          </span>
                          <small style={{ color: "var(--theme-text)" }}>
                            {f.count} occurrence{f.count === 1 ? "" : "s"}
                            {f.windowStart && f.windowEnd ? ` · ${f.windowStart} → ${f.windowEnd}` : ""}
                          </small>
                        </div>
                      ))}
                      {earlyInterventionByEmployeeId[item.id].summary ? (
                        <small style={{ color: "var(--theme-text)" }}>
                          {earlyInterventionByEmployeeId[item.id].summary}
                        </small>
                      ) : null}
                    </div>
                  ) : (
                    <small style={{ color: "var(--theme-text)" }}>No early intervention flags</small>
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

function EvidenceItemWithDelete({ item, onDelete }) {
  return (
    <div className="record" style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12, alignItems: "start" }}>
      <div>
        <strong>{item.title}</strong>
        <span>
          <Fingerprint size={14} /> {item.id} · {item.type}
        </span>
        <small>{item.description}</small>
        <span>
          <Link2 size={14} /> {item.source} · {item.obtained}
        </span>
      </div>
      <button
        onClick={() => onDelete(item.id)}
        style={{
          padding: "6px 10px",
          background: "#fee5e3",
          color: "#b6492b",
          border: "1px solid #fbbf9f",
          borderRadius: 4,
          cursor: "pointer",
          fontSize: 11,
          fontWeight: 600,
        }}
        title="Delete evidence"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

function EventItemWithDelete({ item, onDelete }) {
  return (
    <div className="record" style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12, alignItems: "start" }}>
      <div>
        <strong>{item.title}</strong>
        <span>
          <CalendarDays size={14} /> {item.date} {item.time}
        </span>
        <span>
          <MapPin size={14} /> {item.location}
        </span>
      </div>
      <button
        onClick={() => onDelete(item.id)}
        style={{
          padding: "6px 10px",
          background: "#fee5e3",
          color: "#b6492b",
          border: "1px solid #fbbf9f",
          borderRadius: 4,
          cursor: "pointer",
          fontSize: 11,
          fontWeight: 600,
        }}
        title="Delete event"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

function TaskItemWithDelete({ item, onDelete }) {
  return (
    <div className="record" style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12, alignItems: "start" }}>
      <div>
        <strong>{item.title}</strong>
        <span>
          <AlertCircle size={14} /> {item.priority} · {item.status}
        </span>
        <span>
          <Clock size={14} /> Due {item.due}
        </span>
      </div>
      <button
        onClick={() => onDelete(item.id)}
        style={{
          padding: "6px 10px",
          background: "#fee5e3",
          color: "#b6492b",
          border: "1px solid #fbbf9f",
          borderRadius: 4,
          cursor: "pointer",
          fontSize: 11,
          fontWeight: 600,
        }}
        title="Delete task"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

function NoteItemWithDelete({ item, onDelete }) {
  return (
    <div className="record" style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12, alignItems: "start" }}>
      <div>
        <strong>{item.title}</strong>
        <small>{item.body}</small>
        <span>
          <Archive size={14} /> {item.tag} · {item.created}
        </span>
      </div>
      <button
        onClick={() => onDelete(item.id)}
        style={{
          padding: "6px 10px",
          background: "#fee5e3",
          color: "#b6492b",
          border: "1px solid #fbbf9f",
          borderRadius: 4,
          cursor: "pointer",
          fontSize: 11,
          fontWeight: 600,
        }}
        title="Delete note"
      >
        <Trash2 size={14} />
      </button>
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
            <small style={{ display: "block", color: "var(--theme-text)" }}>{f.id}</small>
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
                  <small style={{ display: "block", color: "var(--theme-text)", marginTop: 2 }}>{finding.id} · {finding.caseId}</small>
                  <small style={{ display: "block", color: "var(--theme-text)", marginTop: 4 }}>{finding.description}</small>
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

function RecordsView({ data, setData }) {
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadFormData, setUploadFormData] = useState({
    title: "",
    documentType: "personnel_file",
    folderId: null,
    description: "",
  });

  const rootFolders = (data.documentFolders || []).filter(f => !f.parent_folder_id);
  const selectedFolder = data.documentFolders?.find(f => f.id === selectedFolderId);
  const selectedDocument = data.documents?.find(d => d.id === selectedDocumentId);

  const documentsInFolder = selectedFolderId
    ? (data.documents || []).filter(d => d.folder_id === selectedFolderId)
    : [];

  const filteredDocuments = documentsInFolder.filter(d =>
    d.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getChildFolders = (parentId) => {
    return (data.documentFolders || []).filter(f => f.parent_folder_id === parentId);
  };

  const toggleFolderExpansion = (folderId) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const FolderTreeItem = ({ folder, level = 0 }) => {
    const children = getChildFolders(folder.id);
    const isExpanded = expandedFolders.has(folder.id);

    return (
      <div key={folder.id} style={{ paddingLeft: `${level * 16}px` }}>
        <div
          style={{
            padding: "8px 8px",
            cursor: "pointer",
            backgroundColor: selectedFolderId === folder.id ? "var(--theme-accent)" : "transparent",
            color: selectedFolderId === folder.id ? "#fff" : "var(--theme-text)",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "2px",
          }}
          onClick={() => {
            setSelectedFolderId(folder.id);
            setSelectedDocumentId(null);
          }}
        >
          {children.length > 0 && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                toggleFolderExpansion(folder.id);
              }}
              style={{ cursor: "pointer", userSelect: "none" }}
            >
              {isExpanded ? "▼" : "▶"}
            </span>
          )}
          {children.length === 0 && <span style={{ width: "16px" }} />}
          📁 {folder.name}
        </div>
        {isExpanded && children.map(child => <FolderTreeItem key={child.id} folder={child} level={level + 1} />)}
      </div>
    );
  };

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newFolder = {
      name: formData.get("folderName"),
      parent_folder_id: selectedFolderId,
      document_type: "general",
    };

    const { data: created, error } = await documentFoldersService.create(newFolder);
    if (!error) {
      setData(prev => ({
        ...prev,
        documentFolders: [...(prev.documentFolders || []), created],
      }));
      e.currentTarget.reset();
    } else {
      alert("Error creating folder: " + error.message);
    }
  };

  const handleUploadDocument = async (e) => {
    e.preventDefault();
    if (!selectedFolderId) {
      alert("Please select a folder first");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const file = formData.get("file");

    if (!file) {
      alert("Please select a file");
      return;
    }

    const docId = crypto.randomUUID();
    const storagePath = `${selectedFolderId}/${docId}/${file.name}`;

    const { error: uploadError } = await storageService.uploadDocument("documents", storagePath, file);
    if (uploadError) {
      alert("Upload error: " + uploadError.message);
      return;
    }

    const newDocument = {
      title: uploadFormData.title || file.name,
      filename: file.name,
      document_type: uploadFormData.documentType,
      folder_id: selectedFolderId,
      description: uploadFormData.description,
      storage_path: storagePath,
      file_size: file.size,
      mime_type: file.type,
    };

    const { data: created, error } = await documentsService.create(newDocument);
    if (!error) {
      setData(prev => ({
        ...prev,
        documents: [...(prev.documents || []), created],
      }));
      setUploadFormData({ title: "", documentType: "personnel_file", folderId: null, description: "" });
      setShowUploadForm(false);
      e.currentTarget.reset();
    } else {
      alert("Error saving document: " + error.message);
    }
  };

  return (
    <section style={{ display: "grid", gridTemplateColumns: "250px 1fr", gap: "24px", height: "100%", minHeight: "600px" }}>
      <aside style={{ overflowY: "auto", paddingRight: "12px" }}>
        <h3 style={{ marginBottom: "16px", color: "var(--theme-text)", fontSize: "14px" }}>FOLDERS</h3>
        <div style={{ marginBottom: "16px" }}>
          {rootFolders.length === 0 ? (
            <p style={{ color: "var(--theme-text)", fontSize: "12px" }}>No folders yet</p>
          ) : (
            rootFolders.map(folder => <FolderTreeItem key={folder.id} folder={folder} />)
          )}
        </div>

        {selectedFolderId && (
          <form onSubmit={handleCreateFolder} style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #dce4e1" }}>
            <input
              type="text"
              name="folderName"
              placeholder="New folder name"
              style={{
                width: "100%",
                padding: "8px",
                marginBottom: "8px",
                border: "1px solid var(--theme-border)",
                borderRadius: "4px",
                fontSize: "12px",
              }}
              required
            />
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "6px 12px",
                backgroundColor: "var(--theme-accent)",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              Create Folder
            </button>
          </form>
        )}
      </aside>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div>
          <h2 style={{ marginBottom: "12px", color: "var(--theme-text)" }}>
            {selectedFolder ? selectedFolder.name : "Records"}
          </h2>
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              maxWidth: "400px",
              padding: "8px 12px",
              border: "1px solid var(--theme-border)",
              borderRadius: "4px",
              fontSize: "13px",
            }}
          />
        </div>

        {selectedFolderId && (
          <button
            onClick={() => setShowUploadForm(!showUploadForm)}
            style={{
              alignSelf: "flex-start",
              padding: "8px 16px",
              backgroundColor: "var(--theme-accent)",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "13px",
            }}
          >
            {showUploadForm ? "Cancel" : "Upload Document"}
          </button>
        )}

        {showUploadForm && selectedFolderId && (
          <form
            onSubmit={handleUploadDocument}
            style={{
              padding: "16px",
              backgroundColor: "#f5f5f5",
              borderRadius: "4px",
              marginBottom: "16px",
            }}
          >
            <div style={{ marginBottom: "12px" }}>
              <label style={{ display: "block", fontSize: "12px", marginBottom: "4px" }}>
                DOCUMENT TITLE
              </label>
              <input
                type="text"
                placeholder="Leave blank for filename"
                value={uploadFormData.title}
                onChange={(e) => setUploadFormData({ ...uploadFormData, title: e.target.value })}
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid var(--theme-border)",
                  borderRadius: "4px",
                  fontSize: "12px",
                }}
              />
            </div>

            <div style={{ marginBottom: "12px" }}>
              <label style={{ display: "block", fontSize: "12px", marginBottom: "4px" }}>
                DOCUMENT TYPE
              </label>
              <select
                value={uploadFormData.documentType}
                onChange={(e) => setUploadFormData({ ...uploadFormData, documentType: e.target.value })}
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid var(--theme-border)",
                  borderRadius: "4px",
                  fontSize: "12px",
                }}
              >
                <option value="personnel_file">Personnel File</option>
                <option value="training_record">Training Record</option>
                <option value="ia_report">IA Report</option>
                <option value="promotion_packet">Promotion Packet</option>
                <option value="policy">Policy Document</option>
              </select>
            </div>

            <div style={{ marginBottom: "12px" }}>
              <label style={{ display: "block", fontSize: "12px", marginBottom: "4px" }}>
                DESCRIPTION (OPTIONAL)
              </label>
              <textarea
                placeholder="Add notes about this document"
                value={uploadFormData.description}
                onChange={(e) => setUploadFormData({ ...uploadFormData, description: e.target.value })}
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid var(--theme-border)",
                  borderRadius: "4px",
                  fontSize: "12px",
                  minHeight: "60px",
                  fontFamily: "system-ui",
                }}
              />
            </div>

            <div style={{ marginBottom: "12px" }}>
              <label style={{ display: "block", fontSize: "12px", marginBottom: "4px" }}>
                SELECT FILE
              </label>
              <input
                type="file"
                name="file"
                required
                style={{ fontSize: "12px" }}
              />
            </div>

            <button
              type="submit"
              style={{
                padding: "8px 16px",
                backgroundColor: "var(--theme-accent)",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "13px",
              }}
            >
              Upload
            </button>
          </form>
        )}

        <div style={{ flex: 1, display: "grid", gridTemplateRows: "auto 1fr auto", gap: "16px" }}>
          <div style={{ borderBottom: "1px solid #dce4e1" }}>
            <h3 style={{ marginBottom: "12px", color: "var(--theme-text)", fontSize: "13px" }}>
              DOCUMENTS ({filteredDocuments.length})
            </h3>
          </div>

          <div style={{ overflowY: "auto" }}>
            {filteredDocuments.length === 0 ? (
              <p style={{ color: "var(--theme-text)", fontSize: "13px" }}>
                {selectedFolderId ? "No documents in this folder" : "Select a folder to view documents"}
              </p>
            ) : (
              filteredDocuments.map(doc => (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDocumentId(doc.id)}
                  style={{
                    padding: "10px 12px",
                    backgroundColor: selectedDocumentId === doc.id ? "var(--theme-accent)" : "transparent",
                    color: selectedDocumentId === doc.id ? "#fff" : "var(--theme-text)",
                    borderRadius: "4px",
                    cursor: "pointer",
                    marginBottom: "4px",
                    fontSize: "13px",
                    border: selectedDocumentId === doc.id ? "1px solid var(--theme-accent)" : "1px solid transparent",
                  }}
                >
                  📄 {doc.title || doc.filename}
                </div>
              ))
            )}
          </div>

          {selectedDocument && (
            <div style={{ paddingTop: "16px", borderTop: "1px solid #dce4e1" }}>
              <h3 style={{ color: "var(--theme-text)", fontSize: "13px", marginBottom: "8px" }}>
                DOCUMENT INFO
              </h3>
              <div style={{ fontSize: "12px", color: "var(--theme-text)", lineHeight: "1.6" }}>
                <p><strong>Title:</strong> {selectedDocument.title || selectedDocument.filename}</p>
                <p><strong>Type:</strong> {selectedDocument.document_type}</p>
                <p><strong>Size:</strong> {selectedDocument.file_size ? (selectedDocument.file_size / 1024).toFixed(1) + " KB" : "Unknown"}</p>
                <p><strong>Uploaded:</strong> {new Date(selectedDocument.created_at).toLocaleDateString()}</p>
                {selectedDocument.description && (
                  <p><strong>Notes:</strong> {selectedDocument.description}</p>
                )}
                <button
                  onClick={() => {
                    const publicUrl = storageService.getPublicUrl("documents", selectedDocument.storage_path);
                    window.open(publicUrl, "_blank");
                  }}
                  style={{
                    marginTop: "8px",
                    padding: "6px 12px",
                    backgroundColor: "var(--theme-accent)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                >
                  Download
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function OfficerProfileView({ data, officerProfiles, selectedOfficerId, setSelectedOfficerId, updateOfficerRiskScore, updateTrainingDeficiencies, editPerson }) {
  const profile = selectedOfficerId ? officerProfiles[selectedOfficerId] : null;

  if (!data.people.length) {
    return <section className="collection-view"><p className="empty">No officers found.</p></section>;
  }

  const sortedOfficers = data.people.slice().sort((a, b) => a.name.localeCompare(b.name));

  return (
    <section className="collection-view">
      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 16, minHeight: "80vh" }}>
        {/* Officer Selector Sidebar */}
        <div style={{ background: "#ffffff", border: "1px solid var(--theme-border)", borderRadius: 8, padding: 16, overflow: "auto" }}>
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
                <small style={{ color: "var(--theme-text)", display: "block" }}>{officer.rank || "Officer"}</small>
                <small style={{ color: "var(--theme-text)" }}>#{officer.badgeNumber || "—"}</small>
              </button>
            ))}
          </div>
        </div>

        {/* Officer Profile Details */}
        {profile ? (
          <div style={{ overflow: "auto" }}>
            {/* Edit Officer Info Form */}
            <div style={{ background: "#ffffff", border: "1px solid var(--theme-border)", borderRadius: 8, padding: 16, marginBottom: 16 }}>
              <h3 style={{ margin: "0 0 16px" }}>Officer Information</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  editPerson(profile.officer.id, {
                    rank: fd.get("rank").toString(),
                    badgeNumber: fd.get("badgeNumber").toString(),
                    assignment: fd.get("assignment").toString(),
                    division: fd.get("division").toString(),
                    contact: fd.get("contact").toString(),
                  });
                  alert("Officer information updated!");
                }}
                style={{ display: "grid", gap: 12 }}
              >
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "var(--theme-text)", textTransform: "uppercase" }}>Rank</label>
                    <select name="rank" defaultValue={profile.officer.rank || ""} style={{ width: "100%" }}>
                      <option value="">Select Rank</option>
                      <option value="Chief of Police">Chief of Police</option>
                      <option value="Deputy Chief">Deputy Chief</option>
                      <option value="Commander">Commander</option>
                      <option value="Captain">Captain</option>
                      <option value="Lieutenant">Lieutenant</option>
                      <option value="Sergeant">Sergeant</option>
                      <option value="Corporal">Corporal</option>
                      <option value="Officer">Officer</option>
                      <option value="Cadet">Cadet</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "var(--theme-text)", textTransform: "uppercase" }}>Badge #</label>
                    <input name="badgeNumber" type="text" defaultValue={profile.officer.badgeNumber || ""} placeholder="e.g., 201" style={{ width: "100%" }} />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "var(--theme-text)", textTransform: "uppercase" }}>Assignment</label>
                    <input name="assignment" type="text" defaultValue={profile.officer.assignment || ""} placeholder="e.g., Patrol Division" style={{ width: "100%" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "var(--theme-text)", textTransform: "uppercase" }}>Division</label>
                    <input name="division" type="text" defaultValue={profile.officer.division || ""} placeholder="e.g., Special Operations" style={{ width: "100%" }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "var(--theme-text)", textTransform: "uppercase" }}>Contact Info</label>
                  <input name="contact" type="text" defaultValue={profile.officer.contact || ""} placeholder="e.g., phone, email, or address" style={{ width: "100%" }} />
                </div>

                <button type="submit" className="primary" style={{ width: "100%" }}>Save Officer Information</button>
              </form>
            </div>

            {/* Early Intervention Risk Panel */}
            <div style={{ background: "#ffffff", border: "1px solid var(--theme-border)", borderRadius: 8, padding: 16, marginBottom: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 24, alignItems: "start" }}>
                {/* Risk Score Display */}
                <div>
                  <h3 style={{ margin: "0 0 16px", color: "var(--theme-text)" }}>Risk Assessment</h3>

                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 48, fontWeight: 900, lineHeight: 1 }}>
                      <span style={{
                        color: profile.officer.risk_tier === "Intervene" ? "#791F1F" :
                               profile.officer.risk_tier === "Review" ? "#633806" : "#27500A"
                      }}>
                        {profile.officer.risk_score ?? 0}
                      </span>
                    </div>
                    <small style={{ color: "var(--theme-text)", display: "block", marginTop: 8 }}>Risk Score</small>
                  </div>

                  {/* Tier Badge */}
                  <div style={{
                    padding: "8px 12px",
                    borderRadius: 4,
                    backgroundColor: profile.officer.risk_tier === "Intervene" ? "#FCEBEB" :
                                     profile.officer.risk_tier === "Review" ? "#FAEEDA" : "#EAF3DE",
                    color: profile.officer.risk_tier === "Intervene" ? "#791F1F" :
                           profile.officer.risk_tier === "Review" ? "#633806" : "#27500A",
                    fontWeight: 700,
                    fontSize: 12,
                    textAlign: "center",
                    marginBottom: 16,
                  }}>
                    {profile.officer.risk_tier || "Monitor"}
                  </div>

                  <button
                    onClick={() => recalculateOfficerEIScore(profile.officer.id)}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      backgroundColor: "var(--theme-accent)",
                      color: "#fff",
                      border: "none",
                      borderRadius: 4,
                      cursor: "pointer",
                      fontSize: 12,
                      fontWeight: 600,
                      marginBottom: 12,
                    }}
                  >
                    Recalculate Score
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm(`Create EI intervention task for ${profile.officer.name}?`)) {
                        const task = {
                          id: `T-${String(data.tasks.length + 1).padStart(3, "0")}`,
                          title: `EI Review Required — ${profile.officer.name}`,
                          status: "Open",
                          priority: "High",
                          due: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
                          linkedOfficerId: profile.officer.id,
                        };
                        const next = {
                          ...data,
                          tasks: [task, ...data.tasks],
                        };
                        save(next);
                        alert("Intervention task created!");
                      }
                    }}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      backgroundColor: "#fee5e3",
                      color: "#b6492b",
                      border: "1px solid #fbbf9f",
                      borderRadius: 4,
                      cursor: "pointer",
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    Notify Supervisor
                  </button>

                  <small style={{ display: "block", marginTop: 12, color: "#666", fontSize: 11 }}>
                    ⓘ Risk scores are a screening tool, not a finding.
                  </small>
                </div>

                {/* Signal Breakdown */}
                <div>
                  <h4 style={{ margin: "0 0 12px", color: "var(--theme-text)", fontSize: 13 }}>RISK SIGNAL BREAKDOWN</h4>
                  <div style={{ display: "grid", gap: 12 }}>
                    {[
                      { label: "Complaint Count", value: Math.round((profile.officer.risk_score ?? 0) * 0.25), max: 25 },
                      { label: "Use-of-Force", value: Math.round((profile.officer.risk_score ?? 0) * 0.30), max: 30 },
                      { label: "Sustained Ratio", value: Math.round((profile.officer.risk_score ?? 0) * 0.20), max: 20 },
                      { label: "Complaint Velocity", value: Math.round((profile.officer.risk_score ?? 0) * 0.15), max: 15 },
                      { label: "Prior Flag", value: Math.round((profile.officer.risk_score ?? 0) * 0.10), max: 10 },
                    ].map((signal, idx) => (
                      <div key={idx}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                          <small style={{ fontSize: 12, color: "var(--theme-text)" }}>{signal.label}</small>
                          <small style={{ fontSize: 12, fontWeight: 600, color: "var(--theme-text)" }}>{signal.value}pts</small>
                        </div>
                        <div style={{ height: 8, backgroundColor: "#e5e7eb", borderRadius: 4, overflow: "hidden" }}>
                          <div style={{
                            height: "100%",
                            width: `${Math.min(signal.value / signal.max * 100, 100)}%`,
                            backgroundColor: signal.value > 15 ? "#dc2626" : signal.value > 8 ? "#f59e0b" : "#16a34a",
                            transition: "width 0.3s ease"
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Score History Sparkline */}
                  <div style={{ marginTop: 16, paddingTop: 12, borderTop: "1px solid #e5e7eb" }}>
                    <small style={{ fontSize: 12, color: "var(--theme-text)" }}>SCORE HISTORY (Last 6)</small>
                    <svg width="100%" height="40" style={{ marginTop: 8 }} viewBox="0 0 200 40">
                      {/* Placeholder sparkline - would be populated with actual history */}
                      <polyline
                        points="0,30 40,25 80,20 120,18 160,22 200,20"
                        fill="none"
                        stroke="var(--theme-accent)"
                        strokeWidth="2"
                      />
                      <circle cx="0" cy="30" r="2" fill="var(--theme-accent)" />
                      <circle cx="40" cy="25" r="2" fill="var(--theme-accent)" />
                      <circle cx="80" cy="20" r="2" fill="var(--theme-accent)" />
                      <circle cx="120" cy="18" r="2" fill="var(--theme-accent)" />
                      <circle cx="160" cy="22" r="2" fill="var(--theme-accent)" />
                      <circle cx="200" cy="20" r="2" fill="var(--theme-accent)" />
                    </svg>
                  </div>
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
                <div key={idx} style={{ background: "#ffffff", border: "1px solid var(--theme-border)", borderRadius: 8, padding: 16 }}>
                  <small style={{ color: "var(--theme-text)", display: "block", marginBottom: 8 }}>{metric.label}</small>
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
            <div style={{ background: "#ffffff", border: "1px solid var(--theme-border)", borderRadius: 8, padding: 16, marginBottom: 16 }}>
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
                  <small style={{ color: "var(--theme-text)" }}>Override date: {profile.riskScoreOverrideDate}</small>
                )}
              </div>
            </div>

            {/* Training Deficiencies */}
            <div style={{ background: "#ffffff", border: "1px solid var(--theme-border)", borderRadius: 8, padding: 16, marginBottom: 16 }}>
              <h3 style={{ margin: "0 0 12px" }}>Training Deficiencies</h3>
              <textarea
                value={profile.trainingDeficiencies}
                onChange={(e) => updateTrainingDeficiencies(profile.officer.id, e.target.value)}
                placeholder="Notes on training gaps, required trainings, etc."
                style={{ minHeight: 100, width: "100%" }}
              />
            </div>

            {/* Complaints Against This Officer */}
            {(() => {
              const complaintsAgainstOfficer = (data.complaints || []).filter(complaint =>
                complaint.subjectOfficerIds && complaint.subjectOfficerIds.includes(profile.officer.id)
              );
              return (
                <div style={{ background: "#ffffff", border: "1px solid var(--theme-border)", borderRadius: 8, padding: 16, marginBottom: 16 }}>
                  <h3 style={{ margin: "0 0 12px" }}>Complaints Against Officer</h3>
                  {complaintsAgainstOfficer.length === 0 ? (
                    <p style={{ color: "var(--theme-text)", fontSize: 13, margin: 0 }}>No complaints filed against this officer.</p>
                  ) : (
                    <div style={{ display: "grid", gap: 8 }}>
                      {complaintsAgainstOfficer.map(complaint => (
                        <div key={complaint.id} style={{
                          padding: 10,
                          border: "1px solid #e5e7eb",
                          borderRadius: 6,
                          background: "#f9fafb"
                        }}>
                          <strong style={{ display: "block", fontSize: 13 }}>
                            {complaint.id} - {complaint.title}
                          </strong>
                          <small style={{ display: "block", color: "var(--theme-text)", marginTop: 4 }}>
                            Type: {complaint.complaintType} · Status: {complaint.status}
                          </small>
                          {complaint.incident?.dateTime && (
                            <small style={{ display: "block", color: "var(--theme-text)" }}>
                              Date: {new Date(complaint.incident.dateTime).toLocaleDateString()}
                            </small>
                          )}
                          {complaint.category && (
                            <small style={{ display: "block", color: "var(--theme-text)" }}>
                              Category: {complaint.category}
                            </small>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}

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
              <div style={{ background: "#ffffff", border: "1px solid var(--theme-border)", borderRadius: 8, padding: 16, marginBottom: 16 }}>
                <h3 style={{ margin: "0 0 12px" }}>Complaint History ({profile.complaints.length})</h3>
                <div style={{ display: "grid", gap: 10 }}>
                  {profile.complaints.slice(0, 10).map((complaint) => (
                    <div key={complaint.id} style={{ padding: 10, border: "1px solid #edf1ef", borderRadius: 6 }}>
                      <strong style={{ fontSize: 13 }}>{complaint.title || complaint.category}</strong>
                      <small style={{ display: "block", color: "var(--theme-text)", marginTop: 4 }}>
                        {complaint.id} · {complaint.date || complaint.incident?.dateTime?.slice(0, 10)} · {complaint.complaintType}
                      </small>
                    </div>
                  ))}
                  {profile.complaints.length > 10 && (
                    <small style={{ color: "var(--theme-text)" }}>+{profile.complaints.length - 10} more complaints</small>
                  )}
                </div>
              </div>
            )}

            {/* Sustained Findings */}
            {profile.sustainedFindings.length > 0 && (
              <div style={{ background: "#ffffff", border: "1px solid var(--theme-border)", borderRadius: 8, padding: 16 }}>
                <h3 style={{ margin: "0 0 12px" }}>Sustained Findings ({profile.sustainedFindings.length})</h3>
                <div style={{ display: "grid", gap: 10 }}>
                  {profile.sustainedFindings.map((finding) => (
                    <div key={finding.id} style={{ padding: 10, border: "1px solid #edf1ef", borderRadius: 6 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                        <div>
                          <strong style={{ fontSize: 13 }}>{finding.finding}</strong>
                          <small style={{ display: "block", color: "var(--theme-text)", marginTop: 2 }}>
                            {finding.id} · {finding.dateCreated}
                          </small>
                        </div>
                        <span className="pill" style={{ background: "#ffe7da", color: "#8c3b13" }}>
                          {finding.disciplineTemplate}
                        </span>
                      </div>
                      {finding.description && (
                        <small style={{ display: "block", color: "var(--theme-text)", marginTop: 6 }}>{finding.description}</small>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "var(--theme-text)" }}>
            Select an officer to view their profile
          </div>
        )}
      </div>
    </section>
  );
}

function ViolationLibraryPanel({ violations, onEdit, onDelete }) {
  // Get code prefix from category (Cond, Int, Perf, etc.)
  function getCategoryPrefix(category) {
    const prefixes = {
      "Conduct": "Cond",
      "Integrity": "Int",
      "Performance": "Perf",
      "Use of Force": "UoF",
      "Professionalism": "Prof",
      "Other": "Misc",
    };
    return prefixes[category] || category.substring(0, 3);
  }

  // Generate sequential codes by category
  const violationsWithCodes = violations.map((v, idx) => {
    const category = v.category || v.category;
    const prefix = getCategoryPrefix(category);

    // Count how many violations with this prefix come before this one
    const sequentialNum = violations
      .slice(0, idx + 1)
      .filter((prev) => getCategoryPrefix(prev.category) === prefix).length;

    const displayCode = `${prefix}-${sequentialNum}`;

    return {
      ...v,
      displayCode,
    };
  });

  return (
    <div className="panel" style={{ padding: 16 }}>
      <h3 style={{ margin: "0 0 16px" }}>Offense Library</h3>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #dce4e1" }}>
              <th style={{ textAlign: "left", padding: "8px 0", fontWeight: 700, color: "var(--theme-text)" }}>Code</th>
              <th style={{ textAlign: "left", padding: "8px 0", fontWeight: 700, color: "var(--theme-text)" }}>Name</th>
              <th style={{ textAlign: "left", padding: "8px 0", fontWeight: 700, color: "var(--theme-text)" }}>Category</th>
              <th style={{ textAlign: "left", padding: "8px 0", fontWeight: 700, color: "var(--theme-text)" }}>Severity</th>
              <th style={{ textAlign: "left", padding: "8px 0", fontWeight: 700, color: "var(--theme-text)" }}>Default Discipline</th>
              <th style={{ textAlign: "center", padding: "8px 0", fontWeight: 700, color: "var(--theme-text)" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {violationsWithCodes.map((v) => (
              <tr key={v.id} style={{ borderBottom: "1px solid #edf1ef" }}>
                <td style={{ padding: "12px 0", fontWeight: 700, color: "#2f7f67" }}>{v.displayCode}</td>
                <td style={{ padding: "12px 0" }}>{v.title || v.name}</td>
                <td style={{ padding: "12px 0" }}>{v.category}</td>
                <td style={{ padding: "12px 0" }}>{v.severity || v.severityLevel}</td>
                <td style={{ padding: "12px 0" }}>{v.discipline_recommendations || v.defaultDisciplineTemplate}</td>
                <td style={{ padding: "12px 0", textAlign: "center" }}>
                  <button
                    onClick={() => onEdit(v.id)}
                    style={{
                      background: "transparent",
                      border: 0,
                      color: "#2f7f67",
                      cursor: "pointer",
                      fontWeight: 700,
                      fontSize: 13,
                      marginRight: 12,
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={async () => await onDelete(v.id)}
                    style={{
                      background: "transparent",
                      border: 0,
                      color: "#b6492b",
                      cursor: "pointer",
                      fontWeight: 700,
                      fontSize: 13,
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ViolationForm({ violation, onSubmit, onCancel, allViolations = [] }) {
  function getCategoryPrefix(category) {
    const prefixes = {
      "Conduct": "Cond",
      "Integrity": "Int",
      "Performance": "Perf",
      "Use of Force": "UoF",
      "Professionalism": "Prof",
      "Other": "Misc",
    };
    return prefixes[category] || (category || "").substring(0, 3);
  }

  function getSequentialCode(v, violations) {
    const category = v.category || v.category;
    const prefix = getCategoryPrefix(category);
    const sequentialNum = violations
      .filter((prev) => getCategoryPrefix(prev.category) === prefix)
      .indexOf(v) + 1;
    return `${prefix}-${sequentialNum}`;
  }

  const displayCode = violation ? getSequentialCode(violation, allViolations) : "Auto-generated";

  return (
    <div className="panel" style={{ padding: 16 }}>
      <h3 style={{ margin: "0 0 16px" }}>
        {violation ? "Edit Violation" : "Create New Violation"}
      </h3>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await onSubmit(e);
        }}
        style={{ display: "grid", gap: 10 }}
      >
        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "var(--theme-text)", textTransform: "uppercase" }}>
            Code
          </label>
          <input
            name="code"
            defaultValue={displayCode}
            placeholder="Auto-generated"
            disabled
            style={{ background: "#f6f9f7", color: "#999" }}
          />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "var(--theme-text)", textTransform: "uppercase" }}>
            Name *
          </label>
          <input
            name="name"
            defaultValue={violation?.name || ""}
            placeholder="e.g., Conduct Unbecoming"
            required
          />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "var(--theme-text)", textTransform: "uppercase" }}>
            Description
          </label>
          <textarea
            name="description"
            defaultValue={violation?.description || ""}
            placeholder="Full description of this violation"
            style={{ minHeight: 86 }}
          />
        </div>
        <div className="row">
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "var(--theme-text)", textTransform: "uppercase" }}>
              Category
            </label>
            <select name="category" defaultValue={violation?.category || "Other"}>
              {violationCategories.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "var(--theme-text)", textTransform: "uppercase" }}>
              Severity
            </label>
            <select name="severityLevel" defaultValue={violation?.severityLevel || "Medium"}>
              {violationSeverityLevels.map((sev) => (
                <option key={sev}>{sev}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "var(--theme-text)", textTransform: "uppercase" }}>
            Default Discipline
          </label>
          <select name="defaultDisciplineTemplate" defaultValue={violation?.defaultDisciplineTemplate || "None"}>
            {disciplineTemplates.map((disc) => (
              <option key={disc}>{disc}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "var(--theme-text)", textTransform: "uppercase" }}>
            Additional Notes
          </label>
          <textarea
            name="notes"
            defaultValue={violation?.notes || ""}
            placeholder="Guidance or context for investigators"
            style={{ minHeight: 60 }}
          />
        </div>
        <div className="row" style={{ marginTop: 8 }}>
          <button type="submit" className="primary">
            {violation ? "Update Violation" : "Create Violation"}
          </button>
          {violation && (
            <button type="button" onClick={onCancel} style={{ background: "#f6f9f7", border: "1px solid var(--theme-border)", borderRadius: 6, cursor: "pointer" }}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

function PolicyLibraryPanel({ policies, onEdit, onDelete }) {
  return (
    <div className="panel" style={{ padding: 16 }}>
      <h3 style={{ margin: "0 0 16px" }}>Department Policy Library</h3>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #dce4e1" }}>
              <th style={{ textAlign: "left", padding: "8px 0", fontWeight: 700, color: "var(--theme-text)" }}>Code</th>
              <th style={{ textAlign: "left", padding: "8px 0", fontWeight: 700, color: "var(--theme-text)" }}>Title</th>
              <th style={{ textAlign: "left", padding: "8px 0", fontWeight: 700, color: "var(--theme-text)" }}>Category</th>
              <th style={{ textAlign: "left", padding: "8px 0", fontWeight: 700, color: "var(--theme-text)" }}>Version</th>
              <th style={{ textAlign: "left", padding: "8px 0", fontWeight: 700, color: "var(--theme-text)" }}>Linked Violations</th>
              <th style={{ textAlign: "center", padding: "8px 0", fontWeight: 700, color: "var(--theme-text)" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {policies.map((p) => (
              <tr key={p.id} style={{ borderBottom: "1px solid #edf1ef" }}>
                <td style={{ padding: "12px 0", fontWeight: 700, color: "#2f7f67" }}>{p.id}</td>
                <td style={{ padding: "12px 0" }}>{p.title}</td>
                <td style={{ padding: "12px 0" }}>{p.category}</td>
                <td style={{ padding: "12px 0" }}>{p.version}</td>
                <td style={{ padding: "12px 0", fontSize: 12 }}>
                  {p.linkedViolationIds.length > 0 ? p.linkedViolationIds.join(", ") : "—"}
                </td>
                <td style={{ padding: "12px 0", textAlign: "center" }}>
                  <button
                    onClick={() => onEdit(p.id)}
                    style={{
                      background: "transparent",
                      border: 0,
                      color: "#2f7f67",
                      cursor: "pointer",
                      fontWeight: 700,
                      fontSize: 13,
                      marginRight: 12,
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(p.id)}
                    style={{
                      background: "transparent",
                      border: 0,
                      color: "#b6492b",
                      cursor: "pointer",
                      fontWeight: 700,
                      fontSize: 13,
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PolicyForm({ policy, onSubmit, onCancel, violations }) {
  return (
    <div className="panel" style={{ padding: 16 }}>
      <h3 style={{ margin: "0 0 16px" }}>
        {policy ? "Edit Policy" : "Create New Policy"}
      </h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(e);
        }}
        style={{ display: "grid", gap: 10 }}
      >
        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "var(--theme-text)", textTransform: "uppercase" }}>
            Code {policy && `(${policy.id})`}
          </label>
          <input
            name="code"
            defaultValue={policy?.id || ""}
            placeholder="Auto-generated"
            disabled
            style={{ background: "#f6f9f7", color: "#999" }}
          />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "var(--theme-text)", textTransform: "uppercase" }}>
            Title *
          </label>
          <input
            name="title"
            defaultValue={policy?.title || ""}
            placeholder="e.g., Use of Force Policy"
            required
          />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "var(--theme-text)", textTransform: "uppercase" }}>
            Description
          </label>
          <textarea
            name="description"
            defaultValue={policy?.description || ""}
            placeholder="Full description of policy"
            style={{ minHeight: 86 }}
          />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "var(--theme-text)", textTransform: "uppercase" }}>
            Policy URL
          </label>
          <input
            name="url"
            type="url"
            defaultValue={policy?.url || ""}
            placeholder="https://example.com/policies/policy.pdf"
          />
        </div>
        <div className="row">
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "var(--theme-text)", textTransform: "uppercase" }}>
              Category
            </label>
            <select name="category" defaultValue={policy?.category || "Other"}>
              {policyCategories.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "var(--theme-text)", textTransform: "uppercase" }}>
              Version
            </label>
            <input
              name="version"
              defaultValue={policy?.version || "1.0"}
              placeholder="1.0"
            />
          </div>
        </div>
        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "var(--theme-text)", textTransform: "uppercase" }}>
            Effective Date
          </label>
          <input
            name="effectiveDate"
            type="date"
            defaultValue={policy?.effectiveDate || ""}
          />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "var(--theme-text)", textTransform: "uppercase" }}>
            Document Source
          </label>
          <input
            name="documentSource"
            defaultValue={policy?.documentSource || ""}
            placeholder="e.g., Department Policy Manual"
          />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "var(--theme-text)", textTransform: "uppercase" }}>
            Linked Violations (comma-separated)
          </label>
          <input
            name="linkedViolationIds"
            defaultValue={policy?.linkedViolationIds?.join(", ") || ""}
            placeholder="e.g., COND, EXFO, VIOL-001"
          />
          <small style={{ color: "var(--theme-text)", display: "block", marginTop: 4 }}>Enter violation codes separated by commas</small>
        </div>
        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "var(--theme-text)", textTransform: "uppercase" }}>
            Additional Notes
          </label>
          <textarea
            name="notes"
            defaultValue={policy?.notes || ""}
            placeholder="Guidance or context for investigators"
            style={{ minHeight: 60 }}
          />
        </div>
        <div className="row" style={{ marginTop: 8 }}>
          <button type="submit" className="primary">
            {policy ? "Update Policy" : "Create Policy"}
          </button>
          {policy && (
            <button type="button" onClick={onCancel} style={{ background: "#f6f9f7", border: "1px solid var(--theme-border)", borderRadius: 6, cursor: "pointer" }}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

function TemplateLibraryPanel({ templates, onEdit, onDelete }) {
  return (
    <div className="panel" style={{ padding: 16 }}>
      <h3 style={{ margin: "0 0 16px" }}>Investigation Templates</h3>
      <div style={{ display: "grid", gap: 12 }}>
        {templates.map((t) => (
          <div key={t.id} style={{ border: "1px solid var(--theme-border)", borderRadius: 6, padding: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 8 }}>
              <div>
                <strong style={{ fontSize: 14, color: "var(--theme-text)" }}>{t.name}</strong>
                <small style={{ display: "block", color: "#2f7f67", fontWeight: 700 }}>{t.id}</small>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => onEdit(t.id)}
                  style={{
                    background: "transparent",
                    border: 0,
                    color: "#2f7f67",
                    cursor: "pointer",
                    fontWeight: 700,
                    fontSize: 13,
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(t.id)}
                  style={{
                    background: "transparent",
                    border: 0,
                    color: "#b6492b",
                    cursor: "pointer",
                    fontWeight: 700,
                    fontSize: 13,
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
            <small style={{ color: "var(--theme-text)", display: "block", marginBottom: 4 }}>
              {t.category} · {t.estimatedInvestigationDays} days
            </small>
            {t.linkedViolations.length > 0 && (
              <small style={{ color: "#2b584d", display: "block" }}>
                Violations: {t.linkedViolations.join(", ")}
              </small>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function TemplateForm({ template, onSubmit, onCancel }) {
  return (
    <div className="panel" style={{ padding: 16 }}>
      <h3 style={{ margin: "0 0 16px" }}>
        {template ? "Edit Template" : "Create New Template"}
      </h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(e);
        }}
        style={{ display: "grid", gap: 10 }}
      >
        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "var(--theme-text)", textTransform: "uppercase" }}>
            Code {template && `(${template.id})`}
          </label>
          <input
            name="code"
            defaultValue={template?.id || ""}
            placeholder="Auto-generated"
            disabled
            style={{ background: "#f6f9f7", color: "#999" }}
          />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "var(--theme-text)", textTransform: "uppercase" }}>
            Template Name *
          </label>
          <input
            name="name"
            defaultValue={template?.name || ""}
            placeholder="e.g., Use of Force Investigation"
            required
          />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "var(--theme-text)", textTransform: "uppercase" }}>
            Description
          </label>
          <textarea
            name="description"
            defaultValue={template?.description || ""}
            placeholder="Overview of investigation type"
            style={{ minHeight: 60 }}
          />
        </div>
        <div className="row">
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "var(--theme-text)", textTransform: "uppercase" }}>
              Category
            </label>
            <select name="category" defaultValue={template?.category || "General"}>
              {investigationTemplateCategories.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "var(--theme-text)", textTransform: "uppercase" }}>
              Estimated Days
            </label>
            <input
              name="estimatedInvestigationDays"
              type="number"
              defaultValue={template?.estimatedInvestigationDays || "7"}
              min="1"
              max="180"
            />
          </div>
        </div>
        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "var(--theme-text)", textTransform: "uppercase" }}>
            Investigation Scope
          </label>
          <textarea
            name="investigationScope"
            defaultValue={template?.investigationScope || ""}
            placeholder="What aspects should be investigated"
            style={{ minHeight: 80 }}
          />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "var(--theme-text)", textTransform: "uppercase" }}>
            Key Questions (one per line)
          </label>
          <textarea
            name="keyQuestions"
            defaultValue={template?.keyQuestions?.join("\n") || ""}
            placeholder="Question 1&#10;Question 2&#10;Question 3"
            style={{ minHeight: 100 }}
          />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "var(--theme-text)", textTransform: "uppercase" }}>
            Required Evidence Types (one per line)
          </label>
          <textarea
            name="requiredEvidenceTypes"
            defaultValue={template?.requiredEvidenceTypes?.join("\n") || ""}
            placeholder="Evidence Type 1&#10;Evidence Type 2"
            style={{ minHeight: 80 }}
          />
        </div>
        <div className="row">
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "var(--theme-text)", textTransform: "uppercase" }}>
              Linked Violations (comma-separated)
            </label>
            <input
              name="linkedViolations"
              defaultValue={template?.linkedViolations?.join(", ") || ""}
              placeholder="COND, EXFO, VIOL-001"
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "var(--theme-text)", textTransform: "uppercase" }}>
              Linked Policies (comma-separated)
            </label>
            <input
              name="linkedPolicies"
              defaultValue={template?.linkedPolicies?.join(", ") || ""}
              placeholder="POL-001, POL-003"
            />
          </div>
        </div>
        <div className="row" style={{ marginTop: 8 }}>
          <button type="submit" className="primary">
            {template ? "Update Template" : "Create Template"}
          </button>
          {template && (
            <button type="button" onClick={onCancel} style={{ background: "#f6f9f7", border: "1px solid var(--theme-border)", borderRadius: 6, cursor: "pointer" }}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

function CustomDropdownManager({ data, onUpdateDropdown, onAddOption, onRemoveOption }) {
  const [tab, setTab] = useState("manage");
  const [newDropdownName, setNewDropdownName] = useState("");
  const [newDropdownOptions, setNewDropdownOptions] = useState("");

  function handleCreateCustomDropdown() {
    const name = newDropdownName.trim().replace(/[^a-zA-Z0-9]/g, "");
    if (!name || data.customOptions[name]) {
      alert("Invalid or duplicate dropdown name");
      return;
    }
    const options = newDropdownOptions
      .split("\n")
      .map((x) => x.trim())
      .filter(Boolean);
    if (options.length === 0) {
      alert("Add at least one option");
      return;
    }
    onUpdateDropdown(name, options);
    setNewDropdownName("");
    setNewDropdownOptions("");
    alert(`Custom dropdown "${name}" created!`);
  }

  return (
    <div className="panel" style={{ padding: 16 }}>
      <h3 style={{ margin: "0 0 16px" }}>Custom Fields Builder</h3>
      <div style={{ borderBottom: "2px solid #dce4e1", marginBottom: 16, display: "flex", gap: 16 }}>
        <button
          onClick={() => setTab("manage")}
          style={{
            all: "unset",
            padding: "8px 0",
            borderBottom: tab === "manage" ? "3px solid var(--theme-accent)" : "none",
            color: tab === "manage" ? "var(--theme-accent)" : "#60716c",
            fontWeight: 700,
            cursor: "pointer",
            fontSize: 13,
          }}
        >
          Manage Existing
        </button>
        <button
          onClick={() => setTab("create")}
          style={{
            all: "unset",
            padding: "8px 0",
            borderBottom: tab === "create" ? "3px solid var(--theme-accent)" : "none",
            color: tab === "create" ? "var(--theme-accent)" : "#60716c",
            fontWeight: 700,
            cursor: "pointer",
            fontSize: 13,
          }}
        >
          Create New
        </button>
      </div>

      {tab === "manage" && (
        <div style={{ display: "grid", gap: 16 }}>
          {customizableDropdowns.map((dropdown) => (
            <div key={dropdown.key} style={{ border: "1px solid var(--theme-border)", borderRadius: 6, padding: 12 }}>
              <strong style={{ fontSize: 13 }}>{dropdown.label}</strong>
              <small style={{ display: "block", color: "var(--theme-text)", marginBottom: 10 }}>{dropdown.description}</small>
              <div style={{ display: "grid", gap: 8 }}>
                {[...dropdown.hardcoded, ...(data.customOptions[dropdown.key] || [])].map((option) => (
                  <div
                    key={option}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px 0",
                      borderBottom: "1px solid #edf1ef",
                    }}
                  >
                    <span style={{ fontSize: 12 }}>
                      {option}
                      {dropdown.hardcoded.includes(option) && (
                        <small style={{ color: "#2f7f67", marginLeft: 8, fontWeight: 700 }}>(Built-in)</small>
                      )}
                    </span>
                    {!dropdown.hardcoded.includes(option) && (
                      <button
                        onClick={() => onRemoveOption(dropdown.key, option)}
                        style={{
                          background: "transparent",
                          border: 0,
                          color: "#b6492b",
                          cursor: "pointer",
                          fontWeight: 700,
                          fontSize: 12,
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <div style={{ paddingTop: 8, display: "grid", gridTemplateColumns: "1fr auto", gap: 8 }}>
                  <input
                    type="text"
                    placeholder="Add new option"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        onAddOption(dropdown.key, e.target.value);
                        e.target.value = "";
                      }
                    }}
                    style={{ flex: 1 }}
                  />
                  <button
                    onClick={(e) => {
                      const input = e.currentTarget.parentElement.querySelector("input");
                      onAddOption(dropdown.key, input.value);
                      input.value = "";
                    }}
                    className="primary"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "create" && (
        <div style={{ display: "grid", gap: 12 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "var(--theme-text)", textTransform: "uppercase" }}>
              Dropdown Name
            </label>
            <input
              type="text"
              value={newDropdownName}
              onChange={(e) => setNewDropdownName(e.target.value)}
              placeholder="e.g., DepartmentUnits (no spaces or special chars)"
            />
            <small style={{ color: "var(--theme-text)", display: "block", marginTop: 4 }}>
              Used internally; will be displayed nicely in forms
            </small>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "var(--theme-text)", textTransform: "uppercase" }}>
              Options (one per line)
            </label>
            <textarea
              value={newDropdownOptions}
              onChange={(e) => setNewDropdownOptions(e.target.value)}
              placeholder="Option 1&#10;Option 2&#10;Option 3"
              style={{ minHeight: 120 }}
            />
          </div>
          <button onClick={handleCreateCustomDropdown} className="primary">
            Create Custom Dropdown
          </button>
        </div>
      )}
    </div>
  );
}

function BrandingSettingsPanel({ themeIndex, themeColors, setThemeIndex }) {
  const currentTheme = themeColors[themeIndex] || {};

  // Global branding (same across all themes)
  const [globalBranding, setGlobalBranding] = useState({
    departmentName: currentTheme.departmentName || "Police Department",
    departmentLogoUrl: currentTheme.departmentLogoUrl || "",
    reportHeaderText: currentTheme.reportHeaderText || "",
    signatureBlockText: currentTheme.signatureBlockText || "",
  });

  // Theme-specific branding (per theme)
  const [pendingChanges, setPendingChanges] = useState({
    name: currentTheme.name || "Default",
    dark: currentTheme.dark || "#14201e",
    accent: currentTheme.accent || "#2f7f67",
    accentSecondaryColor: currentTheme.accentSecondaryColor || "#1e5c4a",
  });

  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  
  async function handleSave() {
    setSaving(true);
    setSaveMessage("");

    try {
      // Save global branding (applies to all themes)
      await customOptionsService.updateByCategory("global_branding", globalBranding);

      // Update all theme objects with global branding
      const updated = [...themeColors];
      updated.forEach((theme) => {
        theme.departmentName = globalBranding.departmentName;
        theme.departmentLogoUrl = globalBranding.departmentLogoUrl;
        theme.reportHeaderText = globalBranding.reportHeaderText;
        theme.signatureBlockText = globalBranding.signatureBlockText;
      });

      // Update current theme with theme-specific colors
      updated[themeIndex] = {
        ...updated[themeIndex],
        ...pendingChanges,
      };

      console.log("Saving branding to Supabase:", updated);

      // Save theme colors to Supabase
      await customOptionsService.updateByCategory("branding", updated);

      // Update the themeColors array
      themeColors.splice(0, themeColors.length, ...updated);
      localStorage.setItem("theme-index", themeIndex.toString());

      // Apply CSS variables
      if (pendingChanges.dark)
        document.documentElement.style.setProperty("--theme-dark", pendingChanges.dark);
      if (pendingChanges.accent)
        document.documentElement.style.setProperty("--theme-accent", pendingChanges.accent);
      if (globalBranding.departmentName)
        document.documentElement.style.setProperty("--dept-name", globalBranding.departmentName);
      if (globalBranding.departmentLogoUrl)
        document.documentElement.style.setProperty(
          "--dept-logo-url",
          globalBranding.departmentLogoUrl ? `url('${globalBranding.departmentLogoUrl}')` : "none"
        );
      if (globalBranding.reportHeaderText)
        document.documentElement.style.setProperty("--report-header", globalBranding.reportHeaderText);
      if (globalBranding.signatureBlockText)
        document.documentElement.style.setProperty("--signature-block", globalBranding.signatureBlockText);
      if (pendingChanges.accentSecondaryColor)
        document.documentElement.style.setProperty("--secondary-accent", pendingChanges.accentSecondaryColor);

      setSaveMessage("✓ Branding saved successfully");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error) {
      console.error("Failed to save branding:", error);
      setSaveMessage("✗ Failed to save branding: " + error.message);
    } finally {
      setSaving(false);
    }
  }

  function handleGlobalChange(field, value) {
    setGlobalBranding((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleThemeChange(field, value) {
    setPendingChanges((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  return (
    <div className="panel" style={{ padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h3 style={{ margin: 0 }}>System Branding</h3>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            background: "#2f7f67",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: 6,
            fontWeight: 700,
            fontSize: 13,
            cursor: saving ? "not-allowed" : "pointer",
            opacity: saving ? 0.6 : 1,
          }}
        >
          {saving ? "Saving..." : "Save Branding"}
        </button>
      </div>

      {saveMessage && (
        <div
          style={{
            padding: 12,
            marginBottom: 16,
            borderRadius: 6,
            fontSize: 13,
            fontWeight: 600,
            background: saveMessage.includes("✓") ? "#e8f5e9" : "#ffebee",
            color: saveMessage.includes("✓") ? "#2e7d32" : "#c62828",
          }}
        >
          {saveMessage}
        </div>
      )}

      <div style={{ display: "grid", gap: 16 }}>
        <div style={{ paddingBottom: 16, borderBottom: "2px solid #dce4e1" }}>
          <h4 style={{ margin: "0 0 16px 0", color: "var(--theme-text)" }}>Global Branding (All Themes)</h4>

          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 6, color: "var(--theme-text)", textTransform: "uppercase" }}>
              Department Name
            </label>
            <input
              type="text"
              value={globalBranding.departmentName}
              onChange={(e) => handleGlobalChange("departmentName", e.target.value)}
              placeholder="e.g., San Santos Police Department"
            />
          </div>

          <div style={{ marginTop: 12 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 6, color: "var(--theme-text)", textTransform: "uppercase" }}>
              Department Logo URL
            </label>
            <input
              type="text"
              value={globalBranding.departmentLogoUrl}
              onChange={(e) => handleGlobalChange("departmentLogoUrl", e.target.value)}
              placeholder="https://example.com/logo.png"
            />
            {globalBranding.departmentLogoUrl && (
              <div style={{ marginTop: 8, padding: 8, background: "#f6f9f7", borderRadius: 6 }}>
                <small style={{ color: "var(--theme-text)" }}>Logo Preview:</small>
                <img
                  src={globalBranding.departmentLogoUrl}
                  alt="Department Logo"
                  style={{ maxHeight: 60, marginTop: 4, borderRadius: 4 }}
                  onError={() => {}}
                />
              </div>
            )}
          </div>

          <div style={{ marginTop: 12 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 6, color: "var(--theme-text)", textTransform: "uppercase" }}>
              Report Header Text
            </label>
            <input
              type="text"
              value={globalBranding.reportHeaderText}
              onChange={(e) => handleGlobalChange("reportHeaderText", e.target.value)}
              placeholder="e.g., Internal Affairs Division"
            />
          </div>

          <div style={{ marginTop: 12 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 6, color: "var(--theme-text)", textTransform: "uppercase" }}>
              Signature Block Text
            </label>
            <input
              type="text"
              value={globalBranding.signatureBlockText}
              onChange={(e) => handleGlobalChange("signatureBlockText", e.target.value)}
              placeholder="e.g., Authorized by: "
            />
          </div>
        </div>

        <div style={{ paddingTop: 16 }}>
          <h4 style={{ margin: "0 0 16px 0", color: "var(--theme-text)" }}>Theme Colors (Current: {pendingChanges.name})</h4>

          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 6, color: "var(--theme-text)", textTransform: "uppercase" }}>
              Primary Accent Color
            </label>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                type="color"
                value={pendingChanges.accent}
                onChange={(e) => handleThemeChange("accent", e.target.value)}
                style={{ width: 60, height: 44, border: "1px solid var(--theme-border)", borderRadius: 6, cursor: "pointer" }}
              />
              <input
                type="text"
                value={pendingChanges.accent}
                onChange={(e) => handleThemeChange("accent", e.target.value)}
                placeholder="#2f7f67"
                style={{ flex: 1 }}
              />
            </div>
          </div>

        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 6, color: "var(--theme-text)", textTransform: "uppercase" }}>
            Secondary Accent Color
          </label>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              type="color"
              value={pendingChanges.accentSecondaryColor}
              onChange={(e) => handleThemeChange("accentSecondaryColor", e.target.value)}
              style={{ width: 60, height: 44, border: "1px solid var(--theme-border)", borderRadius: 6, cursor: "pointer" }}
            />
            <input
              type="text"
              value={pendingChanges.accentSecondaryColor}
              onChange={(e) => handleThemeChange("accentSecondaryColor", e.target.value)}
              placeholder="#2f7f67"
              style={{ flex: 1 }}
            />
          </div>
        </div>

        <div style={{ padding: 12, background: "#eef5f1", borderRadius: 6, borderLeft: "4px solid var(--theme-accent)" }}>
          <strong style={{ fontSize: 13 }}>Preview</strong>
          <div style={{ marginTop: 12, fontSize: 13, color: "#42524e" }}>
            {globalBranding.departmentLogoUrl && (
              <img src={globalBranding.departmentLogoUrl} alt="Logo" style={{ maxHeight: 40, marginBottom: 8 }} />
            )}
            <div style={{ fontWeight: 700, marginBottom: 4 }}>{globalBranding.departmentName}</div>
            <div style={{ color: "var(--theme-text)", marginBottom: 4 }}>{globalBranding.reportHeaderText}</div>
            <div style={{ borderTop: "1px solid #dce4e1", paddingTop: 8, marginTop: 8 }}>
              {globalBranding.signatureBlockText}_________________
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

function SettingsView({ themeIndex, setThemeIndex, data, setData, createViolation, editViolation, deleteViolation, createPolicy, editPolicy, deletePolicy, createTemplate, editTemplate, deleteTemplate, updateCustomDropdown, addOptionToDropdown, removeOptionFromDropdown }) {
  const [editingViolation, setEditingViolation] = useState(null);
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [eiWeights, setEiWeights] = useState({
    complaint_count: 25,
    use_of_force_complaints: 30,
    sustained_finding_ratio: 20,
    complaint_velocity_spike: 15,
    prior_ei_flag_unresolved: 10,
  });
  const [eiThresholds, setEiThresholds] = useState({
    monitorMax: 39,
    reviewMax: 69,
  });
  const [eiLoading, setEiLoading] = useState(false);

  useEffect(() => {
    loadEiWeights();
  }, []);

  async function loadEiWeights() {
    const { data: weights } = await eiWeightsService.getAll();
    if (weights && weights.length > 0) {
      const weightMap = {};
      weights.forEach((w) => {
        weightMap[w.signal_key] = w.weight;
      });
      setEiWeights((prev) => ({ ...prev, ...weightMap }));
    }
  }

  async function handleSaveEiWeights() {
    setEiLoading(true);
    try {
      const weightSum = Object.values(eiWeights).reduce((a, b) => a + b, 0);
      if (weightSum !== 100) {
        alert(`⚠ Weights must sum to 100 (current sum: ${weightSum}). Please adjust.`);
        setEiLoading(false);
        return;
      }

      const signalKeys = [
        'complaint_count',
        'use_of_force_complaints',
        'sustained_finding_ratio',
        'complaint_velocity_spike',
        'prior_ei_flag_unresolved',
      ];

      for (const key of signalKeys) {
        const { error } = await eiWeightsService.updateBySignalKey(key, eiWeights[key]);
        if (error) {
          alert(`Failed to save weight for ${key}: ${error.message}`);
          setEiLoading(false);
          return;
        }
      }

      alert('✓ EI weights saved successfully. Recalculating officer scores...');

      for (const officer of data.people) {
        await recalculateOfficerEIScore(officer.id);
      }

      alert('✓ All officer scores recalculated.');
      setEiLoading(false);
    } catch (err) {
      alert(`Error saving EI weights: ${err.message}`);
      setEiLoading(false);
    }
  }

  function handleEditViolation(violationId) {
    setEditingViolation(data.violations.find((v) => v.id === violationId));
  }

  async function handleSubmitViolation(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const updates = {
      name: form.get("name").toString().trim(),
      description: form.get("description").toString().trim(),
      category: form.get("category"),
      severityLevel: form.get("severityLevel"),
      defaultDisciplineTemplate: form.get("defaultDisciplineTemplate"),
      notes: form.get("notes").toString().trim(),
    };
    await editViolation(editingViolation.id, updates);
    setEditingViolation(null);
    if (e.currentTarget) {
      e.currentTarget.reset();
    }
  }

  function handleEditPolicy(policyId) {
    setEditingPolicy(data.policies.find((p) => p.id === policyId));
  }

  function handleSubmitPolicy(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const updates = {
      title: form.get("title").toString().trim(),
      description: form.get("description").toString().trim(),
      url: form.get("url").toString().trim(),
      linkedViolationIds: form
        .get("linkedViolationIds")
        .toString()
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
      category: form.get("category"),
      version: form.get("version").toString().trim(),
      effectiveDate: form.get("effectiveDate").toString(),
      documentSource: form.get("documentSource").toString().trim(),
      notes: form.get("notes").toString().trim(),
    };
    editPolicy(editingPolicy.id, updates);
    setEditingPolicy(null);
    e.currentTarget.reset();
  }

  function handleEditTemplate(templateId) {
    setEditingTemplate(data.investigationTemplates.find((t) => t.id === templateId));
  }

  function handleSubmitTemplate(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const keyQuestions = form
      .get("keyQuestions")
      .toString()
      .split("\n")
      .map((x) => x.trim())
      .filter(Boolean);
    const evidenceTypes = form
      .get("requiredEvidenceTypes")
      .toString()
      .split("\n")
      .map((x) => x.trim())
      .filter(Boolean);
    const updates = {
      name: form.get("name").toString().trim(),
      description: form.get("description").toString().trim(),
      category: form.get("category"),
      investigationScope: form.get("investigationScope").toString().trim(),
      keyQuestions,
      requiredEvidenceTypes: evidenceTypes,
      linkedViolations: form
        .get("linkedViolations")
        .toString()
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
      linkedPolicies: form
        .get("linkedPolicies")
        .toString()
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
      estimatedInvestigationDays: parseInt(form.get("estimatedInvestigationDays") || "7"),
    };
    editTemplate(editingTemplate.id, updates);
    setEditingTemplate(null);
    e.currentTarget.reset();
  }

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
                <span style={{ fontSize: 14, fontWeight: 600, color: "var(--theme-text)" }}>
                  {theme.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        <BrandingSettingsPanel themeIndex={themeIndex} themeColors={themeColors} setThemeIndex={setThemeIndex} />

        <div className="panel" style={{ padding: 16 }}>
          <h3 style={{ margin: "0 0 16px" }}>Early Intervention Risk Scoring</h3>
          <p style={{ fontSize: 13, color: "var(--theme-text)", marginBottom: 16 }}>
            Configure signal weights and tier thresholds for officer risk assessment.
          </p>

          <div style={{ marginBottom: 24 }}>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: "var(--theme-text)", margin: "0 0 16px" }}>Signal Weights (must sum to 100)</h4>
            <div style={{ display: "grid", gap: 12 }}>
              {[
                { key: "complaint_count", label: "Complaint Count" },
                { key: "use_of_force_complaints", label: "Use of Force Complaints" },
                { key: "sustained_finding_ratio", label: "Sustained Finding Ratio" },
                { key: "complaint_velocity_spike", label: "Complaint Velocity Spike" },
                { key: "prior_ei_flag_unresolved", label: "Prior Unresolved EI Flags" },
              ].map(({ key, label }) => (
                <div key={key} style={{ display: "grid", gridTemplateColumns: "200px 1fr 40px", gap: 12, alignItems: "center" }}>
                  <label style={{ fontSize: 12, fontWeight: 500, color: "var(--theme-text)" }}>{label}</label>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={eiWeights[key]}
                    onChange={(e) => setEiWeights({ ...eiWeights, [key]: parseInt(e.target.value) })}
                    style={{ cursor: "pointer" }}
                  />
                  <span style={{ fontSize: 12, fontWeight: 600, color: "var(--theme-text)", textAlign: "right" }}>{eiWeights[key]}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12, padding: 8, backgroundColor: "var(--theme-light)", borderRadius: 6, border: "1px solid var(--theme-border)" }}>
              <p style={{ margin: 0, fontSize: 12, color: "var(--theme-text)" }}>
                Weight Sum: <strong>{Object.values(eiWeights).reduce((a, b) => a + b, 0)}/100</strong>
              </p>
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: "var(--theme-text)", margin: "0 0 16px" }}>Tier Thresholds</h4>
            <div style={{ display: "grid", gap: 12 }}>
              <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 12, alignItems: "center" }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: "var(--theme-text)" }}>Monitor Max Score</label>
                <input
                  type="number"
                  min="0"
                  max="99"
                  value={eiThresholds.monitorMax}
                  onChange={(e) => setEiThresholds({ ...eiThresholds, monitorMax: parseInt(e.target.value) })}
                  style={{ padding: "6px 8px", border: "1px solid var(--theme-border)", borderRadius: 4, fontSize: 12 }}
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 12, alignItems: "center" }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: "var(--theme-text)" }}>Review Max Score</label>
                <input
                  type="number"
                  min="40"
                  max="99"
                  value={eiThresholds.reviewMax}
                  onChange={(e) => setEiThresholds({ ...eiThresholds, reviewMax: parseInt(e.target.value) })}
                  style={{ padding: "6px 8px", border: "1px solid var(--theme-border)", borderRadius: 4, fontSize: 12 }}
                />
              </div>
            </div>
            <div style={{ marginTop: 12, padding: 8, backgroundColor: "var(--theme-light)", borderRadius: 6, border: "1px solid var(--theme-border)" }}>
              <p style={{ margin: "0 0 4px 0", fontSize: 12, color: "var(--theme-text)" }}>
                Monitor: 0–{eiThresholds.monitorMax}
              </p>
              <p style={{ margin: "0 0 4px 0", fontSize: 12, color: "var(--theme-text)" }}>
                Review: {eiThresholds.monitorMax + 1}–{eiThresholds.reviewMax}
              </p>
              <p style={{ margin: 0, fontSize: 12, color: "var(--theme-text)" }}>
                Intervene: {eiThresholds.reviewMax + 1}–100
              </p>
            </div>
          </div>

          <button
            onClick={handleSaveEiWeights}
            disabled={eiLoading}
            className="primary"
            style={{ opacity: eiLoading ? 0.6 : 1 }}
          >
            {eiLoading ? "Saving & Recalculating..." : "Save EI Configuration"}
          </button>
        </div>

        <div className="panel" style={{ padding: 16 }}>
          <h3 style={{ margin: "0 0 16px" }}>Database Maintenance</h3>
          <p style={{ fontSize: 13, color: "var(--theme-text)", marginBottom: 12 }}>
            Clean up orphaned records (tasks, evidence, notes, events, findings) that belong to deleted cases.
          </p>
          <button
            onClick={() => {
              const caseIds = new Set(data.cases.map((c) => c.id));
              const orphanedEvidence = data.evidence.filter((e) => !caseIds.has(e.caseId)).length;
              const orphanedEvents = data.events.filter((e) => !caseIds.has(e.caseId)).length;
              const orphanedNotes = data.notes.filter((n) => !caseIds.has(n.caseId)).length;
              const orphanedTasks = data.tasks.filter((t) => !caseIds.has(t.caseId)).length;
              const orphanedFindings = data.findings.filter((f) => !caseIds.has(f.caseId)).length;
              const total = orphanedEvidence + orphanedEvents + orphanedNotes + orphanedTasks + orphanedFindings;

              if (total === 0) {
                alert("✓ No orphaned records found. Database is clean!");
                return;
              }

              if (window.confirm(`Found ${total} orphaned records:\n\n- Evidence: ${orphanedEvidence}\n- Events: ${orphanedEvents}\n- Notes: ${orphanedNotes}\n- Tasks: ${orphanedTasks}\n- Findings: ${orphanedFindings}\n\nDelete these orphaned records?`)) {
                const cleaned = cleanupOrphanedRecords(data);
                setData(cleaned);
                localStorage.setItem(storeKey, JSON.stringify(cleaned));
                alert(`✓ Cleaned up ${total} orphaned records. Database is now clean.`);
              }
            }}
            className="primary"
          >
            Scan & Clean Orphaned Records
          </button>
        </div>

        <PolicyLibraryPanel policies={data.policies} onEdit={handleEditPolicy} onDelete={deletePolicy} />

        {editingPolicy && (
          <PolicyForm
            policy={editingPolicy}
            onSubmit={handleSubmitPolicy}
            onCancel={() => setEditingPolicy(null)}
            violations={data.violations}
          />
        )}

        {!editingPolicy && <PolicyForm onSubmit={createPolicy} violations={data.violations} />}

        <TemplateLibraryPanel templates={data.investigationTemplates} onEdit={handleEditTemplate} onDelete={deleteTemplate} />

        {editingTemplate && (
          <TemplateForm
            template={editingTemplate}
            onSubmit={handleSubmitTemplate}
            onCancel={() => setEditingTemplate(null)}
          />
        )}

        {!editingTemplate && <TemplateForm onSubmit={createTemplate} />}

        <CustomDropdownManager
          data={data}
          onUpdateDropdown={updateCustomDropdown}
          onAddOption={addOptionToDropdown}
          onRemoveOption={removeOptionFromDropdown}
        />

        <ViolationLibraryPanel
          violations={data.violations}
          onEdit={handleEditViolation}
          onDelete={deleteViolation}
        />

        {editingViolation && (
          <ViolationForm
            violation={editingViolation}
            onSubmit={handleSubmitViolation}
            onCancel={() => setEditingViolation(null)}
            allViolations={data.violations}
          />
        )}

        {!editingViolation && (
          <ViolationForm onSubmit={createViolation} allViolations={data.violations} />
        )}
      </div>
    </section>
  );
}

function ComplaintsView({ data, activeCase, visibleComplaints, createComplaint, deleteComplaint, setActiveComplaintId }) {
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
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, marginBottom: 4, color: "var(--theme-text)", textTransform: "uppercase" }}>
                    Incident Location
                  </label>
                  <input name="incidentLocation" placeholder="Where the incident occurred" defaultValue={"Unspecified"} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, marginBottom: 4, color: "var(--theme-text)", textTransform: "uppercase" }}>
                    Incident Date (YYYY-MM-DD)
                  </label>
                  <input name="incidentDate" type="date" placeholder="When the incident occurred" />
                </div>
              </div>
              <div className="row" style={{ marginTop: 10 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, marginBottom: 4, color: "var(--theme-text)", textTransform: "uppercase" }}>
                    Incident Time (HH:MM)
                  </label>
                  <input name="incidentTime" type="time" placeholder="Time of incident" />
                </div>
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

            {/* Escalate for supervisor review */}
            <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
                <input type="checkbox" name="supervisorReferralEnabled" />
                <span>Escalate for supervisor review</span>
              </label>
              <textarea name="supervisorReferralReason" placeholder="Reason for escalation (optional)" />
            </div>

            {/* Subject Officer(s) - who the complaint is against */}
            <div style={{ marginTop: 10 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, marginBottom: 4, color: "var(--theme-text)", textTransform: "uppercase" }}>
                Subject Officer(s) - Badge Numbers (comma-separated)
              </label>
              <input
                name="subjectOfficerBadges"
                placeholder="Badge numbers of officer(s) complaint is against (e.g., 201,203)"
                defaultValue={""}
              />
            </div>

            {/* Involved personnel IDs (optional) */}
            <div style={{ marginTop: 10 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, marginBottom: 4, color: "var(--theme-text)", textTransform: "uppercase" }}>
                Other Involved Personnel (comma-separated)
              </label>
              <input
                name="involvedPersonIds"
                placeholder="Other involved person ids (witnesses, etc.)"
                defaultValue={""}
              />
            </div>

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
                <div key={c.id} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12, alignItems: "start" }}>
                  <button
                    className={`case-card ${activeCase?.id && false ? "selected" : ""}`}
                    onClick={() => setActiveComplaintId(c.id)}
                    style={ia ? { borderColor: "#d64545", margin: 0 } : { margin: 0 }}
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
                  <button
                    onClick={() => deleteComplaint(c.id)}
                    style={{
                      padding: "6px 10px",
                      background: "#fee5e3",
                      color: "#b6492b",
                      border: "1px solid #fbbf9f",
                      borderRadius: 4,
                      cursor: "pointer",
                      fontSize: 11,
                      fontWeight: 600,
                      height: "fit-content",
                    }}
                    title="Delete complaint"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
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


function AppWrapper() {
  const { isAuthenticated, loading, logout, user } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "#f3f5f4",
        fontSize: "16px",
        color: "var(--theme-text)"
      }}>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={logout}
        style={{
          position: "absolute",
          top: "24px",
          right: "240px",
          zIndex: 1000,
          background: "var(--theme-surface)",
          border: "1px solid var(--theme-border)",
          padding: "8px 12px",
          borderRadius: "6px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          fontSize: "12px",
          fontWeight: 600,
          color: "var(--theme-text)",
        }}
        title={`Logged in as ${user?.email}`}
      >
        <LogOut size={16} />
        Sign out
      </button>
      <App />
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <AppWrapper />
  </AuthProvider>
);
