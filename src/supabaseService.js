import { supabase } from "./supabaseClient";

// ============================================
// AUTHENTICATION
// ============================================
export const authService = {
  signup: async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    return { data, error };
  },

  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  logout: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  getSession: async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    return { session, error };
  },

  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback);
  },
};

// ============================================
// CASES
// ============================================
export const casesService = {
  getAll: async () => {
    const { data, error } = await supabase.from("cases").select("*");
    return { data, error };
  },

  getOne: async (id) => {
    const { data, error } = await supabase
      .from("cases")
      .select("*")
      .eq("id", id)
      .single();
    return { data, error };
  },

  create: async (caseData) => {
    const { data, error } = await supabase
      .from("cases")
      .insert([caseData])
      .select()
      .single();
    return { data, error };
  },

  update: async (id, updates) => {
    const { data, error } = await supabase
      .from("cases")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  },

  delete: async (id) => {
    const { error } = await supabase.from("cases").delete().eq("id", id);
    return { error };
  },
};

// ============================================
// COMPLAINTS
// ============================================
export const complaintsService = {
  getAll: async () => {
    const { data, error } = await supabase.from("complaints").select("*");
    return { data, error };
  },

  getOne: async (id) => {
    const { data, error } = await supabase
      .from("complaints")
      .select("*")
      .eq("id", id)
      .single();
    return { data, error };
  },

  create: async (complaintData) => {
    const { data, error } = await supabase
      .from("complaints")
      .insert([complaintData])
      .select()
      .single();
    return { data, error };
  },

  update: async (id, updates) => {
    const { data, error } = await supabase
      .from("complaints")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  },

  delete: async (id) => {
    const { error } = await supabase
      .from("complaints")
      .delete()
      .eq("id", id);
    return { error };
  },
};

// ============================================
// PEOPLE
// ============================================
export const peopleService = {
  getAll: async () => {
    const { data, error } = await supabase.from("people").select("*");
    return { data, error };
  },

  getOne: async (id) => {
    const { data, error } = await supabase
      .from("people")
      .select("*")
      .eq("id", id)
      .single();
    return { data, error };
  },

  create: async (personData) => {
    const { data, error } = await supabase
      .from("people")
      .insert([personData])
      .select()
      .single();
    return { data, error };
  },

  update: async (id, updates) => {
    const { data, error } = await supabase
      .from("people")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  },

  delete: async (id) => {
    const { error } = await supabase.from("people").delete().eq("id", id);
    return { error };
  },
};

// ============================================
// EVIDENCE
// ============================================
export const evidenceService = {
  getAll: async () => {
    const { data, error } = await supabase.from("evidence").select("*");
    return { data, error };
  },

  getByCaseId: async (caseId) => {
    const { data, error } = await supabase
      .from("evidence")
      .select("*")
      .eq("case_id", caseId);
    return { data, error };
  },

  create: async (evidenceData) => {
    const { data, error } = await supabase
      .from("evidence")
      .insert([evidenceData])
      .select()
      .single();
    return { data, error };
  },

  update: async (id, updates) => {
    const { data, error } = await supabase
      .from("evidence")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  },

  delete: async (id) => {
    const { error } = await supabase.from("evidence").delete().eq("id", id);
    return { error };
  },
};

// ============================================
// EVENTS
// ============================================
export const eventsService = {
  getAll: async () => {
    const { data, error } = await supabase.from("events").select("*");
    return { data, error };
  },

  getByCaseId: async (caseId) => {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("case_id", caseId);
    return { data, error };
  },

  create: async (eventData) => {
    const { data, error } = await supabase
      .from("events")
      .insert([eventData])
      .select()
      .single();
    return { data, error };
  },

  update: async (id, updates) => {
    const { data, error } = await supabase
      .from("events")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  },

  delete: async (id) => {
    const { error } = await supabase.from("events").delete().eq("id", id);
    return { error };
  },
};

// ============================================
// NOTES
// ============================================
export const notesService = {
  getAll: async () => {
    const { data, error } = await supabase.from("notes").select("*");
    return { data, error };
  },

  getByCaseId: async (caseId) => {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("case_id", caseId);
    return { data, error };
  },

  create: async (noteData) => {
    const { data, error } = await supabase
      .from("notes")
      .insert([noteData])
      .select()
      .single();
    return { data, error };
  },

  update: async (id, updates) => {
    const { data, error } = await supabase
      .from("notes")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  },

  delete: async (id) => {
    const { error } = await supabase.from("notes").delete().eq("id", id);
    return { error };
  },
};

// ============================================
// TASKS
// ============================================
export const tasksService = {
  getAll: async () => {
    const { data, error } = await supabase.from("tasks").select("*");
    return { data, error };
  },

  getByCaseId: async (caseId) => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("case_id", caseId);
    return { data, error };
  },

  create: async (taskData) => {
    const { data, error } = await supabase
      .from("tasks")
      .insert([taskData])
      .select()
      .single();
    return { data, error };
  },

  update: async (id, updates) => {
    const { data, error } = await supabase
      .from("tasks")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  },

  delete: async (id) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    return { error };
  },
};

// ============================================
// FINDINGS
// ============================================
export const findingsService = {
  getAll: async () => {
    const { data, error } = await supabase.from("findings").select("*");
    return { data, error };
  },

  getByCaseId: async (caseId) => {
    const { data, error } = await supabase
      .from("findings")
      .select("*")
      .eq("case_id", caseId);
    return { data, error };
  },

  create: async (findingData) => {
    const { data, error } = await supabase
      .from("findings")
      .insert([findingData])
      .select()
      .single();
    return { data, error };
  },

  update: async (id, updates) => {
    const { data, error } = await supabase
      .from("findings")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  },

  delete: async (id) => {
    const { error } = await supabase.from("findings").delete().eq("id", id);
    return { error };
  },
};

// ============================================
// VIOLATIONS
// ============================================
export const violationsService = {
  getAll: async () => {
    const { data, error } = await supabase.from("violations").select("*");
    return { data, error };
  },

  getOne: async (id) => {
    const { data, error } = await supabase
      .from("violations")
      .select("*")
      .eq("id", id)
      .single();
    return { data, error };
  },

  create: async (violationData) => {
    const { data, error } = await supabase
      .from("violations")
      .insert([violationData])
      .select()
      .single();
    return { data, error };
  },

  update: async (id, updates) => {
    const { data, error } = await supabase
      .from("violations")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  },

  delete: async (id) => {
    const { error } = await supabase
      .from("violations")
      .delete()
      .eq("id", id);
    return { error };
  },
};

// ============================================
// POLICIES
// ============================================
export const policiesService = {
  getAll: async () => {
    const { data, error } = await supabase.from("policies").select("*");
    return { data, error };
  },

  getOne: async (id) => {
    const { data, error } = await supabase
      .from("policies")
      .select("*")
      .eq("id", id)
      .single();
    return { data, error };
  },

  create: async (policyData) => {
    const { data, error } = await supabase
      .from("policies")
      .insert([policyData])
      .select()
      .single();
    return { data, error };
  },

  update: async (id, updates) => {
    const { data, error } = await supabase
      .from("policies")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  },

  delete: async (id) => {
    const { error } = await supabase.from("policies").delete().eq("id", id);
    return { error };
  },
};

// ============================================
// INVESTIGATION TEMPLATES
// ============================================
export const templatesService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from("investigation_templates")
      .select("*");
    return { data, error };
  },

  getOne: async (id) => {
    const { data, error } = await supabase
      .from("investigation_templates")
      .select("*")
      .eq("id", id)
      .single();
    return { data, error };
  },

  create: async (templateData) => {
    const { data, error } = await supabase
      .from("investigation_templates")
      .insert([templateData])
      .select()
      .single();
    return { data, error };
  },

  update: async (id, updates) => {
    const { data, error } = await supabase
      .from("investigation_templates")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  },

  delete: async (id) => {
    const { error } = await supabase
      .from("investigation_templates")
      .delete()
      .eq("id", id);
    return { error };
  },
};

// ============================================
// CUSTOM OPTIONS
// ============================================
export const customOptionsService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from("custom_options")
      .select("*");
    return { data, error };
  },

  getByCategory: async (category) => {
    const { data, error } = await supabase
      .from("custom_options")
      .select("*")
      .eq("category", category)
      .single();
    return { data, error };
  },

  create: async (optionData) => {
    const { data, error } = await supabase
      .from("custom_options")
      .insert([optionData])
      .select()
      .single();
    return { data, error };
  },

  update: async (id, updates) => {
    const { data, error } = await supabase
      .from("custom_options")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  },

  updateByCategory: async (category, options) => {
    // First try to update existing record
    const { data: existing } = await supabase
      .from("custom_options")
      .select("id")
      .eq("category", category)
      .single();

    if (existing) {
      // Update existing
      const { data, error } = await supabase
        .from("custom_options")
        .update({ options })
        .eq("category", category)
        .select()
        .single();
      return { data, error };
    } else {
      // Create new if doesn't exist
      const { data, error } = await supabase
        .from("custom_options")
        .insert([{ category, options }])
        .select()
        .single();
      return { data, error };
    }
  },


  delete: async (id) => {
    const { error } = await supabase
      .from("custom_options")
      .delete()
      .eq("id", id);
    return { error };
  },
};

// ============================================
// REAL-TIME SUBSCRIPTIONS
// ============================================
export const realtimeService = {
  subscribeToCases: (callback) => {
    return supabase
      .from("cases")
      .on("*", (payload) => {
        callback(payload);
      })
      .subscribe();
  },

  subscribeToEvidence: (callback) => {
    return supabase
      .from("evidence")
      .on("*", (payload) => {
        callback(payload);
      })
      .subscribe();
  },

  subscribeToTasks: (callback) => {
    return supabase
      .from("tasks")
      .on("*", (payload) => {
        callback(payload);
      })
      .subscribe();
  },

  subscribeToFindings: (callback) => {
    return supabase
      .from("findings")
      .on("*", (payload) => {
        callback(payload);
      })
      .subscribe();
  },

  unsubscribeAll: async () => {
    await supabase.removeAllChannels();
  },
};
