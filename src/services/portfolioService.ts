import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  addDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  increment 
} from "firebase/firestore";
import { db } from "../firebase";

const META_DOC_ID = "main";

// Simple in-memory cache with timeout
let cacheData: any = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Debounce visitor count to avoid too many writes
let visitorDebounceTimer: any = null;

export const portfolioService = {
  // Check if cache is still valid
  isCacheValid() {
    return cacheData && (Date.now() - cacheTimestamp) < CACHE_DURATION;
  },

  // Clear cache
  clearCache() {
    cacheData = null;
    cacheTimestamp = 0;
  },

  async getPortfolioData() {
    // Return cached data if still valid
    if (this.isCacheValid()) {
      console.log("📦 Using cached portfolio data");
      return cacheData;
    }

    try {
      // Use Promise.all for parallel requests
      const [metaSnap, skillsSnap, experiencesSnap, projectsSnap, testimonialsSnap, visitorSnap] = await Promise.all([
        getDoc(doc(db, "portfolioMeta", META_DOC_ID)),
        getDocs(collection(db, "skills")),
        getDocs(collection(db, "experiences")),
        getDocs(collection(db, "projects")),
        getDocs(collection(db, "testimonials")),
        getDoc(doc(db, "visitor", "count"))
      ]);

      cacheData = {
        meta: metaSnap.exists() ? metaSnap.data() : {},
        skills: skillsSnap.docs.map(doc => {
          const skillData = { id: doc.id, ...doc.data() };
          if (!skillData.id) {
            console.error('❌ Skill without ID detected:', skillData);
          }
          console.log('🔧 Mapped skill:', skillData);
          return skillData;
        }).filter(skill => skill && skill.id), // Filter out any skills without IDs
        experiences: experiencesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        projects: projectsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        testimonials: testimonialsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        visitorCount: visitorSnap.exists() ? visitorSnap.data().count : 0
      };
      console.log('✅ Cache data prepared with', cacheData.skills.length, 'skills');
      cacheTimestamp = Date.now();
      return cacheData;
    } catch (error) {
      console.error("Error fetching portfolio data:", error);
      // Return empty cache on error instead of throwing
      return {
        meta: {},
        skills: [],
        experiences: [],
        projects: [],
        testimonials: [],
        visitorCount: 0
      };
    }
  },

  async updateMeta(data: any) {
    const { id, ...updateData } = data;
    const metaRef = doc(db, "portfolioMeta", META_DOC_ID);
    await setDoc(metaRef, updateData, { merge: true });
  },

  async addSkill(skill: any) {
    const { id, ...data } = skill;
    const result = await addDoc(collection(db, "skills"), data);
    this.clearCache();
    return result;
  },

  async deleteSkill(id: string) {
    if (!id) {
      console.warn("portfolioService.deleteSkill called with invalid id:", id);
      throw new Error("Invalid skill id");
    }

    await deleteDoc(doc(db, "skills", id));
    this.clearCache();
  },

  async updateSkill(id: string, data: any) {
    const { id: _, ...updateData } = data;
    await updateDoc(doc(db, "skills", id), updateData);
    this.clearCache();
  },

  async addExperience(exp: any) {
    const { id, ...data } = exp;
    const result = await addDoc(collection(db, "experiences"), data);
    this.clearCache();
    return result;
  },

  async updateExperience(id: string, data: any) {
    const { id: _, ...updateData } = data;
    await updateDoc(doc(db, "experiences", id), updateData);
    this.clearCache();
  },

  async deleteExperience(id: string) {
    if (!id) {
      console.warn("portfolioService.deleteExperience called with invalid id:", id);
      throw new Error("Invalid experience id");
    }
    await deleteDoc(doc(db, "experiences", id));
    this.clearCache();
  },

  async addProject(project: any) {
    const { id, ...data } = project;
    const result = await addDoc(collection(db, "projects"), data);
    this.clearCache();
    return result;
  },

  async deleteProject(id: string) {
    if (!id) {
      console.warn("portfolioService.deleteProject called with invalid id:", id);
      throw new Error("Invalid project id");
    }
    await deleteDoc(doc(db, "projects", id));
    this.clearCache();
  },

  async updateProject(id: string, data: any) {
    const { id: _, ...updateData } = data;
    await updateDoc(doc(db, "projects", id), updateData);
    this.clearCache();
  },

  async addTestimonial(testimonial: any) {
    const { id, ...data } = testimonial;
    const result = await addDoc(collection(db, "testimonials"), data);
    this.clearCache();
    return result;
  },

  async updateTestimonial(id: string, data: any) {
    const { id: _, ...updateData } = data;
    await updateDoc(doc(db, "testimonials", id), updateData);
    this.clearCache();
  },

  async deleteTestimonial(id: string) {
    if (!id) {
      console.warn("portfolioService.deleteTestimonial called with invalid id:", id);
      throw new Error("Invalid testimonial id");
    }
    await deleteDoc(doc(db, "testimonials", id));
    this.clearCache();
  },

  async sendMessage(message: any) {
    return await addDoc(collection(db, "messages"), {
      ...message,
      createdAt: new Date().toISOString(),
      status: "unread"
    });
  },

  async getMessages() {
    const messagesSnap = await getDocs(collection(db, "messages"));
    return messagesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async deleteMessage(id: string) {
    if (!id) {
      console.warn("portfolioService.deleteMessage called with invalid id:", id);
      throw new Error("Invalid message id");
    }
    await deleteDoc(doc(db, "messages", id));
  },

  async updateMessageStatus(id: string, status: string) {
    await updateDoc(doc(db, "messages", id), { status });
  },

  async incrementVisitor() {
    // Debounce visitor count updates to reduce Firebase writes
    if (visitorDebounceTimer) clearTimeout(visitorDebounceTimer);
    
    visitorDebounceTimer = setTimeout(async () => {
      try {
        const visitorRef = doc(db, "visitor", "count");
        await setDoc(visitorRef, { count: increment(1) }, { merge: true });
      } catch (error) {
        console.error("Error incrementing visitor:", error);
      }
    }, 2000); // Only update visitor count after 2 seconds of no new visits
  },



  async uploadToCloudinary(file: File) {
    // Prefer server-side upload (signed) so we can control access_mode correctly.
    try {
      if (!file) {
        throw new Error("No file selected");
      }

      const fileSize = file.size / (1024 * 1024);
      if (fileSize > 10) {
        throw new Error(`File size (${fileSize.toFixed(1)}MB) exceeds 10MB limit`);
      }

      console.log("📤 Uploading to server proxy...");
      const proxyForm = new FormData();
      proxyForm.append("file", file);
      const token = localStorage.getItem("token");
      const proxyRes = await fetch("/api/upload", { 
        method: "POST", 
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: proxyForm
      });
      if (proxyRes.ok) {
        const json = await proxyRes.json();
        console.log("✅ Server upload returned:", json);
        if (json.url) return json.url;
      } else {
        const txt = await proxyRes.text();
        console.warn("Server upload failed, falling back to client direct", proxyRes.status, txt);
      }
    } catch (err) {
      console.warn("Server proxy upload error, will fallback:", err);
    }

    // Fallback to direct unsigned upload (unchanged old behavior)
    console.log("📤 Uploading to Cloudinary...", { fileName: file.name, size: file.size, type: file.type });

    const cloudinaryUrl = import.meta.env.VITE_CLOUDINARY_URL;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_PRESET;
    if (!cloudinaryUrl || !uploadPreset) {
      throw new Error("Cloudinary configuration missing. Check VITE_CLOUDINARY_URL and VITE_CLOUDINARY_PRESET in .env.local");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      formData.append("resource_type", "raw");
      console.log("📤 Forcing resource_type=raw for non-image file", file.type);
    }

    console.log("📧 Sending to:", cloudinaryUrl);
    const response = await fetch(cloudinaryUrl, { method: "POST", body: formData });
    if (!response.ok) {
      const text = await response.text();
      console.error("❌ Cloudinary error response:", response.status, text);
      if (response.status === 401) {
        throw new Error("Cloudinary authentication failed. Check your upload preset configuration in .env.local");
      } else if (response.status === 400) {
        throw new Error("Invalid file or upload configuration. Ensure your preset allows PDF uploads.");
      }
      throw new Error(`Upload failed (${response.status}): ${response.statusText}`);
    }

    const data = await response.json();
    console.log("✅ Upload successful! Full response:", data);
    if (!data.secure_url) {
      throw new Error("Upload successful but no URL returned from Cloudinary");
    }
    if (file.type === "application/pdf" && data.resource_type !== "raw") {
      console.warn("⚠️ Cloudinary stored the PDF as", data.resource_type);
    }
    return data.secure_url;
  }
};
