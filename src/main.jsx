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
} from "./supabaseService";

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
};

// Data is now stored in Supabase, not localStorage
// const storeKey = "case-logger-data-v2";
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
  {
    name: "Forest",
    dark: "#14201e",
    accent: "#2f7f67",
    departmentName: "Police Department",
    departmentLogoUrl: "",
    reportHeaderText: "Internal Affairs Investigation",
    signatureBlockText: "Authorized by: ",
    accentSecondaryColor: "#1a6b56",
  },
  {
    name: "Ocean",
    dark: "#1a2b4a",
    accent: "#3b82f6",
    departmentName: "Police Department",
    departmentLogoUrl: "",
    reportHeaderText: "Internal Affairs Investigation",
    signatureBlockText: "Authorized by: ",
    accentSecondaryColor: "#1e40af",
  },
  {
    name: "Amethyst",
    dark: "#3d1f47",
    accent: "#a855f7",
    departmentName: "Police Department",
    departmentLogoUrl: "",
    reportHeaderText: "Internal Affairs Investigation",
    signatureBlockText: "Authorized by: ",
    accentSecondaryColor: "#7e22ce",
  },
  {
    name: "Crimson",
    dark: "#4a1f1f",
    accent: "#ef4444",
    departmentName: "Police Department",
    departmentLogoUrl: "",
    reportHeaderText: "Internal Affairs Investigation",
    signatureBlockText: "Authorized by: ",
    accentSecondaryColor: "#b91c1c",
  },
  {
    name: "Slate",
    dark: "#1e293b",
    accent: "#64748b",
    departmentName: "Police Department",
    departmentLogoUrl: "",
    reportHeaderText: "Internal Affairs Investigation",
    signatureBlockText: "Authorized by: ",
    accentSecondaryColor: "#334155",
  },
  {
    name: "Teal",
    dark: "#0f3f3f",
    accent: "#14b8a6",
    departmentName: "Police Department",
    departmentLogoUrl: "",
    reportHeaderText: "Internal Affairs Investigation",
    signatureBlockText: "Authorized by: ",
    accentSecondaryColor: "#0d9488",
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
    const { data: violations } = await violationsService.getAll();

    // If no violations exist, seed them
    if (!violations || violations.length === 0) {
      console.log("Seeding violations to Supabase...");

      // Extract violations from seedData
      const violationsToSeed = seedData.violations;

      // Insert all violations
      for (const v of violationsToSeed) {
        await violationsService.create({
          id: v.id,
          violation_code: v.id,
          title: v.name,
          description: v.description,
          category: v.category,
          severity: v.severityLevel,
          discipline_recommendations: v.defaultDisciplineTemplate,
          created_at: new Date().toISOString(),
        });
      }

      console.log(`Successfully seeded ${violationsToSeed.length} violations`);
    }
  } catch (error) {
    console.error("Error seeding violations:", error);
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
    ]);

    return {
      cases: cases || [],
      complaints: complaints || [],
      people: people || [],
      evidence: evidence || [],
      events: events || [],
      notes: notes || [],
      tasks: tasks || [],
      findings: findings || [],
      violations: violations || [],
      policies: policies || [],
      investigationTemplates: templates || [],
      customOptions: customOpts || [],
    };
  } catch (error) {
    console.error("Failed to load data from Supabase:", error);
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
        setData(loadedData);
        setActiveCaseId(loadedData.cases?.[0]?.id ?? "");
        setActiveComplaintId(loadedData.complaints?.[0]?.id ?? "");
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
    document.documentElement.style.setProperty("--dept-name", theme.departmentName);
    document.documentElement.style.setProperty("--dept-logo-url", theme.departmentLogoUrl ? `url('${theme.departmentLogoUrl}')` : "none");
    document.documentElement.style.setProperty("--report-header", theme.reportHeaderText);
    document.documentElement.style.setProperty("--signature-block", theme.signatureBlockText);
    document.documentElement.style.setProperty("--secondary-accent", theme.accentSecondaryColor);
    localStorage.setItem("theme-index", themeIndex.toString());
  }, [themeIndex]);

  const [selectedOfficerId, setSelectedOfficerId] = useState(null);

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

  function deleteCase(caseId) {
    if (!window.confirm(`Delete case ${caseId}? This action cannot be undone.`)) return;
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

  function createViolation(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = form.get("name").toString().trim();
    if (!name) return;

    const id = nextViolationCode(data.violations);
    const next = {
      ...data,
      violations: [
        {
          id,
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
    event.currentTarget.reset();
  }

  function editViolation(violationId, updates) {
    const next = {
      ...data,
      violations: data.violations.map((v) =>
        v.id !== violationId ? v : { ...v, ...updates }
      ),
    };
    save(next);
  }

  function deleteViolation(violationId) {
    if (!window.confirm(`Delete violation ${violationId}? This action cannot be undone.`)) return;
    const next = {
      ...data,
      violations: data.violations.filter((v) => v.id !== violationId),
    };
    save(next);
  }

  function nextPolicyCode(policies) {
    const numbers = policies
      .map((item) => String(item.id).match(/^POL-(\d+)$/)?.[1])
      .filter(Boolean)
      .map(Number);
    const next = numbers.length ? Math.max(...numbers) + 1 : 1;
    return `POL-${String(next).padStart(3, "0")}`;
  }

  function createPolicy(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = form.get("title").toString().trim();
    if (!title) return;

    const id = nextPolicyCode(data.policies);
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

  function editPolicy(policyId, updates) {
    const next = {
      ...data,
      policies: data.policies.map((p) =>
        p.id !== policyId ? p : { ...p, ...updates }
      ),
    };
    save(next);
  }

  function deletePolicy(policyId) {
    if (!window.confirm(`Delete policy ${policyId}? This action cannot be undone.`)) return;
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

  function createTemplate(event) {
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

  function editTemplate(templateId, updates) {
    const next = {
      ...data,
      investigationTemplates: data.investigationTemplates.map((t) =>
        t.id !== templateId ? t : { ...t, ...updates }
      ),
    };
    save(next);
  }

  function deleteTemplate(templateId) {
    if (!window.confirm(`Delete template ${templateId}? This action cannot be undone.`)) return;
    const next = {
      ...data,
      investigationTemplates: data.investigationTemplates.filter((t) => t.id !== templateId),
    };
    save(next);
  }

  function updateCustomDropdown(dropdownKey, newOptions) {
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

  if (loading) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "#f3f5f4",
        fontSize: "16px",
        color: "#5a6b66"
      }}>
        Loading cases...
      </div>
    );
  }

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
              <CaseDetail activeCase={activeCase} caseRecords={caseRecords} data={data} setData={setData} editFinding={editFinding} deleteCase={deleteCase} />
              <Forms activeCase={activeCase} addItem={addItem} createCase={createCase} quickAdd={quickAdd} setQuickAdd={setQuickAdd} />
            </section>
          </>
        )}

        {activeView === "Cases" && (
          <section className="single-grid">
            <CaseList activeCase={activeCase} caseFilter={caseFilter} filteredCases={filteredCases} setActiveCaseId={setActiveCaseId} setCaseFilter={setCaseFilter} />
            <CaseDetail activeCase={activeCase} caseRecords={caseRecords} data={data} setData={setData} editFinding={editFinding} deleteCase={deleteCase} />
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

function CaseDetail({ activeCase, caseRecords, data, setData, editFinding, deleteCase }) {
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
            <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-end" }}>
              <div className="status-strip">
                <Pill value={activeCase.status} />
                <Pill value={activeCase.priority} />
                <Pill value={activeCase.classification} />
                <Pill value={activeCase.investigationType} />
              </div>
              <button
                type="button"
                onClick={() => deleteCase(activeCase.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
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
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, marginBottom: 4, color: "#60716c", textTransform: "uppercase" }}>
              Case Opened (Date)
            </label>
            <input name="opened" type="date" />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, marginBottom: 4, color: "#60716c", textTransform: "uppercase" }}>
              Case Closed (Date)
            </label>
            <input name="closed" type="date" />
          </div>
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
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, marginBottom: 4, color: "#60716c", textTransform: "uppercase" }}>
              Date (YYYY-MM-DD)
            </label>
            <input name="source" placeholder="Location or source" disabled={!activeCase} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, marginBottom: 4, color: "#60716c", textTransform: "uppercase" }}>
              Event/Discovery Date (YYYY-MM-DD)
            </label>
            <input name="date" type="date" disabled={!activeCase} />
          </div>
        </div>
        <div style={{ marginTop: 10 }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, marginBottom: 4, color: "#60716c", textTransform: "uppercase" }}>
            Time (HH:MM - Optional)
          </label>
          <input name="time" type="time" disabled={!activeCase} />
        </div>
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
            {/* Edit Officer Info Form */}
            <div style={{ background: "#ffffff", border: "1px solid #dce4e1", borderRadius: 8, padding: 16, marginBottom: 16 }}>
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
                    supervisorName: fd.get("supervisorName").toString(),
                    contact: fd.get("contact").toString(),
                  });
                  alert("Officer information updated!");
                }}
                style={{ display: "grid", gap: 12 }}
              >
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "#60716c", textTransform: "uppercase" }}>Rank</label>
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
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "#60716c", textTransform: "uppercase" }}>Badge #</label>
                    <input name="badgeNumber" type="text" defaultValue={profile.officer.badgeNumber || ""} placeholder="e.g., 201" style={{ width: "100%" }} />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "#60716c", textTransform: "uppercase" }}>Assignment</label>
                    <input name="assignment" type="text" defaultValue={profile.officer.assignment || ""} placeholder="e.g., Patrol Division" style={{ width: "100%" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "#60716c", textTransform: "uppercase" }}>Division</label>
                    <input name="division" type="text" defaultValue={profile.officer.division || ""} placeholder="e.g., Special Operations" style={{ width: "100%" }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "#60716c", textTransform: "uppercase" }}>Supervisor Name</label>
                  <input name="supervisorName" type="text" defaultValue={profile.officer.supervisorName || ""} placeholder="e.g., Captain John Smith" style={{ width: "100%" }} />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "#60716c", textTransform: "uppercase" }}>Contact Info</label>
                  <input name="contact" type="text" defaultValue={profile.officer.contact || ""} placeholder="e.g., phone, email, or address" style={{ width: "100%" }} />
                </div>

                <button type="submit" className="primary" style={{ width: "100%" }}>Save Officer Information</button>
              </form>
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

function ViolationLibraryPanel({ violations, onEdit, onDelete }) {
  return (
    <div className="panel" style={{ padding: 16 }}>
      <h3 style={{ margin: "0 0 16px" }}>Offense Library</h3>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #dce4e1" }}>
              <th style={{ textAlign: "left", padding: "8px 0", fontWeight: 700, color: "#60716c" }}>Code</th>
              <th style={{ textAlign: "left", padding: "8px 0", fontWeight: 700, color: "#60716c" }}>Name</th>
              <th style={{ textAlign: "left", padding: "8px 0", fontWeight: 700, color: "#60716c" }}>Category</th>
              <th style={{ textAlign: "left", padding: "8px 0", fontWeight: 700, color: "#60716c" }}>Severity</th>
              <th style={{ textAlign: "left", padding: "8px 0", fontWeight: 700, color: "#60716c" }}>Default Discipline</th>
              <th style={{ textAlign: "center", padding: "8px 0", fontWeight: 700, color: "#60716c" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {violations.map((v) => (
              <tr key={v.id} style={{ borderBottom: "1px solid #edf1ef" }}>
                <td style={{ padding: "12px 0", fontWeight: 700, color: "#2f7f67" }}>{v.id}</td>
                <td style={{ padding: "12px 0" }}>{v.name}</td>
                <td style={{ padding: "12px 0" }}>{v.category}</td>
                <td style={{ padding: "12px 0" }}>{v.severityLevel}</td>
                <td style={{ padding: "12px 0" }}>{v.defaultDisciplineTemplate}</td>
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
                    onClick={() => onDelete(v.id)}
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

function ViolationForm({ violation, onSubmit, onCancel }) {
  return (
    <div className="panel" style={{ padding: 16 }}>
      <h3 style={{ margin: "0 0 16px" }}>
        {violation ? "Edit Violation" : "Create New Violation"}
      </h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(e);
        }}
        style={{ display: "grid", gap: 10 }}
      >
        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "#60716c", textTransform: "uppercase" }}>
            Code {violation && `(${violation.id})`}
          </label>
          <input
            name="code"
            defaultValue={violation?.id || ""}
            placeholder="Auto-generated"
            disabled
            style={{ background: "#f6f9f7", color: "#999" }}
          />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "#60716c", textTransform: "uppercase" }}>
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
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "#60716c", textTransform: "uppercase" }}>
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
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "#60716c", textTransform: "uppercase" }}>
              Category
            </label>
            <select name="category" defaultValue={violation?.category || "Other"}>
              {violationCategories.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "#60716c", textTransform: "uppercase" }}>
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
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "#60716c", textTransform: "uppercase" }}>
            Default Discipline
          </label>
          <select name="defaultDisciplineTemplate" defaultValue={violation?.defaultDisciplineTemplate || "None"}>
            {disciplineTemplates.map((disc) => (
              <option key={disc}>{disc}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "#60716c", textTransform: "uppercase" }}>
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
            <button type="button" onClick={onCancel} style={{ background: "#f6f9f7", border: "1px solid #dce4e1", borderRadius: 6, cursor: "pointer" }}>
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
              <th style={{ textAlign: "left", padding: "8px 0", fontWeight: 700, color: "#60716c" }}>Code</th>
              <th style={{ textAlign: "left", padding: "8px 0", fontWeight: 700, color: "#60716c" }}>Title</th>
              <th style={{ textAlign: "left", padding: "8px 0", fontWeight: 700, color: "#60716c" }}>Category</th>
              <th style={{ textAlign: "left", padding: "8px 0", fontWeight: 700, color: "#60716c" }}>Version</th>
              <th style={{ textAlign: "left", padding: "8px 0", fontWeight: 700, color: "#60716c" }}>Linked Violations</th>
              <th style={{ textAlign: "center", padding: "8px 0", fontWeight: 700, color: "#60716c" }}>Actions</th>
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
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "#60716c", textTransform: "uppercase" }}>
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
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "#60716c", textTransform: "uppercase" }}>
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
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "#60716c", textTransform: "uppercase" }}>
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
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "#60716c", textTransform: "uppercase" }}>
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
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "#60716c", textTransform: "uppercase" }}>
              Category
            </label>
            <select name="category" defaultValue={policy?.category || "Other"}>
              {policyCategories.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "#60716c", textTransform: "uppercase" }}>
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
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "#60716c", textTransform: "uppercase" }}>
            Effective Date
          </label>
          <input
            name="effectiveDate"
            type="date"
            defaultValue={policy?.effectiveDate || ""}
          />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "#60716c", textTransform: "uppercase" }}>
            Document Source
          </label>
          <input
            name="documentSource"
            defaultValue={policy?.documentSource || ""}
            placeholder="e.g., Department Policy Manual"
          />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "#60716c", textTransform: "uppercase" }}>
            Linked Violations (comma-separated)
          </label>
          <input
            name="linkedViolationIds"
            defaultValue={policy?.linkedViolationIds?.join(", ") || ""}
            placeholder="e.g., COND, EXFO, VIOL-001"
          />
          <small style={{ color: "#60716c", display: "block", marginTop: 4 }}>Enter violation codes separated by commas</small>
        </div>
        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "#60716c", textTransform: "uppercase" }}>
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
            <button type="button" onClick={onCancel} style={{ background: "#f6f9f7", border: "1px solid #dce4e1", borderRadius: 6, cursor: "pointer" }}>
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
          <div key={t.id} style={{ border: "1px solid #dce4e1", borderRadius: 6, padding: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 8 }}>
              <div>
                <strong style={{ fontSize: 14, color: "#17212b" }}>{t.name}</strong>
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
            <small style={{ color: "#60716c", display: "block", marginBottom: 4 }}>
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
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "#60716c", textTransform: "uppercase" }}>
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
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "#60716c", textTransform: "uppercase" }}>
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
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "#60716c", textTransform: "uppercase" }}>
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
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "#60716c", textTransform: "uppercase" }}>
              Category
            </label>
            <select name="category" defaultValue={template?.category || "General"}>
              {investigationTemplateCategories.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "#60716c", textTransform: "uppercase" }}>
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
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "#60716c", textTransform: "uppercase" }}>
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
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "#60716c", textTransform: "uppercase" }}>
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
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "#60716c", textTransform: "uppercase" }}>
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
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "#60716c", textTransform: "uppercase" }}>
              Linked Violations (comma-separated)
            </label>
            <input
              name="linkedViolations"
              defaultValue={template?.linkedViolations?.join(", ") || ""}
              placeholder="COND, EXFO, VIOL-001"
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "#60716c", textTransform: "uppercase" }}>
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
            <button type="button" onClick={onCancel} style={{ background: "#f6f9f7", border: "1px solid #dce4e1", borderRadius: 6, cursor: "pointer" }}>
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
            <div key={dropdown.key} style={{ border: "1px solid #dce4e1", borderRadius: 6, padding: 12 }}>
              <strong style={{ fontSize: 13 }}>{dropdown.label}</strong>
              <small style={{ display: "block", color: "#60716c", marginBottom: 10 }}>{dropdown.description}</small>
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
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "#60716c", textTransform: "uppercase" }}>
              Dropdown Name
            </label>
            <input
              type="text"
              value={newDropdownName}
              onChange={(e) => setNewDropdownName(e.target.value)}
              placeholder="e.g., DepartmentUnits (no spaces or special chars)"
            />
            <small style={{ color: "#60716c", display: "block", marginTop: 4 }}>
              Used internally; will be displayed nicely in forms
            </small>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "#60716c", textTransform: "uppercase" }}>
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
  const [, forceUpdate] = useState(0);
  const currentTheme = themeColors[themeIndex];

  function handleBrandingChange(field, value) {
    const updated = [...themeColors];
    updated[themeIndex] = {
      ...currentTheme,
      [field]: value,
    };
    // Update the themeColors array
    themeColors.splice(0, themeColors.length, ...updated);
    localStorage.setItem("theme-index", themeIndex.toString());

    // Apply CSS variables immediately
    if (field === "departmentName") {
      document.documentElement.style.setProperty("--dept-name", value);
    } else if (field === "departmentLogoUrl") {
      document.documentElement.style.setProperty("--dept-logo-url", value ? `url('${value}')` : "none");
    } else if (field === "reportHeaderText") {
      document.documentElement.style.setProperty("--report-header", value);
    } else if (field === "signatureBlockText") {
      document.documentElement.style.setProperty("--signature-block", value);
    } else if (field === "accentSecondaryColor") {
      document.documentElement.style.setProperty("--secondary-accent", value);
    }

    // Trigger re-render
    forceUpdate(prev => prev + 1);
  }

  return (
    <div className="panel" style={{ padding: 16 }}>
      <h3 style={{ margin: "0 0 16px" }}>System Branding</h3>
      <div style={{ display: "grid", gap: 16 }}>
        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 6, color: "#60716c", textTransform: "uppercase" }}>
            Department Name
          </label>
          <input
            type="text"
            value={currentTheme.departmentName}
            onChange={(e) => handleBrandingChange("departmentName", e.target.value)}
            placeholder="e.g., San Santos Police Department"
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 6, color: "#60716c", textTransform: "uppercase" }}>
            Department Logo URL
          </label>
          <input
            type="text"
            value={currentTheme.departmentLogoUrl}
            onChange={(e) => handleBrandingChange("departmentLogoUrl", e.target.value)}
            placeholder="https://example.com/logo.png"
          />
          {currentTheme.departmentLogoUrl && (
            <div style={{ marginTop: 8, padding: 8, background: "#f6f9f7", borderRadius: 6 }}>
              <small style={{ color: "#60716c" }}>Logo Preview:</small>
              <img
                src={currentTheme.departmentLogoUrl}
                alt="Department Logo"
                style={{ maxHeight: 60, marginTop: 4, borderRadius: 4 }}
                onError={() => {}}
              />
            </div>
          )}
        </div>

        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 6, color: "#60716c", textTransform: "uppercase" }}>
            Report Header Text
          </label>
          <input
            type="text"
            value={currentTheme.reportHeaderText}
            onChange={(e) => handleBrandingChange("reportHeaderText", e.target.value)}
            placeholder="e.g., Internal Affairs Division"
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 6, color: "#60716c", textTransform: "uppercase" }}>
            Signature Block Text
          </label>
          <input
            type="text"
            value={currentTheme.signatureBlockText}
            onChange={(e) => handleBrandingChange("signatureBlockText", e.target.value)}
            placeholder="e.g., Authorized by: "
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 6, color: "#60716c", textTransform: "uppercase" }}>
            Secondary Accent Color
          </label>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              type="color"
              value={currentTheme.accentSecondaryColor}
              onChange={(e) => handleBrandingChange("accentSecondaryColor", e.target.value)}
              style={{ width: 60, height: 44, border: "1px solid #dce4e1", borderRadius: 6, cursor: "pointer" }}
            />
            <input
              type="text"
              value={currentTheme.accentSecondaryColor}
              onChange={(e) => handleBrandingChange("accentSecondaryColor", e.target.value)}
              placeholder="#2f7f67"
              style={{ flex: 1 }}
            />
          </div>
        </div>

        <div style={{ padding: 12, background: "#eef5f1", borderRadius: 6, borderLeft: "4px solid var(--theme-accent)" }}>
          <strong style={{ fontSize: 13 }}>Preview</strong>
          <div style={{ marginTop: 12, fontSize: 13, color: "#42524e" }}>
            {currentTheme.departmentLogoUrl && (
              <img src={currentTheme.departmentLogoUrl} alt="Logo" style={{ maxHeight: 40, marginBottom: 8 }} />
            )}
            <div style={{ fontWeight: 700, marginBottom: 4 }}>{currentTheme.departmentName}</div>
            <div style={{ color: "#60716c", marginBottom: 4 }}>{currentTheme.reportHeaderText}</div>
            <div style={{ borderTop: "1px solid #dce4e1", paddingTop: 8, marginTop: 8 }}>
              {currentTheme.signatureBlockText}_________________
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

  function handleEditViolation(violationId) {
    setEditingViolation(data.violations.find((v) => v.id === violationId));
  }

  function handleSubmitViolation(e) {
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
    editViolation(editingViolation.id, updates);
    setEditingViolation(null);
    e.currentTarget.reset();
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
                <span style={{ fontSize: 14, fontWeight: 600, color: "#17212b" }}>
                  {theme.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        <BrandingSettingsPanel themeIndex={themeIndex} themeColors={themeColors} setThemeIndex={setThemeIndex} />

        <div className="panel" style={{ padding: 16 }}>
          <h3 style={{ margin: "0 0 16px" }}>Database Maintenance</h3>
          <p style={{ fontSize: 13, color: "#60716c", marginBottom: 12 }}>
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
          />
        )}

        {!editingViolation && (
          <ViolationForm onSubmit={createViolation} />
        )}
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
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, marginBottom: 4, color: "#60716c", textTransform: "uppercase" }}>
                    Incident Location
                  </label>
                  <input name="incidentLocation" placeholder="Where the incident occurred" defaultValue={"Unspecified"} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, marginBottom: 4, color: "#60716c", textTransform: "uppercase" }}>
                    Incident Date (YYYY-MM-DD)
                  </label>
                  <input name="incidentDate" type="date" placeholder="When the incident occurred" />
                </div>
              </div>
              <div className="row" style={{ marginTop: 10 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, marginBottom: 4, color: "#60716c", textTransform: "uppercase" }}>
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
        color: "#5a6b66"
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
          top: "12px",
          right: "28px",
          zIndex: 100,
          background: "transparent",
          border: "1px solid #dce4e1",
          padding: "8px 12px",
          borderRadius: "6px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          fontSize: "12px",
          fontWeight: 600,
          color: "#60716c",
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
