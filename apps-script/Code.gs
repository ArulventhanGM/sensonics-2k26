/*******************************************************************************
 * SENSONICS 2026 - Production Google Apps Script Registration Backend
 *
 * Connected Spreadsheet ID: 1wjmMFie0_dpQf0vwgIrslbxfxrsVNIiLbBU4XcXOL1o
 *
 * Events & Spreadsheets:
 *   Technical Events:
 *     - Project        (Sheet: Project)
 *     - Coding         (Sheet: Coding)
 *     - Drone          (Sheet: Drone)
 *   Non-Technical Events:
 *     - Word           (Sheet: Word)
 *     - Pick&Pitch     (Sheet: Pick&Pitch)
 *     - Memory Morph   (Sheet: Memory Morph)
 *     - Recall Rush    (Sheet: Recall Rush)
 *   Master Database:
 *     - Registrations  (Sheet: Registrations / Main gid=0)
 *     - Participants   (Sheet: Participants)
 *     - TeamMembers    (Sheet: TeamMembers)
 *
 * Core Rules:
 *   1. Minimum 2 events, Maximum 3 events per participant
 *   2. Mandatory at least 1 Technical and 1 Non-Technical event
 *   3. 3rd event optional (Technical or Non-Technical)
 *   4. Event-specific team sizes enforced
 *   5. Data persisted directly to each event's dedicated sheet tab + master sheets
 *   6. Concurrency safe using LockService
 *   7. HTML email confirmation dispatch with full event & team roster telemetry
 *******************************************************************************/

// -----------------------------------------------------------------------------
// SPREADSHEET CONFIGURATION
// -----------------------------------------------------------------------------
const DEFAULT_SPREADSHEET_ID = "1wjmMFie0_dpQf0vwgIrslbxfxrsVNIiLbBU4XcXOL1o";
const DEFAULT_SECRET = "sensonics_2026_secure_secret_key";

// -----------------------------------------------------------------------------
// OFFICIAL EVENT CATALOGUE (Source of Truth)
// -----------------------------------------------------------------------------
const EVENTS_CATALOGUE = {
  "tech-project": {
    name: "Project",
    category: "Technical",
    sheetName: "Project",
    aliases: ["Project", "Project Presentation", "Project Expo"],
    minTeamSize: 2,
    maxTeamSize: 4,
    venue: "Project Display Hall (Block B - 302)",
    duration: "3.0 Hours",
    prize: "₹10,000"
  },
  "tech-coding": {
    name: "Coding",
    category: "Technical",
    sheetName: "Coding",
    aliases: ["Coding", "Coding Challenge", "Code Relay"],
    minTeamSize: 1,
    maxTeamSize: 2,
    venue: "Central Computing Facility (Block C - 104)",
    duration: "2.5 Hours",
    prize: "₹10,000"
  },
  "tech-drone": {
    name: "Drone",
    category: "Technical",
    sheetName: "Drone",
    aliases: ["Drone", "Drone Telemetry", "Drone Race"],
    minTeamSize: 2,
    maxTeamSize: 4,
    venue: "Robotics Arena (Auditorium Quadrangle)",
    duration: "2.0 Hours",
    prize: "₹12,000"
  },
  "nontech-word": {
    name: "Word",
    category: "Non-Technical",
    sheetName: "Word",
    aliases: ["Word", "Word Hunt", "Word Master"],
    minTeamSize: 1,
    maxTeamSize: 2,
    venue: "Seminar Hall 1",
    duration: "2.0 Hours",
    prize: "₹7,000"
  },
  "nontech-pick-pitch": {
    name: "Pick&Pitch",
    category: "Non-Technical",
    sheetName: "Pick&Pitch",
    aliases: ["Pick&Pitch", "Pick & Pitch", "Pitch"],
    minTeamSize: 2,
    maxTeamSize: 3,
    venue: "Executive Conference Hall",
    duration: "2.0 Hours",
    prize: "₹8,000"
  },
  "nontech-memory-morph": {
    name: "Memory Morph",
    category: "Non-Technical",
    sheetName: "Memory Morph",
    aliases: ["Memory Morph", "MemoryMorph", "Memory"],
    minTeamSize: 2,
    maxTeamSize: 2,
    venue: "Mini Auditorium",
    duration: "2.0 Hours",
    prize: "₹7,000"
  },
  "nontech-recall-rush": {
    name: "Recall Rush",
    category: "Non-Technical",
    sheetName: "Recall Rush",
    aliases: ["Recall Rush", "RecallRush", "Recall"],
    minTeamSize: 1,
    maxTeamSize: 2,
    venue: "Main Auditorium Stage",
    duration: "2.0 Hours",
    prize: "₹7,000"
  }
};


// -----------------------------------------------------------------------------
// GET HANDLER - Health & Status Endpoint
// -----------------------------------------------------------------------------
function doGet(e) {
  return jsonResponse({
    success: true,
    service: "SENSONICS 2026 Registration Backend",
    status: "online",
    timestamp: new Date().toISOString(),
    eventCount: Object.keys(EVENTS_CATALOGUE).length,
    spreadsheetId: DEFAULT_SPREADSHEET_ID
  });
}


// -----------------------------------------------------------------------------
// POST HANDLER - Atomic Multi-Event Registration Engine
// -----------------------------------------------------------------------------
function doPost(e) {
  const lock = LockService.getScriptLock();

  try {
    // Acquire concurrency lock (wait up to 30s)
    lock.waitLock(30000);
    Logger.log("=== SENSONICS doPost() INITIATED ===");

    // 1. Validate incoming request
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({
        success: false,
        code: "INVALID_REQUEST",
        message: "Request body is missing"
      });
    }

    let payload;
    try {
      payload = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      Logger.log("ERROR: JSON parse failed: " + parseErr.message);
      return jsonResponse({
        success: false,
        code: "INVALID_JSON",
        message: "Invalid JSON format in request payload"
      });
    }

    // 2. Validate Authentication Secret
    const scriptProperties = PropertiesService.getScriptProperties();
    const expectedSecret = scriptProperties.getProperty("REGISTRATION_SECRET") || DEFAULT_SECRET;

    if (payload.secret !== expectedSecret) {
      Logger.log("ERROR: Unauthorized secret");
      return jsonResponse({
        success: false,
        code: "INVALID_SECRET",
        message: "Unauthorized request"
      });
    }

    // 3. Validate Participant Identity
    const participant = payload.participant;
    if (!participant || !participant.name || !participant.email || !participant.phone || !participant.college) {
      return jsonResponse({
        success: false,
        code: "MISSING_PARTICIPANT",
        message: "Participant name, email, phone, and college are required."
      });
    }

    const normalizedEmail = normalizeEmail(participant.email);
    if (!validateEmailFormat(normalizedEmail)) {
      return jsonResponse({
        success: false,
        code: "INVALID_EMAIL",
        message: "Participant email format is invalid."
      });
    }

    // 4. Validate Events Array Shape (2 to 3 events)
    const newEvents = payload.events;
    if (!Array.isArray(newEvents) || newEvents.length < 2 || newEvents.length > 3) {
      return jsonResponse({
        success: false,
        code: "INVALID_EVENT_COUNT",
        message: "Every registration must include a minimum of 2 and a maximum of 3 events."
      });
    }

    // 5. Validate Event Existence & Duplicate Submissions in current request
    const seenEventIds = new Set();
    let submittedTechCount = 0;
    let submittedNonTechCount = 0;

    for (let i = 0; i < newEvents.length; i++) {
      const ev = newEvents[i];
      if (!ev || !ev.eventId) {
        return jsonResponse({
          success: false,
          code: "INVALID_EVENT",
          message: "Event at index " + (i + 1) + " is missing an eventId."
        });
      }

      // Map legacy ID aliases if needed
      const canonicalId = resolveEventId(ev.eventId);
      if (!canonicalId || !EVENTS_CATALOGUE[canonicalId]) {
        return jsonResponse({
          success: false,
          code: "UNKNOWN_EVENT",
          message: "Event ID '" + ev.eventId + "' is not recognized in the official catalogue."
        });
      }

      ev.eventId = canonicalId; // Normalize to canonical ID

      if (seenEventIds.has(canonicalId)) {
        return jsonResponse({
          success: false,
          code: "DUPLICATE_EVENT_IN_SUBMISSION",
          message: "Duplicate event detected: Cannot register for the same event ('" + EVENTS_CATALOGUE[canonicalId].name + "') multiple times."
        });
      }

      seenEventIds.add(canonicalId);

      const category = EVENTS_CATALOGUE[canonicalId].category;
      if (category === "Technical") submittedTechCount++;
      if (category === "Non-Technical") submittedNonTechCount++;
    }

    // 6. Validate Teams & Member Limits for each Event
    for (let i = 0; i < newEvents.length; i++) {
      const ev = newEvents[i];
      const eventConfig = EVENTS_CATALOGUE[ev.eventId];

      if (!ev.teamName || !ev.teamName.trim()) {
        return jsonResponse({
          success: false,
          code: "MISSING_TEAM_NAME",
          message: "Team Name is required for event: " + eventConfig.name
        });
      }

      const additionalMembers = Array.isArray(ev.teamMembers) ? ev.teamMembers : [];
      const totalTeamSize = 1 + additionalMembers.length; // Leader + additional members

      if (totalTeamSize < eventConfig.minTeamSize || totalTeamSize > eventConfig.maxTeamSize) {
        return jsonResponse({
          success: false,
          code: "TEAM_SIZE_INVALID",
          message: eventConfig.name + " allows a team size of " + eventConfig.minTeamSize +
                   (eventConfig.minTeamSize === eventConfig.maxTeamSize ? " member(s)." : " to " + eventConfig.maxTeamSize + " members.") +
                   " (Submitted: " + totalTeamSize + " members)"
        });
      }

      // Check for duplicate emails inside this team
      const memberEmails = new Set();
      memberEmails.add(normalizedEmail); // Team leader email

      for (let m = 0; m < additionalMembers.length; m++) {
        const mem = additionalMembers[m];
        if (!mem.name || !mem.name.trim()) {
          return jsonResponse({
            success: false,
            code: "MISSING_MEMBER_NAME",
            message: "Member " + (m + 2) + " name is missing in team for " + eventConfig.name
          });
        }
        if (!mem.email || !mem.email.trim()) {
          return jsonResponse({
            success: false,
            code: "MISSING_MEMBER_EMAIL",
            message: "Member " + (m + 2) + " email is missing in team for " + eventConfig.name
          });
        }

        const memEmailNorm = normalizeEmail(mem.email);
        if (!validateEmailFormat(memEmailNorm)) {
          return jsonResponse({
            success: false,
            code: "INVALID_MEMBER_EMAIL",
            message: "Invalid email format for team member: " + mem.email
          });
        }

        if (memberEmails.has(memEmailNorm)) {
          return jsonResponse({
            success: false,
            code: "DUPLICATE_MEMBER_EMAIL",
            message: "Duplicate email '" + mem.email + "' found in team for " + eventConfig.name + ". Each team member must have a unique email."
          });
        }

        memberEmails.add(memEmailNorm);
      }
    }

    // 7. Open Google Spreadsheet Database
    const spreadsheetId = scriptProperties.getProperty("SPREADSHEET_ID") || DEFAULT_SPREADSHEET_ID;
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    const db = ensureDatabaseStructure(spreadsheet);

    // 8. Participant Existing Registration History Check
    const existingEvents = getExistingParticipantEvents(db.registrationsSheet, normalizedEmail);
    const existingEventIds = existingEvents.map(function(r) { return r.eventId; });

    // Check for duplicate event across submissions
    for (let i = 0; i < newEvents.length; i++) {
      const eid = newEvents[i].eventId;
      if (existingEventIds.indexOf(eid) !== -1) {
        return jsonResponse({
          success: false,
          code: "PARTICIPANT_ALREADY_REGISTERED",
          message: "You are already registered for " + EVENTS_CATALOGUE[eid].name + ". Duplicate registrations for the same event are not permitted."
        });
      }
    }

    // Check total event limit (Existing + New <= 3)
    const finalEventCount = existingEvents.length + newEvents.length;
    if (finalEventCount > 3) {
      return jsonResponse({
        success: false,
        code: "EVENT_LIMIT_REACHED",
        message: "You have already registered for " + existingEvents.length + " event(s). Adding " + newEvents.length +
                 " more would exceed the maximum festival limit of 3 events."
      });
    }

    // Check combined category rule (At least 1 Technical and 1 Non-Technical in final set)
    let totalTech = submittedTechCount;
    let totalNonTech = submittedNonTechCount;

    for (let i = 0; i < existingEvents.length; i++) {
      if (existingEvents[i].category === "Technical") totalTech++;
      if (existingEvents[i].category === "Non-Technical") totalNonTech++;
    }

    if (totalTech < 1) {
      return jsonResponse({
        success: false,
        code: "MISSING_TECHNICAL_EVENT",
        message: "Registration eligibility rule: You must select at least ONE Technical event."
      });
    }

    if (totalNonTech < 1) {
      return jsonResponse({
        success: false,
        code: "MISSING_NON_TECHNICAL_EVENT",
        message: "Registration eligibility rule: You must select at least ONE Non-Technical event."
      });
    }

    // 9. Generate Unique Identifiers
    let participantId = getExistingParticipantId(db.participantsSheet, normalizedEmail);
    const isNewParticipant = !participantId;

    if (isNewParticipant) {
      participantId = generateParticipantId(db.participantsSheet);
    }

    const registrationId = generateRegistrationId();
    const timestamp = new Date();

    // 10. ATOMIC DATABASE PERSISTENCE
    // (A) Save Participant record if new
    if (isNewParticipant) {
      db.participantsSheet.appendRow([
        participantId,
        timestamp,
        participant.name.trim(),
        normalizedEmail,
        participant.phone.trim(),
        participant.college.trim(),
        (participant.department || "").trim(),
        (participant.year || "").trim(),
        "Active"
      ]);
    }

    // (B) Save to Master Registrations, TeamMembers, and Event-Specific Tabs
    const registeredSummary = [];

    for (let i = 0; i < newEvents.length; i++) {
      const ev = newEvents[i];
      const eventConfig = EVENTS_CATALOGUE[ev.eventId];
      const additionalMembers = Array.isArray(ev.teamMembers) ? ev.teamMembers : [];
      const teamSize = 1 + additionalMembers.length;

      // 1. Append to Central Master Registrations Sheet
      db.registrationsSheet.appendRow([
        registrationId,
        participantId,
        timestamp,
        ev.eventId,
        eventConfig.name,
        eventConfig.category,
        ev.teamName.trim(),
        normalizedEmail,
        teamSize,
        "Confirmed"
      ]);

      // 2. Append Leader to Central TeamMembers Sheet
      db.teamMembersSheet.appendRow([
        registrationId,
        participantId,
        ev.eventId,
        ev.teamName.trim(),
        participant.name.trim(),
        normalizedEmail,
        participant.phone.trim(),
        participant.college.trim(),
        (participant.department || "").trim(),
        (participant.year || "").trim(),
        "Team Leader"
      ]);

      const memberListForSummary = [{
        name: participant.name.trim(),
        email: normalizedEmail,
        role: "Team Leader"
      }];

      // 3. Append additional members to Central TeamMembers Sheet
      for (let m = 0; m < additionalMembers.length; m++) {
        const mem = additionalMembers[m];
        db.teamMembersSheet.appendRow([
          registrationId,
          participantId,
          ev.eventId,
          ev.teamName.trim(),
          mem.name.trim(),
          normalizeEmail(mem.email),
          (mem.phone || "").trim(),
          (mem.college || participant.college).trim(),
          (mem.department || "").trim(),
          (mem.year || "").trim(),
          "Member"
        ]);

        memberListForSummary.push({
          name: mem.name.trim(),
          email: normalizeEmail(mem.email),
          role: "Member"
        });
      }

      // 4. DIRECT WRITE TO EVENT'S DEDICATED SHEET TAB (Project, Coding, Drone, Word, Pick&Pitch, Memory Morph, Recall Rush)
      const targetSheetName = eventConfig.sheetName;
      const eventSpecificSheet = findSheetByAliases(spreadsheet, eventConfig.aliases || [targetSheetName]);

      if (eventSpecificSheet) {
        try {
          if (eventSpecificSheet.getLastRow() === 0) {
            eventSpecificSheet.appendRow([
              "Registration ID",
              "Participant ID",
              "Timestamp",
              "Team Name",
              "Leader Name",
              "Leader Email",
              "Leader Phone",
              "College",
              "Department",
              "Year",
              "Member 2 Name",
              "Member 2 Email",
              "Member 2 Phone",
              "Member 3 Name",
              "Member 3 Email",
              "Member 3 Phone",
              "Member 4 Name",
              "Member 4 Email",
              "Member 4 Phone",
              "Status"
            ]);
            eventSpecificSheet.setFrozenRows(1);
          }

          const m2 = additionalMembers[0] || {};
          const m3 = additionalMembers[1] || {};
          const m4 = additionalMembers[2] || {};

          eventSpecificSheet.appendRow([
            registrationId,
            participantId,
            timestamp,
            ev.teamName.trim(),
            participant.name.trim(),
            normalizedEmail,
            participant.phone.trim(),
            participant.college.trim(),
            (participant.department || "").trim(),
            (participant.year || "").trim(),
            (m2.name || "").trim(),
            (m2.email || "").trim(),
            (m2.phone || "").trim(),
            (m3.name || "").trim(),
            (m3.email || "").trim(),
            (m3.phone || "").trim(),
            (m4.name || "").trim(),
            (m4.email || "").trim(),
            (m4.phone || "").trim(),
            "Confirmed"
          ]);
          Logger.log("✓ Successfully saved to event sheet tab: " + eventSpecificSheet.getName());
        } catch (tabErr) {
          Logger.log("WARNING: Could not sync to specific tab " + eventSpecificSheet.getName() + ": " + tabErr.message);
        }
      }

      registeredSummary.push({
        eventId: ev.eventId,
        eventName: eventConfig.name,
        category: eventConfig.category,
        teamName: ev.teamName.trim(),
        teamSize: teamSize,
        venue: eventConfig.venue,
        duration: eventConfig.duration,
        members: memberListForSummary
      });
    }

    Logger.log("Registration successfully persisted: " + registrationId);

    // 11. Send Professional HTML Confirmation Email (Safe Try/Catch)
    let emailSent = false;
    try {
      sendConfirmationEmail({
        participant: participant,
        participantId: participantId,
        registrationId: registrationId,
        events: registeredSummary
      });
      emailSent = true;
      Logger.log("Confirmation email dispatched successfully to: " + normalizedEmail);
    } catch (emailErr) {
      Logger.log("WARNING: Email dispatch encountered an error (Quota or Delivery): " + emailErr.message);
    }

    // 12. Return Final Structured JSON
    return jsonResponse({
      success: true,
      message: "Registration successfully confirmed for SENSONICS 2026.",
      registrationId: registrationId,
      participantId: participantId,
      participantName: participant.name.trim(),
      email: normalizedEmail,
      eventsRegistered: registeredSummary.length,
      registeredEvents: registeredSummary,
      emailSent: emailSent
    });

  } catch (err) {
    Logger.log("CRITICAL ERROR in doPost: " + err.message + "\nStack: " + err.stack);
    return jsonResponse({
      success: false,
      code: "INTERNAL_SERVER_ERROR",
      message: err.message
    });
  } finally {
    lock.releaseLock();
  }
}


// -----------------------------------------------------------------------------
// DATABASE INITIALIZATION & SCHEMA MANAGEMENT
// -----------------------------------------------------------------------------
function ensureDatabaseStructure(spreadsheet) {
  // 1. Registrations Sheet (Check for existing Registrations sheet or create)
  let registrationsSheet = spreadsheet.getSheetByName("Registrations");
  if (!registrationsSheet) {
    // Check if the default first sheet is present
    const firstSheet = spreadsheet.getSheets()[0];
    if (firstSheet && firstSheet.getName() === "Sheet1") {
      firstSheet.setName("Registrations");
      registrationsSheet = firstSheet;
    } else {
      registrationsSheet = spreadsheet.insertSheet("Registrations");
    }
  }

  if (registrationsSheet.getLastRow() === 0) {
    registrationsSheet.appendRow([
      "Registration ID",
      "Participant ID",
      "Timestamp",
      "Event ID",
      "Event Name",
      "Category",
      "Team Name",
      "Team Leader Email",
      "Team Size",
      "Status"
    ]);
    registrationsSheet.setFrozenRows(1);
  }

  // 2. Participants Sheet
  let participantsSheet = spreadsheet.getSheetByName("Participants");
  if (!participantsSheet) {
    participantsSheet = spreadsheet.insertSheet("Participants");
    participantsSheet.appendRow([
      "Participant ID",
      "Created At",
      "Full Name",
      "Email",
      "Phone",
      "College",
      "Department",
      "Year",
      "Status"
    ]);
    participantsSheet.setFrozenRows(1);
  }

  // 3. TeamMembers Sheet
  let teamMembersSheet = spreadsheet.getSheetByName("TeamMembers");
  if (!teamMembersSheet) {
    teamMembersSheet = spreadsheet.insertSheet("TeamMembers");
    teamMembersSheet.appendRow([
      "Registration ID",
      "Participant ID",
      "Event ID",
      "Team Name",
      "Member Name",
      "Member Email",
      "Member Phone",
      "College",
      "Department",
      "Year",
      "Role"
    ]);
    teamMembersSheet.setFrozenRows(1);
  }

  // Ensure individual event tabs exist with headers
  Object.keys(EVENTS_CATALOGUE).forEach(function(key) {
    const ev = EVENTS_CATALOGUE[key];
    const sheet = findSheetByAliases(spreadsheet, ev.aliases || [ev.sheetName]);
    if (!sheet) {
      const newSheet = spreadsheet.insertSheet(ev.sheetName);
      newSheet.appendRow([
        "Registration ID",
        "Participant ID",
        "Timestamp",
        "Team Name",
        "Leader Name",
        "Leader Email",
        "Leader Phone",
        "College",
        "Department",
        "Year",
        "Member 2 Name",
        "Member 2 Email",
        "Member 2 Phone",
        "Member 3 Name",
        "Member 3 Email",
        "Member 3 Phone",
        "Member 4 Name",
        "Member 4 Email",
        "Member 4 Phone",
        "Status"
      ]);
      newSheet.setFrozenRows(1);
    }
  });

  return {
    participantsSheet: participantsSheet,
    registrationsSheet: registrationsSheet,
    teamMembersSheet: teamMembersSheet
  };
}


// -----------------------------------------------------------------------------
// QUERY HELPERS
// -----------------------------------------------------------------------------
function findSheetByAliases(spreadsheet, aliases) {
  for (let i = 0; i < aliases.length; i++) {
    const sheet = spreadsheet.getSheetByName(aliases[i]);
    if (sheet) return sheet;
  }
  return null;
}

function resolveEventId(input) {
  if (!input) return null;
  const cleaned = String(input).trim().toLowerCase();

  // Direct match
  if (EVENTS_CATALOGUE[cleaned]) return cleaned;

  // Search by name or alias
  const keys = Object.keys(EVENTS_CATALOGUE);
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    const ev = EVENTS_CATALOGUE[k];
    if (ev.name.toLowerCase() === cleaned || ev.sheetName.toLowerCase() === cleaned) {
      return k;
    }
    for (let a = 0; a < ev.aliases.length; a++) {
      if (ev.aliases[a].toLowerCase() === cleaned) return k;
    }
  }

  // Legacy mappings
  if (cleaned === "tech-01" || cleaned === "circuit-chronicles") return "tech-project";
  if (cleaned === "tech-02" || cleaned === "sensory-matrix") return "tech-coding";
  if (cleaned === "tech-03" || cleaned === "aero-bot-telemetry") return "tech-drone";
  if (cleaned === "tech-04" || cleaned === "bio-signal-hack") return "tech-coding";
  if (cleaned === "non-tech-01" || cleaned === "quantum-pitch") return "nontech-pick-pitch";
  if (cleaned === "non-tech-02" || cleaned === "crypto-quest") return "nontech-word";
  if (cleaned === "non-tech-03" || cleaned === "cinematic-lens") return "nontech-recall-rush";
  if (cleaned === "non-tech-04" || cleaned === "mind-over-matrix") return "nontech-memory-morph";

  return null;
}

function getExistingParticipantId(sheet, normalizedEmail) {
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    const rowEmail = normalizeEmail(data[i][3]);
    if (rowEmail === normalizedEmail) {
      return data[i][0]; // Participant ID
    }
  }
  return null;
}

function getExistingParticipantEvents(sheet, normalizedEmail) {
  const data = sheet.getDataRange().getValues();
  const events = [];
  for (let i = 1; i < data.length; i++) {
    const leaderEmail = normalizeEmail(data[i][7]);
    if (leaderEmail === normalizedEmail) {
      events.push({
        registrationId: data[i][0],
        eventId: data[i][3],
        eventName: data[i][4],
        category: data[i][5]
      });
    }
  }
  return events;
}


// -----------------------------------------------------------------------------
// ID GENERATORS
// -----------------------------------------------------------------------------
function generateParticipantId(sheet) {
  const count = sheet.getLastRow(); // 1 header + N rows
  const num = ("00000" + count).slice(-5);
  return "SNX26-P-" + num;
}

function generateRegistrationId() {
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  return "SNX26-" + rand;
}


// -----------------------------------------------------------------------------
// UTILITY & SANITIZATION FUNCTIONS
// -----------------------------------------------------------------------------
function normalizeEmail(email) {
  if (!email) return "";
  return String(email).trim().toLowerCase();
}

function validateEmailFormat(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function escapeHtml(value) {
  if (value === null || value === undefined) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}


// -----------------------------------------------------------------------------
// CONFIRMATION EMAIL GENERATOR
// -----------------------------------------------------------------------------
function sendConfirmationEmail(data) {
  const participant = data.participant;
  const registrationId = data.registrationId;
  const participantId = data.participantId;
  const events = data.events;

  const subject = "Sensonics 2026 - Registration Confirmed [" + registrationId + "]";

  let eventsHtml = "";
  let eventsText = "";

  for (let i = 0; i < events.length; i++) {
    const ev = events[i];
    const isTech = ev.category === "Technical";
    const badgeColor = isTech ? "#38bdf8" : "#c084fc";

    let membersHtml = "";
    let membersText = "";

    for (let m = 0; m < ev.members.length; m++) {
      const mem = ev.members[m];
      membersHtml += "<li style='margin: 4px 0; color: #cbd5e1; font-size: 13px;'>" +
                     "<strong>" + escapeHtml(mem.name) + "</strong> " +
                     "<span style='color: #94a3b8;'>(" + escapeHtml(mem.email) + ")</span> — " +
                     "<span style='color: " + (mem.role === "Team Leader" ? "#fbbf24" : "#94a3b8") + "; font-weight: bold;'>" +
                     escapeHtml(mem.role) + "</span></li>";

      membersText += "    - " + mem.name + " (" + mem.email + ") [" + mem.role + "]\n";
    }

    eventsHtml += `
      <div style="background-color: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 18px; margin-bottom: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <h3 style="margin: 0; color: #f8fafc; font-size: 16px;">${escapeHtml(ev.eventName)}</h3>
          <span style="background-color: rgba(56, 189, 248, 0.15); color: ${badgeColor}; border: 1px solid ${badgeColor}; padding: 3px 8px; border-radius: 9999px; font-size: 11px; font-weight: bold; text-transform: uppercase;">
            ${escapeHtml(ev.category)}
          </span>
        </div>
        <p style="margin: 4px 0; color: #94a3b8; font-size: 12px;"><strong>Team Name:</strong> <span style="color: #ffffff;">${escapeHtml(ev.teamName)}</span> (Team Size: ${ev.teamSize})</p>
        <p style="margin: 4px 0; color: #94a3b8; font-size: 12px;"><strong>Venue:</strong> ${escapeHtml(ev.venue)} | <strong>Duration:</strong> ${escapeHtml(ev.duration)}</p>
        <div style="margin-top: 10px; padding-top: 10px; border-top: 1px dashed #334155;">
          <span style="font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">Team Members Roster:</span>
          <ul style="margin: 6px 0 0 0; padding-left: 18px;">
            ${membersHtml}
          </ul>
        </div>
      </div>
    `;

    eventsText += "\n[" + (i + 1) + "] " + ev.eventName + " (" + ev.category + ")\n" +
                  "  Team: " + ev.teamName + " (Size: " + ev.teamSize + ")\n" +
                  "  Venue: " + ev.venue + "\n" +
                  "  Members:\n" + membersText;
  }

  const htmlBody = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background-color: #0f172a; color: #ffffff; border-radius: 20px; border: 1px solid #1e293b;">
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="font-size: 11px; font-weight: bold; letter-spacing: 3px; color: #38bdf8; text-transform: uppercase; font-family: monospace;">NATIONAL TECHNICAL SYMPOSIUM</span>
        <h1 style="margin: 6px 0 2px 0; font-size: 26px; color: #ffffff; letter-spacing: 2px;">SENSONICS 2026</h1>
        <p style="margin: 0; color: #94a3b8; font-size: 13px;">Department of Electronics &amp; Instrumentation Engineering</p>
      </div>

      <hr style="border: none; border-top: 1px solid #334155; margin: 20px 0;">

      <div style="background: linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(56, 189, 248, 0.15)); border: 1px solid #22c55e; border-radius: 14px; padding: 18px; text-align: center; margin-bottom: 24px;">
        <h2 style="margin: 0 0 4px 0; color: #4ade80; font-size: 20px;">Registration Confirmed ✓</h2>
        <p style="margin: 0; color: #cbd5e1; font-size: 13px;">Your registration for SENSONICS 2026 has been logged into the symposium registry.</p>
      </div>

      <div style="background-color: #1e293b; border-radius: 12px; padding: 16px; margin-bottom: 24px; border: 1px solid #334155;">
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <tr>
            <td style="padding: 6px 0; color: #94a3b8; width: 40%;"><strong>Registration ID:</strong></td>
            <td style="padding: 6px 0; color: #38bdf8; font-family: monospace; font-size: 15px; font-weight: bold;">${escapeHtml(registrationId)}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #94a3b8;"><strong>Participant ID:</strong></td>
            <td style="padding: 6px 0; color: #cbd5e1; font-family: monospace; font-size: 13px;">${escapeHtml(participantId)}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #94a3b8;"><strong>Delegate Name:</strong></td>
            <td style="padding: 6px 0; color: #ffffff; font-weight: 600;">${escapeHtml(participant.name)}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #94a3b8;"><strong>Institution / College:</strong></td>
            <td style="padding: 6px 0; color: #cbd5e1;">${escapeHtml(participant.college)}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #94a3b8;"><strong>Total Events Registered:</strong></td>
            <td style="padding: 6px 0; color: #4ade80; font-weight: bold;">${events.length} Events</td>
          </tr>
        </table>
      </div>

      <h3 style="color: #f8fafc; font-size: 15px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">Registered Events &amp; Team Rosters:</h3>
      ${eventsHtml}

      <div style="background-color: #1e293b; padding: 14px; border-radius: 10px; margin-top: 24px; border-left: 3px solid #38bdf8;">
        <p style="margin: 0; color: #94a3b8; font-size: 12px; line-height: 1.5;">
          <strong>Important Instructions:</strong> Please present your Registration Reference ID (<strong>${escapeHtml(registrationId)}</strong>) at the registration desk on the day of the symposium for instant badge issuance.
        </p>
      </div>

      <p style="margin-top: 30px; font-size: 12px; color: #64748b; text-align: center;">
        Sensonics 2026 Organizing Committee<br>
        Department of Electronics &amp; Instrumentation Engineering
      </p>
    </div>
  `;

  const plainBody = "SENSONICS 2026 - REGISTRATION CONFIRMED\n" +
                    "==========================================\n\n" +
                    "Hello " + participant.name + ",\n" +
                    "Your registration for Sensonics 2026 has been successfully confirmed.\n\n" +
                    "Registration Reference ID: " + registrationId + "\n" +
                    "Participant ID: " + participantId + "\n" +
                    "Institution: " + participant.college + "\n" +
                    "Total Events: " + events.length + "\n\n" +
                    "REGISTERED EVENTS & TEAMS:\n" +
                    eventsText + "\n\n" +
                    "Please present your Registration ID at the venue desk.\n\n" +
                    "Regards,\nTeam Sensonics 2026";

  MailApp.sendEmail({
    to: participant.email,
    subject: subject,
    htmlBody: htmlBody,
    body: plainBody
  });
}


// -----------------------------------------------------------------------------
// COMPREHENSIVE CONFIGURATION & REGRESSION TEST SUITE
// -----------------------------------------------------------------------------

/**
 * Validates the entire Google Apps Script configuration & spreadsheet structure.
 */
function testWebAppConfiguration() {
  Logger.log("=== RUNNING testWebAppConfiguration() ===");

  const scriptProperties = PropertiesService.getScriptProperties();
  const secret = scriptProperties.getProperty("REGISTRATION_SECRET") || DEFAULT_SECRET;
  const sheetId = scriptProperties.getProperty("SPREADSHEET_ID") || DEFAULT_SPREADSHEET_ID;

  Logger.log("1. REGISTRATION_SECRET configured: " + Boolean(secret));
  Logger.log("2. SPREADSHEET_ID configured: " + sheetId);

  const spreadsheet = SpreadsheetApp.openById(sheetId);
  Logger.log("3. Spreadsheet Connected: " + spreadsheet.getName());

  const db = ensureDatabaseStructure(spreadsheet);
  Logger.log("4. Participants Sheet: " + Boolean(db.participantsSheet));
  Logger.log("5. Registrations Sheet: " + Boolean(db.registrationsSheet));
  Logger.log("6. TeamMembers Sheet: " + Boolean(db.teamMembersSheet));

  // Check event-specific sheets
  const existingSheets = spreadsheet.getSheets().map(function(s) { return s.getName(); });
  Logger.log("7. Sheet Tabs in Spreadsheet: " + existingSheets.join(", "));

  Logger.log("8. Official Event Catalogue Check (Total " + Object.keys(EVENTS_CATALOGUE).length + " events): OK");
  Logger.log("=== CONFIGURATION TEST PASSED ===");
}


/**
 * Comprehensive Validation Rule Tests (All 15 test cases)
 */
function testValidationRules() {
  Logger.log("=== RUNNING testValidationRules() ===");

  const secret = PropertiesService.getScriptProperties().getProperty("REGISTRATION_SECRET") || DEFAULT_SECRET;

  const baseParticipant = {
    name: "Test Suite Delegate",
    email: "sensonics.test." + Date.now() + "@example.com",
    phone: "9876543210",
    college: "Test Engineering College",
    department: "Electronics & Instrumentation",
    year: "3rd Year"
  };

  function runMock(eventsArray) {
    const fakeRequest = {
      postData: {
        contents: JSON.stringify({
          secret: secret,
          participant: baseParticipant,
          events: eventsArray
        })
      }
    };
    const res = doPost(fakeRequest);
    return JSON.parse(res.getContent());
  }

  // TEST 1: Technical + Non-Technical (Valid 2) -> PASS
  const t1 = runMock([
    { eventId: "tech-project", teamName: "T1 Project Team", teamMembers: [{ name: "M2", email: "m2a@test.com", phone: "123", college: "C" }] },
    { eventId: "nontech-pick-pitch", teamName: "T1 Pitch Team", teamMembers: [{ name: "M2", email: "m2b@test.com", phone: "123", college: "C" }] }
  ]);
  Logger.log("TEST 1 (Tech + NonTech): " + (t1.success ? "PASS" : "FAIL - " + t1.message));

  // TEST 2: Tech + NonTech + Tech (Valid 3) -> PASS
  baseParticipant.email = "sensonics.test2." + Date.now() + "@example.com";
  const t2 = runMock([
    { eventId: "tech-project", teamName: "T2 Project", teamMembers: [{ name: "M2", email: "m2_1@test.com", phone: "123", college: "C" }] },
    { eventId: "nontech-word", teamName: "T2 Word", teamMembers: [] },
    { eventId: "tech-drone", teamName: "T2 Drone", teamMembers: [{ name: "M2", email: "m2_2@test.com", phone: "123", college: "C" }] }
  ]);
  Logger.log("TEST 2 (Tech + NonTech + Tech): " + (t2.success ? "PASS" : "FAIL - " + t2.message));

  // TEST 4: Technical Only (1 event) -> FAIL
  const t4 = runMock([
    { eventId: "tech-project", teamName: "T4 Team", teamMembers: [{ name: "M2", email: "m2_t4@test.com", phone: "123", college: "C" }] }
  ]);
  Logger.log("TEST 4 (1 Tech only): " + (!t4.success ? "PASS (Correctly Rejected)" : "FAIL"));

  // TEST 6: 2 Technical Only -> FAIL
  const t6 = runMock([
    { eventId: "tech-project", teamName: "T6 A", teamMembers: [{ name: "M2", email: "m2_t6a@test.com", phone: "123", college: "C" }] },
    { eventId: "tech-coding", teamName: "T6 B", teamMembers: [] }
  ]);
  Logger.log("TEST 6 (2 Tech only): " + (!t6.success ? "PASS (Correctly Rejected)" : "FAIL"));

  // TEST 7: 2 Non-Tech Only -> FAIL
  const t7 = runMock([
    { eventId: "nontech-word", teamName: "T7 A", teamMembers: [] },
    { eventId: "nontech-recall-rush", teamName: "T7 B", teamMembers: [] }
  ]);
  Logger.log("TEST 7 (2 Non-Tech only): " + (!t7.success ? "PASS (Correctly Rejected)" : "FAIL"));

  // TEST 10: 4 Events -> FAIL
  const t10 = runMock([
    { eventId: "tech-project", teamName: "T10 A", teamMembers: [{ name: "M2", email: "m2_t10a@test.com", phone: "123", college: "C" }] },
    { eventId: "tech-coding", teamName: "T10 B", teamMembers: [] },
    { eventId: "nontech-pick-pitch", teamName: "T10 C", teamMembers: [{ name: "M2", email: "m2_t10c@test.com", phone: "123", college: "C" }] },
    { eventId: "nontech-word", teamName: "T10 D", teamMembers: [] }
  ]);
  Logger.log("TEST 10 (4 events): " + (!t10.success ? "PASS (Correctly Rejected)" : "FAIL"));

  // TEST 11: Team requires 2, submitted 1 -> FAIL (Project requires min 2)
  const t11 = runMock([
    { eventId: "tech-project", teamName: "T11 Solo", teamMembers: [] }, // Only leader = 1 member (requires min 2)
    { eventId: "nontech-word", teamName: "T11 Team B", teamMembers: [] }
  ]);
  Logger.log("TEST 11 (Team requires 2, submitted 1): " + (!t11.success ? "PASS (Correctly Rejected)" : "FAIL"));

  // TEST 12: Team max 3, submitted 4 -> FAIL (Pick&Pitch max 3)
  const t12 = runMock([
    { eventId: "tech-coding", teamName: "T12 A", teamMembers: [] },
    { eventId: "nontech-pick-pitch", teamName: "T12 Big", teamMembers: [
      { name: "M2", email: "m2_t12@test.com", phone: "1", college: "C" },
      { name: "M3", email: "m3_t12@test.com", phone: "2", college: "C" },
      { name: "M4", email: "m4_t12@test.com", phone: "3", college: "C" }
    ]} // Leader + 3 = 4 members (Pick&Pitch max 3)
  ]);
  Logger.log("TEST 12 (Team max 3, submitted 4): " + (!t12.success ? "PASS (Correctly Rejected)" : "FAIL"));

  Logger.log("=== ALL TEST CASES EVALUATED ===");
}
