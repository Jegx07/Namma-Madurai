import { ref, push, set, get, onValue, update, remove, query, orderByChild, limitToLast } from "firebase/database";
import { database } from "../../firebase";

// Types
export interface Report {
  id?: string;
  userId: string;
  userName: string;
  type: "garbage" | "overflow" | "damage" | "other";
  description: string;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  status: "pending" | "in-progress" | "resolved";
  imageUrl?: string;
  createdAt: number;
  updatedAt: number;
}

export interface UserScore {
  id?: string;
  userId: string;
  userName: string;
  email: string;
  score: number;
  reportsSubmitted: number;
  lastUpdated: number;
}

export interface BinData {
  id?: string;
  location: {
    lat: number;
    lng: number;
  };
  fillLevel: "Low" | "Medium" | "Full";
  lastCollected: number;
  area: string;
}

// Reports
export const submitReport = async (report: Omit<Report, "id" | "createdAt" | "updatedAt">) => {
  const reportsRef = ref(database, "reports");
  const newReportRef = push(reportsRef);
  const reportData: Report = {
    ...report,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  await set(newReportRef, reportData);
  return newReportRef.key;
};

export const getReports = async (): Promise<Report[]> => {
  const reportsRef = ref(database, "reports");
  const snapshot = await get(reportsRef);
  if (!snapshot.exists()) return [];
  
  const data = snapshot.val();
  return Object.keys(data).map(key => ({
    id: key,
    ...data[key],
  }));
};

export const subscribeToReports = (callback: (reports: Report[]) => void) => {
  const reportsRef = ref(database, "reports");
  return onValue(reportsRef, (snapshot) => {
    if (!snapshot.exists()) {
      callback([]);
      return;
    }
    const data = snapshot.val();
    const reports = Object.keys(data).map(key => ({
      id: key,
      ...data[key],
    }));
    callback(reports);
  });
};

export const updateReportStatus = async (reportId: string, status: Report["status"]) => {
  const reportRef = ref(database, `reports/${reportId}`);
  await update(reportRef, { 
    status, 
    updatedAt: Date.now() 
  });
};

export const deleteReport = async (reportId: string) => {
  const reportRef = ref(database, `reports/${reportId}`);
  await remove(reportRef);
};

// User Scores / Leaderboard
export const updateUserScore = async (userId: string, userName: string, email: string, additionalPoints: number = 10) => {
  const userScoreRef = ref(database, `userScores/${userId}`);
  const snapshot = await get(userScoreRef);
  
  if (snapshot.exists()) {
    const current = snapshot.val();
    await update(userScoreRef, {
      score: current.score + additionalPoints,
      reportsSubmitted: current.reportsSubmitted + 1,
      lastUpdated: Date.now(),
    });
  } else {
    await set(userScoreRef, {
      userId,
      userName,
      email,
      score: additionalPoints,
      reportsSubmitted: 1,
      lastUpdated: Date.now(),
    });
  }
};

export const getLeaderboard = async (limit: number = 10): Promise<UserScore[]> => {
  const scoresRef = ref(database, "userScores");
  const snapshot = await get(scoresRef);
  
  if (!snapshot.exists()) return [];
  
  const data = snapshot.val();
  const scores = Object.keys(data).map(key => ({
    id: key,
    ...data[key],
  }));
  
  // Sort by score descending
  return scores.sort((a, b) => b.score - a.score).slice(0, limit);
};

export const subscribeToLeaderboard = (callback: (scores: UserScore[]) => void, limit: number = 10) => {
  const scoresRef = ref(database, "userScores");
  return onValue(scoresRef, (snapshot) => {
    if (!snapshot.exists()) {
      callback([]);
      return;
    }
    const data = snapshot.val();
    const scores = Object.keys(data).map(key => ({
      id: key,
      ...data[key],
    }));
    callback(scores.sort((a, b) => b.score - a.score).slice(0, limit));
  });
};

export const getUserScore = async (userId: string): Promise<UserScore | null> => {
  const userScoreRef = ref(database, `userScores/${userId}`);
  const snapshot = await get(userScoreRef);
  
  if (!snapshot.exists()) return null;
  return { id: userId, ...snapshot.val() };
};

// Bins
export const getBins = async (): Promise<BinData[]> => {
  const binsRef = ref(database, "bins");
  const snapshot = await get(binsRef);
  
  if (!snapshot.exists()) return [];
  
  const data = snapshot.val();
  return Object.keys(data).map(key => ({
    id: key,
    ...data[key],
  }));
};

export const subscribeToBins = (callback: (bins: BinData[]) => void) => {
  const binsRef = ref(database, "bins");
  return onValue(binsRef, (snapshot) => {
    if (!snapshot.exists()) {
      callback([]);
      return;
    }
    const data = snapshot.val();
    const bins = Object.keys(data).map(key => ({
      id: key,
      ...data[key],
    }));
    callback(bins);
  });
};

export const updateBinFillLevel = async (binId: string, fillLevel: BinData["fillLevel"]) => {
  const binRef = ref(database, `bins/${binId}`);
  await update(binRef, { fillLevel });
};
