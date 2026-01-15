
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  orderBy,
  Timestamp,
  updateDoc
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL
} from "firebase/storage";
import { db, storage } from "./firebase";
import { Task, TaskStatus, TaskType, Project, Folder } from "../types";

// --- 1. TYPE DEFINITIONS (The Data Model) ---

// (Moved to types.ts)
// export type TaskStatus = 'todo' | 'in_progress' | 'done';
// export type TaskType = 'competitor_audit' | 'lighthouse_speed' | 'ux_review';

export interface PageFolder {
  id: string; // e.g., "homepage"
  name: string; // "Homepage"
  projectId: string;
  lastUpdated: Timestamp;
}

// --- 2. HELPER: The "Clean Name" Generator ---
// Converts "My Real Estate Page!" -> "my-real-estate-page"
const createSlug = (text: string) => {
  return text
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');
};

// --- 3. THE SERVICE LAYER ---

export const DBService = {

  /**
   * CREATE NEW PROJECT
   * Ensures the ID is readable: "Skyline Towers" -> ID: "skyline-towers"
   */
  createProject: async (projectName: string, baseUrl?: string) => {
    const slug = createSlug(projectName);
    const projectRef = doc(db, "projects", slug);

    // Use merge to prevent overwriting creation date if it exists
    await setDoc(projectRef, {
      id: slug,
      name: projectName,
      baseUrl: baseUrl || "",
      createdAt: Timestamp.now(),
    }, { merge: true });

    return slug; // Return the clean ID
  },

  /**
   * CREATE PAGE FOLDER
   * Organized under the Project
   */
  createPage: async (projectId: string, pageName: string, pageUrl?: string) => {
    const pageSlug = createSlug(pageName);
    const pageRef = doc(db, `projects/${projectId}/pages`, pageSlug);

    await setDoc(pageRef, {
      id: pageSlug,
      name: pageName,
      url: pageUrl || "",
      projectId,
      lastUpdated: Timestamp.now(),
    }, { merge: true });

    return pageSlug;
  },

  /**
   * UPLOAD FILE WITH CLEAN PATH
   * Force naming convention: projects/{project}/{page}/{date}_{filename}
   */
  uploadCleanFile: async (
    file: File,
    projectId: string,
    pageId: string,
    label: string // e.g. "competitor-screenshot"
  ) => {
    // 1. Format Date: "2024-01-15"
    const dateStr = new Date().toISOString().split('T')[0];

    // 2. Build Readable Path
    // Result: projects/skyline/homepage/2024-01-15_competitor-screenshot.png
    const cleanPath = `projects/${projectId}/${pageId}/${dateStr}_${label}_${file.name}`;

    const storageRef = ref(storage, cleanPath);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  },

  /**
   * CREATE NEW TASK (The Core Unit of Work)
   * This saves the analysis, the status, and links it to the page history.
   */
  createTask: async (
    projectId: string,
    pageId: string,
    taskData: Partial<Task>
  ) => {
    // Generate a readable ID based on date and type
    // e.g., "2024-01-15_lighthouse-audit"
    const dateStr = new Date().toISOString().split('T')[0];
    const typeSlug = taskData.type || 'generic-task';
    const autoId = doc(collection(db, 'temp')).id; // Random suffix for uniqueness
    const cleanTaskId = `${dateStr}_${typeSlug}_${autoId.substring(0, 4)}`;

    const taskRef = doc(db, `projects/${projectId}/pages/${pageId}/tasks`, cleanTaskId);

    const newTask: Task = {
      id: cleanTaskId,
      title: taskData.title || "New Optimization Task",
      status: taskData.status || 'todo',
      type: taskData.type || 'ux_review',
      date: Timestamp.now(),
      projectId,
      pageId,
      assets: taskData.assets || {},
      aiResult: taskData.aiResult || undefined,
    };

    await setDoc(taskRef, newTask);

    // Update parent Page's "lastUpdated" timestamp
    await updateDoc(doc(db, `projects/${projectId}/pages`, pageId), {
      lastUpdated: Timestamp.now()
    });

    return cleanTaskId;
  },

  /**
   * UPDATE STATUS
   * Toggle between: To Do (Gray) -> In Progress (Blue) -> Done (Green)
   */
  updateTaskStatus: async (projectId: string, pageId: string, taskId: string, status: TaskStatus) => {
    const taskRef = doc(db, `projects/${projectId}/pages/${pageId}/tasks`, taskId);
    await updateDoc(taskRef, { status });
  },

  /**
   * GET HISTORY (For the Sidebar/Graph)
   * Fetches all tasks for a specific page, ordered by date.
   */
  getPageHistory: async (projectId: string, pageId: string) => {
    const tasksRef = collection(db, `projects/${projectId}/pages/${pageId}/tasks`);
    const q = query(tasksRef, orderBy("date", "desc"));

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as Task);
  },

  /**
   * GET PROJECT PAGES
   * Used to render the Sidebar: Project -> List of Pages
   */
  getProjectPages: async (projectId: string) => {
    const pagesRef = collection(db, `projects/${projectId}/pages`);
    const q = query(pagesRef, orderBy("lastUpdated", "desc"));

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as PageFolder);
  }
};
