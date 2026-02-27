import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vzizefrkiwewfibmenxg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6aXplZnJraXdld2ZpYm1lbnhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMDc3NDQsImV4cCI6MjA4Nzc4Mzc0NH0.8bcnwNN1H0hK4P-_VNdHJlzY36Xu_07ou-9xyPUhTIQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types - expand these as you create tables
export interface Database {
  public: {
    Tables: {
      reports: {
        Row: {
          id: string;
          user_id: string;
          user_name: string;
          type: 'garbage' | 'overflow' | 'damage' | 'other';
          description: string;
          latitude: number;
          longitude: number;
          address: string | null;
          status: 'pending' | 'in-progress' | 'resolved';
          image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['reports']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['reports']['Insert']>;
      };
      user_scores: {
        Row: {
          id: string;
          user_id: string;
          user_name: string;
          email: string;
          score: number;
          reports_submitted: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['user_scores']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['user_scores']['Insert']>;
      };
      bins: {
        Row: {
          id: string;
          latitude: number;
          longitude: number;
          fill_level: 'Low' | 'Medium' | 'Full';
          last_collected: string | null;
          area: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['bins']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['bins']['Insert']>;
      };
      workers: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          area: string;
          status: 'active' | 'on-leave' | 'inactive';
          tasks_completed: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['workers']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['workers']['Insert']>;
      };
    };
  };
}

// Helper functions for Supabase operations

// Reports
export const supabaseReports = {
  async getAll() {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async create(report: Database['public']['Tables']['reports']['Insert']) {
    const { data, error } = await supabase
      .from('reports')
      .insert(report)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateStatus(id: string, status: 'pending' | 'in-progress' | 'resolved') {
    const { data, error } = await supabase
      .from('reports')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('reports')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // Real-time subscription
  subscribeToChanges(callback: (payload: any) => void) {
    return supabase
      .channel('reports-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reports' }, callback)
      .subscribe();
  },
};

// User Scores / Leaderboard
export const supabaseUserScores = {
  async getLeaderboard(limit = 10) {
    const { data, error } = await supabase
      .from('user_scores')
      .select('*')
      .order('score', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data;
  },

  async getUserScore(userId: string) {
    const { data, error } = await supabase
      .from('user_scores')
      .select('*')
      .eq('user_id', userId)
      .single();
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
    return data;
  },

  async upsertScore(userId: string, userName: string, email: string, additionalPoints = 10) {
    const existing = await this.getUserScore(userId);
    
    if (existing) {
      const { data, error } = await supabase
        .from('user_scores')
        .update({
          score: existing.score + additionalPoints,
          reports_submitted: existing.reports_submitted + 1,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from('user_scores')
        .insert({
          user_id: userId,
          user_name: userName,
          email,
          score: additionalPoints,
          reports_submitted: 1,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    }
  },

  // Real-time subscription
  subscribeToChanges(callback: (payload: any) => void) {
    return supabase
      .channel('user-scores-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_scores' }, callback)
      .subscribe();
  },
};

// Bins
export const supabaseBins = {
  async getAll() {
    const { data, error } = await supabase
      .from('bins')
      .select('*');
    if (error) throw error;
    return data;
  },

  async updateFillLevel(id: string, fillLevel: 'Low' | 'Medium' | 'Full') {
    const { data, error } = await supabase
      .from('bins')
      .update({ fill_level: fillLevel })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Real-time subscription
  subscribeToChanges(callback: (payload: any) => void) {
    return supabase
      .channel('bins-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bins' }, callback)
      .subscribe();
  },
};

// Workers
export const supabaseWorkers = {
  async getAll() {
    const { data, error } = await supabase
      .from('workers')
      .select('*');
    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('workers')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async updateStatus(id: string, status: 'active' | 'on-leave' | 'inactive') {
    const { data, error } = await supabase
      .from('workers')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Real-time subscription
  subscribeToChanges(callback: (payload: any) => void) {
    return supabase
      .channel('workers-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'workers' }, callback)
      .subscribe();
  },
};
