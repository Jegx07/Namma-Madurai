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
    try {
      const { data, error } = await supabase
        .from('Report 1')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching 'Report 1':", error);
        throw error;
      }

      console.log("Fetched 'Report 1' Data:", data);

      // Parse coordinates as numbers for map rendering
      return data?.map(report => ({
        ...report,
        latitude: parseFloat(report.latitude as unknown as string) || 0,
        longitude: parseFloat(report.longitude as unknown as string) || 0
      })) || [];
    } catch (error) {
      console.error("Exception in supabaseReports.getAll:", error);
      return [];
    }
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('Report 1')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async create(report: Database['public']['Tables']['reports']['Insert']) {
    const { data, error } = await supabase
      .from('Report 1')
      .insert(report)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateStatus(id: string, status: 'pending' | 'in-progress' | 'resolved') {
    const { data, error } = await supabase
      .from('Report 1')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('Report 1')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // Real-time subscription
  subscribeToChanges(callback: (payload: any) => void) {
    return supabase
      .channel('reports-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Report 1' }, callback)
      .subscribe();
  },
};

// User Scores / Leaderboard
export const supabaseUserScores = {
  async getLeaderboard(limit = 10) {
    try {
      const { data, error } = await supabase
        .from('User Dashboard')
        .select('*')
        .order('score', { ascending: false })
        .limit(limit);

      if (error) {
        console.error("Error fetching 'User Dashboard' leaderboard:", error);
        throw error;
      }

      console.log("Fetched 'User Dashboard' Leaderboard:", data);
      return data || [];
    } catch (error) {
      console.error("Exception in supabaseUserScores.getLeaderboard:", error);
      return [];
    }
  },

  async getUserScore(userId: string) {
    const { data, error } = await supabase
      .from('User Dashboard')
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
        .from('User Dashboard')
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
        .from('User Dashboard')
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
      .on('postgres_changes', { event: '*', schema: 'public', table: 'User Dashboard' }, callback)
      .subscribe();
  },
};

// Bins
export const supabaseBins = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('Bin Data')
        .select('*');

      if (error) {
        console.error("Error fetching 'Bin Data':", error);
        throw error;
      }

      console.log("Fetched 'Bin Data':", data);

      // Map Bin_ID to id and parse coordinates as numbers
      return data?.map(bin => ({
        ...bin,
        id: bin.Bin_ID,
        latitude: parseFloat(bin.latitude as unknown as string) || 0,
        longitude: parseFloat(bin.longitude as unknown as string) || 0
      })) || [];
    } catch (error) {
      console.error("Exception in supabaseBins.getAll:", error);
      return [];
    }
  },

  async updateFillLevel(id: string, fillLevel: 'Low' | 'Medium' | 'Full') {
    const { data, error } = await supabase
      .from('Bin Data')
      .update({ fill_level: fillLevel })
      .eq('Bin_ID', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Real-time subscription
  subscribeToChanges(callback: (payload: any) => void) {
    return supabase
      .channel('bins-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Bin Data' }, callback)
      .subscribe();
  },
};

// Workers
export const supabaseWorkers = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('Workers')
        .select('*');

      if (error) {
        console.error("Error fetching 'Workers':", error);
        throw error;
      }

      console.log("Fetched 'Workers' Data:", data);

      // Map name to id if needed
      return data?.map(worker => ({ ...worker, id: worker.name })) || [];
    } catch (error) {
      console.error("Exception in supabaseWorkers.getAll:", error);
      return [];
    }
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('Workers')
      .select('*')
      .eq('name', id)
      .single();
    if (error) throw error;
    return data;
  },

  async updateStatus(id: string, status: 'active' | 'on-leave' | 'inactive') {
    const { data, error } = await supabase
      .from('Workers')
      .update({ status })
      .eq('name', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Real-time subscription
  subscribeToChanges(callback: (payload: any) => void) {
    return supabase
      .channel('workers-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Workers' }, callback)
      .subscribe();
  },
};

