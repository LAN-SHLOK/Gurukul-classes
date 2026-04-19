import * as z from "zod";

// --- Base Fields ---
const email = z.string().email("Invalid email address");
const phone = z.string().regex(/^\d{10}$/, "Mobile number must be exactly 10 digits");
const pass = z.string().min(8, "Password must be at least 8 characters").max(32, "Password too long");

// --- Auth ---
export const loginSchema = z.object({
  email: email,
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: email,
  mobile: phone,
  gender: z.string().min(1, "Please select gender"),
  password: pass,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// --- Public Forms ---
export const inquirySchema = z.object({
  firstName: z.string().min(2, "First name required"),
  lastName: z.string().min(1, "Last name required"),
  email: email,
  className: z.string().min(1, "Please select a class"),
  message: z.string().optional(),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Name required"),
  email: email,
  message: z.string().min(5, "Message must be at least 5 characters"),
});

export const facultyJoinSchema = z.object({
  name: z.string().min(2, "Name required"),
  email: email,
  phone: phone,
  position: z.string().min(1, "Position required"),
  experience: z.string().min(1, "Experience required"),
  qualification: z.string().min(1, "Qualification required"),
  subjects: z.string().min(1, "Subjects required"),
  message: z.string().optional(),
  resume: z.any().optional(), // Validated separately in component
});

// --- Admin Content ---
export const adminFacultySchema = z.object({
  name: z.string().min(2, "Name required"),
  role: z.string().min(2, "Role/Subject required"),
  expertise: z.string().min(2, "Expertise required"),
  image: z.string().url("Invalid image URL"),
  bio: z.string().optional(),
  linkedin: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
});

export const adminEventSchema = z.object({
  title: z.string().min(2, "Title required"),
  date: z.string().min(1, "Date required"),
  location: z.string().optional(),
  category: z.string().min(2, "Category required"),
  image: z.string().url("Invalid image URL"),
  description: z.string().optional(),
});

export const adminTopperSchema = z.object({
  name: z.string().min(2, "Name required"),
  score: z.string().min(1, "Score required"),
  year: z.string().regex(/^\d{4}$/, "Valid year required"),
  exam: z.string().min(2, "Exam required"),
  image: z.string().url("Invalid image URL"),
  achievement: z.string().optional(),
});

export const adminNoteSchema = z.object({
  title: z.string().min(2, "Title required"),
  subject: z.string().min(2, "Subject required"),
  standard: z.string().min(1, "Standard required"),
  file_url: z.string().url("Invalid file URL or upload failed"),
});
