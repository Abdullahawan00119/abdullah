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
      console.log("🔄 Attempting to fetch from Firestore...");
      console.log("📡 Database path:", db.toJSON());
      
      // Use Promise.all for parallel requests
      const [metaSnap, skillsSnap, experiencesSnap, projectsSnap, testimonialsSnap, visitorSnap] = await Promise.all([
        getDoc(doc(db, "portfolioMeta", META_DOC_ID)),
        getDocs(collection(db, "skills")),
        getDocs(collection(db, "experiences")),
        getDocs(collection(db, "projects")),
        getDocs(collection(db, "testimonials")),
        getDoc(doc(db, "visitor", "count"))
      ]);
      
      console.log("✅ Firestore read successful!");
      console.log("📊 Meta exists:", metaSnap.exists());
      console.log("📊 Skills count:", skillsSnap.size);
      console.log("📊 Experiences count:", experiencesSnap.size);
      console.log("📊 Projects count:", projectsSnap.size);

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
      // Return demo data when Firebase fails - this allows the portfolio to work
      return {
        meta: {
          name: "Abdullah",
          title: "Full Stack Developer",
          bio: "Passionate developer building amazing web experiences",
          image_url: "https://picsum.photos/seed/abdullah/800/800",
          cv_url: ""
        },
        skills: [
          { id: "1", name: "React", level: 90, category: "frontend" },
          { id: "2", name: "TypeScript", level: 85, category: "frontend" },
          { id: "3", name: "Node.js", level: 80, category: "backend" },
          { id: "4", name: "Firebase", level: 75, category: "backend" },
          { id: "5", name: "Python", level: 70, category: "backend" },
          { id: "6", name: "Git", level: 85, category: "tools" },
          { id: "7", name: "Docker", level: 65, category: "tools" },
          { id: "8", name: "CSS/Tailwind", level: 90, category: "frontend" },
          { id: "9", name: "MongoDB", level: 72, category: "backend" }
        ],
        experiences: [
          { id: "1", company: "Tech Company", role: "Full Stack Developer", year: "2023-Present", description: "Building web applications" },
          { id: "2", company: "Startup", role: "Frontend Developer", year: "2021-2023", description: "Creating user interfaces" }
        ],
        projects: [
          { id: "1", title: "Portfolio Website", description: "Personal portfolio built with React", image: "https://picsum.photos/seed/project1/600/400", link: "#" },
          { id: "2", title: "E-commerce App", description: "Online shopping platform", image: "https://picsum.photos/seed/project2/600/400", link: "#" },
          { id: "3", title: "Task Manager", description: "Productivity application", image: "https://picsum.photos/seed/project3/600/400", link: "#" }
        ],
        testimonials: [
          { id: "1", name: "Client Name", text: "Great work!", image: "https://picsum.photos/seed/client1/100/100" }
        ],
        visitorCount: 0,
        _isDemo: true
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
        // Use setDoc with merge to create the document if it doesn't exist
        await setDoc(visitorRef, { count: increment(1) }, { merge: true });
        console.log("✅ Visitor count incremented");
      } catch (error: any) {
        // Silently handle permission errors - visitor count is not critical
        console.warn("⚠️ Visitor count increment failed:", error?.message || "Unknown error");
      }
    }, 2000); // Only update visitor count after 2 seconds of no new visits
  },



  async uploadToCloudinary(file: File) {
    if (!file) {
      throw new Error("No file selected");
    }

    const fileSize = file.size / (1024 * 1024);
    if (fileSize > 10) {
      throw new Error(`File size (${fileSize.toFixed(1)}MB) exceeds 10MB limit`);
    }

    // Log current Cloudinary configuration for debugging
    console.log('☁️ Cloudinary config:', {
      url: import.meta.env.VITE_CLOUDINARY_URL,
      preset: import.meta.env.VITE_CLOUDINARY_PRESET ? '✓ set' : '✗ missing',
    });

    const cloudinaryUrl = import.meta.env.VITE_CLOUDINARY_URL;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_PRESET;
    
    if (!cloudinaryUrl) {
      throw new Error("Cloudinary URL is not configured. Please add VITE_CLOUDINARY_URL to your .env.local file.");
    }
    
    if (!uploadPreset) {
      throw new Error("Cloudinary upload preset is not configured. Please add VITE_CLOUDINARY_PRESET to your .env.local file.");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    // Determine file type
    const isImage = file.type.startsWith("image/");
    const isPDF = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    
    console.log("📤 Uploading to Cloudinary...", { 
      fileName: file.name, 
      size: file.size, 
      type: file.type,
      isImage,
      isPDF
    });

    // For PDFs, ALWAYS use resource_type=raw to ensure they're stored as raw files
    // This makes them accessible via /raw/upload/ URLs which work properly with fl_attachment
    if (isPDF) {
      formData.append("resource_type", "raw");
      console.log("📤 Using resource_type=raw for PDF file");
    } else if (!isImage) {
      // For other non-image files, use resource_type=auto
      formData.append("resource_type", "auto");
      console.log("📤 Using resource_type=auto for non-image file");
    }

    // Add folder parameter to organize uploads
    formData.append("folder", "portfolio");

    console.log("📧 Sending to:", cloudinaryUrl);
    
    const response = await fetch(cloudinaryUrl, { 
      method: "POST", 
      body: formData 
    });
    
    if (!response.ok) {
      const text = await response.text();
      console.error("❌ Cloudinary error response:", response.status, text);
      if (response.status === 401) {
        throw new Error("Cloudinary authentication failed. Check your upload preset configuration in .env.local");
      } else if (response.status === 400) {
        // Try with explicit resource_type=raw for PDFs
        if (isPDF) {
          console.log("📤 Retrying PDF upload with resource_type=raw...");
          const retryFormData = new FormData();
          retryFormData.append("file", file);
          retryFormData.append("upload_preset", uploadPreset);
          retryFormData.append("resource_type", "raw");
          retryFormData.append("folder", "portfolio");
          
          const retryResponse = await fetch(cloudinaryUrl, { 
            method: "POST", 
            body: retryFormData 
          });
          
          if (retryResponse.ok) {
            const data = await retryResponse.json();
            console.log("✅ PDF upload successful (raw)!", data);
            return data.secure_url;
          }
        }
        throw new Error("Invalid file or upload configuration. Ensure your preset allows PDF uploads.");
      }
      throw new Error(`Upload failed (${response.status}): ${response.statusText}`);
    }

    const data = await response.json();
    console.log("✅ Upload successful! Full response:", data);
    
    if (!data.secure_url) {
      throw new Error("Upload successful but no URL returned from Cloudinary");
    }
    
    // Log the resource type for debugging
    console.log("📤 File stored as resource_type:", data.resource_type);
    
    if (isPDF && data.resource_type !== "raw" && data.resource_type !== "image") {
      console.warn("⚠️ Cloudinary stored the PDF as:", data.resource_type);
    }
    
    return data.secure_url;
  }

};
